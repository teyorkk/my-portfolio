import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import projectsData from "@/app/data/projects.json";

export function Projects() {
  const projects = projectsData;
  return (
    <section
      id="projects"
      className="py-20 bg-secondary/30 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            A selection of my recent works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <Link href={project.link || "#"} target="_blank">
                      <Github className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
