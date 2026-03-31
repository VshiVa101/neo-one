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
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'parentCluster',
      label: 'Cluster Principale',
      type: 'relationship',
      relationTo: 'clusters',
      required: true,
      admin: {
        description: 'Seleziona il Cluster genitore di questo Sottogruppo (es: B/N, NeON).',
      },
    },
    {
      name: 'description',
      label: 'Descrizione Mood',
      type: 'textarea',
      admin: {
        description: 'Breve testo descrittivo del mood o stile di questo sottogruppo.',
      },
    },
    {
      name: 'mainImage',
      label: 'Immagine Cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Immagine rappresentativa di questo Sottogruppo d\'opere.',
      },
    },
    slugField(),
  ],
}
