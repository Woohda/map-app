/**
 * @module app/composables/useContainerHeight
 * @fileoverview Composable для автоматической настройки высоты контейнера относительно viewport
 * @description
 * Этот модуль вычисляет и устанавливает максимальную высоту контейнера на основе позиции элемента
 * и доступного пространства в viewport. Поддерживает адаптивное изменение при ресайзе окна.
 * ---
 * ### Логика работы:
 * 1. `Height Calculation`: Вычисляет доступную высоту как разницу между viewport height и позицией контейнера
 * 2. `Responsive`: Автоматически пересчитывает высоту при изменении размера окна
 * 3. `Visual Viewport Support`: Учитывает visualViewport для мобильных устройств с виртуальной клавиатурой
 * 4. `Minimum Height`: Гарантирует минимальную высоту 200px для usability
 *
 * ### API:
 * - `containerStyle`: Computed объект со стилями (maxHeight, overflowY)
 * - `updateHeight()`: Принудительное обновление высоты контейнера
 *
 * ### Особенности:
 * - Учитывает bottomPadding (38px) для отступов
 * - Поддерживает visualViewport для мобильных устройств
 * - Автоматическая подписка на события resize
 * - Корректная очистка listeners при unmount
 *
 * ### Параметры:
 * - `containerRef`: Ref<HTMLDivElement | undefined> - ссылка на DOM элемент контейнера
 *
 * ### Примечания:
 * - Использует window.visualViewport для поддержки мобильных браузеров
 * - Минимальная высота ограничена 200px для предотвращения слишком маленьких контейнеров
 * - Listeners автоматически удаляются при onUnmounted для предотвращения memory leaks
 *
 * ### Зависимости:
 * - Ref из vue
 * - computed, onMounted, onUnmounted, ref из vue
 */

import type { Ref } from 'vue';

import { computed, onMounted, onUnmounted, ref } from 'vue';

export function useContainerHeight(containerRef: Ref<HTMLDivElement | undefined>) {
  const containerMaxHeight = ref('auto');

  function updateHeight() {
    if (!containerRef.value)
      return;

    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const rect = containerRef.value.getBoundingClientRect();
    const topOffset = rect.top;
    const bottomPadding = 38;

    const availableHeight = viewportHeight - topOffset - bottomPadding;
    containerMaxHeight.value = `${Math.max(availableHeight, 200)}px`;
  }

  const containerStyle = computed(() => ({
    maxHeight: containerMaxHeight.value,
    overflowY: 'auto' as const,
  }));

  onMounted(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
    window.visualViewport?.removeEventListener('resize', updateHeight);
  });

  return {
    containerStyle,
    updateHeight,
  };
}
