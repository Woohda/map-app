<script
  setup
  lang="ts"
>
const props = defineProps<{
  label: string;
  icon: string;
}>();
</script>

<template>
  <NuxtLink class="flex items-center justify-start gap-2 p-2 visited:text-current hover:text-primary transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] rounded-sm outline-none">
    <Icon :name="props.icon" style="width: 20px; height: 20px;" />
    <span>{{ props.label }}</span>
  </NuxtLink>
</template>

<style scoped>

</style>
