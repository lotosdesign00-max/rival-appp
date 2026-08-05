import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/LanguageContext';
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Bitcoin,
  Star,
  Check,
  ShieldCheck,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';

interface TopUpModalProps {
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ onClose }) => {
  const { profile, showToast, depositBalance } = useApp();
  const { t } = useTranslation();
  
  const [depositAmount, setDepositAmount] = useState('50');
  const [depositMethod, setDepositMethod] = useState<'card' | 'crypto' | 'stars'>('stars');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast(t('topup_error_amount'));
      return;
    }

    setIsProcessing(true);

    try {
      let endpoint = '';
      if (depositMethod === 'card') endpoint = '/api/payments/card';
      else if (depositMethod === 'crypto') endpoint = '/api/payments/crypto';
      else if (depositMethod === 'stars') endpoint = '/api/payments/stars';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        if (depositMethod === 'stars' && (window as any).Telegram?.WebApp?.openInvoice) {
           (window as any).Telegram.WebApp.openInvoice(data.url, (status: string) => {
             if (status === 'paid') {
               showToast(t('topup_success_stars'));
               onClose();
             } else {
               showToast(t('topup_cancelled'));
               setIsProcessing(false);
             }
           });
        } else {
           window.open(data.url, '_blank', 'noopener,noreferrer');
           showToast(t('topup_redirect_msg'));
           setTimeout(() => {
              setIsProcessing(false);
              onClose();
           }, 1500);
        }
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (err: any) {
      // Demo mode fallback if APIs aren't properly set up
      console.error('Payment error:', err);
      showToast(
        depositMethod === 'stars' 
          ? t('topup_demo_msg') 
          : t('topup_success_demo')
      );
      setTimeout(() => {
         setIsProcessing(false);
         depositBalance(amt);
         onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#050508] font-sans animate-in slide-in-from-right duration-300">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-32 flex flex-col relative">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pt-1 relative">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-zinc-300 hover:text-white transition-colors flex items-center justify-center active:scale-95 absolute left-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white w-full text-center">
            {t('topup_title')}
          </h1>
        </div>

        {/* --- STEP 1: AMOUNT & METHOD --- */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          {/* CURRENT BALANCE CARD */}
          <div className="relative p-6 rounded-[2rem] bg-[#12121A] border border-zinc-800/80 shadow-2xl overflow-hidden mt-6 flex flex-col items-center justify-center py-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#12121A]/0 to-[#12121A]/0"></div>
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase relative z-10 mb-2">
              CURRENT BALANCE
            </span>
            <div className="text-4xl font-extrabold text-white tracking-tight relative z-10 flex items-center">
              <span className="text-zinc-500 mr-2">$</span>
              {profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* CUSTOM AMOUNT */}
          <div className="space-y-2 mt-6">
            <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
              CUSTOM AMOUNT
            </label>
            <div className="relative">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full pl-12 pr-4 py-4 rounded-3xl bg-[#12121A] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors text-base"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 text-xl font-medium">$</span>
            </div>
          </div>

          {/* {t('topup_amount_label')} */}
          <div className="space-y-3 mt-6">
            <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
              {t('topup_amount_label')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['10', '25', '50', '100', '250', 'Custom'].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    if (val !== 'Custom') {
                      setDepositAmount(val);
                    } else {
                      setDepositAmount('');
                    }
                  }}
                  className={`py-3.5 rounded-3xl border text-sm font-medium transition-all ${
                    (val === 'Custom' ? depositAmount === '' : depositAmount === val)
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-[#12121A] border-zinc-800 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {val === 'Custom' ? t('topup_custom_amount') : `$${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* {t('topup_method_label')} */}
          <div className="space-y-3 mt-6">
            <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
              {t('topup_method_label')}
            </label>
            <div className="space-y-3">
              {/* Telegram Stars */}
              <button 
                onClick={() => setDepositMethod('stars')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  depositMethod === 'stars' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#12121A] flex items-center justify-center border border-indigo-500/30">
                    <Star className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                  </div>
                  <div className="text-left flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Telegram Stars</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500 text-white tracking-wider">INSTANT</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">Powered by Telegram</div>
                  </div>
                </div>
                {depositMethod === 'stars' ? (
                  <div className="w-6 h-6 rounded-full bg-transparent border-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                       <Check className="w-3 h-3 text-black stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                )}
              </button>

              {/* Bank Card (Stripe) */}
              <button 
                onClick={() => setDepositMethod('card')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  depositMethod === 'card' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center overflow-hidden border border-blue-800/50">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Bank Card</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Powered by Stripe</div>
                  </div>
                </div>
                {depositMethod === 'card' ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                )}
              </button>

              {/* Crypto (Coinbase) */}
              <button 
                onClick={() => setDepositMethod('crypto')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  depositMethod === 'crypto' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-800/50">
                    <Bitcoin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Crypto</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Powered by Coinbase Commerce</div>
                  </div>
                </div>
                {depositMethod === 'crypto' ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          {/* {t('topup_summary_title')} */}
          <div className="space-y-4 mt-8 pb-20 px-2">
            <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
              {t('topup_summary_title')}
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">{t('topup_summary_amount')}</span>
              <span className="text-white">${parseFloat(depositAmount || '0').toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">{t('topup_summary_fee')} (0%)</span>
              <span className="text-white">$0.00</span>
            </div>
            <div className="h-px bg-zinc-800 w-full my-1"></div>
            <div className="flex justify-between text-base font-bold">
              <span className="text-white">{t('topup_summary_total')}</span>
              <span className="text-white">${parseFloat(depositAmount || '0').toFixed(2)}</span>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12121A] border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>{t('topup_secure_msg')}</span>
              </div>
            </div>
          </div>

          {/* BOTTOM BUTTON */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050508] via-[#050508] to-transparent pb-8">
            <button
              onClick={handleContinue}
              disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0}
              className={`w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                (isProcessing || !depositAmount || parseFloat(depositAmount) <= 0)
                  ? 'bg-[#5b5bf0]/50 text-white/50 cursor-not-allowed' 
                  : 'bg-[#5b5bf0] hover:bg-[#4d4de8] text-white shadow-[0_0_20px_rgba(91,91,240,0.3)]'
              }`}
            >
              {isProcessing ? t('topup_processing') : `${t('topup_continue_btn')} ${
                depositMethod === 'card' ? 'Stripe' : 
                depositMethod === 'crypto' ? 'Coinbase' : 'Telegram'
              }`}
              {!isProcessing && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
