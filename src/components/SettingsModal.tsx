import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Lock, 
  Link as LinkIcon, 
  Moon, 
  Bell,
  Palette, 
  Grid, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Headphones, 
  LogOut,
  Download, 
  Pencil,
  BadgeCheck,
  Search,
  LayoutGrid,
  CreditCard,
  Sliders,
  Shield,
  Globe
} from 'lucide-react';

import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SettingsModalProps {
  onClose: () => void;
  onOpenBilling?: () => void;
  onOpenPro?: () => void;
  onOpenSupport?: () => void;
  onOpenEditProfile?: () => void;
  onOpenEmailSecurity?: () => void;
  onOpenConnectedAccounts?: () => void;
  onOpenAppearance?: () => void;
  onOpenPrivacy?: () => void;
  onOpenLanguage?: () => void;
  onOpenNotifications?: () => void;
  currentLanguage?: string;
  onReplayLoader?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, 
  onOpenBilling, 
  onOpenPro,
  onOpenSupport,
  onOpenEditProfile,
  onOpenEmailSecurity,
  onOpenConnectedAccounts,
  onOpenAppearance,
  onOpenPrivacy,
  onOpenLanguage,
  onOpenNotifications,
  currentLanguage: propLanguage,
  onReplayLoader
}) => {
  const { language: activeLang, t } = useTranslation();
  const { settings, updateSettings, profile, isPro, logout } = useApp();
  const currentLanguage = propLanguage || activeLang;
  const darkTheme = settings.darkTheme;
  const gridBg = settings.gridBg;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { isInstallable, installApp } = usePWAInstall();

  // Sub-sections interactivity states
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div 
        className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28"
        style={{
          paddingTop: 'max(1.25rem, env(safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px))',
          paddingBottom: 'max(7rem, env(safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))'
        }}
      >
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

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

          <div className="w-10 flex justify-end">
            {/* Search or Close icon placeholder */}
            <button 
              onClick={() => showToast(t('auto_0JQvtC40'))}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PAGE TITLE & SUBTITLE */}
        <div className="space-y-1 px-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('settings_title')}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t('settings_subtitle')}
          </p>
        </div>

        {/* PROFILE HERO CARD */}
        <div className="p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Alex Mercer"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Alex Mercer
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
                <BadgeCheck className="w-3 h-3 text-indigo-400" />
                <span>ELITE DESIGNER</span>
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              @amercer_design
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                if (onOpenEditProfile) {
                  onClose();
                  onOpenEditProfile();
                } else {
                  showToast(t('auto_0KDQtdC0'));
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-700/80 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-all active:scale-95"
            >
              <Pencil className="w-3.5 h-3.5 text-zinc-400" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* PRIMARY SETTINGS CARD MATCHING SCREENSHOT */}
        <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/80 shadow-2xl text-xs sm:text-sm">
          {/* 1. Theme */}
          <div 
            onClick={() => {
              const nextTheme = !darkTheme;
              updateSettings({ darkTheme: nextTheme });
              showToast(nextTheme ? t('auto_0KLQtdC8') : t('auto_0KLQtdC8'));
            }}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-zinc-200 font-medium tracking-tight">Theme</span>
            </div>
            <span className="text-zinc-400 font-mono text-xs sm:text-sm">
              {darkTheme ? 'Dark' : 'Light'}
            </span>
          </div>

          {/* 2. Notifications */}
          <div 
            onClick={() => {
              if (onOpenNotifications) {
                onClose();
                onOpenNotifications();
              } else {
                const nextNotif = !settings.notificationsEnabled;
                updateSettings({ notificationsEnabled: nextNotif });
                showToast(nextNotif ? t('auto_0KPQstC1') : t('auto_0KPQstC1'));
              }
            }}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <Bell className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-zinc-200 font-medium tracking-tight">Notifications</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs sm:text-sm">
              <span>{settings.notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </div>

          {/* 3. Language */}
          <div 
            onClick={() => {
              if (onOpenLanguage) {
                onClose();
                onOpenLanguage();
              } else {
                showToast(t('auto_0JLRi9Cx'));
              }
            }}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-zinc-200 font-medium tracking-tight">Language</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs sm:text-sm">
              <span>
                {currentLanguage === 'en' ? 'English' :
                 currentLanguage === 'uk' ? t('ukrainian') :
                 currentLanguage === 'kk' ? t('kazakh') :
                 currentLanguage === 'be' ? t('belarusian') :
                 t('russian')}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </div>

          {/* 4. Privacy */}
          <div 
            onClick={() => {
              if (onOpenPrivacy) {
                onClose();
                onOpenPrivacy();
              } else if (onOpenEmailSecurity) {
                onClose();
                onOpenEmailSecurity();
              } else {
                showToast(t('auto_0JRgNC40'));
              }
            }}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-zinc-200 font-medium tracking-tight">Privacy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>

          {/* 5. Support */}
          <div 
            onClick={() => {
              if (onOpenSupport) {
                onClose();
                onOpenSupport();
              } else {
                showToast(t('auto_0KHQu9GD'));
              }
            }}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-zinc-200 font-medium tracking-tight">Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>
        </div>

        {/* ACCOUNT & PREFERENCES SECTION (NON-DUPLICATE SUB-ACTIONS) */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase px-1">
            ACCOUNT & DISPLAY
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* Personal Information */}
            <button
              onClick={() => {
                if (onOpenEditProfile) {
                  onClose();
                  onOpenEditProfile();
                } else {
                  showToast(t('auto_0JvQuNGH'));
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                  <User className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Personal Information</h4>
                  <p className="text-xs text-zinc-400">Name, Handle & Avatar</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>

            {/* Connected Accounts */}
            <button
              onClick={() => {
                if (onOpenConnectedAccounts) {
                  onClose();
                  onOpenConnectedAccounts();
                } else {
                  showToast(t('auto_0JQvtC00'));
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                  <LinkIcon className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Connected Accounts</h4>
                  <p className="text-xs text-zinc-400">Github, Figma</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>

            {/* Billing & Subscriptions */}
            <button
              onClick={() => {
                if (onOpenBilling) {
                  onClose();
                  onOpenBilling();
                } else {
                  showToast(t('auto_0JHQuNC7'));
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Billing & Subscriptions</h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {isPro ? 'Active Pro' : 'Free Tier'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>

            {/* Grid Background Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300">
                  <Grid className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Grid Background</h4>
                  <p className="text-xs text-zinc-400">Subtle texture</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextGrid = !gridBg;
                  updateSettings({ gridBg: nextGrid });
                  showToast(nextGrid ? t('auto_0KHQtdGC') : t('auto_0KHQtdGC'));
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  gridBg ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  gridBg ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            
            {/* Install App */}
            {isInstallable && (
              <button
                onClick={() => {
                  installApp();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Download className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-zinc-200 font-medium tracking-tight">{t('install_app')}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{t('add_to_home_screen')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            )}

            {/* Replay OS Loading Splash Animation */}
            {onReplayLoader && (
              <button
                onClick={() => {
                  onClose();
                  onReplayLoader();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#151233] border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors shadow-lg">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      Replay OS Splash Loader
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-extrabold uppercase">
                        60 FPS
                      </span>
                    </h4>
                    <p className="text-xs text-indigo-400 font-medium">Preview Rival Space luxury boot sequence</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* PRO BANNER CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#14122e] via-[#0f0e1e] to-[#0e0e16] border border-indigo-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Rival Space Pro
            </h3>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Unlock advanced creative tools and elevate your workflow.
          </p>

          <div className="space-y-2 text-xs text-zinc-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Unlimited AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Premium Assets Library</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenPro) {
                onClose();
                onOpenPro();
              } else if (onOpenBilling) {
                onClose();
                onOpenBilling();
              } else {
                showToast(t('auto_0KPQv9GA'));
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            Manage Plan
          </button>
        </div>

        {/* LOG OUT BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#140b0e] hover:bg-red-950/40 border border-red-900/40 text-xs font-semibold text-red-400 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
