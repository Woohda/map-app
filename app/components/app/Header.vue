<script setup lang="ts">
import { useAuthUserStore } from '~stores/auth';

import NavBar from '~/components/app/NavBar.vue';
import ThemeToggle from '~/components/button/ThemeToggle.vue';

const { isAuthenticated } = storeToRefs(useAuthUserStore());
</script>

<template>
	<header
		class="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60"
	>
		<div
			class="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 md:px-6"
		>
			<SidebarTrigger v-if="isAuthenticated" class="shrink-0" />
			<div class="min-w-0 flex-1">
				<NavBar />
			</div>
			<ThemeToggle />
		</div>
	</header>
</template>

<style scoped></style>
