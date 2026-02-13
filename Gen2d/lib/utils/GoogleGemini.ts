import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";
import { Env } from "../config";
import { SystemInstructions } from "./systemInstructions";

const genAI = new GoogleGenerativeAI(Env.GoogleApiKey);

const fallbackModel = "gemini-2.5-flash"
const fallbackModel2 = "gemini-2.5-flash-lite"

export async function sendRequestGemini(
  messages: Message[],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: Env.GoogleGeminiModel,
    systemInstruction: SystemInstructions,
  });

  const response = await model.generateContent({
    contents: messages.map((message) => {
      return {
        role: Env.GoogleGeminiModel.includes("lite")
          ? message.role == "assistant"
            ? "model"
            : "user"
          : message.role,
        parts: [{ text: message.content }],
      };
    }),
  });

  return response.response.text()
}

export async function sendRequestGeminiFallback(
  messages: Message[],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: fallbackModel,
    systemInstruction: SystemInstructions,
  });

  const response = await model.generateContent({
    contents: messages.map((message) => {
      return {
        role: fallbackModel.includes("lite")
          ? message.role == "assistant"
            ? "model"
            : "user"
          : message.role,
        parts: [{ text: message.content }],
      };
    }),
  });

  return response.response.text()
}

export async function sendRequestGeminiFallback2(
  messages: Message[],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: fallbackModel2,
    systemInstruction: SystemInstructions,
  });

  const response = await model.generateContent({
    contents: messages.map((message) => {
      return {
        role: fallbackModel2.includes("lite")
          ? message.role == "assistant"
            ? "model"
            : "user"
          : message.role,
        parts: [{ text: message.content }],
      };
    }),
  });

  return response.response.text()
}

