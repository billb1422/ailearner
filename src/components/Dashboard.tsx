import type { Module } from '../types'
import { useProgress } from '../store'
import { levelForXp, nextLevel, BADGE_MAP } from '../gamification'
import { isLessonDone } from '../awards'
import { SkillTree } from './SkillTree'

interface DashboardProps {
  modules: Module[]
  onOpenModule: (id: string) => void
  onOpenLesson: (moduleId: string, lessonId: string) => void
  onOpenBadges: () => void
  onOpenCalendar: () => void
}

export function Dashboard({ modules, onOpenModule, onOpenLesson, onOpenBadges, onOpenCalendar }: DashboardProps) {
  const p = useProgress()
  const level = levelForXp(p.xp)
  const next = nextLevel(p.xp)
  const pct = next ? Math.min(100, Math.round(((p.xp - level.minXp) / (next.minXp - level.minXp)) * 100)) : 100

  const allLessons = modules.flatMap((m) => m.lessons.map((l) => ({ m, l })))
  const doneCount = allLessons.filter(({ l }) => isLessonDone(p, l.id)).length
  const nextUp = allLessons.find(({ l }) => !isLessonDone(p, l.id))
  const badgeCount = Object.keys(p.badges).length
  const recentBadges = Object.entries(p.badges)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-sky-950/40 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50">30 Days to Agent Expert</h1>
            <p className="mt-1 text-zinc-400">
              {doneCount}/{allLessons.length} lessons · 2 hrs a weekday · learn by building
            </p>
          </div>
          <div className="flex gap-3 text-center">
            <Stat label="XP" value={p.xp.toLocaleString()} accent="text-sky-400" />
            <Stat label="Streak" value={`${p.streak.current}🔥`} accent="text-orange-400" />
            <button onClick={onOpenBadges} className="group">
              <Stat label="Badges" value={`${badgeCount}🏅`} accent="text-amber-400 group-hover:text-amber-300" />
            </button>
          </div>
        </div>

        {/* Level bar */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-zinc-200">
              Lv {level.level}: {level.title}
            </span>
            <span className="text-zinc-500">
              {next ? `${next.minXp - p.xp} XP to Lv ${next.level} (${next.title})` : 'Max level!'}
            </span>
          </div>
          <div className="mt-1.5 h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Continue CTA */}
        {nextUp && (
          <button
            onClick={() => onOpenLesson(nextUp.m.id, nextUp.l.id)}
            className="mt-5 w-full sm:w-auto rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold px-6 py-3 transition-colors"
          >
            ▶ Continue: Day {nextUp.l.day}, {nextUp.l.title}
          </button>
        )}
        {!nextUp && (
          <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-300 font-semibold">
            🏆 All lessons complete! Finish your boss challenges and capstone to claim full mastery.
          </div>
        )}
      </div>

      {/* Skill tree */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-zinc-100">Your path</h2>
          <button onClick={onOpenCalendar} className="text-sm text-sky-400 hover:text-sky-300">
            📅 Activity calendar →
          </button>
        </div>
        <SkillTree modules={modules} onSelect={onOpenModule} />
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Recent badges</h2>
          <div className="flex flex-wrap gap-3">
            {recentBadges.map(([id]) => {
              const b = BADGE_MAP[id]
              if (!b) return null
              return (
                <div key={id} className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5">
                  <span className="text-lg">{b.emoji}</span>
                  <span className="text-sm font-medium text-zinc-200">{b.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 min-w-[84px]">
      <div className={`text-xl font-bold ${accent}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  )
}
