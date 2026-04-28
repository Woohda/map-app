<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton';

interface Props {
	count?: number;
}

withDefaults(defineProps<Props>(), {
	count: 7,
});
</script>

<template>
	<div class="flex flex-col h-full gap-2">
		<div class="flex items-center justify-between shrink-0">
			<Skeleton class="h-6 w-32" />
		</div>

		<div class="flex flex-col gap-2">
			<div
				v-for="i in count"
				:key="i"
				class="flex items-center gap-1 p-2 border rounded-lg"
			>
				<div class="flex shrink-0">
					<Skeleton class="h-10 w-10 rounded-full" />
				</div>
				<div class="flex-1 min-w-0 space-y-2">
					<Skeleton class="h-5 w-3/4" />
					<Skeleton class="h-3 w-1/2" />
				</div>
				<Skeleton class="w-7 h-7 rounded shrink-0" />
			</div>
		</div>
	</div>
</template>
