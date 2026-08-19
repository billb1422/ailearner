# aiLearner — Research Synthesis (July 14, 2026)

Consolidated findings from 12 research agents covering ~146 user-supplied links, official Anthropic docs/courses, and the mid-2026 AI landscape. This is the source-of-truth for authoring lessons.

**Learner profile:** Bill — rusty dev / architect-level, visual learner. 2 hrs/day weekdays, 30-day goal (~44 hrs). Wants pre-lesson skip quizzes, gamified milestones. Priorities: (1) agents + harnesses + loop engineering, (2) Claude Code mastery, (3) AI-assisted design. Also cover: local models, RAG, fine-tuning, token costs, AI-native SDLC.

---

## THE BIG IDEAS (what the whole curriculum orbits)

1. **The harness > the model.** "Agent = model + harness." Life-Harness paper (arxiv.org/abs/2605.22166): 116/126 setups improved by patching the harness alone; 88.5% mean lift across 18 backbones. Same Sonnet 4.5 swings 31%→75% on GAIA from scaffolding alone. Harness = context management + tools + verification + memory + termination.
2. **Loop engineering is the new prompting.** Boris Cherny: "I don't prompt Claude anymore. I have loops... My job is to write loops." Loop = prompt → act → check against REAL criteria → decide done/not → re-prompt. The craft: making the check real and defining when to stop. Failure modes: no memory file, no subagent split, no stop condition ("bills you in your sleep").
3. **Context engineering ⊃ prompt engineering.** Attention budget / context rot (n² attention). Smallest set of high-signal tokens. Progressive disclosure / just-in-time retrieval. Compaction vs structured notes vs subagent isolation.
4. **Verification is the #1 quality lever.** Give the agent a binary pass/fail signal (tests, build, screenshot). Stop hooks block "claims done but isn't." Cherny: verification loop "2-3x the quality." Matt Pocock: write the failing test first.
5. **Files are the universal agent substrate.** CLAUDE.md, SKILL.md, DESIGN.md, spec.md, memory.md, filesystem-as-state ("Your Company is a Filesystem" — Eli Mernit). Markdown folders beat databases because they're legible to both humans and models.
6. **Classic engineering discipline became MORE valuable.** Specs, tests, CI, review are the control surface for agents (Willison's "vibe engineering", Karpathy's "vibe coding raises the floor; agentic engineering raises the ceiling").

---

## MODULE-BY-MODULE SOURCE MATERIAL

### A. Foundations & mental models
- **Karpathy "Deep Dive into LLMs" (3 hr, free)** — tokenization, attention, hallucinations, tool use, RLHF. THE foundations video.
- **Karpathy Sequoia AI Ascent 2026 talk (30 min, youtu.be/96jN2OCOfLs)** — "From Vibe Coding to Agentic Engineering." Vibe coding = accepting output you don't read; agentic engineering = specs + verification + ownership. Karpathy summary: karpathy.bearblog.dev/sequoia-ascent-2026.
- **Anthropic applied-AI prompting workshop (24 min, 40 techniques)** — youtube.com/watch?v=9B39p0W4duw. Free, replaces paid prompt courses.
- **Anthropic "Building Effective Agents"** — workflows (predefined paths) vs agents (model directs itself). 5 workflow patterns: prompt chaining, routing, parallelization (sectioning+voting), orchestrator-workers, evaluator-optimizer. Augmented LLM = retrieval + tools + memory. Use agents only for open-ended tasks.
- **Anthropic "Effective Context Engineering"** — attention budget, system-prompt altitude (Goldilocks), JIT retrieval, compaction/notes/subagents selection rule.
- Socratic prompting (lazukars): theory→framework→application question chain; marginal in extended-thinking era but decompose-before-generate holds.
- Vibe-coding fundamentals (wasimships "15 concepts"): prompt chaining, few-shot, token budgets, output validation, evals-on-every-change.

### B. Claude Code mastery (state of the art July 2026, v2.1.209)
**Official ground truth (code.claude.com/docs):**
- **Memory:** CLAUDE.md hierarchy (managed → ~/.claude → project → CLAUDE.local.md), @imports (depth 4), AGENTS.md interop, `.claude/rules/` with `paths:` globs, **auto memory** (`~/.claude/projects/<proj>/memory/MEMORY.md` index + topic files), `/init`, keep <200 lines, delivered as user message not system prompt.
- **Skills:** commands MERGED into skills. `.claude/skills/<name>/SKILL.md`, Agent Skills open standard (agentskills.io). Frontmatter: description (trigger surface), argument-hint, disable-model-invocation, allowed-tools, model, effort, context:fork, hooks, paths. `$ARGUMENTS`, `` !`command` `` dynamic injection. 3-level progressive disclosure: metadata → body → bundled files. skill-creator plugin for evals.
- **Hooks:** ~30 events (SessionStart, PreToolUse, PostToolUse, Stop, TeammateIdle, TaskCompleted...). 5 handler types: command, http, mcp_tool, prompt, agent. Exit 2 = block. updatedInput/updatedToolOutput rewriting. `if:` filters.
- **Subagents:** `.claude/agents/*.md`, frontmatter (tools, model, permissionMode, memory scopes, background, isolation:worktree, skills preload, inline mcpServers). Background by default; nested depth 5; resumable via SendMessage; /fork inherits full history; Explore/Plan built-ins skip CLAUDE.md.
- **Agent teams (experimental):** CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Team lead + teammates with own contexts, shared task list, mailboxes. Plan approval, quality-gate hooks, 3-5 teammates. Anti-patterns: sequential work, same-file edits.
- **Dynamic workflows (GA June 2026):** Claude writes its own JS/TS multi-agent harness. `ultracode` keyword. Patterns: fan-out+synthesize, adversarial verification, tournament, loop-until-done.
- **MCP:** tool search on by default (deferred tools), scopes local/project/user, channels (push), OAuth via /mcp. Keep <10 servers enabled / <80 tools (context hygiene).
- **Plugins:** skills+agents+hooks+MCP+LSP+monitors+bin/. Marketplaces: claude-plugins-official, claude-plugins-community.
- **Agent SDK:** @anthropic-ai/claude-agent-sdk (TS) / claude-agent-sdk (Python). query() iterator, programmatic agents/hooks, settingSources. Positioning: Agent SDK vs raw API vs Managed Agents. Headless: `claude -p`.
- **Best practices (living doc):** verify-first (escalation: same-prompt → /goal → Stop hook → verification subagent), explore→plan→implement→commit, interview pattern (AskUserQuestion → SPEC.md → fresh session), auto permission mode, /clear between tasks, checkpoints/rewind, failure patterns (kitchen-sink session, correcting-over-and-over → /clear, over-specified CLAUDE.md).
- **Boris Cherny threads:** 10 team tips (worktrees ×3-5, plan mode for every complex task, CLAUDE.md investment + ask Claude to update it, skills in VCS, Slack bug pastes, reviewer-role prompts, subagents, CLI tools like bq, learning modes). Hidden features: --teleport, /loop, /schedule, /branch, /btw, /batch, --bare, /voice, Chrome extension, computer use (research preview: full write→compile→launch→click→fix loops).
- **Skill authoring doctrine (Thariq/CC team, 9 tips):** don't state the obvious; Gotchas section = highest value; filesystem + progressive disclosure; don't railroad (goals not scripts); config.json; description written FOR the model as trigger; persist memory (JSON/SQLite, ${CLAUDE_PLUGIN_DATA}); ship scripts; on-demand hooks.
- **everything-claude-code repo (affaanmustafa):** dense config reference — skills, hooks catalog, subagent sandboxing, MCP hygiene rule, .rules/ folder, tmux/worktrees/Zed.
- **Claude Code memory teardown (hesamation):** 4 layers — CLAUDE.md (3 scopes), auto memory (4 categories), auto "dream" consolidation, keyword-only retrieval (no embeddings) = the gap RAG fills.
- **Courses (free, certificates):** anthropic.skilljar.com "Introduction to Agent Skills" + "Claude Code in Action" (note: predates skills-merged-commands).
- **Cowork:** plugins bundle (knowledge-work-plugins repo), Cowork starter pack (github.com/TheCraigHewitt/cowork-starter-pack): 3 context files + 7 knowledge-worker skills. Ruben Hassid voice-cloning: about-me.md, anti-ai-writing-style.md, my-company.md.

**Obsolete late-2025 advice to flag in lessons:** .claude/commands/ (→skills), manual tmux parallelism (→teams/workflows), Task tool (→Agent), --dangerously-skip-permissions (→auto mode + /sandbox), "CLAUDE.md is the only memory" (→auto memory + rules/), "MCP loads all tools" (→tool search), /agents wizard (removed).

### C. Agents, harnesses, loop engineering
- **Harness concept:** AVB "harness is the OS for the LLM" — history mgmt, tool exec, context mgmt, termination. Sydney Runkle (LangChain): agent = model + harness; harness design = context delivery design; middleware hooks (before/after model/tool calls). **mfpiccolo "How to build your own agent harness"** (iii.dev): harness = 15 jobs, not a thing you install — turn persistence, credentials, model catalog, state machine, skill serving, prompt assembly, streaming, tool policy, approvals, spend tracking, hooks, session branching, compaction, events, OTEL. Repos: github.com/iii-hq/workers.
- **Loops:** "WTF Is a Loop?" (Van Horn; Steinberger vs Cherny, 3.6M views). Plan/build/judge 3-agent loop demo (app in 40 min). Anthropic /loop, ScheduleWakeup-style self-pacing. Runaway-cost guardrails.
- **Verification:** ClaudeDevs Stop-hook + SKILL.md self-checks; binary pass/fail; Pocock TDD-first; ADRs for agents.
- **Contract-based tasking (systematicls "World-Class Agentic Engineer"):** {Task}_CONTRACT.md w/ acceptance criteria; stop-hooks block until contract passes; research/implementation session isolation; 3-agent bug detection (detector superset → adversarial refuter w/ penalties → judge); neutral prompting ("report situations discovered" not "find bugs"); anti-pattern: 26k-line CLAUDE.md, plugin sprawl. Follow-up: "The New 100x Agentic Engineer."
- **Adversarial/council patterns:** LLM Council skill (Ole Lehmann, from Karpathy's pattern): 5 advisors (Contrarian, First Principles, Expansionist, Outsider, Executor) → anonymized blind peer review → Chairman synthesis; "council this"; repos: aiwithremy/claude-skills-llm-council, ngmeyer/council-review.
- **Case studies:** Karpathy Autoresearch (train.py only-editable file, locked eval prepare.py, val_bpb metric, git-revert loop, simplicity criterion — reward-hacking closure). Composio Agent Orchestrator (meta-harness running CC/Codex/Cursor in parallel; 40k LOC in 8 days). Paperclip (CEO-agent hires engineer agents; heartbeats, skills, routines, budgets) vs OpenClaw (solo operator, 25+ channels). Tyler Folkman CRISPY (5 agents: Architect/Scout/Coder-TDD/Reviewer-cross-model/Verifier; $200→$45/mo).
- **Memory/state:** filesystem-as-state (Mernit "Your Company is a Filesystem"; OpenClaw's whole context is a filesystem). planning-with-files skill (task_plan.md, findings.md, progress.md — anti-drift; `npx skills add othmanadi/planning-with-files`). Nir Diamant repos: Agent_Memory_Techniques (30 notebooks: buffers, vector stores, knowledge graphs, MemGPT, Mem0, Letta, Zep, Graphiti), agents-towards-production.
- **Senior Engineer OS (kloss_xyz):** doc hierarchy (progress.txt, IMPLEMENTATION_PLAN.md, LESSONS.md, PRD.md, TECH_STACK.md, DESIGN_SYSTEM.md...); 7-step debug protocol (reproduce → blast radius → present → root cause → propose → implement+verify → update LESSONS.md); requirements-interrogator prompt ("Never assume. Never infer.").
- **Plan-then-execute systems (hooeem):** Karpathy prompt ("accuracy is your success metric, not my approval") + Pocock 4-phase (Ingestion/design tree → Interview loop w/ decision ledger → Spec lock + risk register → Execution).
- **Org level:** Eric Siu "Company Brain" (capture→retrieval→truth→permissions→feedback layers; Slack-fronted fleet; 90+ cron jobs). Enterprise agents (vasuman): context/governance/access/autonomy balance.
- **OpenClaw cautionary tales:** jordymaui "$800/80 hrs wasted" + "500 hrs/$5,000" follow-up; pre-load ~$250 credits; model/hosting choices dominate 24/7 agent cost.

### D. AI-assisted design
- **Claude Design platform** (Anthropic Labs, Apr 2026; Opus vision): conversational prototypes/slides/one-pagers as LIVE clickable HTML; reads codebase + Figma to extract design systems; June 2026 /design-sync.
- **DESIGN.md pattern:** one markdown design-system file; github.com/VoltAgent/awesome-design-md (40+ from Stripe, Linear, Vercel, Notion...). Design system as agent-readable context, parallel to CLAUDE.md.
- **Vibe-coding beautiful UI (om_patel5):** sketch in Excalidraw → "follow this structure exactly" (AI copies better than it imagines); screenshot refs from Dribbble/Mobbin; mood-board color palettes; define design system BEFORE code; UI/UX Pro Max skill; kill AI tells (Inter font + Lucide icons + generic gradients → unique fonts, Phosphor icons).
- **emilkowalski/skills (12.8k stars, MIT):** /apple-design (17 WWDC principles), emil-design-eng, review-animations, improve-animations, animation-vocabulary. `npx skills@latest add emilkowalski/skills`.
- **Grid-systems skill (nicos_ai):** Müller-Brockmann grids encoded as a skill — encode a canonical textbook as executable design principles.
- **Direct Design (Alex Kehr):** skip Figma; describe what product should DO/FEEL/for WHOM in Cursor/CC; feedback loop weeks→minutes; design in running code.
- **Figma:** Claude-in-Figma (Medium piece): automates variations/wireframes/component libraries; can't do brand nuance. Marryclaire 9-prompt pipeline (architecture → design system → content → logic → Figma Make prompts → animation → responsive → data → QA) — sequential single-responsibility prompt decomposition.
- **iOS:** simulator skills (conorluddy/ios-simulator-skill): screenshot→analyze→tap loop over accessibility tree; ios-builder + GitHub Actions. Vision-in-the-loop UI iteration.

### E. Local models (mid-2026)
- Best-in-class: Qwen 3 235B-A22B (Apache 2.0, ~132GB), DeepSeek R1 line (MIT), GLM-4.7 (agentic coding), Gemma 3 27B (multimodal, 32GB Mac), Qwen3 30B-A3B (sweet spot), gpt-oss 120B/20B, Devstral (local coding).
- MoE gotcha: all experts in RAM (235B/22B-active needs ~132GB but computes like 22B).
- Mac tiers @ Q4: 16GB→8B, 32GB→14-30B MoE/Gemma27, 64GB→70B dense or gpt-oss 120B, 128-192GB→Qwen3-235B/GLM.
- Tooling: Ollama 0.19 (MLX backend, ~93% faster decode), MLX/mlx-lm (fastest on Apple Silicon + fine-tune path), LM Studio (GUI, GGUF+MLX), llama.cpp (portability), vLLM (production Linux/NVIDIA).
- Quantization: GGUF Q4_K_M default; RAM ≈ params × 0.5-0.6 GB/B + 10-30% KV.
- `ANTHROPIC_BASE_URL=http://localhost:11434/v1` → Claude Code on local Ollama. Hybrid: local for 80%, one frontier sub for 20%.
- Obsolete: "Llama is default" (Qwen/DeepSeek/GLM/gpt-oss lead), "GGUF only path on Mac" (MLX), Qwen 2.5/Mixtral/Phi-3 era advice.

### F. RAG (mid-2026)
- Pipeline: ingest → chunk (200-800 tok) → embed → vector store → hybrid retrieve (BM25 + dense + RRF) → rerank (cross-encoder) → generate w/ citations → evaluate (RAGAS, 50-200 real-query eval set).
- Embeddings: text-embedding-3-large / Cohere v4 / Voyage (hosted); BGE-M3, Qwen3-Embedding (open). Same model for index+query.
- Stores: pgvector (default w/ Postgres), Qdrant/Milvus (scale), Chroma (dev), Pinecone (managed).
- Agentic RAG = retrieval-as-a-tool inside agent loop (2026 default for hard cases): plan, multi-query, reformulate, mix tools.
- Decision rule: caching-backed long context (1M) for small stable corpora; RAG for big/fresh/permissioned; fine-tune for behavior not knowledge.
- Claude Code memory is keyword-only → memsearch-style semantic add-ons illustrate the gap.

### G. Fine-tuning
- LoRA (adapters, 0.1-1% params) / QLoRA (4-bit NF4 base): 8B tunes on 8-12GB; 70B on one H100 (~3 hrs).
- Tools: Unsloth (2-5× faster), Axolotl (YAML, multi-GPU, DPO/GRPO), HF PEFT+TRL, **MLX-LM on Mac** (`mlx_lm.lora --model ... --data ... --iters 1000`; Mistral-7B + 5k examples ≈ 90 min on M2 Max 32GB).
- Hosted: OpenAI WINDING DOWN fine-tuning API (verify); Together (LoRA $0.48-2.90/M tok by size), Fireworks (serves tuned at base prices). DIY: 8B QLoRA ≈ $0.44-0.88 on RunPod.
- Worth it: style/format/persona, classification/extraction, tool-call formats, cost/latency shrink, edge. NOT: knowledge injection (RAG), <500 examples, prompt-solvable.
- Distillation = dominant pattern: frontier teacher generates/grades data → QLoRA small open model. ToS: closed-model outputs restricted; open teachers (DeepSeek MIT, Qwen Apache) avoid it.
- Real cost = dataset curation + evals, not compute.

### H. Token economics (July 2026; re-verify exact numbers at build time)
- Claude API /M tok: Fable 5 $10/$50 (1M ctx); Opus 4.8 $5/$25; Sonnet 5 $3/$15 (intro $2/$10 thru Aug 31 2026); Haiku 4.5 $1/$5. Output ≈ 5-6× input everywhere.
- OpenAI GPT-5.x tiers $0.20-$30 in / cached input = 10%; Gemini 3.x $0.25-$4 in. Batch = 50% off (all three).
- Anthropic caching: reads 0.1×, writes 1.25× (5-min) / 2× (1-hr); prefix-exact; breakeven at 2 requests; invalidators: timestamps/UUIDs, unsorted JSON, changed tools.
- Agent loop math: transcript resent per turn → quadratic uncached, ~linear cached. Formula: sessions/day × turns × (fresh_in×rate + cached×0.1×rate + out×rate) × 30.
- Anchors: median CC dev ≈ $6/day API-equivalent (90% < $12/day); heavy multi-agent $1,000+/mo → Max plan arbitrage. Plans: Pro $20, Max 5× $100, Max 20× $200. Crossover ≈ $6-10/day.
- Practical habits (0x_kaize): edit+regenerate, fresh chat per task, batch questions, project files not re-uploads, route simple tasks to Haiku, off-peak, 5-hr rolling window.
- Ponytail skill (github.com/DietrichGebert/ponytail): anti-over-engineering; ~54% less code, ~20% cheaper, ~27% faster; /ponytail-review, /ponytail-audit.

### I. AI-native SDLC
- **Anthropic 2026 Agentic Coding Trends Report:** orchestrator + specialized agents in parallel contexts; devs fully delegate only 0-20%, supervise 80-100%; context engineering named THE skill.
- **Spec-driven development:** executable version-controlled spec → plan → atomic tasks → code. GitHub Spec Kit, Amazon Kiro, Tessl.
- **Review is the bottleneck** (hwchase17): Builders vs Reviewers archetypes; generalists rise; PRD→Design→Eng pipeline dissolves.
- **Vibe engineering** (Willison): AI multiplies testing/planning/docs/CI/review; vibe coding and agentic engineering converging (May 2026 follow-up).
- **Yegge:** "Revenge of the Junior Developer" — six waves ending in agent fleets (one dev, 100+ agents); *Vibe Coding* book w/ Gene Kim.
- **"No Coding Before 10am"** (Bloch): pair-prompting mornings; agents as primary users of the system; code is context not library; validate against objectives not lines; delete dead code immediately; automate anything repeated 2×; plan for tech shift every ~3 months.
- Agent PR review: CodeRabbit, Copilot review, CC /review + GH Actions, Greptile. CI agents auto-fix, open remediation PRs.
- Addy Osmani "The Code Agent Orchestra"; CodeRabbit "agentic SDLC" guide; comprehension debt / haunted codebases.

### J. Obsidian / second brain (practical capstone material)
- Noah Vincent substack: vault + CLAUDE.md (identity/projects/architecture/rules, per-folder) + memory.md session log; `npm i -g @anthropic-ai/claude-code`, "Read my vault and write a CLAUDE.md"; skills as SOPs (/voicenotetoletter); subagents scan vault before writing; MCP: Things3, Tana; ~€20/mo total. LIFE OS template.
- arscontexta (github.com/agenticnotetaking/arscontexta): 6 Rs pipeline (Record→Reduce→Reflect→Reweave→Verify→Rethink), fresh-context subagent per phase, schema-enforced write hooks, three-space vault (self/notes/ops).
- Atenov: run agent IN the vault; Obsidian CLI for link/backlink graph traversal.
- Corey Ganim: raw/ wiki/ outputs/ + "you NEVER organize raw/".

## SOURCE VERDICTS
- **Dead/unverifiable (drop):** ~25 links (aggregator accounts, X Articles behind login, deleted posts) — substitutes identified above where the author had value.
- **Off-topic (drop):** Codie Sanchez self-help, Tim Denning, Matt Gray, xaviergrowths, most "business" batch, generic prompt listicles (aipandax).
- **Dated (teach only as history):** EXM7777 30-day roadmap (pre-skills-era but sequencing logic sound), Claude Code 2.0 reaction videos, role-prompt listicles, LangChain/CrewAI-centric roadmaps.
- **Keepers (5/5):** Cherny threads ×3, Thariq skill tips, everything-claude-code, systematicls, Runkle harness, mfpiccolo harness, WTF-is-a-Loop, planning-with-files, filesystem-as-state, LLM Council, Bloch 10am, Noah Vincent Obsidian, hesamation memory teardown, emilkowalski skills, om_patel5 UI, Karpathy talks ×2, Ponytail, Anthropic docs/courses/engineering posts, landscape report (local/RAG/FT/tokens/SDLC).
