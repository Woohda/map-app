<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { Button } from '~/components/ui/button';
import { cn } from '~/utils/utils';

import { useSidebar } from './utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { isMobile, toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    v-if="isMobile"
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="s"
    :class="cn('hover:text-primary duration-300', props.class)"
    @click="toggleSidebar"
  >
    <Icon name="tabler:layout-sidebar" size="27" />
  </Button>
</template>
