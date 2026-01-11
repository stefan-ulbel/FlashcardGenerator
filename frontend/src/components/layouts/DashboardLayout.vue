<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
</script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <main>
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>

<style scoped></style>
