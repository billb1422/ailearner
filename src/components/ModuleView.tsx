import type { Module } from '../types'
import { useProgress, setBossChecks, awardXp, getState } from '../store'
import { isLessonDone, checkAwards } from '../awards'
import { BADGE_MAP } from '../gamification'

interface ModuleViewProps {
  module: Module
  modules: Module[]
  onOpenLesson: (lessonId: string) => void
  onBack: () => void
  onBadges: (ids: string[]) => void
}

export function ModuleView({ module: m, modules, onOpenLesson, onBack, onBadges }: ModuleViewProps) {
  const p = useProgress()
  const bossState = p.boss[m.id] ?? { checks: m.boss.requirements.map(() => false) }
  const checks = m.boss.requirements.map((_, i) => bossState.checks[i] ?? false)
  const bossDone = !!bossState.completedAt
  const allLessonsDone = m.lessons.every((l) => isLessonDone(p, l.id))

  const toggleCheck = (i: number) => {
    if (bossDone) return
    const next = checks.map((c, j) => (j === i ? !c : c))
    const completed = next.every(Boolean)
    setBossChecks(m.id, next, completed)
    if (completed) {
      awardXp(m.boss.xp)
      const earned = checkAwards(getState(), modules)
      if (earned.length) onBadges(earned)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-zinc-200 mb-4">
        ← Back to dashboard
      </button>
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
          style={{ backgroundColor: `${m.color}22`, borderColor: `${m.color}66` }}
        >
          {m.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{m.title}</h1>
          <p className="text-zinc-400 text-sm">
            {m.days} · {m.tagline}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {m.lessons.map((l) => {
          const lp = p.lessons[l.id]
          const done = isLessonDone(p, l.id)
          const testedOut = lp?.status === 'tested-out'
          return (
            <button
              key={l.id}
              onClick={() => onOpenLesson(l.id)}
              className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-colors ${
                done
                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  done ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {done ? '✓' : `D${l.day}`}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-zinc-100">{l.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Day {l.day} · ~{l.minutes} min · {l.xp} XP
                  {testedOut && <span className="ml-2 text-sky-400">tested out 🧠</span>}
                  {lp?.status === 'in-progress' && <span className="ml-2 text-amber-400">in progress…</span>}
                </div>
              </div>
              <span className="text-zinc-600">→</span>
            </button>
          )
        })}
      </div>

      {/* Boss challenge */}
      <div
        className={`mt-8 rounded-2xl border-2 p-5 ${
          bossDone ? 'border-amber-500/60 bg-amber-500/10' : 'border-zinc-700 bg-zinc-900/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{bossDone ? '👑' : '⚔️'}</span>
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Boss Challenge</div>
            <h2 className="text-lg font-bold text-zinc-100">{m.boss.title}</h2>
          </div>
          <div className="ml-auto text-right">
            <div className="text-amber-400 font-bold">{m.boss.xp} XP</div>
            <div className="text-xs text-zinc-500">{BADGE_MAP[m.boss.badgeId]?.emoji} badge</div>
          </div>
        </div>
        <p className="mt-3 text-zinc-300 text-sm leading-relaxed">{m.boss.description}</p>
        {!allLessonsDone && !bossDone && (
          <p className="mt-2 text-xs text-zinc-500">Finish the lessons first — then come claim it.</p>
        )}
        <div className="mt-4 space-y-2">
          {m.boss.requirements.map((req, i) => (
            <label
              key={i}
              className={`flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm cursor-pointer ${
                checks[i] ? 'border-emerald-500/40 bg-emerald-500/10 text-zinc-200' : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600'
              } ${bossDone ? 'cursor-default' : ''}`}
            >
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggleCheck(i)}
                disabled={bossDone}
                className="mt-0.5 accent-emerald-500"
              />
              <span>{req}</span>
            </label>
          ))}
        </div>
        {bossDone && (
          <div className="mt-4 font-bold text-amber-300">Boss defeated! {BADGE_MAP[m.boss.badgeId]?.name} earned.</div>
        )}
      </div>
    </div>
  )
}
