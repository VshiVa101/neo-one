export const dynamic = 'force-dynamic'
import { ClusterLayout, ClusterData } from '@/components/home/ClusterLayout'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Suspense } from 'react'
import Image from 'next/image'

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
      if (slug.includes('bianco') || slug.includes('bn') || title.includes('bianco') || title.includes('mix')) return 90
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
      {/* Background GIF - Desktop first */}
      <div className="absolute inset-0 w-screen h-screen z-0 opacity-80 brightness-100">
        <Image
          src="/images/drops/bg-home.gif"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
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

