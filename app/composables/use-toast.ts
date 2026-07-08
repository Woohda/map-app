/**
 * @module app/composables/use-toast
 * @fileoverview Composable для управления toast уведомлениями
 * @description
 * Этот модуль реализует систему toast уведомлений с использованием reducer pattern.
 * Поддерживает добавление, обновление, отклонение и удаление уведомлений с автоматической очисткой.
 * ---
 * ### Логика работы:
 * 1. **State Management**: Использует ref для хранения состояния тостов и reducer pattern для обновлений
 * 2. **Action Types**: Поддерживает 4 типа действий:
 *    - `ADD_TOAST`: Добавление нового уведомления (с ограничением TOAST_LIMIT)
 *    - `UPDATE_TOAST`: Обновление существующего уведомления
 *    - `DISMISS_TOAST`: Отклонение уведомления (скрытие с последующим удалением)
 *    - `REMOVE_TOAST`: Полное удаление уведомления из состояния
 * 3. **Auto-dismiss**: Автоматическое удаление уведомлений через TOAST_REMOVE_DELAY (2000ms)
 * 4. **Queue Management**: Использует Map для отслеживания таймаутов и предотвращения дублирования
 * 5. **API**:
 *    - `toast(props)`: Создает новое уведомление и возвращает объект с методами управления
 *    - `useToast()`: Composable для доступа к списку тостов и методу dismiss
 *    - `dismiss(toastId?)`: Отклоняет конкретное уведомление или все
 *
 * ### Особенности:
 * - Ограничение количества одновременно отображаемых тостов (TOAST_LIMIT = 1)
 * - Поддержка динамического контента (string, VNode, функция возвращающая VNode)
 * - Автоматическая генерация уникальных ID для каждого уведомления
 * - Возможность обновления существующего уведомления через метод update()
 * - Интеграция с компонентом Toaster через ToastProps
 *
 * ### Типы данных:
 * - `StringOrVNode`: string | VNode | (() => VNode) — тип для контента уведомления
 * - `ToasterToast`: Расширяет ToastProps с id, title, description, action
 * - `Action`: Union type для всех возможных действий reducer
 * - `State`: Интерфейс состояния с массивом тостов
 *
 * ### Примечания:
 * - Использует singleton pattern для state (глобальное состояние для всех компонентов)
 * - Таймауты очищаются при повторном вызове addToRemoveQueue для предотвращения дублирования
 * - При достижении лимита старые тости удаляются (FIFO)
 */

import type { Component, VNode } from 'vue';

import { computed, ref } from 'vue';

import type { ToastProps } from '~/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 2000;

export type StringOrVNode
  = | string
    | VNode
    | (() => VNode);

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: StringOrVNode;
  action?: Component;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action
  = | {
    type: ActionType['ADD_TOAST'];
    toast: ToasterToast;
  }
  | {
    type: ActionType['UPDATE_TOAST'];
    toast: Partial<ToasterToast>;
  }
  | {
    type: ActionType['DISMISS_TOAST'];
    toastId?: ToasterToast['id'];
  }
  | {
    type: ActionType['REMOVE_TOAST'];
    toastId?: ToasterToast['id'];
  };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId))
    return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

const state = ref<State>({
  toasts: [],
});

function dispatch(action: Action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      state.value.toasts = [action.toast, ...state.value.toasts].slice(0, TOAST_LIMIT);
      break;

    case actionTypes.UPDATE_TOAST:
      state.value.toasts = state.value.toasts.map(t =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t,
      );
      break;

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      }
      else {
        state.value.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      state.value.toasts = state.value.toasts.map(t =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t,
      );
      break;
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined)
        state.value.toasts = [];
      else
        state.value.toasts = state.value.toasts.filter(t => t.id !== action.toastId);

      break;
  }
}

function useToast() {
  return {
    toasts: computed(() => state.value.toasts),
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

type Toast = Omit<ToasterToast, 'id'>;

function toast(props: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      duration: 2000,
      onOpenChange: (open: boolean) => {
        if (!open)
          dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export { toast, useToast };
