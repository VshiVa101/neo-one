import { EyeScene } from '@/components/EyeScene'

export const metadata = {
  title: 'Neo-One | Uncensored Art Hub',
  description: 'The uncensored hub of Neo-One art and drops.',
}

export default function HeroPage() {
  return (
    <main className="w-full h-screen relative bg-black overflow-hidden flex flex-col items-center justify-center m-0 p-0 text-white">
      {/* Background GIF */}
      <img
        src="/images/drops/bg-herosection.gif"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
      />
      
      {/* The 3D Scene */}
      <EyeScene />
    </main>
  )
}
