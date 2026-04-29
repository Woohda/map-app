<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
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
} from '~/components/ui/sidebar';
import SidebarLocationItem from '~/components/ui/sidebar/SidebarLocationItem.vue';
import { useMapController } from '~/composables/useMapController';
import { calculateDistance } from '~/utils/utils';

const route = useRoute();
const { isMobile, state, setOpenMobile } = useSidebar();

const authStore = useAuthUserStore();
const { isAuthenticated } = storeToRefs(authStore);
const locationStore = useLocationStore();
const popupStore = usePopupStore();
const userGeolocationStore = useGeolocationStore();

const mapController = useMapController();

const nearestLocations = computed(() => {
	if (
		!userGeolocationStore.location.center
		|| locationStore.markers.length === 0
	) {
		return [];
	}

	const [userLon, userLat] = userGeolocationStore.location.center;

	return locationStore.markers
		.map((marker) => {
			const [markerLon, markerLat] = marker.coordinates;
			const distance = calculateDistance(
				userLat,
				userLon,
				markerLat,
				markerLon,
			);
			return { ...marker, distance };
		})
		.filter(location => location.distance <= 10)
		.sort((a, b) => a.distance - b.distance)
		.slice(0, 5);
});

function handleLocationSelect(marker: MapMarker) {
	locationStore.selectMapMarker(marker.slug);
	popupStore.showMarkerInfo(marker);
	mapController.navigateTo(marker.coordinates);
	if (isMobile) {
		setOpenMobile(false);
	}
}

const items = [
	{
		title: 'Локации',
		url: '#',
		icon: 'tabler:map',
	},
];

function handleAddLocation() {
	const center = mapController.getCenter();
	if (center) {
		locationStore.startAddingLocation(center);
	}
	else {
		const [lon, lat] = userGeolocationStore.location.center;
		locationStore.startAddingLocation([lon, lat]);
	}
	if (isMobile) {
		setOpenMobile(false);
	}
}
</script>

<template>
	<Sidebar
		v-if="
			['/'].includes(route.path)
				|| (isMobile && ['/profile'].includes(route.path))
		"
		variant="floating"
		collapsible="icon"
	>
		<SidebarContent>
			<SidebarTrigger v-if="!isMobile" />
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton as-child size="lg" class="px-1">
								<NuxtLink>
									<Icon :name="item.icon" size="22" class="shrink-0" />
									<span
										class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-1 overflow-hidden whitespace-nowrap"
									>
										{{ item.title }}
									</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem v-if="isAuthenticated">
							<SidebarMenuButton
								size="lg"
								class="px-1"
								@click="handleAddLocation"
							>
								<Icon name="tabler:map-pin-plus" size="22" class="shrink-0" />
								<span
									class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-1 overflow-hidden whitespace-nowrap"
								>
									Добавить локацию
								</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
			<Separator v-if="state === 'expanded'" />
			<SidebarGroup
				v-if="nearestLocations.length > 0"
				:aria-hidden="state !== 'expanded'"
				class="transition-all duration-400 ease-in-out"
				:class="[
					state === 'expanded'
						? 'opacity-100 max-h-96'
						: 'opacity-0 max-h-0 pointer-events-none',
				]"
			>
				<SidebarGroupLabel> Ближайшие локации: </SidebarGroupLabel>
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
			<Separator v-if="isAuthenticated && isMobile" />
			<SidebarGroup v-if="isAuthenticated && isMobile">
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton as-child size="lg" class="px-1">
								<NuxtLink
									to="/profile"
									class="flex items-center cursor-pointer"
								>
									<Icon name="tabler:user" size="22" class="shrink-0" />
									<span
										class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-1 overflow-hidden whitespace-nowrap"
									>
										Профиль
									</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								class="px-1"
								@click="authStore.logout"
							>
								<Icon name="tabler:logout" size="22" class="shrink-0" />
								<span
									class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-1 overflow-hidden whitespace-nowrap"
								>
									Выйти
								</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>

<style scoped></style>
