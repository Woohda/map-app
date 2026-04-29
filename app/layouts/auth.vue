<script setup lang="ts">
import Header from '~/components/app/header/Header.vue';
</script>

<template>
	<Header />
	<main
		class="min-h-screen pt-20"
		style="background-image: url('/images/bg-profile.png'); background-size: cover; background-position: center; background-attachment: fixed;"
	>
		<div class="w-full flex justify-center max-sm:px-5">
			<slot />
		</div>
	</main>
</template>

<style scoped></style>
