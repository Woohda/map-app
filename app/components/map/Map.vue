<script setup lang="ts">
import type { YMapClusterer } from '@yandex/ymaps3-clusterer';
import type { YMap, YMapTheme } from '@yandex/ymaps3-types';
import type { MapClickEvent, MapLocation, MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { usePopupStore } from '~stores/popup';
import { ref, shallowRef } from 'vue';
import {
	YandexMap,
	YandexMapClusterer,
	YandexMapControls,
	YandexMapDefaultFeaturesLayer,
	YandexMapDefaultSchemeLayer,
	YandexMapGeolocationControl,
	YandexMapListener,
	YandexMapMarker,
	YandexMapZoomControl,
} from 'vue-yandex-maps';

import AddLocation from '~/components/map/AddLocation.vue';
import MarkerInfo from '~/components/map/MarkerInfo.vue';
import PopupWrapper from '~/components/popup/PopupWrapper.vue';

const colorMode = useColorMode();
const map = shallowRef<null | YMap>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const gridSize = ref(11);
const popupStore = usePopupStore();
const authStore = useAuthUserStore();
const selectedMarker = ref<MapMarker | null>(null);
const clickedCoordinates = ref<MapClickEvent['coordinates'] | null>(null);

const location = ref<MapLocation>({
	center: [37.617635, 55.755814],
	zoom: 12,
});

const markers = ref<MapMarker[]>([
	{
		id: '1',
		coordinates: [37.617635, 55.755814],
		name: 'Moscow Center',
		description: 'The heart of Russia',
	},
	{
		id: '12',
		coordinates: [37.537, 55.749],
		name: 'Moscow City',
		description: 'Business district',
	},
]);

function handleMarkerClick(marker: MapMarker): void {
	selectedMarker.value = marker;
	popupStore.showMarkerInfo();
}

function logMapDoubleClick(object: any, event: MapClickEvent): void {
	if (!authStore.isAuthenticated) {
		return;
	}
	if (!object || (object.type !== 'feature' && object.type !== 'marker')) {
		clickedCoordinates.value = event.coordinates;
		popupStore.showAddLocation();
	}
}

function closePopup(): void {
	popupStore.clearPopup();
	selectedMarker.value = null;
	clickedCoordinates.value = null;
}

async function handleAddLocation(): Promise<void> {

}
</script>

<template>
	<div class="relative h-full w-full overflow-hidden">
		<YandexMap
			v-model="map"
			:settings="{
				location,
			}"
			width="100%"
			height="100%"
		>
			<YandexMapDefaultSchemeLayer :settings="{ theme: colorMode.value as YMapTheme }" />
			<YandexMapDefaultFeaturesLayer />
			<YandexMapListener :settings="{ onDblClick: logMapDoubleClick }" />

			<YandexMapClusterer
				v-model="clusterer"
				:grid-size="2 ** gridSize"
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
							'scale-135': selectedMarker?.id === marker.id,
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
				v-if="popupStore.popup.type === 'markerInfo' && selectedMarker"
				:marker="selectedMarker"
			/>
			<AddLocation
				v-if="popupStore.popup.type === 'addLocation'"
				:coordinates="clickedCoordinates"
				:on-close="closePopup"
				:on-submit="handleAddLocation"
			/>
		</PopupWrapper>
		<div
			v-if="!popupStore.popup.type"
			class="pointer-events-none absolute top-20 right-5"
		>
			<div
				class="flex flex-col gap-1 pointer-events-auto rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur-sm"
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
	</div>
</template>

<style scoped>
</style>
