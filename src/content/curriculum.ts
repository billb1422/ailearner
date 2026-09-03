import type { Module } from '../types'
import { lessons as m0Lessons } from './modules/m0'
import { lessons as m1aLessons } from './modules/m1a'
import { lessons as m1bLessons } from './modules/m1b'
import { lessons as m2aLessons } from './modules/m2a'
import { lessons as m2bLessons } from './modules/m2b'
import { lessons as m3Lessons } from './modules/m3'
import { lessons as m4Lessons } from './modules/m4'
import { lessons as m5Lessons } from './modules/m5'
import { lessons as m6Lessons } from './modules/m6'
import { lessons as m7Lessons } from './modules/m7'
import { lessons as m8Lessons } from './modules/m8'
import { lessons as m9Lessons } from './modules/m9'
import { lessons as m10Lessons } from './modules/m10'

export const MODULES: Module[] = [
  {
    id: 'm0',
    title: 'Mental Models',
    emoji: '🧭',
    color: '#38bdf8',
    tagline: 'How LLMs, agents, and token economics actually work',
    days: 'Days 1–3',
    lessons: m0Lessons,
    boss: {
      title: 'Draw the Map',
      description:
        "Teach it to prove you know it. Produce a one-page visual (hand-drawn, Excalidraw, or AI-assisted) that maps this module's mental models: how an LLM actually works, where context engineering fits, and the jump from vibe coding to agentic engineering. Add a back-of-envelope cost model for one real AI workload you care about. Show it to one other person, or present it to Claude and ask for a brutal critique. (You draw the full model → harness → loop stack later, in the Agents, Harnesses & Loops boss, once those two layers are actually yours.)",
      requirements: [
        'One-page visual exists covering how an LLM works, where context engineering fits, and the vibe-to-agentic shift',
        'It includes a worked cost estimate for a real workload (model tier, input/output tokens, caching)',
        'You presented it to a person or to Claude-as-critic and incorporated at least one correction',
      ],
      xp: 250,
      badgeId: 'boss-m0',
    },
  },
  {
    id: 'm1',
    title: 'Claude Code Mastery',
    emoji: '⌨️',
    color: '#a78bfa',
    tagline: 'CLAUDE.md, skills, hooks, subagents, and MCP: configuration as leverage',
    days: 'Days 4–8',
    lessons: [...m1aLessons, ...m1bLessons],
    boss: {
      title: 'Rig Your Ride',
      description:
        'Build the daily-driver setup you will actually use: a pruned CLAUDE.md, two custom skills for workflows you repeat, one verification hook, and one subagent. Then run a real task end-to-end through it.',
      requirements: [
        'Project CLAUDE.md written and pruned (<200 lines, only rules that prevent real mistakes)',
        'Two custom skills created for recurring workflows, committed to version control',
        'One hook installed that enforces something automatically (e.g. blocks a bad command or runs a formatter)',
        'One custom subagent defined in .claude/agents/ and used for a real delegation',
        'A real multi-step task completed through this setup, using plan mode first',
      ],
      xp: 250,
      badgeId: 'boss-m1',
    },
  },
  {
    id: 'm2',
    title: 'Agents, Harnesses & Loops',
    emoji: '🔁',
    color: '#f472b6',
    tagline: 'The expert core: harness design, loop engineering, multi-agent patterns',
    days: 'Days 9–13',
    lessons: [...m2aLessons, ...m2bLessons],
    boss: {
      title: 'Build a Loop',
      description:
        "Ship a working verification loop: write a task contract with acceptance criteria, then set up an agent that iterates until a real programmatic check passes, and cannot stop before it does. Then, now that all three layers are finally yours, draw the one-page stack map you deferred back in Module 0: model → harness → loop, showing where context engineering sits.",
      requirements: [
        'A CONTRACT.md (or SPEC.md) exists with explicit acceptance criteria and testing requirements',
        'The agent has a real binary pass/fail check: tests, build, or screenshot diff',
        'A Stop hook (or equivalent gate) blocks completion until the check passes',
        'The loop ran end-to-end at least once: agent worked, failed the check, iterated, then passed',
        'You wrote down the loop’s stop condition and its cost guardrail (max turns or budget)',
        'A one-page stack map exists: model → harness → loop, showing where context engineering fits (the map deferred from the Draw the Map boss)',
      ],
      xp: 250,
      badgeId: 'boss-m2',
    },
  },
  {
    id: 'm3',
    title: 'AI-Assisted Design',
    emoji: '🎨',
    color: '#fb923c',
    tagline: 'DESIGN.md, design skills, and taste you can encode',
    days: 'Days 14–16',
    lessons: m3Lessons,
    boss: {
      title: 'Ship a Screen',
      description:
        'Design and build one genuinely polished screen (landing page, dashboard, or app screen) driven by a DESIGN.md and at least one design skill, with zero AI tells.',
      requirements: [
        'DESIGN.md written BEFORE building (palette, type scale, spacing, component rules)',
        'At least one design skill used (e.g. apple-design, a grid-system skill, or your own)',
        'Visual iteration used screenshots or the Chrome/vision loop, not just text feedback',
        'No AI tells: no default Inter+Lucide+purple-gradient look; fonts and icons chosen deliberately',
        'You compared it against a reference (Dribbble/Mobbin/real product) and closed the gap',
      ],
      xp: 250,
      badgeId: 'boss-m3',
    },
  },
  {
    id: 'm4',
    title: 'Local Models',
    emoji: '💻',
    color: '#34d399',
    tagline: 'Run open models on your own hardware, and know when to',
    days: 'Days 17–18',
    lessons: m4Lessons,
    boss: {
      title: 'Homelab',
      description:
        'Stand up a local model and make an evidence-based call: benchmark it against a frontier model on three of YOUR real tasks, and document the hybrid split you would actually use.',
      requirements: [
        'A local model running via Ollama, LM Studio, or MLX on your machine',
        'Three real tasks run on both the local model and a frontier model, outputs compared',
        'Notes on speed, quality, and cost for each',
        'A written hybrid policy: which of your workloads go local vs frontier, and why',
        'The policy is enforced by something other than memory: shell aliases, a Plan/Act model split, or a routing gateway, plus one unconditional repository rule',
      ],
      xp: 250,
      badgeId: 'boss-m4',
    },
  },
  {
    id: 'm5',
    title: 'RAG',
    emoji: '🔎',
    color: '#fbbf24',
    tagline: 'Retrieval done right: hybrid search, reranking, agentic RAG',
    days: 'Days 19–20',
    lessons: m5Lessons,
    boss: {
      title: 'Ask Your Docs',
      description:
        'Build a small but real RAG system over your own notes or documents, with citations. Then evaluate it honestly on ten real questions.',
      requirements: [
        'Corpus ingested: chunked, embedded, and stored (Chroma/pgvector/or hosted)',
        'Queries return answers WITH citations to source chunks',
        'Ten real questions evaluated; hits/misses recorded',
        'At least one improvement iteration made (chunking, hybrid search, or reranking) with before/after notes',
        'A one-paragraph verdict: for this corpus, was RAG the right call vs long context?',
      ],
      xp: 250,
      badgeId: 'boss-m5',
    },
  },
  {
    id: 'm6',
    title: 'Fine-Tuning',
    emoji: '🧬',
    color: '#f87171',
    tagline: 'LoRA, distillation, and the discipline of when not to',
    days: 'Day 21',
    lessons: m6Lessons,
    boss: {
      title: 'Alchemy',
      description:
        'Produce a credible fine-tuning plan for one style/format task, or actually run a small LoRA on your Mac with MLX. Either way, the eval set is the deliverable.',
      requirements: [
        'A task chosen where fine-tuning is genuinely the right tool (behavior/format, not knowledge)',
        'An eval set of at least 20 input→expected-output examples',
        'A dataset plan (or actual dataset) with source and size justified',
        'Either a completed MLX LoRA run OR a full written plan (base model, method, cost estimate, hosted vs local)',
        'A go/no-go recommendation with reasoning',
      ],
      xp: 250,
      badgeId: 'boss-m6',
    },
  },
  {
    id: 'm7',
    title: 'Token Economics & AI-Native SDLC',
    emoji: '📐',
    color: '#22d3ee',
    tagline: 'Price the loop, then restructure how software gets built',
    days: 'Day 22',
    lessons: m7Lessons,
    boss: {
      title: 'Price the Loop',
      description:
        'Turn agent spend from a mystery into a number, then write the operating doctrine that governs how you spec, delegate, verify, and review agent work.',
      requirements: [
        'A cost model (spreadsheet or doc) for your expected monthly agent usage, with the plan-vs-API call and the daily number that justifies it',
        'Your personal AI-native SDLC doctrine written down: when you spec, when you delegate, how you verify, and what you always review by hand',
        'One workflow you repeat converted into a reusable command or skill, committed to version control (the "prompt it three times, then make it a command" rule)',
        'A six-layer cost breakdown for one AI feature you have shipped or specced, with the tag set you would attach to every call and a cost-per-outcome number',
      ],
      xp: 250,
      badgeId: 'boss-m7',
    },
  },
  {
    id: 'm8',
    title: 'The AI Transformation Playbook',
    emoji: '🏢',
    color: '#818cf8',
    tagline: 'Where AI belongs in a business, and launching the capstone you keep',
    days: 'Day 22',
    lessons: m8Lessons,
    boss: {
      title: 'Launch Master',
      description:
        'Run the transformation playbook on one real role or business, then start the capstone you will actually keep running after the course ends.',
      requirements: [
        'One real role or business split into front stage and back stage, with its back-stage tasks listed',
        'At least five of those tasks sorted into the AAA layers (automation, augmentation, autonomy), with any no-go zones flagged and defended',
        'One digital employee spec written as brain plus skills plus tools, with a success metric attached',
        'Capstone track chosen on the Capstone page and its first requirement started',
      ],
      xp: 250,
      badgeId: 'boss-m8',
    },
  },
  {
    id: 'm9',
    title: 'Bonus: Your Own Model Server',
    emoji: '🖥️',
    color: '#2dd4bf',
    tagline: 'Dense vs MoE, quantization, bandwidth math, and coding against a Mac mini in your closet',
    days: 'Bonus · after Day 22',
    bonus: true,
    lessons: m9Lessons,
    boss: {
      title: 'Serve the Brain',
      description:
        'Turn a Mac into a real model server and prove it works from a machine that is not it. Stand the server up so it survives a reboot, benchmark what your hardware can actually do, reach it from off your home network, and drive a coding agent against it end to end. The deliverable is a working setup plus an honest verdict on where its edges are.',
      requirements: [
        'A sizing table exists for your hardware: RAM budget, bandwidth, and predicted tokens/sec for at least six model shapes',
        'Measured benchmarks for three models with time-to-first-token and tokens/sec recorded separately, at a short and a 10K-token prompt',
        'The server binds to the network on boot with no manual start, and a keep-alive and context length set deliberately',
        'A second machine reached the model over a mesh VPN while off the home network',
        'One real coding task completed through an agent driving the local model, verified by GPU load on the server',
        'The same task run on a frontier model, with all timings and quality differences written down',
        'local-coding-setup.md exists with each tool config, the truncated-context failure signature, and three task classes routed to the server',
      ],
      xp: 300,
      badgeId: 'boss-m9',
    },
  },
  {
    id: 'm10',
    title: 'Bonus: Field Notes',
    emoji: '📼',
    color: '#a3e635',
    tagline: 'Four arguments worth stealing: a harness where everything is a plugin, a gauntlet that replaces steering with gates, a way to harvest configs you did not write, and eleven small fixes with the research behind them',
    days: 'Bonus · after Day 22',
    bonus: true,
    lessons: m10Lessons,
    boss: {
      title: 'Steal All Four',
      description:
        'Take one idea from each lesson and land it in a repo you actually work in. From the harness lesson: prove you can see what your agent did, end to end, and replace one layer you were told was fixed. From the gauntlet lesson: retire a steering rule by turning it into a check that fails the build, then verify your tests assert rather than merely execute. From the harvest lesson: import one workflow you did not write, through a clean room, and grade it against a bar you set before you went looking. From the small-fixes lesson: measure where your tokens and your stale rules actually went, then run a session through a hand-written handoff and a fresh reviewer instead of a compaction and a self-check.',
      requirements: [
        'One agent run read end to end from an event log or trajectory, with two findings written down that a chat UI would have hidden',
        'One harness layer swapped or disabled deliberately (a provider, a tool, a UI panel), and the config change committed',
        'Your rules file audited: every rule sorted into checkable versus judgment, with the counts recorded',
        'At least one rule deleted from the rules file and replaced by a script that exits non-zero on violation, wired into a hook or pre-commit',
        'CRAP computed by hand for the five worst functions in one repo, with a defended threshold written down',
        'A mutation tester run on one module, with three surviving mutants read and explained',
        'A two-stage handoff completed on a real task, with wall-clock, token spend, and quality compared against doing it in one session',
        'One harvest cycle completed on a real recurring job: pass conditions written before searching, three sources labeled by tier, fetching done in a session with no credentials and no outbound channel',
        'The adapted config read line by line with anything unrequested marked, then run once on safe inputs with the narrowest tool grant',
        'A keep-or-kill decision recorded with its margin, and a killed import actually deleted',
        'A one-page verdict naming which of the four philosophies fits your work, and the one thing you rejected from each',
        'A drift audit run on your own rules file, with the count of stale references recorded, at least one of them fixed, and the weekly /usage share spent on four or more parallel sessions written down',
        'One long session ended with a hand-written handoff instead of a compaction, finished by a fresh session that then reviewed the diff and caught something the writing session had called fine',
      ],
      xp: 300,
      badgeId: 'boss-m10',
    },
  },
]
