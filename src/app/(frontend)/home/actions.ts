'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SubclusterData } from '@/components/home/ClusterLayout'

// Helper per risolvere in un bel path diretto l'immagine di cloudinary
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

export async function fetchClusterSubclusters(clusterId: string): Promise<SubclusterData[]> {
  const payload = await getPayload({ config: configPromise })

  // Recupero solo le categorie (sottocluster) che appartengono a questo cluster!
  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { cluster: { equals: clusterId } },
    depth: 0,
    limit: 50,
  })

  // Per queste categorie, estraiamo gli IDs
  const categoryIds = categories.map(cat => cat.id)

  if (categoryIds.length === 0) {
    return []
  }

  // Chiediamo SOLO le Artworks appartenenti a QUESTE categorie (Max 200)
  const { docs: artworks } = await payload.find({
    collection: 'artworks',
    where: { subcluster: { in: categoryIds } },
    depth: 1, // per recuperare i media URL
    limit: 200,
  })

  // Formatizziamo la risposta al client Component
  const subclusters: SubclusterData[] = categories.map(cat => {
    // filtriamo in JS le artworks assegnate a questa specifica categoria
    const catArtworks = artworks.filter(art => {
      const artSubclusterId = typeof art.subcluster === 'object' && art.subcluster !== null 
                              ? art.subcluster.id 
                              : art.subcluster
      return artSubclusterId === cat.id
    })

    const mappedArtworks = catArtworks.map(art => ({
      id: art.nid || art.id.toString(),
      title: art.title || 'Senza Titolo',
      image: getImageUrl(art.mainImage, '/images/drops/placeholder.png')
    }))

    return {
      id: cat.id.toString(),
      title: cat.title,
      artworks: mappedArtworks
    }
  })

  return subclusters
}
export async function fetchArtworkByNid(nid: string) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { nid: { equals: nid } },
    depth: 1,
    limit: 1,
  })

  if (!docs || docs.length === 0) return null

  const art = docs[0]

  return {
    id: art.id.toString(),
    nid: art.nid,
    title: art.title || `OPERA ${art.nid}`,
    image: getImageUrl(art.mainImage, '/images/drops/placeholder.png'),
    method: art.executionMethod || 'TECNICA MISTA NEO-ONE',
    support: art.support || 'SUPPORTO ORIGINALE',
    dimensions: art.originalDimensions || 'DIMENSIONI VARIABILI',
    year: art.creationDate || '2024',
    availability: art.availability,
    priceInfo: art.priceInfo || 'DISPONIBILITÀ SU RICHIESTA',
    audioSnippetUrl: art.audioSnippetUrl || null,
    fullAudioUrl: art.fullAudioUrl || null,
    subclusterId: typeof art.subcluster === 'object' && art.subcluster !== null
      ? (art.subcluster as any).id?.toString()
      : art.subcluster?.toString() || null,
    gallery: (art.detailGallery || []).map((item: any) => getImageUrl(item.image, '/images/drops/placeholder.png'))
  }
}

export async function fetchAdjacentArtworks(currentNid: string, subclusterId: string | null): Promise<{ prevNid: string | null; nextNid: string | null }> {
  if (!subclusterId) return { prevNid: null, nextNid: null }

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { subcluster: { equals: subclusterId } },
    sort: 'nid',
    depth: 0,
    limit: 200,
  })

  const index = docs.findIndex(a => String(a.nid) === String(currentNid))
  if (index === -1) return { prevNid: null, nextNid: null }

  return {
    prevNid: index > 0 ? String(docs[index - 1].nid) : null,
    nextNid: index < docs.length - 1 ? String(docs[index + 1].nid) : null,
  }
}
