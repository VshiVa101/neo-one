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

  const numericNidMatch = artwork.nid.match(/\d+/)
  const numericNid = numericNidMatch ? parseInt(numericNidMatch[0], 10) : artwork.nid

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col justify-between pt-[2vh]">
      
      {/* ── AREA TOP: Occhio e NID in alto, sfondo nero globale trasparisce ── */}
      <div className="flex flex-col items-center flex-shrink-0 z-[500]">
        <div className="relative w-[7vh] h-[7vh] mb-2">
          <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
        </div>
        <span
          className="font-neo text-3xl tracking-widest font-bold leading-none text-[#768b1a] drop-shadow-[0_0_10px_rgba(118,139,26,0.6)]"
        >
          {numericNid}
        </span>
      </div>

      {/* ── AREA CENTRALE + PANNELLI LATERALI (Gestita dal Client per flex row) ── */}
      <div className="flex-1 w-full flex items-center justify-center p-4 min-h-0 z-10">
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
      </div>

      {/* ── AUDIO PLAYER (solo se URL presente) ── */}
      {artwork.audioSnippetUrl && (
        <AcidAudioPlayer url={artwork.audioSnippetUrl} title={`OPERA ${artwork.nid}`} />
      )}

      {/* ── GLITCH WATERMARK ── */}
      <div className="absolute bottom-[20vh] left-4 z-0 pointer-events-none opacity-20">
        <p className="font-neo text-[7px] tracking-[0.8em] uppercase text-white">
          SYSTEM.ART_UNIT // 00{numericNid}
        </p>
      </div>
    </main>
  )
}
