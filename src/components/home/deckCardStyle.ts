export interface MockArtwork {
  id: string
  title: string
  image: string
}

export interface DeckCardStyle {
  y: string
  scale: number
  zIndex: number
  opacity: number
  brightness: number
}

export function getCardStyle(index: number, activeIndex: number, total: number): DeckCardStyle {
  let offset = (index - activeIndex) % total
  if (offset < 0) offset += total
  if (offset > Math.floor(total / 2)) offset -= total

  if (offset === 0) {
    return { y: '0%', scale: 1, zIndex: 50, opacity: 1, brightness: 1 }
  } else if (offset === -1) {
    return { y: '-10%', scale: 0.97, zIndex: 40, opacity: 1, brightness: 0.7 }
  } else if (offset === -2) {
    return { y: '-18%', scale: 0.94, zIndex: 30, opacity: 1, brightness: 0.5 }
  } else if (offset === 1) {
    return { y: '10%', scale: 0.97, zIndex: 40, opacity: 1, brightness: 0.7 }
  } else if (offset === 2) {
    return { y: '18%', scale: 0.94, zIndex: 30, opacity: 1, brightness: 0.5 }
  }
  return {
    y: offset < 0 ? '-30%' : '30%',
    scale: 0.8,
    zIndex: 10,
    opacity: 0,
    brightness: 0,
  }
}
