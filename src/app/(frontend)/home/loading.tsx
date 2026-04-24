import { MiniMatrixLoader } from '@/components/MiniMatrixLoader'

export default function LoadingHome() {
  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden">
      <MiniMatrixLoader />
    </main>
  )
}
