import React from 'react';
import { Home, Sparkles, Plus, Image as ImageIcon, User } from 'lucide-react';
import { NavTab } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenCreateOrder: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = React.memo(({
  activeTab,
  onTabChange,
  onOpenCreateOrder
}) => {
  const { t } = useTranslation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#07070a]/95 backdrop-blur-xl border-t border-zinc-900 px-2 sm:px-4 py-2"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* HOME */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 px-2.5 min-w-[52px] min-h-[44px] rounded-lg ${
            activeTab === 'home'
              ? 'text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : ''}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider">{t('nav_home')}</span>
        </button>

        {/* AI */}
        <button
          onClick={() => onTabChange('ai')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 px-2.5 min-w-[52px] min-h-[44px] rounded-lg ${
            activeTab === 'ai'
              ? 'text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'ai' ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : ''}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider">{t('nav_ai')}</span>
        </button>

        {/* Floating Center Plus Action Button for Create Order */}
        <div className="relative -top-2">
          <button
            onClick={onOpenCreateOrder}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-300/30 hover:scale-105 active:scale-95 transition-all group"
            aria-label={t('nav_create')}
            title={t('nav_create')}
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* GALLERY */}
        <button
          onClick={() => onTabChange('gallery')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 px-2.5 min-w-[52px] min-h-[44px] rounded-lg ${
            activeTab === 'gallery'
              ? 'text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ImageIcon className={`w-5 h-5 ${activeTab === 'gallery' ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : ''}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider">{t('nav_gallery')}</span>
        </button>

        {/* PROFILE */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 px-2.5 min-w-[52px] min-h-[44px] rounded-lg ${
            activeTab === 'profile'
              ? 'text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : ''}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider">{t('nav_profile')}</span>
        </button>
      </div>
    </nav>
  );
});

