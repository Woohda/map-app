import type { DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import type { MapClickEvent } from '~lib/types/map';

interface UseLongPressOptions {
	duration?: number;
	moveThreshold?: number;
	onLongPress: (coordinates: MapClickEvent['coordinates']) => void;
	onDoubleTap?: () => void;
}

interface LongPressState {
	isLongPressing: Ref<boolean>;
	handleTouchStart: (object: DomEventHandlerObject, event: MapClickEvent) => void;
	handleTouchMove: (object: DomEventHandlerObject, event: MapClickEvent) => void;
	handleTouchEnd: () => void;
	cancelLongPress: () => void;
}

export function useLongPress(options: UseLongPressOptions): LongPressState {
	const {
		duration = 800,
		moveThreshold = 20,
		onLongPress,
		onDoubleTap,
	} = options;

	const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null);
	const isLongPressing = ref(false);
	const touchStartCoords = ref<{ x: number; y: number } | null>(null);
	const touchStartMapCoords = ref<MapClickEvent['coordinates'] | null>(null);

	// Double tap detection
	const lastTapTime = ref(0);
	const lastTapCoords = ref<{ x: number; y: number } | null>(null);
	const DOUBLE_TAP_DELAY = 300;
	const DOUBLE_TAP_DISTANCE = 30;

	function cancelLongPress(): void {
		if (longPressTimer.value) {
			clearTimeout(longPressTimer.value);
			longPressTimer.value = null;
		}
		isLongPressing.value = false;
		touchStartCoords.value = null;
		touchStartMapCoords.value = null;
	}

	function isDoubleTap(screenX: number, screenY: number): boolean {
		const now = Date.now();
		const timeDiff = now - lastTapTime.value;

		if (timeDiff > DOUBLE_TAP_DELAY) {
			return false;
		}

		if (!lastTapCoords.value) {
			return false;
		}

		const distance = Math.hypot(
			screenX - lastTapCoords.value.x,
			screenY - lastTapCoords.value.y,
		);

		return distance < DOUBLE_TAP_DISTANCE;
	}

	function handleTouchStart(
		_object: DomEventHandlerObject,
		event: MapClickEvent,
	): void {
		const screenX = (event as unknown as { screenX?: number }).screenX ?? 0;
		const screenY = (event as unknown as { screenY?: number }).screenY ?? 0;

		// Check for double tap
		if (isDoubleTap(screenX, screenY)) {
			cancelLongPress();
			lastTapTime.value = 0;
			lastTapCoords.value = null;
			onDoubleTap?.();
			return;
		}

		// Store for next tap check
		lastTapTime.value = Date.now();
		lastTapCoords.value = { x: screenX, y: screenY };

		// Store touch start position for movement detection
		touchStartCoords.value = { x: screenX, y: screenY };
		touchStartMapCoords.value = event.coordinates;

		// Start long press timer
		isLongPressing.value = true;
		longPressTimer.value = setTimeout(() => {
			if (isLongPressing.value && touchStartMapCoords.value) {
				isLongPressing.value = false;
				longPressTimer.value = null;
				lastTapTime.value = 0; // Prevent double tap after long press
				onLongPress(touchStartMapCoords.value);
			}
		}, duration);
	}

	function handleTouchMove(
		_object: DomEventHandlerObject,
		event: MapClickEvent,
	): void {
		if (!touchStartCoords.value || !isLongPressing.value) {
			return;
		}

		const screenX = (event as unknown as { screenX?: number }).screenX ?? 0;
		const screenY = (event as unknown as { screenY?: number }).screenY ?? 0;

		const deltaX = Math.abs(screenX - touchStartCoords.value.x);
		const deltaY = Math.abs(screenY - touchStartCoords.value.y);

		if (deltaX > moveThreshold || deltaY > moveThreshold) {
			cancelLongPress();
		}
	}

	function handleTouchEnd(): void {
		cancelLongPress();
	}

	return {
		isLongPressing: readonly(isLongPressing),
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		cancelLongPress,
	};
}
