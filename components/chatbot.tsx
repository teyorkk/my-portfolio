"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey there! Welcome to Moises Theo's portfolio! I'm here to help you explore his projects, skills, and experience. Ask me anything about his work, check out his GitHub repos, or learn about his certifications. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Convert chat messages to Gemini format, excluding initial greeting
      const history: Message[] = messages
        .slice(1) // Skip the initial assistant greeting
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full bg-primary text-primary-foreground p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-primary/90 ${
          isOpen
            ? "opacity-0 scale-0 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden shadow-2xl chatbot-open">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-primary text-primary-foreground p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-primary-foreground/20"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto p-3 sm:p-4 text-foreground">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary border border-border text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="text-xs sm:text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-code:text-foreground">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-1.5 sm:mb-2 last:mb-0">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-xs sm:text-sm">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-muted px-1 py-0.5 rounded text-[10px] sm:text-xs font-mono">
                              {children}
                            </code>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-secondary border border-border text-foreground px-3 py-2 sm:px-4 sm:py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]"></span>
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1.4s]"></span>
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1.4s]"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 sm:p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
