import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config.js' // or .ts if using tsx

async function test() {
  const payload = await getPayload({ config: configPromise })
  const nid = 'NEO-001' // change to a known NID
  
  const { docs } = await payload.find({
    collection: 'artworks',
    where: { nid: { equals: nid } },
  })
  
  console.log('Result for', nid, ':', docs)
  process.exit(0)
}

test().catch(console.error)
