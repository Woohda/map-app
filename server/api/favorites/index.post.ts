/**
 * @module server/api/favorites/index.post
 * @fileoverview Серверный endpoint для добавления локации в избранное.
 * @description
 * Этот модуль реализует серверный endpoint для добавления локации в список избранных пользователя.
 * Требует авторизации.
 * ---
 * ### Логика работы:
 * 1. Валидация сессии пользователя через `validateRequest`.
 * 2. Получение locationId из тела запроса.
 * 3. Проверка существования локации.
 * 4. Создание или обновление записи в FavoriteLocation через upsert.
 * 5. Возврат успешного ответа.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 400 Bad Request — если locationId не указан.
 * - 404 Not Found — если локация не существует.
 * - 500 Internal Server Error — при ошибке сервера.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const { user: loggedInUser } = await validateRequest(event);
		if (!loggedInUser) {
			throw createError({
				status: 401,
				message: 'Вы не авторизованы',
			});
		}

		const body = await readBody(event);
		const { locationId } = body;

		if (!locationId) {
			throw createError({
				status: 400,
				message: 'locationId обязателен',
			});
		}

		const location = await prisma.location.findUnique({
			where: { id: locationId },
		});

		if (!location) {
			throw createError({
				status: 404,
				message: 'Локация не найдена',
			});
		}

		await prisma.favoriteLocation.upsert({
			where: {
				userId_locationId: {
					userId: loggedInUser.id,
					locationId,
				},
			},
			create: {
				userId: loggedInUser.id,
				locationId,
			},
			update: {},
		});

		setResponseStatus(event, 204);
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({
			status: 500,
			message: 'Ошибка добавления в избранное. Попробуйте позже.',
		});
	}
});
