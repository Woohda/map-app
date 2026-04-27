/**
 * @module server/api/favorites/index.get
 * @fileoverview Серверный endpoint для получения списка избранных локаций пользователя.
 * @description
 * Этот модуль реализует серверный endpoint для получения всех локаций, добавленных в избранное текущим пользователем.
 * Требует авторизации.
 * ---
 * ### Логика работы:
 * 1. Валидация сессии пользователя через `validateRequest`.
 * 2. Получение всех записей FavoriteLocation для текущего пользователя.
 * 3. Включение данных о локациях и их создателях.
 * 4. Сортировка по дате добавления (новые сначала).
 * 5. Возврат массива избранных локаций.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 500 Internal Server Error — при ошибке сервера.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const { user: loggedInUser } = await validateRequest(event);
		if (!loggedInUser) {
			throw createError({
				status: 401,
				message: 'Вы не авторизованы',
			});
		}

		const favorites = await prisma.favoriteLocation.findMany({
			where: {
				userId: loggedInUser.id,
			},
			include: {
				location: {
					include: getLocationDataInclude(loggedInUser.id),
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return favorites.map(favorite => ({
			id: favorite.id,
			createdAt: favorite.createdAt,
			location: favorite.location,
		}));
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({
			status: 500,
			message: 'Ошибка получения избранных локаций. Попробуйте позже.',
		});
	}
});
