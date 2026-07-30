import React from "react"

export function TechnicalOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] select-none overflow-hidden">
      {/* Dynamic Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Global Grid Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/20" />
      
      {/* Decorative Binary/Data Streams (Corners) */}
      <div className="absolute top-24 left-8 text-[8px] font-mono whitespace-pre opacity-20 hidden lg:block">
        SEC_PROTO: 0x4F2A{"\n"}
        SYNC: OPTIMAL{"\n"}
        UPLINK: ACTIVE
      </div>
      
      <div className="absolute bottom-24 right-8 text-[8px] font-mono text-right opacity-20 hidden lg:block">
        [52.0125, 112.5511]{"\n"}
        SENSORS: ONLINE{"\n"}
        RECON: ONGOING
      </div>
    </div>
  )
}
