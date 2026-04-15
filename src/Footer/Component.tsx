import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ label, url, newTab }, i) => {
              return (
                <Link
                  key={i}
                  href={url}
                  target={newTab ? '_blank' : '_self'}
                  rel={newTab ? 'noopener noreferrer' : ''}
                  className="text-white hover:opacity-75 transition"
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
