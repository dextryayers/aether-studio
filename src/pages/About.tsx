import { PageLayout } from "@/src/components/layout/PageLayout"
import { ArrowUpRight, ShieldCheck, Zap, Globe, Sparkles, Binary, Fingerprint, Network, Terminal } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { SEO } from "@/src/components/layout/SEO"
import { motion } from "motion/react"
import { LanyardBadge } from "@/src/components/ui/LanyardBadge"

export default function About() {
  const { t } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <PageLayout>
      <SEO 
        title={t("seo.about.title")} 
        description={t("seo.about.desc")}
        path="/about"
      />
      <div className="bg-background text-foreground selection:bg-primary selection:text-white">
        
        {/* Cinematic Technical Hero */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-24 border-b border-border overflow-hidden">
          {/* Technical Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
            <div className="absolute top-0 left-1/4 w-px h-full bg-foreground" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-foreground" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-foreground" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 py-2 px-4 border border-border w-fit bg-muted/20"
                >
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t("about.weAre")} PROTOCOL</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-[140px] display-bold leading-[0.85] tracking-tighter uppercase"
                >
                  {t("about.weAre")} <br /> 
                  <span className="italic font-light opacity-30">AETHER</span>
                </motion.h1>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-8 max-w-2xl"
              >
                <p className="text-2xl md:text-4xl font-bold leading-tight uppercase tracking-tight text-foreground">
                   {t("about.heroTitle")}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium border-l-2 border-primary pl-8 italic">
                  {t("about.description")}
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.2 }}
              >
                <LanyardBadge />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Manifesto: Minimalist Technical Grid */}
        <section className="py-40 px-6 border-b border-border bg-muted/5 relative">
           <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[1em] text-primary/30 uppercase">System Manifesto</div>
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                 <h2 className="text-5xl md:text-[8vw] display-bold leading-[0.8] tracking-tighter uppercase">
                    {t("about.title")} <br />
                    <span className="italic font-light opacity-30 underline decoration-1 decoration-primary/20 underline-offset-[20px]">{t("about.titleItalic")}</span>
                 </h2>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                       <Binary className="w-6 h-6" />
                    </div>
                    <div className="h-12 flex items-center px-6 border border-border text-[10px] font-black tracking-widest uppercase">
                       Version 4.0.21
                    </div>
                 </div>
              </div>

              <div className="space-y-12 text-xl md:text-3xl font-medium text-muted-foreground leading-tight italic">
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {t("about.manifestoSub1")}
                </motion.p>
                <div className="w-full h-px bg-border" />
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {t("about.manifestoSub2")}
                </motion.p>
              </div>
           </div>
        </section>

        {/* Core Values: Hardware Interface Design */}
        <section className="py-40 px-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b pb-12 border-border">
               <div className="space-y-4">
                 <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">{t("about.manifesto")}</span>
                 <h2 className="text-5xl font-black uppercase tracking-tighter">Operational Values</h2>
               </div>
               <p className="text-muted-foreground max-w-sm text-sm font-medium uppercase tracking-widest leading-loose">
                  Strategic principles engineered for high-fidelity execution and absolute precision.
               </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border"
            >
              {[
                { title: t("about.values.v1"), icon: ShieldCheck, desc: t("about.values.v1Desc"), prefix: "01" },
                { title: t("about.values.v2"), icon: Zap, desc: t("about.values.v2Desc"), prefix: "02" },
                { title: t("about.values.v3"), icon: Globe, desc: t("about.values.v3Desc"), prefix: "03" },
                { title: t("about.values.v4"), icon: Sparkles, desc: t("about.values.v4Desc"), prefix: "04" }
              ].map((v, i) => (
                <motion.div 
                  key={v.title} 
                  variants={itemVariants}
                  className="p-12 bg-background group hover:bg-muted/30 transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-[40px] font-black text-foreground opacity-[0.03] group-hover:opacity-[0.08] transition-opacity font-mono">
                    {v.prefix}
                  </div>
                  <div className="mb-12 w-12 h-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 scale-110">
                    <v.icon className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tighter uppercase mb-6 relative z-10">{v.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                    {v.desc}
                  </p>
                  
                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-border scale-0 group-hover:scale-100 transition-transform origin-bottom-right duration-500" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Studio Statistics: Technical Readout */}
        <section className="py-40 px-6 border-y border-border bg-muted/20 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-24">
                {[
                  { value: "50+", label: t("about.stats.projects"), icon: Network },
                  { value: "3", label: t("about.stats.experience"), icon: Terminal },
                  { value: "12", label: t("about.stats.awards"), icon: ShieldCheck },
                  { value: "99%", label: t("about.stats.retention"), icon: Zap },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-6 group"
                  >
                     <div className="flex items-center gap-3">
                        <stat.icon className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="h-px grow bg-border group-hover:bg-primary/50 transition-colors" />
                     </div>
                     <span className="block text-6xl md:text-[120px] font-black text-foreground tracking-tighter leading-none transition-transform group-hover:-translate-y-2 duration-500">
                        {stat.value}
                     </span>
                     <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary block border-l-2 border-primary/20 pl-4">
                        {stat.label}
                     </span>
                  </motion.div>
                ))}
              </div>
           </div>
        </section>

        {/* Final Statement & Interaction */}
        <section className="py-60 px-6 text-center bg-card relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-5xl mx-auto space-y-16"
           >
              <h3 className="text-4xl md:text-[100px] display-bold leading-[0.85] tracking-tighter uppercase">
                {t("about.footer")}
              </h3>
              <div className="flex flex-col items-center gap-12">
                <p className="text-muted-foreground font-black tracking-[0.8em] uppercase text-[10px] opacity-40">
                   AETHER STUDIO ARCHIVE v.4.0
                </p>
                <div className="w-24 h-24 border border-border bg-background flex items-center justify-center animate-pulse hover:bg-primary hover:text-white transition-all cursor-pointer group hover:scale-110 active:scale-95 duration-500">
                   <ArrowUpRight className="h-8 w-8 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
           </motion.div>
        </section>
      </div>
    </PageLayout>
  )
}
