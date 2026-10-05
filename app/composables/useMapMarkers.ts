/**
 * @module app/composables/useMapMarkers
 * @fileoverview Composable для управления маркерами на карте и их взаимодействием
 * @description
 * Этот модуль реализует логику взаимодействия с маркерами на карте, включая открытие маркеров
 * по slug, обработку кликов, обновление URL и синхронизацию с router.
 * ---
 * ### Логика работы:
 * 1. `Marker Opening`: Открывает маркер по slug с навигацией к его координатам
 * 2. `Click Handling`: Обрабатывает клики по маркерам с обновлением состояния и URL
 * 3. `URL Synchronization`: Обновляет query параметр location в router при клике
 * 4. `Clusterer Refresh`: Принудительно обновляет clusterer при выборе маркера
 *
 * ### API:
 * - `openMarkerBySlug(slug)`: Открывает маркер по slug с навигацией
 * - `handleMarkerClick(marker)`: Обрабатывает клик по маркеру
 *
 * ### Особенности:
 * - Автоматическая навигация к координатам маркера
 * - Обновление URL query параметра для deeplinking
 * - Синхронизация с locationStore для выбранного маркера
 * - Показ popup с информацией о маркере
 * - Принудительное обновление clusterer для корректного отображения
 *
 * ### Параметры options:
 * - `markers`: Ref с массивом маркеров
 * - `locationStore`: Store с методами selectMapMarker, forceRefreshClusterer, setPendingNavigation
 * - `mapController`: Controller с методом navigateTo
 * - `popupStore`: Store с методом showMarkerInfo
 * - `route`: Текущий route с query параметрами
 * - `router`: Router с методом replace
 *
 * ### Примечания:
 * - openMarkerBySlug не повторяет действия если маркер уже выбран
 * - handleMarkerClick обновляет URL только если query параметр изменился
 * - Использует router.replace для обновления URL без навигации
 *
 * ### Зависимости:
 * - Coordinates, MapMarker из ~lib/types/map
 * - Ref из vue
 */

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
