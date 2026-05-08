import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function inject() {
  const payload = await getPayload({ config: configPromise })

  // Find a media ID
  const { docs: mediaDocs } = await payload.find({
    collection: 'media',
    limit: 1,
  })

  if (mediaDocs.length === 0) {
    console.error('No media found to use as previewImage')
    process.exit(1)
  }

  const mediaId = mediaDocs[0].id

  // Event 1: Successo nel 2025
  await payload.create({
    collection: 'signals',
    data: {
      title: 'Successo Passato 2025',
      slug: 'successo-passato-2025',
      eventDate: '2025-05-15T12:00:00Z',
      description: 'Un grande avvenimento del passato che ha segnato il 2025.',
      previewImage: mediaId,
      eventCTA: 'rivivi il momento',
    },
  })

  // Event 2: Succederà nel 2027
  await payload.create({
    collection: 'signals',
    data: {
      title: 'Futuro Prossimo 2027',
      slug: 'futuro-prossimo-2027',
      eventDate: '2027-10-20T12:00:00Z',
      description: 'Preparati per quello che accadrà nel 2027. Qualcosa di epico.',
      previewImage: mediaId,
      eventCTA: 'preparati ora',
    },
  })

  console.log('Events injected successfully!')
  process.exit(0)
}

inject()
