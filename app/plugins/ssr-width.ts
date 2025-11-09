/**
 * @module app/plugins/ssr-width
 * @fileoverview Плагин Nuxt для задания ширины окна при SSR (Server-Side Rendering).
 * @description
 * Этот модуль использует функцию `provideSSRWidth` из `@vueuse/core` для определения
 * ширины окна по умолчанию при серверном рендеринге. Позволяет компонентам и
 * composables корректно реагировать на ширину окна сразу на сервере.
 * ---
 * ### Логика работы:
 * 1. Экспортируется Nuxt плагин через `defineNuxtPlugin`.
 * 2. Внутри плагина вызывается `provideSSRWidth` с заданной шириной (например, 1024px).
 * 3. `nuxtApp.vueApp` используется для интеграции с Vue приложением.
 *
 * ### Особенности:
 * - Позволяет использовать адаптивные composables (`useWindowSize`, `useBreakpoints`) на SSR.
 * - Избегает рассинхронизации размеров окна между сервером и клиентом.
 *
 * ### Использование:
 * - Подключается автоматически как Nuxt плагин.
 * - Можно использовать в компонентах и composables для получения ширины окна.
 *
 * ### Применение:
 * - Улучшение SSR UX при работе с адаптивными интерфейсами.
 * - Предотвращение гидрационных несоответствий из-за ширины окна.
 */

import { provideSSRWidth } from '@vueuse/core';

export default defineNuxtPlugin((nuxtApp) => {
	provideSSRWidth(1024, nuxtApp.vueApp);
});
