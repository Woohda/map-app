<script
    setup
    lang="ts"
>
import AppSidebar from '~/components/app/AppSidebar.vue';
import Header from '~/components/app/Header.vue';
</script>

<template>
	<Header />
	<SidebarProvider :default-open="true">
		<main class="flex items-center justify-center">
			<AppSidebar />
			<SidebarTrigger>
				<Icon name="tabler:menu" style="width: 20px; height: 20px;" />
			</SidebarTrigger>
			<slot />
		</main>
	</SidebarProvider>
</template>

<style scoped>
</style>
