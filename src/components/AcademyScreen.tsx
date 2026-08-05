import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Flame, 
  GraduationCap, 
  Award, 
  Play, 
  CheckCircle, 
  X, 
  Sparkles, 
  Check, 
  Trophy,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Course } from '../types';
import { ACADEMY_COURSES } from '../data/mockData';
import { CourseDetailModal } from './CourseDetailModal';
import { LessonPlayerModal } from './LessonPlayerModal';
import { LeaderboardModal } from './LeaderboardModal';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from "../context/LanguageContext";

interface AcademyScreenProps {
  onOpenMessages?: (chatId?: string) => void;
}

export const AcademyScreen: React.FC<AcademyScreenProps> = React.memo(({ onOpenMessages }) => {
    const { t } = useTranslation();
  const { academyProgress } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Motion');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Find active course with progress
  const activeCourseId = Object.keys(academyProgress || {})[0];
  const activeCourse = useMemo(() => activeCourseId ? ACADEMY_COURSES.find(c => c.id === activeCourseId) : null, [activeCourseId]);
  const activeProgress = activeCourseId ? (academyProgress[activeCourseId] || 0) : 0;

  const categories = useMemo(() => ['Photoshop', 'Branding', 'Motion', 'UI/UX', '3D & Shaders'], []);

  // Filter courses based on search & category pill
  const filteredCourses = useMemo(() => ACADEMY_COURSES.filter(course => {
    const matchesSearch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || 
      course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Motion' && (course.category.includes('Motion') || course.id === 'c-motion'));

    return matchesSearch && matchesCategory;
  }), [searchQuery, selectedCategory]);

  const featuredCourse = useMemo(() => ACADEMY_COURSES.find(c => c.id === 'c-motion') || ACADEMY_COURSES[0], []);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourseDetail(course);
  };

  const handleStartLessons = (course: Course) => {
    setSelectedCourseDetail(null);
    setActiveCourseModal(course);
    setActiveLessonIndex(0);
    setIsPlayingVideo(false);
  };

  return (
    <div
      className="space-y-6 pb-24 animate-in fade-in duration-300"
    >
      {/* Title Header with Leaderboard Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academy
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Learn. Create. Improve.
          </p>
        </div>

        {/* Leaderboard Button */}
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0c0c14] hover:bg-[#12121f] border border-indigo-500/40 hover:border-indigo-400 text-white transition-all shadow-lg active:scale-95 group"
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-950/90 border border-indigo-500/50 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-left font-sans">
            <span className="text-[10px] font-mono text-indigo-300 font-bold block uppercase tracking-wider leading-none">
              LEADERBOARD
            </span>
            <span className="text-xs font-bold text-white leading-tight block">
              Rank #28
            </span>
          </div>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses, topics..."
          className="w-full bg-[#0a0a10] border border-zinc-800/90 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* HERO FEATURED BANNER CARD (Motion Mastery style) */}
      <div
        onClick={() => handleOpenCourse(featuredCourse)}
        className="relative rounded-3xl overflow-hidden bg-[#0c0c14] border border-zinc-800/80 cursor-pointer group hover:border-indigo-500/50 transition-all shadow-2xl min-h-[260px] flex flex-col justify-between p-5"
      >
        {/* Background Render Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/70 to-transparent" />
        <img
          src={featuredCourse.thumbnail}
          alt={featuredCourse.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />

        {/* Top Header Watermark & Level Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold drop-shadow">
            ACADEMY | RIVAL SPACE
          </span>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 font-mono text-[11px] font-semibold">
              {featuredCourse.level}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 font-mono text-[11px] font-semibold">
              {featuredCourse.duration}
            </span>
          </div>
        </div>

        {/* Bottom Title & CTA Button */}
        <div className="relative z-10 space-y-3 pt-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              {featuredCourse.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans line-clamp-2 max-w-md">
              {featuredCourse.description}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCourse(featuredCourse);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/40 active:scale-95 transition-all"
          >
            <span>CONTINUE</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#181630] border border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-[#0c0c14] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* CONTINUE LEARNING CARD */}
      <div>
        {activeCourse ? (
          <div 
            onClick={() => handleOpenCourse(activeCourse)}
            className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/80 hover:border-indigo-500/40 cursor-pointer transition-all shadow-xl space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                CONTINUE LEARNING
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-mono text-[10px] font-semibold">
                {activeCourse.duration}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
              {activeCourse.title}
            </h3>

            {/* Progress Bar Container */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Progress</span>
                <span className="text-white font-bold">{activeProgress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
                  style={{ width: `${activeProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/80 space-y-2 shadow-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                CONTINUE LEARNING
              </span>
              <h3 className="text-sm font-bold text-white">
                {t('no_active_courses')}</h3>
              <p className="text-xs text-zinc-400">
                {t('choose_any_course_from_the_cat')}</p>
            </div>
            <button
              onClick={() => handleOpenCourse(featuredCourse)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md active:scale-95"
            >
              {t('begin')}</button>
          </div>
        )}
      </div>

      {/* RECOMMENDED SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Recommended
          </h2>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            See all
          </button>
        </div>

        {/* Recommended 2-Column Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredCourses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              onClick={() => handleOpenCourse(course)}
              className="rounded-2xl bg-[#0c0c14] border border-zinc-800/80 overflow-hidden cursor-pointer group hover:border-indigo-500/40 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-3.5 space-y-1 bg-[#0c0c14] border-t border-zinc-800/60">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Player Screen / Modal */}
      {activeCourseModal && (
        <LessonPlayerModal
          course={activeCourseModal}
          initialLessonIndex={activeLessonIndex}
          onClose={() => setActiveCourseModal(null)}
        />
      )}

      {/* Course Detail Screen / Modal */}
      {selectedCourseDetail && (
        <CourseDetailModal
          course={selectedCourseDetail}
          onClose={() => setSelectedCourseDetail(null)}
          onStartLesson={(course) => handleStartLessons(course)}
        />
      )}

      {/* Leaderboard Modal Screen */}
      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          onKeepLearning={() => setShowLeaderboard(false)}
          onOpenMessages={(chatId) => {
            setShowLeaderboard(false);
            if (onOpenMessages) onOpenMessages(chatId);
          }}
        />
      )}
    </div>
  );
});
