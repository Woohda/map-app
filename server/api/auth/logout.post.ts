/**
 * @module server/api/auth/logout.post
 * @fileoverview Серверный обработчик маршрута для выхода пользователя (logout).
 * @description
 * Этот модуль реализует серверный endpoint для завершения сессии пользователя.
 * Он использует Lucia для инвалидации текущей сессии и установки пустой cookie.
 * ---
 * ### Логика работы:
 * 1. Валидация текущей сессии пользователя через `validateRequest`.
 * 2. Если сессия существует — инвалидация сессии через `lucia.invalidateSession`.
 * 3. Установка пустой session cookie через `createNewSessionCookie`.
 * 4. Если сессия не существует — бездействие (тихий выход).
 *
 * ### Ошибки:
 * - Ошибки не возвращаются (endpoint всегда возвращает 200 OK).
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
 * - Отсутствие сессии не считается ошибкой (позволяет повторный logout).
 * - Cookie сбрасывается в пустое значение для удаления сессии на клиенте.
 *
 * ### Зависимости:
 * - createNewSessionCookie, lucia, validateRequest из ~server/utils/auth
 * - H3Event из h3
 */

import type { H3Event } from 'h3';

import { createNewSessionCookie, lucia, validateRequest } from '~server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
  const { session } = await validateRequest(event);
  if (!session)
    return;
  await lucia.invalidateSession(session.id);

  await createNewSessionCookie(event);
});
