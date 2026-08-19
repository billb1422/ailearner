import type { CapstoneTrack } from '../types'

export const CAPSTONE_XP = 500

export const CAPSTONES: CapstoneTrack[] = [
  {
    id: 'ai-os',
    title: 'Personal AI OS',
    emoji: '🧠',
    pitch:
      'Turn an Obsidian vault + Claude Code into a second brain you will actually use every day: CLAUDE.md identity files, session memory, custom skills as SOPs, subagents that scan your notes before writing, and a scheduled morning loop.',
    bestFor: 'Compounding daily value; the system keeps teaching you agent patterns long after day 30.',
    requirements: [
      'Vault created with a folder architecture and a root CLAUDE.md (identity, projects, rules) that Claude reads on session start',
      'A memory.md (or auto-memory) pattern that persists decisions across sessions',
      'At least 3 custom skills for recurring workflows (e.g. /daily-brief, /voicenote-to-post, /weekly-review)',
      'A subagent that searches the vault for related notes before any new content is written',
      'One scheduled or looped automation (e.g. morning brief via /schedule or /loop)',
      'One week of real daily use logged',
    ],
  },
  {
    id: 'harness',
    title: 'Build Your Own Agent Harness',
    emoji: '🔧',
    pitch:
      'Build a minimal but real harness from scratch with the Claude Agent SDK (or raw API): the agent loop, tool execution, context management, a verification gate, budget tracking, and observability. Deepest technical payoff of the three.',
    bestFor: 'Understanding every layer you normally take for granted — the fastest route to harness intuition.',
    requirements: [
      'A working loop: prompt → model → tool calls → results → repeat, with an explicit termination condition',
      'At least 3 tools (e.g. file read/write, shell, web fetch) with token-efficient outputs',
      'Context management: transcript trimming or compaction when the window fills',
      'A verification gate: the agent cannot declare success until a programmatic check passes',
      'Budget tracking: token/cost counter with a hard stop',
      'A written postmortem: what your harness does worse (and better) than Claude Code, and why',
    ],
  },
  {
    id: 'ship-app',
    title: 'Ship an App AI-Natively',
    emoji: '🚀',
    pitch:
      'Take a real app from spec to shipped using the full AI-native SDLC: interview → SPEC.md → plan mode → parallel agents/teams → verification loops → design skills → agent code review → deploy.',
    bestFor: 'Proving the end-to-end workflow on something real you can show people.',
    requirements: [
      'A SPEC.md produced via the interview pattern before any code is written',
      'DESIGN.md defining the design system before UI work begins',
      'Implementation run primarily by agents (plan mode, subagents or agent teams, worktrees where useful)',
      'A verification loop with real checks (tests/build/screenshots) gating completion',
      'An agent-performed code review pass before merge',
      'Deployed and usable, with a cost log of what the build spent in tokens',
    ],
  },
]
