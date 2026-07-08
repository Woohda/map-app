/**
 * @module app/composables/useAttachmentUpload
 * @fileoverview Composable для управления загрузкой и удалением вложений через UploadThing
 * @description
 * Этот модуль реализует функциональность загрузки файлов с использованием UploadThing сервиса.
 * Поддерживает загрузку до 5 файлов, отслеживание прогресса, удаление и переупорядочивание вложений.
 * ---
 * ### Логика работы:
 * 1. `Upload Process`: Использует useUploadThing для загрузки файлов на сервер UploadThing
 * 2. `File Renaming`: Перед загрузкой файлы переименовываются с уникальными UUID для предотвращения конфликтов
 * 3. `Progress Tracking`: Отслеживает прогресс загрузки через uploadProgress ref
 * 4. `Validation`: Проверяет лимит файлов (максимум 5) и предотвращает одновременную загрузку
 * 5. `Cleanup`: Поддерживает удаление файлов с сервера через API endpoint
 *
 * ### API:
 * - `startUpload(files)`: Начинает загрузку файлов с валидацией лимитов
 * - `removeAttachment(id)`: Удаляет вложение по ID (включая удаление с сервера)
 * - `reorderAttachments(newOrder)`: Изменяет порядок вложений
 * - `clearAttachments()`: Очищает список вложений без удаления с сервера
 * - `resetAttachments()`: Полный сброс с удалением всех файлов с сервера
 *
 * ### Особенности:
 * - Автоматическое переименование файлов с UUID
 * - Toast уведомления об успешной загрузке и ошибках
 * - Защита от превышения лимита файлов (5 штук)
 * - Отслеживание состояния загрузки (isUploading, uploadProgress)
 * - Интеграция с UploadThing API для удаления файлов
 *
 * ### Ограничения:
 * - Максимум 5 файлов одновременно
 * - Блокировка повторной загрузки во время активной загрузки
 *
 * ### Примечания:
 * - Использует crypto.randomUUID() для генерации уникальных имен
 * - При ошибке загрузки неудачные вложения автоматически удаляются из списка
 * - Файлы удаляются с сервера через /api/uploadthing/delete endpoint
 *
 * ### Зависимости:
 * - UploadAttachment из ~lib/types/upload
 * - useUploadThing из ~lib/uploadthing
 * - useToast из ~/composables/use-toast
 */

import type { UploadAttachment } from '~lib/types/upload';

import { useUploadThing } from '~lib/uploadthing';

import { useToast } from '~/composables/use-toast';

export function useAttachmentUpload() {
  const { toast } = useToast();

  const attachments = ref<UploadAttachment[]>([]);
  const uploadProgress = ref<number>();

  const { startUpload, isUploading } = useUploadThing('attachments', {
    onBeforeUploadBegin: (files) => {
      isUploading.value = true;
      const renamedFiles = files.map((file) => {
        const extension = file.name.split('.').pop();
        const imageId = crypto.randomUUID();
        const newName = `attachment_${imageId}.${extension}`;
        return new File([file], newName, {
          type: file.type,
        });
      });

      attachments.value = [
        ...attachments.value,
        ...renamedFiles.map((file) => {
          const imageId = file.name.replace('attachment_', '').split('.')[0] ?? crypto.randomUUID();
          return {
            file,
            imageId,
            isUploading: true,
            url: '',
            uploadthingKey: '',
          };
        }),
      ];

      return renamedFiles;
    },
    onUploadProgress: (progress) => {
      uploadProgress.value = progress;
    },
    onClientUploadComplete: (res) => {
      isUploading.value = false;
      attachments.value = attachments.value.map((attachment) => {
        const resultUpload = res.find(r => r.name === attachment.file.name);
        if (!resultUpload) {
          return attachment;
        }
        return {
          ...attachment,
          url: resultUpload.url,
          uploadthingKey: resultUpload.serverData.key,
          isUploading: false,
        };
      });

      toast({
        description: 'Файл успешно загружен',
      });
    },
    onUploadError: (error) => {
      isUploading.value = false;
      attachments.value = attachments.value.filter(attachment => !attachment.isUploading);
      console.error(error);
      toast({
        description: 'Файл не был загружен, возможно он слишком большой',
        variant: 'destructive',
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading.value) {
      toast({
        description: 'Пожалуйста, подождите, идет загрузка файла',
        variant: 'destructive',
      });
      return;
    }

    if (files.length > 5) {
      toast({
        description: 'Вы можете загрузить не более 5 файлов',
        variant: 'destructive',
      });
      files.splice(5);
    }

    if (attachments.value.length >= 5) {
      toast({
        description: 'Вы можете загрузить не более 5 файлов',
        variant: 'destructive',
      });
      return;
    }

    const remainingSlots = 5 - attachments.value.length;
    if (files.length > remainingSlots) {
      toast({
        description: `Осталось ${remainingSlots} слотов для загрузки`,
        variant: 'destructive',
      });
      files.splice(remainingSlots);
    }

    startUpload(files);
  }

  async function removeAttachment(id: string) {
    const attachment = attachments.value.find(
      item => item.imageId === id,
    );
    if (attachment?.uploadthingKey) {
      await $fetch('/api/uploadthing/delete', {
        method: 'POST',

        body: {
          keys: [attachment.uploadthingKey],
        },
      });
    }
    attachments.value = attachments.value.filter(
      item => item.imageId !== id,
    );
  }

  function reorderAttachments(newOrder: UploadAttachment[]) {
    attachments.value = newOrder;
  }

  function clearAttachments() {
    attachments.value = [];
    uploadProgress.value = undefined;
  }

  async function resetAttachments() {
    const keys = attachments.value
      .map(item => item.uploadthingKey)
      .filter(Boolean);
    if (keys.length) {
      await $fetch('/api/uploadthing/delete', {
        method: 'POST',

        body: {
          keys,
        },
      });
    }
    attachments.value = [];
    uploadProgress.value = undefined;
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reorderAttachments,
    resetAttachments,
    clearAttachments,
  };
}
