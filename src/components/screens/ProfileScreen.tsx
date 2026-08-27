import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  History,
  Layers,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Input } from '@/components/ui/Input'
import { OrderRow } from '@/components/widgets/cards'
import { CountUp } from '@/components/widgets/interactive'
import { toast } from '@/components/ui/Toast'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { SERVICES } from '@/lib/data'

export function ProfileScreen() {
  const { state, topUp, pushOverlay, openOrder, logout } = useStore()
  const { hapticFeedback } = useTelegram()

  const [topUpOpen, setTopUpOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('5000')
  const [confirmLogout, setConfirmLogout] = useState(false)

  const activeOrders = state.orders.filter(
    (o) => o.status !== 'done' && o.status !== 'cancelled'
  )
  const completedOrders = state.orders.filter((o) => o.status === 'done')

  const getServiceName = (serviceId: string) => {
    const s = SERVICES.find((item) => item.id === serviceId)
    return s ? s.title : 'Дизайн-проект'
  }

  const handleTopUp = () => {
    const amount = Number(topUpAmount)
    if (isNaN(amount) || amount <= 0) return
    topUp(amount)
    hapticFeedback('impact')
    toast(`Баланс пополнен на ${amount.toLocaleString('ru-RU')} ₽`)
    setTopUpOpen(false)
  }

  const handleLogout = () => {
    hapticFeedback('impact')
    setConfirmLogout(false)
    logout()
    toast('Вы вышли из пространства')
  }

  return (
    <div className="relative min-h-dvh bg-void text-ink pb-24 select-none">
      {/* Top Bar with Settings */}
      <div className="pt-[max(12px,env(safe-area-inset-top))] px-5 flex items-center justify-between pb-3">
        <h1 className="font-display text-[20px] font-bold text-ink tracking-tight">
          Профиль
        </h1>

        <button
          onClick={() => {
            hapticFeedback('selection')
            pushOverlay('settings')
          }}
          aria-label="Настройки"
          className="w-9 h-9 rounded-full bg-surface/80 border border-line flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all"
        >
          <Settings size={17} />
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-surface/90 border border-linex/80 p-5 shadow-xl backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-raise border border-linex flex items-center justify-center text-xl font-bold text-accent-bright shadow-inner overflow-hidden">
                {state.user?.avatar ? (
                  <img
                    src={state.user.avatar}
                    alt={state.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-accent-bright" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-void" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-ink truncate">
                  {state.user?.name || 'Гость'}
                </h2>
              </div>
              <p className="text-xs text-mute truncate font-mono mt-0.5">
                {state.user?.username
                  ? `@${state.user.username}`
                  : state.user?.email || 'Авторизованный клиент'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/[0.12] text-accent-bright border border-accent/25">
                  <Sparkles size={10} />
                  {state.user?.tier || 'VIP Client'}
                </span>
                <span className="text-[10px] font-mono text-dim">
                  {state.user?.provider === 'telegram'
                    ? 'Telegram Sync'
                    : state.user?.provider === 'google'
                      ? 'Google Auth'
                      : 'Guest Access'}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Widget inside User Card with animated CountUp numbers */}
          <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-mute uppercase font-mono tracking-wider block">
                Баланс
              </span>
              <span className="font-display text-xl font-bold text-ink">
                <CountUp value={state.balance} /> ₽
              </span>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="rounded-full px-4 gap-1.5 bg-raise/80 border-line hover:bg-raise"
              onClick={() => {
                hapticFeedback('selection')
                setTopUpOpen(true)
              }}
            >
              <Plus size={14} />
              <span>Пополнить</span>
            </Button>
          </div>
        </motion.div>

        {/* Active Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display text-sm font-semibold text-ink flex items-center gap-2">
              <Layers size={16} className="text-accent-bright" />
              <span>Активные заказы</span>
            </h3>
            {activeOrders.length > 0 && (
              <span className="text-[11px] font-mono text-dim">
                {activeOrders.length}
              </span>
            )}
          </div>

          {activeOrders.length > 0 ? (
            <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
              {activeOrders.map((o) => (
                <OrderRow
                  key={o.id}
                  order={o}
                  serviceName={getServiceName(o.serviceId)}
                  onClick={() => openOrder(o.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-surface/50 border border-line text-center">
              <Clock size={24} className="mx-auto text-dim mb-2 opacity-50" />
              <p className="text-xs font-semibold text-ink mb-1">Активных заказов нет</p>
              <p className="text-[11px] text-mute max-w-[240px] mx-auto leading-relaxed mb-3">
                Выбери услугу — студия ответит в течение пары часов.
              </p>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => pushOverlay('order-create')}
              >
                Заказать проект
              </Button>
            </div>
          )}
        </div>

        {/* Completed History Section */}
        {completedOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1 pt-2">
              <h3 className="font-display text-sm font-semibold text-ink flex items-center gap-2">
                <History size={16} className="text-dim" />
                <span>История</span>
              </h3>
              <span className="text-[11px] font-mono text-dim">{completedOrders.length}</span>
            </div>

            <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
              {completedOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => openOrder(o.id)}
                  className="p-3.5 hover:bg-white/[0.02] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate">{o.title}</p>
                    <p className="text-[11px] text-dim font-mono mt-0.5">
                      {o.price.toLocaleString('ru-RU')} ₽ · Завершён
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-dim shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Action Card */}
        <div className="pt-2">
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full p-3.5 rounded-2xl bg-surface/30 border border-line/60 hover:border-err/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs font-medium text-mute hover:text-err group"
          >
            <LogOut size={14} className="text-dim group-hover:text-err transition-colors" />
            <span>Выйти из пространства</span>
          </button>
        </div>
      </div>

      {/* Top-up Sheet */}
      <AnimatePresence>
        {topUpOpen && (
          <Sheet open={topUpOpen} onClose={() => setTopUpOpen(false)} title="Пополнить баланс">
            <div className="space-y-4 pt-1">
              <p className="text-xs text-mute">Баланс тратится на оплату заказов студии.</p>

              <div>
                <label className="block text-xs text-mute mb-1.5 font-medium">
                  Сумма в рублях
                </label>
                <Input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['5000', '15000', '50000'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTopUpAmount(val)}
                    className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                      topUpAmount === val
                        ? 'bg-accent/15 border-accent/40 text-accent-bright font-bold'
                        : 'bg-surface border-line text-mute hover:text-ink'
                    }`}
                  >
                    +{Number(val).toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>

              <Button size="lg" className="w-full rounded-full" onClick={handleTopUp}>
                Пополнить
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Sheet */}
      <AnimatePresence>
        {confirmLogout && (
          <Sheet
            open={confirmLogout}
            onClose={() => setConfirmLogout(false)}
            title="Выйти из пространства?"
          >
            <p className="text-sm text-mute -mt-1 mb-5">
              Вы вернётесь на экран авторизации. Все сохранённые данные и история заказов останутся в безопасности.
            </p>
            <div className="flex gap-2.5">
              <Button
                variant="secondary"
                className="flex-1 rounded-full"
                onClick={() => setConfirmLogout(false)}
              >
                Отмена
              </Button>
              <Button variant="danger" className="flex-1 rounded-full" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
