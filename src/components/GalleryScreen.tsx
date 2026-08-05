import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpRight, X, Check, Heart, Eye } from 'lucide-react';
import { GalleryItem } from '../types';
import { GalleryDetailModal } from './GalleryDetailModal';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from "../context/LanguageContext";
import { useApp } from '../context/AppContext';

interface GalleryScreenProps {
  onOpenCreateOrder: (projectTitle?: string) => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = React.memo(({
  onOpenCreateOrder
}) => {
  const { t } = useTranslation();
  const { galleryItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'date'>('default');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => [
    { key: 'all', label: t('all') },
    { key: 'avatars', label: t('avatar') },
    { key: 'banners', label: t('banners') },
    { key: 'previews', label: t('preview') },
    { key: 'logos', label: t('logos') },
    { key: 'ui', label: t('interfaces') },
    { key: '3d', label: t('3d_models') },
  ], []);

  // Filter gallery items by search query and active category tab
  let filteredItems = useMemo(() => {
    let items = (galleryItems || []).filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategoryKey === 'all' || item.categoryKey === selectedCategoryKey || (selectedCategoryKey === '3d' && item.categoryLabel === '3D МОДЕЛЬ');

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'popular') {
      items = [...items].sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'date') {
      items = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return items;
  }, [searchQuery, selectedCategoryKey, sortBy]);

  // Find featured item (Project Nova) if on 'all' or default view
  const featuredItem = useMemo(() => filteredItems.find(item => item.isFeatured) || (filteredItems.length > 0 ? filteredItems[0] : null), [filteredItems]);

  // Items for the 2-column grid and standard cards list
  const standardGridItems = useMemo(() => filteredItems.filter(item => item.id !== featuredItem?.id), [filteredItems, featuredItem]);

  // Take the first 2 for the dual square grid
  const dualSquareItems = useMemo(() => standardGridItems.slice(0, 2), [standardGridItems]);
  const remainingItems = useMemo(() => standardGridItems.slice(2), [standardGridItems]);

  return (
    <div
      className="space-y-6 pb-24 animate-in fade-in duration-300"
    >
      {/* Search Input Bar & Filter Toggle Button */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('job_search')}
            className="w-full bg-[#0a0a10] border border-zinc-800/90 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`p-3 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
            sortBy !== 'default'
              ? 'bg-indigo-950/80 border-indigo-500/80 text-indigo-300'
              : 'bg-[#0a0a10] border-zinc-800/90 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
          title={t('filters_and_sorting')}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Screen Title Banner */}
      <div className="text-center py-2 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[0.35em] sm:tracking-[0.45em] uppercase font-sans">
          {t('g_a_l_e_r_e_ya')}</h1>
        <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-[0.25em] uppercase">
          ARCHIVE OF EXCELLENCE
        </p>
      </div>

      {/* Category Pills Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = selectedCategoryKey === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#1a1733] border border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-[#0c0c14] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Empty State when no search matches */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-[#0c0c14] border border-zinc-800/80 rounded-2xl p-6 space-y-3">
          <p className="text-sm text-zinc-400 font-mono">{t('no_works_found')}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryKey('all');
              setSortBy('default');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
          >
            {t('reset_filters')}</button>
        </div>
      )}

      {/* 2-COLUMN GRID FOR ALL WORK MOCKUPS (1024x1280 RESOLUTION FORMAT ACROSS ALL CATEGORIES) */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedGalleryItem(item)}
            className="rounded-2xl bg-[#0c0c14] border border-zinc-800/80 overflow-hidden cursor-pointer group hover:border-indigo-500/40 transition-all shadow-md flex flex-col justify-between"
          >
            {/* Mockup Container with 1024x1280 Aspect Ratio */}
            <div className="relative aspect-[1024/1280] w-full overflow-hidden bg-zinc-950">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300 font-semibold tracking-wider">
                1024×1280
              </div>
              {item.isNew && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-400">
                  NEW
                </div>
              )}
            </div>

            {/* Mockup Bottom Info */}
            <div className="p-3 sm:p-3.5 space-y-1 bg-[#0c0c14] border-t border-zinc-800/60">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                {item.categoryLabel}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                  {item.title}
                </h3>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-zinc-500" />
                  {item.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-zinc-500" />
                  {item.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Order CTA Banner at Bottom of Gallery */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-indigo-950/50 via-[#0e0e1a] to-purple-950/40 border border-indigo-500/30 text-center space-y-3 shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-white">
          {t('need_a_custom_design_or_3d_gra')}</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          {t('we_will_create_a_unique_banner')}</p>
        <button
          onClick={() => onOpenCreateOrder()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95 inline-flex items-center gap-2"
        >
          <span>{t('place_an_order')}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Gallery Detail Modal */}
      <GalleryDetailModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onOpenOrder={(title) => onOpenCreateOrder(title)}
      />

      {/* Filter / Sort Modal Drawer */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#0c0c14] border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-white font-mono">{t('sorting_and_filters')}</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">{t('sort_by')}</label>
                <div className="space-y-1.5">
                  {[
                    { key: 'default', label: t('the_default') },
                    { key: 'popular', label: t('by_popularity_likes') },
                    { key: 'date', label: t('by_date_added') },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key as any)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        sortBy === opt.key
                          ? 'bg-indigo-950/80 border border-indigo-500/80 text-white'
                          : 'bg-zinc-900/60 border border-zinc-800/60 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.key && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setSortBy('default');
                    setSelectedCategoryKey('all');
                    setSearchQuery('');
                    setIsFilterModalOpen(false);
                  }}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:text-white transition-all active:scale-95"
                >
                  {t('reset')}</button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  {t('apply')}</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
