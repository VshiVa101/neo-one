'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SubclusterData } from '@/components/home/ClusterLayout'
import { unstable_noStore as noStore } from 'next/cache'

import { getImageUrl } from '@/utilities/getMediaUrl'


export async function fetchClusterSubclusters(clusterId: string): Promise<SubclusterData[]> {
  noStore()
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

  // Chiediamo SOLO le Artworks appartenenti a QUESTE categorie (Max 1000)
  const { docs: artworks } = await payload.find({
    collection: 'artworks',
    where: { subcluster: { in: categoryIds } },
    depth: 1, // per recuperare i media URL
    limit: 1000,
    sort: 'nid',
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

    const mappedArtworks = catArtworks.map((art, index) => ({
      id: art.nid || art.id.toString(),
      title: art.title || String(index + 1),
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
  noStore()
  const payload = await getPayload({ config: configPromise })
  
  // Decodifichiamo l'URL (es. %20 -> spazio) prima di pulire
  const decodedNid = decodeURIComponent(nid)
  const cleanNid = decodedNid.trim()

  // 1. Try by NID (preferred)
  let { docs } = await payload.find({
    collection: 'artworks',
    where: { nid: { equals: cleanNid } },
    depth: 1,
    limit: 1,
  })

  // Fallback 1a: Trailing dot handling
  if (!docs || docs.length === 0) {
    if (!cleanNid.endsWith('.')) {
      const { docs: dotDocs } = await payload.find({
        collection: 'artworks',
        where: { nid: { equals: cleanNid + '.' } },
        depth: 1,
        limit: 1,
      })
      if (dotDocs && dotDocs.length > 0) docs = dotDocs
    } else {
      const { docs: noDotDocs } = await payload.find({
        collection: 'artworks',
        where: { nid: { equals: cleanNid.slice(0, -1) } },
        depth: 1,
        limit: 1,
      })
      if (noDotDocs && noDotDocs.length > 0) docs = noDotDocs
    }
  }

  // Fallback 1b: Slash routing character decoding handling (e.g. "a/b" -> "a / b")
  if (!docs || docs.length === 0) {
    if (cleanNid.includes('/')) {
      const spacedNid = cleanNid.split('/').map(s => s.trim()).join(' / ')
      const { docs: slashDocs } = await payload.find({
        collection: 'artworks',
        where: { nid: { equals: spacedNid } },
        depth: 1,
        limit: 1,
      })
      if (slashDocs && slashDocs.length > 0) {
        docs = slashDocs
      } else {
        // Try spacedNid with trailing dot
        if (!spacedNid.endsWith('.')) {
          const { docs: slashDotDocs } = await payload.find({
            collection: 'artworks',
            where: { nid: { equals: spacedNid + '.' } },
            depth: 1,
            limit: 1,
          })
          if (slashDotDocs && slashDotDocs.length > 0) docs = slashDotDocs
        }
      }
    }
  }

  // 2. Try by ID (fallback)
  if (!docs || docs.length === 0) {
    // Check if it's a number (for Postgres/SQLite IDs) or a valid ID string
    const isNumeric = /^\d+$/.test(cleanNid)
    const queryId = isNumeric ? parseInt(cleanNid, 10) : cleanNid

    try {
      const { docs: idDocs } = await payload.find({
        collection: 'artworks',
        where: { id: { equals: queryId } },
        depth: 1,
        limit: 1,
      })
      docs = idDocs
    } catch (e) {
      // ID lookup might fail if queryId format is invalid for the DB
    }
  }

  if (!docs || docs.length === 0) {
    return null
  }

  const art = docs[0]
  const subcluster = art.subcluster as any
  const clusterIdRaw =
    typeof subcluster === 'object' && subcluster?.cluster
      ? typeof subcluster.cluster === 'object'
        ? subcluster.cluster.id
        : subcluster.cluster
      : null

  let clusterSlug: string | null = null
  if (clusterIdRaw) {
    try {
      const cluster = await payload.findByID({
        collection: 'clusters',
        id: String(clusterIdRaw),
        depth: 0,
      })
      clusterSlug = cluster?.slug || null
    } catch {
      clusterSlug = null
    }
  }

  return {
    id: art.id.toString(),
    nid: art.nid,
    title: art.title || '',
    image: getImageUrl(art.mainImage, '/images/drops/placeholder.png'),
    method: art.executionMethod || 'TECNICA MISTA NEO-ONE',
    support: art.support || 'SUPPORTO ORIGINALE',
    dimensions: art.originalDimensions || 'DIMENSIONI VARIABILI',
    year: art.creationDate || '2024',
    availability: art.availability,
    priceInfo: art.priceInfo || 'DISPONIBILITÀ SU RICHIESTA',
    audioSnippetUrl: art.sampleAudio ? getImageUrl(art.sampleAudio, '') : null,
    fullAudioUrl: art.fullAudioUrl || null,
    subclusterId: typeof subcluster === 'object' && subcluster !== null
      ? subcluster.id?.toString()
      : subcluster?.toString() || null,
    clusterId: clusterIdRaw ? String(clusterIdRaw) : null,
    clusterSlug,
    deckIndex: await (async () => {
      const cId = typeof subcluster === 'object' && subcluster?.cluster
        ? (typeof subcluster.cluster === 'object' ? subcluster.cluster.id : subcluster.cluster)
        : null;
      if (!cId) return null;
      const { docs: siblings } = await payload.find({
        collection: 'categories',
        where: { cluster: { equals: cId } },
        sort: 'sortOrder',
        depth: 0,
        limit: 50,
      });
      const sId = typeof subcluster === 'object' && subcluster !== null ? subcluster.id : subcluster;
      const idx = siblings.findIndex(s => String(s.id) === String(sId));
      return idx !== -1 ? idx : null;
    })(),
    gallery: (art.detailGallery || []).map((item: any) => getImageUrl(item.image, '/images/drops/placeholder.png'))
  }
}

export async function fetchAdjacentArtworks(currentNid: string, subclusterId: string | null): Promise<{ prevNid: string | null; nextNid: string | null; currentIndex: number | null; prevImage: string | null; nextImage: string | null }> {
  if (!subclusterId) return { prevNid: null, nextNid: null, currentIndex: null, prevImage: null, nextImage: null }

  const payload = await getPayload({ config: configPromise })
  const decodedNid = decodeURIComponent(currentNid).trim()

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { subcluster: { equals: subclusterId } },
    sort: 'nid',
    depth: 1, // depth 1 needed to populate the image media URL
    limit: 200,
  })

  // Normalizzazione per confronto robusto contro slash o punti finali
  const normalizeNid = (n: string) => {
    return n
      .toLowerCase()
      .replace(/\s*\/\s*/g, '/') // Spazi intorno a / rimossi
      .replace(/\.+$/, '')       // Punti finali rimossi
      .trim()
  }
  const targetNormalized = normalizeNid(decodedNid)

  const index = docs.findIndex(a => normalizeNid(String(a.nid)) === targetNormalized)
  if (index === -1) return { prevNid: null, nextNid: null, currentIndex: null, prevImage: null, nextImage: null }

  const prevDoc = index > 0 ? docs[index - 1] : null
  const nextDoc = index < docs.length - 1 ? docs[index + 1] : null

  return {
    prevNid: prevDoc ? String(prevDoc.nid) : null,
    nextNid: nextDoc ? String(nextDoc.nid) : null,
    currentIndex: index,
    prevImage: prevDoc ? getImageUrl(prevDoc.mainImage, '/images/drops/placeholder.png') : null,
    nextImage: nextDoc ? getImageUrl(nextDoc.mainImage, '/images/drops/placeholder.png') : null,
  }
}

export async function fetchCartSettings() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'cart-settings',
  })
  return settings
}

export async function fetchCalendarSettings() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'calendar-settings',
  })
  return settings
}

export async function submitCart(data: { name: string; email: string; message: string; items: any[] }) {
  const payload = await getPayload({ config: configPromise })

  try {
    const submission = await payload.create({
      collection: 'submissions',
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        items: data.items.map(item => ({
          title: item.title,
          nid: item.nid,
          quantity: item.quantity,
        })),
      },
    })

    return { success: true, id: submission.id }
  } catch (error) {
    return { success: false, error: 'Errore durante l\'invio. Riprova più tardi.' }
  }
}

