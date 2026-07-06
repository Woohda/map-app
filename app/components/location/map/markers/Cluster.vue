<script setup lang="ts">
interface Props {
  length: number;
}

defineProps<Props>();
</script>

<template>
  <span
    class="flex justify-center items-center w-9 h-9 rounded-full border-2 border-primary bg-accent text-foreground cursor-pointer hover:scale-125 duration-300"
  >
    {{ length }}
  </span>
</template>

<style scoped></style>
