'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ClusterData } from './ClusterLayout'
import { MotionValue } from 'framer-motion'

interface ClusterNavFooterProps {
  clusters: ClusterData[]
  selectedLeft: number
  selectedRight: number
  onSelectCluster: (index: number) => void
  footerRef: React.RefObject<HTMLDivElement | null>
  footerX: MotionValue<number>
  onHoverChange: (hovering: boolean) => void
  children?: React.ReactNode
}

export const ClusterNavFooter = ({
  clusters,
  selectedLeft,
  selectedRight,
  onSelectCluster,
  footerRef,
  footerX,
  onHoverChange,
  children,
}: ClusterNavFooterProps) => {
  return (
    <div className="fixed bottom-6 md:bottom-10 left-0 w-full flex items-center px-[5vw] gap-6 z-[400] pointer-events-none">
      <div
        ref={footerRef}
        className="flex-1 min-w-0 h-[20vh] md:h-[22vh] select-none home-footer-container pointer-events-auto overflow-visible relative z-0"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <motion.div
          drag="x"
          dragConstraints={footerRef}
          style={{ x: footerX }}
          className="flex justify-start items-center gap-[2.5vw] h-full pr-[50px] w-max cursor-grab active:cursor-grabbing"
        >
          {clusters.map((cluster, i) => {
            const isSelected = i === selectedLeft || i === selectedRight
            if (isSelected) return null

            return (
              <motion.div
                key={cluster.id + '_footer_' + i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.8, scale: 1, y: 0 }}
                whileHover={{ scale: 1.1, rotate: 3, y: -10, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onClick={() => onSelectCluster(i)}
                className="will-change-transform w-[12vh] h-[12vh] md:w-[15vh] md:h-[15vh] flex-shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#111] cursor-pointer border border-gray-700/30 relative"
              >
                <Image
                  src={cluster.image}
                  alt={cluster.title}
                  fill
                  className="object-contain p-2 pointer-events-none"
                  sizes="(max-width: 768px) 12vh, 15vh"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>
    </div>
  )
}
