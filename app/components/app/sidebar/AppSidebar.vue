<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useMediaQuery } from '@vueuse/core';
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
const { isMobile, state, setOpenMobile, toggleSidebar } = useSidebar();
const isSmallScreen = useMediaQuery('(max-width: 768px)');

const authStore = useAuthUserStore();
const { isAuthenticated } = storeToRefs(authStore);
const locationStore = useLocationStore();
const popupStore = usePopupStore();
const userGeolocationStore = useGeolocationStore();

const mapController = useMapController();

const COLLAPSED_TEXT_CLASS = 'flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-1 overflow-hidden whitespace-nowrap';

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
  closeSidebarOnMobile();
}

function handleLocationsClick() {
  popupStore.showLocationsList();
  if (isMobile) {
    setOpenMobile(false);
  }
  else {
    toggleSidebar();
  }
}

function handleAddLocation() {
  const center = mapController.getCenter() || userGeolocationStore.location.center;
  locationStore.startAddingLocation(center);
  closeSidebarOnMobile();
}

function closeSidebarOnMobile() {
  if (isMobile) {
    setOpenMobile(false);
  }
}

const navItems = [
  {
    title: 'Локации',
    url: '#',
    icon: 'tabler:map',
    onClick: handleLocationsClick,
  },
  {
    title: 'Добавить локацию',
    icon: 'tabler:map-pin-plus',
    onClick: handleAddLocation,
    requiresAuth: true,
  },
];

const filteredNavItems = computed(() =>
  navItems.filter(item => !item.requiresAuth || isAuthenticated.value),
);

const mobileMenuItems = [
  { title: 'Профиль', to: '/profile', icon: 'tabler:user' },
  { title: 'Выйти', onClick: () => authStore.logout(), icon: 'tabler:logout' },
];
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
            <SidebarMenuItem
              v-for="item in filteredNavItems"
              :key="item.title"
            >
              <SidebarMenuButton
                v-if="item.onClick"
                size="lg"
                class="px-1"
                @click="item.onClick"
              >
                <Icon :name="item.icon" size="22" class="shrink-0" />
                <span :class="COLLAPSED_TEXT_CLASS">
                  {{ item.title }}
                </span>
              </SidebarMenuButton>
              <SidebarMenuButton
                v-else
                as-child
                size="lg"
                class="px-1"
              >
                <NuxtLink :to="item.url">
                  <Icon :name="item.icon" size="22" class="shrink-0" />
                  <span :class="COLLAPSED_TEXT_CLASS">
                    {{ item.title }}
                  </span>
                </NuxtLink>
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
      <Separator v-if="isAuthenticated && isSmallScreen" />
      <SidebarGroup v-if="isAuthenticated && isSmallScreen">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in mobileMenuItems" :key="item.title">
              <SidebarMenuButton
                v-if="item.to"
                as-child
                size="lg"
                class="px-1"
              >
                <NuxtLink :to="item.to" class="flex items-center cursor-pointer">
                  <Icon :name="item.icon" size="22" class="shrink-0" />
                  <span :class="COLLAPSED_TEXT_CLASS">
                    {{ item.title }}
                  </span>
                </NuxtLink>
              </SidebarMenuButton>
              <SidebarMenuButton
                v-else
                size="lg"
                class="px-1"
                @click="item.onClick"
              >
                <Icon :name="item.icon" size="22" class="shrink-0" />
                <span :class="COLLAPSED_TEXT_CLASS">
                  {{ item.title }}
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
