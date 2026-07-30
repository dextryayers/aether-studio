import { useEffect, useState } from "react"
import { PageLayout } from "@/src/components/layout/PageLayout"
import { ArrowUpRight, ShieldCheck, Zap, Globe, Sparkles, Binary, Fingerprint, Network, Terminal } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { getAbout } from "@/src/services/data"
import { SEO } from "@/src/components/layout/SEO"
import { motion } from "motion/react"
import { LanyardBadge } from "@/src/components/ui/LanyardBadge"

export default function About() {
  const { t, language } = useLanguage()
  const [bio, setBio] = useState("")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const values = [
    { title: t("about.values.v1"), icon: ShieldCheck, desc: t("about.values.v1Desc"), prefix: "01" },
    { title: t("about.values.v2"), icon: Zap, desc: t("about.values.v2Desc"), prefix: "02" },
    { title: t("about.values.v3"), icon: Globe, desc: t("about.values.v3Desc"), prefix: "03" },
    { title: t("about.values.v4"), icon: Sparkles, desc: t("about.values.v4Desc"), prefix: "04" }
  ]

  const stats = [
    { value: "50+", label: t("about.stats.projects"), icon: Network },
    { value: "3", label: t("about.stats.experience"), icon: Terminal },
    { value: "12", label: t("about.stats.awards"), icon: ShieldCheck },
    { value: "99%", label: t("about.stats.retention"), icon: Zap },
  ]

  useEffect(() => {
    getAbout()
      .then((data) => setBio(language === "id" ? data.content_id : data.content_en))
      .catch(() => {})
  }, [language])

  return (
    <PageLayout>
      <SEO 
        title={t("seo.about.title")} 
        description={t("seo.about.desc")}
        path="/about"
      />
      <div className="bg-background text-foreground selection:bg-primary selection:text-white">
        
        {/* Hero */}
        <section className="relative min-h-[85vh] flex flex-col justify-center pt-32 pb-24 border-b border-border overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
            <div className="absolute top-0 left-1/4 w-px h-full bg-foreground/5" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-foreground/5" />
            <div className="absolute top-1/3 left-0 w-full h-px bg-foreground/5" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 py-2 px-4 border border-border/50 w-fit bg-muted/10"
              >
                <Fingerprint className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">{t("about.weAre")} {t("ui.protocol")}</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-[80px] display-bold leading-[0.82] tracking-tighter uppercase"
              >
                {t("about.weAre")} <br /> 
                <span className="italic font-light opacity-30">AETHER</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-6 max-w-2xl"
              >
                <p className="text-xl md:text-3xl font-bold leading-tight uppercase tracking-tight text-foreground">
                   {t("about.heroTitle")}
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium border-l-2 border-primary/40 pl-6">
                  {bio || t("about.description")}
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
              >
                <LanyardBadge />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-32 px-6 border-b border-border bg-muted/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-2 h-2 bg-primary rotate-45" />
              <span className="text-[9px] font-black tracking-[0.6em] text-primary/60 uppercase">{t("about.systemManifesto")}</span>
              <div className="h-px grow bg-border/30" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-10">
                 <h2 className="text-4xl md:text-[7vw] display-bold leading-[0.8] tracking-tighter uppercase">
                    {t("about.title")} <br />
                    <span className="italic font-light opacity-30 underline decoration-1 decoration-primary/20 underline-offset-[16px] md:underline-offset-[20px]">{t("about.titleItalic")}</span>
                 </h2>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary text-white flex items-center justify-center">
                       <Binary className="w-5 h-5" />
                    </div>
                    <div className="h-10 flex items-center px-5 border border-border/50 text-[9px] font-black tracking-widest uppercase bg-background/50">
                       {t("about.version")}
                    </div>
                 </div>
              </div>

              <div className="space-y-10 text-lg md:text-2xl font-medium text-muted-foreground leading-relaxed">
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="italic"
                >
                  {t("about.manifestoSub1")}
                </motion.p>
                <div className="w-full h-px bg-border/50" />
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="italic"
                >
                  {t("about.manifestoSub2")}
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-32 px-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b pb-10 border-border/50">
              <div className="space-y-3">
                <span className="text-[9px] font-black tracking-[0.4em] text-primary uppercase">{t("about.manifesto")}</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{t("about.operationalValues")}</h2>
              </div>
              <p className="text-muted-foreground max-w-xs text-xs font-medium uppercase tracking-widest leading-relaxed">
                  {t("about.valuesDesc")}
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 border border-border/50"
            >
              {values.map((v, i) => (
                <motion.div 
                  key={v.title} 
                  variants={itemVariants}
                  className="p-10 lg:p-12 bg-background group hover:bg-muted/20 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-3xl font-black text-foreground opacity-[0.03] group-hover:opacity-[0.06] transition-opacity font-mono tracking-tighter">
                    {v.prefix}
                  </div>
                  <div className="mb-10 w-11 h-11 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-400 group-hover:scale-110 group-hover:-rotate-6">
                    <v.icon className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <h4 className="text-xl font-black tracking-tighter uppercase mb-4 relative z-10">{v.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium italic">
                    {v.desc}
                  </p>
                  
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-border/50 scale-0 group-hover:scale-100 transition-transform origin-bottom-right duration-400" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-32 px-6 border-y border-border/50 bg-muted/10 relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-20">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="space-y-5 group"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-4 h-4 text-primary/30 group-hover:text-primary transition-colors duration-500" />
                    <div className="h-px grow bg-border/50 group-hover:bg-primary/40 transition-colors duration-500" />
                  </div>
                  <span className="block text-5xl md:text-[64px] font-black text-foreground tracking-tighter leading-none group-hover:translate-x-1 transition-transform duration-500">
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary/70 block border-l-2 border-primary/20 pl-4 group-hover:border-primary transition-colors duration-500">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-48 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-14 relative z-10"
          >
            <h3 className="text-3xl md:text-[56px] display-bold leading-[0.85] tracking-tighter uppercase">
              {t("about.footer")}
            </h3>
            <div className="flex flex-col items-center gap-10">
              <p className="text-muted-foreground font-black tracking-[0.6em] uppercase text-[9px] opacity-30">
                 {t("about.archiveLabel")}
              </p>
              <div className="w-20 h-20 border border-border/50 bg-background/50 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 cursor-pointer group hover:scale-110 active:scale-95">
                <ArrowUpRight className="h-7 w-7 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </PageLayout>
  )
}
