import type { Deck, UpdateDeck } from '@/types/deck.ts'
import { generateQuiz } from '@/lib/api/quiz.ts'

let mockDecks: Deck[] = [
  {
    id: 1,
    title: 'Example Deck',
    slug: 'example-deck',
    last_learned_at: '2026-01-16T15:29:42.100Z',
    flashcards: [
      {
        id: 1,
        question:
          'In comparing Service-Oriented Architecture (SOA) and Microservices (MS), which statement accurately describes their core tenets regarding resource sharing according to the document?',
        answers: [
          'Both SOA and MS aim to share as much as possible to foster reuse.',
          'SOA fosters reuse by sharing as much as possible, while MS shares as little as possible to allow for rapid evolution.',
          'SOA miniaturizes services for rapid evolution, while MS focuses on coarse-grained service composition.',
          'MS emphasizes a rigid, standard-driven specification, whereas SOA is non-prescriptive.',
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        question:
          "Which of the following is identified in the lecture as a microservice 'anti-pattern' that specifically violates independent state management?",
        answers: [
          'Splitting services based on business capabilities rather than tech layers.',
          'Implementing an API gateway to avoid NxN communication issues.',
          'Using shared libraries and shared persistence across multiple services.',
          'Employing service discovery to avoid hard-coded endpoints.',
        ],
        correctAnswer: 3,
      },
      {
        id: 3,
        question:
          "Based on the 'How it works' section of Serverless Computing, what factors typically determine the pricing for the user?",
        answers: [
          'The number of virtual machines reserved and the total storage capacity allocated.',
          'A fixed monthly subscription fee based on the complexity of the business logic.',
          'The number of invocations, the amount of RAM used, and the duration the memory is occupied.',
          "The total number of lines of code and the number of developers in the 'Two Pizza' team.",
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        question:
          "What is identified as the primary cause of the 'cold start' problem in serverless platforms?",
        answers: [
          'The latency introduced by cross-provider communication in multi-cloud environments.',
          'The time required to launch a container, retrieve an image, and bake the runtime when a function is first called.',
          "The 'scale-to-zero' principle which permanently deletes function code after a period of inactivity.",
          'Using WebAssembly or unikernels instead of standard Docker containers.',
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question:
          'When comparing Microservices to Serverless Functions in terms of granularity and lifespan, which distinction is correct?',
        answers: [
          'Microservices are ultra-fine (function-level) while Serverless Functions are fine-grained (microservice-level).',
          'Microservices are typically ephemeral, whereas Serverless Functions are long-lasting.',
          'Microservices have long-lasting lifespans and independent backends, while Serverless Functions are ephemeral and use external persistence.',
          "Both paradigms utilize a 'bounded context' for state management to ensure independent backend persistence.",
        ],
        correctAnswer: 3,
      },
    ],
  },
]

let nextId = 2

export const fetchDecks = async (): Promise<Deck[]> => {
  return mockDecks
}

export const fetchDeck = async (slug: string): Promise<Deck | null> => {
  return mockDecks.find((deck) => deck.slug === slug) ?? null
}

export const addDeck = async (formData: FormData): Promise<Deck> => {
  const title = formData.get('title')
  if (!title) {
    throw new Error("'title' field is required")
  }

  const deck: Deck = {
    id: nextId,
    title: title.toString(),
    slug: title.toString().toLowerCase().replace(/\s/g, '-'),
    last_learned_at: new Date().toISOString(),
    flashcards: [],
  }

  const quiz = await generateQuiz(formData)

  console.log('quiz', quiz)

  deck.flashcards = quiz.questions.map(({ question, options, correctAnswer }, index) => ({
    id: index + 1,
    question: question,
    answers: options,
    // NOTE: I think the `correctAnswer` field in the response is off by one for most questions.
    correctAnswer: (correctAnswer + 1) as 1 | 2 | 3 | 4,
  }))

  console.log('deck', deck)

  mockDecks.push(deck)
  nextId = nextId + 1

  return deck
}

export const editDeck = async (updateDeck: UpdateDeck): Promise<Deck | null> => {
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
