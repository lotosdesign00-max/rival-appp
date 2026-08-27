import React from 'react'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full px-4 bg-raise/60 border border-line rounded-xl text-[15px] text-ink placeholder:text-dim ' +
  'focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 ' +
  'transition-all duration-200'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, 'h-12', className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, 'py-3 min-h-[110px] resize-none leading-relaxed', className)}
      {...props}
    />
  )
}
