import { PageLayout } from "@/src/components/layout/PageLayout"
import { motion } from "motion/react"
import { useLanguage } from "@/src/context/LanguageContext"
import { Link } from "react-router-dom"
import { Binary, Code2, Eye, Palette, ArrowRight, FlaskConical, Terminal } from "lucide-react"
import { SEO } from "@/src/components/layout/SEO"

const getTools = (t: any) => [
  {
    id: "css-playing",
    title: t("lab.cssPlaying.title"),
    desc: t("lab.cssPlaying.desc"),
    path: "/lab/css-playing",
    icon: Terminal,
    color: "text-red-500",
    bg: "bg-red-500/5",
    border: "border-red-500/20"
  },
  {
    id: "md-prev",
    title: t("lab.md.title"),
    desc: t("lab.md.desc"),
    path: "/lab/md-prev",
    icon: Eye,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20"
  },
  {
    id: "css-palette",
    title: t("lab.color.title"),
    desc: t("lab.color.desc"),
    path: "/lab/css-palette",
    icon: Palette,
    color: "text-purple-500",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20"
  }
]

export default function Lab() {
  const { t } = useLanguage()
  const tools = getTools(t)

  return (
    <PageLayout>
      <SEO 
        title={t("seo.lab.title")} 
        description={t("seo.lab.desc")}
        path="/lab"
      />
      
      <div className="min-h-screen bg-background pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="mb-24 space-y-8">
          <div className="flex items-center gap-4 py-2 px-4 border border-border w-fit bg-muted/20">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t("lab.sector")}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-9xl display-bold leading-[0.85] tracking-tighter uppercase">
                {t("lab.title")} <br /> 
                <span className="italic font-light opacity-30">{t("lab.subtitle")}</span>
              </h1>
              <div className="w-32 h-1 bg-primary" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg italic font-medium">
              {t("lab.description")}
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-background p-12 hover:bg-muted/30 transition-all duration-500"
            >
              <div className="flex flex-col h-full gap-8">
                <div className={`w-16 h-16 ${tool.bg} rounded-none border ${tool.border} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                  <tool.icon className={`w-8 h-8 ${tool.color}`} />
                </div>
                
                <div className="space-y-4 grow">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black uppercase tracking-tight">{tool.title}</h2>
                    <span className="text-[10px] font-mono text-muted-foreground opacity-30">TOOL_ID: {tool.id.toUpperCase()}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {tool.desc}
                  </p>
                </div>

                <Link 
                  to={tool.path}
                  className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase text-primary border border-border px-8 py-4 w-fit hover:bg-primary hover:text-white transition-all group-hover:gap-6"
                >
                  Enter Interface <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-border/50 scale-0 group-hover:scale-100 transition-transform origin-top-right duration-500" />
            </motion.div>
          ))}
          
          {/* Placeholder for even grid to avoid white "empty" cells in dark mode */}
          {tools.length % 2 !== 0 && (
            <div className="hidden md:block bg-background p-12 relative overflow-hidden">
               <div className="h-full border border-dashed border-border/30 flex items-center justify-center opacity-10">
                  <FlaskConical className="w-24 h-24" />
               </div>
            </div>
          )}
        </div>

        {/* Terminal Footer Indicator */}
        <div className="mt-24 p-8 border border-dashed border-border bg-muted/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-amber-500/50" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary/40" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{t("lab.footer")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-12 bg-primary/20" />
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/50 italic">{t("lab.framework")}</span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
