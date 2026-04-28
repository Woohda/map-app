<script setup lang="ts">
import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import EditProfileForm from '~/components/form/EditProfileForm.vue';
import ProfileCard from '~/components/profile/ProfileCard.vue';
import UserLocations from '~/components/profile/UserLocations.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import UserFavoriteLocations from '../../../components/profile/UserFavoriteLocations.vue';

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
		<ProfileCard :user="currentUser" :locations-count="userMarkers.length" />
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
					<UserLocations />
				</TabsContent>
				<TabsContent value="Избранное">
					<UserFavoriteLocations />
				</TabsContent>
			</Tabs>
		</div>
	</div>
</template>

<style scoped></style>
