import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mappatura: Cartella Principale -> { dbCluster: 'Nome Cluster in DB', categories: { 'Nome Sottocartella': 'Nome Categoria in DB' } }
const MAPPING: Record<string, { dbCluster: string, categories: Record<string, string> }> = {
  'BN': {
    dbCluster: 'B/N',
    categories: {
      'Mix': 'mix bianconero',
      'tarocchi': 'tarocchi'
    }
  },
  'COSE': {
    dbCluster: 'Cose',
    categories: {
      'Mix': 'mix di cose'
    }
  },
  'FOTO': {
    dbCluster: 'fOtO',
    categories: {
      'Mix': 'mix di foto'
    }
  },
  'NEON': {
    dbCluster: 'NeON',
    categories: {
      'Mix': 'mix colorato'
    }
  },
  'RUMORE': {
    dbCluster: 'Rumore',
    categories: {
      'Mix': 'mix di rumore'
    }
  }
}

async function run() {
  console.log('🚀 Avvio Seeder Artworks Neo-One...')
  const payload = await getPayload({ config: configPromise })

  const baseDir = path.resolve(__dirname, '../../asset neo ottimizzato')
  if (!fs.existsSync(baseDir)) {
    console.error(`❌ Cartella non trovata: ${baseDir}. Assicurati che 'asset neo ottimizzato' sia nella root del progetto (vicino a src).`)
    process.exit(1)
  }

  // Prendi tutti i Sottocluster esistenti per poterli mappare alla giusta Opera
  // Peschiamo anche i Cluster genitore per distinguerli
  const categoriesDb = await payload.find({
    collection: 'categories',
    depth: 1, // Ci serve sapere qual è il Cluster genitore di ogni Sottocluster
    limit: 100,
  })

  // Trova l'ultimo NID inserito per continuare la numerazione
  const lastArtwork = await payload.find({
    collection: 'artworks',
    sort: '-nid',
    limit: 1,
  })

  let totalUploaded = 0
  let nidCounter = 1

  if (lastArtwork.docs.length > 0) {
    const lastNidStr = lastArtwork.docs[0].nid.replace('NEO-', '')
    const lastNidNum = parseInt(lastNidStr, 10)
    if (!isNaN(lastNidNum)) {
      nidCounter = lastNidNum + 1
      console.log(`📊 Riprendo enumerazione NID da: NEO-${String(nidCounter).padStart(3, '0')}`)
    }
  }

  // 1. Itera sulle cartelle principali (BN, COSE, ecc.)
  for (const [folderName, config] of Object.entries(MAPPING)) {
    const clusterPath = path.join(baseDir, folderName)
    const dbClusterTitle = config.dbCluster
    
    if (!fs.existsSync(clusterPath)) {
      console.log(`⚠️ Ignoro cartella non trovata: ${folderName}`)
      continue
    }

    console.log(`\n📁 Esploro Cluster: ${folderName} (DB: ${dbClusterTitle})`)

    // Raccogliamo tutti i path da processare e a quale dbCategoryTite appartengono
    // 1. La cartella root del cluster (le foto sciolte finiscono nel 'Mix')
    const mixDbTitle = config.categories['Mix']
    const directoriesToProcess = [
      { path: clusterPath, dbCategoryTitle: mixDbTitle, isRoot: true }
    ]

    // 2. Le sottocartelle (es. tarocchi)
    const subDirs = fs.readdirSync(clusterPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    for (const dirent of subDirs) {
      const dbCatTitle = config.categories[dirent.name] || dirent.name
      directoriesToProcess.push({
        path: path.join(clusterPath, dirent.name),
        dbCategoryTitle: dbCatTitle,
        isRoot: false
      })
    }

    // Ora per ogni directory (root o sottocartella), verifichiamo i file
    for (const dirInfo of directoriesToProcess) {
      if (!dirInfo.dbCategoryTitle) continue // Se non c'è match, salta

      // Identifica la Category in DB
      const categoryMatch = categoriesDb.docs.find(cat => {
        const titleMatch = cat.title.toLowerCase().trim() === dirInfo.dbCategoryTitle.toLowerCase().trim()
        const parentCluster = cat.cluster as any
        const parentMatch = parentCluster && parentCluster.title === dbClusterTitle
        return titleMatch && parentMatch
      })

      if (!categoryMatch) {
         if (!dirInfo.isRoot) {
           console.error(`    ❌ Errore: Nessun sottocluster trovato nel DB con titolo '${dirInfo.dbCategoryTitle}' sotto al Cluster '${dbClusterTitle}'.`)
         }
         continue
      }

      const files = fs.readdirSync(dirInfo.path, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)
        .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'))

      if (files.length > 0) {
        console.log(`  📂 Sottocluster bersaglio: ${dirInfo.dbCategoryTitle} -> Trovati ${files.length} file da elaborare...`)
      }

      for (const fileName of files) {
        const tempTitle = fileName.replace('.webp', '').replace('.png', '').replace('.jpg', '')
        
        // Verifica se QUESTA OPERA è già stata caricata in questo Sottocluster
        const checkExisting = await payload.find({
          collection: 'artworks',
          where: { 
            and: [
              { title: { equals: tempTitle } },
              { subcluster: { equals: categoryMatch.id } }
            ]
          },
          limit: 1,
        })

        if (checkExisting.totalDocs > 0) {
          console.log(`      ⏭️ Skip ${fileName} (Opera già presente in ${dirInfo.dbCategoryTitle})`)
          continue
        }

        const filePath = path.join(dirInfo.path, fileName)
        const fileStat = fs.statSync(filePath)
        const fileData = fs.readFileSync(filePath)
        
        // Generazione progressiva NID
        const nidString = String(nidCounter).padStart(3, '0')
        const artworkNid = `NEO-${nidString}`
        
        console.log(`      ⬆️ Caricamento ${fileName} come ${artworkNid}...`)

        try {
          const newMedia = await payload.create({
            collection: 'media',
            data: { alt: `Asset per ${artworkNid}` },
            file: {
              data: fileData,
              mimetype: 'image/webp',
              name: fileName,
              size: fileStat.size,
            },
          })

          await payload.create({
            collection: 'artworks',
            data: {
              nid: artworkNid,
              title: tempTitle,
              mainImage: newMedia.id,
              subcluster: categoryMatch.id,
              availability: 'non_disponibile',
            }
          })
          
          totalUploaded++
          nidCounter++
        } catch (error: any) {
          console.error(`      ❌ Errore durante il caricamento di ${fileName}:`, error.message)
        }
      }
    }
  }

  console.log(`\n✅ POPOLAMENTO COMPLETATO! Opere d'Arte caricate e collegate: ${totalUploaded}`)
  process.exit(0)
}

run().catch(console.error)
