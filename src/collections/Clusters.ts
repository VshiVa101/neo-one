import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Clusters: CollectionConfig = {
  slug: 'clusters',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'titleColor',
      label: 'Colore Titolo (HEX)',
      type: 'text',
      defaultValue: '#768b1a',
      admin: {
        description: 'Colore del titolo nel frontend (es: #768b1a)',
      },
    },
    {
      name: 'descColor',
      label: 'Colore Descrizione (HEX)',
      type: 'text',
      defaultValue: '#fc5896',
      admin: {
        description: 'Colore della descrizione nel frontend (es: #fc5896)',
      },
    },
    slugField(),
  ],
}
