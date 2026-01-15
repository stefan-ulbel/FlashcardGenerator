import type { Deck } from '@/types/deck.ts'
import { delay } from '@/lib/delay.ts'

const mockDecks: Deck[] = [
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
        answers: ['2 + 2 = 4'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 5'],
        correctAnswer: 1,
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
        answers: ['2 + 2 = 4'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 5'],
        correctAnswer: 1,
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
        answers: ['2 + 2 = 4'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 5'],
        correctAnswer: 1,
      },
    ],
  },
]

export const fetchDecks = async (): Promise<Deck[]> => {
  await delay(1_000)

  return mockDecks
}

export const fetchDeck = async (slug: string): Promise<Deck | null> => {
  await delay(1_000)

  return mockDecks.find((deck) => deck.slug === slug) ?? null
}
