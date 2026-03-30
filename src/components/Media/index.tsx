import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const content = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  // When `htmlElement` is explicitly `null`, we render as a Fragment (no wrapper element).
  // This avoids TS inferring a too-restrictive `children` type for a dynamic JSX tag.
  if (htmlElement === null) return <Fragment>{content}</Fragment>

  return (
    React.createElement(htmlElement || 'div', { ...(className ? { className } : null) }, content)
  )
}
