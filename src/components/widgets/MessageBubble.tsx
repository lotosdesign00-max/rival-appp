import { motion } from 'framer-motion'
import { BrandMark } from './BrandMark'
import type { ChatMessage } from '@/lib/types'

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] bg-raise border border-linex rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed text-ink whitespace-pre-wrap">
          {msg.text}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-2.5"
    >
      <div className="shrink-0 mt-0.5">
        <BrandMark size={22} />
      </div>
      <div className="min-w-0 max-w-[88%]">
        {msg.contextLabel && (
          <span className="inline-flex items-center mb-1.5 px-2 py-0.5 rounded-full bg-accent/[0.10] border border-accent/25 text-[11px] text-accent-bright max-w-full truncate">
            контекст: {msg.contextLabel}
          </span>
        )}
        <p
          className={`text-[15px] leading-relaxed text-ink/90 whitespace-pre-wrap ${
            msg.pending ? 'stream-caret' : ''
          }`}
        >
          {msg.text}
        </p>
      </div>
    </motion.div>
  )
}
