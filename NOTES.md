# aiLearner: Project Notes (session handoff)

Read this plus `CLAUDE.md` before doing anything. `CLAUDE.md` holds the hard rules; this file holds the why, the current state, and the workflows that already worked. Last updated after commit `4cdabaa`.

## What this is

A gamified, single-user learning website that takes **Bill** from "rusty architect who uses AI casually" to **expert AI user and agent engineer** in a 30-day (weekday) plan. Built from ~40 vetted sources plus official Anthropic docs, all pinned to a **July 2026** knowledge snapshot. Local React app, progress saved in the browser. Repo: `~/sd/aiLearner`.

## Who it's for (design the content for this person)

- Fractional CTO ("CTOx" voice), strong architect-level thinking, **rusty on hands-on syntax**, thinks in systems.
- **Visual learner.** Prefers tables, compare blocks, and diagrams over walls of text.
- **Cannot learn from terse, compressed writing.** This is the #1 content constraint. Every concept needs a plain-English statement, why it matters, and a concrete walked example. Assume zero ML background. See "Feedback patterns" below.
- Pace: ~2 hrs/day, weekdays only, 30-day target (~44 hrs of material).
- Wants: gamification, milestones to check off, skip-quizzes to test out of things he already knows, an activity calendar.

## Goals (what "done well" means)

1. Deep, genuine understanding (one-read comprehension), not skimmable summaries.
2. Priorities, in order: **agents + harnesses + loop engineering**, **Claude Code mastery**, **AI-assisted design**. Everything else (local models, RAG, fine-tuning, token costs, AI-native SDLC) is covered but secondary.
3. Learn by doing: labs happen in Bill's real tools (Claude Code / terminal), tracked by self-check checklists in the app.
4. Stay current: facts pinned to July 2026; flag when older advice is obsolete.

## Current status

- **BUILT and working.** 9 modules, **44 lessons**, 22 weekday sessions, plus boss challenges and 3 capstone tracks.
- Typechecks clean (`npm run typecheck`), production build works (`npm run build`).
- Bill has started going through it and is giving feedback; several lessons have been rewritten/expanded in response (see git log).
- **Source-enrichment pass done** (from 10 sources: Google agentic masterclass, two Michael workshops, Ambient Awareness note, six Claude Design sources). Enriched m0-l2/l4/l6, m1-l1/l5/l8, m2-l1/l3/l4/l6/l7, m3-l2/l4/l5. Added **3 new lessons**: m1-l10 (Ambient Awareness Layer), m3-l6 (Building with Claude Design), m7-l5 (The PRD Harness Pipeline). See "Enrichment decisions" below.
- No known bugs open. Progress persistence and the in-progress-lesson resume are fixed.

## How to run / verify / commit

- Dev server: `npm run dev` → **http://localhost:5199** (port is pinned in `vite.config.ts` on purpose; see "Gotchas"). Never start it on another port.
- The dev server I (Claude) start only lives for my session. Bill runs his own with `npm run dev`. If the port is taken, a server is already up.
- Verify content changes in the browser before committing (the preview tools). Confirm diagrams render and cross-ref links jump correctly.
- After ANY content edit, run: `npx tsc -b` (must pass) and `grep -c '—' src/content/modules/*.ts` (must be 0, anti-AI rule).
- Commit only when Bill asks or a unit of work is done. Co-author line: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Commit-message heredocs with apostrophes break bash; write the message to a scratchpad file and use `git commit -F`.

## Architecture

Stack: React 19 + Vite 6 + TypeScript + Tailwind v4 (via `@tailwindcss/vite`). No router; view state lives in `src/App.tsx` (a `Nav` union).

- `src/types.ts`: content + progress types. Content files must conform exactly. `ContentBlock` union: `text | callout | diagram | table | code | compare`.
- `src/content/curriculum.ts`: module metadata (id, title, emoji, color, tagline, days) + boss challenges; imports the lesson arrays.
- `src/content/modules/*.ts`: the lessons, pure data. **m1 and m2 are split** into `m1a`/`m1b` and `m2a`/`m2b` (concatenated in curriculum.ts) because single files got large. Others are one file each.
- `src/content/capstones.ts`: the 3 capstone tracks (Personal AI OS / Build Your Own Harness / Ship an App AI-Natively).
- `src/store.ts`: localStorage store (`ailearner-progress-v1`) via `useSyncExternalStore`. XP, badges, activity (per-day), streak, lesson status, boss/capstone checks. Export/import lives here.
- `src/awards.ts`: badge award rules. Run `checkAwards(getState(), MODULES)` after progress changes; it returns newly-earned badge ids to toast.
- `src/gamification.ts`: level table (10 levels, Prompt Apprentice → Agent Architect) + all badge definitions.
- `src/md.tsx`: mini-markdown renderer. Supported subset ONLY: `**bold**`, `*italic*`, `` `code` ``, `[label](url)`, `- ` bullets, blank-line paragraphs. Also supports `[label](lesson:<id>)` in-app jumps (see Gotchas).
- `src/nav.ts`: tiny navigation registry so md.tsx can trigger lesson jumps without prop-drilling. `App.tsx` registers the navigator in a `useEffect`.
- `src/components/`: `Dashboard` (hero + skill tree), `SkillTree` (SVG snake-path map), `ModuleView` (lesson list + boss), `LessonView` (the skip-quiz → content → checkpoint flow), `Quiz`, `Blocks` (renders ContentBlock union), `CalendarView`, `BadgesView`, `CapstoneView`, `SettingsModal` (export/import/reset), `BadgeToast`.
- `docs/research-notes.md`: the full research synthesis (July 2026 facts: model prices, local-model landscape, RAG stack, fine-tuning, SDLC reading list). **Source of truth for facts.** Check here before refreshing pricing/model names.

### Lesson flow (LessonView)
`intro` → optional `skip-quiz` (80%+ = test out, full XP) → `content` (sections of blocks, then optional lab, then resources) → `check-quiz` (any score completes). Completed or in-progress lessons re-open straight into `content` (no gate). "Start lesson" marks status `in-progress`.

## Content style rules (MANDATORY: this is what Bill cares about most)

Full list in `CLAUDE.md` "Content style" section. The kill-list is enforced by the **anthropic-skills:bills-anti-ai-style-guide** skill: apply it to all lesson prose. The essentials:

- **Explain, don't summarize.** Statement → why it matters → walked concrete example. If you catch yourself stating a conclusion without its reasoning, that's the exact failure mode Bill flags. Two paragraphs have already been rewritten for this (see `f3c24a7`, `c6976fd`).
- Define every acronym/term of art on first use, with a `[label](url)` link where useful.
- **ZERO em dashes** (verify `grep -c '—'`). ZERO "not X, it's Y" and its two-sentence variants. No triplet anaphora. No "There is/are" openers. No soft-tell words (leverage, robust, delve, ultimately, simply, comprehensive...). Contractions on. Vary rhythm.
- Prefer visuals. Every lesson should have at least one table/compare/diagram. Anything with a loop, pipeline, hierarchy, or quantity comparison wants a diagram.
- **Cross-reference other lessons as `[Module Name · Lesson Title](lesson:<id>)`**: never a raw id like `m0-l4` in prose, quiz text, or labs. This renders as a clickable pill that jumps in-app.

### SVG diagram conventions
viewBox roughly `0 0 700 300` to `0 0 700 400`. Dark bg `fill="#18181b"`. Text `fill="#e4e4e7"` (primary) / `#a1a1aa` (secondary). Boxes `fill="#27272a" stroke="#52525b"`. Accent strokes: `#38bdf8 #a78bfa #f472b6 #34d399 #fbbf24 #22d3ee`. `font-family="sans-serif"`. Simple boxes/arrows/labels only. Use HTML entities inside SVG text (`&#8594;` for →, `&#183;` for ·). Store as template-literal strings; never put `${` or backticks inside them.

### Quiz invariants
`skipQuiz` = exactly 5 questions, `checkQuiz` = exactly 4. Every question has exactly 4 options; `answer` is the correct index. No overlap between the two quizzes. Skip-quiz should test the hard core so a real expert passes and a tourist fails.

## Full lesson plan (44 lessons, 9 modules)

Accent color and boss in parens. Lesson ids are stable keys; **note the m7-l4 and m7-l3 ids now live in Module 8** (the AI Transformation Playbook was pulled into its own finale module; the ids were kept to preserve progress and cross-references, so id prefix no longer implies module). Array order = display order. **Three lessons added in the enrichment pass carry non-sequential ids: m1-l10, m3-l6, m7-l5** (see below).

**m0 Mental Models** (Days 1-3, #38bdf8, boss "Draw the Map"): l1 How LLMs Actually Work · l2 Vibe Coding → Agentic Engineering · l3 Prompting That Actually Works · l4 Context Engineering · l5 Workflows vs Agents · l6 Token Economics 101

**m1 Claude Code Mastery** (Days 4-8, #a78bfa, boss "Rig Your Ride"): l1 Fundamentals & the .claude Folder · l2 CLAUDE.md & the Memory System · l3 Agent Skills Deep Dive · l4 Skill Authoring Doctrine · l5 Hooks: Deterministic Control · l6 Subagents & Context Isolation · l7 MCP & Plugins · l8 Power Features · **l10 The Ambient Awareness Layer** (new; array order places it between l8 and l9) · l9 The Best-Practices Workflow

**m2 Agents, Harnesses & Loops** (Days 9-13, #f472b6, boss "Build a Loop"): the priority module: l1 What Is a Harness? · l2 Anatomy of the Agent Loop · l3 Loop Engineering · l4 Verification: the #1 Quality Lever · l5 Multi-Agent Patterns · l6 Agent Teams & Dynamic Workflows · l7 Agent Memory & State · l8 Building With the Agent SDK · l9 Cost-Aware Agents & Guardrails

**m3 AI-Assisted Design** (Days 14-16, #fb923c, boss "Ship a Screen"): l1 Design Context Engineering · l2 Vibe-Coding Beautiful UI · l3 Encoding Taste as Skills · l4 Claude Design, Figma & Direct Design · l5 Vision Loops & iOS · **l6 Building with Claude Design** (new; end-to-end product + ship-to-Vercel)

**m4 Local Models** (Days 17-18, #34d399, boss "Homelab"): l1 The Open-Model Landscape 2026 · l2 Running Models on Your Mac · l3 Local Agents & the Hybrid Split

**m5 RAG** (Days 19-20, #fbbf24, boss "Ask Your Docs"): l1 RAG Fundamentals · l2 Retrieval Quality · l3 Agentic RAG & the Decision Rule

**m6 Fine-Tuning** (Day 21, #f87171, boss "Alchemy"): l1 LoRA, QLoRA & When to Tune · l2 Fine-Tune on Your Mac

**m7 Token Economics & AI-Native SDLC** (Day 22, #22d3ee, boss "Price the Loop"): l1 Modeling Agent Costs · l2 The AI-Native SDLC · **l5 The PRD Harness Pipeline** (new; a third comparable SDLC beside PIV and Prompt-to-PR)

**m8 The AI Transformation Playbook** (Day 22, #818cf8, 🏢, boss "Launch Master"): the finale module. l4 Where AI Belongs in a Business (Weinstein's transformation playbook; id m7-l4) · l3 Capstone Launch (id m7-l3)

## Enrichment decisions (source pass, from 10 sources)

Deliberate editorial calls made during the enrichment pass. Honor these in future design/SDLC edits.

- **Claude Design model version: do NOT hard-pin.** Sources disagreed (announcement = Opus 4.7 Apr 2026; later videos = Opus 4.8 / Sonnet 5). We describe it as "Anthropic's vision model" + an in-product model picker whose tiers match the m0-l6 price sheet. Same call recorded in `docs/research-notes.md` §D.
- **Claude Design usage model = shared plan pool.** The early *separate weekly design quota was deprecated* (official get-started doc); it now draws from the same pool as chat + Claude Code. m3-l4 and m3-l6 both state the shared-pool model.
- **/design-sync and Figma are real, kept.** Official marketing pages don't foreground them, but the research base + the Griffin walkthrough (.fig upload, /design-sync) confirm both. Described accurately, not overstated.
- **m3-l4 keeps its 3-mode framing** (Claude Design / Claude-in-Figma / Direct Design); the heavy Claude Design product mechanics went into the new **m3-l6**, not into l4.
- **Multi-agent posture (m2-l6):** kept all existing team depth, ADDED a "prefer one generalist + skills; escalate to teams only under real parallelism" counterweight (Google/Medin trend). Did not gut the multi-agent content.
- **Source-3 lag items kept at the app's July-2026 stance** (do not regress): auto permission mode is the default (not "in research"), the commands/skills merger is settled, CLAUDE.md precedence is managed→user→project→local (local wins).
- **Skipped as low-value:** m1-l6 security-reviewer walkthrough and m1-l7 Chrome/Sentry demos (source agents rated them mere confirmations of content already present).
- **Boss sequencing fix:** the m0 "Draw the Map" boss used to require a model→harness→loop stack, but harness/loop aren't formally taught until Module 2 (m2-l1/l2/l3). Rescoped m0's boss to what Module 0 actually teaches (LLM mechanics + context engineering + vibe-to-agentic + cost model); the full model→harness→loop stack map now lives in the m2 "Build a Loop" boss. If you add forward-referencing boss/lab requirements, check the concept is taught at or before that module.

## Gotchas / conventions that bite

- **localStorage is scoped to origin (host+port).** Running on a different port shows an empty profile. That is why the port is pinned to 5199 with `strictPort` in `vite.config.ts` and `autoPort: false` in `.claude/launch.json`. Do not "fix" this by changing the port.
- **Lesson ids are stable and can be out of numeric order in the array** (m7-l4 before m7-l3). Never renumber existing ids; array order controls display.
- **`compare` blocks are neutral** (blue vs violet, `▸` bullets). Do NOT use them to imply good vs bad; they read as two even options. Blocks.tsx was changed to enforce this.
- Content strings: use double-quoted JS strings when the prose contains apostrophes (avoids escaping); template literals for SVG/code. Never `${` or backtick inside a template-literal md/svg string.
- The `verify.mjs`-style invariant check (bundle curriculum with esbuild, then assert lesson counts / quiz shapes / visual-per-lesson / no bare ids) is the fast way to validate content after a big edit. Reusable scratch scripts live in the session scratchpad, not the repo.

## Workflows that already worked (reuse these)

- **Bulk content authoring:** fan out one subagent per module (or per split file), each given: read `types.ts` + the relevant `docs/research-notes.md` section + `CLAUDE.md`, write the file, then self-verify with a standalone `tsc --noEmit ... <file>` and em-dash grep. This built all 41 lessons in parallel.
- **Video enrichment (proven with two YouTube links):** Bill sends URLs + which lesson each feeds. Pull transcripts with **yt-dlp** (`--write-auto-subs --sub-langs en --skip-download`) in a scratchpad venv: YouTube's own transcript panel chokes on long streams and WebFetch is blocked. Clean the VTT into timestamped text. For anything visual, have Bill export **slide screenshots as a PDF**; transcribe it slide-by-slide and treat the deck as the AUTHORITATIVE source (auto-captions garble names, numbers, and command names). Then run a fidelity pass that trues lesson facts and diagrams against the slides. This produced lesson m7-l4 and the PIV/prompt-to-PR sections of m7-l2.
- **Big PDFs:** render thumbnails with `pdftoppm -gray -scale-to 64` first to map structure, then read targeted page ranges. `brew install poppler` provides pdftoppm/pdfinfo.
- **Multi-source enrichment (proven with 10 sources):** one subagent per source, each grounded in `CLAUDE.md` + `NOTES.md` + `types.ts` + the specific lessons it overlaps, returning a fixed report shape (Source / Key Material / Overlap Map / Conflicts & Novel Approaches / Recommendation). The "Conflicts & Novel Approaches" section is what drives the interweaving decisions to bring back to Bill. Dedup overlapping sources (six Claude Design videos/docs) before authoring.
- **Verify WITHOUT touching Bill's real profile:** localStorage is per-origin, so start a throwaway dev server on a different port (`npx vite --port 5200 --strictPort false`), which gives a fresh empty profile you can click through freely (start lessons, trip quizzes) with zero effect on his 5199 progress. The in-app Browser pane's screenshot/native-scroll can glitch to black frames after JS scrolling and its viewport sometimes reports 0x0 (call `resize_window` to reset). Reliable check: `javascript_tool` DOM queries (assert headings, table cells, `<code>` contents, SVG text/rect counts, cross-ref pills) plus a top-of-lesson screenshot. Kill the server with `lsof -ti :5200 | xargs kill` when done.

## Feedback patterns from Bill (internalize these)

- "Terse / too much summary" is his recurring note. When he quotes a paragraph he re-read multiple times, the fix is always: unpack it, add a walked example, define the jargon. Do that proactively, don't wait to be told.
- He wants cross-references as human-readable module+lesson names with a working link, never internal ids.
- He caught that two SDLC methods were framed as a progression when they should be two comparable approaches with pros/cons and a "when to choose which." When presenting multiple methods, default to: shared spine → comparison table → when-to-use-each → recommendation for his situation (fractional CTO).
- He's an active, careful reader. Precision and honesty matter to him; when something is reconstructed from a lossy source (auto-captions), say so.

## Possible next work (not committed to)

- Continue the explanatory-rewrite pass proactively on other lessons before he hits them (m1/m2 are dense).
- More video/source enrichment as Bill supplies links.
- The JS bundle is ~756 KB (all lessons in one chunk); harmless for a local app, but code-splitting per module is an option if it ever matters.
- A weekday reminder/loop was floated but not built.
