import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

export const CartSettings: GlobalConfig = {
  slug: 'cart-settings',
  label: 'Carrello / Comunicazione',
  admin: {
    group: 'IMPOSTAZIONI SITO',
  },
  fields: [
    {
      name: 'artistEmail',
      label: 'Email dell\'Artista',
      type: 'email',
      required: false,
      admin: {
        description: 'L\'indirizzo email dove Neo riceverà le notifiche dei nuovi messaggi e ordini.',
      },
    },
    {
      name: 'shippingPaymentNotice',
      label: 'Avviso Shipping & Pagamenti',
      type: 'richText',
      required: false,
      editor: lexicalEditor({}),
      admin: {
        description: 'Messaggio visibile nel form di comunicazione / carrello. Spiega come funzionano spedizioni e pagamenti.',
      },
    },
  ],
}
