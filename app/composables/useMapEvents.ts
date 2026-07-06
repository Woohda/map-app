import type { DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import type { Coordinates, MapClickEvent } from '~lib/types/map';
import type { Ref } from 'vue';

export function useMapEvents(options: {
  authStore: {
    isAuthenticated: boolean;
  };
  popupStore: {
    showAddLocation: (coordinates: Coordinates) => void;
  };
  clickedCoordinates: Ref<Coordinates | null>;
  hasInteracted: Ref<boolean>;
}) {
  const { authStore, popupStore, clickedCoordinates, hasInteracted } = options;

  function handleMapDoubleClick(
    object: DomEventHandlerObject,
    event: MapClickEvent,
  ): void {
    if (!authStore.isAuthenticated) {
      return;
    }
    const type = object?.type;
    if (!type || (type !== 'feature' && type !== 'marker')) {
      clickedCoordinates.value = event.coordinates;
      popupStore.showAddLocation(event.coordinates);
    }
  }

  function handleFirstInteraction(): void {
    if (!hasInteracted.value) {
      hasInteracted.value = true;
    }
  }

  return {
    handleMapDoubleClick,
    handleFirstInteraction,
  };
}
