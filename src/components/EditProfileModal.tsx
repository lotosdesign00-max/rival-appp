import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Code2, 
  Figma, 
  Edit3, 
  Check, 
  Plus, 
  Sparkles,
  ArrowRight,
  Lock,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface EditProfileModalProps {
  onClose: () => void;
  onSave?: (updatedData: {
    name: string;
    username: string;
    bio: string;
    location: string;
  }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
  const { 
    profile, 
    updateProfile, 
    privacy, 
    updatePrivacy, 
    accounts, 
    toggleAccountConnect,
    authProvider,
    canChangeName,
    canChangeUsername,
    nextNameChangeDateFormatted
  } = useApp();

  const [fullName, setFullName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  // Profile Toggles
  const [showOnlineStatus, setShowOnlineStatus] = useState(privacy.showOnlineStatus);
  const [showCompletedProjects, setShowCompletedProjects] = useState(privacy.publicProfile);
  const [allowMessages, setAllowMessages] = useState(privacy.allowDirectMessages);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    updateProfile({
      name: fullName,
      username,
      bio,
      location,
      avatarUrl
    });
    updatePrivacy({
      showOnlineStatus,
      publicProfile: showCompletedProjects,
      allowDirectMessages: allowMessages
    });

    if (onSave) {
      onSave({ name: fullName, username, bio, location });
    }
    showToast(t('profile_successfully_updated'));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleAvatarChange = () => {
    showToast(t('uploading_a_new_avatar'));
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
            Edit Profile
          </h1>

          <button
            onClick={handleSave}
            className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider px-2 py-1"
          >
            Save
          </button>
        </div>

        {/* AVATAR HERO CARD */}
        <div className="p-7 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Avatar container with photo camera button */}
          <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-400 shadow-xl">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-[#0e0e16]"
              />
            </div>

            <button
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center shadow-md active:scale-95"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 z-10">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {fullName || 'Alex Mercer'}
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              {username || '@amercer_design'}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold uppercase tracking-wider z-10">
            ELITE DESIGNER
          </span>
        </div>

        {/* SECTION 1: PROFILE INFORMATION */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            Profile Information
          </h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-zinc-400">{t('name_nickname')}</label>
                {!canChangeName && (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t('once_every_3_months')}</span>
                )}
              </div>
              <input
                type="text"
                value={fullName}
                disabled={!canChangeName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-colors ${
                  !canChangeName 
                    ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 cursor-not-allowed select-none' 
                    : 'bg-[#0e0e16] border-zinc-800 text-white focus:outline-none focus:border-indigo-500'
                }`}
                placeholder={t('first_name_last_name')}
              />
              {!canChangeName ? (
                <div className="text-[11px] text-amber-400 font-mono mt-1 flex items-center gap-1.5 bg-amber-950/40 p-2.5 rounded-xl border border-amber-900/50">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>{t('the_name_changed_recently_the')}{nextNameChangeDateFormatted}</span>
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 font-mono px-1">
                  {t('the_name_can_only_be_changed_o')}</p>
              )}
            </div>

            {/* Username / Tag */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-zinc-400">{t('tag_username')}</label>
                {!canChangeUsername && (
                  <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {t('linked_to_telegram')}</span>
                )}
              </div>
              <input
                type="text"
                value={username}
                disabled={!canChangeUsername}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-semibold font-mono transition-colors ${
                  !canChangeUsername 
                    ? 'bg-zinc-900/70 border-zinc-800/80 text-zinc-400 cursor-not-allowed' 
                    : 'bg-[#0e0e16] border-zinc-800 text-white focus:outline-none focus:border-indigo-500'
                }`}
                placeholder="@username"
              />
              {!canChangeUsername && (
                <div className="text-[11px] text-indigo-300 font-mono mt-1 flex items-center gap-1.5 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/50">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                  <span>{t('the_tag_is_assigned_to_your_te')}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 px-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Tell us about your creative work..."
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 px-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONNECTED PROFILES */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            Connected Profiles
          </h3>

          <div className="space-y-2">
            {/* GitHub */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Code2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">GitHub</span>
              </div>

              {accounts.find(a => a.id === 'github')?.connected ? (
                <button
                  onClick={() => toggleAccountConnect('github')}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold"
                >
                  <span>Connected</span>
                  <Check className="w-4 h-4 text-indigo-400" />
                </button>
              ) : (
                <button
                  onClick={() => toggleAccountConnect('github')}
                  className="flex items-center gap-1 text-xs text-zinc-400 font-semibold hover:text-white"
                >
                  <span>Add</span>
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Figma */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Figma className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Figma</span>
              </div>

              {accounts.find(a => a.id === 'figma')?.connected ? (
                <button
                  onClick={() => toggleAccountConnect('figma')}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold"
                >
                  <span>Connected</span>
                  <Check className="w-4 h-4 text-indigo-400" />
                </button>
              ) : (
                <button
                  onClick={() => toggleAccountConnect('figma')}
                  className="flex items-center gap-1 text-xs text-zinc-400 font-semibold hover:text-white"
                >
                  <span>Add</span>
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Behance */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Behance</span>
              </div>

              {accounts.find(a => a.id === 'behance')?.connected ? (
                <button
                  onClick={() => toggleAccountConnect('behance')}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold"
                >
                  <span>Connected</span>
                  <Check className="w-4 h-4 text-indigo-400" />
                </button>
              ) : (
                <button
                  onClick={() => toggleAccountConnect('behance')}
                  className="flex items-center gap-1 text-xs text-zinc-400 font-semibold hover:text-white"
                >
                  <span>Add</span>
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: PROFILE SETTINGS TOGGLES */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            Profile Settings
          </h3>

          <div className="space-y-2">
            {/* Show online status */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Show online status</span>

              <button
                onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  showOnlineStatus ? 'bg-indigo-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                    showOnlineStatus ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {showOnlineStatus && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </button>
            </div>

            {/* Show completed projects */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Show completed projects</span>

              <button
                onClick={() => setShowCompletedProjects(!showCompletedProjects)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  showCompletedProjects ? 'bg-indigo-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                    showCompletedProjects ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {showCompletedProjects && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </button>
            </div>

            {/* Allow messages */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Allow messages</span>

              <button
                onClick={() => setAllowMessages(!allowMessages)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  allowMessages ? 'bg-indigo-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                    allowMessages ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {allowMessages && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Save Changes</span>
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
    </div>
  );
};
