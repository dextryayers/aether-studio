import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Project, ProjectCard } from "./ProjectCard"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/context/LanguageContext"
import { motion, AnimatePresence } from "motion/react"
import { getProjects } from "@/src/services/data"

export function ProjectsGrid({ limit }: { limit?: number }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState("All")
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {
        setProjects([
          { id: "1", title: "Lumia Finance", category: "Web Fullstack", image: "https://picsum.photos/seed/finance/800/600", description: t("projects.p1.desc"), year: "2024", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["React", "Node.js", "PostgreSQL"] },
          { id: "2", title: "EcoSphere", category: "Front End Web", image: "https://picsum.photos/seed/nature/800/600", description: t("projects.p2.desc"), year: "2023", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["Vue", "Firebase", "Tailwind"] },
          { id: "3", title: "Nova Dashboard", category: "Tools", image: "https://picsum.photos/seed/dashboard/800/600", description: t("projects.p3.desc"), year: "2024", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["D3.js", "Express", "MongoDB"] },
          { id: "4", title: "Aura Health", category: "Web Fullstack", image: "https://picsum.photos/seed/health/800/600", description: t("projects.p4.desc"), year: "2023", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["Next.js", "Prisma", "TypeScript"] },
          { id: "5", title: "Zenith Retail", category: "Tools", image: "https://picsum.photos/seed/retail/800/600", description: t("projects.p5.desc"), year: "2024", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["Python", "Django", "Redis"] },
          { id: "6", title: "Stark Lab", category: "Front End Web", image: "https://picsum.photos/seed/lab/800/600", description: t("projects.p6.desc"), year: "2023", repo_url: "https://github.com", demo_url: "https://example.com", tech_stack: ["React", "Three.js", "WebGL"] },
        ])
      })
  }, [t])

  const categories = [
    { id: "All", name: "All" },
    { id: "Tools", name: "Tools" },
    { id: "Web Fullstack", name: "Web Fullstack" },
    { id: "Front End Web", name: "Front End Web" },
  ]

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter
  )

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-10 border-b border-border/20 pb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-primary font-black text-xs tracking-[0.8em] uppercase">{t("work.archive")}</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-light leading-[1.05] tracking-tight">
            {t("work.descriptionTitle")}
          </h2>
        </motion.div>
        
        {!limit && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-x-10 gap-y-4 md:justify-end"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.4em] transition-all relative py-3 whitespace-nowrap",
                  filter === c.id 
                    ? "text-primary" 
                    : "text-muted-foreground/40 hover:text-foreground"
                )}
              >
                {c.name}
                {filter === c.id && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-20 md:gap-y-24"
      >
        <AnimatePresence mode="popLayout">
          {displayedProjects.map((p, i) => {
            const isLarge = i % 3 === 0;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                key={p.id} 
                className={cn(
                  "relative group",
                  isLarge ? "md:col-span-12" : "md:col-span-6",
                  !isLarge && i % 3 === 2 ? "md:mt-16" : ""
                )}
              >
                <ProjectCard project={p} variant={isLarge ? "large" : "standard"} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {limit && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <Button variant="outline" size="lg" className="h-14 px-12 rounded-none border-border/50 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer" asChild>
            <Link to="/work">{t("work.viewAll")}</Link>
          </Button>
        </motion.div>
      )}
    </section>
  )
}
