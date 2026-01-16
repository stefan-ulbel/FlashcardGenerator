import type { Deck, UpdateDeck } from '@/types/deck.ts'
import { delay } from '@/lib/delay.ts'

let mockDecks: Deck[] = [
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
        answers: ['2 + 2 = 4', '2 + 2 = 5', '2 + 2 = 0', '2 + 2 = -1'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 4', '2 + 3 = 5', '2 + 3 = 0', '2 + 3 = -1'],
        correctAnswer: 2,
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
        answers: ['2 + 2 = 4', '2 + 2 = 5', '2 + 2 = 0', '2 + 2 = -1'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 4', '2 + 3 = 5', '2 + 3 = 0', '2 + 3 = -1'],
        correctAnswer: 2,
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
        answers: ['2 + 2 = 4', '2 + 2 = 5', '2 + 2 = 0', '2 + 2 = -1'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 2 + 3?',
        answers: ['2 + 3 = 4', '2 + 3 = 5', '2 + 3 = 0', '2 + 3 = -1'],
        correctAnswer: 2,
      },
    ],
  },
]

let nextId = 4

export const fetchDecks = async (): Promise<Deck[]> => {
  await delay(500)

  return mockDecks
}

export const fetchDeck = async (slug: string): Promise<Deck | null> => {
  await delay(500)

  return mockDecks.find((deck) => deck.slug === slug) ?? null
}

export const addDeck = async (formData: FormData): Promise<Deck> => {
  await delay(500)

  console.log(formData)

  const title = formData.get('title')
  if (!title) {
    throw new Error("'title' field is required")
  }

  const deck: Deck = {
    id: nextId,
    title: title.toString(),
    slug: title.toString().toLowerCase().replace(/\s/g, '-'),
    tags: [],
    last_learned_at: new Date().toISOString(),
    flashcards: [],
  }

  mockDecks.push(deck)
  nextId = nextId + 1

  return deck
}

export const editDeck = async (updateDeck: UpdateDeck): Promise<Deck | null> => {
  await delay(500)

  const existingDeck = mockDecks.find((deck) => deck.id === updateDeck.id)
  if (!existingDeck) {
    return null
  }

  existingDeck.title = updateDeck.title
  existingDeck.slug = updateDeck.title.toLowerCase().replace(/\s/g, '-')

  return existingDeck
}

export const removeDeck = async (slug: string): Promise<void> => {
  mockDecks = mockDecks.filter((deck) => deck.slug !== slug)
}
