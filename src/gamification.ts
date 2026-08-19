// XP levels, badge definitions, and award logic.

export interface LevelDef {
  level: number
  title: string
  minXp: number
}

export const LEVELS: LevelDef[] = [
  { level: 1, title: 'Prompt Apprentice', minXp: 0 },
  { level: 2, title: 'Context Cadet', minXp: 400 },
  { level: 3, title: 'Skill Smith', minXp: 900 },
  { level: 4, title: 'Hook Handler', minXp: 1500 },
  { level: 5, title: 'Subagent Wrangler', minXp: 2200 },
  { level: 6, title: 'Loop Engineer', minXp: 3000 },
  { level: 7, title: 'Harness Hacker', minXp: 3900 },
  { level: 8, title: 'Design Whisperer', minXp: 4800 },
  { level: 9, title: 'Fleet Commander', minXp: 5800 },
  { level: 10, title: 'Agent Architect', minXp: 7000 },
]

export function levelForXp(xp: number): LevelDef {
  let cur = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.minXp) cur = l
  return cur
}

export function nextLevel(xp: number): LevelDef | null {
  for (const l of LEVELS) if (xp < l.minXp) return l
  return null
}

export interface BadgeDef {
  id: string
  emoji: string
  name: string
  desc: string
}

export const BADGES: BadgeDef[] = [
  // Module completion badges
  { id: 'badge-m0', emoji: '🧭', name: 'Mental Mapper', desc: 'Completed Module 0: Mental Models' },
  { id: 'badge-m1', emoji: '⌨️', name: 'Claude Code Native', desc: 'Completed Module 1: Claude Code Mastery' },
  { id: 'badge-m2', emoji: '🔁', name: 'Loop Engineer', desc: 'Completed Module 2: Agents, Harnesses & Loops' },
  { id: 'badge-m3', emoji: '🎨', name: 'Design Director', desc: 'Completed Module 3: AI-Assisted Design' },
  { id: 'badge-m4', emoji: '💻', name: 'Local Operator', desc: 'Completed Module 4: Local Models' },
  { id: 'badge-m5', emoji: '🔎', name: 'Retrieval Ranger', desc: 'Completed Module 5: RAG' },
  { id: 'badge-m6', emoji: '🧬', name: 'Model Tuner', desc: 'Completed Module 6: Fine-Tuning' },
  { id: 'badge-m7', emoji: '📐', name: 'SDLC Shipper', desc: 'Completed Module 7: Token Economics & AI-Native SDLC' },
  // Boss badges
  { id: 'boss-m0', emoji: '🗺️', name: 'Boss: Cartographer', desc: 'Beat the Module 0 boss challenge' },
  { id: 'boss-m1', emoji: '🛠️', name: 'Boss: Toolsmith', desc: 'Beat the Module 1 boss challenge' },
  { id: 'boss-m2', emoji: '🤖', name: 'Boss: Machinist', desc: 'Beat the Module 2 boss challenge' },
  { id: 'boss-m3', emoji: '🖌️', name: 'Boss: Art Director', desc: 'Beat the Module 3 boss challenge' },
  { id: 'boss-m4', emoji: '🖥️', name: 'Boss: Homelab Hero', desc: 'Beat the Module 4 boss challenge' },
  { id: 'boss-m5', emoji: '📚', name: 'Boss: Librarian', desc: 'Beat the Module 5 boss challenge' },
  { id: 'boss-m6', emoji: '⚗️', name: 'Boss: Alchemist', desc: 'Beat the Module 6 boss challenge' },
  { id: 'boss-m7', emoji: '🚀', name: 'Boss: Launch Master', desc: 'Beat the Module 7 boss challenge' },
  // Special badges
  { id: 'first-lesson', emoji: '🌱', name: 'First Steps', desc: 'Completed your first lesson' },
  { id: 'test-out', emoji: '🧠', name: 'Already Knew That', desc: 'Tested out of a lesson with the skip quiz' },
  { id: 'streak-5', emoji: '🔥', name: 'On Fire', desc: '5-day learning streak' },
  { id: 'streak-10', emoji: '⚡', name: 'Unstoppable', desc: '10-day learning streak' },
  { id: 'halfway', emoji: '⛰️', name: 'Halfway Up', desc: 'Completed half of all lessons' },
  { id: 'perfect-quiz', emoji: '💯', name: 'Perfectionist', desc: 'Scored 100% on a check quiz' },
  { id: 'all-lessons', emoji: '🏆', name: 'Course Crusher', desc: 'Completed every lesson' },
  { id: 'capstone', emoji: '👑', name: 'Agent Architect', desc: 'Completed the capstone project' },
]

export const BADGE_MAP: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]))
