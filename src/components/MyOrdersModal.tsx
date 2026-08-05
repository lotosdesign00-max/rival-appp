import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Star, 
  Clock, 
  AlertTriangle, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Plus, 
  Layers, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

import { OrderDetailData, OrderRequest } from '../types';

import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";
import { getOrderStatusInfo } from '../utils/statusHelper';

interface MyOrdersModalProps {
  onClose: () => void;
  onOpenCreateOrder: () => void;
  onOpenOrderDetail?: (orderData?: OrderDetailData) => void;
  userOrders?: OrderRequest[];
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ 
  onClose,
  onOpenCreateOrder, 
  onOpenOrderDetail,
  userOrders = []
}) => {
    const { t } = useTranslation();
  const { notifications, unreadNotificationsCount } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'review' | 'completed'>('all');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCount = userOrders.filter(o => o.status !== 'Completed').length;
  const completedCount = userOrders.filter(o => o.status === 'Completed').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Map real user orders from AppContext or props
  const realOrdersList = (userOrders || []).map(ord => {
    const statusInfo = getOrderStatusInfo(ord.status);
    return {
      data: {
        id: ord.id,
        title: ord.projectType,
        status: ord.status,
        price: ord.budget,
        created: ord.createdAt,
        deadline: t('in_progress'),
        progressPercent: statusInfo.progressPercent,
        currentStepIndex: statusInfo.currentStepIndex,
        designer: {
          name: 'Rival Studio Team',
          role: 'Lead Designer',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
        },
        files: [],
        timeline: [
          { title: t('order_created'), time: ord.createdAt, active: true }
        ],
        designerNote: ord.description
      } as OrderDetailData,
      categoryTag: ord.projectType,
      badgeLabel: statusInfo.simpleLabel,
      badgeClass: statusInfo.badgeClass,
      timeText: ord.createdAt,
      timeIcon: statusInfo.isCompleted ? CheckCircle2 : Clock,
      timeIconClass: statusInfo.isCompleted ? 'text-emerald-400' : 'text-indigo-400',
      image: ord.attachmentUrl || '',
      isImagePlaceholder: !ord.attachmentUrl,
      filterType: statusInfo.isCompleted ? 'completed' : 'active'
    };
  });

  const filteredOrders = realOrdersList.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return o.filterType === 'active';
    if (activeFilter === 'review') return o.badgeLabel === 'Review' || o.badgeLabel === t('in_check');
    if (activeFilter === 'completed') return o.filterType === 'completed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP RIVAL SPACE HEADER BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors active:scale-95 flex items-center gap-1"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-base font-bold tracking-tight text-white font-sans">
            Rival Space
          </span>

          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors active:scale-95 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)]" />
              )}
            </button>

            {/* Notifications Popover */}
            {isNotificationsOpen && (
              <div className="absolute right-0 top-11 w-72 bg-[#0e0e16] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-40 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h4 className="text-xs font-bold text-white">{t('notifications')}</h4>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 4).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50 space-y-1">
                        <p className="text-xs text-zinc-200 font-semibold">{n.title}</p>
                        <p className="text-[10px] text-zinc-400">{n.message} • {n.time}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 text-center py-4">{t('no_new_notifications')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAGE TITLE & SUBTITLE */}
        <div className="space-y-1 px-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Track every project in real time.
          </p>
        </div>

        {/* SUMMARY CARD: ACTIVE PROJECTS */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            ACTIVE PROJECTS
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeCount}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Active
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {completedCount}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Completed
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-4" />

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
            <Star className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400" />
            <span>Average Rating 5.0</span>
          </div>
        </div>

        {/* FILTER PILLS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['all', 'active', 'review', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all shrink-0 ${
                activeFilter === f
                  ? 'bg-[#181534] text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ORDERS CARDS LIST */}
        <div className="space-y-4">
          {filteredOrders.map((ordItem, idx) => {
            const TimeIconComponent = ordItem.timeIcon;

            return (
              <div
                key={ordItem.data.id || idx}
                className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4 hover:border-zinc-700/80 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {ordItem.isImagePlaceholder ? (
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 text-zinc-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    ) : (
                      <img
                        src={ordItem.image}
                        alt={ordItem.data.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 shrink-0"
                      />
                    )}

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {ordItem.data.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-sans mt-0.5">
                        {ordItem.categoryTag}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold shrink-0 ${ordItem.badgeClass}`}>
                    {ordItem.badgeLabel}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-zinc-200 font-mono font-bold">{ordItem.data.progressPercent}%</span>
                  </div>

                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${ordItem.data.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <TimeIconComponent className={`w-3.5 h-3.5 ${ordItem.timeIconClass || 'text-zinc-400'}`} />
                    <span>{ordItem.timeText}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-200 font-semibold">{ordItem.data.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenOrderDetail) {
                        onOpenOrderDetail(ordItem.data);
                      } else {
                        showToast(`Детали заказа ${ordItem.data.title}`);
                      }
                    }}
                    className="px-4 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                  >
                    OPEN
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="p-8 sm:p-10 text-center rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-xl">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-xs mx-auto">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {t('no_orders_yet')}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {t('create_your_first_application')}</p>
              </div>
              <button
                onClick={onOpenCreateOrder}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 active:scale-95 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('create_an_order')}</span>
              </button>
            </div>
          )}
        </div>

        {/* CTA CARD: NEED ANOTHER PROJECT? */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Need another project?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Start a new request and get matched with top designers instantly.
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenCreateOrder();
            }}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            CREATE NEW ORDER
          </button>
        </div>
      </div>
    </div>
  );
};
