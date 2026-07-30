import { useEffect, useState } from "react"
import { PageLayout } from "@/src/components/layout/PageLayout"
import { Hero } from "@/src/components/sections/Hero"
import { ProjectsGrid } from "@/src/components/sections/ProjectsGrid"
import { ServicesSection } from "@/src/components/sections/ServicesSection"
import { Button } from "@/src/components/ui/button"
import { Link } from "react-router-dom"
import { useLanguage } from "@/src/context/LanguageContext"
import { SEO } from "@/src/components/layout/SEO"
import { getTimeline, type TimelineData } from "@/src/services/data"

export default function Home() {
  const { t, language } = useLanguage()
  const [timelineEvents, setTimelineEvents] = useState<TimelineData[]>([])

  useEffect(() => {
    getTimeline()
      .then(setTimelineEvents)
      .catch(() => {
        // Fallback to translation data
        const fallback = t("home.timeline") as unknown as { year: string; title: string; event: string }[]
        setTimelineEvents(fallback.map((f, i) => ({
          id: String(i),
          year: f.year,
          title_en: f.title,
          title_id: f.title,
          event_en: f.event,
          event_id: f.event,
          order: i,
        })))
      })
  }, [t])

  return (
    <PageLayout>
      <SEO 
        title={t("seo.home.title")} 
        description={t("seo.home.desc")}
        path="/"
      />
      <div className="page-fade-in">
        <Hero />

        {/* Technical Diagnostic Header */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-border/50">
          {[
            { label: t("home.diag1Label"), value: t("home.diag1Value"), status: "emerald" },
            { label: t("home.diag2Label"), value: t("home.diag2Value"), status: "emerald" },
            { label: t("home.diag3Label"), value: t("home.diag3Value"), status: "blue" },
            { label: t("home.diag4Label"), value: t("home.diag4Value"), status: "emerald" }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`} />
                <span className="text-xs font-mono font-bold uppercase tracking-tight">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tech Stack Marquee */}
        <section className="py-20 border-y bg-muted/5 overflow-hidden">
          <div className="relative group flex overflow-hidden">
              <div className="animate-marquee flex gap-24 md:gap-40 items-center whitespace-nowrap marquee-container py-12">
                {[
                  { name: "React", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" },
                  { name: "Next.js", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" },
                  { name: "Tailwind", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tailwindcss.svg" },
                  { name: "Framer", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/framer.svg" },
                  { name: "TypeScript", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg" },
                  { name: "Vite", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg" },
                  { name: "Three.js", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/threedotjs.svg" },
                  { name: "GSAP", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gsap.svg" },
                ].map((tech, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0 scale-90 hover:scale-105 group/item">
                    <img src={tech.url} alt={`${tech.name} - Tech Stack used by Hanif Abdurrohim at Aether Studio`} className="w-16 h-16 dark:invert" referrerPolicy="no-referrer" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-foreground/50 group-hover/item:text-primary transition-colors uppercase">{tech.name}</span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "React", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" },
                  { name: "Next.js", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" },
                  { name: "Tailwind", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tailwindcss.svg" },
                  { name: "Framer", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/framer.svg" },
                  { name: "TypeScript", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg" },
                  { name: "Vite", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg" },
                  { name: "Three.js", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/threedotjs.svg" },
                  { name: "GSAP", url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gsap.svg" },
                ].map((tech, i) => (
                  <div key={`dup-${i}`} className="flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0 scale-90 hover:scale-105 group/item">
                    <img src={tech.url} alt={`${tech.name} - Technical Expertise of Hanif Abdurrohim`} className="w-16 h-16 dark:invert" referrerPolicy="no-referrer" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-foreground/50 group-hover/item:text-primary transition-colors uppercase">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="space-y-14">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rotate-45" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">{t("home.timelineTitle")}</span>
              <div className="h-px grow bg-border/30" />
            </div>
            <div className="relative pl-14 md:pl-16">
              <div className="absolute left-[7px] md:left-[8px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
               {(timelineEvents.length > 0 ? timelineEvents : []).map((item, i) => (
                 <div key={item.year || String(i)} className="relative pb-14 last:pb-0 group">
                   <div className="absolute left-[-14px] md:left-[-16px] top-1 w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-border bg-background flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500 z-10 shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-border group-hover:bg-white transition-colors duration-500" />
                   </div>
                   <div className="border-l-2 border-border/30 pl-8 md:pl-10 ml-[7px] md:ml-[8px] group-hover:border-primary/40 transition-colors duration-500">
                     <div className="bg-muted/5 border border-border/50 p-6 md:p-8 hover:border-primary/30 hover:bg-muted/10 hover:shadow-sm transition-all duration-500">
                       <div className="flex items-center gap-3 md:gap-4">
                         <span className="text-sm md:text-base font-mono text-primary/50 font-bold tracking-wider">
                           0{i + 1}
                         </span>
                         <div className="flex flex-col">
                           <span className="text-2xl md:text-4xl font-black tracking-tighter text-foreground leading-none">
                             {item.year}
                           </span>
                           <span className="text-xs md:text-sm font-mono text-primary/70 tracking-wider mt-1.5">
                             {language === "en" ? item.title_en : item.title_id}
                           </span>
                         </div>
                       </div>
                       <div className="mt-3 md:mt-4">
                         <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                           {language === "en" ? item.event_en : item.event_id}
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* About Me */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-14">
            <div className="w-2 h-2 bg-primary rotate-45" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">{t("home.aboutTitle")}</span>
            <div className="h-px grow bg-border/30" />
          </div>
          <div className="border border-border/50 bg-muted/5 p-6 md:p-10 hover:border-primary/30 hover:bg-muted/10 transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              <div className="shrink-0 w-full md:w-56 aspect-square overflow-hidden border border-border/50">
                <img
                  src="/main%20(1).png"
                  alt="Profile"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                  {t("home.aboutDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ProjectsGrid limit={3} />
        <ServicesSection />

        {/* Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto border border-border/50 p-16 md:p-32 text-center space-y-12 relative overflow-hidden bg-muted/20">
             <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-primary/20" />
             <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-primary/20" />
             
             <h2 className="text-5xl md:text-[72px] display-bold leading-[0.85] relative z-10 transition-transform duration-700 uppercase tracking-tighter">
               {t("home.ctaTitle")} <br />
               <span className="italic font-light opacity-30">{t("home.ctaItalic")}</span> <br />
               {t("home.ctaEnd")}
             </h2>
             <p className="text-lg md:text-2xl font-medium text-muted-foreground max-w-xl mx-auto leading-tight relative z-10 uppercase tracking-widest">
               {t("home.ctaDesc")}
             </p>
             <div className="pt-8 relative z-10">
               <Button size="lg" className="h-[70px] px-16 text-sm font-bold uppercase tracking-[0.4em] rounded-none hover:bg-primary transition-all duration-300" asChild>
                 <Link to="/contact">{t("home.ctaButton")}</Link>
               </Button>
             </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
