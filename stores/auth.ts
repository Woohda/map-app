/**
 * @module stores/auth
 * @fileoverview Pinia store для управления аутентификацией пользователей
 *
 * ## Функциональность:
 * - 📝 Регистрация новых пользователей
 * - 🔐 Вход существующих пользователей
 * - 🚪 Выход из системы
 * - 👤 Хранение данных текущего пользователя
 * - 🔍 Проверка статуса аутентификации
 *
 * ## Состояние:
 * - `currentUser` - данные текущего пользователя (User | null)
 * - `isAuthenticated` - computed свойство для проверки авторизации
 *
 * ## Функции:
 * - `signIn(formData)` - аутентификация пользователя
 * - `signUp(formData)` - регистрация нового пользователя
 * - `logout()` - выход из системы
 *
 * ## Использование:
 * ```typescript
 * const authStore = useAuthUserStore();
 * await authStore.signIn({ email, password });
 * ```
 */

import type { SignInValues, SignUpValues } from '~lib/types/validation';
import type { User } from 'lucia';

import { navigateTo } from 'nuxt/app';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { toast } from '~/composables/use-toast';

export const useAuthUserStore = defineStore('authUser', () => {
	const currentUser = ref<User | null>(null);
	const isAuthenticated = computed(() => currentUser.value !== null);

	async function signIn(formData: SignInValues) {
		const user = await $fetch<User>('/api/auth/sign-in', {
			method: 'POST',
			body: formData,
		});
		currentUser.value = user ?? null;
		toast({
			description: `Добро пожаловать, ${currentUser.value?.name}!`,
			variant: 'success',
		});
		await navigateTo('/profile');
	}

	async function signUp(formData: SignUpValues) {
		const user = await $fetch<User>('/api/auth/sign-up', {
			method: 'POST',
			body: formData,
		});
		currentUser.value = user ?? null;
		toast({
			description: `${currentUser.value?.name}, Вы успешно зарегистрировались!`,
			variant: 'success',
		});
		await navigateTo('/profile');
	}

	async function logout() {
		try {
			await $fetch<User>('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			currentUser.value = null;
			await navigateTo('/');
		}
		catch (error: unknown) {
			console.error('Ошибка выхода из аккаунта', error);
			toast({
				description: 'Произошла ошибка, попробуйте еще раз',
				variant: 'destructive',
			});
		}
	}
	return {
		currentUser,
		isAuthenticated,
		signIn,
		signUp,
		logout,
	};
});
