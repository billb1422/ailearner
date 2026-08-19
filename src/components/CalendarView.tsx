import { useState } from 'react'
import { useProgress, todayKey } from '../store'
import { BADGE_MAP } from '../gamification'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function keyFor(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function CalendarView() {
  const progress = useProgress()
  const now = new Date()
  const [ym, setYm] = useState<{ y: number; m: number }>({ y: now.getFullYear(), m: now.getMonth() })

  const first = new Date(ym.y, ym.m, 1)
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate()
  // Monday-first offset
  const offset = (first.getDay() + 6) % 7
  const today = todayKey()

  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => setYm(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))
  const nextMonth = () => setYm(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))

  const totalDaysActive = Object.values(progress.activity).filter((a) => a.lessons > 0 || a.badges.length > 0).length

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100">Activity Calendar</h1>
      <p className="mt-1 text-zinc-400 text-sm">
        Lessons completed and badges earned, day by day. {totalDaysActive} active day
        {totalDaysActive === 1 ? '' : 's'} so far · current streak{' '}
        <span className="text-orange-400 font-semibold">{progress.streak.current}🔥</span> · best{' '}
        {progress.streak.best}
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="rounded-lg px-3 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
            ←
          </button>
          <div className="font-semibold text-zinc-100">
            {MONTHS[ym.m]} {ym.y}
          </div>
          <button onClick={nextMonth} className="rounded-lg px-3 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-zinc-500 mb-1.5">
          {DAY_LABELS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />
            const key = keyFor(ym.y, ym.m, day)
            const act = progress.activity[key]
            const isToday = key === today
            const hasActivity = !!act && (act.lessons > 0 || act.badges.length > 0 || act.xp > 0)
            return (
              <div
                key={key}
                className={`relative aspect-square rounded-lg border p-1 flex flex-col items-center justify-start ${
                  isToday
                    ? 'border-sky-500/70 bg-sky-500/10'
                    : hasActivity
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-zinc-800/70 bg-zinc-900/40'
                }`}
                title={
                  act
                    ? `${act.lessons} lesson${act.lessons === 1 ? '' : 's'} · ${act.xp} XP${
                        act.badges.length ? ` · ${act.badges.map((b) => BADGE_MAP[b]?.name ?? b).join(', ')}` : ''
                      }`
                    : undefined
                }
              >
                <span className={`text-[11px] ${isToday ? 'text-sky-300 font-bold' : 'text-zinc-500'}`}>{day}</span>
                {act && act.lessons > 0 && (
                  <span className="text-[10px] font-bold text-emerald-400 leading-tight">
                    {act.lessons}✓
                  </span>
                )}
                {act && act.badges.length > 0 && (
                  <span className="text-[11px] leading-none mt-auto mb-0.5">
                    {act.badges.slice(0, 2).map((b) => BADGE_MAP[b]?.emoji ?? '🏅').join('')}
                    {act.badges.length > 2 && <span className="text-zinc-400">+{act.badges.length - 2}</span>}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded border border-emerald-500/40 bg-emerald-500/10" /> active day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded border border-sky-500/70 bg-sky-500/10" /> today
          </span>
          <span>n✓ = lessons completed · emoji = badges earned</span>
        </div>
      </div>
    </div>
  )
}
