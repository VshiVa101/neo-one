import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const metadata: Metadata = {
  title: 'Bio | Neo-One Art Hub',
  description: 'Scopri chi è Neo, le origini e i segreti dietro i drop e l\'universo di Neo-One.',
  openGraph: mergeOpenGraph({
    title: 'Bio | Neo-One Art Hub',
    description: 'Scopri chi è Neo e il suo universo.',
    url: '/bio',
  }),
}

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
