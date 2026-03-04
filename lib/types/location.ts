import type { Prisma } from '@prisma/client';

import { getUserDataSelect } from './user';

/**
 * Модуль содержит типы и функции для работы с данными локаций.
 * Он предоставляет функции для получения селектов и включений данных,
 * а также типы для данных локации и связанных сущностей.
 *
 * @function getLocationDataSelect - Функция для получения селекта данных локации
 * @function getLocationDataInclude - Функция для получения включения данных локации
 * @function getLocationLogDataInclude - Функция для получения включения данных лога локации
 * @type {LocationData} - Тип данных локации с включением информации о пользователе
 * @type {LocationLogData} - Тип данных лога локации с включением информации о пользователе и локации
 * @interface LocationsPage - Интерфейс для страницы локаций, содержащий массив локаций
 * @interface LocationLogsPage - Интерфейс для страницы логов локаций, содержащий массив логов
 */

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

export function getLocationDataInclude() {
	return {
		user: {
			select: getUserDataSelect(),
		},
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
			select: getUserDataSelect(),
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
		name: true,
		description: true,
		startedAt: true,
		endedAt: true,
		latitude: true,
		longitude: true,
		createdAt: true,
		updatedAt: true,
		userId: true,
		LocationId: true,
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
