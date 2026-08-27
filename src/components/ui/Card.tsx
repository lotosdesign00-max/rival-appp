import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raise' | 'interactive'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface border-line',
    raise: 'bg-raise border-linex shadow-raise',
    interactive:
      'bg-surface border-line active:scale-[0.985] active:border-linex transition-all duration-200 ease-out cursor-pointer',
  }

  return (
    <div
      className={cn('rounded-2xl border shadow-inner-top', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-[15px] font-semibold text-ink', className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-mute', className)} {...props} />
}
