<script setup lang="ts">
import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import Profile from '~/components/profile/card/Profile.vue';
import EditProfileForm from '~/components/profile/form/EditProfileForm.vue';
import FavoriteLocation from '~/components/profile/sections/FavoriteLocation.vue';
import MyLocations from '~/components/profile/sections/MyLocations.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

definePageMeta({
	layout: 'main',
});

const { currentUser } = storeToRefs(useAuthUserStore());
const { userMarkers } = storeToRefs(useLocationStore());
const { initializeUserLocations, initializeFavorites } = useLocationStore();

onMounted(async () => {
	await initializeUserLocations();
	await initializeFavorites();
});
</script>

<template>
	<div
		class="flex gap-8 w-full items-start justify-center max-xl:gap-5 max-md:flex-col max-md:items-center max-md:justify-start"
	>
		<Profile :user="currentUser" :locations-count="userMarkers.length" />
		<div
			class="w-full max-w-xl min-w-80 p-4 rounded-xl border-r border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65 shadow-2xl"
		>
			<Tabs default-value="Профиль">
				<TabsList>
					<TabsTrigger value="Профиль" class="cursor-pointer">
						Профиль
					</TabsTrigger>
					<TabsTrigger value="Локации" class="cursor-pointer">
						Мои локации
					</TabsTrigger>
					<TabsTrigger value="Избранное" class="cursor-pointer">
						Избранное
					</TabsTrigger>
				</TabsList>
				<TabsContent value="Профиль">
					<EditProfileForm />
				</TabsContent>
				<TabsContent value="Локации">
					<MyLocations />
				</TabsContent>
				<TabsContent value="Избранное">
					<FavoriteLocation />
				</TabsContent>
			</Tabs>
		</div>
	</div>
</template>

<style scoped></style>
