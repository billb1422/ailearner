import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ── m2-l1 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-l1',
    title: 'What Is a Harness?',
    day: 9,
    minutes: 55,
    xp: 100,
    objectives: [
      'Explain the claim that an agent equals a model plus a harness, and back it with the Life-Harness result (116 of 126 setups improved by patching the harness alone)',
      'List the fifteen jobs every harness performs and map each one to a concrete component in a real product',
      'Name the four middleware interception points (before and after each model call and each tool call) and describe what the harness does at each',
      'Audit Claude Code as a harness and identify the jobs it performs invisibly',
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
          'Patching the harness alone, with zero change to the model weights, improved 116 of 126 setups. That is the headline finding: the scaffolding around the model was the bottleneck, and fixing the scaffolding moved the scores.',
      },
      {
        q: 'The same Sonnet 4.5 scored 31% on GAIA in one setup and 75% in another. What was different?',
        options: [
          'Sampling temperature and top-p settings',
          'A newer model checkpoint in the second run',
          'The scaffolding around the model, meaning the harness',
          'An easier subset of the benchmark',
        ],
        answer: 2,
        explain:
          'Identical model, identical benchmark, a 44-point swing. Everything in that gap lives in the harness: what context gets delivered, which tools exist, how work gets verified, and when the loop stops.',
      },
      {
        q: 'Sydney Runkle of LangChain compresses the whole discipline into one phrase: harness design is ___ design.',
        options: ['prompt template', 'reward function', 'user interface', 'context delivery'],
        answer: 3,
        explain:
          "Runkle's point is that the harness exists to control exactly what the model sees on each call. Persistence, tools, hooks, compaction: every other job ends up serving that one goal.",
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
          'The fifteen jobs are being done in your stack right now, whether you chose them or they happened by default. The useful question is which component does each job, and how deliberately it was picked.',
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
          'Compaction means deciding what survives when the context window fills up, and that decision belongs to the harness. The other three options are model-training concerns that happen long before your harness ever runs.',
      },
    ],
    sections: [
      {
        heading: 'The OS for the LLM',
        blocks: [
          {
            type: 'text',
            md: "Every agent product, once you strip away the branding, is two parts: a model and a harness. The model is the [LLM](https://en.wikipedia.org/wiki/Large_language_model) (large language model) itself, the thing that reads text and predicts more text. The harness is every piece of software wrapped around it. AVB's analogy is the one that sticks: **the harness is the operating system for the LLM**.\n\nHere's why that analogy earns its keep. The model is stateless. It forgets everything the instant an API call ends, the way a pure function returns a value and keeps no notes. An operating system takes a bare CPU and gives running programs everything they need to be useful: memory, input and output, scheduling, permissions, and a way to exit. The harness gives the model the same list. Conversation history plays the role of memory. Tools play the role of input and output. A loop decides what runs next, rules decide what it may touch, and a stop condition gives it a reason to end.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Sydney Runkle, LangChain',
            md: 'An agent is a model plus a harness, and harness design is **context delivery design**. Every middleware hook, before and after each model call and each tool call, is a chance to control exactly what the model sees next.',
          },
          {
            type: 'text',
            md: "Middleware is a term borrowed from web servers: code that sits in the middle of a request and can inspect or change it on the way through. An agent harness has four natural places to put that code, and together they make up the working API of the harness. **Before the model call**, the harness assembles the prompt: it decides which history, which files, and which instructions the model sees this turn. **After the model call**, it parses the reply and routes any tool calls the model asked for. **Before the tool runs**, it applies policy: is this tool allowed, do the arguments need rewriting, does a human need to approve? **After the tool runs**, it shapes the result: it can truncate a 10,000-row output, summarize it, or inject a steering note like 'output truncated, filter by date to narrow it'. Every serious harness feature you'll meet in this module lives at one of these four seams.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" rx="8" fill="#18181b"/>
  <text x="350" y="30" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">THE FOUR MIDDLEWARE SEAMS</text>
  <text x="350" y="48" text-anchor="middle" fill="#a1a1aa" font-size="10">every harness feature hooks into one of these four points</text>
  <rect x="30" y="75" width="180" height="64" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="120" y="100" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">1. BEFORE MODEL CALL</text>
  <text x="120" y="118" text-anchor="middle" fill="#a1a1aa" font-size="9">assemble the prompt</text>
  <line x1="210" y1="107" x2="262" y2="107" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="260,103 260,111 268,107" fill="#71717a"/>
  <rect x="270" y="75" width="140" height="64" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
  <text x="340" y="103" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold">MODEL</text>
  <text x="340" y="121" text-anchor="middle" fill="#a1a1aa" font-size="9">replies, may ask for a tool</text>
  <line x1="410" y1="107" x2="462" y2="107" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="460,103 460,111 468,107" fill="#71717a"/>
  <rect x="470" y="75" width="200" height="64" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="570" y="100" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">2. AFTER MODEL CALL</text>
  <text x="570" y="118" text-anchor="middle" fill="#a1a1aa" font-size="9">parse reply, route tool calls</text>
  <line x1="570" y1="139" x2="570" y2="192" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="566,190 574,190 570,198" fill="#71717a"/>
  <rect x="470" y="200" width="200" height="64" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="570" y="225" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">3. BEFORE TOOL CALL</text>
  <text x="570" y="243" text-anchor="middle" fill="#a1a1aa" font-size="9">policy, approvals, arg rewriting</text>
  <line x1="470" y1="232" x2="418" y2="232" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="420,228 420,236 412,232" fill="#71717a"/>
  <rect x="270" y="200" width="140" height="64" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
  <text x="340" y="228" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold">TOOL</text>
  <text x="340" y="246" text-anchor="middle" fill="#a1a1aa" font-size="9">runs, returns a result</text>
  <line x1="270" y1="232" x2="218" y2="232" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="220,228 220,236 212,232" fill="#71717a"/>
  <rect x="30" y="200" width="180" height="64" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="120" y="225" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">4. AFTER TOOL CALL</text>
  <text x="120" y="243" text-anchor="middle" fill="#a1a1aa" font-size="9">truncate, summarize, steer</text>
  <line x1="120" y1="200" x2="120" y2="147" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="116,149 124,149 120,141" fill="#71717a"/>
  <text x="350" y="302" text-anchor="middle" fill="#a1a1aa" font-size="10">the tool result flows back into the next prompt, and the loop repeats</text>
</svg>`,
            caption:
              'The four interception points. At each seam the harness can inspect, rewrite, block, or enrich what passes through, which is how it controls exactly what the model sees.',
          },
        ],
      },
      {
        heading: 'Fifteen jobs, always being done',
        blocks: [
          {
            type: 'text',
            md: 'mfpiccolo\'s essay "How to Build Your Own Agent Harness" (on iii.dev) starts by throwing out the most common question. People ask "which harness framework should I install?", the way they would ask about picking a web framework. Wrong frame. A harness is a job description with **fifteen line items**, and every one of those jobs is already being done in any agent system you run today. Did you store nothing between turns? That was a persistence decision, made by accident. Did you paste an API key into the prompt? That was a credentials decision, a bad one.\n\nThe table below is the full list. Read it as an audit checklist: for each row, something in your stack is doing this job right now, either deliberately or by default.',
          },
          {
            type: 'table',
            headers: ['Job', 'What it covers'],
            rows: [
              ['Turn persistence', 'Every turn gets durably stored, so a session survives a crash and can resume where it left off'],
              ['Credentials', 'API keys and OAuth tokens (OAuth is the standard protocol for delegated login) live in the harness and never get pasted into the prompt'],
              ['Model catalog', 'Knows which models exist, their aliases, their fallbacks, and which model each kind of task should route to'],
              ['Per-turn state machine', 'Tracks each turn through its phases: assembling the prompt, streaming the reply, executing tools, done'],
              ['Skill serving', 'Loads the right instructions at the right moment instead of dumping everything up front'],
              ['Prompt assembly', 'Builds the exact text the model sees on each call. This is the core job the other fourteen exist to support'],
              ['Streaming', 'Delivers partial output live and handles a mid-stream interruption cleanly'],
              ['Tool policy', 'Decides which tools are exposed, to whom, and with which arguments allowed'],
              ['Approvals', 'Puts a human gate in front of risky actions like writes, sends, and spends'],
              ['Spend tracking', 'Meters tokens and dollars per session, per user, and per day'],
              ['Hooks', 'Lets you run your own code before and after model calls and tool calls'],
              ['Session branching', 'Forks a conversation so you can explore an idea without polluting the original'],
              ['Compaction', 'Summarizes old turns when the context window fills, deciding what survives and what gets dropped'],
              ['Event streams', 'Emits structured events that other systems can subscribe to'],
              ['OTEL traces', 'Standard observability via [OpenTelemetry](https://opentelemetry.io): a trace span recorded for every model call and tool call'],
            ],
          },
        ],
      },
      {
        heading: 'The evidence: patch the harness, lift the score',
        blocks: [
          {
            type: 'text',
            md: 'Does the harness really matter more than the model? A 2026 paper nicknamed Life-Harness ([arxiv 2605.22166](https://arxiv.org/abs/2605.22166)) ran that experiment at scale. The setup: take 126 existing agent configurations built on 18 different backbone models (the backbone is the underlying LLM doing the reasoning), then patch only the harness. No fine-tuning and no model swaps of any kind. The result: **116 of the 126 setups got better**, with a **mean improvement of 88.5%**.\n\nThe sharpest single data point involves [GAIA](https://arxiv.org/abs/2311.12983), a benchmark of realistic assistant tasks that mix web lookup, multi-step reasoning, and file handling. The same Sonnet 4.5 model scored **31% on GAIA inside one harness and 75% inside another**. Same brain, different body, more than double the score.',
          },
          {
            type: 'text',
            md: "Google ran the same experiment from a different angle and landed in the same place. Their 2026 playbook 'The New AI SDLC' puts a number on the split: the model is about **10%** of what decides whether an agent succeeds, and the harness is the other **90%**. Their picture pairs well with the operating-system one. The model is the engine. The harness is the car, the road, and the traffic laws. A world-class engine with no chassis, no road, and no rules is just an expensive way to sit still.\n\nThe proof point they cite is Terminal-Bench 2.0, a benchmark that scores agents on real terminal work. One model sat outside the top 30. A team at LangChain left that model untouched and rebuilt the harness around it: better context delivery, better tools, tighter verification. The score climbed from **52.8% to 66.5%**, a jump of **13.7 points**, and the setup jumped into the top 5. For scale, 13.7 points is roughly the gap between Sonnet and Opus. A good harness made a mid-tier model perform like the frontier one, at mid-tier prices.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Where the payoff lives',
            md: 'Two independent studies ran the test and landed in the same spot. If a benchmark score can more than double without touching the model, spend your effort where the numbers moved. Most teams still pour their tuning time into prompt wording and model choice, the two smallest levers. The harness is the big one.',
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
  <text x="350" y="226" text-anchor="middle" fill="#a1a1aa" font-size="10">stateless: forgets everything</text>
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
              'Patch anything in the outer layers and benchmark scores move, with no model change required. Life-Harness: 116 of 126 setups improved, 88.5% mean lift.',
          },
        ],
      },
      {
        heading: 'You already run one',
        blocks: [
          {
            type: 'text',
            md: "Claude Code is a harness, and you've been operating it for a week without calling it that. Walk the mapping. **CLAUDE.md and skills** feed skill serving and prompt assembly: they decide which instructions reach the model, and when. **Permission rules** in settings.json handle tool policy and approvals: they decide which tools may run and when a human gate fires. **/cost** is spend tracking. **/branch** is session branching. **Auto-compaction** quietly summarizes old turns when the context window fills. **Hooks** are the four middleware seams from earlier, exposed for you to script. And the session files under `~/.claude/projects` are turn persistence and event streams: every turn you've ever run sits on disk as structured JSON. The lab walks you through proving each of these mappings yourself.",
          },
        ],
      },
    ],
    lab: {
      title: 'Audit Claude Code against the 15 harness jobs',
      intro:
        'The fastest way to internalize the fifteen-job taxonomy is to hold it against a harness you already run every day. Work the list until every job maps to a nameable Claude Code component, or to an explicit gap.',
      steps: [
        'Copy the 15-job table from this lesson into a file called harness-audit.md in any working repo.',
        'Open Claude Code and work the list job by job. For each job, name the concrete feature that performs it (for example, turn persistence maps to the session files under ~/.claude/projects).',
        'Verify three of your mappings empirically: run /hooks, /mcp, and /cost, and confirm they cover hooks, tool policy, and spend tracking respectively.',
        'Open one session file on disk and read a few lines. You are looking at turn persistence and the event-stream format with your own eyes.',
        'Mark any job you cannot map to a visible feature. Each of those is either a real gap or something Claude Code does invisibly (prompt assembly and compaction are the usual suspects).',
        'Finish harness-audit.md with one sentence per job: the component name plus the evidence you saw.',
      ],
      checklist: [
        "All 15 jobs have a named Claude Code component or an explicit 'invisible or gap' verdict",
        'At least 3 mappings verified with a real command or a file inspection',
        'You can state the model-plus-harness claim and back it with the Life-Harness numbers, without notes',
        "You identified at least one job you'd want to customize (a hook, a policy rule, or a spend guard)",
      ],
    },
    checkQuiz: [
      {
        q: "AVB's analogy: the harness is to the LLM what ___ is to a process.",
        options: ['a compiler', 'a debugger', 'an operating system', 'a package manager'],
        answer: 2,
        explain:
          'The model on its own is a stateless function. The harness plays the operating system: it supplies memory, input and output, scheduling, permissions, and termination, which is everything a process needs to live.',
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
          'Four seams: before and after the model call, and before and after each tool call. Each seam is an interception point where the harness shapes exactly what the model sees next.',
      },
      {
        q: 'Mean lift across the 18 backbone models from harness patches, per the Life-Harness paper:',
        options: ['8.5%', '28%', '44%', '88.5%'],
        answer: 3,
        explain:
          'The mean improvement was 88.5%, from harness changes alone. The 44-point figure is a different number from the same paper: the GAIA swing (31% to 75%) for one Sonnet 4.5 setup.',
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
          'Permission rules decide which tools run, with which arguments, and when a human gate fires. That is tool policy. CLAUDE.md feeds prompt assembly, /compact is compaction, and session files are turn persistence.',
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
        label: "Cole Medin - Google's masterclass on agentic engineering (model 10%, harness 90%)",
        url: 'https://youtu.be/zbmuiaPuiNM',
        kind: 'video',
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
    minutes: 50,
    xp: 100,
    objectives: [
      'Draw the agent loop from memory, including the explicit termination condition',
      'Convert a raw API surface into workflow-shaped tools with token-efficient outputs',
      'Write tool descriptions that read like onboarding docs for a new hire',
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
          'The four beats are gather context, take action, verify, repeat. The retrieve-rerank-generate-cite option describes a RAG pipeline (retrieval-augmented generation), which is a fixed sequence rather than a loop. A real agent loop also needs a fifth element the beats leave out: an explicit termination condition.',
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
          "A loop with no defined stop will run all night and bill you for every iteration. Termination has to be a condition the harness itself can check, such as a passing test or an iteration cap. Models grade their own completeness generously, so the model's opinion can't be the stop signal.",
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
          'One schedule_meeting call replaces a four-call chain of list_users, list_events, check_availability, and create_event. Every hop the model has to chain by itself is another chance to pass the wrong argument, and every intermediate JSON result eats context.',
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
          'Models reason over natural-language tokens. An email address like sam@acme.com carries meaning the model can actually use, while a UUID is a random string it can only copy, and it sometimes copies wrong. Meaningful identifiers hand the model signal instead of transcription work.',
      },
      {
        q: 'The "agent-computer interface" (ACI) refers to:',
        options: [
          'The terminal UI an agent renders for humans',
          'The MCP wire protocol specifically',
          'The tool surface an agent works through, deserving the design effort once spent on HCI',
          'The keyboard and mouse layer in computer-use agents',
        ],
        answer: 2,
        explain:
          "HCI stands for human-computer interaction, the decades-old craft of designing interfaces people can use. Anthropic's argument: tools are the interface an agent works through (the agent-computer interface), and they now deserve the same deliberate design investment.",
      },
    ],
    sections: [
      {
        heading: 'The loop, in four beats',
        blocks: [
          {
            type: 'text',
            md: "Every agent you'll ever meet runs the same loop, whether it's Claude Code, a 50-line script on the Claude Agent SDK, or a 40,000-line custom orchestrator. Beat one: **gather context**. The agent reads files, searches the repo, and pulls up notes, whatever it needs to understand the situation. Beat two: **take action**. It calls a tool: edits a file, runs a command, hits an API. Beat three: **verify**. It checks whether the action worked. Did the tests pass? Did the build compile? Does the screenshot match the mock? Beat four: **repeat**, carrying forward everything it just learned.\n\nPlay one iteration out. The agent is fixing a bug. It reads the failing test output (gather), edits the suspect function (act), and reruns the test (verify). The test fails again, this time with a different error message. That new message flows into the next round of gathering, so the next edit is better informed. Round and round until the test goes green.\n\nThe part teams forget is the fifth element: **explicit termination**. What makes the loop stop? If the only stop signal is the model deciding it feels finished, the loop can run all night at full token burn. Define done, as a checkable condition, before you fire.",
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
  <text x="240" y="240" fill="#a1a1aa" font-size="10">No stop condition means</text>
  <text x="240" y="255" fill="#a1a1aa" font-size="10">an open-ended bill.</text>
</svg>`,
            caption:
              'Four beats plus a stop. The verify beat is where quality gets made, and the stop is where budgets survive.',
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Termination is a condition the **harness** checks: a passing test, an iteration cap, a budget ceiling. Models grade their own work generously, so "the model says it\'s done" can never be the only exit. Give the loop a stop it can\'t argue with.',
          },
        ],
      },
      {
        heading: 'Tools are the action surface',
        blocks: [
          {
            type: 'text',
            md: 'The "take action" beat is only as strong as the tools behind it, and tool design is where a lot of agent quality quietly leaks away. Anthropic\'s guide "Writing effective tools for agents" boils down to five principles. Notice that every one of them is really a context-budget decision: each principle exists to keep junk out of the model\'s window and keep signal in.',
          },
          {
            type: 'table',
            headers: ['Principle', 'What it looks like in practice'],
            rows: [
              [
                'Workflow-shaped tools',
                'Build one schedule_meeting tool instead of making the model chain list_users, then list_events, then check_availability, then create_event',
              ],
              [
                'Namespacing',
                'Prefix related tools (github_create_pr, jira_create_ticket) so siblings group together and the model grabs the wrong tool less often',
              ],
              [
                'Token-efficient outputs',
                'Return the 5 fields the task needs and paginate the rest. When you truncate, say so, and tell the agent how to filter for more',
              ],
              [
                'Meaningful identifiers',
                'Return names and email addresses instead of opaque UUIDs. The model can reason about sam@acme.com; a UUID is dead weight it can only copy',
              ],
              [
                'Descriptions as onboarding docs',
                "Write each description like you're briefing a new hire: what the tool does, when to use it, when NOT to, with example inputs",
              ],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" rx="8" fill="#18181b"/>
  <text x="180" y="32" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">API-SHAPED: the model chains 4 calls</text>
  <text x="525" y="32" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">WORKFLOW-SHAPED: one call</text>
  <line x1="350" y1="48" x2="350" y2="300" stroke="#3f3f46" stroke-dasharray="4 4"/>
  <rect x="70" y="52" width="220" height="32" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="180" y="72" text-anchor="middle" fill="#e4e4e7" font-size="11">list_users</text>
  <line x1="180" y1="84" x2="180" y2="102" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="176,100 184,100 180,108" fill="#71717a"/>
  <rect x="70" y="108" width="220" height="32" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="180" y="128" text-anchor="middle" fill="#e4e4e7" font-size="11">list_events</text>
  <line x1="180" y1="140" x2="180" y2="158" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="176,156 184,156 180,164" fill="#71717a"/>
  <rect x="70" y="164" width="220" height="32" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="180" y="184" text-anchor="middle" fill="#e4e4e7" font-size="11">check_availability</text>
  <line x1="180" y1="196" x2="180" y2="214" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="176,212 184,212 180,220" fill="#71717a"/>
  <rect x="70" y="220" width="220" height="32" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="180" y="240" text-anchor="middle" fill="#e4e4e7" font-size="11">create_event</text>
  <text x="180" y="278" text-anchor="middle" fill="#f472b6" font-size="10">4 model turns, 4 chances to err</text>
  <text x="180" y="294" text-anchor="middle" fill="#a1a1aa" font-size="10">intermediate JSON piles up in context</text>
  <rect x="410" y="118" width="230" height="60" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="525" y="143" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">schedule_meeting</text>
  <text x="525" y="161" text-anchor="middle" fill="#a1a1aa" font-size="10">(person, topic, duration)</text>
  <text x="525" y="278" text-anchor="middle" fill="#34d399" font-size="10">1 model turn, 1 decision</text>
  <text x="525" y="294" text-anchor="middle" fill="#a1a1aa" font-size="10">output: only the 3 fields that matter</text>
</svg>`,
            caption:
              'The same capability, two shapes. The workflow-shaped tool moves the chaining out of the model and into ordinary code, where nothing gets fumbled.',
          },
        ],
      },
      {
        heading: 'The ACI deserves HCI-level effort',
        blocks: [
          {
            type: 'text',
            md: "HCI, human-computer interaction, is the discipline that spent decades refining buttons, menus, and error messages until people could use them without thinking. The **agent-computer interface** (ACI) is the same idea pointed at agents: the tool surface is the interface your agent lives through, and it deserves the same design effort.\n\nHow do you actually improve it? Evaluation-driven iteration. Run real tasks through the agent, then read the transcripts and watch for the fumble. Maybe the agent calls search_tickets when it needed search_docs, or passes a date in the wrong format three times in a row. Each fumble points at a specific weakness in a tool name, a parameter, or a description. Rewrite that definition, rerun the same tasks, and measure whether the fumble disappeared.\n\nAnthropic pushed this one step further: they let Claude read its own failure transcripts and rewrite its own tool descriptions. The revised versions beat the human-written originals on the same evaluations. The transcripts knew things the tool authors didn't.",
          },
          {
            type: 'compare',
            left: {
              title: 'API-shaped toolbox',
              items: [
                'list_contacts, list_events, check_availability, create_event',
                'The model burns turns chaining calls in the right order',
                'Intermediate JSON floods the context window',
                'UUIDs the model copies by hand, sometimes wrongly',
                'Description, in full: "Creates an event."',
              ],
            },
            right: {
              title: 'Workflow-shaped toolbox',
              items: [
                'schedule_meeting(person, topic, duration)',
                'One call, one decision',
                'Output: a confirmation plus the 3 fields that matter',
                'Names and emails the model can reason about',
                'Description reads like onboarding docs, including a when-not-to-use clause',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Design 3 workflow-shaped tools for a domain you know',
      intro:
        'On paper or in a Claude chat, no code required. The deliverable is three tool specs good enough that an agent could act through them on the first read.',
      steps: [
        'Pick a domain you know cold: your last production system, your home lab, or a SaaS you administer.',
        'List 8 to 12 raw operations (API endpoints, CLI commands) an agent would need in that domain.',
        'Consolidate them into exactly 3 workflow-shaped tools, each named for the task it completes (deploy_preview) rather than the endpoints underneath it (create_branch, push, open_pr).',
        'For each tool write four things: the name, a description in onboarding-doc voice (including when NOT to use it), the input params, and the exact fields the output returns.',
        'Add a token-efficiency note per tool: what you deliberately leave out of the output, the pagination or truncation rule, and the steering message emitted on overflow.',
        'Paste all 3 specs into Claude and ask it to role-play an agent using them on 2 realistic tasks. Watch where it hesitates or picks the wrong tool.',
        'Revise the weakest description based on that transcript and note what changed.',
      ],
      checklist: [
        '3 tools exist, each replacing a multi-call workflow with one call',
        'Every description says when NOT to use the tool',
        'Every output spec names its fields and its truncation and steering behavior',
        'One description was revised after watching a real transcript',
      ],
    },
    checkQuiz: [
      {
        q: 'A tool truncates its output at 200 rows. What should accompany the truncated result?',
        options: [
          'Nothing, since truncation should be silent to save tokens',
          'The full row count only',
          'A steering message telling the agent how to filter or paginate to get what it needs',
          'A base64 blob of the remaining rows',
        ],
        answer: 2,
        explain:
          'Token-efficient outputs pair every truncation with steering: tell the agent what was cut and which parameters retrieve the rest. Silent truncation is worse than it sounds, because the agent treats the partial result as the whole truth and answers confidently from it.',
      },
      {
        q: 'The primary payoff of namespacing tools (github_*, jira_*):',
        options: [
          'Faster JSON schema validation',
          'The model selects the right tool among many, so wrong-tool grabs drop',
          'It enables per-namespace rate limits',
          'It reduces the total number of tools',
        ],
        answer: 1,
        explain:
          'The payoff is selection accuracy. With dozens of tools loaded, prefixes group siblings together and separate near-duplicates, so the model grabs the right tool more often.',
      },
      {
        q: 'The recommended voice for a tool description:',
        options: [
          'Terse: one line, and the model infers the rest',
          'Marketing copy emphasizing capabilities',
          'Onboarding docs for a new hire: when to use it, when not to, example inputs',
          'A formal grammar of accepted arguments',
        ],
        answer: 2,
        explain:
          "The description is the only training the model ever gets on your tool. Write it the way you'd brief a new teammate, and always include the when-NOT-to-use clause, because that's the part the model can't guess.",
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
          'Transcripts show you exactly where the agent fumbles. Revise the definition against those observed failures, rerun the same tasks, and measure. Claude can even rewrite its own descriptions from failure transcripts, and the revisions beat the human originals.',
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
    minutes: 80,
    xp: 100,
    objectives: [
      'Explain what a loop is, where the idea came from, and why everyone started talking about it in June 2026',
      'Decide whether a task deserves a loop at all, using a four-question test',
      'Write a loop program that re-prompts an agent until a real check passes, then run the same job with /goal',
      'Pick between a shell loop, /goal, /loop, and a Stop hook for a given job',
      'Scale one loop into a feature factory where the agent that builds never grades its own work',
      'Diagnose the three loop failure modes and cap loop cost before you walk away',
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
          'That Cherny line is the one this whole lesson hangs on. The unit of work moved from the prompt to the loop, meaning a small program that re-prompts the agent until a real check passes.',
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
          'Five parts: prompt the agent, read the output, check it against real criteria, decide done or not, and re-prompt with what is still missing. The check is the part that separates a loop from a plain retry wrapper or a cron job.',
      },
      {
        q: 'In Claude Code, which command keeps the session working until a condition you wrote is met?',
        options: ['/loop', '/goal', '/schedule', '/batch'],
        answer: 1,
        explain:
          '/goal is the loop-engineering command: after every turn a small, fast model checks your condition and starts another turn if it is not met yet. /loop re-runs a prompt on a timer, which suits polling. The names trip up almost everyone the first time.',
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
          'Without a stop condition, a loop whose check never passes just keeps running at full token burn all night. A max-iterations guard is the non-negotiable part of any loop you fire unattended.',
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
          'The loop itself is trivial code, maybe twenty lines of bash. The engineering lives in two questions: is the check a real, binary criterion the model cannot argue with, and what ends the loop, including when it fails?',
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
            md: '"I don\'t prompt Claude anymore. I have loops that are running... My job is to write loops."',
          },
          {
            type: 'text',
            md: "Boris Cherny built Claude Code, and that quote is how he describes his own job now. Sit with it for a second: the person with the most reps on the tool says he doesn't prompt anymore.\n\nHe wasn't the only one saying it. On June 7, 2026, Peter Steinberger, the developer behind the open-source personal agent OpenClaw, posted a short \"monthly reminder\" on X: \"You should be designing loops that prompt your agents.\" The post spread fast. Within a day Addy Osmani, an engineering lead at Google, published an essay called [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) that gave the idea a name and a parts list, and within a few weeks every AI channel on YouTube had a loop engineering video. This lesson draws on five of them, linked at the bottom.\n\nHere's the plain-English version. Think about how you build with an agent today. You type a prompt, the agent works, it stops, and you look at what it did. If it's wrong, you type another prompt. **You're already in a loop. You're the part of the loop that checks the work and writes the next prompt.** Loop engineering means moving that checking job into the system so the loop can go around without you.",
          },
          {
            type: 'text',
            md: "So what does a loop look like as a program? It has five parts. It **prompts** an agent, **reads** the output, **checks** the result against real criteria (a test suite, a compiler, a linter: something with an exit code), **decides** whether the work is done, and if it isn't, it **re-prompts** with what's still missing. You write the task list once, in a spec.md or PRD.md file (PRD stands for product requirements document), fire the loop, and walk away.\n\nWhy this matters: when you prompt by hand, your attention is the bottleneck. You read every response, judge it, and type the follow-up. A loop moves that judgment into a check that runs without you. Checks scale in a way attention never will.\n\nWhy now, and why not a year ago? Stamina. Earlier models lost the thread after a few dozen steps, so an unattended loop mostly produced confident garbage. Current frontier models can hold a task for hours, which finally makes it worth taking yourself out of the middle.",
          },
        ],
      },
      {
        heading: 'Is this new? A short family tree',
        blocks: [
          {
            type: 'text',
            md: "Fair question, and the [Prompt Engineering](https://www.youtube.com/watch?v=7BrxIBkX3mg) channel asks it directly. The loop is an old idea that keeps getting rebuilt with better parts. Each generation fixed the biggest problem of the one before it, and seeing the line helps you recognize the failure modes when they show up in your own setup.",
          },
          {
            type: 'table',
            headers: ['Year', 'Version', 'What it added', 'What went wrong'],
            rows: [
              [
                '2022',
                'The [ReAct paper](https://arxiv.org/abs/2210.03629) (short for Reason + Act)',
                'A model that reasons, calls a tool, reads the result, and repeats. This is the inner loop from [Agents, Harnesses & Loops · Anatomy of the Agent Loop](lesson:m2-l2)',
                'It lived inside one task. Nothing outside the model decided whether the work was actually good',
              ],
              [
                '2023',
                '[AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)',
                'Gave the loop a goal and let the model write its own next prompt',
                'Famous for running in circles for hours, burning tokens, and shipping nothing. No real check and no stop condition',
              ],
              [
                '2025',
                'The [Ralph loop](https://ghuntley.com/ralph/) (Geoffrey Huntley)',
                'A tiny bash loop that feeds the same instructions every pass, with a **fresh context** each time and memory kept in files',
                'Works well, but you build the check and the guard yourself',
              ],
              [
                '2026',
                '/goal in Claude Code, goal mode in OpenAI Codex',
                'The loop ships in the tool: a separate model judges your stop condition after every turn',
                'The judge only sees the conversation, and everything runs in one session whose context keeps growing',
              ],
            ],
          },
          {
            type: 'text',
            md: "The sharpest pushback you'll hear: \"isn't this a cron job with a new name?\" (Cron is the old Unix scheduler that runs a fixed command at set times, like every night at 2am.) That critique is half right. The trigger often is a timer. What cron never had is the middle. A cron job runs the same script every time, no matter what happened last time. A loop runs a model that looks at the current state, decides what to do next, does it, checks it, and decides whether to keep going. **Cron plus a decision-maker in the body** is a decent one-line definition.",
          },
        ],
      },
      {
        heading: 'Should this be a loop?',
        blocks: [
          {
            type: 'text',
            md: "Before you build anything, check whether the job deserves a loop. Austin Marchese, who spent years as COO of a tech startup before making AI videos, runs every candidate through [four questions](https://www.youtube.com/watch?v=YAS4ojuhbW4). A loop only makes sense when all four come back yes.",
          },
          {
            type: 'table',
            headers: ['Question', 'Why it matters', 'If the answer is no'],
            rows: [
              [
                'Does the task repeat, or take a lot of back-and-forth?',
                'A loop is setup work. It pays off when it saves you many rounds of re-prompting',
                'Just prompt. A one-shot task is faster by hand',
              ],
              [
                'Is there a clear definition of done that something can check?',
                'The check is the whole loop. Without it, the loop has no way to stop for the right reason',
                'Write the definition of done first, or keep a human as the checker',
              ],
              [
                'Can you afford to be wasteful?',
                'A loop re-prompts until it passes, and every pass costs tokens',
                'Cap it tight, or work by hand when you keep hitting usage limits',
              ],
              [
                'Does the loop have every tool it needs to check its own work?',
                'A website loop that can\'t load the live page or take a screenshot can\'t verify anything',
                'Give it the tool first (a CLI, an MCP server, a screenshot script)',
              ],
            ],
          },
          {
            type: 'text',
            md: "The [AI LABS](https://www.youtube.com/watch?v=PLyRe6Zk--8) walkthrough adds a handy smell test for the first question: if a job usually takes you a lot of back-and-forth with the agent, it's a loop candidate. Their example was a landing page. A plain landing page is one prompt and a fix, so a loop would cost more than the page. A landing page with heavy scroll animations is different: dozens of moving parts, each one easy to get subtly wrong, and you'd normally spend an hour saying \"no, the logo should fade in after the headline\". That one earned a loop.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: "Don't loop the first version",
            md: "The same walkthrough built its first version by hand, on purpose. That first version is the **MVP** (minimum viable product: the roughest build that does the main thing and nothing else). To loop something, you have to define done before the agent starts. At the MVP stage you don't know where the product is going yet, so working out a definition of done takes longer than building the thing. Prompt your way to the MVP, then loop the features that come after it.",
          },
        ],
      },
      {
        heading: 'Anatomy of a loop',
        blocks: [
          {
            type: 'code',
            lang: 'bash',
            caption: 'A complete loop: a real check, a memory file, a hard stop. This is the whole idea.',
            code: `#!/bin/bash
# check.sh holds the REAL criterion. It must fail before the agent starts.
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
echo "FAILED: hit max iterations. A human needs to look."
exit 1`,
          },
          {
            type: 'text',
            md: "Twenty lines, and three of the decisions carry all the weight. First, **check.sh is binary and external**: it exits 0 or it doesn't, and the model can't argue with an exit code the way it can argue with \"does this look done to you?\". Second, **notes.md carries memory between iterations**: each pass reads what earlier passes tried and appends its own attempt, so iteration 3 knows that iterations 1 and 2 already ruled out the caching theory. Third, **MAX=5 caps the bill**: if five attempts can't satisfy the check, the loop exits with a failure code and a human takes over. Everything else in loop engineering is elaboration on these three moves.\n\nOne more detail worth noticing: every pass calls `claude -p` fresh. Each iteration starts with a clean context window and learns the history only from notes.md. That's the Ralph pattern from the family tree, and it matters later when we compare this script to /goal.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 350" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="350" rx="8" fill="#18181b"/>
  <text x="350" y="30" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">ANATOMY OF A GUARDED LOOP</text>
  <rect x="60" y="60" width="200" height="60" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="160" y="85" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">claude -p</text>
  <text x="160" y="103" text-anchor="middle" fill="#a1a1aa" font-size="9">reads notes.md, attempts the task</text>
  <line x1="260" y1="90" x2="322" y2="90" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="320,86 320,94 328,90" fill="#71717a"/>
  <rect x="330" y="60" width="160" height="60" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="410" y="85" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">check.sh</text>
  <text x="410" y="103" text-anchor="middle" fill="#a1a1aa" font-size="9">binary, external</text>
  <line x1="490" y1="90" x2="552" y2="90" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="550,86 550,94 558,90" fill="#34d399"/>
  <text x="522" y="80" text-anchor="middle" fill="#34d399" font-size="9">exit 0</text>
  <rect x="560" y="60" width="110" height="60" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="615" y="95" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">DONE</text>
  <line x1="410" y1="120" x2="410" y2="172" stroke="#fbbf24" stroke-width="1.5"/>
  <polygon points="406,170 414,170 410,178" fill="#fbbf24"/>
  <text x="422" y="150" fill="#fbbf24" font-size="9">exit 1</text>
  <rect x="330" y="180" width="160" height="64" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
  <text x="410" y="206" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">i = i + 1</text>
  <text x="410" y="224" text-anchor="middle" fill="#a1a1aa" font-size="9">still under MAX?</text>
  <line x1="330" y1="212" x2="268" y2="212" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="270,208 270,216 262,212" fill="#71717a"/>
  <text x="298" y="203" text-anchor="middle" fill="#a1a1aa" font-size="9">yes</text>
  <rect x="60" y="180" width="200" height="64" rx="8" fill="#27272a" stroke="#52525b" stroke-width="2"/>
  <text x="160" y="206" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">notes.md</text>
  <text x="160" y="224" text-anchor="middle" fill="#a1a1aa" font-size="9">attempt log = loop memory</text>
  <line x1="160" y1="180" x2="160" y2="128" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="156,130 164,130 160,122" fill="#71717a"/>
  <line x1="410" y1="244" x2="410" y2="290" stroke="#f472b6" stroke-width="1.5"/>
  <polygon points="406,288 414,288 410,296" fill="#f472b6"/>
  <text x="422" y="272" fill="#f472b6" font-size="9">no, hit MAX</text>
  <rect x="300" y="296" width="220" height="42" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="410" y="322" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">FAILED: exit 1, human review</text>
</svg>`,
            caption:
              'The guarded loop as a flowchart. The check decides, the notes file remembers, and MAX turns the worst case into a bounded bill.',
          },
          {
            type: 'text',
            md: "Marchese describes the same anatomy as **four building blocks**, and his version is useful once your loops grow past one script. The table maps each block onto the twenty lines above and onto the bigger systems you'll build later.",
          },
          {
            type: 'table',
            headers: ['Building block', 'In loop.sh', 'In a bigger system'],
            rows: [
              [
                '**Trigger**: what starts the loop',
                'You run ./loop.sh',
                'A /loop timer, a /schedule cloud routine, a GitHub event, or a skill you type like /check-weather-loop',
              ],
              [
                '**Execution skills**: what does the work',
                'The prompt passed to claude -p',
                'Battle-tested skills that already know how you want the job done',
              ],
              [
                '**Goal + verification**: what done means and who proves it',
                'check.sh',
                'Tests, a build, or a reviewer agent that returns APPROVED or NOT APPROVED',
              ],
              [
                '**Output + memory**: what the loop leaves behind',
                'Code changes plus notes.md',
                'Pull requests, a run-history file, and a lessons-learned file the next run reads',
              ],
            ],
          },
          {
            type: 'text',
            md: "Marchese calls the second block the most important, and his reasoning is worth hearing. He only builds loops on top of skills he's already used by hand many times. His example: a morning loop that checks the weather against his calendar. Without his workout skill, the agent sees rain and says \"cancel your run\". With the skill, it knows he likes running in the rain. The loop is only as smart as the instructions it calls, and a loop repeats a bad instruction just as faithfully as a good one. (Skills get their own lesson in [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3).)",
          },
        ],
      },
      {
        heading: 'Three built-in ways to run a loop',
        blocks: [
          {
            type: 'text',
            md: "Claude Code now ships loop machinery of its own, and the naming confuses everyone the first time they open the slash menu. **/loop** sounds like the loop-engineering command, but all it does is re-run a prompt on a timer. The command that keeps working until your condition is met is **/goal**. Here's how the options line up next to the shell script you just saw, using the descriptions from the [Claude Code docs](https://code.claude.com/docs/en/goal).",
          },
          {
            type: 'table',
            headers: ['Option', 'Next pass starts when', 'Stops when', 'Reach for it when'],
            rows: [
              [
                'Shell loop around `claude -p`',
                'Your script sees check.sh fail',
                'check.sh exits 0, or MAX is hit',
                'You want a hard, external check and a fresh context every pass',
              ],
              [
                '`/goal <condition>`',
                'The previous turn finishes',
                'A small, fast model judges the condition met or impossible, an error you must fix ends it, or you type `/goal clear`',
                'Substantial work with a checkable end state, inside one session',
              ],
              [
                '`/loop [interval] <prompt>`',
                'A timer fires (or Claude picks a delay between 1 minute and 1 hour)',
                'You cancel it, Claude ends a self-paced loop, or 7 days pass',
                'Polling: babysitting a pull request, watching a deploy, checking CI (continuous integration)',
              ],
              [
                'Stop hook',
                'The previous turn finishes',
                'Your own script says the work passes',
                'A deterministic gate you want on every session, covered in [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5)',
              ],
            ],
          },
          {
            type: 'code',
            lang: 'text',
            caption: 'A well-formed /goal: one measurable end state, a stated check, a constraint, and a turn limit.',
            code: `/goal all tests in test/auth pass (npm test -- test/auth exits 0),
npx tsc --noEmit exits 0, and no file outside src/auth is modified.
Or stop after 20 turns.

# headless, same idea, one command:
claude -p "/goal CHANGELOG.md has an entry for every PR merged this week"`,
          },
          {
            type: 'text',
            md: "How /goal works under the hood: after every turn, Claude Code sends your condition plus the conversation so far to a small, fast model (Haiku by default). That model returns one of three verdicts with a short reason. **Not yet met** starts another turn, and the reason becomes guidance for it. **Met** clears the goal. **Impossible** also clears it and records why. Typing `/goal` with no arguments shows how many turns have run and how many tokens they cost.\n\nThe detail that trips people up: **the judge has no tools.** It can't run your tests or open your files. It only reads what Claude has already printed into the conversation. So write the condition as something Claude's own output can prove: \"npm test exits 0\" works because Claude runs npm test and the result lands in the transcript. \"The code is clean\" gives the judge nothing to read. Also, a goal doesn't change your permission mode. To let it run unattended, start it in auto mode, or it will stop and ask before each command your settings don't already allow.",
          },
          {
            type: 'compare',
            left: {
              title: 'Shell loop around claude -p',
              items: [
                'Fresh context every pass; memory lives in notes.md',
                'check.sh runs the real command, so the verdict is an exit code',
                'You write the guard (MAX) yourself',
                'Better for long, overnight, many-pass jobs',
              ],
            },
            right: {
              title: '/goal',
              items: [
                'One session; context keeps growing until auto-compaction',
                'A model reads the transcript and judges the condition',
                'Turn limit goes in the condition text ("or stop after 20 turns")',
                'Better for medium jobs while you are nearby',
              ],
            },
          },
          {
            type: 'text',
            md: "Neither is wrong. /goal is the fastest way to get a loop running, and it's great for a task that fits in one session. The shell loop wins when the job is long enough that one growing conversation would bury the model, which is exactly the complaint Cole Medin raises later in this lesson. The judge's optimism is also a real limit: [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4) puts /goal on the second rung of a four-rung ladder for that reason.",
          },
        ],
      },
      {
        heading: 'The parts around a serious loop',
        blocks: [
          {
            type: 'text',
            md: "A single loop on a single task needs only the three moves from the anatomy section. A loop that runs your project for a week needs more around it. Osmani's essay lists **five components**, and the [KodeKloud](https://www.youtube.com/watch?v=yvP_AAirOQc) explainer walks through each one. Every component maps onto a Claude Code feature you've already met.",
          },
          {
            type: 'table',
            headers: ['Component', 'Its job in a loop', 'Claude Code piece', 'Learn it in'],
            rows: [
              [
                'Automations',
                'Find work on a schedule (yesterday\'s CI failures, new GitHub issues) and drop it into a to-do list, no human needed',
                '/loop, /schedule cloud routines, desktop scheduled tasks',
                '[Claude Code Mastery · Power Features](lesson:m1-l8)',
              ],
              [
                'Worktrees',
                'Give each agent its own copy of the repo on its own branch so two agents never edit the same files at once',
                'git worktree, `claude --worktree`',
                '[Claude Code Mastery · Landing Parallel Work](lesson:m1-l11)',
              ],
              [
                'Skills',
                'Write down project know-how (conventions, build steps) so the agent stops guessing every run',
                'SKILL.md files',
                '[Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3)',
              ],
              [
                'Plugins and connectors',
                'Reach outside systems: open a pull request, update a ticket, query a database',
                'MCP servers and plugins',
                '[Claude Code Mastery · MCP & Plugins](lesson:m1-l7)',
              ],
              [
                'Subagents',
                'Split the maker from the checker so nothing grades its own work',
                'Subagents with their own context',
                '[Claude Code Mastery · Subagents & Context Isolation](lesson:m1-l6)',
              ],
            ],
          },
          {
            type: 'text',
            md: "Two terms in that table deserve a plain definition. A **worktree** is a second (or third, or tenth) working folder attached to the same git repository, each checked out to a different branch. Agents in different worktrees can't trip over each other's half-finished edits. **MCP** stands for [Model Context Protocol](https://modelcontextprotocol.io), the standard plug format that lets an agent talk to outside tools like GitHub, Slack, or a database.\n\nMost people add a sixth part: **memory on disk**. The model forgets everything between runs, so the loop needs a file (or a ticket board) that records what's done, what failed, and what's next. Marchese credits Osmani with the line that sums it up: \"The agent forgets, the repo doesn't.\" [Agents, Harnesses & Loops · Agent Memory & State](lesson:m2-l7) goes deep on how to structure that file.",
          },
        ],
      },
      {
        heading: 'From one loop to a factory',
        blocks: [
          {
            type: 'text',
            md: "The AI LABS walkthrough is the most concrete build in the source videos. They took a hand-built salon booking app (customers pick a stylist and a time, a receptionist approves bookings) and grew it through three levels of looping. Each level hands one more job to the system.",
          },
          {
            type: 'table',
            headers: ['Level', 'What the loop does', 'What you still do'],
            rows: [
              [
                '1. One loop, one goal',
                'Builds one feature (their animated landing page) against a spec that doubles as a checklist. It scored itself against the checklist pass after pass and stopped after 38 minutes',
                'Write the spec and the check, then give it a final look',
              ],
              [
                '2. The software factory',
                'Works through a queue of features overnight. A builder subagent works on a branch, a separate reviewer hunts for bugs, and each finished feature arrives as a pull request with screenshots',
                'Plan the features, then approve or reject each pull request',
              ],
              [
                '3. Off the laptop',
                'The same factory, driven from your phone through Claude Code Remote Control or a phone app that connects to your machine',
                'Plan and approve from anywhere',
              ],
            ],
          },
          {
            type: 'text',
            md: "Level 2 is where the interesting design lives, so walk through it once. You plan a batch of features and list them in a queue file, a single table where each row is a feature with a status: **todo**, **building**, or **done**. You start one /goal whose condition is \"no row in queue.md is todo or building\". The main agent, called the **orchestrator** because it coordinates the others, picks the next todo row and hands it to a builder subagent working on its own branch.\n\nThen comes the rule both AI LABS and Osmani treat as non-negotiable: **the agent that does the work never verifies it.** A builder that checks its own work shares all of its own blind spots. So the orchestrator hands the branch to a second subagent with a fresh context and an **adversarial** brief, meaning it's told to assume the work contains bugs and go find them. If the reviewer finds problems, the findings go back to the builder and the pair loops again. When the reviewer passes it, the orchestrator opens a pull request (a request to merge the branch into the main code) with screenshots attached, marks the row done, and picks the next one.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" rx="8" fill="#18181b"/>
  <text x="350" y="30" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">THE FEATURE FACTORY (LEVEL 2)</text>
  <rect x="30" y="56" width="170" height="104" rx="8" fill="#27272a" stroke="#52525b" stroke-width="2"/>
  <text x="115" y="78" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">queue.md</text>
  <text x="44" y="100" fill="#34d399" font-size="9">services ........ done</text>
  <text x="44" y="118" fill="#fbbf24" font-size="9">reviews ......... building</text>
  <text x="44" y="136" fill="#a1a1aa" font-size="9">customer login .. todo</text>
  <line x1="200" y1="96" x2="252" y2="96" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="250,92 250,100 258,96" fill="#71717a"/>
  <text x="228" y="88" text-anchor="middle" fill="#a1a1aa" font-size="9">read</text>
  <rect x="260" y="66" width="170" height="60" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="345" y="91" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Orchestrator</text>
  <text x="345" y="109" text-anchor="middle" fill="#a1a1aa" font-size="9">one /goal, picks next todo row</text>
  <line x1="430" y1="96" x2="482" y2="96" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="480,92 480,100 488,96" fill="#71717a"/>
  <text x="458" y="88" text-anchor="middle" fill="#a1a1aa" font-size="9">dispatch</text>
  <rect x="490" y="66" width="180" height="60" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="580" y="91" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Builder subagent</text>
  <text x="580" y="109" text-anchor="middle" fill="#a1a1aa" font-size="9">works on its own branch</text>
  <line x1="545" y1="126" x2="545" y2="184" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="541,182 549,182 545,190" fill="#71717a"/>
  <text x="537" y="160" text-anchor="end" fill="#a1a1aa" font-size="9">branch</text>
  <rect x="490" y="190" width="180" height="64" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="580" y="215" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Adversarial reviewer</text>
  <text x="580" y="233" text-anchor="middle" fill="#a1a1aa" font-size="9">fresh context, assumes bugs</text>
  <line x1="625" y1="190" x2="625" y2="134" stroke="#fbbf24" stroke-width="1.5"/>
  <polygon points="621,136 629,136 625,128" fill="#fbbf24"/>
  <text x="633" y="164" fill="#fbbf24" font-size="9">fail: findings</text>
  <rect x="490" y="300" width="180" height="50" rx="8" fill="#27272a" stroke="#52525b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="580" y="321" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">mock.html prototype</text>
  <text x="580" y="338" text-anchor="middle" fill="#a1a1aa" font-size="9">the answer key</text>
  <line x1="580" y1="300" x2="580" y2="262" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="576,264 584,264 580,256" fill="#71717a"/>
  <line x1="490" y1="222" x2="438" y2="222" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="440,218 440,226 432,222" fill="#34d399"/>
  <text x="464" y="214" text-anchor="middle" fill="#34d399" font-size="9">pass</text>
  <rect x="260" y="190" width="170" height="64" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="345" y="215" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">Pull request</text>
  <text x="345" y="233" text-anchor="middle" fill="#a1a1aa" font-size="9">summary + screenshots</text>
  <line x1="345" y1="254" x2="345" y2="296" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="341,294 349,294 345,302" fill="#71717a"/>
  <rect x="260" y="302" width="170" height="48" rx="8" fill="#27272a" stroke="#e4e4e7" stroke-width="2"/>
  <text x="345" y="331" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">You: review + merge</text>
  <line x1="260" y1="326" x2="115" y2="326" stroke="#71717a" stroke-width="1.5"/>
  <line x1="115" y1="326" x2="115" y2="168" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="111,170 119,170 115,162" fill="#71717a"/>
  <text x="122" y="300" fill="#a1a1aa" font-size="9">mark done, next row</text>
  <rect x="30" y="190" width="170" height="56" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="115" y="213" text-anchor="middle" fill="#f472b6" font-size="11" font-weight="bold">STOP</text>
  <text x="115" y="231" text-anchor="middle" fill="#a1a1aa" font-size="9">no row is todo or building</text>
  <text x="350" y="385" text-anchor="middle" fill="#a1a1aa" font-size="10">The builder never grades its own work. The human gate sits at the merge.</text>
</svg>`,
            caption:
              'Level 2 as a flowchart. The queue is the memory, the reviewer is the check, the prototype is the answer key, and the merge button stays yours.',
          },
          {
            type: 'text',
            md: "One more trick from that build: **make a clickable prototype before the loop starts.** For each feature they generated a mock.html file, a fake version of the screen you can click through even though nothing behind it works. It does two jobs. First, you click it yourself and find out whether the feature you imagined is the feature you want, before a single token goes into building it. Second, it becomes the answer key: the reviewer compares the real build against the mock and flags anything that doesn't match. A prototype turns \"build a services page\" into something a machine can check.\n\nThe Level 2 run took about three hours for two features. Your job shrank to the two ends of the pipe: deciding what to build, and deciding whether it ships.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Every check has a blind spot',
            md: "The Level 1 landing page came back after 38 minutes with exactly one bug: a mascot that blinked wrong. The loop's visual check took screenshots, and a screenshot captures one instant. A blink happens between two screenshots, so the check could never see it. One correction prompt fixed it. The lesson generalizes: before you trust a loop, ask what its check physically can't observe. Animation timing, performance under load, and \"does this feel right\" all slip past a screenshot. Those are the spots where you keep a human look.",
          },
        ],
      },
      {
        heading: 'Making fuzzy goals checkable',
        blocks: [
          {
            type: 'text',
            md: "Code loops have it easy: tests pass or they don't. What about a goal like \"write good replies to my email\" or \"make this lesson read well\"? Marchese's answer is to **build a bridge from the fuzzy goal to a verdict a machine can read.** You write (or already have) a reviewer skill whose output always ends in a fixed form: APPROVED or NOT APPROVED, or a score from 1 to 10 with a passing line. The quality judgment stays fuzzy, but the loop only needs the last word, and the last word is binary.\n\nHe adds a pro tip that echoes the factory rule: let a different model do the reviewing when you can. A second model (Codex reviewing Claude's work, say) doesn't share the first model's habits, so its verdict is less biased. A subagent with a fresh context is the cheaper version of the same idea.",
          },
          {
            type: 'table',
            headers: ['Fuzzy goal', 'Bridge to a checkable verdict'],
            rows: [
              [
                'The code is good',
                'An /engineer-review skill reads the diff and ends with APPROVED or NOT APPROVED plus reasons',
              ],
              [
                'Every unread email has a good reply',
                'Every unread thread has a draft, and each draft passed a voice-check reviewer and a fact-check reviewer',
              ],
              [
                'The landing page matches the design',
                'A vision reviewer compares screenshots against mock.html and scores each checklist item',
              ],
              [
                'This lesson follows the style guide',
                'A grep for em dashes in the file finds zero, and a style reviewer returns APPROVED',
              ],
            ],
          },
          {
            type: 'text',
            md: "For goals that stay stubbornly fuzzy, Marchese's rule of thumb is to **break the loop into smaller goals with human checkpoints at the forks.** His example is planning a company party. Hand an intern \"plan the party\" and you could get anything. The decisions that shape everything else are the date, the venue, and the theme, so those are where you want to look before the work continues. Ask the same of any loop: at which points would a wrong turn ruin everything after it? Put a human checkpoint there and let the loop run free in between.\n\nHe also recommends what he calls **loop training mode**: for the first few runs of any new loop, have it pause before each step and wait for your approval (\"Quick check before I burn the tokens...\"). You learn what the loop actually does, you catch a bad step before it repeats twenty times, and once you trust it you switch training mode off.",
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
                'Every iteration starts from zero: the agent re-explores the repo, retries theories that already failed, and the token bill climbs with no progress',
                'Require the agent to read notes.md before starting and to append its findings and attempts on every pass',
              ],
              [
                'No subagent split',
                'One context does the research, the coding, and the review, and quality sags as the window fills with all three',
                'Isolate the phases: a research pass writes its findings to a file, then a fresh context implements from that file, and a separate reviewer checks the result',
              ],
              [
                'No stop condition',
                'The one that "bills you in your sleep": a check that can never pass loops at full burn all night',
                'A max-iterations guard, plus a budget ceiling, plus a failure exit path that hands the task to a human',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Where loops waste tokens',
            md: 'Watch for three token sinks. Re-reading the whole repo on every iteration (that means the memory file is missing). Re-sending an ever-growing transcript instead of starting fresh with notes. And looping on the same wrong theory because the check\'s failure output never reaches the next prompt. Feed the **failure detail** forward, never just "try again".',
          },
        ],
      },
      {
        heading: 'The honest costs',
        blocks: [
          {
            type: 'text',
            md: "Not every source is a fan. Cole Medin opens [his video](https://www.youtube.com/watch?v=UztrFXaSWv0) by saying he isn't sold, and his objections are the ones you'll hit in your own setup, so they're worth taking seriously.\n\n**Cost.** In a loop where an orchestrator plans, splits work across workers, reads their results, and plans the next round, every round means more reasoning and more context passed around. Medin's dashboard clocked one run at over a million tokens to build a fairly simple app. Part of the waste: built-in loops tend to use one model for every step, so you pay top-tier prices even for trivial decisions like \"is this issue a bug or a feature?\"\n\n**Context bloat.** /loop and /goal keep working inside one session. Run them long enough and the context window fills with old work, and the model's attention degrades with it.\n\n**Reliability.** Let a loop run for a day with no checkpoints and, he says, you often come back to junk.",
          },
          {
            type: 'text',
            md: "His fixes are all ways of taking decisions **away** from the model wherever you already know the answer:\n\n- **Fix the process in a workflow file.** The steps (classify, research, implement, validate, open PR) are written down and always run in order. The model writes code; it doesn't get to decide which tests count.\n- **Pick a model per step.** A cheap, small model handles classification and context loading; the expensive model only does the implementation and review.\n- **Run each step in its own session** and pass results forward through markdown files, so no single context gets overloaded.\n- **Store run state in a database** so a crash or a closed laptop resumes from the exact step it stopped on.\n- **Put human-approval pauses** inside the workflow wherever a wrong turn would be costly.\n\nIf that list sounds familiar, it should. It's the harness and graph thinking from [Agents, Harnesses & Loops · Graph Engineering](lesson:m2-l10) and the budget discipline from [Agents, Harnesses & Loops · Cost-Aware Agents & Guardrails](lesson:m2-l9). Medin's own conclusion is that loop engineering belongs under harness engineering more than it deserves its own buzzword.",
          },
          {
            type: 'text',
            md: "The Prompt Engineering channel names two more costs that no tool removes.\n\nThe **orchestration tax**: you can launch a hundred parallel loops, but you still have to review, understand, and merge what they produce. Your review bandwidth sets the real number of loops you can run, whatever the tool allows.\n\n**Comprehension debt**: a loop that runs on its own shows you the final result, and the gap between what shipped and what you understand grows quietly. Loud failures get noticed. The real danger is a quiet success you stopped following hundreds of commits ago, in code you're still responsible for.\n\nAnd one cost that's really an investment: **the seed prompt matters more now.** Prompting moved to the very start of the process. A vague spec used to cost you one bad answer you could correct. In a loop, a vague spec gets guessed at confidently, in the same wrong direction, over and over. Time spent sharpening the spec, the stop condition, and the test cases before you fire is the best-paid time in the whole process.",
          },
        ],
      },
      {
        heading: 'Loops in practice',
        blocks: [
          {
            type: 'text',
            md: 'Put it together and a sensible default looks like this. Use **/loop** for polling jobs, like babysitting CI or watching a deploy. Use **/goal** for a medium-sized job with a clear end state while you\'re nearby. Use a **shell loop** (or a proper workflow harness) for long, overnight, many-pass work, because the guard, the check, and the memory file are explicit and under your control.\n\nAnd keep perspective: **human-in-the-loop is still the strongest known setup**. Run a batch of loop iterations, review the result, correct the spec, fire again. The automation grinds through the iterations while you supply the judgment between batches.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'This pattern has a name: the Ralph loop',
            md: "You'll hear the exact loop you built in this lesson called a **Ralph loop** in the wild, after Geoffrey Huntley's 2025 post that named it for the Simpsons character. Same parts: a scratchpad for memory, a check that runs at the end, a re-prompt when the check fails, and one task per pass. The name stuck because the failure it fixes is so common. Left alone, a model assumes its reading of the task matches yours and declares victory early, which is why you end up typing 'keep going' over and over. The end-of-loop check is what forces a match against the real criteria before the loop is allowed to stop. Anthropic ships a Ralph-loop plugin you can crib from, and plenty of people write their own. A lighter cousin you'll also see is **PIV** (Plan, Implement, Verify), which comes back in [Token Economics & AI-Native SDLC · The AI-Native SDLC](lesson:m7-l2).",
          },
          {
            type: 'compare',
            left: {
              title: 'Prompting',
              items: [
                'You are the loop: you re-prompt by hand',
                'Quality depends on your attention',
                'The session dies when you sleep',
                'Done means you feel satisfied',
              ],
            },
            right: {
              title: 'Loop engineering',
              items: [
                'A program is the loop',
                'Quality depends on the check',
                'Runs unattended, inside a guard',
                'Done means the check passes (or the guard fires)',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Ship a guarded loop, then race it against /goal',
      intro:
        'Build the smallest real loop: a binary check, a memory file, and a hard cap. Watch what the agent does when nobody is steering. Then run the same job with /goal and compare the two.',
      steps: [
        'Pick a task with a machine-checkable outcome: a failing test, tsc exiting 0, a lint pass on a gnarly file. Run it through the four questions first.',
        'Write check.sh so it exits 0 only when that outcome is true. Run it now, before the agent touches anything: it must fail first.',
        'Write loop.sh modeled on the lesson: max 5 iterations, each calling claude -p with a prompt that references notes.md for prior attempts.',
        'Make the prompt require the agent to append an attempt summary to notes.md every iteration. That file is the loop memory.',
        'Fire it and do not intervene, even if iteration 2 looks wrong.',
        'Afterwards read notes.md: did later iterations build on earlier ones, or repeat them?',
        'Tally the cost with /cost or the console, and write down the tokens spent per iteration.',
        'Reset the task on a fresh branch (`git switch -c goal-run <commit before the loop>`). Open Claude Code in auto mode and run: `/goal ./check.sh exits 0. Show its output after every attempt. Or stop after 5 turns.`',
        'When it finishes, type `/goal` with no arguments and note the turn count and token spend. Compare against the shell loop: which was cheaper, and did the /goal judge ever call it done before check.sh actually passed?',
      ],
      checklist: [
        'check.sh failed before the run and passed after (or the guard fired and exited 1)',
        'The shell loop is physically incapable of running more than 5 iterations',
        'notes.md shows iteration-over-iteration memory, with no amnesia',
        'You know what one iteration costs in tokens and dollars',
        'You ran the same job with /goal and can say which approach you would pick next time, and why',
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
          'No notes.md means iteration N knows nothing about iterations 1 through N minus 1. You pay the full exploration cost on every pass, and dead-end theories get retried because nothing recorded that they already failed.',
      },
      {
        q: 'Why should a /goal condition name the exact check, like "npm test exits 0"?',
        options: [
          'The judge runs the command itself and needs the exact syntax',
          'The judge has no tools: it only reads what Claude has printed into the conversation, so the condition must be provable from that output',
          'Claude Code rejects conditions that contain no commands',
          'Naming a command switches the judge to a larger model',
        ],
        answer: 1,
        explain:
          'After each turn a small, fast model reads your condition plus the transcript and returns not yet met, met, or impossible. It never runs tests or opens files. "npm test exits 0" works because Claude runs the tests and the result appears in the transcript.',
      },
      {
        q: 'In the Level 2 feature factory, who verifies the builder subagent\'s work?',
        options: [
          'The builder itself, with one final re-read before it reports done',
          'A separate reviewer agent with a fresh context, briefed to assume the work has bugs',
          'The orchestrator, since it already holds the whole plan',
          'Nobody until the pull request reaches you',
        ],
        answer: 1,
        explain:
          'The agent that does the work never verifies it, because it shares its own blind spots. A fresh-context adversarial reviewer checks the branch, often against a clickable mock as the answer key, and failures go back to the builder. You still review the pull request at the end.',
      },
      {
        q: 'Why did the AI LABS walkthrough build the first version of the app (the MVP) without a loop?',
        options: [
          'Loops cannot create a new project from scratch',
          'A loop needs a definition of done up front, and at the MVP stage you do not know where the product is going yet',
          'The MVP was too large to fit in a /goal condition',
          'Loops only work on code that already has a test suite',
        ],
        answer: 1,
        explain:
          'Defining done for a product you have not figured out yet takes longer than building the rough first version by hand. Prompt your way to the MVP, then loop the features that come after it, once you can say what done looks like.',
      },
    ],
    resources: [
      {
        label: 'Claude Code docs - Keep Claude working toward a goal (/goal)',
        url: 'https://code.claude.com/docs/en/goal',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs - /loop and scheduling options',
        url: 'https://code.claude.com/docs/en/scheduled-tasks',
        kind: 'docs',
      },
      {
        label: 'Addy Osmani - Loop Engineering (the essay that named it)',
        url: 'https://addyosmani.com/blog/loop-engineering/',
        kind: 'article',
      },
      {
        label: 'Peter Steinberger - "designing loops that prompt your agents"',
        url: 'https://x.com/steipete/status/2063697162748260627',
        kind: 'thread',
      },
      {
        label: 'Boris Cherny on loops and team workflows',
        url: 'https://x.com/bcherny',
        kind: 'thread',
      },
      {
        label: 'Geoffrey Huntley - Ralph Wiggum as a "software engineer"',
        url: 'https://ghuntley.com/ralph/',
        kind: 'article',
      },
      {
        label: 'Yao et al. - ReAct: Synergizing Reasoning and Acting (2022)',
        url: 'https://arxiv.org/abs/2210.03629',
        kind: 'article',
      },
      {
        label: 'AI LABS - Every Level of Claude Code Loop Engineering Explained (23 min)',
        url: 'https://www.youtube.com/watch?v=PLyRe6Zk--8',
        kind: 'video',
      },
      {
        label: 'Austin Marchese - Stop Prompting Claude. Start Loop Engineering. (12 min)',
        url: 'https://www.youtube.com/watch?v=YAS4ojuhbW4',
        kind: 'video',
      },
      {
        label: 'Prompt Engineering - Loop Engineering: Why Everyone is Talking About Agentic Loops (11 min)',
        url: 'https://www.youtube.com/watch?v=7BrxIBkX3mg',
        kind: 'video',
      },
      {
        label: 'KodeKloud - What is Loop Engineering? (7 min)',
        url: 'https://www.youtube.com/watch?v=yvP_AAirOQc',
        kind: 'video',
      },
      {
        label: "Cole Medin - The Creators of Claude Code and OpenClaw Don't Prompt Their Agents Anymore?! (25 min)",
        url: 'https://www.youtube.com/watch?v=UztrFXaSWv0',
        kind: 'video',
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
    minutes: 55,
    xp: 100,
    objectives: [
      'Rank the four rungs of the verification escalation ladder and pick the right rung for a given task',
      'Write a task contract with binary, machine-checkable acceptance criteria',
      "Wire a Stop hook that blocks a premature 'done'",
      'Demand and check evidence instead of accepting agent assertions',
      'Verify the trajectory, not just the output, to catch a right-looking answer reached the wrong way',
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
          'It sits at the top of the best-practices list. An agent that can check its own work (tests, build, screenshot) converges on correct output. An agent that has no way to check converges on plausible output, which reads exactly like the real thing and is wrong more often.',
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
          'A binary signal leaves nothing to argue with and nothing to partially satisfy. A 1-to-10 rubric scored by the same model reintroduces exactly the optimism you were trying to remove.',
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
          "Weakest to strongest: a polite ask in the prompt, a per-turn graded evaluator, a deterministic gate, and finally an independent reviewer with a fresh context. Climb only as high as the task's risk demands.",
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
          'A Stop hook runs a deterministic check at the moment the agent tries to finish, and an exit code of 2 blocks the stop. The classic failure where the agent claims done while the tests are still red becomes structurally impossible.',
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
          'TDD, test-driven development: write the failing test before the code. The failing test works as the spec and the verification signal at the same time, and the agent loops until it goes green. No ambiguity about what done means.',
      },
    ],
    sections: [
      {
        heading: 'The single highest-value move',
        blocks: [
          {
            type: 'text',
            md: "Anthropic's best-practices doc leads with one tip, repeated more than any other: **give the agent a way to verify its own work**. An agent that can run the tests, compile the build, or screenshot the page and compare it to the mock will converge on correct output. An agent with no way to check converges on *plausible* output. Plausible is the dangerous one, because it reads exactly like correct and you can't tell them apart by reading.\n\nThe shape of the signal matters as much as its existence. You want **binary**: the tests pass or they don't, the build exits 0 or it doesn't. Why binary? Because models negotiate. Hand a model a 1-to-10 rubric to score itself and it will find a generous reading of every criterion. An exit code offers nothing to negotiate with.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Boris Cherny',
            md: 'Giving Claude a verification loop produces "2-3x the quality of the final result." Same model, same prompt. The entire multiplier lives in the check.',
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
              'Climb only as high as the task risk demands. A Stop hook is nearly free insurance, while a verification subagent costs a whole fresh context.',
          },
          {
            type: 'table',
            headers: ['Rung', 'Mechanism', 'Guarantee'],
            rows: [
              [
                'Same-prompt check',
                'A line in the prompt: "run the tests before saying done"',
                'A polite request. The model can skip it, and under pressure it will',
              ],
              [
                '/goal per-turn evaluator',
                'Progress gets graded against the stated goal on every turn',
                'Persistent pressure, but the grader is still a model, with model optimism',
              ],
              [
                'Stop hook',
                'A deterministic script runs when the agent tries to finish, and exit code 2 blocks the stop',
                'The agent structurally cannot claim done while the check is red',
              ],
              [
                'Verification subagent',
                'A fresh context reviews the work and the evidence',
                "Independent eyes that share none of the implementer's assumptions",
              ],
            ],
          },
          {
            type: 'text',
            md: 'Here\'s how the rungs feel in practice. Rung 1 is a sentence in your prompt: "run the tests before saying done". It works until the context gets long and the instruction fades from attention. Rung 2, the /goal evaluator, re-grades progress against your stated goal on every single turn, so the pressure never fades. The grader is still a model, though, and it inherits model optimism. Rung 3, the Stop hook, changes the game: when the agent tries to finish, a script you wrote runs the real checks, and if that script exits with code 2, the agent is forced to keep working. It literally cannot end the session while the tests are red. Rung 4 hires a second agent, with a fresh context, to review the first one\'s work the way a human reviewer would.',
          },
        ],
      },
      {
        heading: 'Verify the output, then verify the path',
        blocks: [
          {
            type: 'text',
            md: "Everything so far verifies the **output**: did the tests pass, did the build compile, does the screenshot match the mock. Call that Output Eval. It catches a wrong answer cold. It misses a sneakier failure, where the agent reaches a right-looking answer through a path you'd never sign off on. It hard-codes the expected value so the test goes green. It deletes the assertion that was failing. It patches the symptom in the UI while the data layer stays broken underneath. The output passes every check, and the method is rotten.\n\nGoogle's 2026 SDLC playbook names the fix directly: verify what the agent built **and** how it got there. Trajectory Eval grades the path. You, or a reviewer agent with a fresh context, read what the agent actually did: which files it touched, which tools it called, what it changed to turn the check green. This is exactly how reward hacking gets caught, where a model games the metric instead of doing the work.",
          },
          {
            type: 'compare',
            left: {
              title: 'Output Eval',
              items: [
                'Grades the final artifact',
                'Tests pass, build exits 0, screenshot matches',
                'Catches a plain wrong answer',
                'Cheap, binary, runs in a hook',
                'Blind to how the answer was reached',
              ],
            },
            right: {
              title: 'Trajectory Eval',
              items: [
                'Grades the steps the agent took to get there',
                'Which files, which tools, which edits, in what order',
                'Catches a right answer reached the wrong way: hard-coded values, deleted assertions, symptom patches',
                'Needs a reader: you or a reviewer subagent',
                'Sees anything the session log recorded',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why both, and in this order',
            md: 'Output Eval is your first gate because it is cheap and it is binary. Run it on every task. Reach for Trajectory Eval when a passing check is not enough proof on its own: money moves, data gets deleted, security is in scope, or the agent ran unattended for a long stretch. The reviewer subagent from rung 4 of the ladder is already the tool for it. Point it at the diff and the tool log, not just the final state.',
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
            md: "TDD ([test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)) is the twenty-year-old practice of writing the test before the code, and it maps onto agents almost perfectly, because the failing test is **the spec and the checker in one artifact**. The workflow: write a test that describes the behavior you want. You can have the agent write it, as long as you review it yourself, since a wrong test verifies the wrong thing. Run it and confirm it fails. That red result proves the test actually tests something. Now let the agent loop until the test goes green.\n\nDone stops being a judgment call: green means done, red means keep going. And the test outlives the task, guarding against regressions from then on. This is the highest signal-per-token verification you can buy.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" rx="8" fill="#18181b"/>
  <text x="350" y="30" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">TDD FOR AGENTS</text>
  <rect x="30" y="100" width="160" height="56" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="110" y="123" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">1. Write failing test</text>
  <text x="110" y="141" text-anchor="middle" fill="#a1a1aa" font-size="9">you, or the agent (you review)</text>
  <line x1="190" y1="128" x2="224" y2="128" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="222,124 222,132 230,128" fill="#71717a"/>
  <rect x="230" y="100" width="150" height="56" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="305" y="123" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">2. Confirm RED</text>
  <text x="305" y="141" text-anchor="middle" fill="#a1a1aa" font-size="9">proves the test tests something</text>
  <line x1="380" y1="128" x2="424" y2="128" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="422,124 422,132 430,128" fill="#71717a"/>
  <rect x="430" y="100" width="240" height="56" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/>
  <text x="550" y="123" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">3. Agent edits, runs test</text>
  <text x="550" y="141" text-anchor="middle" fill="#a1a1aa" font-size="9">loops on its own</text>
  <polyline points="610,100 610,55 490,55 490,92" fill="none" stroke="#f472b6" stroke-width="1.5"/>
  <polygon points="486,90 494,90 490,98" fill="#f472b6"/>
  <text x="550" y="48" text-anchor="middle" fill="#f472b6" font-size="9">still red: edit again</text>
  <line x1="550" y1="156" x2="550" y2="200" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="546,198 554,198 550,206" fill="#34d399"/>
  <text x="562" y="185" fill="#34d399" font-size="9">test passes</text>
  <rect x="430" y="206" width="240" height="56" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="550" y="229" text-anchor="middle" fill="#e4e4e7" font-size="11" font-weight="bold">GREEN: done</text>
  <text x="550" y="247" text-anchor="middle" fill="#a1a1aa" font-size="9">the test stays on as a regression guard</text>
  <text x="200" y="240" fill="#a1a1aa" font-size="10">Done stops being a judgment call:</text>
  <text x="200" y="256" fill="#a1a1aa" font-size="10">red means keep going, green means stop.</text>
</svg>`,
            caption:
              'The failing test is the spec and the checker in one artifact. Confirming red before the agent starts is the step people skip, and it is the step that makes green mean something.',
          },
        ],
      },
      {
        heading: 'Contracts: verification as an artifact',
        blocks: [
          {
            type: 'text',
            md: 'systematicls\'s contract-based tasking turns verification into a file that travels with the task. Every task gets a companion file named **{Task}_CONTRACT.md** listing acceptance criteria and testing requirements, and a Stop hook runs the contract\'s checks and blocks completion until they pass.\n\nA cultural rule ships with the mechanism: demand evidence instead of accepting assertions. When the agent says "tests are passing", that sentence counts for nothing. Pasted test output, an exit code, a screenshot: those count, because you (or a hook) can re-check them independently.',
          },
          {
            type: 'code',
            lang: 'markdown',
            caption: 'A contract: binary criteria, evidence required, enforceable by a Stop hook.',
            code: `# CHECKOUT_FIX_CONTRACT.md

## Task
Fix the rounding bug in cart totals for mixed-currency orders.

## Acceptance criteria (all binary)
- [ ] npm test -- cart passes with 0 failures
- [ ] npx tsc --noEmit exits 0
- [ ] New regression test exists: src/cart/rounding.test.ts
- [ ] No files outside src/cart/ modified (git diff --stat proves it)

## Testing requirements
Run the full cart suite, with the new test included.

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
        'Pick one real task, small enough for a single session and real enough to matter.',
        'Write TASK_CONTRACT.md: the task statement, 3 to 6 acceptance criteria, and testing requirements, modeled on the lesson example.',
        'Audit each criterion ruthlessly: if two engineers could disagree about whether it is met, rewrite it as a command plus an expected exit code or output.',
        "Start a fresh Claude Code session with: 'Fulfill TASK_CONTRACT.md. You are not done until every criterion has pasted evidence.'",
        'When the agent claims done, re-run at least two of the evidence commands yourself and compare.',
        "Optional hardening: add a Stop hook that runs the contract's test commands and exits 2 on failure, then try to get the agent to finish early. It should be impossible.",
      ],
      checklist: [
        'Every acceptance criterion is binary: a command plus an expected result',
        'The agent produced pasted evidence, with no bare assertions accepted',
        'You re-ran at least two evidence commands and they passed',
        'You can name which rung of the escalation ladder this setup reaches',
      ],
    },
    checkQuiz: [
      {
        q: 'A {Task}_CONTRACT.md contains, at minimum:',
        options: [
          'A story-point estimate and an assignee',
          'Acceptance criteria plus testing requirements, with a Stop hook gating completion until they pass',
          'The full implementation plan, file by file',
          'A rollback procedure and an on-call rotation',
        ],
        answer: 1,
        explain:
          'The contract is the verification artifact: binary acceptance criteria plus required tests, enforced by a Stop hook that blocks completion until they pass. Plans and estimates live in other documents.',
      },
      {
        q: "Cherny's claimed multiplier from adding a verification loop:",
        options: ['10-20% better', 'About 50% better', '2-3x the quality', 'No measurable change, but cheaper'],
        answer: 2,
        explain:
          '"2-3x the quality of the final result", with the same model and the same prompt. The whole delta comes from the agent checking its own work against a real signal instead of stopping at plausible.',
      },
      {
        q: 'Demanding evidence instead of assertions cashes out as:',
        options: [
          'Asking the agent to rate its confidence 1-10',
          'Requiring pasted command output, screenshots, or exit codes; a claim without output does not count',
          'Having the agent explain its reasoning step by step',
          'Requiring the agent to cite documentation',
        ],
        answer: 1,
        explain:
          'Reasoning and confidence scores are still assertions. Evidence means an artifact a human or a hook can independently re-check: pasted command output, a screenshot, an exit code.',
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
          'The implementer context knows what it meant to do, so it grades itself generously. A fresh context evaluates only what actually exists on disk, the same way human code review catches what the author can no longer see.',
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
    minutes: 55,
    xp: 100,
    objectives: [
      'Choose among orchestrator-workers, sectioning, voting, and evaluator-optimizer for a given task',
      'Run a council-style adversarial review with anonymized blind peer scoring',
      'Write neutral prompts that report what exists instead of manufacturing findings',
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
          'One agent generates, a second critiques the output against explicit criteria, and they loop until the criteria pass. Reach for it when clear evaluation criteria exist and iteration measurably helps, as in translation, search refinement, and drafting.',
      },
      {
        q: 'Why does the LLM Council anonymize advisor responses before peer review?',
        options: [
          'To reduce prompt length',
          'So models grade ideas rather than authors, countering sycophancy and authority bias',
          'To comply with model provider terms',
          'To prevent context contamination between advisors',
        ],
        answer: 1,
        explain:
          'The anonymization is the load-bearing part. A reviewer that knows which answer came from the "senior" persona, or that recognizes its own answer, grades the author instead of the argument. Strip the names and only the ideas are left to judge.',
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
          'The detector deliberately casts a wide net and proposes a superset of candidate bugs. The adversarial refuter, carrying penalty incentives, tries to knock every finding down. The judge keeps whatever survives the attack.',
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
          'Leading prompts manufacture findings: ask a model for bugs and it will hand you bugs, real or invented, because you asked. "Report all situations discovered" lets the model report what is actually there, including nothing.',
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
          'Sequential, same-file work is the canonical bad fit. The agents merge-conflict with each other, every step waits on the previous one anyway, and no isolation win pays for the coordination cost.',
      },
    ],
    sections: [
      {
        heading: "When one context isn't enough",
        blocks: [
          {
            type: 'text',
            md: 'Multi-agent means running several model contexts on one problem instead of a single long session. It buys exactly two things. **Isolated contexts**: each agent gets a fresh window, so no single window has to hold everything. **Diverse perspectives**: contexts that haven\'t read each other\'s reasoning can\'t inherit each other\'s blind spots. It costs tokens (you\'re paying for N contexts) and coordination (the results have to be merged back together).\n\nAnthropic\'s "Building Effective Agents" names the canonical shapes. Learn them as a decision table: given this task, which shape pays for itself?',
          },
          {
            type: 'table',
            headers: ['Pattern', 'Shape', 'Reach for it when'],
            rows: [
              [
                'Orchestrator-workers',
                'A lead agent decomposes the task at runtime and spawns workers that execute in parallel, isolated contexts',
                'The subtasks cannot be predicted up front, as in open-ended research or a multi-file feature',
              ],
              [
                'Parallelization: sectioning',
                'You predefine independent splits and run them simultaneously',
                'The chunks genuinely do not depend on each other: per-module review, batch processing',
              ],
              [
                'Parallelization: voting',
                'The same task runs N times, and you keep the consensus or the union',
                'One verifiable question or judgment call, as in vulnerability triage or diagnosing a flaky test',
              ],
              [
                'Evaluator-optimizer',
                'A generator and a critic loop until the criteria pass',
                'Clear evaluation criteria exist and iteration visibly improves the result',
              ],
            ],
          },
          {
            type: 'text',
            md: 'A concrete run of orchestrator-workers: you ask for "research these 8 charting libraries and recommend one". The lead agent reads the request, decides on one worker per library, and spawns 8 workers in parallel, each with a fresh context and a single library to investigate. Each worker returns a short summary. The lead reads the 8 summaries (a few thousand tokens instead of 8 full research sessions) and writes the comparison. No single context ever held all the raw reading, which is the whole point.',
          },
        ],
      },
      {
        heading: 'Adversarial patterns: engineering disagreement',
        blocks: [
          {
            type: 'text',
            md: "Ask a single model to review your plan and it will mostly agree with you. That tendency is called sycophancy, and it comes from training: models learn that agreeable answers get rated higher by humans. For decisions that matter, agreement on tap is poison.\n\nThe **LLM Council** (Ole Lehmann's build of a pattern Karpathy sketched) engineers disagreement instead. Five personas answer the same brief independently: the **Contrarian** (attacks the premise), **First Principles** (rebuilds the problem from scratch), the **Expansionist** (asks what bigger thing this could become), the **Outsider** (brings another industry's view), and the **Executor** (cares only about shipping). Their five answers get stripped of names, and each advisor blind-reviews the others, ranking and critiquing without knowing who wrote what. A **Chairman** agent then reads the rankings and critiques and writes the synthesis, with dissent kept on the record.\n\nWhy the anonymization step carries the load: a reviewer that knows which answer came from the \"senior\" persona, or that recognizes its own answer, grades the author instead of the argument. Strip the names and only the ideas are left to grade.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" rx="8" fill="#18181b"/>
  <text x="350" y="28" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">LLM COUNCIL: engineered disagreement</text>
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
  <text x="350" y="250" text-anchor="middle" fill="#a1a1aa" font-size="9">names stripped so ideas get graded</text>
  <line x1="350" y1="264" x2="350" y2="304" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="346,302 354,302 350,310" fill="#71717a"/>
  <rect x="250" y="310" width="200" height="54" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="350" y="333" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">CHAIRMAN</text>
  <text x="350" y="350" text-anchor="middle" fill="#a1a1aa" font-size="9">synthesis + recorded dissent</text>
  <text x="350" y="388" text-anchor="middle" fill="#a1a1aa" font-size="10">sycophancy has nowhere to hide</text>
</svg>`,
            caption:
              'Five personas answer independently, review each other blind, and a Chairman synthesizes. The anonymization step is what keeps the disagreement honest.',
          },
        ],
      },
      {
        heading: 'Adversarial bug detection',
        blocks: [
          {
            type: 'text',
            md: 'Point the same adversarial logic at code review and you get the 3-agent bug detection pipeline. Agent one, the **detector**, reads the code with instructions to report everything suspicious. It over-reports on purpose: the goal is a superset, real bugs and false alarms mixed together. Agent two, the **adversarial refuter**, receives each finding along with a stated penalty for waving false positives through. It attacks every claim: "this null check looks missing, but the caller validates on line 40, so the finding is wrong". Agent three, the **judge**, reads each finding plus its attempted refutation and rules on what survives.\n\nThe pipeline works because of instruction-following bias: tell a model its job is refutation and it genuinely tries to refute, with an energy that "please double-check your list" never gets out of the model that wrote the list.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="280" rx="8" fill="#18181b"/>
  <text x="350" y="34" text-anchor="middle" fill="#e4e4e7" font-size="14" font-weight="bold">3-AGENT ADVERSARIAL BUG DETECTION</text>
  <rect x="40" y="70" width="180" height="76" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/>
  <text x="130" y="97" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">DETECTOR</text>
  <text x="130" y="116" text-anchor="middle" fill="#a1a1aa" font-size="9">over-reports on purpose:</text>
  <text x="130" y="131" text-anchor="middle" fill="#a1a1aa" font-size="9">a superset of findings</text>
  <line x1="220" y1="108" x2="252" y2="108" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="250,104 250,112 258,108" fill="#71717a"/>
  <rect x="260" y="70" width="180" height="76" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/>
  <text x="350" y="97" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">REFUTER</text>
  <text x="350" y="116" text-anchor="middle" fill="#a1a1aa" font-size="9">attacks every finding,</text>
  <text x="350" y="131" text-anchor="middle" fill="#a1a1aa" font-size="9">penalized for going easy</text>
  <line x1="440" y1="108" x2="472" y2="108" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="470,104 470,112 478,108" fill="#71717a"/>
  <rect x="480" y="70" width="180" height="76" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/>
  <text x="570" y="97" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="bold">JUDGE</text>
  <text x="570" y="116" text-anchor="middle" fill="#a1a1aa" font-size="9">rules on what</text>
  <text x="570" y="131" text-anchor="middle" fill="#a1a1aa" font-size="9">survives the attack</text>
  <line x1="570" y1="146" x2="570" y2="190" stroke="#71717a" stroke-width="1.5"/>
  <polygon points="566,188 574,188 570,196" fill="#71717a"/>
  <rect x="480" y="196" width="180" height="44" rx="8" fill="#27272a" stroke="#52525b"/>
  <text x="570" y="223" text-anchor="middle" fill="#e4e4e7" font-size="11">verified findings</text>
  <text x="350" y="264" text-anchor="middle" fill="#a1a1aa" font-size="10">instruction-following bias does the work: told to refute, the model genuinely tries</text>
</svg>`,
            caption:
              'Wide net, hostile filter, neutral ruling. Each role gets a fresh context and an incentive that fits its job.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Neutral prompting',
            md: '"Report all situations discovered in this code" outperforms "find the bugs in this code." A leading prompt manufactures findings: ask a model for bugs and you will receive bugs, whether or not they exist. Neutral wording costs nothing, and the benefit compounds through every downstream agent that consumes the report.',
          },
          {
            type: 'text',
            md: 'The same trio shape also works pointed forward instead of backward. In the **plan, build, judge** loop, a planner agent writes the spec, a builder implements it in a fresh context, and a judge gates the result against the plan before it ships. The demo version of that pipeline takes an app from idea to running in about 40 minutes.',
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
                'Same-file edits, where agents merge-conflict like people but faster',
                'Tasks one context comfortably holds',
                'Anywhere the coordination cost exceeds the isolation win',
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
            md: 'The council and the refuter are cheap next to one bad architecture decision, so spend on adversarial review where the decision is expensive. The reverse holds too: five agents on a sequential one-file task is pure overhead wearing a futuristic costume.',
          },
        ],
      },
    ],
    lab: {
      title: 'Run a council over a real decision',
      intro:
        'Install a council skill or hand-build one, then point it at a decision you are actually facing. You are testing whether engineered disagreement surfaces anything your single-session habit misses.',
      steps: [
        "Pick a real decision you're currently facing: an architecture choice, a tooling bet, buy-versus-build.",
        'Install a council skill (npx skills add aiwithremy/claude-skills-llm-council, or clone ngmeyer/council-review), or commit to hand-building the flow.',
        'Hand-built version: run 5 separate Claude sessions, one persona each (Contrarian, First Principles, Expansionist, Outsider, Executor), all given the identical, neutrally worded brief.',
        'Strip the names from the 5 answers, then hand the anonymized set to each advisor for blind peer review: rank the OTHER responses and critique the strongest one.',
        'Run a Chairman pass: synthesize the rankings and critiques into one recommendation, with dissent explicitly recorded.',
        'Control run: ask a plain single session the same brief. Diff the two outputs and note what the council surfaced that the single pass missed.',
      ],
      checklist: [
        '5 advisor responses generated from a neutral, non-leading brief',
        'Peer review was blind: no advisor knew who wrote what',
        'Chairman output records at least one dissenting view',
        'You can name one concrete insight the single-model answer missed',
      ],
    },
    checkQuiz: [
      {
        q: 'What actually separates orchestrator-workers from parallelization by sectioning?',
        options: [
          'Orchestrator-workers is always cheaper',
          'The orchestrator decomposes the task dynamically at runtime; sectioning uses splits you predefined',
          'Sectioning requires identical worker models',
          'Orchestrator-workers cannot run workers in parallel',
        ],
        answer: 1,
        explain:
          "The fan-out picture looks the same, but the brain differs. Use sectioning when you already know the independent chunks. Use orchestrator-workers when figuring out the decomposition is itself part of the model's job.",
      },
      {
        q: 'Voting-style parallelization fits best when:',
        options: [
          'The subtasks depend on each other',
          'You need diverse samples on one judgment call (like flagging vulnerabilities) and take the consensus',
          'The task requires editing one shared file',
          'You want to minimize total token spend',
        ],
        answer: 1,
        explain:
          'Voting spends N times the tokens to buy confidence on a single question. Independent samples make independent mistakes, so the consensus filters out individual-run noise.',
      },
      {
        q: 'Which of these is an actual LLM Council persona?',
        options: ['The Moderator', 'The Historian', 'The Expansionist', 'The Optimist'],
        answer: 2,
        explain:
          'The five are Contrarian, First Principles, Expansionist, Outsider, and Executor, chosen to pull the analysis in genuinely different directions rather than five flavors of agreement.',
      },
      {
        q: 'Why give the refuter penalty incentives in 3-agent bug detection?',
        options: [
          'To make it produce shorter reports',
          "So refutation is genuine, exploiting instruction-following bias to actually filter the detector's false positives",
          'To keep it from proposing new bugs',
          'To reduce its context usage',
        ],
        answer: 1,
        explain:
          'Without stakes, a reviewer model politely agrees with whatever it reads. A stated penalty for letting false positives through makes the refuter genuinely fight each finding, and that fight is the entire filtering mechanism.',
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
