/**
 * @module utils/utils
 * @fileoverview Утилитарные функции для приложения
 * @description
 * Коллекция переиспользуемых функций для работы со строками, классами и географическими расчетами.
 *
 * ## Функциональность:
 * - 🎨 Объединение CSS классов с Tailwind
 * - 📝 Форматирование текста
 * - 🔗 Генерация slug из названий
 * - 📍 Расчет расстояний между точками
 * - 🌍 Транслитерация кириллицы
 *
 * ## Функции:
 * - `cn()` - объединение CSS классов
 * - `capitalizeWords()` - капитализация слов
 * - `generateSlug()` - создание slug из строки
 * - `calculateDistance()` - расчет расстояния по формуле гаверсинуса
 *
 * ## Использование:
 * ```typescript
 * import { cn, capitalizeWords, generateSlug, calculateDistance } from '~/utils/utils';
 *
 * // CSS классы
 * cn('base-class', 'additional-class', { 'conditional': true });
 *
 * // Форматирование
 * capitalizeWords('hello world'); // "Hello World"
 *
 * // Slug
 * generateSlug('Мое место'); // "moe-mesto"
 *
 * // Расчет расстояния
 * calculateDistance(55.75, 37.61, 59.93, 30.31); // ~635 км
 * ```
 */

import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalizeWords(str: string) {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z\u0400-\u04FF0-9\s]/g, '') // Удаляем спецсимволы
		.replace(/[\u0400-\u04FF]/g, (match) => {
			const map: Record<string, string> = {
				а: 'a',
				б: 'b',
				в: 'v',
				г: 'g',
				д: 'd',
				е: 'e',
				ё: 'yo',
				ж: 'zh',
				з: 'z',
				и: 'i',
				й: 'y',
				к: 'k',
				л: 'l',
				м: 'm',
				н: 'n',
				о: 'o',
				п: 'p',
				р: 'r',
				с: 's',
				т: 't',
				у: 'u',
				ф: 'f',
				х: 'h',
				ц: 'ts',
				ч: 'ch',
				ш: 'sh',
				щ: 'sch',
				ъ: '',
				ы: 'y',
				ь: '',
				э: 'e',
				ю: 'yu',
				я: 'ya',
			};
			return map[match] || match;
		})
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Радиус Земли в км
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a
		= Math.sin(dLat / 2) * Math.sin(dLat / 2)
			+ Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
			* Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}
