import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * TracingBeam — adapted from Aceternity UI.
 * A gradient beam on the left that draws itself as the content
 * scrolls, with a glowing dot riding its tip. Tracks the nearest
 * `.overlay-scroll` container (the stacked-screen scroller).
 */
export function TracingBeam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    containerRef.current = document.querySelector('.overlay-scroll')
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start 0.35', 'end 0.55'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  const dotTop = useTransform(smooth, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)

  return (
    <div ref={ref} className={cn('relative pl-8', className)}>
      {/* track */}
      <div
        className="absolute left-[10px] top-1 bottom-1 w-[2px] rounded-full bg-line overflow-hidden"
        aria-hidden
      >
        <motion.div
          style={{ scaleY: smooth }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-lavender to-sky"
        />
      </div>

      {/* glowing tip */}
      <motion.div
        style={{ top: dotTop }}
        className="absolute left-[11px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-bright shadow-glow-md"
        aria-hidden
      />

      {children}
    </div>
  )
}
