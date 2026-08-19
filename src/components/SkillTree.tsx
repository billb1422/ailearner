// Visual progress map: modules as connected nodes along a winding path.
import type { Module } from '../types'
import { useProgress } from '../store'
import { isLessonDone } from '../awards'

interface SkillTreeProps {
  modules: Module[]
  onSelect: (moduleId: string) => void
}

export function SkillTree({ modules, onSelect }: SkillTreeProps) {
  const progress = useProgress()

  // Layout: snake path, two nodes per row, generous spacing so labels never collide
  const W = 720
  const rowH = 150
  const H = Math.ceil(modules.length / 2) * rowH + 20
  const positions = modules.map((_, i) => {
    const row = Math.floor(i / 2)
    const first = i % 2 === 0
    // snake ordering: even rows left→right, odd rows right→left
    const x = (row % 2 === 0 ? (first ? 0.25 : 0.75) : first ? 0.75 : 0.25) * W
    const y = row * rowH + 55
    return { x, y }
  })

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label="Course progress map">
        {/* connecting path */}
        {positions.slice(0, -1).map((p, i) => {
          const n = positions[i + 1]
          const done = modules[i].lessons.every((l) => isLessonDone(progress, l.id))
          return (
            <path
              key={i}
              d={`M ${p.x} ${p.y} C ${p.x} ${(p.y + n.y) / 2}, ${n.x} ${(p.y + n.y) / 2}, ${n.x} ${n.y}`}
              fill="none"
              stroke={done ? '#34d399' : '#3f3f46'}
              strokeWidth="3"
              strokeDasharray={done ? '0' : '6 6'}
            />
          )
        })}
        {modules.map((m, i) => {
          const { x, y } = positions[i]
          const total = m.lessons.length
          const done = m.lessons.filter((l) => isLessonDone(progress, l.id)).length
          const bossDone = !!progress.boss[m.id]?.completedAt
          const complete = done === total && bossDone
          const started = done > 0
          const r = 26
          const circ = 2 * Math.PI * (r + 6)
          return (
            <g
              key={m.id}
              className="cursor-pointer"
              onClick={() => onSelect(m.id)}
              role="button"
              aria-label={`${m.title}: ${done}/${total} lessons`}
            >
              {/* progress ring */}
              <circle cx={x} cy={y} r={r + 6} fill="none" stroke="#27272a" strokeWidth="5" />
              <circle
                cx={x}
                cy={y}
                r={r + 6}
                fill="none"
                stroke={m.color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(done / total) * circ} ${circ}`}
                transform={`rotate(-90 ${x} ${y})`}
                opacity={started ? 1 : 0.25}
              />
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={complete ? m.color : '#18181b'}
                stroke={m.color}
                strokeWidth="1.5"
                opacity={started || i === 0 ? 1 : 0.55}
              />
              <text x={x} y={y + 7} textAnchor="middle" fontSize="22">
                {complete ? '⭐' : m.emoji}
              </text>
              <text x={x} y={y + r + 24} textAnchor="middle" fontSize="12" fill="#d4d4d8" fontWeight="600">
                {m.title.length > 30 ? m.title.slice(0, 28) + '…' : m.title}
              </text>
              <text x={x} y={y + r + 40} textAnchor="middle" fontSize="11" fill="#71717a">
                {done}/{total} lessons{bossDone ? ' · boss ✓' : ''}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
