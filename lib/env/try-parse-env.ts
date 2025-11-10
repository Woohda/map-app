/**
 * @module lib/env/try-parse-env
 * @fileoverview Функция для валидации и парсинга переменных окружения с помощью Zod.
 * @description
 * Проверяет, что все обязательные переменные окружения присутствуют и соответствуют схеме Zod.
 * В случае отсутствия значений выбрасывает ошибку с описанием недостающих переменных.
 * ---
 * ### Логика работы:
 * 1. Принимает схему `EnvSchema` типа `ZodObject`.
 * 2. Опционально принимает объект с переменными окружения (`buildEnv`), по умолчанию используется `process.env`.
 * 3. Пытается выполнить `EnvSchema.parse(buildEnv)`.
 * 4. Если возникает ошибка `ZodError`:
 *    - Формирует сообщение с перечислением отсутствующих или некорректных переменных.
 *    - Выбрасывает новую ошибку с этим сообщением.
 * 5. Если возникает другая ошибка, выводит её в консоль.
 *
 * ### Особенности:
 * - Использует Zod для строгой типизации и проверки структуры переменных окружения.
 * - Предназначена для раннего обнаружения отсутствующих или некорректных переменных при старте приложения.
 *
 * ### Применение:
 * - Проверка обязательных переменных окружения при запуске сервера.
 * - Обеспечение корректной типизации и предотвращение ошибок из-за отсутствующих значений.
 */

/* eslint-disable node/no-process-env */

import type { ZodObject, ZodRawShape } from 'zod';

import { ZodError } from 'zod';

export default function tryParseEnv<T extends ZodRawShape>(
	EnvSchema: ZodObject<T>,
	buildEnv: Record<string, string | undefined> = process.env,
) {
	try {
		EnvSchema.parse(buildEnv);
	}
	catch (error) {
		if (error instanceof ZodError) {
			let message = 'Missing required values in .env:\n';
			error.issues.forEach((issue) => {
				message += `${String(issue.path[0])}\n`;
			});
			const e = new Error(message);
			e.stack = '';
			throw e;
		}
		else {
			console.error(error);
		}
	}
}
