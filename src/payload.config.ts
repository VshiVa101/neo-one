import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudinaryPlugin as cloudinaryStorage } from '@jhb.software/payload-cloudinary-plugin'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Clusters } from './collections/Clusters'
import { Categories } from './collections/Categories'
import { Artworks } from './collections/Artworks'
import { Signals } from './collections/Signals'

import { HeroSettings } from './globals/HeroSettings'
import { CalendarSettings } from './globals/CalendarSettings'
import { CartSettings } from './globals/CartSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  collections: [
    Media,
    Users,
    Clusters,
    Categories,
    Artworks,
    Signals,
  ],
  globals: [
    HeroSettings,
    CalendarSettings,
    CartSettings,
  ],
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      credentials: {
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
      },
      folder: 'uploads',
      clientUploads: false,
      useFilename: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
