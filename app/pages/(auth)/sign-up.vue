<script setup lang="ts">
import SignUpForm from '~/components/form/SignUpForm.vue';

definePageMeta({
	layout: 'auth',
});
</script>

<template>
	<div
		class="flex gap-4 w-full max-w-120 p-10 flex-col items-center justify-center border-e border-solid rounded-3xl bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65 shadow-2xl"
	>
		<h1 class="text-3xl font-bold max-md:text-2xl">
			Регистрация нового профиля.
		</h1>
		<SignUpForm />
		<span class="text-xs text-muted-foreground text-center">
			Уже есть аккаунт?
			<NuxtLink
				to="/sign-in"
				class="text-primary hover:text-primary transition-colors duration-200 rounded-sm hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3.5px] outline-none"
			>
				Войти.
			</NuxtLink>
		</span>
	</div>
</template>

<style scoped></style>
