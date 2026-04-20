import { useState } from "react"
import { Link } from "react-router-dom"
import { Project, ProjectCard } from "./ProjectCard"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/context/LanguageContext"
import { motion, AnimatePresence } from "motion/react"

export function ProjectsGrid({ limit }: { limit?: number }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState("All")

  const categories = [
    { id: "All", name: t("common.categories.all") },
    { id: "Product", name: t("common.categories.product") },
    { id: "Brand", name: t("common.categories.brand") },
    { id: "Web", name: t("common.categories.web") },
    { id: "Mobile", name: t("common.categories.mobile") }
  ]

  const projects: Project[] = [
    {
      id: "1",
      title: "Lumia Finance",
      category: "Product",
      image: "https://picsum.photos/seed/finance/800/600",
      description: t("projects.p1.desc"),
      year: "2024"
    },
    {
      id: "2",
      title: "EcoSphere",
      category: "Brand",
      image: "https://picsum.photos/seed/nature/800/600",
      description: t("projects.p2.desc"),
      year: "2023"
    },
    {
      id: "3",
      title: "Nova Dashboard",
      category: "Web",
      image: "https://picsum.photos/seed/dashboard/800/600",
      description: t("projects.p3.desc"),
      year: "2024"
    },
    {
      id: "4",
      title: "Aura Health",
      category: "Mobile",
      image: "https://picsum.photos/seed/health/800/600",
      description: t("projects.p4.desc"),
      year: "2023"
    },
    {
      id: "5",
      title: "Zenith Retail",
      category: "Product",
      image: "https://picsum.photos/seed/retail/800/600",
      description: t("projects.p5.desc"),
      year: "2024"
    },
    {
      id: "6",
      title: "Stark Lab",
      category: "Brand",
      image: "https://picsum.photos/seed/lab/800/600",
      description: t("projects.p6.desc"),
      year: "2023"
    }
  ]

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter
  )

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-12 border-b border-border/30 pb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8 reveal">
            <span className="text-primary font-black text-xs tracking-[0.8em] uppercase">{t("work.archive")}</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <h2 className="text-4xl md:text-6xl font-light reveal leading-[1.05] tracking-tight">
            {t("work.descriptionTitle")}
          </h2>
        </div>
        
        {!limit && (
          <div className="flex flex-wrap gap-x-12 gap-y-6 reveal md:justify-end">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.4em] transition-all relative py-4 whitespace-nowrap",
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
          </div>
        )}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-40"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.slice(0, limit || projects.length).map((p, i) => {
            const isLarge = i % 3 === 0;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                key={p.id} 
                className={cn(
                  "relative group",
                  isLarge ? "md:col-span-12" : "md:col-span-6",
                  !isLarge && i % 3 === 2 ? "md:mt-32" : ""
                )}
              >
                <div className="absolute -left-12 -top-12 text-[180px] font-black opacity-[0.02] select-none pointer-events-none transform -translate-x-1/3 group-hover:opacity-[0.06] transition-opacity duration-1000">
                  0{i + 1}
                </div>
                <ProjectCard project={p} variant={isLarge ? "large" : "standard"} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {limit && (
        <div className="mt-40 text-center reveal">
          <Button variant="outline" size="lg" className="h-16 px-12 rounded-full border-border/50 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all cursor-pointer" asChild>
            <Link to="/work">{t("work.viewAll")}</Link>
          </Button>
        </div>
      )}
    </section>
  )
}
