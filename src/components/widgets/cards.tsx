import { motion } from 'framer-motion'
import {
  Clapperboard,
  Disc,
  Hexagon,
  Image as ImageIcon,
  Layers,
  Send,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AccentKey, CaseStudy, Order, Service } from '@/lib/types'

// ── Status ──

export function orderStatusMeta(status: Order['status']): { label: string; dot: string; text: string } {
  switch (status) {
    case 'new':
      return { label: 'Новый', dot: 'bg-accent-bright', text: 'text-accent-bright' }
    case 'progress':
      return { label: 'В работе', dot: 'bg-sky', text: 'text-sky' }
    case 'review':
      return { label: 'На согласовании', dot: 'bg-warn', text: 'text-warn' }
    case 'done':
      return { label: 'Завершён', dot: 'bg-ok', text: 'text-ok' }
    case 'cancelled':
      return { label: 'Отменён', dot: 'bg-dim', text: 'text-dim' }
  }
}

export function OrderStatusPill({ status }: { status: Order['status'] }) {
  const meta = orderStatusMeta(status)
  const live = status === 'progress' || status === 'review'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex w-1.5 h-1.5">
        {live && (
          <span
            className={cn(
              'absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping',
              meta.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex w-1.5 h-1.5 rounded-full', meta.dot)} />
      </span>
      <span className={cn('text-xs', meta.text)}>{meta.label}</span>
    </span>
  )
}

// ── Service card ──

const SERVICE_ICONS: Record<string, typeof User> = {
  avatar: User,
  banner: ImageIcon,
  preview: Clapperboard,
  logo: Hexagon,
  identity: Layers,
  cover: Disc,
}

const SERVICE_GRADIENTS: Record<AccentKey, string> = {
  indigo: 'from-accent/40 to-accent/5',
  lavender: 'from-lavender/35 to-lavender/5',
  sky: 'from-sky/30 to-sky/5',
  rose: 'from-rose-400/30 to-transparent',
}

export function ServiceCard({
  service,
  onClick,
}: {
  service: Service
  onClick?: () => void
}) {
  const Icon = SERVICE_ICONS[service.id] ?? Hexagon
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-line rounded-2xl p-4 transition-all duration-200 ease-out active:scale-[0.985] hover:border-linex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            'shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br border border-line flex items-center justify-center',
            SERVICE_GRADIENTS[service.accent]
          )}
        >
          <Icon size={19} className="text-ink/90" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-display text-[15px] font-semibold text-ink">{service.title}</span>
            <span className="tnum text-sm text-accent-bright whitespace-nowrap">
              от {service.priceFrom.toLocaleString('ru-RU')} ₽
            </span>
          </span>
          <span className="block text-[13px] text-mute leading-snug mt-1">{service.description}</span>
          <span className="block text-[11px] text-dim mt-2">{service.days}</span>
        </span>
      </div>
    </button>
  )
}

// ── Case card ──

export function CaseCover({
  images,
  fallbacks,
  index = 0,
  className,
  animated = false,
  layoutId,
}: {
  images: string[]
  fallbacks: string[]
  index?: number
  className?: string
  /** slow ken-burns drift for hero covers */
  animated?: boolean
  /** shared-element morph: pass the same id on grid tile and detail hero */
  layoutId?: string
}) {
  const img = images[index % images.length]
  const fb = fallbacks[index % fallbacks.length]
  return (
    <motion.div
      layoutId={layoutId}
      className={cn('relative overflow-hidden grain', className)}
      style={{ background: fb }}
      aria-hidden
    >
      <div className={cn('absolute inset-[-6%]', animated && 'kenburns')}>
        {img && (
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-abyss/70 to-transparent" />
    </motion.div>
  )
}

export function CaseCard({
  item,
  onClick,
  featured = false,
  animated,
  className,
  layoutId,
}: {
  item: CaseStudy
  onClick?: () => void
  featured?: boolean
  /** override ken-burns (defaults to featured) */
  animated?: boolean
  className?: string
  layoutId?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'block w-full text-left bg-surface border border-line rounded-2xl overflow-hidden transition-all duration-200 ease-out active:scale-[0.985] hover:border-linex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60',
        className
      )}
    >
      <CaseCover
        images={item.images}
        fallbacks={item.fallbacks}
        className={featured ? 'aspect-[16/10]' : 'aspect-[16/9]'}
        animated={animated ?? featured}
        layoutId={layoutId}
      />
      <div className="p-3.5">
        <h3 className="font-display text-[15px] font-semibold text-ink leading-snug">{item.title}</h3>
        <p className="text-xs text-dim mt-1">
          {item.category} · {item.style}
        </p>
      </div>
    </button>
  )
}

/** Horizontal mini case card for strips */
export function CaseCardMini({
  item,
  onClick,
  className,
}: {
  item: CaseStudy
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'block w-[220px] shrink-0 text-left bg-surface border border-line rounded-2xl overflow-hidden transition-all duration-200 ease-out active:scale-[0.985]',
        className
      )}
    >
      <CaseCover images={item.images} fallbacks={item.fallbacks} className="aspect-[16/8]" />
      <div className="p-3">
        <h3 className="font-display text-sm font-semibold text-ink truncate">{item.title}</h3>
        <p className="text-[11px] text-dim mt-1">
          {item.category} · {item.style}
        </p>
      </div>
    </button>
  )
}

// ── Order row ──

export function OrderRow({
  order,
  serviceName,
  onClick,
}: {
  order: Order
  serviceName: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 active:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{order.title}</p>
          <p className="text-xs text-dim mt-0.5">
            {serviceName} · {order.id}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tnum text-sm text-ink">{order.price.toLocaleString('ru-RU')} ₽</p>
          <div className="mt-1">
            <OrderStatusPill status={order.status} />
          </div>
        </div>
      </div>
    </button>
  )
}

// ── Review card — tweet-style (Telegram instead of Twitter) ──

export function ReviewCard({
  text,
  author,
  tg,
  className,
  onProfile,
}: {
  text: string
  author: string
  tg: string
  className?: string
  /** avatar/name → профиль внутри приложения */
  onProfile?: () => void
}) {
  return (
    <figure
      className={cn(
        'shrink-0 w-[300px] bg-surface border border-line rounded-2xl p-4',
        className
      )}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        {/* avatar / name → профиль в приложении */}
        <button
          onClick={onProfile}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
        >
          <span className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent/50 to-lavender/40 flex items-center justify-center font-display text-sm font-semibold text-white">
            {author.slice(0, 1)}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold text-ink truncate">
              {author}
              <span
                className="shrink-0 w-[15px] h-[15px] rounded-full bg-[#229ED9] flex items-center justify-center"
                title={`@${tg}`}
              >
                <Send size={9} strokeWidth={3} className="text-white -ml-px" />
              </span>
            </span>
            <span className="block text-xs text-dim truncate">@{tg}</span>
          </span>
        </button>

        {/* telegram icon → аккаунт автора в Telegram */}
        <a
          href={`https://t.me/${tg}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Telegram ${author}`}
          className="shrink-0 w-8 h-8 rounded-full bg-[#229ED9]/[0.14] hover:bg-[#229ED9]/[0.24] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/60"
        >
          <Send size={14} className="text-[#229ED9]" />
        </a>
      </div>

      <blockquote className="text-[14px] leading-relaxed text-ink/90 line-clamp-4">
        {text}
      </blockquote>
    </figure>
  )
}

/** Staggered entrance helpers shared by lists */
export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}
export const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
}

export const MotionItem = motion.div
