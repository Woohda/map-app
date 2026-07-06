import type { Coordinates, MapMarker } from '~lib/types/map';
import type { Ref } from 'vue';

export function useMapMarkers(options: {
  markers: Ref<MapMarker[]>;
  locationStore: {
    selectedMarkerSlug: string | null;
    selectMapMarker: (slug: string | null) => void;
    forceRefreshClusterer: () => void;
    setPendingNavigation: (slug: string | null) => void;
    pendingNavigationSlug: string | null;
  };
  mapController: {
    navigateTo: (coordinates: Coordinates) => void;
  };
  popupStore: {
    showMarkerInfo: (marker: MapMarker) => void;
  };
  route: {
    query: Record<string, unknown>;
  };
  router: {
    replace: (options: { query: Record<string, string | undefined> }) => Promise<void | unknown>;
  };
}) {
  const { markers, locationStore, mapController, popupStore, route, router } = options;

  function openMarkerBySlug(slug: string): void {
    const marker = markers.value.find(m => m.slug === slug);
    if (!marker) {
      return;
    }

    mapController.navigateTo(marker.coordinates);

    if (locationStore.selectedMarkerSlug !== slug) {
      handleMarkerClick(marker);
    }
  }

  function handleMarkerClick(marker: MapMarker): void {
    locationStore.selectMapMarker(marker.slug);
    locationStore.forceRefreshClusterer();
    popupStore.showMarkerInfo(marker);
    if (route.query.location !== marker.slug) {
      router.replace({ query: { location: marker.slug } });
    }
  }

  return {
    openMarkerBySlug,
    handleMarkerClick,
  };
}
