<script setup lang="ts"></script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <div>
      <div class="p-3 text-xl">
        <SidebarTrigger />
      </div>

      <main class="p-6">
        <slot />
      </main>
    </div>
  </SidebarProvider>
</template>

<style scoped></style>
