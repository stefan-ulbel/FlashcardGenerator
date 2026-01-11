<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <!--  <DashboardLayout>
    <RouterView />
  </DashboardLayout>-->

  {{ count }}

  <button @click="count++">Add</button>
</template>

<style scoped></style>
