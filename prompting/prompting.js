import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GOOGLE_API_KEY)
  console.error("No API key found - set GOOGLE_API_KEY in .env ");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const file = "Transformer.pdf"; //"KG02.pdf"

async function main() {
  const prompt = `Use this document from a lecture and extract relevant exam questions similar to flashcards ar anki cards. Each card should have one question and four possible answers, with one of them being the correct one. The questions should help in understanding the topic. The answers must not be obvious. Do not include content that is not in the pdf in the questions and not in the answers. Answer with nothing else except the cards.`;

  const schema = {
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
  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: "application/pdf",
        data: Buffer.from(fs.readFileSync(`./content/${file}`)).toString(
          "base64"
        ),
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents, //"Explain how AI works in a few words",
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: schema,
    },
  });

  // Check if the response contains the expected candidates and content
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
    }
  }

  console.log(JSON.stringify(response, null, 2));

  // Print each card in an easy readable way
  cards.forEach((card, idx) => {
    console.log(`\nFlashcard #${idx + 1}:`);
    console.log(`Q: ${card.question}`);
    console.log(`  1) ${card.answer1}`);
    console.log(`  2) ${card.answer2}`);
    console.log(`  3) ${card.answer3}`);
    console.log(`  4) ${card.answer4}`);
    console.log(
      `Correct Answer: ${card[`answer${card.correctAnswer}`] || "[unknown]"}`
    );
  });

  if (!cards.length) console.log("No flashcards found in the response.");

  //console.log(response.candidates[0].content.text);
}

await main();
