import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "" });

export async function getLLMResponse(prompt: string, model: string) {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  return response.text!;
}
