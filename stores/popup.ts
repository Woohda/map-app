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

		clearPopup() {
			this.popup = { type: null, data: null };
		},
	},
});
