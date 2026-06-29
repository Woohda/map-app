<script setup lang="ts">
import type { YMapClusterer } from '@yandex/ymaps3-clusterer';
import type { YMapDefaultMarker } from '@yandex/ymaps3-default-ui-theme';
import type { YMap } from '@yandex/ymaps3-types';
import type { Coordinates } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { useGeolocationStore } from '~stores/userGeolocation';
import { computed, provide, ref, shallowRef, watch } from 'vue';
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
	YandexMapZoomControl,
} from 'vue-yandex-maps';

import InfoCard from '~/components/location/card/InfoCard.vue';
import DraftMarker from '~/components/location/map/DraftMarker.vue';
import ClusterMarker from '~/components/location/map/markers/Cluster.vue';
import StandardMarker from '~/components/location/map/markers/Standard.vue';
import DraftControls from '~/components/location/panel/DraftControls.vue';
import AddLocation from '~/components/location/popup/AddLocation.vue';
import ErrorDetails from '~/components/location/popup/ErrorDetails.vue';
import LocationsList from '~/components/location/popup/LocationsList.vue';
import MarkerDetails from '~/components/location/popup/MarkerDetails.vue';
import LoadingIndicator from '~/components/shared/LoadingIndicator.vue';
import PopupWrapper from '~/components/shared/PopupWrapper.vue';
import { useMapController } from '~/composables/useMapController';
import { useMapEvents } from '~/composables/useMapEvents';
import { useMapInitialization } from '~/composables/useMapInitialization';
import { useMapMarkers } from '~/composables/useMapMarkers';

const route = useRoute();
const router = useRouter();

const map = shallowRef<null | YMap>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const draftMarker = shallowRef<YMapDefaultMarker | null>(null);

provide('draftMarker', draftMarker);

const hasInteracted = ref(false);
const clickedCoordinates = ref<Coordinates | null>(null);

provide('clickedCoordinates', clickedCoordinates);

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

useMapInitialization({
	locationStore,
	userGeolocationStore,
	mapController,
	popupStore,
});

const { handleMapDoubleClick, handleFirstInteraction } = useMapEvents({
	authStore,
	popupStore,
	clickedCoordinates,
	hasInteracted,
});

const { openMarkerBySlug, handleMarkerClick } = useMapMarkers({
	markers,
	locationStore,
	mapController,
	popupStore,
	route,
	router,
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

watch(
	() => route.query.location,
	(locationSlug) => {
		if (typeof locationSlug !== 'string' || markers.value.length === 0) {
			return;
		}
		openMarkerBySlug(locationSlug);
	},
);

async function closePopup(): Promise<void> {
	popupStore.clearPopup();
	if (route.query.location) {
		await router.replace({ query: {} });
	}
	locationStore.selectMapMarker(null);
	locationStore.forceRefreshClusterer();
	if (locationStore.isAddingLocation) {
		locationStore.cancelAddingLocation();
	}
}
</script>

<template>
	<div class="relative h-full w-full overflow-hidden flex justify-center">
		<LoadingIndicator
			v-if="!yandexMapIsLoaded"
			message="Загрузка карты..."
			:fullscreen="true"
			:show-backdrop="true"
		/>
		<LoadingIndicator
			v-if="userGeolocationStore.loading"
			message="Определение вашей геолокации..."
			:fullscreen="true"
			:show-backdrop="true"
		/>

		<YandexMap
			v-model="map"
			:settings="{
				location: userGeolocationStore.location,
			}"
			width="100%"
			height="100%"
		>
			<YandexMapListener
				:settings="{
					onDblClick: handleMapDoubleClick,
					onMouseDown: handleFirstInteraction,
					onTouchStart: handleFirstInteraction,
					onTouchMove: handleFirstInteraction,
				}"
			/>

			<YandexMapDefaultSchemeLayer
				:settings="{ theme: colorMode.value as 'dark' | 'light' }"
			/>
			<YandexMapDefaultFeaturesLayer />

			<YandexMapClusterer
				:key="locationStore.refreshKeyClusterer"
				v-model="clusterer"
				:grid-size="88"
				:zoom-on-cluster-click="{ duration: 1000, easing: 'ease-in-out' }"
			>
				<StandardMarker
					v-for="marker in markers"
					:key="marker.id"
					:marker="marker"
					:on-click="handleMarkerClick"
				/>
				<template #cluster="{ length }">
					<ClusterMarker :length="length" />
				</template>
			</YandexMapClusterer>

			<YandexMapControls :settings="{ position: 'right' }">
				<YandexMapZoomControl />
				<YandexMapGeolocationControl />
			</YandexMapControls>

			<DraftMarker />
		</YandexMap>

		<DraftControls />

		<PopupWrapper
			:show="!!popupStore.popup.type"
			:size="popupStore.popup.type === 'locationsList' ? 'wide' : 'default'"
			@close="closePopup"
		>
			<MarkerDetails
				v-if="popupStore.popup.type === 'markerInfo' && selectedMarker"
				:marker="selectedMarker"
			/>
			<AddLocation
				v-if="popupStore.popup.type === 'addLocation'"
				:coordinates="clickedCoordinates"
				:on-close="closePopup"
			/>
			<LocationsList
				v-if="popupStore.popup.type === 'locationsList'"
			/>
			<ErrorDetails />
		</PopupWrapper>

		<div
			v-if="
				!popupStore.popup.type
					&& !hasInteracted
					&& !locationStore.isAddingLocation
			"
			class="pointer-events-none absolute top-20 right-5"
		>
			<InfoCard />
		</div>
		<LoadingIndicator
			v-if="locationStore.loading"
			message="Загрузка локаций..."
		/>
	</div>
</template>

<style scoped></style>
