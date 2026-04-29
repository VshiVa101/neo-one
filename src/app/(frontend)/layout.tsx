import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'
import localFont from 'next/font/local'
import Script from 'next/script'

import { AdminBar } from '@/components/AdminBar'
import { Providers as AppProviders } from '@/providers'
import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/ThemeSelector/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Transition Component & Context
import { TransitionProvider } from '@/contexts/TransitionContext'
import { TransitionOverlay } from '@/components/TransitionOverlay'
import { CartProvider } from '@/contexts/CartContext'

import { NeoBrandingObserver } from '@/components/NeoBrandingObserver'

const mergedFontNeo = localFont({
  src: '../../../public/fonts/MergedFontNEO.otf', // adjust relative path from app/(frontend) to public/fonts/ if needed, or use full path. Actually next/font/local resolves relative to the file.
  variable: '--font-neo',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(mergedFontNeo.variable)} lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function () {
        function getImplicitPreference() {
          var mediaQuery = '(prefers-color-scheme: dark)'
          var mql = window.matchMedia(mediaQuery)
          var hasImplicitPreference = typeof mql.matches === 'boolean'

          if (hasImplicitPreference) {
            return mql.matches ? 'dark' : 'light'
          }

          return null
        }

        function themeIsValid(theme) {
          return theme === 'light' || theme === 'dark'
        }

        var themeToSet = '${defaultTheme}'
        var preference = window.localStorage.getItem('${themeLocalStorageKey}')

        if (themeIsValid(preference)) {
          themeToSet = preference
        } else {
          var implicitPreference = getImplicitPreference()

          if (implicitPreference) {
            themeToSet = implicitPreference
          }
        }

        document.documentElement.setAttribute('data-theme', themeToSet)
      })();
      `,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="font-neo bg-black text-white selection:bg-white selection:text-black">
        <AppProviders>
          <CartProvider>
            <TransitionProvider>
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />
              

              <NeoBrandingObserver />
              <TransitionOverlay />
              
              {/* Main Content Area */}
              {children}
              
            </TransitionProvider>
          </CartProvider>
        </AppProviders>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@neo_one_art',
  },
}
