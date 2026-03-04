/**
 * @module server/api/map/locations.get
 * @fileoverview Серверный обработчик маршрута для получения списка всех локаций.
 * @description
 * Этот модуль реализует серверный endpoint для получения списка всех локаций из базы данных.
 * Он использует Prisma для работы с базой данных и возвращает локации с привязкой к пользователям.
 * ---
 * ### Логика работы:
 * 1. Получение всех локаций из базы данных через Prisma.
 * 2. Включение связанных данных пользователя для каждой локации.
 * 3. Возврат массива локаций с полями:
 *    - `id`, `name`, `slug`, `description`, `latitude`, `longitude`
 *    - `createdAt`, `updatedAt`
 *    - `user` - объект с данными пользователя (`id`, `name`, `username`)
 *
 * ### Ошибки:
 * - 500 Internal Server Error — если произошла ошибка при получении локаций.
 *
 * ### Примечания:
 * - Endpoint не требует авторизации.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 * - Локации возвращаются с данными о создавших их пользователях.
 */

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
	try {
		const locations = await prisma.location.findMany({
			include: getLocationDataInclude(),
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
