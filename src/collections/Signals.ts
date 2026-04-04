import type { CollectionConfig } from 'payload'

export const Signals: CollectionConfig = {
  slug: 'signals',
  labels: { singular: 'Evento', plural: 'Eventi' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'sortOrder', 'updatedAt'],
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
      label: 'Titolo Evento',
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
      name: 'eventDate',
      label: 'Data Evento',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Il frontend estrae giorno e mese automaticamente.',
      },
    },
    {
      name: 'description',
      label: 'Descrizione Evento',
      type: 'textarea',
      required: true,
    },
    {
      name: 'previewImage',
      label: 'Preview (quadrata piccola)',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Immagine piccola visibile nella lista calendario.',
      },
    },
    {
      name: 'detailImages',
      label: 'Immagini Dettaglio Evento (max 2)',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'image',
          label: 'Immagine',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'eventCTA',
      label: 'Call to Action Evento (opzionale)',
      type: 'text',
      admin: {
        description: 'Se vuoto, si usa il CTA default dalle impostazioni calendario.',
      },
    },
    {
      name: 'sortOrder',
      label: 'Ordine',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Override su ordine cronologico.',
      },
    },
  ],
}
