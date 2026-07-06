/**
 * @module server/api/locations/[id].delete
 * @fileoverview Серверный обработчик маршрута для удаления локации.
 * @description
 * Этот модуль реализует серверный endpoint для удаления локации по ID.
 * Он использует Prisma для работы с базой данных и Lucia для проверки авторизации.
 * ---
 * ### Логика работы:
 * 1. Проверка авторизации пользователя через `validateRequest`.
 * 2. Получение ID локации из параметров маршрута.
 * 3. Поиск локации в базе данных.
 * 4. Проверка, что локация принадлежит авторизованному пользователю.
 * 5. Удаление локации из базы данных и связанных записей из избранного.
 *
 * ### Ошибки:
 * - 401 Unauthorized — если пользователь не авторизован.
 * - 404 Not Found — если локация не существует.
 * - 403 Forbidden — если локация принадлежит другому пользователю.
 * - 500 Internal Server Error — если произошла ошибка при удалении локации.
 *
 * ### Примечания:
 * - Требуется обязательная авторизация пользователя.
 * - Пользователь может удалять только свои локации.
 * - Все исключения перехватываются и преобразуются в корректные HTTP ошибки.
 */

import type { H3Event } from 'h3';

import prisma from '~lib/prisma';
import { validateRequest } from '~server/utils/auth';
import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { user: loggedInUser } = await validateRequest(event);
    if (!loggedInUser) {
      throw createError({
        status: 401,
        message: 'Требуется авторизация для удаления локации',
      });
    }

    const locationId = getRouterParam(event, 'id');
    if (!locationId) {
      throw createError({
        status: 400,
        message: 'Не указан ID локации',
      });
    }

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw createError({
        status: 404,
        message: 'Локация не найдена',
      });
    }

    if (location.userId !== loggedInUser.id) {
      throw createError({
        status: 403,
        message: 'Вы можете удалять только свои локации',
      });
    }

    await prisma.location.delete({
      where: { id: locationId },
    });

    return { success: true };
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw createError({
      status: 500,
      message: 'Ошибка удаления локации. Попробуйте позже.',
    });
  }
});
