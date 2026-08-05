import React, { useState, useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowLeft, 
  History, 
  FileText, 
  Layers, 
  LayoutGrid, 
  MessageSquare, 
  ChevronRight, 
  ArrowRight, 
  Wand2, 
  Palette, 
  Type, 
  Hexagon, 
  X, 
  Copy, 
  Check, 
  Loader2, 
  Send,
  Zap
} from 'lucide-react';
import { PromptGeneratorModal } from './PromptGeneratorModal';
import { BrandGeneratorModal } from './BrandGeneratorModal';
import { MoodboardGeneratorModal } from './MoodboardGeneratorModal';
import { RivalAIChatModal } from './RivalAIChatModal';
import { LogoGeneratorModal } from './LogoGeneratorModal';
import { ColorPaletteModal } from './ColorPaletteModal';
import { TypographyAssistantModal } from './TypographyAssistantModal';
import { AIHistoryModal } from './AIHistoryModal';
import { AICreditsModal } from './AICreditsModal';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantScreenProps {
  onOpenCreateOrder?: (title?: string) => void;
  onOpenPro?: () => void;
}

interface RecentSession {
  id: string;
  title: string;
  timestamp: string;
  image: string;
  prompt: string;
  response: string;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = React.memo(({ 
  onOpenCreateOrder,
  onOpenPro
}) => {
  const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit, aiHistory, aiCredits, isPro } = useApp();
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<{ prompt: string; result: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [showBrandGenerator, setShowBrandGenerator] = useState(false);
  const [showMoodboardGenerator, setShowMoodboardGenerator] = useState(false);
  const [showRivalAIChat, setShowRivalAIChat] = useState(false);
  const [showLogoGenerator, setShowLogoGenerator] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showTypographyAssistant, setShowTypographyAssistant] = useState(false);
  const [showAIHistory, setShowAIHistory] = useState(false);
  const [showAICredits, setShowAICredits] = useState(false);
  const [modalTitle, setModalTitle] = useState('Ask AI');

  const handleOpenPromptModal = (title: string, defaultPrompt?: string) => {
    setModalTitle(title);
    if (defaultPrompt) {
      setPromptInput(defaultPrompt);
    }
    setIsPromptModalOpen(true);
  };

  const handleSendPrompt = async (customText?: string) => {
    const textToSubmit = customText || promptInput;
    if (!textToSubmit.trim()) return;

    if (!useAICredit(10)) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit }),
      });

      const data = await response.json();
      const resultText = data.result || 'AI response generated successfully.';

      setActiveResponse({ prompt: textToSubmit, result: resultText });
      setIsPromptModalOpen(false);
      setPromptInput('');

      addAIHistoryItem({
        title: textToSubmit.length > 25 ? textToSubmit.substring(0, 25) + '...' : textToSubmit,
        category: 'Prompts',
        iconType: 'prompt',
        details: resultText,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
      });
    } catch (err) {
      console.error(err);
      const fallbackResult = `### Design Intelligence Output\n\n* **Concept**: Spatial UI Structure with high-contrast glowing elements.\n* **Color Token System**: Obsidian Base (#0c0c14), Electric Indigo (#6366f1).\n* **UX Pattern**: Single-view card layout with smooth interactive states.`;
      setActiveResponse({
        prompt: textToSubmit,
        result: fallbackResult
      });
      setIsPromptModalOpen(false);
      setPromptInput('');
      addAIHistoryItem({
        title: textToSubmit.length > 25 ? textToSubmit.substring(0, 25) + '...' : textToSubmit,
        category: 'Prompts',
        iconType: 'prompt',
        details: fallbackResult,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="space-y-5 pb-28 font-sans animate-in fade-in duration-300"
    >
      {/* TOP NAVBAR HEADER */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => showToast('Rival AI Assistant')}
          className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-base font-extrabold text-white tracking-tight">
          Rival AI
        </h1>

        <button
          onClick={() => setShowAIHistory(true)}
          className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
          aria-label="History"
          title="AI History"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {/* HERO CREATIVE ASSISTANT CARD */}
      <div
        className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#16132e] via-[#0d0c1b] to-[#080812] border border-indigo-500/30 p-6 text-center space-y-4 shadow-2xl"
      >
        {/* Glow ambient background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Sparkles Glowing Badge Icon */}
        <div className="relative z-10 w-14 h-14 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 mx-auto shadow-[0_0_25px_rgba(99,102,241,0.35)]">
          <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
        </div>

        {/* Hero Title & Subtitle */}
        <div className="relative z-10 space-y-1.5 max-w-xs mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Your AI Creative Assistant
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Generate ideas, branding, prompts and creative assets in seconds.
          </p>
        </div>

        {/* Primary CTA: Ask AI */}
        <button
          onClick={() => setShowRivalAIChat(true)}
          className="relative z-10 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* 2x2 GENERATOR CARDS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Prompt Generator */}
        <div
          onClick={() => setShowPromptGenerator(true)}
          className="p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
              Prompt Generator
            </h3>
            <p className="text-[10px] text-zinc-400 pt-0.5">
              Generate creative prompts
            </p>
          </div>
        </div>

        {/* 2. Brand Generator */}
        <div
          onClick={() => setShowBrandGenerator(true)}
          className="p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
              Brand Generator
            </h3>
            <p className="text-[10px] text-zinc-400 pt-0.5">
              AI powered identity
            </p>
          </div>
        </div>

        {/* 3. Moodboard Generator */}
        <div
          onClick={() => setShowMoodboardGenerator(true)}
          className="p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
              Moodboard Generator
            </h3>
            <p className="text-[10px] text-zinc-400 pt-0.5">
              Visual inspiration
            </p>
          </div>
        </div>

        {/* 4. AI Chat */}
        <div
          onClick={() => setShowRivalAIChat(true)}
          className="p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
              AI Chat
            </h3>
            <p className="text-[10px] text-zinc-400 pt-0.5">
              Talk to Assistant
            </p>
          </div>
        </div>
      </div>

      {/* RECENT SESSIONS SECTION */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white tracking-tight">
            Recent Sessions
          </h3>
          <button
            onClick={() => setShowAIHistory(true)}
            className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All ({aiHistory.length})
          </button>
        </div>

        <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 divide-y divide-zinc-800/60 overflow-hidden shadow-xl">
          {aiHistory.length > 0 ? (
            aiHistory.slice(0, 5).map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveResponse({ prompt: session.title, result: session.details || `Категория: ${session.category}. Время: ${session.timestamp}` })}
                className="p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center">
                    <img
                      src={session.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                      alt={session.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                      <span>{session.timestamp}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-semibold">{session.category}</span>
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-zinc-400">{t('there_are_no_recent_ai_session')}</p>
              <button
                onClick={() => setShowRivalAIChat(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-all"
              >
                {t('start_first_session')}</button>
            </div>
          )}
        </div>
      </div>

      {/* TRENDING TOOLS SECTION */}
      <div className="space-y-3 pt-1">
        <h3 className="text-base font-extrabold text-white tracking-tight">
          Trending Tools
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Tool 1 */}
          <div
            onClick={() => setShowLogoGenerator(true)}
            className="min-w-[130px] p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shrink-0 shadow-md active:scale-95"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 transition-colors">
              <Wand2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-indigo-200 transition-colors leading-tight">
              Logo Generator
            </span>
          </div>

          {/* Tool 2 */}
          <div
            onClick={() => setShowColorPalette(true)}
            className="min-w-[130px] p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shrink-0 shadow-md active:scale-95"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 transition-colors">
              <Palette className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-indigo-200 transition-colors leading-tight">
              Color Palette AI
            </span>
          </div>

          {/* Tool 3 */}
          <div
            onClick={() => setShowTypographyAssistant(true)}
            className="min-w-[130px] p-4 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer group space-y-3 shrink-0 shadow-md active:scale-95"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#12121e] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 transition-colors">
              <Type className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-indigo-200 transition-colors leading-tight">
              Typography Assistant
            </span>
          </div>
        </div>
      </div>

      {/* AI CREDITS CARD */}
      <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 text-indigo-400 fill-indigo-500/20" />
            <span className="text-xs font-bold text-white">
              AI Credits
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-400">
            {isPro ? t('unlimited_pro') : `${aiCredits} / 1000`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-zinc-900 overflow-hidden p-0.5 border border-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-300"
            style={{ width: isPro ? '100%' : `${Math.min(100, Math.max(0, (aiCredits / 1000) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
          <span>{t('reset_credits_every_month')}</span>
          <span className="text-indigo-400 font-mono">{t('1000_kr_month')}</span>
        </div>

        {/* Secondary Button */}
        <button
          onClick={() => setShowAICredits(true)}
          className="w-full py-3 rounded-2xl bg-[#08080e] hover:bg-zinc-900 border border-zinc-800 text-white text-xs font-extrabold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
        >
          <span>More Details</span>
        </button>
      </div>

      {/* PROMPT INPUT MODAL / DIALOG */}
      {isPromptModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsPromptModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  {modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={t('describe_your_idea_or_question')}
              className="w-full bg-[#07070c] border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            />

            <button
              onClick={() => handleSendPrompt()}
              disabled={isLoading || !promptInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('ai_thinks')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('send_request')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE AI RESPONSE MODAL */}
      {activeResponse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveResponse(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] bg-[#0c0c14] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-[#0c0c14]">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>RIVAL AI OUTPUT</span>
              </div>
              <button
                onClick={() => setActiveResponse(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-300 font-mono">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1 font-bold">PROMPT</span>
                {activeResponse.prompt}
              </div>

              <div className="p-4 rounded-2xl bg-[#10101b] border border-indigo-500/20 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-3 font-sans whitespace-pre-wrap">
                {activeResponse.result}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-zinc-800/80 bg-[#0c0c14] flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopy(activeResponse.result)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('copied') : t('copy_answer')}</span>
              </button>

              <button
                onClick={() => setActiveResponse(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
              >
                {t('close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* PROMPT GENERATOR MODAL SCREEN */}
      {showPromptGenerator && (
        <PromptGeneratorModal
          onClose={() => setShowPromptGenerator(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* BRAND GENERATOR MODAL SCREEN */}
      {showBrandGenerator && (
        <BrandGeneratorModal
          onClose={() => setShowBrandGenerator(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* MOODBOARD GENERATOR MODAL SCREEN */}
      {showMoodboardGenerator && (
        <MoodboardGeneratorModal
          onClose={() => setShowMoodboardGenerator(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* RIVAL AI CHAT MODAL SCREEN */}
      {showRivalAIChat && (
        <RivalAIChatModal
          onClose={() => setShowRivalAIChat(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* LOGO GENERATOR MODAL SCREEN */}
      {showLogoGenerator && (
        <LogoGeneratorModal
          onClose={() => setShowLogoGenerator(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* COLOR PALETTE AI MODAL SCREEN */}
      {showColorPalette && (
        <ColorPaletteModal
          onClose={() => setShowColorPalette(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* TYPOGRAPHY ASSISTANT MODAL SCREEN */}
      {showTypographyAssistant && (
        <TypographyAssistantModal
          onClose={() => setShowTypographyAssistant(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* AI HISTORY MODAL SCREEN */}
      {showAIHistory && (
        <AIHistoryModal
          onClose={() => setShowAIHistory(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}

      {/* AI CREDITS MODAL SCREEN */}
      {showAICredits && (
        <AICreditsModal
          onClose={() => setShowAICredits(false)}
          onOpenCreateOrder={onOpenCreateOrder}
          onOpenPro={onOpenPro}
        />
      )}
    </div>
  );
});
