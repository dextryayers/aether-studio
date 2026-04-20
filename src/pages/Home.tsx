import { PageLayout } from "@/src/components/layout/PageLayout"
import { Hero } from "@/src/components/sections/Hero"
import { ProjectsGrid } from "@/src/components/sections/ProjectsGrid"
import { ServicesSection } from "@/src/components/sections/ServicesSection"
import { Button } from "@/src/components/ui/button"
import { Link } from "react-router-dom"
import { useLanguage } from "@/src/context/LanguageContext"
import { SEO } from "@/src/components/layout/SEO"

export default function Home() {
  const { t } = useLanguage()

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
            { label: "Neural Load", value: "Optimal", status: "emerald" },
            { label: "Uptime Protocol", value: "99.98% / 0.02ms", status: "emerald" },
            { label: "Current Sector", value: "Creative Recon", status: "blue" },
            { label: "Signal Fidelity", value: "High-Freq", status: "emerald" }
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

        <ProjectsGrid limit={3} />
        <ServicesSection />

        {/* Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto border border-border/50 p-16 md:p-32 text-center space-y-12 relative overflow-hidden bg-muted/20">
             <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-primary/20" />
             <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-primary/20" />
             
             <h2 className="text-5xl md:text-[120px] display-bold leading-[0.85] relative z-10 transition-transform duration-700 uppercase tracking-tighter">
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
