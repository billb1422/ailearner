import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m7-l1: Modeling Agent Costs
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l1',
    title: 'Modeling Agent Costs',
    day: 22,
    minutes: 50,
    xp: 100,
    objectives: [
      'Can explain, with a worked example, why an uncached agent session gets more expensive with every turn while a cached one stays roughly flat per turn',
      'Can estimate a monthly agent budget with the sessions x turns x token-mix formula, using numbers from real usage',
      'Can name the sneaky things that break a prompt cache without throwing any error, and rank the three cost levers for an agent workload',
      'Can make a defensible pay-as-you-go vs flat-plan decision for a given daily spend, with the numbers to back it up',
    ],
    skipQuiz: [
      {
        q: 'An agent session runs 40 turns with prompt caching turned off. Why does the total cost curve bend upward as the session goes on, instead of climbing in a straight line?',
        options: [
          'Output tokens get pricier late in a session because the model has to reason harder',
          'Every turn resends the whole conversation so far as fresh input, so the input bill for the session grows roughly with the square of the turn count',
          'Rate limits force retries, and retried requests are billed at a premium',
          'Tool results are billed at twice the normal input rate',
        ],
        answer: 1,
        explain: 'The full transcript goes back to the model on every single turn. By turn 30 you are paying to send turns 1 through 29 all over again, on top of the new material. Add those ever-growing sends together across a session and the total input scales with roughly the turn count squared.',
      },
      {
        q: 'You turn on prompt caching with the 1-hour cache lifetime on Anthropic. Writing a segment into the cache costs extra the first time. How much extra?',
        options: [
          'Nothing extra, since cache writes bill at the normal input rate',
          '1.25x the base input rate',
          '2x the base input rate',
          '10x the base input rate',
        ],
        answer: 2,
        explain: 'The 1-hour cache lifetime costs 2x the base input rate to write, and the shorter 5-minute lifetime costs 1.25x. Either way, every later read of that cached text bills at just 0.1x the input rate, and that 90% discount is where all the savings live.',
      },
      {
        q: 'Which of these will quietly wreck your cache hit rate without ever showing an error?',
        options: [
          'Putting the current timestamp near the top of the system prompt',
          'Choosing the 1-hour cache lifetime instead of the 5-minute one',
          'Running sessions through the Batch API',
          'Keeping the tool list identical on every request',
        ],
        answer: 0,
        explain: 'Cache matching works on exact prefixes: the start of your new request has to match the cached text byte for byte. A timestamp changes on every request, which changes the prefix, which invalidates everything after it. The API happily bills you full price and never complains.',
      },
      {
        q: 'What discount does the Batch API offer, and how consistent is that across providers as of mid-2026?',
        options: [
          'A variable 10-30% discount that depends on queue depth',
          'A flat 50% off, and Anthropic, OpenAI, and Google all offer the same deal',
          '90% off input tokens only, and only from Anthropic',
          '50% off, but only when you combine it with prompt caching',
        ],
        answer: 1,
        explain: 'Batch pricing is a flat half-off at all three major providers. The trade is time: batch jobs run asynchronously and can take hours to come back, so they fit overnight and offline work. For an interactive session where you are waiting on the answer, batch is useless.',
      },
      {
        q: 'What does the median Claude Code developer actually spend per day, measured in API-equivalent terms?',
        options: [
          'About $60 a day, because agents are just expensive',
          'About $25 a day, with the top tenth near $100',
          'About $6 a day, and 90% of developers stay under $12',
          'Under $1 a day for nearly everyone',
        ],
        answer: 2,
        explain: 'Median spend sits around $6 a day in API-equivalent terms, and nine out of ten developers stay under $12. The scary weekend-bill stories come from people running big multi-agent fleets. Those stories are real, and they are also far from typical.',
      },
    ],
    sections: [
      {
        heading: 'Agents bill by the loop',
        blocks: [
          {
            type: 'text',
            md: 'Start with how normal chat pricing works, because that intuition is what breaks on agents. When a program calls a model through the **API** (application programming interface, the pay-per-use channel software uses to talk to the model directly), one request means one exchange: you send some text in, the model sends some text back, and you pay for both sides. The text is measured in **tokens**, which are word chunks of about 3-4 characters each. Roughly 750 English words come out to about 1,000 tokens.\n\nAn agent works differently, because the model has no memory between requests. Every turn, the agent sends the model the *entire conversation so far*: the system prompt, the tool list, every message, and every tool result since the session began. The model reads all of it again, produces one more reply, and then forgets everything. Next turn, the whole transcript (now a little longer) gets sent again.\n\nSo by turn 30 of a session, you\'re paying to send turns 1 through 29 all over again, plus turn 30\'s new material. That re-buying of old text is where agent bills come from, and it\'s the one idea this entire lesson hangs on.',
          },
          {
            type: 'diagram',
            caption: 'Same 4-turn session, two very different bills. Uncached, each turn buys the whole transcript again at full price. Cached, anything already seen bills at a tenth of the price.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b" rx="8"/><text x="30" y="34" fill="#e4e4e7" font-size="15" font-weight="bold">UNCACHED: every block full price</text><text x="380" y="34" fill="#e4e4e7" font-size="15" font-weight="bold">CACHED: old blocks at 0.1x</text><g><rect x="30" y="60" width="40" height="30" fill="#f472b6" rx="3"/><text x="80" y="80" fill="#a1a1aa" font-size="12">turn 1: fresh</text><rect x="30" y="100" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="100" width="44" height="30" fill="#f472b6" rx="3"/><text x="128" y="120" fill="#a1a1aa" font-size="12">turn 2: re-buys turn 1</text><rect x="30" y="140" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="140" width="44" height="30" fill="#f472b6" rx="3"/><rect x="122" y="140" width="48" height="30" fill="#f472b6" rx="3"/><text x="180" y="160" fill="#a1a1aa" font-size="12">turn 3</text><rect x="30" y="180" width="40" height="30" fill="#f472b6" rx="3"/><rect x="74" y="180" width="44" height="30" fill="#f472b6" rx="3"/><rect x="122" y="180" width="48" height="30" fill="#f472b6" rx="3"/><rect x="174" y="180" width="52" height="30" fill="#f472b6" rx="3"/><text x="236" y="200" fill="#a1a1aa" font-size="12">turn 4</text><text x="30" y="245" fill="#f472b6" font-size="13">every block bills at the full input rate</text></g><g><rect x="380" y="60" width="40" height="30" fill="#38bdf8" rx="3"/><text x="430" y="80" fill="#a1a1aa" font-size="12">turn 1: cache write (1.25-2x)</text><rect x="380" y="100" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="100" width="44" height="30" fill="#34d399" rx="3"/><text x="478" y="120" fill="#a1a1aa" font-size="12">turn 2: read 0.1x + fresh</text><rect x="380" y="140" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="140" width="44" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="472" y="140" width="48" height="30" fill="#34d399" rx="3"/><text x="530" y="160" fill="#a1a1aa" font-size="12">turn 3</text><rect x="380" y="180" width="40" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="424" y="180" width="44" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="472" y="180" width="48" height="30" fill="#27272a" stroke="#38bdf8" stroke-dasharray="4 3" rx="3"/><rect x="524" y="180" width="52" height="30" fill="#34d399" rx="3"/><text x="586" y="200" fill="#a1a1aa" font-size="12">turn 4</text><text x="380" y="245" fill="#34d399" font-size="13">dashed = 0.1x cache read; solid green = new tokens</text></g><rect x="30" y="270" width="640" height="46" fill="#27272a" stroke="#52525b" rx="6"/><text x="350" y="298" fill="#e4e4e7" font-size="14" text-anchor="middle">Agents resend the whole transcript every turn, so caching is the pricing model.</text></svg>`,
          },
        ],
      },
      {
        heading: 'Follow one session\'s money',
        blocks: [
          {
            type: 'text',
            md: 'Make it concrete with one example session and follow the money through it. Say the agent has a 5,000-token system prompt (its instructions plus tool definitions), and every turn adds 500 tokens of fresh input (your message, or a tool result coming back) and 800 tokens of model output. The session runs 20 turns.\n\n- Turn 1 sends 5,000 + 500 = **5,500 input tokens**\n- Turn 2 sends all of that again, plus turn 1\'s 800-token reply, plus 500 new tokens: **6,800 input tokens**\n- The transcript grows by 1,300 tokens each turn (500 in plus 800 out), so every send is 1,300 tokens bigger than the last\n- Turn 10 sends **17,200 tokens**; turn 20 sends **30,200 tokens**, nearly six times what turn 1 sent\n\nNow add up all 20 sends: this session pushed **357,000 input tokens** through the model, even though only about 31,000 tokens of genuinely new text ever existed. When each send is a fixed amount bigger than the one before, the running total grows like the area of a triangle: double the turns and you roughly quadruple the input bill. Mathematicians call that shape **quadratic** growth, and it\'s why long agent sessions surprise people. On [Sonnet 5 pricing](https://www.anthropic.com/pricing) of $3 per million input tokens and $15 per million output tokens, this one session costs about $1.07 in input plus $0.24 in output: **$1.31 total**, for one session.',
          },
          {
            type: 'diagram',
            caption: 'Input tokens sent per turn in the worked example. The pink bars keep growing because each turn resends everything. With caching, only the green sliver (about 1,300 new tokens per turn) bills at full price.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="340" fill="#18181b" rx="8"/><text x="30" y="32" fill="#e4e4e7" font-size="15" font-weight="bold">Input tokens sent per turn (20-turn example)</text><line x1="40" y1="280" x2="660" y2="280" stroke="#52525b" stroke-width="2"/><rect x="70" y="244" width="50" height="36" fill="#f472b6" rx="3"/><rect x="126" y="271" width="18" height="9" fill="#34d399" rx="2"/><text x="95" y="236" fill="#e4e4e7" font-size="11" text-anchor="middle">5.5k</text><text x="105" y="298" fill="#a1a1aa" font-size="12" text-anchor="middle">turn 1</text><rect x="190" y="209" width="50" height="71" fill="#f472b6" rx="3"/><rect x="246" y="271" width="18" height="9" fill="#34d399" rx="2"/><text x="215" y="201" fill="#e4e4e7" font-size="11" text-anchor="middle">10.7k</text><text x="225" y="298" fill="#a1a1aa" font-size="12" text-anchor="middle">turn 5</text><rect x="310" y="166" width="50" height="114" fill="#f472b6" rx="3"/><rect x="366" y="271" width="18" height="9" fill="#34d399" rx="2"/><text x="335" y="158" fill="#e4e4e7" font-size="11" text-anchor="middle">17.2k</text><text x="345" y="298" fill="#a1a1aa" font-size="12" text-anchor="middle">turn 10</text><rect x="430" y="123" width="50" height="157" fill="#f472b6" rx="3"/><rect x="486" y="271" width="18" height="9" fill="#34d399" rx="2"/><text x="455" y="115" fill="#e4e4e7" font-size="11" text-anchor="middle">23.7k</text><text x="465" y="298" fill="#a1a1aa" font-size="12" text-anchor="middle">turn 15</text><rect x="550" y="80" width="50" height="200" fill="#f472b6" rx="3"/><rect x="606" y="271" width="18" height="9" fill="#34d399" rx="2"/><text x="575" y="72" fill="#e4e4e7" font-size="11" text-anchor="middle">30.2k</text><text x="585" y="298" fill="#a1a1aa" font-size="12" text-anchor="middle">turn 20</text><rect x="40" y="312" width="12" height="12" fill="#f472b6" rx="2"/><text x="58" y="322" fill="#a1a1aa" font-size="12">tokens resent at full price, no cache</text><rect x="320" y="312" width="12" height="12" fill="#34d399" rx="2"/><text x="338" y="322" fill="#a1a1aa" font-size="12">full-price tokens with caching (~1.3k flat; the rest reads at 0.1x)</text></svg>`,
          },
          {
            type: 'text',
            md: '**Prompt caching** is the fix, and it\'s built into the API. The provider stores your transcript on their servers for a short window, so the next turn can point at the stored copy instead of paying full price to resend it. Two operations matter, and each has its own price:\n\n- A **cache write** stores new text in the cache. It costs a small premium over normal input: 1.25x the base rate for the standard cache, 2x for the long-lived one.\n- A **cache read** happens when a new request starts with text the cache already holds. Those tokens bill at **0.1x** the input rate, a 90% discount.\n\nRerun the same 20-turn session with caching on. Each chunk of text gets written once at the small premium, then every later turn reads it back at a tenth of the price. The input bill drops from about $1.07 to about **$0.21**, and the whole session lands near **$0.45 instead of $1.31**. Each turn now pays full price only for what\'s genuinely new, so per-turn cost stays roughly flat and the session total grows in a straight line instead of a curve.',
          },
          {
            type: 'table',
            headers: ['The receipt', 'No caching', 'With caching'],
            rows: [
              [
                'Input over 20 turns',
                '357,000 tokens at $3/M: about $1.07',
                '~30,200 tokens written at 1.25x, then ~327,000 cache reads at 0.1x: about $0.21',
              ],
              [
                'Output (20 turns x 800 tokens)',
                '16,000 tokens at $15/M: about $0.24',
                'Same $0.24, since output never gets a cache discount',
              ],
              ['Session total', 'About $1.31', 'About $0.45'],
              ['Shape of the cost curve', 'Bends upward (quadratic in turns)', 'Roughly a straight line'],
            ],
          },
        ],
      },
      {
        heading: 'The formula',
        blocks: [
          {
            type: 'text',
            md: 'One line of arithmetic models any agent workload. You estimate four things from your own usage: how many sessions you run per day, how many turns a typical session lasts, and roughly how many tokens each turn spends in each of three buckets (fresh input, cached input, and output). Then you multiply it all out:',
          },
          {
            type: 'code',
            lang: 'text',
            code: 'monthly ~= sessions/day\n         x turns/session\n         x ( fresh_input  x input_rate\n           + cached_input x 0.1 x input_rate\n           + output       x output_rate )\n         x 30\n\n// Example: 6 sessions/day, 25 turns, per-turn averages\n// 2k fresh in, 40k cached in, 1.5k out, on Sonnet 5 ($3/$15 per M):\n// 6 x 25 x (2000x0.000003 + 40000x0.0000003 + 1500x0.000015) x 30\n// ~= 6 x 25 x $0.0405 x 30  ~=  $182/month',
            caption: 'The loop-cost formula with a worked example. Look at the cached term: 40,000 tokens of history costs less than 2,000 tokens of fresh input.',
          },
          {
            type: 'text',
            md: 'Two things in that example deserve a long stare. First, **cached history is nearly free**: the 40,000 cached tokens bill the same as about 4,000 fresh ones, so a long transcript stops being scary once caching works. Second, **output is the expensive bucket**. Output tokens cost 5x what input tokens do ($15 vs $3 per million on Sonnet 5), so a chatty agent that pastes whole files into its replies instead of making small targeted edits can double your bill while doing zero extra work.',
          },
        ],
      },
      {
        heading: 'Caching deep dive',
        blocks: [
          {
            type: 'text',
            md: 'One more term before the price table: **TTL**, short for time to live. A TTL is how long the provider keeps your cached text around before throwing it away. Anthropic offers two flavors: a 5-minute TTL, which refreshes every time the cache gets read (so an active session keeps itself alive), and a 1-hour TTL for workflows with long quiet gaps between turns, like a session waiting on a human to approve something.',
          },
          {
            type: 'table',
            headers: ['Cache operation', 'Price vs base input', 'What it means for you'],
            rows: [
              ['Cache read (a hit)', '0.1x', 'The payoff: previously cached text bills at a tenth of the normal input price'],
              ['Cache write, 5-min TTL', '1.25x', 'The default. Fine for active agent loops, because every new turn resets the clock'],
              ['Cache write, 1-hr TTL', '2x', 'Worth it when minutes pass between turns, such as a human-approval workflow'],
              ['Breakeven point', '2 requests', 'One write (1.25x) plus one read (0.1x) already beats paying full price twice (2.0x)'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Silent cache killers',
            md: 'Cache matching is **prefix-exact**: your new request has to start with exactly the same bytes as the cached one, and the match dies at the first difference. Everything after that point bills at full price. Worse, nothing warns you when it happens. The request succeeds, and the bill is just quietly 10x bigger. The usual culprits:\n\n- A timestamp or a random request ID injected near the top of the system prompt (it changes every request, so it breaks everything below it)\n- JSON that gets serialized with keys in a different order from one request to the next\n- A tool list that changes between requests, because tool definitions are part of the cached prefix too\n\nTo audit, compare cache-read tokens against total input tokens in the API\'s usage response. A long session showing near-zero cache reads means one of these is biting you.',
          },
        ],
      },
      {
        heading: 'The three levers, ranked',
        blocks: [
          {
            type: 'text',
            md: 'Three levers move agent spend, and they differ a lot in how much money each one moves. Work them in this order:\n\n- **Model tier.** Prices span 10x or more between the smallest and largest models, so routing easy work (triage, extraction, glue code) to a cheap model is the first move.\n- **Caching.** For agent loops specifically this is the biggest lever, because a loop\'s input is mostly re-read history, and history is exactly what caching discounts by 90%.\n- **The Batch API.** A batch job is one you submit and walk away from: results come back asynchronously, sometimes hours later. In exchange for the wait, all three major providers knock a flat 50% off. Use it for evals, data backfills, overnight report runs, anything where nobody is watching a spinner.',
          },
          {
            type: 'table',
            headers: ['Model (July 2026)', 'Input / M tok', 'Output / M tok', 'Route here for'],
            rows: [
              ['Fable 5', '$10', '$50', 'The hardest reasoning, 1M-token context, final review passes'],
              ['Opus 4.8', '$5', '$25', 'Deep coding sessions and architecture work'],
              ['Sonnet 5', '$3 ($2 intro thru Aug 31)', '$15 ($10 intro)', 'The workhorse: most agent loops live here'],
              ['Haiku 4.5', '$1', '$5', 'Triage, extraction, and subagent grunt work'],
            ],
          },
        ],
      },
      {
        heading: 'Anchors and the plan-vs-API call',
        blocks: [
          {
            type: 'text',
            md: 'Before trusting your own model, sanity-check it against real-world anchors. The median Claude Code developer spends about **$6 a day** in API-equivalent terms, and 90% stay under **$12 a day**. Heavy multi-agent users clear **$1,000+ a month** on metered pricing, and that group is exactly why flat monthly plans exist: a Max plan at $100-200 a month is a bargain for anyone whose metered usage would cost more.\n\nThat gives you a clean decision rule. The crossover sits around **$6-10 a day** of sustained usage. Below that line, pay-as-you-go API billing wins. Above it, a flat plan caps your downside, including the specific downside of a runaway loop billing you while you sleep.',
          },
          {
            type: 'compare',
            left: {
              title: 'Pay-as-you-go API',
              items: [
                'Wins below roughly $6/day of sustained usage',
                'Fits spiky or seasonal workloads that would waste a flat plan',
                'Fits production apps that pass costs through to each customer',
                'Full control: batch discounts, caching, model routing',
                'Downside: a runaway loop can bill you in your sleep',
              ],
            },
            right: {
              title: 'Flat plan (Pro $20 / Max $100-200)',
              items: [
                'Wins above the $6-10/day crossover',
                'Fits daily-driver Claude Code use and multi-agent habits',
                'Spend is predictable, and runaway loops are capped',
                'Heavy fleet users turn $1,000+/month of metered API into $200',
                'Downside: rolling rate limits, and no batch discount',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Build your agent cost model',
      intro: 'Stop guessing at what agents cost you. Model your own expected monthly workload with real numbers, then make the plan-vs-API call with evidence instead of vibes.',
      steps: [
        'Create a spreadsheet (or a markdown doc with a table) with these columns: workload, sessions/day, turns/session, fresh input tokens per turn, cached input tokens per turn, output tokens per turn, and model.',
        'Add a row for each real workload you expect: daily Claude Code sessions, any background agents, batch jobs, and side-project API calls.',
        'Fill in per-turn token estimates. If you have no idea, open a recent Claude Code session and check /cost, or pull real numbers from the API usage dashboard.',
        'Implement the formula for each row: sessions x turns x (fresh x rate + cached x 0.1 x rate + output x output_rate) x 30, using the July 2026 price table from this lesson.',
        'Add a second scenario column with caching turned OFF (all input billed at the full rate) so you can see, in dollars, what cache discipline is worth for your usage.',
        'Total up your daily spend and compare it against the $6-10/day crossover. Write a one-line verdict (API, Pro, or Max) plus the number that justifies it.',
        'Stress-test the model: double turns/session (agents get chattier over time) and check whether your verdict flips.',
      ],
      checklist: [
        'Cost model has at least 3 real workload rows with per-turn token estimates',
        'Formula reproduces the lesson example (~$182/mo) when fed the example inputs',
        'Cached vs uncached scenario shows the dollar delta caching is worth for your usage',
        'Written plan-vs-API verdict includes the daily number that justifies it',
        'Stress-test row shows whether 2x turns flips your decision',
      ],
    },
    checkQuiz: [
      {
        q: 'One cache write plus how many cache reads makes caching cheaper than just paying full price both times?',
        options: [
          'Five reads, since the write premium takes a while to pay back',
          'Ten reads, matching the 0.1x read multiplier',
          'One read: breakeven arrives at just 2 total requests',
          'Zero, because caching is always cheaper, even for a single request',
        ],
        answer: 2,
        explain: 'Breakeven lands at 2 requests. One write (1.25x) plus one read (0.1x) totals 1.35x, while sending the same text fresh twice costs 2.0x. A single one-shot request is the only case where caching loses money, because you pay the write premium and never collect the read discount.',
      },
      {
        q: 'In the monthly cost formula, which term gets the 0.1x multiplier?',
        options: [
          'Output tokens, because they get generated from cached context',
          'Cached input: the transcript history that hits the prompt cache',
          'Fresh input on every turn after the first',
          'The entire per-turn cost once a session passes 10 turns',
        ],
        answer: 1,
        explain: 'Only cache-read input bills at 0.1x the input rate. Fresh input and output always bill at full price. That last part matters: an output-heavy agent stays expensive even with perfect caching, because the discount never touches the expensive bucket.',
      },
      {
        q: 'Your API-equivalent usage settles at a steady $9/day of interactive Claude Code work. What does the crossover math say?',
        options: [
          'Stay on the API, since plans only win above $50/day',
          'You are in the $6-10/day crossover zone: a Max plan likely wins, because $9/day works out to about $270/month on metered billing',
          'Switch to the Batch API instead, because 50% off beats any plan',
          'Drop everything to Haiku before even considering a plan',
        ],
        answer: 1,
        explain: '$9 a day is roughly $270 a month metered, which costs more than a Max plan ($100-200). Batch pricing only helps work that can wait hours for results, so it does nothing for interactive sessions. And routing everything to Haiku trades away quality to solve a problem the plan already solves.',
      },
      {
        q: 'How wide is the price gap between Haiku 4.5 and Fable 5 in July 2026?',
        options: [
          'About 2x on both input and output',
          '10x on input ($1 vs $10 per million tokens) and 10x on output ($5 vs $50)',
          '50x on input, 5x on output',
          'About 100x end to end',
        ],
        answer: 1,
        explain: 'Haiku 4.5 runs $1 in and $5 out per million tokens, while Fable 5 runs $10 and $50. That makes a clean 10x gap on each side, which is why routing grunt work to a cheaper model is the first lever to pull, ahead of caching and batch.',
      },
    ],
    resources: [
      { label: 'Anthropic pricing (verify current numbers)', url: 'https://www.anthropic.com/pricing', kind: 'docs' },
      { label: 'Prompt caching: Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', kind: 'docs' },
      { label: 'Batch processing: Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', kind: 'docs' },
      { label: 'Token counting: Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/token-counting', kind: 'docs' },
      { label: 'Ponytail: anti-over-engineering skill (~20% cheaper runs)', url: 'https://github.com/DietrichGebert/ponytail', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m7-l2: The AI-Native SDLC
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l2',
    title: 'The AI-Native SDLC',
    day: 22,
    minutes: 50,
    xp: 100,
    objectives: [
      'Can describe the shift from AI autocompleting your code to you orchestrating agents that write it, with the 2026 survey numbers to back it up',
      'Can walk the spec-driven workflow end to end: a written spec expands into a plan, the plan breaks into small tasks, and agents turn tasks into verified code',
      'Can explain why reviewing code became the bottleneck once generating it got cheap, and what vibe engineering says to do about it',
      'Can write a personal doctrine covering when you spec, when you delegate, how you verify, and what you review by hand',
    ],
    skipQuiz: [
      {
        q: 'Per the Anthropic 2026 Agentic Coding Trends Report, how much of their work do developers FULLY delegate to agents, meaning no human supervision at all?',
        options: [
          'Around 60-80%, with supervision mostly gone',
          'Only 0-20%; developers supervise 80-100% of agent work',
          'Roughly 50%, split evenly with supervised work',
          'Effectively 100% for senior engineers',
        ],
        answer: 1,
        explain: 'Full hands-off delegation is still rare: developers report fully delegating only 0-20% of their work and supervising the rest. That number is exactly why orchestration and review skills matter more than raw prompting. The valuable skills are the ones a supervisor uses.',
      },
      {
        q: 'The same report names one capability as THE core skill of the AI-native developer. Which one?',
        options: [
          'Prompt engineering',
          'Fine-tuning open models',
          'Context engineering',
          'Kubernetes-grade agent ops',
        ],
        answer: 2,
        explain: 'Context engineering, meaning the craft of deciding what the agent gets to see, when, and in what form, was named the defining skill. Prompt writing turns out to be one small piece of that larger craft.',
      },
      {
        q: 'In spec-driven development (GitHub Spec Kit, Amazon Kiro), what is the artifact that everything else derives from?',
        options: [
          'A Figma design file the agent screenshots',
          'The test suite, on the theory that specs are just tests',
          'An executable, version-controlled spec that expands into a plan, then into atomic tasks',
          'A recorded pairing session the agent replays',
        ],
        answer: 2,
        explain: 'The spec is a first-class, version-controlled file. It expands into a plan, the plan decomposes into atomic tasks, and tasks become code. The spec is the thing you review and diff, while the code becomes a derived artifact.',
      },
      {
        q: 'Harrison Chase splits AI-era developers into two archetypes. Which pairing is his?',
        options: [
          'Architects vs Implementers',
          'Builders vs Reviewers',
          'Prompters vs Programmers',
          'Pilots vs Passengers',
        ],
        answer: 1,
        explain: 'Builders vs Reviewers. Once generating code got cheap, judging code got expensive, so review became the new bottleneck. Generalists with broad judgment rise in value in that world, because they can evaluate work across the whole stack.',
      },
      {
        q: 'What is the core claim of Simon Willison\'s "vibe engineering"?',
        options: [
          'Classic engineering discipline is obsolete now, so ship whatever the agent writes',
          'AI multiplies the value of testing, planning, docs, CI, and review, because discipline is how you steer agents',
          'Only staff-plus engineers should be allowed to use coding agents',
          'Vibe coding and rigorous engineering are permanently incompatible',
        ],
        answer: 1,
        explain: 'Willison argues that AI multiplies the payoff of classic discipline. Tests, continuous integration, documentation, and review are the steering controls that let you run agents at scale, so each of those old-school practices got more valuable in the agent era.',
      },
    ],
    sections: [
      {
        heading: 'The structural shift',
        blocks: [
          {
            type: 'text',
            md: '**SDLC** stands for software development lifecycle: the whole path a piece of software travels from idea to spec to code to testing to release. This lesson is about how that path changed shape between 2023 and 2026.\n\nIn 2023, the developer typed the code while AI autocompleted lines, like a very good autosuggest. In 2026, the roles have flipped for a growing share of work: agents write the code, while the developer writes the specs, curates the context, and checks the results. The unit of work changed underneath the same job title. You went from writing functions to directing the things that write functions.\n\nThe Anthropic 2026 Agentic Coding Trends Report puts numbers on how far along this shift really is. Developers fully delegate (hand work off with zero supervision) only **0-20%** of their tasks; the other **80-100%** happens with a human watching. And the report names **context engineering**, the craft of deciding what the agent sees and when, as THE core skill. Read those two findings together and the picture looks like a promotion: you\'re becoming the tech lead of a nonhuman team.',
          },
          {
            type: 'table',
            headers: ['Term', 'Spelled out', 'Plain English'],
            rows: [
              ['SDLC', 'Software development lifecycle', 'The full path from idea to spec to code to tests to release'],
              ['Spec', 'Specification', 'A written description of what to build, precise enough to build from'],
              ['CI', 'Continuous integration', 'An automated system that builds your project and runs the tests on every single change'],
              ['PR', 'Pull request', 'A proposed batch of code changes, packaged up and waiting for review'],
            ],
          },
          {
            type: 'diagram',
            caption: 'The role inverted: from typing code with AI assists to running a pipeline of agents through spec, build, and review gates.',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="320" fill="#18181b" rx="8"/><text x="30" y="36" fill="#a1a1aa" font-size="13">2023: AI-ASSISTED</text><rect x="30" y="50" width="280" height="70" fill="#27272a" stroke="#52525b" rx="8"/><text x="170" y="80" fill="#e4e4e7" font-size="14" text-anchor="middle">DEV writes code</text><text x="170" y="102" fill="#a1a1aa" font-size="12" text-anchor="middle">AI autocompletes lines</text><text x="30" y="166" fill="#a1a1aa" font-size="13">2026: AI-NATIVE</text><rect x="30" y="180" width="280" height="50" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="170" y="203" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">DEV orchestrates</text><text x="170" y="221" fill="#a1a1aa" font-size="11" text-anchor="middle">specs - context - verification</text><line x1="170" y1="230" x2="170" y2="255" stroke="#52525b" stroke-width="2"/><rect x="40" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="80" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent 1</text><rect x="130" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="170" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent 2</text><rect x="220" y="255" width="80" height="40" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="260" y="279" fill="#a78bfa" font-size="12" text-anchor="middle">agent N</text><rect x="370" y="50" width="300" height="245" fill="#27272a" stroke="#52525b" rx="8"/><text x="520" y="78" fill="#e4e4e7" font-size="14" text-anchor="middle" font-weight="bold">THE AI-NATIVE PIPELINE</text><rect x="400" y="95" width="240" height="34" fill="#18181b" stroke="#38bdf8" rx="6"/><text x="520" y="117" fill="#38bdf8" font-size="13" text-anchor="middle">SPEC (versioned, executable)</text><line x1="520" y1="129" x2="520" y2="143" stroke="#52525b" stroke-width="2"/><rect x="400" y="143" width="240" height="34" fill="#18181b" stroke="#a78bfa" rx="6"/><text x="520" y="165" fill="#a78bfa" font-size="13" text-anchor="middle">PLAN &#8594; atomic tasks</text><line x1="520" y1="177" x2="520" y2="191" stroke="#52525b" stroke-width="2"/><rect x="400" y="191" width="240" height="34" fill="#18181b" stroke="#fbbf24" rx="6"/><text x="520" y="213" fill="#fbbf24" font-size="13" text-anchor="middle">AGENTS build in parallel</text><line x1="520" y1="225" x2="520" y2="239" stroke="#52525b" stroke-width="2"/><rect x="400" y="239" width="240" height="34" fill="#18181b" stroke="#34d399" rx="6"/><text x="520" y="261" fill="#34d399" font-size="13" text-anchor="middle">REVIEW gate (human + agent + CI)</text><text x="520" y="288" fill="#a1a1aa" font-size="11" text-anchor="middle">review is the bottleneck, so design for it</text></svg>`,
          },
        ],
      },
      {
        heading: 'Spec-driven development',
        blocks: [
          {
            type: 'text',
            md: '**Spec-driven development** is the workflow that fell out of this shift. A spec (short for specification) is a written description of what the software should do, precise enough that someone, or something, could build from it. The old-world version was a ticket in a project tracker that everyone stopped reading after kickoff. The new version is a first-class file: it lives in the repository, it gets version-controlled in [git](https://git-scm.com/) like source code, and everything else derives from it.\n\nThe flow runs in four steps. You write the spec. The spec expands into a plan, meaning the technical approach. The plan breaks down into **atomic tasks**, where atomic means each task is small enough for an agent to finish in one go and small enough for a human to review without dread. Agents then turn those tasks into code.\n\nTooling made this concrete in 2025-2026. [GitHub Spec Kit](https://github.com/github/spec-kit) and [Amazon Kiro](https://kiro.dev) both treat the spec as the thing you write, diff, and review, with code as a derived artifact downstream of it. You already practiced the shape in Module 3 with the interview-to-SPEC.md pattern.',
          },
          {
            type: 'diagram',
            caption: 'The spec-driven flow. Work moves left to right. Fixes flow back through the spec, so the spec always tells the truth about the system.',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="300" fill="#18181b" rx="8"/><text x="350" y="30" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">SPEC-DRIVEN DEVELOPMENT: ONE FLOW</text><rect x="30" y="90" width="140" height="76" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="100" y="118" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. SPEC</text><text x="100" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">what to build</text><text x="100" y="152" fill="#a1a1aa" font-size="10" text-anchor="middle">a file, versioned in git</text><line x1="170" y1="128" x2="192" y2="128" stroke="#52525b" stroke-width="2"/><polygon points="192,122 192,134 202,128" fill="#52525b"/><rect x="200" y="90" width="140" height="76" fill="#27272a" stroke="#a78bfa" rx="8"/><text x="270" y="118" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">2. PLAN</text><text x="270" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">the technical</text><text x="270" y="152" fill="#a1a1aa" font-size="11" text-anchor="middle">approach</text><line x1="340" y1="128" x2="362" y2="128" stroke="#52525b" stroke-width="2"/><polygon points="362,122 362,134 372,128" fill="#52525b"/><rect x="370" y="90" width="140" height="76" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="440" y="118" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">3. TASKS</text><text x="440" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">atomic pieces, each</text><text x="440" y="152" fill="#a1a1aa" font-size="11" text-anchor="middle">one agent-sized bite</text><line x1="510" y1="128" x2="532" y2="128" stroke="#52525b" stroke-width="2"/><polygon points="532,122 532,134 542,128" fill="#52525b"/><rect x="540" y="90" width="130" height="76" fill="#27272a" stroke="#34d399" rx="8"/><text x="605" y="118" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">4. CODE</text><text x="605" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">agents build it</text><rect x="140" y="196" width="420" height="46" fill="#27272a" stroke="#52525b" rx="6"/><text x="350" y="214" fill="#e4e4e7" font-size="12" text-anchor="middle">GATES: tests + CI + agent pre-review + human review</text><text x="350" y="232" fill="#a1a1aa" font-size="11" text-anchor="middle">CI = continuous integration: auto-build and test on every change</text><path d="M605 166 L605 270 L100 270 L100 172" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/><polygon points="94,172 106,172 100,160" fill="#f472b6"/><text x="352" y="263" fill="#f472b6" font-size="12" text-anchor="middle">output wrong? fix the SPEC, then regenerate the code</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why specs beat prompts',
            md: 'A prompt evaporates when the session ends. A spec sticks around: any agent, in any session, on any model tier, can pick it up and produce consistent work from it. And when the output is wrong, you fix the spec and regenerate, which is the same move as fixing source code instead of patching the compiled binary.',
          },
        ],
      },
      {
        heading: 'Review is the new bottleneck',
        blocks: [
          {
            type: 'text',
            md: 'When generating code is nearly free, the scarce thing becomes judgment: is this code correct, safe, and worth merging? Harrison Chase (the LangChain founder) frames the split as **Builders** and **Reviewers**. Builders turn specs into working software fast. Reviewers decide what\'s actually good. The old conveyor belt, where a product manager writes a requirements doc, a designer mocks it up, and engineering implements it, collapses into one person running the whole loop with agents. **Generalists win** in that world, because broad judgment beats narrow production skill once production is cheap.\n\nSo how do you review the flood without drowning? Scale review in layers, the same way the industry scaled everything else. Agent reviewers such as [CodeRabbit](https://www.coderabbit.ai), Copilot\'s review mode, or a /code-review pass inside Claude Code read each **PR** (pull request: a proposed batch of code changes waiting for review) and catch the mechanical problems. **CI** (continuous integration: the automated system that builds the project and runs its tests on every change) gates anything that fails, and CI agents can even auto-fix and open remediation PRs. Humans then spend their scarce attention at the top of the stack: does this change match the spec, and is the design sound?',
          },
          {
            type: 'compare',
            left: {
              title: 'Builder mode',
              items: [
                'Produces: working code from specs, fast',
                'Core skill: breaking work into atomic tasks and feeding agents the right context',
                'Force multiplier: several agents running parallel tasks at once',
                'Failure mode: shipping code nobody on the team understands',
              ],
            },
            right: {
              title: 'Reviewer mode',
              items: [
                'Produces: decisions (merge it, redirect it, or kill it)',
                'Core skill: reading a diff against the intent behind it, quickly',
                'Force multiplier: agent pre-review and CI gates filtering before human eyes',
                'Failure mode: rubber-stamping whatever has green checkmarks',
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
            md: 'Simon Willison coined **vibe engineering** as the disciplined counterpoint to vibe coding. His claim: AI multiplies the value of testing, planning, documentation, and code review, because those practices are how you steer agents. A test suite tells an agent when it\'s actually done. Documentation tells it how the system thinks. CI catches its mistakes at machine speed. Every classic skill you built as an engineer just turned into a steering wheel for a much faster car.\n\nSteve Yegge sketches where the trajectory ends: **agent fleets**, meaning one developer supervising 100 or more agents at once. Nobody can hand-read the output of 100 agents. The fleet only works when the pipeline itself does most of the reviewing: specs define the target, tests and CI verify mechanically, agent reviewers pre-screen, and the human handles the judgment calls at the top.',
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
            md: 'Michael Bloch\'s "No Coding Before 10am" essay is the most concrete daily practice list in circulation. The rules, unpacked:\n\n- Spend mornings **pair-prompting**: writing specs, plans, and context files together with an agent, with zero code written before 10am. The thinking work you do in the morning compounds through every agent-hour that follows it.\n- Treat **agents as the system\'s primary users**. Agents read your code, docs, and folder structure far more often than humans do now, so legibility to models becomes a design requirement.\n- Treat **code as context rather than a precious library**. Regenerating code is cheap now, so optimize for readability over cleverness and reuse.\n- Measure progress by **outcomes shipped**. Lines of code stopped being a meaningful number the moment an agent could produce ten thousand of them before lunch.\n- **Delete dead code immediately.** Agents read whatever sits in the repo and believe it, so stale code actively misleads them.\n- **Automate anything you repeat twice**, and expect the tooling underneath you to shift roughly every 3 months.',
          },
          {
            type: 'table',
            headers: ['New failure term', 'What it names', 'The counter-move'],
            rows: [
              [
                'Comprehension debt',
                'Working code your team shipped but nobody understands well enough to change safely',
                'Supervised delegation, plus a hard rule against merging code nobody has read',
              ],
              [
                'Haunted codebase',
                'A repo developers fear touching because generated layers interact in ways nobody can predict',
                'Delete dead code on sight, keep specs current, keep tasks small and atomic',
              ],
              [
                'Rubber-stamp review',
                'Approving a PR because CI is green, without reading the change against its intent',
                'Let agents pre-review the mechanical layer so humans can afford to read for intent and design',
              ],
            ],
          },
        ],
      },
    ],
    lab: {
      title: 'Write your personal AI-native doctrine',
      intro: 'Every practice in this lesson is someone else\'s doctrine. Yours has to fit your judgment, your risk tolerance, and your actual projects. Write it down and version it like the spec it is.',
      steps: [
        'Create DOCTRINE.md in your dotfiles or main project repo. It lives under version control, because it is a spec for how you work, and specs get versioned.',
        'Section 1, WHEN I SPEC: define the threshold (task size, blast radius, ambiguity) above which you write a spec before any agent touches code.',
        'Section 2, WHEN I DELEGATE: list the task types you hand to agents with supervision, and the narrow set you fully delegate. Calibrate honestly against the 0-20% industry reality.',
        'Section 3, HOW I VERIFY: name the binary pass/fail signal for each project type (test suite, build, screenshot diff) and where it runs: a Stop hook, CI, or a verification subagent.',
        'Section 4, WHEN I REVIEW: define what agents pre-review versus what you read personally, plus your rule against merging code you have never read.',
        'Steal at least two Bloch rules verbatim (dead-code deletion and automate-twice are good defaults) and adapt one you disagree with. Write down why you disagree.',
        'Test it tomorrow morning: run one real task end to end under the doctrine, note where it broke down, and amend the file.',
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
        q: 'In Bloch\'s "No Coding Before 10am" doctrine, what are mornings reserved for?',
        options: [
          'Reviewing overnight agent PRs before they go stale',
          'Pair-prompting: spec, plan, and context work, with zero code written until 10am',
          'Manual coding while your mind is fresh, with agents taking the afternoon',
          'Meetings, so agent time stays uninterrupted later',
        ],
        answer: 1,
        explain: 'Mornings go to pair-prompting, meaning specs, plans, and context work done together with an agent. The thesis behind the rule: thinking work done early compounds through every agent-hour that follows it, while typing code early buys you one morning of code.',
      },
      {
        q: 'Bloch says to treat a specific audience as the "primary users" of your system. Who?',
        options: [
          'End customers, obviously',
          'Future maintainers, per classic Clean Code doctrine',
          'The agents that will read, navigate, and modify the codebase',
          'The security team',
        ],
        answer: 2,
        explain: 'Agents are the primary users now: they read your code, docs, and folder structure far more often than any human does. Once that\'s true, legibility to models becomes a first-order design requirement, right next to correctness.',
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
        explain: 'Comprehension debt is the gap between what your codebase does and what your team understands about it. It accrues silently with every merge nobody read, and the bill comes due at incident time, when someone has to change code nobody comprehends under pressure.',
      },
      {
        q: 'What end state does Yegge\'s agent-fleet trajectory describe, and what makes it viable?',
        options: [
          'Agents replacing developers entirely, with no human in the loop',
          'One developer supervising 100+ agents, made viable by pipeline gates (specs, CI, agent review) doing most of the checking',
          'Every developer capped at one agent to keep review load sane',
          'Fleets of fine-tuned small models replacing frontier models',
        ],
        answer: 1,
        explain: 'The fleet vision is one human directing 100 or more agents. It only works when verification is systematized: specs define the target, CI gates catch mechanical failures, and agent pre-review absorbs the checking volume a single human could never scale to.',
      },
    ],
    resources: [
      { label: 'Vibe engineering: Simon Willison', url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/', kind: 'article' },
      { label: 'GitHub Spec Kit: spec-driven development toolkit', url: 'https://github.com/github/spec-kit', kind: 'repo' },
      { label: 'Amazon Kiro: spec-first agentic IDE', url: 'https://kiro.dev', kind: 'docs' },
      { label: 'Revenge of the Junior Developer: Steve Yegge', url: 'https://sourcegraph.com/blog/revenge-of-the-junior-developer', kind: 'article' },
      { label: 'Anthropic engineering blog (agentic coding posts)', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'CodeRabbit: agentic PR review', url: 'https://www.coderabbit.ai', kind: 'docs' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m7-l3: Capstone Launch
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l3',
    title: 'Capstone Launch',
    day: 22,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can state the five big ideas that run through the whole course and point to the modules that taught each one',
      'Can pick a capstone track based on what you will actually keep doing after the course ends, rather than what sounds impressive',
      'Can run a lightweight personal system for staying current in a field where knowledge goes stale in about six months',
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
        explain: 'That option gets the course argument backwards. In the study the course leans on, harness improvements moved 116 of 126 setups without touching the model at all. Scaffolding, loops, verification, files, and context engineering are the levers you actually control.',
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
        explain: 'When both major labs ship a capability natively, that is the strongest cheap signal it is a durable primitive rather than a demo. Skills, MCP (the Model Context Protocol), and prompt caching all passed this test.',
      },
      {
        q: 'What is the recommended basis for choosing your capstone track?',
        options: [
          'Whichever track produces the best portfolio piece',
          'The hardest one, for maximum learning per hour',
          'What you will actually sustain after the course ends',
          'Whichever most resembles your day job',
        ],
        answer: 2,
        explain: 'A capstone you abandon in week two teaches less than a modest one you run for months. Sustained contact with the tools is where expertise actually forms, so pick for durability over impressiveness.',
      },
      {
        q: 'For staying current, the course ranks one information source clearly above the rest. Which?',
        options: [
          'Influencer threads, because they surface things fastest',
          'Official changelogs and release notes from the labs',
          'Conference talks, for depth',
          'Reddit and Hacker News comment sections',
        ],
        answer: 1,
        explain: 'Official changelogs are dense, accurate, and first. Influencer threads are lossy retellings of those same changelogs, published days later with hype stirred in. Go straight to the source and skip the middleman.',
      },
      {
        q: '"Files are the agent substrate" claims markdown folders beat databases for agent state because...',
        options: [
          'Files are faster to query than any database',
          'Files are legible and editable by both humans and models, with git for versioning and diffing',
          'Databases cannot store markdown reliably',
          'Vector stores hallucinate; files never do',
        ],
        answer: 1,
        explain: 'The substrate argument comes down to legibility: CLAUDE.md, SKILL.md, specs, and memory files can be read, diffed, and fixed by you and by the model alike. A database hides state behind a query layer where neither of you can casually inspect or correct it.',
      },
    ],
    sections: [
      {
        heading: 'The five through-lines',
        blocks: [
          {
            type: 'text',
            md: 'Thirty days of material compresses into five ideas. Every artifact you built along the way, from CLAUDE.md files to skills, hooks, subagents, RAG pipelines, and cost models, was one of these five wearing different clothes:\n\n- **The harness beats the model.** The same model jumped from 31% to 75% on real tasks when the scaffolding around it improved. The loop, tools, and context wrapped around a model move results more than swapping the model does.\n- **Loops beat prompts.** One perfect prompt loses to a cycle: prompt, act, check the result against real criteria, then re-prompt with what you learned.\n- **Verification is the quality lever.** Give the loop a binary pass/fail signal (a test suite, a build, a screenshot check) and output quality improves 2-3x, more than any prompt polish delivers.\n- **Files are the agent substrate.** Plain markdown files hold agent state best, because both you and the model can read them, diff them, and fix them.\n- **Context engineering runs through everything.** Every technique in the course reduces to one question: what is the smallest set of high-signal tokens I can put in front of the model right now?',
          },
          {
            type: 'diagram',
            caption: 'The course in one picture: five through-lines as the stack every module was secretly teaching.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b" rx="8"/><text x="290" y="32" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE STACK YOU BUILT</text><rect x="60" y="320" width="460" height="44" fill="#27272a" stroke="#52525b" rx="8"/><text x="290" y="341" fill="#e4e4e7" font-size="14" text-anchor="middle">MODEL: raw capability</text><text x="290" y="357" fill="#a1a1aa" font-size="11" text-anchor="middle">m0-m1 foundations - m5 local models and fine-tuning</text><rect x="60" y="252" width="460" height="56" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="290" y="275" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. HARNESS &gt; MODEL</text><text x="290" y="295" fill="#a1a1aa" font-size="11" text-anchor="middle">m2-m3 Claude Code mastery - tools, memory, skills, hooks, subagents</text><rect x="60" y="184" width="460" height="56" fill="#27272a" stroke="#a78bfa" rx="8"/><text x="290" y="207" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">2. LOOPS &gt; PROMPTS</text><text x="290" y="227" fill="#a1a1aa" font-size="11" text-anchor="middle">m4 loop engineering - plan, act, check, re-prompt, stop conditions</text><rect x="60" y="116" width="460" height="56" fill="#27272a" stroke="#34d399" rx="8"/><text x="290" y="139" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">3. VERIFICATION = QUALITY LEVER</text><text x="290" y="159" fill="#a1a1aa" font-size="11" text-anchor="middle">tests, builds, screenshots, stop hooks - binary pass/fail gates</text><rect x="60" y="52" width="460" height="52" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="290" y="74" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">SHIPPED WORK</text><text x="290" y="93" fill="#a1a1aa" font-size="11" text-anchor="middle">m6 design + RAG in the loop - m7 costs, SDLC, capstone</text><line x1="290" y1="320" x2="290" y2="308" stroke="#52525b" stroke-width="2"/><line x1="290" y1="252" x2="290" y2="240" stroke="#52525b" stroke-width="2"/><line x1="290" y1="184" x2="290" y2="172" stroke="#52525b" stroke-width="2"/><line x1="290" y1="116" x2="290" y2="104" stroke="#52525b" stroke-width="2"/><rect x="544" y="52" width="126" height="150" fill="#27272a" stroke="#f472b6" rx="8"/><text x="607" y="76" fill="#f472b6" font-size="13" text-anchor="middle" font-weight="bold">4. FILES</text><text x="607" y="96" fill="#a1a1aa" font-size="10" text-anchor="middle">CLAUDE.md</text><text x="607" y="112" fill="#a1a1aa" font-size="10" text-anchor="middle">SKILL.md - spec.md</text><text x="607" y="128" fill="#a1a1aa" font-size="10" text-anchor="middle">memory.md</text><text x="607" y="144" fill="#a1a1aa" font-size="10" text-anchor="middle">DESIGN.md</text><text x="607" y="168" fill="#a1a1aa" font-size="10" text-anchor="middle">state the loop</text><text x="607" y="182" fill="#a1a1aa" font-size="10" text-anchor="middle">can read and edit</text><rect x="544" y="214" width="126" height="150" fill="#27272a" stroke="#e4e4e7" rx="8"/><text x="607" y="238" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">5. CONTEXT</text><text x="607" y="254" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">ENGINEERING</text><text x="607" y="278" fill="#a1a1aa" font-size="10" text-anchor="middle">attention budget</text><text x="607" y="294" fill="#a1a1aa" font-size="10" text-anchor="middle">JIT retrieval</text><text x="607" y="310" fill="#a1a1aa" font-size="10" text-anchor="middle">compaction - notes</text><text x="607" y="326" fill="#a1a1aa" font-size="10" text-anchor="middle">subagent isolation</text><text x="607" y="350" fill="#a1a1aa" font-size="10" text-anchor="middle">spans every layer</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Through-line', 'In plain English', 'Where you built it'],
            rows: [
              [
                'Harness beats model',
                'The scaffolding around a model moves results more than swapping the model',
                'Modules 2-3: Claude Code tools, memory, skills, hooks, subagents',
              ],
              [
                'Loops beat prompts',
                'Prompt, act, check, re-prompt wins over one perfect prompt',
                'Module 4: loop engineering and stop conditions',
              ],
              [
                'Verification is the lever',
                'A binary pass/fail signal inside the loop is worth 2-3x on quality',
                'Module 4 stop hooks, Module 6 evals, every lab checklist in the course',
              ],
              [
                'Files are the substrate',
                'Markdown state that humans and models can both read and fix',
                'CLAUDE.md, SKILL.md, SPEC.md, and memory files across every module',
              ],
              [
                'Context engineering',
                'The smallest set of high-signal tokens in front of the model, always',
                'Named in Module 3, then practiced in everything that followed',
              ],
            ],
          },
        ],
      },
      {
        heading: 'Running the capstone',
        blocks: [
          {
            type: 'text',
            md: 'Three capstone tracks are live on the **Capstone page** of this app. Resist the urge to pick the most impressive-sounding one. Expertise forms through sustained contact with the tools, so the right track is the one you\'ll still be running in October, even if it looks modest next to the others.',
          },
          {
            type: 'table',
            headers: ['Track', 'You build', 'Best if'],
            rows: [
              [
                'Personal AI OS',
                'A file-based life and work system: a vault with a CLAUDE.md hierarchy, skills as standard operating procedures, memory files, and scheduled agents',
                'You want daily compounding value, and your notes and personal ops are the honest bottleneck',
              ],
              [
                'Build Your Own Harness',
                'A minimal agent harness from scratch: the loop, tool execution, context management, verification, and spend tracking',
                'You learn by building internals, and you want harness design to stop being magic',
              ],
              [
                'Ship an App AI-Natively',
                'A real product built end to end under your doctrine: spec-driven, agent-built, agent-reviewed, CI-gated',
                'You need a shipped artifact, and you want the full AI-native SDLC under real load',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The honest picker',
            md: 'Ask one question: **which of these would I keep touching even on a bad week?** That answer beats any portfolio logic. All three tracks exercise the five through-lines; they differ only in what you\'re left holding at the end.',
          },
        ],
      },
      {
        heading: 'Staying current in a six-month-half-life field',
        blocks: [
          {
            type: 'text',
            md: 'Half of the tool-specific detail in this course will be superseded within a year. The five through-lines will outlive the pricing tables and the product names. Nobody stays current in a field like this through willpower alone, so build a small system instead:\n\n- **Read official changelogs instead of influencer threads.** A changelog (the release-notes file where a vendor lists exactly what changed) is dense, accurate, and published first. Threads are lossy retellings of it, days later, with hype stirred in.\n- **Apply the feature-validation heuristic.** When both OpenAI and Anthropic ship a capability natively, treat it as a durable primitive. One lab, one demo, or one viral thread: wait and watch.\n- **Re-evaluate your tools quarterly, on the calendar.** A recurring 30-minute slot beats a vague intention. Faster than quarterly turns into churn that destroys compounding; slower goes stale.\n- **Keep a LESSONS.md on yourself.** Log your own bad calls and corrections, the same trick agents use to stop repeating mistakes. You\'re the system under version control now.',
          },
          {
            type: 'compare',
            left: {
              title: 'High-signal (subscribe)',
              items: [
                'Claude Code and API changelogs plus release notes',
                'The Anthropic engineering blog',
                'Simon Willison\'s newsletter',
                'Key repos: watch the releases feed rather than the star count',
              ],
            },
            right: {
              title: 'Low-signal (skim, never act on alone)',
              items: [
                'Influencer threads recycling changelogs with hype added',
                'Benchmark-war screenshots that never show their methodology',
                '"X is dead" takes about any tool under 6 months old',
                'Demos with no repo, no pricing, and no failure cases shown',
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
            md: 'Where to go from Day 22:\n\n- **Anthropic Skilljar courses**: free, certificated courses; start with the agent-skills and Claude Code tracks\n- **The Anthropic engineering blog**: the primary source for agent-building doctrine, written by the people building the harness\n- **Simon Willison\'s newsletter**: the field\'s best running commentary, delivered weekly\n- **Repos to watch**: claude-code, the Agent Skills standard, and one harness repo whose source you actually read\n\nThe curriculum ends today. The loop keeps going: prompt, act, check, re-prompt, now applied to you.',
          },
        ],
      },
    ],
    lab: {
      title: 'Launch your capstone: today',
      intro: 'Momentum decays fast after a course ends. Beat the decay by starting the capstone within the hour: pick a track, select it in the app, and finish its first requirement before the day is out.',
      steps: [
        'Open the Capstone page in this app and read all three track descriptions and their requirement checklists end to end.',
        'Run the honest picker: for each track, write one line on whether you would still touch it on a bad week. Pick the survivor.',
        'Select your track in the app so progress tracking starts.',
        'Read your chosen track\'s first requirement and complete it TODAY: repo created, vault initialized, or spec drafted, depending on the track.',
        'Create LESSONS.md at the repo root and log entry #1: which track you picked, what you almost picked, and why the honest picker overrode it.',
        'Set a quarterly tool re-evaluation slot on your calendar (30 minutes, recurring), then subscribe to the Claude Code changelog and one newsletter.',
      ],
      checklist: [
        'A capstone track is selected in the app with the one-line rationale written down',
        'First track requirement is verifiably complete today (repo, vault, or spec exists)',
        'LESSONS.md exists with its first real entry',
        'Quarterly re-evaluation slot is on the calendar and the changelog subscription is live',
      ],
    },
    checkQuiz: [
      {
        q: 'What goes in the LESSONS.md the course tells you to keep on yourself?',
        options: [
          'A changelog of every tool release you read about',
          'Your own misjudgments and corrections: a versioned log of how your judgment is changing',
          'Summaries of each course module for later review',
          'Prompts that worked well, saved for reuse',
        ],
        answer: 1,
        explain: 'It works as a lessons-learned file about you: bad calls, wrong predictions, and the corrections you made afterward. Agents use the same pattern to stop repeating mistakes, and here you apply it to your own judgment.',
      },
      {
        q: 'What cadence does the course prescribe for re-evaluating your tool choices?',
        options: [
          'Weekly, because the field moves too fast for anything slower',
          'Whenever a major model releases',
          'Quarterly, as a scheduled calendar slot',
          'Annually, to avoid churn',
        ],
        answer: 2,
        explain: 'Quarterly, sitting on the calendar as a real appointment. Re-evaluating faster than that becomes churn that destroys compounding, and slower goes stale in a field with a six-month half-life. Scheduling it removes the decision from mood.',
      },
      {
        q: 'The "verification is the quality lever" through-line says agent output quality improves most when you...',
        options: [
          'Upgrade to the largest model tier available',
          'Write longer, more detailed prompts',
          'Give the loop a binary pass/fail signal (tests, builds, screenshots) that it must satisfy before claiming done',
          'Lower the temperature to zero',
        ],
        answer: 2,
        explain: 'A real, checkable signal inside the loop, enforced by something like a stop hook, is worth 2-3x on output quality. That beats what a model-tier upgrade or another round of prompt polishing delivers, and it costs far less.',
      },
      {
        q: 'You most want harness internals (context management, tool dispatch, termination) to stop being magic. Which track?',
        options: [
          'Personal AI OS',
          'Build Your Own Harness',
          'Ship an App AI-Natively',
          'Any track, since they all cover harness internals equally',
        ],
        answer: 1,
        explain: 'Build Your Own Harness has you implement the loop, tool execution, context handling, and verification with your own hands. It stands alone as the track where harness internals are the actual deliverable rather than something you use along the way.',
      },
    ],
    resources: [
      { label: 'Anthropic Skilljar: free certificated courses', url: 'https://anthropic.skilljar.com', kind: 'course' },
      { label: 'Anthropic engineering blog', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'Simon Willison’s weblog + newsletter', url: 'https://simonwillison.net', kind: 'article' },
      { label: 'Claude Code repo: watch releases', url: 'https://github.com/anthropics/claude-code', kind: 'repo' },
      { label: 'Agent Skills open standard', url: 'https://agentskills.io', kind: 'docs' },
    ],
  },
]
