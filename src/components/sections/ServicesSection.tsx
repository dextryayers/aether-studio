import { Code2, Palette, Search, Smartphone } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { motion } from "motion/react"

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      title: t("servicesSection.items.s1.title"),
      description: t("servicesSection.items.s1.desc"),
      icon: Palette
    },
    {
      title: t("servicesSection.items.s2.title"),
      description: t("servicesSection.items.s2.desc"),
      icon: Code2
    },
    {
      title: t("servicesSection.items.s3.title"),
      description: t("servicesSection.items.s3.desc"),
      icon: Smartphone
    },
    {
      title: t("servicesSection.items.s4.title"),
      description: t("servicesSection.items.s4.desc"),
      icon: Search
    }
  ]

  return (
    <section className="py-32 px-6 border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-24 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.6em] font-medium text-muted-foreground">{t("nav.services")}</span>
          <h2 className="text-4xl md:text-8xl display-bold text-foreground uppercase tracking-tighter">
            {t("servicesSection.title")} <span className="italic font-light opacity-30 tracking-normal">{t("servicesSection.italic")}</span> <br />
            {t("servicesSection.subtitle")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {t("servicesSection.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-border/50">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-12 border-r border-b border-border/50 hover:bg-muted/30 transition-colors duration-300 group"
            >
              <div className="mb-12 text-primary">
                <s.icon className="h-8 w-8 stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight uppercase group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
