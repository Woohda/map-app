/**
 * @module server/api/auth/sign-in.post
 * @fileoverview Серверный обработчик маршрута для входа пользователя (sign-in).
 * @description
 * Этот модуль реализует серверный endpoint для авторизации пользователя через email/username и пароль.
 * Он использует Lucia для управления сессиями и Argon2 для проверки пароля.
 * ---
 * ### Логика работы:
 * 1. Получение данных из тела запроса (`login` и `password`).
 * 2. Валидация данных через `signInSchema`.
 * 3. Проверка существования пользователя в базе (`checkUserExists`).
 * 4. Сравнение введенного пароля с хешем в базе через `argon2.verify`.
 * 5. Если пользователь найден и пароль верный:
 *    - Создается сессия через `createSession`.
 *    - Устанавливается cookie сессии через `createSessionCookie`.
 * 6. Возвращается объект пользователя с полями:
 *    - `id`, `name`, `username`, `email`, `avatarUrl`.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не найден или пароль неверный.
 * - 500 Internal Server Error — если произошла ошибка на сервере или при создании сессии.
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 */

import type { H3Event } from 'h3';
import type { User } from 'lucia';

import { signInSchema } from '~lib/types/validation';
import { checkUserExists, createSession, createSessionCookie } from '~server/utils/auth';
import { verify } from 'argon2';
import { createError, defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const credentials = await readBody(event);

    const { login, password } = signInSchema.parse(credentials);

    const existingUser = await checkUserExists(login);
    if (!existingUser || !existingUser.passwordHash) {
      throw createError({ status: 401, message: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await verify(
      existingUser.passwordHash,
      password,
    );
    if (!isPasswordValid) {
      throw createError({ status: 401, message: 'Неверный логин или пароль' });
    }

    try {
      const session = await createSession(existingUser.id);
      await createSessionCookie(event, session);
    }
    catch (sessionErr: unknown) {
      console.error('Ошибка при создании сессии:', sessionErr);
      const message = sessionErr instanceof Error ? sessionErr.message : 'Ошибка при создании сессии. Попробуйте позже.';
      throw createError({ status: 500, message });
    }
    const user: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatarUrl'> = {
      id: existingUser.id,
      name: existingUser.name,
      username: existingUser.username,
      email: existingUser.email,
      avatarUrl: existingUser.avatarUrl,
    };
    return user;
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw createError({ status: 500, message: 'Ошибка входа. Попробуйте снова или позже.' });
  }
});
