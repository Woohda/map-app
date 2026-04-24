/**
 * @module stores/location
 * @fileoverview Pinia store для управления локациями на карте
 *
 * ## Функциональность:
 * - 📍 Загрузка локаций с сервера
 * - ➕ Добавление новых локаций
 * - 🎯 Выбор маркера на карте
 * - 🔄 Инициализация при первом запуске
 * - 📊 Управление состоянием загрузки
 *
 * ## Состояние:
 * - `markers` - массив всех маркеров на карте
 * - `selectedMarker` - текущий выбранный маркер
 * - `loading` - статус загрузки локаций
 *
 * ## Функции:
 * - `loadLocations()` - загрузка локаций с сервера
 * - `addLocation(locationData)` - добавление новой локации
 * - `initializeLocations()` - инициализация при первом запуске
 * - `selectMapMarker(marker)` - выбор маркера на карте
 *
 * ## Использование:
 * ```typescript
 * const locationStore = useLocationStore();
 * await locationStore.loadLocations();
 * ```
 */

import type { LocationData } from '~lib/types/location';
import type { MapMarker } from '~lib/types/map';
import type { AddLocationValues } from '~lib/types/validation';

import { defineStore } from 'pinia';
import { ref } from 'vue';

import { toast } from '~/composables/use-toast';

export const useLocationStore = defineStore('location', () => {
	const markers = ref<MapMarker[]>([]);
	const selectedMarker = ref<MapMarker | null>(null);
	const loading = ref(false);
	const userMarkers = ref<MapMarker[]>([]);
	const userLoading = ref(false);

	async function loadLocations(): Promise<void> {
		loading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/map/locations', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			markers.value = locations.map(location => ({
				id: location.id,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
			}));
		}
		catch (err) {
			toast({
				description: `Локации не загрузились, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error loading locations:', err);
		}
		finally {
			loading.value = false;
		}
	}

	async function loadUserLocations(): Promise<void> {
		userLoading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/map/user-locations', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			userMarkers.value = locations.map(location => ({
				id: location.id,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
			}));
		}
		catch (err) {
			toast({
				description: `Локации пользователя не загрузились, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error loading user locations:', err);
		}
		finally {
			userLoading.value = false;
		}
	}

	async function addLocation(locationData: AddLocationValues,
	): Promise<MapMarker> {
		const newLocation = await $fetch<LocationData>('/api/map/add-location', {
			credentials: 'include',
			method: 'POST',
			body: locationData,
		});

		const newMarker: MapMarker = {
			id: newLocation.id,
			coordinates: [newLocation.longitude, newLocation.latitude] as [number, number],
			name: newLocation.name,
			description: newLocation.description,
		};

		userMarkers.value.push(newMarker);
		toast({
			description: `Локация "${newLocation.name}" сохранена!`,
			variant: 'success',
		});
		return newMarker;
	}

	async function initializeLocations(): Promise<void> {
		if (markers.value.length === 0 && !loading.value) {
			await loadLocations();
		}
	}

	function selectMapMarker(marker: MapMarker): void {
		selectedMarker.value = marker;
	}

	return {
		markers,
		selectedMarker,
		loading,
		userMarkers,
		userLoading,
		loadLocations,
		loadUserLocations,
		addLocation,
		selectMapMarker,
		initializeLocations,
	};
});
