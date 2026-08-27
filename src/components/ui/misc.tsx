import React, { useState } from 'react'
import { cn } from '@/lib/utils'

// ── Section header ──

export function SectionHeader({
  title,
  action,
  onAction,
  className,
}: {
  title: string
  action?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
        <span className="line-grow-y block h-3.5 w-[3px] rounded-full bg-gradient-to-b from-accent to-lavender" aria-hidden />
        {title}
      </h2>
      {action && (
        <button
          onClick={onAction}
          className="text-[13px] text-mute hover:text-ink transition-colors py-1 -mr-1"
        >
          {action}
        </button>
      )}
    </div>
  )
}

// ── Empty state ──

export function EmptyState({
  icon: Icon,
  title,
  hint,
  actionLabel,
  onAction,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  title: string
  hint?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center text-center px-8 py-14">
      <div className="orb-float w-14 h-14 rounded-2xl bg-surface border border-line flex items-center justify-center mb-4">
        <Icon size={22} className="text-dim" />
      </div>
      <p className="font-display font-semibold text-ink">{title}</p>
      {hint && <p className="text-sm text-mute mt-1.5 max-w-[240px]">{hint}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 h-10 px-5 rounded-xl bg-accent/[0.12] border border-accent/30 text-accent-bright text-sm font-medium active:scale-95 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// ── Toggle switch ──

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-[46px] h-[28px] rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-accent' : 'bg-line'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-transform duration-200 ease-out',
          checked && 'translate-x-[18px]'
        )}
      />
    </button>
  )
}

// ── Avatar ──

export function Avatar({
  src,
  fallback,
  size = 'md',
  className,
}: {
  src?: string
  fallback: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const [error, setError] = useState(false)
  const sizes = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
  }

  const inner = src && !error
    ? (
      <img
        src={src}
        alt=""
        className={cn('rounded-full object-cover', sizes[size], className)}
        onError={() => setError(true)}
      />
    )
    : (
      <div
        aria-hidden
        className={cn(
          'rounded-full bg-gradient-to-br from-accent/50 to-lavender/40',
          'flex items-center justify-center font-display font-semibold text-white select-none',
          sizes[size],
          className
        )}
      >
        {fallback.slice(0, 1).toUpperCase()}
      </div>
    )

  return <div className="ring-1 ring-linex rounded-full shrink-0">{inner}</div>
}

// ── Status pill (projects / orders) ──

export function statusMeta(status: string): { label: string; dot: string; text: string } {
  switch (status) {
    case 'active':
    case 'progress':
      return { label: 'В работе', dot: 'bg-sky', text: 'text-sky' }
    case 'review':
      return { label: 'На согласовании', dot: 'bg-warn', text: 'text-warn' }
    case 'done':
      return { label: 'Завершён', dot: 'bg-ok', text: 'text-ok' }
    case 'new':
      return { label: 'Новый', dot: 'bg-accent-bright', text: 'text-accent-bright' }
    default:
      return { label: 'Идея', dot: 'bg-mute', text: 'text-mute' }
  }
}

export function StatusPill({ status }: { status: string }) {
  const meta = statusMeta(status)
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
      <span className={cn('text-xs', meta.text)}>{meta.label}</span>
    </span>
  )
}
