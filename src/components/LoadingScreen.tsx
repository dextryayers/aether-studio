import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useLanguage } from "@/src/context/LanguageContext"

export function LoadingScreen() {
  const { t } = useLanguage()
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
  const [show, setShow] = useState(!isAdmin)

  useEffect(() => {
    if (isAdmin) return
    const timer = setTimeout(() => setShow(false), 2200)
    return () => clearTimeout(timer)
  }, [isAdmin])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[9px] font-black uppercase tracking-[0.8em] text-primary/50"
              >
                {t("ui.loadingBrand")}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-foreground"
              >
                Haniplabs
              </motion.h1>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xs md:text-sm text-muted-foreground/60 font-light tracking-wider italic"
              >
                Studio
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-[0.5em]">
                {t("ui.loading")}
              </span>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-primary/20">
            <motion.div
              className="h-full bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
