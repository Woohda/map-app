<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '~/components/ui/button';

interface Props {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const props = defineProps<Props>();

const fileInputRef = ref<HTMLInputElement | null>(null);

function handleClick() {
  fileInputRef.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (files.length) {
    props.onFilesSelected(files);
    target.value = '';
  }
}
</script>

<template>
  <div>
    <Button
      variant="ghost"
      type="button"
      size="xs"
      class="text-primary"
      :disabled="disabled"
      @click="handleClick"
    >
      <Icon name="tabler:upload" size="18" />
    </Button>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden sr-only"
      :disabled="disabled"
      @change="handleFileChange"
    >
  </div>
</template>
