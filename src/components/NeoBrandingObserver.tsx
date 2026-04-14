'use client'

import { useEffect } from 'react'

const PINK = '#F45390'
const GREEN = '#809829'

const STYLES = {
  O: `color: ${PINK}; text-transform: uppercase; font-weight: bold;`,
  N: `color: ${GREEN}; text-transform: uppercase; font-weight: bold;`,
  E: `color: ${GREEN}; text-transform: uppercase; font-weight: bold;`,
}

export function NeoBrandingObserver() {
  useEffect(() => {
    const processNode = (node: Node) => {
      // Evita di processare nodi già marcati o elementi tecnici
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        if (el.dataset.neoProcessed || ['SCRIPT', 'STYLE', 'SVG', 'IMG', 'CANVAS', 'VIDEO'].includes(el.tagName)) {
          return false
        }
      }

      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        const text = node.nodeValue
        // Regex per trovare O, N, E (case insensitive)
        const regex = /([one])/gi
        
        if (regex.test(text)) {
          const fragment = document.createDocumentFragment()
          let lastIndex = 0
          let match

          // Resetta l'indice della regex per l'esecuzione
          regex.lastIndex = 0
          
          while ((match = regex.exec(text)) !== null) {
            // Testo prima del match
            if (match.index > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)))
            }

            const char = match[0].toUpperCase()
            const span = document.createElement('span')
            span.textContent = char
            span.style.cssText = STYLES[char as keyof typeof STYLES] || ''
            span.setAttribute('data-neo-processed', 'true')
            fragment.appendChild(span)

            lastIndex = regex.lastIndex
          }

          // Testo rimanente dopo l'ultimo match
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
          }

          if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node)
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
