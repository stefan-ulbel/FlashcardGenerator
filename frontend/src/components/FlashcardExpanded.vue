<script lang="ts" setup>
import type { Flashcard } from '@/types/flashcard.ts'

const props = defineProps<{
  flashcard: Flashcard
}>()

const emit = defineEmits<{
  'update:flashcard': [value: Flashcard]
  'delete:flashcard': [value: Flashcard]
}>()

const onClickEdit = () => {
  emit('update:flashcard', props.flashcard)
}

const onClickDelete = () => {
  emit('delete:flashcard', props.flashcard)
}
</script>

<template>
  <Card>
    <CardHeader class="flex items-center justify-between">
      <span class="flex items-center space-x-2">
        <div
          class="bg-muted text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg text-2xl font-bold"
        >
          Q
        </div>
        <span class="text-lg font-semibold">{{ flashcard.question }}</span>
      </span>

      <span class="text-muted-foreground flex cursor-pointer items-center space-x-2 text-sm">
        <i-lucide-pencil class="hover:text-white" @click="onClickEdit" />
        <i-lucide-trash class="hover:text-red-500" @click="onClickDelete" />
      </span>
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
