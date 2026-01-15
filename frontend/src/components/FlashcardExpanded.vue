<script lang="ts" setup>
import type { Flashcard } from '@/types/flashcard.ts'

defineProps<{
  flashcard: Flashcard
}>()
</script>

<template>
  <Card>
    <CardHeader class="flex items-center space-x-2">
      <div
        class="bg-muted text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg text-2xl font-bold"
      >
        Q
      </div>
      <span class="text-lg font-semibold">{{ flashcard.question }}</span>
    </CardHeader>
    <Separator />

    <CardContent class="space-y-4">
      <FlashcardExpandedAnswer
        v-for="(answer, index) in flashcard.answers"
        :key="index"
        :answer
        :correct="index + 1 === flashcard.correctAnswer"
        :position="index + 1"
      />
    </CardContent>
  </Card>
</template>
