/**
 * @module stores/auth
 * @fileoverview Pinia store для управления аутентификацией пользователей
 *
 * ## Функциональность:
 * - 📝 Регистрация новых пользователей
 * - 🔐 Вход существующих пользователей
 * - 🚪 Выход из системы
 * - 👤 Хранение данных текущего пользователя
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

import type { UserData } from '~lib/types/user';
import type { SignInValues, SignUpValues } from '~lib/types/validation';

import { navigateTo } from 'nuxt/app';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { toast } from '~/composables/use-toast';

export const useAuthUserStore = defineStore('authUser', () => {
	const currentUser = ref<UserData | null>(null);
	const isAuthenticated = computed(() => currentUser.value !== null);
	const isLoggingOut = ref(false);

	async function signIn(formData: SignInValues) {
		const user = await $fetch<UserData>('/api/auth/sign-in', {
			method: 'POST',
			body: formData,
		});
		currentUser.value = user ?? null;
		toast({
			description: `Добро пожаловать, ${currentUser.value?.name}!`,
			variant: 'success',
		});
		await navigateTo('/');
	}

	async function signUp(formData: SignUpValues) {
		const user = await $fetch<UserData>('/api/auth/sign-up', {
			method: 'POST',
			body: formData,
		});
		currentUser.value = user ?? null;
		toast({
			description: `${currentUser.value?.name}, Вы успешно зарегистрировались!`,
			variant: 'success',
		});
		await navigateTo('/');
	}

	async function logout() {
		try {
			isLoggingOut.value = true;
			await $fetch<UserData>('/api/auth/logout', {
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
		finally {
			isLoggingOut.value = false;
		}
	}

	return {
		currentUser,
		isAuthenticated,
		isLoggingOut,
		signIn,
		signUp,
		logout,
	};
});
