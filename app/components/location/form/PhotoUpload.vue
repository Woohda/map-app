<script setup lang="ts">
import type { UploadAttachment, UploadedImage } from '~lib/types/upload';

import AttachmentButton from '~/components/uploadthing/AttachmentButton.vue';
import AttachmentPreviews from '~/components/uploadthing/AttachmentPreviews.vue';
import { useAttachmentUpload } from '~/composables/useAttachmentUpload';

interface Props {
  modelValue: UploadedImage[];
  disabled?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: UploadedImage[]];
}>();

const isDragging = ref(false);

const {
  startUpload,
  attachments,
  isUploading,
  removeAttachment,
  uploadProgress,
  reorderAttachments,
  resetAttachments,
} = useAttachmentUpload();

watch(
  attachments,
  (newAttachments) => {
    emit(
      'update:modelValue',
      newAttachments
        .filter(a => !a.isUploading && a.url && a.uploadthingKey)
        .map(a => ({
          url: a.url!,
          uploadthingKey: a.uploadthingKey!,
        })),
    );
  },
  { deep: true },
);

function handleFilesSelected(files: File[]) {
  startUpload(files);
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (!props.disabled) {
    isDragging.value = true;
  }
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  if (props.disabled) {
    return;
  }
  const files = Array.from(event.dataTransfer?.files ?? []);
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  if (imageFiles.length) {
    startUpload(imageFiles);
  }
}

function handleRemoveAttachment(id: string) {
  removeAttachment(id);
}

function handleReorderAttachments(newOrder: UploadAttachment[]) {
  reorderAttachments(newOrder);
}

function reset() {
  resetAttachments();
}

defineExpose({
  reset,
});
</script>

<template>
  <div
    class="space-y-2"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div
      class="flex gap-1 items-center justify-center rounded-xl border-2 border-dashed p-2 transition"
      :class="{
        'border-primary bg-primary/10': isDragging,
        'border-muted': !isDragging,
      }"
    >
      <span class="text-sm text-muted-foreground">
        Перетащите фото сюда или нажмите
      </span>
      <AttachmentButton
        :disabled="props.disabled || attachments.length >= 5 || isUploading"
        :on-files-selected="handleFilesSelected"
      />
    </div>
    <AttachmentPreviews
      :attachments="attachments"
      :on-remove-click="handleRemoveAttachment"
      @reorder="handleReorderAttachments"
    />
    <div class="flex items-center gap-2">
      <div v-if="isUploading" class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">{{ uploadProgress ?? 0 }}%</span>
        <Icon name="tabler:loader" class="h-4 w-4 animate-spin text-primary" />
      </div>
    </div>
    <p v-if="attachments.length >= 5" class="text-xs text-muted-foreground">
      Максимум 5 фото
    </p>
  </div>
</template>
