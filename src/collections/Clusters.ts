import type { CollectionConfig } from 'payload'

export const Clusters: CollectionConfig = {
  slug: 'clusters',
  labels: { singular: 'Cluster', plural: 'Cluster' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', 'updatedAt'],
    group: 'CONTENUTI ART HUB',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      label: 'Titolo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly. Es: "b-n", "neon", "foto", "cose", "rumore".',
      },
    },
    {
      name: 'manifesto',
      label: 'Manifesto / Descrizione',
      type: 'textarea',
      required: true,
    },
    {
      name: 'coverImage',
      label: 'Immagine Copertina',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'cta',
      label: 'Call to Action (opzionale)',
      type: 'text',
    },
    {
      name: 'sortOrder',
      label: 'Ordine',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Design',
          fields: [
            {
              name: 'primaryColor',
              label: 'Colore Primario (HEX)',
              type: 'text',
              admin: { placeholder: '#F45390' },
            },
            {
              name: 'secondaryColor',
              label: 'Colore Secondario (HEX)',
              type: 'text',
              admin: { placeholder: '#B3828B' },
            },
          ],
        },
      ],
    },
  ],
}
