import type { LngLat, RouteFeature } from '@yandex/ymaps3-types';

import { ref } from 'vue';
import { isYandexMapReadyToInit } from 'vue-yandex-maps';

const lineStyle = {
	fillRule: 'nonzero' as const,
	fill: '#333',
	fillOpacity: 0.9,
	stroke: [
		{
			width: 6,
			color: '#007afce6',
		},
		{
			width: 10,
			color: '#fff',
		},
	],
};

export function useRouteBuilder() {
	const route = ref<RouteFeature | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	async function buildRoute(startCoordinates: LngLat, endCoordinates: LngLat) {
		loading.value = true;
		error.value = null;

		try {
			if (!isYandexMapReadyToInit.value) {
				throw new Error('Карта еще не загружена.');
			}

			await ymaps3.ready;

			const routes = await ymaps3.route({
				points: [startCoordinates, endCoordinates],
				type: 'walking',
				bounds: true,
			});

			if (!routes || routes.length === 0) {
				throw new Error('Не удалось построить маршрут.');
			}

			const firstRoute = routes[0]?.toRoute();

			if (!firstRoute) {
				throw new Error('Не удалось построить маршрут.');
			}

			if (firstRoute.geometry.coordinates.length === 0) {
				throw new Error('Маршрут не содержит координат.');
			}

			route.value = firstRoute;
			return firstRoute;
		}
		catch (err) {
			const errorMessage
				= err instanceof Error ? err.message : 'Не удалось построить маршрут.';
			error.value = errorMessage;
			console.error('Route building error:', err);
			throw err;
		}
		finally {
			loading.value = false;
		}
	}

	function clearRoute() {
		route.value = null;
		error.value = null;
	}

	return {
		route,
		loading,
		error,
		buildRoute,
		clearRoute,
		lineStyle,
	};
}
