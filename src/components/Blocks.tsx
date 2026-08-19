import type { ContentBlock } from '../types'
import { Md } from '../md'

const CALLOUT_STYLES: Record<string, { border: string; bg: string; icon: string; label: string }> = {
  insight: { border: 'border-sky-500/40', bg: 'bg-sky-500/10', icon: '💡', label: 'Key insight' },
  warning: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: '⚠️', label: 'Watch out' },
  tip: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', icon: '🛠️', label: 'Pro tip' },
  quote: { border: 'border-violet-500/40', bg: 'bg-violet-500/10', icon: '💬', label: 'Quote' },
}

export function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <Md text={block.md} />
    case 'callout': {
      const s = CALLOUT_STYLES[block.variant]
      return (
        <div className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
          <div className="flex items-center gap-2 mb-1.5 text-sm font-semibold text-zinc-100">
            <span>{s.icon}</span>
            <span>{block.title ?? s.label}</span>
          </div>
          <Md text={block.md} />
        </div>
      )
    }
    case 'diagram':
      return (
        <figure className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 overflow-x-auto">
          <div
            className="mx-auto max-w-full [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: block.svg }}
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'table':
      return (
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900">
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left px-4 py-2.5 font-semibold text-zinc-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-zinc-800/80">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-zinc-300 align-top">
                      <Md text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'code':
      return (
        <figure>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="font-mono text-emerald-300">{block.code}</code>
          </pre>
          {block.caption && <figcaption className="mt-1.5 text-sm text-zinc-500">{block.caption}</figcaption>}
        </figure>
      )
    case 'compare':
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          {[block.left, block.right].map((side, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                i === 0 ? 'border-sky-500/30 bg-sky-500/5' : 'border-violet-500/30 bg-violet-500/5'
              }`}
            >
              <div className={`font-semibold mb-2 ${i === 0 ? 'text-sky-300' : 'text-violet-300'}`}>
                {side.title}
              </div>
              <ul className="space-y-1.5 text-sm text-zinc-300">
                {side.items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className={i === 0 ? 'text-sky-400' : 'text-violet-400'}>▸</span>
                    <span>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
  }
}
