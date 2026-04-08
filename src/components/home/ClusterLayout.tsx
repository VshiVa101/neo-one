'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeScene } from '@/components/EyeScene'
import { ClusterDeck, MockArtwork } from '@/components/home/ClusterDeck'

export interface ClusterData {
  id: string
  title: string
  desc: string
  image: string
  titleColor: string
  descColor: string
}

// Dati mock temporanei per testare il layout expanded
const createMockDeck = (title: string, idPrefix: string) => ({
  title,
  artworks: [
    { id: `${idPrefix}-1`, title: 'Fase 1', image: '/images/drops/BN-cluster.png' },
    { id: `${idPrefix}-2`, title: 'Fase 2', image: '/images/drops/placeholder.png' },
    { id: `${idPrefix}-3`, title: 'Fase 3', image: '/images/drops/BN-cluster.png' },
    { id: `${idPrefix}-4`, title: 'Fase 4', image: '/images/drops/placeholder.png' },
    { id: `${idPrefix}-5`, title: 'Fase 5', image: '/images/drops/BN-cluster.png' }
  ]
})

const MOCK_SUBCLUSTERS = [
  createMockDeck('NeON Alfa', 'n-a'),
  createMockDeck('NeON Beta', 'n-b'),
  createMockDeck('NeON Gamma', 'n-c'),
  createMockDeck('NeON Delta', 'n-d'),
  createMockDeck('NeON Sigma', 'n-e'),
  createMockDeck('NeON Omega', 'n-f'),
]

export const ClusterLayout = ({ clusters }: { clusters: ClusterData[] }) => {
  // Se non ci sono cluster o ce n'è solo 1, evitiamo errori nella destrutturazione in Home
  if (!clusters || clusters.length < 2) return null;
  // Stato accorpato per la navigazione dei cluster
  const [navState, setNavState] = useState({
    left: 0,
    right: 1,
    next: 'left' as 'left' | 'right',
    pool: 2
  })

  const [cartHovered, setCartHovered] = useState(false)
  const [isHoveringFooter, setIsHoveringFooter] = useState(false)
  
  // Stato del Mock Cluster espanso (null = chiuso, 'id_del_cluster' = aperto)
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null)

  // Indice del mazzo (Subcluster) attivo visibile in primo piano
  const [activeDeckIndex, setActiveDeckIndex] = useState(0)

  // Seleziona automaticamente il mazzo centrale quando si apre l'espansione
  useEffect(() => {
    if (expandedClusterId) {
      setActiveDeckIndex(Math.floor(MOCK_SUBCLUSTERS.length / 2))
    }
  }, [expandedClusterId])
  
  // Ref per il trascinamento del footer
  const footerRef = React.useRef<HTMLDivElement>(null)

  // Funzione helper per rimpiazzare un lato (usando functional update per evitare closure stale)
  const replaceCluster = (newIdx: number, forcedSide?: 'left' | 'right') => {
    setNavState(prev => {
      const side = forcedSide || prev.next
      
      if (side === 'left') {
        if (newIdx === prev.right) return prev
        return { ...prev, left: newIdx, next: 'right' }
      } else {
        if (newIdx === prev.left) return prev
        return { ...prev, right: newIdx, next: 'left' }
      }
    })
  }

  useEffect(() => {
    let isScrolling = false

    const handleWheel = (e: WheelEvent) => {
      // Se il mouse sta sul footer o il cluster è espanso, non attivare il cambio cluster principale
      if (isHoveringFooter || expandedClusterId) return
      
      e.preventDefault()
      if (isScrolling) return
      isScrolling = true
      setTimeout(() => (isScrolling = false), 900)

      setNavState(prev => {
        const nextIdx = prev.pool % clusters.length
        if (e.deltaY > 0) {
          // Scroll giù -> rimpiazza SINISTRA
          if (nextIdx === prev.right) return prev
          return { ...prev, left: nextIdx, next: 'right', pool: (prev.pool + 1) % clusters.length }
        } else if (e.deltaY < 0) {
          // Scroll su -> rimpiazza DESTRA
          if (nextIdx === prev.left) return prev
          return { ...prev, right: nextIdx, next: 'left', pool: (prev.pool + 1) % clusters.length }
        }
        return prev
      })
    }

    const handleKey = (e: KeyboardEvent) => {
      setNavState(prev => {
        const nextIdx = prev.pool % clusters.length
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          if (nextIdx === prev.right) return prev
          return { ...prev, left: nextIdx, next: 'right', pool: (prev.pool + 1) % clusters.length }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          if (nextIdx === prev.left) return prev
          return { ...prev, right: nextIdx, next: 'left', pool: (prev.pool + 1) % clusters.length }
        }
        return prev
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isHoveringFooter, expandedClusterId, clusters.length])

  // I due cluster in primo piano (estratti dai due indici indipendenti)
  const leftCluster = clusters[navState.left]
  const rightCluster = clusters[navState.right]

  // Tutti i cluster che vanno nel footer (tutti meno i due attivi)
  const footerClusters = clusters.filter((_, i) => i !== navState.left && i !== navState.right)

  return (
    <div className="w-full h-screen relative z-10 overflow-hidden">

      {/* ── OCCHIO TOP CENTER (responsivo con vh) ── */}
      <div className="absolute top-[4vh] left-1/2 -translate-x-1/2 w-[30vh] h-[30vh] z-30">
        <EyeScene targetRoute="/calendar" showCircularText={false} globalTracking={true} />
        {/* Intercettatore click sull'Occhio quando c'è l'overlay espanso */}
        {expandedClusterId && (
          <div 
            className="absolute inset-0 z-50 cursor-pointer" 
            onClick={() => setExpandedClusterId(null)} 
          />
        )}
      </div>

      {/* ── MAIN STAGE: 2 cluster grandi + descrizioni (posizionato più in alto per dare respiro) ── */}
      <div className="absolute top-[28vh] left-0 w-full h-[40vh] flex justify-center gap-[3vw] px-[5vw]">

        {/* ── CLUSTER SINISTRO + descrizione ──── */}
        <div className="flex items-start gap-[2vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={leftCluster.id + '_main_left'}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -40 }}
              whileHover={{ scale: 1.05, rotate: -1, y: -5 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setExpandedClusterId(leftCluster.id)}
              className="w-[20vw] h-[20vw] flex-shrink-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              <img
                src={leftCluster.image}
                alt={leftCluster.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Descrizione sinistra */}
          <AnimatePresence mode="wait">
            <motion.div
              key={leftCluster.id + '_desc_left'}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pt-[1vw] max-w-[14vw]"
            >
              <h2
                className="text-[2.5vw] font-neo tracking-widest drop-shadow-md leading-none"
                style={{ color: leftCluster.titleColor }}
              >
                {leftCluster.title}
              </h2>
              <p
                className="mt-2 font-neo text-[0.8vw] uppercase leading-relaxed tracking-wide"
                style={{ color: leftCluster.descColor }}
              >
                {leftCluster.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CLUSTER DESTRO + descrizione ──── */}
        <div className="flex items-start gap-[2vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={rightCluster.id + '_main_right'}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -40 }}
              whileHover={{ scale: 1.05, rotate: 1, y: -5 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setExpandedClusterId(rightCluster.id)}
              className="w-[20vw] h-[20vw] flex-shrink-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              <img
                src={rightCluster.image}
                alt={rightCluster.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Descrizione destra */}
          <AnimatePresence mode="wait">
            <motion.div
              key={rightCluster.id + '_desc_right'}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pt-[1vw] max-w-[14vw]"
            >
              <h2
                className="text-[2.5vw] font-neo tracking-widest drop-shadow-md leading-none"
                style={{ color: rightCluster.titleColor }}
              >
                {rightCluster.title}
              </h2>
              <p
                className="mt-2 font-neo text-[0.8vw] uppercase leading-relaxed tracking-wide"
                style={{ color: rightCluster.descColor }}
              >
                {rightCluster.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── FOOTER: fila di thumbnail scorrevole (Drag orizzontale) ──────────────────── */}
      <div 
        ref={footerRef}
        className="absolute bottom-[10vh] left-0 w-full h-[18vh] z-20 overflow-hidden select-none"
        onMouseEnter={() => setIsHoveringFooter(true)}
        onMouseLeave={() => setIsHoveringFooter(false)}
      >
        <motion.div 
          drag="x"
          dragConstraints={footerRef}
          initial={{ x: -80 }}
          className="absolute left-0 flex justify-start items-center gap-[2.5vw] h-full pl-0 pr-[150px] w-max cursor-grab active:cursor-grabbing"
        >
          {clusters.map((cluster, i) => (
              <motion.div
                key={cluster.id + '_footer_' + i}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: (i === navState.left || i === navState.right) ? 0.4 : 0.8,
                  scale: (i === navState.left || i === navState.right) ? 0.9 : 1,
                  y: 0
                }}
                whileHover={{ scale: 1.05, rotate: 2, y: -5 }}
                transition={{ duration: 0.4 }}
                onClick={() => replaceCluster(i)}
                className="w-[12vw] h-[12vw] flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#111] cursor-pointer border border-gray-700/30"
              >
                <img
                  src={cluster.image}
                  alt={cluster.title}
                  className="w-full h-full object-contain p-2 pointer-events-none"
                />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(244, 83, 144, 0.7)' }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
          className="w-[70px] h-[70px] cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300"
          style={{ 
            backgroundColor: cartHovered ? '#F45390' : '#B3828B',
            boxShadow: cartHovered ? '0 0 20px rgba(244, 83, 144, 0.5)' : '0 0 10px rgba(0,0,0,0.3)' 
          }}
          title="Vai alla Cassa"
        >
          <img
            src={cartHovered ? '/images/drops/carrellorosa_optimized.webp' : '/images/drops/carrello_optimized.webp'}
            alt="Carrello"
            className="w-full h-full object-contain"
          />
        </motion.button>
      </div>

      {/* ── EXPANDED CLUSTER OVERLAY ──────────────────── */}
      <AnimatePresence>
        {expandedClusterId && (
          <motion.div
            key="expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-25 bg-black/80 backdrop-blur-md flex flex-col pt-[23vh] overflow-hidden"
            onClick={() => setExpandedClusterId(null)} // Click outside closes overlay
          >
            {/* Tasto Chiudi */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpandedClusterId(null)}
              className="absolute top-10 right-10 z-[110] text-[#F45390] text-5xl font-neo cursor-pointer focus:outline-none"
            >
              ✕
            </motion.button>
            
            {/* Frecce Direzionali */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-[110]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setActiveDeckIndex(prev => Math.max(0, prev - 1)) }}
                className={`w-[60px] h-[60px] rounded-full border border-gray-600 flex items-center justify-center transition-colors ${activeDeckIndex > 0 ? 'text-gray-400 hover:text-white bg-black/50 hover:bg-[#F45390]/20 cursor-pointer' : 'opacity-20 pointer-events-none'}`}
              >
                <span className="text-2xl">←</span>
              </motion.button>
            </div>
            
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-[110]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setActiveDeckIndex(prev => Math.min(MOCK_SUBCLUSTERS.length - 1, prev + 1)) }}
                className={`w-[60px] h-[60px] rounded-full border border-gray-600 flex items-center justify-center transition-colors ${activeDeckIndex < MOCK_SUBCLUSTERS.length - 1 ? 'text-gray-400 hover:text-white bg-black/50 hover:bg-[#F45390]/20 cursor-pointer' : 'opacity-20 pointer-events-none'}`}
              >
                <span className="text-2xl">→</span>
              </motion.button>
            </div>

            {/* Striscia Orizzontale dei Mazzi di Subcluster in Stile Coverflow */}
            <div 
               className="relative w-full h-[70vh] flex items-center justify-center"
            >
               {MOCK_SUBCLUSTERS.map((sub, idx) => {
                 const offset = idx - activeDeckIndex;
                 
                 // Calcola rotazione, opacità e scaling in base alla distanza dal centro
                 const absOffset = Math.abs(offset);
                 const isActive = offset === 0;
                 
                 // Seleziona la traslazione orizzontale in VW
                 const xTranslation = offset * 20; // Ogni mazzo è scostato di 20vw
                 
                 // Effetto prospettico
                 const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15);
                 const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.4);
                 // Sfuma gradualmente le carte non centrali
                 const rotateY = offset > 0 ? -15 : offset < 0 ? 15 : 0;
                 // Mantiene i cloni laterali bassi e il clone centrale alto
                 const zIndex = 60 - absOffset * 10;

                 return (
                    <motion.div 
                      key={'deck-wrapper-' + idx} 
                      animate={{
                         x: `${xTranslation}vw`,
                         scale: scale,
                         opacity: opacity,
                         rotateY: rotateY,
                         zIndex: zIndex
                      }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      style={{ perspective: 1000 }}
                      className={`absolute ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ClusterDeck 
                          subclusterTitle={sub.title}
                          artworks={sub.artworks}
                      />
                    </motion.div>
                 )
               })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
