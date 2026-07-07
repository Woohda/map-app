<script setup lang="ts">
import type { UploadAttachment } from '~lib/types/upload';

import { VueDraggable } from 'vue-draggable-plus';

import AttachmentPreview from './AttachmentPreview.vue';

interface Props {
  attachments: UploadAttachment[];
  onRemoveClick: (id: string) => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  reorder: [UploadAttachment[]];
}>();

const attachmentsModel = computed({
  get: () => props.attachments,
  set: value => emit('reorder', value),
});
</script>

<template>
  <div class="flex gap-2" :class="{ hidden: !props.attachments.length }">
    <VueDraggable
      v-if="props.attachments.length"
      v-model="attachmentsModel"
      :animation="200"
      class="flex gap-2"
    >
      <AttachmentPreview
        v-for="attachment in props.attachments"
        :key="attachment.imageId"
        :attachment="attachment"
        :on-remove-click="() => props.onRemoveClick(attachment.imageId)"
      />
    </VueDraggable>
  </div>
</template>

<style scoped></style>
