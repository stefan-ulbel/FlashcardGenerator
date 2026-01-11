<script setup lang="ts"></script>

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
