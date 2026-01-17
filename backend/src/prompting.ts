import { GoogleGenAI } from "@google/genai";
import { DataFile } from "./types";

// Helper function to determine MIME type
function getMimeType(filename: string, mimetype: string): string {
  if (mimetype) return mimetype;

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    md: "text/markdown",
    txt: "text/plain",
  };
  const ext = filename.toLowerCase().split(".").pop();
  return ext ? mimeTypes[ext] : "application/octet-stream";
}

// Schema for quiz (multiple choice)
const quizSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "The question for the flashcard",
      },
      answer1: {
        type: "string",
        description: "First possible answer",
      },
      answer2: {
        type: "string",
        description: "Second possible answer",
      },
      answer3: {
        type: "string",
        description: "Third possible answer",
      },
      answer4: {
        type: "string",
        description: "Fourth possible answer",
      },
      correctAnswer: {
        type: "integer",
        description: "The number (1-4) indicating which answer is correct",
        minimum: 1,
        maximum: 4,
      },
    },
    required: [
      "question",
      "answer1",
      "answer2",
      "answer3",
      "answer4",
      "correctAnswer",
    ],
    additionalProperties: false,
  },
};

// Schema for single question
const singleQuestionSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "The question for the flashcard",
      },
      answer: {
        type: "string",
        description: "The answer",
      },
    },
    required: ["question", "answer"],
    additionalProperties: false,
  },
};

// Export function for generating quiz
export async function generateQuiz(
  files: DataFile[] = [],
  numQuestions = 5
) {
  if (!process.env.GOOGLE_API_KEY)
    throw new Error("No API key found - set GOOGLE_API_KEY in .env ");
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  //const quizPrompt = `Use this document from a lecture and extract ${numQuestions} relevant exam questions similar to flashcards or anki cards. Each card should have one question and four possible answers, with one of them being the correct one. The answers must not be obvious. Do not include content that is not in the document in the questions and not in the answers. Answer with nothing else except the cards.`;
  const quizPrompt = `You are an expert educational content generator. Your task is to analyze the provided document and generate ${numQuestions} high-quality multiple-choice exam questions designed to test deep understanding and conceptual application of the material.

STRICT OUTPUT FORMAT:
Return ONLY a raw JSON array of objects (no markdown blocks, no intro text). 
Structure: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": index_number}]

DIFFICULTY BALANCE:
Ensure a natural learning curve. For every 5 questions generated:
- 1 Question should be a "Confidence Builder" (Direct concept check or fundamental definition).
- 4 Questions must be "Deep Application" (Scenario-based, comparative, or mechanistic) adhering to the rules below.

CRITICAL RULES FOR "DEEP APPLICATION" QUESTIONS:
1. Enforce Scenario-Based Application: Generate scenario-based questions where the user must apply a concept to a new, hypothetical situation not explicitly mentioned in the text. Do not ask for definitions; instead, present a problem or case study and ask the user to use the text's concepts to solve it.

2. Focus on Importance and Relationships: Avoid questions that merely ask 'Which of the following is an example of X?'. Instead, generate questions that probe the relationship between concepts, such as 'Why is Concept X critical for the success of Process Y?' or 'How does X influence Y?'.

3. Test Implications and Consequences: Focus on the practical implications of facts. Instead of defining a term, ask about the rights, permissions, or consequences resulting from that concept.

4. Target Mechanisms over Keywords: Avoid questions that can be answered by simply searching for a specific keyword and reading the immediate sentence. Instead, focus on Synthesis and Mechanism. Ask 'How' and 'Why' questions that require the user to explain the cause-and-effect mechanics of a process described in the text.

5. Prioritize Comparative Reasoning: Whenever the text discusses multiple distinct concepts, methods, or theories, generate comparative questions. Ask the user to distinguish between two concepts, identify trade-offs, or determine which method is best suited for a specific set of conditions.

6. Transform Lists into Conceptual Principles: Do not generate questions that simply test memory of a list (e.g., 'Which of these is one of the 5 stages?'). Instead, ask about the underlying principle or the progression of the list (e.g., 'What change in capability distinguishes Stage 2 from Stage 3?').

Ensure all information is strictly derived from the provided document. Do not use outside knowledge. The wrong answers (distractors) must be plausible and not obviously incorrect.`;

  const contents: any = [{ text: quizPrompt }];

  // Add file contents to the request
  for (const file of files) {
    const mimeType = getMimeType(file.filename, file.mimetype);
    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: file.content.toString("base64"),
      },
    });
  }

  const config = {
    responseMimeType: "application/json",
    responseJsonSchema: quizSchema,
  };

  const response: any = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config,
  });

  // Check response:
  let cards: any[] = [];
  if (response && response.candidates && response.candidates.length > 0) {
    // Try parsing the content as JSON
    let contentText =
      response.candidates[0].content?.parts?.[0]?.text ||
      response.candidates[0].content?.text;
    try {
      // If the top-level parsed object is an array, use that directly
      let parsed = JSON.parse(contentText);
      if (Array.isArray(parsed)) {
        cards = parsed;
      } else if (parsed && Array.isArray(parsed.cards)) {
        cards = parsed.cards;
      } else if (typeof parsed === "object") {
        // Sometimes the API might return a single card as object
        cards = [parsed];
      }
    } catch (e) {
      console.error("Failed to parse cards JSON:", e);
      console.log("Raw content:", contentText);
      throw new Error("Failed to parse quiz response from AI");
    }
  }

  // Transform to match expected format (quiz format with multiple choice)
  return cards.map((card, index) => ({
    id: `q-${index + 1}`,
    question: card.question,
    options: [card.answer1, card.answer2, card.answer3, card.answer4],
    correctAnswer: card.correctAnswer - 1, // Convert from 1-4 to 0-3
  }));
}

// Export function for generating single question flashcards using singleQuestionPrompt
export async function generateSingleQuestion(
  files: DataFile[] = []
) {
  if (!process.env.GOOGLE_API_KEY)
    throw new Error("No API key found - set GOOGLE_API_KEY in .env ");
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  //const singleQuestionPrompt = `Use this document from a lecture and extract relevant exam questions similar to flashcards or anki cards. Each card should have one question and one possible answer. The answers must not be obvious. Do not include content that is not in the document in the questions and not in the answers. Answer with nothing else except the cards.`;
  const singleQuestionPrompt = `You are an expert educational content generator. Your task is to analyze the provided document and generate high-quality single-question flashcards (Question & Answer) designed to test deep understanding and conceptual application of the material.

STRICT OUTPUT FORMAT:
Return ONLY a raw JSON array of objects (no markdown blocks, no intro text). 
Structure: [{"question": "...", "answer": "..."}]

DIFFICULTY BALANCE:
Ensure a natural learning curve. For every 5 questions generated:
- 1 Question should be a "Confidence Builder" (Direct concept check or fundamental definition).
- 4 Questions must be "Deep Application" (Scenario-based, comparative, or mechanistic) adhering to the rules below.

CRITICAL RULES FOR "DEEP APPLICATION" QUESTIONS:
1. Enforce Scenario-Based Application: Generate scenario-based questions where the user must apply a concept to a new, hypothetical situation. Do not ask for definitions; instead, present a problem or case study and ask the user to use the text's concepts to solve it.

2. Focus on Importance and Relationships: Ask 'Why is Concept X critical for Process Y?' or 'How does X influence Y?'. Avoid simple "What is X?" questions.

3. Test Implications and Consequences: Focus on practical implications. Ask about the rights, permissions, or consequences resulting from a concept (e.g., "What happens if...?").

4. Target Mechanisms over Keywords: Ask 'How' and 'Why' questions that require explaining the cause-and-effect mechanics of a process described in the text.

5. Prioritize Comparative Reasoning: Ask the user to distinguish between two concepts, identify trade-offs, or determine which method is best suited for specific conditions.

6. Transform Lists into Conceptual Principles: Do not ask for list memorization (e.g., "List the 5 stages"). Instead, ask about the underlying principle or the progression of the list (e.g., "What critical change occurs between Stage 2 and Stage 3?").

ANSWER QUALITY:
The answer must be concise but sufficiently detailed to validate the user's understanding.
- For scenarios: Identify the correct concept AND briefly explain *why* it applies based on the text.
- For comparisons: State the key distinction clearly.
- Ensure all information is strictly derived from the provided document.`;

  const contents: any = [{ text: singleQuestionPrompt }];

  // Add file contents to the request
  for (const file of files) {
    const mimeType = getMimeType(file.filename, file.mimetype);
    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: file.content.toString("base64"),
      },
    });
  }

  const config = {
    responseMimeType: "application/json",
    responseJsonSchema: singleQuestionSchema,
  };

  const response: any = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config,
  });

  // Parse response exactly as in main method
  let cards: any[] = [];
  if (response && response.candidates && response.candidates.length > 0) {
    // Try parsing the content as JSON
    let contentText =
      response.candidates[0].content?.parts?.[0]?.text ||
      response.candidates[0].content?.text;
    try {
      // If the top-level parsed object is an array, use that directly
      let parsed = JSON.parse(contentText);
      if (Array.isArray(parsed)) {
        cards = parsed;
      } else if (parsed && Array.isArray(parsed.cards)) {
        cards = parsed.cards;
      } else if (typeof parsed === "object") {
        // Sometimes the API might return a single card as object
        cards = [parsed];
      }
    } catch (e) {
      console.error("Failed to parse cards JSON:", e);
      console.log("Raw content:", contentText);
      throw new Error("Failed to parse single question response from AI");
    }
  }

  // Transform to match expected format
  return cards.map((card, index) => ({
    id: `q-${index + 1}`,
    question: card.question,
    answer: card.answer,
  }));
}
