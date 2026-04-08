'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'

export default function HeroClient() {
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Controllo se l'utente ha già visitato il sito
    const hasVisited = localStorage.getItem('neo-one-visited')

    if (hasVisited) {
      // Se già visitato, reindirizza subito alla home
      router.push('/home')
    } else {
      // Altrimenti, segna come visitato e mostra la Hero
      localStorage.setItem('neo-one-visited', 'true')
      setShouldRender(true)
    }
  }, [router])

  // Mentre controlliamo il localStorage, non renderizziamo nulla (schermo nero)
  if (!shouldRender) {
    return <div className="w-full h-screen bg-black" />
  }

  return (
    <main className="w-full h-screen relative bg-black overflow-hidden flex flex-col items-center justify-center m-0 p-0 text-white">
      {/* Background GIF */}
      <img
        src="/images/drops/bg-herosection.gif"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
      />
      
      {/* The 3D Scene - con testo circolare solo qui nella Hero */}
      <div className="fixed inset-0 z-10 w-full h-screen">
        <EyeScene targetRoute="/home" showCircularText={true} />
      </div>
    </main>
  )
}
