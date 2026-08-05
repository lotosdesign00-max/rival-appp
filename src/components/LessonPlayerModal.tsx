import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Check, 
  Lock, 
  Sparkles, 
  Download, 
  SkipBack, 
  SkipForward, 
  ArrowRight,
  FileText,
  Paperclip,
  Share2,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { Course, Lesson } from '../types';
import { LessonResourcesModal } from './LessonResourcesModal';
import { CertificateModal } from './CertificateModal';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface LessonPlayerModalProps {
  course?: Course | null;
  initialLessonIndex?: number;
  onClose: () => void;
  onOpenAI?: () => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  course,
  initialLessonIndex = 2, // Default to lesson 7 (index 2)
  onClose,
  onOpenAI
}) => {
    const { t } = useTranslation();
  const { toggleLessonCompleted, addNotification, isLessonCompleted } = useApp();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'resources' | 'notes'>('lessons');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [videoProgress, setVideoProgress] = useState(30); // 30% progress (~4:12 of 14:20)
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Fallback default course lessons matching screenshot
  const defaultLessons: Lesson[] = [
    { id: 'l5', title: 'Lesson 5: Design Systems', duration: '12:45', completed: true },
    { id: 'l6', title: 'Lesson 6: Auto Layout', duration: '18:20', completed: true },
    { id: 'l7', title: 'Lesson 7: Advanced Grid Systems', duration: '14:20', completed: false },
    { id: 'l8', title: 'Lesson 8: Component Architecture', duration: '22:15', completed: false }
  ];

  const lessons = course?.lessons && course.lessons.length > 0 ? course.lessons : defaultLessons;
  const currentLesson = lessons[currentLessonIndex] || lessons[0];
  const courseId = course?.id || 'c-motion';
  const courseTitle = course?.title || 'ADVANCED UI DESIGN';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteLesson = () => {
    currentLesson.completed = true;
    toggleLessonCompleted(courseId, currentLesson.id);
    addNotification(t('rival_academy'), `Урок "${currentLesson.title}" пройден!`, 'Academy');
    showToast(`Урок "${currentLesson.title}" завершён! +50 XP`);
    setTimeout(() => {
      setShowCertificateModal(true);
    }, 400);
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setIsPlaying(true);
    } else {
      showToast(t('this_is_the_first_lesson_of_th'));
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      showToast(t('you_have_reached_the_last_less'));
    }
  };

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes(prev => [userNote, ...prev]);
    setUserNote('');
    showToast(t('note_saved'));
  };

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
        <div className="flex items-center justify-between pt-1 relative">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            RIVAL SPACE
          </h1>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
              aria-label="Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0e0e16] border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 space-y-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    showToast(t('link_to_lesson_copied'));
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/60 flex items-center gap-2.5"
                >
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>{t('share_lesson')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    showToast(t('lesson_saved'));
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/60 flex items-center gap-2.5"
                >
                  <Bookmark className="w-4 h-4 text-purple-400" />
                  <span>{t('bookmarks')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* VIDEO PLAYER CONTAINER */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0c0c14] border border-zinc-800/90 shadow-2xl aspect-[16/10] group">
          {/* Workstation background mockup */}
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
            alt="Lesson Video"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Dark Overlay for Player Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 flex flex-col justify-between p-4">
            {/* Top Video Overlay bar (Empty space or badge) */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                HD 1080p
              </span>
            </div>

            {/* Play/Pause Center Button */}
            <div className="self-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition-transform active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="space-y-2">
              {/* Progress Scrubber */}
              <div 
                className="w-full h-1.5 rounded-full bg-white/20 cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                  setVideoProgress(newPct);
                }}
              >
                <div 
                  className="h-full rounded-full bg-indigo-500 relative"
                  style={{ width: `${videoProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-indigo-600" />
                </div>
              </div>

              {/* Time & Volume & Fullscreen */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300 px-1">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span>04:12 / 14:20</span>
                </div>

                <button 
                  onClick={() => showToast(t('full_screen_mode'))}
                  className="hover:text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON TITLE & METADATA */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
            {courseTitle}
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
            {currentLesson.title}
          </h2>

          {/* Progress Bar & Percentage */}
          <div className="pt-1 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
              <div 
                className="h-full rounded-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: '72%' }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-400">72%</span>
          </div>
        </div>

        {/* TABS SEGMENT (Lessons | Resources | Notes) */}
        <div className="p-1.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 grid grid-cols-3 gap-1 shadow-xl">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'lessons'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => {
              setActiveTab('resources');
              setShowResourcesModal(true);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'resources'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'notes'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Notes
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'lessons' && (
          <div className="space-y-2.5">
            {lessons.map((lesson, idx) => {
              const isCurrent = idx === currentLessonIndex;
              const isCompleted = lesson.completed || idx < currentLessonIndex;
              const isLocked = idx > currentLessonIndex + 1;

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentLessonIndex(idx);
                      setIsPlaying(true);
                    } else {
                      showToast(t('complete_the_previous_tutorial'));
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0e0e18] border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white'
                      : isCompleted
                      ? 'bg-[#0c0c14] border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/40'
                      : isLocked
                      ? 'bg-[#090910] border-zinc-900 text-zinc-600 opacity-60 cursor-not-allowed'
                      : 'bg-[#0c0c14] border-zinc-800/80 text-zinc-300 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Status Circle Icon */}
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    )}

                    <span className={`text-xs font-bold tracking-tight ${
                      isCompleted ? 'line-through text-zinc-400 font-normal' : ''
                    }`}>
                      {lesson.title}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 shrink-0">
                    {lesson.duration}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <Paperclip className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Grid Systems Figma Template.fig</h4>
                  <p className="text-[10px] font-mono text-zinc-400">14.2 MB • Figma File</p>
                </div>
              </div>
              <button 
                onClick={() => showToast(t('downloading_figma_mockup'))}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Lesson 7 Cheatsheet & Code.pdf</h4>
                  <p className="text-[10px] font-mono text-zinc-400">2.8 MB • PDF Guide</p>
                </div>
              </div>
              <button 
                onClick={() => showToast(t('downloading_instructions'))}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-lg">
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder={t('write_down_the_main_idea_from')}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {t('save_note')}</button>
            </div>

            {savedNotes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
                  {t('your_notes')}{savedNotes.length})
                </span>
                {savedNotes.map((note, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 text-xs text-zinc-300">
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEED HELP / ASK RIVAL AI BANNER */}
        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl">
          <p className="text-xs font-bold text-white tracking-tight">
            Need help understanding this lesson?
          </p>

          <button
            onClick={() => {
              if (onOpenAI) {
                onClose();
                onOpenAI();
              } else {
                showToast(t('rival_ai_assistant_opens'));
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask Rival AI</span>
          </button>
        </div>

        {/* ACTION BUTTONS ROW (Resources, Prev, Next) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setShowResourcesModal(true);
            }}
            className="flex-1 py-3.5 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Resources</span>
          </button>

          <button
            onClick={handlePrevLesson}
            className="w-12 h-12 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-lg"
            aria-label="Previous Lesson"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextLesson}
            className="w-12 h-12 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-lg"
            aria-label="Next Lesson"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* PRIMARY CTA COMPLETE LESSON BUTTON */}
        <div className="pt-1">
          <button
            onClick={handleCompleteLesson}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>COMPLETE LESSON</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* FULL LESSON RESOURCES MODAL */}
      {showResourcesModal && (
        <LessonResourcesModal
          lessonTitle={currentLesson.title.replace(/^Lesson \d+:\s*/, '')}
          lessonNumber={currentLessonIndex + 5}
          onClose={() => setShowResourcesModal(false)}
          onOpenAI={onOpenAI}
        />
      )}

      {/* CERTIFICATE DIPLOMA MODAL */}
      {showCertificateModal && (
        <CertificateModal
          moduleTitle={currentLesson.title.replace(/^Lesson \d+:\s*/, '')}
          courseTitle={courseTitle}
          onClose={() => setShowCertificateModal(false)}
          onContinue={() => {
            setShowCertificateModal(false);
            if (currentLessonIndex < lessons.length - 1) {
              setCurrentLessonIndex(prev => prev + 1);
            } else {
              onClose();
            }
          }}
        />
      )}
    </div>
  );
};
