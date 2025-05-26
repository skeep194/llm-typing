import { GoogleGenAI } from "@google/genai";

const key = process.env.GEMINI_KEY
const ai = new GoogleGenAI({ apiKey: key });

export async function getLLMResponse(prompt: string, model: string) {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  return response.text!;
}
