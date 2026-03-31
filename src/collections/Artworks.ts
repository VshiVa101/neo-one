import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'nid', 'status', 'cluster', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'nid',
      label: 'N.ID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificativo univoco dell\'opera (es. N.01)',
      },
    },
    {
      name: 'mainImage',
      label: 'Immagine Principale',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      label: 'Galleria Dettagli',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'price',
      label: 'Prezzo (€)',
      type: 'number',
      min: 0,
    },
    {
      name: 'status',
      label: 'Stato',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Coming Soon', value: 'coming_soon' },
      ],
      required: true,
    },
    {
      name: 'category',
      label: 'Sottogruppo (Subcluster)',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Seleziona il Sottogruppo di appartenenza di questa opera (es: Selezione 2024).',
      },
    },
    {
      name: 'description',
      label: 'Descrizione Opera',
      type: 'richText',
    },
    slugField(),
  ],
}
