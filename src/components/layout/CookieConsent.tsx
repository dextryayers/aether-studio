import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Cookie, ShieldCheck, PieChart, Target, Zap } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[100]"
        >
          <div className="bg-background border border-border p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Cookie Policy</h4>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Halo! Saya <span className="text-foreground font-bold">Hanif</span> selaku developer website ini. Web ini dirancang dengan <span className="text-foreground font-medium">presisi tinggi</span> dan kami menggunakan cookie untuk memastikan interaksi yang <span className="text-primary font-bold italic">fluid</span> dan berkelas.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => setIsVisible(false)}
                className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Accept All
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsVisible(false)}
                className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Settings
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
