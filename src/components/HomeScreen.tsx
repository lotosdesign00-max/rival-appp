import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  GraduationCap, 
  MessageSquare, 
  Briefcase, 
  GitCommit, 
  RotateCw, 
  Wrench, 
  ChevronRight,
  Sparkles,
  Info,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { CaseStudy, NavTab, UpdateItem } from '../types';
import { FEATURED_CASE } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/StorageService';
import { motion, AnimatePresence } from 'motion/react';

interface HomeScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenCaseDetail: (caseStudy: CaseStudy) => void;
  onOpenCreateOrder: () => void;
  onOpenMessages?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = React.memo(({
  onNavigateTab,
  onOpenCaseDetail,
  onOpenCreateOrder,
  onOpenMessages
}) => {
  const { t } = useTranslation();
  const { announcement, updatesList } = useApp();
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);

  const displayUpdates = updatesList && updatesList.length > 0 ? updatesList : [];

  return (
    <div
      className="space-y-6 pb-20 animate-in fade-in duration-300"
    >
      {/* Dynamic Announcement Banner */}
      {announcement?.active && (
        <div 
          onClick={onOpenCreateOrder}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-indigo-950/90 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-lg shadow-indigo-950/50 cursor-pointer group hover:border-indigo-400 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4 animate-bounce" />
            </div>
            <p className="text-xs font-medium text-white group-hover:text-indigo-200 transition-colors">
              {announcement.text}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-300 shrink-0 group-hover:translate-x-1 transition-transform">
            <span>{announcement.linkText || 'Заказать'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Hero Title Header */}
      <div className="text-center pt-2 pb-2 space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-white font-sans uppercase">
          RIVAL SPACE
        </h1>
        <p className="text-[11px] sm:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase">
          PERFORMANCE BY DESIGN
        </p>
      </div>

      {/* Featured Case Card */}
      <div
        onClick={() => onOpenCaseDetail(FEATURED_CASE)}
        className="relative rounded-2xl border border-zinc-800/90 bg-[#0d0d14] overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={FEATURED_CASE.image}
            alt={FEATURED_CASE.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/40 to-transparent" />
        </div>

        {/* Card Content overlay */}
        <div className="p-5 relative -mt-16 sm:-mt-20 z-10 space-y-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-700/60 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider text-zinc-300 font-semibold uppercase">
              {FEATURED_CASE.tag}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            {FEATURED_CASE.title}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed font-sans">
            {FEATURED_CASE.description}
          </p>
        </div>
      </div>

      {/* MESSAGES BANNER / QUICK ACCESS */}
      {onOpenMessages && (() => {
        const storedConvs = StorageService.getItem('rival_conversations', []);
        const activeConv = storedConvs[0];
        const unreadTotal = storedConvs.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0);

        return (
          <div>
            <div 
              onClick={onOpenMessages}
              className="p-4 rounded-2xl bg-[#0e0e18] border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer shadow-lg flex items-center justify-between group"
            >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                {unreadTotal > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-mono font-bold flex items-center justify-center border-2 border-[#0e0e18]">
                    {unreadTotal}
                  </span>
                )}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {activeConv ? activeConv.name : t('messages_and_chat')}
                  </h3>
                  {activeConv && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
                      {activeConv.role}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {activeConv ? activeConv.lastMessage : t('start_a_new_conversation_with')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              <span>{t('open')}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          </div>
        );
      })()}

      {/* 2x2 Grid Navigation Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* 1. Галерея */}
        <button
          onClick={() => onNavigateTab('gallery')}
          className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121219] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#161622] transition-all text-left group min-h-[110px]"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700/80 transition-colors">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight mt-3">
            {t('home_gallery')}
          </span>
        </button>

        {/* 2. Академия */}
        <button
          onClick={() => onNavigateTab('academy')}
          className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121219] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#161622] transition-all text-left group min-h-[110px]"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700/80 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight mt-3">
            {t('home_academy')}
          </span>
        </button>

        {/* 3. Отзывы */}
        <button
          onClick={() => onNavigateTab('reviews')}
          className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121219] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#161622] transition-all text-left group min-h-[110px]"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700/80 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight mt-3">
            {t('home_reviews')}
          </span>
        </button>

        {/* 4. Кейсы (Highlighted Purple Card) */}
        <button
          onClick={() => onNavigateTab('case_archive')}
          className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#13132d] to-[#18183c] border border-indigo-500/40 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-950/80 transition-all text-left group min-h-[110px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:text-white group-hover:scale-105 transition-all">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-indigo-100 group-hover:text-white tracking-tight mt-3 flex items-center gap-1">
            {t('home_cases')}
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-80" />
          </span>
        </button>
      </div>

      {/* Section: ПОСЛЕДНИЕ ОБНОВЛЕНИЯ */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-medium px-1">
          {t('home_recent_updates')}
        </h3>

        <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e14] overflow-hidden divide-y divide-zinc-800/70">
          {displayUpdates.map((update) => {
            const getIcon = () => {
              if (update.type === 'deploy') return <GitCommit className="w-4 h-4 text-indigo-400" />;
              if (update.type === 'content') return <RotateCw className="w-4 h-4 text-indigo-400" />;
              return <Wrench className="w-4 h-4 text-indigo-400" />;
            };

            return (
              <div
                key={update.id}
                onClick={() => setSelectedUpdate(update)}
                className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-indigo-300 transition-colors">
                    {getIcon()}
                  </div>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {update.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">
                    {update.time}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Update Detail Drawer Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#101017] border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-zinc-200 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-white text-base">{selectedUpdate.title}</h4>
                </div>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {selectedUpdate.time}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {selectedUpdate.details}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedUpdate(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all text-xs text-white font-medium"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
