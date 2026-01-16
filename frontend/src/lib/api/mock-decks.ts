import type { Deck, UpdateDeck } from '@/types/deck.ts'
import { delay } from '@/lib/delay.ts'
import { generateQuiz } from '@/lib/api/quiz.ts'

let mockDecks: Deck[] = [
  {
    id: 1,
    title: 'My First Deck',
    slug: 'my-first-deck',
    topic: 'Service Design',
    tags: [],
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
  {
    id: 2,
    title: 'My Lovely Deck',
    topic: 'Cloud Continuum',
    slug: 'my-lovely-deck',
    tags: [],
    last_learned_at: '2026-01-16T15:54:12.643Z',
    flashcards: [
      {
        id: 1,
        question:
          "According to the OpenFog Consortium's definition, what distinguishes Fog Computing from Edge Computing in terms of architecture?",
        answers: [
          'Fog computing is a vertical architecture restricted to the first hop of IoT devices.',
          'Fog computing is a system-level horizontal architecture that distributes resources anywhere along the continuum.',
          'Fog computing focuses exclusively on the boundary between digital and physical entities.',
          "Fog computing is a telco-oriented case that only spans the operator's network edge.",
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        question:
          'In the context of the IoT software stack, which of the following is a specific requirement for the Gateway level?',
        answers: [
          'A Hardware Abstraction Layer (HAL) for direct sensor access.',
          'At least two different network technologies to handle heterogeneous radios and cloud connectivity.',
          'Centralized registration for authentication and access control of all devices.',
          'Special-purpose RTOS for MCU-based devices to minimize power consumption.',
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question:
          "Which challenge is specifically noted regarding 'scaling out' in the computing continuum compared to the cloud?",
        answers: [
          'The lack of open standards preventing interoperability between device stacks.',
          'Cloud providers refusing to allow offloading from edge devices.',
          'Limited availability of nearby edge hosts and the fact that they may belong to other owners.',
          'The inherent inability of edge devices to run general-purpose operating systems like Linux.',
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        question:
          "What is identified as a primary reason for the transition away from the 'traditional' cloud-centric IoT design?",
        answers: [
          'The lack of resource-hungry services in contemporary IoT environments.',
          'The discovery that cloud instances have finite compute capacity for data analysis.',
          'Data transport straining the network infrastructure and threatening privacy.',
          'The inability of cloud platforms to provide end-to-end control and interoperability.',
        ],
        correctAnswer: 3,
      },
      {
        id: 5,
        question:
          'Which design principle for IoT software stacks ensures that each stack component can be utilized independently of the others?',
        answers: ['Loose coupling', 'Platform independence', 'Well-defined APIs', 'Modularity'],
        correctAnswer: 1,
      },
    ],
  },
]

let nextId = 3

export const fetchDecks = async (): Promise<Deck[]> => {
  await delay(500)

  return mockDecks
}

export const fetchDeck = async (slug: string): Promise<Deck | null> => {
  await delay(500)

  return mockDecks.find((deck) => deck.slug === slug) ?? null
}

export const addDeck = async (formData: FormData): Promise<Deck> => {
  const title = formData.get('title')
  if (!title) {
    throw new Error("'title' field is required")
  }

  const topic = formData.get('topic')
  if (!topic) {
    throw new Error("'topic' field is required")
  }

  const deck: Deck = {
    id: nextId,
    title: title.toString(),
    topic: topic.toString(),
    slug: title.toString().toLowerCase().replace(/\s/g, '-'),
    tags: [],
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
