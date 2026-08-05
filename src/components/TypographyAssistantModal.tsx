import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  History, 
  Sparkles, 
  Type, 
  Copy, 
  Download, 
  Bookmark, 
  Check, 
  Loader2, 
  Plus
} from 'lucide-react';
import { AIHistoryModal } from './AIHistoryModal';
import { useTranslation } from "../context/LanguageContext";

interface TypographyAssistantModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

interface TypographySystem {
  id: string;
  name: string;
  version: string;
  heading: { family: string; weight: string; preview: string };
  accent: { family: string; weight: string; preview: string };
  body: { family: string; weight: string; preview: string };
  css: string;
  fontScale: { token: string; size: string; weight: string; lh: string }[];
}

export const TypographyAssistantModal: React.FC<TypographyAssistantModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [projectName, setProjectName] = useState('');
  const [brandStyle, setBrandStyle] = useState('');
  const [description, setDescription] = useState('A modern SaaS platform focusing on developer productivity.');

  const [selectedStyle, setSelectedStyle] = useState('AI Choice');

  const [isLoading, setIsLoading] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const styleOptions = ['Minimal', 'Luxury', 'Modern', 'AI Choice', 'Corporate', 'Editorial', 'Tech'];

  const [currentSystem, setCurrentSystem] = useState<TypographySystem>({
    id: 'ts1',
    name: 'Modern SaaS Spec',
    version: 'v1.2 Active',
    heading: {
      family: 'Inter',
      weight: 'Bold',
      preview: 'The quick brown fox jumps over the lazy dog.'
    },
    accent: {
      family: 'Space Grotesk',
      weight: 'Medium',
      preview: 'The quick brown fox jumps.'
    },
    body: {
      family: 'Inter',
      weight: 'Regular',
      preview: 'The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.'
    },
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@500&display=swap');\n\n:root {\n  --font-heading: 'Inter', sans-serif;\n  --font-accent: 'Space Grotesk', sans-serif;\n  --font-body: 'Inter', sans-serif;\n}`,
    fontScale: [
      { token: 'H1', size: '32px', weight: 'Bold', lh: '1.2' },
      { token: 'H2', size: '24px', weight: 'Semi', lh: '1.3' },
      { token: 'Body', size: '16px', weight: 'Reg', lh: '1.5' },
      { token: 'Caption', size: '12px', weight: 'Med', lh: '1.4' }
    ]
  });

  const recentSystems = [
    {
      id: 'r1',
      name: 'Modern SaaS',
      pairing: 'Inter + Geist',
      fontIcon: 'Ag'
    },
    {
      id: 'r2',
      name: 'Luxury Brand',
      pairing: 'Playfair + Lato',
      fontIcon: 'Ag',
      isItalic: true
    }
  ];

  const handleGenerate = async () => {
    if (!useAICredit(1)) return;
    const proj = projectName.trim() || 'New Brand Identity';
    const bStyle = brandStyle.trim() || 'Minimalist, Clean, High-end';

    setIsLoading(true);

    try {
      const promptPayload = `Generate a typography system specification for project "${proj}", style "${bStyle}", description "${description}", mode "${selectedStyle}". Return font family pairings, sizes, and CSS.`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      });

      await res.json();

      setCurrentSystem({
        id: `ts-${Date.now()}`,
        name: proj,
        version: 'v1.0 Active',
        heading: {
          family: 'Plus Jakarta Sans',
          weight: 'ExtraBold',
          preview: 'The quick brown fox jumps over the lazy dog.'
        },
        accent: {
          family: 'JetBrains Mono',
          weight: 'SemiBold',
          preview: 'The quick brown fox jumps.'
        },
        body: {
          family: 'Inter',
          weight: 'Regular',
          preview: 'Typography is the craft of organizing type to make written language clean and impactful on digital displays.'
        },
        css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@600&display=swap');\n\n:root {\n  --font-heading: 'Plus Jakarta Sans', sans-serif;\n  --font-accent: 'JetBrains Mono', monospace;\n  --font-body: 'Inter', sans-serif;\n}`,
        fontScale: [
          { token: 'H1', size: '36px', weight: 'ExtraBold', lh: '1.15' },
          { token: 'H2', size: '26px', weight: 'Bold', lh: '1.25' },
          { token: 'Body', size: '16px', weight: 'Regular', lh: '1.5' },
          { token: 'Caption', size: '13px', weight: 'Medium', lh: '1.4' }
        ]
      });

      addAIHistoryItem({
        title: `${proj} Typography System`,
        category: 'Typography',
        iconType: 'typography',
        details: `Heading: Plus Jakarta Sans, Body: Inter`
      });

      showToast(t('auto_0KLQuNC0'));
    } catch (err) {
      console.error(err);
      showToast(t('auto_0KLQuNC0'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(currentSystem.css);
    setCopiedCss(true);
    showToast(t('auto_Q1NTINGB'));
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleExport = () => {
    showToast(t('auto_0KHQv9C1'));
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
            Typography Assistant
          </h1>

          <button
            onClick={() => setShowHistory(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* TOP HERO BANNER CARD */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Typography Tt Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <span className="text-lg font-black tracking-tighter">Tt</span>
          </div>

          <div className="space-y-1.5 max-w-xs mx-auto">
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              Generate Typography System
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create professional font systems for your brand, website or product.
            </p>
          </div>

          {/* GENERATE TYPOGRAPHY BUTTON INSIDE HERO */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Typography...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>GENERATE TYPOGRAPHY</span>
              </>
            )}
          </button>
        </div>

        {/* PROJECT INFORMATION SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            Project Information
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-3 shadow-xl">
            {/* Project Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="New Brand Identity"
                className="w-full bg-white text-zinc-900 placeholder-zinc-400 font-medium rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              />
            </div>

            {/* Brand Style */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Brand Style
              </label>
              <input
                type="text"
                value={brandStyle}
                onChange={(e) => setBrandStyle(e.target.value)}
                placeholder="Minimalist, Clean, High-end"
                className="w-full bg-white text-zinc-900 placeholder-zinc-400 font-medium rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A modern SaaS platform focusing on developer productivity."
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY STYLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            Typography Style
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {styleOptions.map((style) => {
              const isActive = selectedStyle === style;
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
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

        {/* GENERATED SYSTEM PREVIEW SECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Generated System
            </h3>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">
              {currentSystem.version}
            </span>
          </div>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-5 shadow-xl">
            {/* Heading Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">
                Heading • {currentSystem.heading.family} {currentSystem.heading.weight}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {currentSystem.heading.preview}
              </h2>
            </div>

            {/* Accent Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">
                Accent • {currentSystem.accent.family}
              </span>
              <p className="text-sm font-semibold text-indigo-300 tracking-wide font-mono">
                {currentSystem.accent.preview}
              </p>
            </div>

            {/* Body Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">
                Body • {currentSystem.body.family} {currentSystem.body.weight}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentSystem.body.preview}
              </p>
            </div>

            {/* Actions Row */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
              <button
                onClick={handleCopyCSS}
                className="flex-1 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-extrabold tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {copiedCss ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>COPY CSS</span>
              </button>

              <button
                onClick={handleExport}
                className="flex-1 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-extrabold tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT</span>
              </button>

              <button
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  showToast(isBookmarked ? t('auto_0KPQtNCw') : t('auto_0KHQvtGF'));
                }}
                className={`w-12 h-11 rounded-2xl border transition-all active:scale-95 flex items-center justify-center ${
                  isBookmarked
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-950/60 hover:bg-indigo-900 border-indigo-500/30 text-indigo-300'
                }`}
                aria-label="Bookmark"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* FONT SCALE TABLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            Font Scale
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4 text-right">LH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {currentSystem.fontScale.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors text-zinc-200 font-semibold">
                    <td className="py-3 px-4 font-bold text-white">{row.token}</td>
                    <td className="py-3 px-4 text-zinc-300">{row.size}</td>
                    <td className="py-3 px-4 text-zinc-400">{row.weight}</td>
                    <td className="py-3 px-4 text-right text-indigo-400 font-bold">{row.lh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT SYSTEMS SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            Recent Systems
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {recentSystems.map((item) => (
              <div
                key={item.id}
                onClick={() => showToast(`Загружена система "${item.name}"`)}
                className="p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shadow-lg active:scale-95"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-white font-bold font-serif">
                  <span className={item.isItalic ? 'italic' : ''}>{item.fontIcon}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {item.pairing}
                  </p>
                </div>
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
                <span>Generating New System...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-white" />
                </div>
                <span>NEW TYPOGRAPHY SYSTEM</span>
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
