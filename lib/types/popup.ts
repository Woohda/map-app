export enum PopupType {
	MARKER_INFO = 'markerInfo',
	ADD_LOCATION = 'addLocation',
	ERROR_INFO = 'errorInfo',
}

export interface PopupState {
	type: PopupType | null;
	data?: unknown;
}
