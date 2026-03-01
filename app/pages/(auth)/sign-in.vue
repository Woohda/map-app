<script setup lang="ts">
import SignInForm from '~/components/form/SignInForm.vue';
</script>

<template>
	<div
		class="flex gap-4 w-full max-w-150 p-10 flex-col items-center justify-center border-e border-solid rounded-3xl bg-card shadow-2xl"
	>
		<h1 class="text-3xl font-bold">
			Войти в аккаунт.
		</h1>
		<SignInForm />
		<span class="text-xs text-muted-foreground">
			У тебя нет аккаунта?
			<NuxtLink
				to="/sign-up"
				class="hover:text-primary transition-colors duration-200 rounded-sm hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3.5px] outline-none"
			>
				Зарегистрироваться.
			</NuxtLink>
		</span>
	</div>
</template>

<style scoped></style>
