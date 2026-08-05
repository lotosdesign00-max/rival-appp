import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ArrowRight, 
  Shield, 
  Laptop, 
  Globe, 
  Smartphone, 
  Check, 
  Sparkles,
  X,
  Mail,
  Key
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface EmailSecurityModalProps {
  onClose: () => void;
}

export const EmailSecurityModal: React.FC<EmailSecurityModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
  const { privacy, updatePrivacy } = useApp();

  const email = privacy.email;
  const twoFactorEnabled = privacy.twoFactorAuth;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-modal states for change email and change password
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSecurity = () => {
    showToast(t('security_settings_saved'));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleChangeEmailSubmit = () => {
    if (newEmailInput.trim() && newEmailInput.includes('@')) {
      updatePrivacy({ email: newEmailInput.trim() });
      setIsChangeEmailOpen(false);
      setNewEmailInput('');
      showToast(t('email_successfully_changed'));
    } else {
      showToast(t('enter_correct_email'));
    }
  };

  const toggle2FA = () => {
    const next2FA = !twoFactorEnabled;
    updatePrivacy({ twoFactorAuth: next2FA });
    showToast(next2FA ? t('2fa_enabled') : t('2fa_disabled'));
  };

  const handleChangePasswordSubmit = () => {
    if (newPassword.length >= 6) {
      setIsChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      showToast(t('password_successfully_updated'));
    } else {
      showToast(t('password_must_be_at_least_6_ch'));
    }
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
            Email & Security
          </h1>

          <div className="w-10" />
        </div>

        {/* SECURITY STATUS HERO CARD */}
        <div className="p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest z-10">
            SECURITY STATUS
          </span>

          <div className="w-14 h-14 rounded-full bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] z-10">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1 z-10">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Your account is protected
            </h2>

            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 font-sans z-10">
            All security systems are active
          </p>
        </div>

        {/* EMAIL SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            EMAIL
          </h3>

          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white tracking-tight">{email}</span>
              <button
                onClick={() => setIsChangeEmailOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Change Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Last changed 3 months ago</p>
          </div>
        </div>

        {/* PASSWORD SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            PASSWORD
          </h3>

          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white tracking-widest">•••••••••</span>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Update Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Last updated 45 days ago</p>
          </div>
        </div>

        {/* TWO-FACTOR AUTHENTICATION */}
        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Shield className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-zinc-400 leading-snug mt-0.5">
                Add an extra layer of protection to your account.
              </p>
            </div>
          </div>

          <button
            onClick={toggle2FA}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
              twoFactorEnabled ? 'bg-indigo-600' : 'bg-zinc-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {twoFactorEnabled && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* LOGIN ACTIVITY SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            LOGIN ACTIVITY
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {/* Session 1 (Active) */}
            <div className="p-4 flex items-center justify-between border-l-2 border-indigo-500 bg-indigo-950/10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                  <Laptop className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">Kyiv, Ukraine</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Current Session • Mac OS</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono font-bold">
                Now
              </span>
            </div>

            {/* Session 2 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                  <Globe className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">Chrome Browser</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">London, UK</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono">Yesterday</span>
            </div>

            {/* Session 3 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                  <Smartphone className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">Mobile App</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Kyiv, Ukraine</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono">3 days ago</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSaveSecurity}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Save Security Settings</span>
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

      {/* CHANGE EMAIL SUB-MODAL */}
      {isChangeEmailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-zinc-800 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Change Email Address</h3>
              </div>
              <button onClick={() => setIsChangeEmailOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono">New Email Address</label>
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="new.email@rivalspace.com"
                className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleChangeEmailSubmit}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Update Email
            </button>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD SUB-MODAL */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-zinc-800 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Update Password</h3>
              </div>
              <button onClick={() => setIsChangePasswordOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-mono">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-mono">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleChangePasswordSubmit}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Save New Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
