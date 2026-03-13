<script setup lang="ts">
import Header from '~/components/app/Header.vue';
</script>

<template>
	<SidebarProvider
		:default-open="true"
		class="min-h-screen w-full"
	>
		<SidebarInset class="min-h-screen">
			<Header />
			<main class="min-h-screen pt-20">
				<div class="w-full flex justify-center max-sm:px-5">
					<slot />
				</div>
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>

<style scoped></style>
