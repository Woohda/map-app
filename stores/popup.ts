/**
 * @module stores/popup
 * @fileoverview Pinia store для управления всплывающими окнами
 *
 * ## Функциональность:
 * - 📋 Управление отображением popup окон
 * - 📍 Показ информации о маркере
 * - ➕ Форма добавления локации
 * - 📋 Список всех локаций с поиском
 * - ⚠️ Отображение ошибок
 * - 🔄 Сброс состояния popup
 *
 * ## Состояние:
 * - `popup` - текущее состояние popup (type, data)
 *
 * ## Функции:
 * - `openPopup(type, data)` - открытие popup с указанным типом
 * - `showMarkerInfo(marker)` - показ информации о маркере
 * - `showAddLocation(coords)` - показ формы добавления локации
 * - `showLocationsList()` - показ списка всех локаций с поиском
 * - `showErrorInfo(message)` - показ ошибки
 * - `clearPopup()` - закрытие текущего popup
 *
 * ## Типы popup:
 * - `MARKER_INFO` - информация о маркере
 * - `ADD_LOCATION` - форма добавления локации
 * - `LOCATIONS_LIST` - список всех локаций с поиском
 * - `ERROR_INFO` - сообщение об ошибке
 *
 * ## Использование:
 * ```typescript
 * const popupStore = usePopupStore();
 * popupStore.showMarkerInfo(marker);
 * popupStore.showLocationsList();
 * ```
 */

import type { LngLat } from '@yandex/ymaps3-types';
import type { MapMarker } from '~lib/types/map';
import type { PopupState } from '~lib/types/popup';

import { PopupType } from '~lib/types/popup';
import { defineStore } from 'pinia';

interface PopupStoreState {
  popup: PopupState;
}

export const usePopupStore = defineStore('popup', {
  state: (): PopupStoreState => ({
    popup: { type: null, data: null },
  }),

  actions: {
    openPopup(type: PopupType, data: unknown = null) {
      this.popup = { type, data };
    },

    showMarkerInfo(marker: MapMarker) {
      this.openPopup(PopupType.MARKER_INFO, marker);
    },

    showAddLocation(coordinates: LngLat) {
      this.openPopup(PopupType.ADD_LOCATION, coordinates);
    },

    showErrorInfo(str: string) {
      this.openPopup(PopupType.ERROR_INFO, str);
    },

    showLocationsList() {
      this.openPopup(PopupType.LOCATIONS_LIST);
    },

    clearPopup() {
      this.popup = { type: null, data: null };
    },
  },
});
