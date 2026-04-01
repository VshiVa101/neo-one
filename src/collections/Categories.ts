import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Subcluster',
    plural: 'Subclusters',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentCluster', 'slug', 'updatedAt'],
    group: 'CONTENUTI ART HUB',
  },
  fields: [
    {
      name: 'title',
      label: 'Titolo del Sottocluster',
      type: 'text',
      required: true,
      admin: {
        description: 'Esempio: Tarocchi, Illustrazioni, Merch...',
      },
    },
    {
      name: 'parentCluster',
      label: 'Appartiene al Cluster',
      type: 'relationship',
      relationTo: 'clusters',
      required: true,
      admin: {
        description: 'Seleziona a quale gruppo principale appartiene (es: B/N).',
      },
    },
    {
      name: 'description',
      label: 'Mood / Nota del Sottogruppo',
      type: 'textarea',
      admin: {
        description: 'Breve descrizione dello stile o del tema di questa selezione.',
      },
    },
    {
      name: 'featuredArtwork',
      label: 'Opera in primo piano (Copertina Mazzo)',
      type: 'relationship',
      relationTo: 'artworks',
      admin: {
        description: 'Scegli quale opera deve apparire come la "prima carta" del mazzo. Se lasciato vuoto, il sistema userà l\'ultima inserita.',
      },
      filterOptions: ({ id }) => {
        if (!id) return false // Non mostrare nulla se il sottogruppo non è ancora stato salvato
        return {
          category: { equals: id },
        }
      },
    },
    slugField(),
  ],
}
