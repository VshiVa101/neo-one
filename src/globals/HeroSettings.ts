import type { GlobalConfig } from 'payload'

export const HeroSettings: GlobalConfig = {
  slug: 'hero-settings',
  label: 'Hero',
  admin: {
    group: 'IMPOSTAZIONI SITO',
  },
  fields: [
    {
      name: 'warningText',
      label: 'Scritta Warning (testo circolare)',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Il testo provocatorio che ruota attorno all\'occhio nella Hero page.',
      },
    },
  ],
}
