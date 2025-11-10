<script
    setup
    lang="ts"
>
import type { User } from 'lucia';

import { useAuthUser } from '~/composables/useAuthUser';

const authUser = useAuthUser();

async function logout() {
	try {
		await $fetch<User>('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		});
		authUser.value = null;
		await navigateTo('/');
	}
	catch (error: unknown) {
		console.error('Ошибка выхода из аккаунта', error);
	}
}
</script>

<template>
	<Button
		variant="outline"
		type="button"
		aria-label="Кнопка выхода из аккаунта"
		class="group/logout max-w-25 px-2 flex items-center hover:border-primary transition-colors duration-200"
		@click="logout"
	>
		<Icon
			name="tabler:logout"
			class="group-hover/logout:text-primary transition-colors duration-200"
			style="width:20px; height:20px;"
		/><span>Выйти</span>
	</Button>
</template>

<style scoped>

</style>
