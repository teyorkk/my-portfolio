import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatRequest {
  message: string;
  history?: Message[];
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for a web developer's portfolio website. Your role is to:

1. Help visitors learn about the portfolio owner's skills, projects, and experience
2. Answer questions about web development, technologies, and the portfolio content
3. When asked about current events, news, or information that requires up-to-date data, use the search_web function to get the latest information
4. Be friendly, professional, and concise in your responses
5. If you need to search for information, always use the search_web function before responding

Remember to use the search_web function whenever you need current information, news, or data that might change over time.`;

async function searchWeb(query: string): Promise<string> {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      return `I attempted to search for "${query}" but encountered an issue. Here's what I know: For the latest information, I recommend checking reliable news sources or search engines directly.`;
    }

    const data = await response.json();

    let results = "";

    if (data.AbstractText) {
      results += data.AbstractText + "\n\n";
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      results += "Related information:\n";
      data.RelatedTopics.slice(0, 3).forEach((topic: any, index: number) => {
        if (topic.Text) {
          results += `${index + 1}. ${topic.Text}\n`;
        }
      });
    }

    if (data.Answer) {
      results = data.Answer + "\n\n" + results;
    }

    return (
      results ||
      `I searched for "${query}" but didn't find specific results. Please try rephrasing your question or check reliable news sources directly.`
    );
  } catch (error) {
    console.error("Search error:", error);
    return `I encountered an error while searching. For the latest information about "${query}", please check reliable news sources or search engines directly.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: [
        {
          functionDeclarations: [
            {
              name: "search_web",
              description:
                "Search the web for current information, news, or up-to-date data. Use this function when you need to find the latest information about current events, news, recent developments, or any information that changes over time.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description:
                      "The search query to look up on the web. Should be specific and relevant to what the user is asking about.",
                  },
                },
                required: ["query"],
              } as any,
            },
          ],
        },
      ],
    });

    const filteredHistory: Message[] = (history || [])
      .filter((msg: Message, index: number) => {
        if (index === 0 && msg.role === "model") return false;
        return true;
      })
      .slice(-7);

    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const functionResponses = await Promise.all(
        functionCalls.map(async (call: any) => {
          if (call.name === "search_web") {
            const query = call.args?.query || message;
            const searchResults = await searchWeb(query);
            return {
              functionResponse: {
                name: "search_web",
                response: {
                  results: searchResults,
                  query: query,
                },
              },
            };
          }
          return null;
        })
      );

      const validResponses = functionResponses.filter((r) => r !== null);

      if (validResponses.length > 0) {
        result = await chat.sendMessage(validResponses);
        response = result.response;
      }
    }

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
