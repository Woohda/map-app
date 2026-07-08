/**
 * @module lib/types/map
 * @fileoverview Типы для работы с Яндекс Картой
 * @description
 * Этот модуль предоставляет типы и интерфейсы для работы с Яндекс Картой.
 * Включает типы для маркеров, координат, событий кликов и настроек карты.
 * ---
 * ### Типы данных:
 * - `Coordinates`: Алиас для LngLat (координаты [lng, lat])
 * - `MapMarker`: Маркер на карте с данными локации
 * - `MapLocation`: Настройки центра и масштаба карты
 * - `MapClickEvent`: Событие клика по карте с координатами
 *
 * ### Примечания:
 * - `MapMarker` расширяет базовый тип YMapMarkerProps
 * - `isFavorite` используется для отметки избранных локаций
 * - `images` содержит массив URL изображений локации
 *
 * ### Зависимости:
 * - LngLat, YMapMarkerProps из @yandex/ymaps3-types
 */

import type { LngLat, YMapMarkerProps } from '@yandex/ymaps3-types';

export type Coordinates = LngLat;

type BaseMapMarker = Pick<YMapMarkerProps, 'coordinates'>;

export interface MapMarker extends BaseMapMarker {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  userName: string;
  username: string;
  isFavorite?: boolean;
  images?: string[];
}

export interface MapLocation {
  center: LngLat;
  zoom: number;
}

export interface MapClickEvent {
  coordinates: Coordinates;
}
