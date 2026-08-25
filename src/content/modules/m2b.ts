import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m2-l6 - Agent Teams & Dynamic Workflows (Day 11)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l6',
    title: 'Agent Teams & Dynamic Workflows',
    day: 11,
    minutes: 55,
    xp: 100,
    objectives: [
      'Stand up a Claude Code agent team (one team lead plus 3-5 teammates) with a shared task list and plan approval turned on',
      'Design task dependencies so teammates can claim work on their own without two agents touching the same files',
      'Kick off a dynamic workflow with the ultracode keyword and pick the right orchestration pattern for the job',
      'Choose between teams, subagents, and dynamic workflows using a plain decision table',
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
          'Agent teams are still experimental, so Anthropic gates them behind an environment variable (a setting you export in your terminal before starting a program). Run export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, then launch claude, and the team features switch on for that session.',
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
          'The team lead writes a shared task list where each task can declare dependencies (task C needs tasks A and B done first). Teammates watch that list and grab whichever unblocked task is free. Teammates pull work for themselves the moment they free up, which keeps everyone busy without the lead becoming a bottleneck.',
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
          'Hooks are small scripts Claude Code runs automatically when certain events fire. TeammateIdle fires when a teammate has nothing left to claim, so you can feed it more work or shut it down. TaskCompleted fires when a task is about to be marked done, so you can run lint or tests and reject the task if they fail.',
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
          'ultracode is a keyword you drop into a prompt. It tells Claude to write a small JavaScript program that coordinates other agents (spawning them, wiring their outputs together, looping until a check passes) and then execute that program. Claude builds its own throwaway coordination layer for the job.',
      },
      {
        q: 'How does token spend scale as you add teammates to a team?',
        options: [
          'Roughly linearly, because each teammate carries its own full context',
          'Sub-linearly, because teammates share the lead’s context window',
          'Quadratically, because every teammate reads every mailbox message',
          'Flat: teams are billed per task no matter how many contexts run',
        ],
        answer: 0,
        explain:
          'Each teammate is a full, separate Claude session with its own context window, so each one costs about what a solo session costs. Five teammates means roughly five sessions of token spend running at once. That math only pays off when the teammates genuinely work in parallel.',
      },
    ],
    sections: [
      {
        heading: 'When one context stops scaling',
        blocks: [
          {
            type: 'text',
            md: 'You already use subagents. You hand one a job, it goes off alone, comes back with a single report, and disappears. Software folks call that shape RPC (remote procedure call: send a request, get one answer back, done). Agent teams behave more like coworkers. Each teammate is a full Claude session with its own **independent context** (its own private working memory), and it can keep working for hours.\n\nTeammates coordinate through two shared channels. The **shared task list** is a to-do board that every teammate can read and update. **Mailboxes** let one teammate send a message directly to another, like a tiny internal email system.\n\nWhy does this matter? Scale. Picture a codebase review so large that a single session had to compact (compress and partly forget) its context 4 separate times to get through it. Hand the same review to 3 teammates, give each one a third of the codebase, and every slice now fits comfortably in one context with nothing forgotten.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The mental shift',
            md: 'A subagent behaves like a function call: input goes in, one result comes out. A teammate behaves like a colleague who sticks around all day. Once you have colleagues, your job shifts to drawing the **org chart**. Who owns which files? Which tasks block which? What does "done" mean for each one?',
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
            caption: 'Teams are experimental. Turn them on with the environment variable, then describe the team you want to the lead in plain English.',
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
            md: 'Two control surfaces give you real grip on a running team. The first is **plan approval**. Before a teammate touches any file, it writes a short plan and the lead reviews it. Think of it as an automatic design review that catches a teammate about to refactor the wrong module before any damage happens.\n\nThe second is **quality-gate hooks**. Wire the `TaskCompleted` hook to run your linter and tests, and a task can only be marked done when those checks actually pass. The hook verifies the work instead of trusting the teammate to grade itself. Wire `TeammateIdle` to hand an idle teammate the next task, or to shut it down so it stops burning tokens.\n\nHow big should a team be? Start with **3 to 5 teammates**. At 2, the time spent coordinating usually eats the benefit. Past 5, you spend the whole session supervising instead of shipping.',
          },
        ],
      },
      {
        heading: 'Failure modes and the token bill',
        blocks: [
          {
            type: 'text',
            md: 'Teams fail in predictable ways, and almost all of them trace back to the shape of the task graph. Before you spin up a single teammate, sketch which tasks depend on which. If the sketch looks like a fan (many tasks that can run at once, merging at the end), a team will fly. If it looks like a chain (each task waiting on the one before it), a team will crawl and bill you for the privilege.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <text x="175" y="36" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">Fan: pays for itself</text>
  <rect x="40" y="70" width="120" height="46" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="100" y="98" fill="#e4e4e7" font-size="12" text-anchor="middle">T1 review api/</text>
  <rect x="40" y="132" width="120" height="46" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="100" y="160" fill="#e4e4e7" font-size="12" text-anchor="middle">T2 review ui/</text>
  <rect x="40" y="194" width="120" height="46" fill="#27272a" stroke="#34d399" rx="6"/>
  <text x="100" y="222" fill="#e4e4e7" font-size="12" text-anchor="middle">T3 review infra/</text>
  <rect x="220" y="132" width="120" height="46" fill="#27272a" stroke="#38bdf8" rx="6"/>
  <text x="280" y="160" fill="#e4e4e7" font-size="12" text-anchor="middle">T4 synthesize</text>
  <line x1="162" y1="93" x2="218" y2="148" stroke="#52525b" stroke-width="2"/>
  <line x1="162" y1="155" x2="218" y2="155" stroke="#52525b" stroke-width="2"/>
  <line x1="162" y1="217" x2="218" y2="162" stroke="#52525b" stroke-width="2"/>
  <text x="175" y="272" fill="#a1a1aa" font-size="11" text-anchor="middle">3 teammates busy at once</text>
  <text x="175" y="290" fill="#a1a1aa" font-size="11" text-anchor="middle">3x spend, close to 3x speed</text>
  <line x1="350" y1="24" x2="350" y2="300" stroke="#52525b" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="525" y="36" fill="#f472b6" font-size="14" text-anchor="middle" font-weight="bold">Chain: secretly a queue</text>
  <rect x="400" y="90" width="110" height="46" fill="#27272a" stroke="#f472b6" rx="6"/>
  <text x="455" y="118" fill="#e4e4e7" font-size="12" text-anchor="middle">T1</text>
  <rect x="400" y="152" width="110" height="46" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="455" y="180" fill="#a1a1aa" font-size="12" text-anchor="middle">T2 waits on T1</text>
  <rect x="400" y="214" width="110" height="46" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="455" y="242" fill="#a1a1aa" font-size="12" text-anchor="middle">T3 waits on T2</text>
  <line x1="455" y1="138" x2="455" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="455" y1="200" x2="455" y2="212" stroke="#52525b" stroke-width="2"/>
  <text x="600" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">2 teammates idle</text>
  <text x="600" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">at any moment</text>
  <text x="600" y="200" fill="#f472b6" font-size="11" text-anchor="middle">3x spend,</text>
  <text x="600" y="218" fill="#f472b6" font-size="11" text-anchor="middle">1x speed</text>
</svg>`,
            caption:
              'The same three tasks, two shapes. The fan keeps every teammate working; the chain pays team prices for solo speed.',
          },
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
                'Sequential work where T2 needs T1 and T3 needs T2 (a team that is secretly a queue)',
                'Two teammates editing the same file (merge chaos; no locking saves you)',
                'Vague tasks that overlap ("improve quality")',
                'Spawning 8 teammates for a 20-minute job',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Linear burn',
            md: 'Token spend scales **linearly per teammate**, because every teammate carries its own full, independent context. A 5-teammate team costs roughly 5 times what a solo session costs. If the work is inherently sequential, you pay that 5x to move at 1x speed. Parallel work is the only thing that earns the bill back.',
          },
        ],
      },
      {
        heading: 'Dynamic workflows: Claude writes the harness',
        blocks: [
          {
            type: 'text',
            md: 'Dynamic workflows reached **GA** (general availability, the label a vendor puts on a feature once it graduates from beta) in **June 2026**. Here’s the mechanic. You drop the keyword `ultracode` into a prompt, and Claude writes a small [JavaScript](https://en.wikipedia.org/wiki/JavaScript) program that coordinates other agents: spawn three workers, wire their outputs into a judge, loop until a check passes. Then it executes that program. Claude picks the coordination shape itself, so you skip the whole teams-versus-subagents decision.\n\nWhy would anyone want the model writing its own coordinator? Because models left unsupervised misbehave in well-documented ways. **Agentic laziness** means the agent declares victory early, with tests still failing. **Self-preferential bias** shows up when it reviews its own output and, like anyone grading their own homework, goes easy. And **goal drift** creeps in on long runs, where the agent slowly forgets the brief and starts optimizing something adjacent.\n\nOrchestration written as code fights all of these, because the checks live outside the model. A loop condition in JavaScript can’t get bored. A separate skeptic agent gains nothing by flattering the builder. The goal sits in the script and gets re-read on every pass. Four generated patterns cover most jobs:',
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
              ['You control', 'The prompt', 'The org chart + gates', 'Almost nothing (Claude writes it)'],
              ['Cost profile', 'Cheap, isolated', 'Linear per teammate', 'Varies by generated pattern'],
              ['Best for', 'Fan-out reads, research', 'Long parallel builds/reviews', 'Novel one-off orchestration'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Default order of escalation: start with subagents, since they’re the cheapest. Move up to a team when the work is genuinely parallel **and** long-lived. Reach for `ultracode` when the orchestration shape is so unusual that scripting it yourself would be the bottleneck.',
          },
        ],
      },
      {
        heading: 'The counterweight: one good generalist',
        blocks: [
          {
            type: 'text',
            md: "A whole lesson about teams needs an honest counterweight, because the loudest trend in agent engineering runs the other way. The move right now is toward **one generalist agent** that loads skills on demand, not a standing army of specialists. Google's 2026 playbook says it plainly: keep the agent a lightweight generalist and let it flex into a specialist role only when a task calls for it, through progressive disclosure. The agent sees a one-line description of each skill up front and pulls in the full instructions only when it actually reaches for that skill. One driver, many hats, wearing the hat that fits the moment.\n\nWhy the retreat from many specialists? Every extra agent is another full context to pay for, another handoff where information leaks, another thing to supervise. A generalist with good skills (this is what [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3) sets up) buys you most of the specialization at a fraction of the coordination cost. So reach for the machinery in this lesson when the work is genuinely parallel or genuinely long-running. For the rest, one capable driver beats a committee.",
          },
          {
            type: 'compare',
            left: {
              title: 'One generalist + skills',
              items: [
                'One context, one token bill',
                'Loads a skill\'s full instructions only when a task triggers it',
                'Switches roles mid-session: reviewer now, planner next',
                'Coordination cost: none',
              ],
            },
            right: {
              title: 'A team of specialists',
              items: [
                'One full context per teammate',
                'Each role is fixed when you spin the team up',
                'Roles run at the same time on separate slices',
                'Coordination cost: task list, mailboxes, plan approvals',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Parallel review, two ways',
      intro:
        'Run a real multi-agent job on a repo you actually care about. Pick ONE path (a 3-teammate team review, or an ultracode workflow) and measure what it costs.',
      steps: [
        'Pick a real repo with at least 3 distinct areas (e.g. api/, ui/, infra/). Note its size.',
        'Team path: run `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` then `claude`, and ask the lead for a 3-teammate review split by area, with plan approval required.',
        'Watch the shared task list: confirm teammates self-claim tasks and that no two tasks touch the same files. Fix the task split if they do.',
        'Add (or sketch) a `TaskCompleted` hook that runs your linter, so a review task cannot complete with broken examples.',
        'Workflow path (alternative): in a normal session, prompt `ultracode: fan out 3 reviewers across api/, ui/, infra/, then synthesize one prioritized findings report` and read the JS harness Claude writes before approving it.',
        'Collect the merged findings into REVIEW.md and check `/cost` for total spend.',
        'Compare against the solo baseline: estimate how many compactions a single session would have needed to do the same review.',
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
          'Nothing; dependencies are exactly what the task list is for',
          'It is sequential work: you pay linear per-teammate cost for zero parallelism',
          'Blocked tasks crash teammates that try to claim them',
          'The lead cannot approve plans for dependent tasks',
        ],
        answer: 1,
        explain:
          'A chain where every task waits on the previous one means only one teammate can actually work at any moment. The other two sit idle while their full contexts keep costing tokens. You pay team prices for solo throughput, which is the classic team anti-pattern.',
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
          'Adversarial verification pairs the builder with a separate skeptic agent whose entire job is finding faults. Because the skeptic gains nothing by approving the work, it catches the sloppy output the builder keeps waving through. That attacks self-preferential bias head on.',
      },
      {
        q: 'You need 6 directories summarized once, with only a merged summary back. Best tool?',
        options: [
          'An agent team of 6 teammates with mailboxes',
          'Parallel subagents: fire-and-forget workers that each return a report',
          'ultracode tournament across the directories',
          'One session reading all 6 directories with compaction',
        ],
        answer: 1,
        explain:
          'Six independent summaries with one merged report at the end is a one-shot fan-out. Subagents do exactly that: each goes off alone, reads its directory, and returns a report. A team would add persistent contexts, mailboxes, and coordination overhead this job never touches.',
      },
      {
        q: 'Who reviews and approves a teammate’s plan before it edits files?',
        options: [
          'The user, via a permission prompt per file',
          'The team lead',
          'A randomly selected peer teammate via mailbox',
          'No one; plans are advisory in teams',
        ],
        answer: 1,
        explain:
          'Reviewing plans is the team lead’s job. Before a teammate edits anything, it writes a short plan and the lead checks it. That checkpoint is what keeps five parallel agents building toward one architecture instead of five different ones.',
      },
    ],
    resources: [
      {
        label: 'Claude Code docs - Agent teams (experimental)',
        url: 'https://code.claude.com/docs/en/agent-teams',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs - Dynamic workflows & ultracode',
        url: 'https://code.claude.com/docs/en/dynamic-workflows',
        kind: 'docs',
      },
      {
        label: 'Anthropic - Building Effective Agents (workflows vs agents)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'everything-claude-code - dense config reference incl. teams',
        url: 'https://github.com/affaanmustafa/everything-claude-code',
        kind: 'repo',
      },
      {
        label: 'Anthropic - Effective Context Engineering for AI Agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l7 - Agent Memory & State (Day 12)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l7',
    title: 'Agent Memory & State',
    day: 12,
    minutes: 45,
    xp: 100,
    objectives: [
      'Explain the filesystem-as-state doctrine and why plain markdown beats databases for agent working memory',
      'Install and use the planning-with-files pattern (task_plan.md, findings.md, progress.md) to kill plan drift',
      'Wire a NOTES.md / LESSONS.md self-improvement loop into a real project',
      'Place buffers, vector stores, knowledge graphs, and MemGPT-style systems on one map, and know where Claude Code auto-memory hits its ceiling',
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
          'The skill maintains three files. task_plan.md holds the plan itself, findings.md collects what the agent learns along the way, and progress.md records what actually got done. The agent re-reads all three throughout the task, and that re-reading habit is what keeps it on track.',
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
          'Markdown files win on legibility and durability. Any human or any model can open them, search them, and diff them (compare two versions line by line). And because they sit on disk, they survive a context reset or a brand new session with zero extra infrastructure. A database stores the same bytes but hides them behind a query layer nobody can casually read.',
      },
      {
        q: 'In the structured note-taking loop, when does the agent update LESSONS.md?',
        options: [
          'At session start, seeding context',
          'Only when the user explicitly asks for a retro',
          'After every fix, appending the rule that would have prevented the bug',
          'On a nightly consolidation cron',
        ],
        answer: 2,
        explain:
          'The loop runs once per fix. Right after resolving a bug, the agent appends the rule that would have prevented it to LESSONS.md. Next session, it re-reads those rules before starting work. Each mistake gets paid for exactly once, and the file keeps compounding across sessions.',
      },
      {
        q: 'What is the key retrieval limitation of Claude Code’s auto-memory?',
        options: [
          'It only persists for 30 days',
          'Retrieval matches keywords only, with no embeddings, so paraphrased queries miss stored facts',
          'It stores memory in the system prompt, eating the attention budget',
          'It cannot store more than one topic file per project',
        ],
        answer: 1,
        explain:
          'Auto-memory writes real files, and that part works well. The ceiling is retrieval: it matches by keywords, with no [embeddings](https://en.wikipedia.org/wiki/Sentence_embedding) (numeric fingerprints of meaning that let software connect "login flow" to "auth pipeline"). Ask in different words than the memory was written in and the lookup misses. Vector stores exist to close exactly that gap.',
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
          'That question has two parts: what relates to what (auth connects to a decision), and when each fact was true (the decision changed at some point). Temporal knowledge graphs like Zep’s Graphiti model entities, relationships, and validity windows over time, so "what did we decide, and when did it change" is precisely the query shape they were built for.',
      },
    ],
    sections: [
      {
        heading: 'Your company is a filesystem',
        blocks: [
          {
            type: 'callout',
            variant: 'quote',
            title: 'Eli Mernit: "Your Company is a Filesystem"',
            md: 'Strip an agent to its essentials and two parts remain: the **filesystem as state**, and the **model as orchestrator**. Everything else (queues, databases, dashboards) is accessory.',
          },
          {
            type: 'text',
            md: 'Here’s the claim in plain terms. An agent needs somewhere to keep what it knows between turns, because the model itself is **stateless**: it carries no built-in memory from one run to the next, and forgets everything the moment a session ends. Mernit’s answer is to keep all of it in ordinary files.\n\nOpenClaw, the popular open-source personal agent, runs exactly this way. Its whole operational world (who it is, what it’s working on, what happened before, what it has learned) is a folder of markdown files that the model reads at the start of a turn and rewrites at the end. Kill the running process and nothing is lost. Start a fresh one pointed at the same folder and the agent picks up where it left off, with zero infrastructure beyond the folder itself. The **directory is the agent**.\n\nIf you’ve built systems before, this rhymes with [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html), the architecture where you store the full history of changes and rebuild current state from it. Here, `git log` plays the event store and the markdown files are the current-state snapshot.',
          },
        ],
      },
      {
        heading: 'Planning with files: the anti-drift pattern',
        blocks: [
          {
            type: 'text',
            md: 'Long agent tasks drift. By turn 40 the agent is polishing something you never asked for, because the original plan was stated once, 39 turns ago, and old instructions carry less and less weight as new tokens pile on top of them. The fix costs almost nothing: move the plan out of the conversation and into files, then force re-reads.\n\nInstall the skill with `npx skills add othmanadi/planning-with-files`. From then on, the agent writes task_plan.md **before** touching any code, appends discoveries to findings.md as it learns, and checks off progress.md as steps complete. Because it re-reads all three files throughout the task, the plan keeps landing in fresh, recent tokens where the model actually pays attention to it. Plan drift nearly disappears.\n\nOne bonus you’ll feel immediately: a crashed or cleared session stops being a disaster. The next session reads the three files and resumes at the exact step where the last one died.',
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
  <text x="540" y="76" fill="#a1a1aa" font-size="11" text-anchor="middle">the plan, written first</text>
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
              'Filesystem-as-state: the plan lives on disk, where attention decay can’t touch it. A fresh session re-reads the files and resumes exactly where the last one died.',
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
            md: 'Planning files carry one task. **LESSONS.md** carries everything that comes after it. The loop is short: whenever the agent fixes a bug, it appends the rule that would have prevented that bug. A real entry looks like "our ORM silently truncates strings over 255 chars; always check schema first." (An [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping), or object-relational mapper, is the library that translates between code objects and database rows.)\n\nNOTES.md and LESSONS.md split the work by lifespan. NOTES.md holds observations that only matter this session, like "the staging server is down today." LESSONS.md holds durable rules that should shape every future session. The Senior Engineer OS doctrine bakes this in as the final step of every debug protocol: update LESSONS.md before you call the bug closed. Give it six weeks and the agent stops replaying its greatest hits of failure.',
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Make the habit mechanical. Add one line to CLAUDE.md ("after fixing any bug, append the prevention rule to LESSONS.md") and check during review that the entry actually landed. An unwritten lesson may as well have never happened.',
          },
        ],
      },
      {
        heading: 'Four kinds of memory',
        blocks: [
          {
            type: 'text',
            md: 'Step back and name the kinds of memory an agent has. The techniques map in the next section sorts memory by **how you retrieve it**. Here’s the other axis: how long each kind lasts and how far it reaches. Four tiers, borrowed from the way people describe human memory, and you’ve already built three of them in this lesson.\n\n**Working memory** is the context window itself: the current prompt, the tool results, the last few turns. Fast, and gone when the session ends. **Short-term memory** is the scratchpad, meaning notes.md, findings.md, and task_plan.md. It survives a compaction or a crash and carries one task start to finish. **Long-term memory** is the durable rulebook: CLAUDE.md and LESSONS.md, the preferences and hard-won rules every future session should honor. **Episodic memory** is the tier this lesson hasn’t built yet: retrievable past experiences. Last month’s architecture decision record (ADR: a short note capturing a decision and why you made it), a ticket you solved that looks just like today’s, a prior session worth pulling back up. You fetch the one relevant episode, not the whole history.',
          },
          {
            type: 'table',
            headers: ['Tier', 'Lasts', 'In this lesson', 'How you reach it'],
            rows: [
              ['Working', 'One session', 'The context window', 'Already there, until it fills up'],
              ['Short-term', 'One task', 'notes.md, findings.md, progress.md', 'Re-read the file every turn'],
              ['Long-term', 'Every session', 'CLAUDE.md, LESSONS.md', 'Injected at the start of a session'],
              ['Episodic', 'Across projects and months', 'Past sessions, ADRs, solved tickets', 'Search it: keywords, embeddings, or a graph'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Episodic is where the next section comes in',
            md: 'Working, short-term, and long-term memory all sit close at hand. Episodic memory is the tier you have to go **find**, which is exactly what the retrieval ladder below is for. The simplest episodic store is an ADR wiki: one index file linking out to a detail file per decision. That plain-files approach holds up to roughly 500 documents before keyword search starts missing and you graduate to embeddings.',
          },
        ],
      },
      {
        heading: 'The memory-techniques map',
        blocks: [
          {
            type: 'text',
            md: 'Files cover about 80% of real agent memory needs, and they should stay your default. The other 20% shows up when history gets huge or the questions get subtle, and that’s where the fancier techniques below earn their keep. Nir Diamant’s **Agent_Memory_Techniques** repo walks the whole map in roughly 30 runnable [Jupyter notebooks](https://jupyter.org/) (interactive documents that mix code with explanations). Worth an afternoon when you outgrow markdown.\n\nA quick decoder for the table. A **vector store** saves embeddings (numeric fingerprints of meaning) so you can search past content by what it means instead of the exact words it used. A **knowledge graph** stores facts as entities and relationships (Bill works at Acme; Acme uses Postgres), which lets a question hop across several facts to reach an answer.',
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
              ['Plain files (this lesson)', 'Markdown state the model reads/writes', 'Almost everything else. Start here'],
            ],
          },
        ],
      },
      {
        heading: 'Auto-memory: a shipped worked example',
        blocks: [
          {
            type: 'text',
            md: 'You’re already running this doctrine without installing anything. Claude Code’s auto-memory keeps a file at `~/.claude/projects/<proj>/memory/MEMORY.md` as an index, plus one file per topic, and the model itself writes and consolidates them between sessions. Filesystem-as-state, shipped in a real product.\n\nIt has a ceiling, though, and it’s worth knowing exactly where. Retrieval works by **keyword matching only**. Ask about the "login flow" when the memory file says "auth pipeline" and the lookup comes back empty, even though any human would see instantly that they’re the same thing. Matching by meaning requires embeddings, and that’s the vector-store row of the table above earning its extra complexity.',
          },
          {
            type: 'callout',
            variant: 'insight',
            md: 'Architecture takeaway: memory is a **retrieval problem wearing a storage costume**. Storing is the easy half, and files win it outright. The technique ladder above is really a ladder of retrieval sophistication: keywords, then embeddings, then graph traversal, then time-aware graphs.',
          },
        ],
      },
    ],
    lab: {
      title: 'Watch drift disappear',
      intro:
        'Take a real multi-step task you would normally babysit and run it with planning files. The point is to watch the re-read behavior with your own eyes; installing the skill is the easy part.',
      steps: [
        'Install the skill: `npx skills add othmanadi/planning-with-files`. Or hand-roll it by telling Claude to create task_plan.md, findings.md, and progress.md before doing anything.',
        'Pick a real 30-60 minute task in one of your repos (a refactor or a feature with 5+ steps).',
        'Start the task and confirm task_plan.md exists with numbered steps BEFORE any code is edited.',
        'Mid-task, run /clear (or kill the session entirely). Then start fresh and say "resume the task in task_plan.md".',
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
          'Mernit’s reduction keeps two parts: durable state living in ordinary files, and a stateless model that reads them, does the work, and writes them back. Queues, databases, and dashboards all count as accessories in this view. You can rebuild any of them; you can’t rebuild lost state.',
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
          'Plan drift is an attention problem. Instructions given 40 turns ago carry less and less weight as new tokens stack on top of them. Re-reading the plan files puts the plan back into recent, high-weight context on every turn, so it never gets the chance to fade.',
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
          'Skills distribute through the npx skills command-line tool pointed at the author’s GitHub repo, so the install is npx skills add othmanadi/planning-with-files. One command, and the skill is available in your sessions.',
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
          'MemGPT borrows the memory hierarchy idea from operating systems. The context window plays the role of RAM (fast but small), external storage plays the disk (slow but huge), and the model itself decides what to page in and page out as it works.',
      },
    ],
    resources: [
      {
        label: 'planning-with-files skill (othmanadi)',
        url: 'https://github.com/othmanadi/planning-with-files',
        kind: 'repo',
      },
      {
        label: 'Agent_Memory_Techniques - 30 notebooks (Nir Diamant)',
        url: 'https://github.com/NirDiamant/Agent_Memory_Techniques',
        kind: 'repo',
      },
      {
        label: 'Claude Code docs - Memory (CLAUDE.md, rules, auto memory)',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Letta (MemGPT lineage) - self-managed agent memory',
        url: 'https://github.com/letta-ai/letta',
        kind: 'repo',
      },
      {
        label: 'Graphiti - temporal knowledge graphs for agents (Zep)',
        url: 'https://github.com/getzep/graphiti',
        kind: 'repo',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l8 - Building With the Agent SDK (Day 12)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l8',
    title: 'Building With the Agent SDK',
    day: 12,
    minutes: 55,
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
          'query() hands back an async iterator, a JavaScript object you loop over with for-await as values arrive over time. Each value is a message: the agent used a tool, produced some text, or finished with a result. You watch the agentic loop happen message by message rather than waiting blind for one final string.',
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
          'settingSources controls which configuration your programmatic agent inherits from the filesystem: the project’s CLAUDE.md, installed skills, user settings. You opt in explicitly, so an SDK agent can run sealed off from all of it, or behave exactly like Claude Code does inside that repo. Your choice per agent.',
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
          'Headless means running without the interactive interface. The -p flag (short for print) makes claude answer one prompt and exit, and --output-format json wraps the answer in JSON your pipeline can parse. That combination scripts Claude Code inside CI ([continuous integration](https://en.wikipedia.org/wiki/Continuous_integration), the automated checks that run when code is pushed) with zero SDK code.',
      },
      {
        q: 'In Karpathy’s Autoresearch, why is prepare.py locked (not editable by the agent)?',
        options: [
          'It contains credentials the agent must not read',
          'It holds the evaluation, and an editable eval invites reward hacking, so locking it closes that loophole',
          'Editing it would break the git-revert loop',
          'It is generated code that regenerates on every run',
        ],
        answer: 1,
        explain:
          'The agent’s score comes from the evaluation code in prepare.py. If the agent could edit that file, the easiest way to "improve" would be to weaken the test itself, a failure mode called reward hacking. Locking the eval leaves exactly one path to a better score: writing genuinely better training code in train.py.',
      },
      {
        q: 'In CRISPY, why does the Reviewer run on a different model than the Coder?',
        options: [
          'The reviewer model is cheaper per token',
          'To dodge self-preferential bias, since a model grades its own style too kindly',
          'Different models are required for parallel execution',
          'The Coder model cannot output review comments',
        ],
        answer: 1,
        explain:
          'A model reviewing its own output tends to approve it, the same way people grade their own essays kindly. CRISPY runs the Reviewer on a different model, which has no loyalty to the Coder’s choices and flags the things the Coder would quietly excuse in itself.',
      },
    ],
    sections: [
      {
        heading: 'When to graduate from Claude Code',
        blocks: [
          {
            type: 'text',
            md: 'First, the name. An **SDK** ([software development kit](https://en.wikipedia.org/wiki/Software_development_kit)) is a library you install so your own programs can drive someone else’s machinery. The Agent SDK is Claude Code’s machinery (the agentic loop, the tools, the permission system, context management) packaged exactly that way: `@anthropic-ai/claude-agent-sdk` for TypeScript, `claude-agent-sdk` for Python.\n\nSo when do you graduate from the interactive CLI to the SDK? The moment the agent has to run **inside something else**. Inside your product, where users trigger it. Inside a service that fires on a schedule with nobody watching. Inside infrastructure that serves many customers at once. In every one of those, the harness has to live in your code, because no human is sitting at a terminal steering it.\n\nWhile you personally are the orchestrator (typing prompts, reviewing diffs, correcting course), stay in Claude Code. The interactive harness already does that job better than anything you’d rebuild.',
          },
          {
            type: 'table',
            headers: ['', 'Claude Code (CLI)', 'Agent SDK', 'Raw Messages API'],
            rows: [
              ['You get', 'Full interactive harness', 'The harness as a library', 'Model calls only; you build the loop'],
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
            md: 'Four extension points cover most designs, and each one maps to something you already know from the CLI.\n\n**AgentDefinition** lets you declare subagents in code instead of as `.claude/agents/*.md` files, which matters when the agent ships inside a product. **In-process hooks** are the same PreToolUse and Stop events you’ve already met, except now they’re plain functions running in your own process. That means a Stop hook can literally call your test suite and refuse to let the agent finish until the tests pass. **mcpServers** hands the agent your own tools over [MCP](https://modelcontextprotocol.io/) (Model Context Protocol, the open standard for plugging tools into models). And **settingSources**, from the code above, decides whether the agent inherits the project’s CLAUDE.md and skills or runs sealed off from them.\n\nWant scripting with no SDK code at all? Use headless mode: `claude -p "fix the failing test" --output-format json` runs one prompt, prints machine-readable JSON, and exits. That single command covers most CI pipelines.',
          },
        ],
      },
      {
        heading: 'Managed Agents: prototype local, productionize hosted',
        blocks: [
          {
            type: 'text',
            md: '**Managed Agents** are the third leg of the stool. With the SDK, your agent still runs on machines you operate, holding credentials you have to protect. Managed Agents move that runtime to Anthropic: execution happens in a hosted sandbox (an isolated environment that can’t reach anything you didn’t allow), secrets live in a credential vault so the agent uses tokens your code never even sees, and scaling becomes Anthropic’s problem.\n\nThe 2026 pattern is explicit: **prototype locally with the SDK, productionize hosted**. The agent definition stays the same; only the substrate underneath it changes. When your security review balks at "the agent holds prod credentials on a box we patch ourselves," this is the answer you reach for.',
          },
        ],
      },
      {
        heading: 'Case study: Autoresearch and reward-hacking closure',
        blocks: [
          {
            type: 'text',
            md: 'Andrej Karpathy’s Autoresearch shows how much work a harness can do when it trusts the model with almost nothing. The task: improve a small language model’s training run. The agent may edit exactly one file, **train.py**. The evaluation code lives in **prepare.py**, which is locked. Success is a single number, **val_bpb** (validation bits per byte, a compression-style score of how well the model predicts held-out text; lower is better).\n\nThe loop enforces itself. Every change gets committed to [git](https://git-scm.com/). If val_bpb gets worse, the harness runs git revert automatically and the agent tries again. When two changes score the same, a **simplicity criterion** picks the one with less code. Add it up and the agent controls one thing: the single file where genuine improvement can live.',
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
  <text x="320" y="86" fill="#34d399" font-size="11" text-anchor="middle">EDITABLE (the only file)</text>
  <rect x="240" y="226" width="160" height="64" fill="#27272a" stroke="#f472b6" rx="6"/>
  <text x="320" y="252" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">prepare.py (eval)</text>
  <text x="320" y="272" fill="#f472b6" font-size="11" text-anchor="middle">LOCKED: eval frozen</text>
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
            md: 'Tyler Folkman’s **CRISPY** cut a $200/mo agent bill down to **$45/mo** using role separation. Five roles, and each one receives exactly the context its job needs. Since you pay for every token sent with every request, keeping the chatty roles lean is where the savings come from:',
          },
          {
            type: 'table',
            headers: ['Role', 'Job', 'Harness trick'],
            rows: [
              ['Architect', 'Decides what to build', 'Owns the spec; never writes code'],
              ['Scout', 'Locates relevant code', 'Runs with NO prior context: cheap, unbiased search'],
              ['Coder', 'Implements', 'TDD-first: failing test before code'],
              ['Reviewer', 'Critiques the diff', 'DIFFERENT model, which kills self-preferential bias'],
              ['Verifier', 'Confirms done', 'Binary pass/fail against the spec'],
            ],
          },
          {
            type: 'text',
            md: 'Composio’s **Agent Orchestrator** takes the same idea up a level: a meta-harness that drives Claude Code, Codex, and Cursor in parallel, which produced 40,000 lines of code in 8 days. Its sibling project **Paperclip** goes full org chart. A CEO-agent hires engineer agents, each engineer sends **heartbeats** (periodic prove-you’re-alive signals, so a stuck agent gets noticed and replaced), and every agent draws against its own **budget**.\n\nRead all three case studies side by side and one thread stands out: the interesting engineering lives in **what the harness forbids**. The model call itself is the boring part.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The harness-design lesson',
            md: 'Autoresearch forbids touching the eval. CRISPY keeps the Reviewer on a different model than the Coder. Paperclip caps what any single agent may spend. Design your constraints first; the agent fills in the rest.',
          },
        ],
      },
    ],
    lab: {
      title: 'Your first 30-line SDK agent',
      intro:
        'Ship one tool-using query end-to-end with the TypeScript Agent SDK. Small on purpose: the goal is to feel where Claude Code ends and your code begins.',
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
        'You watched tool-use messages stream by before the final answer arrived',
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
          'The SDK exists for embedding the harness inside your own software: your service, your schedule, your hooks and custom tools, potentially many tenants at once. For interactive development work with you at the keyboard, the CLI already does the job.',
      },
      {
        q: 'What do Managed Agents add over running the SDK on your own infrastructure?',
        options: [
          'Access to models unavailable through the API',
          'Anthropic-hosted sandboxed runtime plus credential vaults: prototype locally, productionize hosted',
          'A visual workflow builder for non-engineers',
          'Free inference for agents under 10 turns',
        ],
        answer: 1,
        explain:
          'Managed Agents move the runtime and the secrets onto Anthropic-operated sandboxes. Your agent definition stays the same, and in exchange you stop operating servers, patching boxes, and shipping credentials alongside your code. Prototype locally, then deploy the identical agent hosted.',
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
          'Regression handling is fully mechanical. The harness commits every change, checks val_bpb, and runs git revert the moment the number gets worse. No negotiation, no explanation step. The loop keeps whatever moves the metric and discards the rest.',
      },
      {
        q: 'Which CRISPY design choice is primarily a COST lever (part of the $200→$45/mo drop)?',
        options: [
          'The Verifier’s binary pass/fail',
          'The Scout running with no prior context, doing cheap searches instead of dragging full history into every call',
          'The Architect owning the spec',
          'The Coder writing failing tests first',
        ],
        answer: 1,
        explain:
          'The Scout is the cost lever. Search is high-volume work, and the Scout does it with a nearly empty context instead of dragging the full session transcript into every call. Because you pay per input token on every single request, a lean context on the chattiest role is where the savings pile up.',
      },
    ],
    resources: [
      {
        label: 'Agent SDK overview - official docs',
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
        label: 'Karpathy - Autoresearch (harness-constrained research agent)',
        url: 'https://github.com/karpathy/autoresearch',
        kind: 'repo',
      },
      {
        label: 'Tyler Folkman - CRISPY: 5-role agent pipeline',
        url: 'https://tylerfolkman.substack.com/p/crispy-agent-pipeline',
        kind: 'article',
      },
      {
        label: 'Composio - Agent Orchestrator & Paperclip',
        url: 'https://composio.dev/blog/agent-orchestrator',
        kind: 'article',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l9 - Cost-Aware Agents & Guardrails (Day 13)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l9',
    title: 'Cost-Aware Agents & Guardrails',
    day: 13,
    minutes: 50,
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
          'Wrong model choices and wrong hosting for a 24/7 agent, the two costs that dominate',
          'Forgetting to enable prompt caching',
          'A misconfigured MCP server retrying in a tight loop',
        ],
        answer: 1,
        explain:
          'His post-mortem is blunt about it. For an always-on agent, two standing decisions dominate the bill: which model answers by default, and where the loop runs. He got both wrong at the same time, and 80 hours later the meter read $800.',
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
          'Pre-loading about $250 in credits converts an unbounded liability into a bounded, visible budget. If a loop runs away, it dies when the credits do, so you learn about the problem at $250 instead of on an $800 invoice.',
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
          'Ponytail measured its wins directly: about 54% less generated code, roughly 20% lower cost, and about 27% faster runs. All three trace to one source. Over-engineered output was quietly taxing every run, and deleting it paid off in tokens, dollars, and time at once.',
      },
      {
        q: 'A loop that "bills you in your sleep" is missing what, specifically?',
        options: [
          'Prompt caching on the system prompt',
          'A stop condition: real completion criteria that terminate the loop',
          'A cheaper fallback model',
          'Subagent isolation for expensive steps',
        ],
        answer: 1,
        explain:
          'The phrase points at termination. A loop without a genuine done-check (tests green, artifact exists, lint clean) will happily re-prompt forever, and every one of those pointless turns bills you, whether or not you’re awake to watch it happen.',
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
          'Company Brain stacks five layers in order: capture feeds raw material in, retrieval finds it later, a canonical source of truth settles conflicts, permissions bound what agents may touch, and feedback catches drift. Slack sits in front as the interface, and more than 90 [cron](https://en.wikipedia.org/wiki/Cron) jobs (tasks scheduled to fire at set times) do the actual work.',
      },
    ],
    sections: [
      {
        heading: 'The $800 lesson',
        blocks: [
          {
            type: 'text',
            md: 'jordymaui ran an OpenClaw agent around the clock for 80 hours and got an **$800** bill. Then he wrote the post-mortem everyone should read before going 24/7. The root cause turned out to be mundane: **wrong models and wrong hosting**, the two standing decisions behind every always-on agent.\n\nHere’s why those two swamp everything else. An interactive session only runs while you’re at the desk. An always-on agent runs 8,760 hours a year, so whatever model answers by default, and wherever the loop physically executes, gets multiplied by every one of those hours. A per-turn cost that looks harmless in an afternoon session compounds into rent.\n\nHis fixes were equally unglamorous. Route requests by difficulty, so cheap models handle the cheap questions. And **pre-load about $250 in credits**, which gives the worst case a hard ceiling you chose in advance.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The follow-up is worse',
            md: 'His sequel logged **500 hours and $5,000** across experiments. A 24/7 agent is a subscription you write yourself, so price the loop before you start it rather than after the invoice lands.',
          },
        ],
      },
      {
        heading: 'Guardrails that actually stop spend',
        blocks: [
          {
            type: 'text',
            md: 'A single guardrail is a single point of failure: the one day it’s misconfigured is the day you needed it. So you layer several, ordered so the cheapest one trips first. Think of the table below as a gauntlet that every turn of the loop has to survive.\n\nBoris Cherny’s loop doctrine supplies the theme. A loop with no stop condition **"bills you in your sleep."** Treat the done-check itself as a guardrail, and make it something a script can verify (tests green, file exists) rather than the model’s own opinion of its work.',
          },
          {
            type: 'table',
            headers: ['Layer', 'Mechanism', 'Catches'],
            rows: [
              ['Turn cap', 'maxTurns in SDK / --max-turns headless', 'Infinite retry-and-apologize loops'],
              ['Spend cap', 'Pre-loaded credits; per-run token budget', 'Model and hosting mistakes while the damage is still $250'],
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
  <text x="350" y="50" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Every turn passes through every gate; cheapest trips first</text>
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
            md: 'Loop count is only half the cost story. The other half is **how much the agent writes**, because you pay for every output token, and every extra file it creates rides along in future contexts. The [Ponytail skill](https://github.com/DietrichGebert/ponytail) attacks the writing side with the **laziest-senior-dev principle**: the best engineer on the team ships the smallest change that works.\n\nIts `/ponytail-review` pass produces **delete-lists**, concrete lists of code to remove and abstractions to collapse. The measured results: about **54% less code, 20% cheaper, 27% faster**. You generate fewer output tokens now, future contexts carry less bulk, and bugs get less surface area to loop on later. One skill, three compounding wins.',
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
            md: 'Everything you enable rides along on **every turn**: each plugin, each [MCP](https://modelcontextprotocol.io/) server, every line of CLAUDE.md gets re-sent with every single request. The cautionary artifact from the systematicls write-ups is a **26,000-line CLAUDE.md**. Its owner paid to transmit it on each request while it actively degraded the model’s attention, a failure known as **context rot** (important instructions drowning in noise). That makes bloat the rare tax you pay twice: dollars now, quality always.\n\nmfpiccolo’s **harness-responsibilities checklist** (the 15 jobs a real harness owns: turn persistence, prompt assembly, tool policy, spend tracking, compaction, and so on) doubles as an audit tool. Walk the list against any loop you run and ask two questions. What does this loop carry on every turn? And who is watching the spend meter?',
          },
          {
            type: 'compare',
            left: {
              title: 'Lean harness',
              items: [
                'CLAUDE.md under 200 lines, rules split into .claude/rules/ with path scoping',
                'Under 10 MCP servers enabled; tool search defers the rest',
                'Skills load via progressive disclosure (metadata only until needed)',
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
            md: 'Zoom all the way out and guardrails turn into architecture. Eric Siu’s **Company Brain** runs a real business on five layers: **capture, then retrieval, then a source of truth, then permissions, then feedback**. More than **90 cron jobs** ([cron](https://en.wikipedia.org/wiki/Cron) is the classic Unix scheduler that fires tasks at set times) do the day-to-day work, and **Slack is the front door** where humans talk to the whole thing.\n\nNotice where the cost discipline hides. Permissions bound what agents may touch. Feedback catches drift before it compounds. And every job runs on a schedule with a defined end, so nothing loops freely. That’s the same guardrail stack you built today, promoted to company policy.',
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
        'The stop condition is a check a script can verify, independent of the model’s opinion',
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
          'An always-on agent multiplies its standing decisions by every hour of the year. The default model and the hosting under the loop are the two decisions that scale that way, so they swamp any per-prompt tweak like wording or temperature.',
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
          'Bloat bills you twice. Every extra token (plugin schemas, a 26k-line CLAUDE.md) gets paid for on every single turn, and the same noise dilutes the model’s attention, so output quality drops too. You pay in dollars immediately and in quality forever.',
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
          'Ponytail’s review pass outputs delete-lists: specific code to remove and abstractions to collapse, following the laziest-senior-dev principle. That deletion mechanism is exactly where its measured 54% code, 20% cost, and 27% time reductions come from.',
      },
      {
        q: 'How does the harness-responsibilities checklist function as a cost audit?',
        options: [
          'It ranks models by price-performance for your workload',
          'You walk its ~15 jobs (spend tracking, compaction, tool policy...) and ask which ones your loop actually implements, and who watches the meter',
          'It generates a monthly invoice forecast from your transcripts',
          'It disables any harness job that exceeds its token allowance',
        ],
        answer: 1,
        explain:
          'The checklist names the roughly 15 jobs a real harness must own, spend tracking and compaction among them. Walk it against your own loop and every gap you find is a place a runaway bill can hide. "Nobody tracks spend" is the audit finding that precedes most $800 surprises.',
      },
    ],
    resources: [
      {
        label: 'Ponytail - anti-over-engineering skill',
        url: 'https://github.com/DietrichGebert/ponytail',
        kind: 'repo',
      },
      {
        label: 'jordymaui - the $800 OpenClaw post-mortem',
        url: 'https://x.com/jordymaui',
        kind: 'thread',
      },
      {
        label: 'mfpiccolo - How to Build Your Own Agent Harness (the 15 jobs)',
        url: 'https://iii.dev/blog/build-your-own-agent-harness',
        kind: 'article',
      },
      {
        label: 'iii-hq/workers - llm-budget style harness workers',
        url: 'https://github.com/iii-hq/workers',
        kind: 'repo',
      },
      {
        label: 'Eric Siu - the Company Brain architecture',
        url: 'https://x.com/ericosiu',
        kind: 'thread',
      },
      {
        label: 'Claude API pricing - price your loop before you run it',
        url: 'https://docs.claude.com/en/docs/about-claude/pricing',
        kind: 'docs',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m2-l10 - Graph Engineering (Day 13)
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm2-l10',
    title: 'Graph Engineering',
    day: 13,
    minutes: 55,
    xp: 100,
    objectives: [
      'Define a task graph (nodes, edges, DAG) and explain the one-liner "loops handle the work, graphs handle the loops"',
      'Walk the diamond pattern end to end: fan out, reduce, synthesize, verify, and name what each stage exists to do',
      'Read a task graph for its critical path and predict both the wall-clock time and the token bill before running anything',
      'Map the twelve parts of a production agent node (the managed deep agent anatomy) onto the Claude Code pieces you already use',
      'Apply the honest decision rule: recognize when a workload is a straight line and a single loop beats any graph',
    ],
    skipQuiz: [
      {
        q: 'The mid-2026 slogan is "loops handle the work, graphs handle the loops." What does that actually mean?',
        options: [
          'Graphs replace loops entirely, because parallel execution makes iteration unnecessary',
          'Each node in the graph runs its own iterate-until-verified loop, while the graph decides which nodes run, in what order, and what flows between them',
          'Loops are for beginners and graphs are the advanced version of the same thing',
          'Graphs are a visualization layer drawn after the loops finish, for reporting',
        ],
        answer: 1,
        explain:
          'The two structures do different jobs. A loop is one worker iterating against a check until it passes. A graph is the coordination layer above the workers: it encodes which tasks depend on which, so independent work runs in parallel and dependent work waits its turn. Take away the loops and nothing gets done; take away the graph and the loops run one after another.',
      },
      {
        q: 'A task graph for agents is usually a DAG. What does the "acyclic" part buy you?',
        options: [
          'It guarantees the workflow can be drawn without crossing lines',
          'It makes every node run in parallel automatically',
          'With no cycles among nodes, there is always a valid execution order and the run is guaranteed to terminate; iteration happens inside a node, never as an arrow looping back',
          'It prevents any single node from being visited more than once per token',
        ],
        answer: 2,
        explain:
          'DAG stands for directed acyclic graph: arrows have direction and never form a circle. No circles means you can always sort the nodes into a runnable order, and the run provably ends. The iterate-until-done behavior you still need lives inside individual nodes as loops with stop conditions, which keeps "retry until the tests pass" from becoming "run forever."',
      },
      {
        q: 'In the diamond pattern, what does the reduce stage do?',
        options: [
          'It shrinks each worker prompt to save tokens before the fan-out',
          'It waits for ALL parallel workers to finish, then merges and dedupes their outputs into one artifact for the synthesis stage',
          'It cuts the number of workers in half each round until one remains',
          'It compresses the final report for storage',
        ],
        answer: 1,
        explain:
          'Reduce is the narrowing point of the diamond, a name borrowed from the MapReduce pattern in distributed computing. It acts as a barrier: nothing downstream starts until every fan-out worker reports in. Then it merges overlapping findings, drops duplicates, and hands one clean artifact to synthesis. Skipping it means the synthesizer drowns in four overlapping raw dumps.',
      },
      {
        q: 'A diamond has 4 parallel research workers (about 10 minutes each), then a reduce (2 min), then a synthesis (5 min). Roughly how long does the run take, and what do you pay for?',
        options: [
          'About 17 minutes of wall-clock, while paying tokens for all 6 nodes',
          'About 47 minutes, since agent work is always sequential under the hood',
          'About 10 minutes, because reduce and synthesis run during the research',
          'About 17 minutes, but you only pay for the slowest worker',
        ],
        answer: 0,
        explain:
          'Wall-clock time follows the critical path: the longest chain of dependent steps, here one worker (10) plus reduce (2) plus synthesis (5), about 17 minutes. The token bill follows total work: all four workers ran, so you pay for all four plus the two merge stages. Graphs buy time with money; the width is speed, and the width is also the bill.',
      },
      {
        q: 'Your workload is: migrate the database schema, THEN update the API to match, THEN update the UI to match the API. What orchestration does this deserve?',
        options: [
          'A three-worker diamond, since three tasks always mean three parallel agents',
          'A single loop working through the three steps in order, because each step depends on the previous one and a graph adds cost without adding speed',
          'An agent team with mailboxes, so the workers can negotiate the order',
          'A tournament pattern to find the best migration',
        ],
        answer: 1,
        explain:
          'Sketch the arrows first: schema feeds API feeds UI. A straight line has a critical path equal to the whole job, so parallel machinery cannot shorten it. One well-run loop with verification at each step does everything a graph would, without the coordination overhead or the multiplied token bill. Graphs earn their keep only when the sketch shows independent branches.',
      },
    ],
    sections: [
      {
        heading: 'Loops do the work, graphs coordinate the loops',
        blocks: [
          {
            type: 'text',
            md: "You have spent this module building loops: one agent iterating against a real check until it passes, from [Agents, Harnesses & Loops · Loop Engineering](lesson:m2-l3). You have also run parallel workers, from [Agents, Harnesses & Loops · Agent Teams & Dynamic Workflows](lesson:m2-l6). This lesson names the structure that connects those two ideas, because the naming turns out to matter: once you can draw the structure, you can reason about its speed and its cost before you spend a token.\n\nA **graph**, in this context, is a map of work. Each **node** is a unit of work: one agent running one loop with its own context, tools, and stop condition. Each **edge** is an arrow between nodes meaning 'this one needs that one's output before it can start'. Draw every task and every arrow and you have the whole workflow on one page.\n\nAgent workflows use a specific kind of graph: a **DAG**, short for [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph). Directed means the arrows point one way. Acyclic means the arrows never form a circle. That second property does real work: with no circles, the nodes can always be sorted into a valid running order, and the run is guaranteed to end. The iteration you still need (retry until the tests pass) lives *inside* a node as a loop with a stop condition, never as an arrow looping back to an earlier node. Keeping cycles inside nodes is what makes the whole thing debuggable.\n\nHence the slogan going around in mid-2026: **loops handle the work, graphs handle the loops**. A loop is a worker. A graph is the org chart above the workers, deciding who runs now, who waits, and what gets handed to whom.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'About those viral threads',
            md: "This topic travels the internet wrapped in fabricated authority. The threads that popularized 'graph engineering' open with quotes like an unnamed Anthropic engineer announcing that prompts are dead, or Jensen Huang declaring that nobody writes prompts anymore. Nobody said those things; the quotes are bait, invented to make a repackaged guide feel like insider knowledge. The tell: a dramatic quote with no link to a talk, paper, or transcript. The underlying material (DAG orchestration, fan-out, reduce) is real and worth learning, which is exactly what makes the format work. Take the substance, discard the framing, and check any quote against a primary source before repeating it. The high-signal versus low-signal source discipline in [The AI Transformation Playbook · Capstone Launch](lesson:m7-l3) is the general version of this rule.",
          },
        ],
      },
      {
        heading: 'The diamond: fan out, reduce, synthesize',
        blocks: [
          {
            type: 'text',
            md: "One graph shape covers most real agent workloads, and the guides call it the **diamond** because of how it looks drawn: one node opens up into several, and the several close back down into one.\n\nWalk it with a concrete job: 'evaluate whether we should adopt library X'. The **fan-out** stage splits the question into independent slices and gives each slice its own worker with its own fresh context: one reads the library's docs and changelog, one audits how the codebase currently solves the problem, one hunts for migration horror stories, one checks license and maintenance health. Independent is the load-bearing word. None of the four needs another's output, so all four run at once.\n\nThe **reduce** stage (the name comes from [MapReduce](https://en.wikipedia.org/wiki/MapReduce), the pattern that powered early big-data systems) waits for all four to finish, then merges their reports: duplicates dropped, contradictions flagged, everything normalized into one document. Reduce is a **barrier**: a checkpoint that refuses to let anything downstream start until every upstream worker has reported. Then the **synthesize** stage reads that one clean document and writes the actual deliverable, a recommendation with trade-offs.\n\nAdd one more node before you call it done: a **verifier** that checks the synthesis against the original question. The fan-out workers each verified their own slice inside their loops, but nobody has yet checked the assembled whole. A separate verifier node, with fresh eyes and no authorship pride, is the graph-scale version of the discipline from [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4).",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE DIAMOND: one question out, one verified answer back</text>
  <rect x="275" y="45" width="150" height="46" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="350" y="64" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">INTENT</text>
  <text x="350" y="82" fill="#a1a1aa" font-size="10" text-anchor="middle">"should we adopt library X?"</text>
  <line x1="310" y1="91" x2="105" y2="130" stroke="#52525b" stroke-width="2"/>
  <line x1="335" y1="91" x2="268" y2="130" stroke="#52525b" stroke-width="2"/>
  <line x1="365" y1="91" x2="432" y2="130" stroke="#52525b" stroke-width="2"/>
  <line x1="390" y1="91" x2="595" y2="130" stroke="#52525b" stroke-width="2"/>
  <rect x="30" y="132" width="150" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="105" y="155" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">W1: docs + changelog</text>
  <text x="105" y="173" fill="#a1a1aa" font-size="10" text-anchor="middle">own context, own loop</text>
  <rect x="193" y="132" width="150" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="268" y="155" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">W2: our codebase</text>
  <text x="268" y="173" fill="#a1a1aa" font-size="10" text-anchor="middle">own context, own loop</text>
  <rect x="357" y="132" width="150" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="432" y="155" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">W3: migration stories</text>
  <text x="432" y="173" fill="#a1a1aa" font-size="10" text-anchor="middle">own context, own loop</text>
  <rect x="520" y="132" width="150" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="595" y="155" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">W4: license + health</text>
  <text x="595" y="173" fill="#a1a1aa" font-size="10" text-anchor="middle">own context, own loop</text>
  <line x1="105" y1="188" x2="310" y2="228" stroke="#52525b" stroke-width="2"/>
  <line x1="268" y1="188" x2="335" y2="228" stroke="#52525b" stroke-width="2"/>
  <line x1="432" y1="188" x2="365" y2="228" stroke="#52525b" stroke-width="2"/>
  <line x1="595" y1="188" x2="390" y2="228" stroke="#52525b" stroke-width="2"/>
  <rect x="275" y="230" width="150" height="50" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/>
  <text x="350" y="251" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">REDUCE (barrier)</text>
  <text x="350" y="269" fill="#a1a1aa" font-size="10" text-anchor="middle">waits for ALL, merges + dedupes</text>
  <line x1="350" y1="280" x2="350" y2="296" stroke="#52525b" stroke-width="2"/>
  <polygon points="344,296 356,296 350,306" fill="#52525b"/>
  <rect x="275" y="306" width="150" height="42" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="350" y="324" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">SYNTHESIZE</text>
  <text x="350" y="340" fill="#a1a1aa" font-size="10" text-anchor="middle">one recommendation</text>
  <line x1="425" y1="327" x2="490" y2="327" stroke="#52525b" stroke-width="2"/>
  <polygon points="490,321 490,333 500,327" fill="#52525b"/>
  <rect x="500" y="306" width="170" height="42" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="585" y="324" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">VERIFY</text>
  <text x="585" y="340" fill="#a1a1aa" font-size="10" text-anchor="middle">fresh eyes vs the intent</text>
  <text x="350" y="378" fill="#e4e4e7" font-size="11" text-anchor="middle">Critical path (time): intent + slowest worker + reduce + synthesize + verify. Token bill: every node that ran.</text>
</svg>`,
            caption:
              'The diamond over a real question. Four independent workers run at once; the reduce barrier merges them; synthesis and a fresh-eyes verifier close it out.',
          },
          {
            type: 'text',
            md: "Two numbers fall straight out of the drawing, and being able to read them off before running anything is the payoff of this whole lesson.\n\nThe first is **wall-clock time**, set by the [critical path](https://en.wikipedia.org/wiki/Critical_path_method): the longest chain of dependent nodes from start to finish. In the diamond above that chain is intent, slowest worker, reduce, synthesize, verify. Adding a fifth parallel worker changes the time only if it becomes the new slowest one.\n\nThe second is the **token bill**, set by total work: every node that ran, including the four you paid for in parallel. This is the same linear-burn arithmetic from [Agents, Harnesses & Loops · Agent Teams & Dynamic Workflows](lesson:m2-l6), now visible in the picture. A graph trades money for time. Width makes it fast, and width is exactly what you pay for.\n\nOne practical note on where this runs. You already own two diamond executors: parallel subagents from [Claude Code Mastery · Subagents & Context Isolation](lesson:m1-l6) for the fan-out with the main session as reducer, or the `ultracode` keyword, which writes the whole graph as a JavaScript program you can read. Frameworks like [LangGraph](https://www.langchain.com/langgraph) exist for when a graph needs to live in production code rather than in a session, and their docs are where much of this vocabulary comes from.",
          },
        ],
      },
      {
        heading: 'State lives on the edges (and in files)',
        blocks: [
          {
            type: 'text',
            md: "What actually travels along an edge? An **artifact**: a concrete document one node wrote and the next node reads. W2's codebase audit arrives at the reduce node as a markdown file, and the synthesis leaves as another one. The viral threads sell this as 'a shared memory that never resets', which sounds mystical right up until you name the technology: a folder of files that outlives any single agent's context window.\n\nYou already learned why files win as agent state in [Agents, Harnesses & Loops · Agent Memory & State](lesson:m2-l7), and graphs raise the stakes on every reason. With five nodes running, the shared folder is the only place the whole truth exists; each node holds one slice in its context and no more. When a run dies halfway (and long runs die), the artifacts written so far are your restart point: rerun the dead node, keep everything upstream. And when the final answer looks wrong, you debug by reading the artifacts in order until you find the node where the reasoning went bad, the same way a stack trace walks you to the broken frame.\n\nThe practical rule: **every node ends by writing a file, and every edge is a file handoff**. A node that only 'reports back' in conversation leaves no artifact to restart from, no evidence to debug with, and nothing for a second reader to check.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why this beats one giant context',
            md: "You could try running the library evaluation in one long session instead: read the docs, then the codebase, then the forums, then decide. By the forum stage, the docs have been compacted into mush, and the context-rot arithmetic from [Mental Models · Context Engineering](lesson:m0-l4) is eating the decision quality. The graph sidesteps it structurally: each worker reads only its slice at full fidelity, and the synthesizer reads only four tight summaries. Nobody ever holds the whole mess at once, which is the entire trick.",
          },
        ],
      },
      {
        heading: 'Anatomy of a production node',
        blocks: [
          {
            type: 'text',
            md: "So far each node has been 'a Claude Code session with a job'. Worth seeing what a node looks like when it grows up and moves to production. LangChain's **managed deep agent** is the cleanest published anatomy: a hosted agent where you supply the business logic and the platform supplies the harness (the planning loop, filesystem, and subagent machinery) plus the runtime (sandboxes and scheduling). The design will feel familiar, because it is the same split this module has been teaching: the harness is a separate thing from the work you configure into it.\n\nTheir anatomy lists twelve parts, and eleven of them map one-to-one onto Claude Code pieces you have already built. Reading the mapping does two things for you: it proves your Claude Code skills transfer to production agent platforms nearly unchanged, and it hands you a checklist for speccing any agent node, on any platform, including the digital employees coming in the final module.",
          },
          {
            type: 'table',
            headers: ['Deep-agent part', 'What it holds', 'The Claude Code piece you already know'],
            rows: [
              ['agent.py', 'Model choice and core options', 'Model picker + settings.json'],
              ['instructions.md', 'The system prompt: role and behavior', 'CLAUDE.md'],
              ['skills/', 'Task playbooks loaded when relevant', '.claude/skills/ (same idea, same name)'],
              ['tools/ + connectors/', 'Functions it can call; remote MCP servers', 'Tools + MCP servers'],
              ['middleware/', 'Custom logic wrapping model and tool calls', 'Hooks'],
              ['sandbox/', 'Isolated filesystem and shell for its code', 'The sandboxed workspace / worktree isolation'],
              ['memory.py', 'Preferences and knowledge across sessions', 'Auto memory + memory files'],
              ['identity.py', 'Per-caller threads and credentials', '(No direct equivalent: multi-user serving)'],
              ['channels/', 'Where it talks: Slack and friends', 'Claude in Slack, unattended surfaces'],
              ['schedules/', 'Cron-style recurring runs', 'Scheduled tasks and /schedule'],
              ['evals/', 'Tests that grade the agent itself', 'Verification loops + skill evals'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Use it as a spec checklist',
            md: "Twelve boxes, one question each: what model, what instructions, which playbooks, which tools, what wraps the calls, where does it run, what does it remember, who is calling it, where does it talk, when does it wake up, and how is it graded? Any agent you can answer all eleven-plus-one questions for is specced. Any agent you cannot is a demo. Keep this list; it comes back when you write digital-employee job descriptions in [The AI Transformation Playbook · Where AI Belongs in a Business](lesson:m7-l4).",
          },
        ],
      },
      {
        heading: 'When not to build a graph',
        blocks: [
          {
            type: 'text',
            md: "The honest half of graph engineering is refusing to do it. The failure mode is real and common: someone learns the diamond, gets excited, and puts a five-node graph on a task that a single session finishes in twenty minutes. Now they have five contexts to pay for, five prompts to maintain, artifacts to schlep between nodes, and a distributed system to debug when the answer comes out wrong. All to parallelize work that had no parallelism in it.\n\nThe test costs one minute: **sketch the arrows before you spawn anything**. Write the subtasks, draw the dependencies. A drawing that comes out as a straight line means the critical path IS the whole job, and no graph on earth shortens it; run one loop. A drawing with genuinely independent branches, wide enough that the time saved matters, is a diamond candidate. A drawing too tangled to sketch usually means you do not understand the task yet, and no orchestration fixes that.",
          },
          {
            type: 'compare',
            left: {
              title: 'Graph earns its keep',
              items: [
                'Independent slices: research angles, review lenses, disjoint directories',
                'Work too big for one context even with compaction',
                'A verifier that must not share the builder’s context or its biases',
                'The same pipeline will run again next week (worth engineering once)',
              ],
            },
            right: {
              title: 'Run one loop instead',
              items: [
                'Each step needs the previous step’s output (a chain in disguise)',
                'The whole job fits one context with room to spare',
                'A one-off task: orchestration setup costs more than it saves',
                'You cannot yet write down what "done" means for each node',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The 5-to-10% claim, translated',
            md: "The viral guides claim most people use AI at 5 to 10% of its capacity, which is marketing arithmetic with a real observation buried inside: most people run every task, no matter its shape, as a single sequential chat. The workloads that were secretly diamonds (research, review, evaluation across independent slices) crawl through one context and come out mediocre. Graph engineering, stripped of its hype, is one habit: look at the shape of the work before choosing the shape of the run.",
          },
        ],
      },
    ],
    lab: {
      title: 'Draw the DAG, then run the diamond',
      intro:
        'Take one real, genuinely parallel question from your work, sketch its graph on paper first, then run it as a diamond and check whether the drawing predicted the run.',
      steps: [
        'Pick a real evaluation question you actually face (a library choice, a build-vs-buy call, a review across several areas). Confirm it splits into 3-4 slices where no slice needs another’s output.',
        'Sketch the DAG on paper or in Excalidraw: intent, workers, reduce, synthesize, verify. Mark the critical path and write your prediction: wall-clock time and rough token cost.',
        'Create a scratch folder for artifacts. Write intent.md: the question, the slices, and what "done" means for each worker.',
        'Run the fan-out: launch 3-4 parallel subagents (or prompt `ultracode` with your sketch and read the generated harness before approving). Require each worker to end by writing its own findings file.',
        'Run reduce + synthesize: a fresh session reads ONLY the findings files, merges and dedupes into merged.md, then writes recommendation.md.',
        'Run the verifier: another fresh session reads intent.md and recommendation.md, and answers one question: does the recommendation actually answer the intent? Log what it caught.',
        'Compare reality to your sketch: actual time vs predicted critical path, actual cost via /cost vs your guess, and whether the same job in one long session would have been good enough. Write the three-line verdict at the bottom of intent.md.',
      ],
      checklist: [
        'A hand-drawn DAG existed BEFORE any agent ran, with the critical path marked',
        'Every worker ended by writing an artifact file; no node reported only in conversation',
        'The reduce stage waited for all workers and produced one merged artifact',
        'A fresh-context verifier checked the final answer against intent.md',
        'Predicted vs actual time and cost are written down, plus the one-loop-would-have-sufficed verdict',
      ],
    },
    checkQuiz: [
      {
        q: 'In the managed deep agent anatomy, what does the platform provide versus what do you provide?',
        options: [
          'The platform provides the model weights; you provide the GPU time',
          'You provide instructions, skills, tools, and model choice; the platform provides the harness (planning loop, filesystem, subagents) and the runtime (sandboxes, scheduling)',
          'You provide the Python code for the loop; the platform provides only hosting',
          'The platform provides everything, including the business logic',
        ],
        answer: 1,
        explain:
          'The split is the same one this module keeps finding: business logic versus harness. You write what the agent should do and know; the platform runs the loop, the filesystem, the sandboxes, and the schedule. Which is also why your Claude Code experience transfers: you have been configuring exactly that kind of harness all along.',
      },
      {
        q: 'Why should every node in a task graph end by writing a file?',
        options: [
          'Files are cheaper than tokens under all pricing plans',
          'The artifacts are the shared state: they let a dead run restart from the last good node, give you evidence to debug node by node, and carry the handoff between contexts that never see each other',
          'The reduce stage can only read files, never conversation history',
          'Because DAGs technically require file output to remain acyclic',
        ],
        answer: 1,
        explain:
          'No node holds the whole picture in context, so the artifact folder is the only complete record of the run. Crash recovery, debugging, and handoffs all read from it. A node that only reported in conversation leaves nothing behind: no restart point, no evidence, no input for the next node.',
      },
      {
        q: 'A thread opens with "A Google engineer says prompts are obsolete" and no link, then teaches fan-out orchestration. The right read?',
        options: [
          'Discard the whole thread, since one fabrication poisons all of it',
          'Trust it, since the technique working proves the quote true',
          'Recognize the fabricated-authority format: an unverifiable quote as bait wrapped around real technique. Take the substance, drop the quote, and verify claims against primary sources like framework docs',
          'Repost it, but add your own disclaimer',
        ],
        answer: 2,
        explain:
          'The bait-plus-substance format is the standard shape of viral AI content in 2026. The orchestration material is usually repackaged from real framework docs, which means the docs themselves are the better source anyway. Verify quotes before repeating them; your credibility rides on it more than theirs does.',
      },
      {
        q: 'You add a fifth parallel worker to a diamond whose slowest existing worker takes 10 minutes. The new worker takes 4 minutes. What changes?',
        options: [
          'Wall-clock time drops, because more workers always means faster',
          'Wall-clock time stays the same (the critical path still runs through the 10-minute worker) while the token bill goes up by one worker',
          'The token bill stays flat because parallel work shares a context',
          'The reduce stage gets faster, since it now has more inputs',
        ],
        answer: 1,
        explain:
          'The critical path runs through the slowest chain, and a 4-minute worker on a parallel branch does not touch it. You paid for a fifth full context and saved zero minutes. Whether that trade makes sense depends entirely on whether the fifth slice adds information the synthesis actually needs.',
      },
    ],
    resources: [
      {
        label: 'LangChain - Managed Deep Agents overview (the node anatomy)',
        url: 'https://docs.langchain.com/langsmith/python/managed-deep-agents-overview',
        kind: 'docs',
      },
      {
        label: 'LangGraph - graph-based agent orchestration',
        url: 'https://www.langchain.com/langgraph',
        kind: 'docs',
      },
      {
        label: 'Anthropic - Building Effective Agents (parallelization + orchestrator-workers)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'MapReduce - where the reduce vocabulary comes from',
        url: 'https://en.wikipedia.org/wiki/MapReduce',
        kind: 'article',
      },
      {
        label: 'Anatomy of a managed deep agent (the thread that mapped it)',
        url: 'https://x.com/caspar_br/status/2088345102540587356',
        kind: 'thread',
      },
    ],
  },
]
