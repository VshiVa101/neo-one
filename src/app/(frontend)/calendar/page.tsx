import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CalendarClient from './CalendarClient'
import { getImageUrl } from '@/utilities/getMediaUrl'
import type { NeoEvent } from '@/data/calendar-mock'

export const dynamic = 'force-dynamic'

const monthNames = [
  'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
  'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
]

export default async function CalendarPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch Events (Signals)
  const { docs: eventDocs } = await payload.find({
    collection: 'signals',
    sort: 'eventDate',
    limit: 100,
  })

  // Fetch Settings (Global)
  const settings = await payload.findGlobal({
    slug: 'calendar-settings',
  })

  // Map Payload docs to NeoEvent interface
  const events: NeoEvent[] = eventDocs.map((doc: any) => {
    const eventDate = new Date(doc.eventDate)
    const day = eventDate.getDate().toString().padStart(2, '0')
    const monthIndex = eventDate.getMonth()
    const monthName = monthNames[monthIndex]
    const year = eventDate.getFullYear().toString()

    return {
      id: doc.id,
      date: day,
      month: monthName,
      year: year,
      thumbnail: getImageUrl(doc.previewImage, '/images/ui/pre-orderverde.webp'),
      details: {
        headline: doc.title,
        description: doc.description,
        images: (doc.detailImages || []).map((imgObj: any) => getImageUrl(imgObj.image)),
        stickers: [],
        comicBubble: doc.eventCTA || settings.defaultEventCTA || '',
      },
    }
  })

  return (
    <CalendarClient 
      initialEvents={events} 
      quote={settings.calendarCTA}
    />
  )
}

