import { ClusterLayout } from '@/components/home/ClusterLayout'

export default function HomePage() {
  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-[#151515] overflow-hidden">
      {/* Background GIF - Desktop first, ben contenuto nel V.P. */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Home Background"
        className="absolute inset-0 w-screen h-screen object-cover z-0 opacity-40 brightness-75 scale-100 md:scale-105"
      />
      <ClusterLayout />
    </main>
  )
}
