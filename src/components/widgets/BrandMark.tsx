import { cn } from '@/lib/utils'

let uidCounter = 0

/**
 * Rival Space mark — lavender core on an orbit,
 * one red satellite (Rival Red lives here and almost nowhere else).
 */
export function BrandMark({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  const id = `rg${++uidCounter}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <ellipse
        cx="16"
        cy="16"
        rx="13.5"
        ry="5.4"
        transform="rotate(-24 16 16)"
        stroke="rgba(129,140,248,.45)"
        strokeWidth="1.3"
      />
      <circle cx="16" cy="16" r="6.2" fill={`url(#${id})`} />
      <circle cx="28" cy="11.6" r="1.9" fill="#E11D48" />
    </svg>
  )
}

/** Wordmark for splash / profile */
export function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <BrandMark size={compact ? 20 : 26} />
      <span
        className={cn(
          'font-display font-semibold tracking-[0.22em] text-ink',
          compact ? 'text-sm' : 'text-lg'
        )}
      >
        RIVAL
      </span>
      <span
        className={cn(
          'font-display font-medium tracking-[0.22em] text-dim',
          compact ? 'text-sm' : 'text-lg'
        )}
      >
        SPACE
      </span>
    </span>
  )
}
