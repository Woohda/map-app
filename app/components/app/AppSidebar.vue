<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useLocationStore } from '~stores/location';
import { usePopupStore } from '~stores/popup';
import { useGeolocationStore } from '~stores/userGeolocation';
import { computed } from 'vue';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import SidebarLocationItem from '~/components/ui/sidebar/SidebarLocationItem.vue';
import { useMapController } from '~/composables/useMapController';
import { calculateDistance } from '~/utils/utils';

const route = useRoute();
const { isMobile, state } = useSidebar();
const locationStore = useLocationStore();
const popupStore = usePopupStore();
const userGeolocationStore = useGeolocationStore();
const mapController = useMapController();

const nearestLocations = computed(() => {
	if (!userGeolocationStore.location.center || locationStore.markers.length === 0) {
		return [];
	}

	const [userLon, userLat] = userGeolocationStore.location.center;

	return locationStore.markers
		.map((marker) => {
			const [markerLon, markerLat] = marker.coordinates;
			const distance = calculateDistance(userLat, userLon, markerLat, markerLon);
			return { ...marker, distance };
		})
		.filter(location => location.distance <= 10) // Только в радиусе 10 км
		.sort((a, b) => a.distance - b.distance)
		.slice(0, 5); // Максимум 5 ближайших
});

function handleLocationSelect(marker: MapMarker) {
	locationStore.selectMapMarker(marker);
	popupStore.showMarkerInfo(marker);
	mapController.navigateTo(marker.coordinates);
}

const items = [
	{
		title: 'Локации',
		url: '#',
		icon: 'tabler:map',
	},
	{
		title: 'Добавить локацию',
		url: '#',
		icon: 'tabler:map-pin',
	},
];
</script>

<template>
	<Sidebar v-if="['/'].includes(route.path) || (isMobile && ['/profile'].includes(route.path))" variant="floating" collapsible="icon">
		<SidebarContent>
			<SidebarTrigger />
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton as-child size="lg" class="px-1">
								<NuxtLink class="flex items-center cursor-pointer">
									<Icon :name="item.icon" size="23" class="shrink-0" />
									<span
										class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-2 overflow-hidden whitespace-nowrap"
									>
										{{ item.title }}
									</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
			<Separator v-if="state === 'expanded'" />
			<SidebarGroup v-if="nearestLocations.length > 0 && state === 'expanded'">
				<SidebarGroupLabel>Ближайшие локации:</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarLocationItem
							v-for="location in nearestLocations"
							:key="location.id"
							:location="location"
							@select="handleLocationSelect"
						/>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>

<style scoped></style>
