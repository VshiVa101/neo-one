import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env variables
dotenvConfig({
  path: path.resolve(dirname, '../.env'),
})

// ── Validate required env vars ──────────────────────────────────
const requiredEnv = ['DATABASE_URI', 'PAYLOAD_SECRET'] as const
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`)
    console.error('   Make sure your .env file is present and contains all required values.')
    process.exit(1)
  }
}

const NEO_ACCENT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/[ÈÉÊË]/g, "E'"],
  [/[èéêë]/g, "e'"],
  [/[ÀÁÂÃÄÅ]/g, "A'"],
  [/[àáâãäå]/g, "a'"],
  [/[ÒÓÔÕÖ]/g, "O'"],
  [/[òóôõö]/g, "o'"],
  [/[ÙÚÛÜ]/g, "U'"],
  [/[ùúûü]/g, "u'"],
  [/[ÌÍÎÏ]/g, "I'"],
  [/[ìíîï]/g, "i'"],
  [/[‘’`]/g, "'"], // smart quotes to straight
  [/[“”]/g, '"'], // smart double quotes
  [/[€]/g, "EUR"], // euro symbol
]

const normalizeTitle = (value: string): string => {
  if (typeof value !== 'string') return value

  return NEO_ACCENT_REPLACEMENTS.reduce((result, [regex, replacement]) => {
    return result.replace(regex, replacement as string)
  }, value)
}

async function run() {
  const payloadConfig = (await import('@payload-config')).default
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Find RUMORE cluster
    const clusterRes = await payload.find({
      collection: 'clusters',
      where: {
        slug: { equals: 'rumore' }
      },
      limit: 1
    })

    if (!clusterRes.docs || clusterRes.docs.length === 0) {
      console.error('❌ Cluster RUMORE not found.')
      process.exit(1)
    }

    const rumoreId = clusterRes.docs[0].id

    // Find its subclusters (categories)
    const categoryRes = await payload.find({
      collection: 'categories',
      where: {
        cluster: { equals: rumoreId }
      },
      limit: 100
    })

    const categoryIds = categoryRes.docs.map(cat => cat.id)
    if (categoryIds.length === 0) {
      console.error('❌ No subclusters found for RUMORE.')
      process.exit(0)
    }

    // Find all artworks in these subclusters
    const artworksRes = await payload.find({
      collection: 'artworks',
      where: {
        subcluster: { in: categoryIds }
      },
      limit: 1000
    })

    let updatedCount = 0

    for (const artwork of artworksRes.docs) {
      if (artwork.title) {
        const normalized = normalizeTitle(artwork.title)
        
        if (normalized !== artwork.title) {
          console.log(`Updating: "${artwork.title}" -> "${normalized}"`)
          
          await payload.update({
            collection: 'artworks',
            id: artwork.id,
            data: {
              title: normalized
            }
          })
          
          updatedCount++
        }
      }
    }

    console.log(`✅ Finished! Updated ${updatedCount} artwork titles in RUMORE cluster.`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to update artwork titles:')
    console.error(error)
    process.exit(1)
  }
}

run()
