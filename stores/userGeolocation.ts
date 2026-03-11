import type { MapLocation } from '~lib/types/map';

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isYandexMapReadyToInit } from 'vue-yandex-maps';

import { useToast } from '~/composables/use-toast';

const { toast } = useToast();

async function checkGeolocationPermission(): Promise<PermissionState> {
	if (!navigator.permissions) {
		return 'prompt';
	}

	try {
		const permission = await navigator.permissions.query({ name: 'geolocation' });
		return permission.state;
	}
	catch (error) {
		console.warn('Error checking geolocation permission:', error);
		return 'prompt';
	}
}
export const useGeolocationStore = defineStore('geolocation', () => {
	const location = ref<MapLocation>({
		center: [37.617635, 55.755814] as [number, number],
		zoom: 12,
	});
	const loading = ref(false);
	const error = ref<string | null>(null);

	async function getUserLocation() {
		loading.value = true;
		try {
			const permission = await checkGeolocationPermission();

			if (permission === 'denied') {
				throw new Error('Не удалось определить ваше точное местоположение. Разрешите отображение вашей геолокации в настройках или карта останется в режиме по умолчанию.', { cause: permission });
			}

			if (!isYandexMapReadyToInit.value) {
				throw new Error('Карта еще не загружена.');
			}

			await ymaps3.ready;

			const result = await ymaps3.geolocation.getPosition();

			if (!result?.coords) {
				throw new Error('Не удалось получить координаты.');
			}
			const lon = Number(result.coords[0]);
			const lat = Number(result.coords[1]);

			if (Number.isFinite(lon) && Number.isFinite(lat)) {
				location.value = {
					center: [lon, lat],
					zoom: 14,
				};
			}
			return location.value;
		}

		catch (err: any) {
			const errorMessage = 'Не удалось определить ваше местоположение.';
			console.warn(errorMessage, err);
			if (!err.cause) {
				toast({
					description: err.message || errorMessage,
					variant: 'destructive',
				});
			}
			else {
				error.value = err.message;
			}
		}
		finally {
			loading.value = false;
		}
	};

	return {
		location,
		loading,
		error,
		getUserLocation,
	};
});
