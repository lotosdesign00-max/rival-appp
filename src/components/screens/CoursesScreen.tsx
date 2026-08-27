import { motion } from 'framer-motion'
import { GraduationCap, PlayCircle } from 'lucide-react'
import { Screen, PageTitle } from '@/components/layout/Screen'
import { TiltCard } from '@/components/widgets/interactive'
import { COURSES } from '@/lib/data'
import { useStore } from '@/lib/store'
import { listVariants, listItem } from '@/components/widgets/cards'

const ACCENT_GRADIENTS = {
  indigo: 'from-[#3B3F8F] to-[#141A38]',
  lavender: 'from-[#4C3E85] to-[#181438]',
  sky: 'from-[#1F4E7A] to-[#0E1B33]',
  rose: 'from-[#6E2B44] to-[#241019]',
}

export function CoursesScreen() {
  const { state, pushOverlay } = useStore()

  const doneCount = (courseId: string) => {
    const course = COURSES.find((c) => c.id === courseId)!
    return course.lessons.filter((l) => state.lessonsDone[l.id]).length
  }

  const totalMinutes = (courseId: string) => {
    const course = COURSES.find((c) => c.id === courseId)!
    return course.lessons.reduce((s, l) => s + l.minutes, 0)
  }

  return (
    <Screen aurora>
      <PageTitle title="Курсы" subtitle="Видео-уроки: заказывать у студии станет проще и дешевле" />

      <motion.div variants={listVariants} initial="hidden" animate="show" className="px-5 space-y-4">
        {COURSES.map((course) => {
          const done = doneCount(course.id)
          const pct = Math.round((done / course.lessons.length) * 100)
          return (
            <motion.div key={course.id} variants={listItem}>
              <TiltCard maxTilt={4} className="cursor-pointer">
                <button
                  onClick={() => pushOverlay('course', { id: course.id })}
                  className="block w-full text-left bg-surface border border-line rounded-2xl overflow-hidden transition-colors hover:border-linex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
                >
                  {/* cover */}
                  <div
                    className={`relative aspect-[16/7] bg-gradient-to-br ${ACCENT_GRADIENTS[course.accent]} grain`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="step-pulse w-14 h-14 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-sm flex items-center justify-center">
                        <PlayCircle size={26} className="text-white/90" />
                      </span>
                    </div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-abyss/60 backdrop-blur-sm text-[10px] text-ink/90 border border-white/10">
                      {course.level}
                    </span>
                    {pct === 100 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-ok/20 border border-ok/40 text-[10px] text-ok">
                        Пройден
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="font-display text-[17px] font-semibold text-ink leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-[13px] text-mute leading-relaxed mt-1.5 line-clamp-2">
                      {course.description}
                    </p>
                    <p className="text-[11px] text-dim mt-3">
                      {course.lessons.length} уроков · {totalMinutes(course.id)} мин видео
                    </p>
                    {pct > 0 && pct < 100 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-[3px] rounded-full bg-line overflow-hidden">
                          <div
                            className="bar-sheen h-full rounded-full bg-gradient-to-r from-accent to-lavender transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="tnum text-[11px] text-dim">{pct}%</span>
                      </div>
                    )}
                  </div>
                </button>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>

      <p className="px-5 mt-7 text-xs text-dim leading-relaxed flex items-start gap-2">
        <GraduationCap size={14} className="shrink-0 mt-0.5" />
        Прогресс сохраняется в твоём пространстве. Вопросы по урокам — Rival AI отвечает как ассистент студии.
      </p>
    </Screen>
  )
}
