'use client'

import React from 'react'
import SpaceInvadersGame from '@/components/game/SpaceInvadersGame'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black px-4 pt-20">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-neo font-bold text-[#809829] drop-shadow-[0_0_15px_rgba(128,152,41,0.5)]">SEI OFFLINE</h1>
        <p className="mt-4 text-lg text-white/80 max-w-lg mx-auto">
          La rete si è disconnessa. Non preoccuparti, i tuoi dati sono salvi. Nel frattempo, difendi la rete di Neo-One!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-[#F45390] hover:bg-[#FF82B2] text-white font-bold rounded-full transition-colors"
        >
          Riprova a Connetterti
        </button>
      </div>
      
      <div className="w-full max-w-4xl h-[65vh] relative rounded-xl overflow-hidden border border-[#809829]/30 shadow-2xl">
        <SpaceInvadersGame onTransitionTriggered={() => {}} />
      </div>
    </div>
  )
}
