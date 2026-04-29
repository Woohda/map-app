<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { YandexMapMarker } from 'vue-yandex-maps';

interface Props {
	marker: MapMarker;
	onClick: (marker: MapMarker) => void;
}

defineProps<Props>();

const locationStore = useLocationStore();
</script>

<template>
	<YandexMapMarker
		:settings="{
			coordinates: marker.coordinates,
			onClick: () => onClick(marker),
		}"
	>
		<Icon
			name="tabler:map-pin"
			size="40"
			class="text-primary transition-transform duration-200 hover:scale-125 cursor-pointer"
			:class="marker.slug === locationStore.selectedMarkerSlug ? 'scale-125' : 'scale-100'"
		/>
	</YandexMapMarker>
</template>

<style scoped></style>
