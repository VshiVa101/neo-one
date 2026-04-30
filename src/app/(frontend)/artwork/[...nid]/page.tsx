import React from 'react'
import { fetchArtworkByNid, fetchAdjacentArtworks } from '@/app/(frontend)/home/actions'
import { notFound } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { ArtworkDetailClient } from './ArtworkDetailClient'

export const dynamic = 'force-dynamic'

export default async function ArtworkDetailPage(props: { params: Promise<{ nid: string[] }> }) {
  const params = await props.params
  const nidString = Array.isArray(params.nid) ? params.nid.join('/') : params.nid
  const artwork = await fetchArtworkByNid(nidString)

  if (!artwork) return notFound()

  const { prevNid, nextNid, currentIndex } = await fetchAdjacentArtworks(
    nidString,
    artwork.subclusterId ?? null,
  )

  const progressiveNumber = currentIndex !== null ? String(currentIndex + 1) : ''
  const displayTitle = artwork.title ? artwork.title : progressiveNumber

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col justify-between pt-[6vh] md:pt-[4vh] bg-[#151515]">
      {/* Background GIF - Desktop first */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Background"
        className="absolute inset-0 w-screen h-screen object-cover z-0 opacity-40 brightness-75 scale-100 md:scale-105 pointer-events-none"
      />

      {/* ── AREA TOP: Occhio e NID in alto, sfondo nero globale trasparisce ── */}
      <div className="flex flex-col items-center flex-shrink-0 z-[500] relative">
        <div className="relative w-[14vh] h-[14vh] lg:w-[18vh] lg:h-[18vh] mb-1 drop-shadow-[0_0_20px_rgba(118,139,26,0.3)]">
          <EyeScene
            targetRoute={artwork.clusterId && artwork.deckIndex !== null 
              ? `/home?cluster=${artwork.clusterId}&deck=${artwork.deckIndex}` 
              : '/home'}
            showCircularText={false}
            globalTracking={true}
            scaleMultiplier={1.3}
          />
        </div>
        <span className="font-neo text-2xl lg:text-3xl tracking-widest font-bold leading-none text-[#768b1a] drop-shadow-[0_0_10px_rgba(118,139,26,0.6)]">
          {displayTitle}
        </span>
      </div>

      {/* ── AREA CENTRALE + PANNELLI LATERALI (Gestita dal Client per flex row) ── */}
      <div className="flex-1 w-full flex items-center justify-center p-1 lg:p-4 min-h-0 z-10">
        <ArtworkDetailClient
          nid={String(artwork.nid)}
          title={displayTitle}
          image={artwork.image}
          method={artwork.method}
          support={artwork.support}
          dimensions={artwork.dimensions}
          year={String(artwork.year)}
          availability={artwork.availability ?? null}
          priceInfo={artwork.priceInfo}
          prevNid={prevNid}
          nextNid={nextNid}
          clusterId={artwork.clusterId}
          clusterSlug={artwork.clusterSlug}
          deckIndex={artwork.deckIndex}
          audioSnippetUrl={artwork.audioSnippetUrl}
          fullAudioUrl={artwork.fullAudioUrl}
        />
      </div>

    </main>
  )
}
