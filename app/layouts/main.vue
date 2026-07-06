<script setup lang="ts">
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
      <main
        class="min-h-screen pt-20"
        style="background-image: url('/images/bg-profile.png'); background-size: cover; background-position: center; background-attachment: fixed;"
      >
        <div class="w-full flex justify-center max-xl:px-5">
          <slot />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped></style>
