import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl select-none ' +
    'transition-all duration-200 ease-out active:scale-[0.97] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void ' +
    'disabled:opacity-40 disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-accent text-white shadow-[0_1px_3px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.12)] hover:bg-accent-bright',
    secondary:
      'bg-raise text-ink border border-line hover:border-linex hover:bg-[#161B30]',
    ghost: 'bg-transparent text-mute hover:text-ink hover:bg-white/[0.04]',
    danger:
      'bg-transparent text-err border border-err/25 hover:border-err/50 hover:bg-err/[0.06]',
  }

  const sizes = {
    sm: 'h-9 px-3.5 text-sm',
    md: 'h-11 px-5 text-[15px]',
    lg: 'h-[52px] px-6 text-base',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
