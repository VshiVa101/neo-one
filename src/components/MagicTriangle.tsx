'use client'

import React, { useState, useEffect } from 'react'

const READINGS = [
  { start: 'N', word: 'NEO', color: '#A2D729', desc: "l'inizio, il nuovo, il futuro." }, // Brighter brand green
  { start: 'E', word: 'EON', color: '#E295A4', desc: "il tempo, il ciclo, l'eterno che ritorna." }, // Brighter soft rose pink
  { start: 'O', word: 'ONE', color: '#FF5696', desc: "l'uno, l'io, l'ognuno." }, // Brighter brand hot pink
]

const CX = 200
const CY = 185
const R = 115

function vertexPos(index: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / 3
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) }
}

const VERTICES = [
  { label: 'E', ...vertexPos(0) },
  { label: 'O', ...vertexPos(1) },
  { label: 'N', ...vertexPos(2) },
]

function getReadingIndices(startLabel: string) {
  const order = ['E', 'O', 'N']
  const si = order.indexOf(startLabel)
  return [si, (si + 1) % 3, (si + 2) % 3]
}

function ArrowAlong({
  from,
  to,
  color,
  progress = 1,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  color: string
  progress?: number
}) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len
  const uy = dy / len
  const pad = 28
  const x1 = from.x + ux * pad
  const y1 = from.y + uy * pad
  const x2 = to.x - ux * pad
  const y2 = to.y - uy * pad
  const px = x1 + progress * (x2 - x1)
  const py = y1 + progress * (y2 - y1)
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={px}
        y2={py}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {progress > 0.85 && (
        <polygon
          points="0,-5 4,4 -4,4"
          transform={`translate(${px},${py}) rotate(${(Math.atan2(uy, ux) * 180) / Math.PI + 90})`}
          fill={color}
          opacity="0.9"
        />
      )}
    </g>
  )
}

export const MagicTriangle = ({ variant = 'interactive' }: { variant?: 'interactive' | 'small-static' }) => {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(1)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || variant === 'small-static') return
    const id = setInterval(() => {
      setActive((p) => (p + 1) % 3)
      setProgress(0)
    }, 2800)
    return () => clearInterval(id)
  }, [autoPlay, variant])

  useEffect(() => {
    if (progress >= 1 || variant === 'small-static') return
    let raf: number
    const animate = () => {
      setProgress((p) => {
        const next = p + 0.04
        if (next >= 1) return 1
        raf = requestAnimationFrame(animate)
        return next
      })
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [progress, variant])

  if (variant === 'small-static') {
    return (
      <div className="flex justify-center items-center w-full mt-8 transition-opacity duration-500">
        <svg width="60" height="60" viewBox="0 0 400 360" className="overflow-visible">
          {/* White triangle lines with gap */}
          {[[0, 1], [1, 2], [2, 0]].map(([a, b], i) => {
            const gap = 65
            const dx = VERTICES[b].x - VERTICES[a].x
            const dy = VERTICES[b].y - VERTICES[a].y
            const len = Math.sqrt(dx * dx + dy * dy)
            const ux = dx / len
            const uy = dy / len
            return (
              <line
                key={i}
                x1={VERTICES[a].x + gap * ux}
                y1={VERTICES[a].y + gap * uy}
                x2={VERTICES[b].x - gap * ux}
                y2={VERTICES[b].y - gap * uy}
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.8"
              />
            )
          })}
          {/* Letters */}
          {VERTICES.map((v) => {
            const col = READINGS.find((r) => r.start === v.label)?.color || '#fff'
            return (
              <text
                key={v.label}
                x={v.x}
                y={v.y + 32}
                textAnchor="middle"
                fontSize="90"
                className="font-neo"
                fill={col}
              >
                {v.label}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  const reading = READINGS[active]
  const indices = getReadingIndices(reading.start)
  const edgePairs = [
    [indices[0], indices[1]],
    [indices[1], indices[2]],
    [indices[2], indices[0]],
  ]

  function handleVertex(label: string) {
    setAutoPlay(false)
    const idx = READINGS.findIndex((r) => r.start === label)
    if (idx !== active) {
      setActive(idx)
      setProgress(0)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center font-neo text-white select-none relative w-full overflow-visible">
      {/* SVG Triangle */}
      <svg
        width="400"
        height="360"
        viewBox="0 0 400 360"
        className="max-w-full h-auto overflow-visible"
      >
        <defs>
          <filter id="glow-magic">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softglow-magic">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points={VERTICES.map((v) => `${v.x},${v.y}`).join(' ')}
          fill={reading.color + '0a'}
          stroke={reading.color + '25'}
          strokeWidth="1"
          style={{ transition: 'fill 0.8s, stroke 0.8s' }}
        />

        {[[0, 1], [1, 2], [2, 0]].map(([a, b], i) => (
          <line
            key={i}
            x1={VERTICES[a].x}
            y1={VERTICES[a].y}
            x2={VERTICES[b].x}
            y2={VERTICES[b].y}
            stroke="#ffffff20"
            strokeWidth="1"
          />
        ))}

        {edgePairs.map(([a, b], i) => {
          const ep = Math.max(0, Math.min(1, (progress - i * 0.28) / 0.44))
          return (
            <ArrowAlong
              key={`${active}-${i}`}
              from={VERTICES[a]}
              to={VERTICES[b]}
              color={reading.color}
              progress={ep}
            />
          )
        })}

        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          fontSize="38"
          className="font-neo tracking-widest italic"
          fill={reading.color}
          style={{ transition: 'fill 0.6s' }}
        >
          {reading.word}
        </text>
        <text
          x={CX}
          y={340}
          textAnchor="middle"
          fontSize="11"
          className="font-neo tracking-widest uppercase opacity-70"
          fill={reading.color}
          style={{ transition: 'fill 0.6s' }}
        >
          {reading.desc}
        </text>

        {VERTICES.map((v) => {
          const isActive = reading.start === v.label
          const col = READINGS.find((r) => r.start === v.label)?.color || '#fff'
          return (
            <g
              key={v.label}
              onClick={() => handleVertex(v.label)}
              style={{ cursor: 'pointer' }}
            >
              {isActive && (
                <circle
                  cx={v.x}
                  cy={v.y}
                  r="26"
                  fill="none"
                  stroke={col}
                  strokeWidth="1"
                  opacity="0.5"
                  filter="url(#glow-magic)"
                />
              )}
              <circle
                cx={v.x}
                cy={v.y}
                r="18"
                fill={isActive ? col + '1a' : '#111'}
                stroke={isActive ? col : '#252525'}
                strokeWidth={isActive ? '1.5' : '1'}
                style={{ transition: 'all 0.4s' }}
              />
              <text
                x={v.x}
                y={v.y + 6}
                textAnchor="middle"
                fontSize="18"
                className="font-neo"
                fill={isActive ? col : '#383838'}
                filter={isActive ? 'url(#glow-magic)' : 'none'}
                style={{ transition: 'fill 0.4s' }}
              >
                {v.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Interactive buttons below the triangle */}
      <div className="flex gap-6 lg:gap-10 mt-4 items-center">
        {READINGS.map((r, i) => (
          <button
            key={r.word}
            onClick={() => {
              setAutoPlay(false)
              setActive(i)
              setProgress(0)
            }}
            className="flex flex-col items-center gap-1.5 focus:outline-none bg-transparent border-none cursor-pointer"
            style={{
              opacity: active === i ? 1 : 0.22,
              transition: 'opacity 0.4s',
            }}
          >
            <span
              className="font-neo italic text-xl lg:text-2xl tracking-[0.2em]"
              style={{
                color: r.color,
                textShadow: active === i ? `0 0 14px ${r.color}99` : 'none',
                transition: 'text-shadow 0.4s',
              }}
            >
              {r.word}
            </span>
            <span className="font-neo text-[9px] lg:text-[10px] text-white/50 tracking-[0.15em] uppercase">
              da {r.start}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
