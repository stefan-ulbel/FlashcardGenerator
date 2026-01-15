import type { Flashcard } from '@/types/flashcard.ts'

export interface Deck {
  id: number
  slug: string
  title: string
  tags: string[]
  last_learned_at: string
  flashcards: Flashcard[]
}
