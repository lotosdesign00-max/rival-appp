import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  Copy, 
  Check, 
  Loader2, 
  X,
  FileCode,
  ArrowRight,
  Download,
  FileJson,
  FileText
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { exportAsJSON, exportAsFormattedDoc } from '../utils/exportUtils';

interface PromptGeneratorModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

export const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('UI Design');
  const [creativity, setCreativity] = useState(80); // 0-100 (High)
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Medium' | 'Detailed'>('Detailed');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const designStyles = ['UI Design', 'Branding', 'Landing Page', 'Telegram App', '3D & Motion'];

  const templates = [
    {
      id: 't1',
      title: 'Cyberpunk UI',
      subtitle: 'Landing Page',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      sampleText: 'Create a high-tech cyberpunk dark UI landing page for a decentralized protocol with glowing neon cyan vectors and HUD metrics.'
    },
    {
      id: 't2',
      title: 'Luxury Brand',
      subtitle: 'Branding',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
      sampleText: 'Design a luxury dark identity system with satin gold accents, geometric interlocking monogram, and premium typography scales.'
    }
  ];

  const recentPrompts = [
    {
      id: 'r1',
      title: 'DeFi Protocol Dashboard',
      time: '2 hours ago',
      text: 'Design a dark-themed financial dashboard with real-time liquidity pools, TVL chart graphs, and token swap modal.'
    },
    {
      id: 'r2',
      title: 'AI Chat Interface',
      time: 'Yesterday',
      text: 'Create a modern AI chat assistant UI with message streaming tokens, model selector drawer, and code syntax highlighting.'
    }
  ];

  const getCreativityLabel = (val: number) => {
    if (val > 66) return 'High';
    if (val > 33) return 'Medium';
    return 'Low';
  };

  const handleGenerate = async (customDesc?: string) => {
    if (!useAICredit(1)) return;
    const textToUse = customDesc || description;
    const finalInput = textToUse.trim() || 'Create a futuristic cyberpunk landing page for a crypto startup';

    setIsLoading(true);

    try {
      const promptPayload = `Generate a detailed, professional AI design prompt for a ${selectedStyle} project.\nRequirements:\n- Theme/Idea: ${finalInput}\n- Style Category: ${selectedStyle}\n- Creativity: ${getCreativityLabel(creativity)}\n- Output Detail Level: ${selectedLength}\n\nFormat the output as a ready-to-use structured prompt for Midjourney / Stable Diffusion / UI design tools with precise color hex codes, layout grid rules, typography pairings, and visual style notes.`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      });

      const data = await res.json();
      const textResult = data.result || `### Professional AI Prompt: ${selectedStyle}\n\nDetailed prompt for "${finalInput}"`;
      setGeneratedPrompt(textResult);

      addAIHistoryItem({
        title: `${selectedStyle} Prompt`,
        category: 'Prompts',
        iconType: 'prompt',
        details: textResult
      });
    } catch (err) {
      console.error(err);
      // Fallback structured high quality output
      setGeneratedPrompt(
        `### Professional AI Prompt: ${selectedStyle}\n\n` +
        `**Prompt:** Ultra-detailed ${selectedStyle.toLowerCase()} concept for "${finalInput}". Cyberpunk dark mode background (#050508) with high-contrast electric indigo (#6366f1) and glowing violet highlights.\n\n` +
        `**Key Design Tokens:**\n` +
        `- **Layout**: 12-column grid system, 24px padding math, rounded corner cards (16px).\n` +
        `- **Typography**: Plus Jakarta Sans for headings paired with JetBrains Mono for telemetry data.\n` +
        `- **Visual Effects**: Soft radial backlights, subtle 1px hairline border overlays, micro-interactions.\n` +
        `- **Parameters**: --ar 16:9 --style raw --v 6.0 --q 2`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      showToast(t('the_prompt_has_been_copied_to'));
      setTimeout(() => setCopied(false), 2000);
    }
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
            Prompt Generator
          </h1>

          <button
            onClick={() => showToast(t('history_of_generated_prompts'))}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* DESCRIBE WHAT YOU WANT TO CREATE CARD */}
        <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-3 shadow-2xl relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">
              Describe what you want to create
            </h2>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07070c] border border-zinc-800/90 focus-within:border-indigo-500/60 transition-colors">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: Create a futuristic cyberpunk landing page for a crypto startup..."
              className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* DESIGN STYLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            DESIGN STYLE
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {designStyles.map((style) => {
              const isActive = selectedStyle === style;
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* PROMPT SETTINGS CARD */}
        <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            Prompt Settings
          </h3>

          {/* Creativity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-bold">Creativity</span>
              <span className="font-mono text-indigo-300 font-bold">
                {getCreativityLabel(creativity)}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={creativity}
                onChange={(e) => setCreativity(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-zinc-900 appearance-none cursor-pointer accent-indigo-500 border border-zinc-800"
              />
            </div>
          </div>

          {/* Length Segmented Control */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-300 font-bold block">
              Length
            </span>

            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#07070c] border border-zinc-800/90">
              {(['Short', 'Medium', 'Detailed'] as const).map((len) => {
                const isActive = selectedLength === len;
                return (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {len}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* POPULAR TEMPLATES SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            POPULAR TEMPLATES
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => {
                  setDescription(tpl.sampleText);
                  showToast(`Выбран шаблон "${tpl.title}"`);
                }}
                className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 overflow-hidden shadow-xl cursor-pointer hover:border-zinc-700 transition-all group"
              >
                <div className="h-28 w-full relative overflow-hidden bg-zinc-950">
                  <img
                    src={tpl.image}
                    alt={tpl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-transparent to-transparent" />
                </div>

                <div className="p-3.5 space-y-0.5">
                  <h4 className="text-xs font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {tpl.title}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {tpl.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT PROMPTS SECTION */}
        <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-3 shadow-xl">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            RECENT PROMPTS
          </h3>

          <div className="space-y-2">
            {recentPrompts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setDescription(item.text);
                  showToast(`Загружен промпт "${item.title}"`);
                }}
                className="p-3 rounded-2xl bg-[#07070c] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON: GENERATE PROMPT */}
        <div className="pt-1">
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Prompt</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* GENERATED PROMPT OUTPUT MODAL */}
      {generatedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setGeneratedPrompt(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Generated Prompt
                </h3>
              </div>
              <button
                onClick={() => setGeneratedPrompt(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#07070c] border border-zinc-800/90 text-xs sm:text-sm text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
              {generatedPrompt}
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  exportAsJSON('Design_Prompt.json', { prompt: generatedPrompt, style: selectedStyle, creativity });
                  showToast('Промпт экспортирован в JSON!');
                }}
                className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  exportAsFormattedDoc('Design_Prompt_Spec.html', 'AI Prompt Specification', `<h2>AI Prompt Specification</h2><p><strong>Style:</strong> ${selectedStyle}</p><pre style="background:#07070c; padding:15px; border-radius:10px; color:#fff;">${generatedPrompt}</pre>`);
                  showToast('Документ промпта скачан!');
                }}
                className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCopy}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
              </button>

              {onOpenCreateOrder && (
                <button
                  onClick={() => {
                    const promptText = generatedPrompt;
                    setGeneratedPrompt(null);
                    onClose();
                    onOpenCreateOrder(promptText.substring(0, 50));
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Order Design</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
