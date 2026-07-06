<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import LocationListSkeleton from '~/components/shared/LocationListSkeleton.vue';
import { useContainerHeight } from '~/composables/useContainerHeight';

import LocationItem from '../card/LocationItem.vue';

const locationStore = useLocationStore();
const { userMarkers, userLoading, removingIds } = storeToRefs(locationStore);

async function handleLocationClick(marker: MapMarker) {
  locationStore.setPendingNavigation(marker.slug);
  await navigateTo('/');
}
async function handleRemoveLocation(marker: MapMarker) {
  await locationStore.removeLocation(marker.id);
}

const listContainerRef = ref<HTMLDivElement>();
const { containerStyle } = useContainerHeight(listContainerRef);
</script>

<template>
  <div class="flex flex-col">
    <LocationListSkeleton v-if="userLoading" />
    <div
      v-else-if="userMarkers.length === 0"
      class="flex flex-col items-center gap-1 text-muted-foreground"
    >
      <Icon name="tabler:map-pin" size="48" class="opacity-50" />
      <p>У вас пока нет сохраненных локаций</p>
    </div>

    <div v-else class="flex flex-col h-full gap-2">
      <div class="flex items-center justify-between shrink-0">
        <h3 class="text-lg font-semibold">
          Мои локации ({{ userMarkers.length }}):
        </h3>
      </div>

      <div ref="listContainerRef" class="flex flex-col" :style="containerStyle">
        <div class="grid gap-2">
          <div
            v-for="marker in userMarkers"
            :key="marker.id"
            class="group mr-1 p-2 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] outline-none min-w-0"
            :class="{ 'pointer-events-none opacity-50': removingIds.has(marker.id) }"
            tabindex="0"
            role="button"
            :aria-label="`Локация: ${marker.name}${marker.description ? `, ${marker.description}` : ''}`"
            @click="handleLocationClick(marker)"
            @keydown.enter="handleLocationClick(marker)"
          >
            <LocationItem
              :marker="marker"
              icon="map-pin"
              :on-remove="handleRemoveLocation"
              :is-removing="removingIds.has(marker.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
