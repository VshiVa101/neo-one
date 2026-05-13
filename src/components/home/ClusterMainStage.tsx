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
}

export const ClusterMainStage = ({
  leftCluster,
  rightCluster,
  onClusterClick,
}: ClusterMainStageProps) => {
  return (
    <div className="absolute top-[14vh] md:top-[28vh] left-0 w-full h-[calc(100dvh-14vh-25dvh)] md:h-[42vh] flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-[4vw] px-4 md:px-[5vw] overflow-visible z-10">
      <ClusterPanel
        cluster={leftCluster}
        side="left"
        onClick={() => onClusterClick(leftCluster.id)}
      />
      <ClusterPanel
        cluster={rightCluster}
        side="right"
        onClick={() => onClusterClick(rightCluster.id)}
      />
    </div>
  )
}

const ClusterPanel = ({
  cluster,
  side,
  onClick,
}: {
  cluster: ClusterData
  side: 'left' | 'right'
  onClick: () => void
}) => {
  const rotate = side === 'left' ? -1 : 1
  const xInitial = side === 'left' ? -15 : -15

  return (
      <div className="w-full max-w-[92vw] md:max-w-none flex flex-row items-center lg:items-start gap-3 lg:gap-[2vw] overflow-visible">
      <AnimatePresence mode="wait">
        <motion.div
          key={cluster.id + '_main_' + side}
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -40 }}
          whileHover={{ scale: 1.1, rotate, y: -8 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          onClick={onClick}
          className="will-change-transform w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] max-w-[220px] max-h-[220px] md:max-w-none md:max-h-none flex-shrink-0 shadow-[0_0_40px_rgba(0,0,0,0.7)] cursor-pointer relative"
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
          <p className="mt-1 md:mt-2 font-neo text-[11px] md:text-sm lg:text-[0.9vw] leading-relaxed tracking-wide whitespace-normal break-words text-white lowercase">
            {cluster.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
