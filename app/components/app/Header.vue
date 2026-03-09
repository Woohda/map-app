<script setup lang="ts">
import NavBar from '~/components/app/NavBar.vue';
import ThemeToggle from '~/components/button/ThemeToggle.vue';
import SidebarTriggerMobile from '~/components/ui/sidebar/SidebarTriggerMobile.vue';

const route = useRoute();
</script>

<template>
	<header
		class="absolute top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60"
	>
		<div
			class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 md:px-6"
		>
			<SidebarTriggerMobile
				v-if="['/', '/profile'].includes(route.path)"
			/>
			<div class="min-w-0 flex-1">
				<NavBar />
			</div>
			<ThemeToggle />
		</div>
	</header>
</template>

<style scoped></style>
