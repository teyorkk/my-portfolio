import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type {
  Message,
  FunctionCall,
  ChatRequest,
} from "../../../lib/chatbot/types";
import {
  GEMINI_MODEL,
  MAX_HISTORY_MESSAGES,
  MAX_OUTPUT_TOKENS,
  TEMPERATURE,
} from "../../../lib/chatbot/config";
import { SYSTEM_PROMPT } from "../../../lib/chatbot/system-prompt";
import { getFunctionDeclarations } from "../../../lib/chatbot/function-declarations";
import { handleFunctionCall } from "../../../lib/chatbot/function-handlers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function filterHistory(history: Message[]): Message[] {
  return history
    .filter((msg, index) => !(index === 0 && msg.role === "model"))
    .slice(-MAX_HISTORY_MESSAGES);
}

function createModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    tools: [
      {
        functionDeclarations: getFunctionDeclarations(),
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json();

    const model = createModel();
    const filteredHistory = filterHistory(history || []);
    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: TEMPERATURE,
      },
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const functionResponses = await Promise.all(
        functionCalls.map((call: FunctionCall) =>
          handleFunctionCall(call, message)
        )
      );

      const validResponses = functionResponses.filter(
        (r): r is NonNullable<typeof r> => r !== null
      );

      if (validResponses.length > 0) {
        result = await chat.sendMessage(validResponses);
        response = result.response;
      }
    }

    return NextResponse.json({
      response: response.text(),
      history: await chat.getHistory(),
    });
  } catch (error) {
    console.error("Chat API error:", error);

    let errorMessage = "Failed to generate response";
    let status = 500;

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      if (
        errorMsg.includes("api key not valid") ||
        errorMsg.includes("api_key_invalid")
      ) {
        errorMessage =
          "GEMINI_API_KEY is invalid or not configured. Please check your environment variables.";
        status = 401;
      } else if (
        errorMsg.includes("gemini_api_key") ||
        errorMsg.includes("not configured")
      ) {
        errorMessage = "GEMINI_API_KEY is not configured";
        status = 500;
      } else if (errorMsg.includes("400") || errorMsg.includes("bad request")) {
        errorMessage = "Invalid request to AI service. Please try again.";
        status = 400;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
