import type { DuckDuckGoResponse } from "./types";
import { DUCKDUCKGO_API } from "./config";

export async function searchWeb(query: string): Promise<string> {
  try {
    const response = await fetch(
      `${DUCKDUCKGO_API}/?q=${encodeURIComponent(
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
      return `I attempted to search for "${query}" but encountered an issue. For the latest information, I recommend checking reliable news sources or search engines directly.`;
    }

    const data = (await response.json()) as DuckDuckGoResponse;
    return formatSearchResults(data, query);
  } catch (error) {
    console.error("Search error:", error);
    return `I encountered an error while searching. For the latest information about "${query}", please check reliable news sources or search engines directly.`;
  }
}

function formatSearchResults(data: DuckDuckGoResponse, query: string): string {
  const parts: string[] = [];

  if (data.Answer) {
    parts.push(data.Answer);
  }

  if (data.AbstractText) {
    parts.push(data.AbstractText);
  }

  if (data.RelatedTopics && data.RelatedTopics.length > 0) {
    const relatedInfo = data.RelatedTopics.slice(0, 3)
      .map((topic, index) => {
        if (topic.Text) {
          return `${index + 1}. ${topic.Text}`;
        }
        return null;
      })
      .filter((item): item is string => item !== null)
      .join("\n");

    if (relatedInfo) {
      parts.push(`Related information:\n${relatedInfo}`);
    }
  }

  return (
    parts.join("\n\n") ||
    `I searched for "${query}" but didn't find specific results. Please try rephrasing your question or check reliable news sources directly.`
  );
}
