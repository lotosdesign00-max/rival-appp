import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LayoutGrid, 
  Bell, 
  BadgeCheck, 
  MessageSquare, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

import { ChatService } from '../services/ChatService';

export interface DesignerProfileData {
  id?: string;
  name: string;
  handle: string;
  level: number;
  avatar: string;
  verified?: boolean;
  skills?: string[];
  followers?: string;
  projectsCount?: number;
  followingCount?: number;
  bannerImage?: string;
  latestWork?: {
    id: string;
    title: string;
    tag: string;
    image: string;
    matchPercent?: number;
  }[];
}

interface DesignerProfileModalProps {
  designer?: DesignerProfileData;
  onClose: () => void;
  onSendMessage?: (designerName: string) => void;
  onOpenChat?: (chatId: string) => void;
}

export const DesignerProfileModal: React.FC<DesignerProfileModalProps> = ({
  designer,
  onClose,
  onSendMessage,
  onOpenChat
}) => {
    const { t } = useTranslation();
  const defaultDesigner: DesignerProfileData = {
    name: 'Elena Rostova',
    handle: 'elena_ux',
    level: 42,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    verified: true,
    skills: ['UI/UX', 'Branding', 'Motion'],
    followers: '12.4k',
    projectsCount: 24,
    followingCount: 432,
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    latestWork: [
      {
        id: 'w1',
        title: 'Project Nova Dash',
        tag: 'Web App',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        matchPercent: 95
      },
      {
        id: 'w2',
        title: 'Zenith Identity',
        tag: 'Branding',
        image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
        matchPercent: 90
      },
      {
        id: 'w3',
        title: 'Cyberpunk UI Kit',
        tag: 'Design System',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        matchPercent: 98
      }
    ]
  };

  const current = designer || defaultDesigner;

  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(!isFollowing ? `Вы подписались на ${current.name}` : `Вы отписались от ${current.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-4 space-y-4 pb-28 relative">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP NAVBAR */}
        <div className="flex items-center justify-between pt-1 relative z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95 backdrop-blur-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            RIVAL SPACE
          </h1>

          <button
            onClick={() => showToast(t('designer_notifications'))}
            className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95 backdrop-blur-md"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* PROFILE HERO HEADER CARD */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0c0c14] border border-zinc-800/90 shadow-2xl">
          {/* Portfolio Banner Image */}
          <div className="h-44 w-full relative overflow-hidden bg-zinc-900">
            <img
              src={current.bannerImage || defaultDesigner.bannerImage}
              alt="Designer Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/40 to-transparent" />

            {/* Banner Text Label */}
            <div className="absolute top-4 left-4 text-left space-y-0.5">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                RIVAL SPACE
              </span>
              <h3 className="text-xs font-mono font-extrabold text-white tracking-widest uppercase">
                DESIGNER PROFILE
              </h3>
            </div>
          </div>

          {/* Avatar and Profile Details */}
          <div className="-mt-16 relative z-10 px-5 pb-5 text-center space-y-4">
            {/* Avatar Circle with Badge */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-600 via-purple-500 to-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.4)] mx-auto">
                <img
                  src={current.avatar}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Verified Badge Icon */}
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0c0c14] border border-zinc-700 flex items-center justify-center text-indigo-400 shadow-md">
                <BadgeCheck className="w-4 h-4 fill-indigo-500/20 text-indigo-400" />
              </div>
            </div>

            {/* Name, Handle & Level Pill */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {current.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold">
                  LVL {current.level}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                @{current.handle}
              </p>
            </div>

            {/* Skill Tags */}
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              {(current.skills || defaultDesigner.skills!).map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-bold shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* STATS ROW (Followers | Projects | Following) */}
            <div className="p-4 rounded-2xl bg-[#08080e] border border-zinc-800/80 grid grid-cols-3 gap-2 text-center shadow-inner">
              <div className="space-y-0.5">
                <span className="text-base font-extrabold text-white tracking-tight block">
                  {current.followers || '12.4k'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  FOLLOWERS
                </span>
              </div>

              <div className="space-y-0.5 border-x border-zinc-800/80">
                <span className="text-base font-extrabold text-white tracking-tight block">
                  {current.projectsCount || 24}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  PROJECTS
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-base font-extrabold text-white tracking-tight block">
                  {current.followingCount || 432}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  FOLLOWING
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (Follow | Message) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleToggleFollow}
                className={`py-3.5 rounded-2xl font-extrabold text-xs tracking-wider transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                  isFollowing
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-indigo-600/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                onClick={async () => {
                  try {
                    const chat = await ChatService.getOrCreateChat('direct', current.handle || current.name, {
                      participantName: current.name,
                      participantAvatar: current.avatar
                    });
                    if (onOpenChat) {
                      onClose();
                      onOpenChat(chat.id);
                    } else if (onSendMessage) {
                      onClose();
                      onSendMessage(chat.id);
                    } else {
                      showToast(`Чат с ${current.name} создан`);
                    }
                  } catch (e) {
                    console.error(e);
                    if (onSendMessage) onSendMessage(current.name);
                  }
                }}
                className="py-3.5 rounded-2xl bg-[#08080e] hover:bg-zinc-900 border border-zinc-800 text-white font-extrabold text-xs tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* LATEST WORK SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Latest Work
            </h3>
            <button 
              onClick={() => showToast(t('all_designer_s_works'))}
              className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          {/* Horizontal Scroll of Projects */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {(current.latestWork || defaultDesigner.latestWork!).map((work) => (
              <div
                key={work.id}
                onClick={() => showToast(`Просмотр проекта "${work.title}"`)}
                className="min-w-[240px] max-w-[260px] rounded-3xl bg-[#0c0c14] border border-zinc-800/90 overflow-hidden shadow-xl cursor-pointer hover:border-zinc-700 transition-all group shrink-0"
              >
                {/* Image Cover */}
                <div className="h-36 w-full relative overflow-hidden bg-zinc-950">
                  <img
                    src={work.image}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                      {work.tag}
                    </span>
                  </div>
                </div>

                {/* Footer Content */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {work.title}
                  </h4>

                  {/* Rating / Completion Bar */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{ width: `${work.matchPercent || 95}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-zinc-400">
                      {work.matchPercent || 95}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
