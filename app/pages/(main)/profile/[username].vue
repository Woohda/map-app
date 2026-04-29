<script setup lang="ts">
import type { PublicUserProfile } from '~lib/types/user';

import Profile from '~/components/profile/card/Profile.vue';

definePageMeta({
	layout: 'main',
});

const route = useRoute();
const username = route.params.username as string;

const { data: userProfile, error } = await useFetch<PublicUserProfile>(`/api/user/${username}`, {
	credentials: 'include',
});

if (error.value || !userProfile.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Пользователь не найден',
	});
}

const user = computed(() => userProfile.value);
const locations = computed(() => userProfile.value?.locations || []);

async function handleLocationClick(locationSlug: string) {
	await navigateTo(`/?location=${locationSlug}`);
}
</script>

<template>
	<div
		class="flex gap-8 w-full items-start justify-center max-xl:gap-5 max-md:flex-col max-md:items-center max-md:justify-start"
	>
		<Profile :user="user" :locations-count="locations.length" />
		<div
			class="w-full max-w-xl min-w-80 p-4 rounded-xl border-r border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65 shadow-2xl"
		>
			<h3 class="text-lg font-semibold mb-4">
				Локации пользователя ({{ locations.length }}):
			</h3>
			<div
				v-if="locations.length === 0"
				class="flex flex-col items-center gap-1 text-muted-foreground py-8"
			>
				<Icon name="tabler:map-pin" size="48" class="opacity-50" />
				<p>У пользователя пока нет сохраненных локаций</p>
			</div>
			<div v-else class="grid gap-2">
				<div
					v-for="location in locations"
					:key="location.id"
					class="group p-2 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] outline-none"
					tabindex="0"
					role="button"
					:aria-label="`Локация: ${location.name}${location.description ? `, ${location.description}` : ''}`"
					@click="handleLocationClick(location.slug)"
					@keydown.enter="handleLocationClick(location.slug)"
				>
					<div class="flex items-center gap-1">
						<div class="flex shrink-0">
							<Icon name="tabler:map-pin" size="40" class="text-primary" />
						</div>
						<div class="flex-1 min-w-0">
							<h4
								class="font-medium truncate group-hover:text-primary transition-colors"
							>
								{{ location.name }}
							</h4>
							<p
								v-if="location.description"
								class="text-sm text-muted-foreground mt-1 line-clamp-2"
							>
								{{ location.description }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
