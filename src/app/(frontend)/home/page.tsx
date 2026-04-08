import { ClusterLayout, ClusterData } from '@/components/home/ClusterLayout'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'clusters',
    sort: 'sortOrder',
    limit: 100, // Prendi tutti i cluster 
  })

  const mappedClusters: ClusterData[] = docs.map((doc) => {
    let imageUrl = '/images/drops/BN-cluster.png' 
    if (doc.coverImage && typeof doc.coverImage === 'object') {
      const media = doc.coverImage;
      if (media.thumbnailURL && typeof media.thumbnailURL === 'string') {
        // La Local API fittizia genera 404 per le img su nextjs, quindi usiamo prelevare l'URL assoluto
        // dal campo generato da cloudinary per la thumbnail e ripristiniamo la qualita originale originale bypassando lo static server.
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

    return {
      id: doc.slug || doc.id.toString(),
      title: doc.title,
      desc: doc.manifesto,
      image: imageUrl,
      titleColor: doc.primaryColor || '#768b1a',
      descColor: doc.secondaryColor || '#fc5896',
    }
  })

  return (
    <main className="w-full min-h-screen relative flex flex-col items-center justify-center bg-[#151515] overflow-hidden">
      {/* Background GIF - Desktop first, ben contenuto nel V.P. */}
      <img
        src="/images/drops/bg-home.gif"
        alt="Home Background"
        className="absolute inset-0 w-screen h-screen object-cover z-0 opacity-40 brightness-75 scale-100 md:scale-105"
      />
      {mappedClusters.length >= 2 ? (
        <ClusterLayout clusters={mappedClusters} />
      ) : (
        <div className="z-10 text-white font-neo">Carica almeno 2 cluster nel CMS per visualizzare la home.</div>
      )}
    </main>
  )
}
