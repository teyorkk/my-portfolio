export function About() {
  return (
    <section
      id="about"
      className="py-20 bg-secondary/30 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            About Me
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            A passionate developer and IT student from La Consolacion University
            Philippines with a keen eye for design.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="space-y-6 text-center max-w-3xl">
            <h3 className="text-2xl font-bold">
              Driven by curiosity, fueled by coffee.
            </h3>
            <p className="text-muted-foreground">
              I am a web developer with extensive experience in building
              high-quality websites. My expertise lies in front-end development,
              where I specialize in React ecosystem. I love creating beautiful,
              accessible, and responsive interfaces that provide a great user
              experience.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              When I&apos;m not coding, I&apos;m exploring new technologies,
              contributing to open source, or gaming.
            </p>

            <div className="pt-8 flex justify-center">
              <div className="h-2 w-32 bg-gradient-to-r from-primary/50 to-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
