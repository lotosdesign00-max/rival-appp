import { Children, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * InfiniteRow — Magic UI "Infinite Moving Cards", adapted:
 * the row is duplicated and scrolled by a seamless CSS animation,
 * pauses on hover, edge fades in the current theme color.
 * Under prefers-reduced-motion: static single row.
 */
export function InfiniteRow({
  children,
  duration = 45,
  direction = 'left',
  className,
}: {
  children: ReactNode
  /** seconds for one full loop */
  duration?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const items = Children.toArray(children)

  return (
    <div className={cn('group relative', className)}>
      <ul
        className="animate-infinite-scroll flex w-max gap-3 px-5"
        style={
          {
            '--infinite-duration': `${duration}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
          } as CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-3" aria-hidden={copy === 1}>
            {items.map((child, i) => (
              <li key={i} className="shrink-0">
                {child}
              </li>
            ))}
          </div>
        ))}
      </ul>

      {/* edge fades in page color */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-void to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-void to-transparent"
        aria-hidden
      />
    </div>
  )
}
