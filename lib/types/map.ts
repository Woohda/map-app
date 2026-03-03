import type { LngLat, YMapMarkerProps } from '@yandex/ymaps3-types';

type BaseMapMarker = Pick<YMapMarkerProps, 'coordinates' | 'id'>;

export interface MapMarker extends BaseMapMarker {
	title: string;
	description: string;
}

export interface MapLocation {
	center: LngLat;
	zoom: number;
}

export interface LocationFormData {
	title: string;
	description: string;
	coordinates: LngLat;
}

export interface LocationData extends LocationFormData {
	id?: string;
	created_at?: string;
}

export interface MapClickEvent {
	coordinates: LngLat;
}

export interface MapClickHandler {
	(object: unknown, event: MapClickEvent): void;
}
