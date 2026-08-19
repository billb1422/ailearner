import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m7-l1 — Modeling Agent Costs
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l1',
    title: 'Modeling Agent Costs',
    day: 22,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can explain why uncached agent loops cost quadratically in turns while cached loops cost roughly linearly',
      'Can compute a monthly agent budget with the sessions x turns x token-mix formula',
      'Can name the silent cache invalidators and rank the three cost levers for an agent workload',
      'Can make a defensible plan-vs-API decision for a given daily spend',
    ],
    skipQuiz: [
      {
        q: 'An agent session runs 40 turns with no prompt caching. Why does its cost curve bend upward instead of growing linearly?',
        options: [
          'Output tokens get more expensive as the model reasons harder late in a session',
          'Every turn resends the entire growing transcript as fresh input, so cumulative input scales roughly with turns squared',
          'Rate limits force retries, and retries are billed at a premium',
          'Tool results are billed at 2x the normal input rate',
        ],
        answer: 1,
        explain: 'The transcript is re-sent in full on every turn. Turn N pays for roughly N turns of history as fresh input, so the session total is quadratic in turns when nothing is cached.',
      },
      {
        q: 'You enable prompt caching with the 1-hour TTL on Anthropic. What premium do you pay when a cache segment is first written?',
        options: [
          'No premium — writes are billed at the normal input rate',
          '1.25x the base input rate',
          '2x the base input rate',
          '10x the base input rate',
        ],
        answer: 2,
        explain: 'Anthropic bills cache writes at 1.25x for the 5-minute TTL and 2x for the 1-hour TTL. Reads then come back at 0.1x, which is where the payoff lives.',
      },
      {
        q: 'Which of these will silently destroy your cache hit rate without throwing any error?',
        options: [
          'Putting a current timestamp near the top of the system prompt',
          'Using a 1-hour TTL instead of 5 minutes',
          'Running sessions on the Batch API',
          'Keeping the tool list identical across every request',
        ],
        answer: 0,
        explain: 'Caching is prefix-exact. A timestamp, UUID, unsorted JSON, or a changed tool list early in the prompt changes the prefix and invalidates everything after it — silently.',
      },
      {
        q: 'What discount does the Batch API give you, and how consistent is it across providers in mid-2026?',
        options: [
          'A variable 10-30% discount depending on queue depth',
          'A flat 50% off, offered by Anthropic, OpenAI, and Google alike',
          '90% off input only, Anthropic-exclusive',
          '50% off, but only when combined with prompt caching',
        ],
        answer: 1,
        explain: 'Batch is a flat 50% off at all three major providers. The trade is latency: results come back asynchronously, so it fits offline and overnight work, not interactive loops.',
      },
      {
        q: 'What is the median Claude Code developer actually spending per day in API-equivalent terms?',
        options: [
          'About $60/day — agents are expensive',
          'About $25/day, with the top decile near $100',
          'About $6/day, with 90% of devs under $12/day',
          'Under $1/day for nearly everyone',
        ],
        answer: 2,
        explain: 'The median is around $6/day API-equivalent and 90% of devs stay under $12/day. The scary anecdotes come from heavy multi-agent fleets, which are real but not typical.',
      },
    ],
    sections: [
      {
        heading: 'Price the loop, not the request',
        blocks: [
          {
            type: 'text',
            md: 'Chat pricing intuition breaks on agents. A chat request is one input, one output. An agent is a **loop**: every turn resends the entire transcript — system prompt, tool list, every prior tool result — as input. Turn 30 pays for turns 1 through 29 again.\n\nUncached, session cost grows roughly with the **square** of turn count. Cached, the history bills at 0.1x and growth flattens to roughly linear. That one distinction drives every number in this lesson.',
          },
          {
            type: 'diagram',
            caption: 'Same 4-turn session. Uncached: each turn re-buys the whole transcript. Cached: history bills at 0.1x.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b" rx="8"/><text x="30" y="34" fill="#e4e4e7" font-size="15" font-weight="bold">UNCACHED — quadratic</text><text x="380" y="34" fill="#e4e4e7" font-size="15" font-weight="bold">CACHED — near linear</text><g><rect x="30" y="60" width="40" height="30" fill="#f472b6" rx="3"/><text x="80" y="80" fill="#a1a1aa" font-size="12">turn 1: fresh</text><rect x="30" y="100" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="100" width="44" height="30" fill="#f472b6" rx="3"/><text x="128" y="120" fill="#a1a1aa" font-size="12">turn 2: re-buys turn 1</text><rect x="30" y="140" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="140" width="44" height="30" fill="#f472b6" rx="3"/><rect x="122" y="140" width="48" height="30" fill="#f472b6" rx="3"/><text x="180" y="160" fill="#a1a1aa" font-size="12">turn 3</text><rect x="30" y="180" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="180" width="44" height="30" fill="#f472b6" rx="3"/><rect x="122" y="180" width="48" height="30" fill="#f472b6" rx="3"/><rect x="174" y="180" width="52" height="30" fill="#f472b6" rx="3"/><text x="236" y="200" fill="#a1a1aa" font-size="12">turn 4</text><text x="30" y="245" fill="#f472b6" font-size="13">every block = full input rate</text></g><g><rect x="380" y="60" width="40" height="30" fill="#38bdf8" rx="3"/><text x="430" y="80" fill="#a1a1aa" font-size="12">turn 1: write (1.25-2x)</text><rect x="380" y="100" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="100" width="44" height="30" fill="#34d399" rx="3"/><text x="478" y="120" fill="#a1a1aa" font-size="12">turn 2: read 0.1x + fresh</text><rect x="380" y="140" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="140" width="44" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="472" y="140" width="48" height="30" fill="#34d399" rx="3"/><text x="530" y="160" fill="#a1a1aa" font-size="12">turn 3</text><rect x="380" y="180" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="180" width="44" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="472" y="180" width="48" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="524" y="180" width="52" height="30" fill="#34d399" rx="3"/><text x="586" y="200" fill="#a1a1aa" font-size="12">turn 4</text><text x="380" y="245" fill="#34d399" font-size="13">dashed = 0.1x cache read; solid green = new tokens</text></g><rect x="30" y="270" width="640" height="46" fill="#27272a" stroke="#52525b" rx="6"/><text x="350" y="298" fill="#e4e4e7" font-size="14" text-anchor="middle">Agents resend the whole transcript per turn. Caching is not an optimization — it is the pricing model.</text></svg>`,
          },
        ],
      },
      {
        heading: 'The formula',
        blocks: [
          {
            type: 'text',
            md: 'One line models any agent workload. Estimate four numbers from your own usage — sessions per day, turns per session, token mix per turn — and multiply out:',
          },
          {
            type: 'code',
            lang: 'text',
            code: 'monthly ~= sessions/day\n         x turns/session\n         x ( fresh_input  x input_rate\n           + cached_input x 0.1 x input_rate\n           + output       x output_rate )\n         x 30\n\n// Example: 6 sessions/day, 25 turns, per-turn averages\n// 2k fresh in, 40k cached in, 1.5k out, on Sonnet 5 ($3/$15 per M):\n// 6 x 25 x (2000x0.000003 + 40000x0.0000003 + 1500x0.000015) x 30\n// ~= 6 x 25 x $0.0405 x 30  ~=  $182/month',
            caption: 'The loop-cost formula. Note the cached term: 40k tokens of history costs less than 2k of fresh input.',
          },
          {
            type: 'text',
            md: 'Two things to internalize from the example. First, **cached history is nearly free** — 40k cached tokens bill like 4k fresh ones. Second, **output dominates per-turn cost** at 5x the input rate, so verbose agents (dumping whole files into replies instead of editing) burn money for nothing.',
          },
        ],
      },
      {
        heading: 'Caching deep dive',
        blocks: [
          {
            type: 'table',
            headers: ['Cache operation', 'Price vs base input', 'Notes'],
            rows: [
              ['Read (hit)', '0.1x', 'The payoff — history at a tenth of the price'],
              ['Write, 5-min TTL', '1.25x', 'Default; fine for active agent loops (turns come fast)'],
              ['Write, 1-hr TTL', '2x', 'For sessions with long gaps between turns'],
              ['Breakeven', '2 requests', 'One write + one read is already cheaper than two fresh sends'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Silent cache killers',
            md: 'Matching is **prefix-exact**. Anything that changes early bytes invalidates everything after it, and nothing warns you:\n\n- Timestamps or request UUIDs injected into the system prompt\n- JSON serialized with unstable key order\n- A tool list that changes between requests (added, removed, or reordered tools)\n\nAudit by comparing cache-read tokens to total input tokens in the API response. If reads are near zero on a long session, one of these is the culprit.',
          },
        ],
      },
      {
        heading: 'The three levers, ranked',
        blocks: [
          {
            type: 'text',
            md: 'Three levers move agent spend. Rank them by leverage before touching anything else:\n\n- **Model tier** — a 10-50x price spread from Haiku to Fable. Route triage, classification, and glue work down-tier.\n- **Caching** — the single biggest lever for agent loops specifically, because loops are mostly re-read history.\n- **Batch** — a flat 50% off anything that can wait: evals, backfills, overnight fleets.',
          },
          {
            type: 'table',
            headers: ['Model (July 2026)', 'Input / M tok', 'Output / M tok', 'Route here for'],
            rows: [
              ['Fable 5', '$10', '$50', 'Hardest reasoning, 1M context, final review'],
              ['Opus 4.8', '$5', '$25', 'Deep coding sessions, architecture work'],
              ['Sonnet 5', '$3 ($2 intro thru Aug 31)', '$15 ($10 intro)', 'The workhorse: most agent loops'],
              ['Haiku 4.5', '$1', '$5', 'Triage, extraction, subagent grunt work'],
            ],
          },
        ],
      },
      {
        heading: 'Anchors and the plan-vs-API call',
        blocks: [
          {
            type: 'text',
            md: 'Ground your model in real anchors: the median Claude Code dev runs about **$6/day** API-equivalent, and 90% stay under **$12/day**. Heavy multi-agent users clear **$1,000+/month** — which is exactly why flat plans exist. A Max plan at $100-200/month is arbitrage if your metered usage would cost more.\n\nThe crossover sits around **$6-10/day** of sustained API-equivalent usage. Below it, pay as you go. Above it, a plan caps your downside.',
          },
          {
            type: 'compare',
            left: {
              title: 'Pay-as-you-go API',
              items: [
                'Wins below ~$6/day sustained usage',
                'Spiky or seasonal workloads',
                'Production apps billing per customer',
                'Full control: batch, caching, model routing',
                'Downside: a runaway loop bills you in your sleep',
              ],
            },
            right: {
              title: 'Flat plan (Pro $20 / Max $100-200)',
              items: [
                'Wins above ~$6-10/day sustained usage',
                'Daily driver Claude Code + multi-agent habits',
                'Predictable spend; runaway loops are capped',
                'Heavy fleet users: $1,000+/mo API becomes $200',
                'Downside: rolling rate limits, no batch discount',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Build your agent cost model',
      intro: 'Stop guessing. Model your own expected monthly agent workload with real numbers, then make the plan-vs-API call with evidence.',
      steps: [
        'Create a spreadsheet (or a markdown doc with a table) with columns: workload, sessions/day, turns/session, fresh input/turn, cached input/turn, output/turn, model.',
        'Add a row for each real workload you expect: daily Claude Code sessions, any background agents, batch jobs, side-project API calls.',
        'Fill in per-turn token estimates. If unsure, open a recent Claude Code session and inspect /cost or the API usage dashboard for actuals.',
        'Implement the formula per row: sessions x turns x (fresh x rate + cached x 0.1 x rate + output x out_rate) x 30, using the July 2026 price table.',
        'Add a second scenario column with caching OFF (all input at full rate) to see what cache discipline is worth to you.',
        'Compute your daily total and compare against the $6-10/day crossover: write a one-line verdict — API, Pro, or Max — and why.',
        'Stress-test: double turns/session (agents get chattier over time) and check whether your verdict flips.',
      ],
      checklist: [
        'Cost model has at least 3 real workload rows with per-turn token estimates',
        'Formula reproduces the lesson example (~$182/mo) when fed the example inputs',
        'Cached vs uncached scenario shows the delta caching is worth for your usage',
        'Written plan-vs-API verdict with the daily number that justifies it',
        'Stress-test row shows whether 2x turns flips your decision',
      ],
    },
    checkQuiz: [
      {
        q: 'One cache write plus how many reads makes caching cheaper than sending everything fresh?',
        options: [
          'Five reads — the write premium takes a while to amortize',
          'Ten reads, matching the 0.1x read multiplier',
          'One read — breakeven is at just 2 total requests',
          'Caching is always cheaper, even for a single request',
        ],
        answer: 2,
        explain: 'Breakeven is 2 requests: 1.25x (write) + 0.1x (read) = 1.35x beats 2.0x for two fresh sends. A single request costs slightly more, so caching a one-shot prompt loses money.',
      },
      {
        q: 'In the monthly formula, which term does the 0.1x multiplier apply to?',
        options: [
          'Output tokens, because they are generated from cached context',
          'Cached input — transcript history that hits the prompt cache',
          'Fresh input on every turn after the first',
          'The whole per-turn cost once a session exceeds 10 turns',
        ],
        answer: 1,
        explain: 'Only cache-read input bills at 0.1x the input rate. Fresh input and output always bill at full rate, which is why output-heavy agents stay expensive even with perfect caching.',
      },
      {
        q: 'Your API-equivalent usage settles at a steady $9/day of interactive Claude Code work. What does the crossover math say?',
        options: [
          'Stay on API — plans only win above $50/day',
          'You are in the $6-10/day crossover zone: a Max plan likely wins, since $9/day is ~$270/month metered',
          'Switch to the Batch API instead — 50% off beats any plan',
          'Drop to Haiku for everything before considering a plan',
        ],
        answer: 1,
        explain: '$9/day is roughly $270/month metered, above the cost of Max plans ($100-200). Batch does not help interactive work, and down-tiering everything trades quality for a problem a plan already solves.',
      },
      {
        q: 'How wide is the model-tier price lever between Haiku 4.5 and Fable 5 in July 2026?',
        options: [
          'About 2x on both input and output',
          '10x on input ($1 vs $10) and 10x on output ($5 vs $50)',
          '50x on input, 5x on output',
          'About 100x end to end',
        ],
        answer: 1,
        explain: 'Haiku 4.5 is $1/$5 and Fable 5 is $10/$50 per million tokens — a clean 10x on each side. Routing grunt work down-tier is the first lever to pull, before caching and batch.',
      },
    ],
    resources: [
      { label: 'Anthropic pricing (verify current numbers)', url: 'https://www.anthropic.com/pricing', kind: 'docs' },
      { label: 'Prompt caching — Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', kind: 'docs' },
      { label: 'Batch processing — Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', kind: 'docs' },
      { label: 'Token counting — Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/token-counting', kind: 'docs' },
      { label: 'Ponytail: anti-over-engineering skill (~20% cheaper runs)', url: 'https://github.com/DietrichGebert/ponytail', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m7-l2 — The AI-Native SDLC
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l2',
    title: 'The AI-Native SDLC',
    day: 22,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can describe the shift from autocomplete-assisted coding to agent orchestration, with the 2026 delegation numbers',
      'Can run a spec-driven workflow: executable spec to plan to atomic tasks to verified code',
      'Can explain why review became the bottleneck and how vibe engineering answers it',
      'Can write a personal doctrine covering when to spec, delegate, verify, and review',
    ],
    skipQuiz: [
      {
        q: 'Per the Anthropic 2026 Agentic Coding Trends Report, how much of their work do devs FULLY delegate to agents (no supervision)?',
        options: [
          'Around 60-80% — supervision is mostly gone',
          'Only 0-20%; devs supervise 80-100% of agent work',
          'Roughly 50%, split evenly with supervised work',
          'Effectively 100% for senior engineers',
        ],
        answer: 1,
        explain: 'Full delegation remains rare (0-20%). The dominant mode is supervised agent work — which is exactly why orchestration and review skills matter more than raw prompting.',
      },
      {
        q: 'The same report names one capability as THE core skill of the AI-native developer. Which?',
        options: [
          'Prompt engineering',
          'Fine-tuning open models',
          'Context engineering',
          'Kubernetes-grade agent ops',
        ],
        answer: 2,
        explain: 'Context engineering — deciding what the agent sees, when, and in what form — was named the defining skill. Prompting is a subset of it.',
      },
      {
        q: 'In spec-driven development (GitHub Spec Kit, Amazon Kiro), what is the artifact that everything else derives from?',
        options: [
          'A Figma design file the agent screenshots',
          'The test suite — specs are just tests',
          'An executable, version-controlled spec that expands into a plan, then atomic tasks',
          'A recorded pairing session the agent replays',
        ],
        answer: 2,
        explain: 'The spec is a first-class, version-controlled artifact. Spec expands to plan, plan decomposes into atomic tasks, tasks become code — and the spec is what you review and diff.',
      },
      {
        q: 'Harrison Chase splits AI-era devs into two archetypes. Which pairing is his?',
        options: [
          'Architects vs Implementers',
          'Builders vs Reviewers',
          'Prompters vs Programmers',
          'Pilots vs Passengers',
        ],
        answer: 1,
        explain: 'Builders vs Reviewers. Generation got cheap, so judgment got expensive: review is the new bottleneck, and generalists who can evaluate anything rise in value.',
      },
      {
        q: 'What is the core claim of Simon Willison’s "vibe engineering"?',
        options: [
          'Classic engineering discipline is obsolete — ship whatever the agent writes',
          'AI multiplies the value of testing, planning, docs, CI, and review — discipline became the control surface for agents',
          'Only staff-plus engineers should be allowed to use coding agents',
          'Vibe coding and rigorous engineering are permanently incompatible',
        ],
        answer: 1,
        explain: 'Willison argues AI is a multiplier on classic discipline. Tests, CI, docs, and review are how you steer agents at scale — the practices got MORE valuable, not less.',
      },
    ],
    sections: [
      {
        heading: 'The structural shift',
        blocks: [
          {
            type: 'text',
            md: 'The unit of dev work changed. 2023: a dev writes code while AI autocompletes lines. 2026: a dev **orchestrates agents** that write the code, while the dev owns specs, context, and verification.\n\nThe Anthropic 2026 Agentic Coding Trends Report puts numbers on it: full delegation is still only **0-20%** of work; devs supervise **80-100%**. And it names **context engineering** as THE skill. You are not being replaced — you are being promoted to tech lead of a nonhuman team.',
          },
          {
            type: 'diagram',
            caption: 'The role inverted: from typing code with AI assists to running a pipeline of agents through spec, build, and review gates.',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="320" fill="#18181b" rx="8"/><text x="30" y="36" fill="#a1a1aa" font-size="13">2023 — AI-ASSISTED</text><rect x="30" y="50" width="280" height="70" fill="#27272a" stroke="#52525b" rx="8"/><text x="170" y="80" fill="#e4e4e7" font-size="14" text-anchor="middle">DEV writes code</text><text x="170" y="102" fill="#a1a1aa" font-size="12" text-anchor="middle">AI autocompletes lines</text><text x="30" y="166" fill="#a1a1aa" font-size="13">2026 — AI-NATIVE</text><rect x="30" y="180" width="280" height="50" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="170" y="203" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">DEV orchestrates</text><text x="170" y="221" fill="#a1a1aa" font-size="11" text-anchor="middle">specs - context - verification</text><line x1="170" y1="230" x2="170" y2="255" stroke="#52525b" stroke-width="2"/><rect x="40" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="80" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent 1</text><rect x="130" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="170" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent 2</text><rect x="220" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="260" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent N</text><rect x="370" y="50" width="300" height="245" fill="#27272a" stroke="#52525b" rx="8"/><text x="520" y="78" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">THE AI-NATIVE PIPELINE</text><rect x="400" y="95" width="240" height="34" fill="#18181b" stroke="#38bdf8" rx="6"/><text x="520" y="117" fill="#38bdf8" font-size="13" text-anchor="middle">SPEC (versioned, executable)</text><line x1="520" y1="129" x2="520" y2="143" stroke="#52525b" stroke-width="2"/><rect x="400" y="143" width="240" height="34" fill="#18181b" stroke="#a78bfa" rx="6"/><text x="520" y="165" fill="#a78bfa" font-size="13" text-anchor="middle">PLAN &#8594; atomic tasks</text><line x1="520" y1="177" x2="520" y2="191" stroke="#52525b" stroke-width="2"/><rect x="400" y="191" width="240" height="34" fill="#18181b" stroke="#fbbf24" rx="6"/><text x="520" y="213" fill="#fbbf24" font-size="13" text-anchor="middle">AGENTS build in parallel</text><line x1="520" y1="225" x2="520" y2="239" stroke="#52525b" stroke-width="2"/><rect x="400" y="239" width="240" height="34" fill="#18181b" stroke="#34d399" rx="6"/><text x="520" y="261" fill="#34d399" font-size="13" text-anchor="middle">REVIEW gate (human + agent + CI)</text><text x="520" y="288" fill="#a1a1aa" font-size="11" text-anchor="middle">review is the bottleneck — design for it</text></svg>`,
          },
        ],
      },
      {
        heading: 'Spec-driven development',
        blocks: [
          {
            type: 'text',
            md: 'The spec is now a **first-class, version-controlled artifact** — not a Jira ticket that dies at kickoff. The flow: executable spec, expanded into a plan, decomposed into atomic tasks, each small enough for an agent to complete and a human to review.\n\nTooling made it concrete: **GitHub Spec Kit** and **Amazon Kiro** both treat the spec as the thing you write, diff, and review — code becomes a derived artifact. You already practiced this shape with the interview-to-SPEC.md pattern in Module 3.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why specs beat prompts',
            md: 'A prompt evaporates when the session ends. A spec is durable context: any agent, any session, any model tier can pick it up. When output is wrong, you fix the spec and regenerate — the same move as fixing source instead of patching a binary.',
          },
        ],
      },
      {
        heading: 'Review is the new bottleneck',
        blocks: [
          {
            type: 'text',
            md: 'When generation is nearly free, the constraint moves to judgment. Harrison Chase’s framing: the industry is splitting into **Builders** and **Reviewers**, and the PRD-to-design-to-eng conveyor belt dissolves into one person running the whole loop. **Generalists rise** — broad judgment beats narrow production skill.\n\nScale review like you scaled compute: agent PR reviewers (CodeRabbit, Copilot review, a /code-review pass) catch the mechanical layer; CI agents auto-fix and open remediation PRs; humans review specs and architecture, not every diff line.',
          },
          {
            type: 'compare',
            left: {
              title: 'Builder mode',
              items: [
                'Output: working code from specs, fast',
                'Skill: decomposition + context engineering',
                'Leverage: parallel agents on atomic tasks',
                'Failure mode: shipping what nobody understands',
              ],
            },
            right: {
              title: 'Reviewer mode',
              items: [
                'Output: judgment — merge, redirect, or kill',
                'Skill: reading diffs against intent, fast',
                'Leverage: agent pre-review + CI gates before human eyes',
                'Failure mode: rubber-stamping green checkmarks',
              ],
            },
          },
        ],
      },
      {
        heading: 'Vibe engineering and agent fleets',
        blocks: [
          {
            type: 'text',
            md: 'Simon Willison’s **vibe engineering** is the discipline answer: AI multiplies the value of testing, planning, docs, CI, and review, because those practices are the **control surface for agents**. The classic skills you built as an architect did not depreciate — they became the steering wheel.\n\nSteve Yegge sketches the end state: **agent fleets** — one dev babysitting 100+ agents. You will not review 100 agents’ output by hand; you get there by making the pipeline (specs, gates, CI) do the reviewing.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The through-line',
            md: 'Vibe coding raises the floor; agentic engineering raises the ceiling. The difference between them is whether you read, test, and own what shipped.',
          },
        ],
      },
      {
        heading: 'Doctrine: No Coding Before 10am',
        blocks: [
          {
            type: 'text',
            md: 'Michael Bloch’s "No Coding Before 10am" is the most concrete daily doctrine in circulation:\n\n- Mornings are **pair-prompting**: specs, plans, context — no code before 10am\n- Treat **agents as the system’s primary users**: legibility for models is a design requirement\n- **Code is context, not library** — cheap to regenerate, so optimize for readability over reuse\n- Validate against **objectives, not lines of code**\n- **Delete dead code immediately** — agents will read it and believe it\n- **Automate anything you repeat twice**; expect a tech shift every ~3 months',
          },
          {
            type: 'table',
            headers: ['New failure term', 'What it names', 'The counter-move'],
            rows: [
              ['Comprehension debt', 'Shipped code nobody on the team understands well enough to change safely', 'Supervised delegation; review specs and diffs, never merge unread'],
              ['Haunted codebase', 'A repo devs fear touching because generated layers interact in unknown ways', 'Delete dead code immediately; keep specs current; small atomic tasks'],
              ['Rubber-stamp review', 'Approving on green CI without reading against intent', 'Agent pre-review for mechanics; human review reserved for intent and design'],
            ],
          },
        ],
      },
    ],
    lab: {
      title: 'Write your personal AI-native doctrine',
      intro: 'Every practice in this lesson is someone else’s doctrine. Yours has to fit your judgment, your risk tolerance, and your actual projects. Write it down and version it.',
      steps: [
        'Create DOCTRINE.md in your dotfiles or main project repo — this lives under version control, like a spec for how you work.',
        'Section 1 — WHEN I SPEC: define the threshold (task size, blast radius, ambiguity) above which you write a spec before any agent touches code.',
        'Section 2 — WHEN I DELEGATE: list task types you hand to agents supervised vs the narrow set you fully delegate, honestly calibrated against the 0-20% reality.',
        'Section 3 — HOW I VERIFY: name the binary signal per project type (test suite, build, screenshot diff) and where it runs — Stop hook, CI, or verification subagent.',
        'Section 4 — WHEN I REVIEW: define what agents pre-review vs what you read personally, and your rule against merging code you have not read.',
        'Steal at least two Bloch rules verbatim (dead-code deletion and automate-twice are good defaults) and adapt one you disagree with — write down why.',
        'Test it tomorrow morning: run one real task end-to-end under the doctrine and note where it broke down; amend the file.',
      ],
      checklist: [
        'DOCTRINE.md exists in version control with all four sections filled in',
        'Spec threshold is concrete enough that a given task clearly falls above or below it',
        'Verification section names a binary pass/fail signal for each active project',
        'At least one rule was tested on a real task and amended from experience',
      ],
    },
    checkQuiz: [
      {
        q: 'In Bloch’s "No Coding Before 10am" doctrine, what are mornings reserved for?',
        options: [
          'Reviewing overnight agent PRs before they go stale',
          'Pair-prompting: specs, plans, and context work — no code until 10am',
          'Manual coding while your mind is fresh, agents in the afternoon',
          'Meetings, so agent time stays uninterrupted later',
        ],
        answer: 1,
        explain: 'Mornings go to pair-prompting — shaping specs, plans, and context. The thesis: thinking work compounds through every agent-hour that follows; typing code does not.',
      },
      {
        q: 'Bloch says to treat a specific audience as the "primary users" of your system. Who?',
        options: [
          'End customers — obviously',
          'Future maintainers, per classic Clean Code doctrine',
          'The agents that will read, navigate, and modify the codebase',
          'The security team',
        ],
        answer: 2,
        explain: 'Agents are the primary users: they read your code, docs, and structure far more often than humans do now. Legibility-to-models becomes a first-order design requirement.',
      },
      {
        q: 'What is "comprehension debt"?',
        options: [
          'The backlog of documentation agents have not generated yet',
          'Shipped, working code that nobody on the team understands well enough to change safely',
          'Token cost wasted on re-explaining context every session',
          'The onboarding lag before a new hire trusts agent output',
        ],
        answer: 1,
        explain: 'Comprehension debt is the gap between what your codebase does and what your team understands. It accrues silently with every unread merge and gets paid back at incident time.',
      },
      {
        q: 'What end state does Yegge’s agent-fleet trajectory describe, and what makes it viable?',
        options: [
          'Agents replacing devs entirely — no human in the loop',
          'One dev supervising 100+ agents, made viable by pipeline gates (specs, CI, agent review) doing most of the checking',
          'Every dev capped at one agent to keep review load sane',
          'Fleets of fine-tuned small models replacing frontier models',
        ],
        answer: 1,
        explain: 'The fleet vision is one human, 100+ agents. It only works if verification is systematized — specs, CI gates, and agent pre-review absorb the checking a human cannot scale to.',
      },
    ],
    resources: [
      { label: 'Vibe engineering — Simon Willison', url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/', kind: 'article' },
      { label: 'GitHub Spec Kit — spec-driven development toolkit', url: 'https://github.com/github/spec-kit', kind: 'repo' },
      { label: 'Amazon Kiro — spec-first agentic IDE', url: 'https://kiro.dev', kind: 'docs' },
      { label: 'Revenge of the Junior Developer — Steve Yegge', url: 'https://sourcegraph.com/blog/revenge-of-the-junior-developer', kind: 'article' },
      { label: 'Anthropic engineering blog (agentic coding posts)', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'CodeRabbit — agentic PR review', url: 'https://www.coderabbit.ai', kind: 'docs' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m7-l3 — Capstone Launch
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l3',
    title: 'Capstone Launch',
    day: 22,
    minutes: 35,
    xp: 100,
    objectives: [
      'Can articulate the five through-lines of the course and map each to the modules that taught it',
      'Can choose a capstone track based on what you will actually sustain, not what sounds impressive',
      'Can run a personal staying-current system for a field with a six-month half-life',
    ],
    skipQuiz: [
      {
        q: 'Which of these is NOT one of the five through-lines of this course?',
        options: [
          'The harness matters more than the model',
          'Verification is the quality lever',
          'Bigger models beat better scaffolding, so always buy the frontier',
          'Files are the agent substrate',
        ],
        answer: 2,
        explain: 'The course argues the opposite: harness improvements moved 116/126 setups without touching the model. Scaffolding, loops, verification, files, and context engineering are the levers.',
      },
      {
        q: 'The feature-validation heuristic for cutting through AI hype says a capability is real when...',
        options: [
          'It has more than 10k GitHub stars',
          'Both OpenAI and Anthropic have shipped it natively',
          'Three or more influencer threads cover it in the same week',
          'It appears in a peer-reviewed paper',
        ],
        answer: 1,
        explain: 'Independent native adoption by both major labs is the strongest cheap signal that something is a durable primitive (skills, MCP, caching) rather than a demo.',
      },
      {
        q: 'What is the recommended basis for choosing your capstone track?',
        options: [
          'Whichever track produces the best portfolio piece',
          'The hardest one — maximum learning per hour',
          'What you will actually sustain after the course ends',
          'Whichever most resembles your day job',
        ],
        answer: 2,
        explain: 'A capstone you abandon in week two teaches less than a modest one you run for months. Sustained contact with the tools is the point — pick for durability.',
      },
      {
        q: 'For staying current, the course ranks one information source clearly above the rest. Which?',
        options: [
          'Influencer threads — fastest signal',
          'Official changelogs and release notes from the labs',
          'Conference talks — most depth',
          'Reddit and Hacker News comment sections',
        ],
        answer: 1,
        explain: 'Official changelogs are dense, accurate, and first. Influencer threads are lossy compressions of them, days later, with hype added. Read the source.',
      },
      {
        q: '"Files are the agent substrate" claims markdown folders beat databases for agent state because...',
        options: [
          'Files are faster to query than any database',
          'Files are legible and editable by both humans and models, with git for versioning and diff',
          'Databases cannot store markdown reliably',
          'Vector stores hallucinate; files never do',
        ],
        answer: 1,
        explain: 'The substrate argument is legibility: CLAUDE.md, SKILL.md, specs, and memory files can be read, diffed, and fixed by you and the model alike. Databases hide state from the loop.',
      },
    ],
    sections: [
      {
        heading: 'The five through-lines',
        blocks: [
          {
            type: 'text',
            md: 'Thirty days compress into five ideas. Everything you built — CLAUDE.md files, skills, hooks, subagents, RAG pipelines, cost models — is one of these wearing different clothes:\n\n- **Harness > model** — same model, 31% to 75%, scaffolding alone\n- **Loops > prompts** — prompt, act, check against real criteria, decide, repeat\n- **Verification is the quality lever** — binary pass/fail signals, 2-3x quality\n- **Files are the agent substrate** — markdown legible to humans and models\n- **Context engineering everywhere** — the smallest set of high-signal tokens, always',
          },
          {
            type: 'diagram',
            caption: 'The course in one picture: five through-lines as the stack every module was secretly teaching.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b" rx="8"/><text x="290" y="32" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE STACK YOU BUILT</text><rect x="60" y="320" width="460" height="44" fill="#27272a" stroke="#52525b" rx="8"/><text x="290" y="341" fill="#e4e4e7" font-size="14" text-anchor="middle">MODEL — raw capability</text><text x="290" y="357" fill="#a1a1aa" font-size="11" text-anchor="middle">m0-m1 foundations - m5 local models and fine-tuning</text><rect x="60" y="252" width="460" height="56" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="290" y="275" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. HARNESS &gt; MODEL</text><text x="290" y="295" fill="#a1a1aa" font-size="11" text-anchor="middle">m2-m3 Claude Code mastery - tools, memory, skills, hooks, subagents</text><rect x="60" y="184" width="460" height="56" fill="#27272a" stroke="#a78bfa" rx="8"/><text x="290" y="207" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">2. LOOPS &gt; PROMPTS</text><text x="290" y="227" fill="#a1a1aa" font-size="11" text-anchor="middle">m4 loop engineering - plan, act, check, re-prompt, stop conditions</text><rect x="60" y="116" width="460" height="56" fill="#27272a" stroke="#34d399" rx="8"/><text x="290" y="139" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">3. VERIFICATION = QUALITY LEVER</text><text x="290" y="159" fill="#a1a1aa" font-size="11" text-anchor="middle">tests, builds, screenshots, stop hooks - binary pass/fail gates</text><rect x="60" y="52" width="460" height="52" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="290" y="74" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">SHIPPED WORK</text><text x="290" y="93" fill="#a1a1aa" font-size="11" text-anchor="middle">m6 design + RAG in the loop - m7 costs, SDLC, capstone</text><line x1="290" y1="320" x2="290" y2="308" stroke="#52525b" stroke-width="2"/><line x1="290" y1="252" x2="290" y2="240" stroke="#52525b" stroke-width="2"/><line x1="290" y1="184" x2="290" y2="172" stroke="#52525b" stroke-width="2"/><line x1="290" y1="116" x2="290" y2="104" stroke="#52525b" stroke-width="2"/><rect x="544" y="52" width="126" height="150" fill="#27272a" stroke="#f472b6" rx="8"/><text x="607" y="76" fill="#f472b6" font-size="13" text-anchor="middle" font-weight="bold">4. FILES</text><text x="607" y="96" fill="#a1a1aa" font-size="10" text-anchor="middle">CLAUDE.md</text><text x="607" y="112" fill="#a1a1aa" font-size="10" text-anchor="middle">SKILL.md - spec.md</text><text x="607" y="128" fill="#a1a1aa" font-size="10" text-anchor="middle">memory.md</text><text x="607" y="144" fill="#a1a1aa" font-size="10" text-anchor="middle">DESIGN.md</text><text x="607" y="168" fill="#a1a1aa" font-size="10" text-anchor="middle">state the loop</text><text x="607" y="182" fill="#a1a1aa" font-size="10" text-anchor="middle">can read and edit</text><rect x="544" y="214" width="126" height="150" fill="#27272a" stroke="#e4e4e7" rx="8"/><text x="607" y="238" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">5. CONTEXT</text><text x="607" y="254" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">ENGINEERING</text><text x="607" y="278" fill="#a1a1aa" font-size="10" text-anchor="middle">attention budget</text><text x="607" y="294" fill="#a1a1aa" font-size="10" text-anchor="middle">JIT retrieval</text><text x="607" y="310" fill="#a1a1aa" font-size="10" text-anchor="middle">compaction - notes</text><text x="607" y="326" fill="#a1a1aa" font-size="10" text-anchor="middle">subagent isolation</text><text x="607" y="350" fill="#a1a1aa" font-size="10" text-anchor="middle">spans every layer</text></svg>`,
          },
        ],
      },
      {
        heading: 'Running the capstone',
        blocks: [
          {
            type: 'text',
            md: 'Three tracks are live on the **Capstone page**. Do not pick the most impressive one — pick the one you will still be running in October. Sustained contact with the tools is where expertise actually forms.',
          },
          {
            type: 'table',
            headers: ['Track', 'You build', 'Best if'],
            rows: [
              [
                'Personal AI OS',
                'A file-based life/work system: vault + CLAUDE.md hierarchy, skills as SOPs, memory files, scheduled agents',
                'You want daily compounding value and your notes/ops are the honest bottleneck',
              ],
              [
                'Build Your Own Harness',
                'A minimal agent harness from scratch: loop, tool execution, context management, verification, spend tracking',
                'You learn by building internals and want harness design to stop being magic',
              ],
              [
                'Ship an App AI-Natively',
                'A real product built end-to-end under your doctrine: spec-driven, agent-built, agent-reviewed, CI-gated',
                'You need a shipped artifact and want the full AI-native SDLC under load',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The honest picker',
            md: 'Ask one question: **which of these would I keep touching even on a bad week?** That answer beats any portfolio logic. All three exercise the five through-lines; they differ only in what you are left holding.',
          },
        ],
      },
      {
        heading: 'Staying current in a six-month-half-life field',
        blocks: [
          {
            type: 'text',
            md: 'Half of what this course taught will be superseded within a year — the through-lines will survive, the tool specifics will not. You need a system, not vigilance:\n\n- **Official changelogs over influencer threads** — read the source, skip the lossy retelling\n- **Feature-validation heuristic**: if both OpenAI and Anthropic shipped it natively, it is real\n- **Re-evaluate tools quarterly** — a calendar slot, not a mood\n- **Keep a LESSONS.md on yourself** — log your misjudgments and corrections; you are the system under version control now',
          },
          {
            type: 'compare',
            left: {
              title: 'High-signal (subscribe)',
              items: [
                'Claude Code + API changelogs and release notes',
                'Anthropic engineering blog',
                'Simon Willison’s newsletter',
                'Key repos: watch releases, not stars',
              ],
            },
            right: {
              title: 'Low-signal (skim, never act on alone)',
              items: [
                'Influencer threads recycling changelogs with hype',
                'Benchmark-war screenshots without methodology',
                '"X is dead" takes on any tool under 6 months old',
                'Demos with no repo, no pricing, no failure cases',
              ],
            },
          },
        ],
      },
      {
        heading: 'Continued paths',
        blocks: [
          {
            type: 'text',
            md: 'Where to go from Day 22:\n\n- **Anthropic Skilljar courses** — free, certificated; start with the agent-skills and Claude Code tracks\n- **Anthropic engineering blog** — the primary source for agent-building doctrine\n- **Willison’s newsletter** — the field’s best running commentary, weekly\n- **Repos to watch**: claude-code, the Agent Skills standard, and one harness repo you read source on\n\nThe curriculum ends today. The loop does not: prompt, act, check, re-prompt — now applied to you.',
          },
        ],
      },
    ],
    lab: {
      title: 'Launch your capstone — today',
      intro: 'Momentum decays fast after a course ends. The antidote is starting the capstone within the hour, not planning to start it.',
      steps: [
        'Open the Capstone page in this app and read all three track descriptions and their requirement checklists end to end.',
        'Run the honest picker: for each track, write one line on whether you would touch it on a bad week. Pick the survivor.',
        'Select your track in the app so progress tracking starts.',
        'Read your chosen track’s first requirement and complete it TODAY — repo created, vault initialized, or spec drafted, depending on track.',
        'Create LESSONS.md at the repo root and log entry #1: which track you picked, what you almost picked, and why the honest picker overrode it.',
        'Set a quarterly tool re-evaluation slot on your calendar (30 minutes, recurring) and subscribe to the Claude Code changelog and one newsletter.',
      ],
      checklist: [
        'A capstone track is selected in the app with the one-line rationale written down',
        'First track requirement is verifiably complete today (repo, vault, or spec exists)',
        'LESSONS.md exists with its first real entry',
        'Quarterly re-evaluation slot is on the calendar and changelog subscription is live',
      ],
    },
    checkQuiz: [
      {
        q: 'What goes in the LESSONS.md the course tells you to keep on yourself?',
        options: [
          'A changelog of every tool release you read about',
          'Your own misjudgments and corrections — a versioned log of how your judgment is changing',
          'Summaries of each course module for later review',
          'Prompts that worked well, for reuse',
        ],
        answer: 1,
        explain: 'It is a lessons-learned file about you: bad calls, wrong predictions, corrections. The same pattern agents use to stop repeating mistakes, applied to your own judgment.',
      },
      {
        q: 'What cadence does the course prescribe for re-evaluating your tool choices?',
        options: [
          'Weekly — the field moves too fast for anything slower',
          'Whenever a major model releases',
          'Quarterly, as a scheduled calendar slot',
          'Annually, to avoid churn',
        ],
        answer: 2,
        explain: 'Quarterly on the calendar. Faster is churn that destroys compounding; slower goes stale in a six-month-half-life field. Scheduling it removes the decision from mood.',
      },
      {
        q: 'The "verification is the quality lever" through-line says agent output quality improves most when you...',
        options: [
          'Upgrade to the largest model tier available',
          'Write longer, more detailed prompts',
          'Give the loop a binary pass/fail signal — tests, builds, screenshots — it must satisfy before claiming done',
          'Lower the temperature to zero',
        ],
        answer: 2,
        explain: 'A real, checkable signal in the loop (with a stop hook to enforce it) is worth 2-3x on quality — more than a model-tier upgrade or prompt-polishing delivers.',
      },
      {
        q: 'You most want harness internals — context management, tool dispatch, termination — to stop being magic. Which track?',
        options: [
          'Personal AI OS',
          'Build Your Own Harness',
          'Ship an App AI-Natively',
          'Any track — they all cover harness internals equally',
        ],
        answer: 1,
        explain: 'Build Your Own Harness has you implement the loop, tool execution, context handling, and verification yourself — the only track where harness internals are the deliverable.',
      },
    ],
    resources: [
      { label: 'Anthropic Skilljar — free certificated courses', url: 'https://anthropic.skilljar.com', kind: 'course' },
      { label: 'Anthropic engineering blog', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'Simon Willison’s weblog + newsletter', url: 'https://simonwillison.net', kind: 'article' },
      { label: 'Claude Code repo — watch releases', url: 'https://github.com/anthropics/claude-code', kind: 'repo' },
      { label: 'Agent Skills open standard', url: 'https://agentskills.io', kind: 'docs' },
    ],
  },
]
