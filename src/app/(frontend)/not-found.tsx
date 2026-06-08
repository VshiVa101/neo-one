'use client'

import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import SpaceInvadersGame from '@/components/game/SpaceInvadersGame'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 pt-20">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-neo font-bold text-[#F45390] drop-shadow-[0_0_15px_rgba(244,83,144,0.5)]">404</h1>
        <p className="mt-4 text-xl text-white/80">Pagina non trovata! Ma puoi giocare a Space Invaders nel frattempo.</p>
        <div className="mt-6">
          <Button asChild variant="default" className="bg-[#809829] hover:bg-[#9CB042] text-black font-bold">
            <Link href="/">Torna alla Home</Link>
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-4xl h-[60vh] relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <SpaceInvadersGame onTransitionTriggered={() => {}} />
      </div>
    </div>
  )
}
