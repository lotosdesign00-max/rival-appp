import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { COURSES } from '@/lib/data'
import { BrandMark } from '@/components/widgets/BrandMark'

export function CourseScreen({ courseId }: { courseId: string }) {
  const { state, popOverlay, pushOverlay } = useStore()
  const { hapticFeedback } = useTelegram()

  const course = COURSES.find((c) => c.id === courseId)
  if (!course) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 px-5">
        <BrandMark size={34} />
        <p className="text-sm text-mute">Этот курс потерялся в космосе.</p>
      </div>
    )
  }

  const done = course.lessons.filter((l) => state.lessonsDone[l.id]).length
  const pct = Math.round((done / course.lessons.length) * 100)

  return (
    <div className="relative min-h-dvh bg-void">
      <div className="pt-[max(10px,env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
        <header className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => {
              hapticFeedback('impact')
              popOverlay()
            }}
            aria-label="Назад"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-dim">Курс</span>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="px-5"
        >
          <h1 className="font-display text-[26px] leading-tight font-semibold text-ink tracking-[-0.01em]">
            {course.title}
          </h1>
          <p className="text-sm text-mute leading-relaxed mt-2.5">{course.description}</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-surface overflow-hidden">
              <motion.div
                className="bar-sheen h-full rounded-full bg-gradient-to-r from-accent to-lavender"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="tnum text-xs text-dim">
              {done}/{course.lessons.length}
            </span>
          </div>

          {/* Lessons */}
          <div className="mt-6 bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
            {course.lessons.map((lesson, i) => {
              const isDone = !!state.lessonsDone[lesson.id]
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    hapticFeedback('selection')
                    pushOverlay('lesson', { id: lesson.id, course: course.id })
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-4 text-left active:bg-white/[0.02] transition-colors"
                >
                  <span
                    className={cn(
                      'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-colors',
                      isDone
                        ? 'bg-ok/[0.12] border-ok/40 text-ok'
                        : 'bg-accent/[0.10] border-accent/25 text-accent-bright'
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isDone ? 'done' : 'play'}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                        className="flex"
                      >
                        {isDone ? <Check size={16} strokeWidth={2.5} /> : <PlayCircle size={17} />}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink leading-snug">
                      {i + 1}. {lesson.title}
                    </span>
                    <span className="block text-[11px] text-dim mt-0.5">{lesson.minutes} мин</span>
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-center text-[11px] text-dim mt-6">
            Уроки бесплатные. Пройдёшь курс — соберёшь бриф лучше половины клиентов студии.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
