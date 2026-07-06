<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

interface Props {
  location: MapMarker & { distance: number };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [location: MapMarker];
}>();

function handleLocationClick() {
  const { distance, ...marker } = props.location;
  emit('select', marker);
}
</script>

<template>
  <SidebarMenuItem>
    <SidebarMenuButton class="w-full flex justify-between items-center cursor-pointer px-1" @click="handleLocationClick">
      <div class="flex gap-1 items-center min-w-0 flex-1">
        <Icon name="tabler:map-pin" size="16" class="shrink-0" />
        <span
          class="w-full text-sm truncate"
        >
          {{ location.name }}
        </span>
      </div>

      <span
        class="text-xs text-muted-foreground shrink-0 ml-0"
      >
        {{ location.distance.toFixed(1) }} км
      </span>
    </SidebarMenuButton>
  </SidebarMenuItem>
</template>
