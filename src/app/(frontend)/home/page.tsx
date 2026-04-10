import { ClusterLayout, ClusterData, SubclusterData } from '@/components/home/ClusterLayout'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Helper function per estrarre l'URL in modo sicuro (Cloudinary focus)
const getImageUrl = (media: any, defaultUrl: string) => {
  let imageUrl = defaultUrl
  if (media && typeof media === 'object') {
    if (media.thumbnailURL && typeof media.thumbnailURL === 'string') {
      // Forza il bypass del crop per mostrare qualità cruda di cloudinary (per preview/homepage)
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
  
  // 1. Fetch Clusters
  const { docs: clusters } = await payload.find({
    collection: 'clusters',
    sort: 'sortOrder',
    limit: 100, 
  })

  // 2. Fetch Categories (Sottocluster / Mazzi)
  const { docs: allCategories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0 // Recupera solo ID del cluster padre
  })

  // 3. Fetch Artworks 
  const { docs: allArtworks } = await payload.find({
    collection: 'artworks',
    limit: 500, // Recuperiamo tutto l'arsenale per la navigazione fluida
    depth: 1    // depth 1 per recuperare i path del file Media in mainImage
  })

  // Assembling
  const mappedClusters: ClusterData[] = clusters.map((doc) => {
    
    // Trova i mazzi (sottocluster) appartenenti a questo Cluster
    const clusterCategories = allCategories.filter(cat => cat.cluster === doc.id)

    const subclusters: SubclusterData[] = clusterCategories.map(cat => {
      // Trova le opere collegate a questo mazzo
      const catArtworks = allArtworks.filter(art => {
        // depth: 1 rende art.subcluster un oggetto se esiste, o ID se stringa
        const artSubclusterId = typeof art.subcluster === 'object' && art.subcluster !== null 
                                ? art.subcluster.id 
                                : art.subcluster
        return artSubclusterId === cat.id
      })

      const mappedArtworks = catArtworks.map(art => {
        return {
          id: art.nid || art.id.toString(), // L'NID viene usato per la navigazione router (es. 'NEO-001')
          title: art.title || 'Senza Titolo',
          image: getImageUrl(art.mainImage, '/images/drops/placeholder.png')
        }
      })

      return {
        id: cat.id.toString(),
        title: cat.title,
        artworks: mappedArtworks
      }
    })

    return {
      id: doc.slug || doc.id.toString(),
      title: doc.title,
      desc: doc.manifesto,
      image: getImageUrl(doc.coverImage, '/images/drops/BN-cluster.png'),
      titleColor: doc.primaryColor || '#768b1a',
      descColor: doc.secondaryColor || '#fc5896',
      subclusters: subclusters
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
        <ClusterLayout clusters={mappedClusters} />
      ) : (
        <div className="z-10 text-white font-neo tracking-widest">CARICAMENTO CLUSTER IN CORSO...</div>
      )}
    </main>
  )
}
