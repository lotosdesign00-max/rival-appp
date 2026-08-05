import React from 'react';
import { Settings, Bell, Search, Shield } from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onNavigateHome: () => void;
  onOpenSearch?: () => void;
  onOpenAdmin?: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ 
  onOpenSettings, 
  onOpenNotifications, 
  onNavigateHome,
  onOpenSearch,
  onOpenAdmin,
  unreadNotificationsCount = 0
}) => {
  const { t } = useTranslation();
  const { isAdmin } = useApp();
  return (
    <header 
      className="sticky top-0 z-40 w-full bg-[#07070a]/90 backdrop-blur-md border-b border-zinc-900/80 px-4 py-3"
      style={{
        paddingTop: 'calc(0.75rem + max(env(safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)))'
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Brand Logo + Title */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group text-left transition-transform active:scale-95 min-h-[44px]"
          title="Rival Space"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-950 via-zinc-900 to-indigo-800 p-0.5 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-950/40 group-hover:border-indigo-400 transition-colors">
            {/* Glowing inner orb */}
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-600 opacity-90 blur-[1px] group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
            Rival Space
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
              OS
            </span>
          </span>
        </button>

        {/* Right: Search, Admin, Notification & Settings Actions */}
        <div className="flex items-center gap-1">
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-full transition-all active:scale-90 text-[11px] font-mono font-bold"
              aria-label="Admin Panel"
              title="Админ-панель"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>АДМИН</span>
            </button>
          )}

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors active:scale-90"
              aria-label="Search"
              title={t('search')}
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors active:scale-90 relative"
            aria-label="Notifications"
            title={t('notifications')}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)] animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors active:scale-90"
            aria-label="Settings"
            title={t('settings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
});
