<script
    setup
    lang="ts"
>
import NavBar from '~/components/app/NavBar.vue';
import ThemeToggle from '~/components/button/ThemeToggle.vue';
</script>

<template>
	<header class="mx-auto max-w-7xl flex items-center grow gap-5 p-5">
		<NavBar />
		<ThemeToggle />
	</header>
</template>

<style scoped>

</style>
