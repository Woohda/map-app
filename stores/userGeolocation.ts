/**
 * @module stores/userGeolocation
 * @fileoverview Pinia store для управления геолокацией пользователя
 *
 * ## Функциональность:
 * - 📍 Определение местоположения пользователя
 * - 🔍 Проверка разрешений на геолокацию
 * - ⚠️ Обработка ошибок геолокации
 * - 🗺️ Установка центра и зума карты
 * - 🔄 Управление состоянием загрузки
 * - 🚫 Предотвращение повторных ошибок в сессии
 *
 * ## Состояние:
 * - `location` - текущее местоположение (center, zoom)
 * - `loading` - статус получения геолокации
 * - `error` - сообщение об ошибке или null
 *
 * ## Функции:
 * - `getUserLocation()` - получение геолокации пользователя
 * - `checkGeolocationPermission()` - проверка разрешений
 * - `checkPermissionStatus()` - проверка статуса разрешений (granted/denied/prompt)
 * - `resetErrorFlag()` - сброс флага ошибки
 *
 * ## Использование:
 * ```typescript
 * const geolocationStore = useGeolocationStore();
 * await geolocationStore.getUserLocation();
 * ```
 */

import type { MapLocation } from '~lib/types/map';

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isYandexMapReadyToInit } from 'vue-yandex-maps';

import { useToast } from '~/composables/use-toast';

const { toast } = useToast();

const GEOLOCATION_ERROR_SESSION_KEY = 'geolocation_error_shown';

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
				throw new Error('Не удалось определить ваше точное местоположение. Разрешите доступ к вашему точному местоположению в настройках или карта останется в режиме по умолчанию.', { cause: permission });
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
				sessionStorage.removeItem(GEOLOCATION_ERROR_SESSION_KEY);
				error.value = null;
			}
			return location.value;
		}

		catch (err: unknown) {
			const errorMessage = 'Не удалось определить ваше местоположение.';
			console.warn(errorMessage, err);
			const errorInstance = err instanceof Error ? err : new Error(errorMessage);
			if ((err as { cause?: string }).cause === 'denied') {
				if (!sessionStorage.getItem(GEOLOCATION_ERROR_SESSION_KEY)) {
					error.value = errorInstance.message;
					sessionStorage.setItem(GEOLOCATION_ERROR_SESSION_KEY, 'true');
				}
			}
			else {
				toast({
					title: errorInstance.message || errorMessage,
					variant: 'destructive',
				});
			}
		}
		finally {
			loading.value = false;
		}
	}

	async function checkPermissionStatus(): Promise<boolean> {
		const permission = await checkGeolocationPermission();
		return permission === 'granted';
	}

	return {
		location,
		loading,
		error,
		getUserLocation,
		checkPermissionStatus,
	};
});
