'use client'

import React from 'react'

interface BrandedTitleProps {
  text: string
}

/**
 * Componente che trasforma le lettere 'o', 'n', 'e' in versioni brandizzate (Neo-ONE).
 * Funziona in sinergia con NeoBrandingObserver, ma applica la trasformazione immediatamente
 * per evitare flickering e garantire la coerenza visiva nei titoli.
 */
export const BrandedTitle = ({ text }: { text: string }) => {
  if (!text) return null

  // Regex per catturare o, n, e (case-insensitive)
  const regex = /([one])/gi
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase()
        if (lowerPart === 'o' || lowerPart === 'n' || lowerPart === 'e') {
          const char = part.toUpperCase()
          return (
            <span 
              key={i} 
              className={`neo-${char}`} 
              data-neo-processed="true"
              style={{ 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {char}
            </span>
          )
        }
        return <span key={i}>{lowerPart}</span>
      })}
    </>
  )
}
