<script
    setup
    lang="ts"
>
import Header from '~/components/app/Header.vue';
</script>

<template>
	<Header />
	<main class="flex min-h-screen flex-col">
		<slot />
	</main>
</template>

<style scoped>

</style>
