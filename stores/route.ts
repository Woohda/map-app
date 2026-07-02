import type { RouteFeature } from '@yandex/ymaps3-types';

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouteStore = defineStore('route', () => {
	const route = ref<RouteFeature | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	function setRoute(newRoute: RouteFeature | null) {
		route.value = newRoute;
	}

	function setLoading(isLoading: boolean) {
		loading.value = isLoading;
	}

	function setError(errorMessage: string | null) {
		error.value = errorMessage;
	}

	function clearRoute() {
		route.value = null;
		error.value = null;
	}

	return {
		route,
		loading,
		error,
		setRoute,
		setLoading,
		setError,
		clearRoute,
	};
});
