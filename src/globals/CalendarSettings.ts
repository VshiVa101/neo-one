import type { GlobalConfig } from 'payload'

export const CalendarSettings: GlobalConfig = {
  slug: 'calendar-settings',
  label: 'Calendario',
  admin: {
    group: 'IMPOSTAZIONI SITO',
  },
  fields: [
    {
      name: 'calendarCTA',
      label: 'Call to Action — Pagina Calendario',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Testo provocatorio / invito visibile nella pagina calendario.',
      },
    },
    {
      name: 'defaultEventCTA',
      label: 'Call to Action Default — Dettaglio Evento',
      type: 'textarea',
      required: true,
      admin: {
        description: 'CTA di fallback per i dettagli evento. Usato se l\'evento non ha un CTA proprio.',
      },
    },
    {
      name: 'socialLinks',
      label: 'Link Social (Icone Rotonde)',
      type: 'array',
      admin: {
        description: 'Icone stile linktree visibili nella pagina calendario.',
      },
      fields: [
        {
          name: 'icon',
          label: 'Icona',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          label: 'Etichetta (accessibilità)',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
