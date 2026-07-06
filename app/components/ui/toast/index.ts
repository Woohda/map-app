import type { VariantProps } from 'class-variance-authority';
import type { ToastRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { cva } from 'class-variance-authority';

export { default as Toast } from './Toast.vue';
export { default as ToastAction } from './ToastAction.vue';
export { default as ToastClose } from './ToastClose.vue';
export { default as ToastDescription } from './ToastDescription.vue';
export { default as Toaster } from './Toaster.vue';
export { default as ToastProvider } from './ToastProvider.vue';
export { default as ToastTitle } from './ToastTitle.vue';
export { default as ToastViewport } from './ToastViewport.vue';
export { toast, useToast } from '~/composables/use-toast';

export const toastVariants = cva(
  'group pointer-events-auto md:max-w-[350px] fixed bottom-4 right-4 flex items-center justify-between overflow-hidden bg-background/65 rounded-xl border p-3 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--reka-toast-swipe-end-x] data-[swipe=move]:translate-x-[--reka-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success:
          'success group text-success border-success-shadow text-shadow-(color:--color-success-shadow)',
        destructive:
          'destructive group border-destructive-shadow text-destructive text-shadow-(color:--color-destructive-shadow)',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ToastVariants = VariantProps<typeof toastVariants>;

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes['class'];
  variant?: ToastVariants['variant'];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
