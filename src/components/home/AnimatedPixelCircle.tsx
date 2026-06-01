'use client'

import React from 'react'

interface AnimatedPixelCircleProps {
  color: string
  isHovered: boolean
  className?: string
}

// 16x16 perfect pixelated hollow circle path
const CIRCLE_PATH = "M5 1h6v1H5V1z M3 2h2v1H3V2z M11 2h2v1h-2V2z M2 3h1v2H2V3z M13 3h1v2h-1V3z M1 5h1v6H1V5z M14 5h1v6h-1V5z M2 11h1v2H2v-2z M13 11h1v2h-1v-2z M3 13h2v1H3v-1z M11 13h2v1h-2v-1z M5 14h6v1H5v-1z"
const SOLID_CIRCLE_PATH = "M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V5h1V3h1V2h2V1z"

export function AnimatedPixelCircle({ color, isHovered, className = '' }: AnimatedPixelCircleProps) {
  
  // Psychedelic rotation speed modifiers
  const speedScale = isHovered ? 0.15 : 1 // Faster when hovered
  
  // 3 perfect pixel layers acting as a border frame around the icon.
  const layers = Array.from({ length: 3 }).map((_, i) => {
    // i=0 is the outermost layer (scale 1.25)
    // i=2 is the innermost layer (scale 1.0) -> leaves a transparent hole for the icon
    const scale = 1.25 - (i * 0.125) 
    
    // Innermost (i=2) is brightest (0.8), Outermost (i=0) is darkest (0.3).
    const brightness = 0.3 + (i * 0.25) 
    
    return {
      scale,
      filter: `brightness(${brightness})`,
      duration: 30 - (i * 3),
      baseDir: (i % 2 === 0 ? 'normal' : 'reverse') as 'normal' | 'reverse'
    }
  })

  return (
    <div 
      className={`absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 ${className}`}
      style={{ transform: isHovered ? 'scale(1.2) translateY(-3px)' : 'scale(1) translateY(0)' }}
    >
      {/* Sfondo statico pieno al centro per far risaltare l'icona. 
          Lo scale 0.88 lo fa incastrare perfettamente nel buco lasciato dall'anello più interno (1.0) */}
      <svg 
        viewBox="0 0 16 16" 
        className="absolute inset-0 w-full h-full" 
        style={{ shapeRendering: 'crispEdges', transform: 'scale(0.88)' }}
      >
        <path d={SOLID_CIRCLE_PATH} fill={color} />
      </svg>

      {layers.map((layer, i) => {
        // Reverse direction on hover
        const activeDir = isHovered 
          ? (layer.baseDir === 'normal' ? 'reverse' : 'normal') 
          : layer.baseDir

        return (
          <svg 
            key={i}
            viewBox="0 0 16 16" 
            className="absolute inset-0 w-full h-full" 
            style={{ 
              shapeRendering: 'crispEdges',
              '--layer-scale': layer.scale,
              filter: layer.filter,
              animation: `spin-psychedelic ${layer.duration * speedScale}s linear infinite ${activeDir}`,
              transformOrigin: 'center center',
              transition: 'animation-duration 0.5s ease-out'
            } as React.CSSProperties}
          >
            <path d={CIRCLE_PATH} fill={color} />
          </svg>
        )
      })}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-psychedelic {
          0% { transform: scale(var(--layer-scale, 1)) rotate(0deg); }
          100% { transform: scale(var(--layer-scale, 1)) rotate(360deg); }
        }
      `}} />
    </div>
  )
}
