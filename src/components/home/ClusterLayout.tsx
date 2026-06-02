'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { EyeScene } from '@/components/EyeScene'
import { MockArtwork } from '@/components/home/deckCardStyle'
import { fetchClusterSubclusters } from '@/app/(frontend)/home/actions'
import { ExpandedGalleryOverlay } from '@/components/home/ExpandedGalleryOverlay'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from '@/contexts/TransitionContext'
import { useCart } from '@/contexts/CartContext'
import { StateBasedNavButton } from '@/components/StateBasedNavButton'
import { MuteNavButton } from '@/components/MuteNavButton'
import { ClusterMainStage } from './ClusterMainStage'
import { ClusterNavFooter } from './ClusterNavFooter'
import { ExpandedClusterModal } from './ExpandedClusterModal'
import { AnimatedPixelCircle } from './AnimatedPixelCircle'
import { use8BitHover, HoverNoteType } from '@/hooks/use8BitHover'
import { useInputMode } from '@/contexts/InputModeContext'

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
  const { isCartOpen, setIsCartOpen, count } = useCart()

  const shouldRenderBackgroundEye = pathname !== '/' || isTransitioning

  const initialLeft = clusters.findIndex(
    (c) => c.slug?.toLowerCase().includes('neon') || c.title?.toLowerCase().includes('neon'),
  )
  const initialRight = clusters.findIndex(
    (c) =>
      c.slug?.toLowerCase() === 'b-n' ||
      c.slug?.toLowerCase().includes('bn') ||
      c.slug?.toLowerCase().includes('bianco') ||
      c.title?.toLowerCase().includes('b/n') ||
      c.title?.toLowerCase().includes('mix'),
  )

  const startLeft = initialLeft !== -1 ? initialLeft : 0
  const startRight = initialRight !== -1 ? initialRight : clusters.length > 1 ? 1 : 0

  const { isTouchMode } = useInputMode()
  const [navState, setNavState] = useState({
    left: startLeft,
    right: startRight,
    next: 'left' as 'left' | 'right',
    pool: 2,
  })
  const [swipeDirections, setSwipeDirections] = useState<Record<'left' | 'right', 'left' | 'right' | null>>({
    left: null,
    right: null,
  })

  const router = useRouter()

  const handlePanelSwipe = (side: 'left' | 'right', direction: 'left' | 'right') => {
    const isNext = direction === 'left'
    const otherIdx = side === 'left' ? navState.right : navState.left
    const currentIdx = side === 'left' ? navState.left : navState.right

    let nextIdx = currentIdx
    const step = isNext ? 1 : -1

    do {
      nextIdx = (nextIdx + step + clusters.length) % clusters.length
    } while (nextIdx === otherIdx)

    setSwipeDirections((prev) => ({ ...prev, [side]: direction }))

    setNavState((prev) => {
      if (side === 'left') {
        return { ...prev, left: nextIdx, next: 'right' }
      } else {
        return { ...prev, right: nextIdx, next: 'left' }
      }
    })
  }
  const [cartHovered, setCartHovered] = useState(false)
  const [muteHovered, setMuteHovered] = useState(false)
  const [calHovered, setCalHovered] = useState(false)
  const [isHoveringFooter, setIsHoveringFooter] = useState(false)
  const [cachedSubclusters, setCachedSubclusters] = useState<Record<string, SubclusterData[]>>({})
  const [isLoadingExpanded, setIsLoadingExpanded] = useState(false)
  const [activeDeckIndex, setActiveDeckIndex] = useState(0)

  const clusterParam = searchParams.get('cluster')
  const deckParam = searchParams.get('deck')

  const expandedClusterId = React.useMemo(() => {
    if (!clusterParam) return null
    const matched = clusters.find(c => c.slug?.toLowerCase() === clusterParam.toLowerCase() || String(c.id) === clusterParam)
    return matched ? matched.id : clusterParam
  }, [clusterParam, clusters])

  const expandedDeckIndex = deckParam !== null && deckParam !== undefined ? parseInt(deckParam, 10) : null

  const setExpandedClusterId = useCallback((id: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id !== null) {
      params.set('cluster', String(id))
      params.delete('deck')
    } else {
      params.delete('cluster')
      params.delete('deck')
    }
    const qs = params.toString()
    router.push(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false })
  }, [searchParams, pathname, router])

  const setExpandedDeckIndex = useCallback((index: number | null, replace = false) => {
    const params = new URLSearchParams(searchParams.toString())
    if (index !== null) {
      params.set('deck', String(index))
    } else {
      params.delete('deck')
    }
    const qs = params.toString()
    const url = `${pathname}${qs ? '?' + qs : ''}`
    if (replace) {
      router.replace(url, { scroll: false })
    } else {
      router.push(url, { scroll: false })
    }
  }, [searchParams, pathname, router])

  const { startHoverSound, stopHoverSound } = use8BitHover()

  const handleHoverStart = (setter: React.Dispatch<React.SetStateAction<boolean>>, noteType: HoverNoteType) => {
    setter(true)
    startHoverSound(noteType)
  }

  const handleHoverEnd = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false)
    stopHoverSound()
  }



  useEffect(() => {
    if (expandedDeckIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [expandedDeckIndex])

  useEffect(() => {
    if (!expandedClusterId) return
    const cached = cachedSubclusters[expandedClusterId]
    if (cached) {
      // Don't auto-open deck here if we removed useModalHistory, because we want it tied to the user action
      // or to the initial load, not repeatedly opening when user goes back.
      return
    }

    let isMounted = true
    setIsLoadingExpanded(true)

    fetchClusterSubclusters(String(expandedClusterId))
      .then((data) => {
        if (isMounted) {
          setCachedSubclusters((prev) => ({ ...prev, [expandedClusterId]: data }))
          setIsLoadingExpanded(false)
          
          const validData = data.filter((sub) => sub.artworks && sub.artworks.length > 0)
          
          if (validData.length === 1) {
            // Find the original index of the only valid subcluster
            const originalIdx = data.findIndex((sub) => sub.artworks && sub.artworks.length > 0)
            setExpandedDeckIndex(originalIdx, true) // replace URL so back button works correctly
          } else if (validData.length > 1) {
            setActiveDeckIndex(Math.floor(validData.length / 2))
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

  if (!clusters || clusters.length < 2) return null

  const currentSubclusters = expandedClusterId ? cachedSubclusters[expandedClusterId] || [] : []

  const footerRef = React.useRef<HTMLDivElement>(null)
  const footerX = useMotionValue(0)
  const touchStartX = React.useRef<number | null>(null)

  const replaceCluster = (newIdx: number, forcedSide?: 'left' | 'right') => {
    setNavState((prev) => {
      const side = forcedSide || prev.next
      setSwipeDirections((prevSwipe) => ({ ...prevSwipe, [side]: null }))
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
      const target = e.target as HTMLElement
      const isOverFooter = target?.closest?.('.home-footer-container')
      if (isOverFooter || isHoveringFooter || expandedClusterId || isCartOpen) return

      e.preventDefault()
      if (isScrolling) return
      isScrolling = true
      setTimeout(() => (isScrolling = false), 900)

      setNavState((prev) => {
        const nextIdx = prev.pool % clusters.length
        if (e.deltaY > 0) {
          if (nextIdx === prev.right) return prev
          return { ...prev, left: nextIdx, next: 'right', pool: (prev.pool + 1) % clusters.length }
        } else if (e.deltaY < 0) {
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

    const footer = footerRef.current
    const handleFooterWheel = (e: WheelEvent) => {
      const ft = footerRef.current
      if (ft) {
        e.preventDefault()
        e.stopPropagation()
        const content = ft.querySelector('.w-max') as HTMLElement
        if (!content) return

        const containerWidth = ft.clientWidth
        const contentWidth = content.offsetWidth
        const maxScroll = Math.min(0, containerWidth - contentWidth - 80)
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
  }, [expandedClusterId, clusters.length, footerX, isCartOpen, isHoveringFooter])

  const leftCluster = clusters[navState.left]
  const rightCluster = clusters[navState.right]

  return (
    <div className="w-full h-screen relative z-10">
      {/* ── OCCHIO TOP CENTER ── */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-[500] transition-all duration-500 ${
          expandedClusterId 
            ? 'top-[1vh] md:top-[2vh] w-[8vh] h-[8vh] md:w-[15vh] md:h-[15vh] opacity-100'
            : 'top-[2vh] md:top-[4vh] w-[12vh] h-[12vh] md:w-[28vh] md:h-[28vh]'
        }`}
      >
        {shouldRenderBackgroundEye ? (
          <EyeScene
            targetRoute="/calendar"
            showCircularText={false}
            globalTracking={true}
            scaleMultiplier={1.3}
            onClick={
              expandedClusterId || expandedDeckIndex !== null
                ? () => {
                    setExpandedDeckIndex(null)
                    setExpandedClusterId(null)
                  }
                : undefined
            }
          />
        ) : (
          <div className="w-full h-full bg-transparent" />
        )}
      </div>

      {/* ── MAIN STAGE ── */}
      <ClusterMainStage
        leftCluster={leftCluster}
        rightCluster={rightCluster}
        onClusterClick={setExpandedClusterId}
        isTouchMode={isTouchMode}
        leftSwipeDirection={swipeDirections.left}
        rightSwipeDirection={swipeDirections.right}
        onPanelSwipe={handlePanelSwipe}
      />

      {/* ── FOOTER & BUTTONS (Aligned on same axis) — visibile solo in home, non in expanded/gallery ── */}
      {!expandedClusterId && expandedDeckIndex === null && (
      <ClusterNavFooter
        clusters={clusters}
        selectedLeft={navState.left}
        selectedRight={navState.right}
        onSelectCluster={replaceCluster}
        footerRef={footerRef}
        footerX={footerX}
        onHoverChange={setIsHoveringFooter}
      >
        <div className="pointer-events-auto relative flex flex-col items-center justify-center">
          {/* Icons stack */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-5 py-3 md:py-4 lg:py-5 w-[40px] md:w-[60px] lg:w-[72px]">
            <div 
              className="relative flex items-center justify-center w-[36px] h-[36px] md:w-[46px] md:h-[46px] lg:w-[54px] lg:h-[54px]"
              onMouseEnter={isTouchMode ? undefined : () => handleHoverStart(setMuteHovered, 'A6')}
              onMouseLeave={isTouchMode ? undefined : () => handleHoverEnd(setMuteHovered)}
            >
              <AnimatedPixelCircle color="#F45390" isHovered={!isTouchMode && muteHovered} className="inset-0 w-full h-full opacity-80" />
              <MuteNavButton />
            </div>

            <div 
              className="relative flex items-center justify-center w-[36px] h-[36px] md:w-[46px] md:h-[46px] lg:w-[54px] lg:h-[54px]"
              onMouseEnter={isTouchMode ? undefined : () => handleHoverStart(setCartHovered, 'E6')}
              onMouseLeave={isTouchMode ? undefined : () => handleHoverEnd(setCartHovered)}
            >
              <AnimatedPixelCircle color="#FF82B2" isHovered={!isTouchMode && cartHovered} className="inset-0 w-full h-full opacity-80" />
              <motion.button
                whileHover={isTouchMode ? {} : { scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] lg:w-[46px] lg:h-[46px] relative cursor-pointer focus:outline-none group"
                title={count > 0 ? 'Vai alla Cassa' : 'Contatta Neo'}
              >
                <motion.div
                  variants={{
                    idle: { scale: 1, filter: 'brightness(1) drop-shadow(0 0 8px rgba(0,0,0,0.5))' },
                    hover: { scale: 1.15, filter: 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.95))' }
                  }}
                  animate={cartHovered ? "hover" : "idle"}
                  className="w-full h-full relative"
                >
                  {/* Default icon */}
                  <Image
                    src={count > 0 ? '/images/ui/carrelloverde.webp' : '/images/ui/invia-mail-vuoto.webp'}
                    alt={count > 0 ? 'Carrello' : 'Contatta'}
                    fill
                    className="object-contain group-hover:opacity-0 transition-opacity duration-200"
                    unoptimized
                  />
                  {/* Hover icon */}
                  <Image
                    src={count > 0 ? '/images/ui/carrelloverde.webp' : '/images/ui/invia-mail-verde.webp'}
                    alt={count > 0 ? 'Carrello' : 'Contatta'}
                    fill
                    className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    unoptimized
                  />
                </motion.div>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-[12px] h-[12px] md:w-[16px] md:h-[16px] lg:w-[20px] lg:h-[20px] flex items-center justify-center bg-[#809829] rounded-full font-neo text-[6px] md:text-[8px] lg:text-[10px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)] z-20">
                    {count}
                  </span>
                )}
              </motion.button>
            </div>

            <div 
              className="relative flex items-center justify-center w-[36px] h-[36px] md:w-[46px] md:h-[46px] lg:w-[54px] lg:h-[54px]"
              onMouseEnter={isTouchMode ? undefined : () => handleHoverStart(setCalHovered, 'D#6')}
              onMouseLeave={isTouchMode ? undefined : () => handleHoverEnd(setCalHovered)}
            >
              <AnimatedPixelCircle color="#809829" isHovered={!isTouchMode && calHovered} className="inset-0 w-full h-full opacity-80" />
              <StateBasedNavButton
                defaultIcon="/images/ui/web_2.webp"
                hoverIcon="/images/ui/web_6.webp"
                activeIcon="/images/ui/web_7.webp"
                onClick={() => router.push('/calendar')}
                title="Calendario"
                alt="Vai al calendario"
              />
            </div>
          </div>
        </div>
      </ClusterNavFooter>
      )}

      {/* ── EXPANDED CLUSTER MODAL ── */}
      <ExpandedClusterModal
        isOpen={!!expandedClusterId}
        onClose={() => setExpandedClusterId(null)}
        subclusters={currentSubclusters}
        isLoading={isLoadingExpanded}
        activeDeckIndex={activeDeckIndex}
        onActiveDeckChange={setActiveDeckIndex}
        onDeckExpand={(idx) => setExpandedDeckIndex(idx)}
        touchStartX={touchStartX}
      />

      {/* ── EXPANDED GALLERY GRID OVERLAY ── */}
      <ExpandedGalleryOverlay
        isOpen={expandedDeckIndex !== null}
        onClose={() => {
          if (currentSubclusters.length === 1) {
            setExpandedClusterId(null)
          } else {
            setExpandedDeckIndex(null)
          }
        }}
        artworks={
          expandedDeckIndex !== null
            ? currentSubclusters[expandedDeckIndex]?.artworks || []
            : []
        }
        clusterId={expandedClusterId}
        deckIndex={expandedDeckIndex}
      />
    </div>
  )
}
