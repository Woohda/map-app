/**
 * @module server/api/locations/index.get
 * @fileoverview Серверный обработчик маршрута для получения списка всех локаций.
 * @description
 * Этот модуль реализует серверный endpoint для получения списка всех локаций из базы данных.
 * Он использует Prisma для работы с базой данных и возвращает локации с привязкой к пользователям.
 * ---
 * ### Логика работы:
 * 1. Валидация сессии пользователя через `validateRequest` (опционально).
 * 2. Получение всех локаций из базы данных через Prisma.
 * 3. Включение связанных данных пользователя для каждой локации.
 * 4. Если пользователь авторизован, включение данных о статусе избранного.
 * 5. Возврат массива локаций с полями:
 *    - `id`, `name`, `slug`, `description`, `latitude`, `longitude`
 *    - `createdAt`, `updatedAt`, `userId`
 *    - `user` - объект с данными пользователя (`id`, `name`, `username`, `email`, `avatarUrl`, `bio`, `_count`)
 *    - `FavoriteLocation` - массив с записями избранного (если авторизован)
 *
 * ### Ошибки:
 * - 500 Internal Server Error — если произошла ошибка при получении локаций.
 *
 * ### Примечания:
 * - Endpoint работает как для авторизованных, так и для неавторизованных пользователей.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 * - Локации возвращаются с данными о создавших их пользователях.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const { user } = await validateRequest(event);
		const userId = user?.id;

		const locations = await prisma.location.findMany({
			include: getLocationDataInclude(userId),
			orderBy: {
				createdAt: 'desc',
			},
		});
		return locations;
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({
			status: 500,
			message: 'Ошибка получения локаций. Попробуйте позже.',
		});
	}
});
