export const dynamic = 'force-dynamic'
import { ClusterLayout, ClusterData } from '@/components/home/ClusterLayout'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Helper function per estrarre l'URL in modo sicuro (Cloudinary focus)
const getImageUrl = (media: any, defaultUrl: string) => {
  let imageUrl = defaultUrl
  if (media && typeof media === 'object') {
    if (media.thumbnailURL && typeof media.thumbnailURL === 'string') {
      imageUrl = media.thumbnailURL.replace(/\/upload\/[^\/]+\//, '/upload/f_auto,q_auto/')
    } else if (media.url) {
      imageUrl = media.url
      if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
        if (!imageUrl.includes('api/media')) {
          imageUrl = '/api/media/file/' + imageUrl
        } else {
          imageUrl = '/' + imageUrl
        }
      }
    } else if (media.filename) {
      imageUrl = '/api/media/file/' + media.filename
    }
  }
  return imageUrl
}

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
      titleColor: doc.primaryColor || '#768b1a',
      descColor: doc.secondaryColor || '#fc5896',
    }
  })

  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-[#151515] overflow-hidden">
      {/* Background GIF - Desktop first */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Home Background"
        className="absolute inset-0 w-screen h-screen object-cover z-0 opacity-40 brightness-75 scale-100 md:scale-105"
      />
      {mappedClusters.length >= 2 ? (
        <ClusterLayout key={Date.now()} clusters={mappedClusters} />
      ) : (
        <div className="z-10 text-white font-neo tracking-widest">CARICAMENTO CLUSTER IN CORSO...</div>
      )}
    </main>
  )
}
