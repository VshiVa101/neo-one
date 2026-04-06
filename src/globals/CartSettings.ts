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
      name: 'shippingPaymentNotice',
      label: 'Avviso Shipping & Pagamenti',
      type: 'richText',
      required: true,
      editor: lexicalEditor({}),
      admin: {
        description: 'Messaggio visibile nel form di comunicazione / carrello. Spiega come funzionano spedizioni e pagamenti.',
      },
    },
  ],
}
