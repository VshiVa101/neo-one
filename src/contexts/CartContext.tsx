'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  nid: string
  title: string
  image: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (nid: string) => void
  count: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  count: 0,
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Persist in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('neo-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('neo-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      if (prev.find(i => i.nid === item.nid)) return prev
      return [...prev, item]
    })
  }

  const removeFromCart = (nid: string) => {
    setItems(prev => prev.filter(i => i.nid !== nid))
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, count: items.length }}>
      {children}
    </CartContext.Provider>
  )
}
