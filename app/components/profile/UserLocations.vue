<script setup lang="ts">
import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { loadUserLocations } = useLocationStore();
const { userMarkers, userLoading } = storeToRefs(useLocationStore());

onMounted(async () => {
	await loadUserLocations();
});
</script>

<template>
	<div class="flex flex-col items-center">
		<div v-if="userLoading" class="flex items-center justify-center py-8">
			<Spinner />
		</div>

		<div
			v-else-if="userMarkers.length === 0"
			class="flex flex-col items-center gap-1 text-muted-foreground"
		>
			<Icon name="tabler:map-pin" size="48" class="opacity-50" />
			<p>У вас пока нет сохраненных локаций</p>
		</div>

		<div v-else class="w-full flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">
					Мои локации ({{ userMarkers.length }}):
				</h3>
			</div>

			<div class="grid gap-3">
				<div
					v-for="marker in userMarkers"
					:key="marker.id"
					class="group p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ffocus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] outline-none"
					tabindex="0"
					role="button"
					:aria-label="`Локация: ${marker.name}${marker.description ? `, ${marker.description}` : ''}`"
				>
					<div class="flex items-start gap-3">
						<div class="flex shrink-0">
							<Icon name="tabler:map-pin" size="20" class="text-primary" />
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
</template>
