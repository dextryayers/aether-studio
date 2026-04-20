import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, Briefcase, Cpu, User, Mail, MessageSquare, Instagram, Twitter, Linkedin, Github, Globe, FileText, Rocket } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet"
import { ModeToggle } from "./ModeToggle"
import { useLanguage } from "@/src/context/LanguageContext"
import { cn } from "@/src/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userIp, setUserIp] = useState<string>("Detecting...")
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setUserIp(data.ip)
      } catch (error) {
        console.error("Error fetching IP:", error)
        setUserIp("Unknown")
      }
    }
    fetchIp()
  }, [])

  const navItems = [
    { name: t("nav.home"), path: "/", icon: Home },
    { name: t("nav.work"), path: "/work", icon: Briefcase },
    { name: t("nav.services"), path: "/services", icon: Cpu },
    { name: t("nav.about"), path: "/about", icon: User },
    { name: t("nav.chat"), path: "/chat", icon: MessageSquare },
    { name: t("nav.resume"), path: "/resume", icon: FileText },
    { name: t("nav.lab"), path: "/lab", icon: Cpu },
    { name: t("nav.contact"), path: "/contact", icon: Mail },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex-col p-8 z-50 transition-colors duration-300">
        <div className="mb-12">
          <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter">
            <Rocket className="w-6 h-6 text-primary fill-primary" />
            <span className="uppercase tracking-tight">Aether</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mt-2 opacity-60">
            {t("common.creativeStudio")}
          </p>
        </div>

        <nav className="flex-grow space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-4 px-4 py-3 text-sm font-bold transition-all duration-300 group overflow-hidden",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-primary z-0"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <item.icon className={cn(
                  "h-4 w-4 relative z-10 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:translate-x-1"
                )} />
                <span className="relative z-10 uppercase tracking-widest text-[10px]">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="pt-8 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("w-8 h-8 text-[10px] font-black tracking-tighter", language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("w-8 h-8 text-[10px] font-black tracking-tighter", language === "id" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                onClick={() => setLanguage("id")}
              >
                ID
              </Button>
            </div>
            <ModeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="w-full h-px bg-border/50" />
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
              © 2026 ARCHIVE // HANIIP
            </p>
            <p className="text-[9px] text-primary font-bold italic tracking-tighter uppercase opacity-80">
              POWERED BY HANIIPP.SPACE
            </p>
            <div className="inline-flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tight">VISITOR IP: {userIp}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tighter">
          <Rocket className="w-5 h-5 text-primary fill-primary" />
          <span className="uppercase tracking-tight">Aether</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-0.5 border border-border">
             <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-2 text-[9px] font-black rounded-none", language === "en" ? "bg-primary text-white" : "text-muted-foreground")}
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-2 text-[9px] font-black rounded-none", language === "id" ? "bg-primary text-white" : "text-muted-foreground")}
                onClick={() => setLanguage("id")}
              >
                ID
              </Button>
          </div>
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background border-border p-0 flex flex-col transition-colors duration-300">
              <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
                <SheetHeader className="mb-12 border-b border-border/50 pb-6">
                  <SheetTitle className="text-left flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
                    <Rocket className="w-5 h-5 text-primary fill-primary" />
                    Aether
                  </SheetTitle>
                  <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary/50 text-left mt-1">
                    Creative Protocol v4.0
                  </p>
                </SheetHeader>
                
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-none text-sm font-bold transition-all uppercase tracking-widest relative group",
                        location.pathname === item.path
                          ? "text-primary border-l-2 border-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", location.pathname === item.path ? "text-primary" : "text-muted-foreground")} />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-8 border-t border-border bg-muted/10 flex flex-col gap-8">
                <div className="flex justify-center gap-8 text-muted-foreground w-full">
                  <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
                      © 2026 ARCHIVE // HANIIP
                    </p>
                    <p className="text-[9px] text-primary font-bold italic tracking-tighter border-t border-border/30 pt-2 uppercase">
                      POWERED BY HANIIPP.SPACE
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted/50 border border-border rounded-none w-full justify-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tight">VISITOR_IP: {userIp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}
