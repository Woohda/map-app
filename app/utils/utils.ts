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
