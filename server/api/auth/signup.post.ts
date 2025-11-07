import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { signUpSchema } from '~lib/types/validation';
import { checkUserExists, createSession, createSessionCookie, hashOptions } from '~server/utils/auth';
import { hash } from 'argon2';
import { createError, defineEventHandler, readBody, sendRedirect } from 'h3';
import { generateIdFromEntropySize } from 'lucia';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const credentials = await readBody(event);

		const { name, email, username, password } = signUpSchema.parse(credentials);

		// проверяем, существует ли пользователь с таким email
		const existingUser = await checkUserExists(email);
		if (existingUser) {
			throw createError({ status: 409, data: { field: 'email' }, message: 'Пользователь с такой почтой уже существует' });
		}

		// проверяем, существует ли пользователь с таким username
		const existingUsername = await checkUserExists(username);
		if (existingUsername) {
			throw createError({ status: 409, data: { field: 'username' }, message: 'Пользователь с таким никнеймом уже существует' });
		}

		// хешируем пароль
		const passwordHash = await hash(password, hashOptions);

		// генерируем id пользователя
		const userId = generateIdFromEntropySize(10);

		// создаем пользователя
		await prisma.user.create({
			data: {
				id: userId,
				name,
				email,
				username,
				passwordHash,
			},
		});

		// создаем сессию и куки
		try {
			const session = await createSession(userId);
			await createSessionCookie(event, session);
		}
		catch (sessionErr: unknown) {
			console.error('Ошибка при создании сессии:', sessionErr);
			const message = sessionErr instanceof Error ? sessionErr.message : 'Ошибка при создании сессии. Попробуйте позже.';
			throw createError({ status: 500, message });
		}
		await sendRedirect(event, '/');
		// return {
		// 	status: 200,
		// 	message: 'Пользователь успешно зарегистрирован',
		// };
	}
	catch (err: unknown) {
		if (err instanceof Error) {
			throw err;
		}
		throw createError({ status: 500, message: 'Ошибка регистрации. Попробуйте снова или позже.' });
	}
});
