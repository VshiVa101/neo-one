import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getArtworksSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'artworks',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        nid: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((artwork) => Boolean(artwork?.nid))
          .map((artwork) => ({
            loc: `${SITE_URL}/artwork/${artwork?.nid}`,
            lastmod: artwork.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['artworks-sitemap'],
  {
    tags: ['artworks-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getArtworksSitemap()

  return getServerSideSitemap(sitemap)
}
