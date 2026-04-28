import type { EasingFunctionDescription, LngLat, YMap } from '@yandex/ymaps3-types';

interface NavigateOptions {
	zoom?: number;
	duration?: number;
	easing?: EasingFunctionDescription;
}

let globalMapInstance: YMap | null = null;

export function useMapController() {
	const setMap = (instance: YMap) => {
		globalMapInstance = instance;
	};

	const navigateTo = (coords: LngLat, options: NavigateOptions = {}) => {
		if (globalMapInstance) {
			globalMapInstance.setLocation({
				center: coords,
				zoom: 17,
				duration: 1300,
				easing: 'ease-in-out',
				...options,
			});
		}
	};

	return {
		setMap,
		navigateTo,
	};
}
