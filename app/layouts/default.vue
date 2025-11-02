<script
    setup
    lang="ts"
>
import Header from '~/components/app/Header.vue';
</script>

<template>
	<body>
		<Header />
		<main class="flex min-h-screen flex-col">
			<slot />
		</main>
	</body>
</template>

<style scoped>

</style>
