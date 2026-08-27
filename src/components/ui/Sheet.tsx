import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/** Bottom sheet with drag-to-dismiss. Mount inside <AnimatePresence>. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* scrim */}
      <div
        className="absolute inset-0 bg-abyss/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md bg-surface border-t border-linex rounded-t-3xl px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 90 || info.velocity.y > 600) onClose()
        }}
      >
        {/* grabber */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />
        {title && (
          <h2 className="font-display text-lg font-semibold text-ink mb-4">{title}</h2>
        )}
        {children}
      </motion.div>
    </motion.div>
  )
}
