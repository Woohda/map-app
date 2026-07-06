/**
 * @module server/api/favorites/[id].delete
 * @fileoverview Серверный endpoint для удаления локации из избранного.
 * @description
 * Этот модуль реализует серверный endpoint для удаления локации из списка избранных пользователя.
 * Требует авторизации.
 * ---
 * ### Логика работы:
 * 1. Валидация сессии пользователя через `validateRequest`.
 * 2. Получение id из параметров маршрута.
 * 3. Удаление записи из FavoriteLocation.
 * 4. Возврат сообщения об успешном удалении.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 500 Internal Server Error — при ошибке сервера.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { user: loggedInUser } = await validateRequest(event);
    if (!loggedInUser) {
      throw createError({
        status: 401,
        message: 'Вы не авторизованы',
      });
    }

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        status: 400,
        message: 'id обязателен',
      });
    }

    await prisma.favoriteLocation.deleteMany({
      where: {
        userId: loggedInUser.id,
        locationId: id,
      },
    });

    setResponseStatus(event, 204);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw createError({
      status: 500,
      message: 'Ошибка удаления из избранного. Попробуйте позже.',
    });
  }
});
