import skillsData from "@/app/data/skills.json";
import { Tooltip } from "@/components/ui/tooltip";
import { FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import {
  SiTypescript,
  SiSupabase,
  SiMysql,
  SiVercel,
  SiAnthropic,
  SiN8N,
} from "react-icons/si";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { BiLogoPostgresql } from "react-icons/bi";
import { VscVscode } from "react-icons/vsc";

interface SkillItem {
  name: string;
  icon: string;
  description: string;
}

const iconMap: Record<string, React.ElementType> = {
  FaHtml5,
  FaCss3Alt,
  IoLogoJavascript,
  SiTypescript,
  FaReact,
  RiNextjsFill,
  RiTailwindCssFill,
  SiSupabase,
  BiLogoPostgresql,
  SiMysql,
  FaGitAlt,
  FaGithub,
  VscVscode,
  SiVercel,
  SiAnthropic,
  SiN8N,
};

export function Skills() {
  const skills = skillsData as Record<string, SkillItem[]>;
  return (
    <section
      id="skills"
      className="py-20 bg-background/50 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Skills & Tools
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            The technologies and tools I use to bring ideas to life.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-2xl font-bold capitalize text-center md:text-left border-b-2 border-primary/20 pb-4 text-primary flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2 h-8 bg-primary rounded-full hidden md:block"></span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {items.map((skill: SkillItem) => {
                  const Icon = iconMap[skill.icon] || FaHtml5;
                  return (
                    <Tooltip key={skill.name} content={skill.description}>
                      <div className="flex flex-col items-center gap-3 group cursor-pointer">
                        <div className="relative w-20 h-20 flex items-center justify-center bg-card rounded-2xl shadow-sm border-2 border-border/50 group-hover:border-primary group-hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all duration-300 p-4">
                          <Icon className="w-full h-full text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <span className="text-base font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
