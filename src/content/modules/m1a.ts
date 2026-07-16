import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m1-l1: Claude Code Fundamentals & the .claude Folder
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l1',
    title: 'Claude Code Fundamentals & the .claude Folder',
    day: 4,
    minutes: 50,
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
          'settings.local.json is your personal copy of the settings, and Claude Code adds it to .gitignore automatically so it stays out of the repo. The other three hold decisions the whole team shares, so they belong in version control where everyone gets them.',
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
          'Auto mode puts a small classifier (a fast helper model) in front of every proposed action. Routine actions run without interrupting you, and risky ones still trigger a prompt. Add /sandbox on top and commands run inside operating-system isolation, which leaves the old skip-everything flag with no remaining upside.',
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
          'A small classifier model looks at each proposed action and decides whether it seems routine or risky. Routine actions flow through, and risky ones still surface a prompt for you. Allowlists and CLAUDE.md exist too, but they are separate mechanisms from auto mode.',
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
          '/init reads through the repo, notices things like the build tool and the test commands, and writes a first-draft CLAUDE.md for you to edit down. It never touches your account, and it installs nothing.',
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
          'The official surfaces in mid-2026 are the terminal, the VS Code and JetBrains extensions, the desktop app, the web and iOS versions at claude.ai/code, and Slack. Anthropic has never shipped a Vim GUI.',
      },
    ],
    sections: [
      {
        heading: 'One agent, five surfaces',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code started life as a CLI, short for command-line interface: a program you use by typing commands into a terminal instead of clicking buttons. That label is out of date. The same agent now runs in at least five places, and every one of them reads the same project configuration and the same session history. So you can start a task from your phone while waiting for coffee, then sit down at your desk and pull that exact session into your terminal to finish it.',
          },
          {
            type: 'diagram',
            caption: 'Five ways in, one agent underneath. Every surface reads the same config and the same session store.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b"/><rect x="30" y="40" width="180" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="120" y="62" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Terminal CLI</text><text x="120" y="80" fill="#a1a1aa" font-size="11" text-anchor="middle">deep work and scripts</text><rect x="490" y="40" width="180" height="52" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="580" y="62" fill="#a78bfa" font-size="13" font-weight="bold" text-anchor="middle">VS Code / JetBrains</text><text x="580" y="80" fill="#a1a1aa" font-size="11" text-anchor="middle">inline diffs in your editor</text><rect x="260" y="24" width="180" height="52" rx="6" fill="#27272a" stroke="#e4e4e7"/><text x="350" y="46" fill="#e4e4e7" font-size="13" font-weight="bold" text-anchor="middle">Slack</text><text x="350" y="64" fill="#a1a1aa" font-size="11" text-anchor="middle">delegate from team chat</text><rect x="30" y="252" width="180" height="52" rx="6" fill="#27272a" stroke="#34d399"/><text x="120" y="274" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Desktop app</text><text x="120" y="292" fill="#a1a1aa" font-size="11" text-anchor="middle">parallel local sessions</text><rect x="490" y="252" width="180" height="52" rx="6" fill="#27272a" stroke="#f472b6"/><text x="580" y="274" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Web + iOS</text><text x="580" y="292" fill="#a1a1aa" font-size="11" text-anchor="middle">cloud sessions anywhere</text><rect x="230" y="140" width="240" height="64" rx="8" fill="#27272a" stroke="#fbbf24"/><text x="350" y="166" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">One shared brain</text><text x="350" y="186" fill="#a1a1aa" font-size="11" text-anchor="middle">.claude/ config + session store</text><line x1="150" y1="92" x2="280" y2="140" stroke="#52525b" stroke-width="2"/><line x1="550" y1="92" x2="420" y2="140" stroke="#52525b" stroke-width="2"/><line x1="350" y1="76" x2="350" y2="138" stroke="#52525b" stroke-width="2"/><line x1="150" y1="252" x2="280" y2="204" stroke="#52525b" stroke-width="2"/><line x1="550" y1="252" x2="420" y2="204" stroke="#52525b" stroke-width="2"/><text x="350" y="326" fill="#a1a1aa" font-size="12" text-anchor="middle">Start on one surface, continue on another: sessions and config follow you.</text></svg>`,
          },
          {
            type: 'text',
            md: 'Because the brain is shared, you pick a surface based on what feels comfortable in the moment, and you lose nothing by switching. One note on the table below: "headless" means running Claude without the interactive chat interface. The command `claude -p "summarize this repo"` runs one prompt, prints the answer, and exits, which makes it easy to call from shell scripts.',
          },
          {
            type: 'table',
            headers: ['Surface', 'Best for', 'Notes'],
            rows: [
              ['Terminal CLI', 'Long focused work, scripting, headless runs with claude -p', 'The original surface; new features land here first'],
              ['VS Code / JetBrains', 'Seeing proposed edits as inline diffs right next to your code', 'Official extensions running the same engine underneath'],
              ['Desktop app', 'Running several sessions side by side on local projects', 'Manages git worktrees for you so parallel agents stay out of each other\'s way'],
              ['Web + iOS (claude.ai/code)', 'Starting or checking on cloud sessions from anywhere', 'Runs in a cloud sandbox; pull a session down to your terminal with claude --teleport'],
              ['Slack', 'Handing work to Claude from a team conversation', 'Tag @Claude in a thread, for example under a pasted bug report'],
            ],
          },
        ],
      },
      {
        heading: 'Install, update, verify',
        blocks: [
          {
            type: 'text',
            md: 'Installation is one command through npm, the package manager that ships with Node.js. After that first install, the tool keeps itself current.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'npm install -g @anthropic-ai/claude-code\nclaude --version   # v2.1.x as of July 2026\nclaude update      # self-updates in place\nclaude doctor      # health check: install, settings, hooks, MCP',
            caption: 'Install once, then claude update keeps you current.',
          },
          {
            type: 'text',
            md: 'The last line deserves a permanent spot in your toolkit. A quick vocabulary note first: **slash commands** are instructions you type inside a running Claude Code session, and they always start with a forward slash, like `/init` or `/doctor`. So `/doctor` inside a session and `claude doctor` from your shell run the same health check.\n\nWhat does it check? Your install, every settings file, your hooks, and whether your MCP servers respond. (MCP is the [Model Context Protocol](https://modelcontextprotocol.io), a standard way to plug external tools like databases or Jira into Claude; module 2 covers it properly.) When Claude Code starts acting strange, run `/doctor` before anything else. A vague feeling of "something is off" turns into a named, fixable problem.',
          },
        ],
      },
      {
        heading: 'Permission modes: the trust dial',
        blocks: [
          {
            type: 'text',
            md: 'Out of the box, Claude Code asks for your approval before it runs a shell command or edits a file. That protects you from surprises, and it also gets tedious once you trust a project. Permission modes let you choose how much checking you want. You can switch modes any time with the `/permissions` slash command, and the [settings docs](https://code.claude.com/docs/en/settings) cover every knob in detail.',
          },
          {
            type: 'table',
            headers: ['Mode', 'Behavior', 'When to use'],
            rows: [
              ['default', 'Asks before the first use of each tool or command', 'A repo you just cloned, or anything high stakes'],
              ['acceptEdits', 'File edits go through automatically; shell commands still ask', 'Fast iteration on code you trust'],
              ['plan', 'Read-only: Claude explores the code and writes a plan without changing anything', 'Thinking through a design before letting it touch files'],
              ['auto', 'A classifier reviews each action and only interrupts you for the risky ones', 'The daily default for most people in 2026'],
              ['bypassPermissions', 'No checks of any kind', 'Disposable CI containers only (CI means continuous integration, the servers that build and test code automatically)'],
            ],
          },
          {
            type: 'diagram',
            caption: 'How auto mode decides. A fast helper model reviews each action so you only see prompts that deserve your attention.',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="300" fill="#18181b"/><rect x="250" y="24" width="200" height="56" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="350" y="47" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Claude proposes an action</text><text x="350" y="66" fill="#a1a1aa" font-size="11" text-anchor="middle">edit a file, run a command</text><line x1="350" y1="80" x2="350" y2="112" stroke="#52525b" stroke-width="2"/><polygon points="344,110 356,110 350,122" fill="#52525b"/><rect x="250" y="124" width="200" height="56" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="350" y="147" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Auto mode classifier</text><text x="350" y="166" fill="#a1a1aa" font-size="11" text-anchor="middle">a fast helper model reviews it</text><line x1="300" y1="180" x2="185" y2="216" stroke="#52525b" stroke-width="2"/><line x1="400" y1="180" x2="515" y2="216" stroke="#52525b" stroke-width="2"/><rect x="60" y="220" width="250" height="56" rx="6" fill="#27272a" stroke="#34d399"/><text x="185" y="243" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Looks routine</text><text x="185" y="262" fill="#a1a1aa" font-size="11" text-anchor="middle">runs immediately, no prompt</text><rect x="390" y="220" width="250" height="56" rx="6" fill="#27272a" stroke="#f472b6"/><text x="515" y="243" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Looks risky</text><text x="515" y="262" fill="#a1a1aa" font-size="11" text-anchor="middle">you get a permission prompt</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Old habit to break: --dangerously-skip-permissions',
            md: 'Most 2025 tutorials told you to alias this flag, because back then the constant prompts really were annoying. That advice has expired. Auto mode gives you the same smooth flow while a classifier still catches the dangerous moments (the accidental `rm -rf`, the force push to main). And `/sandbox` goes further: it runs commands inside isolation enforced by the operating system itself, so a command cannot write outside your project folder or reach the network without approval, even after being allowed. Skipping permissions now gives up real safety and gains you nothing.',
          },
        ],
      },
      {
        heading: '/init and the anatomy of .claude/',
        blocks: [
          {
            type: 'text',
            md: 'Run `/init` inside any real repo and Claude reads through the codebase, spotting things like the build system and the test commands. Then it writes a starter [CLAUDE.md](https://code.claude.com/docs/en/memory), the memory file Claude loads at the start of every session in that project. (The next lesson is entirely about that file, so for now just know it exists and gets loaded automatically.)\n\nCLAUDE.md plus the `.claude/` folder next to it form the whole project-level brain. Everything inside is plain text. You can diff it, review it in a pull request, and reason about it exactly like source code, because that is what it is.',
          },
          {
            type: 'diagram',
            caption: 'The .claude/ directory: six entries, one mental model. Expertise lives in files.',
            svg: `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="380" fill="#18181b"/><text x="30" y="36" fill="#e4e4e7" font-size="16" font-weight="bold">your-project/</text><rect x="30" y="52" width="280" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="46" y="74" fill="#38bdf8" font-size="14" font-weight="bold">CLAUDE.md</text><text x="46" y="92" fill="#a1a1aa" font-size="11">project memory, loaded every session</text><text x="30" y="140" fill="#e4e4e7" font-size="15" font-weight="bold">.claude/</text><rect x="30" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="46" y="174" fill="#a78bfa" font-size="14" font-weight="bold">skills/</text><text x="46" y="192" fill="#a1a1aa" font-size="11">SKILL.md folders = expertise</text><rect x="250" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#f472b6"/><text x="266" y="174" fill="#f472b6" font-size="14" font-weight="bold">agents/</text><text x="266" y="192" fill="#a1a1aa" font-size="11">subagent definitions (*.md)</text><rect x="470" y="152" width="200" height="52" rx="6" fill="#27272a" stroke="#34d399"/><text x="486" y="174" fill="#34d399" font-size="14" font-weight="bold">rules/</text><text x="486" y="192" fill="#a1a1aa" font-size="11">scoped rules via paths: globs</text><rect x="30" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="46" y="246" fill="#fbbf24" font-size="14" font-weight="bold">settings.json</text><text x="46" y="264" fill="#a1a1aa" font-size="11">shared: permissions, hooks, MCP</text><rect x="250" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#52525b"/><text x="266" y="246" fill="#e4e4e7" font-size="14" font-weight="bold">settings.local.json</text><text x="266" y="264" fill="#a1a1aa" font-size="11">personal overrides, git-ignored</text><rect x="470" y="224" width="200" height="52" rx="6" fill="#27272a" stroke="#52525b"/><text x="486" y="246" fill="#e4e4e7" font-size="14" font-weight="bold">CLAUDE.local.md</text><text x="486" y="264" fill="#a1a1aa" font-size="11">personal memory, git-ignored</text><line x1="120" y1="104" x2="120" y2="150" stroke="#52525b" stroke-width="2"/><text x="30" y="330" fill="#a1a1aa" font-size="12">Commit everything except the *.local.* files. This folder is your team's agent configuration.</text><text x="30" y="352" fill="#a1a1aa" font-size="12">All plain text: diffable, reviewable, and portable across every surface.</text></svg>`,
          },
          {
            type: 'text',
            md: 'A quick tour of the six entries, top to bottom. `CLAUDE.md` holds the project memory that loads every session. `skills/` holds packaged expertise, one folder per skill (covered in [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3)). `agents/` holds definitions for subagents, helper agents you can spin up for specific jobs (module 2). `rules/` holds instructions that only load when certain files are involved (next lesson). `settings.json` holds shared configuration like permissions and hooks, while `settings.local.json` and `CLAUDE.local.md` are your personal, git-ignored versions of the settings and the memory file.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Architecture lens',
            md: 'If you squint, you\'ve seen this pattern before: `.claude/` plays the same role for the agent that `package.json` plus your CI config plays for the build. Plain files win here because humans and models both read them natively, with no database or admin UI in between. Each lesson this week fills in one of these entries, so by Friday the whole diagram will feel familiar.',
          },
        ],
      },
    ],
    lab: {
      title: 'Install, /init, and tour the brain',
      intro: 'Get to a current Claude Code on a real project of yours, generate the starter config, and be able to explain every file it made.',
      steps: [
        'Install or update: `npm install -g @anthropic-ai/claude-code`, then run `claude --version` and confirm you are on v2.1 or later.',
        'Run `claude doctor` and fix anything it flags before continuing.',
        'cd into a real project (a toy repo hides too many problems), start `claude`, and run `/init`.',
        'Read the generated CLAUDE.md end to end. Delete at least three lines that state the obvious.',
        'Run `ls -la .claude/` and open each file it created. Then add a `.claude/settings.json` with a `permissions` block allowing your test command.',
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
          '/doctor checks the install, every settings file, your hooks, and MCP server reachability in a single pass, so you get a diagnosis before you change anything. Reinstalling or deleting ~/.claude might happen to fix it, but it destroys the evidence of what actually went wrong.',
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
          '/sandbox wraps commands in isolation enforced by the operating system itself: they cannot write outside the project or reach the network unless you allow it. Working in a cloned temp directory describes worktree isolation, a separate feature used by subagents.',
      },
      {
        q: 'settings.json allows `npm test`; your settings.local.json denies it. A managed enterprise policy allows it. What happens?',
        options: [
          'Denied. Personal local settings override shared project settings, and a managed policy only forces the outcome when it denies',
          'Allowed. settings.json is the source of truth for the repo',
          'Allowed. Managed policy always forces the final answer on every rule',
          'Claude prompts you because the layers conflict',
        ],
        answer: 0,
        explain:
          'The precedence works like this: a managed policy deny wins over everything, then your local settings override the shared project settings. A managed allow just means the org has no objection; it forces nothing. Since your local file denies the command, the deny stands.',
      },
      {
        q: 'You started a session on claude.ai/code from your phone during standup. Supported way to continue it in your terminal?',
        options: [
          'You cannot, since web sessions are sandbox-only',
          'claude --teleport to pull the cloud session into your local CLI',
          'Copy the transcript into a new local session as context',
          'Run /export on web, /import locally',
        ],
        answer: 1,
        explain:
          'claude --teleport hands a cloud session off to your local CLI with its full history and tool state intact. Pasting a transcript into a fresh session loses all of that state, and no /import command exists.',
      },
    ],
    resources: [
      { label: 'Claude Code docs: overview', url: 'https://code.claude.com/docs/en/overview', kind: 'docs' },
      { label: 'Claude Code docs: settings & permissions', url: 'https://code.claude.com/docs/en/settings', kind: 'docs' },
      { label: 'Claude Code in Action (free course, certificate)', url: 'https://anthropic.skilljar.com/claude-code-in-action', kind: 'course' },
      { label: 'everything-claude-code: dense config reference', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l2: CLAUDE.md & the Memory System
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l2',
    title: 'CLAUDE.md & the Memory System',
    day: 4,
    minutes: 55,
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
          'The layers load from broadest to most specific: the managed org policy first, then your personal global file at ~/.claude/CLAUDE.md, then the project CLAUDE.md, and finally your git-ignored CLAUDE.local.md. Each later file layers its instructions on top of the earlier ones, so the most specific guidance lands last.',
      },
      {
        q: 'How deep can @imports chain inside memory files?',
        options: ['They cannot nest', '2 levels', '4 levels', 'Unlimited'],
        answer: 2,
        explain:
          'An @import line pulls another file into memory at load time, and those files can contain @imports of their own, up to 4 levels deep. That gives you plenty of room to split memory into topical files while keeping a hard ceiling on how much can get pulled in.',
      },
      {
        q: 'Where does Claude Code keep its auto memory for a project?',
        options: [
          'In a hidden section of the project CLAUDE.md',
          'In ~/.claude/projects/<proj>/memory/, as a MEMORY.md index plus topic files',
          'In a local SQLite database with vector embeddings',
          'Server-side, attached to your Anthropic account',
        ],
        answer: 1,
        explain:
          'Auto memory is plain markdown that Claude writes for itself: a MEMORY.md index pointing to topic files, stored per project under your home directory. No database sits behind it, and nothing gets uploaded to your account.',
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
          'The test is behavioral: if deleting the line would never change what Claude does, the line is dead weight that steals attention from the lines that matter. Asking that one question on every visit is what keeps a file under 200 lines for years.',
      },
      {
        q: 'CLAUDE.md content reaches the model as:',
        options: [
          'Part of the system prompt, so it always outranks user input',
          'A user message, so it is strong context that other context can outweigh',
          'A tool result injected on the first tool call',
          'Fine-tuned weights baked in at session start',
        ],
        answer: 1,
        explain:
          'CLAUDE.md arrives in the context window as a user message. Claude treats it as strong guidance and follows it the vast majority of the time, but a user message can be outweighed by other context. When a rule must hold every single time, you want a hook (see [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5)).',
      },
    ],
    sections: [
      {
        heading: 'The load-order hierarchy',
        blocks: [
          {
            type: 'text',
            md: 'Start with what [CLAUDE.md](https://code.claude.com/docs/en/memory) actually is: a plain markdown file that Claude Code reads at the start of every session and places into its context. The agent begins each conversation already knowing things like your build commands and your project\'s conventions. Think of it as the onboarding doc you\'d hand a new teammate, except this teammate re-reads it every single morning.\n\nOne file turns out to be too crude, though. Some instructions belong to the whole company, others to one project, and a few just to you. Claude Code handles this by loading up to four memory files in a fixed order, broadest first.',
          },
          {
            type: 'diagram',
            caption: 'Memory layers stack from broadest to most specific, then land in context as a user message.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b"/><rect x="20" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#f472b6"/><text x="34" y="66" fill="#f472b6" font-size="13" font-weight="bold">1. Managed</text><text x="34" y="84" fill="#a1a1aa" font-size="11">org policy file</text><rect x="192" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="206" y="66" fill="#a78bfa" font-size="13" font-weight="bold">2. User</text><text x="206" y="84" fill="#a1a1aa" font-size="11">~/.claude/CLAUDE.md</text><rect x="364" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="378" y="66" fill="#38bdf8" font-size="13" font-weight="bold">3. Project</text><text x="378" y="84" fill="#a1a1aa" font-size="11">CLAUDE.md + @imports</text><rect x="536" y="40" width="150" height="64" rx="6" fill="#27272a" stroke="#34d399"/><text x="550" y="66" fill="#34d399" font-size="13" font-weight="bold">4. Personal</text><text x="550" y="84" fill="#a1a1aa" font-size="11">CLAUDE.local.md</text><line x1="170" y1="72" x2="190" y2="72" stroke="#52525b" stroke-width="2"/><line x1="342" y1="72" x2="362" y2="72" stroke="#52525b" stroke-width="2"/><line x1="514" y1="72" x2="534" y2="72" stroke="#52525b" stroke-width="2"/><line x1="350" y1="104" x2="350" y2="150" stroke="#52525b" stroke-width="2"/><polygon points="344,148 356,148 350,160" fill="#52525b"/><rect x="180" y="162" width="340" height="56" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="200" y="186" fill="#fbbf24" font-size="13" font-weight="bold">Context window (arrives as a USER message)</text><text x="200" y="204" fill="#a1a1aa" font-size="11">strong guidance that Claude usually follows</text><rect x="20" y="248" width="320" height="64" rx="6" fill="#27272a" stroke="#52525b"/><text x="36" y="272" fill="#e4e4e7" font-size="13" font-weight="bold">.claude/rules/*.md</text><text x="36" y="292" fill="#a1a1aa" font-size="11">joins context only when paths: globs match</text><rect x="360" y="248" width="320" height="64" rx="6" fill="#27272a" stroke="#52525b"/><text x="376" y="272" fill="#e4e4e7" font-size="13" font-weight="bold">Auto memory (Claude-written)</text><text x="376" y="292" fill="#a1a1aa" font-size="11">~/.claude/projects/.../memory/MEMORY.md + topics</text></svg>`,
          },
          {
            type: 'text',
            md: 'Walking the diagram left to right: the managed file is where a company sets policy for everyone. Your global `~/.claude/CLAUDE.md` carries preferences that follow you to every project ("I use fish shell, my editor is Neovim"). The project CLAUDE.md is committed to the repo and shared with the team. And `CLAUDE.local.md` holds your personal notes for this one project, kept out of git. Later files refine earlier ones, so when two layers disagree, the more specific one wins.\n\nOne detail matters more than it looks: all of this lands in the model\'s context as a **user message**. Claude treats it as strong guidance and follows it most of the time. For rules where "most of the time" would be a problem, say "never commit directly to main", you want a hook, which enforces the rule mechanically every time. [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5) covers those.',
          },
        ],
      },
      {
        heading: '@imports, AGENTS.md, and rules/',
        blocks: [
          {
            type: 'text',
            md: 'A CLAUDE.md works best as an index that points elsewhere, the way a good README links to deeper docs instead of containing them all. The pointing mechanism is the **@import**: a line like `@docs/architecture.md` pulls that entire file into memory at load time. Imported files can import further files, and the chain stops at 4 levels deep so one careless import can never drag in half the repo.',
          },
          {
            type: 'diagram',
            caption: 'An @import tree in practice: CLAUDE.md stays a lean index while depth lives in the imported files.',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="320" fill="#18181b"/><rect x="250" y="24" width="200" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="350" y="46" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">CLAUDE.md</text><text x="350" y="64" fill="#a1a1aa" font-size="11" text-anchor="middle">the index, under 200 lines</text><line x1="290" y1="76" x2="135" y2="130" stroke="#52525b" stroke-width="2"/><line x1="350" y1="76" x2="350" y2="130" stroke="#52525b" stroke-width="2"/><line x1="410" y1="76" x2="565" y2="130" stroke="#52525b" stroke-width="2"/><text x="470" y="108" fill="#fbbf24" font-size="11">@import, depth 1</text><rect x="40" y="132" width="190" height="52" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="135" y="154" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">docs/architecture.md</text><text x="135" y="172" fill="#a1a1aa" font-size="11" text-anchor="middle">system design notes</text><rect x="255" y="132" width="190" height="52" rx="6" fill="#27272a" stroke="#34d399"/><text x="350" y="154" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">docs/testing.md</text><text x="350" y="172" fill="#a1a1aa" font-size="11" text-anchor="middle">how we test, exact flags</text><rect x="470" y="132" width="190" height="52" rx="6" fill="#27272a" stroke="#f472b6"/><text x="565" y="154" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">AGENTS.md</text><text x="565" y="172" fill="#a1a1aa" font-size="11" text-anchor="middle">cross-tool agent file</text><line x1="135" y1="184" x2="135" y2="238" stroke="#52525b" stroke-width="2"/><text x="150" y="216" fill="#fbbf24" font-size="11">@import, depth 2</text><rect x="40" y="240" width="190" height="52" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="135" y="262" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">docs/db-schema.md</text><text x="135" y="280" fill="#a1a1aa" font-size="11" text-anchor="middle">table layouts, constraints</text><text x="440" y="272" fill="#a1a1aa" font-size="12">Imports resolve recursively and stop at depth 4.</text></svg>`,
          },
          {
            type: 'text',
            md: 'Notice `AGENTS.md` in that tree. [AGENTS.md](https://agents.md) is an open standard for agent-facing instruction files, designed to work across many AI coding tools rather than just one. Claude Code reads it natively. So an open-source project can maintain a single AGENTS.md for every tool its contributors use, and your CLAUDE.md can reuse it with a one-line `@AGENTS.md`.\n\nThe third mechanism is `.claude/rules/`, a folder of rule files that load only when they\'re relevant. Two bits of vocabulary before the example. **Frontmatter** is a small metadata block between two `---` lines at the top of a markdown file, written in [YAML](https://yaml.org), a plain-text format of key: value pairs. A **glob** is a wildcard pattern for matching file paths: `*` matches anything within one folder, and `**` matches any depth of folders. So `src/components/**/*.tsx` reads as "any .tsx file, anywhere under src/components".',
          },
          {
            type: 'code',
            lang: 'markdown',
            code: '---\npaths:\n  - "src/components/**/*.tsx"\n  - "src/styles/**"\n---\n- Function components only; no class components\n- Styling via vanilla-extract; never inline style objects\n- Every new component gets a Storybook story',
            caption: '.claude/rules/frontend.md, loaded only when Claude touches files matching the globs.',
          },
          {
            type: 'text',
            md: 'Here\'s the payoff: those React rules enter context only while Claude is actually working on React components. When you ask for a database migration instead, the file stays on disk and costs zero attention. This is how teams scale past the 200-line budget, and it replaced the 2025 habit of stuffing everything into one giant CLAUDE.md.',
          },
        ],
      },
      {
        heading: 'Auto memory: the layer Claude writes itself',
        blocks: [
          {
            type: 'text',
            md: 'Since early 2026, Claude Code also keeps notes nobody asked it to keep. Look under `~/.claude/projects/<your-project>/memory/` and you\'ll find a MEMORY.md index plus topic files covering things like debugging history and your personal preferences. Claude writes these during sessions, and a background consolidation pass (people call it the "dream" pass, since it works a bit like sleep consolidating the day\'s events) periodically merges and tidies them.\n\nGo read yours. Seriously, it takes two minutes. The notes are often unintentionally funny ("user gets frustrated by long explanations") and occasionally wrong, and a wrong memory quietly steers every future session, so correcting them is worth the visit.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The hesamation teardown: why RAG still exists',
            md: 'A widely shared teardown of this system counted four layers: the CLAUDE.md files, auto memory, background consolidation, and a retrieval step that decides which notes surface into context. That last layer matches on **keywords only**. If a note was filed under "login flow" and you ask about "auth", the words differ, so the note may never come up even though the meaning matches. Semantic search, the kind that knows those two phrases mean the same thing, is exactly what RAG adds. RAG stands for retrieval-augmented generation: fetching relevant stored knowledge by meaning and feeding it to the model alongside your question. Module 4 builds one, and now you know the gap it fills.',
          },
        ],
      },
      {
        heading: 'Discipline: under 200 lines, forever',
        blocks: [
          {
            type: 'text',
            md: 'Why the hard line limit? Context works like an attention budget. Every line in CLAUDE.md competes with your actual request for the model\'s attention, and a critical warning buried under 400 lines of filler behaves almost like a warning nobody wrote. Short files keep every line loud.',
          },
          {
            type: 'compare',
            left: {
              title: 'High-signal CLAUDE.md',
              items: [
                'Build/test/lint commands with exact flags',
                'Non-obvious conventions ("API errors use Result<T>, never throw")',
                'Landmines ("do not touch codegen/ because it is generated")',
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
            md: 'Every time you correct Claude mid-session, finish with one more sentence: "update CLAUDE.md so you don\'t repeat that mistake." Claude edits its own memory file, you review the diff, and the correction becomes permanent. Boris Cherny, the creator of Claude Code, calls this the single most valuable habit a team can build around the tool. Pair it with pruning a line or two on every visit and the file stays sharp for years instead of growing into a landfill.',
          },
        ],
      },
    ],
    lab: {
      title: 'Prune, scope, and meet your auto memory',
      intro: 'Turn the /init draft from the last lab into a lean, layered memory system on a real project.',
      steps: [
        'Open your project CLAUDE.md. For each line ask: "would removing this cause a mistake?" Delete every line that fails.',
        'Add a commands section with your real build, test, and lint invocations, exact flags included.',
        'Create .claude/rules/frontend.md (or backend.md) with a paths: glob and 2-3 rules that only apply there.',
        'Split anything long into docs/ and reference it with an @import (e.g. @docs/architecture.md). Verify with /memory that it resolves.',
        'Run `ls ~/.claude/projects/`, find this project, and open memory/MEMORY.md plus one topic file. Correct anything wrong in it.',
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
          'Ignores it, since only CLAUDE.md is ever read',
          'Reads AGENTS.md as project memory via the interop standard',
          'Auto-converts it to CLAUDE.md and commits the file',
          'Prompts you to choose a memory format first',
        ],
        answer: 1,
        explain:
          'AGENTS.md is the cross-tool standard for agent instruction files, and Claude Code reads it as project memory automatically. Projects get to maintain one file instead of one per tool, and nothing gets converted or committed behind your back.',
      },
      {
        q: 'A rule file has paths: ["src/api/**"]. When does it consume context?',
        options: [
          'Every session, like CLAUDE.md, with the glob only affecting priority',
          'Only when the work involves files matching the glob',
          'Only when you invoke /rules explicitly',
          'Never automatically; rules are documentation for humans',
        ],
        answer: 1,
        explain:
          'Path-scoped rules load just in time, meaning only when files matching the glob are involved in the current work. That is the whole value of the mechanism: relevant guidance shows up when needed and costs nothing the rest of the time.',
      },
      {
        q: 'You told Claude about a flaky race condition weeks ago; auto memory filed it under "intermittent CI failures." You now ask about "the async bug." Why might it miss?',
        options: [
          'Auto memory expires after 7 days',
          'Retrieval is keyword-only, and "async bug" shares no words with notes filed under "intermittent CI failures"',
          'Auto memory is read-only after consolidation',
          'Topic files are excluded from search; only MEMORY.md is scanned',
        ],
        answer: 1,
        explain:
          'Auto memory retrieval matches keywords, with no semantic understanding underneath. Different vocabulary means no hit, even when the meaning is identical. Knowing this limit tells you exactly when a RAG-style memory add-on earns its complexity.',
      },
      {
        q: 'Best home for "I prefer terse commit messages, no emoji" on a shared team repo?',
        options: [
          'Project CLAUDE.md, so the team standardizes on it',
          'CLAUDE.local.md, since it is a personal preference rather than a team convention',
          '.claude/settings.json under a preferences key',
          'A comment at the top of .gitignore',
        ],
        answer: 1,
        explain:
          'Personal taste belongs in the git-ignored CLAUDE.local.md, where it shapes your sessions without imposing on teammates. The committed CLAUDE.md is for conventions the whole team owns, and settings.json holds configuration rather than prose instructions.',
      },
    ],
    resources: [
      { label: 'Claude Code docs: memory (CLAUDE.md, imports, rules, auto memory)', url: 'https://code.claude.com/docs/en/memory', kind: 'docs' },
      { label: 'AGENTS.md: the open agent-file standard', url: 'https://agents.md', kind: 'docs' },
      { label: 'hesamation: Claude Code memory teardown (4 layers, keyword retrieval)', url: 'https://x.com/hesamation', kind: 'thread' },
      { label: 'Claude Code best practices (Anthropic engineering)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l3: Agent Skills Deep Dive
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l3',
    title: 'Agent Skills Deep Dive',
    day: 5,
    minutes: 55,
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
          'Absorbed into skills: a SKILL.md is invocable as /name, and the old commands/ folder is legacy',
          'Moved into settings.json under a commands key',
          'Deprecated with no replacement; use plain prompts',
        ],
        answer: 1,
        explain:
          'Slash commands and skills merged into one format. A SKILL.md gives you an explicit /name command and also lets the model fire the same capability on its own when the moment fits. Old commands/ folders still load for backwards compatibility, but new work belongs in skills/.',
      },
      {
        q: 'The description field in SKILL.md frontmatter is primarily:',
        options: [
          'Documentation for teammates browsing the repo',
          'The trigger surface: the model reads it to decide when to fire the skill',
          'The text shown in marketplace listings only',
          'A changelog summary for the skill',
        ],
        answer: 1,
        explain:
          'While a skill sits idle, the model sees only its name and description. That description is the one signal the model has for deciding "this moment calls for that skill", so whether the skill fires at the right times depends almost entirely on how you write it.',
      },
      {
        q: 'Setting disable-model-invocation: true on a skill means:',
        options: [
          'The skill can no longer use any tools',
          'Only explicit /name invocation works; the model cannot auto-fire it',
          'The skill runs without model involvement, as a pure script',
          'The skill is hidden from /help listings',
        ],
        answer: 1,
        explain:
          'The flag removes the skill from the pool the model can trigger on its own. Reach for it when a skill has real side effects, like deploying or publishing a release, and should only ever run because a human explicitly typed the command.',
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
          'Only the name and description stay loaded all the time, costing a few dozen tokens. The SKILL.md body joins the context when the skill triggers, and bundled files get read only if the task actually needs them. Expertise on disk is effectively unlimited while the idle cost stays near zero.',
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
          'context: fork runs the skill in an isolated copy of the conversation context. The heavy intermediate work happens there, and only the results come back, so the main conversation keeps a clean attention budget. Git worktree isolation for code is a different feature that belongs to agents.',
      },
    ],
    sections: [
      {
        heading: 'Skills absorbed slash commands',
        blocks: [
          {
            type: 'text',
            md: 'A little history makes this lesson easier. In 2025, Claude Code had two separate ideas: a `.claude/commands/` folder held prompt templates you invoked by typing /name, and "skills" were a newer concept for packaged expertise. Those two ideas merged. Today everything is a [skill](https://code.claude.com/docs/en/skills): a folder in `.claude/skills/<name>/` containing a file called `SKILL.md`.\n\nCreating one gives you two things at once. You get an explicit `/name` command you can type yourself, and the model gains a capability it can reach for on its own whenever the skill\'s description matches what\'s happening in the conversation. Skills also follow an open standard ([agentskills.io](https://agentskills.io)), so a skill you write for Claude Code can travel with you to other tools that speak the same format.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Obsolete: .claude/commands/',
            md: 'Old commands/ folders still load, purely for backwards compatibility. New work goes in skills/, which adds everything commands never had: frontmatter metadata, bundled reference files, per-skill tool restrictions, and the model\'s ability to trigger the skill itself. Migration is mechanical: move the markdown into a SKILL.md and write a description.',
          },
        ],
      },
      {
        heading: 'SKILL.md anatomy',
        blocks: [
          {
            type: 'text',
            md: 'A SKILL.md has two parts. The block between the `---` lines at the top is the **frontmatter**: metadata written in [YAML](https://yaml.org), a plain-text format of key: value pairs. Everything below it is the body, ordinary markdown holding the actual instructions. Read through the example, then use the table to decode each frontmatter key.',
          },
          {
            type: 'code',
            lang: 'markdown',
            code: '---\nname: pr-summary\ndescription: Draft a pull-request description from the current branch diff. Use when the user asks to write, summarize, or prepare a PR, or mentions "PR description".\nargument-hint: [base-branch]\nallowed-tools: Bash(git *), Read\ncontext: fork\n---\n\nBase branch: $ARGUMENTS (default: main)\n\nDiff stat: !`git diff --stat main...HEAD`\n\nWrite a PR description: summary, motivation, risk notes,\ntest evidence. Follow the house format in reference.md.',
            caption: '.claude/skills/pr-summary/SKILL.md. The frontmatter is the contract; the body is the expertise.',
          },
          {
            type: 'table',
            headers: ['Frontmatter key', 'What it controls'],
            rows: [
              ['description', 'The trigger. Written for the model: what the skill does plus when to use it'],
              ['argument-hint', 'The autocomplete hint shown after typing /name, e.g. [base-branch]'],
              ['disable-model-invocation', 'When true, only explicit /invocation works. Use it for side-effectful workflows'],
              ['allowed-tools', 'The tools the skill may use while it runs, e.g. Bash(git *), Read'],
              ['model / effort', 'Pins a specific model tier or reasoning effort for this skill'],
              ['context: fork', 'Runs the skill in an isolated context and returns only the results'],
              ['paths', 'Files or glob patterns to preload alongside the skill body'],
            ],
          },
          {
            type: 'text',
            md: 'Now walk the example once, slowly. The description names the job (drafting a PR description; PR is short for pull request, the bundle of changes you ask teammates to review) and then lists the moments that should trigger it, including literal phrases a user would type. `$ARGUMENTS` receives whatever you type after the skill name, so `/pr-summary develop` sets the base branch to develop. And that line starting with an exclamation mark runs `git diff --stat` the instant the skill fires, splicing the real output into the prompt before the model starts thinking. More on that trick below.',
          },
        ],
      },
      {
        heading: 'Progressive disclosure: unbounded expertise, near-zero idle cost',
        blocks: [
          {
            type: 'text',
            md: 'Here\'s the design problem skills had to solve: you might install 50 of them, and context space is scarce. The answer is **progressive disclosure**, a term borrowed from interface design that means "show the minimum up front, reveal detail only on demand". Skills load in three levels.',
          },
          {
            type: 'diagram',
            caption: 'Three loading levels. This design is what lets you install 50 skills without torching your context.',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="330" fill="#18181b"/><rect x="40" y="36" width="620" height="66" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="60" y="62" fill="#38bdf8" font-size="14" font-weight="bold">Level 1. Metadata: name + description</text><text x="60" y="84" fill="#a1a1aa" font-size="12">always in context · tens of tokens per skill · this is what triggers</text><rect x="40" y="132" width="620" height="66" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="60" y="158" fill="#a78bfa" font-size="14" font-weight="bold">Level 2. SKILL.md body</text><text x="60" y="180" fill="#a1a1aa" font-size="12">loaded only when triggered · procedure, constraints, dynamic !cmd injection</text><rect x="40" y="228" width="620" height="66" rx="6" fill="#27272a" stroke="#34d399"/><text x="60" y="254" fill="#34d399" font-size="14" font-weight="bold">Level 3. Bundled files: reference.md, scripts/, templates</text><text x="60" y="276" fill="#a1a1aa" font-size="12">read on demand mid-task · effectively unbounded depth at zero idle cost</text><line x1="350" y1="102" x2="350" y2="130" stroke="#52525b" stroke-width="2"/><polygon points="344,128 356,128 350,140" fill="#52525b"/><line x1="350" y1="198" x2="350" y2="226" stroke="#52525b" stroke-width="2"/><polygon points="344,224 356,224 350,236" fill="#52525b"/><text x="470" y="120" fill="#fbbf24" font-size="12">triggered by description match or /name</text><text x="470" y="216" fill="#fbbf24" font-size="12">model chooses to Read deeper files</text></svg>`,
          },
          {
            type: 'text',
            md: 'The economics are the insight here. An installed skill costs a few dozen tokens until the moment it fires, so the right move as an author is to push detail down the levels. Keep the SKILL.md body around 100 lines of procedure. Exhaustive references and style guides belong in bundled files sitting next to it, where the model reads them only when the task actually calls for that depth. You can hold a library of deep expertise on disk and pay almost nothing for it at idle.',
          },
        ],
      },
      {
        heading: 'Dynamic injection and bundled scripts',
        blocks: [
          {
            type: 'text',
            md: 'Two power features round out the format. The first is **dynamic injection**, which you saw in the pr-summary example: a line containing an exclamation mark followed by a backtick-wrapped shell command executes at the moment the skill fires, and its output gets spliced straight into the prompt. The model wakes up with fresh `git diff --stat` results already in front of it, with no tool-call round trip and no stale data.\n\nThe second is a `scripts/` folder inside the skill. Anything mechanical and repeatable (say, collecting the branch name, ticket ID, and diff into one context blob) should be a small tested script the model runs, because a script gives the same answer every time. Having the model re-derive that logic on each run costs tokens and reintroduces the chance of it doing so slightly differently today than yesterday.',
          },
          {
            type: 'diagram',
            caption: 'The composable architecture: equip the general agent instead of building custom ones.',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="300" fill="#18181b"/><rect x="30" y="50" width="200" height="110" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="130" y="86" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">Skills</text><text x="130" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">expertise</text><text x="130" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">what to do</text><rect x="250" y="50" width="200" height="110" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="350" y="86" fill="#a78bfa" font-size="15" font-weight="bold" text-anchor="middle">MCP</text><text x="350" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">connectivity</text><text x="350" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">what you can reach</text><rect x="470" y="50" width="200" height="110" rx="6" fill="#27272a" stroke="#34d399"/><text x="570" y="86" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">Agent loop + files</text><text x="570" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">runtime</text><text x="570" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">how work happens</text><line x1="130" y1="160" x2="270" y2="212" stroke="#52525b" stroke-width="2"/><line x1="350" y1="160" x2="350" y2="212" stroke="#52525b" stroke-width="2"/><line x1="570" y1="160" x2="430" y2="212" stroke="#52525b" stroke-width="2"/><rect x="150" y="214" width="400" height="56" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="350" y="238" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">The general agent, better equipped</text><text x="350" y="258" fill="#a1a1aa" font-size="11" text-anchor="middle">swap any layer without rebuilding the others</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Barry Zhang, Anthropic',
            md: '"Stop building agents, build skills." The diagram above is what he means. **Skills** carry the expertise (what to do). **MCP** carries connectivity (what you can reach; MCP is the [Model Context Protocol](https://modelcontextprotocol.io), the standard for wiring external tools like Jira or a database into Claude). The **agent loop plus the filesystem** carry the runtime (how work happens). Keep the layers separate and you rarely need a custom agent at all. You need the general agent, handed better equipment.',
          },
        ],
      },
    ],
    lab: {
      title: 'Ship a real skill with a tuned trigger',
      intro: 'Automate a workflow you genuinely repeat, like release notes, PR descriptions, or deploy checklists, and tune it until it fires both explicitly and implicitly.',
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
          'At skill invocation; its stdout is spliced into the prompt before the model starts reasoning',
          'Whenever the model decides to call the Bash tool',
          'At install time, frozen into the skill',
        ],
        answer: 1,
        explain:
          'Injection lines evaluate at the moment the skill fires, so the model begins its reasoning with live output already in the prompt. No tool-call round trip happens, and nothing goes stale between runs.',
      },
      {
        q: 'Why set allowed-tools: Bash(git *), Read on a skill?',
        options: [
          'It preloads those tools to make the skill faster',
          'It scopes what the skill can do while it runs, like a blast-radius contract',
          'It grants tools the session otherwise lacks',
          'It is required or the skill will not parse',
        ],
        answer: 1,
        explain:
          'allowed-tools narrows the skill down to the listed tools for as long as it runs. A skill that summarizes diffs has no business writing files, and the allowlist turns that principle into a mechanical guarantee instead of a hope.',
      },
      {
        q: 'User types /release-notes v2.3. Inside SKILL.md, "v2.3" is available as:',
        options: ['$1 like a shell script', '$ARGUMENTS', '{{args}}', 'the ARGV environment variable'],
        answer: 1,
        explain:
          '$ARGUMENTS carries the full text typed after the skill name, "v2.3" in this case. argument-hint only shapes what the autocomplete shows and never holds the actual value.',
      },
      {
        q: 'In the composable architecture, connecting Claude to your Jira instance is the job of:',
        options: [
          'A skill with Jira API docs pasted into SKILL.md',
          'MCP for the connection; a skill then encodes your team\'s workflow on top of it',
          'A subagent with a Jira personality',
          'A PostToolUse hook calling the Jira webhook',
        ],
        answer: 1,
        explain:
          'MCP provides the pipes: the live connection to Jira and the raw tools for using it. A skill then captures how your team uses those tools well. Keeping connectivity and expertise separate lets you swap or reuse each layer on its own.',
      },
    ],
    resources: [
      { label: 'Claude Code docs: Agent Skills', url: 'https://code.claude.com/docs/en/skills', kind: 'docs' },
      { label: 'Agent Skills open standard', url: 'https://agentskills.io', kind: 'docs' },
      { label: 'Introduction to Agent Skills (free course)', url: 'https://anthropic.skilljar.com/introduction-to-agent-skills', kind: 'course' },
      { label: 'anthropics/skills: official skill library', url: 'https://github.com/anthropics/skills', kind: 'repo' },
      { label: 'Equipping agents for the real world with Agent Skills (Anthropic)', url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', kind: 'article' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l4: Skill Authoring Doctrine
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l4',
    title: 'Skill Authoring Doctrine',
    day: 5,
    minutes: 50,
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
          'The Gotchas section: failure modes the model would not predict',
          'A glossary of project terminology',
          'An examples gallery of past outputs',
        ],
        answer: 1,
        explain:
          'A capable model can already derive a reasonable procedure for most tasks on its own. What it cannot derive is the surprising ways your specific environment fails, and a Gotchas section encodes exactly that missing knowledge.',
      },
      {
        q: '"Don\'t railroad the model" means:',
        options: [
          'Never give the skill more than five steps',
          'Specify goals and constraints instead of rigid scripts, leaving room to adapt',
          'Avoid allowed-tools restrictions',
          'Let the model rewrite the skill whenever it wants',
        ],
        answer: 1,
        explain:
          'Over-scripted skills shatter the first time reality deviates from the script. Stating the goal, the constraints, and the known traps leaves the model free to route around surprises while still landing where you wanted.',
      },
      {
        q: 'CLAUDE_PLUGIN_DATA points to:',
        options: [
          'The plugin\'s source directory, read-only',
          'A persistent per-plugin data directory, the sanctioned home for skill memory (JSON or SQLite)',
          'A temp dir wiped at session end',
          'The marketplace metadata cache',
        ],
        answer: 1,
        explain:
          'CLAUDE_PLUGIN_DATA is an environment variable pointing at a directory that survives both session ends and plugin updates. Skills that need to remember things across runs write JSON files (a structured-text data format) or a SQLite database there. SQLite is a tiny database engine that lives in a single file, with no server required.',
      },
      {
        q: 'Why are skill evals run as BLIND A/B comparisons?',
        options: [
          'To keep eval costs down by halving runs',
          'The judge scores outputs without knowing which one had the skill, which removes bias toward the "improved" version',
          'Because skills cannot be disabled once installed',
          'To test two different models simultaneously',
        ],
        answer: 1,
        explain:
          'A judge that knows which output used the skill tends to grade it kindly, the same way people grade their own work kindly. Hiding the labels before judging is what makes a measured improvement trustworthy.',
      },
      {
        q: '"Don\'t state the obvious" matters in skills because:',
        options: [
          'Long skills fail to parse above 500 lines',
          'The model already knows generic practice; restating it wastes tokens and buries your real signal',
          'Obvious content triggers duplicate-skill warnings',
          'Marketplace rankings penalize long files',
        ],
        answer: 1,
        explain:
          'Lines like "write clean code" and "commit often" tell the model nothing it lacks. Every token of that dilutes the environment-specific knowledge that actually changes behavior, so the doctrine says to include only what a strong new hire would still need to be told.',
      },
    ],
    sections: [
      {
        heading: 'The 9 tips (Thariq, Claude Code team)',
        blocks: [
          {
            type: 'text',
            md: 'Thariq Shihipar of the Claude Code team published nine authoring tips that became the working doctrine for skill writing. The table compresses all nine; the rest of the lesson unpacks the ones that need unpacking.',
          },
          {
            type: 'table',
            headers: ['#', 'Tip', 'Why it works'],
            rows: [
              ['1', 'Don\'t state the obvious', 'The model knows git and clean code; restating dilutes your real signal'],
              ['2', 'Gotchas section = highest value', 'Failure modes are the knowledge the model cannot derive on its own'],
              ['3', 'Use the filesystem + progressive disclosure', 'Depth in bundled files keeps idle cost near zero'],
              ['4', 'Don\'t railroad', 'Goals plus constraints survive reality; rigid scripts break on the first surprise'],
              ['5', 'config.json for setup', 'Capture user and environment choices once instead of re-asking every run'],
              ['6', 'Write the description FOR the model', 'The description is a trigger, so include the exact phrases users say'],
              ['7', 'Persist memory via files/SQLite in CLAUDE_PLUGIN_DATA', 'State that survives sessions and updates'],
              ['8', 'Ship pre-built scripts', 'Deterministic, tested, and cheaper than re-deriving logic every run'],
              ['9', 'On-demand hooks', 'Declare hooks (next lesson) in skill frontmatter; enforcement applies only while the skill runs'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The meta-pattern',
            md: 'All nine tips point the same direction: write a skill as a **briefing for a competent colleague**. Put in the traps of your environment and the formats your team actually uses. Leave out everything a strong senior hire would walk in already knowing, because the model walks in knowing it too.',
          },
        ],
      },
      {
        heading: 'Evals: prove the skill earns its tokens',
        blocks: [
          {
            type: 'text',
            md: 'An **eval** (short for evaluation) is a repeatable test for AI behavior, playing the same role a unit test plays for code. Skills need them because skills regress silently: you tweak one sentence in the description, and two weeks later you notice the skill has quietly stopped firing.\n\nThe `skill-creator` plugin, found in the official [anthropics/skills](https://github.com/anthropics/skills) repo, gives skills a test harness. You define representative tasks with pass criteria in an evals.json file, and the harness runs each task twice: once with your skill installed, once without. A judge model then scores the two outputs blind, meaning it has no idea which output had the skill\'s help. If the skill version wins consistently, you have real evidence it earns its place. If the two versions tie, the skill is costing tokens without buying anything, so fix the description or cut it.',
          },
          {
            type: 'diagram',
            caption: 'The blind A/B loop. The judge never learns which output the skill produced, so the verdict stays honest.',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="360" fill="#18181b"/><rect x="270" y="20" width="160" height="48" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="350" y="40" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Eval task</text><text x="350" y="58" fill="#a1a1aa" font-size="11" text-anchor="middle">from evals.json</text><line x1="310" y1="68" x2="190" y2="106" stroke="#52525b" stroke-width="2"/><line x1="390" y1="68" x2="510" y2="106" stroke="#52525b" stroke-width="2"/><rect x="80" y="110" width="220" height="48" rx="6" fill="#27272a" stroke="#34d399"/><text x="190" y="130" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Run WITH the skill</text><text x="190" y="148" fill="#a1a1aa" font-size="11" text-anchor="middle">same task, same model</text><rect x="400" y="110" width="220" height="48" rx="6" fill="#27272a" stroke="#f472b6"/><text x="510" y="130" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Run WITHOUT the skill</text><text x="510" y="148" fill="#a1a1aa" font-size="11" text-anchor="middle">the baseline</text><line x1="190" y1="158" x2="310" y2="200" stroke="#52525b" stroke-width="2"/><line x1="510" y1="158" x2="390" y2="200" stroke="#52525b" stroke-width="2"/><rect x="250" y="202" width="200" height="48" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="350" y="222" fill="#a78bfa" font-size="13" font-weight="bold" text-anchor="middle">Outputs anonymized</text><text x="350" y="240" fill="#a1a1aa" font-size="11" text-anchor="middle">labels stripped</text><line x1="350" y1="250" x2="350" y2="284" stroke="#52525b" stroke-width="2"/><polygon points="344,282 356,282 350,294" fill="#52525b"/><rect x="230" y="296" width="240" height="48" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="350" y="316" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Judge scores blind</text><text x="350" y="334" fill="#a1a1aa" font-size="11" text-anchor="middle">against the pass criteria</text></svg>`,
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "evals": [\n    {\n      "name": "pr-from-feature-branch",\n      "input": "Write a PR description for this branch",\n      "criteria": [\n        "includes risk section",\n        "references changed modules by name",\n        "under 300 words"\n      ]\n    }\n  ]\n}',
            caption: 'evals.json: real tasks with binary pass criteria a judge can score consistently.',
          },
        ],
      },
      {
        heading: 'Ecosystem tour: stand on shipped work',
        blocks: [
          {
            type: 'text',
            md: 'Before authoring more of your own, spend an hour reading skills that already won an audience. Each repo below demonstrates a technique worth borrowing.',
          },
          {
            type: 'table',
            headers: ['Skill / repo', 'What it proves'],
            rows: [
              ['anthropics/skills', 'Official library + skill-creator; canonical authoring patterns'],
              ['emilkowalski/skills (12.8k stars)', 'Design/animation taste as installable expertise (/apple-design)'],
              ['Ponytail (DietrichGebert/ponytail)', 'Anti-over-engineering review: ~54% less code, ~20% cheaper, ~27% faster'],
              ['planning-with-files (othmanadi)', 'task_plan.md / findings.md / progress.md as anti-drift for long tasks'],
              ['LLM Council (aiwithremy)', '5 adversarial advisors + blind peer review + chairman synthesis'],
            ],
          },
          {
            type: 'text',
            md: 'Installation takes one command, `npx skills add emilkowalski/skills`, or you can clone a repo straight into `.claude/skills/`. Pay special attention to how Ponytail earns its numbers (roughly 54% less code on the same tasks): the entire skill is a tight, Gotchas-style rule set about over-engineering. No clever prompt tricks appear anywhere in it, which is exactly the doctrine working as advertised.',
          },
        ],
      },
      {
        heading: 'Security: skills are code you run',
        blocks: [
          {
            type: 'text',
            md: 'One more thing before you go shopping in that ecosystem.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Audit before you install',
            md: 'A third-party skill can bundle executable scripts, and its instructions can tell the model to make network calls. That combination is an exfiltration risk: a malicious skill could quietly send your code or your environment variables (which often hold API keys) to an attacker\'s server. Before installing, read the SKILL.md **and every file in scripts/**. Look for curl or fetch calls to hosts you don\'t recognize, anything that reads environment variables and sends them onward, and instructions like "post the diff to this endpoint". Prefer starred repos with visible source. The right mental model: a skill is a dependency with install-time scripts, and it deserves the same suspicion you\'d give one.',
          },
        ],
      },
    ],
    lab: {
      title: 'Harden yesterday\'s skill',
      intro: 'Apply the doctrine to the skill you built in [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3): cut the obvious, add gotchas, bundle a script, and prove the lift with an eval.',
      steps: [
        'Open your skill\'s SKILL.md. Delete every line a competent senior hire would already know (tip 1).',
        'Add a Gotchas section with 2-3 real failure modes you have personally hit in this workflow (tip 2).',
        'Write a small deterministic script (e.g. scripts/collect-context.sh gathering diff, branch, ticket ID) and reference it from the body (tip 8).',
        'Install skill-creator from anthropics/skills, then create evals.json with 3 representative tasks and binary criteria.',
        'Run the blind A/B eval. If the skill does not win, rewrite the description or gotchas and re-run.',
        'Pick one ecosystem skill (emilkowalski/skills or Ponytail), audit its scripts/ for network calls, then install it.',
      ],
      checklist: [
        'Gotchas section documents real failure modes, and none of them are generic advice',
        'Bundled script runs standalone and the skill calls it instead of re-deriving logic',
        'evals.json exists with 3 cases and binary criteria',
        'Blind A/B shows the skill beating the no-skill baseline',
        'One audited third-party skill installed, and you can say what its scripts touch',
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
          'Tip 5: choices made once at setup belong in a config.json the skill reads on every run afterward. Putting the answers in CLAUDE.md taxes every session in the project whether it deploys or not, and splitting the skill in two doubles your maintenance for zero gain.',
      },
      {
        q: 'Why ship a pre-built script instead of letting the model write the same logic each run?',
        options: [
          'Models cannot execute code they generate',
          'A script is deterministic, tested, and cheaper; regenerating the logic burns tokens and reintroduces variance every run',
          'Scripts bypass the permission system',
          'SKILL.md bodies cannot contain code blocks',
        ],
        answer: 1,
        explain:
          'Tip 8: anything mechanical should become a tested artifact the model invokes. You pay for correctness once, when you write and test the script, instead of paying per run and hoping the freshly generated version behaves the same as yesterday\'s.',
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
          'Those measured results (about 54% less code, roughly 20% cheaper, about 27% faster) are the whole point: a well-aimed rule set materially changes what an agent produces. Numbers like these also show why running evals on skills matters, since they only exist because someone measured.',
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
          'Executable scripts and "send X to this URL" instructions are the vectors a hostile skill would use to exfiltrate your code or secrets. Typos and length are cosmetic by comparison.',
      },
    ],
    resources: [
      { label: 'Thariq (Claude Code team): 9 skill-authoring tips', url: 'https://x.com/trq212', kind: 'thread' },
      { label: 'anthropics/skills: includes the skill-creator plugin', url: 'https://github.com/anthropics/skills', kind: 'repo' },
      { label: 'emilkowalski/skills: design & animation skills', url: 'https://github.com/emilkowalski/skills', kind: 'repo' },
      { label: 'Ponytail: anti-over-engineering skill', url: 'https://github.com/DietrichGebert/ponytail', kind: 'repo' },
      { label: 'planning-with-files: anti-drift planning skill', url: 'https://github.com/othmanadi/planning-with-files', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m1-l5: Hooks: Deterministic Control
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm1-l5',
    title: 'Hooks: Deterministic Control',
    day: 6,
    minutes: 55,
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
          'Exit code 2 is the blocking contract for command hooks. The action stops, and whatever the hook printed to stderr gets handed to Claude as feedback, so the model understands why it was blocked and can choose a different approach instead of failing blind.',
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
          'The handler types climb a ladder of sophistication: running a local shell command, calling an HTTP endpoint, invoking an MCP tool, asking a one-shot prompt, or dispatching a full subagent to evaluate the event. You pick the rung that matches how much judgment the check needs.',
      },
      {
        q: 'PreCompact fires:',
        options: [
          'After compaction, with the summarized context',
          'Just before context compaction, giving you a chance to persist state to files first',
          'When context hits 50% capacity',
          'Only when you run /compact manually',
        ],
        answer: 1,
        explain:
          'PreCompact is the save-your-work moment. Compaction squashes older conversation turns into a summary, and details can get lost in the squash, so this hook lets you write progress notes to disk while the full history still exists.',
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
          'The three legal values are allow, deny, and ask. Allow lets the action run, deny blocks it with a reason fed back to Claude, and ask hands the decision to the human. JSON output gives you this nuance; plain exit codes only cover the allow and block cases.',
      },
      {
        q: 'Declaring hooks in a skill or agent\'s frontmatter means:',
        options: [
          'The hooks install globally on first run',
          'The hooks are active only while that skill or agent is running, as scoped enforcement',
          'The hooks replace settings.json hooks entirely',
          'The hooks run without permission checks',
        ],
        answer: 1,
        explain:
          'Hooks declared in a skill or agent\'s frontmatter switch on when that skill or agent starts and switch off when it finishes. Your deploy skill can enforce deploy-specific checks without those checks taxing every unrelated session.',
      },
    ],
    sections: [
      {
        heading: 'Advisory vs enforcement',
        blocks: [
          {
            type: 'text',
            md: 'A [hook](https://code.claude.com/docs/en/hooks) is a piece of code you register to run automatically at specific moments in Claude Code\'s lifecycle, such as right before a tool call executes or right after a file gets written. The name comes from the general programming pattern of "hooking into" an event. Hooks matter because they behave differently from everything you\'ve configured so far this week: CLAUDE.md asks, while a hook acts.',
          },
          {
            type: 'compare',
            left: {
              title: 'CLAUDE.md (advisory)',
              items: [
                'Arrives as a user message, so it works by persuasion',
                'Probabilistic: followed most of the time',
                'Right for style, conventions, and background context',
                '"Please run the formatter after edits"',
              ],
            },
            right: {
              title: 'Hooks (enforcement)',
              items: [
                'Code that runs at lifecycle events, every time, guaranteed',
                'Can block an action, rewrite it, or gate completion',
                'Right for invariants: safety rules, quality gates, compliance',
                'The formatter actually RUNS after every edit, with no opinion involved',
              ],
            },
          },
          {
            type: 'text',
            md: 'The dividing rule: anything that must happen **every single time** belongs in a hook. You already apply this instinct elsewhere in engineering. A team that wants consistent formatting puts a linter in CI (continuous integration, the automated checks that run on every commit) rather than asking nicely during code review. Hooks move your agent invariants from persuasion to mechanism in exactly the same way.',
          },
        ],
      },
      {
        heading: 'The event catalog (highlights of ~30)',
        blocks: [
          {
            type: 'text',
            md: 'Hooks attach to named **events**: moments in the session lifecycle where Claude Code pauses and gives your code a chance to run. Around 30 events exist. The diagram shows where the big ones sit in a session, and the table adds the classic use for each.',
          },
          {
            type: 'diagram',
            caption: 'Where the major hook events fire during a session. The PreToolUse / PostToolUse pair repeats for every tool call.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b"/><rect x="20" y="50" width="125" height="60" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="82" y="76" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">SessionStart</text><text x="82" y="94" fill="#a1a1aa" font-size="10" text-anchor="middle">session begins</text><rect x="155" y="50" width="125" height="60" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="217" y="76" fill="#a78bfa" font-size="11" font-weight="bold" text-anchor="middle">UserPromptSubmit</text><text x="217" y="94" fill="#a1a1aa" font-size="10" text-anchor="middle">you hit enter</text><rect x="290" y="50" width="125" height="60" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="352" y="76" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">PreToolUse</text><text x="352" y="94" fill="#a1a1aa" font-size="10" text-anchor="middle">before a tool runs</text><rect x="425" y="50" width="125" height="60" rx="6" fill="#27272a" stroke="#e4e4e7"/><text x="487" y="76" fill="#e4e4e7" font-size="11" font-weight="bold" text-anchor="middle">Tool executes</text><text x="487" y="94" fill="#a1a1aa" font-size="10" text-anchor="middle">edit, bash, etc.</text><rect x="560" y="50" width="125" height="60" rx="6" fill="#27272a" stroke="#34d399"/><text x="622" y="76" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">PostToolUse</text><text x="622" y="94" fill="#a1a1aa" font-size="10" text-anchor="middle">after it ran</text><line x1="145" y1="80" x2="153" y2="80" stroke="#52525b" stroke-width="2"/><line x1="280" y1="80" x2="288" y2="80" stroke="#52525b" stroke-width="2"/><line x1="415" y1="80" x2="423" y2="80" stroke="#52525b" stroke-width="2"/><line x1="550" y1="80" x2="558" y2="80" stroke="#52525b" stroke-width="2"/><path d="M 622 110 L 622 140 L 352 140 L 352 114" fill="none" stroke="#52525b" stroke-width="2"/><text x="487" y="134" fill="#a1a1aa" font-size="10" text-anchor="middle">repeats per tool call</text><rect x="230" y="200" width="240" height="60" rx="6" fill="#27272a" stroke="#f472b6"/><text x="350" y="226" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">Stop: Claude believes it is done</text><text x="350" y="244" fill="#a1a1aa" font-size="10" text-anchor="middle">exit 2 here means keep working</text><rect x="20" y="200" width="180" height="60" rx="6" fill="#27272a" stroke="#52525b"/><text x="110" y="226" fill="#e4e4e7" font-size="12" font-weight="bold" text-anchor="middle">PreCompact</text><text x="110" y="244" fill="#a1a1aa" font-size="10" text-anchor="middle">before context is squashed</text><text x="350" y="310" fill="#a1a1aa" font-size="12" text-anchor="middle">Every event is a place where your code can step in.</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Event', 'Fires when', 'Classic use'],
            rows: [
              ['SessionStart', 'A session begins', 'Inject env status, branch, open tickets'],
              ['UserPromptSubmit', 'You send a prompt, before the model sees it', 'Append context, validate, block secrets'],
              ['PreToolUse', 'Before any tool call executes', 'Guard rails: block or rewrite dangerous commands'],
              ['PostToolUse', 'After a tool call completes', 'Format-on-write, lint, auto-test'],
              ['Stop', 'Claude believes it is done', 'Verification gate: tests must pass or Claude keeps working'],
              ['PreCompact', 'Before context compaction', 'Persist progress notes to files'],
              ['TeammateIdle', 'An agent-team member goes idle', 'Assign the next task from the queue'],
            ],
          },
        ],
      },
      {
        heading: 'Five handler types',
        blocks: [
          {
            type: 'text',
            md: 'When an event fires, the hook needs something to actually run. Five handler types cover the range, from a shell one-liner up to a full model-driven review.',
          },
          {
            type: 'table',
            headers: ['Handler', 'What runs', 'Reach for it when'],
            rows: [
              ['command', 'A shell command or script', 'The default: fast, local, exit-code contract'],
              ['http', 'A POST to an endpoint', 'A central policy service shared across a team'],
              ['mcp_tool', 'An MCP tool call', 'Reusing existing connector logic as the check'],
              ['prompt', 'A one-shot model evaluation', 'Judgment calls: "is this change risky?"'],
              ['agent', 'A full subagent', 'Deep verification: run the suite, inspect the diff, decide'],
            ],
          },
          {
            type: 'text',
            md: 'Notice the gradient as you read down the table. A command hook is fully deterministic: same input, same verdict, every time. By the time you reach the prompt and agent handlers, you\'ve placed **a model inside your control plane**, which buys you probabilistic checks for questions a regex could never answer, like "does this diff look risky?". Auto permission mode from [Claude Code Mastery · Claude Code Fundamentals & the .claude Folder](lesson:m1-l1) is exactly this pattern, shipped as a product feature.',
          },
        ],
      },
      {
        heading: 'Control flow: block, rewrite, or escalate',
        blocks: [
          {
            type: 'text',
            md: 'A hook has two ways to deliver its verdict. The simple way is exit codes: exit 0 means "carry on", and exit 2 means "blocked", with whatever the hook printed to stderr handed to Claude as the explanation. The expressive way is printing JSON to stdout (JSON is JavaScript Object Notation, the standard structured-text format), which adds two extra moves: escalating the decision to the human, and rewriting the tool input before it runs.',
          },
          {
            type: 'diagram',
            caption: 'The PreToolUse decision flow. Exit codes cover the simple cases; JSON output covers the nuanced ones.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b"/><rect x="240" y="24" width="220" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/><text x="262" y="46" fill="#38bdf8" font-size="13" font-weight="bold">Claude proposes tool call</text><text x="262" y="64" fill="#a1a1aa" font-size="11">e.g. Bash: rm -rf build/</text><line x1="350" y1="76" x2="350" y2="112" stroke="#52525b" stroke-width="2"/><polygon points="344,110 356,110 350,122" fill="#52525b"/><rect x="250" y="124" width="200" height="48" rx="6" fill="#27272a" stroke="#fbbf24"/><text x="286" y="153" fill="#fbbf24" font-size="13" font-weight="bold">PreToolUse hook</text><line x1="290" y1="172" x2="130" y2="220" stroke="#52525b" stroke-width="2"/><line x1="350" y1="172" x2="350" y2="220" stroke="#52525b" stroke-width="2"/><line x1="410" y1="172" x2="570" y2="220" stroke="#52525b" stroke-width="2"/><rect x="30" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#34d399"/><text x="46" y="248" fill="#34d399" font-size="13" font-weight="bold">exit 0 / JSON allow</text><text x="46" y="268" fill="#a1a1aa" font-size="11">tool runs, optionally with</text><text x="46" y="284" fill="#a1a1aa" font-size="11">updatedInput rewriting args</text><rect x="250" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#f472b6"/><text x="266" y="248" fill="#f472b6" font-size="13" font-weight="bold">exit 2 / JSON deny</text><text x="266" y="268" fill="#a1a1aa" font-size="11">blocked; stderr / reason fed</text><text x="266" y="284" fill="#a1a1aa" font-size="11">to Claude, which adapts</text><rect x="470" y="224" width="200" height="72" rx="6" fill="#27272a" stroke="#a78bfa"/><text x="486" y="248" fill="#a78bfa" font-size="13" font-weight="bold">JSON ask</text><text x="486" y="268" fill="#a1a1aa" font-size="11">escalates to the human</text><text x="486" y="284" fill="#a1a1aa" font-size="11">with the hook's reason</text><text x="30" y="352" fill="#a1a1aa" font-size="12">Same pattern on Stop: exit 2 means "keep working", so Claude continues until your check passes.</text></svg>`,
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "hooks": [\n          { "type": "command", "command": ".claude/hooks/guard.sh" }\n        ]\n      }\n    ],\n    "Stop": [\n      {\n        "hooks": [\n          { "type": "command", "command": "npm test --silent" }\n        ]\n      }\n    ]\n  }\n}',
            caption: '.claude/settings.json registering a Bash guard plus a Stop-hook verification gate.',
          },
          {
            type: 'text',
            md: 'Read that settings file top to bottom. The `matcher` field says which tool the hook watches ("Bash" here, so shell commands). Whenever Claude proposes a shell command, guard.sh runs first and receives the proposed command as JSON on stdin. The Stop entry has no matcher because it watches the session itself: when Claude believes it has finished, `npm test` runs, and a failing suite blocks the "done" and sends Claude back to work.\n\nThe JSON below is what a guard script can print instead of relying on exit codes. This one denies the command, explains why in a way Claude can act on, and even offers a rewritten command.',
          },
          {
            type: 'code',
            lang: 'json',
            code: '{\n  "permissionDecision": "deny",\n  "permissionDecisionReason": "rm is banned here; use trash(1) so deletes are recoverable",\n  "updatedInput": { "command": "trash build/" }\n}',
            caption: 'JSON output from a PreToolUse hook: deny with a reason, or rewrite the input and allow it.',
          },
        ],
      },
      {
        heading: 'Three recipes that pay rent',
        blocks: [
          {
            type: 'text',
            md: '**Format-on-write.** A PostToolUse hook matching Edit|Write runs prettier or ruff on every file Claude touches. Formatting stops being a conversation topic at all, because the machine handles it after each edit without anyone asking.\n\n**Destructive-command guard.** A PreToolUse hook on Bash denies rm -rf, force pushes to main, and DROP TABLE, each with a reason Claude can read and act on. You saw the guard.sh version above; teams often grow this into a small policy script.\n\n**Stop-gate.** A Stop hook runs the test suite and exits 2 while anything fails. This one changes day-to-day behavior the most: "claims to be done but the tests fail" becomes "keeps working until the tests pass". Boris Cherny describes verification as the 2-3x quality lever for agent work, and this hook is that lever in mechanical form.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Where hooks live',
            md: 'Pick the home by scope:\n\n- One-session experiment: the /hooks menu\n- Team invariant: `.claude/settings.json`, committed to the repo\n- Personal guard on every project: `~/.claude/settings.json` in your home directory\n- Scoped to one workflow: hooks declared in a skill or agent\'s frontmatter, active only while it runs',
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
        'Run /hooks to confirm both are registered, then restart the session and verify they persist (they live in settings.json, so they should).',
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
          'updatedInput rewrites the tool input before it executes, so the deletion happens through trash(1) and stays recoverable, with nobody interrupted. Exit 2 can only block. A CLAUDE.md rule is advisory and will eventually get missed, and a PostToolUse hook fires after the files are already gone.',
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
          'Stop is the "am I actually done?" checkpoint. Exit 2 with the failures on stderr sends Claude back to work holding the exact errors, and the loop repeats until the suite is green. A CLAUDE.md sentence expresses the same wish with zero enforcement behind it.',
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
          'Formatting operates on the result of a write, so the hook has to fire after the tool completes. At PreToolUse time the file on disk hasn\'t changed yet, so a formatter would be working on stale content.',
      },
      {
        q: 'Best event to automatically prepend the current git branch and open ticket to every request?',
        options: [
          'SessionStart, since once is enough',
          'UserPromptSubmit, which can inject context into each prompt before the model sees it',
          'PreToolUse on Bash',
          'TeammateIdle',
        ],
        answer: 1,
        explain:
          'UserPromptSubmit fires on every prompt you send, before the model sees it, and its output can be injected as context. That keeps the branch and ticket info current all session long. SessionStart runs once, so its snapshot goes stale as the session ages.',
      },
    ],
    resources: [
      { label: 'Claude Code docs: hooks reference', url: 'https://code.claude.com/docs/en/hooks', kind: 'docs' },
      { label: 'Claude Code docs: hooks guide', url: 'https://code.claude.com/docs/en/hooks-guide', kind: 'docs' },
      { label: 'everything-claude-code: community hooks catalog', url: 'https://github.com/affaanmustafa/everything-claude-code', kind: 'repo' },
      { label: 'Claude Code best practices (verification escalation ladder)', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', kind: 'article' },
    ],
  },
]
