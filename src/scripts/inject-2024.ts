import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function inject() {
  const payload = await getPayload({ config: configPromise })

  const { docs: mediaDocs } = await payload.find({
    collection: 'media',
    limit: 1,
  })

  if (mediaDocs.length === 0) {
    console.error('No media found')
    process.exit(1)
  }

  const mediaId = mediaDocs[0].id

  // Event 3: Marzo 2024
  await payload.create({
    collection: 'signals',
    data: {
      title: 'Flashback Marzo 2024',
      slug: 'flashback-marzo-2024',
      eventDate: '2024-03-10T12:00:00Z',
      description: 'Un evento memorabile successo a Marzo 2024.',
      previewImage: mediaId,
      eventCTA: 'scopri di più',
    },
  })

  console.log('2024 event injected successfully!')
  process.exit(0)
}

inject()
