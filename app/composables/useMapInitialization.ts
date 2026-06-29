import type { Coordinates } from '~lib/types/map';

import { onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { yandexMapIsLoaded } from 'vue-yandex-maps';

export function useMapInitialization(options: {
	locationStore: {
		loadLocations: () => Promise<void>;
	};
	userGeolocationStore: {
		getUserLocation: () => Promise<{ center: Coordinates; zoom: number } | undefined>;
		error: string | null;
	};
	mapController: {
		navigateTo: (coordinates: Coordinates) => void;
	};
	popupStore: {
		showErrorInfo: (error: string) => void;
	};
}) {
	const { locationStore, userGeolocationStore, mapController, popupStore } = options;

	let unsubscribeGeolocationError: (() => void) | null = null;

	onMounted(async () => {
		unsubscribeGeolocationError = watchEffect(() => {
			const err = userGeolocationStore.error;
			if (err) {
				popupStore.showErrorInfo(err);
			}
		});

		const unwatch = watch(yandexMapIsLoaded, async (loaded) => {
			if (loaded) {
				await locationStore.loadLocations();
				const userLocation = await userGeolocationStore.getUserLocation();
				if (userLocation) {
					mapController.navigateTo(userLocation.center);
				}
				unwatch();
			}
		});
	});

	onUnmounted(() => {
		unsubscribeGeolocationError?.();
	});
}
