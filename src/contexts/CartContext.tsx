'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'
import { fetchCartSettings, submitCart } from '@/app/(frontend)/home/actions'
import { normalizeNeoString } from '@/utilities/normalizeNeoText'

interface CartItem {
  nid: string
  title: string
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (nid: string) => void
  updateQuantity: (nid: string, delta: number) => void
  count: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
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
  const [shippingNotice, setShippingNotice] = useState<any>('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDissolving, setIsDissolving] = useState(false)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid

  // Persist in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('neo-cart')
      if (stored) setItems(JSON.parse(stored))

      // Fetch dynamic settings from Payload
      fetchCartSettings().then((settings) => {
        if (settings?.shippingPaymentNotice) {
          // Extraction basic text from Lexical if possible, or just use as is if we have a renderer
          // For now, let's just use the state. We'll handle rendering in the UI.
          setShippingNotice(settings.shippingPaymentNotice)
        }
      })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('neo-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.nid === item.nid)
      if (existing) {
        return prev.map((i) =>
          i.nid === item.nid ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (nid: string) => {
    setItems((prev) => prev.filter((i) => i.nid !== nid))
  }

  const updateQuantity = (nid: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.nid === nid ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const handleSubmit = async () => {
    if (!isEmailValid || !(items.length > 0 || message) || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await submitCart({
        name: name || 'Anonimo',
        email,
        message,
        items: items.map((i) => ({ title: i.title, nid: i.nid, quantity: i.quantity })),
      })

      if (res.success) {
        setIsSubmitting(false)
        setIsDissolving(true)
        setTimeout(() => {
          setItems([])
          setName('')
          setEmail('')
          setMessage('')
          setIsDissolving(false)
          setIsCartOpen(false)
        }, 1200)
      } else {
        setIsSubmitting(false)
        alert(res.error)
      }
    } catch (err) {
      setIsSubmitting(false)
      alert("Errore durante l'invio.")
    }
  }

  const [submitHovered, setSubmitHovered] = useState(false)

  const isActive = items.length > 0 || message.length > 0
  const isBrightPink = message.length > 0 && isEmailValid

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        count: items.reduce((acc, item) => acc + item.quantity, 0),
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390', boxShadow: '0 0 25px rgba(244, 83, 144, 0.6)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(false)}
              className="neo-interface-btn fixed bottom-4 left-4 lg:bottom-6 lg:left-6 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#B3828B] rounded-full z-[1100] transition-colors duration-300"
            >
              <Image src="/images/ui/esccc.webp" alt="Chiudi" width={64} height={64} className="w-[62%] h-[62%] object-contain" style={{ transform: 'scale(1.5)' }} unoptimized />
            </motion.button>

            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
              <div className="w-full min-h-full flex flex-col items-center p-6 md:p-12 lg:p-20">
                <div className={`w-full max-w-4xl flex flex-col gap-8 lg:gap-12 py-12 ${isDissolving ? 'cart-dissolving' : ''}`}>
              {/* Cart Items Area */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-neo text-[#809829] text-3xl lg:text-5xl tracking-[0.2em] uppercase">
                    Carrello
                  </h2>
                  <span className="font-neo text-[#809829] text-lg lg:text-2xl tracking-widest">
                    TOT {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex flex-row flex-wrap gap-4 lg:gap-6 mt-4 min-h-[120px] lg:min-h-[160px] items-start">
                  {items.length === 0 ? (
                    <p className="font-neo text-white/30 text-sm tracking-widest uppercase">
                      {normalizeNeoString('Il tuo carrello è vuoto')}
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.nid}
                        className="flex items-center gap-2 lg:gap-4"
                      >
                        <div className="w-24 h-24 lg:w-36 lg:h-36 border border-white/10 overflow-hidden bg-[#111] flex-shrink-0 relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 144px"
                          />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <span className="font-neo text-white text-xl lg:text-2xl">{item.quantity}</span>
                          <div className="flex flex-col gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.15, backgroundColor: '#809829', boxShadow: '0 0 20px rgba(128, 152, 41, 0.5)' }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.nid, 1)}
                              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-neo text-sm lg:text-base transition-colors duration-200"
                            >
                              +
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15, backgroundColor: '#F45390', boxShadow: '0 0 20px rgba(244, 83, 144, 0.5)' }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.nid, -1)}
                              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-neo text-sm lg:text-base transition-colors duration-200"
                            >
                              -
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Informazioni Section */}
              <div className="flex flex-col gap-2">
                <h3 className="font-neo text-[#809829] text-xl lg:text-2xl tracking-widest uppercase">
                  Informazioni
                </h3>
                <div className="font-neo text-white text-sm lg:text-base tracking-wide leading-relaxed uppercase opacity-80">
                  {shippingNotice ? (
                    typeof shippingNotice === 'string' ? (
                      <p>{normalizeNeoString(shippingNotice)}</p>
                    ) : (
                      <p>
                        {normalizeNeoString(
                          (shippingNotice as any)?.root?.children?.[0]?.children?.[0]?.text ||
                            'ciao, sono neo. controlla le tue impostazioni nel pannello admin.',
                        )}
                      </p>
                    )
                  ) : (
                    <p>
                      {normalizeNeoString(
                        'ciao, sono neo. ogni opera è un pezzo unico o parte di una tiratura limitatissima. se hai scelto qualcosa, significa che abbiamo una vibrazione in comune. scrivimi qui sotto cosa ti ha colpito e ti ricontatterò per definire i dettagli della spedizione e del possesso. nessuna censura, solo arte.',
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">
                      Messaggio per l'artista
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="flame,insulti,e messaggi minatori saranno collezzionati"
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#809829] transition-colors min-h-[150px] resize-none uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">
                      Il tuo nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="nome..."
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#809829] transition-colors uppercase"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] uppercase tracking-[0.3em]">
                      La tua email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder={showEmailError ? normalizeNeoString('non è una email....') : 'email...'}
                      className={`w-full bg-white/5 border p-4 font-neo text-white text-sm focus:outline-none transition-colors uppercase ${
                        showEmailError
                          ? 'border-[#809829] text-[#809829] placeholder-[#809829]'
                          : 'border-white/10 focus:border-[#809829]'
                      }`}
                    />
                    <AnimatePresence>
                      {showEmailError && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="font-neo text-[#809829] text-[10px] uppercase tracking-widest mt-1"
                        >
                          {normalizeNeoString('non è una email....')}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button (V) */}
                  <div className="flex justify-center lg:justify-start mt-4">
                      <motion.button
                        disabled={!isEmailValid || !(items.length > 0 || message) || isSubmitting}
                        onMouseEnter={() => setSubmitHovered(true)}
                        onMouseLeave={() => setSubmitHovered(false)}
                        animate={{
                          scale: submitHovered && isActive ? 1.15 : 1,
                          backgroundColor: submitHovered && isActive 
                            ? '#809829' 
                            : isBrightPink 
                              ? '#F45390' 
                              : isActive 
                                ? '#B3828B' 
                                : '#1a1a1a',
                          boxShadow: submitHovered && isActive
                            ? '0 0 30px rgba(128, 152, 41, 0.8), 0 0 60px rgba(128, 152, 41, 0.3)'
                            : isBrightPink
                              ? '0 0 20px rgba(244, 83, 144, 0.4)'
                              : 'none'
                        }}
                        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                        whileTap={isActive ? { scale: 0.9 } : {}}
                        onClick={handleSubmit}
                        className={`neo-interface-btn w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full transition-all duration-300 ${
                          isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Image
                            src={
                              submitHovered && isActive
                                ? '/images/ui/invia-mailverde.webp'
                                : isActive
                                  ? '/images/ui/invia-mailrosa.webp'
                                  : '/images/ui/invia-ssmail.webp'
                            }
                            alt="Invia"
                            width={40}
                            height={40}
                            className="w-1/2 h-1/2 object-contain"
                            style={{ transform: 'scale(1.5)' }}
                            unoptimized
                          />
                        )}
                      </motion.button>
                  </div>
                </div>
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
