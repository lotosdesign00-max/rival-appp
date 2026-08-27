import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { COURSES } from '@/lib/data'
import { BrandMark } from '@/components/widgets/BrandMark'

export function LessonScreen({ lessonId, courseId }: { lessonId: string; courseId?: string }) {
  const { state, popOverlay, pushOverlay, toggleLessonDone } = useStore()
  const { hapticFeedback } = useTelegram()

  const course = COURSES.find((c) => c.id === courseId) ?? COURSES.find((c) => c.lessons.some((l) => l.id === lessonId))
  const lessonIndex = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1
  const lesson = course?.lessons[lessonIndex]

  if (!course || !lesson) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 px-5">
        <BrandMark size={34} />
        <p className="text-sm text-mute">Этот урок потерялся в космосе.</p>
      </div>
    )
  }

  const next = course.lessons[lessonIndex + 1]
  const isDone = !!state.lessonsDone[lesson.id]
  const [videoReady, setVideoReady] = useState(false)

  return (
    <div className="relative min-h-dvh bg-void">
      <div className="pt-[max(10px,env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
        {/* Header */}
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
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-dim truncate">
              {course.title}
            </p>
          </div>
          <span className="ml-auto text-xs text-dim shrink-0">
            {lessonIndex + 1}/{course.lessons.length}
          </span>
        </header>

        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="px-5"
        >
          {/* Video */}
          <div className="relative rounded-2xl overflow-hidden border border-linex bg-abyss">
            <video
              key={lesson.videoUrl}
              controls
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoReady(true)}
              className="w-full aspect-video object-cover"
              aria-label={`Видео: ${lesson.title}`}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
            </video>
            {!videoReady && (
              <div className="absolute inset-0 shimmer pointer-events-none" aria-hidden />
            )}
          </div>

          <h1 className="font-display text-[22px] leading-tight font-semibold text-ink mt-5 tracking-[-0.01em]">
            {lesson.title}
          </h1>
          <p className="text-xs text-dim mt-1.5">{lesson.minutes} мин</p>

          <div className="mt-5 space-y-4">
            {lesson.text.map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.7] text-mute">
                {p}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-7 flex gap-2.5">
            <Button
              variant={isDone ? 'secondary' : 'primary'}
              size="lg"
              className="flex-1"
              onClick={() => {
                toggleLessonDone(lesson.id)
                hapticFeedback('notification')
              }}
            >
              {isDone ? (
                <>
                  <Check size={17} className="text-ok" />
                  Пройден
                </>
              ) : (
                'Отметить пройденным'
              )}
            </Button>
            {next && (
              <Button
                size="lg"
                variant="secondary"
                aria-label="Следующий урок"
                onClick={() => {
                  hapticFeedback('selection')
                  // replace current lesson overlay with the next one
                  popOverlay()
                  pushOverlay('lesson', { id: next.id, course: course.id })
                }}
              >
                <ArrowRight size={18} />
              </Button>
            )}
          </div>

          {next && (
            <p className="text-center text-xs text-dim mt-4">
              Дальше: {next.title}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
