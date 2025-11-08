/**
 * @fileoverview
 * Модуль аутентификации и управления пользовательскими сессиями для Nuxt 4 + H3 + Lucia.
 * Использует Prisma в качестве ORM, Argon2id для безопасного хэширования паролей
 * и кастомную систему кэширования для оптимизации проверок сессий.
 * @module server/utils/auth
 *
 * @description
 * ### Основные задачи модуля:
 * - Создание и проверка пользовательских сессий через Lucia.
 * - Управление cookie (создание, обновление, очистка).
 * - Проверка существования пользователя по email или username.
 * - Конфигурация и инициализация Lucia с адаптером Prisma.
 * - Поддержка безопасного хэширования паролей с помощью Argon2id.
 */

import type { H3Event } from 'h3';
import type { Session, User } from 'lucia';

import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import env from '~lib/env/env';
import prisma from '~lib/prisma';
import { argon2id } from 'argon2';
import { setCookie } from 'h3';
import { Lucia } from 'lucia';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

interface DatabaseUserAttributes {
	id: string;
	username: string;
	name: string;
	avatarUrl: string | null;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

// создаем экземпляр Lucia и передаем ему адаптер
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: '(auth)-session',
		expires: false,
		attributes: {
			secure: env.NODE_ENV === 'production',
			sameSite: 'lax',
		},
	},
	getUserAttributes(databaseUserAttributes) {
		return {
			id: databaseUserAttributes.id,
			username: databaseUserAttributes.username,
			name: databaseUserAttributes.name,
			avatarUrl: databaseUserAttributes.avatarUrl,
		};
	},
});

export async function createSession(userId: string) {
	const existingSession = await prisma.session.findFirst({
		where: {
			userId,
		},
	});
	if (existingSession) {
		// Если сессия уже существует не создаем новую
		return {
			...existingSession,
			userId: existingSession.userId,
			id: existingSession.id,
			fresh: false,
		};
	}
	// Если сессия не существует, то создаем новую
	const newSession = await lucia.createSession(userId, {
		activePeriod: 60 * 60 * 24 * 3, // 3 дня
	});
	return { ...newSession, fresh: true };
}

export async function createNewSessionCookie(event: H3Event) {
	const sessionCookie = lucia.createBlankSessionCookie();
	setCookie(event, sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
	});
}

export async function createSessionCookie(event: H3Event, session: Session) {
	const sessionCookie = lucia.createSessionCookie(session.id);
	setCookie(event, sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
	});
}

export const validateRequest = defineCachedEventHandler(
	async (
		event: H3Event,
	): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

		if (!sessionId) {
			return { user: null, session: null };
		}

		const result = await lucia.validateSession(sessionId);

		try {
			if (result.session && result.session.fresh) {
				// обновляем куки сессии
				await createSessionCookie(event, result.session);
			}
			if (!result.session) {
				// если сессия не валидна, создаем новую куку
				await createNewSessionCookie(event);
			}
		}
		catch {}
		return result;
	},
);

export function checkUserExists(identifier: string) {
	return prisma.user.findFirst({
		where: {
			OR: [
				{
					email: {
						equals: identifier,
						mode: 'insensitive', // игнорируем регистр
					},
				},
				{
					username: {
						equals: identifier,
						mode: 'insensitive', // игнорируем регистр
					},
				},
			],
		},
	});
}

export const hashOptions = {
	algorithm: argon2id,
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1,
	outputLen: 32,
};
