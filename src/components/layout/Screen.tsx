import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Starfield } from '@/components/widgets/Starfield'

/**
 * Page shell: safe-area top, optional atmosphere layer,
 * bottom padding clearing the tab bar.
 */
export function Screen({
  children,
  aurora = false,
  className,
}: {
  children: ReactNode
  aurora?: boolean
  className?: string
}) {
  return (
    <div className={cn('relative min-h-dvh overflow-x-clip pt-[max(16px,env(safe-area-inset-top))]', className)}>
      {aurora && (
        <>
          <div className="aurora" aria-hidden />
          <Starfield />
        </>
      )}
      <div className="relative pb-[calc(84px+env(safe-area-inset-bottom,0px))]">{children}</div>
    </div>
  )
}

/** Large page title block */
export function PageTitle({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between px-5 pt-2 pb-5">
      <div className="min-w-0">
        <h1 className="font-display text-[26px] leading-tight font-semibold text-ink tracking-[-0.01em]">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-mute mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
