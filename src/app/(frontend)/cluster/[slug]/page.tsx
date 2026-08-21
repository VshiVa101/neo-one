import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'
import Link from 'next/link'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function SubclusterPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // 1. Recupera il Sottogruppo (Category) tramite slug
  const categoryRes = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const subcluster = categoryRes.docs[0]

  if (!subcluster) {
    return notFound()
  }

  // 2. Recupera le opere (Artworks) associate a questo sottogruppo
  const artworksRes = await payload.find({
    collection: 'artworks',
    where: {
      subcluster: {
        equals: subcluster.id,
      },
    },
    limit: 50,
  })

  const artworks = artworksRes.docs

  return (
    <main className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Occhio Ridotto in alto a destra come navigazione */}
      <div className="absolute top-4 right-4 w-20 h-20 sm:w-24 sm:h-24 z-50">
        <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[5vw] pt-[12vh] sm:pt-[15vh] pb-[10vh]">
        {/* Header Sottocluster */}
        <div className="mb-10 sm:mb-[8vh]">
          <h1 className="text-3xl sm:text-4xl lg:text-[5vw] font-neo tracking-widest leading-none text-white uppercase">
            <BrandedTitle text={subcluster.title} />
          </h1>
          {subcluster.mood && (
            <p className="mt-4 text-sm sm:text-base lg:text-[1.2vw] font-neo text-[#fc5896] max-w-2xl uppercase leading-relaxed">
              {subcluster.mood}
            </p>
          )}
        </div>

        {/* Griglia Opere */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-[4vw]">
          {artworks.map((art) => (
            <Link
              key={art.id}
              href={`/artwork/${encodeURIComponent(String(art.nid))}`}
              className="group cursor-pointer"
            >
              <div className="aspect-square w-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 bg-[#111] relative">
                <Image
                  // @ts-ignore - Assuming Media is populated
                  src={typeof art.mainImage !== 'string' ? (art.mainImage as any)?.url || '/images/drops/placeholder.png' : art.mainImage}
                  alt={art.title ?? ''}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="mt-3 sm:mt-4 flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-neo text-white truncate">{art.title}</h3>
                  <p className="text-xs sm:text-sm font-mono text-[#a0a0a0] mt-0.5">{art.nid}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-base font-neo text-[#768b1a]">{art.priceInfo ?? ''}</p>
                  <p
                    className={`text-[10px] sm:text-xs uppercase px-2 py-0.5 rounded inline-block mt-1 ${
                      art.availability === 'comprabile'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {art.availability === 'comprabile'
                      ? 'Disponibile'
                      : art.availability === 'ordinabile'
                        ? 'Ordinabile'
                        : 'Non disponibile'}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {artworks.length === 0 && (
            <p className="col-span-full text-center text-white/30 font-neo text-lg sm:text-xl py-20 uppercase tracking-widest">
              Nessuna opera trovata in questo sottogruppo.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
