import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row h-[unset] md:h-24 items-center justify-between gap-4 px-4 md:px-6">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © 2025 Moises Theo T Atienza. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/teyorkk" className="text-muted-foreground hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/moises-atienza-a58a422aa" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="mailto:moisestheotatienza@gmail.com" className="text-muted-foreground hover:text-primary">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
