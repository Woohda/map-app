import type { User } from 'lucia';

// Универсальный ответ для запросов авторизации
export type AuthResponse
	= | { user: User }
		| { fieldErrors?: Record<string, string>; generalError?: string };
