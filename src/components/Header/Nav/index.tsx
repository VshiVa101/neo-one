'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ label, url, newTab }, i) => {
        return (
          <Link
            key={i}
            href={url}
            target={newTab ? '_blank' : '_self'}
            rel={newTab ? 'noopener noreferrer' : ''}
            className="text-primary hover:opacity-75 transition"
          >
            {label}
          </Link>
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
