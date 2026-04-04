import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const InquirySettings: GlobalConfig = {
  slug: 'inquiry-settings',
  label: 'Cassa / Checkout (Info)',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'IMPOSTAZIONI SITO',
  },
  fields: [
    {
      name: 'shippingWarning',
      label: 'Avviso Spedizioni (Shipping)',
      type: 'textarea',
      required: true,
      defaultValue: 'Spedizione inclusa in IT. Estero da calcolare.',
    },
    {
      name: 'paymentWarning',
      label: 'Avviso Pagamento (Payment)',
      type: 'textarea',
      required: true,
      defaultValue: 'Bonifico, PayPal o Crypto. Istruzioni via email.',
    },
    {
      name: 'generalInfo',
      label: 'Info Generali / Note',
      type: 'textarea',
      required: true,
      defaultValue: 'Neo-One Art Hub non risponde di smarrimenti postali.',
    },
  ],
}
