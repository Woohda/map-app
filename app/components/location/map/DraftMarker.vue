<script setup lang="ts">
import type { YMapDefaultMarker } from '@yandex/ymaps3-default-ui-theme';

import { useLocationStore } from '~stores/location';
import { useGeolocationStore } from '~stores/userGeolocation';
import { inject, shallowRef, triggerRef } from 'vue';
import { YandexMapDefaultMarker } from 'vue-yandex-maps';

const locationStore = useLocationStore();
const userGeolocationStore = useGeolocationStore();

const draftMarker = inject<
  ReturnType<typeof shallowRef<YMapDefaultMarker | null>>
>('draftMarker', shallowRef<YMapDefaultMarker | null>(null));

function onDraftMarkerDragMove() {
  triggerRef(draftMarker);
}
</script>

<template>
  <YandexMapDefaultMarker
    v-if="locationStore.isAddingLocation"
    v-model="draftMarker"
    :settings="{
      coordinates: draftMarker
        ? draftMarker.coordinates
        : locationStore.draftMarkerCoordinates
          || userGeolocationStore.location.center,
      title: draftMarker
        ? `${draftMarker.coordinates[0].toFixed(4)}, ${draftMarker.coordinates[1].toFixed(4)}`
        : 'Перетащите маркер',
      draggable: true,
      onDragMove: onDraftMarkerDragMove,
      zIndex: 10,
    }"
  />
</template>

<style scoped></style>
