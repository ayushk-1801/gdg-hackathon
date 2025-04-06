import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs";
import mime from "mime-types";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string"
      },
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: {
              type: "string"
            },
            options: {
              type: "array",
              items: {
                type: "string"
              },
              minItems: 4,
              maxItems: 4
            },
            answer: {
              type: "string"
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "question",
            "options",
            "answer",
            "explanation"
          ]
        },
        minItems: 5,
        maxItems: 5
      }
    },
    required: [
      "summary",
      "questions"
    ]
  },
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // TODO: Following code needs to be updated for client-side apps.
  const candidates = result.response.candidates;
  for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if(part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  console.log(result.response.text());
}

run();