import React from 'react'
import { fetchArtworkByNid } from '@/app/(frontend)/home/actions'
import { notFound } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { AcidAudioPlayer } from '@/components/audio/AcidAudioPlayer'
import Link from 'next/link'

export default async function ArtworkDetailPage({ params }: { params: { nid: string } }) {
  const artwork = await fetchArtworkByNid(params.nid)

  if (!artwork) {
    return notFound()
  }

  return (
    <main className="relative w-full min-h-screen bg-[#151515] text-white overflow-hidden flex flex-col items-center">
      {/* BACKGROUND CONTINUITY */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 brightness-50 pointer-events-none"
      />

      {/* ── HEADER / NAV ── */}
      <div className="absolute top-[4vh] left-1/2 -translate-x-1/2 w-[25vh] h-[25vh] z-[300]">
        <EyeScene targetRoute="/home" showCircularText={false} globalTracking={true} />
      </div>

      {/* BACK BUTTON (STYLE X) */}
      <Link 
        href="/home"
        className="fixed top-10 right-10 z-[60] w-12 h-12 flex items-center justify-center border border-[#768b1a] text-[#768b1a] rounded-full hover:bg-[#768b1a] hover:text-black transition-all duration-300"
      >
        <span className="text-2xl font-bold leading-none">✕</span>
      </Link>

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-10 w-full max-w-7xl px-8 pt-[35vh] pb-32 flex flex-col md:flex-row gap-12 items-start justify-center">
        
        {/* LEFT COLUMN: VISUAL */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="group relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black">
             <img 
               src={artwork.image} 
               alt={artwork.title}
               className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-[#F45390]/30 rounded-full">
                <span className="font-neo text-[#F45390] text-[10px] tracking-widest uppercase">
                  N.ID: {artwork.nid}
                </span>
             </div>
          </div>
          
          {/* Detail Gallery Mockup (se presente) */}
          {artwork.gallery && artwork.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
               {artwork.gallery.map((img, i) => (
                 <div key={i} className="aspect-square border border-white/5 overflow-hidden group">
                    <img src={img} alt="Detail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INFO */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-neo text-5xl md:text-7xl tracking-tighter uppercase leading-none">
              {artwork.title}
            </h1>
            <div className="h-1 w-32 bg-[#F45390] shadow-[0_0_15px_#F45390]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
            <div className="flex flex-col">
              <span className="font-neo text-[#768b1a] text-[10px] tracking-[0.3em] uppercase mb-1">Tecnica</span>
              <p className="font-neo text-sm tracking-widest uppercase">{artwork.method}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-neo text-[#768b1a] text-[10px] tracking-[0.3em] uppercase mb-1">Supporto</span>
              <p className="font-neo text-sm tracking-widest uppercase">{artwork.support}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-neo text-[#768b1a] text-[10px] tracking-[0.3em] uppercase mb-1">Dimensioni</span>
              <p className="font-neo text-sm tracking-widest uppercase">{artwork.dimensions}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-neo text-[#768b1a] text-[10px] tracking-[0.3em] uppercase mb-1">Anno</span>
              <p className="font-neo text-sm tracking-widest uppercase">{artwork.year}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 w-full">
            <div className="bg-white/5 border-l-2 border-[#F45390] p-4">
              <p className="font-neo text-[10px] tracking-widest text-gray-400 uppercase mb-2">Stato Acquisizione</p>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${artwork.availability === 'comprabile' ? 'bg-[#768b1a] shadow-[0_0_10px_#768b1a]' : 'bg-gray-600'}`} />
                <span className="font-neo text-lg tracking-widest uppercase">
                  {artwork.availability === 'comprabile' ? 'Opera Acquistabile' : 'Archivio Privato'}
                </span>
              </div>
            </div>
            
            <button className="w-full py-4 border border-[#F45390] font-neo text-[#F45390] tracking-[0.5em] uppercase hover:bg-[#F45390] hover:text-black transition-all duration-500">
              Richiedi Informazioni
            </button>
          </div>
        </div>
      </div>

      {/* AUDIO PLAYER (Se URL presente) */}
      {artwork.audioSnippetUrl && (
        <AcidAudioPlayer url={artwork.audioSnippetUrl} title={artwork.title} />
      )}
      
      {/* Glitch sub-footer */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none opacity-20">
         <p className="font-neo text-[8px] tracking-[0.8em] uppercase">SYSTEM.ART_UNIT // 00{artwork.nid}</p>
      </div>
    </main>
  )
}
