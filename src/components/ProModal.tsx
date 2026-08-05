import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Sparkles, 
  FolderArchive, 
  BarChart3, 
  Check, 
  Headphones, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Folder,
  X
} from 'lucide-react';

interface ProModalProps {
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ onClose }) => {
  const { isPro, setIsPro, setAiCredits, deductBalance } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleUpgrade = () => {
    const cost = billingCycle === 'yearly' ? 249 : 29;
    setIsPro(true);
    setAiCredits(1000);
    deductBalance(cost, `Rival Pro ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
            RIVAL SPACE
          </span>

          <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Profile" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TOP BADGE & TITLE */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>PRO MEMBER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rival Space Pro
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Unlock the full creative ecosystem.
          </p>
        </div>

        {/* HERO COSMIC BANNER */}
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 p-6 sm:p-7 shadow-2xl min-h-[160px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80"
            alt="Cosmic Nebula"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090814] via-[#0d0a22]/80 to-transparent" />

          <div className="relative z-10 space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Create faster. Design smarter.
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Premium tools for professional creators.
            </p>
          </div>
        </div>

        {/* 3 HIGHLIGHT ICONS ROW */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 text-center space-y-2">
            <Sparkles className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-[11px] font-bold text-white block">Unlimited AI</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 text-center space-y-2">
            <Folder className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-[11px] font-bold text-white block">Premium Assets</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 text-center space-y-2">
            <BarChart3 className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-[11px] font-bold text-white block">Analytics</span>
          </div>
        </div>

        {/* COMPARISON TABLE CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Comparison
          </h3>

          <div className="space-y-2 text-xs">
            {/* Header */}
            <div className="grid grid-cols-3 text-zinc-400 font-mono font-semibold pb-1 border-b border-zinc-800">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-right text-indigo-400">Pro</span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-3 text-white font-medium py-1">
              <span>AI Assistant</span>
              <span className="text-center text-zinc-400">Limited</span>
              <span className="text-right text-indigo-300 font-bold">Unlimited</span>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 text-white font-medium py-1">
              <span>Assets</span>
              <span className="text-center text-zinc-400">Basic</span>
              <span className="text-right text-indigo-300 font-bold">Premium</span>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 text-white font-medium py-1">
              <span>Analytics</span>
              <span className="text-center text-zinc-400">None</span>
              <span className="text-right text-indigo-300 font-bold">Advanced</span>
            </div>
          </div>
        </div>

        {/* PRICING PLANS */}
        <div className="space-y-3">
          {/* Monthly Card */}
          <div
            onClick={() => setBillingCycle('monthly')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-1 ${
              billingCycle === 'monthly'
                ? 'bg-[#121222] border-indigo-500/80 shadow-lg shadow-indigo-950/50'
                : 'bg-[#0e0e16] border-zinc-800/90 hover:border-zinc-700'
            }`}
          >
            <span className="text-xs font-bold text-white block">Monthly</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">$29</span>
              <span className="text-xs text-zinc-400 font-mono">/ month</span>
            </div>
          </div>

          {/* Yearly Card (Best Value) */}
          <div
            onClick={() => setBillingCycle('yearly')}
            className={`relative p-5 rounded-3xl border transition-all cursor-pointer space-y-2 ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-b from-[#14122d] via-[#100f24] to-[#0e0e16] border-indigo-500 shadow-xl shadow-indigo-950/60 ring-1 ring-indigo-500/50'
                : 'bg-[#0e0e16] border-zinc-800/90 hover:border-zinc-700'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                SAVE 30%
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/50 text-[9px] font-mono font-bold uppercase tracking-wider">
                BEST VALUE
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Yearly</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">$249</span>
                <span className="text-xs text-zinc-400 font-mono">/ year</span>
              </div>
            </div>

            <p className="text-xs text-indigo-300 font-medium font-mono">
              Save $99 annually
            </p>
          </div>
        </div>

        {/* EVERYTHING INCLUDED CARD */}
        <div className="p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Everything included
          </h3>

          <div className="space-y-4">
            {/* 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Unlimited AI Assistant</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate ideas, concepts and design directions.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Folder className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Premium Asset Library</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Exclusive templates, resources and UI kits.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Advanced Analytics</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Track projects and creative performance.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Priority Support</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Faster responses from Rival team.
                </p>
              </div>
            </div>

            {/* 5 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Private Workspace</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Organize your creative ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* YOUR USAGE CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Your Usage
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono font-bold uppercase">
              {isPro ? 'PRO PLAN' : 'FREE PLAN'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400">AI Requests</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[85%]" />
              </div>
              <div className="text-right text-[10px] font-mono text-zinc-400">
                85/100
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400">Projects</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-full" />
              </div>
              <div className="text-right text-[10px] font-mono text-red-400 font-bold">
                3/3 (Max)
              </div>
            </div>
          </div>
        </div>

        {/* MAIN UPGRADE CALL TO ACTION BUTTON */}
        <div className="space-y-2 text-center pt-2">
          <button
            onClick={handleUpgrade}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{isPro ? 'Subscription Active ✓' : 'Upgrade to Pro'}</span>
            <span className="text-lg">→</span>
          </button>

          <p className="text-xs text-zinc-400 font-sans">
            Cancel anytime. No hidden fees.
          </p>
        </div>

      </div>
    </div>
  );
};
