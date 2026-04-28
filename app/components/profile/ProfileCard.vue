<script setup lang="ts">
import type { User } from '~lib/types/user';

interface Props {
	user: User | null | undefined;
	locationsCount?: number;
}

withDefaults(defineProps<Props>(), {
	locationsCount: 0,
});
</script>

<template>
	<div
		v-if="user"
		class="w-full max-w-sm flex flex-col gap-3 items-center p-4 rounded-xl border-b border-r shadow-2xl bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65"
	>
		<div
			class="w-30 h-30 flex items-center justify-center bg-accent rounded-full"
		>
			<Icon name="tabler:user" size="100" class="shrink-0" />
		</div>
		<div>
			<div class="w-full flex flex-col items-center gap-1">
				<h2 class="text-2xl font-bold">
					{{ user.name }}
				</h2>
				<p class="text-sm text-muted-foreground">
					@{{ user.username }}
				</p>
				<p class="text-sm">
					Локаций:
					<span v-if="locationsCount">{{ locationsCount }}</span>
				</p>
				<p
					v-if="user.bio"
					class="text-sm"
				>
					{{ user.bio }}
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
