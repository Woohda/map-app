/**
 * @module app/composables/useMapEvents
 * @fileoverview Composable для обработки событий карты (двойной клик, первое взаимодействие)
 * @description
 * Этот модуль реализует обработчики событий карты для взаимодействия с пользователями.
 * Поддерживает открытие popup добавления локации при двойном клике и отслеживание первого взаимодействия.
 * ---
 * ### Логика работы:
 * 1. `Double Click Handler`: Обрабатывает двойной клик по карте для авторизованных пользователей
 * 2. `Feature Detection`: Проверяет тип кликнутого объекта (feature, marker) для предотвращения конфликтов
 * 3. `Authorization Check`: Показывает popup добавления локации только для авторизованных пользователей
 * 4. `First Interaction`: Отслеживает первое взаимодействие пользователя с картой
 *
 * ### API:
 * - `handleMapDoubleClick(object, event)`: Обработчик двойного клика по карте
 * - `handleFirstInteraction()`: Обработчик первого взаимодействия пользователя
 *
 * ### Особенности:
 * - Показывает popup добавления локации только при клике на пустое место карты
 * - Игнорирует клики по features и markers
 * - Требует авторизации для добавления локаций
 * - Отслеживает флаг первого взаимодействия для аналитики/UX
 *
 * ### Параметры options:
 * - `authStore`: Store с полем isAuthenticated для проверки авторизации
 * - `popupStore`: Store с методом showAddLocation для открытия popup
 * - `clickedCoordinates`: Ref для хранения координат клика
 * - `hasInteracted`: Ref для отслеживания первого взаимодействия
 *
 * ### Примечания:
 * - Двойной клик по маркерам или features не открывает popup добавления
 * - Координаты клика сохраняются в clickedCoordinates ref
 * - Первое взаимодействие устанавливает hasInteracted в true
 *
 * ### Зависимости:
 * - DomEventHandlerObject из @yandex/ymaps3-types/imperative/YMapListener
 * - Coordinates, MapClickEvent из ~lib/types/map
 * - Ref из vue
 */

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
