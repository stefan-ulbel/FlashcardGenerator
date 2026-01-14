import type { Deck } from '@/types/deck.ts'

const mockDecks = [
  {
    id: 1,
    title: 'My First Deck',
    slug: 'my-first-deck.ts',
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
    slug: 'my-second-deck.ts',
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
    slug: 'my-third-deck.ts',
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
]

export const useDeckStore = defineStore('deck', () => {
  const decks = ref<Deck[]>(mockDecks)

  return { decks }
})
