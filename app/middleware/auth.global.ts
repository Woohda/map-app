/**
 * @module app/middleware/auth.global
 * @fileoverview Глобальный middleware для проверки авторизации пользователя.
 * @description
 * Этот middleware выполняется только на сервере (SSR) при заходе на любой маршрут.
 * Он проверяет наличие куки `auth-session` в запросе и, если она есть, делает запрос к серверному API `/api/auth/user` для получения данных пользователя.
 * Если куки нет, запрос не выполняется, и пользователь считается неавторизованным.
 *
 * На клиенте middleware не выполняет запросы, а использует состояние пользователя, полученное на сервере.
 *
 * ---
 * ### Логика работы:
 * 1. Проверяется наличие куки `auth-session` в заголовках запроса.
 * 2. Если куки нет:
 *    - `authUser.value` устанавливается в `null`.
 *    - Если маршрут не публичный — редирект на `/sign-in`.
 * 3. Если куки есть:
 *    - Выполняется `$fetch` к `/api/auth/user` для получения данных пользователя.
 *    - Если пользователь получен, сохраняется в `authUser.value`, иначе `null`.
 * 4. Редиректы:
 *    - Если пользователь не авторизован и маршрут не публичный → редирект на `/sign-in`.
 *    - Если пользователь авторизован и пытается зайти на публичный маршрут `/sign-in` или `/sign-up` → редирект на `/`.
 *
 * ### Особенности:
 * - Middleware выполняется только на сервере (import.meta.server).
 * - Проверка куки происходит до запроса к API.
 * - Запрос к API выполняется только на сервере (SSR).
 * - Клиент использует состояние из SSR, запросы не повторяются.
 * - Поддержка SSR и SPA-навигации без лишних запросов.
 *
 * ### Публичные маршруты:
 * '/', '/sign-in', '/sign-up'
 */

import type { User } from 'lucia';

import { useRequestEvent } from 'nuxt/app';

import { useAuthUser } from '~/composables/useAuthUser';

export default defineNuxtRouteMiddleware(async (to) => {
	const authUser = useAuthUser();
	const publicPages = ['/', '/sign-in', '/sign-up'];

	if (authUser.value) {
		if (['/sign-in', '/sign-up'].includes(to.path)) {
			return navigateTo('/');
		}
		return;
	}

	if (import.meta.server) {
		const event = useRequestEvent();
		const cookies = event?.node.req?.headers.cookie || '';
		const hasSessionCookie = cookies.includes('auth-session');
		if (!hasSessionCookie) {
			authUser.value = null;
			if (!publicPages.includes(to.path))
				return navigateTo('/sign-in');
			return;
		}

		try {
			const user = await $fetch<User | null>('/api/auth/user', {
				credentials: 'include',
				method: 'GET',
				cache: 'no-store',
				headers: { cookie: cookies },
			});

			authUser.value = user ?? null;
		}
		catch {
			authUser.value = null;
		}

		if (authUser.value && ['/sign-in', '/sign-up'].includes(to.path)) {
			return navigateTo('/');
		}

		if (!authUser.value && !publicPages.includes(to.path)) {
			return navigateTo('/sign-in');
		}
	}
});
