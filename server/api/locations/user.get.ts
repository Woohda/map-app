/**
 * @module server/api/locations/user.get
 * @fileoverview Серверный обработчик маршрута для получения локаций текущего пользователя.
 * @description
 * Этот модуль реализует серверный endpoint для получения локаций, созданных текущим пользователем.
 * Он использует Prisma для работы с базой данных и проверяет авторизацию пользователя.
 * ---
 * ### Логика работы:
 * 1. Проверка авторизации пользователя через validateRequest.
 * 2. Получение локаций, где userId совпадает с id текущего пользователя.
 * 3. Включение связанных данных пользователя для каждой локации.
 * 4. Возврат массива локаций с полями:
 *    - `id`, `name`, `slug`, `description`, `latitude`, `longitude`
 *    - `createdAt`, `updatedAt`, `userId`
 *    - `user` - объект с данными пользователя (`id`, `name`, `username`, `email`, `avatarUrl`, `bio`, `_count`)
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 500 Internal Server Error — если произошла ошибка при получении локаций.
 *
 * ### Примечания:
 * - Endpoint требует авторизации.
 * - Возвращаются только локации, созданные текущим пользователем.
 * - Локации сортируются по дате создания (новые сначала).
 */

import prisma from '~lib/prisma';
import { getLocationDataInclude } from '~lib/types/location';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { user: loggedInUser } = await validateRequest(event);
    if (!loggedInUser) {
      throw createError({
        status: 401,
        message: 'Вы не авторизованы',
      });
    }

    const locations = await prisma.location.findMany({
      where: {
        userId: loggedInUser.id,
      },
      include: getLocationDataInclude(loggedInUser.id),
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
      message: 'Ошибка получения локаций пользователя. Попробуйте позже.',
    });
  }
});
