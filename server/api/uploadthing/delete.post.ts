/**
 * @module server/api/uploadthing/delete.post
 * @fileoverview Серверный обработчик для удаления файлов с UploadThing
 * @description
 * Этот модуль реализует endpoint для удаления файлов с сервиса UploadThing по их ключам.
 * Он использует UTApi для выполнения операции удаления.
 * ---
 * ### Логика работы:
 * 1. Получение массива ключей файлов из тела запроса.
 * 2. Если массив пуст или отсутствует — возврат success без удаления.
 * 3. Если ключи переданы — удаление файлов через `UTApi.deleteFiles`.
 * 4. Возврат статуса успешного выполнения.
 *
 * ### Ошибки:
 * - Ошибки не возвращаются (endpoint всегда возвращает success: true).
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
 * - Пустой массив ключей не считается ошибкой (тихий успех).
 * - Ключи файлов должны соответствовать ключам, полученным при загрузке.
 *
 * ### Зависимости:
 * - defineEventHandler, readBody из h3
 * - UTApi из uploadthing/server
 */

import { defineEventHandler, readBody } from 'h3';
import { UTApi } from 'uploadthing/server';

export default defineEventHandler(async (event) => {
  const { keys } = await readBody<{
    keys: string[];
  }>(event);

  if (!keys?.length) {
    return {
      success: true,
    };
  }

  await new UTApi().deleteFiles(keys);

  return {
    success: true,
  };
});
