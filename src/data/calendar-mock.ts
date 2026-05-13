export interface NeoEvent {
  id: string
  date: string
  month: string
  year: string
  thumbnail: string
  isPreOrder?: boolean
  label?: string
  details: {
    headline: string
    subheadline?: string
    description: string
    images: string[]
    comicBubble?: string
  }
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const calendarMonths = [
  'GENNAIO',
  'FEBBRAIO',
  'MARZO',
  'APRILE',
  'MAGGIO',
  'GIUGNO',
]

export const mockEvents: NeoEvent[] = [
  {
    id: 'evt-001',
    date: '24',
    month: 'GENNAIO',
    year: '2026',
    thumbnail: '/images/ui/pre-orderverde.webp',
    isPreOrder: true,
    label: 'PRE-ORDER',
    details: {
      headline: 'NEO-ONE DROP #001',
      subheadline: 'Collection One',
      description:
        'First official drop. Limited edition prints and digital assets. Hand-signed, numbered.',
      images: [
        '/images/ui/web-bg.webp',
        '/images/ui/pink-zebra-bg.webp',
      ],
      comicBubble: 'Stupidi gadget in omaggio!',
    },
  },
  {
    id: 'evt-002',
    date: '15',
    month: 'FEBBRAIO',
    year: '2026',
    thumbnail: '/images/ui/inforverde.webp',
    details: {
      headline: 'GALLERY NIGHT',
      subheadline: 'Milano • Via Tortona 12',
      description:
        'Esposizione fisica. Acidi e texture dal vivo. Performance audio-reactive con EyeScene live.',
      images: [
        '/images/ui/web-bg.webp',
      ],
      comicBubble: 'Ingresso libero — dress code: nero',
    },
  },
  {
    id: 'evt-003',
    date: '08',
    month: 'MARZO',
    year: '2026',
    thumbnail: '/images/ui/carrelloverde.webp',
    isPreOrder: true,
    label: 'PRE-ORDER',
    details: {
      headline: 'NEO-ONE DROP #002',
      subheadline: 'Audio-Reactive Collection',
      description:
        'Second drop. Artworks that react to sound. Each piece includes an embedded audio sample.',
      images: [
        '/images/ui/pink-zebra-bg.webp',
        '/images/ui/web-bg.webp',
      ],
      comicBubble: 'Drop limitato a 50 pezzi',
    },
  },
  {
    id: 'evt-004',
    date: '22',
    month: 'APRILE',
    year: '2026',
    thumbnail: '/images/ui/inforverde.webp',
    details: {
      headline: 'LIVE STREAM',
      subheadline: 'su Twitch & YouTube',
      description:
        'Processo creativo dal vivo. Painting + 3D in tempo reale. Q&A con la community.',
      images: [
        '/images/ui/web-bg.webp',
      ],
    },
  },
  {
    id: 'evt-005',
    date: '10',
    month: 'MAGGIO',
    year: '2026',
    thumbnail: '/images/ui/carrelloverde.webp',
    isPreOrder: true,
    label: 'PRE-ORDER',
    details: {
      headline: 'NEO-ONE DROP #003',
      subheadline: 'Collab Edition',
      description:
        'Collaborazione con artista ospite. Due visioni, un unico drop. Edizione speciale.',
      images: [
        '/images/ui/pink-zebra-bg.webp',
      ],
      comicBubble: 'Chi sarà il mystery guest?',
    },
  },
  {
    id: 'evt-006',
    date: '19',
    month: 'GIUGNO',
    year: '2026',
    thumbnail: '/images/ui/inforverde.webp',
    details: {
      headline: 'FESTIVAL APPEARANCE',
      subheadline: 'Bologna • Palazzo Re Enzo',
      description:
        'Installazione interattiva. EyeScene su schermo 8K. Tracking multi-utente simultaneo.',
      images: [
        '/images/ui/web-bg.webp',
        '/images/ui/pink-zebra-bg.webp',
      ],
      comicBubble: 'Vieni a molestarmi dal vivo',
    },
  },
]

export const mockSocialLinks: SocialLink[] = [
  {
    id: 'social-001',
    name: 'Instagram',
    url: 'https://instagram.com/neoone',
    icon: 'Instagram',
  },
  {
    id: 'social-002',
    name: 'Spotify',
    url: 'https://open.spotify.com/artist/neoone',
    icon: 'Music',
  },
  {
    id: 'social-003',
    name: 'YouTube',
    url: 'https://youtube.com/@neoone',
    icon: 'Youtube',
  },
  {
    id: 'social-004',
    name: 'X / Twitter',
    url: 'https://x.com/neoone',
    icon: 'Twitter',
  },
  {
    id: 'social-005',
    name: 'TikTok',
    url: 'https://tiktok.com/@neoone',
    icon: 'Music',
  },
]
