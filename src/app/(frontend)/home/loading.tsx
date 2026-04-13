export default function LoadingHome() {
  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Criptic Loading Text in absolute center */}
      <div className="z-20 flex flex-col items-center justify-center gap-4 animate-pulse">
        {/* Usiamo l'occhio crittato al neon come loading spinner statico o lampeggiante */}
        <h1 className="font-neo text-[#F45390] text-3xl tracking-widest uppercase opacity-80">
          Decrittazione Archivi Neo...
        </h1>
        <div className="w-[10vw] h-[2px] bg-gradient-to-r from-transparent via-[#768b1a] to-transparent animate-pulse" />
      </div>
    </main>
  )
}
