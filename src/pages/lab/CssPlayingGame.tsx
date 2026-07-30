import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageLayout } from "@/src/components/layout/PageLayout"
import { SEO } from "@/src/components/layout/SEO"
import { motion, AnimatePresence } from "motion/react"
import { Box, Circle, Skull, ArrowLeft, Terminal, Play, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import Editor from "@monaco-editor/react"

interface LevelConfig {
  id: string
  title: string
  objective: string
  initialPos: { x: number, y: number }
  targetPos: { x: number, y: number }
  shape: "box" | "circle" | "skull"
  hint: string
}

const LEVEL_DATA: Record<string, LevelConfig> = {
  "entry": {
    id: "entry",
    title: "Entry Level: Linear Translation",
    objective: "Move the object 200px to the right.",
    initialPos: { x: 50, y: 150 },
    targetPos: { x: 250, y: 150 },
    shape: "box",
    hint: "Try using 'margin-left: 200px;' or 'transform: translateX(200px);'"
  },
  "mid-entry": {
    id: "mid-entry",
    title: "Mid Entry: Coordinate Mapping",
    objective: "Position the object at coordinates (300, 300).",
    initialPos: { x: 50, y: 50 },
    targetPos: { x: 300, y: 300 },
    shape: "box",
    hint: "Use 'margin-left' and 'margin-top' or 'transform: translate(250px, 250px);'"
  },
  "mid": {
    id: "mid",
    title: "Mid Tier: Rotation & Offset",
    objective: "Rotate 45deg and move to (400, 100).",
    initialPos: { x: 50, y: 350 },
    targetPos: { x: 400, y: 100 },
    shape: "circle",
    hint: "Combine 'transform: translate(350px, -250px) rotate(45deg);'"
  },
  "zenith": {
    id: "zenith",
    title: "Zenith: Micro-Alignment",
    objective: "Align the micro-core (10px) to the target center.",
    initialPos: { x: 100, y: 100 },
    targetPos: { x: 450, y: 450 },
    shape: "circle",
    hint: "Use high precision values like 'transform: scale(0.2) translate(1750px, 1750px);'"
  },
  "hard": {
    id: "hard",
    title: "Hard Mode: Precise Scaling",
    objective: "Double the size and align to center (250, 250).",
    initialPos: { x: 0, y: 0 },
    targetPos: { x: 250, y: 250 },
    shape: "circle",
    hint: "Use 'transform: scale(2) translate(125px, 125px);' or equivalent."
  },
  "projection": {
    id: "projection",
    title: "Projection: 3D Workspace",
    objective: "Rotate on X-axis and align to upper sector.",
    initialPos: { x: 250, y: 400 },
    targetPos: { x: 250, y: 80 },
    shape: "box",
    hint: "Try 'transform: rotateX(60deg) translateY(-320px);'"
  },
  "extreme": {
    id: "extreme",
    title: "Extreme Protocol: Skew & Projection",
    objective: "Skew by 30deg and align precisely at (350, 400).",
    initialPos: { x: 100, y: 100 },
    targetPos: { x: 350, y: 400 },
    shape: "skull",
    hint: "Careful with skew origin. Try 'transform: translate(250px, 300px) skew(30deg);'"
  },
  "abyss": {
    id: "abyss",
    title: "The Abyss: Total Distortion",
    objective: "Distort, rotate, and scale to recover the lost signal.",
    initialPos: { x: 20, y: 20 },
    targetPos: { x: 480, y: 480 },
    shape: "skull",
    hint: "Chain everything: 'transform: translate(460px, 460px) rotate(180deg) skew(20deg) scale(0.5);'"
  }
}

const parseUserCSS = (css: string): React.CSSProperties => {
  const styles: any = {}
  if (!css) return styles

  try {
    const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "")
    const declarations = cleanCss.split(";").filter(d => d.trim() !== "")

    declarations.forEach(decl => {
      const colonIndex = decl.indexOf(":")
      if (colonIndex === -1) return

      const rawProp = decl.substring(0, colonIndex).trim()
      const val = decl.substring(colonIndex + 1).trim()

      if (rawProp && val) {
        let camelProp = rawProp.replace(/-+(.)/g, (match, char, index) => {
          return index === 0 && !rawProp.startsWith("--") && !rawProp.startsWith("-ms-")
            ? match
            : char.toUpperCase();
        });

        if (rawProp.startsWith("-ms-")) {
          camelProp = camelProp.charAt(0).toLowerCase() + camelProp.slice(1);
        } else if (rawProp.startsWith("-") && !rawProp.startsWith("--")) {
          camelProp = camelProp.charAt(0).toUpperCase() + camelProp.slice(1);
        }
        
        styles[camelProp] = val
      }
    })
  } catch (e) {
    console.error("CSS Parse Error:", e)
  }
  return styles
}

export default function CssPlayingGame() {
  const { level = "entry" } = useParams();
  const navigate = useNavigate();
  const [cssCode, setCssCode] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appliedStyles, setAppliedStyles] = useState<React.CSSProperties>({})
  const playerRef = useRef<HTMLDivElement>(null)
  
  const config = LEVEL_DATA[level as keyof typeof LEVEL_DATA] || LEVEL_DATA["entry"]
  const [isScanning, setIsScanning] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")

  useEffect(() => {
    setAppliedStyles(parseUserCSS(cssCode))
  }, [cssCode])

  const checkCollision = () => {
    if (!playerRef.current) return
    setIsScanning(true)
    
    setTimeout(() => {
      const playerRect = playerRef.current!.getBoundingClientRect()
      const container = playerRef.current!.parentElement?.getBoundingClientRect()
      
      if (!container) return

      const relX = playerRect.left - container.left + (playerRect.width / 2)
      const relY = playerRect.top - container.top + (playerRect.height / 2)

      const dist = Math.sqrt(
        Math.pow(relX - config.targetPos.x, 2) + 
        Math.pow(relY - config.targetPos.y, 2)
      )

      setDistance(dist)
      setIsScanning(false)

      if (dist < 8) {
        setIsSuccess(true)
        setError(null)
      } else {
        setError(`Alignment deviation is ${dist.toFixed(2)}px. Tolerance is 8px.`)
        setIsSuccess(false)
      }
    }, 800)
  }

  useEffect(() => {
    setIsSuccess(false)
    setError(null)
    
    const timer = setTimeout(() => {
       if (!playerRef.current) return
       const playerRect = playerRef.current!.getBoundingClientRect()
       const container = playerRef.current!.parentElement?.getBoundingClientRect()
       if (!container) return
       
       const relX = playerRect.left - container.left + (playerRect.width / 2)
       const relY = playerRect.top - container.top + (playerRect.height / 2)
       
       const dist = Math.sqrt(
         Math.pow(relX - config.targetPos.x, 2) + 
         Math.pow(relY - config.targetPos.y, 2)
       )
       setDistance(dist)
    }, 100)

    return () => clearTimeout(timer)
  }, [cssCode, config])

  const ShapeIcon = config.shape === "box" ? Box : config.shape === "circle" ? Circle : Skull

  return (
    <PageLayout>
      <SEO 
        title={`${config.title} | CSS Architect Challenge`}
        description={`Level ${level.toUpperCase()}: ${config.objective} Master precision CSS spatial engineering in sector ${level}.`} 
        path={`/lab/css-playing/${level}/play`}
      />
      <div className="min-h-screen pt-24 pb-12 px-0 md:px-6 max-w-[1600px] mx-auto flex flex-col">
        {/* Game Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-16 z-40">
          <div className="flex items-center gap-3 sm:gap-6">
             <button 
               onClick={() => navigate("/lab/css-playing")}
               className="p-2 hover:bg-muted transition-colors rounded-lg group"
               title="Back to Terminal"
             >
               <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
             </button>
             <div className="h-8 w-px bg-border hidden sm:block" />
             <div className="flex flex-col">
               <h1 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-primary leading-none mb-1">{config.title.substring(0, 20)}{config.title.length > 20 ? '...' : ''}</h1>
               <div className="flex items-center gap-2">
                 <span className="text-[8px] sm:text-[10px] font-mono text-muted-foreground uppercase">{level.toUpperCase()}</span>
                 <span className="text-[8px] sm:text-[10px] text-muted-foreground opacity-30">|</span>
                 <span className="text-[8px] sm:text-[10px] font-mono text-emerald-500 uppercase tracking-tighter animate-pulse">Sync Active</span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <Button 
               onClick={() => setCssCode("")}
               variant="ghost"
               size="sm"
               className="h-8 sm:h-9 px-2 sm:px-3 text-[8px] sm:text-[10px] uppercase font-black tracking-widest hover:bg-red-500/10 hover:text-red-500"
             >
               <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Reset</span>
             </Button>
             <div className="h-4 w-px bg-border hidden sm:block" />
             <Button 
               onClick={checkCollision}
               disabled={isScanning || isSuccess}
               size="sm"
               className={cn(
                 "h-8 sm:h-9 px-4 sm:px-6 rounded-md text-[8px] sm:text-[10px] uppercase font-black tracking-widest transition-all",
                 isSuccess ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"
               )}
             >
               {isScanning ? (
                 <span className="flex items-center gap-1 sm:gap-2">
                   <RotateCcw className="w-3 h-3 animate-spin" /> <span className="hidden xs:inline">ANALYZING</span>
                 </span>
               ) : isSuccess ? (
                 <span className="flex items-center gap-1 sm:gap-2">
                   <CheckCircle2 className="w-3 h-3" /> <span className="hidden xs:inline">SECURED</span>
                 </span>
               ) : (
                 <span className="flex items-center gap-1 sm:gap-2">
                   <Play className="w-3 h-3 fill-current" /> <span className="hidden xs:inline">EXECUTE</span>
                 </span>
               )}
             </Button>
          </div>
        </div>

        <div className="flex-grow flex flex-col lg:grid lg:grid-cols-12 overflow-hidden bg-[#131417] relative">
          {/* Success Screen - Global Overlay */}
          <AnimatePresence>
             {isSuccess && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-8 text-center"
               >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="space-y-6 sm:space-y-8 max-w-md w-full"
                  >
                     <div className="relative inline-block">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white">Objective Secured</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">The architectural segment has been perfectly aligned. Sequence is ready for progression.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/lab/css-playing")}
                          className="rounded-lg h-12 px-8 uppercase font-black tracking-widest text-[10px]"
                        >
                           Back to Lab
                        </Button>
                        <Button 
                          onClick={() => {
                            const levelKeys = Object.keys(LEVEL_DATA)
                            const nextIndex = levelKeys.indexOf(level) + 1
                            if (nextIndex < levelKeys.length) {
                              navigate(`/lab/css-playing/${levelKeys[nextIndex]}/play`)
                              setCssCode("")
                              setIsSuccess(false)
                              setActiveTab("code")
                            } else {
                              navigate("/lab/css-playing")
                            }
                          }}
                          className="rounded-lg h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white uppercase font-black tracking-widest text-[10px]"
                        >
                           Next Sequence
                        </Button>
                     </div>
                  </motion.div>
               </motion.div>
             )}
          </AnimatePresence>

          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden flex border-b border-border bg-[#1D1E22]">
             <button 
               onClick={() => setActiveTab("code")}
               className={cn(
                 "flex-1 py-3 text-[10px] uppercase font-black tracking-widest transition-all",
                 activeTab === "code" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground opacity-50"
               )}
             >
                Terminal Input
             </button>
             <button 
               onClick={() => setActiveTab("preview")}
               className={cn(
                 "flex-1 py-3 text-[10px] uppercase font-black tracking-widest transition-all",
                 activeTab === "preview" ? "bg-emerald-500/10 text-emerald-500 border-b-2 border-emerald-500" : "text-muted-foreground opacity-50"
               )}
             >
                Visual Feed
             </button>
          </div>

          {/* Editor Side */}
          <div className={cn(
            "lg:col-span-5 flex flex-col border-r border-border relative overflow-hidden h-full min-h-[500px] lg:min-h-[600px]",
            activeTab !== "code" && "hidden lg:flex"
          )}>
             <div className="bg-[#1D1E22] px-4 py-2 border-b border-border flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                   </div>
                   <span className="text-[10px] font-mono text-muted-foreground ml-2 opacity-50">EDITOR v2.4</span>
                </div>
                <div className="flex items-center gap-2">
                   <Terminal className="w-3 h-3 text-muted-foreground" />
                   <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">css_input.sh</span>
                </div>
             </div>
             
             <div className="flex-grow flex flex-col p-0 font-mono bg-[#1E1E1E] overflow-hidden relative min-h-[400px]">
                <div className="absolute top-4 left-6 z-10 pointer-events-none">
                   <div className="text-[13px] text-blue-400 opacity-60">.object {"{"}</div>
                </div>

                <div className="flex-grow pt-10 pb-10">
                   <Editor
                      height="100%"
                      defaultLanguage="css"
                      theme="vs-dark"
                      value={cssCode}
                      onChange={(value) => setCssCode(value || "")}
                      onMount={(editor, monaco) => {
                         // Add custom mission-specific snippets
                         monaco.languages.registerCompletionItemProvider('css', {
                            provideCompletionItems: (model, position) => {
                               const suggestions = [
                                  {
                                     label: 'architect-translate',
                                     kind: monaco.languages.CompletionItemKind.Snippet,
                                     insertText: 'transform: translate(${1:0}px, ${2:0}px);',
                                     insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
                                     documentation: 'Core movement directive for X and Y coordinates.'
                                  },
                                  {
                                     label: 'architect-rotate',
                                     kind: monaco.languages.CompletionItemKind.Snippet,
                                     insertText: 'transform: rotate(${1:0}deg);',
                                     insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
                                     documentation: 'Angular orientation directive.'
                                  },
                                  {
                                     label: 'architect-scale',
                                     kind: monaco.languages.CompletionItemKind.Snippet,
                                     insertText: 'transform: scale(${1:1});',
                                     insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
                                     documentation: 'Dimension factor directive.'
                                  },
                                  {
                                     label: 'architect-skew',
                                     kind: monaco.languages.CompletionItemKind.Snippet,
                                     insertText: 'transform: skew(${1:0}deg);',
                                     insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
                                     documentation: 'Geometric distortion directive.'
                                  },
                                  {
                                     label: 'architect-3d',
                                     kind: monaco.languages.CompletionItemKind.Snippet,
                                     insertText: 'transform: perspective(${1:500}px) rotateX(${2:0}deg) rotateY(${3:0}deg);',
                                     insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
                                     documentation: 'Advanced 3D workspace projection.'
                                  }
                               ];
                               return { suggestions: suggestions };
                            }
                         });
                      }}
                      options={{
                         minimap: { enabled: false },
                         fontSize: 14,
                         lineNumbers: "on",
                         scrollBeyondLastLine: false,
                         automaticLayout: true,
                         padding: { top: 20, bottom: 20 },
                         suggestOnTriggerCharacters: true,
                         quickSuggestions: {
                            other: true,
                            comments: false,
                            strings: true
                         },
                         acceptSuggestionOnEnter: "on",
                         tabCompletion: "on",
                         wordBasedSuggestions: "allDocuments",
                         scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8
                         },
                         wordWrap: "on"
                      }}
                   />
                </div>

                <div className="absolute bottom-4 left-10 z-10 pointer-events-none">
                   <div className="text-[13px] text-blue-400 opacity-60">{"}"}</div>
                </div>

                {/* Floating Diagnostics - Desktop Only */}
                <AnimatePresence>
                  {Object.keys(appliedStyles).length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-12 right-6 p-3 bg-background/50 backdrop-blur-xl border border-border/50 rounded-lg shadow-2xl max-w-[180px] hidden lg:block z-20"
                    >
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary/60 block mb-2">Live Vector Stream</span>
                       <div className="space-y-1">
                          {Object.entries(appliedStyles).slice(0, 3).map(([prop, val]) => (
                            <div key={prop} className="flex items-center justify-between text-[8px] font-mono truncate">
                               <span className="text-muted-foreground mr-2 truncate">{prop}:</span>
                               <span className="text-emerald-500 truncate">{String(val)};</span>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Diagnostic Stream & Docs - Hidden on tiny mobile if needed, but flex-grow manages it */}
             <div className="p-4 md:p-6 bg-[#131417] border-t border-border/20 opacity-40 hover:opacity-100 transition-opacity hidden sm:block">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                   <div className="space-y-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 block">Diagnostic Stream</span>
                      <div className="space-y-1">
                         {Object.keys(appliedStyles).length > 0 ? (
                           Object.entries(appliedStyles).map(([prop, val]) => (
                             <div key={prop} className="flex items-center justify-between text-[9px] font-mono">
                                <span className="text-muted-foreground">{prop}:</span>
                                <span className="text-emerald-400">{String(val)};</span>
                             </div>
                           ))
                         ) : (
                           <p className="text-[9px] font-mono text-muted-foreground/30 italic">Awaiting instructions...</p>
                         )}
                      </div>
                   </div>
                   <div className="space-y-4 hidden md:block">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 block">Ref</span>
                      <div className="space-y-2 opacity-60">
                         <code className="text-[9px] block">translate(x, y)</code>
                         <code className="text-[9px] block">rotate(deg)</code>
                      </div>
                   </div>
                </div>
             </div>

             <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="p-4 bg-red-500/10 border-t border-red-500/20 text-red-500 flex items-start gap-4 z-20"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] italic">{error}</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Visualization Side */}
          <div className={cn(
            "lg:col-span-7 bg-[#09090B] relative flex flex-col h-full min-h-[500px]",
            activeTab !== "preview" && "hidden lg:flex"
          )}>
             <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none">
                <div className="p-3 bg-background/30 backdrop-blur-md border border-white/5 rounded-sm">
                   <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Objective</div>
                   <p className="text-xs text-white/90 font-medium leading-relaxed max-w-[200px] sm:max-w-[280px]">{config.objective}</p>
                </div>
             </div>

             <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 text-right pointer-events-none font-mono text-[10px] space-y-1 opacity-40">
                <div className="text-primary/60 font-bold tracking-widest hidden sm:block">DIAGNOSTICS_DATA</div>
                <div className="text-white/60">T_X: {config.targetPos.x.toFixed(0)}</div>
                <div className="text-white/60">T_Y: {config.targetPos.y.toFixed(0)}</div>
                {distance !== null && (
                  <div className={cn("font-bold transition-colors", distance < 25 ? "text-emerald-500" : "text-amber-500")}>
                    DEV: {distance.toFixed(1)}px
                  </div>
                )}
             </div>

             <div className="relative flex-grow flex items-center justify-center overflow-hidden p-4 sm:p-0">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="relative w-[500px] h-[500px] bg-[#1d1d1f]/50 border border-white/10 rounded-xl shadow-2xl overflow-hidden scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-500">
                   <AnimatePresence>
                      {isScanning && (
                        <motion.div 
                          initial={{ top: "-10%" }}
                          animate={{ top: "110%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
                          className="absolute left-0 right-0 h-1 bg-primary/40 z-30 blur-[2px]"
                        />
                      )}
                   </AnimatePresence>
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                   <div 
                     className={cn(
                       "absolute border-4 border-dashed transition-all duration-700 rounded-sm flex items-center justify-center",
                       distance && distance < 25 
                         ? "border-emerald-500 bg-emerald-500/20 scale-110 shadow-[0_0_60px_rgba(16,185,129,0.4)]" 
                         : "border-emerald-500/30 bg-emerald-500/5 shadow-none"
                     )}
                     style={{
                       width: '60px',
                       height: '60px',
                       left: `${config.targetPos.x - 30}px`,
                       top: `${config.targetPos.y - 30}px`
                     }}
                   >
                      <div className={cn(
                        "w-3 h-3 rounded-full transition-all duration-500",
                        distance && distance < 25 ? "bg-emerald-400 scale-150 animate-pulse shadow-[0_0_15px_#34d399]" : "bg-emerald-500/40"
                      )} />
                   </div>

                   <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      <div 
                        ref={playerRef}
                        className="absolute w-[60px] h-[60px] flex items-center justify-center transition-all duration-300"
                        style={{
                           left: `${config.initialPos.x - 30}px`,
                           top: `${config.initialPos.y - 30}px`,
                           ...appliedStyles
                        }}
                      >
                         <div className="relative w-full h-full flex items-center justify-center border-2 border-primary bg-primary/20 rounded-md backdrop-blur-sm shadow-[0_0_25px_rgba(var(--primary),0.3)]">
                            <ShapeIcon className="w-8 h-8 text-primary" />
                            <div className="absolute -top-6 text-[8px] font-mono text-primary font-black uppercase tracking-widest whitespace-nowrap bg-background/50 px-2 py-0.5 border border-primary/20 rounded-full">OBJECT_ID_001</div>
                         </div>
                      </div>
                   </div>
                </div>

                <AnimatePresence>
                   {isSuccess && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                     >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 12 }}
                          className="space-y-8 max-w-md"
                        >
                           <div className="relative inline-block">
                              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Objective Secured</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">The architectural segment has been perfectly aligned. Sequence is ready for progression.</p>
                           </div>
                           <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => navigate("/lab/css-playing")}
                                className="rounded-lg h-12 px-8 uppercase font-black tracking-widest text-[10px]"
                              >
                                 Back to Lab
                              </Button>
                              <Button 
                                onClick={() => {
                                  const levelKeys = Object.keys(LEVEL_DATA)
                                  const nextIndex = levelKeys.indexOf(level) + 1
                                  if (nextIndex < levelKeys.length) {
                                    navigate(`/lab/css-playing/${levelKeys[nextIndex]}/play`)
                                    setCssCode("")
                                    setIsSuccess(false)
                                  } else {
                                    navigate("/lab/css-playing")
                                  }
                                }}
                                className="rounded-lg h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white uppercase font-black tracking-widest text-[10px]"
                              >
                                 Next Sequence
                              </Button>
                           </div>
                        </motion.div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>

             <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none sm:pointer-events-auto">
                <div className="max-w-xs ml-auto opacity-40 hover:opacity-100 transition-all duration-500">
                   <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg group hover:border-amber-500/50 transition-colors backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-2">
                         <AlertTriangle className="w-4 h-4 text-amber-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Support Directive</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed italic">{config.hint}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
