import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  console.log('📦 Avvio Backup Dati Neo-One Art Hub...')
  const payload = await getPayload({ config: configPromise })

  const collections = [
    'clusters',
    'categories',
    'artworks',
    'signals',
    'submissions',
    'users',
    'media'
  ]

  const globals = [
    'hero-settings',
    'calendar-settings',
    'cart-settings',
    'footer',
    'header'
  ]

  const backupData: any = {
    timestamp: new Date().toISOString(),
    collections: {},
    globals: {}
  }

  // Backup Collezioni
  for (const slug of collections) {
    console.log(`- Esportazione collezione: ${slug}...`)
    try {
      const { docs } = await payload.find({
        collection: slug as any,
        limit: 5000,
        depth: 0,
      })
      backupData.collections[slug] = docs
    } catch (err: any) {
      console.error(`❌ Errore durante il backup della collezione ${slug}:`, err.message)
    }
  }

  // Backup Globali
  for (const slug of globals) {
    console.log(`- Esportazione globale: ${slug}...`)
    try {
      const data = await payload.findGlobal({
        slug: slug as any,
      })
      backupData.globals[slug] = data
    } catch (err: any) {
      console.error(`❌ Errore durante il backup del globale ${slug}:`, err.message)
    }
  }

  // Salvataggio su file
  const backupDir = path.resolve(__dirname, '../../backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-')
  const fileName = `backup_${dateStr}.json`
  const filePath = path.join(backupDir, fileName)

  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))

  console.log(`\n✅ BACKUP COMPLETATO!`)
  console.log(`📍 File salvato in: ${filePath}`)
  process.exit(0)
}

run().catch(console.error)
