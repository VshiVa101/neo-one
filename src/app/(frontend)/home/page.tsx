export const dynamic = 'force-dynamic'
import { ClusterLayout, ClusterData } from '@/components/home/ClusterLayout'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Suspense } from 'react'
import { getImageUrl } from '@/utilities/getMediaUrl'
import { MiniMatrixLoader } from '@/components/MiniMatrixLoader'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch VELOCE E LEGGERO: Prendiamo tutti i cluster
  const { docs: allClusters } = await payload.find({
    collection: 'clusters',
    sort: 'sortOrder',
    limit: 100, 
  })

  // Filtriamo via i cluster di test/dummy RIGIDAMENTE (Leo's Order)
  const clusters = allClusters.filter(c => {
    const s = c.slug?.toLowerCase() || ''
    const t = c.title?.toLowerCase() || ''
    return !s.includes('test') && !s.includes('exceed') && !t.includes('tester') && !t.includes('dummy')
  })

  // LOGICA DI ORDINAMENTO MANUALE DEFINITIVA: 
  const sortedClusters = [...clusters].sort((a, b) => {
    const getPriority = (c: any) => {
      const slug = c.slug?.toLowerCase() || ''
      const title = c.title?.toLowerCase() || ''
      if (slug === 'neon' || title === 'neon') return 100
      if (slug === 'b-n' || slug.includes('bianco') || slug.includes('bn') || title.includes('b/n') || title.includes('bianco') || title.includes('mix')) return 90
      return 0
    }
    return getPriority(b) - getPriority(a)
  })

  // Assembling ultraleggero
  const mappedClusters: ClusterData[] = sortedClusters.map((doc) => {
    return {
      id: doc.id.toString(),
      title: doc.title,
      slug: doc.slug,
      desc: doc.manifesto,
      image: getImageUrl(doc.coverImage, '/images/drops/BN-cluster.png'),
      titleColor: doc.primaryColor || '#809829',
      descColor: doc.secondaryColor || '#fc5896',
    }
  })

  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-[#151515]">
      {/* Background Video */}
      <div className="absolute inset-0 w-screen h-screen z-0 opacity-80 brightness-100 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/drops/neoOne.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      {mappedClusters.length >= 2 ? (
        <Suspense fallback={<MiniMatrixLoader />}>
          <ClusterLayout clusters={mappedClusters} />
        </Suspense>
      ) : (
        <MiniMatrixLoader />
      )}
    </main>
  )
}

