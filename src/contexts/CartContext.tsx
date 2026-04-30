'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandedTitle } from '@/components/BrandedTitle'
import { fetchCartSettings, submitCart } from '@/app/(frontend)/home/actions'

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
  const [isSuccess, setIsSuccess] = useState(false)

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
    if (!isEmailValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await submitCart({
        name,
        email,
        message,
        items: items.map((i) => ({ title: i.title, nid: i.nid, quantity: i.quantity })),
      })

      if (res.success) {
        setIsSuccess(true)
        setItems([])
        setName('')
        setEmail('')
        setMessage('')
        // Chiudi dopo 3 secondi
        setTimeout(() => {
          setIsCartOpen(false)
          setIsSuccess(false)
        }, 3000)
      } else {
        alert(res.error)
      }
    } catch (err) {
      alert("Errore durante l'invio.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center p-6 md:p-12 lg:p-20 overflow-y-auto custom-scrollbar"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed bottom-4 left-4 lg:bottom-6 lg:left-6 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#d99f9f] rounded-full z-[1010] shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-300"
            >
              <img src="/images/ui/esccc.webp" className="w-1/2 h-1/2 object-contain" />
            </motion.button>

            <div
              className="w-full max-w-4xl flex flex-col gap-8 lg:gap-12 py-12 neo-skip-branding"
              data-neo-skip="true"
            >
              {/* Cart Items */}
              {/* Cart Items Area */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-neo text-[#F45390] text-3xl lg:text-5xl tracking-[0.2em] uppercase branded-title">
                    <BrandedTitle text="Carrello" />
                  </h2>
                  {items.length > 0 && (
                    <span className="font-neo text-white/50 text-[10px] uppercase tracking-widest">
                      {items.reduce((acc, item) => acc + item.quantity, 0)} articoli selezionati
                    </span>
                  )}
                </div>

                <div className="flex flex-row flex-wrap gap-4 lg:gap-6 mt-4 min-h-[120px] lg:min-h-[160px] items-start">
                  {items.length === 0 ? (
                    <p className="font-neo text-white/30 text-sm tracking-widest uppercase">
                      Il tuo carrello è vuoto
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.nid}
                        className="relative group w-24 h-24 lg:w-40 lg:h-40 border border-white/10 overflow-hidden bg-[#111] transition-all duration-300 hover:border-[#F45390]/50"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Quantity Controls Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                          <div className="flex items-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.2, color: '#F45390' }}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.nid, -1)}
                              className="text-white text-xl font-neo p-2"
                            >
                              -
                            </motion.button>
                            <span className="font-neo text-white text-lg">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.2, color: '#768b1a' }}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.nid, 1)}
                              className="text-white text-xl font-neo p-2"
                            >
                              +
                            </motion.button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.nid)}
                            className="font-neo text-white/40 text-[9px] uppercase tracking-tighter hover:text-white transition-colors"
                          >
                            Rimuovi tutto
                          </button>
                        </div>

                        {/* Badge per quantità visibile se > 1 e non hovered */}
                        {item.quantity > 1 && (
                          <div className="absolute top-1 right-1 bg-[#F45390] text-black font-neo text-[10px] w-5 h-5 flex items-center justify-center rounded-full group-hover:opacity-0 transition-opacity">
                            {item.quantity}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Informazioni Section */}
              <div className="flex flex-col gap-2">
                <h3 className="font-neo text-[#768b1a] text-xl lg:text-2xl tracking-widest uppercase">
                  Informazioni
                </h3>
                <div className="font-neo text-white text-sm lg:text-base tracking-wide leading-relaxed lowercase opacity-80">
                  {shippingNotice ? (
                    typeof shippingNotice === 'string' ? (
                      <p>{shippingNotice}</p>
                    ) : (
                      // If it's Lexical JSON, we'd ideally use a renderer.
                      // Here we provide a fallback message if it's complex,
                      // but usually it will be rendered or we can extract text.
                      <p>
                        {/* Fallback extraction for Lexical */}
                        {(shippingNotice as any)?.root?.children?.[0]?.children?.[0]?.text ||
                          'ciao, sono neo. controlla le tue impostazioni nel pannello admin.'}
                      </p>
                    )
                  ) : (
                    <p>
                      ciao, sono neo. ogni opera è un pezzo unico o parte di una tiratura
                      limitatissima. se hai scelto qualcosa, significa che abbiamo una vibrazione in
                      comune. scrivimi qui sotto cosa ti ha colpito e ti ricontatterò per definire i
                      dettagli della spedizione e del possesso. nessuna censura, solo arte.
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
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#768b1a] transition-colors min-h-[150px] resize-none lowercase"
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
                      className="w-full bg-white/5 border border-white/10 p-4 font-neo text-white text-sm focus:outline-none focus:border-[#768b1a] transition-colors lowercase"
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
                      placeholder={showEmailError ? 'non è una email....' : 'email...'}
                      className={`w-full bg-white/5 border p-4 font-neo text-white text-sm focus:outline-none transition-colors lowercase ${
                        showEmailError
                          ? 'border-[#F45390] text-[#F45390] placeholder-[#F45390]'
                          : 'border-white/10 focus:border-[#768b1a]'
                      }`}
                    />
                    <AnimatePresence>
                      {showEmailError && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="font-neo text-[#F45390] text-[10px] uppercase tracking-widest mt-1"
                        >
                          non è una email....
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button (V) */}
                  <div className="flex justify-center lg:justify-start mt-4">
                    {isSuccess ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="font-neo text-[#768b1a] text-lg lg:text-xl tracking-widest uppercase flex items-center gap-4"
                      >
                        <img
                          src="/images/ui/check.webp"
                          className="w-12 h-12 object-contain grayscale-0"
                        />
                        vibrazione inviata...
                      </motion.div>
                    ) : (
                      <motion.button
                        disabled={!isEmailValid || isSubmitting}
                        whileHover={isEmailValid && !isSubmitting ? { scale: 1.1 } : {}}
                        whileTap={isEmailValid && !isSubmitting ? { scale: 0.9 } : {}}
                        onClick={handleSubmit}
                        className={`w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                          isEmailValid && !isSubmitting
                            ? 'bg-[#768b1a] cursor-pointer'
                            : 'bg-gray-800 opacity-20 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <img src="/images/ui/check.webp" className="w-1/2 h-1/2 object-contain" />
                        )}
                      </motion.button>
                    )}
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
