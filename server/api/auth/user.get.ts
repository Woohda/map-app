/**
 * @module server/api/auth/user.get
 * @fileoverview Серверный endpoint для получения текущего авторизованного пользователя.
 * @description
 * Создает server API route в Nuxt 3/Nitro с помощью `defineEventHandler` из пакета `h3`.
 * Обрабатывает запросы и возвращает данные текущего пользователя, если сессия валидна.
 * ---
 * ### Логика работы:
 * - Получает объект события `H3Event`.
 * - Вызывает `validateRequest(event)` из `~server/utils/auth`:
 *    - Проверяет cookie сессии.
 *    - Валидирует сессию через Lucia.
 *    - Возвращает объект пользователя (`user`) или `null`, если сессия невалидна.
 *
 * ### Возвращаемые данные:
 * - Если сессия валидна: объект пользователя с полями `id`, `name`, `username`, `email`, `avatarUrl`.
 * - Если сессия невалидна: `null`.
 *
 * ### Особенности:
 * - Работает как на сервере (SSR), так и при SPA-навигации.
 * - Интегрируется с middleware (`auth.global.ts`) для глобальной проверки сессии.
 * - Может быть вызван на клиенте через `$fetch('/api/user')`.
 *
 * ### Применение:
 * - Инициализация состояния `authUser`.
 * - Отображение данных пользователя в UI.
 * - Проверка авторизации на сервере.
 */

import type { H3Event } from 'h3';

import { validateRequest } from '~server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
	const { user } = await validateRequest(event);
	return user;
});
