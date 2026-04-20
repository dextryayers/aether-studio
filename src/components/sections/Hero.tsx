import { useState, useEffect } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Link } from "react-router-dom"
import { useLanguage } from "@/src/context/LanguageContext"
import { motion, useScroll, useTransform } from "motion/react"

const TYPING_SPEED = 80
const DELETING_SPEED = 40
const PAUSE_TIME = 2000

export function Hero() {
  const { t } = useLanguage()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

  const getStrings = () => [
    t("hero.title"),
    t("hero.titleEnd"),
    t("common.creativeStudio"),
    t("common.digitalFuture")
  ]
  const stringsToType = getStrings()
  
  // Typing Effect
  useEffect(() => {
    if (subIndex === stringsToType[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), PAUSE_TIME)
      return
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % stringsToType.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? DELETING_SPEED : TYPING_SPEED)

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, stringsToType])

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background border-b border-border/50">
      {/* Structural Minimal Elements - Performance Friendly */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-border" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-border" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-border" />
      </div>
      
      {/* Subtle GPU Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-24 -left-24 w-64 h-64 border border-primary/20 rounded-full" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute -bottom-24 -right-24 w-96 h-96 border border-primary/10 rounded-full" 
        />
      </div>

      <div className="max-w-5xl space-y-12 z-10 relative">
        <h1 className="sr-only">Hanif Abdurrohim - Aether Studio | Leading Bug Hunter and Web Developer Portfolio</h1>
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] md:text-xs uppercase tracking-[0.6em] font-medium text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.span>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-[110px] display-bold text-foreground leading-[0.85] tracking-tighter"
            aria-hidden="true"
          >
            WE <span className="italic font-light opacity-50">{t("hero.titleItalic")}</span> <br />
            <span className="relative inline-flex min-h-[1.1em] items-center">
              {stringsToType[index].substring(0, subIndex)}
              <span className="inline-block w-[2px] h-[0.8em] bg-primary ml-1 lg:ml-2"></span>
            </span>
          </motion.div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {t("hero.description")}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button size="lg" className="h-[70px] px-12 text-sm font-bold uppercase tracking-widest rounded-none group bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-none" asChild>
            <Link to="/work">
              {t("hero.cta")}
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-[70px] px-12 text-sm font-bold uppercase tracking-widest rounded-none hover:bg-muted/30 transition-all border-border shadow-none" asChild>
            <Link to="/contact">{t("nav.contact")}</Link>
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-row items-start justify-center gap-4 md:gap-24 pt-20 border-t border-border/30"
        >
          {[
            { value: "50+", label: t("common.deliveries") },
            { value: "3", label: t("common.yearsXp") },
            { value: "99%", label: t("common.retention") }
          ].map((stat, i) => (
            <div key={i} className="text-center flex-1 max-w-[100px] md:max-w-none">
              <span className="block text-xl md:text-5xl font-light text-foreground mb-1">{stat.value}</span>
              <span className="text-[7px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-[0.5em] font-bold text-muted-foreground block leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  )
}
