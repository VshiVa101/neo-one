'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface CrumpledPaperPanelProps {
  artworkImage: string | null
  alt: string
  onClick?: () => void
  side: 'left' | 'right'
}

/* 
  Definiamo i 9 segmenti della griglia 3x3 per l'effetto mappa.
  Ogni segmento ha un'origine di trasformazione e angoli di piegatura iniziali (stato palla/accartocciato).
  Gli angoli sono deliberatamente "sporchi" (es: 165 invece di 180) per dare un look asimmetrico 
  e prevenire il clipping (z-fighting) dei poligoni sovrapposti.
*/
const PANELS = [
  { id: 0, pos: '0% 0%',    origin: '100% 100%', rx: -160, ry: 165 },
  { id: 1, pos: '50% 0%',   origin: '50% 100%',  rx: -170, ry: 5 },
  { id: 2, pos: '100% 0%',  origin: '0% 100%',   rx: -165, ry: -160 },
  { id: 3, pos: '0% 50%',   origin: '100% 50%',  rx: -5,   ry: 170 },
  { id: 4, pos: '50% 50%',  origin: '50% 50%',   rx: 0,    ry: 0 },
  { id: 5, pos: '100% 50%', origin: '0% 50%',    rx: 5,    ry: -175 },
  { id: 6, pos: '0% 100%',  origin: '100% 0%',   rx: 160,  ry: 175 },
  { id: 7, pos: '50% 100%', origin: '50% 0%',    rx: 175,  ry: -5 },
  { id: 8, pos: '100% 100%',origin: '0% 0%',     rx: 165,  ry: -170 },
];

/**
 * CrumpledPaperPanel — Nuovo approccio 3D Tattile
 * 
 * L'immagine e la texture sono matematicamente FUSE insieme (tramite CSS multiple backgrounds 
 * e blend-mode `multiply`). L'immagine viene tagliata in 9 pannelli 3D indipendenti che si piegano.
 * Questo assicura che immagine e texture si muovano come una singola entità fisica perfetta, 
 * risolvendo il problema dei "due tempi di animazione".
 */
export function CrumpledPaperPanel({ artworkImage, alt, onClick, side }: CrumpledPaperPanelProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const spotlightRef = React.useRef<HTMLDivElement>(null)
  
  // Randomizzatore per le 3 palline iniziali (SSR-safe: valore deterministico al primo render,
  // randomizzazione solo dopo il mount per evitare hydration mismatch)
  const [randomBall, setRandomBall] = useState('paper_ball.png')

  React.useEffect(() => {
    const num = Math.floor(Math.random() * 3) + 1;
    setRandomBall(num === 1 ? 'paper_ball.png' : `paper_ball_${num}.png`);
  }, [])

  if (!artworkImage) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/ui/artwork-scene-bg.jpeg)',
          transform: side === 'left' ? 'scaleX(-1)' : 'none',
          filter: 'brightness(1.5)'
        }}
      />
    )
  }

  // Easing tattile a molla per lo snap di apertura
  const springTransition = {
    type: 'spring',
    damping: 18,
    stiffness: 90,
    mass: 0.9
  } as const;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    // Aggiornamento diretto del DOM per evitare re-render Framer Motion sul background
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 
        `radial-gradient(circle at ${x}% ${y}%, rgba(80, 230, 120, 0.18) 0%, rgba(80, 230, 120, 0.07) 35%, transparent 65%)`;
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-pointer flex items-center justify-center"
      style={{ perspective: '1400px' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 50, y: 50 })
        if (spotlightRef.current) {
          spotlightRef.current.style.background = 'transparent';
        }
      }}
      onMouseMove={handleMouseMove}
    >
      {/* SFONDO DEL BANNER (SPECCHIATO SE A SINISTRA) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: 'url(/images/ui/artwork-scene-bg.jpeg)',
          transform: side === 'left' ? 'scaleX(-1)' : 'none',
          filter: 'brightness(1.5)'
        }}
      />

      {/* ── GRIGLIA 3x3 3D (L'OPERA CHE SI SROTOLA) ── */}
      <motion.div
        className="relative w-full h-full grid grid-cols-3 grid-rows-3"
        initial={false}
        animate={{
          scaleX: isHovered ? 0.88 : 0.45,
          scaleY: isHovered ? 0.86 : 0.45,
          rotateZ: isHovered ? 0 : (side === 'left' ? -25 : 25),
          rotateX: isHovered ? (50 - mousePos.y) / 3 : 0,
          rotateY: isHovered ? (mousePos.x - 50) / 3 : 0,
        }}
        transition={springTransition}
        style={{ 
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          clipPath: 'polygon(1% 2%, 10% 0%, 20% 1%, 30% 0%, 40% 2%, 50% 0%, 60% 1%, 70% 0%, 85% 2%, 98% 1%, 99% 15%, 98% 30%, 100% 45%, 98% 60%, 99% 75%, 98% 90%, 98% 98%, 85% 97%, 70% 99%, 50% 98%, 35% 99%, 20% 97%, 10% 99%, 2% 98%, 0% 85%, 2% 70%, 1% 50%, 2% 30%, 0% 15%)'
        }}
      >
        {PANELS.map((panel) => (
          <motion.div
            key={panel.id}
            className="relative w-full h-full"
            initial={false}
            animate={{
              rotateX: isHovered ? 0 : panel.rx,
              rotateY: isHovered ? 0 : panel.ry,
              opacity: isHovered ? 1 : 0,
              // Ombra interna sulle pieghe quando è chiuso, via via che si apre svanisce
              boxShadow: isHovered 
                ? 'inset 0 0 0px rgba(0,0,0,0)' 
                : 'inset 0 0 30px rgba(0,0,0,0.85)'
            }}
            transition={springTransition}
            style={{
              transformOrigin: panel.origin,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              backgroundImage: `url(/images/ui/crumpled_paper_texture.png), url(/images/ui/crumpled_paper_texture.png), url("${artworkImage}")`,
              backgroundSize: '300% 300%, 300% 300%, 300% 300%',
              backgroundPosition: `${panel.pos}, ${panel.pos}, ${panel.pos}`,
              backgroundBlendMode: 'multiply, multiply, normal',
              backgroundColor: '#ffffff',
              filter: 'saturate(1.05) contrast(1.02)'
            }}
          >
            {/* LAYER SCREEN PER I RIFLESSI DELLA CARTA ACCARTOCCIATA */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(/images/ui/crumpled_paper_texture.png)`,
                backgroundSize: '300% 300%',
                backgroundPosition: panel.pos,
                mixBlendMode: 'screen',
                opacity: 0.4
              }}
            />
          </motion.div>
        ))}
        
        {/* LUCE VERDE DINAMICA — aggiornata direttamente via ref, zero re-render */}
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-20"
          style={{ 
            mixBlendMode: 'screen',
            transition: 'opacity 0.6s ease',
            opacity: isHovered ? 1 : 0
          }}
        />
        
        {/* VIGNETTE AI BORDI */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ ...springTransition }}
          style={{ boxShadow: 'inset 0 0 80px 15px rgba(0, 10, 3, 0.65)' }}
        />
      </motion.div>

      {/* ── LA PALLA DI CARTA FOTOGRAFICA (STATO IDLE) ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        initial={false}
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 1.3 : 0.45,
          rotate: isHovered ? 0 : (side === 'left' ? -15 : 15)
        }}
        transition={{
          opacity: { duration: 0.25, ease: 'easeOut' },
          scale: springTransition,
          rotate: springTransition
        }}
      >
        <div className="relative w-[130%] h-[130%]">
          <Image
            src={`/images/ui/${randomBall}`}
            alt="Opera accartocciata"
            fill
            className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)]"
            unoptimized
            priority
          />
        </div>
      </motion.div>
      
      {/* ── FRECCIA HINT ── */}
      <motion.div
        className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20"
        initial={false}
        animate={{ opacity: isHovered ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/images/ui/direction-arrow-pink.webp"
            alt={side === 'left' ? 'Precedente' : 'Successiva'}
            width={40}
            height={40}
            className={`object-contain drop-shadow-[0_0_14px_rgba(0,0,0,1)] ${side === 'left' ? 'rotate-180' : ''}`}
            unoptimized
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
