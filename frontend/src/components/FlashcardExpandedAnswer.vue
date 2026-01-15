<script lang="ts" setup>
defineProps<{
  answer: string
  position: number
  correct: boolean
}>()
</script>

<template>
  <p class="flex items-center space-x-3">
    <span
      :class="[correct ? 'bg-green-400' : 'bg-red-400']"
      class="text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xl font-bold"
    >
      {{ position }}
    </span>
    <span :class="{ 'font-bold': correct }">
      {{ answer }}
    </span>
  </p>
</template>
