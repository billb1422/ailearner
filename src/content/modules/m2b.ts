import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m2-l6 — Agent Teams & Dynamic Workflows (Day 11)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l6',
    title: 'Agent Teams & Dynamic Workflows',
    day: 11,
    minutes: 45,
    xp: 100,
    objectives: [
      'Stand up a Claude Code agent team (lead + 3-5 teammates) with a shared task list and plan approval',
      'Design task dependencies so teammates self-claim work without colliding on the same files',
      'Trigger a dynamic workflow with ultracode and pick the right pattern for the job',
      'Decide between teams, subagents, and dynamic workflows using a concrete decision table',
    ],
    skipQuiz: [
      {
        q: 'How do you enable agent teams in Claude Code (July 2026)?',
        options: [
          'Run /teams enable inside a session',
          'Set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 before launching claude',
          'Install the agent-teams plugin from the official marketplace',
          'Pass --teams=3 on the claude command line',
        ],
        answer: 1,
        explain:
          'Teams are still experimental and gated behind the CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 environment variable.',
      },
      {
        q: 'In an agent team, how does work get distributed to teammates?',
        options: [
          'The team lead assigns each task round-robin as teammates finish',
          'Teammates self-claim unblocked tasks from a shared task list with dependencies',
          'Each teammate is bound to one directory at team creation and only works there',
          'The user manually drags tasks to teammates in the task panel',
        ],
        answer: 1,
        explain:
          'The lead maintains a shared task list with dependencies; teammates pull unblocked tasks themselves rather than waiting for assignment.',
      },
      {
        q: 'Which hook pair is designed to act as quality gates for agent teams?',
        options: [
          'PreToolUse and PostToolUse',
          'SessionStart and Stop',
          'TeammateIdle and TaskCompleted',
          'PlanApproved and MailboxMessage',
        ],
        answer: 2,
        explain:
          'TeammateIdle fires when a teammate runs out of claimable work; TaskCompleted lets you run checks (lint, tests) before a task counts as done.',
      },
      {
        q: 'What does the ultracode keyword do?',
        options: [
          'Forces maximum extended thinking on the current prompt',
          'Spawns the largest allowed team of teammates for the task',
          'Tells Claude to write and execute its own multi-agent harness as JS for this task',
          'Switches the session to the most capable available model',
        ],
        answer: 2,
        explain:
          'ultracode triggers a dynamic workflow: Claude authors an executable JS orchestration script — its own disposable harness — and runs it.',
      },
      {
        q: 'How does token spend scale as you add teammates to a team?',
        options: [
          'Roughly linearly — each teammate carries its own full context',
          'Sub-linearly — teammates share the lead’s context window',
          'Quadratically — every teammate reads every mailbox message',
          'It is flat — teams are billed per task, not per context',
        ],
        answer: 0,
        explain:
          'Each teammate is an independent context, so cost grows roughly linearly per teammate. Five teammates is around five sessions of spend.',
      },
    ],
    sections: [
      {
        heading: 'When one context stops scaling',
        blocks: [
          {
            type: 'text',
            md: 'You already use subagents: fire-and-forget workers that return one report and die. That is RPC. Agent teams are peers. Each teammate keeps an **independent context**, works for hours, and coordinates through a **shared task list** and **inter-agent mailboxes**. The unlock is horizontal: a codebase review that took one context 4 compaction cycles becomes 3 teammates each holding one slice in full fidelity.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The mental shift',
            md: 'Subagent = function call. Teammate = colleague. You stop writing prompts and start writing **org charts**: who owns what, what blocks what, and what "done" means for each task.',
          },
        ],
      },
      {
        heading: 'Anatomy of a team',
        blocks: [
          {
            type: 'code',
            lang: 'bash',
            code: `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
# then prompt the lead:
# "Create a team of 3 reviewers. Split src/ by area:
#  api/, ui/, infra/. Require plan approval before
#  any teammate edits a file."`,
            caption: 'Teams are experimental — opt in via env var, then talk to the lead.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="360" fill="#18181b" rx="8"/>
  <rect x="40" y="30" width="150" height="60" fill="#27272a" stroke="#38bdf8" rx="6"/>
  <text x="115" y="55" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Team Lead</text>
  <text x="115" y="75" fill="#a1a1aa" font-size="11" text-anchor="middle">plans + approves</text>
  <rect x="270" y="24" width="200" height="122" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="370" y="45" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Shared task list</text>
  <rect x="285" y="56" width="170" height="22" fill="#18181b" stroke="#34d399" rx="4"/>
  <text x="295" y="71" fill="#e4e4e7" font-size="11">T1 review api/  [claimed: A]</text>
  <rect x="285" y="84" width="170" height="22" fill="#18181b" stroke="#34d399" rx="4"/>
  <text x="295" y="99" fill="#e4e4e7" font-size="11">T2 review ui/   [claimed: B]</text>
  <rect x="285" y="112" width="170" height="22" fill="#18181b" stroke="#fbbf24" rx="4"/>
  <text x="295" y="127" fill="#e4e4e7" font-size="11">T3 synthesis  [blocked: T1,T2]</text>
  <rect x="510" y="30" width="150" height="60" fill="#27272a" stroke="#a78bfa" rx="6"/>
  <text x="585" y="55" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Quality gates</text>
  <text x="585" y="75" fill="#a1a1aa" font-size="10" text-anchor="middle">TeammateIdle / TaskCompleted</text>
  <line x1="190" y1="60" x2="268" y2="60" stroke="#38bdf8" stroke-width="2"/>
  <line x1="470" y1="60" x2="508" y2="60" stroke="#a78bfa" stroke-width="2" stroke-dasharray="4 3"/>
  <rect x="60" y="250" width="150" height="70" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="135" y="278" fill="#e4e4e7" font-size="13" text-anchor="middle">Teammate A</text>
  <text x="135" y="298" fill="#a1a1aa" font-size="10" text-anchor="middle">own context</text>
  <rect x="280" y="250" width="150" height="70" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="355" y="278" fill="#e4e4e7" font-size="13" text-anchor="middle">Teammate B</text>
  <text x="355" y="298" fill="#a1a1aa" font-size="10" text-anchor="middle">own context</text>
  <rect x="500" y="250" width="150" height="70" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="575" y="278" fill="#e4e4e7" font-size="13" text-anchor="middle">Teammate C</text>
  <text x="575" y="298" fill="#a1a1aa" font-size="10" text-anchor="middle">own context</text>
  <line x1="135" y1="248" x2="330" y2="150" stroke="#34d399" stroke-width="2"/>
  <line x1="355" y1="248" x2="365" y2="150" stroke="#34d399" stroke-width="2"/>
  <line x1="575" y1="248" x2="420" y2="150" stroke="#34d399" stroke-width="2"/>
  <text x="200" y="185" fill="#34d399" font-size="11">self-claim</text>
  <line x1="212" y1="285" x2="278" y2="285" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 3"/>
  <line x1="432" y1="285" x2="498" y2="285" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="355" y="345" fill="#f472b6" font-size="11" text-anchor="middle">mailboxes: direct teammate-to-teammate messages</text>
</svg>`,
            caption:
              'A team: lead plans and approves, teammates self-claim from a shared dependency-aware task list, mailboxes carry peer messages, hooks gate quality.',
          },
          {
            type: 'text',
            md: 'Two control surfaces matter. **Plan approval**: the lead reviews each teammate’s plan before it touches files — your architectural checkpoint. **Quality-gate hooks**: wire `TaskCompleted` to run lint/tests so "done" is verified, not claimed, and `TeammateIdle` to feed the next task or shut the teammate down. Start with **3-5 teammates**. Below 3, coordination overhead beats the win; above 5, you are managing, not shipping.',
          },
        ],
      },
      {
        heading: 'Failure modes and the token bill',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Good team shapes',
              items: [
                'Parallel review: 3 teammates, 3 disjoint directories',
                'Task list with explicit dependencies (synthesis blocked on reviews)',
                'Each task names its owned files up front',
                'TaskCompleted hook runs the linter before "done"',
              ],
            },
            right: {
              title: 'Anti-patterns',
              items: [
                'Sequential work: T2 needs T1, T3 needs T2 — a team that is secretly a queue',
                'Two teammates editing the same file — merge chaos, no locking saves you',
                'Vague tasks that overlap ("improve quality")',
                'Spawning 8 teammates for a 20-minute job',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Linear burn',
            md: 'Tokens scale **linearly per teammate** — each carries a full independent context. A 5-teammate team is ~5x a solo session. If the work is inherently sequential, you pay 5x to go the same speed. Parallelism is the only thing that pays the bill.',
          },
        ],
      },
      {
        heading: 'Dynamic workflows: Claude writes the harness',
        blocks: [
          {
            type: 'text',
            md: 'Dynamic workflows went **GA in June 2026**: say `ultracode` and Claude authors its own multi-agent harness as **executable JS**, then runs it. Instead of you picking teams-vs-subagents, the model writes a disposable orchestration script — spawn agents, wire outputs, loop until a check passes. It exists because unattended models exhibit **agentic laziness** (stops early), **self-preferential bias** (approves its own work), and **goal drift** (forgets the brief). Code-shaped orchestration makes the checks external and mechanical.',
          },
          {
            type: 'table',
            headers: ['Pattern', 'Shape', 'Reach for it when'],
            rows: [
              [
                'Fan-out + synthesize',
                'N parallel workers, one merger',
                'Research or review across independent slices',
              ],
              [
                'Adversarial verification',
                'Builder vs skeptic with penalties',
                'Self-preferential bias: work that "passes" its own review',
              ],
              [
                'Tournament',
                'N candidates, judged bracket',
                'Design or naming decisions where variance beats iteration',
              ],
              [
                'Loop-until-done',
                'Act, check real criteria, repeat',
                'Agentic laziness: task declared done but tests still red',
              ],
            ],
          },
        ],
      },
      {
        heading: 'Teams vs subagents vs workflows',
        blocks: [
          {
            type: 'table',
            headers: ['', 'Subagents', 'Agent teams', 'Dynamic workflows'],
            rows: [
              ['Lifespan', 'One task, then gone', 'Hours, persistent peers', 'One script run'],
              ['Coordination', 'Report back to caller', 'Task list + mailboxes', 'JS data flow you can read'],
              ['You control', 'The prompt', 'The org chart + gates', 'Almost nothing — Claude writes it'],
              ['Cost profile', 'Cheap, isolated', 'Linear per teammate', 'Varies by generated pattern'],
              ['Best for', 'Fan-out reads, research', 'Long parallel builds/reviews', 'Novel one-off orchestration'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Default order of escalation: subagents first (cheapest), team when work is parallel **and** long-lived, `ultracode` when the orchestration shape is unusual enough that scripting it yourself is the bottleneck.',
          },
        ],
      },
    ],
    lab: {
      title: 'Parallel review, two ways',
      intro:
        'Run a real multi-agent job on a repo you actually care about. Pick ONE path — a 3-teammate team review or an ultracode workflow — and measure it.',
      steps: [
        'Pick a real repo with at least 3 distinct areas (e.g. api/, ui/, infra/). Note its size.',
        'Team path: run `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` then `claude`, and ask the lead for a 3-teammate review split by area, with plan approval required.',
        'Watch the shared task list: confirm teammates self-claim tasks and that no two tasks touch the same files. Fix the task split if they do.',
        'Add (or sketch) a `TaskCompleted` hook that runs your linter, so a review task cannot complete with broken examples.',
        'Workflow path (alternative): in a normal session, prompt `ultracode: fan out 3 reviewers across api/, ui/, infra/, then synthesize one prioritized findings report` and read the JS harness Claude writes before approving it.',
        'Collect the merged findings into REVIEW.md and check `/cost` for total spend.',
        'Compare: same review as a single solo session — estimate how many compactions it would have needed.',
      ],
      checklist: [
        'Team or workflow ran with 3 parallel workers on disjoint slices',
        'Task dependencies were explicit (synthesis blocked on reviews)',
        'No two workers edited or reviewed the same file',
        'A quality gate (hook or scripted check) ran before "done"',
        'You recorded total token spend and compared it to a solo-session estimate',
      ],
    },
    checkQuiz: [
      {
        q: 'Your team has tasks T1→T2→T3, each blocked on the previous one. What is wrong?',
        options: [
          'Nothing — dependencies are exactly what the task list is for',
          'It is sequential work: you pay linear per-teammate cost for zero parallelism',
          'Blocked tasks crash teammates that try to claim them',
          'The lead cannot approve plans for dependent tasks',
        ],
        answer: 1,
        explain:
          'A fully sequential chain is the canonical team anti-pattern: multiple full contexts burning tokens while effectively one agent works at a time.',
      },
      {
        q: 'An agent keeps approving its own sloppy output. Which dynamic-workflow pattern targets this directly?',
        options: [
          'Fan-out + synthesize',
          'Tournament',
          'Adversarial verification',
          'Loop-until-done',
        ],
        answer: 2,
        explain:
          'Adversarial verification pits a builder against a separate skeptic, attacking self-preferential bias with an agent whose incentive is to find faults.',
      },
      {
        q: 'You need 6 directories summarized once, with only a merged summary back. Best tool?',
        options: [
          'An agent team of 6 teammates with mailboxes',
          'Parallel subagents — fire-and-forget workers returning reports',
          'ultracode tournament across the directories',
          'One session reading all 6 directories with compaction',
        ],
        answer: 1,
        explain:
          'One-shot fan-out with no peer coordination is exactly what subagents are for; a team adds persistent contexts and coordination you would never use.',
      },
      {
        q: 'Who reviews and approves a teammate’s plan before it edits files?',
        options: [
          'The user, via a permission prompt per file',
          'The team lead',
          'A randomly selected peer teammate via mailbox',
          'No one — plans are advisory in teams',
        ],
        answer: 1,
        explain:
          'Plan approval is the lead’s job — it is the architectural checkpoint that keeps teammates aligned before edits happen.',
      },
    ],
    resources: [
      {
        label: 'Claude Code docs — Agent teams (experimental)',
        url: 'https://code.claude.com/docs/en/agent-teams',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs — Dynamic workflows & ultracode',
        url: 'https://code.claude.com/docs/en/dynamic-workflows',
        kind: 'docs',
      },
      {
        label: 'Anthropic — Building Effective Agents (workflows vs agents)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'everything-claude-code — dense config reference incl. teams',
        url: 'https://github.com/affaanmustafa/everything-claude-code',
        kind: 'repo',
      },
      {
        label: 'Anthropic — Effective Context Engineering for AI Agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l7 — Agent Memory & State (Day 12)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l7',
    title: 'Agent Memory & State',
    day: 12,
    minutes: 40,
    xp: 100,
    objectives: [
      'Explain the filesystem-as-state doctrine and why plain markdown beats databases for agent working memory',
      'Install and use the planning-with-files pattern (task_plan.md, findings.md, progress.md) to kill plan drift',
      'Wire a NOTES.md / LESSONS.md self-improvement loop into a real project',
      'Place buffers, vector stores, knowledge graphs, and MemGPT-style systems on one map — and know what Claude Code auto-memory does and does not cover',
    ],
    skipQuiz: [
      {
        q: 'Which three files does the planning-with-files skill maintain?',
        options: [
          'PLAN.md, TODO.md, DONE.md',
          'task_plan.md, findings.md, progress.md',
          'SPEC.md, DESIGN.md, CHANGELOG.md',
          'task_plan.md, context.md, memory.md',
        ],
        answer: 1,
        explain:
          'planning-with-files keeps a task_plan.md (the plan), findings.md (what was learned), and progress.md (what happened) — and re-reads them throughout.',
      },
      {
        q: 'Why does plain-markdown state beat a database for an agent’s working memory?',
        options: [
          'Markdown parses faster than SQL for language models',
          'It is legible to both humans and models, diffable, and survives context resets with zero infrastructure',
          'Databases cannot store unstructured text reliably',
          'Filesystems have lower latency than any database',
        ],
        answer: 1,
        explain:
          'The point is legibility and durability: any model or human can read, grep, and diff the state, and it persists across sessions for free.',
      },
      {
        q: 'In the structured note-taking loop, when does the agent update LESSONS.md?',
        options: [
          'At session start, seeding context',
          'Only when the user explicitly asks for a retro',
          'After every fix — appending the rule that would have prevented the bug',
          'On a nightly consolidation cron',
        ],
        answer: 2,
        explain:
          'The self-improvement loop is per-fix: each resolved mistake becomes a written rule the agent re-reads next time, compounding across sessions.',
      },
      {
        q: 'What is the key retrieval limitation of Claude Code’s auto-memory?',
        options: [
          'It only persists for 30 days',
          'Retrieval is keyword-only — no embeddings, so paraphrased queries miss stored facts',
          'It stores memory in the system prompt, eating the attention budget',
          'It cannot store more than one topic file per project',
        ],
        answer: 1,
        explain:
          'Auto-memory indexes topic files but matches by keywords, not semantics — the exact gap that vector/semantic add-ons fill.',
      },
      {
        q: 'You need "what did we decide about auth, and when did that change?" Which memory technique fits best?',
        options: [
          'A conversation buffer with a large window',
          'A vector store over meeting transcripts',
          'A temporal knowledge graph (Zep / Graphiti style)',
          'A NOTES.md file per session',
        ],
        answer: 2,
        explain:
          'Temporal knowledge graphs model entities, relations, and validity over time — decisions that change are exactly their sweet spot.',
      },
    ],
    sections: [
      {
        heading: 'Your company is a filesystem',
        blocks: [
          {
            type: 'callout',
            variant: 'quote',
            title: 'Eli Mernit — "Your Company is a Filesystem"',
            md: 'Strip an agent to its essentials and two parts remain: the **filesystem as state**, and the **model as orchestrator**. Everything else — queues, DBs, dashboards — is accessory.',
          },
          {
            type: 'text',
            md: 'This is why OpenClaw works: its entire operational context — identity, tasks, history, lessons — is a folder of markdown files the model reads and rewrites. No memory service, no vector DB. The model is stateless between turns; the **directory is the agent**. For an architect this should feel familiar: it is event sourcing with `git log` as the event store and markdown as the projection.',
          },
        ],
      },
      {
        heading: 'Planning with files: the anti-drift pattern',
        blocks: [
          {
            type: 'text',
            md: 'Long tasks drift: by turn 40 the agent is optimizing something you never asked for. The fix is embarrassingly simple — externalize the plan and force re-reads. Install it: `npx skills add othmanadi/planning-with-files`. The agent writes the plan **before** acting, logs findings as it learns, checks off progress as it goes — and because it re-reads all three files throughout, **plan drift becomes almost nonexistent**. The plan lives in fresh tokens every turn instead of decaying attention.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <rect x="50" y="110" width="170" height="90" fill="#27272a" stroke="#38bdf8" rx="6"/>
  <text x="135" y="148" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Model</text>
  <text x="135" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">stateless orchestrator</text>
  <rect x="430" y="30" width="220" height="66" fill="#27272a" stroke="#a78bfa" rx="6"/>
  <text x="540" y="56" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">task_plan.md</text>
  <text x="540" y="76" fill="#a1a1aa" font-size="11" text-anchor="middle">the plan — written first</text>
  <rect x="430" y="126" width="220" height="66" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="540" y="152" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">findings.md</text>
  <text x="540" y="172" fill="#a1a1aa" font-size="11" text-anchor="middle">what was learned</text>
  <rect x="430" y="222" width="220" height="66" fill="#27272a" stroke="#fbbf24" rx="6"/>
  <text x="540" y="248" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">progress.md</text>
  <text x="540" y="268" fill="#a1a1aa" font-size="11" text-anchor="middle">what actually happened</text>
  <line x1="222" y1="130" x2="428" y2="66" stroke="#a78bfa" stroke-width="2"/>
  <line x1="222" y1="155" x2="428" y2="158" stroke="#34d399" stroke-width="2"/>
  <line x1="222" y1="182" x2="428" y2="252" stroke="#fbbf24" stroke-width="2"/>
  <text x="318" y="90" fill="#a1a1aa" font-size="11">re-read every turn</text>
  <text x="318" y="145" fill="#a1a1aa" font-size="11">append as it learns</text>
  <text x="318" y="235" fill="#a1a1aa" font-size="11">check off as it ships</text>
  <text x="135" y="245" fill="#f472b6" font-size="12" text-anchor="middle">context resets?</text>
  <text x="135" y="263" fill="#f472b6" font-size="12" text-anchor="middle">files survive.</text>
</svg>`,
            caption:
              'Filesystem-as-state: the plan lives on disk, not in decaying attention. A fresh session re-reads the files and resumes exactly where the last one died.',
          },
          {
            type: 'table',
            headers: ['File', 'Owns', 'Failure it prevents'],
            rows: [
              ['task_plan.md', 'Goal, steps, current step marker', 'Goal drift, re-planning from scratch'],
              ['findings.md', 'Discoveries, constraints, dead ends', 'Re-investigating what it already learned'],
              ['progress.md', 'What was done, what is verified', 'Claiming done without evidence; lost work on /clear'],
            ],
          },
        ],
      },
      {
        heading: 'The self-improvement loop: NOTES.md and LESSONS.md',
        blocks: [
          {
            type: 'text',
            md: 'Planning files handle one task. **LESSONS.md** compounds across tasks: after every fix, the agent appends the rule that would have prevented the bug — "our ORM silently truncates strings over 255 chars; always check schema first." NOTES.md holds session-scoped observations; LESSONS.md holds durable rules. Same pattern as the Senior Engineer OS doctrine: the last step of every debug protocol is *update LESSONS.md*. Six weeks in, the agent stops repeating its greatest hits of failure.',
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Make it mechanical, not aspirational: add one line to CLAUDE.md — "after fixing any bug, append the prevention rule to LESSONS.md" — and verify it happened in review. Unwritten lessons do not exist.',
          },
        ],
      },
      {
        heading: 'The memory-techniques landscape',
        blocks: [
          {
            type: 'text',
            md: 'Files are the 80% answer, but know the whole map. Nir Diamant’s **Agent_Memory_Techniques** repo walks it in ~30 runnable notebooks — worth an afternoon when you outgrow markdown.',
          },
          {
            type: 'table',
            headers: ['Technique', 'What it is', 'Reach for it when'],
            rows: [
              ['Conversation buffers', 'Keep last N turns verbatim', 'Short sessions; the default you already have'],
              ['Vector stores', 'Embed + similarity search over past content', 'Recall by meaning across large history'],
              ['Knowledge graphs', 'Entities + relations, queryable', 'Multi-hop questions across facts'],
              ['MemGPT pattern', 'Model pages its own memory tiers in/out of context', 'Long-lived agents that must self-manage'],
              ['Mem0 / Letta / Zep / Graphiti', 'Managed memory layers (Zep/Graphiti add time)', 'Production memory without building it yourself'],
              ['Plain files (this lesson)', 'Markdown state the model reads/writes', 'Almost everything else — start here'],
            ],
          },
        ],
      },
      {
        heading: 'Auto-memory: a shipped worked example',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code ships this doctrine: auto-memory keeps `~/.claude/projects/<proj>/memory/MEMORY.md` as an index plus topic files, written and consolidated by the model itself. It is filesystem-as-state in production. But note the ceiling: retrieval is **keyword-only** — no embeddings. Ask about "login flow" when the memory says "auth pipeline" and it whiffs. That gap is exactly where the vector-store row of the table above earns its complexity.',
          },
          {
            type: 'callout',
            variant: 'insight',
            md: 'Architecture takeaway: memory is a **retrieval problem wearing a storage costume**. Storing is trivial — files win. The technique ladder above is really a ladder of retrieval sophistication: keywords → embeddings → graph traversal → time-aware graphs.',
          },
        ],
      },
    ],
    lab: {
      title: 'Watch drift disappear',
      intro:
        'Take a real multi-step task you would normally babysit and run it with planning files. The point is to observe the re-read behavior, not just install a skill.',
      steps: [
        'Install the skill: `npx skills add othmanadi/planning-with-files` — or hand-roll it by telling Claude to create task_plan.md, findings.md, and progress.md before doing anything.',
        'Pick a real 30-60 minute task in one of your repos (a refactor or a feature with 5+ steps).',
        'Start the task and confirm task_plan.md exists with numbered steps BEFORE any code is edited.',
        'Mid-task, run /clear (or kill the session) — then start fresh and say "resume the task in task_plan.md".',
        'Verify the fresh session picks up at the correct step using progress.md, without re-doing finished work.',
        'When one step hits a surprise, check that findings.md records it and the plan was amended rather than abandoned.',
        'Add a LESSONS.md and instruct: after any fix, append the prevention rule. Confirm at least one entry lands.',
      ],
      checklist: [
        'task_plan.md was written before the first edit',
        'A killed session resumed at the right step from files alone',
        'findings.md captured at least one discovery you did not prompt for',
        'progress.md distinguishes done from verified',
        'LESSONS.md has at least one rule written by the agent itself',
      ],
    },
    checkQuiz: [
      {
        q: 'Per Mernit’s reduction, an agent is essentially which two parts?',
        options: [
          'A vector store plus a scheduler',
          'Filesystem as state plus model as orchestrator',
          'A prompt plus a tool registry',
          'A knowledge graph plus an event loop',
        ],
        answer: 1,
        explain:
          'The doctrine strips agents to durable file state and a stateless model that reads and rewrites it — everything else is accessory.',
      },
      {
        q: 'Mechanically, why does planning-with-files nearly eliminate plan drift?',
        options: [
          'It pins the plan into the system prompt permanently',
          'The agent re-reads the plan files throughout, so the plan occupies fresh tokens instead of decaying attention',
          'It blocks any tool call that deviates from the plan',
          'It compresses the plan into embeddings the model recalls exactly',
        ],
        answer: 1,
        explain:
          'Drift is an attention-decay problem; repeatedly re-reading the externalized plan keeps it in recent, high-weight context every turn.',
      },
      {
        q: 'What is the one-line install for the planning-with-files skill?',
        options: [
          'claude plugin install planning-with-files',
          'npx skills add othmanadi/planning-with-files',
          'npm i -g @othmanadi/planning-with-files',
          '/skills add planning-with-files',
        ],
        answer: 1,
        explain:
          'Skills distribute via the npx skills CLI against the author’s repo: npx skills add othmanadi/planning-with-files.',
      },
      {
        q: 'What is the core idea of the MemGPT pattern?',
        options: [
          'Store every conversation turn in a graph database',
          'Fine-tune the model on its own transcripts nightly',
          'The model manages its own memory tiers, paging data between context and external storage like an OS',
          'Replace the context window with an infinite scratchpad file',
        ],
        answer: 2,
        explain:
          'MemGPT treats the context window as RAM and external stores as disk, with the model itself issuing the page-in/page-out operations.',
      },
    ],
    resources: [
      {
        label: 'planning-with-files skill (othmanadi)',
        url: 'https://github.com/othmanadi/planning-with-files',
        kind: 'repo',
      },
      {
        label: 'Agent_Memory_Techniques — 30 notebooks (Nir Diamant)',
        url: 'https://github.com/NirDiamant/Agent_Memory_Techniques',
        kind: 'repo',
      },
      {
        label: 'Claude Code docs — Memory (CLAUDE.md, rules, auto memory)',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Letta (MemGPT lineage) — self-managed agent memory',
        url: 'https://github.com/letta-ai/letta',
        kind: 'repo',
      },
      {
        label: 'Graphiti — temporal knowledge graphs for agents (Zep)',
        url: 'https://github.com/getzep/graphiti',
        kind: 'repo',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l8 — Building With the Agent SDK (Day 12)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l8',
    title: 'Building With the Agent SDK',
    day: 12,
    minutes: 50,
    xp: 100,
    objectives: [
      'Decide when to graduate from interactive Claude Code to the Agent SDK, raw API, or Managed Agents',
      'Write a working TypeScript Agent SDK script using query() with tools, hooks, and settingSources',
      'Run Claude Code headless (claude -p, JSON output) inside CI and scripts',
      'Extract the harness-design lessons from Autoresearch, CRISPY, and Paperclip and apply them to your own loops',
    ],
    skipQuiz: [
      {
        q: 'What does query() in the Agent SDK return?',
        options: [
          'A promise resolving to the final answer string',
          'An async iterator that streams messages (tool use, text, result) as the agent works',
          'A callback-registered event emitter',
          'A handle to a running Claude Code TUI session',
        ],
        answer: 1,
        explain:
          'query(prompt, options) yields an async iterator — you for-await over messages and react to each as the agentic loop runs.',
      },
      {
        q: 'What does the settingSources option control?',
        options: [
          'Which environment variables the SDK may read',
          'Which filesystem configuration (project CLAUDE.md, skills, user settings) the SDK loads into the agent',
          'The priority order of MCP servers',
          'Where the SDK writes its session transcripts',
        ],
        answer: 1,
        explain:
          'settingSources decides whether your programmatic agent inherits filesystem config like project CLAUDE.md and skills — by default you opt in explicitly.',
      },
      {
        q: 'How do you run Claude Code non-interactively in CI with machine-readable output?',
        options: [
          'claude --ci --json',
          'claude -p "your prompt" --output-format json',
          'claude run --headless',
          'npx claude-agent-sdk exec',
        ],
        answer: 1,
        explain:
          'Headless mode is claude -p (print) with --output-format json — the zero-code way to script Claude Code in pipelines.',
      },
      {
        q: 'In Karpathy’s Autoresearch, why is prepare.py locked (not editable by the agent)?',
        options: [
          'It contains credentials the agent must not read',
          'It holds the evaluation — an editable eval invites reward hacking, so locking it closes that loophole',
          'Editing it would break the git-revert loop',
          'It is generated code that regenerates on every run',
        ],
        answer: 1,
        explain:
          'The agent may only edit train.py; the eval in prepare.py is frozen so the only way to improve val_bpb is genuinely better training code.',
      },
      {
        q: 'In CRISPY, why does the Reviewer run on a different model than the Coder?',
        options: [
          'The reviewer model is cheaper per token',
          'To dodge self-preferential bias — a model grades its own style too kindly',
          'Different models are required for parallel execution',
          'The Coder model cannot output review comments',
        ],
        answer: 1,
        explain:
          'Cross-model review is CRISPY’s adversarial trick: a different model has no loyalty to the Coder’s choices and catches what it would excuse in itself.',
      },
    ],
    sections: [
      {
        heading: 'When to graduate from Claude Code',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code is a harness you rent. The Agent SDK is the same engine — the loop, tools, permissions, context management — exposed as a library: `@anthropic-ai/claude-agent-sdk` (TS) or `claude-agent-sdk` (Python). Graduate when the agent must run **inside something**: your product, a service, a scheduled job, multi-tenant infra. Stay in Claude Code while a human (you) is the orchestrator.',
          },
          {
            type: 'table',
            headers: ['', 'Claude Code (CLI)', 'Agent SDK', 'Raw Messages API'],
            rows: [
              ['You get', 'Full interactive harness', 'The harness as a library', 'Model calls only — BYO loop'],
              ['Loop ownership', 'Anthropic’s, tuned', 'Anthropic’s, embeddable', 'Yours, all 15 harness jobs'],
              ['Best for', 'Dev work, you in the loop', 'Agents inside products/CI', 'Custom inference, thin wrappers'],
              ['Effort to first agent', 'Zero', 'An afternoon', 'Weeks to parity'],
              ['Escape hatch', 'claude -p in scripts', 'In-process hooks, custom tools', 'Total control'],
            ],
          },
        ],
      },
      {
        heading: 'The SDK surface',
        blocks: [
          {
            type: 'code',
            lang: 'typescript',
            code: `import { query } from '@anthropic-ai/claude-agent-sdk'

for await (const message of query({
  prompt: 'Find every TODO in src/ and rank them by risk',
  options: {
    allowedTools: ['Read', 'Grep', 'Glob'],
    maxTurns: 12,
    settingSources: ['project'], // load project CLAUDE.md + skills
  },
})) {
  if (message.type === 'result') {
    console.log(message.result)
  }
}`,
            caption:
              'The whole Claude Code loop in ~12 lines: query() streams messages while the agent reads, greps, and reasons.',
          },
          {
            type: 'text',
            md: 'Four extension points cover most designs. **AgentDefinition**: declare subagents programmatically instead of `.claude/agents/*.md`. **In-process hooks**: the same PreToolUse/Stop events, but as functions in your process — a Stop hook can literally run your test suite. **mcpServers**: hand the agent your own tools. **settingSources**: choose whether it inherits the project’s CLAUDE.md and skills, or runs hermetic. For CI without any SDK code: `claude -p "fix the failing test" --output-format json` and parse the result.',
          },
        ],
      },
      {
        heading: 'Managed Agents: prototype local, productionize hosted',
        blocks: [
          {
            type: 'text',
            md: '**Managed Agents** are the third leg: Anthropic hosts the runtime — sandboxed execution, credential vaults so your agent holds tokens you never ship, scaling you do not operate. The 2026 pattern is explicit: **prototype locally with the SDK, productionize hosted**. Same agent definition, different substrate. If your security review chokes on "the agent has prod credentials on a box we patch," this is the answer.',
          },
        ],
      },
      {
        heading: 'Case study: Autoresearch and reward-hacking closure',
        blocks: [
          {
            type: 'text',
            md: 'Karpathy’s Autoresearch is a masterclass in harness constraint. The agent improves a language model’s training run — but may **only edit train.py**. The eval in **prepare.py is locked**. The metric is one number, **val_bpb**. Every change is committed; if val_bpb regresses, the harness **git-reverts** automatically. A **simplicity criterion** breaks ties toward less code. Notice what the model is trusted with: nothing except the one file where genuine improvement can live.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <rect x="40" y="120" width="140" height="70" fill="#27272a" stroke="#38bdf8" rx="6"/>
  <text x="110" y="150" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Agent</text>
  <text x="110" y="170" fill="#a1a1aa" font-size="11" text-anchor="middle">proposes change</text>
  <rect x="240" y="40" width="160" height="64" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="320" y="66" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">train.py</text>
  <text x="320" y="86" fill="#34d399" font-size="11" text-anchor="middle">EDITABLE — only file</text>
  <rect x="240" y="226" width="160" height="64" fill="#27272a" stroke="#f472b6" rx="6"/>
  <text x="320" y="252" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">prepare.py (eval)</text>
  <text x="320" y="272" fill="#f472b6" font-size="11" text-anchor="middle">LOCKED — no reward hacking</text>
  <rect x="470" y="120" width="180" height="70" fill="#27272a" stroke="#fbbf24" rx="6"/>
  <text x="560" y="148" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">val_bpb check</text>
  <text x="560" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">one number decides</text>
  <line x1="182" y1="140" x2="238" y2="85" stroke="#34d399" stroke-width="2"/>
  <text x="185" y="100" fill="#a1a1aa" font-size="10">edit</text>
  <line x1="402" y1="72" x2="530" y2="118" stroke="#fbbf24" stroke-width="2"/>
  <text x="460" y="86" fill="#a1a1aa" font-size="10">run + eval</text>
  <line x1="470" y1="175" x2="402" y2="240" stroke="#52525b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="460" y="215" fill="#a1a1aa" font-size="10">scored by</text>
  <line x1="560" y1="192" x2="560" y2="300" stroke="#34d399" stroke-width="2"/>
  <text x="612" y="250" fill="#34d399" font-size="11">improved:</text>
  <text x="612" y="266" fill="#34d399" font-size="11">commit</text>
  <line x1="560" y1="300" x2="112" y2="300" stroke="#f472b6" stroke-width="2"/>
  <line x1="112" y1="300" x2="112" y2="192" stroke="#f472b6" stroke-width="2"/>
  <text x="300" y="318" fill="#f472b6" font-size="11" text-anchor="middle">regressed: git revert, try again (simplicity breaks ties)</text>
</svg>`,
            caption:
              'Autoresearch: a harness so constrained the only path to reward is real improvement. The eval is unreachable; regressions auto-revert.',
          },
        ],
      },
      {
        heading: 'Case studies: CRISPY and Paperclip',
        blocks: [
          {
            type: 'text',
            md: 'Tyler Folkman’s **CRISPY** cut a $200/mo agent bill to **$45/mo** with role separation — each role gets exactly the context its job needs, nothing more:',
          },
          {
            type: 'table',
            headers: ['Role', 'Job', 'Harness trick'],
            rows: [
              ['Architect', 'Decides what to build', 'Owns the spec; never writes code'],
              ['Scout', 'Locates relevant code', 'Runs with NO prior context — cheap, unbiased search'],
              ['Coder', 'Implements', 'TDD-first: failing test before code'],
              ['Reviewer', 'Critiques the diff', 'DIFFERENT model — kills self-preferential bias'],
              ['Verifier', 'Confirms done', 'Binary pass/fail against the spec'],
            ],
          },
          {
            type: 'text',
            md: 'Composio’s **Agent Orchestrator** runs a meta-harness driving Claude Code, Codex, and Cursor in parallel (40k LOC in 8 days). Its sibling **Paperclip** goes full org-chart: a CEO-agent hires engineer agents, with **heartbeats** (prove-you’re-alive checks) and **per-agent budgets**. The common thread across all three case studies: the interesting engineering is never the model call — it is **what the harness forbids**.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The harness-design lesson',
            md: 'Autoresearch forbids touching the eval. CRISPY forbids the Reviewer from sharing the Coder’s model. Paperclip forbids unbounded spend. Design your constraints first; the agent fills in the rest.',
          },
        ],
      },
    ],
    lab: {
      title: 'Your first 30-line SDK agent',
      intro:
        'Ship one tool-using query end-to-end with the TypeScript Agent SDK. Small on purpose — the goal is to feel where Claude Code ends and your code begins.',
      steps: [
        'Create a scratch project: `mkdir sdk-lab && cd sdk-lab && npm init -y && npm i @anthropic-ai/claude-agent-sdk`.',
        'Set "type": "module" in package.json and confirm your ANTHROPIC_API_KEY (or Claude Code auth) is available.',
        'Write agent.mjs: call query() with a prompt like "count the lines of code per language in this repo and summarize", allowedTools of Read/Glob/Grep/Bash, and maxTurns 10.',
        'for-await the messages: log tool-use message types as they stream, and print the final result message.',
        'Run it with `node agent.mjs` against a real repo and confirm it actually invoked tools (you saw tool-use messages).',
        'Add one in-process hook (e.g. PreToolUse that logs every Bash command) and re-run.',
        'Compare: run the same prompt via `claude -p "same prompt" --output-format json` and diff the ergonomics.',
      ],
      checklist: [
        'Script is ~30 lines and runs end-to-end with node',
        'You observed streamed tool-use messages, not just a final answer',
        'A hook you wrote fired during the run',
        'The headless claude -p equivalent produced parseable JSON',
        'You can say in one sentence when you would pick SDK over CLI for your own work',
      ],
    },
    checkQuiz: [
      {
        q: 'Which situation most clearly justifies moving from Claude Code CLI to the Agent SDK?',
        options: [
          'You want faster responses in interactive sessions',
          'Your agent must run inside your own service, multi-tenant, with programmatic hooks and custom tools',
          'You need more than 10 MCP servers',
          'You want to use a larger context window',
        ],
        answer: 1,
        explain:
          'The SDK exists for embedding the harness in your own software; interactive dev work stays in the CLI.',
      },
      {
        q: 'What do Managed Agents add over running the SDK on your own infrastructure?',
        options: [
          'Access to models unavailable through the API',
          'Anthropic-hosted sandboxed runtime plus credential vaults — prototype locally, productionize hosted',
          'A visual workflow builder for non-engineers',
          'Free inference for agents under 10 turns',
        ],
        answer: 1,
        explain:
          'Managed Agents move the runtime and secrets to Anthropic-operated sandboxes — same agent definition, production-grade substrate.',
      },
      {
        q: 'In Autoresearch, what happens when a change makes val_bpb worse?',
        options: [
          'The agent is prompted to explain the regression',
          'The harness git-reverts the change automatically and the loop continues',
          'The eval threshold is relaxed and the run continues',
          'The run halts for human review',
        ],
        answer: 1,
        explain:
          'Regression handling is mechanical: git revert, no negotiation — the loop only keeps changes that move the one metric.',
      },
      {
        q: 'Which CRISPY design choice is primarily a COST lever (part of the $200→$45/mo drop)?',
        options: [
          'The Verifier’s binary pass/fail',
          'The Scout running with no prior context — cheap searches instead of dragging full history into every call',
          'The Architect owning the spec',
          'The Coder writing failing tests first',
        ],
        answer: 1,
        explain:
          'Role-scoped context is the money saver: the Scout does high-volume search work with a near-empty context instead of the whole session transcript.',
      },
    ],
    resources: [
      {
        label: 'Agent SDK overview — official docs',
        url: 'https://code.claude.com/docs/en/sdk/sdk-overview',
        kind: 'docs',
      },
      {
        label: '@anthropic-ai/claude-agent-sdk (TypeScript)',
        url: 'https://github.com/anthropics/claude-agent-sdk-typescript',
        kind: 'repo',
      },
      {
        label: 'claude-agent-sdk (Python)',
        url: 'https://github.com/anthropics/claude-agent-sdk-python',
        kind: 'repo',
      },
      {
        label: 'Karpathy — Autoresearch (harness-constrained research agent)',
        url: 'https://github.com/karpathy/autoresearch',
        kind: 'repo',
      },
      {
        label: 'Tyler Folkman — CRISPY: 5-role agent pipeline',
        url: 'https://tylerfolkman.substack.com/p/crispy-agent-pipeline',
        kind: 'article',
      },
      {
        label: 'Composio — Agent Orchestrator & Paperclip',
        url: 'https://composio.dev/blog/agent-orchestrator',
        kind: 'article',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l9 — Cost-Aware Agents & Guardrails (Day 13)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l9',
    title: 'Cost-Aware Agents & Guardrails',
    day: 13,
    minutes: 45,
    xp: 100,
    objectives: [
      'Diagnose the cost drivers of a 24/7 agent (model choice, hosting, loop shape) before they bill you',
      'Install layered budget guardrails: max turns, spend caps, per-agent budgets, and hard stop conditions',
      'Apply the Ponytail laziest-senior-dev principle to cut code volume, cost, and latency in one move',
      'Audit any loop against the harness-responsibilities checklist and spot context bloat as a combined cost and quality tax',
    ],
    skipQuiz: [
      {
        q: 'What was the root cause of jordymaui’s $800/80-hour OpenClaw bill?',
        options: [
          'A prompt-injection attack that spawned extra agents',
          'Wrong model choices and wrong hosting for a 24/7 agent — the two costs that dominate',
          'Forgetting to enable prompt caching',
          'A misconfigured MCP server retrying in a tight loop',
        ],
        answer: 1,
        explain:
          'His post-mortem is blunt: for an always-on agent, model selection and hosting decisions dominate everything else — he got both wrong.',
      },
      {
        q: 'What operational habit did the OpenClaw post-mortem recommend before running a 24/7 agent?',
        options: [
          'Pre-load roughly $250 in credits so spend is bounded and visible up front',
          'Run the first week on the smallest available model',
          'Disable all tools except Read for the first 48 hours',
          'Route all traffic through a local model overnight',
        ],
        answer: 0,
        explain:
          'Pre-loading ~$250 in credits turns an unbounded liability into a bounded, observable budget — you find out about runaway loops at $250, not $800.',
      },
      {
        q: 'What impact did the Ponytail skill measure?',
        options: [
          'About 54% less code, ~20% cheaper, ~27% faster',
          'About 90% less code at double the latency',
          'About 20% less code, ~54% cheaper, ~27% slower',
          'No code reduction, but 40% fewer review comments',
        ],
        answer: 0,
        explain:
          'Ponytail’s measured wins: ~54% less generated code, ~20% lower cost, ~27% faster — over-engineering was the tax all along.',
      },
      {
        q: 'A loop that "bills you in your sleep" is missing what, specifically?',
        options: [
          'Prompt caching on the system prompt',
          'A stop condition — real completion criteria that terminate the loop',
          'A cheaper fallback model',
          'Subagent isolation for expensive steps',
        ],
        answer: 1,
        explain:
          'The phrase is about termination: without a genuine done-check, an agent loop happily re-prompts forever at your expense.',
      },
      {
        q: 'What is the layer order of Eric Siu’s Company Brain?',
        options: [
          'Permissions → capture → retrieval → feedback → source of truth',
          'Capture → retrieval → source of truth → permissions → feedback',
          'Retrieval → capture → feedback → permissions → source of truth',
          'Source of truth → capture → permissions → retrieval → feedback',
        ],
        answer: 1,
        explain:
          'Company Brain stacks capture, then retrieval, then a canonical source of truth, then permissions, then feedback — fronted by Slack, run by 90+ cron jobs.',
      },
    ],
    sections: [
      {
        heading: 'The $800 lesson',
        blocks: [
          {
            type: 'text',
            md: 'jordymaui ran an OpenClaw agent for 80 hours and got a **$800** bill — then wrote the post-mortem everyone should read before going 24/7. Root cause: **wrong models and wrong hosting**. Not prompts, not bugs. An always-on agent multiplies every per-turn choice by 8,760 hours a year, so the two standing decisions — which model answers by default, and where the loop runs — dominate total cost. His fixes: route by task difficulty, and **pre-load ~$250 in credits** so the worst case is bounded and visible.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The follow-up is worse',
            md: 'His sequel logged **500 hours and $5,000** across experiments. 24/7 agents are a subscription you write yourself. Price the loop before you start it, not after the invoice.',
          },
        ],
      },
      {
        heading: 'Guardrails that actually stop spend',
        blocks: [
          {
            type: 'text',
            md: 'One guardrail is a single point of failure. Layer them, cheapest-to-trip first. The theme from Cherny’s loop doctrine: a loop with no stop condition **"bills you in your sleep"** — so the stop condition is a guardrail, not a nicety.',
          },
          {
            type: 'table',
            headers: ['Layer', 'Mechanism', 'Catches'],
            rows: [
              ['Turn cap', 'maxTurns in SDK / --max-turns headless', 'Infinite retry-and-apologize loops'],
              ['Spend cap', 'Pre-loaded credits; per-run token budget', 'Model/hosting mistakes at $250, not $5,000'],
              ['Budget workers', 'llm-budget worker meters each call against an allowance', 'Slow leaks across many small calls'],
              ['Per-agent budgets', 'Paperclip-style: each hired agent gets its own wallet', 'One rogue agent draining the fleet'],
              ['Stop condition', 'Real done-check (tests green, artifact exists)', 'Loops that never terminate "successfully"'],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <rect x="30" y="110" width="130" height="80" fill="#27272a" stroke="#38bdf8" rx="6"/>
  <text x="95" y="145" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Agent loop</text>
  <text x="95" y="165" fill="#a1a1aa" font-size="11" text-anchor="middle">prompt → act → check</text>
  <rect x="205" y="110" width="100" height="80" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="255" y="142" fill="#e4e4e7" font-size="12" text-anchor="middle">Turn cap</text>
  <text x="255" y="162" fill="#a1a1aa" font-size="10" text-anchor="middle">max turns</text>
  <rect x="330" y="110" width="100" height="80" fill="#27272a" stroke="#fbbf24" rx="6"/>
  <text x="380" y="142" fill="#e4e4e7" font-size="12" text-anchor="middle">Spend cap</text>
  <text x="380" y="162" fill="#a1a1aa" font-size="10" text-anchor="middle">token budget</text>
  <rect x="455" y="110" width="100" height="80" fill="#27272a" stroke="#a78bfa" rx="6"/>
  <text x="505" y="142" fill="#e4e4e7" font-size="12" text-anchor="middle">Agent wallet</text>
  <text x="505" y="162" fill="#a1a1aa" font-size="10" text-anchor="middle">per-agent budget</text>
  <rect x="580" y="110" width="100" height="80" fill="#27272a" stroke="#f472b6" rx="6"/>
  <text x="630" y="142" fill="#e4e4e7" font-size="12" text-anchor="middle">Stop check</text>
  <text x="630" y="162" fill="#a1a1aa" font-size="10" text-anchor="middle">really done?</text>
  <line x1="162" y1="150" x2="203" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="307" y1="150" x2="328" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="432" y1="150" x2="453" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="557" y1="150" x2="578" y2="150" stroke="#52525b" stroke-width="2"/>
  <text x="350" y="50" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Every turn passes through every gate — cheapest trips first</text>
  <line x1="630" y1="192" x2="630" y2="240" stroke="#f472b6" stroke-width="2"/>
  <line x1="630" y1="240" x2="95" y2="240" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/>
  <line x1="95" y1="240" x2="95" y2="192" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="360" y="262" fill="#a1a1aa" font-size="11" text-anchor="middle">not done AND under every budget → loop again; otherwise halt</text>
</svg>`,
            caption:
              'Layered guardrails: a runaway loop must defeat the turn cap, the spend cap, its own wallet, and a real stop condition before it can bill you in your sleep.',
          },
        ],
      },
      {
        heading: 'Ponytail: the laziest senior dev',
        blocks: [
          {
            type: 'text',
            md: 'Cost is not only loop count — it is also **how much the agent writes**. The Ponytail skill (github.com/DietrichGebert/ponytail) encodes the **laziest-senior-dev principle**: the best engineer ships the smallest change that works. Its `/ponytail-review` pass produces **delete-lists** — code to remove, abstractions to collapse. Measured: **~54% less code, ~20% cheaper, ~27% faster**. Fewer output tokens, fewer files in future contexts, fewer bugs to loop on. One skill, three compounding wins.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The Ponytail test',
            md: 'Before accepting a diff, ask: would the laziest competent senior on your team have written this much? If not, run the delete-list first and pay for the smaller version.',
          },
        ],
      },
      {
        heading: 'Context bloat: a cost AND quality tax',
        blocks: [
          {
            type: 'text',
            md: 'Every enabled plugin, every MCP server, every CLAUDE.md line rides along on **every turn**. The cautionary artifact from the systematicls write-ups: a **26k-line CLAUDE.md** — paid for on each request while actively degrading attention (context rot). Bloat is the rare tax you pay twice: dollars now, quality always. The **harness-responsibilities checklist** (mfpiccolo’s 15 jobs: turn persistence, prompt assembly, tool policy, spend tracking, compaction...) doubles as an audit: walk it and ask what each loop carries per-turn, and who is watching spend.',
          },
          {
            type: 'compare',
            left: {
              title: 'Lean harness',
              items: [
                'CLAUDE.md under 200 lines, rules split into .claude/rules/ with path scoping',
                'Under 10 MCP servers enabled; tool search defers the rest',
                'Skills load via progressive disclosure — metadata until needed',
                'Spend tracking is a first-class harness job',
              ],
            },
            right: {
              title: 'Bloated harness',
              items: [
                '26k-line CLAUDE.md re-sent (and re-ignored) every turn',
                'Plugin sprawl: every marketplace install left enabled',
                'Every tool schema loaded up-front "just in case"',
                'Nobody owns the invoice until it arrives',
              ],
            },
          },
        ],
      },
      {
        heading: 'Org level: the Company Brain',
        blocks: [
          {
            type: 'text',
            md: 'Zoom out and guardrails become architecture. Eric Siu’s **Company Brain** runs a business on five layers: **capture → retrieval → source of truth → permissions → feedback** — with **90+ cron jobs** doing the work and **Slack as the front door**. Note where cost discipline lives: permissions bound what agents may touch, feedback catches drift, and every job is scheduled (bounded) rather than looping free. It is the same guardrail stack you built today, promoted to org policy.',
          },
        ],
      },
    ],
    lab: {
      title: 'Put a meter on your loop',
      intro:
        'Take the loop you built on day 10 and make it financially boring: add at least one hard guardrail and measure exactly what one run costs.',
      steps: [
        'Reopen your day-10 loop (the prompt → act → verify → re-prompt setup) and write down its current stop condition. If you cannot state one, that is finding #1.',
        'Add a turn cap: --max-turns on headless runs, or maxTurns if it lives in an SDK script.',
        'Add a real stop condition if missing: the loop exits only when a verifiable check passes (tests green, file exists, lint clean).',
        'Run the loop once on a real task and capture total token spend with /cost (or the usage block in claude -p --output-format json).',
        'Convert tokens to dollars using current pricing and compute a per-run cost. Estimate the monthly bill if this ran hourly, 24/7.',
        'Run /ponytail-review (or hand-prompt a delete-list pass) on the loop’s output and note the size reduction.',
        'Write a 3-line BUDGET.md for this loop: per-run cap, daily cap, and what happens when either trips.',
      ],
      checklist: [
        'The loop now has an explicit turn cap',
        'The stop condition is a verifiable check, not the model’s opinion',
        'You recorded actual token spend and a dollar figure for one run',
        'You projected the 24/7 monthly cost and sanity-checked it against your plan/credits',
        'BUDGET.md exists with per-run and daily caps',
      ],
    },
    checkQuiz: [
      {
        q: 'For a 24/7 agent, which two choices dominate total cost?',
        options: [
          'Prompt wording and temperature',
          'Model selection and hosting',
          'Context window size and output format',
          'Number of skills and MCP servers installed',
        ],
        answer: 1,
        explain:
          'Always-on agents multiply standing decisions by every hour of the year — the default model and where the loop runs swamp per-prompt tweaks.',
      },
      {
        q: 'Why is context bloat described as a DOUBLE tax?',
        options: [
          'It costs input tokens and output tokens equally',
          'You pay for the extra tokens every turn AND the noise degrades attention, hurting output quality',
          'It doubles the latency of every request',
          'Both the user and the API provider are billed for it',
        ],
        answer: 1,
        explain:
          'Bloat (plugin sprawl, a 26k-line CLAUDE.md) bills you per turn and simultaneously rots the context — cost now, quality always.',
      },
      {
        q: 'What does /ponytail-review actually produce?',
        options: [
          'A refactored version of your code with better naming',
          'Delete-lists: code and abstractions to remove, per the laziest-senior-dev principle',
          'A cost report broken down by file',
          'A senior-engineer style rubric score for the diff',
        ],
        answer: 1,
        explain:
          'Ponytail attacks over-engineering by listing what to delete — the mechanism behind its ~54% code / ~20% cost / ~27% time reductions.',
      },
      {
        q: 'How does the harness-responsibilities checklist function as a cost audit?',
        options: [
          'It ranks models by price-performance for your workload',
          'You walk its ~15 jobs (spend tracking, compaction, tool policy...) and ask which your loop actually implements — and who watches the meter',
          'It generates a monthly invoice forecast from your transcripts',
          'It disables any harness job that exceeds its token allowance',
        ],
        answer: 1,
        explain:
          'The checklist enumerates what a real harness must own; gaps like "no spend tracking" or "no compaction policy" are exactly where runaway bills hide.',
      },
    ],
    resources: [
      {
        label: 'Ponytail — anti-over-engineering skill',
        url: 'https://github.com/DietrichGebert/ponytail',
        kind: 'repo',
      },
      {
        label: 'jordymaui — the $800 OpenClaw post-mortem',
        url: 'https://x.com/jordymaui',
        kind: 'thread',
      },
      {
        label: 'mfpiccolo — How to Build Your Own Agent Harness (the 15 jobs)',
        url: 'https://iii.dev/blog/build-your-own-agent-harness',
        kind: 'article',
      },
      {
        label: 'iii-hq/workers — llm-budget style harness workers',
        url: 'https://github.com/iii-hq/workers',
        kind: 'repo',
      },
      {
        label: 'Eric Siu — the Company Brain architecture',
        url: 'https://x.com/ericosiu',
        kind: 'thread',
      },
      {
        label: 'Claude API pricing — price your loop before you run it',
        url: 'https://docs.claude.com/en/docs/about-claude/pricing',
        kind: 'docs',
      },
    ],
  },
]
