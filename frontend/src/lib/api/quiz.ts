import type { GenerateQuizResponse } from '@/types/quiz.ts'

const API_BASE_URL = 'http://localhost:3000'

export const generateQuiz = async (formData: FormData): Promise<GenerateQuizResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    body: formData,
  })

  return response.json()
}
