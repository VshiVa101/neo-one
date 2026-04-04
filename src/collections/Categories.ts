import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Sottocluster', plural: 'Sottocluster' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'cluster', 'sortOrder', 'updatedAt'],
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
      label: 'Titolo Mazzo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'cluster',
      label: 'Cluster Genitore',
      type: 'relationship',
      relationTo: 'clusters',
      required: true,
    },
    {
      name: 'featuredArtwork',
      label: 'Opera in Primo Piano (copertina mazzo)',
      type: 'relationship',
      relationTo: 'artworks',
      admin: {
        description: 'Se vuoto, si usa la prima opera del mazzo come copertina.',
      },
    },
    {
      name: 'mood',
      label: 'Mood / Nota',
      type: 'textarea',
    },
    {
      name: 'sortOrder',
      label: 'Ordine',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
