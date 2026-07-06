<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { Button } from '~/components/ui/button';
import { cn } from '~/utils/utils';

import { useSidebar } from './utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { state, toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="outline"
    size="s"
    :class="cn('absolute z-10 top-[-9px] right-[-9px] w-6 h-6 bg-card/90 border-accent-foreground rounded-full hover:border-primary hover:text-primary duration-300 shrink-0', props.class)"
    @click="toggleSidebar"
  >
    <Icon v-if="state === 'expanded'" name="tabler:x" class="text-foreground" />
    <Icon v-else name="tabler:chevrons-right" class="text-foreground" />
  </Button>
</template>
