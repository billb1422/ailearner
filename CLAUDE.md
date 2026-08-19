# aiLearner

Gamified 30-day "AI expert" learning site for Bill. React 19 + Vite 6 + TypeScript + Tailwind v4 (via @tailwindcss/vite). No router — view state lives in `src/App.tsx`. Progress persists to localStorage (`ailearner-progress-v1`).

## Commands
- `npm run dev` — dev server
- `npm run typecheck` — `tsc -b`
- `npm run build` — typecheck + production build

## Architecture
- `src/types.ts` — content + progress types. Content files must conform exactly.
- `src/content/curriculum.ts` — module metadata + boss challenges; imports lesson arrays.
- `src/content/modules/*.ts` — lesson content (m1/m2 are split into a/b files). Pure data, template literals for md/svg.
- `src/content/capstones.ts` — the three capstone tracks.
- `src/store.ts` — localStorage store with useSyncExternalStore; XP/badges/activity/streak mutations live here.
- `src/awards.ts` — badge award rules (run `checkAwards` after progress changes).
- `src/gamification.ts` — level table + badge definitions.
- `src/md.tsx` — mini-markdown renderer. Supported subset ONLY: **bold**, *italic*, `code`, [label](url), "- " bullets, blank-line paragraphs.
- `docs/research-notes.md` — the research base all lesson content was authored from (July 2026 snapshot).

## Rules
- Lesson `md` strings must stay within the mini-markdown subset — the renderer supports nothing else.
- Quiz invariants: skipQuiz = 5 questions, checkQuiz = 4, exactly 4 options each, `answer` is an index.
- Keep the dark theme (zinc-950 background); module accent colors come from `Module.color`.
- Content facts are pinned to July 2026 — when updating lessons, check docs/research-notes.md and refresh pricing/model names deliberately, not incidentally.
