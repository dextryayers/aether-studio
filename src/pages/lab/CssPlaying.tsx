import { PageLayout } from "@/src/components/layout/PageLayout"
import { motion } from "motion/react"
import { useLanguage } from "@/src/context/LanguageContext"
import { Link } from "react-router-dom"
import { Trophy, ArrowRight, Gamepad2, Box, Circle, Star, Flame, Skull } from "lucide-react"
import { SEO } from "@/src/components/layout/SEO"

const levels = [
  {
    id: "entry",
    title: "Entry Level",
    subtitle: "Basics of offset",
    desc: "Understand the fundamentals of margin and positioning to move objects across the grid.",
    icon: Star,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    shape: Box
  },
  {
    id: "mid-entry",
    title: "Mid Entry",
    subtitle: "Coordinate expansion",
    desc: "Develop proficiency in multi-directional translation and complex grouping.",
    icon: Gamepad2,
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    shape: Box
  },
  {
    id: "mid",
    title: "Mid Tier",
    subtitle: "Dynamic alignment",
    desc: "Master flexbox and layout distribution principles in a controlled environment.",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    shape: Circle
  },
  {
    id: "zenith",
    title: "Zenith",
    subtitle: "Micro-Alignment",
    desc: "Achieve absolute precision by aligning miniature components with extreme accuracy.",
    icon: Box,
    color: "text-cyan-500",
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
    shape: Box
  },
  {
    id: "hard",
    title: "Hard Mode",
    subtitle: "Spatial precision",
    desc: "Advanced logic involving grids and absolute references for surgical placement.",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
    shape: Circle
  },
  {
    id: "projection",
    title: "Projection",
    subtitle: "3D Workspace",
    desc: "Manipulate objects in a simulated 3D environment using X, Y, and Z axis directives.",
    icon: Circle,
    color: "text-purple-500",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    shape: Circle
  },
  {
    id: "extreme",
    title: "Extreme Protocol",
    subtitle: "No tolerance for error",
    desc: "Highly constrained environments requiring specialized CSS properties for success.",
    icon: Skull,
    color: "text-red-600",
    bg: "bg-red-600/5",
    border: "border-red-600/20",
    shape: Skull
  },
  {
    id: "abyss",
    title: "The Abyss",
    subtitle: "Total Distortion",
    desc: "Combine skew, rotation, and complex scaling to recover lost signals in deep sectors.",
    icon: Skull,
    color: "text-indigo-600",
    bg: "bg-indigo-600/5",
    border: "border-indigo-600/20",
    shape: Skull
  }
]

export default function CssPlaying() {
  const { t } = useLanguage()

  return (
    <PageLayout>
      <SEO 
        title="CSS Architect | Systems Lab" 
        description="Master digital spatial engineering with raw CSS directives."
        path="/lab/css-playing"
      />
      
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">
        <section className="space-y-8">
           <div className="flex items-center gap-4 py-2 px-4 border border-border w-fit bg-red-500/5">
              <Gamepad2 className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Operation: CSS Architect</span>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-[120px] display-bold leading-[0.85] tracking-tighter uppercase">
                  CSS <br /> 
                  <span className="italic font-light opacity-30">ARCHITECT</span>
                </h1>
                <div className="w-32 h-1 bg-red-500" />
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed italic font-medium opacity-70">
                A high-fidelity spatial precision challenge. Your objective is simple: manipulate the object's properties using raw CSS code to align it precisely with the target destination. 5 difficulty tiers. Zero tolerance for error.
              </p>
           </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-background p-12 hover:bg-muted/30 transition-all duration-500"
            >
              <div className="flex flex-col h-full gap-8">
                <div className={`w-16 h-16 ${level.bg} border ${level.border} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                  <level.icon className={`w-8 h-8 ${level.color}`} />
                </div>
                
                <div className="space-y-4 grow">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/50 italic mb-1">{level.subtitle}</span>
                      <h2 className="text-3xl font-black uppercase tracking-tight">{level.title}</h2>
                   </div>
                   <p className="text-muted-foreground text-sm leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity italic">
                     {level.desc}
                   </p>
                </div>

                <Link 
                  to={`/lab/css-playing/${level.id}/play`}
                  className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase text-red-500 border border-red-500/20 px-8 py-4 w-fit hover:bg-red-500 hover:text-white transition-all group-hover:gap-6"
                >
                  Initiate Sequence <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {/* Decorative side bar */}
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-red-500 group-hover:h-full transition-all duration-500" />
            </motion.div>
          ))}

          {/* Placeholders for grid symmetry */}
          <div className="hidden lg:block bg-background/40 p-12 relative overflow-hidden">
             <div className="h-full border border-dashed border-border/20 flex items-center justify-center opacity-5">
                <Gamepad2 className="w-24 h-24 rotate-45" />
             </div>
          </div>
          
          {/* Tablet only placeholder to fix 2-col gap (5 levels) */}
          <div className="hidden md:block lg:hidden bg-background/40 p-12 relative overflow-hidden">
             <div className="h-full border border-dashed border-border/20 flex items-center justify-center opacity-5">
                <Gamepad2 className="w-24 h-24" />
             </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
