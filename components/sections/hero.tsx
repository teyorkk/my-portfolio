import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 md:pt-5">
      <div className="container max-w-screen-xl px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center z-10 mx-auto">
        {/* Image on Left Side */}
        <div className="flex justify-center lg:justify-end order-1 w-full animate-fade-in-left">
          <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/me.jpg"
              alt="Profile"
              fill
              priority
              sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 400px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Text on Right Side */}
        <div className="space-y-6 text-center lg:text-left order-2 animate-fade-in-right">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Available for Freelance Work
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Hi, I&apos;m <span className="text-primary">Moises</span>
            <br />
            Web Developer
          </h1>
          <p className="mx-auto lg:mx-0 max-w-[700px] text-muted-foreground text-lg md:text-xl">
            I build accessible, pixel-perfect, performant, and premium web
            experiences. Specialized in React, Next.js, and Modern UI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 md:mb-0">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#contact">Hire Me</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-300"
              asChild
            >
              <Link href="#projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Background Gradient Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] max-w-[90vw] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
}
