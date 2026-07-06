<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { useMapController } from '~/composables/useMapController';

const locationStore = useLocationStore();
const popupStore = usePopupStore();
const mapController = useMapController();
const { markers } = storeToRefs(locationStore);

const searchQuery = ref('');

const filteredMarkers = computed(() => {
  if (!searchQuery.value.trim()) {
    return markers.value;
  }
  const query = searchQuery.value.toLowerCase();
  return markers.value.filter(
    marker =>
      marker.name.toLowerCase().includes(query)
      || marker.description?.toLowerCase().includes(query),
  );
});

function handleLocationSelect(marker: MapMarker) {
  locationStore.selectMapMarker(marker.slug);
  popupStore.showMarkerInfo(marker);
  mapController.navigateTo(marker.coordinates);
  popupStore.clearPopup();
}
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <h2 class="text-xl font-bold">
      Все локации
    </h2>
    <div class="relative">
      <Icon
        name="tabler:search"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size="18"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию или описанию..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
    </div>
    <div class="flex flex-col gap-2 overflow-y-auto max-h-[50vh]">
      <div
        v-if="filteredMarkers.length === 0"
        class="text-center text-muted-foreground py-4"
      >
        {{ searchQuery ? "Ничего не найдено" : "Нет локаций" }}
      </div>
      <button
        v-for="marker in filteredMarkers"
        :key="marker.id"
        class="flex flex-col gap-1 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
        @click="handleLocationSelect(marker)"
      >
        <h3 class="font-semibold text-sm line-clamp-1">
          {{ marker.name }}
        </h3>
        <p class="text-xs text-muted-foreground line-clamp-2">
          {{ marker.description || "Без описания" }}
        </p>
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="tabler:user" size="14" />
          <span>{{ marker.userName }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
