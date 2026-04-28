<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

import NavBar from '~/components/app/NavBar.vue';
import ThemeToggle from '~/components/button/ThemeToggle.vue';
import SidebarTriggerMobile from '~/components/ui/sidebar/SidebarTriggerMobile.vue';

const route = useRoute();

const isMobile = useMediaQuery('(max-width: 768px)');
</script>

<template>
	<header
		class="absolute top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65"
	>
		<div
			class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-2 md:px-6"
		>
			<SidebarTriggerMobile
				v-if="['/', '/profile'].includes(route.path)"
			/>
			<div class="flex items-center min-w-0 flex-1" :class="isMobile ? 'justify-center' : 'justify-between'">
				<NuxtLink to="/" class="px-1 text-lg visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
					MAP_APP
				</NuxtLink>
				<NavBar v-if="!isMobile" />
			</div>
			<ThemeToggle />
		</div>
	</header>
</template>

<style scoped></style>
