// Tiny markdown renderer for the lesson-content subset:
// **bold**, *italic*, `code`, [label](url), '- ' bullet lists, paragraphs.
// Links may also use lesson:<id> as the URL to jump to another lesson in-app.
import React from 'react'
import { goToLesson } from './nav'

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  // Tokenize: links, bold, italic, code
  const re = /(\[([^\]]+)\]\(((?:https?:\/\/|lesson:)[^\s)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      if (m[3].startsWith('lesson:')) {
        const lessonId = m[3].slice('lesson:'.length)
        out.push(
          <button
            key={`${keyBase}-a${i}`}
            onClick={() => goToLesson(lessonId)}
            className="inline-flex items-baseline gap-1 rounded-md border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 px-1.5 py-0 text-sky-300 text-[0.92em] font-medium transition-colors align-baseline"
          >
            <span aria-hidden>📖</span>
            {m[2]}
          </button>,
        )
      } else {
        out.push(
          <a
            key={`${keyBase}-a${i}`}
            href={m[3]}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
          >
            {m[2]}
          </a>,
        )
      }
    } else if (m[4]) {
      out.push(
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-zinc-100">
          {m[5]}
        </strong>,
      )
    } else if (m[6]) {
      out.push(
        <code
          key={`${keyBase}-c${i}`}
          className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 text-[0.85em] font-mono"
        >
          {m[7]}
        </code>,
      )
    } else if (m[8]) {
      out.push(
        <em key={`${keyBase}-i${i}`} className="italic">
          {m[9]}
        </em>,
      )
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Md({ text }: { text: string }) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let para: string[] = []
  let bullets: string[] = []
  let k = 0

  const flushPara = () => {
    if (para.length) {
      nodes.push(
        <p key={`p${k++}`} className="leading-relaxed text-zinc-300">
          {renderInline(para.join(' '), `p${k}`)}
        </p>,
      )
      para = []
    }
  }
  const flushBullets = () => {
    if (bullets.length) {
      nodes.push(
        <ul key={`ul${k++}`} className="list-disc pl-5 space-y-1.5 text-zinc-300">
          {bullets.map((b, i) => (
            <li key={i} className="leading-relaxed">
              {renderInline(b, `li${k}-${i}`)}
            </li>
          ))}
        </ul>,
      )
      bullets = []
    }
  }

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('- ')) {
      flushPara()
      bullets.push(t.slice(2))
    } else if (t === '') {
      flushPara()
      flushBullets()
    } else {
      flushBullets()
      para.push(t)
    }
  }
  flushPara()
  flushBullets()
  return <div className="space-y-3">{nodes}</div>
}
