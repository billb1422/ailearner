// localStorage-backed progress store with a tiny pub/sub for React.
import { useSyncExternalStore } from 'react'
import type { ProgressState, LessonProgress, DayActivity } from './types'

const KEY = 'ailearner-progress-v1'

function emptyState(): ProgressState {
  return {
    lessons: {},
    boss: {},
    capstone: { track: undefined, checks: [] },
    xp: 0,
    badges: {},
    activity: {},
    streak: { current: 0, best: 0, lastDate: undefined },
  }
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as ProgressState
    return { ...emptyState(), ...parsed }
  } catch {
    return emptyState()
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

export function getState(): ProgressState {
  return state
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getState)
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function touchActivity(mut: (a: DayActivity) => void) {
  const key = todayKey()
  const a = state.activity[key] ?? { lessons: 0, badges: [], xp: 0 }
  mut(a)
  state.activity = { ...state.activity, [key]: a }
}

function updateStreak() {
  const today = todayKey()
  const last = state.streak.lastDate
  if (last === today) return
  const yesterday = todayKey(new Date(Date.now() - 86400000))
  const current = last === yesterday ? state.streak.current + 1 : 1
  state.streak = {
    current,
    best: Math.max(state.streak.best, current),
    lastDate: today,
  }
}

export function awardXp(amount: number) {
  state = { ...state, xp: state.xp + amount }
  touchActivity((a) => (a.xp += amount))
  updateStreak()
  persist()
}

export function awardBadge(badgeId: string): boolean {
  if (state.badges[badgeId]) return false
  state = { ...state, badges: { ...state.badges, [badgeId]: new Date().toISOString() } }
  touchActivity((a) => a.badges.push(badgeId))
  persist()
  return true
}

export function setLessonProgress(lessonId: string, patch: Partial<LessonProgress>) {
  const prev: LessonProgress = state.lessons[lessonId] ?? { status: 'not-started' }
  const next = { ...prev, ...patch }
  const justCompleted =
    (next.status === 'completed' || next.status === 'tested-out') &&
    prev.status !== 'completed' &&
    prev.status !== 'tested-out'
  if (justCompleted) {
    next.completedAt = new Date().toISOString()
    touchActivity((a) => (a.lessons += 1))
    updateStreak()
  }
  state = { ...state, lessons: { ...state.lessons, [lessonId]: next } }
  persist()
}

export function setBossChecks(moduleId: string, checks: boolean[], completed: boolean) {
  const prev = state.boss[moduleId]
  const completedAt = completed ? (prev?.completedAt ?? new Date().toISOString()) : undefined
  state = { ...state, boss: { ...state.boss, [moduleId]: { checks, completedAt } } }
  persist()
}

export function setCapstone(patch: Partial<ProgressState['capstone']>) {
  state = { ...state, capstone: { ...state.capstone, ...patch } }
  persist()
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' || parsed === null || typeof parsed.xp !== 'number') return false
    state = { ...emptyState(), ...parsed }
    persist()
    return true
  } catch {
    return false
  }
}

export function resetProgress() {
  state = emptyState()
  persist()
}
