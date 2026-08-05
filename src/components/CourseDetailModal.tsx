import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Play, 
  Clock, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { Course } from '../types';
import { useTranslation } from "../context/LanguageContext";

interface CourseDetailModalProps {
  course?: Course | null;
  onClose: () => void;
  onStartLesson?: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ 
  course, 
  onClose,
  onStartLesson 
}) => {
    const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default course fallback if none provided
  const title = course?.title || 'Advanced UI Design';
  const category = course?.category || 'UI/UX';
  const author = course?.author || 'Alex Mercer';
  const lessonsCount = course?.lessonsCount || 18;
  const duration = course?.duration || '6 Hours';
  const level = course?.level || 'Intermediate';
  const progress = course?.progress !== undefined ? course.progress : 72;
  const description = course?.description || 
    'Dive deep into the precise mechanics of high-end UI design. This course strips away the fluff, focusing on systemic thinking, mathematical precision in layouts, and advanced component architecture. You will learn to construct interfaces that feel native, performant, and emotionally resonant.';

  const thumbnail = course?.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  const masterTopics = [
    'Design Systems',
    'Layout & Grid',
    'Components',
    'Auto Layout'
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(!isBookmarked ? t('the_course_has_been_bookmarked') : t('course_removed_from_bookmarks'));
  };

  const handleContinue = () => {
    if (onStartLesson && course) {
      onStartLesson(course);
    } else {
      showToast(t('let_s_continue_learning'));
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
            Course Details
          </h1>

          <button
            onClick={toggleBookmark}
            className={`w-10 h-10 rounded-full bg-zinc-900 border transition-all flex items-center justify-center active:scale-95 ${
              isBookmarked 
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20' 
                : 'border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            aria-label="Bookmark Course"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400' : ''}`} />
          </button>
        </div>

        {/* HERO IMAGE CARD */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0e0e16] border border-zinc-800/90 shadow-2xl min-h-[230px] flex flex-col justify-end p-6 group">
          {/* Background Image with Dark Vignette */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0e0e16] via-[#0e0e16]/70 to-transparent" />
          <img
            src={thumbnail}
            alt={title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Futuristic ambient grid / light overlay */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Category Tag Badge */}
          <div className="relative z-10 mb-3">
            <span className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 text-[10px] font-mono font-bold text-zinc-200 uppercase tracking-widest shadow-lg">
              {category}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="relative z-10 space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-xs text-zinc-300/90 font-sans leading-relaxed drop-shadow-sm">
              Master modern interfaces from concept to production.
            </p>
          </div>
        </div>

        {/* INSTRUCTOR CARD */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-800 shrink-0 bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt={author}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{author}</h3>
              <p className="text-xs text-zinc-400 font-sans">Lead Product Designer</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-xs font-bold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* 4 STATS GRID (2x2) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Box 1: Lessons */}
          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">
              {lessonsCount} Lessons
            </span>
          </div>

          {/* Box 2: Hours */}
          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">
              {duration}
            </span>
          </div>

          {/* Box 3: Level */}
          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">
              {level}
            </span>
          </div>

          {/* Box 4: Certificate */}
          <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">
              Certificate
            </span>
          </div>
        </div>

        {/* YOUR PROGRESS CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              YOUR PROGRESS
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              Continue where you left off
            </span>
          </div>

          <div className="text-xl font-extrabold text-white tracking-tight">
            {progress}% Completed
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800/90 overflow-hidden p-0.5 border border-zinc-800">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-400 transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* ABOUT THE COURSE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-lg font-extrabold text-white tracking-tight px-0.5">
            About the Course
          </h3>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            {description}
          </p>
        </div>

        {/* WHAT YOU'LL MASTER SECTION */}
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-white tracking-tight px-0.5">
            What you'll master
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {masterTopics.map((topic, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center gap-3 shadow-md hover:border-zinc-700/80 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-indigo-400 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM FIXED ACTION BAR / BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
