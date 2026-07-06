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
import type { User } from 'lucia';

import prisma from '~lib/prisma';
import { signUpSchema } from '~lib/types/validation';
import { checkUserExists, createSession, createSessionCookie, hashOptions } from '~server/utils/auth';
import { hash } from 'argon2';
import { createError, defineEventHandler, readBody } from 'h3';
import { generateIdFromEntropySize } from 'lucia';

import { capitalizeWords } from '~/utils/utils';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const credentials = await readBody(event);

    const { name, email, username, password } = signUpSchema.parse(credentials);

    // проверяем, существует ли пользователь с таким email
    const existingEmail = await checkUserExists(email);
    if (existingEmail) {
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
        name: capitalizeWords(name),
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

    const user: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatarUrl'> = {
      id: userId,
      name: capitalizeWords(name),
      username,
      email,
      avatarUrl: null,
    };

    return user;
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw createError({ status: 500, message: 'Ошибка регистрации. Попробуйте снова или позже.' });
  }
});
