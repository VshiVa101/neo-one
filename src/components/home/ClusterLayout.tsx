'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { EyeScene } from '@/components/EyeScene'
import { MockArtwork } from '@/components/home/deckCardStyle'
import { fetchClusterSubclusters } from '@/app/(frontend)/home/actions'
import { ExpandedGalleryOverlay } from '@/components/home/ExpandedGalleryOverlay'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from '@/contexts/TransitionContext'
import { useCart } from '@/contexts/CartContext'
import { ClusterMainStage } from './ClusterMainStage'
import { ClusterNavFooter } from './ClusterNavFooter'
import { ExpandedClusterModal } from './ExpandedClusterModal'

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
      c.slug?.toLowerCase().includes('bn') ||
      c.slug?.toLowerCase().includes('bianco') ||
      c.title?.toLowerCase().includes('mix'),
  )

  const startLeft = initialLeft !== -1 ? initialLeft : 0
  const startRight = initialRight !== -1 ? initialRight : clusters.length > 1 ? 1 : 0

  const [navState, setNavState] = useState({
    left: startLeft,
    right: startRight,
    next: 'left' as 'left' | 'right',
    pool: 2,
  })

  const router = useRouter()
  const [cartHovered, setCartHovered] = useState(false)
  const [infoHovered, setInfoHovered] = useState(false)
  const [isHoveringFooter, setIsHoveringFooter] = useState(false)
  const [expandedClusterId, setExpandedClusterId] = useState<number | string | null>(null)
  const [cachedSubclusters, setCachedSubclusters] = useState<Record<string, SubclusterData[]>>({})
  const [isLoadingExpanded, setIsLoadingExpanded] = useState(false)
  const [expandedDeckIndex, setExpandedDeckIndex] = useState<number | null>(null)
  const [activeDeckIndex, setActiveDeckIndex] = useState(0)

  useEffect(() => {
    const clusterParam = searchParams.get('cluster')
    const deckParam = searchParams.get('deck')
    if (clusterParam) setExpandedClusterId(clusterParam)
    if (deckParam !== null && deckParam !== undefined)
      setExpandedDeckIndex(parseInt(deckParam, 10))
  }, [searchParams])

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
      if (cached.length === 1) setExpandedDeckIndex(0)
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
            setExpandedDeckIndex(originalIdx)
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
    <div className="w-full h-screen relative z-10 overflow-hidden">
      {/* ── OCCHIO TOP CENTER ── */}
      <div className="fixed top-[2vh] md:top-[4vh] left-1/2 -translate-x-1/2 w-[12vh] h-[12vh] md:w-[28vh] md:h-[28vh] z-[500] transition-all duration-500">
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
      />

      {/* ── FOOTER ── */}
      <ClusterNavFooter
        clusters={clusters}
        selectedLeft={navState.left}
        selectedRight={navState.right}
        onSelectCluster={replaceCluster}
        footerRef={footerRef}
        footerX={footerX}
        onHoverChange={setIsHoveringFooter}
      />

      {/* ── BOTTOM-RIGHT BUTTONS ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[400] pointer-events-auto flex flex-col items-center gap-3">
        {!expandedClusterId && expandedDeckIndex === null && (
          <motion.button
            animate={{ scale: infoHovered ? 1.5 : 1 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setInfoHovered(true)}
            onMouseLeave={() => setInfoHovered(false)}
            onClick={() => router.push('/calendar')}
            className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300"
            style={{
              backgroundColor: infoHovered ? '#F45390' : '#B3828B',
              boxShadow: infoHovered
                ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
                : '0 0 10px rgba(0,0,0,0.3)',
              zIndex: infoHovered ? 401 : undefined,
            }}
            title="Calendario"
          >
            <Image
              src="/images/drops/inforosa.webp"
              alt="Info"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              style={{ transform: 'scale(1.5)' }}
              unoptimized
            />
          </motion.button>
        )}

        <motion.button
          animate={{ scale: cartHovered ? 1.5 : 1 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
          onClick={() => setIsCartOpen(true)}
          className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300 relative"
          style={{
            backgroundColor: cartHovered ? '#F45390' : '#B3828B',
            boxShadow: cartHovered
              ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
              : '0 0 10px rgba(0,0,0,0.3)',
            zIndex: cartHovered ? 401 : undefined,
          }}
          title="Vai alla Cassa"
        >
          <Image
            src={
              cartHovered
                ? '/images/drops/carrellorosa_optimized.webp'
                : count > 0
                  ? '/images/drops/carrelloverde_optimized.webp'
                  : '/images/drops/carrello_optimized.webp'
            }
            alt="Carrello"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            style={{ transform: 'scale(1.5)' }}
            unoptimized
          />
          <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#809829] rounded-full font-neo text-[8px] md:text-[10px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)]">
            {count}
          </span>
        </motion.button>
      </div>

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
          setExpandedDeckIndex(null)
          if (currentSubclusters.length === 1) {
            setExpandedClusterId(null)
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
