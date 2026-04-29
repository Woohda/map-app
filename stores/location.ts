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
 * - 🔄 Инициализация при первом запуске
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
 *
 * ## Функции:
 * - `loadLocations()` - загрузка всех локаций с сервера
 * - `loadUserLocations()` - загрузка локаций пользователя
 * - `loadFavorites()` - загрузка избранных локаций
 * - `addLocation(locationData)` - добавление новой локации (с откатом при ошибке)
 * - `removeLocation(locationId)` - удаление локации пользователя
 * - `addToFavorites(locationId)` - добавление локации в избранное
 * - `removeFromFavorites(locationId)` - удаление локации из избранного
 * - `initializeLocations()` - инициализация всех локаций при первом запуске
 * - `initializeUserLocations()` - инициализация локаций пользователя в профиле
 * - `initializeFavorites()` - инициализация избранных локаций
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
 * await locationStore.initializeLocations();
 * // Загрузить локации пользователя для профиля
 * await locationStore.initializeUserLocations();
 * // Загрузить избранные локации
 * await locationStore.initializeFavorites();
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

	async function loadLocations() {
		loading.value = true;
		try {
			const locations = await $fetch<LocationData[]>('/api/locations', {
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
				isFavorite: location.FavoriteLocation && location.FavoriteLocation.length > 0,
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
			const locations = await $fetch<LocationData[]>('/api/locations/user', {
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
				isFavorite: location.FavoriteLocation && location.FavoriteLocation.length > 0,
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

			userMarkers.value.push(newMarker);
			markers.value.push(newMarker);

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

	async function initializeFavorites() {
		if (favorites.value.length === 0 && !favoritesLoading.value) {
			await loadFavorites();
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
		loadFavorites,
		removeFromFavorites,
		removeLocation,
		selectMapMarker,
		setPendingNavigation,
		initializeLocations,
		initializeUserLocations,
		initializeFavorites,
	};
});
