export default function HomePage() {
  return (
    <main className="w-full min-h-screen relative flex items-center justify-center bg-black overflow-hidden">
      {/* Background GIF - Desktop first, ben contenuto nel V.P. */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Home Background"
        className="absolute inset-0 w-screen h-screen object-cover z-0 opacity-50"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-neo tracking-widest text-white drop-shadow-xl uppercase">
          HOME
        </h1>
      </div>
    </main>
  )
}
