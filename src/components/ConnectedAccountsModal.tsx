import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Share2, 
  Code2, 
  Figma, 
  Edit3, 
  Dribbble,
  CheckCircle2, 
  Plus, 
  Lightbulb, 
  Check, 
  Shield, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface ConnectedAccountsModalProps {
  onClose: () => void;
}

interface AccountItem {
  id: string;
  name: string;
  handle?: string;
  connected: boolean;
  icon: React.ReactNode;
}

export const ConnectedAccountsModal: React.FC<ConnectedAccountsModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
  const { accounts: savedAccounts, toggleAccountConnect, disconnectAllAccounts } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'github': return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'figma': return <Figma className="w-5 h-5 text-purple-400" />;
      case 'behance': return <Edit3 className="w-5 h-5 text-blue-400" />;
      case 'dribbble': return <Dribbble className="w-5 h-5 text-pink-400" />;
      default: return <Code2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  const accounts: AccountItem[] = savedAccounts.map(acc => ({
    ...acc,
    icon: getIcon(acc.id)
  }));

  const [selectedManageAccount, setSelectedManageAccount] = useState<AccountItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleConnect = (id: string) => {
    const target = accounts.find(a => a.id === id);
    if (target) {
      showToast(!target.connected ? `Аккаунт ${target.name} подключен` : `Аккаунт ${target.name} отключен`);
    }
    toggleAccountConnect(id);
  };

  const handleDisconnectAll = () => {
    disconnectAllAccounts();
    showToast(t('all_connected_accounts_are_dis'));
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
            Connected Accounts
          </h1>

          <div className="w-10" />
        </div>

        {/* HERO CARD */}
        <div className="p-7 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest z-10">
            CONNECTED ECOSYSTEM
          </span>

          <div className="w-14 h-14 rounded-full bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] z-10">
            <Share2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 z-10">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Your creative tools, connected
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Sync your design files, code repositories, and portfolios to automate your workflow.
            </p>
          </div>
        </div>

        {/* CONNECTED ACCOUNTS LIST */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            CONNECTED ACCOUNTS
          </h3>

          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    {acc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white tracking-tight">{acc.name}</h4>
                      {acc.connected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {acc.connected ? acc.handle : 'Not Connected'}
                    </p>
                  </div>
                </div>

                {acc.connected ? (
                  <button
                    onClick={() => setSelectedManageAccount(acc)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-indigo-950/40"
                  >
                    Manage
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleConnect(acc.id)}
                    className="flex items-center gap-1 text-xs font-bold text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WHY CONNECT CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 text-white">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold tracking-tight">Why connect?</h4>
          </div>

          <div className="space-y-2.5">
            {[
              'Import design files seamlessly',
              'Sync portfolio projects automatically',
              'Share creative work faster',
              'Track collaboration activity across platforms'
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-300 leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY ENCRYPTED NOTICE */}
        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-start gap-3">
          <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your accounts are encrypted and only used for Rival Space features. We never post on your behalf.
          </p>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              const unconnected = accounts.find(a => !a.connected);
              if (unconnected) {
                handleToggleConnect(unconnected.id);
              } else {
                showToast(t('all_available_services_are_alr'));
              }
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Connect New Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDisconnectAll}
            className="w-full py-3.5 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-zinc-300 transition-all active:scale-95 text-center"
          >
            Disconnect All
          </button>
        </div>

      </div>

      {/* MANAGE ACCOUNT MODAL */}
      {selectedManageAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-zinc-800 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                {selectedManageAccount.icon}
                <h3 className="text-sm font-bold">Manage {selectedManageAccount.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedManageAccount(null)} 
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                Connected handle: <span className="font-mono text-white font-bold">{selectedManageAccount.handle}</span>
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatic synchronization is currently active for this integration.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  handleToggleConnect(selectedManageAccount.id);
                  setSelectedManageAccount(null);
                }}
                className="w-full py-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Disconnect {selectedManageAccount.name}
              </button>
              
              <button
                onClick={() => setSelectedManageAccount(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
