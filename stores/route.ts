/**
 * @module stores/route
 * @fileoverview Pinia store для управления маршрутом на карте
 *
 * ## Функциональность:
 * - 🗺️ Хранение текущего маршрута (RouteFeature)
 * - ⏳ Управление состоянием загрузки маршрута
 * - ❌ Обработка ошибок при построении маршрута
 * - 🧹 Очистка данных маршрута
 *
 * ## Состояние:
 * - `route` - текущий маршрут (RouteFeature или null)
 * - `loading` - статус загрузки маршрута
 * - `error` - сообщение об ошибке или null
 *
 * ## Функции:
 * - `setRoute(newRoute)` - установка текущего маршрута
 * - `setLoading(isLoading)` - установка статуса загрузки
 * - `setError(errorMessage)` - установка сообщения об ошибке
 * - `clearRoute()` - очистка маршрута и ошибки
 *
 * ## Использование:
 * ```typescript
 * const routeStore = useRouteStore();
 * // Установить маршрут
 * routeStore.setRoute(routeFeature);
 * // Установить статус загрузки
 * routeStore.setLoading(true);
 * // Установить ошибку
 * routeStore.setError('Не удалось построить маршрут');
 * // Очистить маршрут
 * routeStore.clearRoute();
 * ```
 */

import type { RouteFeature } from '@yandex/ymaps3-types';

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouteStore = defineStore('route', () => {
  const route = ref<RouteFeature | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function setRoute(newRoute: RouteFeature | null) {
    route.value = newRoute;
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage;
  }

  function clearRoute() {
    route.value = null;
    error.value = null;
  }

  return {
    route,
    loading,
    error,
    setRoute,
    setLoading,
    setError,
    clearRoute,
  };
});
