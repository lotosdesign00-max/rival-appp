import React from 'react'
import { cn } from '@/lib/utils'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ className, active, children, ...props }: ChipProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'h-9 px-4 rounded-full text-sm font-medium whitespace-nowrap border',
        'transition-all duration-200 ease-out active:scale-95',
        active
          ? 'bg-accent/[0.14] text-accent-bright border-accent/40 shadow-glow-sm'
          : 'bg-transparent text-mute border-line hover:border-linex hover:text-ink',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ChipGroupProps {
  chips: { id: string; label: string }[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function ChipGroup({ chips, activeId, onChange, className }: ChipGroupProps) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5', className)}
    >
      {chips.map((chip) => (
        <Chip key={chip.id} active={activeId === chip.id} onClick={() => onChange(chip.id)}>
          {chip.label}
        </Chip>
      ))}
    </div>
  )
}
