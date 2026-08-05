import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  History, 
  MoreVertical, 
  Plus, 
  Sparkles, 
  Award, 
  Palette, 
  Type, 
  MessageSquare,
  Bookmark,
  Trash2,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface AIHistoryModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
  onSelectAction?: (actionType: string) => void;
}

export const AIHistoryModal: React.FC<AIHistoryModalProps> = ({
  onClose,
  onOpenCreateOrder,
  onSelectAction
}) => {
    const { t } = useTranslation();
  const { aiHistory, removeAIHistoryItem, showToast, aiCredits, favorites } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const categories = ['All', 'Prompts', 'Logos', 'Palettes', 'Typography'];

  const filteredItems = aiHistory.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeAIHistoryItem(id);
    setActiveMenuId(null);
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-5 space-y-5 pb-28 relative">

        {/* TOP NAVBAR HEADER */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-extrabold text-white tracking-tight">
            AI History
          </h1>

          <button
            onClick={() => showToast(t('search_all_history'))}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* HERO CARD: YOUR AI CREATIONS */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-6 space-y-4 shadow-2xl relative overflow-hidden">
          {/* Glow background */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon pill */}
          <div className="w-12 h-12 rounded-2xl bg-[#17162b] border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
            <History className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Your AI Creations
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Browse every prompt, logo, palette, typography system and AI asset you've generated.
            </p>
          </div>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI history..."
            className="w-full bg-[#0c0c14] border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* HISTORY ITEMS LIST */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-10 px-6 text-center rounded-3xl bg-[#0c0c14] border border-zinc-800/90 space-y-3 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-md">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <h3 className="text-sm font-bold text-white">{t('ai_generation_history_is_empty')}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {t('use_rival_space_s_ai_tools_to')}</p>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showToast(`Открыта генерация "${item.title}"`)}
                className="p-3.5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md relative group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail / Icon container */}
                  <div className="w-12 h-12 rounded-2xl bg-[#07070c] border border-zinc-800/80 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : item.colorSwatches ? (
                      <div className="w-full h-full flex flex-col">
                        {item.colorSwatches.map((c, i) => (
                          <div key={i} className="flex-1 w-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    ) : item.iconType === 'logo' ? (
                      <Award className="w-5 h-5 text-indigo-400" />
                    ) : item.iconType === 'typography' ? (
                      <span className="text-sm font-black font-serif text-zinc-300">Tt</span>
                    ) : (
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>

                  {/* Title & Category Tag */}
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[9px] font-mono font-bold uppercase">
                        {item.category === 'Prompts' ? 'PROMPT' : item.category === 'Logos' ? 'LOGO' : item.category === 'Palettes' ? 'COLOR PALETTE' : 'TYPOGRAPHY'}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* More options button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === item.id && (
                    <div
                      className="absolute right-0 top-10 z-20 w-36 bg-[#141420] border border-zinc-700 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Загружен результат для "${item.title}"`);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('open')}</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('delete')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ACTIVITY OVERVIEW GRID SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            Activity Overview
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              {/* Total Creations */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  TOTAL CREATIONS
                </span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {aiHistory.length}
                </span>
              </div>

              {/* Saved Assets */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  SAVED ASSETS
                </span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {aiHistory.filter(i => i.image || i.iconType).length}
                </span>
              </div>

              {/* Favorites */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  FAVORITES
                </span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {favorites.length}
                </span>
              </div>

              {/* AI Credits */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  AVAILABLE CREDITS
                </span>
                <span className="text-2xl font-black text-indigo-400 tracking-tight">
                  {aiCredits}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              if (onOpenCreateOrder) onOpenCreateOrder();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Generate Something New</span>
          </button>
        </div>

      </div>
    </div>
  );
};
