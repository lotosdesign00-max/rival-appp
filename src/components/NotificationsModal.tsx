import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Box, 
  MessageSquare, 
  Star, 
  GraduationCap, 
  Bot, 
  Settings, 
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

import { ChatService } from '../services/ChatService';

interface NotificationsModalProps {
  onClose: () => void;
  onOpenMessages?: (chatId?: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose, onOpenMessages }) => {
    const { t } = useTranslation();
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Orders' | 'Messages' | 'Academy' | 'System'>('All');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderUpdatesNotifs, setOrderUpdatesNotifs] = useState(true);
  const [designerMsgsNotifs, setDesignerMsgsNotifs] = useState(true);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Orders': return Box;
      case 'Messages': return MessageSquare;
      case 'Academy': return GraduationCap;
      default: return Settings;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div 
        className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28"
        style={{
          paddingTop: 'max(1.25rem, env(safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px))',
          paddingBottom: 'max(7rem, env(safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))'
        }}
      >
        {/* TOP HEADER BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
            RIVAL SPACE
          </span>

          <div className="w-10" />
        </div>

        {/* PAGE TITLE & SUBTITLE */}
        <div className="space-y-1 px-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Everything important in one place.
          </p>
        </div>

        {/* SUMMARY CARD: NEW UPDATES / MARK ALL READ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
              TODAY
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} new updates` : 'All read'}
            </div>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* FILTER PILLS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['All', 'Orders', 'Messages', 'Academy', 'System'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                activeFilter === filter
                  ? 'bg-[#181534] text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-3">
          {filteredNotifications.map(item => {
            const IconComponent = getCategoryIcon(item.category);

            return (
              <div
                key={item.id}
                onClick={async () => {
                  if (item.isUnread) {
                    markNotificationRead(item.id);
                  }
                  if (onOpenMessages) {
                    onClose();
                    try {
                      const chat = await ChatService.getOrCreateChat(
                        item.category === 'Orders' ? 'order' : 'support',
                        undefined,
                        {
                          participantName: 'Rival Support',
                          participantAvatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-4993855-4161747.png'
                        }
                      );
                      onOpenMessages(chat?.id);
                    } catch (e) {
                      onOpenMessages();
                    }
                  }
                }}
                className={`p-4 rounded-2xl bg-[#0e0e16] border transition-all cursor-pointer space-y-2 ${
                  item.isUnread 
                    ? 'border-indigo-500/40 hover:border-indigo-500/70 shadow-lg' 
                    : 'border-zinc-800/80 hover:border-zinc-700 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/90 flex items-center justify-center shrink-0 text-zinc-300">
                    <IconComponent className="w-5 h-5 text-indigo-400" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {typeof item.title === 'string' ? item.title : (typeof item.title === 'object' && item.title !== null ? (item.title as any).title || String(item.title) : String(item.title || ''))}
                      </h4>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-400 font-mono">
                          {item.time}
                        </span>
                        {item.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.9)] animate-pulse" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {typeof item.message === 'string' ? item.message : (typeof item.message === 'object' && item.message !== null ? (item.message as any).message || JSON.stringify(item.message) : String(item.message || ''))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center rounded-3xl bg-[#0e0e16] border border-zinc-800 text-zinc-400 text-xs">
              {t('there_are_no_notifications_in')}</div>
          )}
        </div>

        {/* BOTTOM CARD: NOTIFICATION SETTINGS */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Notification Settings
              </h3>
              <p className="text-xs text-zinc-400">
                Manage what you receive.
              </p>
            </div>
          </div>

          {isSettingsOpen && (
            <div className="pt-2 space-y-3 border-t border-zinc-800/80 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Order Status Updates</span>
                <input 
                  type="checkbox" 
                  checked={orderUpdatesNotifs} 
                  onChange={(e) => setOrderUpdatesNotifs(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Designer Chat Messages</span>
                <input 
                  type="checkbox" 
                  checked={designerMsgsNotifs} 
                  onChange={(e) => setDesignerMsgsNotifs(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Email Digest Notifications</span>
                <input 
                  type="checkbox" 
                  checked={emailNotifs} 
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              if (isSettingsOpen) {
                showToast(t('notification_settings_saved'));
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            {isSettingsOpen ? 'Save Settings' : 'Open Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

