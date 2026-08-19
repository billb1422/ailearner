import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ── m2-l1 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l1',
    title: 'What Is a Harness?',
    day: 9,
    minutes: 45,
    xp: 100,
    objectives: [
      'Explain "agent = model + harness" and defend why the harness dominates outcomes, citing the Life-Harness numbers',
      'Enumerate the 15 harness jobs and map each to a concrete component in a real product',
      'Identify the middleware interception points where context delivery is controlled',
      'Audit Claude Code as a harness and spot the jobs it performs invisibly',
    ],
    skipQuiz: [
      {
        q: 'The Life-Harness paper (arxiv 2605.22166) reported 116 of 126 agent setups improving. What was the intervention?',
        options: [
          'Fine-tuning each backbone model on agent trajectories',
          'Patching the harness alone, with zero change to the model',
          'Switching every setup to a larger frontier model',
          'Adding chain-of-thought instructions to the system prompt',
        ],
        answer: 1,
        explain:
          'That is the whole point of the paper: harness patches alone lifted 116/126 setups. The scaffolding, not the weights, was the bottleneck.',
      },
      {
        q: 'The same Sonnet 4.5 scored 31% on GAIA in one setup and 75% in another. What was different?',
        options: [
          'Sampling temperature and top-p settings',
          'A newer model checkpoint in the second run',
          'The scaffolding around the model - the harness',
          'An easier subset of the benchmark',
        ],
        answer: 2,
        explain:
          'Identical model, wildly different score. Everything in the 44-point swing lives in the harness: context delivery, tools, verification, termination.',
      },
      {
        q: "Sydney Runkle's compression of the discipline: harness design is fundamentally ___ design.",
        options: ['prompt template', 'reward function', 'user interface', 'context delivery'],
        answer: 3,
        explain:
          'Runkle (LangChain): the harness exists to control exactly what the model sees on each call. Every other job serves that one.',
      },
      {
        q: "In mfpiccolo's taxonomy, a harness is best understood as:",
        options: [
          'A framework you install, like LangChain or CrewAI',
          'Fifteen jobs that something is doing whether you chose it or not',
          'The system prompt plus the tool definitions',
          'A retry wrapper around the model API',
        ],
        answer: 1,
        explain:
          '"Which harness should I install?" is the wrong question. Fifteen jobs are always being done - the only question is by what, and how deliberately.',
      },
      {
        q: 'Which of these is one of the fifteen harness jobs?',
        options: [
          'Gradient checkpointing',
          'Tokenizer vocabulary selection',
          'Compaction of long sessions',
          'RLHF preference tuning',
        ],
        answer: 2,
        explain:
          'Compaction - deciding what survives when context fills - is a harness job. The other three are model-training concerns, invisible to the harness.',
      },
    ],
    sections: [
      {
        heading: 'The OS for the LLM',
        blocks: [
          {
            type: 'text',
            md: "Strip away the branding and every agent product is two things: a model and a harness. AVB's framing sticks: **the harness is the operating system for the LLM**. The model is a stateless function that forgets everything between calls. The harness supplies what an OS supplies a process - memory, I/O, scheduling, permissions, and a reason to stop.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Sydney Runkle, LangChain',
            md: 'An agent is a model plus a harness - and harness design is **context delivery design**. Every middleware hook, before and after each model call and each tool call, is a chance to control exactly what the model sees next.',
          },
          {
            type: 'text',
            md: 'Those four interception points are where the real engineering lives: **before the model call** (assemble the prompt), **after it** (parse and route tool calls), **before the tool** (policy, approvals, argument rewriting), **after the tool** (truncate, summarize, inject steering text). Middleware hooks at these seams are the harness API.',
          },
        ],
      },
      {
        heading: 'Fifteen jobs, not a thing you install',
        blocks: [
          {
            type: 'text',
            md: 'mfpiccolo\'s "How to Build Your Own Agent Harness" (iii.dev) reframes the question. A harness is not a package - it is **fifteen jobs**, and every one is being done in your stack right now, deliberately or by accident:',
          },
          {
            type: 'table',
            headers: ['Job', 'What it covers'],
            rows: [
              ['Turn persistence', 'Every turn durably stored; sessions survive crashes and resume'],
              ['Credentials', 'API keys and OAuth held by the harness, never pasted into context'],
              ['Model catalog', 'Which models exist, aliases, fallbacks, per-task routing'],
              ['Per-turn state machine', 'Tracks a turn through assembling, streaming, tool-executing, done'],
              ['Skill serving', 'Loads the right instructions at the right moment, progressively'],
              ['Prompt assembly', 'Builds what the model actually sees each call - the core job'],
              ['Streaming', 'Delivers partial output live; handles interruption cleanly'],
              ['Tool policy', 'Which tools are exposed, to whom, with which arguments allowed'],
              ['Approvals', 'Human gates on risky actions: writes, sends, spends'],
              ['Spend tracking', 'Token and dollar meters per session, user, and day'],
              ['Hooks', 'User-defined interception before/after model and tool calls'],
              ['Session branching', 'Fork a conversation to explore without polluting the original'],
              ['Compaction', 'Summarize old turns when context fills; decide what survives'],
              ['Event streams', 'Structured events other systems can subscribe to'],
              ['OTEL traces', 'Standard observability: a span for every model and tool call'],
            ],
          },
        ],
      },
      {
        heading: 'The evidence: patch the harness, lift the score',
        blocks: [
          {
            type: 'text',
            md: 'The Life-Harness paper ([arxiv 2605.22166](https://arxiv.org/abs/2605.22166)) tested this at scale: across 126 agent setups on 18 backbone models, **116 improved from harness patches alone** - no weight changes, no model swaps - with a **mean lift of 88.5%**. The sharpest single datapoint: the same Sonnet 4.5 swings **31% to 75% on GAIA** purely from scaffolding.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Where the leverage lives',
            md: 'If a benchmark score can more than double without touching the model, your effort allocation should follow. Most teams still spend their tuning time on prompts and model choice - the two smallest levers.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" rx="8" fill="#18181b"/>
  <rect x="15" y="15" width="670" height="370" rx="10" fill="none" stroke="#52525b" stroke-dasharray="6 4"/>
  <text x="350" y="40" text-anchor="middle" fill="#e4e4e7" font-size="15" font-weight="bold">THE HARNESS</text>
  <text x="350" y="57" text-anchor="middle" fill="#a1a1aa" font-size="11">fifteen jobs wrapped around one stateless model</text>
  <rect x="35" y="70" width="150" height="34" rx="6" fill="#27272a" stroke="#fbbf24"/>
  <text x="110" y="91" text-anchor="middle" fill="#e4e4e7" font-size="11">Credentials</text>
  <rect x="200" y="70" width="150" height="34" rx="6" fill="#27272a" stroke="#fbbf24"/>
  <text x="275" y="91" text-anchor="middle" fill="#e4e4e7" font-size="11">Model catalog</text>
  <rect x="365" y="70" width="150" height="34" rx="6" fill="#27272a" stroke="#fbbf24"/>
  <text x="440" y="91" text-anchor="middle" fill="#e4e4e7" font-size="11">Spend tracking</text>
  <rect x="530" y="70" width="150" height="34" rx="6" fill="#27272a" stroke="#fbbf24"/>
  <text x="605" y="91" text-anchor="middle" fill="#e4e4e7" font-size="11">OTEL traces</text>
  <rect x="35" y="118" width="150" height="34" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="110" y="139" text-anchor="middle" fill="#e4e4e7" font-size="11">Prompt assembly</text>
  <rect x="200" y="118" width="150" height="34" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="275" y="139" text-anchor="middle" fill="#e4e4e7" font-size="11">Skill serving</text>
  <rect x="365" y="118" width="150" height="34" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="440" y="139" text-anchor="middle" fill="#e4e4e7" font-size="11">Compaction</text>
  <rect x="530" y="118" width="150" height="34" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="605" y="139" text-anchor="middle" fill="#e4e4e7" font-size="11">Session branching</text>
  <line x1="350" y1="152" x2="350" y2="180" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="346,178 354,178 350,186" fill="#71717a"/>
  <rect x="270" y="186" width="160" height="54" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="350" y="209" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">MODEL</text>
  <text x="350" y="226" text-anchor="middle" fill="#a1a1aa" font-size="10">stateless - forgets everything</text>
  <line x1="350" y1="240" x2="350" y2="266" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="346,264 354,264 350,272" fill="#71717a"/>
  <rect x="35" y="272" width="150" height="34" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="110" y="293" text-anchor="middle" fill="#e4e4e7" font-size="11">Tool policy</text>
  <rect x="200" y="272" width="150" height="34" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="275" y="293" text-anchor="middle" fill="#e4e4e7" font-size="11">Approvals</text>
  <rect x="365" y="272" width="150" height="34" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="440" y="293" text-anchor="middle" fill="#e4e4e7" font-size="11">Hooks</text>
  <rect x="530" y="272" width="150" height="34" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="605" y="293" text-anchor="middle" fill="#e4e4e7" font-size="11">Streaming</text>
  <rect x="45" y="320" width="190" height="34" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="140" y="341" text-anchor="middle" fill="#e4e4e7" font-size="11">Turn persistence</text>
  <rect x="255" y="320" width="190" height="34" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="350" y="341" text-anchor="middle" fill="#e4e4e7" font-size="11">Per-turn state machine</text>
  <rect x="465" y="320" width="190" height="34" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="560" y="341" text-anchor="middle" fill="#e4e4e7" font-size="11">Event streams</text>
  <text x="350" y="376" text-anchor="middle" fill="#a1a1aa" font-size="10">gold = governance | purple = context | green = action | pink = state</text>
</svg>`,
            caption:
              'Patch anything in the outer layers and benchmark scores move - no model change required. Life-Harness: 116/126 setups improved, 88.5% mean lift.',
          },
        ],
      },
      {
        heading: 'You already run one',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code is a harness - one you have been operating for a week. **CLAUDE.md and skills** feed prompt assembly. **Permission rules** are tool policy and approvals. **/cost** is spend tracking, **/branch** is session branching, **auto-compaction** handles context overflow, **hooks** are the middleware seams, and session files under `~/.claude/projects` are turn persistence and event streams. The lab makes this mapping explicit.',
          },
        ],
      },
    ],
    lab: {
      title: 'Audit Claude Code against the 15 harness jobs',
      intro:
        'The fastest way to internalize the taxonomy is to hold it against a harness you already run daily. Every job should map to a nameable Claude Code component - or an explicit gap.',
      steps: [
        'Copy the 15-job table from this lesson into a file called harness-audit.md in any working repo.',
        'Open Claude Code and work the list job by job: for each, name the concrete feature that performs it (e.g. turn persistence maps to session files under ~/.claude/projects).',
        'Verify three mappings empirically: run /hooks, /mcp, and /cost and confirm they cover hooks, tool policy, and spend tracking respectively.',
        'Inspect one session file on disk to confirm turn persistence and see the event-stream format with your own eyes.',
        'Mark any job you cannot map to a visible feature - that is either a real gap or something Claude Code does invisibly (prompt assembly, compaction).',
        'Finish harness-audit.md with one sentence per job: the component name plus the evidence you saw.',
      ],
      checklist: [
        "All 15 jobs have a named Claude Code component or an explicit 'invisible / gap' verdict",
        'At least 3 mappings verified with a real command or file inspection',
        'You can state "agent = model + harness" and back it with the Life-Harness numbers, without notes',
        "You identified at least one job you'd want to customize (a hook, a policy rule, or a spend guard)",
      ],
    },
    checkQuiz: [
      {
        q: "AVB's analogy: the harness is to the LLM what ___ is to a process.",
        options: ['a compiler', 'a debugger', 'an operating system', 'a package manager'],
        answer: 2,
        explain:
          'The OS analogy: the model is a stateless function; the harness provides memory, I/O, scheduling, permissions, and termination - everything a process needs to live.',
      },
      {
        q: 'Runkle-style middleware exposes hooks at which points?',
        options: [
          'Only before each model call',
          'Before and after model calls and tool calls',
          'Only when a tool errors',
          'At session start and session end only',
        ],
        answer: 1,
        explain:
          'Four seams: before/after the model call and before/after each tool call. Each is an interception point for shaping exactly what the model sees next.',
      },
      {
        q: 'Mean lift across the 18 backbone models from harness patches, per the Life-Harness paper:',
        options: ['8.5%', '28%', '44%', '88.5%'],
        answer: 3,
        explain:
          '88.5% mean improvement, from harness changes alone. The 44-point figure is the separate GAIA swing (31 to 75) for one Sonnet 4.5 setup.',
      },
      {
        q: "Which Claude Code feature performs the 'tool policy' harness job?",
        options: [
          'CLAUDE.md memory hierarchy',
          'Permission rules and allowlists in settings.json',
          'The /compact command',
          'Session files under ~/.claude/projects',
        ],
        answer: 1,
        explain:
          'Permission rules decide which tools run, with which arguments, and when a human gate fires. CLAUDE.md is prompt assembly; /compact is compaction; session files are persistence.',
      },
    ],
    resources: [
      {
        label: 'Life-Harness paper (arxiv 2605.22166)',
        url: 'https://arxiv.org/abs/2605.22166',
        kind: 'article',
      },
      {
        label: 'mfpiccolo - How to Build Your Own Agent Harness (iii.dev)',
        url: 'https://iii.dev/blog/how-to-build-your-own-agent-harness',
        kind: 'article',
      },
      {
        label: 'iii-hq/workers - reference harness implementation',
        url: 'https://github.com/iii-hq/workers',
        kind: 'repo',
      },
      {
        label: 'Anthropic - Building Effective Agents',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'Claude Code docs (the harness you already run)',
        url: 'https://code.claude.com/docs',
        kind: 'docs',
      },
    ],
  },

  // ── m2-l2 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l2',
    title: 'Anatomy of the Agent Loop',
    day: 9,
    minutes: 40,
    xp: 100,
    objectives: [
      'Draw the agent loop from memory, including explicit termination',
      'Convert a raw API surface into workflow-shaped tools with token-efficient outputs',
      'Write tool descriptions that function as onboarding docs',
      'Run evaluation-driven iteration on a tool definition using real transcripts',
    ],
    skipQuiz: [
      {
        q: 'The four beats of the agent loop, in order:',
        options: [
          'Plan, execute, summarize, exit',
          'Gather context, take action, verify, repeat',
          'Prompt, generate, rank, select',
          'Retrieve, rerank, generate, cite',
        ],
        answer: 1,
        explain:
          'Gather context, take action, verify, repeat. The last option is a RAG pipeline; the loop is more general - and it must also carry an explicit termination condition.',
      },
      {
        q: 'Beyond the four beats, what must a loop define before it is safe to launch?',
        options: [
          'A fallback model for rate limits',
          'An explicit termination condition',
          'A JSON schema for every output',
          'A human reviewer for each turn',
        ],
        answer: 1,
        explain:
          'A loop without a defined stop is a spend bug, not an agent. Termination is a condition the harness checks, not a feeling the model has.',
      },
      {
        q: "A 'workflow-shaped' tool means:",
        options: [
          'One tool per REST endpoint, mirroring the API exactly',
          'A tool that consolidates a multi-call workflow into one task-shaped operation',
          'A tool that only reads and never writes',
          'A tool generated automatically from an OpenAPI spec',
        ],
        answer: 1,
        explain:
          'schedule_meeting beats list_users + list_events + check_availability + create_event. Each hop the model must chain is a chance to err and a context tax.',
      },
      {
        q: 'Why should tool outputs prefer meaningful names over UUIDs?',
        options: [
          'UUIDs are longer, so they cost slightly more tokens',
          'Models reason over natural-language tokens; opaque IDs invite copy errors and carry no signal',
          'UUIDs leak security information',
          'Names compress better in the KV cache',
        ],
        answer: 1,
        explain:
          "The model reasons in tokens, not foreign keys. An email address carries usable signal; a UUID is dead weight the model can only transcribe - sometimes wrongly.",
      },
      {
        q: 'The "agent-computer interface" (ACI) refers to:',
        options: [
          'The terminal UI an agent renders for humans',
          'The MCP wire protocol specifically',
          'The tool surface an agent works through - deserving the design effort once spent on HCI',
          'The keyboard and mouse layer in computer-use agents',
        ],
        answer: 2,
        explain:
          'Decades of craft went into human-computer interfaces. Anthropic argues tools - the agent-computer interface - now deserve the same deliberate design investment.',
      },
    ],
    sections: [
      {
        heading: 'The loop, in four beats',
        blocks: [
          {
            type: 'text',
            md: 'Every agent - Claude Code, a homegrown SDK script, a 40k-line orchestrator - runs the same loop: **gather context, take action, verify, repeat**. The part teams forget is the fifth element: **explicit termination**. A loop without a defined stop is not an agent; it is a spend bug with good manners. Define done before you fire.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" rx="8" fill="#18181b"/>
  <text x="350" y="32" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">THE AGENT LOOP</text>
  <text x="350" y="52" text-anchor="middle" fill="#f472b6" font-size="10">check fails: loop again</text>
  <polyline points="580,88 580,62 120,62 120,86" fill="none" stroke="#f472b6" stroke-width="1.5"/>
  <polygon points="116,84 124,84 120,92" fill="#f472b6"/>
  <rect x="40" y="92" width="160" height="56" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="120" y="115" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Gather context</text>
  <text x="120" y="133" text-anchor="middle" fill="#a1a1aa" font-size="9">files, memory, retrieval</text>
  <line x1="200" y1="120" x2="264" y2="120" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="262,116 262,124 270,120" fill="#71717a"/>
  <rect x="270" y="92" width="160" height="56" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="350" y="115" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Take action</text>
  <text x="350" y="133" text-anchor="middle" fill="#a1a1aa" font-size="9">tool calls, edits, commands</text>
  <line x1="430" y1="120" x2="494" y2="120" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="492,116 492,124 500,120" fill="#71717a"/>
  <rect x="500" y="92" width="160" height="56" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="580" y="115" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Verify</text>
  <text x="580" y="133" text-anchor="middle" fill="#a1a1aa" font-size="9">tests, build, screenshot</text>
  <line x1="580" y1="148" x2="580" y2="198" stroke="#fbbf24" stroke-width="1.5"/>
  <polygon points="576,196 584,196 580,204" fill="#fbbf24"/>
  <text x="592" y="178" fill="#fbbf24" font-size="10">check passes</text>
  <rect x="465" y="204" width="220" height="52" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
  <text x="575" y="226" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">TERMINATE</text>
  <text x="575" y="243" text-anchor="middle" fill="#a1a1aa" font-size="9">stop condition defined before launch</text>
  <text x="240" y="240" fill="#a1a1aa" font-size="10">No stop condition = a spend bug,</text>
  <text x="240" y="255" fill="#a1a1aa" font-size="10">not an agent.</text>
</svg>`,
            caption:
              'Four beats plus a stop. The verify beat is where quality is made; the stop is where budgets survive.',
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Termination is a condition the **harness** checks - a passing test, an iteration cap, a budget ceiling - never a vibe the model reports. Models are optimistic about their own completeness.',
          },
        ],
      },
      {
        heading: 'Tools are the action surface',
        blocks: [
          {
            type: 'text',
            md: 'The "take action" beat is only as good as the tools behind it. Anthropic\'s "Writing effective tools for agents" reduces to five principles - each one is a context-budget decision as much as an API decision:',
          },
          {
            type: 'table',
            headers: ['Principle', 'What it looks like in practice'],
            rows: [
              [
                'Workflow-shaped tools',
                'One schedule_meeting tool, not list_users + list_events + check_availability + create_event chained by the model',
              ],
              [
                'Namespacing',
                'github_create_pr, jira_create_ticket - siblings grouped by prefix, so wrong-tool grabs drop',
              ],
              [
                'Token-efficient outputs',
                'Return the 5 fields the task needs, paginate the rest, and on truncation emit a steering message telling the agent how to filter',
              ],
              [
                'Meaningful identifiers',
                'Names and emails over opaque UUIDs - the model reasons in tokens, not foreign keys',
              ],
              [
                'Descriptions as onboarding docs',
                'Brief a new hire: what it does, when to use it, when NOT to, example inputs',
              ],
            ],
          },
        ],
      },
      {
        heading: 'The ACI deserves HCI-level effort',
        blocks: [
          {
            type: 'text',
            md: 'We spent decades perfecting human-computer interfaces. The **agent-computer interface** is where that effort goes now - and the method is evaluation-driven: run real tasks, read the transcripts, watch exactly where the agent fumbles a tool, rewrite the definition, re-run. Anthropic even lets Claude rewrite its own tool descriptions from failure transcripts - and the revised versions beat the human originals.',
          },
          {
            type: 'compare',
            left: {
              title: 'API-shaped toolbox',
              items: [
                'list_contacts, list_events, check_availability, create_event',
                'Model burns turns chaining calls in the right order',
                'Intermediate JSON floods the context window',
                'UUIDs the model copy-pastes - sometimes wrongly',
                'Description: "Creates an event." (thanks)',
              ],
            },
            right: {
              title: 'Workflow-shaped toolbox',
              items: [
                'schedule_meeting(person, topic, duration)',
                'One call, one decision',
                'Output: confirmation plus the 3 fields that matter',
                'Names and emails the model can reason about',
                'Description reads like onboarding docs, with a when-not-to-use clause',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Design 3 workflow-shaped tools for a domain you know',
      intro:
        'On paper or in Claude - no code required. The deliverable is three tool specs good enough that an agent could act through them on the first read.',
      steps: [
        'Pick a domain you know cold: your last production system, your home lab, or a SaaS you administer.',
        'List 8-12 raw operations (API endpoints, CLI commands) an agent would need in that domain.',
        'Consolidate them into exactly 3 workflow-shaped tools named for tasks, not endpoints (deploy_preview, not create_branch + push + open_pr).',
        'For each tool write: name, a description in onboarding-doc voice (including when NOT to use it), input params, and the exact fields the output returns.',
        'Add a token-efficiency note per tool: what you deliberately omit from the output, the pagination/truncation rule, and the steering message emitted on overflow.',
        'Paste all 3 specs into Claude and ask it to role-play an agent using them on 2 realistic tasks. Watch where it hesitates or picks the wrong tool.',
        'Revise the weakest description based on that transcript and note what changed.',
      ],
      checklist: [
        '3 tools exist, each replacing a multi-call workflow with one call',
        'Every description says when NOT to use the tool',
        'Every output spec names its fields and its truncation/steering behavior',
        'One description was revised after watching a real transcript',
      ],
    },
    checkQuiz: [
      {
        q: 'A tool truncates its output at 200 rows. What should accompany the truncated result?',
        options: [
          'Nothing - truncation should be silent to save tokens',
          'The full row count only',
          'A steering message telling the agent how to filter or paginate to get what it needs',
          'A base64 blob of the remaining rows',
        ],
        answer: 2,
        explain:
          'Token-efficient outputs pair truncation with steering: tell the agent what was cut and which parameters retrieve the rest. Silent truncation causes confidently wrong answers.',
      },
      {
        q: 'The primary payoff of namespacing tools (github_*, jira_*):',
        options: [
          'Faster JSON schema validation',
          'The model selects the right tool among many - wrong-tool grabs drop',
          'It enables per-namespace rate limits',
          'It reduces the total number of tools',
        ],
        answer: 1,
        explain:
          'With dozens of tools loaded, prefixes group siblings and disambiguate near-duplicates. Selection accuracy, not performance, is the win.',
      },
      {
        q: 'The recommended voice for a tool description:',
        options: [
          'Terse - one line, the model infers the rest',
          'Marketing copy emphasizing capabilities',
          'Onboarding docs for a new hire: when to use it, when not to, example inputs',
          'A formal grammar of accepted arguments',
        ],
        answer: 2,
        explain:
          'The description is the only training the model gets on your tool. Write it like you brief a new teammate - including the when-NOT-to-use clause.',
      },
      {
        q: 'How do you actually improve a weak tool definition?',
        options: [
          'Add more parameters so the model has options',
          'Evaluation-driven iteration: run real tasks, read transcripts, revise, re-run',
          'Lower the temperature until calls stabilize',
          'Duplicate it under a clearer name and keep both',
        ],
        answer: 1,
        explain:
          'Transcripts show exactly where the agent fumbles. Revise against observed failures, not intuition - Claude can even rewrite its own descriptions from those transcripts.',
      },
    ],
    resources: [
      {
        label: 'Anthropic - Writing effective tools for agents',
        url: 'https://www.anthropic.com/engineering/writing-tools-for-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic - Building Effective Agents (the loop and the augmented LLM)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic - Effective context engineering for AI agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
      {
        label: 'Claude Code docs - MCP and tool configuration',
        url: 'https://code.claude.com/docs/en/mcp',
        kind: 'docs',
      },
    ],
  },

  // ── m2-l3 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l3',
    title: 'Loop Engineering',
    day: 10,
    minutes: 45,
    xp: 100,
    objectives: [
      'Write a loop program that re-prompts an agent until a real check passes',
      'Diagnose the three loop failure modes in a broken setup',
      'Fire an agent from a spec.md task list instead of babysitting prompts',
      'Cap loop cost with max-iteration guards and per-iteration cost awareness',
    ],
    skipQuiz: [
      {
        q: "Boris Cherny's description of his current job:",
        options: [
          '"My job is to review every diff Claude produces"',
          '"I don\'t prompt Claude anymore... My job is to write loops"',
          '"I spend my day curating CLAUDE.md files"',
          '"I mostly write evals now"',
        ],
        answer: 1,
        explain:
          'The Cherny line that frames this whole lesson: the unit of work moved from the prompt to the loop - a program that re-prompts until a real check passes.',
      },
      {
        q: 'A loop, in the loop-engineering sense, is:',
        options: [
          'A while-true wrapper that restarts the agent on crash',
          'A small program that prompts an agent, reads output, checks against real criteria, decides done or not, and re-prompts',
          'A cron job that runs the same prompt every hour',
          'The retry logic inside the API client',
        ],
        answer: 1,
        explain:
          'Five parts: prompt, read, check against REAL criteria, decide, re-prompt. The check is what separates a loop from a retry wrapper.',
      },
      {
        q: 'Loops are ideally fired once from:',
        options: [
          'An interactive chat session',
          'A spec.md or PRD.md task list',
          'A Slack thread',
          'The model system prompt',
        ],
        answer: 1,
        explain:
          'Write the spec, fire the loop, walk away. The task list in spec.md/PRD.md is the loop input; your attention is no longer the bottleneck.',
      },
      {
        q: 'Which loop failure mode "bills you in your sleep"?',
        options: [
          'No memory file',
          'No subagent split',
          'No stop condition',
          'No system prompt',
        ],
        answer: 2,
        explain:
          'Without a stop condition, a loop that never satisfies its check runs all night at full token burn. Max-iterations guards are non-negotiable.',
      },
      {
        q: 'The actual craft of loop engineering, per this lesson:',
        options: [
          'Choosing the fastest model for each iteration',
          'Making the check real and defining when to stop',
          'Minimizing prompt length',
          'Parallelizing iterations across worktrees',
        ],
        answer: 1,
        explain:
          'A loop is trivial code. The engineering is in the check (is it a real, binary criterion?) and the stop (what ends this, including on failure?).',
      },
    ],
    sections: [
      {
        heading: 'The job changed',
        blocks: [
          {
            type: 'callout',
            variant: 'quote',
            title: 'Boris Cherny, creator of Claude Code',
            md: '"I don\'t prompt Claude anymore. I have loops... My job is to write loops."',
          },
          {
            type: 'text',
            md: "A loop is a small program: it prompts an agent, reads the output, **checks it against real criteria**, decides done-or-not, and re-prompts with what's missing. You fire it once from a **spec.md or PRD.md task list** and walk away. Prompting made your attention the bottleneck; loop engineering makes the check the bottleneck - and checks scale.",
          },
        ],
      },
      {
        heading: 'Anatomy of a loop',
        blocks: [
          {
            type: 'code',
            lang: 'bash',
            caption: 'A complete loop: real check, memory file, hard stop. This is the whole idea.',
            code: `#!/bin/bash
# check.sh -- the REAL criterion. Must fail before the agent starts.
#   npm test -- --run checkout && npx tsc --noEmit

# loop.sh
MAX=5
i=0
while [ $i -lt $MAX ]; do
  claude -p "Read notes.md for prior attempts. Make the failing checkout tests pass. Append a summary of this attempt to notes.md." --permission-mode acceptEdits
  if ./check.sh; then
    echo "DONE after $((i+1)) iterations"
    exit 0
  fi
  i=$((i+1))
done
echo "FAILED: hit max iterations -- human review needed"
exit 1`,
          },
          {
            type: 'text',
            md: 'Twenty lines, three load-bearing decisions: **check.sh is binary and external** (the model cannot argue with an exit code), **notes.md carries memory** between iterations, and **MAX=5 caps the bill**. Everything else in loop engineering is elaboration on these three.',
          },
        ],
      },
      {
        heading: 'The three failure modes',
        blocks: [
          {
            type: 'table',
            headers: ['Failure mode', 'Symptom', 'Fix'],
            rows: [
              [
                'No memory file',
                'Every iteration starts from zero: re-explores the repo, retries dead-end theories, token bill climbs',
                'Require the agent to append findings and attempts to notes.md each pass',
              ],
              [
                'No subagent split',
                'One context does research, coding, and review; quality degrades as it fills',
                'Isolate phases: a research pass writes findings, a fresh context implements',
              ],
              [
                'No stop condition',
                '"Bills you in your sleep" - an unsatisfiable check loops at full burn all night',
                'Max-iterations guard + budget ceiling + a failure exit path to a human',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Where loops waste tokens',
            md: 'Watch for: re-reading the whole repo every iteration (no memory file), re-sending an ever-growing transcript instead of starting fresh with notes, and looping on the same wrong theory because the check output never reaches the next prompt. Feed the **failure detail** forward, not just "try again".',
          },
        ],
      },
      {
        heading: 'Loops in practice',
        blocks: [
          {
            type: 'text',
            md: 'Claude Code ships this natively: **/loop** re-runs a prompt or slash command on an interval or self-paced until done. Fine for polling and babysitting CI. For build loops, the shell version above gives you the guard rails explicitly. And keep perspective: **human-in-the-loop is still the strongest setup** - run loop batches, review between them, correct the spec, fire again.',
          },
          {
            type: 'compare',
            left: {
              title: 'Prompting',
              items: [
                'You are the loop - re-prompting by hand',
                'Quality depends on your attention',
                'Session dies when you sleep',
                'Done = you feel satisfied',
              ],
            },
            right: {
              title: 'Loop engineering',
              items: [
                'A program is the loop',
                'Quality depends on the check',
                'Runs unattended - inside a guard',
                'Done = the check passes (or the guard fires)',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Ship a guarded loop',
      intro:
        'Build the smallest real loop: a binary check, a memory file, a hard cap. Then watch what the agent does when nobody is steering.',
      steps: [
        'Pick a task with a machine-checkable outcome: a failing test, tsc exiting 0, a lint pass on a gnarly file.',
        'Write check.sh that exits 0 only when that outcome is true. Run it now - it must fail before the agent starts.',
        'Write loop.sh modeled on the lesson: max 5 iterations, each calling claude -p with a prompt that references notes.md for prior attempts.',
        'Make the prompt require the agent to append an attempt summary to notes.md every iteration - that file is the loop memory.',
        'Fire it and do not intervene, even if iteration 2 looks wrong.',
        'Afterwards read notes.md: did later iterations build on earlier ones, or repeat them?',
        'Tally the cost with /cost or the console and write down tokens-per-iteration.',
      ],
      checklist: [
        'check.sh failed before the run and passed after (or the guard fired and exited 1)',
        'The loop is physically incapable of running more than 5 iterations',
        'notes.md shows iteration-over-iteration memory, not amnesia',
        'You know what one iteration costs in tokens and dollars',
      ],
    },
    checkQuiz: [
      {
        q: 'The telltale symptom of a loop with no memory file:',
        options: [
          'It stops after one iteration',
          'Each iteration re-explores the repo from zero and retries dead ends; cost climbs with no progress',
          'It edits files outside the repo',
          'The check passes but the code is wrong',
        ],
        answer: 1,
        explain:
          'No notes.md means iteration N knows nothing of iterations 1 through N-1. You pay full exploration cost every pass and dead-end theories get retried.',
      },
      {
        q: "The fix for the 'no subagent split' failure mode:",
        options: [
          'Use a bigger context window',
          'Isolate phases - a research pass writes findings to a file, then a fresh context implements from it',
          'Lower MAX so the context never fills',
          'Add more detail to the system prompt',
        ],
        answer: 1,
        explain:
          'One context doing research, coding, and review degrades as it fills. Split the phases and pass files between fresh contexts.',
      },
      {
        q: 'What does /loop do in Claude Code?',
        options: [
          'Replays your last prompt with higher effort',
          'Re-runs a prompt or slash command on an interval, or self-paced until done',
          'Forks the session into parallel branches',
          'Rolls the conversation back one turn',
        ],
        answer: 1,
        explain:
          '/loop is the built-in recurrence primitive - good for polling and babysitting. For build loops, an explicit shell loop gives you the guard and the check.',
      },
      {
        q: 'The lesson calls which arrangement the strongest known setup?',
        options: [
          'Fully autonomous overnight loops',
          'Human-in-the-loop: loop batches with human review and spec correction between them',
          'Two agents reviewing each other with no human',
          'Single-shot prompting with a very detailed spec',
        ],
        answer: 1,
        explain:
          'Automation runs the iterations; the human corrects the spec and the check between batches. That combination still beats either alone.',
      },
    ],
    resources: [
      {
        label: 'Claude Code docs - /loop, headless mode, hidden features',
        url: 'https://code.claude.com/docs',
        kind: 'docs',
      },
      {
        label: 'Boris Cherny on loops and team workflows',
        url: 'https://x.com/bcherny',
        kind: 'thread',
      },
      {
        label: 'Karpathy - From Vibe Coding to Agentic Engineering (summary)',
        url: 'https://karpathy.bearblog.dev/sequoia-ascent-2026',
        kind: 'article',
      },
      {
        label: 'Karpathy - Sequoia AI Ascent 2026 talk',
        url: 'https://youtu.be/96jN2OCOfLs',
        kind: 'video',
      },
    ],
  },

  // ── m2-l4 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l4',
    title: 'Verification: the #1 Quality Lever',
    day: 10,
    minutes: 45,
    xp: 100,
    objectives: [
      'Rank the four rungs of the verification escalation ladder and pick the right one for a task',
      'Write a task contract with binary, machine-checkable acceptance criteria',
      "Wire a Stop hook that blocks a premature 'done'",
      'Demand and check evidence instead of accepting agent assertions',
    ],
    skipQuiz: [
      {
        q: "Anthropic's single most-repeated tip for agent quality:",
        options: [
          'Use the largest available model',
          'Give the agent a way to verify its own work',
          'Keep prompts under 500 tokens',
          'Always run agents in pairs',
        ],
        answer: 1,
        explain:
          'Top of the best-practices list: an agent that can check its work (tests, build, screenshot) converges on correct output; one that cannot merely converges on plausible output.',
      },
      {
        q: 'The ideal shape of a verification signal:',
        options: [
          'A 1-10 quality rubric scored by the model',
          'Binary pass/fail: tests green, build exits 0, screenshots match',
          'A confidence percentage in the final message',
          'A human thumbs-up emoji',
        ],
        answer: 1,
        explain:
          'Binary signals cannot be argued with or partially satisfied. Rubrics scored by the same model reintroduce the optimism you were trying to remove.',
      },
      {
        q: 'The escalation ladder, weakest to strongest:',
        options: [
          'Stop hook, /goal, same-prompt check, subagent',
          'Same-prompt check, /goal per-turn evaluator, Stop hook, verification subagent',
          'Subagent, Stop hook, /goal, same-prompt check',
          '/goal, same-prompt check, subagent, Stop hook',
        ],
        answer: 1,
        explain:
          'Polite ask, then graded-per-turn, then deterministic gate, then independent fresh-context reviewer. Climb only as high as the task risk demands.',
      },
      {
        q: 'Stop hooks specifically kill which failure?',
        options: [
          'The agent editing files it should not touch',
          "The agent claiming it's done when it isn't",
          'The agent exceeding its token budget',
          'The agent hallucinating file paths',
        ],
        answer: 1,
        explain:
          "A Stop hook runs a deterministic check when the agent tries to finish; exit 2 blocks the stop. 'Claims done but isn't' becomes structurally impossible.",
      },
      {
        q: 'Matt Pocock\'s "most effective technique is 20 years old" refers to:',
        options: [
          'Pair programming',
          'Writing a failing test first',
          'Code review checklists',
          'The waterfall spec document',
        ],
        answer: 1,
        explain:
          'TDD: the failing test is simultaneously the spec and the verification signal. The agent runs until green - no ambiguity about done.',
      },
    ],
    sections: [
      {
        heading: 'The single highest-leverage move',
        blocks: [
          {
            type: 'text',
            md: "Anthropic's best-practices doc leads with it: **give the agent a way to verify its work**. The signal should be binary - tests pass, build exits 0, screenshot matches the mock. A binary check can't be negotiated with, and models negotiate. Everything else in this lesson is machinery for making that signal real and making it mandatory.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Boris Cherny',
            md: 'Giving Claude a verification loop produces "2-3x the quality of the final result." Same model, same prompt - the multiplier is entirely in the check.',
          },
        ],
      },
      {
        heading: 'The escalation ladder',
        blocks: [
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" rx="8" fill="#18181b"/>
  <text x="350" y="30" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">THE VERIFICATION ESCALATION LADDER</text>
  <rect x="25" y="212" width="150" height="52" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="100" y="234" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">1. Same-prompt check</text>
  <text x="100" y="251" text-anchor="middle" fill="#a1a1aa" font-size="9">a polite ask; skippable</text>
  <line x1="175" y1="228" x2="200" y2="196" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="196,196 204,199 199,190" fill="#71717a"/>
  <rect x="195" y="158" width="150" height="52" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="270" y="180" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">2. /goal evaluator</text>
  <text x="270" y="197" text-anchor="middle" fill="#a1a1aa" font-size="9">graded every turn</text>
  <line x1="345" y1="174" x2="370" y2="142" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="366,142 374,145 369,136" fill="#71717a"/>
  <rect x="365" y="104" width="150" height="52" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="440" y="126" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">3. Stop hook</text>
  <text x="440" y="143" text-anchor="middle" fill="#a1a1aa" font-size="9">deterministic gate; exit 2 blocks</text>
  <line x1="515" y1="120" x2="540" y2="88" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="536,88 544,91 539,82" fill="#71717a"/>
  <rect x="535" y="50" width="150" height="52" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="610" y="72" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">4. Verify subagent</text>
  <text x="610" y="89" text-anchor="middle" fill="#a1a1aa" font-size="9">fresh, unbiased eyes</text>
  <text x="30" y="288" fill="#a1a1aa" font-size="10">cheaper, weaker guarantee</text>
  <text x="670" y="288" text-anchor="end" fill="#a1a1aa" font-size="10">costlier, stronger guarantee</text>
</svg>`,
            caption:
              'Climb only as high as the task risk demands. A Stop hook is nearly free insurance; a verification subagent costs a whole fresh context.',
          },
          {
            type: 'table',
            headers: ['Rung', 'Mechanism', 'Guarantee'],
            rows: [
              [
                'Same-prompt check',
                '"Run the tests before saying done" written into the prompt',
                'A polite request - the model can and will skip it under pressure',
              ],
              [
                '/goal per-turn evaluator',
                'Progress graded against the stated goal every turn',
                'Persistent pressure, but still model-judged',
              ],
              [
                'Stop hook',
                'Deterministic script runs when the agent tries to finish; exit 2 blocks the stop',
                'The agent structurally cannot claim done while the check is red',
              ],
              [
                'Verification subagent',
                'A fresh context reviews the work and the evidence',
                "Independent eyes that don't share the implementer's assumptions",
              ],
            ],
          },
        ],
      },
      {
        heading: 'Write the failing test first',
        blocks: [
          {
            type: 'callout',
            variant: 'quote',
            title: 'Matt Pocock',
            md: '"The most effective technique is 20 years old: write a failing test first."',
          },
          {
            type: 'text',
            md: 'TDD maps perfectly onto agents: the failing test is **the spec and the checker in one artifact**. Write it (or have the agent write it, then review it yourself), confirm it fails, then let the agent loop until green. This is the highest signal-per-token verification you can buy - and it survives as a regression guard afterward.',
          },
        ],
      },
      {
        heading: 'Contracts: verification as an artifact',
        blocks: [
          {
            type: 'text',
            md: 'systematicls\'s contract-based tasking makes verification a file. Every task gets a **{Task}_CONTRACT.md** with acceptance criteria and testing requirements; a Stop hook runs the contract\'s checks and blocks completion until they pass. The cultural rule that comes with it: **demand evidence, not assertions**. Pasted test output counts. "Tests are passing" does not.',
          },
          {
            type: 'code',
            lang: 'markdown',
            caption: 'A contract: binary criteria, evidence required, hook-enforceable.',
            code: `# CHECKOUT_FIX_CONTRACT.md

## Task
Fix the rounding bug in cart totals for mixed-currency orders.

## Acceptance criteria (all binary)
- [ ] npm test -- cart passes with 0 failures
- [ ] npx tsc --noEmit exits 0
- [ ] New regression test exists: src/cart/rounding.test.ts
- [ ] No files outside src/cart/ modified (git diff --stat proves it)

## Testing requirements
Run the full cart suite, not just the new test.

## Evidence required
Paste the actual command output for every criterion.
A claim without output does not count as done.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Convert a real task into a contract and run an agent against it',
      intro:
        'Take one item off your actual backlog and give it the contract treatment. The goal is to feel the difference between an agent that asserts and an agent that proves.',
      steps: [
        'Pick one real task - small enough for a single session, real enough to matter.',
        'Write TASK_CONTRACT.md: task statement, 3-6 acceptance criteria, and testing requirements, modeled on the lesson example.',
        "Audit each criterion ruthlessly: if two engineers could disagree about whether it's met, rewrite it as a command plus expected exit code or output.",
        "Start a fresh Claude Code session: 'Fulfill TASK_CONTRACT.md. You are not done until every criterion has pasted evidence.'",
        'When the agent claims done, re-run at least two of the evidence commands yourself and compare.',
        "Optional hardening: add a Stop hook that runs the contract's test commands and exits 2 on failure, then try to get the agent to finish early.",
      ],
      checklist: [
        'Every acceptance criterion is binary: a command plus an expected result',
        'The agent produced pasted evidence, not bare assertions',
        'You re-ran at least two evidence commands and they passed',
        'You can name which rung of the escalation ladder this setup reaches',
      ],
    },
    checkQuiz: [
      {
        q: 'A {Task}_CONTRACT.md contains, at minimum:',
        options: [
          'A story-point estimate and an assignee',
          'Acceptance criteria plus testing requirements - with a Stop hook gating completion until they pass',
          'The full implementation plan, file by file',
          'A rollback procedure and an on-call rotation',
        ],
        answer: 1,
        explain:
          'The contract is the verification artifact: binary criteria plus required tests, enforced by a hook. Plans and estimates live elsewhere.',
      },
      {
        q: "Cherny's claimed multiplier from adding a verification loop:",
        options: ['10-20% better', 'About 50% better', '2-3x the quality', 'No measurable change, but cheaper'],
        answer: 2,
        explain:
          '"2-3x the quality of the final result" - same model and prompt; the delta comes entirely from the agent checking its own work against a real signal.',
      },
      {
        q: '"Demand evidence, not assertions" cashes out as:',
        options: [
          'Asking the agent to rate its confidence 1-10',
          'Requiring pasted command output, screenshots, or exit codes - a claim without output does not count',
          'Having the agent explain its reasoning step by step',
          'Requiring the agent to cite documentation',
        ],
        answer: 1,
        explain:
          'Reasoning and confidence are still assertions. Evidence is the artifact a human (or hook) can independently re-check.',
      },
      {
        q: 'Why does the verification subagent sit at the top of the ladder?',
        options: [
          'It runs on a larger model by default',
          "It has a fresh context and doesn't share the implementer's assumptions and biases",
          'It can modify the Stop hook configuration',
          'It is cheaper than a Stop hook',
        ],
        answer: 1,
        explain:
          'The implementer context "knows" what it meant to do and grades itself generously. Fresh eyes evaluate only what actually exists - like human code review.',
      },
    ],
    resources: [
      {
        label: 'Anthropic - Claude Code best practices (verify-first escalation)',
        url: 'https://www.anthropic.com/engineering/claude-code-best-practices',
        kind: 'article',
      },
      {
        label: 'Claude Code docs - Hooks (Stop hooks, exit 2 blocking)',
        url: 'https://code.claude.com/docs/en/hooks',
        kind: 'docs',
      },
      {
        label: 'Matt Pocock - AI Hero (TDD-first agent workflows)',
        url: 'https://www.aihero.dev',
        kind: 'course',
      },
      {
        label: 'systematicls - contract-based tasking threads',
        url: 'https://x.com/systematicls',
        kind: 'thread',
      },
    ],
  },

  // ── m2-l5 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l5',
    title: 'Multi-Agent Patterns',
    day: 11,
    minutes: 50,
    xp: 100,
    objectives: [
      'Choose among orchestrator-workers, sectioning, voting, and evaluator-optimizer for a given task',
      'Run a council-style adversarial review with anonymized blind peer scoring',
      "Write neutral prompts that don't manufacture findings",
      'Recognize the tasks where multi-agent is a net loss and stay single-agent',
    ],
    skipQuiz: [
      {
        q: 'The evaluator-optimizer pattern (Building Effective Agents):',
        options: [
          'Two models vote and a third breaks ties',
          'One agent generates, another critiques against criteria, and they loop',
          'An orchestrator streams tasks to a pool of identical workers',
          'The model evaluates its own output in the same context',
        ],
        answer: 1,
        explain:
          'Generator plus critic in a loop - use it when you have clear evaluation criteria and iteration measurably helps (translation, search refinement, drafts).',
      },
      {
        q: 'Why does the LLM Council anonymize advisor responses before peer review?',
        options: [
          'To reduce prompt length',
          'So models grade ideas rather than authors - countering sycophancy and authority bias',
          'To comply with model provider terms',
          'To prevent context contamination between advisors',
        ],
        answer: 1,
        explain:
          'Anonymization is the load-bearing part: a reviewer that knows which answer came from the "senior" persona - or from itself - grades the name, not the argument.',
      },
      {
        q: 'The 3-agent bug detection pipeline, in order:',
        options: [
          'Judge proposes, detector verifies, refuter documents',
          'Detector proposes a superset, adversarial refuter attacks each finding, judge rules',
          'Refuter writes tests, detector runs them, judge merges',
          'Three detectors vote on each candidate bug',
        ],
        answer: 1,
        explain:
          'Detector casts a wide net (superset), the refuter - carrying penalty incentives - tries to knock every finding down, and the judge keeps what survives.',
      },
      {
        q: 'Neutral prompting means preferring which instruction?',
        options: [
          '"Find all the bugs in this code"',
          '"Report all situations discovered in this code"',
          '"List at least 5 issues in this code"',
          '"Confirm this code is production-ready"',
        ],
        answer: 1,
        explain:
          'Leading prompts manufacture findings: ask for bugs and you get bugs, real or not. Ask for situations discovered and the model reports what is actually there.',
      },
      {
        q: 'Which task should stay single-agent?',
        options: [
          'Researching 8 independent libraries for a comparison',
          'A refactor where every step depends on the previous step, all in one file',
          'Security review benefiting from an unbiased second opinion',
          'Generating 5 design options to vote on',
        ],
        answer: 1,
        explain:
          'Sequential, same-file work is the canonical bad fit: agents merge-conflict with each other and no isolation win pays for the coordination cost.',
      },
    ],
    sections: [
      {
        heading: "When one context isn't enough",
        blocks: [
          {
            type: 'text',
            md: 'Multi-agent buys you two things: **isolated contexts** (no single window fills up) and **diverse perspectives** (contexts that don\'t share assumptions). It costs tokens and coordination. Anthropic\'s "Building Effective Agents" gives the canonical shapes - learn them as a decision table, not a menu of toys:',
          },
          {
            type: 'table',
            headers: ['Pattern', 'Shape', 'Reach for it when'],
            rows: [
              [
                'Orchestrator-workers',
                'A lead agent decomposes the task at runtime; workers execute in parallel contexts',
                "Subtasks can't be predicted up front - research, multi-file features",
              ],
              [
                'Parallelization: sectioning',
                'Predefined independent splits, run simultaneously',
                "Chunks genuinely don't depend on each other - per-module review, batch processing",
              ],
              [
                'Parallelization: voting',
                'Same task N times; keep the consensus or the union',
                'Verifiable answers or judgment calls - vulnerability triage, flaky-test diagnosis',
              ],
              [
                'Evaluator-optimizer',
                'Generator and critic in a loop until criteria pass',
                'Clear evaluation criteria exist and iteration visibly helps',
              ],
            ],
          },
        ],
      },
      {
        heading: 'Adversarial patterns: engineering disagreement',
        blocks: [
          {
            type: 'text',
            md: "A single model agrees with you - sycophancy is a training artifact, and it poisons decisions. The **LLM Council** (Ole Lehmann, from Karpathy's pattern) engineers disagreement instead: five personas - **Contrarian, First Principles, Expansionist, Outsider, Executor** - answer the same brief independently. Responses are stripped of names and cross-reviewed blind. A **Chairman** synthesizes the rankings and critiques, dissent preserved.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" rx="8" fill="#18181b"/>
  <text x="350" y="28" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">LLM COUNCIL - engineered disagreement</text>
  <rect x="275" y="42" width="150" height="32" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="350" y="62" text-anchor="middle" fill="#e4e4e7" font-size="11">Decision brief</text>
  <line x1="350" y1="74" x2="77" y2="108" stroke="#71717a"/>
  <line x1="350" y1="74" x2="213" y2="108" stroke="#71717a"/>
  <line x1="350" y1="74" x2="350" y2="108" stroke="#71717a"/>
  <line x1="350" y1="74" x2="487" y2="108" stroke="#71717a"/>
  <line x1="350" y1="74" x2="623" y2="108" stroke="#71717a"/>
  <rect x="15" y="110" width="124" height="44" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="77" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10">Contrarian</text>
  <rect x="151" y="110" width="124" height="44" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="213" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10">First Principles</text>
  <rect x="288" y="110" width="124" height="44" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="350" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10">Expansionist</text>
  <rect x="425" y="110" width="124" height="44" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="487" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10">Outsider</text>
  <rect x="561" y="110" width="124" height="44" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="623" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10">Executor</text>
  <line x1="77" y1="154" x2="240" y2="208" stroke="#71717a"/>
  <line x1="213" y1="154" x2="290" y2="208" stroke="#71717a"/>
  <line x1="350" y1="154" x2="350" y2="208" stroke="#71717a"/>
  <line x1="487" y1="154" x2="410" y2="208" stroke="#71717a"/>
  <line x1="623" y1="154" x2="460" y2="208" stroke="#71717a"/>
  <rect x="180" y="210" width="340" height="54" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="350" y="233" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Anonymized blind peer review</text>
  <text x="350" y="250" text-anchor="middle" fill="#a1a1aa" font-size="9">names stripped - ideas graded, not authors</text>
  <line x1="350" y1="264" x2="350" y2="304" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="346,302 354,302 350,310" fill="#71717a"/>
  <rect x="250" y="310" width="200" height="54" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="350" y="333" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">CHAIRMAN</text>
  <text x="350" y="350" text-anchor="middle" fill="#a1a1aa" font-size="9">synthesis + recorded dissent</text>
  <text x="350" y="388" text-anchor="middle" fill="#a1a1aa" font-size="10">sycophancy has nowhere to hide</text>
</svg>`,
            caption:
              'Five personas answer independently, review each other blind, and a Chairman synthesizes. The anonymization step is what makes the disagreement honest.',
          },
        ],
      },
      {
        heading: 'Adversarial bug detection',
        blocks: [
          {
            type: 'text',
            md: 'The same adversarial logic, pointed at code: a **detector** proposes a superset of candidate bugs; an **adversarial refuter** - given penalty incentives for waving false positives through - attacks every finding; a **judge** rules on what survives. It works because it exploits **instruction-following bias**: tell a model to refute and it genuinely tries, in a way "double-check your list" never achieves.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Neutral prompting',
            md: '"Report all situations discovered" outperforms "find bugs." A leading prompt manufactures findings - ask a model for bugs and you will receive bugs, real or invented. Neutral wording is free and it compounds through every downstream agent.',
          },
          {
            type: 'text',
            md: 'The build-side sibling is the **plan/build/judge** loop: a planner writes the spec, a builder implements in a fresh context, and a judge gates the result against the plan - the demo version ships an app in about 40 minutes. Same trio shape, pointed forward instead of backward.',
          },
        ],
      },
      {
        heading: 'When NOT to multi-agent',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Stay single-agent',
              items: [
                'Sequential work where each step feeds the next',
                'Same-file edits - agents merge-conflict like people, but faster',
                'Tasks one context comfortably holds',
                'Anywhere coordination cost exceeds the isolation win',
              ],
            },
            right: {
              title: 'Go multi-agent',
              items: [
                'Read-heavy research fan-out across independent sources',
                'Independent modules or sections in parallel',
                'Review that benefits from fresh, unbiased eyes',
                'Decisions worth adversarial pressure',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            md: 'The council and the refuter are cheap compared to one bad architecture decision. The inverse also holds: five agents on a sequential one-file task is pure overhead wearing a futuristic costume.',
          },
        ],
      },
    ],
    lab: {
      title: 'Run a council over a real decision',
      intro:
        'Install a council skill or hand-build one, then point it at a decision you are actually facing. You are testing whether engineered disagreement surfaces anything your single-session habit misses.',
      steps: [
        "Pick a real decision you're currently facing: an architecture choice, a tooling bet, buy-vs-build.",
        'Install a council skill (npx skills add aiwithremy/claude-skills-llm-council, or clone ngmeyer/council-review) - or commit to hand-building it.',
        'Hand-built version: run 5 separate Claude sessions, one persona each - Contrarian, First Principles, Expansionist, Outsider, Executor - with the identical, neutrally-worded brief.',
        'Strip names from the 5 answers, then give the anonymized set to each advisor for blind peer review: rank the OTHER responses and critique the strongest.',
        'Run a Chairman pass: synthesize rankings and critiques into one recommendation with dissent explicitly recorded.',
        'Control run: ask a plain single session the same brief. Diff the two outputs and note what the council surfaced that the single pass missed.',
      ],
      checklist: [
        '5 advisor responses generated from a neutral, non-leading brief',
        'Peer review was blind - no advisor knew who wrote what',
        'Chairman output records at least one dissenting view',
        'You can name one concrete insight the single-model answer missed',
      ],
    },
    checkQuiz: [
      {
        q: 'Orchestrator-workers vs parallelization-by-sectioning - the real difference:',
        options: [
          'Orchestrator-workers is always cheaper',
          'The orchestrator decomposes the task dynamically at runtime; sectioning uses splits you predefined',
          'Sectioning requires identical worker models',
          'Orchestrator-workers cannot run workers in parallel',
        ],
        answer: 1,
        explain:
          "Same fan-out picture, different brain: sectioning when you already know the independent chunks, orchestrator when the decomposition itself is the model's job.",
      },
      {
        q: 'Voting-style parallelization fits best when:',
        options: [
          'The subtasks depend on each other',
          'You need diverse samples on one judgment call - like flagging vulnerabilities - and take consensus',
          'The task requires editing one shared file',
          'You want to minimize total token spend',
        ],
        answer: 1,
        explain:
          'Voting spends N times the tokens to buy confidence on a single question. Consensus across independent samples filters individual-run noise.',
      },
      {
        q: 'Which of these is an actual LLM Council persona?',
        options: ['The Moderator', 'The Historian', 'The Expansionist', 'The Optimist'],
        answer: 2,
        explain:
          'The five: Contrarian, First Principles, Expansionist, Outsider, Executor - chosen to pull the analysis in genuinely different directions.',
      },
      {
        q: 'Why give the refuter penalty incentives in 3-agent bug detection?',
        options: [
          'To make it produce shorter reports',
          "So refutation is genuine - exploiting instruction-following bias to actually filter the detector's false positives",
          'To keep it from proposing new bugs',
          'To reduce its context usage',
        ],
        answer: 1,
        explain:
          'Without stakes, a "reviewer" model politely agrees. Penalties for letting false positives through make the refuter fight, which is the entire filtering mechanism.',
      },
    ],
    resources: [
      {
        label: 'Anthropic - Building Effective Agents (the workflow patterns)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic - How we built our multi-agent research system',
        url: 'https://www.anthropic.com/engineering/multi-agent-research-system',
        kind: 'article',
      },
      {
        label: 'aiwithremy/claude-skills-llm-council',
        url: 'https://github.com/aiwithremy/claude-skills-llm-council',
        kind: 'repo',
      },
      {
        label: 'ngmeyer/council-review',
        url: 'https://github.com/ngmeyer/council-review',
        kind: 'repo',
      },
      {
        label: 'Claude Code docs - subagents and agent teams',
        url: 'https://code.claude.com/docs/en/sub-agents',
        kind: 'docs',
      },
    ],
  },
]
