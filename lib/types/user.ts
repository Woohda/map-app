/**
 * @module lib/types/user
 * @fileoverview Типы и функции для работы с данными пользователя
 * @description
 * Этот модуль предоставляет типы и функции для работы с данными пользователя.
 * Включает Prisma селекты для приватных и публичных данных, а также типы для разных контекстов.
 * ---
 * ### Логика работы:
 * 1. `getUserDataSelect`: Возвращает селект с приватными данными (включая email).
 * 2. `getPublicUserDataSelect`: Возвращает селект с публичными данными (без email).
 * 3. Типы данных генерируются на основе селектов через Prisma.
 *
 * ### Иерархия типов:
 * - `UserData`: Полный тип пользователя с приватными данными (email, _count)
 * - `PublicUserData`: Публичные данные пользователя без email
 * - `User`: Базовый тип с основными полями для UI
 * - `PublicUserProfile`: Публичный профиль пользователя с локациями
 * - `UserProfileData`: Профиль пользователя с локациями
 *
 * ### Примечания:
 * - `getUserDataSelect` использовать ТОЛЬКО в аутентифицированных эндпоинтах.
 * - `getPublicUserDataSelect` использовать во всех публичных эндпоинтах.
 * - Email не должен передаваться в публичных API.
 *
 * ### Зависимости:
 * - Prisma из @prisma/client
 * - LocationData из ./location
 */

import type { Prisma } from '@prisma/client';

import type { LocationData } from './location';

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export type User = Pick<UserData, 'id' | 'name' | 'username' | 'bio' | 'avatarUrl'>;

export interface PublicUserProfile extends User {
  locations: PublicLocation[];
}

export interface PublicLocation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export type UserProfileData = UserData & {
  locations: LocationData[];
};

/**
 * Приватный селект пользователя — включает email.
 * Использовать ТОЛЬКО в аутентифицированных эндпоинтах (/api/user/me, /api/user/update-user),
 * где пользователь запрашивает свои собственные данные.
 */
export function getUserDataSelect() {
  return {
    id: true,
    username: true,
    email: true,
    name: true,
    avatarUrl: true,
    bio: true,
    _count: {
      select: {
        Location: true,
        LocationLog: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

/**
 * Публичный селект пользователя — НЕ включает email.
 * Использовать во всех публичных эндпоинтах, где данные видны посторонним:
 * список локаций на карте, профили других пользователей.
 */
export function getPublicUserDataSelect() {
  return {
    id: true,
    username: true,
    name: true,
    avatarUrl: true,
    bio: true,
    _count: {
      select: {
        Location: true,
        LocationLog: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type PublicUserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getPublicUserDataSelect>;
}>;
