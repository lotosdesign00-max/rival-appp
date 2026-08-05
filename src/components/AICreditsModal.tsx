import React, { useState } from 'react';
import { 
  ArrowLeft, 
  History, 
  Sparkles, 
  ArrowUp, 
  FileText, 
  Award, 
  MessageSquare, 
  Diamond
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIHistoryModal } from './AIHistoryModal';
import { useTranslation } from "../context/LanguageContext";

interface AICreditsModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
  onOpenPro?: () => void;
}

export const AICreditsModal: React.FC<AICreditsModalProps> = ({
  onClose,
  onOpenCreateOrder,
  onOpenPro
}) => {
    const { t } = useTranslation();
  const { aiCredits, isPro, aiHistory, addAICredits, deductBalance } = useApp();
  const [showHistory, setShowHistory] = useState(false);

  const handleBuyCredits = (amount: number, price: number) => {
    addAICredits(amount);
    deductBalance(price, `+${amount} AI Credits`);
  };

  const totalLimit = 1000;
  const remainingCredits = isPro ? 1000 : Math.min(aiCredits, totalLimit);
  const usedCredits = isPro ? 0 : Math.max(0, totalLimit - remainingCredits);
  const percentRemaining = isPro ? 100 : Math.round((remainingCredits / totalLimit) * 100);

  // Next month reset date calculation
  const nextResetDate = new Date();
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);
  nextResetDate.setDate(1);
  const formattedResetDate = nextResetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleUpgradePlan = () => {
    onClose();
    if (onOpenPro) {
      onOpenPro();
    } else if (onOpenCreateOrder) {
      onOpenCreateOrder('Rival Space Pro');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-5 space-y-5 pb-24 relative">

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
            AI Credits
          </h1>

          <button
            onClick={() => setShowHistory(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* HERO CARD: YOUR AI CREDITS */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Diamond Icon Badge */}
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <Diamond className="w-5 h-5 text-indigo-300" />
          </div>

          <div className="relative z-10 space-y-1.5 max-w-xs mx-auto">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Your AI Credits
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track usage, remaining credits and upgrade options.
            </p>
          </div>

          {/* CIRCULAR PROGRESS METER */}
          <div className="relative z-10 flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-zinc-900"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-indigo-500"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - Math.max(0, Math.min(1, percentRemaining / 100)))}
                  strokeLinecap="round"
                  stroke="url(#indigo-purple-grad)"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="indigo-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered Percentage Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">
                  {percentRemaining}%
                </span>
                <span className="text-[11px] font-medium text-zinc-400 tracking-wide mt-0.5">
                  Remaining
                </span>
              </div>
            </div>

            {/* Pill Badge */}
            <div className="mt-4 px-5 py-2 rounded-full bg-[#121124] border border-indigo-500/30 text-xs font-mono font-bold text-indigo-200 shadow-md">
              {remainingCredits} / {totalLimit} Credits
            </div>
          </div>
        </div>

        {/* 2x2 STATS CARD GRID */}
        <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {/* Used */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                Used
              </span>
              <span className="text-xl font-black text-white tracking-tight">
                {usedCredits}
              </span>
            </div>

            {/* Remaining */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                Remaining
              </span>
              <span className="text-xl font-black text-indigo-400 tracking-tight">
                {remainingCredits}
              </span>
            </div>

            {/* Monthly Limit */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                Monthly Limit
              </span>
              <span className="text-xl font-black text-white tracking-tight">
                {totalLimit}
              </span>
            </div>

            {/* Next Reset */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                Next Reset
              </span>
              <span className="text-xs font-bold text-zinc-200 tracking-tight pt-1 block">
                {formattedResetDate}
              </span>
            </div>
          </div>
        </div>

        {/* USAGE BREAKDOWN CARD */}
        <div className="space-y-2.5">
          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Usage Breakdown
            </h3>

            {aiHistory.length === 0 ? (
              <div className="text-center py-4 space-y-1">
                <p className="text-xs font-bold text-white">{t('ai_generation_history_is_empty')}</p>
                <p className="text-[11px] text-zinc-400">
                  {t('complete_the_first_generation')}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI Generations</span>
                    </div>
                    <span className="font-mono text-zinc-400 font-bold">{aiHistory.length}</span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, aiHistory.length * 10)}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BUY EXTRA CREDITS */}
        <div className="space-y-2.5">
          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-5 space-y-3.5 shadow-xl">
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center justify-between">
              <span>{t('buy_a_package_of_ai_credits')}</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleBuyCredits(100, 10)}
                className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 text-center transition-all group active:scale-95"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-300">+100 Cr</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">$10</div>
              </button>
              <button
                onClick={() => handleBuyCredits(500, 35)}
                className="p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/40 text-center transition-all group active:scale-95 shadow-md"
              >
                <div className="text-xs font-bold text-indigo-200">+500 Cr</div>
                <div className="text-[10px] font-mono text-indigo-300/80 mt-0.5">$35</div>
              </button>
              <button
                onClick={() => handleBuyCredits(1000, 65)}
                className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 hover:from-indigo-800/50 hover:to-purple-800/50 border border-indigo-500/50 text-center transition-all group active:scale-95 shadow-md"
              >
                <div className="text-xs font-bold text-white">+1000 Cr</div>
                <div className="text-[10px] font-mono text-amber-300 mt-0.5">$65</div>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM UPGRADE PLAN CTA */}
        <div className="pt-2">
          <button
            onClick={handleUpgradePlan}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowUp className="w-4 h-4 text-white" />
            <span>Upgrade Plan</span>
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
