<script setup lang="ts">
import type { MapMarker } from '~lib/types/map';

import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { useRouteStore } from '~stores/route';
import { useGeolocationStore } from '~stores/userGeolocation';
import { storeToRefs } from 'pinia';

import Button from '~/components/ui/button/Button.vue';
import { useToast } from '~/composables/use-toast';
import { useRouteBuilder } from '~/composables/useRouteBuilder';

interface Props {
  marker: MapMarker;
}

const props = defineProps<Props>();

const { toast } = useToast();
const { currentUser } = storeToRefs(useAuthUserStore());
const locationStore = useLocationStore();
const { markers } = storeToRefs(locationStore);
const userGeolocationStore = useGeolocationStore();
const routeStore = useRouteStore();

const isCurrentUser = computed(() => {
  return currentUser.value?.username === props.marker.username;
});

const isFavorite = computed(() => {
  const markerInStore = markers.value.find(m => m.id === props.marker.id);
  return markerInStore?.isFavorite || props.marker.isFavorite || false;
});
const isLoading = ref(false);
const isDescriptionExpanded = ref(false);

const { loading: routeLoading, buildRoute } = useRouteBuilder();

async function toggleFavorite() {
  if (!currentUser.value)
    return;
  isLoading.value = true;
  try {
    if (isFavorite.value) {
      await locationStore.removeFromFavorites(props.marker.id);
    }
    else {
      await locationStore.addToFavorites(props.marker.id);
    }
  }
  catch (error) {
    console.error('Error toggling favorite:', error);
  }
  finally {
    isLoading.value = false;
  }
}

async function handleRouteClick() {
  try {
    const hasPermission = await userGeolocationStore.checkPermissionStatus();

    if (!hasPermission) {
      toast({
        title: 'Геолокация недоступна',
        description: 'Разрешите трансляцию своей геолокации для построения маршрута',
        variant: 'destructive',
      });
      return;
    }

    if (!userGeolocationStore.location.center) {
      toast({
        title: 'Геолокация недоступна',
        description: 'Не удалось определить ваше местоположение',
        variant: 'destructive',
      });
      return;
    }

    routeStore.clearRoute();
    const newRoute = await buildRoute(userGeolocationStore.location.center, props.marker.coordinates);

    if (newRoute) {
      routeStore.setRoute(newRoute);
      toast({
        title: 'Маршрут построен',
        description: 'Маршрут от вашего местоположения до выбранной метки',
      });
    }
  }
  catch (error) {
    console.error('Error building route:', error);
    toast({
      title: 'Ошибка построения маршрута',
      description: error instanceof Error ? error.message : 'Не удалось построить маршрут',
      variant: 'destructive',
    });
  }
}
</script>

<template>
  <div class="flex flex-col gap-1 p-2">
    <div class="flex flex-col items-center justify-between">
      <div class="w-full flex flex-col gap-2">
        <h3
          class="pr-6 text-xl font-bold line-clamp-2 break-words hyphens-auto"
        >
          {{ marker.name }}
        </h3>
        <p
          class="text-muted-foreground break-words hyphens-auto"
          :class="{ 'line-clamp-3': !isDescriptionExpanded }"
        >
          {{ marker.description }}
        </p>
      </div>
      <Button
        v-if="marker.description && marker.description.length > 100"
        class="w-33 h-6 py-0 text-xs text-muted-foreground hover:text-primary hover:underline transition-all duration-200"
        type="button"
        variant="ghost"
        role="button"
        aria-label="Показать больше..."
        @click="isDescriptionExpanded = !isDescriptionExpanded"
      >
        {{ isDescriptionExpanded ? "Свернуть" : "Показать больше..." }}
      </Button>
    </div>
    <div class="flex items-center gap-1 text-xs text-muted-foreground">
      <span>Создал:</span>
      <NuxtLink
        :to="isCurrentUser ? '/profile' : `/profile/${marker.username}`"
        class="visited:text-current hover:text-primary hover:underline transition-all duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none"
      >
        {{ marker.userName }}
      </NuxtLink>
    </div>
    <div class="flex justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        class="w-1/2"
        :disabled="routeLoading"
        @click="handleRouteClick"
      >
        <Icon
          :name="routeLoading ? 'tabler:loader-2' : 'tabler:route'"
          :class="routeLoading ? 'animate-spin' : ''"
          class="mr-2 h-4 w-4"
        />
        {{ routeLoading ? 'Построение...' : 'Маршрут' }}
      </Button>
      <Button
        v-if="currentUser"
        size="sm"
        variant="outline"
        class="w-1/2"
        :disabled="isLoading"
        @click="toggleFavorite"
      >
        <Icon
          :name="isFavorite ? 'tabler:heart-filled' : 'tabler:heart'"
          :class="isFavorite ? 'text-red-500' : ''"
        />
        {{ isFavorite ? "В избранном" : "В избранное" }}
      </Button>
    </div>
  </div>
</template>
