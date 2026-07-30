import { useState } from "react"
import { ArrowUpRight, Github, Globe, X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { motion, AnimatePresence } from "motion/react"

export interface Project {
  id: string
  title: string
  category: string
  image: string
  description: string
  year: string
  repo_url?: string
  demo_url?: string
  tech_stack?: string[]
}

interface ProjectCardProps {
  project: Project
  variant?: "standard" | "large"
  className?: string
}

export function ProjectCard({ project, variant = "standard", className }: ProjectCardProps) {
  const isLarge = variant === "large"
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={cn("group block relative overflow-visible cursor-pointer", className)} onClick={() => setOpen(true)}>
        <div className={cn(
          "relative overflow-hidden bg-muted border border-border/50 transition-all duration-500 group-hover:border-primary/40",
          isLarge ? "aspect-[21/9] md:aspect-[3/1]" : "aspect-[4/5]"
        )}>
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isLarge
              ? "bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60"
              : "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          )} />

          {isLarge && (
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-20">
              <div className="flex items-end justify-between gap-8">
                <div className="max-w-xl">
                   <div className="flex items-center gap-3 mb-4">
                     <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 text-[9px] font-bold uppercase tracking-[0.3em] border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                       {project.category}
                     </span>
                     <span className="text-white/40 text-[9px] font-mono">{project.year}</span>
                   </div>
                   <h3 className="text-3xl md:text-6xl display-bold text-white tracking-tighter uppercase">{project.title}</h3>
                </div>
              </div>
            </div>
          )}

          {!isLarge && (
             <div className="absolute top-5 right-5 z-20">
                <div className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:bg-white/20">
                   <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
             </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3">
             <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">
               {project.category}
             </span>
             <div className="h-px grow bg-border/30" />
             <span className="text-[9px] font-medium text-muted-foreground">{project.year}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video relative overflow-hidden bg-zinc-900">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6 lg:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold px-2 py-0.5 border border-primary/30 bg-primary/5">{project.category}</span>
                  <span className="text-[10px] font-mono text-zinc-600">{project.year}</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase text-white">{project.title}</h2>
                <div className="w-12 h-0.5 bg-primary/40" />
                <p className="text-sm lg:text-base text-zinc-400 leading-relaxed">{project.description}</p>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="text-[9px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 border border-zinc-700/50">
                        #{tech}
                      </span>
                    ))}
                  </div>
                )}
                {(project.repo_url || project.demo_url) && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800/60">
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 h-10 px-5 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-primary hover:border-primary/50 transition-all">
                        <Github className="h-4 w-4" /> Repository
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 h-10 px-5 bg-primary text-black text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all">
                        <Globe className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}