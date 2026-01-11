<script setup lang="ts">
import { columns } from '@/components/decks/decks-columns.ts'
import type { Deck } from '@/types/deck.ts'

const decks = ref<Deck[]>([
  {
    id: 1,
    title: 'My First Deck',
    slug: 'my-first-deck',
    tags: ['math', 'physics'],
    last_learned_at: '2027-01-11T16:26:48Z',
    flashcards: [
      {
        id: 1,
        question: 'What is 2 + 2?',
        answer: '2 + 2 = 4',
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answer: '2 + 3 = 5',
      },
    ],
  },
  {
    id: 2,
    title: 'My Second Deck',
    slug: 'my-second-deck',
    tags: ['literature', 'history'],
    last_learned_at: '2025-01-11T16:26:48Z',
    flashcards: [
      {
        id: 1,
        question: 'What is 2 + 2?',
        answer: '2 + 2 = 4',
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answer: '2 + 3 = 5',
      },
    ],
  },
  {
    id: 3,
    title: 'My Third Deck',
    slug: 'my-third-deck',
    tags: ['computer science', 'engineering'],
    last_learned_at: '2023-01-11T16:26:48Z',
    flashcards: [
      {
        id: 1,
        question: 'What is 2 + 2?',
        answer: '2 + 2 = 4',
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answer: '2 + 3 = 5',
      },
    ],
  },
])
</script>

<template>
  <div class="flex flex-1 flex-col">
    <h1 class="text-4xl">Decks</h1>
    <DataTable class="mt-12" :columns="columns" :data="decks" />
  </div>
</template>

<style scoped></style>
