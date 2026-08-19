import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ------------------------------------------------------------------
  // m1-l6 — Subagents & Context Isolation
  // ------------------------------------------------------------------
  {
    id: 'm1-l6',
    title: 'Subagents & Context Isolation',
    day: 6,
    minutes: 45,
    xp: 100,
    objectives: [
      "Can explain when to delegate work to a subagent instead of doing it in the main context",
      "Can author a custom subagent in .claude/agents/*.md with the right frontmatter",
      "Can choose between Explore, Plan, general-purpose, /fork, and /btw for a given job",
      "Can resume and steer a running subagent with SendMessage and @agent-name",
    ],
    skipQuiz: [
      {
        q: "The core architectural payoff of delegating exploration to a subagent is:",
        options: [
          "It runs on a cheaper model, so exploration costs less",
          "The subagent burns its own context on file reads; only its conclusions return to your main session",
          "Subagents can read files the main session is not permitted to open",
          "Parallel subagents make the main session respond faster",
        ],
        answer: 1,
        explain: "Isolation is the point: 40k tokens of grep output and file dumps stay in the subagent's context. Your main session receives a short report, keeping its attention budget clean.",
      },
      {
        q: "What is distinctive about the built-in Explore and Plan subagents versus general-purpose?",
        options: [
          "They can edit files but not run Bash",
          "They persist their findings to auto memory automatically",
          "They are read-only and skip loading CLAUDE.md",
          "They always run on the largest available model",
        ],
        answer: 2,
        explain: "Explore and Plan are read-only searchers/architects and deliberately skip CLAUDE.md, so project instructions never bias raw investigation. General-purpose gets the full toolset.",
      },
      {
        q: "Which frontmatter setting gives a subagent its own isolated git checkout?",
        options: [
          "permissionMode: sandbox",
          "isolation: worktree",
          "background: true",
          "memory: project",
        ],
        answer: 1,
        explain: "isolation: worktree spins up a temporary git worktree so the agent edits an isolated copy of the repo, auto-cleaned if unchanged.",
      },
      {
        q: "As of mid-2026, how do subagents execute by default?",
        options: [
          "Synchronously — the main session blocks until the agent finishes",
          "In the background — you are notified when they complete",
          "Only one at a time, queued FIFO",
          "In a remote cloud sandbox",
        ],
        answer: 1,
        explain: "Background-by-default is the 2026 behavior. You keep working; pass run_in_background: false only when the result gates your next step.",
      },
      {
        q: "You want a quick side question answered without polluting or inheriting the current conversation. Which is correct?",
        options: [
          "/fork — it starts a context-free thread",
          "/btw — it asks a side question with zero shared context",
          "/branch — it creates a clean checkpoint",
          "/clear — it archives the session first",
        ],
        answer: 1,
        explain: "/btw is the context-free aside. /fork is the opposite trade: it inherits the full conversation history into a parallel thread.",
      },
    ],
    sections: [
      {
        heading: 'Why your main context must stay clean',
        blocks: [
          {
            type: 'text',
            md: "Context rot is quadratic: every token you stuff into a session degrades attention on every other token. Exploration is the worst offender — a single 'how does auth work here?' question can dump 40k tokens of file reads into your transcript. The fix is architectural, not disciplinary: **offload research and exploration to subagents**. The subagent burns its own context; only conclusions come back.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arr6" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/>
    </marker>
    <marker id="arr6b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#34d399"/>
    </marker>
  </defs>
  <rect x="30" y="110" width="185" height="120" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="122" y="145" fill="#e4e4e7" font-size="15" text-anchor="middle" font-weight="bold">Main session</text>
  <text x="122" y="170" fill="#a1a1aa" font-size="12" text-anchor="middle">plan + decisions</text>
  <text x="122" y="190" fill="#a1a1aa" font-size="12" text-anchor="middle">final diffs only</text>
  <rect x="465" y="25" width="205" height="80" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="567" y="55" fill="#e4e4e7" font-size="13" text-anchor="middle">Explore (read-only)</text>
  <text x="567" y="78" fill="#a1a1aa" font-size="11" text-anchor="middle">40k tokens of file reads die here</text>
  <rect x="465" y="130" width="205" height="80" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="567" y="160" fill="#e4e4e7" font-size="13" text-anchor="middle">Plan (architect)</text>
  <text x="567" y="183" fill="#a1a1aa" font-size="11" text-anchor="middle">weighs trade-offs off-stage</text>
  <rect x="465" y="235" width="205" height="80" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="567" y="265" fill="#e4e4e7" font-size="13" text-anchor="middle">custom: repo-archaeologist</text>
  <text x="567" y="288" fill="#a1a1aa" font-size="11" text-anchor="middle">git-log spelunking</text>
  <line x1="215" y1="140" x2="465" y2="65" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr6)"/>
  <line x1="215" y1="170" x2="465" y2="170" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr6)"/>
  <line x1="215" y1="200" x2="465" y2="275" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr6)"/>
  <text x="330" y="120" fill="#38bdf8" font-size="12">one task each</text>
  <line x1="465" y1="95" x2="220" y2="125" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arr6b)"/>
  <text x="330" y="230" fill="#34d399" font-size="12">conclusions only return</text>
</svg>`,
            caption: 'Delegation as context firewall: exploration tokens stay in the subagent; the main session gets a report.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'One task per subagent',
            md: "A subagent returns exactly one final message, then its context evaporates. Give it two tasks and the report muddles both, and you cannot course-correct mid-list. Scope each agent to a single question with a defined deliverable: 'find where rate limiting is enforced and report the call chain' — not 'investigate auth and also check the tests'.",
          },
        ],
      },
      {
        heading: 'Anatomy of a custom subagent',
        blocks: [
          {
            type: 'text',
            md: "Custom subagents live in `.claude/agents/*.md` (project scope) or `~/.claude/agents/` (user scope). The body is the agent's system prompt; the frontmatter is the contract. The `description` doubles as the trigger surface — Claude reads it to decide when to auto-delegate, so write it for the model, not for humans.",
          },
          {
            type: 'code',
            lang: 'markdown',
            code: `---
name: repo-archaeologist
description: Investigates how a subsystem works or why code is the way it is.
  Use for any question that requires reading more than three files or git history.
tools: Read, Grep, Glob, Bash
model: haiku
permissionMode: default
memory: project
background: true
isolation: worktree
skills:
  - code-review
mcpServers:
  github:
    type: http
    url: https://api.githubcopilot.com/mcp/
---
You are a codebase archaeologist. Answer the question you are given by
reading code and git history. Never propose changes. Your final message
must be under 300 words: direct answer first, then evidence with
absolute file paths and commit SHAs.`,
            caption: '.claude/agents/repo-archaeologist.md — the full 2026 frontmatter surface in one example.',
          },
          {
            type: 'table',
            headers: ['Frontmatter key', 'What it controls', 'Expert default'],
            rows: [
              ['name / description', 'Identity + auto-delegation trigger', 'Description written FOR the model'],
              ['tools', 'Tool allowlist', 'Read, Grep, Glob, Bash for investigators'],
              ['model', 'Backing model', 'haiku for search, inherit for reasoning'],
              ['permissionMode', 'Approval behavior inside the agent', 'default; never bypass for write agents'],
              ['memory', 'Memory scopes the agent loads', 'project for repo work'],
              ['background / isolation', 'Async execution / worktree checkout', 'background: true; worktree if it edits'],
              ['skills / mcpServers', 'Preloaded skills, inline MCP servers', 'Only what the task needs'],
            ],
          },
        ],
      },
      {
        heading: 'Built-ins, forks, and side questions',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Explore / Plan (built-in)',
              items: [
                'Read-only: cannot Edit, Write, or spawn agents',
                'Skip CLAUDE.md — unbiased investigation',
                'Explore: fan-out search, returns locations + conclusions',
                'Plan: architect; returns step-by-step implementation plans',
                'Cheap to spawn liberally',
              ],
            },
            right: {
              title: 'general-purpose / custom',
              items: [
                'Full toolset (or your frontmatter allowlist)',
                'Loads project context and memory scopes',
                'Can edit, run tests, use MCP tools',
                'Custom .md gives it a persona + hard rules',
                'Use when the task mutates state',
              ],
            },
          },
          {
            type: 'text',
            md: "The 2026 runtime behaviors worth knowing: subagents run **background by default**, can nest **5 levels deep**, and are **resumable** — send a follow-up to a finished or running agent via `SendMessage` with its ID or name, and it continues with context intact. Mention `@agent-name` in a prompt to route work to a specific defined agent. `/fork` clones your full conversation history into a parallel thread; `/btw` opens a context-free side question. Opposite tools — pick deliberately.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Do not double-spend',
            md: "Once you delegate a search, do not also run it yourself in the main session — that pays the context cost twice and defeats the isolation. Delegate, keep working on something independent, then read the report.",
          },
        ],
      },
    ],
    lab: {
      title: 'Build an investigator and put it to work',
      intro: "Define a real custom subagent for a repo you actually care about, then delegate an investigation you genuinely want answered — and verify the isolation payoff.",
      steps: [
        "Pick a repo with history. Create `.claude/agents/repo-archaeologist.md` using the lesson's template: read-only tools, `model: haiku`, `background: true`, a description written as a trigger, and a hard 300-word report format.",
        "Start a fresh session with `claude`. Confirm the agent is registered by asking: 'What custom agents are available in this project?'",
        "Delegate a real question: '@repo-archaeologist why does <some module> exist and what depends on it? Report the call chain with file paths.'",
        "While it runs in the background, keep working: ask the main session to draft a small unrelated change. Note that you are not blocked.",
        "When the report lands, send a follow-up to the SAME agent via its name ('dig one level deeper into the second dependency') and confirm it resumes with prior context.",
        "Compare: run `/context` (or eyeball the transcript) and confirm the main session contains the report, not the file dumps.",
      ],
      checklist: [
        "A custom agent file exists in .claude/agents/ with tools, model, and background frontmatter",
        "The agent auto-triggered or responded to an @agent-name mention",
        "You continued a finished agent with a follow-up and it retained its context",
        "The main session transcript contains conclusions only — no raw multi-file dumps",
        "You can state, in one sentence, when you would use /btw instead of /fork",
      ],
    },
    checkQuiz: [
      {
        q: "How deep can subagent nesting go in mid-2026 Claude Code?",
        options: ["2 levels", "3 levels", "5 levels", "Unlimited, bounded only by budget"],
        answer: 2,
        explain: "Subagents can spawn subagents down to depth 5 — enough for orchestrator → specialist → helper chains without runaway recursion.",
      },
      {
        q: "A background subagent finished an investigation but missed one edge. The context-preserving move is:",
        options: [
          "Spawn a new agent with the old report pasted in",
          "SendMessage to the same agent ID with the follow-up",
          "/fork the main session and re-ask there",
          "Re-run the agent with run_in_background: false",
        ],
        answer: 1,
        explain: "Agents are resumable: SendMessage with the agent's ID or name continues it with its full working context intact. A new Agent call starts from zero.",
      },
      {
        q: "Why does the one-task-per-subagent rule exist?",
        options: [
          "Multiple tasks exceed the subagent token limit",
          "The permission system rejects compound prompts",
          "The agent returns a single final report and cannot be steered mid-list, so bundled tasks blur the deliverable",
          "Nested agents inherit only the first task",
        ],
        answer: 2,
        explain: "You get one report back and no mid-flight steering (short of SendMessage after the fact). A single crisp question with a defined output format is the reliable contract.",
      },
      {
        q: "What does mentioning @repo-archaeologist in your prompt do?",
        options: [
          "Loads that agent's file into your main context as instructions",
          "Routes the request to that named agent as a delegation",
          "Makes the agent's tools available in the main session",
          "Pins the agent so it survives /clear",
        ],
        answer: 1,
        explain: "An @agent-name mention is explicit delegation — it targets the named agent directly instead of relying on description-based auto-selection.",
      },
    ],
    resources: [
      { label: 'Subagents — official docs', url: 'https://code.claude.com/docs/en/sub-agents', kind: 'docs' },
      { label: 'Effective Context Engineering for AI Agents (Anthropic)', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', kind: 'article' },
      { label: 'How we built our multi-agent research system (Anthropic)', url: 'https://www.anthropic.com/engineering/multi-agent-research-system', kind: 'article' },
      { label: 'everything-claude-code — dense config reference', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
      { label: 'Claude Code in Action (free course)', url: 'https://anthropic.skilljar.com/claude-code-in-action', kind: 'course' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l7 — MCP & Plugins
  // ------------------------------------------------------------------
  {
    id: 'm1-l7',
    title: 'MCP & Plugins',
    day: 7,
    minutes: 40,
    xp: 100,
    objectives: [
      "Can add, scope, and authenticate an MCP server with the right transport",
      "Can keep an MCP setup under context-hygiene limits and explain why tool search makes it survivable",
      "Can dissect a plugin's anatomy and install one from a marketplace",
      "Can apply the Cowork starter-pack pattern to non-coding knowledge work",
    ],
    skipQuiz: [
      {
        q: "Which MCP transport is deprecated as of 2026?",
        options: ["stdio", "HTTP", "SSE", "WebSocket"],
        answer: 2,
        explain: "SSE is deprecated. HTTP is the standard for remote servers; stdio remains for local processes. WebSocket was never an MCP transport.",
      },
      {
        q: "Tool search (on by default) saves context by:",
        options: [
          "Compressing tool schemas with a smaller model",
          "Deferring tool definitions — only names are known until a schema is fetched on demand",
          "Caching tool outputs across sessions",
          "Disabling MCP servers that have not been used recently",
        ],
        answer: 1,
        explain: "Deferred tools exist as names only; the full JSONSchema loads just-in-time via search. Dozens of servers no longer front-load thousands of schema tokens.",
      },
      {
        q: "The context-hygiene rule of thumb for MCP is:",
        options: [
          "Under 5 servers, under 40 tools",
          "Under 10 servers enabled, under 80 tools active",
          "Under 20 servers, tools unlimited since search defers them",
          "One server per project, always project-scoped",
        ],
        answer: 1,
        explain: "Fewer than 10 enabled servers and fewer than 80 active tools. Tool search softens the cost but does not eliminate it — names, channels, and prompts still occupy attention.",
      },
      {
        q: "Your team should all get the same MCP server when they clone the repo. Which scope?",
        options: [
          "local — stored in project settings",
          "user — stored in ~/.claude",
          "project — checked into .mcp.json",
          "managed — pushed by the org admin",
        ],
        answer: 2,
        explain: "Project scope writes .mcp.json at the repo root, versioned with the code. Local is your machine only; user follows you across projects.",
      },
      {
        q: "The Cowork starter pack pattern for knowledge work is:",
        options: [
          "One CLAUDE.md plus a vector database",
          "3 context files (about-me, company, writing style) + 7 knowledge-worker skills",
          "10 MCP connectors and no local files",
          "A single mega-skill with progressive disclosure",
        ],
        answer: 1,
        explain: "Three markdown context files that teach Claude who you are, plus seven reusable skills — the minimum viable personalization layer for non-coding work.",
      },
    ],
    sections: [
      {
        heading: 'MCP: the connectivity standard',
        blocks: [
          {
            type: 'text',
            md: "MCP is how Claude Code reaches everything that is not your filesystem: Linear, Postgres, Sentry, your internal APIs. One protocol, three decisions per server: **transport** (how it talks), **scope** (who gets it), **auth** (usually OAuth, negotiated via `/mcp`). Since 2026, servers can also open **channels** — push events into your session instead of waiting to be polled, so a CI failure can arrive mid-conversation.",
          },
          {
            type: 'table',
            headers: ['Decision', 'Options', 'Pick'],
            rows: [
              ['Transport', 'http, stdio (SSE deprecated)', 'http for remote services; stdio for local processes'],
              ['Scope', 'local, project, user', 'project (.mcp.json in repo) for team servers; user for personal daily drivers'],
              ['Auth', 'OAuth via /mcp, env-var tokens', 'OAuth — /mcp runs the browser flow and stores tokens'],
              ['Push', 'channels (server-initiated events)', 'Enable for CI, alerts, long-running jobs'],
            ],
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Remote HTTP server, shared with the team via .mcp.json
claude mcp add --transport http --scope project linear https://mcp.linear.app/mcp

# Local stdio server, just for you, across all projects
claude mcp add --scope user db -- npx -y @bytebase/dbhub --dsn "$DB_DSN"

# Authenticate, inspect, prune
/mcp        # OAuth flows + per-server enable/disable
claude mcp list`,
            caption: 'The full lifecycle: add with transport + scope, authenticate with /mcp, audit with list.',
          },
        ],
      },
      {
        heading: 'Tool search and the hygiene budget',
        blocks: [
          {
            type: 'text',
            md: "Pre-2026 advice said 'every MCP tool schema loads into context' — obsolete. **Tool search is on by default**: tools ship as deferred names, and full schemas are fetched just-in-time. That turns a 50-tool server from a context tax into a lookup. But names still occupy attention and bad servers ship noisy prompts, so the hygiene rule survives: **under 10 servers enabled, under 80 tools active**. Disable per-server in `/mcp` rather than uninstalling.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Audit ritual',
            md: "Monthly: run `/context` to see what MCP costs you, then `/mcp` and disable anything you have not used in two weeks. The best MCP setup is the one you notice only when it saves you a tab switch.",
          },
        ],
      },
      {
        heading: 'Plugins: distribution for everything',
        blocks: [
          {
            type: 'text',
            md: "A plugin is a tarball of capability: one `/plugin install` can deliver **skills** (commands merged into these in 2026), **agents**, **hooks**, an `.mcp.json` of servers, **LSP servers** for language intelligence, **monitors**, and a `bin/` of executables. Two official marketplaces matter: `claude-plugins-official` (Anthropic-maintained) and `claude-plugins-community`. Treat plugins like dependencies — read what they install, pin what you trust.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <rect x="40" y="30" width="620" height="260" fill="#27272a" stroke="#52525b" rx="10"/>
  <text x="70" y="62" fill="#e4e4e7" font-size="16" font-weight="bold">my-plugin/</text>
  <text x="560" y="62" fill="#a1a1aa" font-size="12">.claude-plugin/plugin.json</text>
  <rect x="70" y="85" width="180" height="52" fill="#18181b" stroke="#38bdf8" rx="6"/>
  <text x="160" y="107" fill="#38bdf8" font-size="13" text-anchor="middle">skills/</text>
  <text x="160" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">SKILL.md bundles + commands</text>
  <rect x="262" y="85" width="180" height="52" fill="#18181b" stroke="#a78bfa" rx="6"/>
  <text x="352" y="107" fill="#a78bfa" font-size="13" text-anchor="middle">agents/</text>
  <text x="352" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">subagent definitions</text>
  <rect x="454" y="85" width="180" height="52" fill="#18181b" stroke="#f472b6" rx="6"/>
  <text x="544" y="107" fill="#f472b6" font-size="13" text-anchor="middle">hooks/</text>
  <text x="544" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">lifecycle automation</text>
  <rect x="70" y="155" width="180" height="52" fill="#18181b" stroke="#34d399" rx="6"/>
  <text x="160" y="177" fill="#34d399" font-size="13" text-anchor="middle">.mcp.json</text>
  <text x="160" y="196" fill="#a1a1aa" font-size="11" text-anchor="middle">bundled MCP servers</text>
  <rect x="262" y="155" width="180" height="52" fill="#18181b" stroke="#fbbf24" rx="6"/>
  <text x="352" y="177" fill="#fbbf24" font-size="13" text-anchor="middle">lsp/</text>
  <text x="352" y="196" fill="#a1a1aa" font-size="11" text-anchor="middle">language servers</text>
  <rect x="454" y="155" width="180" height="52" fill="#18181b" stroke="#38bdf8" rx="6"/>
  <text x="544" y="177" fill="#38bdf8" font-size="13" text-anchor="middle">monitors/</text>
  <text x="544" y="196" fill="#a1a1aa" font-size="11" text-anchor="middle">watchers + dashboards</text>
  <rect x="70" y="225" width="180" height="45" fill="#18181b" stroke="#52525b" rx="6"/>
  <text x="160" y="252" fill="#e4e4e7" font-size="13" text-anchor="middle">bin/ executables</text>
  <text x="350" y="252" fill="#a1a1aa" font-size="12">one install, seven capability surfaces</text>
</svg>`,
            caption: 'Plugin anatomy: a single install can ship skills, agents, hooks, MCP servers, LSP, monitors, and binaries.',
          },
          {
            type: 'compare',
            left: {
              title: 'Dev plugins (marketplaces)',
              items: [
                'claude-plugins-official: vetted, Anthropic-maintained',
                'claude-plugins-community: broader, review before install',
                'Typical payload: review skills, hooks, CI agents',
                'Install: /plugin marketplace add, then /plugin install',
              ],
            },
            right: {
              title: 'Cowork plugins (knowledge work)',
              items: [
                'knowledge-work-plugins repo: legal, sales, marketing, PM packs',
                'Starter pack pattern: 3 context files + 7 skills',
                'Context files: about-me, my-company, writing style',
                'Same plugin format — Claude is not just for code',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'One great server, zero dead weight',
      intro: "Wire up one MCP server you will actually use daily, prune everything else against the hygiene budget, and install one plugin with full knowledge of what it ships.",
      steps: [
        "Inventory first: run `claude mcp list` and `/context` in a session. Write down your server count and rough token cost.",
        "Add ONE genuinely useful server with a deliberate scope, e.g. `claude mcp add --transport http --scope user linear https://mcp.linear.app/mcp` (or GitHub, Sentry, your DB — whatever you touch daily).",
        "Run `/mcp`, complete the OAuth flow, and confirm the server shows as connected.",
        "Prune: in `/mcp`, disable every server you have not used in two weeks. Target: under 10 enabled, under 80 active tools.",
        "Add a marketplace and browse: `/plugin marketplace add anthropics/claude-plugins-official` then `/plugin` to explore.",
        "Before installing one plugin, read its repo: what skills, hooks, agents, and MCP servers does it ship? Then install and trigger one of its skills.",
        "Re-run `/context` and compare against your step-1 baseline. You should be net leaner despite the additions.",
      ],
      checklist: [
        "One new MCP server is connected, authenticated via /mcp, and scoped deliberately",
        "Enabled servers < 10 and active tools < 80 after pruning",
        "You can name everything your installed plugin added (skills / agents / hooks / servers)",
        "The plugin's skill actually triggered on a real task",
        "Context cost after the lab is at or below the baseline you recorded",
      ],
    },
    checkQuiz: [
      {
        q: "How does OAuth authentication for a remote MCP server happen in Claude Code?",
        options: [
          "You paste a bearer token into .mcp.json",
          "The /mcp command runs the browser OAuth flow and stores tokens",
          "The server prompts on first tool call via stdio",
          "You export ANTHROPIC_MCP_TOKEN before launching",
        ],
        answer: 1,
        explain: "/mcp is the auth surface: it lists servers, launches the OAuth browser flow, and manages stored credentials per server.",
      },
      {
        q: "MCP channels changed the interaction model because servers can now:",
        options: [
          "Stream partial tool results token by token",
          "Push events into your session without being polled",
          "Share context windows with other servers",
          "Execute tools on a schedule without a session",
        ],
        answer: 1,
        explain: "Channels are server-initiated push — a CI failure or alert can land in your session in real time instead of waiting for you to ask.",
      },
      {
        q: "Which is NOT something a plugin can ship?",
        options: [
          "LSP servers and monitors",
          "Hooks and a bin/ of executables",
          "An .mcp.json bundle of MCP servers",
          "Model weights that override the session model",
        ],
        answer: 3,
        explain: "Plugins bundle skills, commands, agents, hooks, MCP servers, LSP servers, monitors, and binaries — capability, not models.",
      },
      {
        q: "In the Cowork starter pack, the three context files exist to:",
        options: [
          "Replace CLAUDE.md entirely for coding projects",
          "Teach Claude your identity, company, and writing voice so every skill output is personalized",
          "Cache MCP schemas locally to save tokens",
          "Define the plugin manifest for marketplaces",
        ],
        answer: 1,
        explain: "about-me, my-company, and writing-style files are standing context — the seven skills read them, so drafts come out in your voice with your facts.",
      },
    ],
    resources: [
      { label: 'MCP in Claude Code — official docs', url: 'https://code.claude.com/docs/en/mcp', kind: 'docs' },
      { label: 'Model Context Protocol specification', url: 'https://modelcontextprotocol.io', kind: 'docs' },
      { label: 'Plugins — official docs', url: 'https://code.claude.com/docs/en/plugins', kind: 'docs' },
      { label: 'knowledge-work-plugins (Anthropic)', url: 'https://github.com/anthropics/knowledge-work-plugins', kind: 'repo' },
      { label: 'Cowork starter pack (Craig Hewitt)', url: 'https://github.com/TheCraigHewitt/cowork-starter-pack', kind: 'repo' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l8 — Power Features
  // ------------------------------------------------------------------
  {
    id: 'm1-l8',
    title: 'Power Features',
    day: 7,
    minutes: 45,
    xp: 100,
    objectives: [
      "Can run 3+ parallel Claude sessions on one repo with git worktrees",
      "Can automate recurring work with /loop, /schedule, and hosted Routines",
      "Can pick the right surface — headless, Actions, Slack, Chrome, computer use — for a given loop",
      "Can branch and teleport sessions instead of restarting them",
    ],
    skipQuiz: [
      {
        q: "Boris Cherny's parallel-session pattern uses git worktrees at what scale?",
        options: [
          "1 worktree per branch, sessions run sequentially",
          "3-5 worktrees, each with its own Claude session",
          "10+ worktrees managed by an orchestrator agent",
          "2 worktrees: one for code, one for tests",
        ],
        answer: 1,
        explain: "The creator of Claude Code runs 3-5 worktrees, each an isolated checkout sharing one .git, each hosting its own session. Beyond ~5, supervision becomes the bottleneck.",
      },
      {
        q: "What does --teleport do?",
        options: [
          "Moves a session to a remote sandbox for unattended execution",
          "Continues a session across devices — start on the laptop, pick up on the desktop",
          "Jumps the conversation back to an earlier checkpoint",
          "Transfers a session to a teammate's account",
        ],
        answer: 1,
        explain: "--teleport is cross-device session continuity. Checkpoint rewind is a different feature; remote execution is the cloud sandbox.",
      },
      {
        q: "/batch is the right tool when you want to:",
        options: [
          "Queue prompts to run sequentially overnight",
          "Fan one task out across many inputs in parallel — e.g. fix the same bug pattern in 20 files",
          "Combine several sessions into one transcript",
          "Send multiple API requests at the 50%-off batch rate",
        ],
        answer: 1,
        explain: "/batch is fan-out: one instruction, many targets, parallel execution. API batch pricing is unrelated to this interactive command.",
      },
      {
        q: "The canonical headless invocation for CI is:",
        options: [
          "claude --headless --json",
          "claude -p \"prompt\" --output-format json",
          "claude run --ci --quiet",
          "claude --batch --no-tty",
        ],
        answer: 1,
        explain: "claude -p runs one-shot without the interactive TUI; --output-format json makes the result machine-parseable for pipelines.",
      },
      {
        q: "The Chrome extension's core value in a dev loop is:",
        options: [
          "Letting Claude browse documentation faster than WebFetch",
          "Closing the frontend loop — Claude drives the real browser, sees the real DOM, and verifies its own UI changes",
          "Recording your clicks as reusable skills",
          "Syncing cookies so headless runs stay authenticated",
        ],
        answer: 1,
        explain: "It turns UI work into a verifiable loop: change code, drive the actual browser, read the DOM and console, fix, repeat — no more 'looks right to me' guesses.",
      },
    ],
    sections: [
      {
        heading: 'Worktrees: parallelism without chaos',
        blocks: [
          {
            type: 'text',
            md: "One repo, several isolated checkouts, one shared `.git`. Each worktree gets its own Claude session with its own context and its own branch — no file collisions, no context bleed. This is the single highest-leverage habit from Boris Cherny's team tips: while one session implements a feature, another fixes a flaky test, another writes docs. Your job shifts from typing to supervising.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arr8" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#fbbf24"/>
    </marker>
  </defs>
  <rect x="250" y="25" width="200" height="60" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="350" y="50" fill="#e4e4e7" font-size="15" text-anchor="middle" font-weight="bold">myapp/.git</text>
  <text x="350" y="72" fill="#a1a1aa" font-size="12" text-anchor="middle">one shared object store</text>
  <line x1="300" y1="85" x2="135" y2="150" stroke="#fbbf24" stroke-width="2" marker-end="url(#arr8)"/>
  <line x1="350" y1="85" x2="350" y2="150" stroke="#fbbf24" stroke-width="2" marker-end="url(#arr8)"/>
  <line x1="400" y1="85" x2="565" y2="150" stroke="#fbbf24" stroke-width="2" marker-end="url(#arr8)"/>
  <rect x="30" y="155" width="210" height="105" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="135" y="182" fill="#38bdf8" font-size="13" text-anchor="middle">../myapp-auth</text>
  <text x="135" y="204" fill="#a1a1aa" font-size="11" text-anchor="middle">branch: feat/auth</text>
  <text x="135" y="230" fill="#e4e4e7" font-size="12" text-anchor="middle">claude: implement OAuth</text>
  <rect x="245" y="155" width="210" height="105" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="350" y="182" fill="#a78bfa" font-size="13" text-anchor="middle">../myapp-flaky</text>
  <text x="350" y="204" fill="#a1a1aa" font-size="11" text-anchor="middle">branch: fix/flaky-e2e</text>
  <text x="350" y="230" fill="#e4e4e7" font-size="12" text-anchor="middle">claude: deflake test suite</text>
  <rect x="460" y="155" width="210" height="105" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="565" y="182" fill="#34d399" font-size="13" text-anchor="middle">../myapp-docs</text>
  <text x="565" y="204" fill="#a1a1aa" font-size="11" text-anchor="middle">branch: docs/api</text>
  <text x="565" y="230" fill="#e4e4e7" font-size="12" text-anchor="middle">claude: regenerate docs</text>
  <text x="350" y="300" fill="#a1a1aa" font-size="12" text-anchor="middle">3-5 sessions in parallel - you review diffs, sessions do the typing</text>
</svg>`,
            caption: "One .git, three checkouts, three concurrent sessions. Cherny's daily driver.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `git worktree add ../myapp-auth  -b feat/auth
git worktree add ../myapp-flaky -b fix/flaky-e2e
cd ../myapp-auth  && claude   # terminal tab 1
cd ../myapp-flaky && claude   # terminal tab 2
git worktree list             # audit; remove with: git worktree remove ../myapp-auth`,
            caption: 'Two parallel sessions in four commands. Each session sees only its own checkout.',
          },
        ],
      },
      {
        heading: 'Automation: loops, schedules, fan-out',
        blocks: [
          {
            type: 'table',
            headers: ['Feature', 'What it does', 'Reach for it when'],
            rows: [
              ['/loop', 'Re-runs a prompt or skill on an interval (or self-paced) in-session', 'Poll a deploy, babysit PRs, keep retrying until CI is green'],
              ['/schedule + Routines', 'Hosted scheduled agents on a cron — run without your laptop', 'Nightly dependency audit, Monday-morning triage report'],
              ['/batch', 'Fans one instruction across many inputs in parallel', 'Same refactor across 20 files; triage every open issue'],
              ['/branch, --fork-session', 'Forks the session so you can explore an alternative', 'Try approach B without losing approach A'],
              ['--teleport', 'Continues a session on another device', 'Start at the desk, finish on the couch'],
              ['/voice', 'Voice input for driving sessions', 'Dictating long specs; hands-free supervision'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Loops without stop conditions bill you in your sleep',
            md: "Every /loop and Routine needs three things: a REAL check (test exit code, HTTP 200, file exists), a stop condition, and a budget. 'Keep improving the code' is not a loop; it is an open tab on your credit card.",
          },
        ],
      },
      {
        heading: 'Beyond the terminal',
        blocks: [
          {
            type: 'text',
            md: "The same engine runs on five other surfaces. **Headless**: `claude -p` with `--output-format json` embeds Claude in CI and scripts. **GitHub Actions**: `@claude` on issues and PRs via claude-code-action. **Slack**: paste a bug thread, get a fix PR — customer context flows straight into a session. **Chrome extension**: Claude drives your real browser for frontend verify loops. **Computer use** (macOS research preview): full write → compile → launch → click → fix loops on native apps.",
          },
          {
            type: 'compare',
            left: {
              title: 'Interactive surfaces',
              items: [
                'Terminal TUI: the default; richest control',
                'Chrome extension: sees real DOM + console for UI loops',
                'Computer use: clicks native macOS apps it just compiled',
                '/voice: dictation for specs and steering',
              ],
            },
            right: {
              title: 'Unattended surfaces',
              items: [
                'claude -p + --output-format json: CI and shell pipelines',
                'GitHub Actions: @claude fixes issues, reviews PRs',
                'Routines: hosted cron agents, laptop closed',
                'Slack: bug threads become sessions with context attached',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Parallel sessions + one standing automation',
      intro: "Run two real worktree sessions concurrently on one repo, then set up one automation that outlives the session.",
      steps: [
        "In a real repo: `git worktree add ../<repo>-taskA -b feat/task-a` and `git worktree add ../<repo>-taskB -b chore/task-b`.",
        "Open two terminal tabs, `cd` into each worktree, start `claude` in both. Give each ONE scoped task (e.g. a small feature in A, test cleanup in B).",
        "While both run, practice supervision: alternate tabs, review diffs as they land, course-correct with short messages. Do not write code yourself.",
        "When one finishes, verify its work (run the tests in that worktree), then commit on its branch.",
        "Set up one automation. Either: `/loop 10m` with a prompt that checks something real ('run npm test; if it fails, fix the failure; stop when green twice in a row') — or `/schedule` a Routine (e.g. weekday 8am: 'audit deps for CVEs, open an issue if any are high severity').",
        "Confirm the automation fired at least once and that its stop condition or cron is what you intended.",
        "Clean up: `git worktree remove` both checkouts after merging or abandoning.",
      ],
      checklist: [
        "Two Claude sessions ran concurrently in separate worktrees on one repo",
        "Neither session touched the other's files or branch",
        "You reviewed and committed at least one session's work after verifying it",
        "A /loop or /schedule automation exists with a real check AND an explicit stop condition or budget",
        "The automation executed at least once and you inspected its output",
        "Worktrees were removed cleanly with git worktree remove",
      ],
    },
    checkQuiz: [
      {
        q: "/loop vs /schedule — the correct split is:",
        options: [
          "/loop is hosted in the cloud; /schedule runs locally",
          "/loop repeats in-session on an interval; /schedule creates hosted Routines on a cron that run without your machine",
          "They are aliases; /schedule adds a time argument",
          "/loop is for skills only; /schedule is for raw prompts only",
        ],
        answer: 1,
        explain: "/loop is a recurring in-session runner (great for polling and babysitting). /schedule provisions Routines — cloud-hosted scheduled agents that fire even with your laptop closed.",
      },
      {
        q: "The computer-use research preview matters for development because Claude can:",
        options: [
          "Control your terminal faster than Bash",
          "Write code, compile it, launch the native app, click through it, and fix what it sees — a closed verification loop",
          "Watch you work and generate skills from your clicks",
          "Run macOS VMs inside the sandbox",
        ],
        answer: 1,
        explain: "The preview closes the loop for native apps: write → compile → launch → click → fix. Verification stops depending on you being the test harness.",
      },
      {
        q: "You are mid-session and want to try a risky alternative approach without losing your current thread. Best move:",
        options: [
          "/clear and describe both approaches from scratch",
          "/branch (or resume with --fork-session) to explore in a parallel copy of the session",
          "--teleport to a second device and diverge there",
          "/batch the two approaches as parallel inputs",
        ],
        answer: 1,
        explain: "Session branching forks the conversation state: the original thread stays intact while you explore. Teleport moves a session; it does not duplicate it.",
      },
      {
        q: "The Slack integration's killer workflow per Cherny's team tips is:",
        options: [
          "Posting daily standup summaries to a channel",
          "Pasting a customer bug thread so the session starts with full reproduction context",
          "Approving permission prompts from your phone",
          "Broadcasting session transcripts for team review",
        ],
        answer: 1,
        explain: "Bug threads carry reproduction steps, stack traces, and customer impact. Pasting the thread hands Claude that context intact — no manual re-summarization.",
      },
    ],
    resources: [
      { label: 'Claude Code Best Practices (Anthropic)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
      { label: 'Boris Cherny — team tips & hidden features threads', url: 'https://x.com/bcherny', kind: 'thread' },
      { label: 'GitHub Actions integration — official docs', url: 'https://code.claude.com/docs/en/github-actions', kind: 'docs' },
      { label: 'claude-code-action (Anthropic)', url: 'https://github.com/anthropics/claude-code-action', kind: 'repo' },
      { label: 'Headless mode — official docs', url: 'https://code.claude.com/docs/en/headless', kind: 'docs' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l9 — The Best-Practices Workflow
  // ------------------------------------------------------------------
  {
    id: 'm1-l9',
    title: 'The Best-Practices Workflow',
    day: 8,
    minutes: 50,
    xp: 100,
    objectives: [
      "Can run a feature through the full explore → plan → implement → verify → commit loop",
      "Can pick the right rung on the verification escalation ladder for a task's stakes",
      "Can recognize and name the five failure patterns before they cost an afternoon",
      "Can deploy an adversarial review subagent before declaring work done",
    ],
    skipQuiz: [
      {
        q: "The canonical loop starts with explore — not plan — because:",
        options: [
          "Plan mode cannot run until files are indexed",
          "Plans written before reading the code encode wrong assumptions that implementation then faithfully executes",
          "Exploration warms the prompt cache, cutting costs",
          "CLAUDE.md is only loaded during exploration",
        ],
        answer: 1,
        explain: "A plan is only as good as its model of the codebase. Explore first — ideally via subagents — so the plan is grounded in what the code actually does.",
      },
      {
        q: "You have corrected Claude on the same task more than twice. Best practice says:",
        options: [
          "Switch to a larger model and correct once more",
          "Add the corrections to CLAUDE.md and continue",
          "/clear and re-prompt with a better initial prompt that encodes what you learned",
          "Open a /fork and let both attempts race",
        ],
        answer: 2,
        explain: "More than 2 corrections signals a poisoned context: the failed attempts keep biasing generation. Fold the lessons into a better prompt and start clean.",
      },
      {
        q: "The FIRST rung of the verification escalation ladder is:",
        options: [
          "A Stop hook that blocks completion",
          "Asking for verification in the same prompt ('run the tests and show me output')",
          "A dedicated verification subagent",
          "/goal tracking a persistent success criterion",
        ],
        answer: 1,
        explain: "The ladder escalates by stakes: same-prompt check → /goal → Stop hook → verification subagent. Start cheap; climb when failures get expensive.",
      },
      {
        q: "The interview pattern ends with:",
        options: [
          "Claude implementing directly once questions run out",
          "A SPEC.md written from the Q&A, then a FRESH session that implements from the spec",
          "An ADR committed alongside the code",
          "A /branch per open question",
        ],
        answer: 1,
        explain: "Interview → SPEC.md → fresh session. The interview's meandering context would pollute implementation; the spec carries only the distilled decisions forward.",
      },
      {
        q: "A 26,000-line CLAUDE.md is cited in the field as:",
        options: [
          "A best practice for large monorepos",
          "An anti-pattern — over-specification buries signal and rots as code changes",
          "Fine, since CLAUDE.md is cached and free after first load",
          "Only a problem below 200k context windows",
        ],
        answer: 1,
        explain: "systematicls flags it as the canonical over-specified CLAUDE.md. Every line competes for attention; most of 26k lines is noise the model must ignore. Keep it under ~200 lines.",
      },
    ],
    sections: [
      {
        heading: 'The canonical loop',
        blocks: [
          {
            type: 'text',
            md: "Everything in this module compresses into one loop: **explore → plan → implement → verify → commit**. Explore with subagents so research does not pollute the session. Plan in plan mode — hit **Ctrl+G** to pop the plan into your editor and rewrite it; editing the plan is the highest-leverage keystroke in the tool. Implement against the approved plan. Verify with a binary signal. Commit only what passed.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arr9" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/>
    </marker>
    <marker id="arr9r" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#f472b6"/>
    </marker>
  </defs>
  <rect x="20" y="110" width="110" height="60" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="75" y="137" fill="#e4e4e7" font-size="13" text-anchor="middle">EXPLORE</text>
  <text x="75" y="156" fill="#a1a1aa" font-size="10" text-anchor="middle">subagents</text>
  <rect x="155" y="110" width="110" height="60" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="210" y="137" fill="#e4e4e7" font-size="13" text-anchor="middle">PLAN</text>
  <text x="210" y="156" fill="#a1a1aa" font-size="10" text-anchor="middle">Ctrl+G to edit</text>
  <rect x="290" y="110" width="110" height="60" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="345" y="137" fill="#e4e4e7" font-size="13" text-anchor="middle">IMPLEMENT</text>
  <text x="345" y="156" fill="#a1a1aa" font-size="10" text-anchor="middle">against the plan</text>
  <rect x="425" y="110" width="110" height="60" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="480" y="137" fill="#e4e4e7" font-size="13" text-anchor="middle">VERIFY</text>
  <text x="480" y="156" fill="#a1a1aa" font-size="10" text-anchor="middle">binary signal</text>
  <rect x="560" y="110" width="110" height="60" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="615" y="137" fill="#e4e4e7" font-size="13" text-anchor="middle">COMMIT</text>
  <text x="615" y="156" fill="#a1a1aa" font-size="10" text-anchor="middle">only what passed</text>
  <line x1="130" y1="140" x2="155" y2="140" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr9)"/>
  <line x1="265" y1="140" x2="290" y2="140" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr9)"/>
  <line x1="400" y1="140" x2="425" y2="140" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr9)"/>
  <line x1="535" y1="140" x2="560" y2="140" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr9)"/>
  <path d="M 480 110 Q 480 45 350 45 Q 345 45 345 105" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arr9r)"/>
  <text x="412" y="35" fill="#f472b6" font-size="11" text-anchor="middle">fail: fix and re-verify</text>
  <rect x="415" y="215" width="130" height="50" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="480" y="236" fill="#f472b6" font-size="11" text-anchor="middle">adversarial review</text>
  <text x="480" y="253" fill="#a1a1aa" font-size="10" text-anchor="middle">fresh-context refuter</text>
  <line x1="480" y1="170" x2="480" y2="215" stroke="#f472b6" stroke-width="2" marker-end="url(#arr9r)"/>
</svg>`,
            caption: 'The canonical loop, with the verify-fail feedback edge and the adversarial gate before commit.',
          },
          {
            type: 'table',
            headers: ['Rung', 'Mechanism', 'Cost', 'Use when'],
            rows: [
              ['1. Same-prompt check', "Append: 'run the tests and paste the output'", 'Free', 'Small, low-stakes changes'],
              ['2. /goal', 'Persistent success criterion tracked across the session', 'Trivial', 'Multi-turn tasks that drift'],
              ['3. Stop hook', 'Exit-2 handler blocks the done claim until checks pass', 'One-time setup', "Repos where 'done but broken' has burned you"],
              ['4. Verification subagent', 'Fresh-context agent independently re-verifies the claim', 'One extra agent run', 'High-stakes or hard-to-check work'],
            ],
          },
        ],
      },
      {
        heading: 'Interview → SPEC.md → fresh session',
        blocks: [
          {
            type: 'text',
            md: "For anything non-trivial, do not prompt-and-pray. Run the **interview pattern**: tell Claude to interrogate you before writing anything — 'Interview me about this feature using AskUserQuestion until requirements are unambiguous. Never assume. Never infer. Then write SPEC.md.' Review the spec like a PR. Then `/clear` and implement from the spec in a fresh session. The interview's exploratory noise stays behind; only distilled decisions cross over.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Karpathy, to his agents',
            md: "*Accuracy is your success metric, not my approval.* The interview pattern operationalizes this: force disagreement and clarification up front, where it is cheap — not during review, where it is expensive.",
          },
        ],
      },
      {
        heading: 'Named failure patterns',
        blocks: [
          {
            type: 'table',
            headers: ['Pattern', 'Smell', 'Fix'],
            rows: [
              ['Kitchen-sink session', 'One session juggling five unrelated tasks; quality sags', '/clear between tasks; one session, one objective'],
              ['Correcting-over-and-over', 'Third correction on the same task; each retry worse', '>2 corrections → /clear + rewrite the prompt with what you learned'],
              ['Over-specified CLAUDE.md', 'Hundreds of rules; the 26k-line monster; model ignores most', 'Under ~200 lines; move detail to skills and .claude/rules/ with paths'],
              ['Trust-then-verify gap', "Accepting 'done, tests pass' without seeing output", 'Demand pasted output; escalate the verification ladder'],
              ['Infinite exploration', 'Agent reads files for 20 minutes, never commits to a plan', 'Timebox: explore via subagents with a defined deliverable'],
            ],
          },
          {
            type: 'compare',
            left: {
              title: 'Barebones discipline (systematicls)',
              items: [
                'Short CLAUDE.md, few plugins, minimal MCP',
                'Contracts with acceptance criteria per task',
                'Session isolation: research and implementation apart',
                'Neutral prompts: report situations, not find bugs',
                'Verification blocks completion — always',
              ],
            },
            right: {
              title: 'Config maximalism (the trap)',
              items: [
                '26,000-line CLAUDE.md nobody maintains',
                'Plugin sprawl: 30 servers, 400 deferred tools',
                'Every hook event wired to something',
                'Rules that fight each other silently',
                'Setup time exceeds time saved',
              ],
            },
          },
          {
            type: 'text',
            md: "The counterpoint matters: the practitioners shipping the most with agents run **barebones setups with ruthless verification**, not maximal config. Every rule, hook, and server must pay rent in attention. When in doubt, delete it and see if anything breaks.",
          },
        ],
      },
      {
        heading: 'The adversarial gate',
        blocks: [
          {
            type: 'text',
            md: "Before calling any work done, spawn an **adversarial review subagent**: fresh context, no CLAUDE.md sympathy, prompted to refute — 'Here is a diff and its claim. Find concrete reasons the claim is false: unhandled edges, broken invariants, missing tests. Report situations discovered with file:line evidence.' The implementing session grades its own homework; the adversary does not. Neutral phrasing beats 'find bugs', which pressures the model to invent them.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why fresh context is the whole trick',
            md: "The implementing session believes its own claim — its context is saturated with reasons the code is right. A reviewer with zero shared context has no such prior. Same model, different context, opposite incentives: that asymmetry is what catches the bug.",
          },
        ],
      },
    ],
    lab: {
      title: 'One feature, full discipline',
      intro: "Take one real, small feature end-to-end through the canonical loop — with a spec, a verification signal, and an adversarial pass. This is the workflow you will reuse for the rest of the curriculum.",
      steps: [
        "Pick a small but real feature in one of your repos (an endpoint, a CLI flag, a UI state). Start a fresh session.",
        "Interview: 'Interview me about this feature until requirements are unambiguous. Never assume. Never infer. Then write SPEC.md with acceptance criteria.' Answer honestly; edit SPEC.md by hand after.",
        "/clear. In the fresh session: 'Read SPEC.md. Explore the relevant code using subagents, then enter plan mode and propose an implementation plan.'",
        "Review the plan with Ctrl+G in your editor. Cut anything speculative. Approve only when every step maps to an acceptance criterion.",
        "Implement. Then verify with a binary signal: 'Run the test suite and paste the full output. Every acceptance criterion in SPEC.md must map to a passing test.'",
        "Adversarial pass: spawn a fresh-context subagent with the diff + SPEC.md: 'Report concrete situations where this diff fails its spec, with file:line evidence.' Triage its findings — fix real ones, document rejected ones.",
        "Commit with a message referencing the spec. Note your total corrections count — if it exceeded 2 at any stage, write down what the better initial prompt would have been.",
      ],
      checklist: [
        "SPEC.md exists, was human-edited, and has testable acceptance criteria",
        "Implementation happened in a fresh session that read the spec, not the interview",
        "You edited the plan via Ctrl+G before approving it",
        "Verification produced pasted, binary output (tests/build), not a 'done' assertion",
        "An adversarial subagent reviewed the diff and you triaged every finding",
        "The commit landed only after both verification and the adversarial pass",
      ],
    },
    checkQuiz: [
      {
        q: "In plan mode, Ctrl+G lets you:",
        options: [
          "Regenerate the plan with higher effort",
          "Open the plan in your editor and rewrite it before approval",
          "Jump to the goal definition set by /goal",
          "Toggle between plan and auto-accept permission modes",
        ],
        answer: 1,
        explain: "Ctrl+G pops the plan into your editor. Directly editing the plan — cutting speculation, tightening scope — is cheaper than any amount of corrective prompting later.",
      },
      {
        q: "Mechanically, a Stop hook enforces verification by:",
        options: [
          "Appending test results to every response",
          "Running a handler when the session tries to stop; exit code 2 blocks completion until checks pass",
          "Reverting the last commit if CI fails",
          "Forcing plan mode before any Edit tool call",
        ],
        answer: 1,
        explain: "Stop hooks fire when Claude claims it is finished. A handler that exits 2 rejects the stop, forcing the session to keep working until the real check passes.",
      },
      {
        q: "Which transcript is the kitchen-sink anti-pattern?",
        options: [
          "A session that spawned five parallel subagents for one investigation",
          "A session that fixed a bug, then styled a component, then updated CI config, then debugged auth — all without /clear",
          "A session whose CLAUDE.md imports four other files",
          "A session that ran the same failing test eight times",
        ],
        answer: 1,
        explain: "Four unrelated tasks in one context: each task's residue degrades the next. Parallel subagents on ONE investigation is the opposite — that is correct isolation.",
      },
      {
        q: "The adversarial reviewer is prompted to 'report situations discovered' rather than 'find bugs' because:",
        options: [
          "It runs faster with shorter verb phrases",
          "'Find bugs' pressures the model to fabricate findings to satisfy the instruction; neutral framing rewards accuracy",
          "Marketing language triggers safety refusals",
          "'Situations' includes style issues that 'bugs' excludes",
        ],
        answer: 1,
        explain: "Instructed to find bugs, a model will find 'bugs' — real or not. Neutral phrasing (systematicls' 3-agent detection pattern) removes the incentive to hallucinate findings.",
      },
    ],
    resources: [
      { label: 'Claude Code Best Practices (Anthropic)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
      { label: 'Karpathy — From Vibe Coding to Agentic Engineering (Sequoia 2026)', url: 'https://youtu.be/96jN2OCOfLs', kind: 'video' },
      { label: 'Karpathy — Sequoia Ascent 2026 summary', url: 'https://karpathy.bearblog.dev/sequoia-ascent-2026', kind: 'article' },
      { label: 'Simon Willison — Vibe Engineering', url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/', kind: 'article' },
      { label: 'systematicls — World-Class Agentic Engineer thread', url: 'https://x.com/systematicls', kind: 'thread' },
    ],
  },
]
