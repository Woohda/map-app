/**
 * @module lib/types/validation
 * @fileoverview Валидация и типизация данных с использованием Zod
 * @description
 * Этот модуль предоставляет схемы валидации и типы для данных приложения с использованием Zod.
 * Включает валидацию для форм авторизации, регистрации, профиля и локаций.
 * ---
 * ### Логика работы:
 * 1. `requiredString`: Базовая схема для обязательных строковых полей.
 * 2. Схемы валидации для различных форм (signUp, signIn, updateUser, addLocation).
 * 3. Типы данных генерируются автоматически через `z.infer`.
 *
 * ### Схемы валидации:
 * - `signUpSchema`: Регистрация пользователя (email, name, username, password)
 * - `signInSchema`: Авторизация (login, password)
 * - `updateUserProfileSchema`: Обновление профиля (name, email, bio)
 * - `addLocationFormSchema`: Форма добавления локации (name, description)
 * - `addLocationSchema`: Добавление локации с координатами и изображениями
 *
 * ### Типы данных:
 * - `SignUpValues`: Тип для формы регистрации
 * - `SignInValues`: Тип для формы авторизации
 * - `UpdateUserProfileValues`: Тип для формы обновления профиля
 * - `AddLocationFormValues`: Тип для формы добавления локации
 * - `AddLocationValues`: Тип для добавления локации с координатами
 *
 * ### Примечания:
 * - Пароль в signUpSchema имеет мин длину 2 (критическая проблема безопасности).
 * - Username автоматически приводится к нижнему регистру.
 * - Все строковые поля обрезаются через trim.
 *
 * ### Зависимости:
 * - z из zod/v4
 */

import { z } from 'zod/v4';

const requiredString = z
  .string({
    error: iss =>
      iss.input === undefined ? 'Поле обязательно для заполнения' : 'Invalid input.',
  })
  .trim();

export const signUpSchema = z.object({
  email: z.email('Введите корректный email'),
  name: requiredString
    .min(1, 'Имя должно содержать минимум 1 символ')
    .max(30, 'Имя не должно превышать 30 символов'),
  username: requiredString
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .regex(/^\w+$/, 'Имя пользователя может содержать только латинские буквы, цифры и символ _')
    .transform(val => val.toLowerCase()),
  password: requiredString.min(2, 'Пароль должен содержать минимум 8 символов'),
  // .regex(
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  // 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
  // ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  login: requiredString,
  password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;

export const updateUserProfileSchema = z.object({
  name: z.string().trim().max(30, 'Имя не должно превышать 30 символов').optional(),
  email: z.email('Введите корректный email').optional(),
  bio: z.string().trim().max(150, 'Биография не должна превышать 150 символов').optional(),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const addLocationFormSchema = z.object({
  name: requiredString
    .min(1, 'Название должно содержать минимум 1 символ')
    .max(50, 'Название не должно превышать 50 символов'),
  description: z
    .string()
    .trim()
    .min(1, 'Описание должно содержать минимум 1 символ')
    .max(500, 'Описание не должно превышать 500 символов')
    .optional(),
});

const uploadedImageSchema = z.object({
  url: z.url('Некорректный URL изображения'),
  uploadthingKey: z.string().min(1, 'Ключ изображения обязателен'),
});

export const addLocationSchema = addLocationFormSchema.extend({
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(uploadedImageSchema).optional(),
});

export type AddLocationFormValues = z.infer<typeof addLocationFormSchema>;
export type AddLocationValues = z.infer<typeof addLocationSchema>;
