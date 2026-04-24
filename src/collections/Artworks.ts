import type { CollectionConfig } from 'payload'

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  labels: { singular: 'Opera', plural: 'Opere' },
  admin: {
    useAsTitle: 'nid',
    defaultColumns: ['nid', 'title', 'subcluster', 'availability', 'updatedAt'],
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
      name: 'nid',
      label: 'N.ID (Codice Neo)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificativo unico dell\'opera. Usato anche come URL.',
      },
    },
    {
      name: 'title',
      label: 'Titolo (opzionale)',
      type: 'text',
      admin: {
        description: 'Neo spesso usa solo il N.ID.',
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
      name: 'detailGallery',
      label: 'Galleria Dettagli',
      type: 'array',
      admin: {
        description: 'Scatti extra, close-up, dettagli.',
      },
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
      name: 'executionMethod',
      label: 'Metodo di Esecuzione',
      type: 'text',
      admin: { placeholder: 'es. Acrilico su tela, Digitale...' },
    },
    {
      name: 'support',
      label: 'Supporto',
      type: 'text',
      admin: { placeholder: 'es. Tela, Carta 300g, Tavola...' },
    },
    {
      name: 'creationDate',
      label: 'Data Creazione',
      type: 'text',
      admin: {
        placeholder: 'es. 2023, Marzo 2024...',
        description: 'Testo libero.',
      },
    },
    {
      name: 'originalDimensions',
      label: 'Dimensioni Originali',
      type: 'text',
      admin: { placeholder: 'es. 70×100 cm' },
    },
    {
      name: 'availability',
      label: 'Disponibilità',
      type: 'select',
      required: true,
      defaultValue: 'non_disponibile',
      options: [
        { label: 'Comprabile', value: 'comprabile' },
        { label: 'Ordinabile', value: 'ordinabile' },
        { label: 'Non disponibile', value: 'non_disponibile' },
      ],
    },
    {
      name: 'priceInfo',
      label: 'Info Prezzo',
      type: 'textarea',
      admin: {
        description: 'Testo libero: prezzo originale, prezzo stampe, su richiesta, ecc.',
      },
    },
    {
      name: 'subcluster',
      label: 'Sottocluster (Mazzo)',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },

    {
      name: 'audioSnippetUrl',
      label: 'URL Sample Audio',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'URL a un file audio breve (es. MP3 su Dropbox/Drive). Perfetto per il cluster Rumore.',
      },
    },
    {
      name: 'fullAudioUrl',
      label: 'Link Audio Completo',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Link al sito dove ascoltare la traccia estesa (es. Spotify, Bandcamp).',
      },
    },
  ],
}
