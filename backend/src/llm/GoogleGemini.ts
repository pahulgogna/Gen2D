import { GoogleGenerativeAI } from "@google/generative-ai";
import { Env } from "../config/config";
import { Message } from "../types";
import { SystemInstructions } from "../utils/systemInstructions";

const genAI = new GoogleGenerativeAI(Env.GoogleApiKey);

export async function* sendRequestGemini(
  messages: Message[],
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model: Env.GoogleGeminiModel,
    systemInstruction: SystemInstructions,
  });

  const response = await model.generateContentStream({
    contents: messages.map((message) => {
      return {
        role: message.role,
        parts: [{ text: message.content }],
      };
    }),
  });

  for await (const chunk of response.stream) {
    if (chunk.text) {
      yield chunk.text();
    }
  }
}
