import type { H3Event } from 'h3';

import { signInSchema } from '~lib/types/validation';
import { checkUserExists, createSession, createSessionCookie } from '~server/utils/auth';
import { verify } from 'argon2';
import { createError, defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const credentials = await readBody(event);

		const { user, password } = signInSchema.parse(credentials);

		// проверяем, существует ли пользователь с таким email
		const existingUser = await checkUserExists(user);
		if (!existingUser || !existingUser.passwordHash) {
			throw createError({ status: 401, message: 'Неверный логин или пароль' });
		}

		// проверяем, совпадает ли пароль
		const isPasswordValid = await verify(
			existingUser.passwordHash,
			password,
		);
		if (!isPasswordValid) {
			throw createError({ status: 401, message: 'Неверный логин или пароль' });
		}

		// создаем сессию и куки
		try {
			const session = await createSession(existingUser.id);
			await createSessionCookie(event, session);
		}
		catch (sessionErr: unknown) {
			console.error('Ошибка при создании сессии:', sessionErr);
			const message = sessionErr instanceof Error ? sessionErr.message : 'Ошибка при создании сессии. Попробуйте позже.';
			throw createError({ status: 500, message });
		}
		return {
			status: 200,
			message: 'Пользователь успешно зарегистрирован',
		};
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({ status: 500, message: 'Ошибка входа. Попробуйте снова или позже.' });
	}
});
