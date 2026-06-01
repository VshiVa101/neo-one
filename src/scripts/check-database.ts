import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function run() {
  console.log('🚀 Diagnostics: Querying Payload database...')
  const payload = await getPayload({ config: configPromise })

  console.log('\n--- CLUSTERS ---')
  const { docs: clusters } = await payload.find({
    collection: 'clusters',
    limit: 100,
  })
  
  for (const c of clusters) {
    console.log(`Cluster ID: ${c.id} | Slug: ${c.slug} | Title: ${c.title}`)
  }

  console.log('\n--- CATEGORIES (SUBCLUSTERS) ---')
  const { docs: categories } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
  })

  for (const cat of categories) {
    const parentCluster = cat.cluster as any
    const parentStr = parentCluster ? `${parentCluster.title} (Slug: ${parentCluster.slug}, ID: ${parentCluster.id})` : 'None'
    console.log(`Subcluster ID: ${cat.id} | Title: ${cat.title} | Parent Cluster: ${parentStr}`)
  }

  console.log('\n--- ARTWORKS COUNT PER SUBCLUSTER ---')
  const { docs: artworks } = await payload.find({
    collection: 'artworks',
    limit: 1000,
    depth: 0,
  })

  const countMap: Record<string, number> = {}
  for (const art of artworks) {
    const subId = typeof art.subcluster === 'object' && art.subcluster !== null
                  ? (art.subcluster as any).id
                  : art.subcluster
    if (subId) {
      countMap[String(subId)] = (countMap[String(subId)] || 0) + 1
    }
  }

  for (const [subId, count] of Object.entries(countMap)) {
    const cat = categories.find(c => String(c.id) === subId)
    const catTitle = cat ? cat.title : 'Unknown'
    const parentCluster = cat?.cluster as any
    const parentTitle = parentCluster ? parentCluster.title : 'Unknown'
    console.log(`Subcluster ID: ${subId} | Title: ${catTitle} | Parent Cluster: ${parentTitle} | Artworks count: ${count}`)
  }

  process.exit(0)
}

run().catch(console.error)
