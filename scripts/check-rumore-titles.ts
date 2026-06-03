import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenvConfig({ path: path.resolve(dirname, '../.env') })

async function run() {
  const payloadConfig = (await import('@payload-config')).default
  const payload = await getPayload({ config: payloadConfig })

  try {
    const clusterRes = await payload.find({
      collection: 'clusters',
      where: { slug: { equals: 'rumore' } },
      limit: 1
    })
    
    if (!clusterRes.docs || clusterRes.docs.length === 0) {
      console.log('No RUMORE cluster found')
      process.exit(0)
    }

    const rumoreId = clusterRes.docs[0].id
    const categoryRes = await payload.find({
      collection: 'categories',
      where: { cluster: { equals: rumoreId } },
      limit: 100
    })

    const categoryIds = categoryRes.docs.map(cat => cat.id)
    const artworksRes = await payload.find({
      collection: 'artworks',
      where: { subcluster: { in: categoryIds } },
      limit: 100
    })

    console.log(`Found ${artworksRes.docs.length} artworks in RUMORE. Titles:`)
    artworksRes.docs.forEach(a => console.log(`- ID: ${a.id}, NID: ${a.nid}, Title: "${a.title}"`))

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
run()
