<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  marker: MapMarker;
  icon: 'map-pin' | 'heart-filled';
  onRemove?: (marker: MapMarker) => void | Promise<void>;
  isRemoving?: boolean;
}>();

const { currentUser } = storeToRefs(useAuthUserStore());

async function handleRemoveClick(marker: MapMarker, event: Event) {
  event.stopPropagation();
  if (props.onRemove) {
    await props.onRemove(marker);
  }
}
</script>

<template>
  <div class="flex items-center gap-1">
    <div class="flex shrink-0">
      <Icon
        :name="
          icon === 'heart-filled' ? 'tabler:heart-filled' : 'tabler:map-pin'
        "
        size="40"
        :class="icon === 'heart-filled' ? 'text-red-500' : 'text-primary'"
      />
    </div>
    <div class="flex-1 min-w-0">
      <h4
        class="text-base font-medium truncate group-hover:text-primary transition-colors break-words hyphens-auto"
      >
        {{ marker.name }}
      </h4>
      <p
        v-if="marker.description"
        class="pr-1 text-xs text-muted-foreground line-clamp-3 break-words hyphens-auto"
      >
        {{ marker.description }}
      </p>
      <p
        v-if="currentUser?.username !== marker.username"
        class="text-xs text-muted-foreground mt-1"
      >
        {{ marker.userName }}
      </p>
    </div>
    <Button
      v-if="onRemove"
      size="lg"
      variant="ghost"
      class="w-7 h-7 p-0 shrink-0 border hover:border-primary transition-colors duration-200"
      :disabled="isRemoving"
      @click="handleRemoveClick(marker, $event)"
    >
      <Icon
        name="tabler:x"
        size="16"
        :class="{ 'animate-spin text-primary': isRemoving }"
      />
    </Button>
  </div>
</template>
