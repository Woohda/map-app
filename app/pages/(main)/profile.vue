<script setup lang="ts">
import { useAuthUserStore } from '~stores/auth';
import { useLocationStore } from '~stores/location';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import EditProfileForm from '~/components/form/EditProfileForm.vue';
import UserLocations from '~/components/profile/UserLocations.vue';
import { Tabs } from '~/components/ui/tabs';

definePageMeta({
	layout: 'main',
});

const { currentUser } = storeToRefs(useAuthUserStore());
const { initializeUserLocations } = useLocationStore();

onMounted(async () => {
	await initializeUserLocations();
});
</script>

<template>
	<div
		class="flex gap-8 w-full items-start justify-center max-xl:gap-5 max-md:flex-col max-md:items-center max-md:justify-start"
	>
		<div
			class="w-full max-w-sm flex flex-col gap-2 items-center p-4 rounded-xl border-b border-r shadow-2xl bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65"
		>
			<div
				class="w-30 h-30 flex items-center justify-center bg-accent rounded-full"
			>
				<Icon name="tabler:user" size="100" class="shrink-0" />
			</div>
			<div>
				<div class="w-full flex flex-col items-center gap-2">
					<h2 class="text-2xl font-bold">
						{{ currentUser?.name }}
					</h2>
					<p class="text-sm text-muted-foreground">
						@{{ currentUser?.username }}
					</p>
					<p class="text-sm text-center">
						{{ currentUser?.bio }}
					</p>
				</div>
			</div>
		</div>
		<div
			class="w-full max-w-xl min-w-80 p-4 rounded-xl border-r border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65 shadow-2xl"
		>
			<Tabs default-value="Профиль">
				<TabsList>
					<TabsTrigger value="Профиль">
						Профиль
					</TabsTrigger>
					<TabsTrigger value="Локации">
						Мои локации
					</TabsTrigger>
				</TabsList>
				<TabsContent value="Профиль">
					<EditProfileForm />
				</TabsContent>
				<TabsContent value="Локации">
					<UserLocations />
				</TabsContent>
			</Tabs>
		</div>
	</div>
</template>

<style scoped></style>
