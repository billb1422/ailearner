// Badge award checks, run after progress changes. Returns newly earned badge ids.
import type { Module, ProgressState } from './types'
import { awardBadge } from './store'

export function isLessonDone(p: ProgressState, lessonId: string): boolean {
  const s = p.lessons[lessonId]?.status
  return s === 'completed' || s === 'tested-out'
}

export function moduleDone(p: ProgressState, m: Module): boolean {
  return m.lessons.every((l) => isLessonDone(p, l.id))
}

export function checkAwards(p: ProgressState, modules: Module[]): string[] {
  const earned: string[] = []
  const give = (id: string) => {
    if (awardBadge(id)) earned.push(id)
  }

  const allLessons = modules.flatMap((m) => m.lessons)
  const doneCount = allLessons.filter((l) => isLessonDone(p, l.id)).length

  if (doneCount >= 1) give('first-lesson')
  if (doneCount >= Math.ceil(allLessons.length / 2)) give('halfway')
  if (doneCount === allLessons.length) give('all-lessons')

  if (Object.values(p.lessons).some((lp) => lp.status === 'tested-out')) give('test-out')
  if (Object.values(p.lessons).some((lp) => (lp.checkQuizScore ?? 0) === 1)) give('perfect-quiz')

  if (p.streak.best >= 5) give('streak-5')
  if (p.streak.best >= 10) give('streak-10')

  for (const m of modules) {
    if (moduleDone(p, m)) give(`badge-${m.id}`)
    if (p.boss[m.id]?.completedAt) give(m.boss.badgeId)
  }

  if (p.capstone.completedAt) give('capstone')

  return earned
}
