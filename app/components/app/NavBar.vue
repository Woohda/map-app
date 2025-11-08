<script
    setup
    lang="ts"
>
</script>

<template>
	<nav class="w-full flex justify-between flex-wrap gap-5">
		<NuxtLink to="/">
			MAP_APP
		</NuxtLink>
		<div class="flex gap-5">
			<NuxtLink to="/sign-in" class="visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
				Sign In
			</NuxtLink>
			<NuxtLink to="/sign-up" class="visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
				Sign Up
			</NuxtLink>
		</div>
	</nav>
</template>

<style scoped>

</style>
