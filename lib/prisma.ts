import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

import env from './env/env';

/**
 * @module lib/prisma
 * @fileoverview Конфигурация и инициализация Prisma клиента с поддержкой Accelerate
 * @description
 * Этот модуль создает и экспортирует единственный экземпляр PrismaClient с расширением Accelerate.
 * В режиме разработки используется глобальная переменная для хранения экземпляра, чтобы избежать создания множества подключений при hot-reload.
 * В продакшене создается новый экземпляр для каждого запроса.
 * ---
 * ### Глобальный тип для хранения экземпляра PrismaClient:
 * - глобальная переменная для хранения экземпляра PrismaClient (globalForPrisma)
 * - экземпляр PrismaClient (prisma)
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
