import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion' // Note: This will need a Client Component wrapper if used in a Server Component directly, but I'll keep it simple first
import { EyeScene } from '@/components/EyeScene'

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
      category: {
        equals: subcluster.id,
      },
    },
    limit: 50,
  })

  const artworks = artworksRes.docs

  return (
    <main className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Occhio Ridotto in alto a destra come navigazione */}
      <div className="absolute top-4 right-4 w-24 h-24 z-50">
        <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
      </div>

      <div className="max-w-7xl mx-auto px-[5vw] pt-[15vh] pb-[10vh]">
        {/* Header Sottocluster */}
        <div className="mb-[8vh]">
          <h1 className="text-[5vw] font-neo tracking-widest leading-none text-[#768b1a] uppercase">
            {subcluster.title}
          </h1>
          {subcluster.description && (
            <p className="mt-4 text-[1.2vw] font-neo text-[#fc5896] max-w-2xl uppercase leading-relaxed">
              {subcluster.description}
            </p>
          )}
        </div>

        {/* Griglia Opere */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4vw]">
          {artworks.map((art) => (
            <div key={art.id} className="group cursor-pointer">
              <div className="aspect-square w-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 bg-[#111]">
                <img
                   // @ts-ignore - Assuming Media is populated
                  src={typeof art.mainImage !== 'string' ? art.mainImage?.url : ''}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="text-[1.5vw] font-neo text-white">{art.title}</h3>
                  <p className="text-[0.8vw] font-mono text-[#a0a0a0]">{art.nid}</p>
                </div>
                <div className="text-right">
                  <p className="text-[1vw] font-neo text-[#768b1a]">{art.price}€</p>
                  <p className={`text-[0.6vw] uppercase px-2 py-1 rounded inline-block mt-1 ${
                    art.status === 'available' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {art.status}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {artworks.length === 0 && (
            <p className="col-span-full text-center text-white/30 font-neo text-xl py-20 uppercase tracking-widest">
              Nessuna opera trovata in questo sottogruppo.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
