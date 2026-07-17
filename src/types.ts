// Core content + progress types for aiLearner.
// Content authors: every lesson must conform to Lesson exactly; keep `md` fields
// to the mini-markdown subset (bold, `code`, [links](url), - bullets, plain paragraphs).

export interface QuizQuestion {
  q: string
  options: string[] // exactly 4
  answer: number // index into options
  explain: string // shown after answering
}

export type ContentBlock =
  | { type: 'text'; md: string }
  | {
      type: 'callout'
      variant: 'insight' | 'warning' | 'tip' | 'quote'
      title?: string
      md: string
    }
  | { type: 'diagram'; svg: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'code'; lang: string; code: string; caption?: string }
  | {
      type: 'compare'
      left: { title: string; items: string[] }
      right: { title: string; items: string[] }
    }

export interface LessonSection {
  heading: string
  blocks: ContentBlock[]
}

export interface Resource {
  label: string
  url: string
  kind: 'video' | 'article' | 'docs' | 'repo' | 'course' | 'thread'
}

export interface Lab {
  title: string
  intro: string
  steps: string[] // markdown-ish; done outside the site in Claude Code / terminal
  checklist: string[] // self-check items the learner ticks off
}

export interface Lesson {
  id: string // e.g. 'm1-l2'
  title: string
  day: number // 1..22 (weekday session number)
  minutes: number
  xp: number
  objectives: string[]
  skipQuiz: QuizQuestion[] // 5 questions; score >= 80% tests out of the lesson
  sections: LessonSection[]
  lab?: Lab
  checkQuiz: QuizQuestion[] // ~4 questions to complete the lesson
  resources: Resource[]
}

export interface BossChallenge {
  title: string
  description: string
  requirements: string[] // completion checklist
  xp: number
  badgeId: string
}

export interface Module {
  id: string // 'm0'..'m8'
  title: string
  emoji: string
  color: string // hex accent, e.g. '#8b5cf6'
  tagline: string
  days: string // display string, e.g. 'Days 1–3'
  lessons: Lesson[]
  boss: BossChallenge
}

// Capstone tracks (Day 22): learner picks one in-app.
export interface CapstoneTrack {
  id: string
  title: string
  emoji: string
  pitch: string
  bestFor: string
  requirements: string[]
}

// ---------- Progress ----------

export type LessonStatus = 'not-started' | 'in-progress' | 'completed' | 'tested-out'

export interface LessonProgress {
  status: LessonStatus
  skipQuizScore?: number // 0..1
  checkQuizScore?: number // 0..1
  labChecks?: boolean[]
  completedAt?: string // ISO datetime
}

export interface DayActivity {
  lessons: number
  badges: string[]
  xp: number
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>
  boss: Record<string, { checks: boolean[]; completedAt?: string }>
  capstone: { track?: string; checks: boolean[]; completedAt?: string }
  xp: number
  badges: Record<string, string> // badgeId -> ISO date earned
  activity: Record<string, DayActivity> // key: 'YYYY-MM-DD' (local)
  streak: { current: number; best: number; lastDate?: string }
}
