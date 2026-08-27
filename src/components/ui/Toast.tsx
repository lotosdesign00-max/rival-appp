import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type ToastFn = (text: string) => void

let pushToast: ToastFn = () => {}

/** Imperative toast: import `toast()` anywhere, mount <Toaster /> once. */
export const toast: ToastFn = (text) => pushToast(text)

export function Toaster() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([])

  useEffect(() => {
    let seq = 0
    pushToast = (text) => {
      const id = ++seq
      setItems((prev) => [...prev.slice(-1), { id, text }])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id))
      }, 2600)
    }
    return () => {
      pushToast = () => {}
    }
  }, [])

  return (
    <div
      aria-live="polite"
      className="fixed left-0 right-0 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] z-[70] flex justify-center px-5 pointer-events-none"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-raise border border-linex shadow-raise rounded-full pl-3.5 pr-4 py-2.5 text-sm text-ink max-w-full truncate inline-flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" aria-hidden />
            <span className="truncate">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
