<script setup lang="ts">
import type { UploadAttachment } from '~lib/types/upload';

interface Props {
  attachment: UploadAttachment;
  onRemoveClick: () => void;
}

const props = defineProps<Props>();
const src = ref('');

watchEffect((onCleanup) => {
  const objectUrl = URL.createObjectURL(props.attachment.file);
  src.value = objectUrl;

  onCleanup(() => {
    URL.revokeObjectURL(objectUrl);
  });
});
</script>

<template>
  <div
    class="relative size-fit"
    :class="{ 'opacity-50': props.attachment.isUploading }"
  >
    <NuxtImg
      v-if="props.attachment.file.type.startsWith('image')"
      :src="src"
      alt="Attachment preview"
      class="h-20 aspect-square object-cover rounded-2xl"
    />
    <button
      v-if="!props.attachment.isUploading"
      type="button"
      class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/60"
      @click="props.onRemoveClick"
    >
      <Icon name="tabler:x" :size="15" />
    </button>
  </div>
</template>

<style scoped></style>
