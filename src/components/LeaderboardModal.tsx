import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Award, 
  Star, 
  Box, 
  User, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { DesignerProfileModal, DesignerProfileData } from './DesignerProfileModal';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface LeaderboardModalProps {
  onClose: () => void;
  onKeepLearning?: () => void;
  onOpenMessages?: (chatId?: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  onKeepLearning,
  onOpenMessages
}) => {
    const { t } = useTranslation();
  const { profile } = useApp();
  const [activeTab, setActiveTab] = useState<'Global' | 'Friends' | 'Academy' | 'Design'>('Global');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDesigner, setSelectedDesigner] = useState<DesignerProfileData | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const leaderboardList = [
    { 
      rank: 4, 
      name: 'Leo_D', 
      handle: 'leo_design',
      level: 32, 
      xp: '3,410', 
      gain: '+120', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', 
      isUser: false,
      skills: ['UI/UX', 'Figma', 'Prototyping'],
      followers: '8.1k',
      projectsCount: 18,
      followingCount: 310
    },
    { 
      rank: 5, 
      name: 'Maya.px', 
      handle: 'maya_px',
      level: 30, 
      xp: '3,250', 
      gain: '+85', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 
      isUser: false,
      skills: ['Illustration', 'Vector', 'Branding'],
      followers: '5.4k',
      projectsCount: 14,
      followingCount: 220
    },
    { 
      rank: 28, 
      name: `${profile.name || t('you_user')}`, 
      handle: profile.username || '@user', 
      level: 1, 
      xp: '0', 
      gain: '+0', 
      avatar: profile.avatarUrl || '', 
      isUser: true 
    },
    { 
      rank: 29, 
      name: 'Jordan_X', 
      handle: 'jordan_3d',
      level: 22, 
      xp: '2,410', 
      gain: '+40', 
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', 
      isUser: false,
      skills: ['3D Art', 'Spline', 'Blender'],
      followers: '3.9k',
      projectsCount: 11,
      followingCount: 190
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-5 pb-28">

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
            Leaderboard
          </h1>

          {/* Season & Days Left Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[10px] font-mono">
            <span className="text-zinc-500 uppercase font-bold">SEASON 5</span>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-zinc-200">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>18 Days Remaining</span>
            </div>
          </div>
        </div>

        {/* TOP PODIUM CARD (RANKS 1, 2, 3) */}
        <div className="relative rounded-3xl bg-[#0e0e16] border border-zinc-800/90 p-5 space-y-4 shadow-2xl overflow-hidden">
          {/* Subtle Grid overlay background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top 3 Avatars and Columns Layout */}
          <div className="relative z-10 grid grid-cols-3 gap-2 items-end pt-4 min-h-[220px]">
            
            {/* RANK 2 (SARAH KIM - LEFT) */}
            <div 
              onClick={() => setSelectedDesigner({
                name: 'Sarah Kim',
                handle: 'sarah_kim',
                level: 42,
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                verified: true,
                skills: ['UI/UX', 'Product Design', 'Systems'],
                followers: '14.2k',
                projectsCount: 31,
                followingCount: 512
              })}
              className="flex flex-col items-center space-y-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                    alt="Sarah Kim"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shadow">
                  2
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xs font-bold text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">Sarah Kim</h3>
                <p className="text-[10px] font-mono text-zinc-400">LVL 42</p>
              </div>

              {/* Podium Column 2 */}
              <div className="w-full h-24 rounded-2xl bg-[#141422] border border-zinc-800/80 flex items-center justify-center text-zinc-400 font-extrabold text-lg shadow-inner group-hover:border-zinc-700 transition-colors">
                2
              </div>
            </div>

            {/* RANK 1 (VALERIE VANCE - CENTER HIGHEST) */}
            <div 
              onClick={() => setSelectedDesigner({
                name: 'Valerie Vance',
                handle: 'valerie_vance',
                level: 55,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                verified: true,
                skills: ['UI/UX', 'Branding', 'Motion'],
                followers: '19.8k',
                projectsCount: 42,
                followingCount: 290
              })}
              className="flex flex-col items-center space-y-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Valerie Vance"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  1
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">Valerie Vance</h3>
                <p className="text-[10px] font-mono text-indigo-300 font-semibold">LVL 55</p>
              </div>

              {/* Podium Column 1 */}
              <div className="w-full h-32 rounded-2xl bg-[#18182a] border border-indigo-500/40 flex flex-col items-center justify-center space-y-1 text-white shadow-lg group-hover:border-indigo-400 transition-colors">
                <span className="font-extrabold text-xl">1</span>
                <span className="text-[10px] font-mono text-indigo-300 font-bold">3,890 XP</span>
              </div>
            </div>

            {/* RANK 3 (ETHAN ROSS - RIGHT) */}
            <div 
              onClick={() => setSelectedDesigner({
                name: 'Ethan Ross',
                handle: 'ethan_ross',
                level: 38,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                verified: true,
                skills: ['Motion Design', 'Cinema 4D', '3D UI'],
                followers: '10.5k',
                projectsCount: 22,
                followingCount: 380
              })}
              className="flex flex-col items-center space-y-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-amber-300 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Ethan Ross"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 border border-amber-400 flex items-center justify-center text-[10px] font-bold text-white shadow">
                  3
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xs font-bold text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">Ethan Ross</h3>
                <p className="text-[10px] font-mono text-zinc-400">LVL 38</p>
              </div>

              {/* Podium Column 3 */}
              <div className="w-full h-20 rounded-2xl bg-[#141422] border border-zinc-800/80 flex items-center justify-center text-amber-500/80 font-extrabold text-lg shadow-inner group-hover:border-zinc-700 transition-colors">
                3
              </div>
            </div>

          </div>
        </div>

        {/* YOUR POSITION CARD */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-indigo-500/40 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Your Position</h3>
                <p className="text-xs font-mono font-bold text-indigo-400">Rank #28</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-white tracking-tight block">2,450 XP</span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">+250 this week</span>
            </div>
          </div>

          {/* Progress Bar to top 20 */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-400">
              <span>PROGRESS TO TOP 20</span>
              <span className="font-bold text-white">82%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-400 transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                style={{ width: '82%' }}
              />
            </div>
          </div>
        </div>

        {/* CATEGORY TABS (Global, Friends, Academy, Design) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['Global', 'Friends', 'Academy', 'Design'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-[#0e0e16] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="space-y-2">
          {/* Table Header */}
          <div className="flex items-center justify-between px-4 py-1 text-[10px] font-mono uppercase text-zinc-500 font-bold">
            <div className="flex items-center gap-4">
              <span>RNK</span>
              <span>USER</span>
            </div>
            <div className="flex items-center gap-6">
              <span>XP</span>
              <span>GAIN</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {leaderboardList.map((row) => (
              <div
                key={row.rank}
                onClick={() => {
                  if (row.isUser) {
                    showToast(t('this_is_your_profile'));
                  } else {
                    setSelectedDesigner({
                      name: row.name,
                      handle: row.handle || 'designer',
                      level: row.level,
                      avatar: row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
                      verified: true,
                      skills: row.skills || ['UI/UX', 'Branding'],
                      followers: row.followers || '6.2k',
                      projectsCount: row.projectsCount || 16,
                      followingCount: row.followingCount || 240
                    });
                  }
                }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  row.isUser
                    ? 'bg-[#0e0e18] border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-[#0e0e16] border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-5 text-center font-mono font-extrabold text-sm text-zinc-300">
                    {row.rank}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center text-zinc-400">
                    {row.avatar ? (
                      <img
                        src={row.avatar}
                        alt={row.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>{row.name}</span>
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400">LVL {row.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                  <span className="font-bold text-white">{row.xp}</span>
                  <span className="font-bold text-indigo-400 w-10 text-right">{row.gain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEASON REWARDS SECTION */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white tracking-tight px-0.5">
            Season Rewards
          </h3>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Box 1 */}
            <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-md hover:border-zinc-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                Exclusive Badge
              </span>
            </div>

            {/* Box 2 */}
            <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-md hover:border-zinc-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                Premium Assets
              </span>
            </div>

            {/* Box 3 */}
            <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-md hover:border-zinc-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                Pro Access
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (onKeepLearning) {
                onKeepLearning();
              } else {
                onClose();
              }
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Keep Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Designer Profile Modal Screen */}
      {selectedDesigner && (
        <DesignerProfileModal
          designer={selectedDesigner}
          onClose={() => setSelectedDesigner(null)}
          onOpenChat={(chatId) => {
            setSelectedDesigner(null);
            onClose();
            if (onOpenMessages) onOpenMessages(chatId);
          }}
          onSendMessage={(chatId) => {
            setSelectedDesigner(null);
            onClose();
            if (onOpenMessages) onOpenMessages(chatId);
          }}
        />
      )}
    </div>
  );
};
