import type { LngLat, YMapMarkerProps } from '@yandex/ymaps3-types';

type BaseMapMarker = Pick<YMapMarkerProps, 'coordinates' | 'id'>;

export interface MapMarker extends BaseMapMarker {
	name: string;
	slug: string;
	description: string | null;
	userName: string;
	username: string;
}

export interface MapLocation {
	center: LngLat;
	zoom: number;
}

export interface MapClickEvent {
	coordinates: LngLat;
}

export interface MapClickHandler {
	(object: unknown, event: MapClickEvent): void;
}
