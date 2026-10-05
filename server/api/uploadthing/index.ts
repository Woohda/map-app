/**
 * @module server/api/uploadthing/index
 * @fileoverview Route handler для UploadThing файловых загрузок
 * @description
 * Этот модуль создает H3 route handler для UploadThing файловых загрузок.
 * Он использует createRouteHandler для интеграции uploadRouter с H3.
 * ---
 * ### Логика работы:
 * 1. Импорт `uploadRouter` из ~server/uploadthing.
 * 2. Создание route handler через `createRouteHandler`.
 * 3. Экспорт `handler` для использования в Nuxt.
 *
 * ### Примечания:
 * - Серверная логика полностью изолирована от клиентского кода.
 * - Обрабатывает все операции загрузки файлов через uploadRouter.
 * - Автоматически управляет временными файлами и очисткой.
 *
 * ### Зависимости:
 * - uploadRouter из ~server/uploadthing
 * - createRouteHandler из uploadthing/h3
 */

import { uploadRouter } from '~server/uploadthing';
import { createRouteHandler } from 'uploadthing/h3';

export default createRouteHandler({
  router: uploadRouter,
});
