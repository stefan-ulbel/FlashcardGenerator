<script lang="ts" setup>
import type { Deck } from '@/types/deck.ts'

defineProps<{
  deck: Deck
}>()
</script>

<template>
  <Card
    class="flex flex-row items-center justify-between py-4 lg:flex-col lg:justify-start lg:py-6"
  >
    <CardHeader class="flex flex-1 items-center lg:w-full">
      <RouterLink
        :to="`/decks/${deck.slug}`"
        class="text-muted-foreground hover:text-primary flex items-center justify-start space-x-1"
      >
        <i-lucide-external-link class="text-sm" />
        <span class="text-lg">{{ deck.title }}</span>
      </RouterLink>
    </CardHeader>
    <CardContent class="lg:w-full lg:justify-start">
      <Button class="cursor-pointer">Practice</Button>
    </CardContent>
  </Card>
</template>

<style scoped></style>
