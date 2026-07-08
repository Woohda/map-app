/**
 * @module lib/types/location
 * @fileoverview Типы и функции для работы с данными локаций
 * @description
 * Этот модуль предоставляет типы и функции для работы с данными локаций и логов локаций.
 * Включает Prisma селекты, включения и типы для данных локации с связанными сущностями.
 * ---
 * ### Логика работы:
 * 1. `getLocationDataSelect`: Возвращает селект для основных полей локации.
 * 2. `getLocationDataInclude`: Возвращает включение с пользователем, изображениями и избранным.
 * 3. `getLocationLogDataInclude`: Возвращает включение для логов локаций с изображениями.
 * 4. `getLocationLogDataSelect`: Возвращает селект для основных полей лога локации.
 *
 * ### Типы данных:
 * - `LocationData`: Полные данные локации с пользователем, изображениями и избранным
 * - `LocationLogData`: Полные данные лога локации с пользователем и локацией
 * - `LocationsPage`: Страница локаций с пагинацией
 * - `LocationLogsPage`: Страница логов локаций с пагинацией
 * - `LocationStats`: Статистика локаций пользователя
 *
 * ### Примечания:
 * - `getLocationDataInclude` принимает опциональный `userId` для фильтрации избранного.
 * - Изображения сортируются по полю `order` по возрастанию.
 *
 * ### Зависимости:
 * - Prisma из @prisma/client
 * - getPublicUserDataSelect из ./user
 */

import type { Prisma } from '@prisma/client';

import { getPublicUserDataSelect } from './user';

export function getLocationDataSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    description: true,
    latitude: true,
    longitude: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  } satisfies Prisma.LocationSelect;
}

export function getLocationDataInclude(userId?: string) {
  return {
    user: {
      select: getPublicUserDataSelect(),
    },
    _count: {
      select: {
        FavoriteLocation: true,
      },
    },
    LocationImage: {
      select: {
        id: true,
        url: true,
        altText: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    },
    ...(userId
      ? {
          FavoriteLocation: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
        }
      : {}),
  } satisfies Prisma.LocationInclude;
}

export type LocationData = Prisma.LocationGetPayload<{
  include: ReturnType<typeof getLocationDataInclude>;
}>;

export type LocationSelectData = Prisma.LocationGetPayload<{
  select: ReturnType<typeof getLocationDataSelect>;
}>;

export function getLocationLogDataInclude() {
  return {
    user: {
      select: getPublicUserDataSelect(),
    },
    location: {
      select: getLocationDataSelect(),
    },
    LocationLogImage: {
      select: {
        id: true,
        url: true,
        createdAt: true,
      },
    },
    _count: {
      select: {
        LocationLogImage: true,
      },
    },
  } satisfies Prisma.LocationLogInclude;
}

export type LocationLogData = Prisma.LocationLogGetPayload<{
  include: ReturnType<typeof getLocationLogDataInclude>;
}>;

export function getLocationLogDataSelect() {
  return {
    id: true,
    startedAt: true,
    endedAt: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    locationId: true,
  } satisfies Prisma.LocationLogSelect;
}

export type LocationLogSelectData = Prisma.LocationLogGetPayload<{
  select: ReturnType<typeof getLocationLogDataSelect>;
}>;

export interface LocationsPage {
  locations: LocationData[];
  nextCursor: string | null;
}

export interface LocationLogsPage {
  locationLogs: LocationLogData[];
  nextCursor: string | null;
}

export interface LocationCountInfo {
  count: number;
}

export interface LocationLogCountInfo {
  count: number;
}

export interface LocationStats {
  totalLocations: number;
  totalLogs: number;
  userLocations: number;
  userLogs: number;
}
