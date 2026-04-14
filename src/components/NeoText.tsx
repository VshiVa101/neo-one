'use client'

import React from 'react'

interface NeoTextProps {
  children: string
  className?: string
}

const COLORS: Record<string, string> = {
  O: '#F45390', // Pink
  N: '#809829', // Green
  E: '#809829', // Green
}

export function NeoText({ children, className = '' }: NeoTextProps) {
  // Funzione per splittare la stringa e mappare i caratteri O, N, E
  const renderFormattedText = (text: string) => {
    return text.split('').map((char, index) => {
      const upperChar = char.toUpperCase()
      if (upperChar === 'O' || upperChar === 'N' || upperChar === 'E') {
        return (
          <span 
            key={index} 
            style={{ color: COLORS[upperChar] }}
            className="uppercase inline-block"
          >
            {upperChar}
          </span>
        )
      }
      return <span key={index}>{char.toLowerCase()}</span>
    })
  }

  return (
    <span className={`${className} leading-none`}>
      {renderFormattedText(children)}
    </span>
  )
}
