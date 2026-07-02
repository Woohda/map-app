<script setup lang="ts">
import { useAuthUserStore } from '~stores/auth';
import { usePopupStore } from '~stores/popup';
import { storeToRefs } from 'pinia';

import Toaster from '~/components/ui/toast/Toaster.vue';

const isPageLoading = ref(false);
const popupStore = usePopupStore();
const { isLoggingOut } = storeToRefs(useAuthUserStore());

const nuxtApp = useNuxtApp();

nuxtApp.hook('page:start', () => {
	isPageLoading.value = true;
	popupStore.clearPopup();
});

nuxtApp.hook('page:finish', () => {
	isPageLoading.value = false;
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
		<ClientOnly>
			<Toaster />
		</ClientOnly>
	</NuxtLayout>
	<Transition name="page" mode="out-in">
		<div
			v-if="isPageLoading || isLoggingOut"
			class="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70 z-50"
		>
			<Spinner size="xl" />
		</div>
	</Transition>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
}
</style>
