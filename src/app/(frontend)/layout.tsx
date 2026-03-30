import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'
import localFont from 'next/font/local'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Transition Component & Context
import { TransitionProvider } from '@/context/TransitionContext'
import { TransitionOverlay } from '@/components/TransitionOverlay'

const mergedFontNeo = localFont({
  src: '../../../public/fonts/MergedFontNEO.otf', // adjust relative path from app/(frontend) to public/fonts/ if needed, or use full path. Actually next/font/local resolves relative to the file.
  variable: '--font-neo',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(mergedFontNeo.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="font-neo bg-black text-white selection:bg-white selection:text-black">
        <Providers>
          <TransitionProvider>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            
            <TransitionOverlay />
            
            {/* Main Content Area */}
            {children}
            
          </TransitionProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
