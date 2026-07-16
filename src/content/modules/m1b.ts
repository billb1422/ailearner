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
  // m1-l9 - The Best-Practices Workflow
  // ------------------------------------------------------------------
  {
    id: 'm1-l9',
    title: 'The Best-Practices Workflow',
    day: 8,
    minutes: 55,
    xp: 100,
    objectives: [
      "Can run a feature through the full explore → plan → implement → verify → commit loop",
      "Can pick the right rung on the verification escalation ladder for a task's stakes",
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
        q: "Mechanically, how does a Stop hook enforce verification?",
        options: [
          "It appends test results to every response",
          "It runs a handler when the session tries to stop, and an exit code of 2 blocks completion until the checks pass",
          "It reverts the last commit if CI fails",
          "It forces plan mode before any Edit tool call",
        ],
        answer: 1,
        explain: "Stop hooks fire at the moment Claude claims to be finished. If your handler script exits with code 2, the stop gets rejected and the session has to keep working until the real check finally passes.",
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
    ],
  },
]
