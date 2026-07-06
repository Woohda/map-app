/**
 * @module server/utils/cache
 * @description
 * Модуль предоставляет универсальную функцию кэширования асинхронных операций.
 * Позволяет сохранять результаты вызовов функций в памяти на ограниченное время (TTL),
 * чтобы снизить количество повторных вычислений или запросов к внешним ресурсам.
 * ---
 * #### Особенности:
 * - Кэш реализован с помощью `Map` и живёт только в памяти текущего процесса.
 * - При перезапуске приложения или очистке контекста данные кэша теряются.
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
