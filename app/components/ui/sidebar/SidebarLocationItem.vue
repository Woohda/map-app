<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

interface Props {
	location: MapMarker & { distance: number };
}

const props = defineProps<Props>();

const emit = defineEmits<{
	select: [location: MapMarker];
}>();

function handleLocationClick() {
	const { distance, ...marker } = props.location;
	emit('select', marker);
}
</script>

<template>
	<SidebarMenuItem>
		<SidebarMenuButton class="w-full flex justify-between items-center cursor-pointer px-1" @click="handleLocationClick">
			<div class="flex gap-1 items-center min-w-0 flex-1">
				<Icon name="tabler:map-pin" size="16" class="shrink-0 text-muted-foreground" />
				<span
					class="truncate transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 text-sm"
				>
					{{ location.name }}
				</span>
			</div>

			<span
				class="text-xs text-muted-foreground shrink-0 ml-0"
			>
				{{ location.distance.toFixed(1) }} км
			</span>
		</SidebarMenuButton>
	</SidebarMenuItem>
</template>
