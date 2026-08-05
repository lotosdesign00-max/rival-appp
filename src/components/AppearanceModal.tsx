import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Check, 
  ArrowRight, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface AppearanceModalProps {
  onClose: () => void;
  onSave?: (settings: {
    theme: string;
    accentColor: string;
    background: string;
    density: string;
  }) => void;
}

interface ColorOption {
  id: string;
  name: string;
  bgClass: string;
  borderClass: string;
  previewColor: string;
}

const ACCENT_COLORS: ColorOption[] = [
  {
    id: 'purple',
    name: 'Purple Nebula',
    bgClass: 'bg-indigo-600',
    borderClass: 'ring-indigo-500',
    previewColor: '#6366f1'
  },
  {
    id: 'blue',
    name: 'Electric Blue',
    bgClass: 'bg-blue-600',
    borderClass: 'ring-blue-500',
    previewColor: '#2563eb'
  },
  {
    id: 'cyan',
    name: 'Cyan Glow',
    bgClass: 'bg-cyan-500',
    borderClass: 'ring-cyan-400',
    previewColor: '#06b6d4'
  },
  {
    id: 'coral',
    name: 'Coral Flame',
    bgClass: 'bg-rose-500',
    borderClass: 'ring-rose-500',
    previewColor: '#f43f5e'
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    bgClass: 'bg-amber-500',
    borderClass: 'ring-amber-500',
    previewColor: '#f59e0b'
  }
];

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
  const { appearance, updateAppearance, updateSettings } = useApp();

  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>(appearance.theme);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    () => ACCENT_COLORS.find(c => c.id === appearance.accentColor) || ACCENT_COLORS[0]
  );
  const [selectedBackground, setSelectedBackground] = useState<'grid' | 'clean' | 'aurora'>(appearance.background);
  const [selectedDensity, setSelectedDensity] = useState<'compact' | 'comfortable' | 'spacious'>(appearance.density);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    updateAppearance({
      theme: selectedTheme,
      accentColor: selectedColor.id,
      background: selectedBackground,
      density: selectedDensity
    });
    updateSettings({
      gridBg: selectedBackground === 'grid',
      darkTheme: selectedTheme === 'dark'
    });
    if (onSave) {
      onSave({
        theme: selectedTheme,
        accentColor: selectedColor.id,
        background: selectedBackground,
        density: selectedDensity
      });
    }
    showToast(t('appearance_settings_saved'));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleReset = () => {
    const defaultColor = ACCENT_COLORS[0];
    setSelectedTheme('dark');
    setSelectedColor(defaultColor);
    setSelectedBackground('grid');
    setSelectedDensity('comfortable');
    updateAppearance({
      theme: 'dark',
      accentColor: defaultColor.id,
      background: 'grid',
      density: 'comfortable'
    });
    updateSettings({ gridBg: true, darkTheme: true });
    showToast(t('settings_reset_to_default'));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-white tracking-tight">
            Appearance
          </h1>

          <div className="w-10" />
        </div>

        {/* HERO CARD */}
        <div className="p-7 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-300" 
            style={{ backgroundColor: `${selectedColor.previewColor}20` }}
          />

          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest z-10">
            PERSONALIZE EXPERIENCE
          </span>

          <div 
            className="w-14 h-14 rounded-full bg-zinc-900 border flex items-center justify-center shadow-lg transition-colors duration-300 z-10"
            style={{ borderColor: `${selectedColor.previewColor}60`, color: selectedColor.previewColor }}
          >
            <Palette className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 z-10">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Make Rival Space yours
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Customize your interface, colors and visual environment.
            </p>
          </div>
        </div>

        {/* THEME SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            THEME
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* Dark Mode */}
            <div 
              onClick={() => setSelectedTheme('dark')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Moon className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="text-sm font-bold text-white">Dark Mode</span>
              </div>

              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                selectedTheme === 'dark' ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  selectedTheme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {selectedTheme === 'dark' && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Light Mode */}
            <div className="p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <Sun className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-300">Light Mode</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    COMING SOON
                  </span>
                </div>
              </div>

              <div className="w-11 h-6 rounded-full bg-zinc-800/60 relative p-0.5">
                <div className="w-5 h-5 rounded-full bg-zinc-600 translate-x-0" />
              </div>
            </div>

            {/* System Default */}
            <div className="p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <Monitor className="w-4 h-4 text-zinc-400" />
                </div>
                <span className="text-sm font-bold text-zinc-300">System Default</span>
              </div>

              <div className="w-11 h-6 rounded-full bg-zinc-800/60 relative p-0.5">
                <div className="w-5 h-5 rounded-full bg-zinc-600 translate-x-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ACCENT COLOR SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              ACCENT COLOR
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {selectedColor.name}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex items-center justify-between px-6">
            {ACCENT_COLORS.map((color) => {
              const isSelected = selectedColor.id === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-11 h-11 rounded-full ${color.bgClass} transition-transform active:scale-90 flex items-center justify-center ${
                    isSelected ? `ring-2 ring-offset-2 ring-offset-[#0e0e16] ${color.borderClass} scale-110 shadow-lg` : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={color.name}
                >
                  {isSelected && <Check className="w-5 h-5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* BACKGROUND SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            BACKGROUND
          </h3>

          <div className="space-y-2">
            {/* Grid Background */}
            <div 
              onClick={() => setSelectedBackground('grid')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedBackground === 'grid' 
                  ? 'bg-[#0e0e16] border-indigo-500/60 shadow-lg' 
                  : 'bg-[#0e0e16]/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 border border-dashed border-zinc-400 rounded-md" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Grid Background</h4>
                  <p className="text-xs text-zinc-400">Subtle workspace texture</p>
                </div>
              </div>

              {selectedBackground === 'grid' ? (
                <Check className="w-5 h-5 text-indigo-400 stroke-[2.5]" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-zinc-600" />
              )}
            </div>

            {/* Clean Background */}
            <div 
              onClick={() => setSelectedBackground('clean')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedBackground === 'clean' 
                  ? 'bg-[#0e0e16] border-indigo-500/60 shadow-lg' 
                  : 'bg-[#0e0e16]/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 bg-zinc-950 rounded-md border border-zinc-800" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Clean Background</h4>
                  <p className="text-xs text-zinc-400">Minimal empty canvas</p>
                </div>
              </div>

              {selectedBackground === 'clean' ? (
                <Check className="w-5 h-5 text-indigo-400 stroke-[2.5]" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-zinc-600" />
              )}
            </div>

            {/* Aurora Background */}
            <div 
              onClick={() => setSelectedBackground('aurora')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedBackground === 'aurora' 
                  ? 'bg-[#0e0e16] border-indigo-500/60 shadow-lg' 
                  : 'bg-[#0e0e16]/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-900 to-purple-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 rounded-md bg-indigo-500/30 blur-xs" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aurora Background</h4>
                  <p className="text-xs text-zinc-400">Animated ambient glow</p>
                </div>
              </div>

              {selectedBackground === 'aurora' ? (
                <Check className="w-5 h-5 text-indigo-400 stroke-[2.5]" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-zinc-600" />
              )}
            </div>
          </div>
        </div>

        {/* INTERFACE DENSITY SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            INTERFACE DENSITY
          </h3>

          <div className="p-1.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 grid grid-cols-3 gap-1 shadow-xl">
            {(['compact', 'comfortable', 'spacious'] as const).map((density) => {
              const isSelected = selectedDensity === density;
              return (
                <button
                  key={density}
                  onClick={() => setSelectedDensity(density)}
                  className={`py-3 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  {density}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIVE PREVIEW SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            LIVE PREVIEW
          </h3>

          <div className="p-6 rounded-3xl bg-[#08080c] border border-zinc-800/90 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[160px]">
            {/* Ambient Aurora preview background */}
            {selectedBackground === 'aurora' && (
              <div 
                className="absolute inset-0 opacity-40 blur-2xl transition-all duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${selectedColor.previewColor}, transparent 70%)` }}
              />
            )}

            {/* Grid preview background */}
            {selectedBackground === 'grid' && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:12px_12px]" 
              />
            )}

            {/* UI Mock preview container */}
            <div className="w-full max-w-xs space-y-3 z-10">
              <div className="flex items-center justify-between opacity-50">
                <div className="w-24 h-4 bg-zinc-800 rounded-full" />
                <div className="w-6 h-6 bg-zinc-800 rounded-full" />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0e16]/90 border border-zinc-800 text-center space-y-2 shadow-lg">
                <div 
                  className="w-12 h-6 rounded-full mx-auto transition-colors duration-300"
                  style={{ backgroundColor: `${selectedColor.previewColor}40` }}
                />
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest border border-zinc-800">
                  CHANGES APPEAR INSTANTLY
                </span>
              </div>

              <div 
                className="w-full h-8 rounded-xl transition-colors duration-300 shadow-lg"
                style={{ backgroundColor: selectedColor.previewColor }}
              />
            </div>
          </div>
        </div>

        {/* RESET APPEARANCE SECTION */}
        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Reset Appearance
            </h4>
            <p className="text-xs text-zinc-400 leading-snug mt-0.5">
              Restore default Rival Space theme
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(to right, ${selectedColor.previewColor}, #8b5cf6)`
            }}
          >
            <span>Save Appearance</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-zinc-300 transition-all active:scale-95 text-center"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
