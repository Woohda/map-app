/**
 * @module server/utils/cache
 * @fileoverview Универсальная функция кэширования асинхронных операций
 * @description
 * Этот модуль предоставляет функцию кэширования для асинхронных операций с TTL.
 * Позволяет сохранять результаты вызовов функций в памяти на ограниченное время.
 * ---
 * ### Логика работы:
 * 1. Создание Map для хранения кэшированных значений с временем истечения.
 * 2. При каждом вызове проверка и очистка устаревших записей.
 * 3. Генерация ключа кэша из аргументов функции через `JSON.stringify`.
 * 4. Если значение есть в кэше и не истекло — возврат кэшированного значения.
 * 5. Если значения нет или истекло — выполнение функции и сохранение результата.
 *
 * ### Параметры:
 * - `fn`: Асинхронная функция для кэширования
 * - `ttl`: Время жизни кэша в секундах (по умолчанию 40)
 *
 * ### Примечания:
 * - Кэш реализован с помощью `Map` и живёт только в памяти текущего процесса.
 * - При перезапуске приложения данные кэша теряются.
 * - Подходит для временного хранения данных (например, из БД или API).
 */

export function cache<Args extends unknown[], Return>(fn: (...args: Args) => Promise<Return>, ttl = 40) {
  const map = new Map<string, { value: Return; expires: number }>();
  return async (...args: Args): Promise<Return> => {
    const now = Date.now();
    // Очистка устаревших записей
    for (const [key, { expires }] of map.entries()) {
      if (expires <= now) {
        map.delete(key);
      }
    }
    const key = JSON.stringify(args);
    const cached = map.get(key);
    if (cached && cached.expires > now)
      return cached.value;
    const value = await fn(...args);
    map.set(key, { value, expires: now + ttl * 1000 });
    return value;
  };
}
