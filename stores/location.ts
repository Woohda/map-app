/**
 * @module stores/location
 * @fileoverview Pinia store для управления локациями на карте
 *
 * ## Функциональность:
 * - 📍 Загрузка всех локаций с сервера
 * - 👤 Загрузка локаций текущего пользователя
 * - ➕ Добавление новых локаций
 * - 🎯 Выбор маркера на карте
 * - 🔄 Инициализация при первом запуске
 * - 📊 Управление состоянием загрузки
 *
 * ## Состояние:
 * - `markers` - массив всех маркеров на карте
 * - `selectedMarker` - текущий выбранный маркер
 * - `loading` - статус загрузки всех локаций
 * - `userMarkers` - массив локаций текущего пользователя
 * - `userLoading` - статус загрузки локаций пользователя
 *
 * ## Функции:
 * - `loadLocations()` - загрузка всех локаций с сервера
 * - `loadUserLocations()` - загрузка локаций пользователя
 * - `addLocation(locationData)` - добавление новой локации (добавляет в оба массива)
 * - `initializeLocations()` - инициализация всех локаций при первом запуске
 * - `initializeUserLocations()` - инициализация локаций пользователя в профиле
 * - `selectMapMarker(marker)` - выбор маркера на карте
 *
 * ## Использование:
 * ```typescript
 * const locationStore = useLocationStore();
 * // Загрузить все локации для карты
 * await locationStore.initializeLocations();
 * // Загрузить локации пользователя для профиля
 * await locationStore.initializeUserLocations();
 * ```
 */

import type { LocationData } from '~lib/types/location';
import type { MapMarker } from '~lib/types/map';
import type { AddLocationValues } from '~lib/types/validation';

import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useToast } from '~/composables/use-toast';

export const useLocationStore = defineStore('location', () => {
	const { toast } = useToast();
	const markers = ref<MapMarker[]>([]);
	const selectedMarkerSlug = ref<string | null>(null);
	const loading = ref(false);
	const userMarkers = ref<MapMarker[]>([]);
	const userLoading = ref(false);
	const pendingNavigationSlug = ref<string | null>(null);

	async function loadLocations() {
		loading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/map/locations', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			markers.value = locations.map(location => ({
				id: location.id,
				slug: location.slug,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
				userName: location.user.name,
				username: location.user.username,
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

	async function loadUserLocations() {
		userLoading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/map/user-locations', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			userMarkers.value = locations.map(location => ({
				id: location.id,
				slug: location.slug,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
				userName: location.user.name,
				username: location.user.username,
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
			slug: newLocation.slug,
			coordinates: [newLocation.longitude, newLocation.latitude] as [number, number],
			name: newLocation.name,
			description: newLocation.description,
			userName: newLocation.user.name,
			username: newLocation.user.username,
		};

		markers.value.push(newMarker);
		userMarkers.value.push(newMarker);
		toast({
			description: `Локация "${newLocation.name}" сохранена!`,
			variant: 'success',
		});
		return newMarker;
	}
	async function initializeLocations() {
		if (markers.value.length === 0 && !loading.value) {
			await loadLocations();
		}
	}

	async function initializeUserLocations() {
		if (userMarkers.value.length === 0 && !userLoading.value) {
			await loadUserLocations();
		}
	}

	function selectMapMarker(slug: string | null): void {
		selectedMarkerSlug.value = slug;
	}

	function setPendingNavigation(slug: string | null): void {
		pendingNavigationSlug.value = slug;
	}

	return {
		markers,
		selectedMarkerSlug,
		loading,
		userMarkers,
		userLoading,
		pendingNavigationSlug,
		addLocation,
		selectMapMarker,
		setPendingNavigation,
		initializeLocations,
		initializeUserLocations,
	};
});
