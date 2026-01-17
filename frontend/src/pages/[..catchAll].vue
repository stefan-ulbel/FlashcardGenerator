<script lang="ts" setup>
usePageStore().title = 'Not Found'
</script>

<template>
  <div>
    <p>Sorry, this page does not exist.</p>

    <Button class="mt-4" variant="outline">
      <RouterLink to="/">Go back home</RouterLink>
    </Button>
  </div>
</template>

<style scoped></style>
