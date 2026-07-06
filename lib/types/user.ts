import type { Prisma } from '@prisma/client';

import type { LocationData } from './location';

/**
 * Модуль содержит типы и функции для работы с данными пользователя.
 * Он предоставляет функцию для получения селектов и включений данных,
 * а также типы данных пользователя для разных контекстов использования.
 *
 * ## Иерархия типов:
 * - `UserData` - полный тип пользователя с приватными данными (email, _count) — только для аутентифицированных эндпоинтов
 * - `PublicUserData` - публичные данные пользователя без email — для публичных API
 * - `User` - базовый тип с основными полями для UI компонентов
 * - `PublicUserProfile` - публичный профиль пользователя без приватных данных
 * - `UserProfileData` - профиль пользователя с локациями
 *
 * @function getUserDataSelect - Приватный селект с email. Только для аутентифицированных эндпоинтов (/api/user/me, update-user)
 * @function getPublicUserDataSelect - Публичный селект без email. Для всех публичных эндпоинтов (локации на карте, чужой профиль)
 * @type {UserData} - Полный тип пользователя с приватными данными (Prisma генерируемый)
 * @type {PublicUserData} - Публичные данные пользователя без email
 * @type {User} - Базовый тип пользователя с основными полями (Pick<UserData>)
 * @type {PublicUserProfile} - Публичный профиль пользователя (extends User)
 * @type {UserProfileData} - Тип данных профиля пользователя с локациями
 */

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
