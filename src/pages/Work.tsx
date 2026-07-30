import { PageLayout } from "@/src/components/layout/PageLayout"
import { ProjectsGrid } from "@/src/components/sections/ProjectsGrid"
import { ArrowUpRight, Briefcase, Eye } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
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
        <section className="relative pt-32 lg:pt-48 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-12 relative"
          >
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold text-[10px] tracking-[1em] uppercase">{t("ui.selectedWorks")}</span>
            <div className="grow h-px bg-border/50" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[110px] display-bold text-foreground leading-[0.75] tracking-tighter uppercase relative"
          >
            {t("work.selected")} <br /> 
            <span className="italic font-light opacity-30">{t("work.works")}</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex flex-col md:flex-row md:items-end gap-8 mt-16 pt-16 border-t border-border"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed md:flex-1 max-w-2xl">
              {t("work.description")}
            </p>
            <div className="flex items-center gap-6 md:gap-10 shrink-0">
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{t("work.volume")}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">20</span>
                <span className="text-2xl md:text-3xl font-light text-primary mx-0.5">-</span>
                <span className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">24</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <ProjectsGrid />

        {/* Bottom CTA */}
        <section className="mt-28 lg:mt-40 px-6">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
            </div>
            <div className="border-t border-border/20 pt-24 pb-20 relative">
              <div className="max-w-3xl mx-auto text-center space-y-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-7xl display-bold leading-[0.85] tracking-tighter uppercase"
                >
                  {t("work.visionTitle")}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto leading-relaxed"
                >
                  {t("work.ctaDesc")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                >
                  <Button 
                    asChild
                    className="h-14 px-12 rounded-none text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 transition-all group relative overflow-hidden"
                  >
                    <Link to="/contact">
                      <span className="relative z-10 flex items-center">
                        {t("work.startProject")}
                        <ArrowUpRight className="ml-3 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
