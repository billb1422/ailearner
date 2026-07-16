import { CAPSTONES, CAPSTONE_XP } from '../content/capstones'
import { useProgress, setCapstone, awardXp, getState } from '../store'
import { checkAwards } from '../awards'
import type { Module } from '../types'

interface CapstoneViewProps {
  modules: Module[]
  onBadges: (ids: string[]) => void
}

export function CapstoneView({ modules, onBadges }: CapstoneViewProps) {
  const p = useProgress()
  const track = CAPSTONES.find((c) => c.id === p.capstone.track)
  const done = !!p.capstone.completedAt

  if (!track) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-100">👑 Capstone: Day 22</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          Pick ONE track. Each is a real build that proves you can operate as an agent engineer. {CAPSTONE_XP} XP +
          the Agent Architect badge on completion.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {CAPSTONES.map((c) => (
            <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col">
              <div className="text-4xl">{c.emoji}</div>
              <h2 className="mt-3 text-lg font-bold text-zinc-100">{c.title}</h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed flex-1">{c.pitch}</p>
              <p className="mt-3 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-400">Best for:</span> {c.bestFor}
              </p>
              <button
                onClick={() => setCapstone({ track: c.id, checks: c.requirements.map(() => false) })}
                className="mt-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold px-4 py-2.5 text-sm transition-colors"
              >
                Choose this track
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const checks = track.requirements.map((_, i) => p.capstone.checks[i] ?? false)
  const toggle = (i: number) => {
    if (done) return
    const next = checks.map((c, j) => (j === i ? !c : c))
    const completed = next.every(Boolean)
    setCapstone({ checks: next, completedAt: completed ? new Date().toISOString() : undefined })
    if (completed) {
      awardXp(CAPSTONE_XP)
      const earned = checkAwards(getState(), modules)
      if (earned.length) onBadges(earned)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100">
        {track.emoji} Capstone: {track.title}
      </h1>
      <p className="mt-2 text-zinc-300 text-sm leading-relaxed">{track.pitch}</p>
      {!done && (
        <button
          onClick={() => setCapstone({ track: undefined, checks: [] })}
          className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
        >
          ↺ switch track
        </button>
      )}
      <div className="mt-6 space-y-2">
        {track.requirements.map((req, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm cursor-pointer ${
              checks[i]
                ? 'border-emerald-500/40 bg-emerald-500/10 text-zinc-200'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600'
            } ${done ? 'cursor-default' : ''}`}
          >
            <input type="checkbox" checked={checks[i]} onChange={() => toggle(i)} disabled={done} className="mt-0.5 accent-emerald-500" />
            <span>{req}</span>
          </label>
        ))}
      </div>
      {done && (
        <div className="mt-6 rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 p-6 text-center animate-pop">
          <div className="text-6xl">👑</div>
          <div className="mt-2 text-xl font-bold text-amber-300">Agent Architect</div>
          <p className="mt-1 text-sm text-zinc-300">
            Capstone complete. You built with everything you learned. +{CAPSTONE_XP} XP
          </p>
        </div>
      )}
    </div>
  )
}
