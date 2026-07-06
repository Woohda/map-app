/**
 * @module server/utils/auth
 * @fileoverview
 * Модуль аутентификации и управления пользовательскими сессиями для Nuxt 4 + H3 + Lucia.
 * @description
 * Данный модуль реализует серверную логику аутентификации для приложения на Nuxt 4,
 * используя стек H3 (Nitro), Lucia Auth и Prisma.
 * ---
 * #### Состояния и зависимости:
 * - Используется Lucia Auth для управления сессиями, а PrismaAdapter — для интеграции с ORM Prisma.
 * - В качестве хранилища пользователей и сессий выступает база данных, управляемая Prisma.
 * - Для хэширования паролей применяется алгоритм Argon2id с заданными параметрами безопасности.
 * - Для ускорения повторных проверок сессий используется кэш на уровне запроса (event.context). Результат кэшируется в `event.context` на время жизни одного HTTP-запроса,
 * поэтому безопасно вызывать функцию несколько раз в одном обработчике — к базе данных обращение произойдёт только один раз за запрос.
 *
 * #### Основные функции:
 * - `createSession(userId)`: Создаёт новую сессию для пользователя или возвращает существующую, если она уже есть.
 * - `createNewSessionCookie(event)`: Устанавливает "пустую" cookie для сессии (например, при выходе).
 * - `createSessionCookie(event, session)`: Устанавливает cookie сессии для пользователя.
 * - `validateRequest(event)`: Валидирует сессию пользователя по cookie, при необходимости обновляет или сбрасывает
 *   cookie. Результат кэшируется в `event.context` — к базе данных обращение происходит только один раз за запрос,
 *   что исключает утечку сессий между пользователями.
 * - `checkUserExists(identifier)`: Проверяет наличие пользователя по email или username (без учёта регистра).
 * - `hashOptions`: Конфигурация для Argon2id, используемая при хэшировании паролей.
 *
 * #### Особенности:
 * - Все операции с cookie производятся с учётом безопасности (secure, sameSite).
 * - Модуль расширяет типизацию Lucia для поддержки дополнительных пользовательских атрибутов.
 * - Кэш сессии привязан к конкретному HTTP-запросу — глобальная утечка данных между пользователями исключена.
 * - Все функции возвращают результат в виде промисов, что позволяет использовать их в асинхронных обработчиках.
 */

import type { H3Event } from 'h3';
import type { Session, User } from 'lucia';

import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import env from '~lib/env/env';
import prisma from '~lib/prisma';
import { argon2id } from 'argon2';
import { getCookie, setCookie } from 'h3';
import { Lucia } from 'lucia';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

interface DatabaseUserAttributes {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'auth-session',
    expires: false,
    attributes: {
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      name: databaseUserAttributes.name,
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
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

/** Ключ для хранения результата валидации сессии в event.context. */
const AUTH_CONTEXT_KEY = 'a7f9b2c8d1e3';

/**
 * Валидирует сессию пользователя по cookie.
 */
export async function validateRequest(
  event: H3Event,
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
  // Возвращаем уже вычисленный результат, если он есть в контексте текущего запроса
  if (event.context[AUTH_CONTEXT_KEY] !== undefined) {
    return event.context[AUTH_CONTEXT_KEY];
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    const result = { user: null, session: null } as const;
    event.context[AUTH_CONTEXT_KEY] = result;
    return result;
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
  catch (err: unknown) {
    console.error('Ошибка при обновлении сессионной cookie:', err);
  }

  event.context[AUTH_CONTEXT_KEY] = result;
  return result;
}

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
