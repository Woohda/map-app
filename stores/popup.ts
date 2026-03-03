import type { PopupState } from '~lib/types/popup';

import { PopupType } from '~lib/types/popup';
import { defineStore } from 'pinia';

interface PopupStoreState {
	popup: PopupState;
}

export const usePopupStore = defineStore('popup', {
	state: (): PopupStoreState => ({
		popup: { type: null },
	}),

	actions: {
		showMarkerInfo() {
			this.popup = { type: PopupType.MARKER_INFO };
		},

		showAddLocation() {
			this.popup = { type: PopupType.ADD_LOCATION };
		},

		clearPopup() {
			this.popup = { type: null };
		},
	},
});
