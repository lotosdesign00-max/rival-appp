import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/LanguageContext';
import {
  ArrowLeft,
  MoreVertical,
  Wallet,
  Bitcoin,
  Landmark,
  Shield,
  ArrowRight
} from 'lucide-react';

interface WithdrawModalProps {
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose }) => {
  const { profile, showToast, withdrawBalance } = useApp();
  const { t } = useTranslation();
  
  const [withdrawAmount, setWithdrawAmount] = useState('500.00');
  const [withdrawMethod, setWithdrawMethod] = useState<'crypto' | 'card'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);

  const parsedAmount = parseFloat(withdrawAmount) || 0;
  const networkFee = withdrawMethod === 'crypto' ? 2.50 : 0.00;
  const youReceive = Math.max(0, parsedAmount - networkFee);

  const handleConfirm = () => {
    if (parsedAmount <= 0) {
      showToast(t('withdraw_error_amount'));
      return;
    }
    if (parsedAmount > profile.balance) {
      showToast(t('withdraw_error_funds'));
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = withdrawBalance(parsedAmount);
      if (success) {
        showToast(`${t('withdraw_success')} $${parsedAmount.toFixed(2)}`);
        onClose();
      } else {
        showToast(t('withdraw_error_funds'));
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleMax = () => {
    setWithdrawAmount(profile.balance.toString());
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#09090b] font-sans animate-in slide-in-from-bottom-4 duration-300">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1f1f2e 1px, transparent 1px),
            linear-gradient(to bottom, #1f1f2e 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-32 flex flex-col relative z-10">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pt-1 relative">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-zinc-300 hover:text-white transition-colors flex items-center justify-center active:scale-95 absolute left-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white w-full text-center">
            {t('withdraw_title')}
          </h1>
          <button className="w-10 h-10 rounded-full text-zinc-400 hover:text-white transition-colors flex items-center justify-center active:scale-95 absolute right-0">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-sm text-zinc-400 mt-2">
          {t('withdraw_subtitle')}
        </div>

        {/* --- AVAILABLE BALANCE CARD --- */}
        <div className="relative p-6 rounded-[2rem] bg-[#14141a] border border-zinc-800/80 shadow-2xl overflow-hidden mt-6 flex flex-col items-center justify-center py-8">
          <div className="absolute -right-6 -top-6 text-zinc-800/20 rotate-12">
            <Wallet className="w-48 h-48" strokeWidth={1} />
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 relative z-10">
            <Wallet className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase relative z-10 mb-2">
            {t('withdraw_available')}
          </span>
          <div className="text-4xl font-extrabold text-white tracking-tight relative z-10 flex items-center">
            ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* --- {t('withdraw_method_label')} --- */}
        <div className="space-y-3 mt-6">
          <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
            {t('withdraw_method_label')}
          </label>
          <div className="space-y-3">
            {/* {t('withdraw_crypto')} */}
            <button 
              onClick={() => setWithdrawMethod('crypto')}
              className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                withdrawMethod === 'crypto' ? 'bg-[#181824] border-zinc-600' : 'bg-[#12121A] border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <Bitcoin className="w-5 h-5" />
                </div>
                <div className="text-left flex flex-col items-start">
                  <div className="text-base font-bold text-white">{t('withdraw_crypto')}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">USDT, BTC, ETH</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600" />
            </button>

            {/* {t('withdraw_card')} */}
            <button 
              onClick={() => setWithdrawMethod('card')}
              className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                withdrawMethod === 'card' ? 'bg-[#181824] border-zinc-600' : 'bg-[#12121A] border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="text-left flex flex-col items-start">
                  <div className="text-base font-bold text-white">{t('withdraw_card')}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Visa, Mastercard</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
        </div>

        {/* --- {t('withdraw_amount_label')} --- */}
        <div className="space-y-3 mt-6">
          <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
            {t('withdraw_amount_label')}
          </label>
          <div className="p-4 rounded-[2rem] bg-[#14141a] border border-zinc-800/80">
            <div className="relative flex items-center bg-white rounded-xl overflow-hidden px-4 py-3 mb-4">
              <span className="text-zinc-400 font-bold text-xl mr-2">$</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-zinc-800 font-bold text-lg focus:outline-none"
              />
              <button 
                onClick={handleMax}
                className="text-indigo-400 font-bold text-sm tracking-wide ml-2 hover:text-indigo-500"
              >
                {t('withdraw_max_btn')}
              </button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              {['10', '25', '50', '100'].map(val => (
                <button
                  key={val}
                  onClick={() => setWithdrawAmount(val)}
                  className={`flex-1 py-2.5 rounded-full border text-xs font-bold transition-all ${
                    withdrawAmount === val 
                      ? 'bg-zinc-700 border-zinc-600 text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- {t('withdraw_summary_title')} --- */}
        <div className="space-y-4 p-5 rounded-[2rem] bg-[#14141a] border border-zinc-800/80 mt-6">
          <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
            {t('withdraw_summary_title')}
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{t('withdraw_summary_amount')}</span>
            <span className="text-white">${parsedAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-zinc-800 w-full my-1"></div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{t('withdraw_summary_fee')}</span>
            <span className="text-yellow-500">-${networkFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-zinc-800 w-full my-1"></div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{t('withdraw_summary_time')}</span>
            <span className="text-white">{t('withdraw_summary_time_val')}</span>
          </div>
          <div className="h-px bg-zinc-800 w-full my-1"></div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-white font-bold text-lg">{t('withdraw_summary_receive')}</span>
            <span className="text-indigo-300 font-bold text-2xl">${youReceive.toFixed(2)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#12121A] flex items-center justify-center gap-2 mb-10">
          <Shield className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400">{t('withdraw_secure_msg')}</span>
        </div>

      </div>

      {/* BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-zinc-900 z-20">
        <button
          onClick={handleConfirm}
          disabled={isProcessing || parsedAmount <= 0 || parsedAmount > profile.balance}
          className={`w-full max-w-md mx-auto py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            (isProcessing || parsedAmount <= 0 || parsedAmount > profile.balance)
              ? 'bg-[#7373f7]/50 text-white/50 cursor-not-allowed' 
              : 'bg-[#7373f7] hover:bg-[#5b5bf0] text-white shadow-[0_0_20px_rgba(115,115,247,0.3)]'
          }`}
        >
          {isProcessing ? t('withdraw_processing') : t('withdraw_confirm_btn')}
          {!isProcessing && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
};
