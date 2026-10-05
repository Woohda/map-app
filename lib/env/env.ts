/**
 * @module lib/env/env
 * @fileoverview Конфигурация и проверка переменных окружения.
 * @description
 * Этот модуль определяет схему обязательных переменных окружения с помощью Zod,
 * проверяет их наличие и корректность через функцию `tryParseEnv`,
 * и экспортирует проверенные значения для использования в приложении.
 * ---
 * ### Логика работы:
 * 1. Определение схемы `EnvSchema` с обязательными переменными:
 *    - `NODE_ENV`: среда выполнения (например, "development" или "production").
 *    - `PRISMA_DATABASE_URL`: URL базы данных для Prisma.
 *    - `YANDEX_MAPS_API_KEY`: API ключ для Яндекс Карт.
 *    - `YANDEX_MAPS_ROUTER_API_KEY`: API ключ для маршрутизации Яндекс Карт.
 *    - `UPLOADTHING_TOKEN`: токен для сервиса UploadThing.
 *    - `SITE_URL`: базовый URL сайта для SEO мета тегов.
 * 2. Вызов `tryParseEnv(EnvSchema)` для проверки наличия всех обязательных переменных.
 * 3. Парсинг `process.env` через `EnvSchema.parse()` и экспорт результата.
 *
 * ### Особенности:
 * - Использует Zod для строгой типизации и проверки переменных окружения.
 * - Обеспечивает раннее обнаружение отсутствующих или некорректных значений.
 *
 * ### Применение:
 * - Централизованная проверка и доступ к переменным окружения в проекте.
 */

/* eslint-disable node/no-process-env */

import { z } from 'zod';

import tryParseEnv from './try-parse-env';

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  PRISMA_DATABASE_URL: z.string(),
  YANDEX_MAPS_API_KEY: z.string(),
  YANDEX_MAPS_ROUTER_API_KEY: z.string(),
  UPLOADTHING_TOKEN: z.string(),
  SITE_URL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;
tryParseEnv(EnvSchema);
export default EnvSchema.parse(process.env);
