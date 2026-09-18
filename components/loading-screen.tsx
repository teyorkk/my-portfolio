"use client";

import * as React from "react";
import { Terminal } from "lucide-react";

export function LoadingScreen() {
  const [typedText, setTypedText] = React.useState("");
  const [isExecuted, setIsExecuted] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const command = "pnpm run build";

  React.useEffect(() => {
    document.body.style.overflow = "hidden";

    let currentIndex = 0;
    let typingTimer: NodeJS.Timeout;
    let executeTimer: NodeJS.Timeout;
    let fadeTimer: NodeJS.Timeout;
    let unmountTimer: NodeJS.Timeout;

    const startDelay = setTimeout(() => {
      typingTimer = setInterval(() => {
        if (currentIndex < command.length) {
          setTypedText(command.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingTimer);

          executeTimer = setTimeout(() => {
            setIsExecuted(true);

            fadeTimer = setTimeout(() => {
              setIsFading(true);
            }, 450);

            unmountTimer = setTimeout(() => {
              setIsVisible(false);
              document.body.style.overflow = "";
            }, 900);
          }, 180);
        }
      }, 50);
    }, 120);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingTimer);
      clearTimeout(executeTimer);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background px-4 select-none transition-all duration-500 ease-in-out ${isFading
          ? "opacity-0 pointer-events-none scale-105"
          : "opacity-100 scale-100"
        }`}
      aria-hidden="true"
    >
      {/* Background ambient glow */}
      <div className="absolute w-80 h-80 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Terminal Window */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur overflow-hidden transition-all duration-300">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/70 border-b border-border/70 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>moises@arrakis: ~/my-portfolio (zsh)</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm sm:text-base space-y-3 min-h-[130px]">
          {/* Command Prompt Line */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary font-bold">
              moises@arrakis:~/my-portfolio$
            </span>
            <span className="text-foreground tracking-wide font-medium">
              {typedText}
            </span>
            {!isExecuted && (
              <span className="inline-block w-2.5 h-5 bg-primary animate-pulse" />
            )}
          </div>

          {isExecuted && (
            <div className="space-y-1.5 pt-1 text-xs sm:text-sm animate-fade-in-up">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="font-bold">✓</span>
                <span>compiled in 420ms</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
