import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GOOGLE_API_KEY)
  console.error("No API key found - set GOOGLE_API_KEY in .env ");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Helper function to determine MIME type
function getMimeType(filename, mimetype) {
  if (mimetype) return mimetype;

  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes = {
    'pdf': 'application/pdf',
    'md': 'text/markdown',
    'txt': 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
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
export async function generateQuiz(files = [], topic = '', numQuestions = 5) {
  const quizPrompt = `Use this document from a lecture and extract ${numQuestions} relevant exam questions similar to flashcards or anki cards. Each card should have one question and four possible answers, with one of them being the correct one. The questions should help in understanding the topic${topic ? `: ${topic}` : ''}. The answers must not be obvious. Do not include content that is not in the document in the questions and not in the answers. Answer with nothing else except the cards.`;

  const contents = [{ text: quizPrompt }];

  // Add file contents to the request
  for (const file of files) {
    const mimeType = getMimeType(file.filename, file.mimetype);
    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: file.content.toString('base64'),
      },
    });
  }

  const config = {
    responseMimeType: "application/json",
    responseJsonSchema: quizSchema,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config,
  });

  // Check response:
  let cards = [];
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
export async function generateSingleQuestion(files = [], topic = '') {
  const singleQuestionPrompt = `Use this document from a lecture and extract relevant exam questions similar to flashcards or anki cards. Each card should have one question and one possible answer. The questions should help in understanding the topic${topic ? `: ${topic}` : ''}. The answers must not be obvious. Do not include content that is not in the document in the questions and not in the answers. Answer with nothing else except the cards.`;

  const contents = [{ text: singleQuestionPrompt }];

  // Add file contents to the request
  for (const file of files) {
    const mimeType = getMimeType(file.filename, file.mimetype);
    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: file.content.toString('base64'),
      },
    });
  }

  const config = {
    responseMimeType: "application/json",
    responseJsonSchema: singleQuestionSchema,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config,
  });

  // Parse response exactly as in main method
  let cards = [];
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

