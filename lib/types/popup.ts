/**
 * @module lib/types/popup
 * @fileoverview Типы для управления popup состояниями
 * @description
 * Этот модуль предоставляет типы и enum для управления popup окнами в приложении.
 * Включает типы popup и их состояния.
 * ---
 * ### Типы данных:
 * - `PopupType`: Enum с типами popup окон
 * - `PopupState`: Интерфейс состояния popup с типом и данными
 *
 * ### Типы PopupType:
 * - `MARKER_INFO`: Popup с информацией о маркере
 * - `ADD_LOCATION`: Popup для добавления локации
 * - `ERROR_INFO`: Popup с информацией об ошибке
 * - `LOCATIONS_LIST`: Popup со списком локаций
 *
 * ### Примечания:
 * - `PopupState.type` может быть null для закрытого popup
 * - `PopupState.data` содержит произвольные данные для конкретного popup
 */

export enum PopupType {
  MARKER_INFO = 'markerInfo',
  ADD_LOCATION = 'addLocation',
  ERROR_INFO = 'errorInfo',
  LOCATIONS_LIST = 'locationsList',
}

export interface PopupState {
  type: PopupType | null;
  data?: unknown;
}
