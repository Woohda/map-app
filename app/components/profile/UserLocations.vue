<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const locationStore = useLocationStore();
const { initializeUserLocations } = locationStore;
const { userMarkers, userLoading } = storeToRefs(locationStore);

async function handleLocationClick(marker: MapMarker) {
	locationStore.setPendingNavigation(marker.slug);
	await navigateTo('/');
}

const listContainerRef = ref<HTMLDivElement>();
const containerMaxHeight = ref('auto');

function updateHeight() {
	if (!listContainerRef.value)
		return;

	const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
	const rect = listContainerRef.value.getBoundingClientRect();
	const topOffset = rect.top;
	const bottomPadding = 38;

	const availableHeight = viewportHeight - topOffset - bottomPadding;
	containerMaxHeight.value = `${Math.max(availableHeight, 200)}px`;
}

const containerStyle = computed(() => ({
	maxHeight: containerMaxHeight.value,
	overflowY: 'auto' as const,
}));

onMounted(async () => {
	await initializeUserLocations();
	updateHeight();

	window.addEventListener('resize', updateHeight);
	window.visualViewport?.addEventListener('resize', updateHeight);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateHeight);
	window.visualViewport?.removeEventListener('resize', updateHeight);
});
</script>

<template>
	<div class="flex flex-col">
		<div v-if="userLoading" class="flex items-center justify-center py-8">
			<Spinner size="lg" />
		</div>

		<div
			v-else-if="userMarkers.length === 0"
			class="flex flex-col items-center gap-1 text-muted-foreground"
		>
			<Icon name="tabler:map-pin" size="48" class="opacity-50" />
			<p>У вас пока нет сохраненных локаций</p>
		</div>

		<div v-else class="flex flex-col h-full gap-2">
			<div class="flex items-center justify-between shrink-0">
				<h3 class="text-lg font-semibold">
					Мои локации ({{ userMarkers.length }}):
				</h3>
			</div>

			<div
				ref="listContainerRef"
				class="flex flex-col"
				:style="containerStyle"
			>
				<div class="grid gap-2">
					<div
						v-for="marker in userMarkers"
						:key="marker.id"
						class="group p-2 mr-1 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] outline-none"
						tabindex="0"
						role="button"
						:aria-label="`Локация: ${marker.name}${marker.description ? `, ${marker.description}` : ''}`"
						@click="handleLocationClick(marker)"
						@keydown.enter="handleLocationClick(marker)"
					>
						<div class="flex items-center gap-1">
							<div class="flex shrink-0">
								<Icon name="tabler:map-pin" size="40" class="text-primary" />
							</div>
							<div class="flex-1 min-w-0">
								<h4
									class="font-medium truncate group-hover:text-primary transition-colors"
								>
									{{ marker.name }}
								</h4>
								<p
									v-if="marker.description"
									class="text-sm text-muted-foreground mt-1 line-clamp-2"
								>
									{{ marker.description }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
