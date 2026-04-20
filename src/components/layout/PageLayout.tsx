import * as React from "react"
import { useLocation } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { CookieConsent } from "./CookieConsent"
import { useReveal } from "@/src/hooks/use-reveal"
import { TechnicalOverlay } from "./TechnicalOverlay"

export function PageLayout({ children }: { children: React.ReactNode }) {
  useReveal()
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <TechnicalOverlay />
      <div className="noise" aria-hidden="true" />
      <Navbar />
      <main className="flex-grow lg:pl-72 pt-16 lg:pt-0">
        {children}
        {isHome && (
          <div className="lg:pl-0">
            <Footer />
          </div>
        )}
      </main>
      <CookieConsent />
    </div>
  )
}
