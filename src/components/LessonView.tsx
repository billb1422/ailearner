import { useMemo, useState } from 'react'
import type { Lesson, Module } from '../types'
import { useProgress, setLessonProgress, awardXp, getState } from '../store'
import { checkAwards } from '../awards'
import { Quiz } from './Quiz'
import { Block } from './Blocks'
import { Md } from '../md'

type Stage = 'intro' | 'skip-quiz' | 'content' | 'check-quiz' | 'done' | 'tested-out'

interface LessonViewProps {
  lesson: Lesson
  module: Module
  modules: Module[]
  onBack: () => void
  onBadges: (ids: string[]) => void
}

const KIND_ICON: Record<string, string> = {
  video: '🎬',
  article: '📰',
  docs: '📘',
  repo: '📦',
  course: '🎓',
  thread: '🧵',
}

export function LessonView({ lesson: l, module: m, modules, onBack, onBadges }: LessonViewProps) {
  const p = useProgress()
  const status = p.lessons[l.id]?.status
  const already = status === 'completed' || status === 'tested-out'
  // Completed or in-progress lessons re-open straight into content (no intro/skip-quiz gate).
  const [stage, setStage] = useState<Stage>(already || status === 'in-progress' ? 'content' : 'intro')
  const initialChecks = useMemo(
    () => l.lab?.checklist.map((_, i) => p.lessons[l.id]?.labChecks?.[i] ?? false) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [l.id],
  )
  const [labChecks, setLabChecks] = useState<boolean[]>(initialChecks)

  const finishLesson = (mode: 'completed' | 'tested-out', quizScore: number) => {
    setLessonProgress(l.id, {
      status: mode,
      ...(mode === 'tested-out' ? { skipQuizScore: quizScore } : { checkQuizScore: quizScore }),
      labChecks,
    })
    awardXp(l.xp)
    const earned = checkAwards(getState(), modules)
    if (earned.length) onBadges(earned)
    setStage(mode === 'tested-out' ? 'tested-out' : 'done')
  }

  const header = (
    <div className="mb-6">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-zinc-200">
        ← {m.emoji} {m.title}
      </button>
      <h1 className="mt-2 text-2xl font-bold text-zinc-100">{l.title}</h1>
      <div className="mt-1 text-sm text-zinc-500">
        Day {l.day} · ~{l.minutes} min · {l.xp} XP
        {already && <span className="ml-2 text-emerald-400">✓ completed</span>}
      </div>
    </div>
  )

  if (stage === 'intro') {
    return (
      <div className="max-w-3xl mx-auto">
        {header}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="font-semibold text-zinc-100 mb-3">You'll be able to…</h2>
          <ul className="space-y-2">
            {l.objectives.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-zinc-300 text-sm leading-relaxed">
                <span className="text-sky-400 mt-0.5">◆</span> {o}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setStage('skip-quiz')}
              className="rounded-xl border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              🧠 I might know this: take the skip quiz
            </button>
            <button
              onClick={() => {
                setLessonProgress(l.id, { status: 'in-progress' })
                setStage('content')
              }}
              className="rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold px-5 py-2.5 text-sm transition-colors"
            >
              Start lesson →
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Score 80%+ on the skip quiz to test out instantly with full XP.
          </p>
        </div>
      </div>
    )
  }

  if (stage === 'skip-quiz') {
    return (
      <div className="max-w-3xl mx-auto">
        {header}
        <Quiz
          title="Skip quiz"
          subtitle="80% or better tests you out of this lesson with full XP."
          questions={l.skipQuiz}
          onDone={(score) => {
            if (score >= 0.8 && !already) finishLesson('tested-out', score)
            else if (score >= 0.8) setStage('tested-out')
            else {
              setLessonProgress(l.id, { status: 'in-progress', skipQuizScore: score })
              setStage('content')
            }
          }}
        />
      </div>
    )
  }

  if (stage === 'tested-out') {
    return (
      <Celebration
        emoji="🧠"
        title="Tested out!"
        body={`You already knew this one. +${l.xp} XP banked. On to the next lesson.`}
        onBack={onBack}
      />
    )
  }

  if (stage === 'done') {
    return (
      <Celebration
        emoji="🎉"
        title="Lesson complete!"
        body={`+${l.xp} XP. Keep the streak alive.`}
        onBack={onBack}
      />
    )
  }

  if (stage === 'check-quiz') {
    return (
      <div className="max-w-3xl mx-auto">
        {header}
        <Quiz
          title="Checkpoint quiz"
          subtitle="Lock in what you learned. Any score completes the lesson; aim for 100%."
          questions={l.checkQuiz}
          submitLabel="Check my answers"
          onDone={(score) => {
            if (!already) finishLesson('completed', score)
            else onBack()
          }}
        />
      </div>
    )
  }

  // stage === 'content'
  return (
    <div className="max-w-3xl mx-auto">
      {header}
      <div className="space-y-10">
        {l.sections.map((s, si) => (
          <section key={si}>
            <h2 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2.5">
              <span
                className="inline-flex w-7 h-7 rounded-lg items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${m.color}33`, color: m.color }}
              >
                {si + 1}
              </span>
              {s.heading}
            </h2>
            <div className="space-y-4">
              {s.blocks.map((b, bi) => (
                <Block key={bi} block={b} />
              ))}
            </div>
          </section>
        ))}

        {/* Lab */}
        {l.lab && (
          <section className="rounded-2xl border-2 border-dashed border-violet-500/40 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧪</span>
              <h2 className="text-lg font-bold text-zinc-100">Lab: {l.lab.title}</h2>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Do this in your real tools (Claude Code / terminal), then tick off the checklist.
            </p>
            <div className="text-sm text-zinc-300 mb-4">
              <Md text={l.lab.intro} />
            </div>
            <ol className="space-y-2.5 mb-5">
              {l.lab.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="leading-relaxed">
                    <Md text={step} />
                  </div>
                </li>
              ))}
            </ol>
            <div className="font-semibold text-zinc-200 text-sm mb-2">Self-check</div>
            <div className="space-y-2">
              {l.lab.checklist.map((item, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                    labChecks[i]
                      ? 'border-violet-500/50 bg-violet-500/10 text-zinc-200'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={labChecks[i] ?? false}
                    onChange={() => {
                      const next = labChecks.map((c, j) => (j === i ? !c : c))
                      setLabChecks(next)
                      setLessonProgress(
                        l.id,
                        already ? { labChecks: next } : { labChecks: next, status: 'in-progress' },
                      )
                    }}
                    className="mt-0.5 accent-violet-500"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        {l.resources.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Go deeper</h2>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {l.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-sky-500/50 px-4 py-3 text-sm transition-colors"
                >
                  <span className="text-lg">{KIND_ICON[r.kind] ?? '🔗'}</span>
                  <span className="text-zinc-300 leading-snug">{r.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="pb-10">
          <button
            onClick={() => (already ? onBack() : setStage('check-quiz'))}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3.5 transition-colors"
          >
            {already ? '← Back to module' : 'Take the checkpoint quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Celebration({ emoji, title, body, onBack }: { emoji: string; title: string; body: string; onBack: () => void }) {
  return (
    <div className="max-w-md mx-auto mt-16 text-center animate-pop">
      <div className="text-7xl mb-4">{emoji}</div>
      <h1 className="text-3xl font-bold text-zinc-50">{title}</h1>
      <p className="mt-2 text-zinc-400">{body}</p>
      <button
        onClick={onBack}
        className="mt-8 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold px-8 py-3 transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}
