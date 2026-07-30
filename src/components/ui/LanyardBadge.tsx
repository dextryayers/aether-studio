import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { Shield, Cpu, Zap, CreditCard } from "lucide-react"

export function LanyardBadge() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      className="relative w-full max-w-[320px] aspect-[4/6] mx-auto perspective-1000 select-none cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Lanyard String */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-1.5 h-[120px] bg-foreground/80 z-0 origin-top">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-foreground bg-background z-10" />
      </div>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full bg-card border-2 border-border shadow-2xl overflow-hidden flex flex-col relative z-10"
      >
        {/* Holographic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none z-20 opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        {/* Top Strip */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Clearance</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground opacity-50">#00-3442-A</span>
        </div>

        {/* Profile Image */}
        <div className="p-8 flex flex-col items-center gap-6 grow justify-center">
          <div className="w-52 h-52 border border-border relative group">
             <div className="absolute inset-0 border-3 border-primary/20 -m-2 opacity-0 group-hover:opacity-100 transition-opacity" />
             <img 
               src="/about.JPG" 
               alt="Hanif Abdurrohim" 
               className="w-full h-full object-cover grayscale"
               referrerPolicy="no-referrer"
             />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tight">Hanif Abdurrohim</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] italic">Principal Architect</p>
          </div>

          {/* Badge Info Grid */}
          <div className="grid grid-cols-2 gap-px bg-border/30 w-full mt-4">
             <div className="p-3 bg-muted/10 text-center">
                <span className="block text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Role</span>
                <span className="text-[10px] font-bold uppercase">Bug Hunter</span>
             </div>
             <div className="p-3 bg-muted/10 text-center">
                <span className="block text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Access</span>
                <span className="text-[10px] font-bold uppercase">Full Stack</span>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-6 border-t border-border bg-muted/50 flex flex-col items-center gap-4">
          {/* Progress Bars (Technical Look) */}
          <div className="w-full space-y-2">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                <span>Core Sync</span>
                <span>Active</span>
             </div>
             <div className="h-1 bg-border w-full relative">
                <motion.div 
                   animate={{ width: ["0%", "85%", "82%", "85%"] }}
                   transition={{ duration: 5, repeat: Infinity }}
                   className="absolute inset-y-0 left-0 bg-primary" 
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary animate-pulse" />
            </div>
            <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40">Aether Studio Archive</span>
          </div>
        </div>

        {/* Backside Shadow (Fake Depth) */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-black/40 blur-xl -z-10 translate-y-8" />
      </motion.div>
    </div>
  )
}
