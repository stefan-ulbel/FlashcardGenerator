export interface Flashcard {
  id: number
  question: string
  answers: string[]
  correctAnswer: 1 | 2 | 3 | 4
}
