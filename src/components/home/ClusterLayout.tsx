'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { EyeScene } from '@/components/EyeScene'
import { ClusterDeck, MockArtwork } from '@/components/home/ClusterDeck'
import { fetchClusterSubclusters } from '@/app/(frontend)/home/actions'
import { ExpandedGalleryOverlay } from '@/components/home/ExpandedGalleryOverlay'
import { MiniMatrixLoader } from '@/components/MiniMatrixLoader'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from '@/contexts/TransitionContext'
import { BrandedTitle } from '@/components/BrandedTitle'
import { useCart } from '@/contexts/CartContext'

export interface SubclusterData {
  id: number | string
  title: string
  artworks: MockArtwork[]
}

export interface ClusterData {
  id: number | string
  title: string
  desc: string
  slug?: string | null
  image: string
  titleColor: string
  descColor: string
}

export const ClusterLayout = ({ clusters }: { clusters: ClusterData[] }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isTransitioning } = useTransition()
  const { setIsCartOpen } = useCart()

  // Se siamo nella landing page (/), montiamo l'occhio dello sfondo SOLO quando inizia la transizione.
  // Questo evita di avere 2 Canvas WebGL contemporaneamente al caricamento iniziale.
  const shouldRenderBackgroundEye = pathname !== '/' || isTransitioning

  // LOGICA DI PRIORITÀ FORZATA (Leo's View)
  // Cerchiamo Neon e Bianconero negli indici per evitare i cluster di test
  const initialLeft = clusters.findIndex(
    (c) => c.slug?.toLowerCase().includes('neon') || c.title?.toLowerCase().includes('neon'),
  )
  const initialRight = clusters.findIndex(
    (c) =>
      c.slug?.toLowerCase().includes('bn') ||
      c.slug?.toLowerCase().includes('bianco') ||
      c.title?.toLowerCase().includes('mix'),
  )

  // Se non troviamo i preferiti, ripieghiamo sui primi due dell'array ordinato
  const startLeft = initialLeft !== -1 ? initialLeft : 0
  const startRight = initialRight !== -1 ? initialRight : clusters.length > 1 ? 1 : 0

  const [navState, setNavState] = useState({
    left: startLeft,
    right: startRight,
    next: 'left' as 'left' | 'right',
    pool: 2,
  })

  const [cartHovered, setCartHovered] = useState(false)
  const [isHoveringFooter, setIsHoveringFooter] = useState(false)

  // Stato del Mock Cluster espanso (null = chiuso, 'id_del_cluster' = aperto)
  const [expandedClusterId, setExpandedClusterId] = useState<number | string | null>(null)

  // Cache dei sottocluster caricati in lazy load
  const [cachedSubclusters, setCachedSubclusters] = useState<Record<string, SubclusterData[]>>({})
  const [isLoadingExpanded, setIsLoadingExpanded] = useState(false)

  // STATO PER LA GALLERIA ESPANSA
  const [expandedDeckIndex, setExpandedDeckIndex] = useState<number | null>(null)

  // Rileva stato della gallery dai parametri URL (per il tasto Back)
  useEffect(() => {
    const clusterParam = searchParams.get('cluster')
    const deckParam = searchParams.get('deck')

    if (clusterParam) {
      setExpandedClusterId(clusterParam)
    }
    if (deckParam !== null && deckParam !== undefined) {
      setExpandedDeckIndex(parseInt(deckParam, 10))
    }
  }, [searchParams])

  // Gestione tasto indietro RIMOSSA per prevenire crash del router
  useEffect(() => {
    // La logica popstate/pushState è stata disabilitata perché interferiva con il router di Next.js
  }, [expandedClusterId])

  // Indice del mazzo (Subcluster) attivo visibile in primo piano
  const [activeDeckIndex, setActiveDeckIndex] = useState(0)

  // Disabilita lo scroll del body quando la galleria è aperta
  useEffect(() => {
    if (expandedDeckIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [expandedDeckIndex])

  // Observer per fetching on-demand
  useEffect(() => {
    if (!expandedClusterId) return

    // Cache hit: dati già presenti
    const cached = cachedSubclusters[expandedClusterId]
    if (cached) {
      // Anche con dati in cache, forziamo la Gallery View se il cluster ha un solo sottocluster
      if (cached.length === 1) {
        setExpandedDeckIndex(0)
      }
      return
    }

    let isMounted = true
    setIsLoadingExpanded(true)

    fetchClusterSubclusters(String(expandedClusterId))
      .then((data) => {
        if (isMounted) {
          setCachedSubclusters((prev) => ({ ...prev, [expandedClusterId]: data }))
          setIsLoadingExpanded(false)

          // AUTO-EXPAND: se c'è solo un mazzo, vai diretto alla griglia
          if (data.length === 1) {
            setExpandedDeckIndex(0)
          } else {
            setActiveDeckIndex(Math.floor(data.length / 2))
          }
        }
      })
      .catch((err) => {
        console.error(err)
        if (isMounted) setIsLoadingExpanded(false)
      })

    return () => {
      isMounted = false
    }
  }, [expandedClusterId, cachedSubclusters])

  // Se non ci sono cluster o ce n'è solo 1, evitiamo errori nella destrutturazione in Home
  if (!clusters || clusters.length < 2) return null

  const currentSubclusters = expandedClusterId ? cachedSubclusters[expandedClusterId] || [] : []

  // Ref per il trascinamento del footer
  const footerRef = React.useRef<HTMLDivElement>(null)
  const footerX = useMotionValue(0)
  const touchStartX = React.useRef<number | null>(null)
  const lastDeckSwitchTime = React.useRef<number>(0)

  // Funzione helper per rimpiazzare un lato (usando functional update per evitare closure stale)
  const replaceCluster = (newIdx: number, forcedSide?: 'left' | 'right') => {
    setNavState((prev) => {
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
      // Usiamo sia il check sul target che lo stato isHoveringFooter per massima sicurezza
      const target = e.target as HTMLElement
      const isOverFooter = target?.closest?.('.home-footer-container')
      if (isOverFooter || isHoveringFooter || expandedClusterId) return

      e.preventDefault()
      if (isScrolling) return
      isScrolling = true
      setTimeout(() => (isScrolling = false), 900)

      setNavState((prev) => {
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
      setNavState((prev) => {
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

    // Listener nativo per il footer per gestire lo scroll orizzontale tramite motion value
    const footer = footerRef.current
    const handleFooterWheel = (e: WheelEvent) => {
      const footer = footerRef.current
      if (footer) {
        // Impediamo lo scroll globale
        e.preventDefault()
        e.stopPropagation()
        
        // Cerchiamo l'elemento interno w-max per la larghezza reale
        const content = footer.querySelector('.w-max') as HTMLElement
        if (!content) return

        const containerWidth = footer.clientWidth
        const contentWidth = content.offsetWidth
        
        // Calcoliamo il limite massimo di scorrimento (negativo)
        // Aggiungiamo un margine di 100px alla fine
        const maxScroll = Math.min(0, containerWidth - contentWidth - 80)
        
        // Usiamo deltaY o deltaX (per mouse con scroll orizzontale)
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        
        const currentX = footerX.get()
        const newX = Math.min(0, Math.max(maxScroll, currentX - delta))
        
        footerX.set(newX)
      }
    }

    if (footer) {
      footer.addEventListener('wheel', handleFooterWheel, { passive: false })
    }

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
      if (footer) {
        footer.removeEventListener('wheel', handleFooterWheel)
      }
    }
  }, [expandedClusterId, clusters.length, footerX])

  // I due cluster in primo piano (estratti dai due indici indipendenti)
  const leftCluster = clusters[navState.left]
  const rightCluster = clusters[navState.right]

  return (
    <div className="w-full h-screen relative z-10 overflow-hidden">
      {/* ── OCCHIO TOP CENTER (responsivo con vh) ── */}
      <div className={`fixed ${expandedDeckIndex !== null ? 'top-[10vh] md:top-[16vh]' : 'top-[2vh] md:top-[4vh]'} left-1/2 -translate-x-1/2 w-[12vh] h-[12vh] md:w-[28vh] md:h-[28vh] z-[500] transition-all duration-500`}>
        {shouldRenderBackgroundEye ? (
          <EyeScene
            targetRoute="/home"
            showCircularText={false}
            globalTracking={true}
            scaleMultiplier={1.3}
            onClick={(expandedClusterId || expandedDeckIndex !== null) ? () => {
              setExpandedDeckIndex(null)
              setExpandedClusterId(null)
            } : undefined}
          />
        ) : (
          <div className="w-full h-full bg-transparent" />
        )}
      </div>

      {/* ── MAIN STAGE: 2 cluster grandi + descrizioni ── */}
      <div className="absolute top-[16vh] md:top-[32vh] left-0 w-full h-auto md:h-[44vh] flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-[4vw] px-6 md:px-[5vw] overflow-y-auto md:overflow-hidden custom-scrollbar z-10">
        {/* ── CLUSTER SINISTRO + descrizione ──── */}
        <div className="flex flex-row items-center lg:items-start gap-4 lg:gap-[2vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={leftCluster.id + '_main_left'}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -40 }}
              whileHover={{ scale: 1.05, rotate: -1, y: -5 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setExpandedClusterId(leftCluster.id)}
              className="w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] max-w-[220px] max-h-[220px] md:max-w-none md:max-h-none flex-shrink-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer"
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
              className="pt-2 lg:pt-[1vw] max-w-[50vw] lg:max-w-[14vw]"
            >
              <h2 className="text-xl md:text-3xl lg:text-[2.5vw] font-neo tracking-widest drop-shadow-md leading-none branded-title">
                <BrandedTitle text={leftCluster.title} />
              </h2>
              <p className="mt-1 md:mt-2 font-neo text-[11px] md:text-sm lg:text-[0.9vw] lowercase leading-relaxed tracking-wide whitespace-normal break-words text-white neo-skip-branding">
                {leftCluster.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CLUSTER DESTRO + descrizione ──── */}
        <div className="flex flex-row items-center lg:items-start gap-4 lg:gap-[2vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={rightCluster.id + '_main_right'}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -40 }}
              whileHover={{ scale: 1.05, rotate: 1, y: -5 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setExpandedClusterId(rightCluster.id)}
              className="w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] max-w-[220px] max-h-[220px] md:max-w-none md:max-h-none flex-shrink-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer"
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
              className="pt-2 lg:pt-[1vw] max-w-[50vw] lg:max-w-[14vw]"
            >
              <h2 className="text-xl md:text-3xl lg:text-[2.5vw] font-neo tracking-widest drop-shadow-md leading-none branded-title">
                <BrandedTitle text={rightCluster.title} />
              </h2>
              <p className="mt-1 md:mt-2 font-neo text-[11px] md:text-sm lg:text-[0.9vw] lowercase leading-relaxed tracking-wide whitespace-normal break-words text-white neo-skip-branding">
                {rightCluster.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── FOOTER & CART ROW ──────────────────── */}
      <div className="absolute bottom-[1vh] md:bottom-[2vh] left-0 w-full flex items-center px-[5vw] gap-6 z-20 pointer-events-none">
        {/* Footer: scrollable thumbnails */}
        <div
          ref={footerRef}
          className="flex-1 h-[15vh] md:h-[20vh] pt-[1vh] md:pt-[2vh] overflow-hidden select-none home-footer-container pointer-events-auto"
          onMouseEnter={() => setIsHoveringFooter(true)}
          onMouseLeave={() => setIsHoveringFooter(false)}
        >
          <motion.div
            drag="x"
            dragConstraints={footerRef}
            style={{ x: footerX }}
            className="flex justify-start items-center gap-[2.5vw] h-full pr-[50px] w-max cursor-grab active:cursor-grabbing"
          >
            {clusters.map((cluster, i) => {
              const isSelected = i === navState.left || i === navState.right
              if (isSelected) return null

              return (
                <motion.div
                  key={cluster.id + '_footer_' + i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 0.8,
                    scale: 1,
                    y: 0,
                  }}
                  whileHover={{ scale: 1.1, rotate: 3, y: -10, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onClick={() => replaceCluster(i)}
                  className="w-[12vh] h-[12vh] md:w-[15vh] md:h-[15vh] flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#111] cursor-pointer border border-gray-700/30"
                >
                  <img
                    src={cluster.image}
                    alt={cluster.title}
                    className="w-full h-full object-contain p-2 pointer-events-none"
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Cart Button: fixed on the right of the same row */}
        <div className="flex-shrink-0 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(244, 83, 144, 0.7)' }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
            onClick={() => setIsCartOpen(true)}
            className="w-[45px] h-[45px] md:w-[60px] md:h-[60px] cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300"
            style={{
              backgroundColor: cartHovered ? '#F45390' : '#B3828B',
              boxShadow: cartHovered
                ? '0 0 20px rgba(244, 83, 144, 0.5)'
                : '0 0 10px rgba(0,0,0,0.3)',
            }}
            title="Vai alla Cassa"
          >
            <img
              src={
                cartHovered
                  ? '/images/drops/carrellorosa_optimized.webp'
                  : '/images/drops/carrello_optimized.webp'
              }
              alt="Carrello"
              className="w-full h-full object-contain"
            />
          </motion.button>
        </div>
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
            className="fixed inset-0 z-25 bg-black/80 backdrop-blur-md flex flex-col pt-[26vh] overflow-hidden"
            onClick={() => setExpandedClusterId(null)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const touchEndX = e.changedTouches[0].clientX
              const deltaX = touchStartX.current - touchEndX
              if (Math.abs(deltaX) > 50) {
                if (deltaX > 0)
                  setActiveDeckIndex((prev) => Math.min(currentSubclusters.length - 1, prev + 1))
                else setActiveDeckIndex((prev) => Math.max(0, prev - 1))
              }
              touchStartX.current = null
            }}
          >
            {/* Il tasto Chiudi (X) è rimosso. Si chiude tramite la gesture sull'Occhio centrale */}

            {isLoadingExpanded ? (
              // SPINNER NEO-1 - Forzato al centro assoluto dello schermo
              <MiniMatrixLoader />
            ) : (
              <>
                {/* I tasti freccia < > sono stati rimossi. Usa il mouse ai lati per scorrere o lo swipe touch. */}
                {/* Striscia Orizzontale dei Mazzi di Subcluster in Stile Coverflow */}
                <div className="relative w-full h-[70vh] flex items-center justify-center">
                  {currentSubclusters.length === 0 ? (
                    <div className="text-white font-neo tracking-widest opacity-50 uppercase">
                      Nessuna Opera Trovata
                    </div>
                  ) : (
                    currentSubclusters.map((sub, idx) => {
                      const offset = idx - activeDeckIndex

                      // Calcola rotazione, opacità e scaling in base alla distanza dal centro
                      const absOffset = Math.abs(offset)
                      const isActive = offset === 0

                      // Seleziona la traslazione orizzontale in VW
                      const xTranslation = offset * 20 // Ogni mazzo è scostato di 20vw

                      // Effetto prospettico
                      const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15)
                      const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.4)
                      // Sfuma gradualmente le carte non centrali
                      const rotateY = offset > 0 ? -15 : offset < 0 ? 15 : 0
                      // Mantiene i cloni laterali bassi e il clone centrale alto
                      const zIndex = 60 - absOffset * 10

                      return (
                        <motion.div
                          key={'deck-wrapper-' + idx}
                          animate={{
                            x: `${xTranslation}vw`,
                            scale: scale,
                            opacity: opacity,
                            rotateY: rotateY,
                            zIndex: zIndex,
                          }}
                          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                          style={{ perspective: 1000 }}
                          className="absolute pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => setActiveDeckIndex(idx)}
                        >
                          <ClusterDeck
                            subclusterTitle={sub.title}
                            artworks={sub.artworks}
                            onExpand={() => setExpandedDeckIndex(idx)}
                          />
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDED GALLERY GRID OVERLAY ──────────────────── */}
      <ExpandedGalleryOverlay
        isOpen={expandedDeckIndex !== null}
        onClose={() => {
          setExpandedDeckIndex(null)
          // Se c'era un solo sottocluster, chiudi tutto e torna alla home principale
          if (currentSubclusters.length === 1) {
            setExpandedClusterId(null)
          }
        }}
        subclusterTitle={
          expandedDeckIndex !== null ? currentSubclusters[expandedDeckIndex]?.title || '' : ''
        }
        artworks={expandedDeckIndex !== null ? currentSubclusters[expandedDeckIndex]?.artworks || [] : []}
        clusterId={expandedClusterId}
        deckIndex={expandedDeckIndex}
      />
    </div>
  )
}
