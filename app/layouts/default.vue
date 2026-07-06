<script
    setup
    lang="ts"
>
import Header from '~/components/app/header/Header.vue';
import AppSidebar from '~/components/app/sidebar/AppSidebar.vue';
</script>

<template>
  <SidebarProvider
    :default-open="true"
    class="min-h-screen w-full"
  >
    <AppSidebar />
    <SidebarInset class="min-h-screen">
      <Header />
      <main class="w-full">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
</style>
