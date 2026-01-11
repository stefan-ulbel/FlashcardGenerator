export interface Deck {
  id: number
  title: string
  tags: string[]
  last_learned_at: string
  flashcards: Flashcard[]
}

export interface Flashcard {
  id: number
  question: string
  answer: string
}
