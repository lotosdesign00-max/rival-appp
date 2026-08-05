import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Globe, 
  Check, 
  Search, 
  Sparkles, 
  Languages, 
  Info 
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SupportedLanguage } from '../translations';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  description: string;
  popular?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    region: 'Россия',
    description: 'Основной язык интерфейса и промптов',
    popular: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'United States / UK',
    description: 'Default interface language & global standard',
    popular: true
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    region: 'Україна',
    description: 'Полная локализация интерфейса',
    popular: true
  },
  {
    code: 'kk',
    name: 'Kazakh',
    nativeName: 'Қазақша',
    flag: '🇰🇿',
    region: 'Казахстан',
    description: 'Язык интерфейса и навигации',
    popular: true
  },
  {
    code: 'be',
    name: 'Belarusian',
    nativeName: 'Беларуская',
    flag: '🇧🇾',
    region: 'Беларусь',
    description: 'Язык элементов управления и настроек',
    popular: true
  }
];

interface LanguageModalProps {
  onClose: () => void;
  currentLanguage?: string;
  onSelectLanguage?: (code: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ 
  onClose,
  currentLanguage = 'ru',
  onSelectLanguage
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(() => {
    return (language as SupportedLanguage) || (currentLanguage as SupportedLanguage) || 'ru';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = () => {
    setLanguage(selectedLang);
    if (onSelectLanguage) {
      onSelectLanguage(selectedLang);
    }
    const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
    showToast(t('lang_applied_toast') + `: ${targetLang?.nativeName || selectedLang}`);
    
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div 
        className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28"
        style={{
          paddingTop: 'max(1.25rem, env(safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px))',
          paddingBottom: 'max(7rem, env(safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))'
        }}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
              RIVAL LANGUAGE
            </span>
          </div>

          <div className="w-10" />
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="space-y-1 px-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            {t('lang_modal_title')}
            <Languages className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t('lang_modal_subtitle')}
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('lang_search_placeholder')}
            className="w-full bg-[#0e0e16] border border-zinc-800/90 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-zinc-300 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* LANGUAGE SELECTION LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              {t('lang_available')} ({filteredLanguages.length})
            </span>
            <span className="text-[10px] font-mono text-indigo-400">
              5 Languages
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full p-4 rounded-3xl border text-left transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-r from-indigo-950/80 via-[#10101c] to-[#0e0e16] border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/30' 
                      : 'bg-[#0e0e16] border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative z-10">
                    {/* Flag Icon Container */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border transition-transform group-hover:scale-105 ${
                      isSelected 
                        ? 'bg-indigo-900/60 border-indigo-500/40 text-indigo-200 shadow-indigo-500/20' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}>
                      {lang.flag}
                    </div>

                    {/* Language Details */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {lang.nativeName}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400">
                          ({lang.name})
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {lang.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Checkmark / Status */}
                  <div className="relative z-10 pl-2">
                    {isSelected ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 border border-indigo-400 animate-in zoom-in-75 duration-150">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/50 group-hover:border-zinc-700 flex items-center justify-center transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-zinc-700/50" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="p-8 text-center rounded-3xl bg-[#0e0e16] border border-zinc-800/80 space-y-2">
                <Info className="w-8 h-8 text-zinc-500 mx-auto" />
                <p className="text-sm text-zinc-300 font-medium">{t('language_not_found')}</p>
                <p className="text-xs text-zinc-500">{t('try_entering_a_different_name')}</p>
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleApply}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{t('lang_apply_btn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
