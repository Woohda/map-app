<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '~/utils/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<span aria-label="Loading" role="status" :class="cn('inline-flex space-x-1', props.class)">
		<span class="w-2 h-2 bg-current rounded-full animate-bounce delay-150" />
		<span class="w-2 h-2 bg-current rounded-full animate-bounce delay-300" />
		<span class="w-2 h-2 bg-current rounded-full animate-bounce delay-450" />
	</span>
</template>
