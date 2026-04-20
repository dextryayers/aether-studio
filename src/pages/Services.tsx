import { PageLayout } from "@/src/components/layout/PageLayout"
import { ServicesSection } from "@/src/components/sections/ServicesSection"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Zap, Target, Users, BarChart, ArrowRight } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { SEO } from "@/src/components/layout/SEO"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

export default function Services() {
  const { t } = useLanguage()

  return (
    <PageLayout>
      <SEO 
        title={t("seo.services.title")} 
        description={t("seo.services.desc")}
        path="/services"
      />
      <div className="page-fade-in pb-32">
        {/* Massive Header */}
        <section className="pt-40 lg:pt-60 pb-32 px-6 max-w-7xl mx-auto border-b border-border/50">
          <div className="max-w-5xl space-y-12">
             <motion.span 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-primary font-bold text-[10px] tracking-[0.8em] uppercase block"
             >
               {t("services.capabilities")}
             </motion.span>
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-6xl md:text-[200px] display-bold leading-[0.75] tracking-tighter uppercase"
             >
               {t("services.title")} <br /> 
               <span className="italic font-light opacity-30">{t("services.titleItalic")}</span>
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-xl md:text-3xl text-muted-foreground font-light leading-relaxed max-w-3xl"
             >
               {t("services.description")}
             </motion.p>
          </div>
        </section>
        
        {/* Services Grid (Restyled) */}
        <ServicesSection />

        {/* Immersive Process Section */}
        <section className="py-40 px-6 border-b border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
              <div className="space-y-24">
                <div className="space-y-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("services.execution")}</span>
                  <h2 className="text-4xl md:text-8xl display-bold leading-[0.9] uppercase tracking-tighter">{t("services.way")}</h2>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl">
                    {t("services.wayDesc")}
                  </p>
                </div>
                
                <div className="space-y-20 border-l border-border/50">
                   {[
                     { step: "01", title: t("services.steps.s1Title"), text: t("services.steps.s1Desc"), icon: Target },
                     { step: "02", title: t("services.steps.s2Title"), text: t("services.steps.s2Desc"), icon: Zap },
                     { step: "03", title: t("services.steps.s3Title"), text: t("services.steps.s3Desc"), icon: Users },
                     { step: "04", title: t("services.steps.s4Title"), text: t("services.steps.s4Desc"), icon: BarChart },
                   ].map((item, i) => (
                     <motion.div 
                        key={item.step} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative pl-12"
                      >
                        <div className="space-y-6">
                           <h4 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-6 uppercase">
                             <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                               <item.icon className="h-5 w-5 stroke-1" />
                             </div>
                             {item.title}
                           </h4>
                           <p className="text-muted-foreground leading-relaxed max-w-lg text-sm md:text-base">
                             {item.text}
                           </p>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>

              <div className="sticky top-20 hidden lg:block">
                 <div className="relative group border border-border/50 p-4">
                    <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                       <img 
                         src="https://picsum.photos/seed/aether-process/1000/1250" 
                         alt="Studio Process" 
                         loading="lazy"
                         className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white/60 text-[9px] font-bold tracking-[0.4em] uppercase mb-3">INTERNAL STUDIO PERSPECTIVE</p>
                          <p className="text-white text-xl font-medium italic opacity-80">"{t("services.quote")}"</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capability Tags */}
        <section className="py-40 px-6 max-w-7xl mx-auto border-b border-border/50">
           <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {["UI/UX DESIGN", "CUSTOM WEB DEVELOPMENT", "MOBILE INFRASTRUCTURE", "CREATIVE STRATEGY", "NEURAL INTEGRATION", "BRAND SYNTHESIS"].map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
                  {tag}
                </span>
              ))}
           </div>
        </section>

        {/* Final Statement */}
        <section className="py-40 px-6 text-center">
           <div className="max-w-4xl mx-auto space-y-16">
             <h3 className="text-3xl md:text-8xl display-bold uppercase tracking-tighter">{t("services.elevate")}</h3>
             <div className="flex justify-center">
                <Button size="lg" className="h-[70px] px-16 text-sm font-bold uppercase tracking-widest rounded-none gap-4 group transition-all" asChild>
                  <Link to="/contact">
                    {t("common.partnership")}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
             </div>
           </div>
        </section>
      </div>
    </PageLayout>
  )
}
