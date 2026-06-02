import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  console.log('\n--- REDIRECTS ---')
  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    limit: 100,
  })
  
  for (const r of redirects) {
    console.log(`From: "${r.from}" | To: "${typeof r.to === 'object' && r.to !== null && 'url' in r.to ? r.to.url : JSON.stringify(r.to)}"`)
  }

  process.exit(0)
}

run().catch(console.error)
