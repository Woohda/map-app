/**
 * @module app/composables/useRouteBuilder
 * @fileoverview Composable для построения пешеходных маршрутов с помощью Яндекс Карт
 * @description
 * Этот модуль реализует функциональность построения маршрутов между двумя точками
 * с использованием API Яндекс Карт. Поддерживает отслеживание состояния загрузки и ошибок.
 * ---
 * ### Логика работы:
 * 1. `Route Building`: Использует ymaps3.route для построения маршрута между точками
 * 2. `Validation`: Проверяет готовность карты и наличие результатов
 * 3. `Error Handling`: Обрабатывает ошибки с детальными сообщениями
 * 4. `State Management`: Отслеживает состояние загрузки, маршрут и ошибки
 *
 * ### API:
 * - `buildRoute(startCoordinates, endCoordinates)`: Строит маршрут между двумя точками
 * - `clearRoute()`: Очищает текущий маршрут и ошибки
 * - `route`: Ref с текущим маршрутом (RouteFeature | null)
 * - `loading`: Ref состояния загрузки
 * - `error`: Ref с сообщением об ошибке
 * - `lineStyle`: Объект стиля для отрисовки маршрута
 *
 * ### Особенности:
 * - Поддержка только пешеходных маршрутов (type: 'walking')
 * - Автоматическое вычисление bounds маршрута
 * - Детальная валидация результатов (проверка координат)
 * - Стилизованная отрисовка маршрута (двойная линия с цветами)
 *
 * ### Стиль маршрута (lineStyle):
 * - Внутренняя линия: 6px, цвет #007afce6 (синий)
 * - Внешняя линия: 10px, цвет #fff (белый)
 * - Прозрачность заливки: 0.9
 *
 * ### Ошибки:
 * - 'Карта еще не загружена' - если API не готов
 * - 'Не удалось построить маршрут' - если API вернул пустой результат
 * - 'Маршрут не содержит координат' - если геометрия пуста
 *
 * ### Примечания:
 * - Использует ymaps3.ready для ожидания готовности API
 * - Бросает ошибку при неудачном построении маршрута
 * - Автоматически сбрасывает loading в finally блоке
 *
 * ### Зависимости:
 * - LngLat, RouteFeature из @yandex/ymaps3-types
 * - ref из vue
 * - isYandexMapReadyToInit из vue-yandex-maps
 */

import type { LngLat, RouteFeature } from '@yandex/ymaps3-types';

import { ref } from 'vue';
import { isYandexMapReadyToInit } from 'vue-yandex-maps';

const lineStyle = {
  fillRule: 'nonzero' as const,
  fill: '#333',
  fillOpacity: 0.9,
  stroke: [
    {
      width: 6,
      color: '#007afce6',
    },
    {
      width: 10,
      color: '#fff',
    },
  ],
};

export function useRouteBuilder() {
  const route = ref<RouteFeature | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function buildRoute(startCoordinates: LngLat, endCoordinates: LngLat) {
    loading.value = true;
    error.value = null;

    try {
      if (!isYandexMapReadyToInit.value) {
        throw new Error('Карта еще не загружена.');
      }

      await ymaps3.ready;

      const routes = await ymaps3.route({
        points: [startCoordinates, endCoordinates],
        type: 'walking',
        bounds: true,
      });

      if (!routes || routes.length === 0) {
        throw new Error('Не удалось построить маршрут.');
      }

      const firstRoute = routes[0]?.toRoute();

      if (!firstRoute) {
        throw new Error('Не удалось построить маршрут.');
      }

      if (firstRoute.geometry.coordinates.length === 0) {
        throw new Error('Маршрут не содержит координат.');
      }

      route.value = firstRoute;
      return firstRoute;
    }
    catch (err) {
      const errorMessage
        = err instanceof Error ? err.message : 'Не удалось построить маршрут.';
      error.value = errorMessage;
      console.error('Route building error:', err);
      throw err;
    }
    finally {
      loading.value = false;
    }
  }

  function clearRoute() {
    route.value = null;
    error.value = null;
  }

  return {
    route,
    loading,
    error,
    buildRoute,
    clearRoute,
    lineStyle,
  };
}
