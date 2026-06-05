'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { fetchCartSettings, submitCart } from '@/app/(frontend)/home/actions'
import { normalizeNeoString } from '@/utilities/normalizeNeoText'
import { useModalHistory } from '@/hooks/useModalHistory'
import { MagicTriangle } from '@/components/MagicTriangle'

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

  // Block body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  // Back button support: close cart panel instead of navigating away
  const closeCart = React.useCallback(() => setIsCartOpen(false), [])
  useModalHistory(isCartOpen, closeCart, 'cart')

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

  const [explodeScale, setExplodeScale] = useState(0)

  useEffect(() => {
    if (isDissolving) {
      let start = performance.now()
      let req: number
      const animate = (time: number) => {
        const elapsed = time - start
        const progress = Math.min(elapsed / 1200, 1)
        const ease = progress === 0 ? 0 : Math.pow(2, 10 * progress - 10)
        setExplodeScale(ease * 1000)
        
        if (progress < 1) {
          req = requestAnimationFrame(animate)
        }
      }
      req = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(req)
    } else {
      setExplodeScale(0)
    }
  }, [isDissolving])

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

      {/* SVG Filter for Pixel Explosion */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="pixel-explosion" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" result="noise" />
            <feComponentTransfer in="noise" result="pixelatedNoise">
              <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
              <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            </feComponentTransfer>
            <feDisplacementMap
              in="SourceGraphic"
              in2="pixelatedNoise"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={explodeScale}
              result="displaced"
            />
            <feColorMatrix
              in="displaced"
              type="matrix"
              values={`
                1 0 0 0 ${explodeScale / 1000}
                0 1 0 0 ${explodeScale / 2000}
                0 0 1 0 0
                0 0 0 ${1 - explodeScale / 1000} 0
              `}
            />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            key="cart-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl overflow-y-auto overflow-x-hidden custom-scrollbar cart-scroll-container"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="w-full min-h-max flex flex-col items-center px-4 py-8 md:p-12 lg:p-20 pb-24 md:pb-32 lg:pb-32">
              <motion.div 
                className={`w-full max-w-4xl flex flex-col gap-8 lg:gap-12`}
                style={{ filter: isDissolving ? 'url(#pixel-explosion)' : 'none' }}
                animate={isDissolving ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 1.2, ease: "easeIn" }}
              >
                {/* Cart Items Area */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-6 border-b border-white/10 pb-8">
                    <h2 className="font-neo text-[#A2D729] text-3xl lg:text-5xl tracking-[0.2em] uppercase mt-4">
                      Carrello
                    </h2>

                    <span className="font-neo text-[#A2D729] text-lg lg:text-2xl tracking-widest bg-[#A2D729]/10 px-6 py-2 rounded-full border border-[#A2D729]/30">
                      TOT {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="flex flex-row flex-wrap gap-4 lg:gap-6 mt-2 min-h-[120px] lg:min-h-[160px] items-start">
                    {items.length === 0 ? (
                      <div className="w-full flex items-center justify-center py-12">
                        <p className="font-neo text-white/30 text-sm tracking-widest uppercase">
                          {normalizeNeoString('Il tuo carrello è vuoto')}
                        </p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.nid}
                          className="flex items-center gap-3 lg:gap-4 bg-white/5 p-2 pr-4 lg:p-3 lg:pr-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-md overflow-hidden bg-[#111] flex-shrink-0 relative">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 80px, 128px"
                            />
                          </div>

                          <div className="flex flex-col items-center justify-center gap-2 lg:gap-3 ml-2 lg:ml-4">
                            <span className="font-neo text-white text-xl lg:text-2xl font-bold">{item.quantity}</span>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.15, backgroundColor: '#FF5696', boxShadow: '0 0 20px rgba(255, 86, 150, 0.5)' }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.nid, -1)}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-neo text-sm lg:text-base border border-white/10 transition-colors duration-200"
                              >
                                -
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.15, backgroundColor: '#A2D729', boxShadow: '0 0 20px rgba(162, 215, 41, 0.5)' }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.nid, 1)}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-neo text-sm lg:text-base border border-white/10 transition-colors duration-200"
                              >
                                +
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Informazioni Section */}
                <div className="flex flex-col gap-4 mt-4 bg-white/5 p-6 lg:p-8 border border-white/10 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A2D729] to-[#FF5696] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="font-neo text-[#A2D729] text-xl lg:text-2xl tracking-widest uppercase">
                    Informazioni
                  </h3>
                  <div className="font-neo text-white/90 text-sm lg:text-base tracking-wide leading-relaxed uppercase space-y-4">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-neo text-white/40 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] ml-1">
                      Messaggio per l'artista
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="flame, insulti, e messaggi minatori saranno collezionati..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-5 font-neo text-white text-sm lg:text-base focus:outline-none focus:border-[#A2D729] focus:bg-white/10 transition-all min-h-[160px] lg:min-h-full resize-none uppercase"
                    />
                  </div>

                  <div className="flex flex-col gap-5 lg:gap-6 justify-between">
                    {!isActive ? (
                      <div className="w-full flex items-center justify-center flex-grow min-h-[250px]">
                        <MagicTriangle variant="interactive" />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-2">
                            <label className="font-neo text-white/40 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] ml-1">
                              Il tuo nome
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="nome..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-5 font-neo text-white text-sm lg:text-base focus:outline-none focus:border-[#A2D729] focus:bg-white/10 transition-all uppercase"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-neo text-white/40 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] ml-1">
                              La tua email
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={() => setEmailTouched(true)}
                              placeholder={showEmailError ? normalizeNeoString('non è una email....') : 'email...'}
                              className={`w-full bg-white/5 border rounded-xl p-5 font-neo text-white text-sm lg:text-base focus:outline-none transition-all uppercase ${
                                showEmailError
                                  ? 'border-[#FF5696] text-[#FF5696] placeholder-[#FF5696]/50 focus:border-[#FF5696]'
                                  : 'border-white/10 focus:border-[#A2D729] focus:bg-white/10'
                              }`}
                            />
                            <AnimatePresence>
                              {showEmailError && (
                                <motion.span
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="font-neo text-[#FF5696] text-[10px] lg:text-[11px] uppercase tracking-widest mt-1 ml-1"
                                >
                                  {normalizeNeoString('non è una email....')}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Submit Button (V) */}
                        <div className="flex w-full mt-4 pt-2">
                          <motion.button
                            disabled={!isEmailValid || !(items.length > 0 || message) || isSubmitting}
                            onMouseEnter={() => setSubmitHovered(true)}
                            onMouseLeave={() => setSubmitHovered(false)}
                            animate={{
                              scale: submitHovered && isActive ? 1.02 : 1,
                              backgroundColor: submitHovered && isActive 
                                ? '#A2D729' 
                                : isBrightPink 
                                  ? '#FF5696' 
                                  : isActive 
                                    ? '#E295A4' 
                                    : '#1a1a1a',
                              boxShadow: submitHovered && isActive
                                ? '0 0 30px rgba(162, 215, 41, 0.8), 0 0 60px rgba(162, 215, 41, 0.3)'
                                : isBrightPink
                                  ? '0 0 20px rgba(255, 86, 150, 0.4)'
                                  : 'none'
                            }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            whileTap={isActive ? { scale: 0.98 } : {}}
                            onClick={handleSubmit}
                            className={`neo-interface-btn w-full h-[60px] lg:h-[64px] flex items-center justify-center rounded-xl transition-all duration-300 ${
                              isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            {isSubmitting ? (
                              <div className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <div 
                                className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0"
                                style={{ transform: 'scale(1.3)' }}
                              >
                                <Image
                                  src="/images/ui/busta-contatta.webp"
                                  alt="Invia"
                                  fill
                                  className="object-contain"
                                  unoptimized
                                  draggable={false}
                                />
                                <div
                                  className="absolute pointer-events-none select-none z-[9]"
                                  style={{
                                    width: '84%',
                                    height: '63%',
                                    left: '50%',
                                    top: '34%',
                                    transform: 'translate(-50%, -50%)',
                                    clipPath: 'polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)',
                                  }}
                                >
                                  <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                      y: ['120%', '120%', '15%', '15%', '120%', '120%']
                                    }}
                                    transition={{
                                      duration: 6,
                                      ease: "easeInOut",
                                      times: [0, 0.3, 0.45, 0.7, 0.82, 1],
                                      repeat: Infinity,
                                    }}
                                  >
                                    <Image
                                      src="/images/ui/web_4.webp"
                                      alt="Occhio"
                                      fill
                                      className="object-contain"
                                      unoptimized
                                      draggable={false}
                                    />
                                  </motion.div>
                                </div>
                              </div>
                            )}
                          </motion.button>
                        </div>

                        <MagicTriangle variant="small-static" />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Tasto Chiudi Separato e Fisso */}
        {isCartOpen && (
          <motion.div
            key="cart-close-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[1100]"
          >
            <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#FF5696', boxShadow: '0 0 25px rgba(255, 86, 150, 0.6)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(false)}
                className="neo-interface-btn w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#E295A4] rounded-full transition-colors duration-300"
              >
                <Image src="/images/ui/esccc.webp" alt="Chiudi" width={64} height={64} className="w-[62%] h-[62%] object-contain" style={{ transform: 'scale(1.5)' }} unoptimized />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}

