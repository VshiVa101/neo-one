'use client'

import { useEffect } from 'react'

const PINK = '#F45390'
const GREEN = '#809829'

const STYLES = {
  O: `color: #F45390; text-transform: uppercase; font-weight: bold;`,
  N: `color: #809829; text-transform: uppercase; font-weight: bold;`,
  E: `color: #FF82B2; text-transform: uppercase; font-weight: bold;`,
}

export function NeoBrandingObserver() {
  useEffect(() => {
    const processNode = (node: Node): boolean => {
      // Evita di processare nodi già marcati o elementi tecnici
      const parentElement = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement
      
      if (parentElement) {
        if (
          parentElement.dataset.neoProcessed || 
          parentElement.dataset.neoSkip || 
          parentElement.closest('[data-neo-skip]') || // Controllo risalendo l'albero
          ['SCRIPT', 'STYLE', 'SVG', 'IMG', 'CANVAS', 'VIDEO'].includes(parentElement.tagName)
        ) {
          return false
        }
      }

      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        const text = node.nodeValue
        const regex = /([one])/gi
        
        if (regex.test(text)) {
          const fragment = document.createDocumentFragment()
          let lastIndex = 0
          let match

          regex.lastIndex = 0
          
          while ((match = regex.exec(text)) !== null) {
            // Testo prima del match (forzato in minuscolo)
            if (match.index > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index).toLowerCase()))
            }

            const char = match[0].toUpperCase()
            const span = document.createElement('span')
            span.textContent = char
            span.className = `neo-${char}` // neo-O, neo-N, neo-E
            span.setAttribute('data-neo-processed', 'true')
            fragment.appendChild(span)

            lastIndex = regex.lastIndex
          }

          // Testo rimanente (forzato in minuscolo)
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex).toLowerCase()))
          }

          if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node)
            return true
          }
        } else {
          // Se non ci sono lettere O-N-E, ci assicuriamo comunque che sia minuscolo
          const lowerText = text.toLowerCase()
          if (text !== lowerText) {
            node.nodeValue = lowerText
            return true
          }
        }
      }

      // Processa ricorsivamente i figli se è un elemento
      if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes)
        for (const child of children) {
          processNode(child)
        }
      }
      
      return false
    }

    // Prima scansione al caricamento
    processNode(document.body)

    // Osservatore per contenuti dinamici
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            processNode(node)
          })
        } else if (mutation.type === 'characterData') {
          // Se cambia il testo di un nodo esistente, dobbiamo riprocessarlo
          // Ma attenzione: replaceChild triggera MutationObserver.
          // In questo scenario specifico, il TEXT_NODE originale viene sostituito, 
          // quindi MutationObserver vedrà un'aggiunta di nodi (childList).
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    return () => observer.disconnect()
  }, [])

  return null // Componente solo logico
}
