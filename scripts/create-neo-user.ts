import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env variables
dotenvConfig({
  path: path.resolve(dirname, '../.env'),
})

// ── Validate required env vars ──────────────────────────────────
const requiredEnv = ['DATABASE_URI', 'PAYLOAD_SECRET'] as const
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`)
    console.error('   Make sure your .env file is present and contains all required values.')
    process.exit(1)
  }
}

async function createNeoUser() {
  const email = process.env.NEO_EMAIL
  const password = process.env.NEO_PASSWORD
  const name = process.env.NEO_NAME || 'Neo'

  if (!email || !password) {
    console.error('❌ Usage: provide NEO_EMAIL and NEO_PASSWORD as env variables.')
    console.error('')
    console.error('   Example:')
    console.error('   $env:NEO_EMAIL="neo@example.com"; $env:NEO_PASSWORD="SecurePass!"; pnpm exec tsx scripts/create-neo-user.ts')
    process.exit(1)
  }

  const payloadConfig = (await import('@payload-config')).default
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Check if user already exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      depth: 0,
      limit: 1,
    })

    let user
    if (existing.totalDocs && existing.totalDocs > 0) {
      user = existing.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: { password, name },
        depth: 0,
      })
      console.log('🔁 Existing user updated (password reset)')
    } else {
      user = await payload.create({
        collection: 'users',
        data: { email, password, name },
      })
      console.log('✅ New user created')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${email}`)
    console.log(`   Name:     ${name}`)
    console.log(`   User ID:  ${user.id}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to create/update user:')
    console.error(error)
    process.exit(1)
  }
}

createNeoUser()
