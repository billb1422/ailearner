import { useEffect } from 'react'
import { BADGE_MAP } from '../gamification'

export function BadgeToast({ badgeIds, onDismiss }: { badgeIds: string[]; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [badgeIds, onDismiss])

  if (badgeIds.length === 0) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {badgeIds.map((id) => {
        const b = BADGE_MAP[id]
        if (!b) return null
        return (
          <div
            key={id}
            className="animate-pop flex items-center gap-3 rounded-2xl border-2 border-amber-500/70 bg-zinc-900 px-4 py-3 shadow-xl shadow-amber-500/10"
          >
            <span className="text-3xl">{b.emoji}</span>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Badge earned!</div>
              <div className="font-bold text-zinc-100">{b.name}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
