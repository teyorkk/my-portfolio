import { Card } from "@/components/ui/card";
import { Award, Calendar } from "lucide-react";
import Link from "next/link";

import certificationsData from "@/app/data/certifications.json";

export function Certifications() {
  const certifications = certificationsData;
  return (
    <section
      id="certifications"
      className="py-20 bg-secondary/30 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Certifications
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Continuous learning is key to staying relevant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <Link
              key={index}
              href={cert.link || "#"}
              target="_blank"
              className="block h-full"
            >
              <Card className="flex flex-row items-center p-4 space-x-4 hover:shadow-lg transition-all h-full hover:border-primary/50 cursor-pointer">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {cert.date}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
