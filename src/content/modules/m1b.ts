import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ------------------------------------------------------------------
  // m1-l6 - Subagents & Context Isolation
  // ------------------------------------------------------------------
  {
    id: 'm1-l6',
    title: 'Subagents & Context Isolation',
    day: 6,
    minutes: 50,
    xp: 100,
    objectives: [
      "Can explain when it pays to hand work to a subagent instead of doing it in the main session",
      "Can write a custom subagent in .claude/agents/*.md with frontmatter that actually triggers",
      "Can pick the right helper (Explore, Plan, general-purpose, /fork, or /btw) for a given job",
      "Can resume and steer a running subagent with SendMessage and @agent-name",
    ],
    skipQuiz: [
      {
        q: "You ask Claude how auth works in a big repo, and it hands the digging to a subagent. What's the main architectural win?",
        options: [
          "The subagent runs on a cheaper model, so the exploration costs less",
          "The subagent spends its own context on all the file reading, and only its short conclusions come back to your session",
          "Subagents can open files that the main session has no permission to read",
          "Running subagents in parallel makes the main session respond faster",
        ],
        answer: 1,
        explain: "The whole point is isolation. The subagent might read 40,000 tokens' worth of files to answer the question, and every one of those tokens stays inside the subagent's own context window. Your main session receives a short report and keeps its working memory clean for the actual task.",
      },
      {
        q: "What makes the built-in Explore and Plan subagents different from the general-purpose one?",
        options: [
          "They can edit files but can't run terminal commands",
          "They automatically save their findings to memory",
          "They're read-only, and they skip loading CLAUDE.md",
          "They always run on the largest model available",
        ],
        answer: 2,
        explain: "Explore and Plan are searchers and architects. They can read anything but change nothing, and they deliberately skip your CLAUDE.md file so project instructions never color what they find in the code. The general-purpose agent gets the full toolset, including edits.",
      },
      {
        q: "Which frontmatter setting gives a subagent its own isolated git checkout to work in?",
        options: [
          "permissionMode: sandbox",
          "isolation: worktree",
          "background: true",
          "memory: project",
        ],
        answer: 1,
        explain: "Setting isolation: worktree spins up a temporary git worktree, which is a separate working copy of the repo. The agent edits that copy instead of your files, and Claude Code cleans the worktree up automatically if the agent never changed anything.",
      },
      {
        q: "As of mid-2026, how do subagents execute by default?",
        options: [
          "Synchronously, meaning the main session waits until the agent finishes",
          "In the background, and you get a notification when they complete",
          "One at a time, queued in first-in-first-out order",
          "In a remote cloud sandbox",
        ],
        answer: 1,
        explain: "Background execution is the 2026 default: you keep working while the agent digs. Pass run_in_background: false only when you genuinely can't take the next step without the agent's answer.",
      },
      {
        q: "You want a quick side question answered without dragging your current conversation into it. Which command is right?",
        options: [
          "/fork, because it starts a brand-new context-free thread",
          "/btw, because it asks a side question with zero shared context",
          "/branch, because it creates a clean checkpoint",
          "/clear, because it archives the session first",
        ],
        answer: 1,
        explain: "/btw opens a context-free aside: your side question gets answered without seeing or touching the main conversation. /fork makes the opposite trade by copying your full conversation history into a parallel thread.",
      },
    ],
    sections: [
      {
        heading: 'Why your main context must stay clean',
        blocks: [
          {
            type: 'text',
            md: "Start with one definition, because everything in this lesson hangs off it. The **context window** is the model's working memory: every message you've typed, every file Claude has read, and every command result in the current session sits in it, and the model re-reads all of it before every single response ([context windows explained](https://docs.claude.com/en/docs/build-with-claude/context-windows)).\n\nHere's the catch: that memory degrades as it fills. The more tokens you cram in, the worse the model gets at paying attention to any one of them. Practitioners call this **context rot**, and exploration is its biggest cause. One innocent question like 'how does auth work in this repo?' can make Claude read fifteen files, and those 40,000 tokens of raw file contents then sit in your session for the rest of the day, blurring everything that comes after.\n\nThe fix is a **subagent**: a separate helper Claude with its own fresh, empty context window ([official subagent docs](https://code.claude.com/docs/en/sub-agents)). You hand it the research question. It reads the fifteen files inside its own memory, writes you a short report, and then its entire context gets thrown away. Your main session keeps the two-paragraph answer and none of the file dumps.",
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
            caption: 'Delegation acts as a context firewall. The exploration tokens live and die inside the subagent, and only the report crosses back to your main session.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'One task per subagent',
            md: "A subagent sends back exactly one final message, and then its memory evaporates. You also can't interrupt it halfway to redirect. So give each agent a single question with a defined deliverable, like 'find where rate limiting is enforced and report the call chain with file paths'. Bundle in a second job ('...and also check the tests') and the one report you get back will shortchange both.",
          },
        ],
      },
      {
        heading: 'Anatomy of a custom subagent',
        blocks: [
          {
            type: 'text',
            md: "You can define your own subagents as plain Markdown files. Project-specific ones live in `.claude/agents/` inside the repo; personal ones that follow you everywhere live in `~/.claude/agents/`. Each file has two parts. The body (everything after the metadata block) becomes the agent's system prompt, meaning its standing instructions. The **frontmatter** (the block between the two `---` lines at the top) is the contract: which tools the agent may use, which model runs it, and how it executes.\n\nOne field deserves special care: `description`. Claude reads every agent's description when deciding whether to delegate a task automatically, which makes the description a trigger. Write it for the model, with explicit conditions like 'use for any question that requires reading more than three files', instead of a vague blurb a teammate would skim.",
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
            caption: 'The file .claude/agents/repo-archaeologist.md, showing the full 2026 frontmatter surface in one example.',
          },
          {
            type: 'table',
            headers: ['Frontmatter key', 'What it controls', 'Expert default'],
            rows: [
              ['name / description', "The agent's identity, plus the trigger text Claude reads when deciding whether to auto-delegate", 'Write the description for the model, with explicit use-when conditions'],
              ['tools', 'The allowlist of tools the agent may call', 'Read, Grep, Glob, and Bash for investigators; add Edit only if it must change files'],
              ['model', 'Which model runs the agent', 'haiku for cheap search work; inherit the parent model for hard reasoning'],
              ['permissionMode', 'How permission prompts behave inside the agent', 'Leave on default; never grant bypass to an agent that writes'],
              ['memory', 'Which memory scopes the agent loads at start', 'project for repo work, so it knows your conventions'],
              ['background / isolation', 'Whether it runs async, and whether it gets its own worktree checkout', 'background: true; add isolation: worktree if it edits files'],
              ['skills / mcpServers', 'Skills preloaded into the agent, plus inline MCP server definitions', 'Grant only what the task needs; every extra grant costs attention'],
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
                'Read-only: they can search and read but never Edit, Write, or spawn more agents',
                'They skip CLAUDE.md, so project instructions never bias the investigation',
                'Explore fans out searches and returns file locations plus conclusions',
                'Plan acts as an architect and returns step-by-step implementation plans',
                'Cheap enough to spawn liberally, several at a time',
              ],
            },
            right: {
              title: 'general-purpose / custom',
              items: [
                'Full toolset by default, or exactly the allowlist in your frontmatter',
                'Loads project context and memory scopes like a normal session',
                'Can edit files, run tests, and call MCP tools',
                'A custom .md file gives it a persona plus hard rules it must follow',
                'Reach for these when the task changes state instead of just reading it',
              ],
            },
          },
          {
            type: 'text',
            md: "Three runtime behaviors are worth memorizing. First, subagents run in the **background by default**, so delegating never blocks you. Second, they can **nest five levels deep**: an orchestrator can spawn a specialist, which can spawn its own helper. Third, they're **resumable**. A subagent keeps its working memory after it finishes, so you can send a follow-up with `SendMessage` (addressed to the agent's ID or name) and it picks up right where it left off, context intact. Typing `@agent-name` in a prompt routes work straight to that named agent instead of relying on auto-selection.\n\nTwo session commands round out the picture, and they make opposite trades. `/fork` copies your entire conversation history into a parallel thread, which is perfect for trying plan B while plan A stays untouched. `/btw` opens a side conversation with zero shared context, perfect for a quick unrelated question that shouldn't see (or pollute) your main thread.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arrF" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a78bfa"/>
    </marker>
    <marker id="arrB" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#34d399"/>
    </marker>
  </defs>
  <rect x="40" y="100" width="200" height="100" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="140" y="132" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Main conversation</text>
  <text x="140" y="155" fill="#a1a1aa" font-size="11" text-anchor="middle">80k tokens of history:</text>
  <text x="140" y="172" fill="#a1a1aa" font-size="11" text-anchor="middle">your feature, your decisions</text>
  <rect x="440" y="40" width="220" height="90" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="550" y="68" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">/fork thread</text>
  <text x="550" y="90" fill="#a1a1aa" font-size="11" text-anchor="middle">inherits all 80k tokens</text>
  <text x="550" y="108" fill="#a1a1aa" font-size="11" text-anchor="middle">try plan B; plan A stays safe</text>
  <rect x="440" y="170" width="220" height="90" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="550" y="198" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">/btw aside</text>
  <text x="550" y="220" fill="#a1a1aa" font-size="11" text-anchor="middle">inherits zero tokens</text>
  <text x="550" y="238" fill="#a1a1aa" font-size="11" text-anchor="middle">quick unrelated question</text>
  <line x1="240" y1="125" x2="440" y2="85" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrF)"/>
  <text x="305" y="88" fill="#a78bfa" font-size="12">full copy of history</text>
  <line x1="240" y1="175" x2="440" y2="215" stroke="#34d399" stroke-width="2" marker-end="url(#arrB)"/>
  <text x="315" y="222" fill="#34d399" font-size="12">clean slate</text>
</svg>`,
            caption: '/fork and /btw solve different problems. Fork duplicates everything said so far; /btw starts from nothing.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Do not double-spend',
            md: "Once you delegate a search, resist the urge to also run it yourself in the main session. Doing both pays the context cost twice and defeats the entire point of isolation. Delegate, switch to something independent while the agent works, then read the report when it lands.",
          },
        ],
      },
    ],
    lab: {
      title: 'Build an investigator and put it to work',
      intro: "Define a real custom subagent for a repo you actually care about, then delegate an investigation you genuinely want answered, and verify that the isolation payoff is real.",
      steps: [
        "Pick a repo with some history to it. Create `.claude/agents/repo-archaeologist.md` using the lesson's template: read-only tools, `model: haiku`, `background: true`, a description written as a trigger, and a hard 300-word limit on the report.",
        "Start a fresh session with `claude`. Confirm the agent registered by asking: 'What custom agents are available in this project?'",
        "Delegate a real question: '@repo-archaeologist why does <some module> exist and what depends on it? Report the call chain with file paths.'",
        "While it runs in the background, keep working: ask the main session to draft a small unrelated change. Notice that you're never blocked.",
        "When the report lands, send a follow-up to the SAME agent by name ('dig one level deeper into the second dependency') and confirm it resumes with its earlier findings intact.",
        "Compare contexts: run `/context` (or skim the transcript) and confirm the main session holds the report, and none of the raw file dumps.",
      ],
      checklist: [
        "A custom agent file exists in .claude/agents/ with tools, model, and background frontmatter",
        "The agent auto-triggered, or responded to an @agent-name mention",
        "You continued a finished agent with a follow-up and it kept its earlier context",
        "The main session transcript contains conclusions only, with no raw multi-file dumps",
        "You can state, in one sentence, when you'd reach for /btw instead of /fork",
      ],
    },
    checkQuiz: [
      {
        q: "How deep can subagent nesting go in mid-2026 Claude Code?",
        options: ["2 levels", "3 levels", "5 levels", "Unlimited, bounded only by budget"],
        answer: 2,
        explain: "Subagents can spawn subagents down to five levels deep. That gives an orchestrator room to run specialists that run their own helpers, while still putting a hard ceiling on runaway recursion.",
      },
      {
        q: "A background subagent finished its investigation but missed one edge case. What's the move that preserves its context?",
        options: [
          "Spawn a new agent and paste the old report into its prompt",
          "Use SendMessage, addressed to the same agent's ID, with the follow-up question",
          "/fork the main session and re-ask the question there",
          "Re-run the agent with run_in_background: false",
        ],
        answer: 1,
        explain: "Agents are resumable. SendMessage with the agent's ID or name continues that same agent, and it still holds everything it learned during the investigation. A fresh Agent call would start from zero and re-read everything.",
      },
      {
        q: "Why does the one-task-per-subagent rule exist?",
        options: [
          "Multiple tasks exceed the subagent's token limit",
          "The permission system rejects compound prompts",
          "The agent returns a single final report and can't be steered mid-list, so bundled tasks blur the deliverable",
          "Nested agents inherit only the first task they're given",
        ],
        answer: 2,
        explain: "You get one report back, and your only steering option is a SendMessage after the fact. A single crisp question with a defined output format is the contract that reliably produces a useful report.",
      },
      {
        q: "What does mentioning @repo-archaeologist in your prompt actually do?",
        options: [
          "Loads that agent's file into your main context as extra instructions",
          "Routes the request to that named agent as an explicit delegation",
          "Makes the agent's tools available in the main session",
          "Pins the agent so it survives /clear",
        ],
        answer: 1,
        explain: "An @agent-name mention is explicit delegation. Instead of hoping the description-based auto-selection picks the right agent, you name the one you want and the task goes straight to it.",
      },
    ],
    resources: [
      { label: 'Subagents - official docs', url: 'https://code.claude.com/docs/en/sub-agents', kind: 'docs' },
      { label: 'Effective Context Engineering for AI Agents (Anthropic)', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', kind: 'article' },
      { label: 'How we built our multi-agent research system (Anthropic)', url: 'https://www.anthropic.com/engineering/multi-agent-research-system', kind: 'article' },
      { label: 'everything-claude-code - dense config reference', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
      { label: 'Claude Code in Action (free course)', url: 'https://anthropic.skilljar.com/claude-code-in-action', kind: 'course' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l7 - MCP & Plugins
  // ------------------------------------------------------------------
  {
    id: 'm1-l7',
    title: 'MCP & Plugins',
    day: 7,
    minutes: 45,
    xp: 100,
    objectives: [
      "Can add, scope, and authenticate a Model Context Protocol (MCP) server using the right transport",
      "Can keep an MCP setup inside the context-hygiene budget and explain how tool search makes big setups survivable",
      "Can name every piece a plugin can ship and install one from a marketplace",
      "Can apply the Cowork starter-pack pattern to knowledge work beyond coding",
    ],
    skipQuiz: [
      {
        q: "Which MCP transport is deprecated as of 2026?",
        options: ["stdio", "HTTP", "SSE", "WebSocket"],
        answer: 2,
        explain: "SSE (server-sent events) is the deprecated one. HTTP is now the standard transport for remote servers, and stdio (standard input/output, a direct pipe to a local process) remains the way to run servers on your own machine. WebSocket was never an MCP transport.",
      },
      {
        q: "Tool search, which is on by default, saves context by:",
        options: [
          "Compressing tool schemas with a smaller model",
          "Deferring tool definitions, so only names exist in context until a schema is fetched on demand",
          "Caching tool outputs across sessions",
          "Disabling MCP servers that haven't been used recently",
        ],
        answer: 1,
        explain: "Deferred tools sit in context as bare names. The full definition (a JSON schema describing every parameter) loads just in time, when the tool is actually about to be used. A setup with dozens of servers no longer pays thousands of schema tokens up front.",
      },
      {
        q: "The context-hygiene rule of thumb for MCP is:",
        options: [
          "Under 5 servers, under 40 tools",
          "Under 10 servers enabled, under 80 tools active",
          "Under 20 servers, with unlimited tools since search defers them",
          "One server per project, always project-scoped",
        ],
        answer: 1,
        explain: "Keep it under 10 enabled servers and under 80 active tools. Tool search softens the cost but leaves some behind: names, channels, and server prompts still take up attention even when the full schemas stay deferred.",
      },
      {
        q: "Your whole team should get the same MCP server the moment they clone the repo. Which scope do you use?",
        options: [
          "local, which stays on your machine only",
          "user, which is stored in ~/.claude and follows you between projects",
          "project, which writes the server into .mcp.json in the repo",
          "managed, which is pushed out by an org admin",
        ],
        answer: 2,
        explain: "Project scope checks a .mcp.json file into the repo root, so the server config ships with the code and every teammate gets it on clone. Local scope stays on one machine; user scope follows one person everywhere.",
      },
      {
        q: "The Cowork starter pack pattern for knowledge work is:",
        options: [
          "One CLAUDE.md plus a vector database",
          "Three context files (about-me, company, writing style) plus seven knowledge-worker skills",
          "Ten MCP connectors and no local files",
          "A single mega-skill with progressive disclosure",
        ],
        answer: 1,
        explain: "Three Markdown files teach Claude who you are, what your company does, and how you write. Seven reusable skills then read those files, so every draft comes out personalized. It's the minimum viable setup for work that has nothing to do with code.",
      },
    ],
    sections: [
      {
        heading: 'MCP: the connectivity standard',
        blocks: [
          {
            type: 'text',
            md: "MCP stands for [Model Context Protocol](https://modelcontextprotocol.io), an open standard for connecting AI tools to outside systems. It's how Claude Code reaches anything that lives beyond your filesystem: your issue tracker (say, Linear), your Postgres database, your error monitoring in Sentry, your company's internal APIs. Before MCP, every one of those connections needed custom glue code. With it, any service can publish a server that any MCP-speaking client can plug into.\n\nAdding a server means making three decisions. **Transport** is how the connection physically works: HTTP for servers running somewhere on the internet, stdio (standard input/output, a direct pipe) for programs running on your own machine. **Scope** decides who gets the server: just you, just this project, or everyone who clones the repo. **Auth** is how you prove who you are, and it usually means [OAuth](https://en.wikipedia.org/wiki/OAuth), the familiar 'a browser tab opens and you click Approve' flow. The `/mcp` command runs it for you and stores the tokens.\n\nOne newer capability changes the feel of the whole thing. Since 2026, servers can open **channels** and push events into your session on their own. Your CI (continuous integration, the [automated checks](https://en.wikipedia.org/wiki/Continuous_integration) that run when you push code) can announce a failing build mid-conversation instead of waiting for you to ask.",
          },
          {
            type: 'table',
            headers: ['Decision', 'Options', 'Pick'],
            rows: [
              ['Transport', 'http, stdio (SSE is deprecated)', 'http for remote services; stdio for processes on your own machine'],
              ['Scope', 'local, project, user', 'project (.mcp.json in the repo) for team servers; user for personal daily drivers'],
              ['Auth', 'OAuth via /mcp, or env-var tokens', 'OAuth. The /mcp command runs the browser flow and stores tokens for you'],
              ['Push', 'channels (server-initiated events)', 'Turn on for CI, alerts, and long-running jobs you want to hear from'],
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
            caption: 'The full lifecycle: add a server with a transport and a scope, authenticate with /mcp, audit with claude mcp list.',
          },
        ],
      },
      {
        heading: 'Tool search and the hygiene budget',
        blocks: [
          {
            type: 'text',
            md: "Every tool a server exposes comes with a schema: a block of JSON describing its name, its purpose, and every parameter it accepts. Pre-2026 advice warned that all of those schemas loaded into your context the moment a server connected, so a 50-tool server cost you thousands of tokens before you ever used it. **Tool search**, on by default, retired that problem. Tools now arrive deferred: only their names sit in context, and the full schema gets fetched just in time, when a tool is actually about to run.\n\nThe hygiene budget survives anyway, because names still occupy attention and badly built servers ship noisy prompts alongside their tools. The working rule: keep **fewer than 10 servers enabled and fewer than 80 tools active**. When a server stops earning its place, disable it from the `/mcp` menu instead of uninstalling it. Flipping it back on later takes one keystroke.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arrTS" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#34d399"/>
    </marker>
  </defs>
  <rect x="40" y="40" width="290" height="245" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="185" y="70" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">Before tool search</text>
  <rect x="65" y="90" width="240" height="120" fill="#18181b" stroke="#52525b" rx="6"/>
  <text x="185" y="118" fill="#f472b6" font-size="12" text-anchor="middle">50 full tool schemas</text>
  <text x="185" y="140" fill="#a1a1aa" font-size="11" text-anchor="middle">every parameter, every description</text>
  <text x="185" y="160" fill="#a1a1aa" font-size="11" text-anchor="middle">loaded whether used or not</text>
  <text x="185" y="190" fill="#f472b6" font-size="13" text-anchor="middle" font-weight="bold">~12,000 tokens up front</text>
  <text x="185" y="250" fill="#a1a1aa" font-size="11" text-anchor="middle">context paid before your first prompt</text>
  <rect x="370" y="40" width="290" height="245" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="515" y="70" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">With tool search (default)</text>
  <rect x="395" y="90" width="240" height="62" fill="#18181b" stroke="#52525b" rx="6"/>
  <text x="515" y="115" fill="#34d399" font-size="12" text-anchor="middle">50 tool names only</text>
  <text x="515" y="137" fill="#34d399" font-size="13" text-anchor="middle" font-weight="bold">~400 tokens</text>
  <rect x="395" y="195" width="240" height="62" fill="#18181b" stroke="#38bdf8" rx="6"/>
  <text x="515" y="220" fill="#38bdf8" font-size="12" text-anchor="middle">1 schema fetched on demand</text>
  <text x="515" y="242" fill="#a1a1aa" font-size="11" text-anchor="middle">only when the tool is about to run</text>
  <line x1="515" y1="152" x2="515" y2="195" stroke="#34d399" stroke-width="2" marker-end="url(#arrTS)"/>
</svg>`,
            caption: 'Tool search turns a 50-tool server from an up-front context tax into a cheap list of names plus on-demand lookups.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Audit ritual',
            md: "Once a month: run `/context` to see what MCP actually costs you, then open `/mcp` and disable anything you haven't used in two weeks. The best MCP setup is the one you only notice when it saves you a tab switch.",
          },
        ],
      },
      {
        heading: 'Plugins: distribution for everything',
        blocks: [
          {
            type: 'text',
            md: "A plugin is a package of Claude Code capability that installs with one command ([plugin docs](https://code.claude.com/docs/en/plugins)). A single `/plugin install` can deliver **skills** (reusable instruction packs; slash commands merged into these in 2026), **agents** like the one you built last lesson, **hooks** (scripts that fire automatically on session events), a bundled `.mcp.json` of MCP servers, **LSP servers** ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/), the same machinery that gives editors go-to-definition and live error checking), **monitors** that watch things and report back, and a `bin/` directory of executables.\n\nWhere do you get them? Two official marketplaces matter: `claude-plugins-official`, which Anthropic maintains and vets, and `claude-plugins-community`, which is broader and worth reviewing before you install from it. Treat a plugin the way you'd treat any dependency in a project: read what it ships, and pin the ones you trust.",
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
            caption: 'Plugin anatomy: one install can ship skills, agents, hooks, MCP servers, LSP servers, monitors, and binaries.',
          },
          {
            type: 'compare',
            left: {
              title: 'Dev plugins (marketplaces)',
              items: [
                'claude-plugins-official: vetted and Anthropic-maintained',
                'claude-plugins-community: broader selection, so review before installing',
                'Typical payload: review skills, hooks, CI agents',
                'Install flow: /plugin marketplace add, then /plugin install',
              ],
            },
            right: {
              title: 'Cowork plugins (knowledge work)',
              items: [
                'knowledge-work-plugins repo: packs for legal, sales, marketing, and PM roles',
                'Starter pack pattern: 3 context files plus 7 skills',
                'Context files cover who you are, your company, and your writing style',
                'Same plugin format, pointed at writing and planning work instead of code',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'One great server, zero dead weight',
      intro: "Wire up one MCP server you'll actually use daily, prune everything else against the hygiene budget, and install one plugin knowing exactly what it ships.",
      steps: [
        "Inventory first: run `claude mcp list`, then `/context` inside a session. Write down your server count and the rough token cost you're paying today.",
        "Add ONE genuinely useful server with a deliberate scope, for example `claude mcp add --transport http --scope user linear https://mcp.linear.app/mcp` (or GitHub, Sentry, your database: whatever you actually touch daily).",
        "Run `/mcp`, complete the OAuth browser flow, and confirm the server shows as connected.",
        "Prune: in `/mcp`, disable every server you haven't used in two weeks. Target: under 10 enabled servers, under 80 active tools.",
        "Add a marketplace and browse it: `/plugin marketplace add anthropics/claude-plugins-official`, then `/plugin` to explore what's on offer.",
        "Before installing one plugin, read its repo and list what it ships: which skills, hooks, agents, and MCP servers? Then install it and trigger one of its skills on a real task.",
        "Re-run `/context` and compare against your step-1 baseline. You should be net leaner despite the additions.",
      ],
      checklist: [
        "One new MCP server is connected, authenticated via /mcp, and scoped deliberately",
        "Enabled servers number under 10 and active tools under 80 after pruning",
        "You can name everything your installed plugin added (skills, agents, hooks, servers)",
        "The plugin's skill actually triggered on a real task",
        "Context cost after the lab sits at or below the baseline you recorded",
      ],
    },
    checkQuiz: [
      {
        q: "How does OAuth authentication for a remote MCP server happen in Claude Code?",
        options: [
          "You paste a bearer token into .mcp.json",
          "The /mcp command launches the browser OAuth flow and stores the tokens",
          "The server prompts you on its first tool call via stdio",
          "You export ANTHROPIC_MCP_TOKEN before launching",
        ],
        answer: 1,
        explain: "/mcp is the authentication surface. It lists your servers, kicks off the browser-based OAuth approval flow for each one, and manages the stored credentials per server afterward.",
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
        explain: "Channels flip the direction of communication. A server can announce something (a CI failure, an alert firing, a long job finishing) the moment it happens, and the event lands in your live session in real time.",
      },
      {
        q: "Which of these is something a plugin CANNOT ship?",
        options: [
          "LSP servers and monitors",
          "Hooks and a bin/ of executables",
          "An .mcp.json bundle of MCP servers",
          "Model weights that override the session model",
        ],
        answer: 3,
        explain: "Plugins bundle capability: skills, agents, hooks, MCP servers, LSP servers, monitors, and binaries. The model itself always comes from Anthropic's side, so weights never ride inside a plugin.",
      },
      {
        q: "In the Cowork starter pack, what job do the three context files do?",
        options: [
          "Replace CLAUDE.md entirely for coding projects",
          "Teach Claude your identity, company, and writing voice so every skill's output comes out personalized",
          "Cache MCP schemas locally to save tokens",
          "Define the plugin manifest for marketplaces",
        ],
        answer: 1,
        explain: "The about-me, my-company, and writing-style files act as standing context. The seven skills read them before drafting anything, which is why the output sounds like you and gets your facts right.",
      },
    ],
    resources: [
      { label: 'MCP in Claude Code - official docs', url: 'https://code.claude.com/docs/en/mcp', kind: 'docs' },
      { label: 'Model Context Protocol specification', url: 'https://modelcontextprotocol.io', kind: 'docs' },
      { label: 'Plugins - official docs', url: 'https://code.claude.com/docs/en/plugins', kind: 'docs' },
      { label: 'knowledge-work-plugins (Anthropic)', url: 'https://github.com/anthropics/knowledge-work-plugins', kind: 'repo' },
      { label: 'Cowork starter pack (Craig Hewitt)', url: 'https://github.com/TheCraigHewitt/cowork-starter-pack', kind: 'repo' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l8 - Power Features
  // ------------------------------------------------------------------
  {
    id: 'm1-l8',
    title: 'Power Features',
    day: 7,
    minutes: 50,
    xp: 100,
    objectives: [
      "Can run three or more parallel Claude sessions on one repo using git worktrees",
      "Can automate recurring work with /loop, /schedule, and hosted Routines, each with a real stop condition",
      "Can pick the right surface (headless, GitHub Actions, Slack, Chrome, or computer use) for a given job",
      "Can branch and teleport sessions instead of restarting them from scratch",
    ],
    skipQuiz: [
      {
        q: "Boris Cherny's parallel-session pattern uses git worktrees at what scale?",
        options: [
          "1 worktree per branch, with sessions run one after another",
          "3-5 worktrees, each hosting its own Claude session",
          "10+ worktrees managed by an orchestrator agent",
          "2 worktrees: one for code, one for tests",
        ],
        answer: 1,
        explain: "The creator of Claude Code runs 3 to 5 worktrees, each one an isolated checkout that shares a single .git directory, and each hosting its own session. Past roughly five, your own ability to supervise becomes the bottleneck.",
      },
      {
        q: "What does --teleport do?",
        options: [
          "Moves a session to a remote sandbox for unattended execution",
          "Continues a session across devices, so you can start on the laptop and pick up on the desktop",
          "Jumps the conversation back to an earlier checkpoint",
          "Transfers a session to a teammate's account",
        ],
        answer: 1,
        explain: "--teleport gives one session cross-device continuity. Rewinding to a checkpoint is a different feature, and unattended remote execution is the cloud sandbox's job.",
      },
      {
        q: "/batch is the right tool when you want to:",
        options: [
          "Queue prompts to run one after another overnight",
          "Fan a single task out across many inputs in parallel, like fixing the same bug pattern in 20 files",
          "Combine several sessions into one transcript",
          "Send multiple API requests at the half-price batch rate",
        ],
        answer: 1,
        explain: "/batch means fan-out: one instruction, many targets, all running in parallel. The API's discounted batch pricing shares a name with this interactive command and nothing else.",
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
        explain: "Running claude -p executes one prompt without opening the interactive terminal interface, and --output-format json makes the result machine-readable so a pipeline script can parse it.",
      },
      {
        q: "The Chrome extension's core value in a dev loop is:",
        options: [
          "Letting Claude browse documentation faster than WebFetch",
          "Closing the frontend loop: Claude drives your real browser, sees the real page, and verifies its own UI changes",
          "Recording your clicks as reusable skills",
          "Syncing cookies so headless runs stay authenticated",
        ],
        answer: 1,
        explain: "The extension turns UI work into a loop Claude can verify by itself: change the code, drive the actual browser, read the page and the console, fix what's wrong, repeat. Guessing whether a change 'looks right' drops out of the process.",
      },
    ],
    sections: [
      {
        heading: 'Worktrees: parallelism without chaos',
        blocks: [
          {
            type: 'text',
            md: "A [git worktree](https://git-scm.com/docs/git-worktree) is a second working copy of your repository that shares the same underlying `.git` history. Normally one repo means one checkout on disk, so only one branch can be open at a time. Worktrees remove that limit: you can have `../myapp-auth` checked out on one branch and `../myapp-flaky` on another, both backed by the same repo, with nothing cloned twice.\n\nWhy does that matter here? Because each worktree can host its **own Claude session**, with its own context and its own branch. The sessions physically can't collide, since each one only sees the files in its own checkout. Boris Cherny, who created Claude Code, calls this the habit that pays off most. While one session implements a feature, another fixes a flaky test and a third regenerates docs. Your job shifts from typing code to supervising diffs.",
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
            type: 'text',
            md: "Claude Code ships several ways to make work repeat or multiply without you retyping prompts. They sound similar at first, so the table spells out what each one does and when you'd actually reach for it.",
          },
          {
            type: 'table',
            headers: ['Feature', 'What it does', 'Reach for it when'],
            rows: [
              ['/loop', 'Re-runs a prompt or skill on an interval (or lets the model pace itself), inside your session', 'Polling a deploy, babysitting PRs, retrying until CI goes green'],
              ['/schedule + Routines', 'Creates hosted scheduled agents that fire on a cron timetable, no laptop required', 'A nightly dependency audit, a Monday-morning triage report'],
              ['/batch', 'Fans one instruction out across many inputs and runs them in parallel', 'The same refactor across 20 files; triaging every open issue at once'],
              ['/branch, --fork-session', 'Forks the conversation so you can explore an alternative while the original stays intact', 'Trying approach B without losing approach A'],
              ['--teleport', 'Continues a session on another device', 'Start at the desk, finish on the couch'],
              ['/voice', 'Voice input for driving sessions hands-free', 'Dictating long specs; steering while away from the keyboard'],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arrLo" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrLf" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#f472b6"/>
    </marker>
  </defs>
  <rect x="40" y="80" width="170" height="80" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="125" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">1. Task runs</text>
  <text x="125" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">fix the failing thing</text>
  <rect x="265" y="80" width="170" height="80" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="350" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">2. Real check</text>
  <text x="350" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">npm test exit code</text>
  <rect x="490" y="80" width="170" height="80" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="575" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">3. Stop condition</text>
  <text x="575" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">green twice in a row</text>
  <line x1="210" y1="120" x2="265" y2="120" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrLo)"/>
  <line x1="435" y1="120" x2="490" y2="120" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrLo)"/>
  <text x="455" y="105" fill="#34d399" font-size="11">pass</text>
  <path d="M 350 160 Q 350 210 240 210 Q 125 210 125 165" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arrLf)"/>
  <text x="240" y="200" fill="#f472b6" font-size="11" text-anchor="middle">fail: run again</text>
  <rect x="40" y="235" width="620" height="45" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="350" y="262" fill="#e4e4e7" font-size="12" text-anchor="middle">Budget cap: max runs or max spend. The loop ends here no matter what.</text>
</svg>`,
            caption: 'Every automation needs all three parts: a check that can actually fail, a stop condition, and a budget cap.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Loops without stop conditions bill you in your sleep',
            md: "Every /loop and every Routine needs three things before you walk away: a REAL check (a test exit code, an HTTP 200, a file existing), an explicit stop condition, and a budget cap. A prompt like 'keep improving the code' has no finish line, so the loop runs until your invoice becomes the stop condition.",
          },
        ],
      },
      {
        heading: 'Beyond the terminal',
        blocks: [
          {
            type: 'text',
            md: "The engine that powers your terminal sessions also runs on five other surfaces, and picking the right one is a real skill. **Headless mode** means running Claude with no interactive interface at all: `claude -p 'your prompt' --output-format json` executes once and prints a machine-readable result, which is exactly what a script or a CI pipeline wants ([headless docs](https://code.claude.com/docs/en/headless)). **GitHub Actions** lets anyone mention `@claude` on an issue or pull request and get a fix or a review back, via the claude-code-action workflow.\n\n**Slack** turns a pasted bug thread into a session that starts with the customer's reproduction steps already in context. The **Chrome extension** lets Claude drive your actual browser, so frontend changes get verified against the real page instead of guessed at. And **computer use**, a macOS research preview, extends the same idea to native apps: Claude writes code, compiles it, launches the app, clicks through it, and fixes what it sees.",
          },
          {
            type: 'compare',
            left: {
              title: 'Interactive surfaces',
              items: [
                'Terminal TUI (the default text interface): richest control',
                'Chrome extension: sees the real page and console for UI loops',
                'Computer use: clicks through native macOS apps it just compiled',
                '/voice: dictation for specs and steering',
              ],
            },
            right: {
              title: 'Unattended surfaces',
              items: [
                'claude -p with --output-format json: CI jobs and shell pipelines',
                'GitHub Actions: @claude fixes issues and reviews PRs on its own',
                'Routines: hosted cron agents that run with your laptop closed',
                'Slack: bug threads become sessions with the customer context attached',
              ],
            },
          },
        ],
      },
      {
        heading: 'A few more commands worth knowing',
        blocks: [
          {
            type: 'text',
            md: "A grab-bag of commands that earn their keep once the basics are muscle memory. Two of them lean on the checkpoint trail you met in [Claude Code Mastery · Claude Code Fundamentals & the .claude Folder](lesson:m1-l1): every tool operation leaves a breadcrumb, and these walk it.",
          },
          {
            type: 'table',
            headers: ['Command', 'What it does', 'Reach for it when'],
            rows: [
              ['/simplify', 'Runs several review agents in parallel over your diff, then applies the cleanup they agree on', 'A feature just landed and you want dead code and duplication gone before committing'],
              ['/code-review', 'Reviews the current branch for real bugs; add ultra for a deeper multi-agent pass in the cloud', 'Before you open a PR, or for a thorough pre-merge sweep'],
              ['/rewind', 'Jumps the conversation and your code back to an earlier checkpoint', 'A run went sideways and you want out without git surgery'],
              ['/copy', 'Copies the last response; press W to write it to a file instead', 'Grabbing output over SSH, where clipboard sharing is flaky'],
            ],
          },
          {
            type: 'code',
            lang: 'bash',
            caption: 'A few aliases worth adding to your shell profile. Launch fast, land in the right mode.',
            code: `alias cc='claude'
alias ccc='claude --continue'            # resume the last session
alias ccr='claude --resume'              # pick a session to resume
alias ccp='claude -p'                    # one-shot, prints and exits
alias ccplan='claude --permission-mode plan'
alias cco='claude --model opus'
alias ccs='claude --model sonnet'
alias cch='claude --model haiku'`,
          },
        ],
      },
    ],
    lab: {
      title: 'Parallel sessions + one standing automation',
      intro: "Run two real worktree sessions concurrently on one repo, then set up one automation that keeps working after the session ends.",
      steps: [
        "In a real repo, create two worktrees: `git worktree add ../<repo>-taskA -b feat/task-a` and `git worktree add ../<repo>-taskB -b chore/task-b`.",
        "Open two terminal tabs, `cd` into one worktree in each, and start `claude` in both. Give each session ONE scoped task (say, a small feature in A and test cleanup in B).",
        "While both run, practice supervision: alternate between tabs, review diffs as they land, and course-correct with short messages. Resist writing any code yourself.",
        "When one session finishes, verify its work by running the tests inside that worktree, then commit on its branch.",
        "Set up one automation. Either `/loop 10m` with a prompt that checks something real ('run npm test; if it fails, fix the failure; stop when green twice in a row'), or `/schedule` a Routine (say, weekdays 8am: 'audit dependencies for known security vulnerabilities, called CVEs, and open an issue if any are high severity').",
        "Confirm the automation fired at least once, and that its stop condition or cron timetable is what you intended.",
        "Clean up: `git worktree remove` both checkouts after merging or abandoning the branches.",
      ],
      checklist: [
        "Two Claude sessions ran concurrently in separate worktrees on one repo",
        "Neither session touched the other's files or branch",
        "You reviewed and committed at least one session's work after verifying it",
        "A /loop or /schedule automation exists with a real check AND an explicit stop condition or budget",
        "The automation executed at least once and you inspected its output",
        "Both worktrees were removed cleanly with git worktree remove",
      ],
    },
    checkQuiz: [
      {
        q: "What's the correct split between /loop and /schedule?",
        options: [
          "/loop is hosted in the cloud; /schedule runs locally",
          "/loop repeats a prompt in-session on an interval; /schedule creates hosted Routines that fire on a cron timetable without your machine",
          "They're aliases; /schedule just adds a time argument",
          "/loop is for skills only; /schedule is for raw prompts only",
        ],
        answer: 1,
        explain: "/loop is the in-session repeater, great for polling and babysitting while you're around. /schedule provisions Routines, which are cloud-hosted scheduled agents that fire on their timetable even when your laptop is closed.",
      },
      {
        q: "Why does the computer-use research preview matter for development work?",
        options: [
          "It controls your terminal faster than Bash",
          "Claude can write code, compile it, launch the native app, click through it, and fix what it sees, which closes the verification loop",
          "It watches you work and generates skills from your clicks",
          "It runs macOS virtual machines inside the sandbox",
        ],
        answer: 1,
        explain: "For native apps, verification used to mean you clicking through the build yourself. The preview closes that loop: write, compile, launch, click, fix. Claude stops depending on you to be the test harness.",
      },
      {
        q: "You're mid-session and want to try a risky alternative approach without losing your current thread. Best move?",
        options: [
          "/clear, then describe both approaches from scratch",
          "/branch (or resume with --fork-session) to explore inside a parallel copy of the session",
          "--teleport to a second device and diverge there",
          "/batch the two approaches as parallel inputs",
        ],
        answer: 1,
        explain: "Session branching forks the conversation state. Your original thread stays exactly as it was while you push on the risky idea in a copy. Teleport moves a session between devices; it never duplicates one.",
      },
      {
        q: "According to Cherny's team tips, the Slack integration's killer workflow is:",
        options: [
          "Posting daily standup summaries to a channel",
          "Pasting a customer bug thread so the session starts with the full reproduction context",
          "Approving permission prompts from your phone",
          "Broadcasting session transcripts for team review",
        ],
        answer: 1,
        explain: "A bug thread already carries reproduction steps, stack traces, and customer impact. Pasting it hands Claude all of that context intact, with no manual re-summarizing along the way.",
      },
    ],
    resources: [
      { label: 'Claude Code Best Practices (Anthropic)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
      { label: 'Boris Cherny - team tips & hidden features threads', url: 'https://x.com/bcherny', kind: 'thread' },
      { label: 'GitHub Actions integration - official docs', url: 'https://code.claude.com/docs/en/github-actions', kind: 'docs' },
      { label: 'claude-code-action (Anthropic)', url: 'https://github.com/anthropics/claude-code-action', kind: 'repo' },
      { label: 'Headless mode - official docs', url: 'https://code.claude.com/docs/en/headless', kind: 'docs' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l10 - The Ambient Awareness Layer
  // ------------------------------------------------------------------
  {
    id: 'm1-l10',
    title: 'The Ambient Awareness Layer',
    day: 7,
    minutes: 45,
    xp: 100,
    objectives: [
      'Explain the supervision gap: running many agents needs an awareness layer, not just more spawning',
      'Configure a status line that surfaces model, context percentage, and usage rate at a glance',
      'Wire a Stop hook that pushes a completion signal to Slack, voice, and a desktop notification',
      'Use /voice to answer a pinged agent without returning to the keyboard',
    ],
    skipQuiz: [
      {
        q: 'The supervision gap this lesson addresses:',
        options: [
          'Agents run too slowly to be worth parallelizing',
          'You can spawn many agents but watch only one thing at a time, so parallelism outruns your attention',
          'Worktrees corrupt each other\'s files under load',
          'The model forgets the task when a session is backgrounded',
        ],
        answer: 1,
        explain:
          'Spawning parallelism is the easy half. You still have one pair of eyes. Once five sessions run at once, watching one lets the other four drift, and tabbing between all five means you get nothing done yourself. The awareness layer is what closes that gap.',
      },
      {
        q: 'How you set up a Claude Code status line:',
        options: [
          'Hand-edit a YAML schema in settings.json',
          'Run /statusline and describe what you want in plain English; Claude wires it up',
          'Install a status-line plugin from the marketplace',
          'It is fixed and not configurable',
        ],
        answer: 1,
        explain:
          '/statusline is interactive. You describe the readout you want in plain language and Claude generates the configuration, so there is no format to memorize.',
      },
      {
        q: 'Besides blocking a premature "done" with exit 2, the Stop hook can also:',
        options: [
          'Roll back the last edit',
          'Fire a notification when an agent finishes or stalls waiting on you',
          'Compact the context automatically',
          'Switch the active model',
        ],
        answer: 1,
        explain:
          'One hook, two jobs. The Stop event is where a verification gate blocks a false finish, and it is also the exact moment to announce a real finish. Same event, completely different purpose.',
      },
      {
        q: 'A completion-notification cascade typically fans one Stop event out to:',
        options: [
          'A single email inbox',
          'Several channels at once: Slack, voice, and a desktop banner',
          'The model system prompt',
          'A freshly spawned subagent',
        ],
        answer: 1,
        explain:
          'The point is to reach you wherever you are. One Stop hook can post to Slack, speak the message aloud, and raise an OS notification in the same run, so a signal lands whether you are at the desk or across the room.',
      },
      {
        q: 'Why push signals beat tabbing between terminals:',
        options: [
          'Terminals cannot display token counts',
          'Push pulls you in only on events that need you, so you stay in your own flow the rest of the time',
          'Notifications cost fewer tokens than reading output',
          'Terminal sessions time out after five minutes',
        ],
        answer: 1,
        explain:
          'Polling five terminals spends your attention continuously. A push signal spends it only at the moment an agent finishes, stalls, or fails, and leaves the rest of your time free for your own work.',
      },
    ],
    sections: [
      {
        heading: 'The supervision gap',
        blocks: [
          {
            type: 'text',
            md: "You spent [Claude Code Mastery · Power Features](lesson:m1-l8) learning to run three to five sessions at once, and [Agents, Harnesses & Loops · Agent Teams & Dynamic Workflows](lesson:m2-l6) learning to stand up a team of peers. Both hit the same wall the first time you try them for real: you have one pair of eyes and five things running. Watch one terminal and the other four drift. Tab between all five and your own work stalls.\n\nSpawning parallelism is the easy half. Staying aware of it is the half almost nobody sets up, and it is why most people quietly slide back to a single session. The fix is an **ambient awareness layer**: a small set of passive and push signals that tell you what every agent is doing without you looking at it. A glance gives you state. A ping pulls you in exactly when an agent finishes or gets stuck. The rest of the time, you stay in your own flow.",
          },
          {
            type: 'diagram',
            caption: 'Spawning is the easy half. The awareness layer is the missing one: it lets you ignore five agents safely and get pulled in only when one needs you.',
            svg: `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="380" fill="#18181b"/><text x="350" y="28" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">Five agents running, one pair of eyes</text><rect x="20" y="48" width="150" height="46" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="95" y="76" fill="#e4e4e7" font-size="12" text-anchor="middle">agent &#183; auth</text><rect x="185" y="48" width="150" height="46" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="260" y="76" fill="#e4e4e7" font-size="12" text-anchor="middle">agent &#183; tests</text><rect x="350" y="48" width="150" height="46" rx="6" fill="#27272a" stroke="#34d399"/><text x="425" y="76" fill="#e4e4e7" font-size="12" text-anchor="middle">agent &#183; docs</text><rect x="515" y="48" width="165" height="46" rx="6" fill="#27272a" stroke="#f472b6"/><text x="597" y="76" fill="#e4e4e7" font-size="12" text-anchor="middle">agent &#183; migration</text><line x1="95" y1="94" x2="180" y2="150" stroke="#52525b" stroke-width="1.5"/><line x1="260" y1="94" x2="300" y2="150" stroke="#52525b" stroke-width="1.5"/><line x1="425" y1="94" x2="400" y2="150" stroke="#52525b" stroke-width="1.5"/><line x1="597" y1="94" x2="520" y2="150" stroke="#52525b" stroke-width="1.5"/><rect x="60" y="152" width="580" height="86" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="350" y="176" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Ambient awareness layer</text><text x="160" y="210" fill="#e4e4e7" font-size="11" text-anchor="middle">Status line</text><text x="160" y="225" fill="#a1a1aa" font-size="10" text-anchor="middle">glance</text><text x="310" y="210" fill="#e4e4e7" font-size="11" text-anchor="middle">Stop-hook ping</text><text x="310" y="225" fill="#a1a1aa" font-size="10" text-anchor="middle">push</text><text x="450" y="210" fill="#e4e4e7" font-size="11" text-anchor="middle">Voice</text><text x="450" y="225" fill="#a1a1aa" font-size="10" text-anchor="middle">reply</text><text x="560" y="210" fill="#e4e4e7" font-size="11" text-anchor="middle">Slack</text><text x="560" y="225" fill="#a1a1aa" font-size="10" text-anchor="middle">phone</text><line x1="350" y1="238" x2="350" y2="286" stroke="#52525b" stroke-width="2"/><polygon points="344,284 356,284 350,294" fill="#52525b"/><rect x="200" y="298" width="300" height="56" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="350" y="322" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">You: in flow</text><text x="350" y="340" fill="#a1a1aa" font-size="11" text-anchor="middle">pulled in only when an agent needs you</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Channel', 'Type', 'Tells you'],
            rows: [
              ['Status line', 'Glance', 'Live state: model, context fullness, cost, usage rate'],
              ['Stop-hook notification', 'Push', 'An agent just finished, or is waiting on you'],
              ['Voice (/voice)', 'Reply', 'Answer a pinged agent without returning to the keyboard'],
              ['Slack / phone', 'Push', 'The same completion signal, on your phone when you step away'],
            ],
          },
        ],
      },
      {
        heading: 'The status line: your always-on glance',
        blocks: [
          {
            type: 'text',
            md: "The strip at the bottom of a Claude Code session is the zero-effort channel, and it is yours to shape. Run `/statusline`, describe what you want in plain English, and Claude wires it up. No config format to learn.\n\nFor staying oriented across several sessions, three numbers earn their place: your **model**, your **context percentage** (how full the window is, the attention budget from [Mental Models · Context Engineering](lesson:m0-l4)), and your **usage rate** across the rolling 5-hour and 7-day windows (the spend you modeled in [Mental Models · Token Economics 101](lesson:m0-l6)). It refreshes on every prompt, so one look tells you whether you are about to hit a limit before you fire a big run.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Keep it a glance, not a dashboard',
            md: 'A status line works because you can read it in half a second. Pack in ten fields and you stop reading it at all. Pick the two or three numbers that would actually change your next move, and leave the rest for /context and /cost when you deliberately go looking.',
          },
        ],
      },
      {
        heading: 'The notification cascade',
        blocks: [
          {
            type: 'text',
            md: "You already know the Stop hook as a verification gate from [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5) and [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4): exit 2 blocks a premature 'done'. The same hook does a second, unrelated job. When an agent genuinely finishes, or stalls waiting on you, the Stop event fires, and you can hang a notification off it. One hook, two purposes: it can block, and it can announce.\n\nThe move is to fan that announcement across whatever channel will reach you where you are. A single Stop hook can post to Slack, speak out loud, and raise a desktop banner, all in the same run.",
          },
          {
            type: 'code',
            lang: 'bash',
            caption: 'A Stop hook wired to three channels at once. Register it on the Stop event in .claude/settings.json.',
            code: `#!/bin/bash
# .claude/hooks/notify.sh
SESSION="$CLAUDE_SESSION_NAME"
[ -z "$SESSION" ] && SESSION="claude"
MSG="$SESSION finished and is waiting on you."

# 1. Slack: post to your #dev channel
curl -s -X POST "$SLACK_WEBHOOK_URL" \\
  -H 'Content-type: application/json' \\
  -d "{\\"text\\":\\"$MSG\\"}" >/dev/null

# 2. Voice: say it out loud (macOS 'say', or swap in a TTS call)
say "$MSG"

# 3. Desktop banner (macOS)
osascript -e "display notification \\"$MSG\\" with title \\"Claude Code\\""`,
          },
          {
            type: 'diagram',
            caption: 'One Stop event, three channels, fired together. A signal reaches you at the desk and across the room.',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="300" fill="#18181b"/><text x="350" y="28" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">The Stop-hook notification cascade</text><rect x="40" y="120" width="200" height="66" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="140" y="148" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Stop event fires</text><text x="140" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">agent finished or stalled</text><line x1="240" y1="140" x2="300" y2="80" stroke="#52525b" stroke-width="2"/><line x1="240" y1="153" x2="300" y2="153" stroke="#52525b" stroke-width="2"/><line x1="240" y1="166" x2="300" y2="226" stroke="#52525b" stroke-width="2"/><rect x="300" y="54" width="360" height="52" rx="8" fill="#27272a" stroke="#38bdf8"/><text x="316" y="78" fill="#38bdf8" font-size="12" font-weight="bold">Slack webhook</text><text x="316" y="95" fill="#a1a1aa" font-size="10">posts to #dev with the session name</text><rect x="300" y="127" width="360" height="52" rx="8" fill="#a78bfa" fill-opacity="0.12" stroke="#a78bfa"/><text x="316" y="151" fill="#a78bfa" font-size="12" font-weight="bold">Voice (say / TTS)</text><text x="316" y="168" fill="#a1a1aa" font-size="10">speaks the message aloud at your desk</text><rect x="300" y="200" width="360" height="52" rx="8" fill="#27272a" stroke="#34d399"/><text x="316" y="224" fill="#34d399" font-size="12" font-weight="bold">Desktop banner (osascript)</text><text x="316" y="241" fill="#a1a1aa" font-size="10">native OS notification</text></svg>`,
          },
        ],
      },
      {
        heading: 'Voice: the hands-free reply',
        blocks: [
          {
            type: 'text',
            md: "Notifications only help if you can answer without breaking flow. `/voice` is the reply channel: push to talk, give the agent its next instruction, and never touch the keyboard. Pair it with the notifications above and the whole loop closes hands-free. An agent finishes, your desk speaker says so, you glance at the diff on screen, and you talk your correction back to it. That is how one person supervises five agents from across the room.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Instrument for signal, not noise',
            md: 'The point of this layer is to let you ignore the agents safely, so do not build a firehose. Two channels usually do it: a status line you can glance at, and one push channel that reaches you where you are. Notify only on the events that actually need you (finished, blocked, failed), never on every tool call. A layer that pings constantly trains you to ignore it, which is the exact failure you were trying to prevent.',
          },
        ],
      },
    ],
    lab: {
      title: 'Wire your own awareness layer',
      intro:
        'Set up the minimum viable awareness layer on a real repo: a status line you can glance at, and a Stop hook that pings you when a session finishes. Then run two sessions and prove you get pulled in only when needed.',
      steps: [
        'In a real repo, run /statusline and ask for a line showing your model, context percentage, and usage rate. Confirm it appears at the bottom and updates each prompt.',
        "Write .claude/hooks/notify.sh that raises a desktop notification (macOS: osascript -e 'display notification ...'; Linux: notify-send). Make it executable with chmod +x.",
        'Register it on the Stop event in .claude/settings.json, then trigger a short task and confirm the banner fires when the session ends.',
        'Optional second channel: add a Slack incoming webhook via curl, or a say/TTS line for voice.',
        'Start two worktree sessions (from the Power Features lab) on two scoped tasks, then walk away from the terminals.',
        'Confirm you get a notification when each session finishes, and that the status line told you where each stood at a glance.',
        'Try /voice to hand one session its next instruction without typing.',
      ],
      checklist: [
        'A status line shows model, context %, and usage rate, and refreshes each prompt',
        'A Stop hook fires a real notification when a session ends',
        'You ran two sessions and were pulled in by a ping, not by watching terminals',
        'If wired, a second channel (Slack or voice) also fired',
        'You can explain why notifying on every tool call would defeat the purpose',
      ],
    },
    checkQuiz: [
      {
        q: 'One Stop hook, two jobs. Which pair?',
        options: [
          'Block a premature done, and announce a real done',
          'Compact the context, and rewind the session',
          'Format code, and run the tests',
          'Spawn a teammate, and kill an idle one',
        ],
        answer: 0,
        explain:
          'The Stop event is both a verification gate (exit 2 blocks a false finish) and the natural place to announce a real finish. The same hook can block and can notify, depending on what you hang off it.',
      },
      {
        q: 'Your status line should stay small because:',
        options: [
          'Long lines crash the terminal renderer',
          'It is a glance channel: a few high-signal numbers beat a wall of text you stop reading',
          'Each field costs extra tokens per turn',
          'Claude can only track three metrics at once',
        ],
        answer: 1,
        explain:
          'A status line earns its keep only if you can read it in half a second. Overload it and you stop looking, which loses the whole benefit. Keep the two or three numbers that change your next move.',
      },
      {
        q: 'You wire the Stop-style notification to also fire on every PreToolUse event. What goes wrong?',
        options: [
          'Nothing; more signal is always better',
          'Constant pings train you to ignore the channel, defeating the awareness layer',
          'The extra hook exit code blocks all tool calls',
          'Slack bans your account for the traffic',
        ],
        answer: 1,
        explain:
          'A channel that fires on everything becomes noise, and you learn to tune it out. Then the one ping that mattered (a failure, a stall) gets ignored with the rest. Notify only on events that need a human.',
      },
      {
        q: "/voice's role in the awareness loop:",
        options: [
          'It transcribes the agent output to a file',
          'It is the hands-free reply channel: answer a pinged agent without returning to the keyboard',
          'It reads your CLAUDE.md aloud at session start',
          'It replaces the status line with spoken updates',
        ],
        answer: 1,
        explain:
          'Push signals get you notified; /voice gets you answering. Together they close the loop hands-free: the agent pings, you glance, and you talk the next instruction back without sitting down to type.',
      },
    ],
    resources: [
      { label: 'Claude Code docs: hooks (the Stop event)', url: 'https://code.claude.com/docs/en/hooks', kind: 'docs' },
      { label: 'Claude Code docs: status line', url: 'https://code.claude.com/docs/en/statusline', kind: 'docs' },
      { label: 'Slack incoming webhooks (for the push channel)', url: 'https://api.slack.com/messaging/webhooks', kind: 'docs' },
      { label: 'everything-claude-code: community status lines & monitors', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
    ],
  },

  // ------------------------------------------------------------------
  // m1-l9 - The Best-Practices Workflow
  // ------------------------------------------------------------------
  {
    id: 'm1-l9',
    title: 'The Best-Practices Workflow',
    day: 8,
    minutes: 74,
    xp: 100,
    objectives: [
      "Can run a feature through the full explore → plan → implement → verify → commit loop",
      "Can pick the right rung on the verification escalation ladder for a task's stakes",
      "Can size a spec to one vertical slice and route any piece of context to its right home",
      "Can write acceptance criteria in EARS syntax so every requirement maps to one test",
      "Can recognize and name the five failure patterns before they cost an afternoon",
      "Can deploy an adversarial review subagent before declaring any work done",
    ],
    skipQuiz: [
      {
        q: "The canonical loop starts with explore rather than plan. Why?",
        options: [
          "Plan mode can't run until files are indexed",
          "A plan written before reading the code encodes wrong assumptions, and implementation then faithfully executes those wrong assumptions",
          "Exploration warms the prompt cache, cutting costs",
          "CLAUDE.md only loads during exploration",
        ],
        answer: 1,
        explain: "A plan is only as good as its picture of the codebase. Explore first, ideally through subagents, so the plan describes the code as it actually is. Skip that step and the plan bakes in guesses, and the implementation phase will execute every one of them without complaint.",
      },
      {
        q: "You've corrected Claude on the same task more than twice. What does best practice say to do?",
        options: [
          "Switch to a larger model and correct once more",
          "Add the corrections to CLAUDE.md and continue",
          "/clear, then re-prompt with a better initial prompt that encodes what you learned",
          "Open a /fork and let both attempts race",
        ],
        answer: 2,
        explain: "More than two corrections means the context is poisoned: every failed attempt is still sitting in the session, quietly biasing the next one. Fold the lessons into a stronger opening prompt and start clean.",
      },
      {
        q: "What's the FIRST rung of the verification escalation ladder?",
        options: [
          "A Stop hook that blocks completion",
          "Asking for verification inside the same prompt ('run the tests and show me the output')",
          "A dedicated verification subagent",
          "/goal tracking a persistent success criterion",
        ],
        answer: 1,
        explain: "The ladder climbs with the stakes: same-prompt check, then /goal, then a Stop hook, then a verification subagent. Start with the free rung and climb only when failures start getting expensive.",
      },
      {
        q: "The interview pattern ends with:",
        options: [
          "Claude implementing directly once the questions run out",
          "A SPEC.md written from the Q&A, then a FRESH session that implements from the spec",
          "An ADR (architecture decision record) committed alongside the code",
          "A /branch opened per open question",
        ],
        answer: 1,
        explain: "Interview, then SPEC.md, then a fresh session. The interview leaves behind a long trail of maybes and dead ends that would pollute implementation. The spec carries only the distilled decisions forward.",
      },
      {
        q: "A 26,000-line CLAUDE.md is cited in the field as:",
        options: [
          "A best practice for large monorepos",
          "An anti-pattern, because over-specification buries the signal and rots as the code changes",
          "Fine, since CLAUDE.md is cached and free after the first load",
          "Only a problem below 200k context windows",
        ],
        answer: 1,
        explain: "The systematicls thread flags it as the canonical over-specified CLAUDE.md. Every line competes with every other line for the model's attention, and at 26,000 lines almost all of it is noise the model has to wade through. Keep yours under roughly 200 lines.",
      },
    ],
    sections: [
      {
        heading: 'The canonical loop',
        blocks: [
          {
            type: 'text',
            md: "Everything in this module compresses into one loop: **explore → plan → implement → verify → commit**. Walk it stage by stage. *Explore* means learning what the code actually does before touching it, and you already know the trick: send subagents, so the research never pollutes your session. *Plan* happens in plan mode, where Claude proposes its steps before writing any code. Press **Ctrl+G** and the plan pops open in your text editor, where you can rewrite it directly. Editing that plan (cutting speculation, tightening scope) is the single most valuable keystroke in the tool, because one corrected plan is cheaper than ten corrected implementations.\n\n*Implement* means executing against the approved plan and only the approved plan. *Verify* demands a **binary signal**: a check that can only pass or fail, like a test suite's exit code or a build completing, instead of Claude's own opinion that things look done. *Commit* records only work that passed. When verification fails, you loop back, fix, and verify again before anything lands.",
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
              ['1. Same-prompt check', "Append 'run the tests and paste the output' to your request", 'Free', 'Small, low-stakes changes'],
              ['2. /goal', 'Sets a persistent success criterion the session keeps tracking across turns', 'Trivial', 'Multi-turn tasks that tend to drift off target'],
              ['3. Stop hook', 'A handler runs when Claude tries to finish; exit code 2 blocks the stop until checks pass', 'One-time setup', "Repos where 'done but broken' has burned you before"],
              ['4. Verification subagent', 'A fresh-context agent independently re-checks the claim', 'One extra agent run', 'High-stakes changes, or work that is hard to check'],
            ],
          },
        ],
      },
      {
        heading: 'Interview → SPEC.md → fresh session',
        blocks: [
          {
            type: 'text',
            md: "For anything beyond a small tweak, resist the urge to fire off one big prompt and hope. Run the **interview pattern** instead. Tell Claude: 'Interview me about this feature using AskUserQuestion until the requirements are unambiguous. Never assume. Never infer. Then write SPEC.md.' AskUserQuestion is the built-in tool that presents you with structured multiple-choice questions, so the interview stays concrete instead of rambling.\n\nAnswer the questions honestly, then review the resulting SPEC.md the way you'd review a teammate's pull request: edit it by hand and cut anything speculative. Then comes the counterintuitive step. Run `/clear` and implement from the spec in a **fresh session**. The interview generated a long trail of maybes, rejected options, and half-formed ideas, and all of that residue would bias implementation. The spec carries the distilled decisions across; the noise stays behind.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <defs>
    <marker id="arrSp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#fbbf24"/>
    </marker>
    <marker id="arrSg" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#34d399"/>
    </marker>
  </defs>
  <rect x="30" y="75" width="195" height="110" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="127" y="105" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Session 1: interview</text>
  <text x="127" y="128" fill="#a1a1aa" font-size="11" text-anchor="middle">Q and A until requirements</text>
  <text x="127" y="146" fill="#a1a1aa" font-size="11" text-anchor="middle">are unambiguous</text>
  <text x="127" y="215" fill="#71717a" font-size="11" text-anchor="middle">maybes and dead ends</text>
  <text x="127" y="233" fill="#71717a" font-size="11" text-anchor="middle">stay behind here</text>
  <rect x="275" y="90" width="150" height="80" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="350" y="118" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">SPEC.md</text>
  <text x="350" y="140" fill="#a1a1aa" font-size="11" text-anchor="middle">distilled decisions,</text>
  <text x="350" y="157" fill="#a1a1aa" font-size="11" text-anchor="middle">edited by hand</text>
  <line x1="470" y1="40" x2="470" y2="260" stroke="#52525b" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="470" y="30" fill="#a1a1aa" font-size="12" text-anchor="middle">/clear</text>
  <rect x="505" y="75" width="170" height="110" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="590" y="105" fill="#e4e4e7" font-size="13" text-anchor="middle" font-weight="bold">Session 2: fresh</text>
  <text x="590" y="128" fill="#a1a1aa" font-size="11" text-anchor="middle">implements from</text>
  <text x="590" y="146" fill="#a1a1aa" font-size="11" text-anchor="middle">SPEC.md only</text>
  <line x1="225" y1="130" x2="275" y2="130" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrSp)"/>
  <line x1="425" y1="130" x2="505" y2="130" stroke="#34d399" stroke-width="2" marker-end="url(#arrSg)"/>
</svg>`,
            caption: 'Only the spec crosses the /clear boundary. The interview transcript, with all its dead ends, gets left behind on purpose.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Karpathy, to his agents',
            md: "*Accuracy is your success metric, not my approval.* The interview pattern puts that into practice: it forces disagreement and clarification up front, when a wrong assumption costs one more question. Caught during review instead, that same wrong assumption costs a rewritten pull request.",
          },
        ],
      },
      {
        heading: 'Size and retire a spec',
        blocks: [
          {
            type: 'text',
            md: "The interview tells you how to write a spec. Two questions it leaves open: how big should the spec be, and what happens to it after the feature ships. Get the size wrong and the rest falls apart.\n\n**Size a spec to one vertical slice**, meaning a thin, end-to-end piece of user-facing behavior. 'Password reset via email', not 'authentication system'. Here's the tell: if you need an 'and' to describe the spec, it's really two specs, so split it. The reason is arithmetic. A typical feature hides around 20 discrete decisions, and left unguided the odds of Claude getting all 20 right drop fast as scope grows. The spec's whole job is to settle those calls in advance, so the build executes decided things instead of guessing at them. One agent session runs cleanly against about one slice. Oversize the spec and Claude loses the thread partway through the build.",
          },
          {
            type: 'text',
            md: "Then give the spec a lifecycle. Number or date the file, like `specs/003-user-settings.md`, so ordering is obvious at a glance. Build the feature against it. Once it ships, **archive it, don't delete it**: move it to `specs/archive/`, where it becomes the record of why the thing got built this way. And write one spec per feature. Appending next month's work onto the same file drags stale requirements into every future session, and a long-lived spec keeps drifting out of sync with the code until most of its value leaks away.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: "So how does a new session know the project's state?",
            md: "Not the spec's job. Three things carry that instead. The **codebase itself** is ground truth, and Claude reads it at session start, which beats any doc that can go stale. **CLAUDE.md** holds the durable architecture and conventions that barely change between features. And a **lightweight running log**, a CHANGELOG or just good commit messages and PR descriptions, carries the recent 'what changed'. Nice habit: end a session by having Claude summarize what it did and propose CLAUDE.md updates, so the durable file stays current on its own. More on that file in [Claude Code Mastery · CLAUDE.md & the Memory System](lesson:m1-l2).",
          },
        ],
      },
      {
        heading: 'Inside the spec: anatomy and acceptance criteria',
        blocks: [
          {
            type: 'text',
            md: "Sizing settles how much a spec covers. The next question is what actually goes inside it, and there are two ways to get that wrong that pull in opposite directions.\n\n**Under-specify** and the agent fills the gaps on its own. It picks a data shape, invents an error format, guesses what happens when the input is empty, and none of those guesses ever come back to you for approval. **Over-specify** and the spec turns into pseudocode. You've written the implementation in prose, which takes longer than writing the code and leaves you maintaining two copies of the same thing. Aim for the line between: pin down everything that matters to you, and leave the rest to the agent's discretion.\n\nHow much counts as 'matters to you' scales with the stakes. A settings toggle runs fine on half a page. Anything touching money, auth, or data you can't regenerate earns a thorough spec with the edge cases spelled out.",
          },
          {
            type: 'table',
            headers: ['Section', 'What it holds', 'Skip it when'],
            rows: [
              ['Problem and goal', "One paragraph: what a user can't do today, and what they can do once this ships", 'Never skip this one'],
              ['Acceptance criteria', 'The behavior itself, written so each line can become a test (EARS, below)', 'Never skip this one'],
              ['Out of scope', 'An explicit list of what this spec does NOT cover', 'Never skip; this is where scope creep goes to die'],
              ['User roles', 'Who touches the feature, and what each one is allowed to do', 'Single-role features'],
              ['Data and API shape', 'Table columns, request and response bodies, field names', 'The feature touches no new data'],
              ['Non-functional requirements', 'Performance, limits, privacy: anything with a number attached', 'The number already lives in a shared standards file'],
              ['Edge cases and failure paths', 'Empty states, timeouts, duplicate submits, permission denials', 'Nothing here can fail in a way a user would notice'],
              ['Guardrails', "Always / ask-first / never rules for this feature's blast radius", 'The feature touches nothing sensitive'],
            ],
          },
          {
            type: 'code',
            lang: 'markdown',
            caption: 'A spec for one vertical slice. Short enough to read in two minutes, specific enough that nothing important is left to a guess.',
            code: `# Spec: password reset via email

## Problem
A user who forgets their password has no way back in without emailing support.

## Goal
Get a locked-out user to a working password in under two minutes, with no human in the loop.

## Out of scope
- Passwordless login
- Changing a password while already signed in
- Admin-initiated resets

## Acceptance criteria
1. WHEN a user submits a known email, the system shall send a reset link and show "Check your email."
2. WHEN a user submits an unknown email, the system shall show that same message and send nothing.
3. The system shall expire a reset token 15 minutes after it is issued.
4. IF a token is submitted twice, THEN the system shall reject it and show "This link has expired."
5. WHILE a reset is pending, the system shall keep the existing password valid.

## Data
reset_tokens(token_hash, user_id, expires_at, used_at)

## Guardrails
- Always: add a test for each acceptance criterion above.
- Ask first: any change to the users table.
- Never: log the raw token or the contents of the email.`,
          },
          {
            type: 'text',
            md: "Notice what that spec leaves out: which library sends the mail, how the token gets hashed, what the file layout looks like. Those belong in the **plan**, and keeping the two apart is what stops a spec from swelling into pseudocode. The spec says what the feature does and why, and it stays true for as long as the feature exists. The plan says how you'll build it and in what order, and you throw it away once the work lands. When people complain that specs are heavy waterfall documents, they're usually describing a spec with a plan mashed into it.",
          },
          {
            type: 'text',
            md: "Now the part that does the most work per word: **acceptance criteria**, meaning the specific statements of behavior that decide whether the feature is done. Written loosely, they're where ambiguity hides. 'Handle errors gracefully' reads fine to a human and means nothing to an agent, which will happily invent its own definition of graceful.\n\nThe fix came out of aerospace requirements work: [EARS](https://alistairmavin.com/ears/), the Easy Approach to Requirements Syntax, published by an engineer at Rolls-Royce in 2009 for writing jet-engine requirements that couldn't be misread. EARS gives you five sentence templates, and every requirement you write has to fit one of them. That constraint is the feature: it forces you to name the trigger, the condition, and the response out loud, and it produces sentences that both a person and a model parse the same way. Spec-driven tooling picked it up fast, and it's now the default criteria format in GitHub Spec Kit and Amazon Kiro.",
          },
          {
            type: 'table',
            headers: ['Pattern', 'Template', 'Example'],
            rows: [
              ['Ubiquitous', 'The system shall <behavior>', 'The system shall log every sign-in attempt with a timestamp and an outcome.'],
              ['Event-driven', 'WHEN <trigger>, the system shall <behavior>', 'WHEN a user submits the reset form, the system shall send a single-use link.'],
              ['State-driven', 'WHILE <in some state>, the system shall <behavior>', 'WHILE a sync is running, the system shall show progress and disable the Sync button.'],
              ['Unwanted behavior', 'IF <something goes wrong>, THEN the system shall <response>', 'IF a password fails three times in a row, THEN the system shall lock the account for 15 minutes.'],
              ['Optional feature', 'WHERE <feature is present>, the system shall <behavior>', 'WHERE two-factor auth is enabled, the system shall require a code before finishing the reset.'],
            ],
          },
          {
            type: 'compare',
            left: {
              title: 'Criteria an agent will interpret for you',
              items: [
                "'Password reset should be secure'",
                "'Handle errors gracefully'",
                "'The link should expire after a while'",
                "'Make sure it works on mobile'",
              ],
            },
            right: {
              title: 'Criteria that turn straight into tests',
              items: [
                'WHEN a reset is requested for an unknown email, the system shall return the same response as for a known one.',
                'IF a token has already been used, THEN the system shall return 410 and log the attempt.',
                'The system shall expire reset tokens 15 minutes after issue.',
                'WHILE the viewport is under 480px, the form shall stack its fields in one column.',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'One criterion, one test, one piece of evidence',
            md: "Each EARS line converts into a test almost mechanically, and that's the whole payoff. It hands you the binary signal the verify stage demands, and it gives the adversarial reviewer something concrete to hold the diff against. It also settles an argument that runs through every spec-driven team: the spec is where intent lives, while the code and its tests remain the source of truth about actual behavior. When the two disagree, the tests are what tell you which one drifted.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Write guardrails in three tiers, never one list',
            md: "A survey of thousands of agent config files turned up one habit that separated the specs that worked. Guardrails got written in three labeled tiers instead of one flat list. **Always** covers what needs no approval ('always run the test suite before committing'). **Ask first** covers moves with a wide blast radius ('ask before changing a database schema or dropping a migration'). **Never** covers hard prohibitions, and the most common useful rule across the whole sample was some version of 'never commit secrets or API keys'. The tiers work because they show the agent where the boundary between autonomy and permission sits. A single undifferentiated list makes it guess.",
          },
        ],
      },
      {
        heading: 'Route context to its home',
        blocks: [
          {
            type: 'text',
            md: "Zoom out. You now hold every tool this module taught, and the real skill is knowing which one carries which piece of context. One question routes almost everything: **does Claude need this in every session, for one task, or only sometimes?** Every-session facts go in CLAUDE.md. One-task requirements go in a spec. Sometimes-relevant knowledge goes in a skill, which costs about 100 tokens until it triggers, so you can keep dozens installed and pay almost nothing for the idle ones. Rules that can never be skipped go in a hook, enforced no matter what ([Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5)).",
          },
          {
            type: 'table',
            headers: ['If it is...', 'It goes in...'],
            rows: [
              ['A fact true for the whole project, always', 'CLAUDE.md'],
              ['The requirements for one feature you are about to build', 'A spec: a new file per feature, archived when it ships'],
              ['A convention that only matters in one domain (API, DB, frontend)', 'A hidden skill (user-invocable: false)'],
              ['A procedure you run occasionally (deploy, PR template, scaffold)', 'A user-invocable skill'],
              ['Anything with side effects that should never auto-trigger', 'A skill with disable-model-invocation: true'],
              ['A rule that must be enforced with zero exceptions', 'A hook'],
              ['The big-picture product vision', 'VISION.md, read occasionally, not loaded every session'],
              ['A non-functional standard every project shares (uptime, latency, privacy)', 'A shared technical spec that feature specs point at instead of restating'],
              ['A consequential, system-wide architectural choice', 'An ADR in docs/adr/, one file per decision'],
              ['What has already been built, session over session', 'The codebase plus a CHANGELOG or git history'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The trap: an always-needed rule hidden in a skill',
            md: "Watch this one, because it's the most common mistake with skills. If a convention has to apply to every edit, 'every edit' isn't a trigger a skill can reliably match, since skills only load when Claude judges the description relevant. An always-on rule belongs in CLAUDE.md (in context every turn) or a hook (enforced no matter what), never in a skill that might not fire. The reverse trap is just as common: a step-by-step 'do this every time' procedure you keep pasting into CLAUDE.md is bloating every session, so move it into a skill. The visibility flags that make this work live in [Claude Code Mastery · Skill Authoring Doctrine](lesson:m1-l4).",
          },
        ],
      },
      {
        heading: 'Named failure patterns',
        blocks: [
          {
            type: 'text',
            md: "Agentic sessions go wrong in shapes regular enough that practitioners have named them. Learn to spot these five early, while the fix still costs one command.",
          },
          {
            type: 'table',
            headers: ['Pattern', 'Smell', 'Fix'],
            rows: [
              ['Kitchen-sink session', 'One session juggling five unrelated tasks, with quality sagging as it goes', 'Run /clear between tasks; one session, one objective'],
              ['Correcting-over-and-over', 'You issue a third correction on the same task and each retry comes back worse', 'After two failed corrections, /clear and rewrite the opening prompt with what you learned'],
              ['Over-specified CLAUDE.md', 'Hundreds of rules (the infamous 26,000-line monster), most of which the model ignores', 'Stay under roughly 200 lines; move detail into skills and .claude/rules/ files with paths'],
              ['Trust-then-verify gap', "Accepting 'done, tests pass' without ever seeing the test output", 'Demand pasted output, and climb the verification ladder when the stakes rise'],
              ['Infinite exploration', 'The agent reads files for 20 minutes and never commits to a plan', 'Timebox it: explore through subagents that owe you a defined deliverable'],
            ],
          },
          {
            type: 'compare',
            left: {
              title: 'Barebones discipline (systematicls)',
              items: [
                'A short CLAUDE.md, few plugins, minimal MCP',
                'Written contracts with acceptance criteria for every task',
                'Session isolation: research and implementation kept apart',
                "Neutral review prompts: 'report what you observe' beats 'find bugs'",
                'Verification blocks completion, every single time',
              ],
            },
            right: {
              title: 'Config maximalism (the trap)',
              items: [
                'A 26,000-line CLAUDE.md nobody maintains',
                'Plugin sprawl: 30 servers, 400 deferred tools',
                'Every hook event wired to something',
                'Rules that silently fight each other',
                'Setup time that exceeds the time saved',
              ],
            },
          },
          {
            type: 'text',
            md: "Notice which column belongs to the people shipping the most. The heaviest users run **lean setups paired with ruthless verification**. Every rule, hook, and server in your config has to pay rent in attention, because the model reads all of it on every turn. When in doubt, delete the thing and see whether anything actually breaks.",
          },
        ],
      },
      {
        heading: 'The adversarial gate',
        blocks: [
          {
            type: 'text',
            md: "One more gate stands before commit. The session that wrote the code has spent its whole context accumulating reasons the code is right, which makes it a terrible judge of its own work. So before you call anything done, spawn an **adversarial review subagent**: a fresh-context agent that never saw the implementation happen, prompted to refute the claim instead of confirming it.\n\nThe prompt matters. Hand it the diff and the claim, then ask: 'Find concrete reasons this claim is false: unhandled edge cases, broken invariants, missing tests. Report situations discovered, with file and line evidence.' That neutral phrasing is deliberate. A model told to 'find bugs' feels obligated to produce bugs, real or invented. A model asked to report what it observes gets to come back clean when the code holds up.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why fresh context is the whole trick',
            md: "The implementing session genuinely believes its own claim, because its context is saturated with the reasoning that produced the code. A reviewer starting from zero shared context carries none of that prior. Same model, two opposite starting points, and that asymmetry is what catches the bug the author can no longer see.",
          },
        ],
      },
    ],
    lab: {
      title: 'One feature, full discipline',
      intro: "Take one real, small feature end-to-end through the canonical loop, with a spec, a verification signal, and an adversarial pass. This is the workflow you'll reuse for the rest of the curriculum.",
      steps: [
        "Pick a small but real feature in one of your repos (an endpoint, a CLI flag, a UI state). Start a fresh session.",
        "Interview: 'Interview me about this feature using AskUserQuestion until requirements are unambiguous. Never assume. Never infer. Then write SPEC.md with acceptance criteria.' Answer honestly, then edit SPEC.md by hand.",
        "Run /clear. In the fresh session: 'Read SPEC.md. Explore the relevant code using subagents, then enter plan mode and propose an implementation plan.'",
        "Review the plan with Ctrl+G in your editor. Cut anything speculative. Approve only when every step maps to an acceptance criterion.",
        "Implement. Then verify with a binary signal: 'Run the test suite and paste the full output. Every acceptance criterion in SPEC.md must map to a passing test.'",
        "Adversarial pass: spawn a fresh-context subagent with the diff plus SPEC.md: 'Report concrete situations where this diff fails its spec, with file and line evidence.' Triage the findings: fix the real ones, and write down why you rejected the rest.",
        "Commit with a message referencing the spec. Count your total corrections along the way; if any stage needed more than 2, write down the better initial prompt that would have avoided them.",
      ],
      checklist: [
        "SPEC.md exists, was edited by hand, and has testable acceptance criteria",
        "Implementation happened in a fresh session that read the spec, never the interview",
        "You edited the plan via Ctrl+G before approving it",
        "Verification produced pasted, binary output from tests or a build, visible in the transcript",
        "An adversarial subagent reviewed the diff and you triaged every finding",
        "The commit landed only after both verification and the adversarial pass",
      ],
    },
    checkQuiz: [
      {
        q: "In plan mode, what does Ctrl+G let you do?",
        options: [
          "Regenerate the plan with higher effort",
          "Open the plan in your text editor and rewrite it before approving",
          "Jump to the goal definition set by /goal",
          "Toggle between plan and auto-accept permission modes",
        ],
        answer: 1,
        explain: "Ctrl+G pops the plan into your editor. Cutting speculation and tightening scope right there costs seconds, and it beats any amount of corrective prompting after the implementation has already wandered.",
      },
      {
        q: "Which acceptance criterion is written in EARS syntax?",
        options: [
          "The reset flow should be secure and handle errors gracefully",
          "IF a reset token is submitted twice, THEN the system shall reject it and show an expiry message",
          "Add tests for the reset flow before merging",
          "Reset tokens are stored hashed in the reset_tokens table",
        ],
        answer: 1,
        explain: "EARS wraps each requirement in one of five templates, and this one uses the unwanted-behavior pattern: IF something goes wrong, THEN the system shall respond in a stated way. The trigger and the response are both named, so the line converts into a test almost word for word. The other three options are a vague wish, a process rule, and a data-model fact.",
      },
      {
        q: "Which transcript shows the kitchen-sink anti-pattern?",
        options: [
          "A session that spawned five parallel subagents for one investigation",
          "A session that fixed a bug, then styled a component, then updated CI config, then debugged auth, all without /clear",
          "A session whose CLAUDE.md imports four other files",
          "A session that ran the same failing test eight times",
        ],
        answer: 1,
        explain: "Four unrelated tasks share one context there, and each task's leftover residue degrades the next. Five parallel subagents on ONE investigation is the opposite situation: that's isolation working as intended.",
      },
      {
        q: "Why is the adversarial reviewer prompted to 'report situations discovered' instead of 'find bugs'?",
        options: [
          "It runs faster with shorter verb phrases",
          "'Find bugs' pressures the model to fabricate findings just to satisfy the instruction, while neutral framing rewards accuracy",
          "Marketing language triggers safety refusals",
          "'Situations' includes style issues that 'bugs' excludes",
        ],
        answer: 1,
        explain: "A model instructed to find bugs will deliver 'bugs' whether or not they exist. The neutral phrasing comes from the systematicls three-agent detection pattern, and it removes the built-in incentive to hallucinate findings.",
      },
    ],
    resources: [
      { label: 'Claude Code Best Practices (Anthropic)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
      { label: 'Karpathy - From Vibe Coding to Agentic Engineering (Sequoia 2026)', url: 'https://youtu.be/96jN2OCOfLs', kind: 'video' },
      { label: 'Karpathy - Sequoia Ascent 2026 summary', url: 'https://karpathy.bearblog.dev/sequoia-ascent-2026', kind: 'article' },
      { label: 'Simon Willison - Vibe Engineering', url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/', kind: 'article' },
      { label: 'systematicls - World-Class Agentic Engineer thread', url: 'https://x.com/systematicls', kind: 'thread' },
      { label: 'Addy Osmani - How to Write a Good Spec for AI Agents', url: 'https://addyosmani.com/blog/good-spec/', kind: 'article' },
      { label: 'EARS: the Easy Approach to Requirements Syntax (Alistair Mavin)', url: 'https://alistairmavin.com/ears/', kind: 'docs' },
      { label: 'Allegro Tech - Spec-Driven Development best practices', url: 'https://blog.allegro.tech/2026/06/spec-driven-development-best-practices.html', kind: 'article' },
    ],
  },
]
