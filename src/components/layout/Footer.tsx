import { Link } from "react-router-dom"
import { Github, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com"
  const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com"
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com"

  return (
    <footer className="bg-background px-6 py-12 border-t border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
            © {currentYear} ARCHIVE // HANIIP
          </p>
          <p className="text-[8px] font-bold text-primary tracking-widest uppercase italic">
            POWERED BY HANIIPP.SPACE
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
