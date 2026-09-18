import { Terminal } from "lucide-react";

export function About() {
  const terminalSpecs = [
    { label: "role", value: "Advanced App Engineering Associate" },
    { label: "company", value: "Accenture" },
    { label: "education", value: "BSIT" },
    { label: "location", value: "Bulacan, PH" },
    { label: "os & wm", value: "Linux Mint + i3wm" },
    { label: "theme", value: "Catpuccin Mocha" },
    { label: "editor", value: "Neovim" },
    { label: "shell", value: "zsh" },
    { label: "core_stack", value: "React • Next.js • Spring Boot" },
    { label: "fav_movie", value: "La La Land" },
    { label: "fav_movie_character", value: "Paul Atreides" },
    { label: "fav_artist", value: "Elliott Smith, Phoebe Bridgers, Death Grips" },
    { label: "fav_album", value: "Punisher" },
    { label: "hobbies", value: "Cinema, Gaming, Music" },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-secondary/30 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            About Me
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
            System info, tech stack, and personal favorites.
          </p>
        </div>

        {/* Centered Terminal Showcase */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur overflow-hidden transition-all duration-300 hover:border-primary/50">
            {/* Terminal Window Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/70 border-b border-border/70 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 transition-opacity hover:opacity-100" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>moises@arrakis: ~ (zsh)</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm space-y-4">
              {/* Command line */}
              <div className="flex items-center gap-2 text-muted-foreground pb-2 border-b border-border/50">
                <span className="text-primary font-bold">moises@arrakis:~$</span>
                <span className="text-foreground">neofetch --user</span>
              </div>

              {/* Data grid */}
              <div className="space-y-2.5 pt-1">
                {terminalSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 text-foreground/90 hover:text-primary transition-colors py-0.5"
                  >
                    <span className="col-span-4 sm:col-span-3 text-muted-foreground">
                      {spec.label}
                    </span>
                    <span className="col-span-1 text-primary/60 text-center">:</span>
                    <span className="col-span-7 sm:col-span-8 font-medium break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status & Terminal Color Palette */}
              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Status: Active & shipping
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="w-3 h-3 rounded-full bg-sky-500/80" />
                  <span className="w-3 h-3 rounded-full bg-indigo-500/80" />
                  <span className="w-3 h-3 rounded-full bg-purple-500/80" />
                  <span className="w-3 h-3 rounded-full bg-zinc-400/80" />
                </div>
              </div>

              {/* Blinking prompt line */}
              <div className="pt-2 text-muted-foreground text-xs flex items-center gap-2">
                <span className="text-primary font-bold">moises@arrakis:~$</span>
                <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
