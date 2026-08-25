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
    minutes: 60,
    xp: 100,
    objectives: [
      'Can describe the shift from AI autocompleting your code to you orchestrating agents that write it, with the 2026 survey numbers to back it up',
      'Can walk the spec-driven workflow end to end: a written spec expands into a plan, the plan breaks into small tasks, and agents turn tasks into verified code',
      'Can explain why reviewing code became the bottleneck once generating it got cheap, and what vibe engineering says to do about it',
      'Can write a personal doctrine covering when you spec, when you delegate, how you verify, and what you review by hand',
      'Can run the PIV loop (plan, implement, validate) on a real ticket with a versioned AI layer of rules, commands, and skills, and sketch a prompt-to-PR pipeline of specialist agent gates for a team',
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
            md: '**Spec-driven development** is the workflow that fell out of this shift. A spec (short for specification) is a written description of what the software should do, precise enough that someone, or something, could build from it. The old-world version was a ticket in a project tracker that everyone stopped reading after kickoff. The new version is a first-class file: it lives in the repository, it gets version-controlled in [git](https://git-scm.com/) like source code, and everything else derives from it.\n\nThe flow runs in four steps. You write the spec. The spec expands into a plan, meaning the technical approach. The plan breaks down into **atomic tasks**, where atomic means each task is small enough for an agent to finish in one go and small enough for a human to review without dread. Agents then turn those tasks into code.\n\nTooling made this concrete in 2025-2026. [GitHub Spec Kit](https://github.com/github/spec-kit) and [Amazon Kiro](https://kiro.dev) both treat the spec as the thing you write, diff, and review, with code as a derived artifact downstream of it, and [BMAD](https://github.com/bmad-code-org/BMAD-METHOD) runs the same playbook with a whole cast of specialized planning agents. You already practiced the shape in [Claude Code Mastery · The Best-Practices Workflow](lesson:m1-l9) with the interview-to-SPEC.md pattern.',
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
          {
            type: 'callout',
            variant: 'tip',
            title: 'Make the frameworks yours',
            md: 'Heavyweight kits like BMAD and Spec Kit arrive with strong opinions baked in, while lighter setups like Cole Medin\'s PIV commands (next section) bend to whatever stack you already run. A trick worth keeping from the workshop notes: point Claude at those repos and ask it to study them, then fold whatever fits into your own commands and skills.',
          },
        ],
      },
      {
        heading: 'The PIV loop: plan, implement, validate',
        blocks: [
          {
            type: 'text',
            md: 'The spec-driven flow answers *what* to build. **Cole Medin\'s PIV loop** (short for Plan, Implement, Validate) answers how a working developer runs that flow ticket after ticket and gets repeatable quality out of a nondeterministic tool. Medin is an AI educator and consultant who trains enterprise teams on adopting a shared standard for AI coding; he taught this method during an April 2026 workshop whose business-strategy half, by Lior Weinstein, gets its own lesson: [The AI Transformation Playbook · Where AI Belongs in a Business](lesson:m7-l4). His diagnosis of why coding agents disappoint deserves memorizing: when the output is bad, the code usually runs fine. It solves the wrong problem, built on assumptions you never surfaced. So every phase of his method exists to strip assumptions out before code gets written, mostly by making the agent ask *you* the questions.\n\nThe machinery lives in what he calls the **AI layer**: a second layer of the repo alongside the source code, made of global rules (conventions the agent always follows: coding style, testing strategy, logging), plus commands and skills, the reusable workflows you met in [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3). His growth rule: anything you find yourself prompting more than about three times becomes a command. The layer is committed to git, so a command improvement reaches every teammate\'s agent, and changes to commands go through pull-request review exactly like changes to source. That last part is how a team standardizes AI results instead of everyone freelancing their own prompts.',
          },
          {
            type: 'text',
            md: 'The workflow, front to back. Sprint planning starts with a **brain dump** conversation about what to build next (Medin talks his out with speech-to-text), followed by the instruction that does the heavy lifting: *before you write anything, ask me clarifying questions, one at a time*. Thirty minutes or so of answering the agent\'s questions is cheap insurance against a week of misaligned code, because every question answered is an assumption removed. A `/create-prd` command then turns the conversation into a structured **PRD** (product requirements document) with the exact sections his teams always use. He reviews that artifact by hand, because a wrong PRD poisons everything downstream. Then `/create-stories` splits it into tickets, complete with acceptance criteria and dependency links, and files them in Jira through an **MCP** server (Model Context Protocol, the tool-connection standard from [Claude Code Mastery · MCP & Plugins](lesson:m1-l7)). From the brain dump onward he barely types: he runs commands, answers questions, and reviews artifacts. Each ticket then goes through the three-phase loop below.',
          },
          {
            type: 'table',
            headers: ['PIV phase', 'What happens', 'The artifact'],
            rows: [
              [
                'Plan',
                'New session. A /prime command loads the codebase through the lens of one ticket, plus recent git history (his phrase: git is the agent\'s long-term memory). Research fans out to subagents so the main context stays lean. Planning has two layers: project planning (tech stack, architecture patterns, conventions), done once and updated rarely, and task planning (codebase and docs analysis for this ticket), done every time. Then /plan-feature turns the exploration into a structured plan',
                'plan.md, built from what he calls the components of context engineering (RAG, task management, memory, prompt engineering): goals, success criteria, docs to reference, the task list, and the validation strategy',
              ],
              [
                'Implement',
                'Another fresh session, on purpose: the planning conversation built up bias, and implementation deserves fresh eyes. /execute takes the plan path as its argument and works through the task list. His stance is trust but verify: watch that the agent uses the right tools, edits the right files, manages its task list, and shows in its thinking that it understood the plan',
                'Code on a branch, with the agent running its own checks as it goes',
              ],
              [
                'Validate',
                'Validation splits two ways. The AI side (/validate) runs the unit and integration tests plus type checks and lint, and can drive a real browser through the feature. The human side performs the code review and any manual tests, helped by a /code-review pass. Only after all of that does a human read the diff',
                'A verified change ready for human review, a PR, and an updated ticket',
              ],
            ],
          },
          {
            type: 'diagram',
            caption: 'The PIV loop plus its outer loop. Tickets flow through plan, implement, validate; failures flow into system evolution, which upgrades the rules and commands that every future ticket benefits from.',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="330" fill="#18181b" rx="8"/><text x="350" y="30" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE PIV LOOP: EVERY TICKET, SAME SHAPE</text><rect x="35" y="55" width="185" height="80" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="127" y="80" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. PLAN</text><text x="127" y="100" fill="#a1a1aa" font-size="11" text-anchor="middle">/prime + subagent research</text><text x="127" y="117" fill="#a1a1aa" font-size="11" text-anchor="middle">/plan-feature &#8594; plan.md</text><line x1="220" y1="95" x2="248" y2="95" stroke="#52525b" stroke-width="2"/><polygon points="248,89 248,101 258,95" fill="#52525b"/><rect x="258" y="55" width="185" height="80" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="350" y="80" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">2. IMPLEMENT</text><text x="350" y="100" fill="#a1a1aa" font-size="11" text-anchor="middle">fresh session, fresh eyes</text><text x="350" y="117" fill="#a1a1aa" font-size="11" text-anchor="middle">/execute plan.md</text><line x1="443" y1="95" x2="471" y2="95" stroke="#52525b" stroke-width="2"/><polygon points="471,89 471,101 481,95" fill="#52525b"/><rect x="481" y="55" width="185" height="80" fill="#27272a" stroke="#34d399" rx="8"/><text x="573" y="80" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">3. VALIDATE</text><text x="573" y="100" fill="#a1a1aa" font-size="11" text-anchor="middle">/validate: tests, browser</text><text x="573" y="117" fill="#a1a1aa" font-size="11" text-anchor="middle">/code-review, then human</text><path d="M540 135 L540 168 L127 168 L127 148" fill="none" stroke="#52525b" stroke-width="2"/><polygon points="121,148 133,148 127,138" fill="#52525b"/><text x="350" y="160" fill="#a1a1aa" font-size="12" text-anchor="middle">clean pass? pick the next ticket (inner loop)</text><rect x="140" y="195" width="420" height="70" fill="#27272a" stroke="#f472b6" rx="8"/><text x="350" y="220" fill="#f472b6" font-size="14" text-anchor="middle" font-weight="bold">SYSTEM EVOLUTION (outer loop)</text><text x="350" y="240" fill="#a1a1aa" font-size="11" text-anchor="middle">agent slipped? update the rule, command, or skill that allowed it</text><text x="350" y="256" fill="#a1a1aa" font-size="11" text-anchor="middle">the fix is committed to git, so the whole team inherits it</text><path d="M620 135 L620 230 L570 230" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/><polygon points="570,224 570,236 560,230" fill="#f472b6"/><path d="M140 230 L80 230 L80 148" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/><polygon points="74,148 86,148 80,138" fill="#f472b6"/><rect x="35" y="285" width="630" height="34" fill="#27272a" stroke="#52525b" rx="6"/><text x="350" y="307" fill="#e4e4e7" font-size="12" text-anchor="middle">Planning and implementing run in separate sessions on purpose: the plan file carries the context across.</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'System evolution: the outer loop',
            md: 'The step most teams skip is the one Medin calls the most powerful part of the whole system. When a PIV pass ships a mistake, or the same mistakes keep repeating, run a short retro *with the agent* (he ships /execution-report and /system-review commands for exactly this): which rule, command, or skill allowed it? Maybe the style conventions in the global rules were too vague, or the validation command never compares new components against existing ones. Fix the machinery, then move on. His motto for the loop: don\'t just fix the bug, fix the system that allowed the bug. The inner loop chews through tickets; the outer loop upgrades the system that runs the inner loop, and because the AI layer lives in git, every fix compounds across the whole team. His workshop repo, [ai-transformation-workshop](https://github.com/coleam00/ai-transformation-workshop), packages the whole kit: the prime, create-prd, create-stories, plan-feature, execute, and validate commands, a browser-automation skill, and a deliberately unfinished poll app to practice on.',
          },
          {
            type: 'text',
            md: "In August 2026 Medin ran his own outer loop on the method itself and published the result: [coleam00/skills](https://github.com/coleam00/skills), 33 MIT-licensed skills that install into Claude Code in two commands (a plugin marketplace add plus an install, or `npx skills add coleam00/skills` for editable copies). Worth studying even if you never install it, because the revisions show where four more months of daily use sanded the method down.\n\nThree changes stand out. The planning artifacts split cleanly by question: a PRD skill owns the *what and why*, a separate spec skill owns the *how*, and a slice-epic skill cuts the spec into tickets arranged as a dependency graph, so agents can see which tickets block which. Validation moved earlier: each plan now defines its pass/fail checks *before* implementation starts, the write-the-failing-test-first discipline from [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4) applied at the planning layer. And the phase boundaries hardened into fresh conversations on purpose, with his stated prompting rule attached: be specific about the end state, and leave the means to the agent. A spec that nails down *what done looks like* while staying loose about *how* gives the model room to use what it knows; the reverse (fussy about means, vague about ends) produces obedient code aimed at the wrong target.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Minimal on purpose',
            md: "The repo's own positioning is the part to copy: the skills are deliberately minimalistic, meant to be dropped into an existing project, adapted, or strip-mined for ideas rather than adopted as scripture. That is the same verdict this lesson keeps reaching about BMAD-class heavyweight kits, now stated by the method's author about his own kit. Install nothing and take the structure; the structure was always the product.",
          },
        ],
      },
      {
        heading: 'Prompt to PR: a pipeline shaped like a team',
        blocks: [
          {
            type: 'text',
            md: 'Engineer Rudy Garcia takes the same ideas to a heavier, more autonomous scale in his April 2026 talk "Prompt to PR." His starting complaint is the default way everyone codes with AI: ask, check the output, ask again, check again, babysitting every step, then letting a swarm of review bots comment on the PR and feeding the comments back in by hand. His fix starts from a historical observation: humans wrote plenty of terrible code before AI existed, and experienced organizations contained it with process. Medical-device and avionics shops ship reliable software out of unreliable humans because the pipeline enforces quality: specs, architecture review, QA, security gates. So Garcia rebuilt that pipeline out of Claude Code primitives you already know: one **orchestrator** skill plus a bench of specialized subagents, each a markdown file that mirrors a role on a real engineering team. [Claude Code Mastery · Subagents & Context Isolation](lesson:m1-l6) covered the primitive; [Agents, Harnesses & Loops · Multi-Agent Patterns](lesson:m2-l5) covered the pattern.\n\nOne prompt kicks it off. The orchestrator writes zero code itself: its job is routing work through the stages and keeping a small running context. The stages that produce *documents* come first. A product-manager agent writes requirements as user stories with acceptance criteria. An architect agent reads your actual codebase and writes the design doc. A test planner decides which automated tests must exist so the feature can never silently regress (the discipline Garcia says human engineers skip most). A task planner breaks the work into small ordered tasks. Code generation starts only after all four documents exist. An engineer agent then implements task by task, self-validating as it goes, and hands off to the gates: a QA verifier confirms every requirement and every planned test is real, a security reviewer hunts for holes, and a manual-test agent drives an actual browser through the feature the way a user would. Any issue loops the pipeline back to the task planner until the gates pass, and the run ends with a final summary written for the human.',
          },
          {
            type: 'diagram',
            caption: 'Garcia\'s prompt-to-PR pipeline. Document-producing stages run before any code exists; automated gates run after; humans read the summary and own the merge.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b" rx="8"/><text x="350" y="28" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">PROMPT &#8594; PR: SPECIALIST AGENT STAGES</text><rect x="30" y="45" width="150" height="44" fill="#27272a" stroke="#22d3ee" rx="6"/><text x="105" y="63" fill="#22d3ee" font-size="12" text-anchor="middle" font-weight="bold">ONE PROMPT</text><text x="105" y="79" fill="#a1a1aa" font-size="10" text-anchor="middle">a brief, or a sentence</text><line x1="180" y1="67" x2="210" y2="67" stroke="#52525b" stroke-width="2"/><polygon points="210,61 210,73 220,67" fill="#52525b"/><rect x="220" y="45" width="450" height="44" fill="#27272a" stroke="#38bdf8" rx="6"/><text x="445" y="63" fill="#38bdf8" font-size="12" text-anchor="middle" font-weight="bold">ORCHESTRATOR SKILL</text><text x="445" y="79" fill="#a1a1aa" font-size="10" text-anchor="middle">routes every stage, writes zero code, keeps a small context</text><text x="30" y="116" fill="#a78bfa" font-size="12" font-weight="bold">DOCS BEFORE CODE</text><rect x="30" y="126" width="145" height="52" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="102" y="147" fill="#a78bfa" font-size="12" text-anchor="middle" font-weight="bold">PM AGENT</text><text x="102" y="164" fill="#a1a1aa" font-size="10" text-anchor="middle">stories + acceptance</text><line x1="175" y1="152" x2="187" y2="152" stroke="#52525b" stroke-width="2"/><polygon points="187,147 187,157 195,152" fill="#52525b"/><rect x="195" y="126" width="145" height="52" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="267" y="147" fill="#a78bfa" font-size="12" text-anchor="middle" font-weight="bold">ARCHITECT</text><text x="267" y="164" fill="#a1a1aa" font-size="10" text-anchor="middle">design doc from your code</text><line x1="340" y1="152" x2="352" y2="152" stroke="#52525b" stroke-width="2"/><polygon points="352,147 352,157 360,152" fill="#52525b"/><rect x="360" y="126" width="145" height="52" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="432" y="147" fill="#a78bfa" font-size="12" text-anchor="middle" font-weight="bold">TEST PLANNER</text><text x="432" y="164" fill="#a1a1aa" font-size="10" text-anchor="middle">anti-regression plan</text><line x1="505" y1="152" x2="517" y2="152" stroke="#52525b" stroke-width="2"/><polygon points="517,147 517,157 525,152" fill="#52525b"/><rect x="525" y="126" width="145" height="52" fill="#27272a" stroke="#a78bfa" rx="6"/><text x="597" y="147" fill="#a78bfa" font-size="12" text-anchor="middle" font-weight="bold">TASK PLANNER</text><text x="597" y="164" fill="#a1a1aa" font-size="10" text-anchor="middle">small ordered tasks</text><line x1="350" y1="178" x2="350" y2="202" stroke="#52525b" stroke-width="2"/><polygon points="344,202 356,202 350,212" fill="#52525b"/><rect x="30" y="212" width="640" height="46" fill="#27272a" stroke="#fbbf24" rx="6"/><text x="350" y="232" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">ENGINEER AGENT</text><text x="350" y="249" fill="#a1a1aa" font-size="10" text-anchor="middle">implements task by task, writes the tests, self-validates</text><line x1="350" y1="258" x2="350" y2="272" stroke="#52525b" stroke-width="2"/><polygon points="344,272 356,272 350,282" fill="#52525b"/><rect x="30" y="282" width="200" height="46" fill="#27272a" stroke="#34d399" rx="6"/><text x="130" y="302" fill="#34d399" font-size="12" text-anchor="middle" font-weight="bold">QA VERIFIER</text><text x="130" y="319" fill="#a1a1aa" font-size="10" text-anchor="middle">every requirement + test real</text><rect x="250" y="282" width="200" height="46" fill="#27272a" stroke="#34d399" rx="6"/><text x="350" y="302" fill="#34d399" font-size="12" text-anchor="middle" font-weight="bold">SECURITY REVIEW</text><text x="350" y="319" fill="#a1a1aa" font-size="10" text-anchor="middle">holes before they ship</text><rect x="470" y="282" width="200" height="46" fill="#27272a" stroke="#34d399" rx="6"/><text x="570" y="302" fill="#34d399" font-size="12" text-anchor="middle" font-weight="bold">MANUAL TESTER</text><text x="570" y="319" fill="#a1a1aa" font-size="10" text-anchor="middle">drives a real browser</text><path d="M682 305 L682 152 L670 152" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/><polygon points="670,146 670,158 660,152" fill="#f472b6"/><text x="640" y="270" fill="#f472b6" font-size="10" text-anchor="end">issues? loop to tasks</text><line x1="350" y1="328" x2="350" y2="340" stroke="#52525b" stroke-width="2"/><polygon points="344,340 356,340 350,350" fill="#52525b"/><rect x="30" y="350" width="640" height="40" fill="#27272a" stroke="#22d3ee" rx="6"/><text x="350" y="375" fill="#22d3ee" font-size="12" text-anchor="middle" font-weight="bold">FINAL SUMMARY &#8594; HUMAN: read it, review what matters, merge the PR</text></svg>`,
          },
          {
            type: 'text',
            md: 'Numbers make the design click. A full run can burn millions of tokens across subagents and take anywhere from 20 minutes to 2 hours, yet the orchestrator itself finishes holding maybe 10,000 to 20,000 tokens. That means the conversation survives the run: you can question a decision, ask it to respin the architect stage with one change, and iterate without starting over. Every stage writes its artifact into a `docs/` folder that later stages read, which doubles as permanent documentation: years later, each feature folder still explains what was built, why, and which architectural decisions got made. His guardrails are hooks, the deterministic layer from [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5): one of his checks free memory before spawning another subagent, born from the day an agent wrote a test that invoked the test runner recursively and froze his machine.\n\nGarcia\'s sharpest idea is organizational: **your experts become the agents**. Every company has the one person everybody queues up to ask about security, accessibility, or database conventions, and that knowledge usually walks out the door at 5pm. Have that person write the corresponding subagent file, and their judgment becomes a gate every feature passes through whether or not they are in the room. A junior developer running the orchestrator inherits the encoded standards of the whole senior staff. Garcia also quotes Boris Cherny, the creator of Claude Code: give the agent a feedback loop to verify its own work and the quality of the result improves 2-3x, the same claim this course built in [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4). This pipeline is that claim scaled up to a whole team\'s worth of verifiers. He shares his starter repo of orchestrator, subagents, and hooks in the talk (linked from the video description), with a blunt caveat: the generic version produces generic results, and the payoff arrives when you rewrite each agent file around what your team actually cares about.',
          },
          {
            type: 'compare',
            left: {
              title: 'Agents drive',
              items: [
                'Requirements, architecture, and test plans, drafted as documents before any code exists',
                'Implementation plus self-validation, task by task',
                'QA, security, and browser click-through gates, looping until clean',
                'Ticket updates, branch and PR creation, and the write-up of what shipped',
              ],
            },
            right: {
              title: 'Humans hold',
              items: [
                'Approval pauses after requirements and architecture (his rule for work code; personal projects run full-auto)',
                'Reading the final summary and deciding whether to merge',
                'Respinning any single stage when a decision looks wrong',
                'Authorship of the agent files themselves: the experts encode the standards',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The bill, and the fine print',
            md: 'Every subagent starts a fresh conversation, so context shared across stages gets re-sent at full price instead of the 0.1x cached rate; [Token Economics & AI-Native SDLC · Modeling Agent Costs](lesson:m7-l1) explains exactly why that multiplies spend. Garcia has hit two-hour runs, crashed a laptop with five parallel type checks, and moved heavy runs into cloud sandboxes. His verdict stands anyway: against a human going back and forth all day and re-establishing context after every PR round-trip, the pipeline roughly breaks even on tokens and wins decisively on attention. Budget for it on purpose rather than discovering it on an invoice.',
          },
        ],
      },
      {
        heading: 'Two approaches, one spine: which to reach for',
        blocks: [
          {
            type: 'text',
            md: "Line the two methods up side by side and the overlap is the real lesson. Both grow from the same parents you already met: spec-driven development and the verification loop. Strip away the tooling and they run the same four plays. They produce the thinking as documents before a line of code exists (Medin's PRD and stories, Garcia's PM and architect docs). They gate the work behind checks that must pass before a human spends attention (Medin's `/validate` and `/code-review`, Garcia's QA, security, and browser agents). They bottle reusable expertise so it compounds instead of living in one head (Medin commits commands to git, Garcia has each expert write a subagent file). And they keep the human on the merge decision and the judgment calls, never on the typing. Once you agree on that spine, the differences turn into a choice about scale and budget rather than a fight about philosophy.",
          },
          {
            type: 'text',
            md: "What separates them is how much machinery you aim at a single ticket. Medin runs one operator through cheap, deliberately separate sessions, staying close enough to eyeball each phase as it lands. Garcia aims an orchestrated swarm of specialist subagents at that same ticket and steps back further, trading money and hands-on control for a pipeline that reviews its own work. Same destination, a very different vehicle to get there.",
          },
          {
            type: 'diagram',
            caption: "Both methods sit on one axis and rest on the same foundation. Sliding right buys autonomy and parallelism; sliding left buys thrift and a short setup.",
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="300" fill="#18181b" rx="8"/><text x="350" y="30" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">SAME SPINE, DIFFERENT SCALE</text><line x1="70" y1="66" x2="628" y2="66" stroke="#52525b" stroke-width="2"/><polygon points="628,60 628,72 640,66" fill="#52525b"/><text x="70" y="54" fill="#a1a1aa" font-size="11" text-anchor="start">lightweight &#183; cheap &#183; hands-on</text><text x="628" y="54" fill="#a1a1aa" font-size="11" text-anchor="end">heavyweight &#183; autonomous &#183; fleet</text><rect x="60" y="86" width="250" height="92" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="185" y="112" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">PIV LOOP</text><text x="185" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">one operator, ticket by ticket</text><text x="185" y="151" fill="#a1a1aa" font-size="11" text-anchor="middle">you review every phase</text><text x="185" y="169" fill="#34d399" font-size="11" text-anchor="middle">cheap &#183; start this week</text><rect x="390" y="86" width="250" height="92" fill="#27272a" stroke="#f472b6" rx="8"/><text x="515" y="112" fill="#f472b6" font-size="14" text-anchor="middle" font-weight="bold">PROMPT &#8594; PR</text><text x="515" y="134" fill="#a1a1aa" font-size="11" text-anchor="middle">orchestrated agent swarm</text><text x="515" y="151" fill="#a1a1aa" font-size="11" text-anchor="middle">it reviews itself, you approve</text><text x="515" y="169" fill="#fbbf24" font-size="11" text-anchor="middle">costly &#183; encodes a team</text><line x1="185" y1="178" x2="185" y2="206" stroke="#52525b" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="515" y1="178" x2="515" y2="206" stroke="#52525b" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="60" y="206" width="580" height="72" fill="#27272a" stroke="#34d399" rx="8"/><text x="350" y="230" fill="#34d399" font-size="13" text-anchor="middle" font-weight="bold">SHARED SPINE</text><text x="350" y="252" fill="#a1a1aa" font-size="11" text-anchor="middle">specs before code &#183; verification gates before human eyes</text><text x="350" y="269" fill="#a1a1aa" font-size="11" text-anchor="middle">encode expertise into reusable artifacts &#183; human owns the merge</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Dimension', 'PIV loop (Medin)', 'Prompt to PR (Garcia)'],
            rows: [
              ['Shape', 'One operator, one ticket at a time', 'An orchestrator plus a bench of specialist subagents'],
              ['Your role', 'Review each phase: brain dump, PRD, implementation', 'Approve the design, then read the final summary'],
              ['Context and cost', 'Lean sessions, cheap, friendlier to prompt caching', 'Millions of tokens per run; each subagent re-sends context at full price'],
              ['Time per ticket', 'Minutes of your attention, spread across phases', '20 minutes to 2 hours hands-off, with a laptop or cloud sandbox working'],
              ['Setup cost', 'Low: a few commands you grow as patterns repeat', 'High: every agent file wants rewriting around your team'],
              ['Sweet spot', 'A solo builder or fractional CTO working hands-on', 'A team encoding its senior standards for fleet-scale output'],
              ['Biggest risk', 'You stay the bottleneck at every phase', 'Generic agent files produce generic, expensive results'],
            ],
          },
          {
            type: 'compare',
            left: {
              title: 'Reach for the PIV loop when',
              items: [
                "You are the one hands-on keyboard and want to stay close to the code",
                "Budget matters and you want lean, cache-friendly, sequential runs",
                "The work is a steady stream of tickets on a codebase you know well",
                "You want to start this week with three or four commands, not a rebuild",
              ],
            },
            right: {
              title: 'Reach for Prompt to PR when',
              items: [
                "You want to bottle a whole team's standards so juniors inherit them",
                "The bottleneck is human review capacity, not code generation",
                "You can afford real token spend for hands-off, self-reviewing runs",
                "Several features need to move in parallel without you babysitting each",
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'For a fractional CTO, the split is clean',
            md: "On your own hands-on work, the PIV loop wins: it keeps you next to the code, keeps the bill small, and needs almost no setup. When you are standing up a client's team and want their security reviewer's judgment or their database conventions to outlive any single person's 5pm, Garcia's pipeline earns its cost, because it turns that expertise into a gate every feature crosses. The two even nest: run the lightweight PIV loop day to day, and reserve the full prompt-to-PR pipeline for the features where a missed security hole or a silent regression would actually hurt. Before you commit a team to either, price the run against [Token Economics & AI-Native SDLC · Modeling Agent Costs](lesson:m7-l1); the cheap method and the expensive one can differ by two orders of magnitude on the same ticket.",
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
      { label: 'BMAD Method: agent-driven spec-and-build framework', url: 'https://github.com/bmad-code-org/BMAD-METHOD', kind: 'repo' },
      { label: 'Amazon Kiro: spec-first agentic IDE', url: 'https://kiro.dev', kind: 'docs' },
      { label: 'Revenge of the Junior Developer: Steve Yegge', url: 'https://sourcegraph.com/blog/revenge-of-the-junior-developer', kind: 'article' },
      { label: 'Anthropic engineering blog (agentic coding posts)', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'CodeRabbit: agentic PR review', url: 'https://www.coderabbit.ai', kind: 'docs' },
      { label: 'AI Transformation Blueprint workshop (Hour 2: Cole Medin\'s PIV loop, live)', url: 'https://www.youtube.com/watch?v=OcTMwjqje5Q', kind: 'video' },
      { label: 'Cole Medin\'s workshop repo: PIV commands, skills, and demo app', url: 'https://github.com/coleam00/ai-transformation-workshop', kind: 'repo' },
      { label: 'coleam00/skills: the Aug 2026 revision, 33 MIT skills, 2-command install', url: 'https://github.com/coleam00/skills', kind: 'repo' },
      { label: 'Every Claude Code Skill I Use (Medin walks the skills repo)', url: 'https://www.youtube.com/watch?v=MbiMwgbGdxw', kind: 'video' },
      { label: 'Prompt to PR: Rudy Garcia on an AI-orchestrated SDLC', url: 'https://www.youtube.com/watch?v=MzCy_6MjhCs', kind: 'video' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m7-l5 · The PRD Harness Pipeline · Day 22
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm7-l5',
    title: 'The PRD Harness Pipeline',
    day: 22,
    minutes: 55,
    xp: 100,
    objectives: [
      'Trace a full seven-stage PRD pipeline from fuzzy idea to merged, verified code',
      'Explain fan-out for width versus fan-out for accuracy, and where each belongs',
      'Place this pipeline against the PIV loop and Prompt to PR on the lightweight-to-heavyweight axis',
      'Adapt the doctrine: build your own harness and evolve it to close the gaps you actually hit',
    ],
    skipQuiz: [
      {
        q: "Where this seven-stage PRD pipeline sits relative to the PIV loop and Prompt to PR:",
        options: [
          'It replaces both with a single universal method',
          'Between them: one hands-on operator like PIV, but with the fan-out and hard gates of the heavier pipelines',
          'It is lighter than the PIV loop, with no gates at all',
          'It is a cloud-only method with no local execution',
        ],
        answer: 1,
        explain:
          'It keeps a single operator close to the work, the way the PIV loop does, and adds multi-agent fan-out and mandatory gates, the way the heavier pipelines do. Same spine as both, tuned for rigor without a full agent swarm.',
      },
      {
        q: "The exit test for the /research stage:",
        options: [
          'The research doc is over a certain length',
          'You can describe the problem, the solution, and every trade-off without hand-waving',
          'Three agents agreed on the findings',
          'All the tests pass',
        ],
        answer: 1,
        explain:
          'Research is done when you can state the problem, the chosen solution, and each trade-off plainly. Feeding a still-fuzzy research doc straight into the PRD is vibe coding with extra steps.',
      },
      {
        q: "How the /prd create stage produces its draft:",
        options: [
          'One agent writes the whole PRD in a single pass',
          'Three agents each draft the entire PRD from a different lens (product, technical, QA), then a synthesis step merges them by majority',
          'The human writes it and an agent formats it',
          'It copies a template and fills blanks',
        ],
        answer: 1,
        explain:
          'Three lenses draft the whole PRD in parallel, then fan back in. Where all three agree, the point is adopted; where two agree, the majority wins and the dissent gets logged; where all three differ, it goes back to you.',
      },
      {
        q: "What the three /prd evaluate gates check:",
        options: [
          'Spelling, grammar, and formatting',
          'Feasibility (no HIGH risks), constraints (zero ADR/NFR violations), and intent alignment (a score of 8 out of 10 or better)',
          'Token budget, latency, and model choice',
          'Git history, branch names, and commit messages',
        ],
        answer: 1,
        explain:
          'All three gates must pass: nothing rated HIGH risk, no violations of the architecture or non-functional constraints, and an intent-alignment score of at least 8/10. Any failure kicks the PRD back to redraft.',
      },
      {
        q: "Which stage is the Ralph loop:",
        options: [
          '/research',
          '/prd create',
          '/prd execute',
          '/prd retrospective',
        ],
        answer: 2,
        explain:
          'Stage 6, /prd execute, is the Ralph loop: one story at a time, a fresh context per loop, a verification check, and a human reading every diff before merge. The other stages plan, gate, or reflect.',
      },
    ],
    sections: [
      {
        heading: 'A third method on the same axis',
        blocks: [
          {
            type: 'text',
            md: "The last lesson put two full methods on one axis: the lightweight [Token Economics & AI-Native SDLC · The AI-Native SDLC](lesson:m7-l2) PIV loop on the cheap, hands-on end, and Rudy Garcia's Prompt to PR pipeline on the heavyweight, self-reviewing end. Here is a third, from a consultant who trains teams to build their own AI harness (call him Michael). It sits between the two: one operator staying close to the work like PIV, plus the multi-agent fan-out and the hard gates of the heavier pipelines.\n\nIt is worth studying in full, because it shows what a mature personal harness actually looks like after someone has rebuilt it four times. His north star is blunt: generating code is cheap now, and good code is not; the scarce resource is your **attention**. Every one of the seven stages exists to spend as little of your attention as possible while stripping assumptions out before any code gets written.",
          },
        ],
      },
      {
        heading: 'The seven stages',
        blocks: [
          {
            type: 'text',
            md: "Each stage is a slash command he wrote, and the work flows top to bottom: research the problem, shape the intent, draft and gate the PRD, slice it into tiny stories, build them one at a time, and reflect. The output of the last stage feeds the first stage of the next PRD, so the codebase gets more legible with every pass.",
          },
          {
            type: 'diagram',
            caption: 'The seven-stage pipeline. Fan-out happens at create and evaluate; the Ralph loop does the building at execute; the retrospective feeds the next PRD.',
            svg: `<svg viewBox="0 0 700 480" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="480" fill="#18181b" rx="8"/><rect x="90" y="40" width="430" height="48" rx="8" fill="#27272a" stroke="#38bdf8"/><text x="305" y="61" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">1 &#183; /research</text><text x="305" y="79" fill="#a1a1aa" font-size="10" text-anchor="middle">surface every unknown; output is a doc for you to read</text><rect x="90" y="100" width="430" height="48" rx="8" fill="#27272a" stroke="#22d3ee"/><text x="305" y="121" fill="#22d3ee" font-size="13" font-weight="bold" text-anchor="middle">2 &#183; draft intent</text><text x="305" y="139" fill="#a1a1aa" font-size="10" text-anchor="middle">problem &#183; users &#183; success &#183; scope (in and out)</text><rect x="90" y="160" width="430" height="48" rx="8" fill="#27272a" stroke="#a78bfa"/><text x="305" y="181" fill="#a78bfa" font-size="13" font-weight="bold" text-anchor="middle">3 &#183; /prd create</text><text x="305" y="199" fill="#a1a1aa" font-size="10" text-anchor="middle">3 lenses draft in parallel, merge by majority</text><rect x="90" y="220" width="430" height="48" rx="8" fill="#27272a" stroke="#fbbf24"/><text x="305" y="241" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">4 &#183; /prd evaluate</text><text x="305" y="259" fill="#a1a1aa" font-size="10" text-anchor="middle">3 gates, all must pass, or redraft</text><rect x="90" y="280" width="430" height="48" rx="8" fill="#27272a" stroke="#34d399"/><text x="305" y="301" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">5 &#183; /prd breakdown</text><text x="305" y="319" fill="#a1a1aa" font-size="10" text-anchor="middle">slice by layer into 1-point stories</text><rect x="90" y="340" width="430" height="48" rx="8" fill="#27272a" stroke="#f472b6"/><text x="305" y="361" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">6 &#183; /prd execute</text><text x="305" y="379" fill="#a1a1aa" font-size="10" text-anchor="middle">Ralph loop: one story, fresh context, human reads each diff</text><rect x="90" y="400" width="430" height="48" rx="8" fill="#27272a" stroke="#38bdf8"/><text x="305" y="421" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">7 &#183; /prd retrospective</text><text x="305" y="439" fill="#a1a1aa" font-size="10" text-anchor="middle">capture ADRs + metrics, seed the next backlog</text><line x1="305" y1="88" x2="305" y2="98" stroke="#52525b" stroke-width="2"/><line x1="305" y1="148" x2="305" y2="158" stroke="#52525b" stroke-width="2"/><line x1="305" y1="208" x2="305" y2="218" stroke="#52525b" stroke-width="2"/><line x1="305" y1="268" x2="305" y2="278" stroke="#52525b" stroke-width="2"/><line x1="305" y1="328" x2="305" y2="338" stroke="#52525b" stroke-width="2"/><line x1="305" y1="388" x2="305" y2="398" stroke="#52525b" stroke-width="2"/><path d="M90 424 L50 424 L50 64 L90 64" fill="none" stroke="#52525b" stroke-width="1.5" stroke-dasharray="5 4"/><polygon points="84,58 84,70 92,64" fill="#52525b"/><text x="536" y="182" fill="#a78bfa" font-size="10">fan-out /</text><text x="536" y="195" fill="#a78bfa" font-size="10">fan-in</text><text x="536" y="242" fill="#fbbf24" font-size="10">feasibility</text><text x="536" y="255" fill="#fbbf24" font-size="10">constraints</text><text x="536" y="268" fill="#fbbf24" font-size="10">intent 8+/10</text><text x="536" y="362" fill="#f472b6" font-size="10">verify each,</text><text x="536" y="375" fill="#f472b6" font-size="10">then merge</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Stage', 'What it does', 'Output'],
            rows: [
              ['1. /research', 'Explore the problem space: read docs, poke the codebase, talk to stakeholders. Surface every unknown. Takes as long as it takes, and it is the most expensive stage', 'A research doc for you to read (not the PRD)'],
              ['2. Draft intent', 'You turn the research into a tight intent: the problem in a sentence, the users, measurable success, and what is in scope and out', 'A seed brief for the next stage'],
              ['3. /prd create', 'Three agents draft the whole PRD in parallel from a product lens, a technical lens, and a QA lens, then a synthesis step merges them by majority', 'A complete PRD, with any dissent flagged'],
              ['4. /prd evaluate', 'Three gates run on the draft, all must pass: feasibility (no HIGH risks), constraints (zero ADR or NFR violations), intent alignment (8/10 or better)', 'A PASS, or a kickback to redraft'],
              ['5. /prd breakdown', 'Slice the PRD by layer (data, API, UI, tests), order it by dependency, and cut it into 1-point stories, each with its own acceptance criteria', 'A task graph, shipped to a board like Linear'],
              ['6. /prd execute', 'The Ralph loop: one story at a time, a fresh context each loop, a review pass, and a human reading every diff before merge', 'Verified, merged code, story by story'],
              ['7. /prd retrospective', 'Capture what was learned into ADRs and metrics, and seed the next backlog', 'ADRs, cycle-time metrics, a more legible codebase'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The research stage is where the time goes',
            md: "Most of the value is bought up front. His exit test for stage 1: you can describe the problem, the solution, and every trade-off without hand-waving. If you cannot, you are not done researching. The research doc is written for you, the human, to read and turn into intent, not to be shoved straight into the PRD generator. Skip that judgment and you are back to vibe coding, just with more machinery around it.",
          },
        ],
      },
      {
        heading: 'Fan-out for width, fan-out for accuracy',
        blocks: [
          {
            type: 'text',
            md: "Two stages spin up multiple agents, and the reason differs each time. This is the [Agents, Harnesses & Loops · Multi-Agent Patterns](lesson:m2-l5) fan-out you met, applied with intent. He frames it as product design's double diamond: open up wide, then narrow down.\n\nAt **/prd create**, the three agents get *different lenses* (product, technical, QA) because he is optimizing for **width**: he wants the PRD seen from angles a single pass would miss. The synthesis rule is majority: where all three agree, adopt it; where two agree, take the majority and log the dissent; where all three differ, surface it to you to decide. A participant in his workshop noticed this is exactly Behavior-Driven Development's Three Amigos meeting, product plus engineering plus QA hashing out a story together, and he liked the comparison enough to keep it.\n\nAt **/prd evaluate**, the agents get the *same task* run in parallel, because now he is optimizing for **accuracy**, not exploration. Three independent gate-checks, all required to pass, catch the misses a single reviewer would wave through.",
          },
          {
            type: 'compare',
            left: {
              title: 'Fan-out for width (/prd create)',
              items: [
                'Each agent gets a different lens: product, technical, QA',
                'Goal: surface angles one pass would miss',
                'Merged by majority, dissent logged',
                'The double diamond opening up',
              ],
            },
            right: {
              title: 'Fan-out for accuracy (/prd evaluate)',
              items: [
                'Each agent runs the same gate check',
                'Goal: catch misses a lone reviewer waves through',
                'All gates must pass, or the PRD redrafts',
                'The double diamond narrowing down',
              ],
            },
          },
        ],
      },
      {
        heading: 'The Ralph loop does the building',
        blocks: [
          {
            type: 'text',
            md: "Stage 6 is the [Agents, Harnesses & Loops · Loop Engineering](lesson:m2-l3) Ralph loop, and the breakdown stage set it up perfectly. Because each story is a 1-point spec with its own acceptance criteria, the loop can take one story, spin up a **fresh context** with a clean CLAUDE.md, build just that, verify it, and stop. Fresh context per story is the whole trick: no accumulated chatter from the last nineteen stories bleeds into this one.\n\nVerification runs inside the loop (typecheck and tests, the [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4) discipline), then a review sub-step reads the change through a senior-engineer and a security-engineer lens before the card moves. Only then does a human read the diff. And the diffs are small, because the stories are small, which is the entire reason the review stays fast enough to keep up.",
          },
        ],
      },
      {
        heading: 'Build your own, and let it evolve',
        blocks: [
          {
            type: 'text',
            md: "The most important thing he says about the pipeline is not to copy it. This is his **fourth** harness. He did not start with the three-lens fan-out at /prd create; he added it after noticing the single-pass PRDs kept missing things, which is how every part of it got there. A harness is personal, and you tighten it in two ways: with deterministic steps (shell scripts, linters, tests) and with LLM checks that grade themselves, added exactly where your own experience says the gaps are.\n\nIf you want a second worked example of the same evolution to compare against, Cole Medin published his as [coleam00/skills](https://github.com/coleam00/skills) in August 2026: the PIV commands from the last lesson, rebuilt as 33 deliberately minimal skills after months of daily revision. Reading two mature harnesses side by side beats copying either one, because the differences show you which parts were personal taste and which parts (docs before code, gates before human eyes, small verified slices) every survivor converges on.\n\nTwo honest caveats. The retrospective stage feeds ADRs, which is the **episodic memory** from [Agents, Harnesses & Loops · Agent Memory & State](lesson:m2-l7): a wiki of decisions the next PRD reads before it starts, so the codebase compounds in legibility rather than entropy. And the whole pipeline assumes a reasonably clean codebase. Point it at a legacy mess and you mostly get a faster mess, so it fits greenfield and modernization work far better than a tangled brownfield.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The dark factory, and why he does not believe in it',
            md: "His stated dream is the dark factory: a user files a bug and nobody touches it, because it gets triaged, fixed, tested, and shipped automatically. He is quick to say he does not believe in it. What he believes in is the harness as the bridge that gets you closer: fewer moments where you type 'continue' or 'you're absolutely right, keep going', more of your attention spent on the decisions only you can make. Off-the-shelf frameworks like BMAD exist, but he finds them too heavy; the point is to encode your own experience into rules, so a good idea you have once becomes a check that runs on every commit.",
          },
        ],
      },
      {
        heading: 'Where it fits beside the other two',
        blocks: [
          {
            type: 'text',
            md: "Three methods now sit on the same axis, and they share the same spine you named last lesson: think as documents before code, gate the work before it reaches a human, bottle expertise so it compounds, and keep the human on the merge decision. What separates them is how much machinery you aim at one ticket, and how far back you step.",
          },
          {
            type: 'table',
            headers: ['', 'PIV loop', 'PRD pipeline', 'Prompt to PR'],
            rows: [
              ['Operator', 'One, hands-on', 'One, hands-on', 'Orchestrated swarm'],
              ['Multi-agent', 'Subagents for research', 'Fan-out at create and evaluate', 'Full specialist bench'],
              ['Gates', 'validate + code-review', 'Three hard PRD gates, plus a review pass', 'QA + security + browser agents'],
              ['Setup cost', 'Low: a few commands', 'High: seven staged commands', 'High: an agent file per role'],
              ['Token cost', 'Lean', 'Moderate', 'Millions per run'],
              ['Sweet spot', 'A steady stream of tickets', 'One serious feature that deserves real rigor', 'A team encoding its senior standards'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'For a fractional CTO',
            md: "The three nest cleanly. Run the PIV loop day to day, when you are hands-on and the work is routine. Reach for this PRD pipeline when a single feature matters enough to justify a research pass and three gates, but you still want to be the one operator watching it land. Save the full Prompt to PR swarm for when you are encoding a whole team's standards or moving several features in parallel. And before you commit to any of them on real work, price the run against [Token Economics & AI-Native SDLC · Modeling Agent Costs](lesson:m7-l1); the cheap method and the expensive one differ by orders of magnitude on the same ticket.",
          },
        ],
      },
    ],
    lab: {
      title: 'Run a two-stage slice of the pipeline',
      intro:
        'You do not need all seven commands to feel the method. Run the two stages that carry the most weight (research and a fan-out PRD draft) on a real feature you have been putting off, and judge the output.',
      steps: [
        'Pick one real feature you have avoided because the requirements are fuzzy. Fuzzy is the point.',
        'Stage 1: in a fresh session, tell the agent to research it: read the relevant code, list open questions, and surface trade-offs. Insist it ask you clarifying questions one at a time before writing anything.',
        'Apply the exit test: can you now describe the problem, the solution, and every trade-off without hand-waving? If not, keep going.',
        'Write a one-page intent from the research: problem, users, measurable success, and scope in and out.',
        'Stage 3: spin up three subagents to each draft the PRD from a different lens (product, technical, QA), then have a synthesis pass merge them and flag where they disagreed.',
        'Read the merged PRD and the flagged disagreements. Note at least one issue the fan-out caught that a single pass would have missed.',
        'Decide honestly: for this feature, was the research-plus-fan-out overhead worth it, or would the PIV loop have been enough? Write down which and why.',
      ],
      checklist: [
        'A research doc exists and you passed its exit test before drafting anything',
        'A one-page intent (problem, users, success, scope) exists',
        'Three lens-specific PRD drafts were produced and merged, with disagreements surfaced',
        'You named at least one issue the fan-out caught that a single draft would have missed',
        'You made a reasoned call on whether this method or the PIV loop fit this feature',
      ],
    },
    checkQuiz: [
      {
        q: "When is the /research stage actually finished?",
        options: [
          'When the research doc passes a word count',
          'When you can describe the problem, the solution, and every trade-off without hand-waving',
          'As soon as the codebase has been read once',
          'When three agents sign off on it',
        ],
        answer: 1,
        explain:
          'The exit test is about your understanding, not the document length. If you still cannot state the trade-offs plainly, more research is cheaper than the misaligned code that a fuzzy start produces.',
      },
      {
        q: "Why does /prd create use different lenses while /prd evaluate uses the same task three times?",
        options: [
          'To use up more of the token budget deliberately',
          'Create optimizes for width (surface missed angles); evaluate optimizes for accuracy (catch misses a lone reviewer waves through)',
          'There is no reason; it is an arbitrary choice',
          'Different lenses are cheaper than identical tasks',
        ],
        answer: 1,
        explain:
          'Different lenses widen coverage during drafting; identical parallel gate-checks tighten accuracy during evaluation. The double diamond: open up, then narrow down.',
      },
      {
        q: "Why does the execute stage start each story in a fresh context?",
        options: [
          'To reset the token bill to zero each time',
          'So no accumulated chatter from earlier stories bleeds into this one; each story is a clean, single task',
          'Because the model forgets CLAUDE.md otherwise',
          'To force a new model version per story',
        ],
        answer: 1,
        explain:
          'A fresh context per story means the loop works on exactly one task with only its relevant files, no leftover state from the previous nineteen. Small, clean tasks produce small diffs that stay fast to review.',
      },
      {
        q: "What does the retrospective stage produce, and which kind of memory is it?",
        options: [
          'A billing report; working memory',
          'ADRs and metrics that the next PRD reads first; episodic memory',
          'A new model fine-tune; long-term weights',
          'A compressed transcript; short-term memory',
        ],
        answer: 1,
        explain:
          'The retrospective writes architecture decision records and cycle metrics, which the next PRD reads before it starts. That is episodic memory: retrievable past experience that makes each pass more legible than the last.',
      },
    ],
    resources: [
      { label: 'mfpiccolo: How to Build Your Own Agent Harness', url: 'https://iii.dev/blog/how-to-build-your-own-agent-harness', kind: 'article' },
      { label: 'coleam00/skills: a second mature harness to compare against', url: 'https://github.com/coleam00/skills', kind: 'repo' },
      { label: 'Behavior-Driven Development: the Three Amigos', url: 'https://en.wikipedia.org/wiki/Behavior-driven_development', kind: 'article' },
      { label: 'Architecture Decision Records (ADRs)', url: 'https://adr.github.io', kind: 'article' },
      { label: 'Linear: issue tracking the pipeline ships stories to', url: 'https://linear.app', kind: 'docs' },
    ],
  },
]
