import { useState } from 'react'
import type { QuizQuestion } from '../types'
import { Md } from '../md'

interface QuizProps {
  title: string
  subtitle?: string
  questions: QuizQuestion[]
  submitLabel?: string
  onDone: (score: number) => void // score 0..1
}

export function Quiz({ title, subtitle, questions, submitLabel = 'Submit answers', onDone }: QuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every((a) => a !== null)
  const score = submitted
    ? answers.filter((a, i) => a === questions[i].answer).length / questions.length
    : 0

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      <div className="mt-5 space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi]
          return (
            <div key={qi}>
              <div className="font-medium text-zinc-200 mb-2.5">
                <span className="text-zinc-500 mr-2">{qi + 1}.</span>
                <Md text={q.q} />
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  let cls = 'border-zinc-700/80 bg-zinc-900 hover:border-zinc-500'
                  if (submitted) {
                    if (oi === q.answer) cls = 'border-emerald-500/70 bg-emerald-500/10'
                    else if (chosen === oi) cls = 'border-rose-500/70 bg-rose-500/10'
                    else cls = 'border-zinc-800 bg-zinc-900 opacity-60'
                  } else if (chosen === oi) {
                    cls = 'border-sky-500 bg-sky-500/10'
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
                      }
                      className={`text-left rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${cls}`}
                    >
                      <span className="font-mono text-zinc-500 mr-2">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <div
                  className={`mt-2 text-sm rounded-lg px-3 py-2 ${
                    chosen === q.answer ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {chosen === q.answer ? '✓ Correct. ' : '✕ Not quite. '}
                  <span className="text-zinc-300">
                    <Md text={q.explain} />
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-6 flex items-center gap-4">
        {!submitted ? (
          <button
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            {submitLabel}
          </button>
        ) : (
          <>
            <div className="text-lg font-bold text-zinc-100">
              {Math.round(score * 100)}%
              <span className="ml-2 text-sm font-normal text-zinc-400">
                ({answers.filter((a, i) => a === questions[i].answer).length}/{questions.length} correct)
              </span>
            </div>
            <button
              onClick={() => onDone(score)}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              Continue →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
