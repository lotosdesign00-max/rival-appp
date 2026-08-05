import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Shield, 
  Check, 
  ArrowRight, 
  Download, 
  Trash2, 
  Code2, 
  Figma, 
  Edit3, 
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
  const { privacy, updatePrivacy } = useApp();

  // Profile Toggles
  const [publicProfile, setPublicProfile] = useState(privacy.publicProfile);
  const [showOnlineStatus, setShowOnlineStatus] = useState(privacy.showOnlineStatus);
  const [allowDirectMessages, setAllowDirectMessages] = useState(privacy.allowDirectMessages);
  const [allowCollabRequests, setAllowCollabRequests] = useState(privacy.allowCollabRequests);

  // Portfolio Privacy
  const [portfolioPrivacy, setPortfolioPrivacy] = useState<'public' | 'followers' | 'private'>(privacy.portfolioPrivacy);

  // Data Toggles
  const [analyticsCollection, setAnalyticsCollection] = useState(privacy.analyticsCollection);
  const [personalizedRecs, setPersonalizedRecs] = useState(privacy.personalizedRecs);
  const [usageStats, setUsageStats] = useState(privacy.usageStats);

  // Sub-modal and toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    updatePrivacy({
      publicProfile,
      showOnlineStatus,
      allowDirectMessages,
      allowCollabRequests,
      portfolioPrivacy,
      analyticsCollection,
      personalizedRecs,
      usageStats
    });
    showToast(t('privacy_settings_saved'));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleGenerateExport = () => {
    setIsExporting(true);
    showToast(t('formation_of_a_data_archive'));
    setTimeout(() => {
      setIsExporting(false);
      showToast(t('the_data_file_is_ready_to_down'));
    }, 1500);
  };

  const handleDeleteAccountData = () => {
    setIsDeleteConfirmOpen(false);
    showToast(t('request_to_delete_data_sent'));
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
            Privacy
          </h1>

          <div className="w-10" />
        </div>

        {/* HERO CARD */}
        <div className="p-7 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest z-10">
            PRIVACY & CONTROL
          </span>

          <div className="w-14 h-14 rounded-full bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] z-10">
            <Shield className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 z-10">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Your data. Your rules.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Control how your information is shared across Rival Space.
            </p>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            PROFILE
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* Public Profile */}
            <div 
              onClick={() => setPublicProfile(!publicProfile)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Public Profile</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                publicProfile ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  publicProfile ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {publicProfile && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Show Online Status */}
            <div 
              onClick={() => setShowOnlineStatus(!showOnlineStatus)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Show Online Status</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                showOnlineStatus ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  showOnlineStatus ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {showOnlineStatus && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Allow Direct Messages */}
            <div 
              onClick={() => setAllowDirectMessages(!allowDirectMessages)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Allow Direct Messages</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                allowDirectMessages ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  allowDirectMessages ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {allowDirectMessages && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Allow Collaboration Requests */}
            <div 
              onClick={() => setAllowCollabRequests(!allowCollabRequests)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Allow Collaboration Requests</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                allowCollabRequests ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  allowCollabRequests ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {allowCollabRequests && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PORTFOLIO PRIVACY SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            PORTFOLIO PRIVACY
          </h3>

          <div className="p-1.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 grid grid-cols-3 gap-1 shadow-xl">
            {(['public', 'followers', 'private'] as const).map((mode) => {
              const isSelected = portfolioPrivacy === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setPortfolioPrivacy(mode)}
                  className={`py-3 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 ${
                    isSelected 
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* DATA SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            DATA
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* Analytics Collection */}
            <div 
              onClick={() => setAnalyticsCollection(!analyticsCollection)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Analytics Collection</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                analyticsCollection ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  analyticsCollection ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {analyticsCollection && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div 
              onClick={() => setPersonalizedRecs(!personalizedRecs)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Personalized Recommendations</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                personalizedRecs ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  personalizedRecs ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {personalizedRecs && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div 
              onClick={() => setUsageStats(!usageStats)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
            >
              <span className="text-sm font-bold text-white">Usage Statistics</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                usageStats ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  usageStats ? 'translate-x-5' : 'translate-x-0'
                }`}>
                  {usageStats && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTED APPS SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            CONNECTED APPS
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* GitHub */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-bold text-white">GitHub</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Read Only</span>
            </div>

            {/* Figma */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Figma className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-white">Figma</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Workspace Access</span>
            </div>

            {/* Behance */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4 text-zinc-500" />
                </div>
                <span className="text-sm font-bold text-zinc-400">Behance</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Not Connected</span>
            </div>
          </div>
        </div>

        {/* DOWNLOAD YOUR DATA CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Download Your Data</h4>
            <p className="text-xs text-zinc-400 leading-snug mt-0.5">
              Export your profile, projects and settings.
            </p>
          </div>

          <button
            onClick={handleGenerateExport}
            disabled={isExporting}
            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isExporting ? 'Preparing...' : 'Generate Export'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* DELETE PERSONAL DATA CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-red-900/30 space-y-3 shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-red-400 tracking-tight">Delete Personal Data</h4>
            <p className="text-xs text-zinc-400 leading-snug mt-0.5">
              Remove all account information permanently.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="w-full py-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-xs font-bold text-red-300 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Delete Account Data</span>
          </button>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Save Privacy Settings</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-zinc-300 transition-all active:scale-95 text-center"
          >
            Cancel
          </button>
        </div>

      </div>

      {/* CONFIRM DELETE MODAL */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-red-900/60 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-red-400">Confirmation</h3>
              </div>
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)} 
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to request permanent deletion of your account data? This action cannot be undone.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleDeleteAccountData}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                Confirm Delete Request
              </button>

              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
