import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: 'CONTENUTI',
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Opere selezionate nel carrello al momento dell\'invio.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'nid',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            // Recuperiamo l'email di Neo dai settings
            const settings = await req.payload.findGlobal({
              slug: 'cart-settings',
            })

            const artistEmail = settings.artistEmail as string

            if (artistEmail) {
              const itemsList = doc.items
                ?.map((item: any) => `- ${item.title} (x${item.quantity}) [NID: ${item.nid}]`)
                .join('\n') || 'Nessun articolo'

              await req.payload.sendEmail({
                to: artistEmail,
                from: process.env.EMAIL_FROM_ADDRESS || 'system@neo-one.art',
                subject: `Nuova Vibrazione da ${doc.name}`,
                text: `Hai ricevuto un nuovo messaggio da Neo-One Art Hub:\n\nNome: ${doc.name}\nEmail: ${doc.email}\n\nMessaggio:\n${doc.message}\n\nArticoli nel Carrello:\n${itemsList}\n\nControlla il pannello admin per i dettagli.`,
                html: `
                  <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border: 1px solid #768b1a;">
                    <h1 style="color: #F45390; letter-spacing: 0.2em; text-transform: uppercase;">Nuova Vibrazione</h1>
                    <p style="font-size: 16px;">Hai ricevuto un nuovo messaggio da <strong>${doc.name}</strong> (${doc.email}).</p>
                    <div style="background: #111; padding: 20px; border-left: 4px solid #768b1a; margin: 20px 0;">
                      <p style="font-style: italic; white-space: pre-wrap;">"${doc.message}"</p>
                    </div>
                    <h3 style="color: #768b1a; text-transform: uppercase;">Articoli Interessati:</h3>
                    <ul style="list-style: none; padding: 0;">
                      ${doc.items?.map((item: any) => `<li style="padding: 10px 0; border-bottom: 1px solid #333;">${item.title} <strong>x${item.quantity}</strong> <span style="color: #555;">[${item.nid}]</span></li>`).join('') || '<li>Nessun articolo</li>'}
                    </ul>
                    <p style="margin-top: 40px; font-size: 12px; color: #555;">Inviato da Neo-One Art Hub Engine.</p>
                  </div>
                `,
              })
            }
          } catch (error) {
            console.error('Error sending email notification:', error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
