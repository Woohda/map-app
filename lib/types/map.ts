import type { LngLat, YMapMarkerProps } from '@yandex/ymaps3-types';

/**
 * Модуль содержит типы для работы с картой Яндекс.
 * Он предоставляет интерфейсы для маркеров, событий и обработчиков кликов.
 *
 * @interface {MapMarker} - Интерфейс маркера на карте с дополнительными полями
 * @interface {MapLocation} - Интерфейс для определения центра карты и масштаба
 * @interface {MapClickEvent} - Интерфейс события клика по карте
 * @interface {MapClickHandler} - Интерфейс обработчика клика по карте
 */

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
