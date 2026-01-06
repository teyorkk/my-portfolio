import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Get the generative model - using gemini-1.5-flash for better performance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Filter and limit history to last 7 messages for better context management
    const filteredHistory = (history || [])
      .filter((msg, index) => {
        // Ensure first message is from user
        if (index === 0 && msg.role === "model") return false;
        return true;
      })
      .slice(-7); // Keep last 7 messages for context

    // Build chat history
    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      history: await chat.getHistory(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
