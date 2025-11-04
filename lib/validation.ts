import { z } from 'zod/v4';

/**
 * @module validation
 * @fileoverview Валидация и типизация данных с использованием Zod
 * @description
 * Модуль валидации данных приложения с использованием библиотеки Zod.
 * ## Основные возможности:
 * - Валидация данных форм;
 * - Типизация входных данных;
 * - Генерация сообщений об ошибках.
 * ## Схемы валидации:
 * - Базовая схема для обязательного строкового поля (requiredString)
 * - Регистрация пользователя (signUpSchema);
 * - Авторизация (signInSchema);
 * - Обновление профиля (updateUserProfileSchema).
 * ## Типы данных для значений:
 * - Формы регистрации (SignUpValues);
 * - Формы авторизации (SignInValues);
 * - Формы обновления профиля (UpdateUserProfileValues).
 */

const requiredString = z
	.string()
	.trim()
	.min(1, 'Поле обязательно для заполнения');

export const signUpSchema = z.object({
	email: z
		.email('Введите корректный email')
		.min(1, 'Поле обязательно для заполнения'),
	name: requiredString.max(30, 'Имя не должно превышать 30 символов'),
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
	user: requiredString,
	password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;

export const updateUserProfileSchema = z.object({
	name: requiredString.max(30, 'Имя не должно превышать 30 символов'),
	bio: z.string().trim().max(150, 'Биография не должна превышать 150 символов'),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
