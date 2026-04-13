import React from 'react'
import { fetchArtworkByNid, fetchAdjacentArtworks } from '@/app/(frontend)/home/actions'
import { notFound } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { AcidAudioPlayer } from '@/components/audio/AcidAudioPlayer'
import { ArtworkDetailClient } from './ArtworkDetailClient'

export const dynamic = 'force-dynamic'

export default async function ArtworkDetailPage({ params }: { params: { nid: string } }) {
  const artwork = await fetchArtworkByNid(params.nid)

  if (!artwork) return notFound()

  const { prevNid, nextNid } = await fetchAdjacentArtworks(params.nid, artwork.subclusterId ?? null)

  return (
    <main className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">

      {/* ── BACKGROUND ── */}
      <img
        src="/images/ui/web-bg.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 brightness-50 pointer-events-none"
      />

      {/* ── OCCHIO (minimizzato, top center, z-500) ── */}
      <div className="fixed top-[2vh] left-1/2 -translate-x-1/2 w-[12vh] h-[12vh] z-[500]">
        <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
      </div>

      {/* ── NID (numero ID opera, verde, sotto l'occhio) ── */}
      <div className="fixed top-[16vh] left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
        <span
          className="font-neo text-4xl tracking-widest font-bold leading-none"
          style={{ color: '#768b1a', textShadow: '0 0 20px #768b1a' }}
        >
          {artwork.nid}
        </span>
      </div>

      {/* ── OPERA CENTRALE (massima grandezza, nessun ritaglio) ── */}
      <div className="relative z-10 flex items-center justify-center w-[56vw] h-[72vh]">
        <img
          src={artwork.image}
          alt={`Opera ${artwork.nid}`}
          className="max-w-full max-h-full object-contain"
          style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.8))' }}
        />
      </div>

      {/* ── PANNELLI LATERALI + NAVIGAZIONE + BOTTOM BAR (Client) ── */}
      <ArtworkDetailClient
        nid={String(artwork.nid)}
        title={artwork.title}
        image={artwork.image}
        method={artwork.method}
        support={artwork.support}
        dimensions={artwork.dimensions}
        year={String(artwork.year)}
        availability={artwork.availability ?? null}
        priceInfo={artwork.priceInfo}
        prevNid={prevNid}
        nextNid={nextNid}
      />

      {/* ── AUDIO PLAYER (solo se URL presente) ── */}
      {artwork.audioSnippetUrl && (
        <AcidAudioPlayer url={artwork.audioSnippetUrl} title={`OPERA ${artwork.nid}`} />
      )}

      {/* ── GLITCH WATERMARK ── */}
      <div className="fixed bottom-24 left-4 z-20 pointer-events-none opacity-15">
        <p className="font-neo text-[8px] tracking-[0.8em] uppercase text-white">
          SYSTEM.ART_UNIT // 00{artwork.nid}
        </p>
      </div>
    </main>
  )
}
