<script setup lang="ts">
import Header from '~/components/app/Header.vue';
</script>

<template>
	<Header />
	<main class="w-full flex-1">
		<div class="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
			<slot />
		</div>
	</main>
</template>

<style scoped></style>
