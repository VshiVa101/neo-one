'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandedTitle } from '@/components/BrandedTitle'

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
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  count: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

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
    setItems((prev) => {
      if (prev.find((i) => i.nid === item.nid)) return prev
      return [...prev, item]
    })
  }

  const removeFromCart = (nid: string) => {
    setItems((prev) => prev.filter((i) => i.nid !== nid))
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, count: items.length, isCartOpen, setIsCartOpen }}>
      {children}
      
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8 overflow-y-auto custom-scrollbar"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#d99f9f] rounded-full z-[1010] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <img src="/images/ui/esccc.webp" className="w-1/2 h-1/2 object-contain" />
            </motion.button>

            <div className="w-full max-w-4xl flex flex-col gap-8 lg:gap-12 py-12 neo-skip-branding" data-neo-skip="true">
              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                <h2 className="font-neo text-[#F45390] text-3xl lg:text-5xl tracking-[0.2em] uppercase branded-title">
                  <BrandedTitle text="Carrello" />
                </h2>
                <div className="flex flex-row flex-wrap gap-4 mt-4">
                  {items.length === 0 ? (
                    <p className="font-neo text-white/30 text-sm tracking-widest uppercase">Il tuo carrello è vuoto</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.nid} className="relative group w-20 h-20 lg:w-32 lg:h-32 border border-white/10 overflow-hidden bg-[#111]">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <button 
                          onClick={() => removeFromCart(item.nid)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <span className="font-neo text-white text-[10px] uppercase tracking-tighter">Rimuovi</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Neo's Proposal (Static Message) */}
              <div className="flex flex-col gap-2">
                <h3 className="font-neo text-[#768b1a] text-xl lg:text-2xl tracking-widest uppercase">Proposta di Neo</h3>
                <p className="font-neo text-white text-sm lg:text-base tracking-wide leading-relaxed lowercase opacity-80">
                  ciao, sono neo. ogni opera è un pezzo unico o parte di una tiratura limitatissima. 
                  se hai scelto qualcosa, significa che abbiamo una vibrazione in comune. 
                  scrivimi qui sotto cosa ti ha colpito e ti ricontatterò per definire i dettagli della spedizione e del possesso. 
                  nessuna censura, solo arte.
                </p>
              </div>

              {/* Contact Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">Messaggio per l'artista</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="scrivi qui..."
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#768b1a] transition-colors min-h-[150px] resize-none lowercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">Il tuo nome</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="nome..."
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#768b1a] transition-colors lowercase"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">La tua email</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email..."
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#768b1a] transition-colors lowercase"
                    />
                  </div>

                  {/* Submit Button (V) */}
                  <div className="flex justify-center lg:justify-start mt-4">
                    <motion.button
                      disabled={!isEmailValid}
                      whileHover={isEmailValid ? { scale: 1.1 } : {}}
                      whileTap={isEmailValid ? { scale: 0.9 } : {}}
                      className={`w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isEmailValid ? 'bg-[#768b1a] cursor-pointer' : 'bg-gray-800 opacity-20 cursor-not-allowed'}`}
                    >
                      <img src="/images/ui/check.webp" className="w-1/2 h-1/2 object-contain" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}
