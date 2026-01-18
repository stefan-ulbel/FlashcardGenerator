/**
 * Example response:
 *
 * {
 *   "id": "quiz-1768575191114",
 *   "filesUploaded": 1,
 *   "questions": [
 *   {
 *     "id": "q-1",
 *     "question": "According to the lecture, which process is defined as projecting token IDs into a higher dimensional vector space?",
 *     "options": [
 *       "Tokenisation",
 *       "Encoding",
 *       "Embeddings",
 *       "Positional encoding"
 *     ],
 *     "correctAnswer": 2
 *   },
 *   {
 *     "id": "q-2",
 *     "question": "In the human analogy for the attention mechanism, which term describes 'the actual knowledge' being shared?",
 *     "options": [
 *       "Query",
 *       "Key",
 *       "Value",
 *       "Multi-head"
 *     ],
 *     "correctAnswer": 2
 *   },
 *   {
 *     "id": "q-3",
 *     "question": "Why is the input to the softmax function scaled (divided by the square root of d_k) in the attention formula?",
 *     "options": [
 *       "To increase the vocabulary size",
 *       "To ensure gradient stability and smooth the curve",
 *       "To allow the model to see future tokens",
 *       "To transform tokens into a one-dimensional space"
 *     ],
 *     "correctAnswer": 1
 *   },
 *   {
 *     "id": "q-4",
 *     "question": "In a Cross Attention block, from where are the Key (K) and Value (V) matrices derived?",
 *     "options": [
 *       "The decoder's input",
 *       "The encoder's output",
 *       "The positional encoding layer",
 *       "The final softmax layer"
 *     ],
 *     "correctAnswer": 1
 *   },
 *   {
 *     "id": "q-5",
 *     "question": "What is the specific purpose of the 'Mask' in the masked attention mechanism?",
 *     "options": [
 *       "To project the result to the output shape",
 *       "To attend to different perspectives in parallel",
 *       "To ensure that token predictions depend only on previous tokens",
 *       "To create the bridge between the encoder and decoder"
 *     ],
 *     "correctAnswer": 2
 *   }
 * ],
 *   "createdAt": "2026-01-16T14:53:11.114Z"
 * }
 */
export type GenerateQuizResponse = {
  id: string
  filesUploaded: number
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: 0 | 1 | 2 | 3
  }[]
  createdAt: string
}
