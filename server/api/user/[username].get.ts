/**
 * @module server/api/user/[username].get
 * @fileoverview Серверный обработчик маршрута для получения данных пользователя по username.
 * @description
 * Этот модуль реализует серверный endpoint для получения публичного профиля пользователя по его username.
 * Он использует Prisma для работы с базой данных и возвращает данные пользователя с его локациями.
 * ---
 * ### Логика работы:
 * 1. Получение username из параметров маршрута.
 * 2. Поиск пользователя в базе данных по username (без учёта регистра).
 * 3. Если пользователь не найден — возврат 404 ошибки.
 * 4. Получение локаций пользователя с включением данных о создателе.
 * 5. Возврат объекта пользователя с полями:
 *    - `id`, `name`, `username`, `avatarUrl`, `bio`
 *    - `locations` - массив локаций пользователя
 *
 * ### Ошибки:
 * - 404 Not Found — если пользователь с указанным username не существует.
 * - 500 Internal Server Error — если произошла ошибка при получении данных.
 *
 * ### Примечания:
 * - Endpoint не требует авторизации (публичный профиль).
 * - Возвращаются только публичные данные пользователя.
 * - Локации сортируются по дате создания (новые сначала).
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const username = getRouterParam(event, 'username');
		if (!username) {
			throw createError({
				status: 400,
				message: 'Username обязателен',
			});
		}

		const user = await prisma.user.findFirst({
			where: {
				username: {
					equals: username,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				name: true,
				username: true,
				avatarUrl: true,
				bio: true,
			},
		});

		if (!user) {
			throw createError({
				status: 404,
				message: 'Пользователь не найден',
			});
		}

		const locations = await prisma.location.findMany({
			where: {
				userId: user.id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return {
			...user,
			locations,
		};
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({
			status: 500,
			message: 'Ошибка получения профиля пользователя. Попробуйте позже.',
		});
	}
});
