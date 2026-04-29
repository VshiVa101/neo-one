import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config.js'

async function test() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'artworks',
    limit: 5,
  })
  
  console.log('Sample artworks:', docs.map(d => ({ id: d.id, nid: d.nid, title: d.title })))
  process.exit(0)
}

test().catch(console.error)
