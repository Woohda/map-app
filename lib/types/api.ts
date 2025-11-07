export type FieldErrors = Record<string, string>;

// Универсальный ответ для запросов авторизации
export type AuthResponse<TSuccess = true>
	= | { fieldErrors: FieldErrors } // ошибки по полям
		| { generalError: string } // общая ошибка
		| { success: TSuccess }; // успешный результат (можно типизировать для login, signup)
