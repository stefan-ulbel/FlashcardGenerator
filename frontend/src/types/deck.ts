export interface Deck {
  id: number
  slug: string
  title: string
  tags: string[]
  last_learned_at: string
  flashcards: Flashcard[]
}

export interface Flashcard {
  id: number
  question: string
  answers: string[]
  correctAnswer: 1 | 2 | 3 | 4
}
