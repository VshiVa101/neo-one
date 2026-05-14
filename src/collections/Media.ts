import type { CollectionConfig } from 'payload'

import {
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({}),
    },
  ],
  upload: {
    // staticDir is required by Payload but Cloudinary plugin sets disableLocalStorage: true
    staticDir: path.resolve(dirname, '../../public/media'),
    // adminThumbnail is overridden by the Cloudinary plugin (getAdminThumbnailFactory)
  },
}
