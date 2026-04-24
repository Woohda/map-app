<script setup lang="ts">
import type { YMapClusterer } from '@yandex/ymaps3-clusterer';
import type { YMap } from '@yandex/ymaps3-types';
import type { MapClickEvent, MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { useGeolocationStore } from '~stores/userGeolocation';
import { computed, onMounted, ref, shallowRef, watch, watchEffect } from 'vue';
import {
	YandexMap,
	YandexMapClusterer,
	YandexMapControls,
	YandexMapDefaultFeaturesLayer,
	YandexMapDefaultSchemeLayer,
	YandexMapGeolocationControl,
	yandexMapIsLoaded,
	YandexMapListener,
	YandexMapMarker,
	YandexMapZoomControl,
} from 'vue-yandex-maps';

import AddLocation from '~/components/map/AddLocation.vue';
import MarkerInfo from '~/components/map/MarkerInfo.vue';
import PopupWrapper from '~/components/popup/PopupWrapper.vue';
import { useMapController } from '~/composables/useMapController';

const colorMode = useColorMode();
const map = shallowRef<null | YMap>(null);
const hasInteracted = ref(false);
const mapController = useMapController();
const clusterer = shallowRef<YMapClusterer | null>(null);
const gridSize = ref(10);
const clickedCoordinates = ref<MapClickEvent['coordinates'] | null>(null);
const popupStore = usePopupStore();
const authStore = useAuthUserStore();
const locationStore = useLocationStore();
const userGeolocationStore = useGeolocationStore();
const markers = computed(() => {
	return locationStore.markers;
});

onMounted(async () => {
	const unwatch = watch(yandexMapIsLoaded, async (loaded) => {
		if (loaded) {
			await locationStore.initializeLocations();
			const userLocation = await userGeolocationStore.getUserLocation();
			if (userLocation) {
				mapController.navigateTo(userLocation.center, { duration: 2500, zoom: 15 });
			}
			unwatch();
		}
	});
});

watch(map, (newMap) => {
	if (newMap) {
		mapController.setMap(newMap);
	}
});

watchEffect(() => {
	const err = userGeolocationStore.error;
	if (err) {
		popupStore.showErrorInfo(err);
	}
});

function handleMarkerClick(marker: MapMarker): void {
	locationStore.selectMapMarker(marker);
	popupStore.showMarkerInfo(marker);
	mapController.navigateTo(marker.coordinates);
}

function logMapDoubleClick(object: any, event: MapClickEvent): void {
	if (!authStore.isAuthenticated) {
		return;
	}
	if (!object || (object.type !== 'feature' && object.type !== 'marker')) {
		clickedCoordinates.value = event.coordinates;
		popupStore.showAddLocation(event.coordinates);
	}
}

function handleFirstInteraction(): void {
	if (!hasInteracted.value) {
		hasInteracted.value = true;
	}
}

function closePopup(): void {
	popupStore.clearPopup();
}
</script>

<template>
	<div class="relative h-full w-full overflow-hidden flex justify-center">
		<div
			v-if="!yandexMapIsLoaded"
			class="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/0 z-50"
		>
			<div class="flex items-center gap-2">
				<Spinner />
				<span class="text-sm text-muted-foreground">Загрузка карты...</span>
			</div>
		</div>
		<div
			v-if="userGeolocationStore.loading"
			class="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/0 z-50"
		>
			<div class="flex items-center gap-2">
				<Spinner />
				<span class="text-sm text-muted-foreground">Определение вашей геолокации...</span>
			</div>
		</div>

		<YandexMap
			v-model="map"
			:settings="{
				location: userGeolocationStore.location,
			}"
			width="100%"
			height="100%"
		>
			<YandexMapDefaultSchemeLayer :settings="{ theme: colorMode.value as 'dark' | 'light' }" />
			<YandexMapDefaultFeaturesLayer />
			<YandexMapListener
				:settings="{
					onDblClick: logMapDoubleClick,
					onMouseDown: handleFirstInteraction,
					onTouchStart: handleFirstInteraction,
					onTouchMove: handleFirstInteraction,
				}"
			/>

			<YandexMapClusterer
				v-model="clusterer"
				:grid-size="10 * gridSize"
				:zoom-on-cluster-click="{ duration: 800, easing: 'ease-in-out' }"
			>
				<YandexMapMarker
					v-for="marker in markers"
					:key="marker.id"
					:settings="{
						coordinates: marker.coordinates,
						onClick: () => handleMarkerClick(marker),
					}"
				>
					<Icon
						name="tabler:map-pin"
						size="40"
						class="text-primary transition-transform duration-300 hover:scale-120 cursor-pointer"
						:class="{
							'scale-135': locationStore.selectedMarker?.id === marker.id,
						}"
					/>
				</YandexMapMarker>
				<template #cluster="{ length }">
					<span
						class="flex justify-center items-center w-9 h-9 rounded-full border-2 border-primary bg-accent text-foreground cursor-pointer hover:scale-120 duration-300"
					>
						{{ length }}
					</span>
				</template>
			</YandexMapClusterer>

			<YandexMapControls :settings="{ position: 'right' }">
				<YandexMapZoomControl />
				<YandexMapGeolocationControl />
			</YandexMapControls>
		</YandexMap>

		<PopupWrapper
			:show="!!popupStore.popup.type"
			@close="closePopup"
		>
			<MarkerInfo
				v-if="popupStore.popup.type === 'markerInfo' && locationStore.selectedMarker"
				:marker="locationStore.selectedMarker"
			/>
			<AddLocation
				v-if="popupStore.popup.type === 'addLocation'"
				:coordinates="clickedCoordinates"
				:on-close="closePopup"
			/>
			<div
				v-if="popupStore.popup.type === 'errorInfo' && popupStore.popup.data"
				class="flex flex-col gap-1 items-center p-2"
			>
				<span class="text-lg font-semibold text-destructive self-start">
					<Icon name="tabler:alert-triangle" size="24" class="align-text-top" />
					Ошибка геолокации
				</span>
				<p class="text-sm text-muted-foreground">
					{{ String(popupStore.popup.data) }}
				</p>
			</div>
		</popupwrapper>
		<div
			v-if="!popupStore.popup.type && !hasInteracted"
			class="pointer-events-none absolute top-20 right-5"
		>
			<div
				class="flex flex-col gap-1 pointer-events-auto rounded-xl border bg-background/70 p-4 shadow-lg backdrop-blur-sm"
			>
				<h3 class="flex items-center gap-1 font-bold">
					<Icon name="tabler:map-pin" size="25" class="text-primary" />
					Карта объектов
				</h3>
				<p class="text-xs text-muted-foreground">
					Нажмите на маркер для деталей.
				</p>
				<p class="text-xs text-muted-foreground">
					Двойное нажатие для добавления новой локации.
				</p>
			</div>
		</div>
		<div
			v-if="locationStore.loading"
			class="absolute bottom-3 pointer-events-none"
		>
			<div
				class="flex gap-2 items-center pointer-events-auto rounded-xl border bg-background/70 py-2 px-3 shadow-lg backdrop-blur-sm"
			>
				<Spinner />
				<span class="text-sm">Загрузка локаций...</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
