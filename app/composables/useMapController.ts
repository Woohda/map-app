/**
 * @module app/composables/useMapController
 * @fileoverview Composable для глобального управления экземпляром Яндекс Карты
 * @description
 * Этот модуль предоставляет singleton доступ к экземпляру YMap и методы для навигации по карте.
 * Использует глобальную переменную для хранения единственного экземпляра карты.
 * ---
 * ### Логика работы:
 * 1. `Singleton Pattern`: Хранит единственный экземпляр карты в globalMapInstance
 * 2. `Navigation`: Предоставляет метод для плавной навигации к координатам с настройками анимации
 * 3. `State Access`: Позволяет получать текущий центр карты
 *
 * ### API:
 * - `setMap(instance)`: Устанавливает глобальный экземпляр карты
 * - `navigateTo(coords, options)`: Навигация к координатам с настройками (zoom, duration, easing)
 * - `getCenter()`: Возвращает текущие координаты центра карты
 *
 * ### Особенности:
 * - Глобальный доступ к экземпляру карты из любого компонента
 * - Плавная анимация перемещения с настройками по умолчанию (zoom: 17, duration: 1300ms, easing: ease-in-out)
 * - Возможность переопределения настроек навигации через options
 *
 * ### Параметры NavigateOptions:
 * - `zoom?: number` - уровень приближения (по умолчанию 17)
 * - `duration?: number` - длительность анимации в мс (по умолчанию 1300)
 * - `easing?: EasingFunctionDescription` - функция анимации (по умолчанию 'ease-in-out')
 *
 * ### Примечания:
 * - Использует глобальную переменную для singleton pattern
 * - Если карта не инициализирована, методы navigateTo и getCenter вернут null/не сработают
 * - getCenter возвращает координаты в формате [lng, lat]
 *
 * ### Зависимости:
 * - EasingFunctionDescription, LngLat, YMap из @yandex/ymaps3-types
 */

import type { EasingFunctionDescription, LngLat, YMap } from '@yandex/ymaps3-types';

interface NavigateOptions {
  zoom?: number;
  duration?: number;
  easing?: EasingFunctionDescription;
}

let globalMapInstance: YMap | null = null;

export function useMapController() {
  const setMap = (instance: YMap) => {
    globalMapInstance = instance;
  };

  const navigateTo = (coords: LngLat, options: NavigateOptions = {}) => {
    if (globalMapInstance) {
      globalMapInstance.setLocation({
        center: coords,
        zoom: 17,
        duration: 1300,
        easing: 'ease-in-out',
        ...options,
      });
    }
  };

  const getCenter = (): LngLat | null => {
    const center = globalMapInstance?.center;
    if (!center)
      return null;
    return [center[0], center[1]];
  };

  return {
    setMap,
    navigateTo,
    getCenter,
  };
}
