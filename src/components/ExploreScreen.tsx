import React, { useState, useMemo } from 'react';
import { Compass, Search, Sparkles, Bot } from 'lucide-react';
import { CaseStudy } from '../types';
import { CASES_LIST } from '../data/mockData';
import { AIAssistantScreen } from './AIAssistantScreen';
import { useTranslation } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface ExploreScreenProps {
  onOpenCaseDetail: (cs: CaseStudy) => void;
  onOpenCreateOrder?: (title?: string) => void;
  onOpenPro?: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = React.memo(({ 
  onOpenCaseDetail,
  onOpenCreateOrder,
  onOpenPro
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'ai_assistant' | 'environments'>('ai_assistant');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = useMemo(() => ['all', 'Lumen UE5', 'RayTracing', 'Subterranean', 'Minimalism', '8K EXR'], []);

  const filteredCases = useMemo(() => CASES_LIST.filter(cs => {
    const matchesSearch = cs.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cs.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || cs.specs.renderer.includes(selectedTag) || cs.tag.includes(selectedTag);
    return matchesSearch && matchesTag;
  }), [searchTerm, selectedTag]);

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-300">
      {/* Top Toggle Pills between AI Assistant and 3D Environments */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0c0c14] border border-zinc-800/90 rounded-2xl w-full max-w-sm mx-auto shadow-inner">
        <button
          onClick={() => setViewMode('ai_assistant')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            viewMode === 'ai_assistant'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={() => setViewMode('environments')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            viewMode === 'environments'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>3D Environments</span>
        </button>
      </div>

      {/* Main View Renderer */}
      <AnimatePresence mode="wait">
        {viewMode === 'ai_assistant' ? (
          <div 
            key="ai_assistant"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AIAssistantScreen 
              onOpenCreateOrder={onOpenCreateOrder} 
              onOpenPro={onOpenPro}
            />
          </div>
        ) : (
          <div 
            key="environments"
            
            
            
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 pb-20"
          >
            {/* Environments Header */}
            <div className="pt-1 space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs">
                <Compass className="w-4 h-4" />
                <span>EXPLORE SPATIAL ENVIRONMENTS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{t('explore_environments')}</h2>
              <p className="text-xs text-zinc-400">{t('interactive_navigator_through')}</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('search_by_architectural_forms')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d0d14] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 placeholder-zinc-500 shadow-inner"
              />
            </div>

            {/* Tags Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-200 font-semibold shadow-md shadow-indigo-600/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              {filteredCases.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => onOpenCaseDetail(cs)}
                  className="p-4 rounded-2xl bg-[#0e0e15] border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-start shadow-xl"
                >
                <div className="relative w-full sm:w-44 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-zinc-950">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-indigo-300">
                    {cs.specs.resolution}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{cs.tag}</span>
                    <span className="text-[10px] font-mono text-indigo-400">{cs.specs.renderer}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {cs.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {cs.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/60 font-mono">
                    <span>{cs.specs.polygonCount}</span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">{t('3d_viewing')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  </div>
  );
});
