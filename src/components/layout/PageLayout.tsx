import * as React from "react"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { CookieConsent } from "./CookieConsent"
import { useReveal } from "@/src/hooks/use-reveal"
import { TechnicalOverlay } from "./TechnicalOverlay"
import { cn } from "@/src/lib/utils"

export function PageLayout({ children }: { children: React.ReactNode }) {
  useReveal()
  const location = useLocation()
  const isChat = location.pathname === "/chat"
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <TechnicalOverlay />
      <div className="noise" aria-hidden="true" />
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <main className={cn(
        "flex-grow pt-16 lg:pt-0 transition-all duration-300",
        sidebarOpen ? "lg:pl-72" : "lg:pl-0"
      )}>
        {children}
        {!isChat && (
          <div className="lg:pl-0">
            <Footer />
          </div>
        )}
      </main>
      <CookieConsent />
    </div>
  )
}
