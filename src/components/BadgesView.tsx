import { useProgress } from '../store'
import { BADGES } from '../gamification'

export function BadgesView() {
  const p = useProgress()
  const earned = Object.keys(p.badges).length

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100">Badges</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {earned}/{BADGES.length} earned
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BADGES.map((b) => {
          const at = p.badges[b.id]
          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 text-center ${
                at ? 'border-amber-500/40 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/40 opacity-50 grayscale'
              }`}
            >
              <div className="text-4xl">{b.emoji}</div>
              <div className="mt-2 font-semibold text-zinc-100 text-sm">{b.name}</div>
              <div className="mt-1 text-xs text-zinc-500 leading-snug">{b.desc}</div>
              {at && (
                <div className="mt-2 text-[11px] text-amber-400">
                  {new Date(at).toLocaleDateString()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
