/**
 * @module lib/uploadthing
 * @fileoverview Vue helpers для UploadThing файловых загрузок
 * @description
 * Этот модуль генерирует и экспортирует Vue composables для работы с UploadThing.
 * Использует generateVueHelpers для создания типизированных хелперов на основе uploadRouter.
 * ---
 * ### Логика работы:
 * 1. Импорт типа `UploadRouter` из ~server/uploadthing.
 * 2. Генерация Vue helpers через `generateVueHelpers` с типизацией.
 * 3. Экспорт composables `useUploadThing` и `uploadFiles`.
 *
 * ### Экспортируемые composables:
 * - `useUploadThing`: Composable для управления загрузкой файлов
 * - `uploadFiles`: Функция для загрузки файлов
 *
 * ### Примечания:
 * - Типизация обеспечивается через UploadRouter из server/uploadthing.
 * - Composables используются в клиентских компонентах для загрузки файлов.
 *
 * ### Зависимости:
 * - UploadRouter из ~server/uploadthing
 * - generateVueHelpers из @uploadthing/vue
 */

import type { UploadRouter } from '~server/uploadthing';

import { generateVueHelpers } from '@uploadthing/vue';

export const { useUploadThing, uploadFiles }
  = generateVueHelpers<UploadRouter>();
