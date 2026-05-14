import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}

/**
 * Costruisce l'URL Cloudinary full-resolution da un media document.
 *
 * Il plugin Cloudinary salva nel DB:
 *   - url: PATH LOCALE (es. "/api/media/file/edna-1.webp") — NON un URL Cloudinary
 *   - thumbnailURL: URL Cloudinary 300x300 croppato
 *   - cloudinaryPublicId: la chiave per ricostruire l'URL full-res
 *
 * Priorità:
 * 1. cloudinaryPublicId + base da thumbnailURL → URL Cloudinary full-res (MIGLIORE)
 * 2. thumbnailURL → strip crop transforms → full-res
 * 3. url se assoluto (http) → usalo direttamente
 * 4. url/filename locale → fallback
 */
export const getImageUrl = (media: any, defaultUrl: string) => {
  if (!media || typeof media !== 'object') return defaultUrl

  const isAudioOrVideo =
    media.mimeType?.startsWith('audio/') || media.mimeType?.startsWith('video/')

  // 1. BEST: costruisci URL full-res da cloudinaryPublicId
  if (media.cloudinaryPublicId && media.thumbnailURL) {
    // Estrai base: "https://res.cloudinary.com/{cloud}/{type}/upload/"
    const baseMatch = media.thumbnailURL.match(
      /^(https:\/\/res\.cloudinary\.com\/[^/]+\/[^/]+\/upload\/)/,
    )
    if (baseMatch) {
      const base = baseMatch[1]
      // Audio/video: niente trasformazioni immagine
      if (isAudioOrVideo) {
        return `${base}${media.cloudinaryPublicId}`
      }
      // Immagini: solo ottimizzazione formato/qualità, ZERO crop
      return `${base}f_auto,q_auto/${media.cloudinaryPublicId}`
    }
  }

  // 2. thumbnailURL Cloudinary → strip crop per full-res
  if (media.thumbnailURL?.includes('cloudinary.com')) {
    if (isAudioOrVideo) {
      return media.thumbnailURL.replace(/\/upload\/[^/]+\//, '/upload/')
    }
    return media.thumbnailURL.replace(/\/upload\/[^/]+\//, '/upload/f_auto,q_auto/')
  }

  // 3. URL assoluto (raro ma possibile in futuro)
  if (media.url?.startsWith('http')) return media.url

  // 4. Fallback locale (path relativo)
  if (media.url) {
    if (!media.url.startsWith('/') && !media.url.startsWith('http')) {
      return media.url.includes('api/media') ? '/' + media.url : '/api/media/file/' + media.url
    }
    return media.url
  }

  // 5. Filename come ultima risorsa
  if (media.filename) return '/api/media/file/' + media.filename

  return defaultUrl
}
