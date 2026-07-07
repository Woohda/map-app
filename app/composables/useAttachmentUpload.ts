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
