/**
 * @module server/api/locations/index.post
 * @fileoverview Серверный обработчик маршрута для добавления новой локации.
 * @description
 * Этот модуль реализует серверный endpoint для создания новой локации с привязкой к авторизованному пользователю.
 * Он использует Prisma для работы с базой данных, Lucia для проверки авторизации и Zod для валидации данных.
 * ---
 * ### Логика работы:
 * 1. Проверка авторизации пользователя через `validateRequest`.
 * 2. Получение данных из тела запроса (`name`, `description`, `latitude`, `longitude`).
 * 3. Валидация данных через `addLocationSchema`.
 * 4. Генерация уникального slug из названия локации через `generateSlug`.
 * 5. Проверка уникальности slug в базе данных.
 * 6. Генерация ID локации через `generateIdFromEntropySize`.
 * 7. Создание новой локации в базе данных с привязкой к `userId`.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 400 Bad Request — если данные невалидны или slug уже существует.
 * - 500 Internal Server Error — если произошла ошибка при создании локации.
 *
 * ### Примечания:
 * - Требуется обязательная авторизация пользователя.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 * - Локация создается с привязкой к авторизованному пользователю.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { addLocationSchema } from '~lib/types/validation';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler, readBody } from 'h3';
import { generateIdFromEntropySize } from 'lucia';

import { generateSlug } from '~/utils/utils';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const { user: loggedInUser } = await validateRequest(event);
		if (!loggedInUser) {
			throw createError({
				status: 401,
				message: 'Требуется авторизация для добавления локации',
			});
		}

		const locationData = await readBody(event);

		const validatedData = addLocationSchema.parse(locationData);

		const slugName = generateSlug(validatedData.name);

		const existingLocation = await prisma.location.findUnique({
			where: { slug: slugName },
		});
		if (existingLocation) {
			throw createError({
				status: 400,
				message: 'Локация с таким URL уже существует',
			});
		}

		const locationId = generateIdFromEntropySize(10);

		const location = await prisma.location.create({
			data: {
				id: locationId,
				userId: loggedInUser.id,
				name: validatedData.name,
				slug: slugName,
				description: validatedData.description,
				latitude: validatedData.latitude,
				longitude: validatedData.longitude,
			},
			include: getLocationDataInclude(loggedInUser.id),
		});

		return location;
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({
			status: 500,
			message: 'Ошибка создания локации. Попробуйте позже.',
		});
	}
});
