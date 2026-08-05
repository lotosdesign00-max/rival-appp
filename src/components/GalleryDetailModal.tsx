import React, { useState } from 'react';
import { X, Eye, Heart, Sparkles, Share2, Download, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { GalleryItem } from '../types';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface GalleryDetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onOpenOrder: (title: string) => void;
}

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({
  item,
  onClose,
  onOpenOrder
}) => {
    const { t } = useTranslation();
  const { isFavorite, toggleFavorite, showToast, addNotification } = useApp();
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const liked = isFavorite(item.id);
  const likesCount = item.likes + (liked ? 1 : 0);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast(t('link_copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `${item.title.replace(/\s+/g, '_')}_1024x1280.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Скачивание "${item.title}" начато!`);
    addNotification(t('downloading_the_file'), `Макет "${item.title}" успешно сохранен`, 'System');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#0c0c14] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-[#0c0c14]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              {item.categoryLabel}
            </span>
            {item.isNew && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                NEW
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Image View Container in 1024x1280 mockup aspect ratio */}
          <div className="relative aspect-[1024/1280] w-full max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-inner group">
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-200 font-semibold tracking-wider">
              1024 × 1280 (Mockup HQ)
            </div>
          </div>

          {/* Title & Stats Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {item.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                {t('author')}<span className="text-zinc-200 font-sans">{item.author}</span> • {item.date}
              </p>
            </div>
            
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                liked
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#10101a] border border-zinc-800/60 p-3.5 rounded-2xl">
            {item.description}
          </p>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
              {t('technical_parameters')}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#12121c] border border-zinc-800/80 p-3 rounded-xl">
                <span className="text-zinc-500 text-[10px] block uppercase">{t('software_tools')}</span>
                <span className="text-zinc-200 font-semibold text-[11px] block mt-0.5">{item.software}</span>
              </div>
              <div className="bg-[#12121c] border border-zinc-800/80 p-3 rounded-xl">
                <span className="text-zinc-500 text-[10px] block uppercase">{t('permission')}</span>
                <span className="text-zinc-200 font-semibold text-[11px] block mt-0.5">{item.resolution}</span>
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{t('individual_adaptation_to_your')}</span>
          </div>
        </div>

        {/* Modal Bottom Sticky CTA Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#0c0c14] flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center"
            title={t('download_layout_1024x1280_hd')}
          >
            <Download className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center"
            title={t('share')}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenOrder(item.title);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('order_a_similar_design')}</span>
            <ArrowUpRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
