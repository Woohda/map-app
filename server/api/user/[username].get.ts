/**
 * @module server/api/user/[username].get
 * @fileoverview Серверный обработчик маршрута для получения данных пользователя по username.
 * @description
 * Этот модуль реализует серверный endpoint для получения публичного профиля пользователя по его username.
 * Он использует Prisma для работы с базой данных и возвращает данные пользователя с его локациями.
 * ---
 * ### Логика работы:
 * 1. Валидация сессии пользователя через `validateRequest` (опционально).
 * 2. Получение username из параметров маршрута.
 * 3. Поиск пользователя в базе данных по username (без учёта регистра).
 * 4. Если пользователь не найден — возврат 404 ошибки.
 * 5. Получение локаций пользователя с включением данных о создателе.
 * 6. Если пользователь авторизован, включение данных о статусе избранного для локаций.
 * 7. Возврат объекта пользователя с полями:
 *    - `id`, `name`, `username`, `avatarUrl`, `bio`, `email`, `_count`
 *    - `locations` - массив локаций пользователя
 *
 * ### Ошибки:
 * - 404 Not Found — если пользователь с указанным username не существует.
 * - 500 Internal Server Error — если произошла ошибка при получении данных.
 *
 * ### Примечания:
 * - Endpoint работает как для авторизованных, так и для неавторизованных пользователей.
 * - Возвращаются публичные данные пользователя с email и _count.
 * - Локации сортируются по дате создания (новые сначала).
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { getPublicUserDataSelect } from '~lib/types/user';
import { validateRequest } from '~server/utils/auth';
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

    const { user: currentUser } = await validateRequest(event);
    const currentUserId = currentUser?.id;

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: getPublicUserDataSelect(),
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
      include: getLocationDataInclude(currentUserId),
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
