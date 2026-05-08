'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BrandedTitle } from '@/components/BrandedTitle'
import { useState } from 'react'
import { X, Mail, User, FileText, MessageSquare, Send } from 'lucide-react'
import type { ContactFormData } from '@/data/calendar-mock'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to send')
      setStatus('sent')
      setTimeout(() => {
        setStatus('idle')
        setFormData({ name: '', email: '', subject: '', message: '' })
        onClose()
      }, 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputClass =
    'w-full bg-transparent border-b-2 border-[#555] text-white font-mono text-sm py-3 px-1 tracking-wide placeholder-[#555] focus:border-[#39ff14] focus:outline-none transition-colors duration-300'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg bg-black border-2 border-[#333] p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-neo text-white text-xl md:text-2xl tracking-widest lowercase">
                <BrandedTitle text="Contact" />
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center border border-[#555] text-[#a0a0a0] hover:text-[#39ff14] hover:border-[#39ff14] transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-[#555]"
                />
                <input
                  type="text"
                  placeholder="nome..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className={`${inputClass} pl-8 uppercase`}
                />
              </div>

              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-[#555]"
                />
                <input
                  type="email"
                  placeholder="email..."
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className={`${inputClass} pl-8 uppercase`}
                />
              </div>

              <div className="relative">
                <FileText
                  size={14}
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-[#555]"
                />
                <input
                  type="text"
                  placeholder="oggetto..."
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  required
                  className={`${inputClass} pl-8 uppercase`}
                />
              </div>

              <div className="relative">
                <MessageSquare
                  size={14}
                  className="absolute left-1 top-3 text-[#555]"
                />
                <textarea
                  placeholder="messaggio..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  required
                  rows={4}
                  className={`${inputClass} pl-8 resize-none uppercase`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="w-full py-3 border-2 border-[#39ff14] text-[#39ff14] font-mono text-sm tracking-widest uppercase hover:bg-[#39ff14] hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'idle' && (
                  <div className="flex items-center gap-2">
                    <Send size={14} />
                    <BrandedTitle text="invia" />
                  </div>
                )}
                {status === 'sending' && <BrandedTitle text="invio in corso..." />}
                {status === 'sent' && <BrandedTitle text="inviato!" />}
                {status === 'error' && <BrandedTitle text="errore - riprova" />}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
