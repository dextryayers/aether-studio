import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface Project {
  id: string
  title: string
  category: string
  image: string
  description: string
  year: string
}

interface ProjectCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  project: Project
  variant?: "standard" | "large"
  className?: string
}

export function ProjectCard({ project, variant = "standard", className, ...props }: ProjectCardProps) {
  const isLarge = variant === "large"

  return (
    <Link 
      to={`/work/${project.id}`} 
      className={cn("group block relative overflow-visible", className)}
      {...props}
    >
      <div className={cn(
        "relative overflow-hidden bg-muted border border-border/50 transition-colors duration-500",
        isLarge ? "aspect-[21/9] md:aspect-[3/1]" : "aspect-[4/5] md:aspect-[4/5]"
      )}>
        {/* Main Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            loading="lazy"
            className="w-full h-full object-cover grayscale brightness-95 contrast-110 group-hover:scale-110 transition-transform duration-700 ease-out" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Minimal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 transition-opacity duration-500" />
        
        {isLarge && (
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-20">
            <div className="flex items-end justify-between gap-8">
              <div className="max-w-xl">
                 <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/70 mb-2 block">{project.category}</span>
                 <h3 className="text-4xl md:text-7xl display-bold text-white tracking-tighter uppercase">{project.title}</h3>
              </div>
              <div className="shrink-0 hidden md:block">
                 <div className="w-16 h-16 bg-white flex items-center justify-center text-black group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </div>
        )}

        {!isLarge && (
           <div className="absolute top-6 right-6 z-20">
              <div className="w-10 h-10 bg-white flex items-center justify-center text-black opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                 <ArrowUpRight className="h-4 w-4" />
              </div>
           </div>
        )}
      </div>

      {/* Content for standard variant (Below Image) */}
      {!isLarge && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3">
             <span className="text-[9px] uppercase tracking-[0.4em] text-primary font-bold">
               {project.category}
             </span>
             <div className="h-px grow bg-border/50" />
             <span className="text-[9px] font-medium text-muted-foreground">{project.year}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm line-clamp-2">
            {project.description}
          </p>
        </div>
      )}
    </Link>
  )
}
