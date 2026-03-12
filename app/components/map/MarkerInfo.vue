<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

interface Props {
	marker: MapMarker;
}

defineProps<Props>();
</script>

<template>
	<div class="flex flex-col gap-2 p-1">
		<h3 class="text-xl font-bold">
			{{ marker.name }}
		</h3>
		<p class="text-muted-foreground">
			{{ marker.description }}
		</p>
		<div class="flex justify-center">
			<Button size="sm" variant="outline" class="w-1/2">
				<Icon name="tabler:route" class="mr-2 h-4 w-4" />
				Маршрут
			</Button>
		</div>
	</div>
</template>
