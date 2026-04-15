import type { Config } from 'src/payload-types'
import type {
  Header,
  Footer,
  HeroSettings,
  CalendarSettings,
  CartSettings,
} from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

// Map slug to exact global type
type GlobalTypeMap = {
  header: Header
  footer: Footer
  'hero-settings': HeroSettings
  'calendar-settings': CalendarSettings
  'cart-settings': CartSettings
}

async function getGlobal<TSlug extends Global>(
  slug: TSlug,
  depth = 0,
): Promise<GlobalTypeMap[TSlug]> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global as GlobalTypeMap[TSlug]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 * Generically typed to return the exact global type based on slug
 */
export const getCachedGlobal = <TSlug extends Global>(
  slug: TSlug,
  depth = 0,
) =>
  unstable_cache(
    async (): Promise<GlobalTypeMap[TSlug]> => getGlobal(slug, depth),
    [slug],
    {
      tags: [`global_${slug}`],
    },
  )
