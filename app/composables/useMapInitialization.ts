/**
 * @module app/composables/useMapInitialization
 * @fileoverview Composable для инициализации карты и загрузки начальных данных
 * @description
 * Этот модуль управляет процессом инициализации Яндекс Карты, загрузкой локаций,
 * определением геолокации пользователя и обработкой ошибок геолокации.
 * ---
 * ### Логика работы:
 * 1. `Map Loading Watcher`: Отслеживает загрузку Яндекс Карт через yandexMapIsLoaded
 * 2. `Data Loading`: После загрузки карты загружает локации и определяет геолокацию пользователя
 * 3. `Error Handling`: Отслеживает ошибки геолокации и показывает их через popup
 * 4. `Auto-navigation`: При успешном определении геолокации автоматически перемещает карту
 *
 * ### API:
 * - Нет публичных методов (работает через lifecycle hooks)
 *
 * ### Особенности:
 * - Автоматическая загрузка локаций после инициализации карты
 * - Определение геолокации пользователя при первом запуске
 * - Показ ошибок геолокации через popupStore
 * - Корректная очистка watchers при unmount
 *
 * ### Параметры options:
 * - `locationStore`: Store с методом loadLocations для загрузки локаций
 * - `userGeolocationStore`: Store с getUserLocation и error для геолокации
 * - `mapController`: Controller с методом navigateTo для навигации
 * - `popupStore`: Store с методом showErrorInfo для показа ошибок
 *
 * ### Примечания:
 * - Использует watchEffect для отслеживания ошибок геолокации
 * - Использует watch для отслеживания загрузки карты (однократный)
 * - Watcher карты автоматически отписывается после первой загрузки
 * - Очистка geolocation error watcher происходит при onUnmounted
 *
 * ### Зависимости:
 * - Coordinates из ~lib/types/map
 * - onMounted, onUnmounted, watch, watchEffect из vue
 * - yandexMapIsLoaded из vue-yandex-maps
 */

import type { Coordinates } from '~lib/types/map';

import { onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { yandexMapIsLoaded } from 'vue-yandex-maps';

export function useMapInitialization(options: {
  locationStore: {
    loadLocations: () => Promise<void>;
  };
  userGeolocationStore: {
    getUserLocation: () => Promise<{ center: Coordinates; zoom: number } | undefined>;
    error: string | null;
  };
  mapController: {
    navigateTo: (coordinates: Coordinates) => void;
  };
  popupStore: {
    showErrorInfo: (error: string) => void;
  };
}) {
  const { locationStore, userGeolocationStore, mapController, popupStore } = options;

  let unsubscribeGeolocationError: (() => void) | null = null;

  onMounted(async () => {
    unsubscribeGeolocationError = watchEffect(() => {
      const err = userGeolocationStore.error;
      if (err) {
        popupStore.showErrorInfo(err);
      }
    });

    const unwatch = watch(yandexMapIsLoaded, async (loaded) => {
      if (loaded) {
        await locationStore.loadLocations();
        const userLocation = await userGeolocationStore.getUserLocation();
        if (userLocation) {
          mapController.navigateTo(userLocation.center);
        }
        unwatch();
      }
    });
  });

  onUnmounted(() => {
    unsubscribeGeolocationError?.();
  });
}
