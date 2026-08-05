import React, { useState } from 'react';
import { Search, X, Sparkles, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { CaseStudy, Course, NavTab } from '../types';
import { CASES_LIST, ACADEMY_COURSES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (cs: CaseStudy) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  onNavigateTab
}) => {
    const { t } = useTranslation();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useApp();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedCases = CASES_LIST.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.tag.toLowerCase().includes(query.toLowerCase())
  );

  const matchedCourses = ACADEMY_COURSES.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCaseItem = (cs: CaseStudy) => {
    if (query.trim()) addRecentSearch(query.trim());
    onClose();
    onSelectCase(cs);
  };

  const handleSelectCourseItem = () => {
    if (query.trim()) addRecentSearch(query.trim());
    onClose();
    onNavigateTab('academy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 pt-16">
      <div 
        className="w-full max-w-xl bg-[#0f0f17] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-zinc-100 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Top Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-zinc-800 bg-[#12121a]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={t('auto_0JQvtC40')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                addRecentSearch(query.trim());
              }
            }}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500 font-sans"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-500">{t('auto_0J3QtdC0')}</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1 font-mono"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t('auto_0J7Rh9C4')}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(s)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-indigo-500/40 flex items-center gap-1.5"
                      >
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-zinc-500 block">{t('auto_0JQvtC0Y')}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('gallery');
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-indigo-500/40 text-zinc-300 hover:text-white"
                  >
                    <span className="font-semibold block">{t('auto_0JPQsNC7')}</span>
                    <span className="text-[10px] text-zinc-500">{t('auto_UHJvamVj')}</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('academy');
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-indigo-500/40 text-zinc-300 hover:text-white"
                  >
                    <span className="font-semibold block">{t('rival_academy')}</span>
                    <span className="text-[10px] text-zinc-500">{t('auto_0JrRg9GA')}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Projects Matched */}
              {matchedCases.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-indigo-400 block">{t('auto_0JRgNC0L')}{matchedCases.length})</span>
                  {matchedCases.map((cs) => (
                    <div
                      key={cs.id}
                      onClick={() => handleSelectCaseItem(cs)}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/50 cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-200">{cs.title}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">{cs.tag}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Courses Matched */}
              {matchedCourses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-indigo-400 block">{t('auto_0JrRg9GA')}{matchedCourses.length})</span>
                  {matchedCourses.map((crs) => (
                    <div
                      key={crs.id}
                      onClick={handleSelectCourseItem}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/50 cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-200">{crs.title}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">{crs.category} • {crs.duration}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                    </div>
                  ))}
                </div>
              )}

              {matchedCases.length === 0 && matchedCourses.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-400">
                  {t('auto_0JQviDQt')}<span className="text-indigo-300">"{query}"</span> {t('auto_0L3QuNGH')}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
