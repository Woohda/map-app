<script setup lang="ts">
import SignUpForm from '~/components/form/SignUpForm.vue';

definePageMeta({
	layout: 'auth',
});
</script>

<template>
	<div
		class="flex gap-4 w-full max-w-150 p-10 flex-col items-center justify-center border-e border-solid rounded-3xl bg-card shadow-2xl"
	>
		<h1 class="text-3xl font-bold">
			Регистрация нового профиля.
		</h1>
		<SignUpForm />
		<span class="text-xs text-muted-foreground">
			Уже есть аккаунт?
			<NuxtLink
				to="/sign-in"
				class="hover:text-primary transition-colors duration-200 rounded-sm hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3.5px] outline-none"
			>
				Войти.
			</NuxtLink>
		</span>
	</div>
</template>

<style scoped></style>
