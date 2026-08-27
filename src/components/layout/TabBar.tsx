import { motion } from 'framer-motion'
import { GraduationCap, Home, Images, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore, type TabId } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'

export function TabBar() {
  const { tab, setTab, pushOverlay, t } = useStore()
  const { hapticFeedback } = useTelegram()

  const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'academy', label: t('navAcademy'), icon: GraduationCap },
    { id: 'gallery', label: t('navGallery'), icon: Images },
    { id: 'profile', label: t('navProfile'), icon: User },
  ]

  const renderTab = ({ id, label, icon: Icon }: (typeof tabs)[number]) => {
    const active = tab === id
    return (
      <button
        key={id}
        onClick={() => {
          if (!active) hapticFeedback('selection')
          setTab(id)
        }}
        aria-current={active ? 'page' : undefined}
        className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl"
      >
        {active && (
          <motion.span
            layoutId="tab-pill"
            className="absolute inset-x-0.5 inset-y-0 bg-accent/[0.10] rounded-xl"
            transition={{ type: 'spring', stiffness: 480, damping: 36 }}
          />
        )}
        <motion.span
          key={active ? `on-${id}` : `off-${id}`}
          initial={active ? { scale: 0.55 } : false}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          className="relative z-10 flex"
        >
          <Icon
            size={20}
            strokeWidth={active ? 2.2 : 1.8}
            className={cn(
              'transition-colors duration-200',
              active ? 'text-accent-bright' : 'text-dim'
            )}
          />
        </motion.span>
        <span
          className={cn(
            'relative z-10 text-[10px] leading-none pt-0.5 transition-colors duration-200',
            active ? 'text-accent-bright font-medium' : 'text-dim'
          )}
        >
          {label}
        </span>
      </button>
    )
  }

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed bottom-0 left-0 right-0 z-40 bg-void/[0.86] backdrop-blur-xl border-t border-line/70"
    >
      <div className="flex max-w-md mx-auto px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] items-end">
        {renderTab(tabs[0])}
        {renderTab(tabs[1])}

        {/* Center action — create order */}
        <div className="relative flex-1 flex justify-center">
          <button
            onClick={() => pushOverlay('order-create')}
            aria-label="Создать заказ"
            className={cn(
              'relative top-0 w-[46px] h-[46px] rounded-2xl group',
              'bg-gradient-to-br from-[#22D3EE] via-[#818CF8] to-[#A855F7]',
              'flex items-center justify-center text-white',
              'shadow-[0_8px_24px_rgba(34,211,238,0.25),0_8px_24px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,.18)]',
              'active:scale-90 transition-transform duration-150 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60'
            )}
          >
            <Plus
              size={24}
              strokeWidth={2.4}
              className="transition-transform duration-300 ease-out group-hover:rotate-90"
            />
          </button>
        </div>

        {renderTab(tabs[2])}
        {renderTab(tabs[3])}
      </div>
    </nav>
  )
}
