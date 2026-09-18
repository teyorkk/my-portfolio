import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CheckCircle2 } from "lucide-react";
import { SiAccenture } from "react-icons/si";
import experienceData from "@/app/data/experience.json";

export function Experience() {
  return (
    <section
      id="experience"
      className="py-20 bg-background scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Work Experience
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            My professional career path, enterprise projects, and technical training.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline connector */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/60 via-border to-border" />

          <div className="space-y-8">
            {experienceData.map((item, index) => (
              <div
                key={index}
                className="relative md:pl-16 group transition-all duration-300"
              >
                {/* Timeline node with Accenture logo */}
                <div className="hidden md:flex absolute left-5 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-card border-2 border-primary items-center justify-center shadow-md group-hover:scale-110 group-hover:border-[#A100FF] transition-all duration-300">
                  <SiAccenture className="w-4 h-4 text-[#A100FF]" />
                </div>

                <Card className="overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Accenture Logo Badge */}
                        <div className="w-12 h-12 rounded-xl bg-[#A100FF]/10 dark:bg-[#A100FF]/15 border border-[#A100FF]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#A100FF]/20 transition-colors">
                          <SiAccenture className="w-6 h-6 text-[#A100FF]" />
                        </div>

                        <div>
                          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                            {item.role}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm font-medium text-foreground/80">
                            <span className="font-semibold text-primary">{item.company}</span>
                            {item.type && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{item.type}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary bg-primary/10 border border-primary/30 px-3.5 py-1.5 rounded-full w-fit shrink-0 self-start sm:self-center shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-2">
                    <CardDescription className="text-sm sm:text-base leading-relaxed text-foreground/85">
                      {item.description}
                    </CardDescription>

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {item.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
