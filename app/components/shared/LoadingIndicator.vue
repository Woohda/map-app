<script setup lang="ts">
import { Spinner } from '~/components/ui/loader';

interface Props {
  message?: string;
  position?: 'top' | 'bottom' | 'center';
  fullscreen?: boolean;
  showBackdrop?: boolean;
}

withDefaults(defineProps<Props>(), {
  message: 'Загрузка...',
  position: 'bottom',
  fullscreen: false,
  showBackdrop: false,
});
</script>

<template>
  <div
    class="absolute pointer-events-none"
    :class="[
      fullscreen ? 'inset-0 flex items-center justify-center z-50' : '',
      showBackdrop ? 'bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/0' : '',
      !fullscreen ? (position === 'top' ? 'top-3' : position === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-3') : '',
    ]"
  >
    <div
      class="flex gap-2 items-center pointer-events-auto rounded-xl border bg-background/70 py-2 px-3 shadow-lg backdrop-blur-sm"
    >
      <Spinner />
      <span class="text-sm" :class="fullscreen ? 'text-muted-foreground' : ''">{{ message }}</span>
    </div>
  </div>
</template>

<style scoped></style>
