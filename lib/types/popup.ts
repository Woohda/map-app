export enum PopupType {
	MARKER_INFO = 'markerInfo',
	ADD_LOCATION = 'addLocation',
}

export interface PopupState {
	type: PopupType | null;
}
