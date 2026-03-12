<script setup lang="ts">
import Header from '~/components/app/Header.vue';
</script>

<template>
	<Header />
	<main class="min-h-screen pt-20">
		<div class="w-full flex justify-center max-sm:px-5">
			<slot />
		</div>
	</main>
</template>

<style scoped></style>
