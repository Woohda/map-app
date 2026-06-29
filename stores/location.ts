/**
 * @module stores/location
 * @fileoverview Pinia store для управления локациями на карте
 *
 * ## Функциональность:
 * - 📍 Загрузка всех локаций с сервера
 * - 👤 Загрузка локаций текущего пользователя
 * - ⭐ Загрузка избранных локаций пользователя
 * - ➕ Добавление новых локаций (с откатом при ошибке)
 * - 🗑️ Удаление локаций пользователя
 * - ❤️ Добавление/удаление локаций в избранное
 * - 🎯 Выбор маркера на карте
 * - 📊 Управление состоянием загрузки
 * - 🔄 Принудительное обновление кластерера карты (UX)
 * - 📍 Режим добавления локации с draggable маркером
 *
 * ## Состояние:
 * - `markers` - массив всех маркеров на карте
 * - `selectedMarkerSlug` - slug выбранного маркера
 * - `loading` - статус загрузки всех локаций
 * - `userMarkers` - массив локаций текущего пользователя
 * - `userLoading` - статус загрузки локаций пользователя
 * - `favorites` - массив избранных локаций
 * - `favoritesLoading` - статус загрузки избранных локаций
 * - `pendingNavigationSlug` - slug для навигации
 * - `removingIds` - Set ID локаций в процессе удаления
 * - `refreshKeyClusterer` - ключ для принудительного обновления кластерера карты
 * - `isAddingLocation` - флаг активного режима добавления локации
 * - `draftMarkerCoordinates` - координаты draft маркера при добавлении
 * - `loadedMarkerIds` - Set ID загруженных маркеров (для оптимизации)
 * - `loadedUserMarkerIds` - Set ID загруженных маркеров пользователя (для оптимизации)
 * - `loadedFavoriteIds` - Set ID загруженных избранных маркеров (для оптимизации)
 *
 * ## Функции:
 * - `loadLocations()` - загрузка всех локаций с сервера
 * - `loadUserLocations()` - загрузка локаций пользователя
 * - `loadFavorites()` - загрузка избранных локаций
 * - `addLocation(locationData)` - добавление новой локации (с откатом при ошибке)
 * - `removeLocation(locationId)` - удаление локации пользователя
 * - `addToFavorites(locationId)` - добавление локации в избранное
 * - `removeFromFavorites(locationId)` - удаление локации из избранного
 * - `selectMapMarker(slug)` - выбор маркера на карте
 * - `setPendingNavigation(slug)` - установка slug для навигации
 * - `forceRefreshClusterer()` - принудительное обновление кластерера карты (UX)
 * - `startAddingLocation(center)` - активация режима добавления с draggable маркером
 * - `cancelAddingLocation()` - отмена режима добавления
 * - `confirmDraftLocation()` - подтверждение позиции draft маркера
 *
 * ## Использование:
 * ```typescript
 * const locationStore = useLocationStore();
 * // Загрузить все локации для карты
 * await locationStore.loadLocations();
 * // Загрузить локации пользователя для профиля
 * await locationStore.loadUserLocations();
 * // Удалить локацию
 * await locationStore.removeLocation(locationId);
 * // Принудительно обновить кластерер после UX операций
 * locationStore.forceRefreshClusterer();
 * // Начать добавление локации с draggable маркером (LngLat: [lon, lat])
 * locationStore.startAddingLocation([37.6176, 55.7558] as LngLat);
 * // Отменить добавление
 * locationStore.cancelAddingLocation();
 * // Подтвердить позицию draft маркера
 * const coords = locationStore.confirmDraftLocation();
 * ```
 */

import type { LngLat } from '@yandex/ymaps3-types';
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
	const favorites = ref<MapMarker[]>([]);
	const favoritesLoading = ref(false);
	const pendingNavigationSlug = ref<string | null>(null);
	const removingIds = ref<Set<string>>(new Set());
	const refreshKeyClusterer = ref(Date.now());
	const isAddingLocation = ref(false);
	const draftMarkerCoordinates = ref<[number, number] | null>(null);
	const loadedMarkerIds = ref<Set<string>>(new Set());
	const loadedUserMarkerIds = ref<Set<string>>(new Set());
	const loadedFavoriteIds = ref<Set<string>>(new Set());

	async function loadLocations() {
		loading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/locations', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			const newIds = new Set(locations.map(l => l.id));

			// Skip update if count and IDs are the same
			if (newIds.size === loadedMarkerIds.value.size
				&& [...newIds].every(id => loadedMarkerIds.value.has(id))) {
				return;
			}

			markers.value = locations.map(location => ({
				id: location.id,
				slug: location.slug,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
				userName: location.user.name,
				username: location.user.username,
				isFavorite: location.FavoriteLocation && location.FavoriteLocation.length > 0,
			}));

			loadedMarkerIds.value = newIds;
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
			const locations = await $fetch<LocationData[]>('/api/locations/user', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			const newIds = new Set(locations.map(l => l.id));

			if (newIds.size === loadedUserMarkerIds.value.size
				&& [...newIds].every(id => loadedUserMarkerIds.value.has(id))) {
				return;
			}

			userMarkers.value = locations.map(location => ({
				id: location.id,
				slug: location.slug,
				coordinates: [location.longitude, location.latitude] as [number, number],
				name: location.name,
				description: location.description,
				userName: location.user.name,
				username: location.user.username,
				isFavorite: location.FavoriteLocation && location.FavoriteLocation.length > 0,
			}));

			loadedUserMarkerIds.value = newIds;
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
		let newMarker: MapMarker | null = null;
		try {
			const newLocation = await $fetch<LocationData>('/api/locations', {
				credentials: 'include',
				method: 'POST',
				body: locationData,
			});

			newMarker = {
				id: newLocation.id,
				slug: newLocation.slug,
				coordinates: [newLocation.longitude, newLocation.latitude] as [number, number],
				name: newLocation.name,
				description: newLocation.description,
				userName: newLocation.user.name,
				username: newLocation.user.username,
				isFavorite: newLocation.FavoriteLocation && newLocation.FavoriteLocation.length > 0,
			};

			userMarkers.value.unshift(newMarker);
			markers.value.unshift(newMarker);
			loadedUserMarkerIds.value.add(newMarker.id);
			loadedMarkerIds.value.add(newMarker.id);

			forceRefreshClusterer();

			toast({
				description: `Локация "${newLocation.name}" добавлена!`,
				variant: 'success',
			});
			return newMarker;
		}
		catch (err: any) {
			if (newMarker) {
				userMarkers.value = userMarkers.value.filter(m => m.id !== newMarker!.id);
				markers.value = markers.value.filter(m => m.id !== newMarker!.id);
				loadedUserMarkerIds.value.delete(newMarker!.id);
				loadedMarkerIds.value.delete(newMarker!.id);
				forceRefreshClusterer();
			}
			toast({
				description: err?.response._data?.message || 'Ошибка добавления локации. Попробуйте еще раз',
				variant: 'destructive',
			});
			throw err;
		}
	}

	async function loadFavorites() {
		favoritesLoading.value = true;
		try {
			const response = await $fetch<Array<{ id: string; createdAt: Date; location: LocationData }>>('/api/favorites', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
			});

			const newIds = new Set(response.map(fav => fav.location.id));

			if (newIds.size === loadedFavoriteIds.value.size
				&& [...newIds].every(id => loadedFavoriteIds.value.has(id))) {
				return;
			}

			favorites.value = response.map(fav => ({
				id: fav.location.id,
				slug: fav.location.slug,
				coordinates: [fav.location.longitude, fav.location.latitude] as [number, number],
				name: fav.location.name,
				description: fav.location.description,
				userName: fav.location.user.name,
				username: fav.location.user.username,
				isFavorite: true,
			}));

			loadedFavoriteIds.value = newIds;
		}
		catch (err) {
			toast({
				description: `Избранные локации не загрузились, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error loading favorites:', err);
		}
		finally {
			favoritesLoading.value = false;
		}
	}

	async function addToFavorites(locationId: string) {
		try {
			await $fetch('/api/favorites', {
				credentials: 'include',
				method: 'POST',
				body: { locationId },
			});

			const marker = markers.value.find(m => m.id === locationId);
			if (marker) {
				marker.isFavorite = true;
				favorites.value.unshift({ ...marker, isFavorite: true });
				loadedFavoriteIds.value.add(locationId);
			}
			const userMarker = userMarkers.value.find(m => m.id === locationId);
			if (userMarker) {
				userMarker.isFavorite = true;
			}

			toast({
				description: `Локация добавлена в избранное!`,
				variant: 'success',
			});
		}
		catch (err) {
			toast({
				description: `Не удалось добавить в избранное, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error adding to favorites:', err);
			throw err;
		}
	}

	async function removeFromFavorites(locationId: string) {
		try {
			removingIds.value.add(locationId);
			await $fetch(`/api/favorites/${locationId}`, {
				credentials: 'include',
				method: 'DELETE',
			});

			const marker = markers.value.find(m => m.id === locationId);
			if (marker) {
				marker.isFavorite = false;
			}
			const userMarker = userMarkers.value.find(m => m.id === locationId);
			if (userMarker) {
				userMarker.isFavorite = false;
			}
			favorites.value = favorites.value.filter(m => m.id !== locationId);
			loadedFavoriteIds.value.delete(locationId);

			toast({
				description: `Локация удалена из избранного!`,
				variant: 'success',
			});
		}
		catch (err) {
			toast({
				description: `Не удалось удалить из избранного, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error removing from favorites:', err);
			throw err;
		}
		finally {
			removingIds.value.delete(locationId);
		}
	}

	async function removeLocation(locationId: string) {
		try {
			removingIds.value.add(locationId);
			await $fetch(`/api/locations/${locationId}`, {
				credentials: 'include',
				method: 'DELETE',
			});

			markers.value = markers.value.filter(m => m.id !== locationId);
			userMarkers.value = userMarkers.value.filter(m => m.id !== locationId);
			favorites.value = favorites.value.filter(m => m.id !== locationId);
			loadedUserMarkerIds.value.delete(locationId);
			loadedMarkerIds.value.delete(locationId);
			loadedFavoriteIds.value.delete(locationId);

			toast({
				description: `Локация удалена!`,
				variant: 'success',
			});
		}
		catch (err) {
			toast({
				description: `Не удалось удалить локацию, попробуйте еще раз!`,
				variant: 'destructive',
			});
			console.error('Error removing location:', err);
			throw err;
		}
		finally {
			removingIds.value.delete(locationId);
		}
	}

	function selectMapMarker(slug: string | null): void {
		selectedMarkerSlug.value = slug;
	}

	function setPendingNavigation(slug: string | null): void {
		pendingNavigationSlug.value = slug;
	}

	function forceRefreshClusterer() {
		refreshKeyClusterer.value = Date.now();
	}

	function startAddingLocation(center: LngLat) {
		isAddingLocation.value = true;
		draftMarkerCoordinates.value = [center[0], center[1]];
	}

	function cancelAddingLocation() {
		isAddingLocation.value = false;
		draftMarkerCoordinates.value = null;
	}

	function confirmDraftLocation() {
		isAddingLocation.value = false;
		return draftMarkerCoordinates.value;
	}

	return {
		markers,
		selectedMarkerSlug,
		loading,
		userMarkers,
		userLoading,
		favorites,
		favoritesLoading,
		pendingNavigationSlug,
		removingIds,
		refreshKeyClusterer,
		forceRefreshClusterer,
		isAddingLocation,
		draftMarkerCoordinates,
		startAddingLocation,
		cancelAddingLocation,
		confirmDraftLocation,
		addLocation,
		loadLocations,
		addToFavorites,
		removeFromFavorites,
		removeLocation,
		selectMapMarker,
		setPendingNavigation,
		loadFavorites,
		loadUserLocations,
	};
});
