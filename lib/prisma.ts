import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

import env from './env/env';

/**
 * @module lib/prisma
 * @fileoverview Конфигурация и инициализация Prisma клиента с поддержкой Accelerate
 * @description
 * Этот модуль создает и экспортирует единственный экземпляр PrismaClient с расширением Accelerate.
 * В режиме разработки используется глобальная переменная для хранения экземпляра, чтобы избежать создания множества подключений при hot-reload.
 * ---
 * ### Логика работы:
 * 1. Создание глобального типа `globalForPrisma` для хранения экземпляра PrismaClient.
 * 2. Проверка наличия экземпляра в глобальной переменной.
 * 3. Если экземпляр существует — повторное использование.
 * 4. Если экземпляра нет — создание нового с расширением `withAccelerate`.
 * 5. В режиме разработки сохранение экземпляра в глобальную переменную.
 *
 * ### Примечания:
 * - В development режиме используется singleton pattern для hot-reload.
 * - В production режиме создается новый экземпляр для каждого запроса.
 * - Accelerate расширение оптимизирует запросы к базе данных.
 *
 * ### Зависимости:
 * - PrismaClient из @prisma/client
 * - withAccelerate из @prisma/extension-accelerate
 * - env из ./env/env
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

const prisma
  = globalForPrisma.prisma
    || (new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient);

if (env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;

export default prisma;
