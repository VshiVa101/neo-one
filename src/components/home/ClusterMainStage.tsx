'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'
import { ClusterData } from './ClusterLayout'

interface ClusterMainStageProps {
  leftCluster: ClusterData
  rightCluster: ClusterData
  onClusterClick: (id: number | string) => void
  isTouchMode: boolean
  leftSwipeDirection: 'left' | 'right' | null
  rightSwipeDirection: 'left' | 'right' | null
  onPanelSwipe: (side: 'left' | 'right', direction: 'left' | 'right') => void
}

export const ClusterMainStage = ({
  leftCluster,
  rightCluster,
  onClusterClick,
  isTouchMode,
  leftSwipeDirection,
  rightSwipeDirection,
  onPanelSwipe,
}: ClusterMainStageProps) => {
  return (
    <div className="absolute top-[14vh] md:top-[28vh] left-0 w-full h-[calc(100dvh-14vh-25dvh)] md:h-[42vh] flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-[4vw] px-4 md:px-[5vw] overflow-visible z-10">
      <ClusterPanel
        cluster={leftCluster}
        side="left"
        onClick={() => onClusterClick(leftCluster.id)}
        isTouchMode={isTouchMode}
        swipeDirection={leftSwipeDirection}
        onSwipe={(dir) => onPanelSwipe('left', dir)}
      />
      <ClusterPanel
        cluster={rightCluster}
        side="right"
        onClick={() => onClusterClick(rightCluster.id)}
        isTouchMode={isTouchMode}
        swipeDirection={rightSwipeDirection}
        onSwipe={(dir) => onPanelSwipe('right', dir)}
      />
    </div>
  )
}

const panelVariants = {
  initial: ({ swipeDirection, isTouchMode }: { swipeDirection: 'left' | 'right' | null; isTouchMode: boolean }) => {
    if (!isTouchMode || !swipeDirection) {
      return { opacity: 0, scale: 0.85, y: 40, x: 0 }
    }
    return {
      opacity: 0,
      scale: 0.9,
      x: swipeDirection === 'left' ? 150 : -150,
      y: 0,
    }
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: ({ swipeDirection, isTouchMode }: { swipeDirection: 'left' | 'right' | null; isTouchMode: boolean }) => {
    if (!isTouchMode || !swipeDirection) {
      return { opacity: 0, scale: 0.85, y: -40, x: 0 }
    }
    return {
      opacity: 0,
      scale: 0.9,
      x: swipeDirection === 'left' ? -150 : 150,
      y: 0,
    }
  },
}

const ClusterPanel = ({
  cluster,
  side,
  onClick,
  isTouchMode,
  swipeDirection,
  onSwipe,
}: {
  cluster: ClusterData
  side: 'left' | 'right'
  onClick: () => void
  isTouchMode: boolean
  swipeDirection: 'left' | 'right' | null
  onSwipe: (direction: 'left' | 'right') => void
}) => {
  const rotate = side === 'left' ? -1 : 1
  const xInitial = side === 'left' ? -15 : -15

  return (
    <div className="w-full max-w-[92vw] md:max-w-none flex flex-row items-center lg:items-start gap-3 lg:gap-[2vw] overflow-visible">
      <AnimatePresence mode="wait" custom={{ swipeDirection, isTouchMode }}>
        <motion.div
          key={cluster.id + '_main_' + side}
          custom={{ swipeDirection, isTouchMode }}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover={isTouchMode ? {} : { scale: 1.1, rotate, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onPanEnd={(event, info) => {
            if (Math.abs(info.offset.x) > 30 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
              if (info.offset.x > 0) {
                onSwipe('right')
              } else {
                onSwipe('left')
              }
            }
          }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          onClick={onClick}
          className="will-change-transform w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] max-w-[220px] max-h-[220px] md:max-w-none md:max-h-none flex-shrink-0 shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer relative touch-pan-y select-none"
        >
          <Image
            src={cluster.image}
            alt={cluster.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 18vw"
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={cluster.id + '_desc_' + side}
          initial={{ opacity: 0, x: xInitial }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-2 lg:pt-[1vw] min-w-0 flex-1 max-w-[42vw] lg:max-w-[14vw]"
        >
          <h2 className="text-xl md:text-3xl lg:text-[2.5vw] font-neo tracking-widest drop-shadow-md leading-none branded-title">
            <BrandedTitle text={cluster.title} />
          </h2>
          <p className="mt-1 md:mt-2 font-neo text-xs md:text-[15px] lg:text-[1.25vw] leading-relaxed tracking-wide whitespace-normal break-words text-white uppercase">
            {cluster.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
