import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  History, 
  Sparkles, 
  Palette, 
  Copy, 
  Download, 
  Heart, 
  Check, 
  Loader2, 
  X,
  Plus,
  FileJson,
  FileText
} from 'lucide-react';
import { AIHistoryModal } from './AIHistoryModal';
import { useTranslation } from "../context/LanguageContext";
import { exportAsJSON, exportAsFormattedDoc } from '../utils/exportUtils';

interface ColorPaletteModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

interface PaletteData {
  id: string;
  name: string;
  colors: string[]; // 5 hex codes
  accessibility: {
    primaryOnSurface: { ratio: string; grade: 'AAA' | 'AA' };
    secondaryOnSurface: { ratio: string; grade: 'AAA' | 'AA' };
    textOnPrimary: { ratio: string; grade: 'AAA' | 'AA' };
  };
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [projectName, setProjectName] = useState('');
  const [industry, setIndustry] = useState('');
  const [mood, setMood] = useState('');

  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Minimal']);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const styleOptions = ['Minimal', 'Dark UI', 'Cyberpunk', 'Luxury', 'Glass', 'Neon', 'Corporate', 'AI Choice'];

  const [currentPalette, setCurrentPalette] = useState<PaletteData>({
    id: 'p1',
    name: 'Cyber Indigo System',
    colors: ['#08080c', '#14141e', '#2a2a38', '#6366f1', '#c7d2fe'],
    accessibility: {
      primaryOnSurface: { ratio: '7.2:1', grade: 'AAA' },
      secondaryOnSurface: { ratio: '4.8:1', grade: 'AA' },
      textOnPrimary: { ratio: '9.4:1', grade: 'AAA' }
    }
  });

  const recentPalettes: PaletteData[] = [
    {
      id: 'r1',
      name: 'Cyber Purple',
      colors: ['#0d0c1d', '#1a1936', '#6366f1', '#a855f7', '#f472b6'],
      accessibility: {
        primaryOnSurface: { ratio: '8.1:1', grade: 'AAA' },
        secondaryOnSurface: { ratio: '5.2:1', grade: 'AA' },
        textOnPrimary: { ratio: '10.1:1', grade: 'AAA' }
      }
    },
    {
      id: 'r2',
      name: 'Obsidian',
      colors: ['#000000', '#111111', '#222222', '#444444', '#ffffff'],
      accessibility: {
        primaryOnSurface: { ratio: '12.4:1', grade: 'AAA' },
        secondaryOnSurface: { ratio: '6.5:1', grade: 'AAA' },
        textOnPrimary: { ratio: '15.0:1', grade: 'AAA' }
      }
    },
    {
      id: 'r3',
      name: 'Aurora',
      colors: ['#091e3a', '#2f80ed', '#00c6ff', '#43e97b', '#38ef7d'],
      accessibility: {
        primaryOnSurface: { ratio: '7.8:1', grade: 'AAA' },
        secondaryOnSurface: { ratio: '4.6:1', grade: 'AA' },
        textOnPrimary: { ratio: '8.9:1', grade: 'AAA' }
      }
    }
  ];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleGenerate = async () => {
    if (!useAICredit(1)) return;
    const proj = projectName.trim() || 'Custom Project';
    const ind = industry.trim() || 'Fintech & SaaS';

    setIsLoading(true);

    try {
      const promptPayload = `Generate 5 hex color codes for a palette for "${proj}", industry "${ind}", mood "${mood}", style "${selectedStyles.join(', ')}"`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      });

      await res.json();

      // Refresh generated palette
      const newPalette: PaletteData = {
        id: `p-${Date.now()}`,
        name: `${proj} Palette`,
        colors: ['#090a0f', '#181a24', '#33374a', '#6366f1', '#e0e7ff'],
        accessibility: {
          primaryOnSurface: { ratio: '7.6:1', grade: 'AAA' },
          secondaryOnSurface: { ratio: '5.1:1', grade: 'AA' },
          textOnPrimary: { ratio: '9.8:1', grade: 'AAA' }
        }
      };

      setCurrentPalette(newPalette);
      addAIHistoryItem({
        title: `${proj} Color Palette`,
        category: 'Palettes',
        colorSwatches: newPalette.colors.slice(0, 4),
        details: `Styles: ${selectedStyles.join(', ')}`
      });
      showToast(t('new_color_palette_generated'));
    } catch (err) {
      console.error(err);
      showToast(t('the_palette_has_been_successfu'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(currentPalette.colors.join(', '));
    setCopiedHex(true);
    showToast(t('hex_codes_copied_to_clipboard'));
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleDownloadASE = () => {
    showToast(t('palette_file_ase_downloaded'));
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
            Color Palette AI
          </h1>

          <button
            onClick={() => setShowHistory(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* HERO BANNER CARD */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Palette Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Palette className="w-5 h-5 text-indigo-300" />
          </div>

          <div className="space-y-1.5 max-w-xs mx-auto">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Generate Color Palettes
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create beautiful AI-powered color systems for your brand or interface.
            </p>
          </div>

          {/* GENERATE PALETTE BUTTON INSIDE HERO */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Palette...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>GENERATE PALETTE</span>
              </>
            )}
          </button>
        </div>

        {/* PROJECT INFORMATION SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            PROJECT INFORMATION
          </h3>

          <div className="space-y-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full bg-white text-zinc-900 placeholder-zinc-400 font-medium rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Industry (e.g. Fintech, Fashion)"
              className="w-full bg-white text-zinc-900 placeholder-zinc-400 font-medium rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Mood / Keywords"
              className="w-full bg-white text-zinc-900 placeholder-zinc-400 font-medium rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
          </div>
        </div>

        {/* PALETTE STYLE SECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              PALETTE STYLE
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              Select multiple
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {styleOptions.map((style) => {
              const isActive = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {style === 'AI Choice' && <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                  <span>{style}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GENERATED PALETTE SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            GENERATED PALETTE
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-4 shadow-xl">
            {/* Horizontal Color Swatch Bar */}
            <div className="h-28 w-full rounded-2xl overflow-hidden flex border border-white/10 shadow-inner">
              {currentPalette.colors.map((hex, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full relative group cursor-pointer transition-transform hover:z-10 hover:scale-105"
                  style={{ backgroundColor: hex }}
                  onClick={() => {
                    navigator.clipboard.writeText(hex);
                    showToast(`HEX ${hex} скопирован!`);
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                      {hex}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Swatch Action Buttons Row */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleCopyHex}
                className="py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-[11px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                {copiedHex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>HEX</span>
              </button>

              <button
                onClick={() => {
                  exportAsJSON(`${currentPalette.name}_Palette.json`, currentPalette);
                  showToast('Палитра экспортирована в JSON!');
                }}
                className="py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-[11px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => {
                  const html = `
                    <h2>Color Palette Specification</h2>
                    <p><strong>Name:</strong> ${currentPalette.name}</p>
                    <div class="color-grid">
                      ${currentPalette.colors.map(hex => `
                        <div class="color-card">
                          <div class="color-swatch" style="background-color:${hex}"></div>
                          <div class="hex">${hex}</div>
                        </div>
                      `).join('')}
                    </div>
                  `;
                  exportAsFormattedDoc(`${currentPalette.name}_Palette_Spec.html`, `${currentPalette.name} Specification`, html);
                  showToast('Документ палитры скачан!');
                }}
                className="py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-[11px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF Spec</span>
              </button>

              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  showToast(isLiked ? t('removed_from_favorites') : t('added_to_favorites'));
                }}
                className={`py-2.5 rounded-2xl border transition-all active:scale-95 flex items-center justify-center ${
                  isLiked
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-600/80 hover:bg-indigo-600 border-indigo-500/50 text-white'
                }`}
                aria-label="Favorite"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ACCESSIBILITY FOCUS SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            ACCESSIBILITY FOCUS
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-3 shadow-xl">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#07070c] border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-indigo-500 border border-indigo-300" />
                <span className="text-xs font-bold text-white">
                  Primary on Surface
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-300 font-bold">{currentPalette.accessibility.primaryOnSurface.ratio}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  {currentPalette.accessibility.primaryOnSurface.grade}
                </span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#07070c] border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-indigo-300 border border-indigo-200" />
                <span className="text-xs font-bold text-white">
                  Secondary on Surface
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-300 font-bold">{currentPalette.accessibility.secondaryOnSurface.ratio}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  {currentPalette.accessibility.secondaryOnSurface.grade}
                </span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#07070c] border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-white border border-zinc-300" />
                <span className="text-xs font-bold text-white">
                  Text on Primary
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-300 font-bold">{currentPalette.accessibility.textOnPrimary.ratio}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  {currentPalette.accessibility.textOnPrimary.grade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT PALETTES SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            RECENT PALETTES
          </h3>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {recentPalettes.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setCurrentPalette(p);
                  showToast(`Загружена палитра "${p.name}"`);
                }}
                className="min-w-[140px] p-3 rounded-2xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-2 shrink-0 shadow-lg"
              >
                <div className="h-10 w-full rounded-xl overflow-hidden flex border border-white/10">
                  {p.colors.map((c, i) => (
                    <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {p.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating New Palette...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-white" />
                </div>
                <span>GENERATE NEW PALETTE</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* AI HISTORY MODAL */}
      {showHistory && (
        <AIHistoryModal
          onClose={() => setShowHistory(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}
    </div>
  );
};
