/**
 * @module server/api/auth/sign-up.post
 * @fileoverview Серверный обработчик маршрута для регистрации пользователя (sign-up).
 * @description
 * Этот модуль реализует серверный endpoint для регистрации пользователя через имя, email, username и пароль.
 * Он использует Prisma для работы с базой данных, Argon2 для безопасного хеширования пароля и Lucia для управления сессиями.
 * ---
 * ### Логика работы:
 * 1. Получение данных из тела запроса (`name`, `email`, `username`, `password`).
 * 2. Валидация данных через `signUpSchema`.
 * 3. Проверка существования пользователя с указанным email или username (`checkUserExists`).
 * 4. Хеширование пароля с помощью `argon2.hash`.
 * 5. Создание нового пользователя в базе данных.
 * 6. Создание сессии через `createSession`.
 * 7. Установка cookie сессии через `createSessionCookie`.
 * 8. Приведение имени к написанию с заглавной буквы с помощью `capitalizeWords`.
 * 9. Возврат объекта пользователя с полями:
 *    - `id`, `name`, `username`, `email`, `avatarUrl`.
 *
 * ### Ошибки:
 * - 409 Conflict — если email или username уже используются.
 * - 500 Internal Server Error — если произошла ошибка на сервере или при создании сессии.
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
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
		throw createError({ status: 500, message: 'Ошибка регистрации. Попробуйте снова или позже.' });
	}
});
