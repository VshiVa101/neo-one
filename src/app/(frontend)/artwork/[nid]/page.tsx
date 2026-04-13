import React from 'react'
import { fetchArtworkByNid, fetchAdjacentArtworks } from '@/app/(frontend)/home/actions'
import { notFound } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { AcidAudioPlayer } from '@/components/audio/AcidAudioPlayer'
import { ArtworkDetailClient } from './ArtworkDetailClient'

export const dynamic = 'force-dynamic'

export default async function ArtworkDetailPage(props: { params: Promise<{ nid: string }> }) {
  const params = await props.params
  const artwork = await fetchArtworkByNid(params.nid)

  if (!artwork) return notFound()

  const { prevNid, nextNid } = await fetchAdjacentArtworks(params.nid, artwork.subclusterId ?? null)

  // Estrarre il numero dal NID (es: NEO-040 -> 40 o 040, preferiamo lo scarto del NEO-)
  const numericNidMatch = artwork.nid.match(/\d+/)
  const numericNid = numericNidMatch ? parseInt(numericNidMatch[0], 10) : artwork.nid

  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center justify-center">

      {/* ── BACKGROUND: Lasciamo trasparire quello globale della TransitionOverlay ── */}
      
      {/* ── AREA CENTRALE DELL'OPERA E TOP NAV ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center pt-[4vh]">
        {/* Occhio Minimizzato Top */}
        <div className="relative w-[8vh] h-[8vh] z-[500] mb-2">
          <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
        </div>
        
        {/* Numero ID Verde (Stile testuale acid) */}
        <span
          className="font-neo text-3xl tracking-widest font-bold leading-none mb-[4vh]"
          style={{ color: '#768b1a', textShadow: '0 0 10px rgba(118,139,26,0.6)' }}
        >
          {numericNid}
        </span>

        {/* Opera Centrale: Nessun ritaglio, box massimizzato e soft glow */}
        <div className="relative flex items-center justify-center w-[40vw] h-[65vh] bg-black rounded-lg p-2"
             style={{ boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
          <img
            src={artwork.image}
            alt={`Opera ${artwork.nid}`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* ── PANNELLI LATERALI + BOTTOM BAR (Client component gestisce Sidebars e Nav) ── */}
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

      {/* ── GLITCH WATERMARK (opzionale) ── */}
      <div className="fixed bottom-28 left-4 z-20 pointer-events-none opacity-20">
        <p className="font-neo text-[7px] tracking-[0.8em] uppercase text-white">
          SYSTEM.ART_UNIT // 00{numericNid}
        </p>
      </div>
    </main>
  )
}
