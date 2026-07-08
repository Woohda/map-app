/**
 * @module server/uploadthing
 * @fileoverview Конфигурация UploadThing router для загрузки файлов
 * @description
 * Этот модуль создает и конфигурирует UploadThing router для загрузки изображений.
 * Он использует middleware для проверки авторизации и onUploadComplete для обработки завершения загрузки.
 * ---
 * ### Логика работы:
 * 1. Создание UploadThing инстанса через `createUploadthing`.
 * 2. Определение роута `attachments` для загрузки изображений с ограничением 4MB и 5 файлов.
 * 3. Middleware для проверки авторизации пользователя через `validateRequest`.
 * 4. При отсутствии авторизации выбрасывается `UploadThingError('Unauthorized')`.
 * 5. onUploadComplete callback возвращает ключ, URL и имя загруженного файла.
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
 * - Требуется авторизация для загрузки файлов.
 * - Router используется в server/api/uploadthing/index.ts.
 *
 * ### Зависимости:
 * - FileRouter из uploadthing/h3
 * - createUploadthing из uploadthing/h3
 * - UploadThingError из uploadthing/server
 * - validateRequest из ./utils/auth
 */

import type { FileRouter } from 'uploadthing/h3';

import { createUploadthing } from 'uploadthing/h3';
import { UploadThingError } from 'uploadthing/server';

import { validateRequest } from './utils/auth';

const f = createUploadthing();

export const uploadRouter = {
  attachments: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 5,
    },
  })
    .middleware(async ({ event }) => {
      const { user } = await validateRequest(event);

      if (!user) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        key: file.key,
        url: file.ufsUrl,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
