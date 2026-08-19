import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // m0-l1 — How LLMs Actually Work
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l1',
    title: 'How LLMs Actually Work',
    day: 1,
    minutes: 50,
    xp: 100,
    objectives: [
      'Explain next-token prediction and why an LLM is a sampler, not a database',
      'Predict roughly how much a file will cost in tokens before pasting it',
      'Trace the training pipeline (pretraining → SFT → RLHF) and name what each stage adds',
      'Anticipate where hallucination and context rot will bite, and design around both',
    ],
    skipQuiz: [
      {
        q: 'A pretrained base model — before SFT and RLHF — is best described as:',
        options: [
          'A database of facts with a natural-language query interface',
          'An autocomplete engine: it samples plausible next tokens given the context',
          'A rule-based reasoner over a curated knowledge graph',
          'A search index over its training documents',
        ],
        answer: 1,
        explain:
          'Base models are trained on one objective: predict the next token. Everything that looks like knowledge or reasoning emerges from that, which is why outputs are plausible rather than guaranteed true.',
      },
      {
        q: 'Why does model quality degrade as the context window fills ("context rot")?',
        options: [
          'Older tokens are silently deleted once the window is half full',
          'Positional encodings overflow past 100k tokens',
          'Attention is spread across n² pairwise token interactions — signal dilutes as the window fills',
          'The tokenizer switches to a coarser vocabulary for long inputs',
        ],
        answer: 2,
        explain:
          'Every token attends to every other token. As n grows, the attention budget is stretched across quadratically more relationships, so retrieval of any one fact gets noisier.',
      },
      {
        q: 'The deepest reason LLMs hallucinate is:',
        options: [
          "Training rewards a confident, plausible continuation — 'I don't know' was rarely the best next token in the data",
          'Insufficient training data about the topic',
          'Floating-point rounding errors accumulate over long generations',
          'The context window truncated the relevant facts',
        ],
        answer: 0,
        explain:
          'The pretraining objective pays for plausibility, not truth. Post-training reduces this but cannot eliminate it — the model has no built-in fact/fiction boundary.',
      },
      {
        q: 'What does RLHF add on top of supervised fine-tuning (SFT)?',
        options: [
          'Knowledge of events after the training cutoff',
          'A larger context window',
          'The ability to call external tools',
          'Optimization against human preference rankings, rather than pure imitation of example answers',
        ],
        answer: 3,
        explain:
          'SFT imitates demonstrations; RLHF optimizes a reward learned from humans ranking outputs. That is what pushes models toward helpful, honest, non-toxic behavior.',
      },
      {
        q: 'You paste 10KB of JSON logs and 10KB of English prose. Token counts?',
        options: [
          'Roughly equal — tokens track bytes',
          'The JSON usually costs far more — repeated keys, punctuation, and numbers fragment into many small tokens',
          'The prose costs more — natural language is less compressible',
          'The JSON costs less — braces and quotes collapse into single tokens',
        ],
        answer: 1,
        explain:
          'Tokenizers are optimized for natural language (~4 chars/token in English). Structured data with repeated keys, quotes, and digits tokenizes much less efficiently — often 2-3× worse.',
      },
    ],
    sections: [
      {
        heading: 'Tokens, not words',
        blocks: [
          {
            type: 'text',
            md: 'The model never sees words, files, or characters. It sees **tokens** — subword chunks from a fixed ~100k-entry vocabulary. Everything you will do this month — pricing, context budgets, caching, agent-loop math — is denominated in tokens. Build the intuition now; it compounds daily.',
          },
          {
            type: 'table',
            headers: ['Input type', 'Efficiency', 'Rule of thumb'],
            rows: [
              ['English prose', 'Best', '~4 chars/token · 1,000 words ≈ 1,300 tokens'],
              ['Source code', 'Middling', 'Indentation, symbols, camelCase fragment — ~2-3 chars/token'],
              ['JSON / logs', 'Worst', 'Keys + punctuation re-paid on every record; often 2-3× prose'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Architect instinct',
            md: 'Before pasting anything into a model, estimate its token cost. A 500-line log dump can cost more attention (and money) than the entire rest of your session.',
          },
        ],
      },
      {
        heading: 'Next-token prediction',
        blocks: [
          {
            type: 'text',
            md: 'One objective explains almost everything: **given all tokens so far, output a probability distribution over the next token**. Sample one, append it, repeat. Temperature controls how adventurously you sample — which is why the same prompt gives different answers. There is no lookup step, no database, no parse tree. "Reasoning" is a behavior that emerges from this loop at scale.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The mental model that pays rent',
            md: 'An LLM is a **plausibility engine**. Ask "what would a plausible continuation look like?" and most confusing behaviors — hallucination, sycophancy, format-copying — stop being mysterious.',
          },
        ],
      },
      {
        heading: 'Attention and the context window',
        blocks: [
          {
            type: 'text',
            md: 'Attention lets every token look at every other token — that is n² pairwise interactions. It is why transformers work, and why context is a **finite attention budget**, not free storage. Fable 5 offers a 1M-token window, but capability degrades before you hit the wall.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Context rot',
            md: "More context is not more better. As the window fills, attention over any single fact gets diluted, and retrieval from the middle of a long context is measurably worse than from the edges. Chroma's context-rot research quantified this across models. Lesson m0-l4 is entirely about engineering around it.",
          },
        ],
      },
      {
        heading: 'Why hallucination happens',
        blocks: [
          {
            type: 'text',
            md: "Hallucination is not a bug being patched out — it is the objective working as designed. The training data contains billions of confident statements and very few 'I don't know's, so confident continuation is what gets learned. Post-training and tool use (search, code execution) shrink the problem; they do not delete it.",
          },
          {
            type: 'compare',
            left: {
              title: 'Where LLMs are strong',
              items: [
                'Transforming text they can see (refactor, summarize, translate)',
                'Pattern-heavy generation: boilerplate, tests, migrations',
                'Recall of extremely common knowledge',
                'Verifiable claims — when you give them a verifier',
              ],
            },
            right: {
              title: 'Where hallucination bites',
              items: [
                'Precise facts in the long tail: versions, APIs, citations, dates',
                'Anything not in context that *sounds* like it should exist',
                'Confidence calibration — fluency is not accuracy',
                'Arithmetic and counting without a tool',
              ],
            },
          },
        ],
      },
      {
        heading: 'The training pipeline',
        blocks: [
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l1arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Pretrain, then SFT, then RLHF</text><rect x="25" y="60" width="200" height="100" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="125" y="88" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">1. PRETRAINING</text><text x="125" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Next-token prediction</text><text x="125" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">on internet-scale text</text><text x="125" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">months · vast compute</text><line x1="225" y1="110" x2="262" y2="110" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1arr)"/><rect x="265" y="60" width="180" height="100" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="355" y="88" fill="#a78bfa" font-size="15" font-weight="bold" text-anchor="middle">2. SFT</text><text x="355" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Imitate curated</text><text x="355" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">instruction-response</text><text x="355" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">demonstrations</text><line x1="445" y1="110" x2="482" y2="110" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1arr)"/><rect x="485" y="60" width="190" height="100" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="580" y="88" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">3. RLHF</text><text x="580" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Optimize for human</text><text x="580" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">preference rankings</text><text x="580" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">via reward model</text><text x="125" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: base model</text><text x="125" y="207" fill="#71717a" font-size="12" text-anchor="middle">(raw autocomplete)</text><text x="355" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: assistant</text><text x="355" y="207" fill="#71717a" font-size="12" text-anchor="middle">(follows instructions)</text><text x="580" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: aligned assistant</text><text x="580" y="207" fill="#71717a" font-size="12" text-anchor="middle">(helpful + honest-ish)</text><rect x="25" y="240" width="650" height="64" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="1.5"/><text x="350" y="266" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">+ Extended thinking (RL on reasoning traces)</text><text x="350" y="288" fill="#a1a1aa" font-size="13" text-anchor="middle">Model spends visible reasoning tokens before answering — you buy accuracy with tokens and latency</text></svg>`,
            caption: 'Three stages, three different objectives — plus reasoning RL layered on top.',
          },
          {
            type: 'text',
            md: 'Each stage answers a different question. Pretraining: *what does language (and code) look like?* SFT: *what does being an assistant look like?* RLHF: *which of these plausible answers do humans actually prefer?* When a model behaves oddly, ask which stage that behavior came from.',
          },
        ],
      },
      {
        heading: 'Extended thinking',
        blocks: [
          {
            type: 'text',
            md: 'Modern models can emit intermediate reasoning tokens before committing to an answer — Claude calls it **extended thinking**. It is not magic and not a bigger brain: it is the same next-token loop given scratch space, trained via RL to use it well. You pay for those tokens. Use it for hard, multi-step problems; skip it for mechanical edits.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Anchor resource',
            md: "Andrej Karpathy's free 3-hour [Deep Dive into LLMs](https://www.youtube.com/watch?v=7xTGNNLPyMI) covers this whole lesson in glorious visual depth — tokenization, attention, hallucination, RLHF. Watch it at 1.5x this week. It replaces entire paid courses.",
          },
        ],
      },
    ],
    lab: {
      title: 'Token intuition',
      intro:
        'Calibrate your gut for what things cost in tokens. Twenty minutes now saves you real money and attention budget all month.',
      steps: [
        'Open the [tiktokenizer playground](https://tiktokenizer.vercel.app) and paste a ~20-line function from a real codebase. Note the count and *where* the splits fall (camelCase, indentation, symbols).',
        'Paste an English paragraph with roughly the same character count. Compare tokens-per-character.',
        'Paste a real JSON API response. Watch keys and punctuation fragment — compute its chars/token.',
        "In Claude Code, run: 'Estimate the token count of @src/types.ts, then of a 3-sentence prose summary of it. Explain the difference.' (Swap in any real file.)",
        "Ask Claude: 'Show me two nearly identical strings that tokenize very differently, and why.' (Leading spaces and casing are classic culprits.)",
        'Write a one-line personal rule of thumb: chars/token for prose, for your main language, and for JSON.',
      ],
      checklist: [
        'Compared token counts for code vs prose of equal character length',
        'Measured why JSON/logs are the most token-expensive format',
        'Can estimate a file token count within ~25% before pasting it',
        'Wrote down a personal chars-per-token rule of thumb',
      ],
    },
    checkQuiz: [
      {
        q: 'Extended thinking mode is best understood as:',
        options: [
          'A larger context window enabled at inference time',
          'The model generating intermediate reasoning tokens — which you pay for — before committing to an answer',
          'A retrieval pass over the training data',
          'Running the prompt twice and returning the better output',
        ],
        answer: 1,
        explain:
          'It is the same next-token loop given scratch space and trained by RL to use it. Accuracy is bought with tokens and latency.',
      },
      {
        q: 'Which training stage turns raw autocomplete into an assistant that follows instructions?',
        options: [
          'Pretraining',
          'Tokenization',
          'SFT — supervised fine-tuning on instruction-response pairs',
          'Quantization',
        ],
        answer: 2,
        explain:
          'SFT teaches the chat format and assistant persona by imitation. RLHF then tunes which answers humans prefer.',
      },
      {
        q: 'Temperature above zero means:',
        options: [
          'The model samples from the next-token distribution, so identical prompts can produce different outputs',
          'The model generates faster',
          'More tokens fit into the context window',
          'The model refuses fewer requests',
        ],
        answer: 0,
        explain:
          'Generation is sampling, not lookup. Temperature scales how much probability mass low-ranked tokens get.',
      },
      {
        q: 'The practical consequence of n² attention for your daily work:',
        options: [
          'Longer sessions are strictly better — more context means more accuracy',
          'Keep sessions lean: a small, relevant context beats a huge, noisy one',
          'Always max out the 1M window since you paid for it',
          'Attention costs only matter for training, not inference',
        ],
        answer: 1,
        explain:
          'Every token competes for a finite attention budget. Low-signal filler actively degrades retrieval of what matters — the core premise of context engineering.',
      },
    ],
    resources: [
      {
        label: 'Karpathy — Deep Dive into LLMs (3 hr, the foundations video)',
        url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
        kind: 'video',
      },
      {
        label: '3Blue1Brown — Attention in transformers, visually explained',
        url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
        kind: 'video',
      },
      {
        label: 'Tiktokenizer playground (see tokenization live)',
        url: 'https://tiktokenizer.vercel.app',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs — Context windows',
        url: 'https://docs.claude.com/en/docs/build-with-claude/context-windows',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs — Extended thinking',
        url: 'https://docs.claude.com/en/docs/build-with-claude/extended-thinking',
        kind: 'docs',
      },
      {
        label: 'Chroma research — Context rot',
        url: 'https://research.trychroma.com/context-rot',
        kind: 'article',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l2 — Vibe Coding → Agentic Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l2',
    title: 'Vibe Coding → Agentic Engineering',
    day: 1,
    minutes: 35,
    xp: 100,
    objectives: [
      "Apply Karpathy's diagnostic to classify any AI-assisted session as vibe or agentic",
      "Explain the floor/ceiling frame and what it implies for an architect's leverage",
      'Cite the 2026 delegation/supervision reality and what it means for workflow design',
      'Name the concrete artifacts (spec, verification, ownership) that upgrade a vibe session',
    ],
    skipQuiz: [
      {
        q: "Karpathy's one-line diagnostic separating vibe coding from agentic engineering:",
        options: [
          'Whether you use an agent or a chat UI',
          'Whether you accept output you have not read, versus working from specs, verification, and ownership',
          'Whether you write any code by hand at all',
          'Whether the model is frontier-class',
        ],
        answer: 1,
        explain:
          'The tooling is identical; the discipline differs. Vibe coding means accepting output unread. Agentic engineering means specs in, verification on the way out, and you own what ships.',
      },
      {
        q: "'Vibe coding raises the floor; agentic engineering raises the ceiling' means:",
        options: [
          'Vibe coding is for juniors, agentic engineering for seniors',
          'The floor is prototypes and the ceiling is production',
          'Vibe coding lets anyone produce working software; agentic engineering lets experts produce dramatically more, reliably',
          'Vibe coding is cheaper per token',
        ],
        answer: 2,
        explain:
          'Two different revolutions: access for everyone (floor), and leverage for people who bring engineering discipline (ceiling). This course targets the ceiling.',
      },
      {
        q: "Per Anthropic's 2026 Agentic Coding Trends report, professional devs FULLY delegate (no supervision) what share of tasks?",
        options: ['0-20%', '40-60%', '80-100%', 'Effectively all greenfield work'],
        answer: 0,
        explain:
          'Full delegation remains rare: 0-20% of tasks. Devs supervise 80-100% of agent work — the job shifted to direction and review, not disappearance.',
      },
      {
        q: 'Which artifact most cleanly marks the shift from vibe to agentic?',
        options: [
          'A bigger system prompt',
          'A spec with acceptance criteria that the output is verified against',
          'A faster model',
          'More detailed commit messages',
        ],
        answer: 1,
        explain:
          'Specs plus verification are the control surface. Prompt wording and model choice matter far less than having a defined "done" and a check for it.',
      },
      {
        q: 'Agent-written code you merged broke prod. The agentic-engineering read on responsibility:',
        options: [
          'The model vendor is at fault — it generated the bug',
          'The harness is at fault — verification should have caught it',
          'Yours — ownership of shipped output is the defining trait of the discipline',
          'Nobody — this is the accepted cost of speed',
        ],
        answer: 2,
        explain:
          'Ownership is non-negotiable in the agentic frame. The harness and vendor are tools; the engineer who merged it owns it — which is exactly why verification design matters.',
      },
    ],
    sections: [
      {
        heading: "Karpathy's frame",
        blocks: [
          {
            type: 'text',
            md: 'At the Sequoia AI Ascent 2026, Karpathy — who coined "vibe coding" in early 2025 — drew the line for the post-vibe era. Vibe coding was never an insult; it is genuinely how prototypes should start. The problem is staying there while shipping things people depend on.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The thesis',
            md: '**Vibe coding raises the floor. Agentic engineering raises the ceiling.** Anyone can now produce working software. Experts who pair AI leverage with engineering discipline produce more than ever — and everyone in between gets squeezed.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l2arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#e4e4e7"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Two revolutions, one axis</text><line x1="70" y1="50" x2="70" y2="285" stroke="#52525b" stroke-width="2"/><text x="30" y="170" fill="#a1a1aa" font-size="13" transform="rotate(-90 30 170)" text-anchor="middle">capability of what ships</text><line x1="90" y1="250" x2="330" y2="250" stroke="#52525b" stroke-width="1.5" stroke-dasharray="6 4"/><text x="210" y="272" fill="#a1a1aa" font-size="13" text-anchor="middle">old floor: non-devs ship nothing</text><line x1="90" y1="170" x2="330" y2="170" stroke="#38bdf8" stroke-width="2"/><line x1="210" y1="244" x2="210" y2="180" stroke="#38bdf8" stroke-width="3" marker-end="url(#m0l2arr)"/><text x="210" y="150" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">VIBE CODING raises the floor</text><text x="210" y="192" fill="#a1a1aa" font-size="12" text-anchor="middle">anyone can produce software</text><line x1="380" y1="130" x2="640" y2="130" stroke="#52525b" stroke-width="1.5" stroke-dasharray="6 4"/><text x="510" y="152" fill="#a1a1aa" font-size="13" text-anchor="middle">old ceiling: expert throughput</text><line x1="380" y1="62" x2="640" y2="62" stroke="#a78bfa" stroke-width="2"/><line x1="510" y1="124" x2="510" y2="72" stroke="#a78bfa" stroke-width="3" marker-end="url(#m0l2arr)"/><text x="510" y="46" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">AGENTIC ENGINEERING raises the ceiling</text><text x="510" y="88" fill="#a1a1aa" font-size="12" text-anchor="middle">specs + verification + ownership at agent speed</text><text x="510" y="272" fill="#71717a" font-size="12" text-anchor="middle">the squeezed middle: unread output, shipped anyway</text></svg>`,
            caption: 'Same tools, opposite ends of the leverage curve. The middle — vibe habits on production stakes — is the danger zone.',
          },
        ],
      },
      {
        heading: 'The diagnostic',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Vibe coding',
              items: [
                'You accept output you did not read',
                'No spec — the prompt *is* the requirements',
                'Verification = "it seems to run"',
                'Errors pasted back until the noise stops',
                'Ownership is diffuse ("the AI wrote it")',
              ],
            },
            right: {
              title: 'Agentic engineering',
              items: [
                'Spec with acceptance criteria before generation',
                'Verification loop: tests, build, screenshot — binary pass/fail',
                'You read (or systematically review) what ships',
                'Corrections go into the spec, not an argument thread',
                'You own every merged line, whoever typed it',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            md: 'Notice what is *not* in the right column: prompt tricks, model worship, or writing code by hand. The discipline is classic engineering — specs, tests, review — applied as the control surface for agents. Simon Willison calls the same convergence "vibe engineering."',
          },
        ],
      },
      {
        heading: 'The 2026 reality',
        blocks: [
          {
            type: 'text',
            md: 'The Anthropic 2026 Agentic Coding Trends report punctures both hype and doom: developers fully delegate only **0-20%** of tasks and supervise **80-100%** of agent work. The winning setup is an orchestrator plus specialized agents in parallel contexts — with a human directing. Context engineering is named *the* skill of the era.',
          },
          {
            type: 'table',
            headers: ['Claim you will hear', '2026 reality'],
            rows: [
              ['"Agents replaced developers"', 'Full delegation: 0-20% of tasks. Direction and review are the job now'],
              ['"Just prompt better"', 'Supervision spans 80-100% of agent work; verification design beats prompt wording'],
              ['"AI made engineering discipline obsolete"', 'Specs, tests, CI, review became MORE valuable — they are the agent control surface'],
              ['"One chat window is enough"', 'Orchestrator + specialized agents in parallel contexts is the professional pattern'],
            ],
          },
        ],
      },
      {
        heading: 'What this course makes you',
        blocks: [
          {
            type: 'text',
            md: 'You are a rusty dev with architect instincts — the exact profile the ceiling rewards. The next 29 days build, in order: prompting and context craft (this module), Claude Code as a power tool, then harnesses, loops, and verification — the machinery that turns "AI user" into **agentic engineer**. Every lesson assumes you will own what ships.',
          },
        ],
      },
    ],
    lab: {
      title: 'Audit your last three AI sessions',
      intro:
        'Run the vibe-vs-agentic diagnostic on your own recent history. Brutal honesty here sets the baseline the rest of the course improves on.',
      steps: [
        "Pull up your 3 most recent AI-assisted work sessions (run `claude --resume` to browse past Claude Code sessions, or open your chat/Cursor history).",
        'For each session, answer in writing: did you read every line you accepted? All / most / some / none.',
        'For each: did a spec or acceptance criteria exist *before* generation started? What was it?',
        'For each: what verification actually ran — tests, build, screenshot, manual click-through, or nothing?',
        'Score each session 0 (pure vibe) to 10 (agentic), and note the single cheapest upgrade: a failing test first, a SPEC.md, or a review pass.',
        'Save the notes as `audit.md` — the Day 2 lessons are the fix for exactly what you found.',
      ],
      checklist: [
        'Audited 3 real sessions against the read/spec/verification diagnostic',
        'Scored each session on the vibe-to-agentic scale with a sentence of justification',
        'Identified the cheapest concrete upgrade for each session',
        'Saved the audit notes for comparison at end of course',
      ],
    },
    checkQuiz: [
      {
        q: "Supervision reality in 2026, per the Anthropic trends report:",
        options: [
          'Developers supervise 80-100% of agent tasks',
          'Supervision has dropped below 10%',
          'Only security-critical code gets supervised',
          'Supervision is fully automated by reviewer agents',
        ],
        answer: 0,
        explain:
          'The job became direction plus review. Full, unsupervised delegation stays rare (0-20% of tasks) even with frontier agents.',
      },
      {
        q: 'Which session is vibe coding?',
        options: [
          'You review the diff against a spec before merging',
          'You paste errors back until it runs, then merge without reading the final diff',
          'You write a failing test and let the agent make it pass',
          'You have Claude interview you, then execute a SPEC.md in a fresh session',
        ],
        answer: 1,
        explain:
          'Accepting unread output is the defining tell. The other three all have a verification or spec anchor.',
      },
      {
        q: "Simon Willison's 'vibe engineering' argues AI most multiplies the value of:",
        options: [
          'Prompt wording',
          'GPU access',
          'Vim proficiency',
          'Classic discipline: testing, planning, documentation, CI, and code review',
        ],
        answer: 3,
        explain:
          'Agents make disciplined engineers faster and undisciplined ones more dangerous — the practices are the multiplier, not the prompt.',
      },
      {
        q: 'Why does the floor/ceiling frame matter to an architect specifically?',
        options: [
          'It implies architects should stop writing code entirely',
          'Your differentiation shifts to specs, verification design, and system ownership — the ceiling work',
          'Floors and ceilings converge, so nothing changes',
          'It mostly argues for hiring more junior developers',
        ],
        answer: 1,
        explain:
          'Code generation is commoditized at the floor. Judgment about what to build and how to verify it — architecture — is what the ceiling rewards.',
      },
    ],
    resources: [
      {
        label: 'Karpathy — From Vibe Coding to Agentic Engineering (Sequoia AI Ascent 2026, 30 min)',
        url: 'https://youtu.be/96jN2OCOfLs',
        kind: 'video',
      },
      {
        label: "Karpathy's own written summary of the talk",
        url: 'https://karpathy.bearblog.dev/sequoia-ascent-2026',
        kind: 'article',
      },
      {
        label: 'Simon Willison — Vibe engineering',
        url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/',
        kind: 'article',
      },
      {
        label: "Karpathy's original vibe-coding post (Feb 2025, for the record)",
        url: 'https://x.com/karpathy/status/1886192184808149383',
        kind: 'thread',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l3 — Prompting That Actually Works
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l3',
    title: 'Prompting That Actually Works',
    day: 2,
    minutes: 45,
    xp: 100,
    objectives: [
      'Structure any serious prompt as role + context + constraints with verifiable acceptance criteria',
      'Build few-shot example sets that teach the distribution, not the edge cases',
      'Run the interview pattern end-to-end: Claude interviews you → SPEC.md → fresh session executes',
      'Recognize when a task has outgrown prompting and needs a verification loop instead',
    ],
    skipQuiz: [
      {
        q: 'The best few-shot example set for an extraction task:',
        options: [
          '10 edge cases that previously broke the model',
          '3-5 diverse, canonical examples spanning the normal variety of inputs',
          'One perfect example, repeated for emphasis',
          'As many examples as fit in the context window',
        ],
        answer: 1,
        explain:
          'The model infers the input distribution from your examples. Edge-case-only sets teach it that inputs are usually weird; diverse canonical examples teach the actual shape of the task.',
      },
      {
        q: 'Claude produced a wrong approach mid-session. The highest-leverage response:',
        options: [
          'Explain what is wrong in a follow-up message and let it retry',
          'Edit the original prompt and regenerate — the wrong turn otherwise stays in context, polluting attention',
          'Repeat the instruction in capital letters for emphasis',
          'Lower the temperature and resend the same message',
        ],
        answer: 1,
        explain:
          'Arguing keeps the failed attempt in the window, where it keeps attracting attention. Editing and regenerating gives you a clean distribution — one of the cheapest wins in daily practice.',
      },
      {
        q: 'The key move of the interview pattern:',
        options: [
          'Asking Claude to critique its own plan before coding',
          'Interviewing multiple models and taking a majority vote',
          'Having Claude ask YOU questions until requirements are explicit, writing SPEC.md, then executing in a FRESH session',
          'Roleplaying Claude as a job interviewer to test its knowledge',
        ],
        answer: 2,
        explain:
          'It inverts the flow: the model extracts your unstated requirements, freezes them into an artifact, and a clean session executes against the artifact instead of the noisy conversation.',
      },
      {
        q: 'Role + context + constraints beats a bare ask mostly because:',
        options: [
          'It flatters the model into trying harder',
          'It increases the available token budget',
          'It disables hedging behaviors',
          'It narrows the space of plausible completions toward your intended region',
        ],
        answer: 3,
        explain:
          'The model samples plausible continuations. Role, context, and constraints collapse the plausibility space so the intended answer becomes the likely one.',
      },
      {
        q: 'When does prompting stop being the answer?',
        options: [
          'When the task needs iteration against real verification — that is loop engineering, not wording',
          'When the prompt exceeds 500 words',
          'When you switch to a different model family',
          'Never — every failure is ultimately a prompting failure',
        ],
        answer: 0,
        explain:
          'A prompt is one shot. Tasks that need try-check-adjust cycles need a loop with a verifier — better wording cannot substitute for feedback.',
      },
    ],
    sections: [
      {
        heading: 'Anatomy of a working prompt',
        blocks: [
          {
            type: 'text',
            md: 'The Anthropic applied-AI workshop (40 techniques in 24 minutes) boils down to a few load-bearing moves. First: serious prompts have **structure** — a role, the context needed to act, and constraints that define done. Everything else is refinement.',
          },
          {
            type: 'table',
            headers: ['Component', 'What it does', 'Example'],
            rows: [
              [
                '**Role**',
                'Selects the voice, priors, and standards',
                '"You are a senior API reviewer for a fintech; breaking changes are your top concern"',
              ],
              [
                '**Context**',
                'Everything needed to act — and nothing more',
                'The diff, the API contract, the runbook excerpt. Not the whole repo',
              ],
              [
                '**Constraints**',
                'Defines done, verifiably',
                '"Output valid JSON matching this schema; flag every breaking change; max 200 words per finding"',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            md: 'Vague quality words ("be careful", "be thorough") are dead weight — the model already tries. Verifiable constraints ("must compile", "must match this schema", "cite the line number") change output. If you cannot check it, it is not a constraint.',
          },
        ],
      },
      {
        heading: 'Few-shot done right',
        blocks: [
          {
            type: 'text',
            md: 'Examples out-teach descriptions — but the model learns the **distribution** you show it, not the rules you intend. Teams routinely stuff few-shot slots with every edge case that ever failed, and then wonder why normal inputs get treated as exotic.',
          },
          {
            type: 'compare',
            left: {
              title: 'Weak example set',
              items: [
                'Every past failure as an example',
                'All examples share one format quirk (model copies it)',
                'Ten near-duplicates of the easy case',
                'Examples contradict the written instructions',
              ],
            },
            right: {
              title: 'Strong example set',
              items: [
                '3-5 canonical examples spanning real input variety',
                'One representative hard case, clearly resolved',
                'Formats vary where format should not matter',
                'Each example silently demonstrates a rule the prose states',
              ],
            },
          },
        ],
      },
      {
        heading: 'The interview pattern',
        blocks: [
          {
            type: 'text',
            md: "The single highest-leverage technique in this lesson. You are the bottleneck: your requirements live in your head, unstated. So invert the flow — make Claude interview *you*, freeze the answers into `SPEC.md`, then execute the spec in a fresh session with clean context.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l3arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The interview pattern</text><rect x="25" y="70" width="185" height="90" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="117" y="98" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. INTERVIEW</text><text x="117" y="120" fill="#e4e4e7" font-size="13" text-anchor="middle">Claude asks, you answer</text><text x="117" y="138" fill="#a1a1aa" font-size="12" text-anchor="middle">goals · constraints · non-goals</text><path d="M 70 70 C 55 40 180 40 165 70" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#m0l3arr)"/><text x="117" y="48" fill="#71717a" font-size="12" text-anchor="middle">repeat until explicit</text><line x1="210" y1="115" x2="255" y2="115" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l3arr)"/><rect x="258" y="70" width="160" height="90" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="338" y="102" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">2. SPEC.md</text><text x="338" y="124" fill="#e4e4e7" font-size="13" text-anchor="middle">goals, non-goals,</text><text x="338" y="142" fill="#a1a1aa" font-size="12" text-anchor="middle">acceptance criteria</text><line x1="418" y1="115" x2="463" y2="115" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l3arr)"/><rect x="466" y="70" width="210" height="90" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="571" y="98" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">3. FRESH SESSION</text><text x="571" y="120" fill="#e4e4e7" font-size="13" text-anchor="middle">/clear, read SPEC.md,</text><text x="571" y="138" fill="#a1a1aa" font-size="12" text-anchor="middle">execute against criteria</text><rect x="120" y="205" width="460" height="60" rx="8" fill="#27272a" stroke="#52525b"/><text x="350" y="230" fill="#e4e4e7" font-size="13" text-anchor="middle">Why fresh? The interview transcript is now NOISE.</text><text x="350" y="250" fill="#a1a1aa" font-size="13" text-anchor="middle">The spec is the distilled signal — execute from that alone.</text></svg>`,
            caption: 'Extract requirements → freeze into an artifact → execute from clean context.',
          },
          {
            type: 'code',
            lang: 'text',
            code: `Interview me one question at a time about <task>.
Do not propose solutions yet. When you have enough,
write SPEC.md with: goals, non-goals, constraints,
and verifiable acceptance criteria.

--- then, after /clear, in a fresh session ---

Read SPEC.md and implement it. Do not ask anything
the spec already answers.`,
            caption: 'The two prompts, verbatim. Steal them.',
          },
        ],
      },
      {
        heading: 'Socratic decomposition, and edit rather than argue',
        blocks: [
          {
            type: 'text',
            md: 'Two smaller habits with outsized returns. **Decompose before you generate**: ask for the approach, interrogate it, *then* ask for the artifact — extended thinking helps the model reason, but it cannot fix a mis-framed task. And **edit, never argue**: each correction message leaves the failed attempt in context, where it keeps attracting attention.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The correction spiral',
            md: 'Three rounds of "no, not like that" leaves a window full of wrong answers that the model keeps attending to. Edit the original prompt with what you learned and regenerate. In Claude Code the equivalent move is `/clear` plus a sharper restatement.',
          },
        ],
      },
      {
        heading: 'Where prompting ends',
        blocks: [
          {
            type: 'text',
            md: 'A prompt is a single shot at shaping one output. When the task needs *iteration against reality* — run the tests, read the failure, adjust, repeat — no wording fixes that. That is **loop engineering**: prompt → act → verify against a real signal → decide done or go again. It is where this course is headed, and prompting craft is its foundation, not its replacement.',
          },
        ],
      },
    ],
    lab: {
      title: 'Run the interview pattern for real',
      intro:
        'Take a genuine task off your backlog and run it through interview → SPEC.md → fresh execution. Compare against how you would normally one-shot it.',
      steps: [
        'Pick a real task you have been putting off — a feature, a migration script, a gnarly refactor. Something with fuzzy requirements.',
        "In Claude Code, prompt: 'Interview me one question at a time about <your task>. Do not propose solutions yet. When you have enough, write SPEC.md with goals, non-goals, constraints, and verifiable acceptance criteria.'",
        'Answer at least 6 questions honestly. When a question stumps you, notice: that was a requirement living only in your head.',
        'Open the generated `SPEC.md` and edit it directly — tighten acceptance criteria until each one is checkable.',
        "Run `/clear`, then: 'Read SPEC.md and implement it. Do not ask anything the spec already answers.'",
        'Review the result against the acceptance criteria, then write two sentences comparing this to your usual one-shot prompting.',
      ],
      checklist: [
        'Claude asked at least 6 interview questions before writing anything',
        'SPEC.md exists with goals, non-goals, constraints, and verifiable acceptance criteria',
        'Execution ran in a fresh session with the spec as sole context',
        'At least one requirement surfaced in the interview that you had not written down anywhere',
        'Output was checked against the acceptance criteria, not vibes',
      ],
    },
    checkQuiz: [
      {
        q: 'Why execute the SPEC.md in a fresh session rather than continuing the interview session?',
        options: [
          'Fresh sessions get cheaper token pricing',
          'The interview back-and-forth is noise now; a clean context holding just the spec is far higher signal',
          'SPEC.md cannot be read mid-session',
          'It avoids hitting rate limits',
        ],
        answer: 1,
        explain:
          'The spec is the distilled output of the interview. Carrying the whole meandering transcript into execution dilutes attention for zero gain.',
      },
      {
        q: 'Socratic decomposition still matters in the extended-thinking era because:',
        options: [
          'Models still cannot reason at all without it',
          'Decomposing before generating shapes WHAT gets reasoned about — thinking tokens cannot rescue a mis-framed task',
          'The API requires a decomposition step',
          'It reduces token costs to near zero',
        ],
        answer: 1,
        explain:
          'Extended thinking improves execution of the framing it is given. Choosing the framing — decompose, interrogate, then generate — is still your job.',
      },
      {
        q: 'Edge-case-only few-shot lists fail because:',
        options: [
          'Models ignore all examples after the second one',
          'The model infers the input DISTRIBUTION from your examples — all edge cases teaches it that inputs are usually weird',
          'Edge cases always exceed token limits',
          'Few-shot prompting only works for math tasks',
        ],
        answer: 1,
        explain:
          'Examples are evidence about what inputs look like, not just rules. Show the distribution you actually expect, plus one well-resolved hard case.',
      },
      {
        q: 'Which is a real constraint, in the useful sense?',
        options: [
          '"Be very careful and accurate"',
          '"Output MUST be valid JSON matching this schema; no prose; max 120 words per field"',
          '"Do your best work — this is important"',
          '"You are the greatest programmer alive"',
        ],
        answer: 1,
        explain:
          'A constraint you can verify changes behavior and enables checking. Exhortations are token-shaped noise.',
      },
    ],
    resources: [
      {
        label: 'Anthropic applied-AI prompting workshop (24 min, 40 techniques)',
        url: 'https://www.youtube.com/watch?v=9B39p0W4duw',
        kind: 'video',
      },
      {
        label: 'Anthropic docs — Prompt engineering overview',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs — Multishot (few-shot) prompting',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting',
        kind: 'docs',
      },
      {
        label: 'Anthropic engineering — Claude Code best practices (interview pattern and friends)',
        url: 'https://www.anthropic.com/engineering/claude-code-best-practices',
        kind: 'article',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l4 — Context Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l4',
    title: 'Context Engineering',
    day: 2,
    minutes: 45,
    xp: 100,
    objectives: [
      'Explain why context engineering is a superset of prompt engineering, and what changes across turns',
      'Diagnose context rot and manage the attention budget deliberately',
      'Pick correctly between compaction, structured notes, and subagent isolation for long-horizon work',
      'Apply the master principle: smallest set of high-signal tokens, every turn',
    ],
    skipQuiz: [
      {
        q: 'Context engineering vs prompt engineering:',
        options: [
          'They are synonyms; the field just renamed itself',
          'Prompt engineering optimizes the instruction; context engineering curates EVERYTHING in the window — instructions, tools, history, retrieved data — across every turn',
          'Context engineering only applies to RAG pipelines',
          'Prompt engineering is deprecated and no longer matters',
        ],
        answer: 1,
        explain:
          'Prompting asks "how do I phrase this?" Context engineering asks "what configuration of tokens should be in the window at this moment?" — a per-turn curation problem, and a strict superset.',
      },
      {
        q: "System-prompt 'Goldilocks altitude' means:",
        options: [
          'Put the system prompt at the very top of the window',
          'Keep the system prompt under 100 tokens, always',
          'Write the system prompt in the voice of the model',
          'Sit between brittle hardcoded if-else logic and vague platitudes — calibrated guidance with concrete signals',
        ],
        answer: 3,
        explain:
          'Too low: enumerated rules that shatter on the first unanticipated input. Too high: "be helpful" mush. The right altitude gives heuristics and signals the model can generalize from.',
      },
      {
        q: 'Just-in-time retrieval means:',
        options: [
          'Store lightweight identifiers (paths, queries, links) and load content only when actually needed, instead of pre-stuffing the window',
          'Retrieving right before the rate limit resets',
          'Caching all documents at session start for speed',
          'Using embeddings for every lookup',
        ],
        answer: 0,
        explain:
          'Agents that hold references and fetch on demand — like Claude Code reading files with grep and targeted reads — keep the window lean. Pre-loading everything is how context rot starts.',
      },
      {
        q: 'A 6-hour agent task with discrete phase milestones must survive many context windows. Best long-horizon tool:',
        options: [
          'Compaction on every turn',
          'One giant context window and hope',
          'Structured notes — e.g. a NOTES.md / progress file persisted outside the context',
          'A louder, longer system prompt',
        ],
        answer: 2,
        explain:
          'Milestone-shaped work wants durable external state the agent re-reads after each reset. Compaction fits continuous conversations; subagents fit parallelizable investigation.',
      },
      {
        q: 'The master principle of context engineering:',
        options: [
          'Maximize context usage — you paid for the whole window',
          'Find the smallest set of high-signal tokens that maximizes the likelihood of your desired outcome',
          'Always include the full codebase for grounding',
          'Repeat critical instructions three times: start, middle, and end',
        ],
        answer: 1,
        explain:
          'This is the stated Anthropic principle, near-verbatim: every token competes for attention, so curation — not accumulation — is the job.',
      },
    ],
    sections: [
      {
        heading: 'The superset',
        blocks: [
          {
            type: 'text',
            md: 'Prompt engineering optimizes a message. **Context engineering** manages the entire window state — system prompt, tool definitions, conversation history, retrieved files, tool outputs — and re-decides it *every turn*. In agent work the prompt is a minority of the tokens; the rest is what you let accumulate.',
          },
          {
            type: 'compare',
            left: {
              title: 'Prompt engineering asks',
              items: [
                'How do I phrase this instruction?',
                'Which examples do I include?',
                'One-shot: write once, submit',
                'Scope: the message',
              ],
            },
            right: {
              title: 'Context engineering asks',
              items: [
                'What belongs in the window *right now*?',
                'What should be retrieved later instead of loaded now?',
                'Iterative: curate on every turn of the loop',
                'Scope: instructions + tools + history + data',
              ],
            },
          },
        ],
      },
      {
        heading: 'Attention budget and context rot',
        blocks: [
          {
            type: 'text',
            md: 'From m0-l1: attention is n² and finite. Treat the window as an **attention budget** — every token you add taxes every retrieval. Stale tool outputs, dead exploration threads, and yesterday\'s goals do not sit harmlessly; they actively dilute what matters. Long-context benchmarks confirm degradation well before the advertised limit.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The kitchen-sink session',
            md: 'The classic failure: one Claude Code session accretes a bugfix, a refactor, three questions, and a deploy. By hour two the model is attending to four stale goals at once. **`/clear` between unrelated tasks** is the highest-ROI habit in this lesson.',
          },
        ],
      },
      {
        heading: 'System-prompt altitude',
        blocks: [
          {
            type: 'table',
            headers: ['Altitude', 'Looks like', 'Failure mode'],
            rows: [
              [
                'Too low',
                'Hardcoded if-else: "if the user asks X, say Y" times 200 rules',
                'Brittle — shatters on the first input you did not anticipate; maintenance nightmare',
              ],
              [
                '**Goldilocks**',
                'Heuristics + concrete signals: "prefer the smallest diff; cite file:line; stop and ask when tests are missing"',
                'None — specific enough to steer, general enough to transfer',
              ],
              [
                'Too high',
                '"You are a helpful, careful assistant. Do a great job."',
                'Vague — the model falls back on defaults; no steering happened',
              ],
            ],
          },
          {
            type: 'text',
            md: 'Same logic governs your `CLAUDE.md`: the notorious anti-pattern is the 26,000-line rulebook nobody — human or model — can attend to. Keep it under ~200 lines of signals, not scripts.',
          },
        ],
      },
      {
        heading: 'Just-in-time retrieval',
        blocks: [
          {
            type: 'text',
            md: 'The alternative to pre-loading everything: hold **lightweight identifiers** — file paths, queries, links — and fetch content the moment it is needed. This is progressive disclosure: the result of each retrieval informs the next. It is literally how Claude Code works: grep first, targeted reads second, never "load the repo".',
          },
        ],
      },
      {
        heading: 'The three long-horizon tools',
        blocks: [
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l4arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Work outlives the window — pick your survival strategy</text><rect x="240" y="45" width="220" height="46" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/><text x="350" y="65" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="middle">Context window filling up</text><text x="350" y="83" fill="#a1a1aa" font-size="12" text-anchor="middle">task &gt; one window</text><line x1="280" y1="91" x2="130" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><line x1="350" y1="91" x2="350" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><line x1="420" y1="91" x2="570" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><rect x="25" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="130" y="172" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">COMPACTION</text><text x="130" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">Summarize the transcript,</text><text x="130" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">restart with the summary</text><text x="130" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">risk: subtle detail lost</text><text x="130" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">in summarization</text><rect x="245" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="350" y="172" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">STRUCTURED NOTES</text><text x="350" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">NOTES.md / progress file</text><text x="350" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">persisted OUTSIDE context</text><text x="350" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">agent re-reads after</text><text x="350" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">every reset</text><rect x="465" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="570" y="172" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">SUBAGENT ISOLATION</text><text x="570" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">Deep dive burns a fresh</text><text x="570" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">context, returns a summary</text><text x="570" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">main thread stays lean,</text><text x="570" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">gets the distillate</text><text x="130" y="305" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">use when: continuous flow,</text><text x="130" y="322" fill="#38bdf8" font-size="12" text-anchor="middle">conversation must continue</text><text x="350" y="305" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">use when: discrete milestones,</text><text x="350" y="322" fill="#fbbf24" font-size="12" text-anchor="middle">iterative long project</text><text x="570" y="305" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">use when: parallelizable</text><text x="570" y="322" fill="#a78bfa" font-size="12" text-anchor="middle">investigation / research</text><text x="350" y="360" fill="#71717a" font-size="12" text-anchor="middle">These compose: a subagent can compact; a compacting session can keep notes.</text></svg>`,
            caption: 'The Anthropic selection rule for work that outlives one context window.',
          },
          {
            type: 'table',
            headers: ['Task shape', 'Reach for', 'In Claude Code'],
            rows: [
              ['Long conversation that must keep flowing', 'Compaction', '`/compact` — with instructions on what to keep'],
              ['Multi-day project with milestones', 'Structured notes', 'NOTES.md / task_plan.md the agent maintains and re-reads'],
              ['Wide investigation you can fence off', 'Subagent isolation', 'Delegate to a subagent; only the summary returns'],
            ],
          },
        ],
      },
      {
        heading: 'The master principle',
        blocks: [
          {
            type: 'callout',
            variant: 'insight',
            title: 'Tape this to your monitor',
            md: '**Find the smallest set of high-signal tokens that maximizes the likelihood of your desired outcome.** Every technique in this lesson — altitude, JIT retrieval, compaction, notes, subagents — is this one sentence applied at a different layer.',
          },
        ],
      },
    ],
    lab: {
      title: 'Long-session hygiene drills',
      intro:
        'Practice the three moves — clear, compact-with-instructions, delegate — inside a real Claude Code session until they are reflexes.',
      steps: [
        'Start Claude Code in a real project and give it a meaty task (a refactor or feature). Work it for 15+ minutes; watch the context percentage indicator climb.',
        "Mid-task, ask an unrelated question (e.g. 'explain this cron syntax'). Notice the pollution you just added. Then run `/clear` and restate only the live task — feel what came back and what it cost you to restate.",
        'Work until context is heavy again, then run: `/compact keep the architectural decisions and open bugs; drop the file exploration and dead ends`. Compare against a bare `/compact`.',
        "Delegate an investigation: 'Use a subagent to find every place we do date parsing and report the top 3 inconsistencies — summary only.' Watch your main context stay flat while the work happens.",
        'Ask Claude to create a NOTES.md capturing current state: decisions made, files touched, next steps. Then `/clear` and resume purely from NOTES.md.',
        'Write one paragraph: which of the three tools fit this task best, and why.',
      ],
      checklist: [
        'Used /clear at a deliberate boundary and successfully resumed from a restated prompt',
        'Ran /compact WITH keep/drop instructions and compared it to the default',
        'Delegated an investigation to a subagent and received a summary without flooding main context',
        'Resumed a task from NOTES.md alone after a full /clear',
        'Can state the selection rule for compaction vs notes vs subagents from memory',
      ],
    },
    checkQuiz: [
      {
        q: 'When is subagent isolation the right long-horizon tool?',
        options: [
          'A deep-dive investigation that would flood the main context — the subagent burns its own window and returns a distilled summary',
          'Any task longer than 10 minutes',
          'When you want the fastest possible single answer',
          'When the conversation must continue with full history intact',
        ],
        answer: 0,
        explain:
          'Fence off the token-hungry exploration, keep the orchestrating thread lean. Continuous-flow conversations want compaction instead.',
      },
      {
        q: 'The core risk of compaction:',
        options: [
          'It costs extra output tokens',
          'A subtle-but-critical detail gets lost in summarization — which is why you instruct what to keep and drop',
          'It resets the model weights',
          'It disables tool use for the session',
        ],
        answer: 1,
        explain:
          'Summaries are lossy by design. Steer the loss: keep decisions and open issues, drop exploration transcripts.',
      },
      {
        q: 'Why do agent contexts degrade even well under the advertised token limit?',
        options: [
          'Providers throttle long-context requests',
          'Attention budget: every token competes, so low-signal filler actively dilutes retrieval of what matters',
          'Tokens expire after an hour',
          'The KV cache evicts old tokens randomly',
        ],
        answer: 1,
        explain:
          'Context rot is a gradient, not a cliff. The window is a budget you spend, and junk tokens are negative-yield spending.',
      },
      {
        q: 'You finished a bugfix and are about to start an unrelated feature in the same Claude Code session. Right move:',
        options: [
          'Keep going — the accumulated context can only help',
          '/clear — a kitchen-sink session leaves the model attending to stale goals',
          'Run /compact with no instructions and continue',
          'Switch to a bigger model to fit both tasks',
        ],
        answer: 1,
        explain:
          'Unrelated task = new session. The bugfix transcript is pure noise for the feature and will keep pulling attention.',
      },
    ],
    resources: [
      {
        label: 'Anthropic engineering — Effective context engineering for AI agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
      {
        label: 'Chroma research — Context rot (the measurements)',
        url: 'https://research.trychroma.com/context-rot',
        kind: 'article',
      },
      {
        label: 'Claude Code docs — Memory (CLAUDE.md hierarchy, auto memory)',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs — Subagents',
        url: 'https://code.claude.com/docs/en/sub-agents',
        kind: 'docs',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l5 — Workflows vs Agents
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l5',
    title: 'Workflows vs Agents',
    day: 3,
    minutes: 40,
    xp: 100,
    objectives: [
      'Draw the Anthropic line between workflows (predefined paths) and agents (model directs itself)',
      'Match real tasks to the 5 workflow patterns: chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer',
      'Justify when a full agent is warranted — and when it is expensive overkill',
      'Treat the agent-computer interface (ACI) as a design surface deserving HCI-level effort',
    ],
    skipQuiz: [
      {
        q: 'The Anthropic line between a workflow and an agent:',
        options: [
          'Workflows use one model; agents use many',
          'Workflows orchestrate LLMs through predefined code paths; agents dynamically direct their own process and tool use',
          'Agents are just workflows with more tools attached',
          'Workflows cannot call tools',
        ],
        answer: 1,
        explain:
          'The distinction is who holds the control flow: your code (workflow) or the model (agent). Both can use identical models and tools.',
      },
      {
        q: 'Generate marketing copy in one pass, translate it in another, with a programmatic gate check between. Which pattern?',
        options: ['Prompt chaining', 'Routing', 'Evaluator-optimizer', 'Orchestrator-workers'],
        answer: 0,
        explain:
          'Fixed sequence of steps, each consuming the previous output, with optional gates between — textbook prompt chaining.',
      },
      {
        q: 'Customer queries arrive in distinct known categories (refund / tech support / sales), each best served by a specialized prompt. Pattern?',
        options: ['Parallelization (voting)', 'Prompt chaining', 'Routing', 'Evaluator-optimizer'],
        answer: 2,
        explain:
          'Classify first, then dispatch to a specialized handler. Routing keeps each downstream prompt focused instead of one bloated do-everything prompt.',
      },
      {
        q: 'Literary translation: one LLM produces, a second critiques against criteria, loop until the critique passes. Pattern?',
        options: ['Routing', 'Parallelization (sectioning)', 'Orchestrator-workers', 'Evaluator-optimizer'],
        answer: 3,
        explain:
          'Generator plus critic in a loop, with clear evaluation criteria — evaluator-optimizer. It shines when critique is easier than generation.',
      },
      {
        q: 'When should you reach for a full agent instead of a workflow?',
        options: [
          'Whenever latency does not matter',
          'Open-ended problems where you cannot enumerate the steps or subtasks in advance',
          'Always — agents subsume workflows and cost the same',
          'Only for coding tasks',
        ],
        answer: 1,
        explain:
          'The Anthropic guidance: use the simplest thing that works. Agents trade cost, latency, and predictability for autonomy — pay that only when the path genuinely cannot be predefined.',
      },
    ],
    sections: [
      {
        heading: 'The taxonomy',
        blocks: [
          {
            type: 'text',
            md: 'Anthropic\'s *Building Effective Agents* is the essay the entire industry standardized on. Its core cut: **workflows** run LLMs through code paths *you* predefined; **agents** let the model direct its own process and tool use. Most things marketed as "agents" in 2026 are workflows — and that is usually a compliment.',
          },
          {
            type: 'compare',
            left: {
              title: 'Workflow',
              items: [
                'Control flow lives in your code',
                'Predictable, testable, debuggable',
                'Cheap: only needed calls happen',
                'Right when steps are enumerable in advance',
              ],
            },
            right: {
              title: 'Agent',
              items: [
                'Control flow lives in the model',
                'Handles paths you did not anticipate',
                'Expensive: loops, retries, exploration',
                'Right when the task is genuinely open-ended',
              ],
            },
          },
          {
            type: 'text',
            md: 'The shared building block is the **augmented LLM**: a model plus retrieval, tools, and memory. Every pattern below is just augmented LLMs composed differently.',
          },
        ],
      },
      {
        heading: 'The five workflow patterns',
        blocks: [
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 430" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13"><defs><marker id="m0l5arr" markerWidth="9" markerHeight="9" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5 Z" fill="#a1a1aa"/></marker></defs><text x="120" y="52" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. Prompt chaining</text><rect x="22" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="48" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="74" y1="103" x2="92" y2="103" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="94" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="120" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="146" y1="103" x2="164" y2="103" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="166" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="192" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><text x="120" y="145" fill="#a1a1aa" font-size="12" text-anchor="middle">fixed sequence, gates between</text><text x="350" y="52" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">2. Routing</text><rect x="262" y="88" width="60" height="30" rx="5" fill="#27272a" stroke="#a78bfa"/><text x="292" y="107" fill="#e4e4e7" text-anchor="middle">router</text><line x1="322" y1="98" x2="368" y2="76" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="322" y1="108" x2="368" y2="130" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="370" y="60" width="60" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="400" y="78" fill="#e4e4e7" text-anchor="middle">LLM A</text><rect x="370" y="118" width="60" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="400" y="136" fill="#e4e4e7" text-anchor="middle">LLM B</text><text x="350" y="170" fill="#a1a1aa" font-size="12" text-anchor="middle">classify, then dispatch to a specialist</text><text x="578" y="52" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="middle">3. Parallelization</text><rect x="480" y="88" width="44" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="502" y="106" fill="#e4e4e7" text-anchor="middle">in</text><line x1="524" y1="94" x2="552" y2="72" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="524" y1="102" x2="552" y2="102" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="524" y1="110" x2="552" y2="132" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="554" y="58" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="75" fill="#e4e4e7" text-anchor="middle">LLM</text><rect x="554" y="90" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><rect x="554" y="122" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="139" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="604" y1="102" x2="628" y2="102" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="630" y="88" width="56" height="28" rx="5" fill="#27272a" stroke="#f472b6"/><text x="658" y="106" fill="#e4e4e7" text-anchor="middle">merge</text><text x="578" y="170" fill="#a1a1aa" font-size="12" text-anchor="middle">sectioning or voting</text><text x="175" y="225" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">4. Orchestrator-workers</text><rect x="105" y="245" width="140" height="32" rx="5" fill="#27272a" stroke="#34d399"/><text x="175" y="266" fill="#e4e4e7" text-anchor="middle">orchestrator</text><line x1="140" y1="277" x2="80" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="175" y1="277" x2="175" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="210" y1="277" x2="270" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="35" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="78" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><rect x="132" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="175" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><rect x="229" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="272" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><text x="175" y="368" fill="#a1a1aa" font-size="12" text-anchor="middle">orchestrator DECIDES the subtasks at runtime,</text><text x="175" y="385" fill="#a1a1aa" font-size="12" text-anchor="middle">delegates, then synthesizes results</text><text x="525" y="225" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">5. Evaluator-optimizer</text><rect x="390" y="270" width="110" height="36" rx="5" fill="#27272a" stroke="#52525b"/><text x="445" y="293" fill="#e4e4e7" text-anchor="middle">generator</text><rect x="550" y="270" width="110" height="36" rx="5" fill="#27272a" stroke="#fbbf24"/><text x="605" y="293" fill="#e4e4e7" text-anchor="middle">evaluator</text><path d="M 500 279 L 548 279" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="524" y="270" fill="#71717a" font-size="11" text-anchor="middle">solution</text><path d="M 548 297 L 500 297" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="524" y="315" fill="#71717a" font-size="11" text-anchor="middle">feedback</text><line x1="660" y1="288" x2="688" y2="288" stroke="#34d399" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="525" y="368" fill="#a1a1aa" font-size="12" text-anchor="middle">loop until the critique passes;</text><text x="525" y="385" fill="#a1a1aa" font-size="12" text-anchor="middle">works when critique is easier than generation</text></svg>`,
            caption: 'The five Anthropic workflow patterns. Your code owns the arrows; the model fills the boxes.',
          },
          {
            type: 'table',
            headers: ['Pattern', 'Use when', 'Cost profile'],
            rows: [
              ['Prompt chaining', 'Task decomposes into fixed sequential steps; accuracy > latency', 'Linear in steps'],
              ['Routing', 'Distinct input categories, each with a better specialized handler', 'Classifier + one handler'],
              ['Parallelization — sectioning', 'Independent subtasks you can define upfront (e.g. review each file separately)', 'N parallel calls'],
              ['Parallelization — voting', 'Judgment calls where diverse attempts raise confidence (vulnerability checks)', 'N calls per decision'],
              ['Orchestrator-workers', 'Subtasks cannot be predicted upfront — orchestrator decides at runtime', 'Variable; orchestrator + workers'],
              ['Evaluator-optimizer', 'Clear evaluation criteria; critique is easier than generation', 'Multiplied by loop iterations'],
            ],
          },
        ],
      },
      {
        heading: 'Agents: only when open-ended',
        blocks: [
          {
            type: 'callout',
            variant: 'warning',
            title: "Anthropic's own advice",
            md: 'Find the **simplest solution possible**, and only increase complexity when it demonstrably improves outcomes. Agents cost more tokens, more latency, and more failure surface. If you can write the steps down, you want a workflow. Reserve agents for tasks where the path is genuinely unknowable upfront — like nontrivial coding.',
          },
          {
            type: 'text',
            md: 'Claude Code itself is the proof case: an agent (the model picks which files to read, what to run) wrapped in workflow-like guardrails (permissions, hooks, verification). The next module lives in exactly that architecture.',
          },
        ],
      },
      {
        heading: 'The ACI: your tools are a UI',
        blocks: [
          {
            type: 'text',
            md: "The essay's most under-appreciated point: the **agent-computer interface** deserves the same design effort as any human interface. Tool names, parameter shapes, descriptions, and error messages *are* the UX your agent lives in. Anthropic reports spending more time on tools than on the overall prompt when building agents.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Poka-yoke your tools',
            md: 'Design arguments so mistakes are hard to make: require absolute paths instead of relative, return actionable error strings, document edge cases in the description like you would for a junior hire. If a human would misread your tool docs, the model will too.',
          },
        ],
      },
    ],
    lab: {
      title: 'Classify five of your real tasks',
      intro:
        'Pattern-matching gets durable when you apply it to your own work. Classify five recurring tasks and defend each call.',
      steps: [
        'List 5 recurring tasks from your actual work that involve (or could involve) an LLM — e.g. PR review, changelog writing, triaging support email, dependency upgrades, drafting ADRs.',
        "For each, answer the fork question in writing: 'Can I enumerate the steps or subtasks in advance?' If yes: workflow. If no: agent.",
        'For each workflow, pick the specific pattern (chaining / routing / sectioning / voting / orchestrator-workers / evaluator-optimizer) and write one sentence of justification.',
        "Ask Claude to referee: 'Here are 5 tasks and my pattern classifications with justifications. Challenge each one — where would a simpler pattern do?'",
        'Find at least one task you currently do in a free-form chat that should be a fixed workflow — and sketch its steps as a numbered list.',
        'Record the final table (task | pattern | justification) in a `patterns.md`.',
      ],
      checklist: [
        'Classified 5 real tasks as workflow-pattern or agent, with written justification',
        'Applied the fork question (steps enumerable in advance?) to every task',
        'Had Claude challenge the classifications and adjusted at least one',
        'Identified one chat-based task that should become a fixed workflow, with sketched steps',
      ],
    },
    checkQuiz: [
      {
        q: 'Orchestrator-workers vs parallelization sectioning — the key difference:',
        options: [
          'Workers must use smaller models',
          'The orchestrator decides the subtasks dynamically at runtime; sectioning splits along boundaries you predefined',
          'Orchestrator-workers cannot run workers in parallel',
          'Sectioning always requires a voting step',
        ],
        answer: 1,
        explain:
          'Same fan-out shape, different author of the split. If your code knows the sections upfront, you do not need an orchestrator model.',
      },
      {
        q: 'The "augmented LLM" — the atomic building block of all patterns — is a model plus:',
        options: [
          'A GPU cluster',
          'A human reviewer in the loop',
          'Retrieval, tools, and memory',
          'A fine-tuned adapter',
        ],
        answer: 2,
        explain:
          'Every workflow and agent composes this same unit: an LLM that can look things up, act via tools, and persist state.',
      },
      {
        q: 'The ACI deserving HCI-level effort means:',
        options: [
          'Building graphical dashboards for agents',
          'Sweating tool names, parameter design, descriptions, and error messages the way you would sweat a human UI',
          'Giving agents mouse and keyboard control',
          'Rewriting all tools in Rust for speed',
        ],
        answer: 1,
        explain:
          'Tools are the interface the agent perceives the world through. Ambiguous parameters and vague descriptions produce exactly the misuse a bad human UI produces.',
      },
      {
        q: 'Voting-style parallelization is worth its N-times token cost when:',
        options: [
          'The task is trivially easy anyway',
          'You need higher confidence on a judgment call — diverse attempts reduce variance (e.g. "is this code vulnerable?")',
          'You want the lowest possible latency',
          'The context window is nearly full',
        ],
        answer: 1,
        explain:
          'Voting buys confidence, not speed or economy. Use it where a wrong single-shot judgment is expensive.',
      },
    ],
    resources: [
      {
        label: 'Anthropic — Building Effective Agents (the canonical essay)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic cookbook — agent pattern implementations (code for all 5 patterns)',
        url: 'https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents',
        kind: 'repo',
      },
      {
        label: 'Anthropic engineering — Writing effective tools for agents (ACI deep dive)',
        url: 'https://www.anthropic.com/engineering/writing-tools-for-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic Academy — free agent courses with certificates',
        url: 'https://anthropic.skilljar.com',
        kind: 'course',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l6 — Token Economics 101
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l6',
    title: 'Token Economics 101',
    day: 3,
    minutes: 40,
    xp: 100,
    objectives: [
      'Quote the July-2026 price landscape from memory and route tasks to the right model tier',
      'Compute agent-loop costs: why transcripts make cost quadratic uncached and ~linear cached',
      'Exploit prompt caching correctly — and avoid the invalidators that silently disable it',
      'Decide API vs Pro/Max plan using the ~$6-10/day crossover',
    ],
    skipQuiz: [
      {
        q: 'July 2026 Claude API pricing per million tokens (input/output):',
        options: [
          'Sonnet 5: $3/$15 · Haiku 4.5: $1/$5',
          'Sonnet 5: $15/$75 · Haiku 4.5: $5/$25',
          'All models flat $10/$10',
          'Opus 4.8: $75/$150',
        ],
        answer: 0,
        explain:
          'The 2026 ladder: Fable 5 $10/$50, Opus 4.8 $5/$25, Sonnet 5 $3/$15 (intro $2/$10 through Aug 31), Haiku 4.5 $1/$5. A ~10x spread top to bottom — routing matters.',
      },
      {
        q: 'Prompt-cache reads and writes cost (relative to base input price):',
        options: [
          'Reads free, writes 5x',
          'Reads 0.1x; writes 1.25x (5-min TTL) or 2x (1-hour TTL)',
          'Reads 0.5x, writes 1x',
          'Both 0.1x',
        ],
        answer: 1,
        explain:
          'A 90% discount on every cache hit for a small write premium — breakeven after just 2 requests on the same prefix.',
      },
      {
        q: 'Why do uncached agent-loop costs grow roughly quadratically with turn count?',
        options: [
          'Output gets longer each turn',
          'Models charge a per-turn surcharge',
          'Tool calls double the token count',
          'The full transcript is resent as input every turn, so turn n re-pays for all prior turns',
        ],
        answer: 3,
        explain:
          'The API is stateless: each turn resends everything. Sum over n turns and transcript-tokens billed grow like n squared over 2. Caching collapses the resent prefix to 0.1x, making growth ~linear.',
      },
      {
        q: 'Which of these silently invalidates your prompt cache?',
        options: [
          'Reusing the same system prompt twice',
          'Requests arriving within 5 minutes of each other',
          'A timestamp, random UUID, or unsorted JSON near the top of the prompt — caching is prefix-exact',
          'Responses longer than 1,000 tokens',
        ],
        answer: 2,
        explain:
          'One changed byte breaks the prefix match from that point on. Dynamic values belong at the END of the prompt, after the stable cached prefix.',
      },
      {
        q: 'The median Claude Code developer cost anchor, and the plan-vs-API crossover:',
        options: [
          '$60/day; crossover at $100/day',
          '~$6/day API-equivalent median (90% under $12); Pro/Max crossover around $6-10/day of usage',
          '$0.50/day; subscription plans never pay off',
          '$25/day flat for all users',
        ],
        answer: 1,
        explain:
          'Median usage sits near $6/day. Above ~$6-10/day of sustained API-equivalent usage, Max plans ($100/$200 per month) become arbitrage — heavy multi-agent users hit $1,000+/mo on raw API.',
      },
    ],
    sections: [
      {
        heading: 'The July 2026 price sheet',
        blocks: [
          {
            type: 'table',
            headers: ['Model', 'Input $/M', 'Output $/M', 'Notes'],
            rows: [
              ['Claude Fable 5', '$10', '$50', 'Frontier; 1M context'],
              ['Claude Opus 4.8', '$5', '$25', 'Heavy reasoning workhorse'],
              ['Claude Sonnet 5', '$3', '$15', 'Intro $2/$10 through Aug 31, 2026'],
              ['Claude Haiku 4.5', '$1', '$5', 'Fast tier — most mechanical work belongs here'],
              ['OpenAI GPT-5.x tiers', '$0.20-$30', 'varies', 'Cached input at 10%'],
              ['Gemini 3.x tiers', '$0.25-$4', 'varies', 'Comparable ladder'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The two numbers that matter',
            md: 'Output costs **~5x input** across every provider — verbosity is expensive. And the top-to-bottom Claude spread is **~10x** ($10 vs $1 input). Model routing plus output discipline beats any coupon.',
          },
        ],
      },
      {
        heading: 'Caching changes everything',
        blocks: [
          {
            type: 'table',
            headers: ['Mechanic', 'Value', 'Implication'],
            rows: [
              ['Cache read', '0.1x input price', '90% off every hit on the stable prefix'],
              ['Cache write', '1.25x (5-min TTL) / 2x (1-hr TTL)', 'Breakeven at just 2 requests'],
              ['Matching', 'Prefix-exact', 'One changed byte kills everything after it'],
              ['Batch API', '50% off, async (within 24h)', 'Evals, backfills, anything non-interactive'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The silent cache killers',
            md: 'Timestamps in the system prompt. Random UUIDs. JSON serialized with unsorted keys. Tool definitions that change between calls. Each one breaks the prefix match and silently multiplies your bill by ~10x. Put stable content first, dynamic values last — and sort your keys.',
          },
        ],
      },
      {
        heading: 'Agent-loop math',
        blocks: [
          {
            type: 'text',
            md: 'The API is stateless: **every turn resends the whole transcript as input**. Turn 40 of a session pays for 39 turns of history — again. Summed, an uncached loop grows ~quadratically in turns. Caching collapses the resent prefix to 0.1x, bending the curve back to ~linear. This is why agent products live or die on cache discipline.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Cumulative session cost vs turns</text><line x1="70" y1="280" x2="660" y2="280" stroke="#52525b" stroke-width="2"/><line x1="70" y1="280" x2="70" y2="50" stroke="#52525b" stroke-width="2"/><text x="365" y="312" fill="#a1a1aa" font-size="13" text-anchor="middle">turns in the session</text><text x="32" y="170" fill="#a1a1aa" font-size="13" transform="rotate(-90 32 170)" text-anchor="middle">cumulative $</text><path d="M 70 280 Q 300 270 480 170 T 660 60" fill="none" stroke="#f472b6" stroke-width="3"/><text x="470" y="120" fill="#f472b6" font-size="14" font-weight="bold">uncached: ~quadratic</text><text x="470" y="140" fill="#a1a1aa" font-size="12">turn n re-pays all prior turns</text><path d="M 70 280 L 660 215" fill="none" stroke="#34d399" stroke-width="3"/><text x="440" y="250" fill="#34d399" font-size="14" font-weight="bold">cached: ~linear</text><text x="440" y="268" fill="#a1a1aa" font-size="12">prefix re-read at 0.1x</text><line x1="400" y1="280" x2="400" y2="60" stroke="#52525b" stroke-width="1" stroke-dasharray="5 5"/><text x="400" y="50" fill="#fbbf24" font-size="12" text-anchor="middle">/clear here — restart the curve</text></svg>`,
            caption: 'Two forces: caching flattens the curve; fresh sessions restart it near zero.',
          },
          {
            type: 'code',
            lang: 'text',
            code: `monthly_cost =
    sessions_per_day
  x turns_per_session
  x (  fresh_input  x input_rate
     + cached_input x 0.1 x input_rate
     + output       x output_rate )
  x 30

anchors: median Claude Code dev ~ $6/day
         90% of devs < $12/day`,
            caption: 'The back-of-envelope model. You will use it in the lab.',
          },
        ],
      },
      {
        heading: 'Plans vs API',
        blocks: [
          {
            type: 'table',
            headers: ['Option', 'Price', 'Makes sense when'],
            rows: [
              ['Pay-as-you-go API', 'metered', 'Light/spiky usage, production apps, batch jobs'],
              ['Pro', '$20/mo', 'Casual daily use under the ~$6/day crossover'],
              ['Max 5x', '$100/mo', 'Sustained daily Claude Code work'],
              ['Max 20x', '$200/mo', 'Heavy multi-agent workflows — raw API equivalent often $1,000+/mo'],
            ],
          },
          {
            type: 'text',
            md: 'The crossover sits around **$6-10/day** of API-equivalent usage. Below it, metered wins; above it, Max plans are straight arbitrage. Track your own number with `/cost` before deciding.',
          },
        ],
      },
      {
        heading: 'Habits that halve the bill',
        blocks: [
          {
            type: 'text',
            md: "- **Route by difficulty**: Haiku 4.5 for mechanical edits, renames, formatting — 10x cheaper than Fable 5\n- **Fresh session per task**: shortens the resent transcript; attacks the quadratic term directly\n- **Batch your questions**: five asks in one turn beats five turns\n- **Edit and regenerate** instead of arguing — correction threads are pure token burn\n- **Project files, not re-uploads**: reference stable context; do not re-paste it\n- **Batch API for anything async**: instant 50% off evals and backfills",
          },
        ],
      },
    ],
    lab: {
      title: 'Price one real session, then model your month',
      intro:
        'Turn the formula into your own numbers: measure an actual agent session, extrapolate to a monthly figure, and make the plan-vs-API call with data.',
      steps: [
        'Run a real Claude Code work session (20+ minutes), then execute `/cost` to see token usage and spend for the session.',
        'Count the turns and note the model used. Estimate fresh input vs cached input vs output from the /cost breakdown.',
        'Compute the session by hand with the formula: fresh_input x rate + cached_input x 0.1 x rate + output x output_rate. Check it against what /cost reported.',
        'Recompute the same session pretending caching was OFF (all input at full rate). Write down the multiplier you dodged.',
        'Model your month: sessions/day x per-session cost x 30. Compare the result against Pro ($20), Max 5x ($100), and Max 20x ($200).',
        'Identify two tasks from this week you could have routed to Haiku 4.5, and estimate the saving at $1/$5 vs your current model.',
      ],
      checklist: [
        'Ran /cost on a real session and reconciled it against the hand formula',
        'Computed the uncached counterfactual and the caching multiplier for one session',
        'Produced a monthly estimate and made a data-backed plan-vs-API decision',
        'Named two concrete tasks to route to Haiku, with estimated savings',
      ],
    },
    checkQuiz: [
      {
        q: 'Output tokens vs input tokens, across all major providers:',
        options: [
          'Priced the same',
          'Output ≈ 5x input — verbose responses dominate cost more than big contexts do',
          'Output is cheaper because it is generated, not processed',
          'Only input is billed',
        ],
        answer: 1,
        explain:
          'Fable 5 is $10 in / $50 out; the 5-6x ratio holds industry-wide. Constraining output length is a real cost lever, not a style preference.',
      },
      {
        q: 'The Batch API tradeoff:',
        options: [
          '50% discount for async processing (results within 24h) — ideal for evals, backfills, non-interactive jobs',
          '50% surcharge for priority processing',
          'Available only on Haiku-class models',
          'Free but limited to 10 requests per day',
        ],
        answer: 0,
        explain:
          'If nothing is waiting on the answer interactively, batch it and halve it. All three major providers offer the same 50% deal.',
      },
      {
        q: "Cheapest correct habit for the 'rename this variable everywhere' class of task:",
        options: [
          'Fable 5 with extended thinking enabled',
          'Route it to Haiku 4.5 — $1/$5, roughly 10x cheaper than Fable 5, and ample for mechanical edits',
          'Opus 4.8 with a verification subagent',
          'The Batch API with voting',
        ],
        answer: 1,
        explain:
          'Model routing is the biggest single lever: matching task difficulty to model tier captures the 10x price spread with zero quality loss on mechanical work.',
      },
      {
        q: 'Why does a fresh session per task save real money in agent loops?',
        options: [
          'New sessions receive promotional pricing',
          'It resets your rate limits',
          'It shortens the transcript resent on every turn — attacking the quadratic term directly, not just trimming the tail',
          'It re-warms the prompt cache automatically',
        ],
        answer: 2,
        explain:
          'Cost per turn is proportional to transcript length. Starting clean means every subsequent turn in the new session carries less history — compounding savings.',
      },
    ],
    resources: [
      {
        label: 'Anthropic docs — Model pricing (verify current numbers here)',
        url: 'https://docs.claude.com/en/docs/about-claude/pricing',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs — Prompt caching (mechanics + invalidators)',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-caching',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs — Batch processing (the 50% discount)',
        url: 'https://docs.claude.com/en/docs/build-with-claude/batch-processing',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs — Manage costs effectively',
        url: 'https://code.claude.com/docs/en/costs',
        kind: 'docs',
      },
      {
        label: 'Ponytail — anti-over-engineering skill (~20% cheaper, ~54% less code)',
        url: 'https://github.com/DietrichGebert/ponytail',
        kind: 'repo',
      },
    ],
  },
]
