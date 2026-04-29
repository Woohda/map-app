<script setup lang="ts">
import type { YMapDefaultMarker } from '@yandex/ymaps3-default-ui-theme';
import type { Coordinates } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { inject } from 'vue';

import Button from '~/components/ui/button/Button.vue';

const locationStore = useLocationStore();
const popupStore = usePopupStore();

const draftMarker = inject<ReturnType<typeof import('vue').shallowRef<YMapDefaultMarker | null>>>('draftMarker');
const clickedCoordinates = inject<ReturnType<typeof import('vue').ref<Coordinates | null>>>('clickedCoordinates');

function handleDraftMarkerConfirm(): void {
	if (!draftMarker?.value)
		return;
	const coordinates = draftMarker.value.coordinates;
	if (clickedCoordinates) {
		clickedCoordinates.value = coordinates;
	}
	locationStore.confirmDraftLocation();
	popupStore.showAddLocation(coordinates);
}

function cancelAddingLocation(): void {
	locationStore.cancelAddingLocation();
}
</script>

<template>
	<div
		v-if="locationStore.isAddingLocation"
		class="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 z-50"
	>
		<div
			class="flex items-center gap-3 pointer-events-auto rounded-xl border bg-background/90 p-3 shadow-lg backdrop-blur-sm"
		>
			<span class="text-sm text-muted-foreground">Перетащите маркер, затем нажмите</span>
			<Button
				variant="default"
				@click="handleDraftMarkerConfirm"
			>
				Добавить
			</Button>
			<Button
				variant="outline"
				@click="cancelAddingLocation"
			>
				Отмена
			</Button>
		</div>
	</div>
</template>

<style scoped></style>
