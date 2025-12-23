"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#certifications", label: "Certifications" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-2 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <div className="relative h-30 w-30 transition-transform group-hover:scale-110">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Sun
                  className={`absolute h-5 w-5 icon-toggle ${
                    theme === "dark"
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-75 -rotate-90"
                  }`}
                />
                <Moon
                  className={`absolute h-5 w-5 icon-toggle ${
                    theme === "dark"
                      ? "opacity-0 scale-75 rotate-90"
                      : "opacity-100 scale-100 rotate-0"
                  }`}
                />
              </span>
            </Button>
          )}
        </nav>
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Sun
                  className={`absolute h-5 w-5 icon-toggle ${
                    theme === "dark"
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-75 -rotate-90"
                  }`}
                />
                <Moon
                  className={`absolute h-5 w-5 icon-toggle ${
                    theme === "dark"
                      ? "opacity-0 scale-75 rotate-90"
                      : "opacity-100 scale-100 rotate-0"
                  }`}
                />
              </span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Menu
                className={`absolute h-5 w-5 icon-toggle ${
                  isMenuOpen
                    ? "opacity-0 scale-75 -rotate-90"
                    : "opacity-100 scale-100 rotate-0"
                }`}
              />
              <X
                className={`absolute h-5 w-5 icon-toggle ${
                  isMenuOpen
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-75 rotate-90"
                }`}
              />
            </span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md shadow-lg mobile-dropdown-animate">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
