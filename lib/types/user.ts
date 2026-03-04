import type { Prisma } from '@prisma/client';

/**
 * Модуль содержит типы и функции для работы с данными пользователя.
 * Он предоставляет функцию для получения селектов и включений данных,
 * а также тип данных пользователя и связанных сущностей.
 *
 * @function getUserDataSelect - Функция для получения селекта данных пользователя
 * @type {UserData} - Тип данных пользователя с включением информации о пользователе
 */

export function getUserDataSelect() {
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

export type UserData = Prisma.UserGetPayload<{
	select: ReturnType<typeof getUserDataSelect>;
}>;
