<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '~/utils/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<span aria-label="Loading" role="status" :class="cn('inline-flex space-x-1', props.class)">
		<span class="w-[3px] h-[3px] bg-current rounded-full animate-bounce-custom dot" />
		<span class="w-[3px] h-[3px] bg-current rounded-full animate-bounce-custom dot" />
		<span class="w-[3px] h-[3px] bg-current rounded-full animate-bounce-custom dot" />
	</span>
</template>

<style scoped>
.dot:nth-child(1) {
	animation-delay: 0s;
}
.dot:nth-child(2) {
	animation-delay: 0.15s;
}
.dot:nth-child(3) {
	animation-delay: 0.3s;
}

@keyframes bounce-custom {
	0%,
	80%,
	100% {
		transform: translateY(0px);
		opacity: 1;
	}
	50% {
		transform: translateY(-3px);
		opacity: 0.65;
	}
}

.animate-bounce-custom {
	animation: bounce-custom 0.8s infinite ease-in-out;
}
</style>
