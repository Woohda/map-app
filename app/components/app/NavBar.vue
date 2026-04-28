<script
    setup
    lang="ts"
>
import { useAuthUserStore } from '~stores/auth';
import { storeToRefs } from 'pinia';

import LogoutButton from '~/components/button/LogoutButton.vue';

const { isAuthenticated } = storeToRefs(useAuthUserStore());
</script>

<template>
	<nav class="flex items-center gap-5">
		<div v-if="isAuthenticated" class="flex items-center gap-5">
			<NuxtLink to="/profile" class="visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
				Профиль
			</NuxtLink>
			<LogoutButton />
		</div>
		<div v-else class="flex items-center gap-5">
			<NuxtLink to="/sign-in" class="visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
				Войти
			</NuxtLink>
		</div>
	</nav>
</template>

<style scoped>

</style>
