<script setup lang="ts">
import type { YMapClusterer } from '@yandex/ymaps3-clusterer';
import type { YMap } from '@yandex/ymaps3-types';
import type { DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import type { MapClickEvent, MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { useGeolocationStore } from '~stores/userGeolocation';
import { computed, onMounted, onUnmounted, ref, shallowRef, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { Spinner } from '~/components/ui/loader';
import { useMapController } from '~/composables/useMapController';

const GRID_SIZE = 10;
let unsubscribeGeolocationError: (() => void) | null = null;

const route = useRoute();
const router = useRouter();

const map = shallowRef<null | YMap>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);

const hasInteracted = ref(false);
const clickedCoordinates = ref<MapClickEvent['coordinates'] | null>(null);

const colorMode = useColorMode();
const popupStore = usePopupStore();
const authStore = useAuthUserStore();
const locationStore = useLocationStore();
const userGeolocationStore = useGeolocationStore();
const mapController = useMapController();

const markers = computed(() => {
	return locationStore.markers;
});
const selectedMarker = computed(() =>
	markers.value.find(m => m.slug === locationStore.selectedMarkerSlug),
);

onMounted(async () => {
	unsubscribeGeolocationError = watchEffect(() => {
		const err = userGeolocationStore.error;
		if (err) {
			popupStore.showErrorInfo(err);
		}
	});

	const unwatch = watch(yandexMapIsLoaded, async (loaded) => {
		if (loaded) {
			await locationStore.initializeLocations();
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

watch(map, (newMap) => {
	if (newMap) {
		mapController.setMap(newMap);

		const pendingSlug = locationStore.pendingNavigationSlug;
		if (pendingSlug && markers.value.length > 0) {
			openMarkerBySlug(pendingSlug);
			locationStore.setPendingNavigation(null);
		}
	}
});

function openMarkerBySlug(slug: string): void {
	const marker = markers.value.find(m => m.slug === slug);
	if (!marker) {
		return;
	}

	mapController.navigateTo(marker.coordinates);

	if (locationStore.selectedMarkerSlug !== slug) {
		handleMarkerClick(marker);
	}
}

watch(
	() => route.query.location,
	(locationSlug) => {
		if (typeof locationSlug !== 'string' || markers.value.length === 0) {
			return;
		}
		openMarkerBySlug(locationSlug);
	},
);

function handleMarkerClick(marker: MapMarker): void {
	locationStore.selectMapMarker(marker.slug);
	popupStore.showMarkerInfo(marker);
	if (route.query.location !== marker.slug) {
		router.replace({ query: { location: marker.slug } });
	}
}

function handleMapDoubleClick(
	object: DomEventHandlerObject,
	event: MapClickEvent,
): void {
	if (!authStore.isAuthenticated) {
		return;
	}
	const type = object?.type;
	if (!type || (type !== 'feature' && type !== 'marker')) {
		clickedCoordinates.value = event.coordinates;
		popupStore.showAddLocation(event.coordinates);
	}
}

function handleFirstInteraction(): void {
	if (!hasInteracted.value) {
		hasInteracted.value = true;
	}
}

async function closePopup(): Promise<void> {
	popupStore.clearPopup();
	if (route.query.location) {
		await router.replace({ query: {} });
	}
	locationStore.selectMapMarker(null);
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
			<YandexMapDefaultSchemeLayer
				:settings="{ theme: colorMode.value as 'dark' | 'light' }"
			/>
			<YandexMapDefaultFeaturesLayer />
			<YandexMapListener
				:settings="{
					onDblClick: handleMapDoubleClick,
					onMouseDown: handleFirstInteraction,
					onTouchStart: handleFirstInteraction,
					onTouchMove: handleFirstInteraction,
				}"
			/>

			<YandexMapClusterer
				v-model="clusterer"
				:grid-size="10 * GRID_SIZE"
				:zoom-on-cluster-click="{ duration: 1000, easing: 'ease-in-out' }"
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
						class="text-primary transition-transform duration-300 hover:scale-125 cursor-pointer"
					/>
				</YandexMapMarker>
				<template #cluster="{ length }">
					<span
						class="flex justify-center items-center w-9 h-9 rounded-full border-2 border-primary bg-accent text-foreground cursor-pointer hover:scale-125 duration-300"
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

		<PopupWrapper :show="!!popupStore.popup.type" @close="closePopup">
			<MarkerInfo
				v-if="popupStore.popup.type === 'markerInfo' && selectedMarker"
				:marker="selectedMarker"
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
		</PopupWrapper>
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

<style scoped></style>
