<script
    setup
    lang="ts"
>
import AppSidebar from '~/components/app/AppSidebar.vue';
import Header from '~/components/app/Header.vue';
</script>

<template>
	<SidebarProvider
		:default-open="true"
		class="min-h-svh w-full"
	>
		<AppSidebar />
		<SidebarInset class="min-h-svh">
			<Header />
			<main class="w-full flex-1">
				<div class="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
					<slot />
				</div>
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>

<style scoped>
</style>
