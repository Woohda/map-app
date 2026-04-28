import type { Ref } from 'vue';

import { computed, onMounted, onUnmounted, ref } from 'vue';

export function useContainerHeight(containerRef: Ref<HTMLDivElement | undefined>) {
	const containerMaxHeight = ref('auto');

	function updateHeight() {
		if (!containerRef.value)
			return;

		const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
		const rect = containerRef.value.getBoundingClientRect();
		const topOffset = rect.top;
		const bottomPadding = 38;

		const availableHeight = viewportHeight - topOffset - bottomPadding;
		containerMaxHeight.value = `${Math.max(availableHeight, 200)}px`;
	}

	const containerStyle = computed(() => ({
		maxHeight: containerMaxHeight.value,
		overflowY: 'auto' as const,
	}));

	onMounted(() => {
		updateHeight();
		window.addEventListener('resize', updateHeight);
		window.visualViewport?.addEventListener('resize', updateHeight);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', updateHeight);
		window.visualViewport?.removeEventListener('resize', updateHeight);
	});

	return {
		containerStyle,
		updateHeight,
	};
}
