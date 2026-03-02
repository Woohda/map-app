<script setup lang="ts">
import type { YMapClusterer } from '@yandex/ymaps3-clusterer';
import type { LngLat, YMap, YMapTheme } from '@yandex/ymaps3-types';

import { ref, shallowRef } from 'vue';
import {
	YandexMap,
	YandexMapClusterer,
	YandexMapControls,
	YandexMapDefaultFeaturesLayer,
	YandexMapDefaultSchemeLayer,
	YandexMapGeolocationControl,
	YandexMapMarker,
	YandexMapZoomControl,
} from 'vue-yandex-maps';

const colorMode = useColorMode();
const map = shallowRef<null | YMap>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const gridSize = ref(11);

const location = ref({
	center: [37.617635, 55.755814],
	zoom: 12,
});

const selectedMarker = ref<any>(null);

const markers = ref([
	{
		id: 1,
		coordinates: [37.617635, 55.755814] as LngLat,
		title: 'Moscow Center',
		description: 'The heart of Russia',
	},
	{
		id: 2,
		coordinates: [37.537, 55.749] as LngLat,
		title: 'Moscow City',
		description: 'Business district',
	},
]);

function handleMarkerClick(marker: any) {
	selectedMarker.value = marker;
}

function closeInfo() {
	selectedMarker.value = null;
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

			<YandexMapClusterer
				v-model="clusterer"
				:grid-size="2 ** gridSize"
				zoom-on-cluster-click
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
						class="flex justify-center items-center w-9 h-9 rounded-full border-2 hover:border-primary duration-300 bg-muted text-foreground cursor-pointer"
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

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="selectedMarker"
				class="absolute top-6 left-1/2 w-full max-w-sm -translate-x-1/2 px-4"
			>
				<div
					class="relative rounded-2xl border bg-background/95 p-6 shadow-2xl backdrop-blur-md"
				>
					<button
						class="absolute top-4 right-4 rounded-full p-1 hover:bg-muted"
						@click="closeInfo"
					>
						<Icon name="tabler:x" class="h-5 w-5" />
					</button>
					<h3 class="mb-2 text-xl font-bold">
						{{ selectedMarker.title }}
					</h3>
					<p class="text-muted-foreground">
						{{ selectedMarker.description }}
					</p>
					<div class="mt-4 flex gap-2">
						<Button size="sm" variant="outline" class="w-full">
							<Icon name="tabler:route" class="mr-2 h-4 w-4" />
							Маршрут
						</Button>
					</div>
				</div>
			</div>
		</Transition>

		<div
			v-if="!selectedMarker"
			class="pointer-events-none absolute top-20 right-5"
		>
			<div
				class="pointer-events-auto rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur-sm"
			>
				<h3 class="flex items-center gap-2 font-bold">
					<Icon name="tabler:map-pin" class="h-5 w-5 text-primary" />
					Карта объектов
				</h3>
				<p class="text-xs text-muted-foreground">
					Нажмите на маркер для деталей
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
