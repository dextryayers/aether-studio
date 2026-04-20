import { PageLayout } from "@/src/components/layout/PageLayout"
import { ProjectsGrid } from "@/src/components/sections/ProjectsGrid"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { Link } from "react-router-dom"
import { Badge } from "@/src/components/ui/badge"
import { SEO } from "@/src/components/layout/SEO"
import { motion } from "motion/react"

export default function Work() {
  const { t } = useLanguage()

  return (
    <PageLayout>
      <SEO 
        title={t("seo.work.title")} 
        description={t("seo.work.desc")}
        path="/work"
      />
      <div className="page-fade-in pb-32">
        {/* Editorial Header */}
        <section className="pt-40 lg:pt-60 pb-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-24">
            <div className="max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 mb-16"
              >
                 <span className="text-primary font-bold text-[10px] tracking-[1em] uppercase">SELECTED WORKS</span>
                 <div className="grow h-[1px] bg-border/50" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-[220px] display-bold text-foreground leading-[0.75] tracking-tighter uppercase"
              >
                {t("work.selected")} <br /> 
                <span className="italic font-light opacity-30">{t("work.works")}</span>
              </motion.h1>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row gap-16 items-start md:items-end justify-between border-t border-border pt-16"
            >
              <p className="text-2xl md:text-5xl text-muted-foreground font-light leading-[1.05] max-w-3xl tracking-tight">
                {t("work.description")}
              </p>
              <div className="space-y-4 md:text-right hidden md:block">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Volume</span>
                 <p className="text-3xl tracking-tighter opacity-50 italic">20—24</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Case Study Preview (Performance Optimized) */}
        <section className="px-6 mb-40 lg:mb-60">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group cursor-pointer relative border border-border/50 bg-muted/20"
            >
               <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden relative">
                  <img 
                    src="https://picsum.photos/seed/featured-work/1920/820" 
                    alt="Featured Work" 
                    loading="lazy"
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-1000" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8 md:p-24">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 w-full">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">{t("work.featured")}</span>
                          </div>
                          <h2 className="text-4xl md:text-[140px] display-bold text-white uppercase leading-none tracking-tighter">Neural Protocol</h2>
                        </div>
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white flex items-center justify-center text-black group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                           <ArrowUpRight className="h-8 w-8 md:h-12 md:w-12" />
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Grid */}
        <section className="px-6 relative border-t border-border/30">
          <div className="max-w-7xl mx-auto pt-40">
            <div className="flex items-center justify-between mb-24 uppercase font-bold text-[10px] tracking-[0.4em] text-muted-foreground/50">
               <span className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-primary" />
                 {t("work.archive")}
               </span>
               <span className="hidden md:block">2024 — {t("work.present")}</span>
            </div>
            <ProjectsGrid />
          </div>
        </section>

        {/* Bottom CTA (Minimal Style) */}
        <section className="mt-60 lg:mt-80 px-6 py-60 border-t border-border/30">
           <div className="max-w-6xl mx-auto text-center space-y-20">
              <h3 className="text-5xl md:text-[180px] display-bold leading-[0.8] tracking-tighter uppercase">
                {t("work.visionTitle")}
              </h3>
              
              <Link 
                to="/contact"
                className="relative inline-flex flex-col items-center justify-center group"
              >
                <div className="w-40 h-40 md:w-60 md:h-60 border border-border rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 overflow-hidden">
                   <div className="relative z-10 text-foreground group-hover:text-white transition-colors">
                     <ArrowUpRight className="h-16 w-16 md:h-24 md:w-24 group-hover:rotate-45 transition-transform duration-500" />
                   </div>
                </div>
              </Link>
           </div>
        </section>
      </div>
    </PageLayout>
  )
}
