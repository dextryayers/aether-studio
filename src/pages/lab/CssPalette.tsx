import React, { useState } from "react"
import { PageLayout } from "@/src/components/layout/PageLayout"
import { SEO } from "@/src/components/layout/SEO"
import { Palette, Copy, Check, RotateCcw, Hash, Layers, MoveRight, Maximize2, Zap } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"

const TAILWIND_COLORS = {
  slate: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a", "#020617"],
  gray: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827", "#030712"],
  stone: ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c", "#292524", "#1c1917", "#0c0a09"],
  red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a"],
  orange: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407"],
  amber: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"],
  yellow: ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"],
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"],
  teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e"],
  cyan: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#075985", "#155e75", "#164e63", "#083344"],
  sky: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49"],
  blue: ["#eff6ff", "#dbeade", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"],
  violet: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#2e1065"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764"],
  pink: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843", "#500724"],
}

export default function CssPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [gradStart, setGradStart] = useState("#3b82f6")
  const [gradEnd, setGradEnd] = useState("#8b5cf6")
  const [gradAngle, setGradAngle] = useState(45)

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const generateRandomHex = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  }

  const randomizeGradient = () => {
    setGradStart(generateRandomHex())
    setGradEnd(generateRandomHex())
    setGradAngle(Math.floor(Math.random() * 360))
  }

  const gradientString = `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})`

  return (
    <PageLayout>
      <SEO 
        title="Spectral Engine | Lab" 
        description="Comprehensive CSS color scale and gradient generator synchronized with Tailwind CSS protocol."
        path="/lab/css-palette"
      />
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">
        {/* Protocol Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <Palette className="w-5 h-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 italic">Lab Sector 04</span>
             </div>
             <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
               COLOR <br />
               <span className="italic opacity-20">SYSTEMS</span>
             </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
             <div className="flex items-center gap-4 py-2 px-6 border border-border bg-primary/5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">High Fidelity Palette Engine</span>
             </div>
             <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-40">Synchronized with Tailwind Protocol v3.4</p>
          </div>
        </div>

        {/* Gradient Experimental Chamber */}
        <section className="space-y-12">
           <div className="flex items-center justify-between">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black uppercase tracking-tight">Gradient Laboratory</h2>
                 <p className="text-sm text-muted-foreground italic">Complex structural transitions and linear interpolations.</p>
              </div>
              <Button 
                onClick={randomizeGradient}
                variant="outline"
                className="h-10 px-6 rounded-none uppercase text-[10px] font-black tracking-widest border-border hover:bg-primary hover:text-white transition-all"
              >
                <RotateCcw className="w-3 h-3 mr-2" /> Randomize
              </Button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-border border border-border overflow-hidden">
              <div className="lg:col-span-8 bg-[#09090B] p-2 aspect-[21/9] flex items-center justify-center relative overflow-hidden group">
                 <div 
                    className="w-full h-full transition-all duration-700 ease-out group-hover:scale-105"
                    style={{ background: gradientString }}
                 />
                 <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md px-4 py-3 border border-white/10 text-white font-mono text-[10px] pointer-events-auto">
                       {gradientString}
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(gradientString)}
                      className="h-10 w-10 p-0 rounded-none bg-white text-black hover:bg-primary hover:text-white pointer-events-auto shadow-2xl"
                    >
                      {copiedColor === gradientString ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                 </div>
              </div>
              
              <div className="lg:col-span-4 bg-background p-10 flex flex-col justify-center space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Primary Node</span>
                       <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={gradStart} 
                            onChange={(e) => setGradStart(e.target.value)}
                            className="w-12 h-12 bg-transparent border-none cursor-pointer p-0"
                          />
                          <input 
                            type="text" 
                            value={gradStart} 
                            onChange={(e) => setGradStart(e.target.value)}
                            className="flex-grow bg-transparent border-none border-b border-border focus:ring-0 font-mono text-lg uppercase tracking-tight"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Secondary Node</span>
                       <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={gradEnd} 
                            onChange={(e) => setGradEnd(e.target.value)}
                            className="w-12 h-12 bg-transparent border-none cursor-pointer p-0"
                          />
                          <input 
                            type="text" 
                            value={gradEnd} 
                            onChange={(e) => setGradEnd(e.target.value)}
                            className="flex-grow bg-transparent border-none border-b border-border focus:ring-0 font-mono text-lg uppercase tracking-tight"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Projection Angle</span>
                          <span className="text-[10px] font-mono text-primary font-bold">{gradAngle}°</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="360" 
                         value={gradAngle} 
                         onChange={(e) => setGradAngle(parseInt(e.target.value))}
                         className="w-full h-1 bg-border rounded-none appearance-none cursor-pointer accent-primary"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global Color Inventory */}
        <section className="space-y-12">
           <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Full Spectrum Inventory</h2>
              <p className="text-sm text-muted-foreground italic">Exhaustive classification of digital hues and spectral variants.</p>
           </div>

           <div className="space-y-16">
              {Object.entries(TAILWIND_COLORS).map(([name, colors]) => (
                <div key={name} className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-4" style={{ backgroundColor: colors[5] }} />
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-border pb-1">{name} Index</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-px bg-border border border-border">
                      {colors.map((color, i) => (
                        <button 
                          key={i}
                          onClick={() => copyToClipboard(color)}
                          className="group relative h-24 bg-background hover:bg-muted/30 transition-all flex flex-col items-center justify-end p-3"
                        >
                           <div 
                             className="absolute inset-0 transition-transform group-hover:scale-[0.85] shadow-xl" 
                             style={{ backgroundColor: color }}
                           />
                           <div className="relative z-10 w-full flex flex-col items-center bg-black/80 backdrop-blur-sm p-1">
                              <span className="text-[8px] font-mono text-white/50">{i === 10 ? '950' : i === 0 ? '50' : i * 100}</span>
                              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-tighter truncate w-full text-center">
                                {copiedColor === color ? 'COPIED' : color}
                              </span>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Footer Technical Summary */}
        <div className="flex items-center justify-between p-8 border border-border bg-muted/10">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                 <Hash className="w-4 h-4 text-primary/40" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Spectral Registry</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 opacity-50">
                 <Layers className="w-4 h-4" />
                 <span className="text-[9px] font-mono uppercase tracking-widest">Total Variations: {Object.keys(TAILWIND_COLORS).length * 11} hues</span>
              </div>
           </div>
           <div className="hidden md:flex items-center gap-6">
              <div className="flex gap-2">
                 {["#f87171", "#34d399", "#60a5fa", "#fbbf24"].map((c, i) => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                 ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/30 italic">Aether Chromatic Protocol</span>
           </div>
        </div>
      </div>
    </PageLayout>
  )
}
