/**
 * @module stores/map
 * @fileoverview Pinia store для управления локациями на карте.
 * @description
 * Использует Composition API синтаксис (`defineStore('...', () => {...})`).
 * Обеспечивает реактивное управление маркерами, загрузкой данных и добавлением новых локаций.
 */

import type { LocationData } from '~lib/types/location';
import type { MapMarker } from '~lib/types/map';
import type { AddLocationValues } from '~lib/types/validation';

import { defineStore } from 'pinia';
import { ref } from 'vue';

import { toast } from '~/composables/use-toast';

export const useLocationStore = defineStore('location', () => {
	const markers = ref<MapMarker[]>([]);
	const loading = ref(false);

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

		markers.value.push(newMarker);
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
	return {
		markers,
		loading,
		addLocation,
		initializeLocations,
	};
});
