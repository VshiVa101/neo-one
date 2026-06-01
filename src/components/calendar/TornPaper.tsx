'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface TornPaperProps {
  children: ReactNode
  className?: string
  holes?: { top: number, left: number, width: number, height: number }[]
}

const topEdgePolygon = "polygon(0% 100%, 0% 80%, 2% 0%, 5% 60%, 8% 0%, 12% 80%, 15% 20%, 18% 40%, 22% 0%, 25% 100%, 28% 40%, 32% 0%, 35% 80%, 38% 20%, 42% 40%, 46% 0%, 50% 80%, 54% 20%, 58% 40%, 62% 0%, 65% 80%, 68% 60%, 72% 0%, 76% 80%, 80% 20%, 84% 40%, 88% 0%, 92% 80%, 95% 40%, 98% 0%, 100% 80%, 100% 100%)"
const bottomEdgePolygon = "polygon(100% 0%, 100% 0%, 98% 100%, 95% 25%, 92% 100%, 88% 0%, 84% 75%, 80% 100%, 76% 0%, 72% 50%, 68% 100%, 65% 25%, 62% 100%, 58% 50%, 54% 100%, 50% 0%, 46% 75%, 42% 100%, 38% 0%, 35% 50%, 32% 100%, 28% 25%, 25% 100%, 22% 50%, 18% 100%, 15% 0%, 12% 75%, 8% 100%, 5% 0%, 2% 100%, 0% 0%)"

export function TornPaper({ children, className = '', holes }: TornPaperProps) {
  return (
    <div className={`relative isolate text-black flex flex-col ${className}`}>
      {/* Top Torn Edge (Sibling 1) */}
      <div 
        className="w-full h-[16px] pointer-events-none shrink-0"
        style={{ 
          clipPath: topEdgePolygon,
          WebkitClipPath: topEdgePolygon,
          backgroundImage: "url('/images/textures/paper-texture-v3.webp')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left'
        }}
      />
      
      {/* Main Body (Sibling 2) - NO CLIP PATH, NO MASK */}
      <div className="w-full relative flex-grow">
        {holes ? (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <pattern id="paper-bg-pattern" patternUnits="userSpaceOnUse" width="1024" height="1024">
                <image href="/images/textures/paper-texture-v3.webp" width="1024" height="1024" preserveAspectRatio="xMidYMid slice" />
              </pattern>
              <mask id="paper-holes-mask">
                <rect width="100%" height="100%" fill="white" />
                {holes.map((hole, i) => (
                  <rect key={i} x={hole.left} y={hole.top} width={hole.width} height={hole.height} fill="black" />
                ))}
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#paper-bg-pattern)" mask="url(#paper-holes-mask)" />
          </svg>
        ) : (
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ 
              backgroundImage: "url('/images/textures/paper-texture-v3.webp')",
              backgroundSize: 'auto',
              backgroundRepeat: 'repeat',
              backgroundPosition: '0px -16px',
              zIndex: 0
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>

      {/* Bottom Torn Edge (Sibling 3) */}
      <div 
        className="w-full h-[16px] pointer-events-none shrink-0"
        style={{ 
          clipPath: bottomEdgePolygon,
          WebkitClipPath: bottomEdgePolygon,
          backgroundImage: "url('/images/textures/paper-texture-v3.webp')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'bottom left'
        }}
      />
    </div>
  )
}
