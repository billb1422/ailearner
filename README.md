# 🧠 aiLearner: 30 Days to Agent Expert

A personal, gamified learning site: 8 modules / ~40 lessons / 22 weekday sessions (~2 hrs each) covering agents, harnesses & loop engineering, Claude Code mastery, AI-assisted design, local models, RAG, fine-tuning, token economics, and the AI-native SDLC. Built from ~40 vetted sources + official Anthropic docs (July 2026 snapshot: see `docs/research-notes.md`).

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5199** — the port is pinned in `vite.config.ts` on purpose. Your XP, badges, and streaks live in the browser's localStorage, which is tied to that exact address, so a different port would show an empty profile. If `npm run dev` fails with "port 5199 is already in use", a server is already running (maybe one Claude started) — just use the existing one or stop it first. For a safety net, export your progress now and then from Settings (⚙️).

## How to use it

1. **Dashboard** shows your path: a skill-tree map of the 8 modules. Hit "Continue" to get today's lesson.
2. Every lesson starts with a **skip quiz**. Score 80%+ and you test out instantly with full XP.
3. Lessons are visual (tables, diagrams, comparisons) with **labs you do in real tools** (Claude Code / terminal), tracked by self-check checklists.
4. Each module ends with a **Boss Challenge**: a real build with a completion checklist and a badge.
5. The **Calendar** shows which days you completed lessons and earned badges; keep the streak alive.
6. Day 22: pick a **Capstone** track: Personal AI OS, Build Your Own Harness, or Ship an App AI-Natively.

Progress lives in localStorage; export/import it from Settings (⚙️).
