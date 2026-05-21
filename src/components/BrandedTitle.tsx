'use client'

import React from 'react'
import { normalizeNeoString } from '@/utilities/normalizeNeoText'

interface BrandedTitleProps {
  text: string
  disableColor?: boolean
}

/**
 * Componente che trasforma le lettere 'o', 'n', 'e' in versioni brandizzate (Neo-ONE).
 * Ogni parola è wrappata in un inline-block per evitare che le parole si spezzino a metà
 * tra i vari <span> di lettering brandizzato.
 */
export const BrandedTitle = ({ text, disableColor = false }: BrandedTitleProps) => {
  if (!text) return null

  // Sostituzione preventiva caratteri accentati per il font Neo
  const sanitizedText = normalizeNeoString(text)

  // Splittiamo il testo in token: parole e spazi separati
  const tokens = sanitizedText.split(/( +)/)

  // Per ogni token-parola, applichiamo il branding lettera per lettera
  const renderWord = (word: string, wordKey: number) => {
    const regex = /([one])/gi
    const parts = word.split(regex)
    return (
      <span key={wordKey} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {parts.map((part, i) => {
          const lowerPart = part.toLowerCase()
          if (lowerPart === 'o' || lowerPart === 'n' || lowerPart === 'e') {
            const char = part.toUpperCase()
            return (
              <span
                key={i}
                className={disableColor ? undefined : `neo-${char}`}
                data-neo-processed="true"
                style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
              >
                {char}
              </span>
            )
          }
          return (
            <span key={i} style={{ textTransform: 'uppercase' }}>
              {part.toUpperCase()}
            </span>
          )
        })}
      </span>
    )
  }

  return (
    <>
      {tokens.map((token, i) => {
        // Spazio → punto di interruzione naturale tra le parole
        if (/^ +$/.test(token)) return <span key={i}>{' '}</span>
        return renderWord(token, i)
      })}
    </>
  )
}
