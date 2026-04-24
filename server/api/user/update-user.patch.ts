/**
 * @module server/api/user/update-user.patch
 * @fileoverview Серверный обработчик маршрута для обновления профиля пользователя.
 * @description
 * Этот модуль реализует серверный endpoint для обновления данных профиля авторизованного пользователя.
 * Он использует Prisma для работы с базой данных и validateRequest для проверки авторизации.
 * ---
 * ### Логика работы:
 * 1. Проверка авторизации пользователя через `validateRequest`.
 * 2. Получение данных из тела запроса.
 * 3. Валидация данных через `updateUserProfileSchema`.
 * 4. Обновление данных пользователя в базе данных по его ID.
 * 5. Возврат обновленного объекта пользователя с полями:
 *    - `id`, `name`, `username`, `email`, `avatarUrl`, `bio`, `createdAt`, `updatedAt`.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 500 Internal Server Error — если произошла ошибка при обновлении профиля.
 *
 * ### Примечания:
 * - Endpoint требует авторизации.
 * - Обновляются только переданные поля, остальные остаются без изменений.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { getUserDataSelect } from '~lib/types/user';
import { updateUserProfileSchema } from '~lib/types/validation';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const credentials = await readBody(event);

		const validateValues = updateUserProfileSchema.parse(credentials);

		const { user } = await validateRequest(event);
		if (!user) {
			throw new Error('Вы не авторизованы');
		}

		const updateUser = await prisma.user.update({
			where: { id: user.id },
			data: validateValues,
			select: getUserDataSelect(),
		});

		return updateUser;
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({ status: 500, message: 'Ошибка обновления профиля. Попробуйте снова или позже.' });
	}
});
