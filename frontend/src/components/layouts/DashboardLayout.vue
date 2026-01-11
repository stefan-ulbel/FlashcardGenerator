<script setup lang="ts"></script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <div>
      <div class="flex items-center space-x-4 p-3 text-xl">
        <SidebarTrigger />
        <DashboardBreadcrumb />
      </div>

      <main class="p-6">
        <slot />
      </main>
    </div>
  </SidebarProvider>
</template>

<style scoped></style>
