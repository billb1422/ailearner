import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m1-l1 — Claude Code Fundamentals & the .claude Folder
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l1',
    title: 'Claude Code Fundamentals & the .claude Folder',
    day: 4,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can name the five-plus Claude Code surfaces and pick the right one for a task',
      'Can choose the correct permission mode (including auto mode and /sandbox) and explain why --dangerously-skip-permissions is obsolete',
      'Can bootstrap a project with /init and explain the purpose of every entry in .claude/',
      'Can diagnose install and config problems with /doctor',
    ],
    skipQuiz: [
      {
        q: 'Your team commits its Claude Code config to git. Which file should stay OUT of version control?',
        options: [
          '.claude/settings.json',
          '.claude/settings.local.json',
          'CLAUDE.md',
          '.claude/rules/',
        ],
        answer: 1,
        explain:
          'settings.local.json holds personal overrides and is auto-git-ignored. settings.json, CLAUDE.md, and rules/ are shared team config and belong in the repo.',
      },
      {
        q: 'What is the current (2026) replacement for the old --dangerously-skip-permissions workflow?',
        options: [
          'acceptEdits mode on every project',
          'auto permission mode (classifier-reviewed) combined with /sandbox isolation',
          'plan mode with manual approval batches',
          'running Claude Code as root so prompts never fire',
        ],
        answer: 1,
        explain:
          'Auto mode has a classifier review each action and only escalates risky ones; /sandbox adds OS-level filesystem and network isolation. Together they replace the blunt skip-everything flag.',
      },
      {
        q: 'How does auto permission mode actually decide whether to prompt you?',
        options: [
          'It matches commands against your allowlist regexes only',
          'A small classifier reviews each proposed action and escalates only the risky ones',
          'It asks once at session start, then allows everything',
          'It defers every decision to rules written in CLAUDE.md',
        ],
        answer: 1,
        explain:
          'Auto mode is classifier-reviewed: routine actions flow through, destructive or unusual ones still surface a prompt. Allowlists and CLAUDE.md are separate mechanisms.',
      },
      {
        q: 'What does /init do on a fresh project?',
        options: [
          'Creates your Anthropic account and API key',
          'Scans the codebase and generates a starter project CLAUDE.md',
          'Installs the default MCP servers for the repo language',
          'Resets .claude/settings.json to factory defaults',
        ],
        answer: 1,
        explain:
          '/init inspects the repo (build tools, conventions, structure) and writes a first-draft CLAUDE.md you then prune. It touches memory, not accounts or MCP.',
      },
      {
        q: 'Which of these is NOT a real Claude Code surface in mid-2026?',
        options: [
          'Slack, by tagging @Claude in a channel',
          'iOS, via claude.ai/code sessions',
          'An official Anthropic-maintained Vim GUI',
          'JetBrains IDEs via the official extension',
        ],
        answer: 2,
        explain:
          'Terminal, VS Code/JetBrains extensions, desktop app, web + iOS, and Slack are the official surfaces. There is no Anthropic Vim GUI.',
      },
    ],
    sections: [
      {
        heading: 'One agent, five surfaces',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code stopped being "a CLI" a while ago. It is one agent runtime with five-plus front ends, all sharing the same `.claude/` config and the same session store. Pick the surface by ergonomics, not capability — a session started on your phone can be picked up in your terminal.',
          },
          {
            type: 'table',
            headers: ['Surface', 'Best for', 'Notes'],
            rows: [
              ['Terminal CLI', 'Deep work, scripting, `claude -p` headless', 'The reference surface; everything ships here first'],
              ['VS Code / JetBrains', 'Inline diffs, reviewing edits in-editor', 'Official extensions, same engine underneath'],
              ['Desktop app', 'Multiple parallel sessions, local projects', 'Manages worktrees for parallel agents'],
              ['Web + iOS (claude.ai/code)', 'Kick off / monitor cloud sessions anywhere', 'Runs in a cloud sandbox; hand off to CLI with --teleport'],
              ['Slack', 'Delegating from team chat', 'Tag @Claude in a thread; great for bug-report pastes'],
            ],
          },
        ],
      },
      {
        heading: 'Install, update, verify',
        blocks: [
          {
            type: 'code',
            lang: 'bash',
            code: 'npm install -g @anthropic-ai/claude-code\nclaude --version   # v2.1.x as of July 2026\nclaude update      # self-updates in place\nclaude doctor      # health check: install, settings, hooks, MCP',
            caption: 'Install once, then claude update keeps you current.',
          },
          {
            type: 'text',
            md: '`/doctor` (or `claude doctor` from the shell) validates your install and every config layer: malformed settings.json, broken hooks, unreachable MCP servers, version drift. Run it first whenever Claude Code behaves strangely — it turns "weird vibes" into a named misconfiguration.',
          },
        ],
      },
      {
        heading: 'Permission modes: the trust dial',
        blocks: [
          {
            type: 'table',
            headers: ['Mode', 'Behavior', 'When to use'],
            rows: [
              ['default', 'Prompts on first use of each tool/command', 'Unfamiliar or high-stakes repos'],
              ['acceptEdits', 'File edits auto-approved, commands still prompt', 'Tight iteration on trusted code'],
              ['plan', 'Read-only: explores and produces a plan, no writes', 'Design before you let it touch anything'],
              ['auto', 'Classifier reviews each action, escalates only risky ones', 'The 2026 daily-driver default'],
              ['bypassPermissions', 'No checks at all', 'Throwaway CI containers only'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Obsolete reflex: --dangerously-skip-permissions',
            md: 'Every 2025 blog post told you to alias this flag. Do not. Auto mode gives you the same flow with a classifier catching the `rm -rf` moments, and `/sandbox` runs commands under OS-level filesystem and network isolation so even approved actions cannot reach outside the project. Skipping permissions is now strictly worse, not faster.',
          },
        ],
      },
      {
        heading: '/init and the anatomy of .claude/',
        blocks: [
          {
            type: 'text',
            md: 'Run `/init` in any real repo and Claude scans the codebase — build system, test commands, conventions — and writes a starter `CLAUDE.md`. That file plus the `.claude/` directory is the entire project-level brain. Everything in it is plain text, diffable, and code-reviewable. Treat it like source.',
          },
          {
            type: 'diagram',
            caption: 'The .claude/ directory: six entries, one mental model — expertise as files.',
            svg: `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="380" fill="#18181b"/><text x="30" y="36" fill="#e4e4e7" font-size="16" font-weight="bold">your-project/</text><rect x="30" y="52" width="280" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="46" y="74" fill="#38bdf8" font-size="14" font-weight="bold">CLAUDE.md</text><text x="46" y="92" fill="#a1a1aa" font-size="11">project memory, loaded every session</text><text x="30" y="140" fill="#e4e4e7" font-size="15" font-weight="bold">.claude/</text><rect x="30" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="46" y="174" fill="#a78bfa" font-size="14" font-weight="bold">skills/</text><text x="46" y="192" fill="#a1a1aa" font-size="11">SKILL.md folders = expertise</text><rect x="250" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#f472b6"/><text x="266" y="174" fill="#f472b6" font-size="14" font-weight="bold">agents/</text><text x="266" y="192" fill="#a1a1aa" font-size="11">subagent definitions (*.md)</text><rect x="470" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#34d399"/><text x="486" y="174" fill="#34d399" font-size="14" font-weight="bold">rules/</text><text x="486" y="192" fill="#a1a1aa" font-size="11">scoped rules via paths: globs</text><rect x="30" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="46" y="246" fill="#fbbf24" font-size="14" font-weight="bold">settings.json</text><text x="46" y="264" fill="#a1a1aa" font-size="11">shared: permissions, hooks, MCP</text><rect x="250" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#52525b"/><text x="266" y="246" fill="#e4e4e7" font-size="14" font-weight="bold">settings.local.json</text><text x="266" y="264" fill="#a1a1aa" font-size="11">personal overrides, git-ignored</text><rect x="470" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#52525b"/><text x="486" y="246" fill="#e4e4e7" font-size="14" font-weight="bold">CLAUDE.local.md</text><text x="486" y="264" fill="#a1a1aa" font-size="11">personal memory, git-ignored</text><line x1="120" y1="104" x2="120" y2="150" stroke="#52525b" stroke-width="2"/><text x="30" y="330" fill="#a1a1aa" font-size="12">Commit everything except *.local.* — the folder IS your team's agent configuration.</text><text x="30" y="352" fill="#a1a1aa" font-size="12">All plain text: diffable, reviewable, portable across all five surfaces.</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Architecture lens',
            md: 'You already know this pattern: `.claude/` is to the agent what `package.json` + CI config is to the build. Files beat databases here because both humans and models read them natively. Every lesson this week fills in one of these entries.',
          },
        ],
      },
    ],
    lab: {
      title: 'Install, /init, and tour the brain',
      intro: 'Get to a current Claude Code on a real project of yours, generate the starter config, and be able to explain every file it made.',
      steps: [
        'Install or update: `npm install -g @anthropic-ai/claude-code`, then `claude --version` — confirm v2.1+.',
        'Run `claude doctor` and fix anything it flags before continuing.',
        'cd into a real project (not a toy), start `claude`, and run `/init`.',
        'Read the generated CLAUDE.md end to end. Delete at least three lines that state the obvious.',
        'Run `ls -la .claude/` and open each file. Add a `.claude/settings.json` with a `permissions` block allowing your test command.',
        'Run `/permissions` to see your current mode, switch to auto mode, then try `/sandbox` on a shell command.',
      ],
      checklist: [
        'claude --version reports 2.1 or later and claude doctor is clean',
        'CLAUDE.md exists, was reviewed line-by-line, and lost its filler',
        'You can state the purpose of skills/, agents/, rules/, settings.json, and settings.local.json without looking',
        'You know which two files are git-ignored and why',
        'You ran one command in auto mode and one under /sandbox',
      ],
    },
    checkQuiz: [
      {
        q: 'Claude Code is misbehaving: hooks silently not firing, one MCP server absent. Fastest first move?',
        options: [
          'Reinstall from npm and re-run /init',
          'Run /doctor and read its config-layer report',
          'Delete ~/.claude and start fresh',
          'Downgrade to the previous version',
        ],
        answer: 1,
        explain:
          '/doctor validates install, settings files, hooks, and MCP reachability in one pass. Reinstalling or nuking config destroys evidence before you have a diagnosis.',
      },
      {
        q: 'What does /sandbox actually change?',
        options: [
          'It switches the model to a cheaper tier for shell commands',
          'It runs commands under OS-level filesystem and network isolation',
          'It clones the repo into a temp dir and works there',
          'It disables all hooks for the current session',
        ],
        answer: 1,
        explain:
          '/sandbox is OS-level isolation: commands cannot write outside the project or reach the network unless allowed. Worktree isolation is a separate (subagent) feature.',
      },
      {
        q: 'settings.json allows `npm test`; your settings.local.json denies it. A managed enterprise policy allows it. What happens?',
        options: [
          'Denied — local personal settings win over shared project settings, but managed policy would win if it denied',
          'Allowed — settings.json is the source of truth for the repo',
          'Allowed — managed policy always forces the final answer on every rule',
          'Claude prompts you because the layers conflict',
        ],
        answer: 0,
        explain:
          'Precedence: managed policy constraints top everything, then local overrides project. A managed ALLOW does not force anything; managed DENY would. Here your local deny stands.',
      },
      {
        q: 'You started a session on claude.ai/code from your phone during standup. Supported way to continue it in your terminal?',
        options: [
          'You cannot — web sessions are sandbox-only',
          'claude --teleport to pull the cloud session into your local CLI',
          'Copy the transcript into a new local session as context',
          'Run /export on web, /import locally',
        ],
        answer: 1,
        explain:
          '--teleport hands a cloud session off to your local CLI with history intact. Copy-pasting transcripts loses tool state; there is no /import.',
      },
    ],
    resources: [
      { label: 'Claude Code docs — overview', url: 'https://code.claude.com/docs/en/overview', kind: 'docs' },
      { label: 'Claude Code docs — settings & permissions', url: 'https://code.claude.com/docs/en/settings', kind: 'docs' },
      { label: 'Claude Code in Action (free course, certificate)', url: 'https://anthropic.skilljar.com/claude-code-in-action', kind: 'course' },
      { label: 'everything-claude-code — dense config reference', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l2 — CLAUDE.md & the Memory System
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l2',
    title: 'CLAUDE.md & the Memory System',
    day: 4,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can trace the exact load order of memory files and predict which instruction wins',
      'Can structure memory with @imports, AGENTS.md interop, and path-scoped .claude/rules/',
      'Can inspect and reason about auto memory, including its keyword-only retrieval limits',
      'Can keep a CLAUDE.md under 200 lines using the pruning test',
    ],
    skipQuiz: [
      {
        q: 'Correct load order of the CLAUDE.md hierarchy, first to last?',
        options: [
          'project → user → managed → CLAUDE.local.md',
          'managed policy → ~/.claude/CLAUDE.md → project CLAUDE.md → CLAUDE.local.md',
          '~/.claude/CLAUDE.md → managed policy → CLAUDE.local.md → project',
          'CLAUDE.local.md → project → user → managed policy',
        ],
        answer: 1,
        explain:
          'Managed (org) first, then user-global, then project, then personal CLAUDE.local.md — broadest to most specific, with later files layering onto earlier ones.',
      },
      {
        q: 'How deep can @imports chain inside memory files?',
        options: ['They cannot nest', '2 levels', '4 levels', 'Unlimited'],
        answer: 2,
        explain:
          'Imports resolve recursively to a maximum depth of 4 — enough to split memory into topical files without runaway context.',
      },
      {
        q: 'Where does Claude Code keep its auto memory for a project?',
        options: [
          'In a hidden section of the project CLAUDE.md',
          'In ~/.claude/projects/<proj>/memory/ — a MEMORY.md index plus topic files',
          'In a local SQLite database with vector embeddings',
          'Server-side, attached to your Anthropic account',
        ],
        answer: 1,
        explain:
          'Auto memory is Claude-written plain markdown: a MEMORY.md index pointing at topic files, stored per-project under your home directory. No database, no embeddings.',
      },
      {
        q: 'The pruning test for a CLAUDE.md line is:',
        options: [
          'Has this line been read in the last 30 sessions?',
          'Would removing this line cause Claude to make a mistake?',
          'Is this line shorter than 80 characters?',
          'Does this line duplicate anything in README.md?',
        ],
        answer: 1,
        explain:
          'If deleting the line would not change behavior, it is dead weight diluting the attention budget. That single question keeps files under 200 lines.',
      },
      {
        q: 'CLAUDE.md content reaches the model as:',
        options: [
          'Part of the system prompt, so it always outranks user input',
          'A user message, so it is strong context but not an inviolable system rule',
          'A tool result injected on the first tool call',
          'Fine-tuned weights baked in at session start',
        ],
        answer: 1,
        explain:
          'It arrives as a user message. That is why CLAUDE.md is advisory — and why deterministic enforcement needs hooks (lesson m1-l5).',
      },
    ],
    sections: [
      {
        heading: 'The load-order hierarchy',
        blocks: [
          {
            type: 'diagram',
            caption: 'Memory layers stack broadest-to-most-specific, then land in context as a user message.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b"/><rect x="20" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#f472b6"/><text x="34" y="66" fill="#f472b6" font-size="13" font-weight="bold">1. Managed</text><text x="34" y="84" fill="#a1a1aa" font-size="11">org policy file</text><rect x="192" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="206" y="66" fill="#a78bfa" font-size="13" font-weight="bold">2. User</text><text x="206" y="84" fill="#a1a1aa" font-size="11">~/.claude/CLAUDE.md</text><rect x="364" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="378" y="66" fill="#38bdf8" font-size="13" font-weight="bold">3. Project</text><text x="378" y="84" fill="#a1a1aa" font-size="11">CLAUDE.md + @imports</text><rect x="536" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#34d399"/><text x="550" y="66" fill="#34d399" font-size="13" font-weight="bold">4. Personal</text><text x="550" y="84" fill="#a1a1aa" font-size="11">CLAUDE.local.md</text><line x1="170" y1="72" x2="190" y2="72" stroke="#52525b" stroke-width="2"/><line x1="342" y1="72" x2="362" y2="72" stroke="#52525b" stroke-width="2"/><line x1="514" y1="72" x2="534" y2="72" stroke="#52525b" stroke-width="2"/><line x1="350" y1="104" x2="350" y2="150" stroke="#52525b" stroke-width="2"/><polygon points="344,148 356,148 350,160" fill="#52525b"/><rect x="180" y="162" width="340" height="56" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="200" y="186" fill="#fbbf24" font-size="13" font-weight="bold">Context window — as a USER message</text><text x="200" y="204" fill="#a1a1aa" font-size="11">advisory guidance, not system-prompt law</text><rect x="20" y="248" width="320" height="64" rx="6" fill="#27272a" stroke="#52525b"/><text x="36" y="272" fill="#e4e4e7" font-size="13" font-weight="bold">.claude/rules/*.md</text><text x="36" y="292" fill="#a1a1aa" font-size="11">joins context only when paths: globs match</text><rect x="360" y="248" width="320" height="64" rx="6" fill="#27272a" stroke="#52525b"/><text x="376" y="272" fill="#e4e4e7" font-size="13" font-weight="bold">Auto memory (Claude-written)</text><text x="376" y="292" fill="#a1a1aa" font-size="11">~/.claude/projects/.../memory/MEMORY.md + topics</text></svg>`,
          },
          {
            type: 'text',
            md: 'Four layers, loaded broadest-first: managed org policy, your global `~/.claude/CLAUDE.md`, the project `CLAUDE.md`, and your uncommitted `CLAUDE.local.md`. Later layers refine earlier ones. Key implication: it all arrives as a **user message**, not the system prompt — Claude treats it as strong guidance, not law. Deterministic guarantees need hooks.',
          },
        ],
      },
      {
        heading: '@imports, AGENTS.md, and rules/',
        blocks: [
          {
            type: 'text',
            md: 'Keep CLAUDE.md as an index, not an encyclopedia. `@docs/architecture.md` inlines another file at load time, recursing up to depth 4. If a repo ships an `AGENTS.md` (the cross-tool open standard), Claude Code reads it too — so OSS projects need only one agent-facing file, and your CLAUDE.md can simply `@AGENTS.md`.',
          },
          {
            type: 'code',
            lang: 'markdown',
            code: '---\npaths:\n  - "src/components/**/*.tsx"\n  - "src/styles/**"\n---\n- Function components only; no class components\n- Styling via vanilla-extract; never inline style objects\n- Every new component gets a Storybook story',
            caption: '.claude/rules/frontend.md — loaded only when Claude touches matching files.',
          },
          {
            type: 'text',
            md: '`.claude/rules/` is how you scale past 200 lines without bloat: each rule file declares `paths:` globs and only enters context when relevant files are in play. Backend rules never tax the attention budget of a CSS fix. This replaces the 2025 habit of one giant CLAUDE.md.',
          },
        ],
      },
      {
        heading: 'Auto memory: the layer Claude writes itself',
        blocks: [
          {
            type: 'text',
            md: 'Since early 2026, Claude Code maintains its own notes: `~/.claude/projects/<proj>/memory/` holds a `MEMORY.md` index plus topic files (debugging history, user preferences, project quirks). Claude writes them during sessions and consolidates them in a background "dream" pass. You should read yours — it is often unintentionally funny and occasionally wrong.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The hesamation teardown: why RAG still exists',
            md: 'The memory system is 4 layers — CLAUDE.md (3 scopes), auto memory, background consolidation, retrieval. The retrieval layer is **keyword-only**: no embeddings, no semantic search. Ask about "auth" and notes filed under "login flow" may never surface. That gap is precisely what RAG and semantic memory add-ons fill — a preview of module 4.',
          },
        ],
      },
      {
        heading: 'Discipline: under 200 lines, forever',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'High-signal CLAUDE.md',
              items: [
                'Build/test/lint commands with exact flags',
                'Non-obvious conventions ("API errors use Result<T>, never throw")',
                'Landmines ("do not touch codegen/ — generated")',
                'Pointers: @docs/architecture.md, rules/ for the rest',
                'Under 200 lines; every line survives the pruning test',
              ],
            },
            right: {
              title: 'Bloated CLAUDE.md',
              items: [
                'Explains what React and git are',
                'Restates the README and directory listing',
                'A 26k-line dumping ground of every past correction',
                'Style rules for files Claude never edits',
                'So long that real landmines drown in noise',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The habit that compounds',
            md: 'Every time you correct Claude mid-session, end with: "update CLAUDE.md so you don\'t repeat that mistake." Boris Cherny calls CLAUDE.md investment the highest-leverage team habit. Corrections become permanent; the file stays curated because you also prune on every visit.',
          },
        ],
      },
    ],
    lab: {
      title: 'Prune, scope, and meet your auto memory',
      intro: 'Turn the /init draft from the last lab into a lean, layered memory system on a real project.',
      steps: [
        'Open your project CLAUDE.md. For each line ask: "would removing this cause a mistake?" Delete every line that fails.',
        'Add a commands section with your real build, test, and lint invocations — exact flags included.',
        'Create .claude/rules/frontend.md (or backend.md) with a paths: glob and 2-3 rules that only apply there.',
        'Split anything long into docs/ and reference it with an @import (e.g. @docs/architecture.md). Verify with /memory that it resolves.',
        'Run `ls ~/.claude/projects/` — find this project, open memory/MEMORY.md and one topic file. Correct anything wrong in it.',
        'In a session, correct Claude once about a convention, then say: "update CLAUDE.md so you don\'t repeat that." Review its diff before accepting.',
      ],
      checklist: [
        'CLAUDE.md is under 200 lines and every line passes the pruning test',
        'One rules/ file exists and Claude confirms it loads only for matching paths',
        'One @import resolves (verify via /memory)',
        'You located MEMORY.md and can name what auto memory recorded about you',
        'One Claude-authored CLAUDE.md update is committed',
      ],
    },
    checkQuiz: [
      {
        q: 'An OSS repo you contribute to has AGENTS.md but no CLAUDE.md. What does Claude Code do?',
        options: [
          'Ignores it — only CLAUDE.md is ever read',
          'Reads AGENTS.md as project memory via the interop standard',
          'Auto-converts it to CLAUDE.md and commits the file',
          'Prompts you to choose a memory format first',
        ],
        answer: 1,
        explain:
          'AGENTS.md is the cross-tool standard and Claude Code honors it, so projects do not need duplicate agent files. Nothing is auto-committed.',
      },
      {
        q: 'A rule file has paths: ["src/api/**"]. When does it consume context?',
        options: [
          'Every session, like CLAUDE.md — the glob only affects priority',
          'Only when the work involves files matching the glob',
          'Only when you invoke /rules explicitly',
          'Never automatically; rules are documentation for humans',
        ],
        answer: 1,
        explain:
          'Path-scoped rules load just-in-time when matching files are in play — that is the whole point: relevant guidance without a permanent attention tax.',
      },
      {
        q: 'You told Claude about a flaky race condition weeks ago; auto memory filed it under "intermittent CI failures." You now ask about "the async bug." Why might it miss?',
        options: [
          'Auto memory expires after 7 days',
          'Retrieval is keyword-only — no embeddings, so "async bug" never matches those notes',
          'Auto memory is read-only after consolidation',
          'Topic files are excluded from search; only MEMORY.md is scanned',
        ],
        answer: 1,
        explain:
          'No semantic search: different vocabulary means no hit. Understanding this limit tells you when to reach for RAG-style memory add-ons.',
      },
      {
        q: 'Best home for "I prefer terse commit messages, no emoji" on a shared team repo?',
        options: [
          'Project CLAUDE.md, so the team standardizes on it',
          'CLAUDE.local.md — personal preference, not team convention',
          '.claude/settings.json under a preferences key',
          'A comment at the top of .gitignore',
        ],
        answer: 1,
        explain:
          'Personal taste goes in the git-ignored CLAUDE.local.md. The committed CLAUDE.md is for conventions the whole team owns; settings.json is config, not prose.',
      },
    ],
    resources: [
      { label: 'Claude Code docs — memory (CLAUDE.md, imports, rules, auto memory)', url: 'https://code.claude.com/docs/en/memory', kind: 'docs' },
      { label: 'AGENTS.md — the open agent-file standard', url: 'https://agents.md', kind: 'docs' },
      { label: 'hesamation — Claude Code memory teardown (4 layers, keyword retrieval)', url: 'https://x.com/hesamation', kind: 'thread' },
      { label: 'Claude Code best practices (Anthropic engineering)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l3 — Agent Skills Deep Dive
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l3',
    title: 'Agent Skills Deep Dive',
    day: 5,
    minutes: 50,
    xp: 100,
    objectives: [
      'Can author a SKILL.md with correct frontmatter and a description tuned as a trigger',
      'Can explain 3-level progressive disclosure and why it makes expertise near-free at idle',
      'Can use $ARGUMENTS, dynamic command injection, and bundled scripts in a skill',
      'Can place skills vs MCP vs the agent loop in the composable architecture',
    ],
    skipQuiz: [
      {
        q: 'What happened to .claude/commands/ slash commands?',
        options: [
          'Still the way to define /commands; skills are separate',
          'Absorbed into skills — a SKILL.md is invocable as /name and old commands/ is legacy',
          'Moved into settings.json under a commands key',
          'Deprecated with no replacement; use plain prompts',
        ],
        answer: 1,
        explain:
          'Commands merged into skills: one format now covers both explicit /invocation and model-triggered use. commands/ still loads for backwards compatibility but is legacy.',
      },
      {
        q: 'The description field in SKILL.md frontmatter is primarily:',
        options: [
          'Documentation for teammates browsing the repo',
          'The trigger surface — the model reads it to decide when to fire the skill',
          'The text shown in marketplace listings only',
          'A changelog summary for the skill',
        ],
        answer: 1,
        explain:
          'At idle, the model sees only name + description. Whether the skill triggers at the right moments depends almost entirely on how that description is written.',
      },
      {
        q: 'Setting disable-model-invocation: true on a skill means:',
        options: [
          'The skill can no longer use any tools',
          'Only explicit /name invocation works — the model cannot auto-fire it',
          'The skill runs without model involvement, as a pure script',
          'The skill is hidden from /help listings',
        ],
        answer: 1,
        explain:
          'It removes the skill from the model-triggered pool. Use it for side-effectful workflows (deploys, releases) that must only run when a human asks.',
      },
      {
        q: 'The three levels of progressive disclosure in skills are:',
        options: [
          'frontmatter → hooks → MCP servers',
          'metadata (name+description) → SKILL.md body → bundled files read on demand',
          'user scope → project scope → managed scope',
          'description → argument-hint → allowed-tools',
        ],
        answer: 1,
        explain:
          'Only ~tens of tokens of metadata are always resident; the body loads on trigger; reference files and scripts load only if the task needs them. Unbounded expertise, near-zero idle cost.',
      },
      {
        q: 'context: fork in skill frontmatter does what?',
        options: [
          'Runs the skill in a forked context so its heavy work never pollutes the main conversation',
          'Duplicates the skill for A/B testing',
          'Executes the skill on a git fork of the repo',
          'Forks the Node process to parallelize tool calls',
        ],
        answer: 0,
        explain:
          'The skill executes in an isolated forked context and returns results — the main thread keeps a clean attention budget. Worktree isolation for code is a separate agent feature.',
      },
    ],
    sections: [
      {
        heading: 'Skills absorbed slash commands',
        blocks: [
          {
            type: 'text',
            md: 'In 2025 you had `.claude/commands/` for prompts and a separate skills concept. Those merged: everything is a skill now. A folder in `.claude/skills/<name>/` with a `SKILL.md` gives you an explicit `/name` command AND a capability the model can invoke on its own when the description matches the moment. Skills follow the open Agent Skills standard (agentskills.io), so they port across tools.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Obsolete: .claude/commands/',
            md: 'Old commands/ folders still load, but they are legacy. New work goes in skills/ — you get frontmatter, bundled files, tool restrictions, and model-triggering that commands never had. Migrate by moving the markdown into a SKILL.md and adding a description.',
          },
        ],
      },
      {
        heading: 'SKILL.md anatomy',
        blocks: [
          {
            type: 'code',
            lang: 'markdown',
            code: '---\nname: pr-summary\ndescription: Draft a pull-request description from the current branch diff. Use when the user asks to write, summarize, or prepare a PR, or mentions "PR description".\nargument-hint: [base-branch]\nallowed-tools: Bash(git *), Read\ncontext: fork\n---\n\nBase branch: $ARGUMENTS (default: main)\n\nDiff stat: !`git diff --stat main...HEAD`\n\nWrite a PR description: summary, motivation, risk notes,\ntest evidence. Follow the house format in reference.md.',
            caption: '.claude/skills/pr-summary/SKILL.md — frontmatter is the contract, body is the expertise.',
          },
          {
            type: 'table',
            headers: ['Frontmatter key', 'What it controls'],
            rows: [
              ['description', 'Trigger surface — written FOR the model: what it does + when to use it'],
              ['argument-hint', 'Autocomplete hint after /name, e.g. [base-branch]'],
              ['disable-model-invocation', 'true = explicit /invocation only; for side-effectful workflows'],
              ['allowed-tools', 'Tool allowlist while the skill runs, e.g. Bash(git *), Read'],
              ['model / effort', 'Pin a model tier or reasoning effort for this skill'],
              ['context: fork', 'Run in an isolated forked context; return only results'],
              ['paths', 'Files/globs to preload alongside the skill body'],
            ],
          },
        ],
      },
      {
        heading: 'Progressive disclosure: unbounded expertise, near-zero idle cost',
        blocks: [
          {
            type: 'diagram',
            caption: 'Three loading levels — the design that lets you install 50 skills without torching your context.',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="330" fill="#18181b"/><rect x="40" y="36" width="620" height="66" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="60" y="62" fill="#38bdf8" font-size="14" font-weight="bold">Level 1 — metadata: name + description</text><text x="60" y="84" fill="#a1a1aa" font-size="12">always in context · tens of tokens per skill · this is what triggers</text><rect x="40" y="132" width="620" height="66" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="60" y="158" fill="#a78bfa" font-size="14" font-weight="bold">Level 2 — SKILL.md body</text><text x="60" y="180" fill="#a1a1aa" font-size="12">loaded only when triggered · procedure, constraints, dynamic !cmd injection</text><rect x="40" y="228" width="620" height="66" rx="6" fill="#27272a" stroke="#34d399"/><text x="60" y="254" fill="#34d399" font-size="14" font-weight="bold">Level 3 — bundled files: reference.md, scripts/, templates</text><text x="60" y="276" fill="#a1a1aa" font-size="12">read on demand mid-task · effectively unbounded depth at zero idle cost</text><line x1="350" y1="102" x2="350" y2="130" stroke="#52525b" stroke-width="2"/><polygon points="344,128 356,128 350,140" fill="#52525b"/><line x1="350" y1="198" x2="350" y2="226" stroke="#52525b" stroke-width="2"/><polygon points="344,224 356,224 350,236" fill="#52525b"/><text x="470" y="120" fill="#fbbf24" font-size="12">triggered by description match or /name</text><text x="470" y="216" fill="#fbbf24" font-size="12">model chooses to Read deeper files</text></svg>`,
          },
          {
            type: 'text',
            md: 'This is the core economic insight: a skill costs tens of tokens until the moment it is needed. So push detail DOWN — keep SKILL.md around 100 lines of procedure, and move exhaustive references, style guides, and schemas into bundled files the model reads only when relevant.',
          },
        ],
      },
      {
        heading: 'Dynamic injection and bundled scripts',
        blocks: [
          {
            type: 'text',
            md: 'Two power features. First, dynamic injection: a line containing a bang-prefixed backtick command (see the `pr-summary` example) executes at invocation and splices its stdout into the prompt — the model starts with fresh `git diff --stat` output instead of burning a turn fetching it. Second, `scripts/` in the skill folder: pre-built executables the model runs rather than re-deriving logic each time. Deterministic, tested, cheap.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Barry Zhang, Anthropic',
            md: '"Stop building agents, build skills." The composable 2026 architecture: **skills = expertise** (what to do), **MCP = connectivity** (what you can reach), **agent loop + filesystem = runtime** (how work happens). You rarely need a custom agent — you need the general agent, better equipped.',
          },
        ],
      },
    ],
    lab: {
      title: 'Ship a real skill with a tuned trigger',
      intro: 'Automate a workflow you genuinely repeat — release notes, PR descriptions, deploy checklists — and tune it until it fires both explicitly and implicitly.',
      steps: [
        'Pick a workflow you do at least weekly. Write down the 3-5 steps you always follow.',
        'Run: mkdir -p .claude/skills/pr-summary (rename for your workflow) and create SKILL.md with name, description, argument-hint, allowed-tools.',
        'Write the description as a trigger: one sentence of WHAT, one of WHEN, including the exact phrases you would naturally say.',
        'Add one dynamic-injection line (e.g. a git diff or status command) so the skill starts with live context.',
        'Test explicit invocation: /pr-summary main. Then test implicit: phrase a natural request and confirm the model fires the skill unprompted.',
        'Move any reference material (formats, examples) into reference.md in the skill folder and confirm Claude reads it only when needed.',
      ],
      checklist: [
        'Skill fires via /name with argument-hint autocomplete',
        'Skill fires implicitly from a natural-language request that never names it',
        'SKILL.md body is ~100 lines or less; depth lives in bundled files',
        'Injected command output appears in the skill run',
        'allowed-tools restricts the skill to what it needs',
      ],
    },
    checkQuiz: [
      {
        q: 'A SKILL.md line runs a git command via bang-backtick injection. When does that command execute?',
        options: [
          'At session start, cached for the day',
          'At skill invocation — stdout is spliced into the prompt before the model reasons',
          'Whenever the model decides to call the Bash tool',
          'At install time, frozen into the skill',
        ],
        answer: 1,
        explain:
          'Dynamic injection is evaluated when the skill fires, so the model starts with live output — no tool-call round trip, no stale data.',
      },
      {
        q: 'Why set allowed-tools: Bash(git *), Read on a skill?',
        options: [
          'It preloads those tools to make the skill faster',
          'It scopes what the skill can do — a blast-radius contract while it runs',
          'It grants tools the session otherwise lacks',
          'It is required or the skill will not parse',
        ],
        answer: 1,
        explain:
          'allowed-tools is a restriction, not a grant: while the skill runs, only matching tools are usable. A summarize skill has no business writing files.',
      },
      {
        q: 'User types /release-notes v2.3. Inside SKILL.md, "v2.3" is available as:',
        options: ['$1 like a shell script', '$ARGUMENTS', '{{args}}', 'the ARGV environment variable'],
        answer: 1,
        explain:
          '$ARGUMENTS carries everything after the skill name; argument-hint is only the autocomplete affordance, not the variable.',
      },
      {
        q: 'In the composable architecture, connecting Claude to your Jira instance is the job of:',
        options: [
          'A skill with Jira API docs pasted into SKILL.md',
          'MCP — connectivity; a skill then encodes YOUR team\'s workflow on top of it',
          'A subagent with a Jira personality',
          'A PostToolUse hook calling the Jira webhook',
        ],
        answer: 1,
        explain:
          'MCP provides the connection and tools; skills encode the expertise for using them well. Keeping the two separate is what makes each reusable.',
      },
    ],
    resources: [
      { label: 'Claude Code docs — Agent Skills', url: 'https://code.claude.com/docs/en/skills', kind: 'docs' },
      { label: 'Agent Skills open standard', url: 'https://agentskills.io', kind: 'docs' },
      { label: 'Introduction to Agent Skills (free course)', url: 'https://anthropic.skilljar.com/introduction-to-agent-skills', kind: 'course' },
      { label: 'anthropics/skills — official skill library', url: 'https://github.com/anthropics/skills', kind: 'repo' },
      { label: 'Equipping agents for the real world with Agent Skills (Anthropic)', url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', kind: 'article' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l4 — Skill Authoring Doctrine
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l4',
    title: 'Skill Authoring Doctrine',
    day: 5,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can apply the Claude Code team\'s 9 authoring tips to an existing skill',
      'Can run blind A/B evals on a skill with the skill-creator plugin',
      'Can navigate the skill ecosystem and pick proven third-party skills',
      'Can audit a third-party skill for security issues before installing',
    ],
    skipQuiz: [
      {
        q: 'Per the Claude Code team, the highest-value section in a SKILL.md is:',
        options: [
          'A step-by-step procedure the model must follow exactly',
          'The Gotchas section — failure modes the model would not predict',
          'A glossary of project terminology',
          'An examples gallery of past outputs',
        ],
        answer: 1,
        explain:
          'The model can derive procedures; it cannot know your environment\'s surprising failure modes. Gotchas encode exactly the knowledge it lacks.',
      },
      {
        q: '"Don\'t railroad the model" means:',
        options: [
          'Never give the skill more than five steps',
          'Specify goals and constraints, not rigid scripts — leave room to adapt',
          'Avoid allowed-tools restrictions',
          'Let the model rewrite the skill whenever it wants',
        ],
        answer: 1,
        explain:
          'Over-scripted skills break on the first unexpected situation. State the goal, constraints, and gotchas; trust the model to route between them.',
      },
      {
        q: 'CLAUDE_PLUGIN_DATA points to:',
        options: [
          'The plugin\'s source directory, read-only',
          'A persistent per-plugin data directory — the sanctioned home for skill memory (JSON/SQLite)',
          'A temp dir wiped at session end',
          'The marketplace metadata cache',
        ],
        answer: 1,
        explain:
          'Skills that need state across runs write files or SQLite under that path — it survives sessions and updates, unlike the skill folder or temp dirs.',
      },
      {
        q: 'Why are skill evals run as BLIND A/B comparisons?',
        options: [
          'To keep eval costs down by halving runs',
          'The judge scores outputs without knowing which had the skill — removing bias toward the "improved" version',
          'Because skills cannot be disabled once installed',
          'To test two different models simultaneously',
        ],
        answer: 1,
        explain:
          'A judge that knows which output used the skill grades it kindly. Anonymized comparison is what makes the measured lift real.',
      },
      {
        q: '"Don\'t state the obvious" matters in skills because:',
        options: [
          'Long skills fail to parse above 500 lines',
          'The model already knows generic practice — restating it wastes tokens and buries your real signal',
          'Obvious content triggers duplicate-skill warnings',
          'Marketplace rankings penalize long files',
        ],
        answer: 1,
        explain:
          'Every token of "write clean code, commit often" dilutes the environment-specific knowledge that actually changes behavior. Only include what the model does not already know.',
      },
    ],
    sections: [
      {
        heading: 'The 9 tips (Thariq, Claude Code team)',
        blocks: [
          {
            type: 'table',
            headers: ['#', 'Tip', 'Why it works'],
            rows: [
              ['1', 'Don\'t state the obvious', 'The model knows git and clean code; restating dilutes real signal'],
              ['2', 'Gotchas section = highest value', 'Failure modes are the knowledge the model cannot derive'],
              ['3', 'Use the filesystem + progressive disclosure', 'Depth in bundled files keeps idle cost near zero'],
              ['4', 'Don\'t railroad', 'Goals + constraints beat rigid scripts when reality deviates'],
              ['5', 'config.json for setup', 'Capture user/env choices once instead of re-asking each run'],
              ['6', 'Write the description FOR the model', 'It is a trigger, not documentation — include the phrases users say'],
              ['7', 'Persist memory via files/SQLite in CLAUDE_PLUGIN_DATA', 'State that survives sessions and updates'],
              ['8', 'Ship pre-built scripts', 'Deterministic, tested, cheaper than re-deriving logic every run'],
              ['9', 'On-demand hooks', 'Declare hooks in skill frontmatter; enforcement only while the skill runs'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The meta-pattern',
            md: 'All nine tips are one idea: a skill is a **briefing for a competent colleague**, not a program for a dumb interpreter. Include what a senior hire would not already know — your environment\'s traps, your team\'s formats, your tested tooling — and nothing else.',
          },
        ],
      },
      {
        heading: 'Evals: prove the skill earns its tokens',
        blocks: [
          {
            type: 'text',
            md: 'Skills regress silently as you edit them. The `skill-creator` plugin (in anthropics/skills) gives skills a test harness: define an `evals.json` of representative tasks with pass criteria, then run blind A/B — same task with and without the skill, judge scores anonymized outputs. If the skill does not measurably win, cut it or fix the description.',
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "evals": [\n    {\n      "name": "pr-from-feature-branch",\n      "input": "Write a PR description for this branch",\n      "criteria": [\n        "includes risk section",\n        "references changed modules by name",\n        "under 300 words"\n      ]\n    }\n  ]\n}',
            caption: 'evals.json — binary criteria, real tasks. Vibes are not a metric.',
          },
        ],
      },
      {
        heading: 'Ecosystem tour: stand on shipped work',
        blocks: [
          {
            type: 'table',
            headers: ['Skill / repo', 'What it proves'],
            rows: [
              ['anthropics/skills', 'Official library + skill-creator; canonical authoring patterns'],
              ['emilkowalski/skills (12.8k stars)', 'Design/animation taste as installable expertise (/apple-design)'],
              ['Ponytail (DietrichGebert/ponytail)', 'Anti-over-engineering review: ~54% less code, ~20% cheaper, ~27% faster'],
              ['planning-with-files (othmanadi)', 'task_plan.md / findings.md / progress.md — anti-drift for long tasks'],
              ['LLM Council (aiwithremy)', '5 adversarial advisors + blind peer review + chairman synthesis'],
            ],
          },
          {
            type: 'text',
            md: 'Install pattern: `npx skills add emilkowalski/skills` or clone into `.claude/skills/`. Read the greats before writing your own — Ponytail\'s numbers (54% less code) come from a tight Gotchas-style rule set, not clever prompting.',
          },
        ],
      },
      {
        heading: 'Security: skills are code you run',
        blocks: [
          {
            type: 'callout',
            variant: 'warning',
            title: 'Audit before you install',
            md: 'A third-party skill can bundle executable scripts and can instruct the model to make network calls. Before installing: read SKILL.md **and every file in scripts/** for curl/fetch to unknown hosts, env-var exfiltration, or instructions like "send the diff to this endpoint." Prefer starred, source-visible repos. Treat a skill exactly like a dependency with postinstall scripts — because that is what it is.',
          },
        ],
      },
    ],
    lab: {
      title: 'Harden yesterday\'s skill',
      intro: 'Apply the doctrine to the skill you built in m1-l3: cut the obvious, add gotchas, bundle a script, and prove the lift with an eval.',
      steps: [
        'Open your skill\'s SKILL.md. Delete every line a competent senior hire would already know (tip 1).',
        'Add a Gotchas section with 2-3 real failure modes you have personally hit in this workflow (tip 2).',
        'Write a small deterministic script (e.g. scripts/collect-context.sh gathering diff, branch, ticket ID) and reference it from the body (tip 8).',
        'Install skill-creator from anthropics/skills, then create evals.json with 3 representative tasks and binary criteria.',
        'Run the blind A/B eval. If the skill does not win, rewrite the description or gotchas and re-run.',
        'Pick one ecosystem skill (emilkowalski/skills or Ponytail), audit its scripts/ for network calls, then install it.',
      ],
      checklist: [
        'Gotchas section documents real failure modes, not generic advice',
        'Bundled script runs standalone and the skill calls it instead of re-deriving logic',
        'evals.json exists with 3 cases and binary criteria',
        'Blind A/B shows the skill beating no-skill baseline',
        'One audited third-party skill installed — and you can say what its scripts touch',
      ],
    },
    checkQuiz: [
      {
        q: 'Your deploy skill asks "staging or prod? which region?" on every run. The doctrine fix is:',
        options: [
          'Add the answers to CLAUDE.md',
          'A config.json in the skill capturing those choices once at setup',
          'Hardcode prod and let users edit SKILL.md',
          'Split into deploy-staging and deploy-prod skills',
        ],
        answer: 1,
        explain:
          'Tip 5: setup-time choices belong in config.json, read at each run. CLAUDE.md pollutes global context; skill-splitting multiplies maintenance.',
      },
      {
        q: 'Why ship a pre-built script instead of letting the model write the same logic each run?',
        options: [
          'Models cannot execute code they generate',
          'Deterministic + tested + cheaper — generation burns tokens and reintroduces variance every run',
          'Scripts bypass the permission system',
          'SKILL.md bodies cannot contain code blocks',
        ],
        answer: 1,
        explain:
          'Tip 8: anything mechanical should be a tested artifact the model invokes. You pay for correctness once, not per-run with variance.',
      },
      {
        q: 'Ponytail\'s headline result as an anti-over-engineering skill:',
        options: [
          'About 54% less code, ~20% cheaper, ~27% faster',
          '10x speedup with identical output',
          '90% less code but doubled cost',
          'It only reformats code, so no output change',
        ],
        answer: 0,
        explain:
          'Those measured numbers are the point: a well-aimed rule set materially changes agent output. It is also proof that evals on skills matter.',
      },
      {
        q: 'Highest-risk item to check when auditing a third-party skill:',
        options: [
          'Typos in the description frontmatter',
          'Bundled scripts and instructions that trigger network calls to unknown hosts',
          'Whether it exceeds 200 lines',
          'Missing argument-hint',
        ],
        answer: 1,
        explain:
          'Executable scripts and "send X to this URL" instructions are the exfiltration vectors. Length and typos are cosmetic.',
      },
    ],
    resources: [
      { label: 'Thariq (Claude Code team) — 9 skill-authoring tips', url: 'https://x.com/trq212', kind: 'thread' },
      { label: 'anthropics/skills — includes the skill-creator plugin', url: 'https://github.com/anthropics/skills', kind: 'repo' },
      { label: 'emilkowalski/skills — design & animation skills', url: 'https://github.com/emilkowalski/skills', kind: 'repo' },
      { label: 'Ponytail — anti-over-engineering skill', url: 'https://github.com/DietrichGebert/ponytail', kind: 'repo' },
      { label: 'planning-with-files — anti-drift planning skill', url: 'https://github.com/othmanadi/planning-with-files', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l5 — Hooks: Deterministic Control
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l5',
    title: 'Hooks: Deterministic Control',
    day: 6,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can explain when to enforce with hooks instead of advising in CLAUDE.md',
      'Can pick the right event and handler type for a control requirement',
      'Can write a blocking PreToolUse guard and a Stop-hook verification gate',
      'Can use JSON hook output to allow, deny, ask, or rewrite tool input',
    ],
    skipQuiz: [
      {
        q: 'A hook command exits with code 2. What happens?',
        options: [
          'The action is logged but proceeds',
          'The action is blocked and the hook\'s stderr is fed to Claude as feedback',
          'The session terminates immediately',
          'Claude retries the same action once more',
        ],
        answer: 1,
        explain:
          'Exit 2 is the blocking contract: action stopped, stderr becomes the model\'s corrective feedback so it can adapt instead of just failing.',
      },
      {
        q: 'The five hook handler types are:',
        options: [
          'command, http, mcp_tool, prompt, agent',
          'bash, python, node, deno, docker',
          'pre, post, stop, start, compact',
          'allow, deny, ask, rewrite, log',
        ],
        answer: 0,
        explain:
          'Handlers range from a shell command through an HTTP endpoint, an MCP tool call, a one-shot prompt, up to a full subagent evaluating the event.',
      },
      {
        q: 'PreCompact fires:',
        options: [
          'After compaction, with the summarized context',
          'Just before context compaction — your chance to persist state to files first',
          'When context hits 50% capacity',
          'Only when you run /compact manually',
        ],
        answer: 1,
        explain:
          'PreCompact is the save-your-work moment: write progress notes to disk before the transcript is squashed, so nothing important lives only in soon-to-be-lost turns.',
      },
      {
        q: 'Valid values for permissionDecision in PreToolUse JSON output:',
        options: [
          'allow, deny, ask',
          'yes, no, maybe',
          'accept, reject, escalate, defer',
          'pass, block',
        ],
        answer: 0,
        explain:
          'allow lets it run, deny blocks with a reason fed back to Claude, ask surfaces the decision to the human. Richer than exit codes when you need nuance.',
      },
      {
        q: 'Declaring hooks in a skill or agent\'s frontmatter means:',
        options: [
          'The hooks install globally on first run',
          'The hooks are active only while that skill or agent is running — scoped enforcement',
          'The hooks replace settings.json hooks entirely',
          'The hooks run without permission checks',
        ],
        answer: 1,
        explain:
          'On-demand hooks scope guarantees to a context: your deploy skill can enforce checks during deploys without taxing every other session.',
      },
    ],
    sections: [
      {
        heading: 'Advisory vs enforcement',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'CLAUDE.md (advisory)',
              items: [
                'Arrives as a user message — guidance, not law',
                'Probabilistic: usually followed, sometimes not',
                'Right for style, conventions, context',
                '"Please run the formatter after edits"',
              ],
            },
            right: {
              title: 'Hooks (enforcement)',
              items: [
                'Code that runs at lifecycle events — deterministic',
                'Blocks, rewrites, or gates actions every single time',
                'Right for invariants: safety, quality gates, compliance',
                'Formatter RUNS after every edit, no opinion involved',
              ],
            },
          },
          {
            type: 'text',
            md: 'The rule: anything that must happen **every time** is a hook, not a sentence in CLAUDE.md. This is the same instinct as "lint in CI, not in code review" — move invariants from persuasion to mechanism.',
          },
        ],
      },
      {
        heading: 'The event catalog (highlights of ~30)',
        blocks: [
          {
            type: 'table',
            headers: ['Event', 'Fires when', 'Classic use'],
            rows: [
              ['SessionStart', 'A session begins', 'Inject env status, branch, open tickets'],
              ['UserPromptSubmit', 'You send a prompt, before the model sees it', 'Append context, validate, block secrets'],
              ['PreToolUse', 'Before any tool call executes', 'Guard rails: block/rewrite dangerous commands'],
              ['PostToolUse', 'After a tool call completes', 'Format-on-write, lint, auto-test'],
              ['Stop', 'Claude believes it is done', 'Verification gate: tests must pass or keep working'],
              ['PreCompact', 'Before context compaction', 'Persist progress notes to files'],
              ['TeammateIdle', 'An agent-team member goes idle', 'Assign next task from the queue'],
            ],
          },
        ],
      },
      {
        heading: 'Five handler types',
        blocks: [
          {
            type: 'table',
            headers: ['Handler', 'What runs', 'Reach for it when'],
            rows: [
              ['command', 'A shell command/script', 'Default: fast, local, exit-code contract'],
              ['http', 'POST to an endpoint', 'Central policy service shared across a team'],
              ['mcp_tool', 'An MCP tool call', 'Reuse existing connector logic as the check'],
              ['prompt', 'A one-shot model evaluation', 'Judgment calls: "is this change risky?"'],
              ['agent', 'A full subagent', 'Deep verification: run suite, inspect diff, decide'],
            ],
          },
          {
            type: 'text',
            md: 'Note the gradient: command hooks are deterministic; prompt and agent hooks put a **model inside your control plane** — probabilistic checks for questions regexes cannot answer. Auto permission mode is exactly this pattern, productized.',
          },
        ],
      },
      {
        heading: 'Control flow: block, rewrite, or escalate',
        blocks: [
          {
            type: 'diagram',
            caption: 'PreToolUse decision flow — exit codes for simple cases, JSON for nuance.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b"/><rect x="240" y="24" width="220" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="262" y="46" fill="#38bdf8" font-size="13" font-weight="bold">Claude proposes tool call</text><text x="262" y="64" fill="#a1a1aa" font-size="11">e.g. Bash: rm -rf build/</text><line x1="350" y1="76" x2="350" y2="112" stroke="#52525b" stroke-width="2"/><polygon points="344,110 356,110 350,122" fill="#52525b"/><rect x="250" y="124" width="200" height="48" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="286" y="153" fill="#fbbf24" font-size="13" font-weight="bold">PreToolUse hook</text><line x1="290" y1="172" x2="130" y2="220" stroke="#52525b" stroke-width="2"/><line x1="350" y1="172" x2="350" y2="220" stroke="#52525b" stroke-width="2"/><line x1="410" y1="172" x2="570" y2="220" stroke="#52525b" stroke-width="2"/><rect x="30" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#34d399"/><text x="46" y="248" fill="#34d399" font-size="13" font-weight="bold">exit 0 / JSON allow</text><text x="46" y="268" fill="#a1a1aa" font-size="11">tool runs, optionally with</text><text x="46" y="284" fill="#a1a1aa" font-size="11">updatedInput rewriting args</text><rect x="250" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#f472b6"/><text x="266" y="248" fill="#f472b6" font-size="13" font-weight="bold">exit 2 / JSON deny</text><text x="266" y="268" fill="#a1a1aa" font-size="11">blocked; stderr / reason fed</text><text x="266" y="284" fill="#a1a1aa" font-size="11">to Claude, which adapts</text><rect x="470" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="486" y="248" fill="#a78bfa" font-size="13" font-weight="bold">JSON ask</text><text x="486" y="268" fill="#a1a1aa" font-size="11">escalates to the human</text><text x="486" y="284" fill="#a1a1aa" font-size="11">with the hook's reason</text><text x="30" y="352" fill="#a1a1aa" font-size="12">Same pattern on Stop: exit 2 = "not done" — Claude keeps working until your check passes.</text></svg>`,
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "hooks": [\n          { "type": "command", "command": ".claude/hooks/guard.sh" }\n        ]\n      }\n    ],\n    "Stop": [\n      {\n        "hooks": [\n          { "type": "command", "command": "npm test --silent" }\n        ]\n      }\n    ]\n  }\n}',
            caption: '.claude/settings.json — a Bash guard plus a Stop-hook verification gate.',
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "permissionDecision": "deny",\n  "permissionDecisionReason": "rm is banned here; use trash(1) so deletes are recoverable",\n  "updatedInput": { "command": "trash build/" }\n}',
            caption: 'JSON output from a PreToolUse hook: deny with a reason — or rewrite the input and allow.',
          },
        ],
      },
      {
        heading: 'Three recipes that pay rent',
        blocks: [
          {
            type: 'text',
            md: '**Format-on-write:** PostToolUse matching Edit|Write runs prettier/ruff on the touched file — style leaves the conversation entirely. **Destructive-command guard:** PreToolUse on Bash denies rm -rf, force-push to main, and DROP TABLE, with a reason Claude can act on. **Stop-gate:** Stop hook runs the test suite; exit 2 turns "claims done but isn\'t" into "keeps working until green" — Cherny\'s 2-3x quality lever, mechanized.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Where hooks live',
            md: 'Session-only experiments: the /hooks menu. Team invariants: `.claude/settings.json` in the repo. Personal guards everywhere: `~/.claude/settings.json`. Scoped enforcement: hooks in a skill or agent\'s frontmatter — active only while it runs.',
          },
        ],
      },
    ],
    lab: {
      title: 'Install a guard and a gate',
      intro: 'Put two hooks on a real project: a PreToolUse guard that blocks destructive commands and a Stop hook that refuses "done" until tests pass.',
      steps: [
        'Create .claude/hooks/guard.sh: read the tool input JSON from stdin, grep the command for "rm -rf" and "push --force"; if matched, echo a one-line reason to stderr and exit 2. chmod +x it.',
        'Register it in .claude/settings.json under PreToolUse with matcher "Bash" (use the settings example from this lesson).',
        'Test: ask Claude to "clean up by running rm -rf on the build directory". Watch the block land and Claude adapt to a safer alternative.',
        'Add a Stop hook running your real test command (npm test, pytest, go test). Exit 2 on failure.',
        'Test the gate: ask for a small change that plausibly breaks a test, and watch Claude get bounced back to fix it before finishing.',
        'Run /hooks to confirm both are registered, then restart the session and verify they persist (they live in settings.json, not the session).',
      ],
      checklist: [
        'guard.sh blocks a destructive command with exit 2',
        'Claude visibly receives the stderr reason and changes approach',
        'Stop hook prevents completion while tests fail, and passes when green',
        'Both hooks survive a session restart',
        'You can articulate which of your CLAUDE.md lines should be promoted to hooks',
      ],
    },
    checkQuiz: [
      {
        q: 'You want rm invocations transparently converted to trash(1) instead of blocked. Which mechanism?',
        options: [
          'Exit code 2 with the trash command on stderr',
          'JSON output with updatedInput rewriting the command, decision allow',
          'A CLAUDE.md rule: "always use trash instead of rm"',
          'PostToolUse hook that restores deleted files',
        ],
        answer: 1,
        explain:
          'updatedInput rewrites the tool input before execution — allow-with-rewrite. Exit 2 only blocks; CLAUDE.md is advisory; PostToolUse is too late.',
      },
      {
        q: 'Claude keeps declaring victory while the test suite fails. The mechanized fix:',
        options: [
          'Add "always run tests before finishing" to CLAUDE.md',
          'A Stop hook running the suite, exiting 2 with failures on stderr so Claude resumes work',
          'A SessionStart hook that runs tests up front',
          'Switch to plan mode so it cannot finish prematurely',
        ],
        answer: 1,
        explain:
          'The Stop event is the "am I actually done?" checkpoint. Exit 2 feeds failures back and forces continuation — enforcement where CLAUDE.md is only a suggestion.',
      },
      {
        q: 'Auto-formatting every file Claude edits belongs on which event?',
        options: [
          'PreToolUse with matcher Edit|Write',
          'PostToolUse with matcher Edit|Write',
          'UserPromptSubmit',
          'PreCompact',
        ],
        answer: 1,
        explain:
          'Formatting acts on the result of a write, so it runs after the tool completes. PreToolUse fires before the file has changed.',
      },
      {
        q: 'Best event to automatically prepend the current git branch and open ticket to every request?',
        options: [
          'SessionStart — once is enough',
          'UserPromptSubmit — it can inject context into each prompt before the model sees it',
          'PreToolUse on Bash',
          'TeammateIdle',
        ],
        answer: 1,
        explain:
          'UserPromptSubmit runs per-prompt and its output can be added to context — perfect for fresh, always-current state. SessionStart data goes stale as the session ages.',
      },
    ],
    resources: [
      { label: 'Claude Code docs — hooks reference', url: 'https://code.claude.com/docs/en/hooks', kind: 'docs' },
      { label: 'Claude Code docs — hooks guide', url: 'https://code.claude.com/docs/en/hooks-guide', kind: 'docs' },
      { label: 'everything-claude-code — community hooks catalog', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
      { label: 'Claude Code best practices (verification escalation ladder)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
    ],
  },
]
