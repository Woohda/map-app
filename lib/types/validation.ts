import { z } from 'zod/v4';

/**
 * @module lib/types/validation
 * @fileoverview Валидация и типизация данных с использованием Zod
 * @description
 * Модуль валидации данных приложения с использованием библиотеки Zod.
 * ---
 * ## Основные возможности:
 * - Валидация данных форм;
 * - Типизация входных данных;
 * - Генерация сообщений об ошибках.
 * ## Схемы валидации:
 * - Базовая схема для обязательного строкового поля (requiredString)
 * - Регистрация пользователя (signUpSchema);
 * - Авторизация (signInSchema);
 * - Обновление профиля (updateUserProfileSchema);
 * - Добавления локации (addLocationSchema).
 * ## Типы данных для значений:
 * - Формы регистрации (SignUpValues);
 * - Формы авторизации (SignInValues);
 * - Формы обновления профиля (UpdateUserProfileValues);
 * - Формы добавления локации (AddLocationValues).
 */

const requiredString = z
	.string({ error: iss => iss.input === undefined ? 'Поле обязательно для заполнения' : 'Invalid input.' })
	.trim();

export const signUpSchema = z.object({
	email: z
		.email('Введите корректный email'),
	name: requiredString
		.min(1, 'Имя должно содержать минимум 1 символ')
		.max(30, 'Имя не должно превышать 30 символов'),
	username: requiredString
		.min(3, 'Имя пользователя должно содержать минимум 3 символа')
		.regex(
			/^\w+$/,
			'Имя пользователя может содержать только латинские буквы, цифры и символ _',
		)
		.transform(val => val.toLowerCase()),
	password: requiredString.min(8, 'Пароль должен содержать минимум 8 символов'),
	// .regex(
	// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
	// 	'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
	// ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
	login: requiredString,
	password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;

export const updateUserProfileSchema = z.object({
	name: requiredString.max(30, 'Имя не должно превышать 30 символов'),
	bio: z.string().trim().max(150, 'Биография не должна превышать 150 символов'),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const addLocationFormSchema = z.object({
	name: requiredString.min(1, 'Название должно содержать минимум 1 символ')
		.max(100, 'Название не должно превышать 50 символов'),
	description: requiredString.min(1, 'Описание должно содержать минимум 1 символ')
		.max(500, 'Описание не должно превышать 500 символов'),
});

export const addLocationSchema = addLocationFormSchema.extend({
	latitude: z.number(),
	longitude: z.number(),
});

export type AddLocationFormValues = z.infer<typeof addLocationFormSchema>;
export type AddLocationValues = z.infer<typeof addLocationSchema>;
