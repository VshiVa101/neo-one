import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env variables
dotenvConfig({
  path: path.resolve(dirname, '../.env'),
})

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  process.env.PAYLOAD_SECRET = 'ca797a62e1dc6a42b10825a4'
}

async function createNeoUser() {
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Crea l'utente Neo
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'neo@neo-one.art',
        password: 'NeoPink2026!Key#',
        name: 'Neo',
      },
    })

    console.log('✅ Account creato per Neo:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Email: neo@neo-one.art`)
    console.log(`Password: NeoPink2026!Key#`)
    console.log(`URL Login: https://neo-one.vercel.app/admin`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`ID utente: ${user.id}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Errore nella creazione utente:', error)
    process.exit(1)
  }
}

createNeoUser()
