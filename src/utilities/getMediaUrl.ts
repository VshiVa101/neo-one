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
 * Helper function per estrarre l'URL in modo sicuro (Cloudinary focus)
 */
export const getImageUrl = (media: any, defaultUrl: string) => {
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
