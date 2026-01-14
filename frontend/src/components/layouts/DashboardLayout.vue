<script lang="ts" setup>
const { title } = storeToRefs(usePageStore())
</script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <div class="flex w-full flex-col">
      <div class="flex items-center space-x-4 p-3 text-xl">
        <SidebarTrigger />
        <DashboardBreadcrumb />
      </div>

      <main class="flex flex-1 flex-col gap-6 p-6">
        <h1 class="text-4xl">{{ title }}</h1>
        <slot />
      </main>
    </div>
  </SidebarProvider>
</template>

<style scoped></style>
