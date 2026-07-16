import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // m0-l1: How LLMs Actually Work
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l1',
    title: 'How LLMs Actually Work',
    day: 1,
    minutes: 55,
    xp: 100,
    objectives: [
      'Explain how an LLM builds its answer one token at a time by guessing what comes next',
      'Estimate roughly how many tokens a file will cost before you paste it into a model',
      'Walk through the three training stages (pretraining, supervised fine-tuning, RLHF) and say what each one adds',
      'Spot the situations where hallucination and context rot are likely to bite, and plan around both',
    ],
    skipQuiz: [
      {
        q: 'A pretrained base model (before SFT and RLHF have been applied) is best described as:',
        options: [
          'A database of facts with a natural-language search box on top',
          'An autocomplete engine that samples a plausible next token, over and over',
          'A rule-based reasoner that walks a curated knowledge graph',
          'A search index over the documents it was trained on',
        ],
        answer: 1,
        explain:
          'Base models train on a single job: guess the next token. Everything that looks like knowledge or reasoning grows out of that one job. It also explains why outputs sound plausible whether or not they happen to be true.',
      },
      {
        q: 'Why does model quality degrade as the context window fills (the effect nicknamed "context rot")?',
        options: [
          'Older tokens are silently deleted once the window is half full',
          'Positional encodings overflow past 100k tokens',
          'Attention compares every token against every other token, so each token you add spreads the attention over any single fact a little thinner',
          'The tokenizer switches to a coarser vocabulary for long inputs',
        ],
        answer: 2,
        explain:
          'Every token attends to every other token. Grow the window and the number of pairwise comparisons explodes, so any one fact gets a smaller slice of attention and retrieving it gets noisier.',
      },
      {
        q: 'The deepest reason LLMs hallucinate is:',
        options: [
          "Training rewards a confident, plausible continuation, and 'I don't know' was rarely the best next token in the data",
          'Insufficient training data about the topic',
          'Floating-point rounding errors accumulate over long generations',
          'The context window truncated the relevant facts',
        ],
        answer: 0,
        explain:
          'The pretraining objective pays for plausibility. Post-training shrinks the problem, and some of it always survives, because the model carries no built-in boundary between fact and fiction.',
      },
      {
        q: 'What does RLHF (reinforcement learning from human feedback) add on top of supervised fine-tuning (SFT)?',
        options: [
          'Knowledge of events after the training cutoff',
          'A larger context window',
          'The ability to call external tools',
          'Training against human preference rankings, going beyond pure imitation of example answers',
        ],
        answer: 3,
        explain:
          'SFT teaches by imitation: copy these example answers. RLHF adds a second signal. Humans rank pairs of outputs, a reward model learns those rankings, and the model gets tuned toward them. That step pushes models toward helpful, honest, non-toxic behavior.',
      },
      {
        q: 'You paste 10KB of JSON logs and 10KB of English prose. Token counts?',
        options: [
          'Roughly equal, since tokens track bytes',
          'The JSON usually costs far more, because repeated keys, punctuation, and numbers fragment into many small tokens',
          'The prose costs more, since natural language is less compressible',
          'The JSON costs less, because braces and quotes collapse into single tokens',
        ],
        answer: 1,
        explain:
          'Tokenizers are tuned for natural language, where English averages about 4 characters per token. Structured data re-pays the same keys, quotes, and digits on every record, and each fragment costs its own tokens. Expect 2-3x worse than prose.',
      },
    ],
    sections: [
      {
        heading: 'Tokens, not words',
        blocks: [
          {
            type: 'text',
            md: "Start with the one vocabulary word this whole course is priced in: the **token**. A token is a chunk of text, usually a few characters long. The word 'the' is a single token. A word like 'tokenization' splits into two or three. The chopping is done by a piece of software called a **tokenizer**, which carves all text into chunks drawn from a fixed menu of roughly 100,000 entries. The model reads and writes tokens exclusively.\n\nWhy start here? Because everything you'll touch this month is measured in tokens: API bills, context-window capacity, the math behind agent loops. Building a gut feel for token costs now will pay off every single day.",
          },
          {
            type: 'table',
            headers: ['Input type', 'Efficiency', 'Rule of thumb'],
            rows: [
              ['English prose', 'Best', 'About 4 characters per token. 1,000 words comes to roughly 1,300 tokens'],
              [
                'Source code',
                'Middling',
                'Indentation, symbols, and camelCase names each split into extra tokens. Expect 2-3 characters per token',
              ],
              [
                'JSON / logs',
                'Worst',
                'The same keys and punctuation get re-paid on every record. Often 2-3x the cost of prose',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Architect instinct',
            md: "Before pasting anything into a model, estimate what it costs in tokens. A 500-line log dump can eat more of the model's attention (and your money) than everything else in the session combined.",
          },
        ],
      },
      {
        heading: 'Next-token prediction',
        blocks: [
          {
            type: 'text',
            md: "An LLM (large language model) does exactly one thing: it looks at everything written so far and guesses what comes next. Say the text so far is 'The capital of France is'. The model assigns a probability to every token it knows: maybe 97% for ' Paris', 0.5% for ' Lyon', tiny slivers for everything else. It picks one, adds it to the text, and starts over with the new, slightly longer text. That's the whole trick, repeated once per token.\n\n**Temperature** is the dial on that picking step. At temperature 0, the model always grabs the single most likely token, so you get the same answer every time. Turn it up and the model will sometimes take a less likely token instead. That's why the same prompt can give you two different answers on two runs.\n\nAnd here's the part that trips people up: nothing is being looked up. No database, no facts table, no search. The model generates plausible next words, one at a time. What we call 'reasoning' turns out to emerge from this same guess-next-token loop, run at enormous scale.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l1loop" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The next-token loop: score, pick, append, repeat</text><rect x="20" y="60" width="150" height="115" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="95" y="88" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. TEXT SO FAR</text><text x="95" y="115" fill="#e4e4e7" font-size="12" text-anchor="middle">The capital of</text><text x="95" y="132" fill="#e4e4e7" font-size="12" text-anchor="middle">France is</text><line x1="170" y1="117" x2="188" y2="117" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1loop)"/><rect x="190" y="60" width="160" height="115" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="270" y="88" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">2. SCORE TOKENS</text><text x="270" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">Paris 97%</text><text x="270" y="129" fill="#a1a1aa" font-size="12" text-anchor="middle">Lyon 0.5%</text><text x="270" y="146" fill="#a1a1aa" font-size="12" text-anchor="middle">the 0.1% ...</text><line x1="350" y1="117" x2="368" y2="117" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1loop)"/><rect x="370" y="60" width="150" height="115" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="445" y="88" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">3. PICK ONE</text><text x="445" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">temperature =</text><text x="445" y="129" fill="#a1a1aa" font-size="12" text-anchor="middle">how adventurous</text><text x="445" y="146" fill="#a1a1aa" font-size="12" text-anchor="middle">the pick is</text><line x1="520" y1="117" x2="538" y2="117" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1loop)"/><rect x="540" y="60" width="145" height="115" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="612" y="88" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">4. APPEND</text><text x="612" y="112" fill="#e4e4e7" font-size="12" text-anchor="middle">The capital of</text><text x="612" y="129" fill="#e4e4e7" font-size="12" text-anchor="middle">France is Paris</text><path d="M 612 175 L 612 235 L 95 235 L 95 179" fill="none" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1loop)"/><text x="350" y="262" fill="#e4e4e7" font-size="13" text-anchor="middle">Go again with the new, longer text. One trip around the loop per token of output.</text><text x="350" y="284" fill="#71717a" font-size="12" text-anchor="middle">A 500-token answer means 500 laps. No lookup happens anywhere in the circuit.</text></svg>`,
            caption: 'Every answer you have ever gotten from an LLM came out of this loop, one token per lap.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The mental model that pays rent',
            md: "An LLM is a **plausibility engine**. When a behavior confuses you, ask one question: 'what would a plausible continuation of this text look like?' Hallucination, flattery, the way the model mirrors your formatting: each one stops being mysterious the moment you frame it that way.",
          },
        ],
      },
      {
        heading: 'Attention and the context window',
        blocks: [
          {
            type: 'text',
            md: "Inside the model, the machinery that connects tokens to each other is called **attention**. Attention means every token gets to 'look at' every other token and decide how relevant it is. Take the sentence 'the dog that chased the cat was tired'. To handle 'was' correctly, the model has to connect it back to 'dog', five words earlier, skipping right past 'cat'. Attention makes that connection. It sits at the heart of the **transformer**, the neural-network architecture behind every modern LLM, and 3Blue1Brown made a beautiful [visual explanation](https://www.youtube.com/watch?v=eMlx5fFNoYc) of it.\n\nNow do the arithmetic. If every token checks every other token, then 1,000 tokens means roughly 1,000 x 1,000 = one million pairwise checks. At 10,000 tokens it's 100 million. The work grows with the square of the length, which is all the notation 'n²' means: for n tokens, about n x n checks.\n\nHere's the consequence you'll feel daily. The **context window** (the total amount of text a model can consider at once) behaves like working memory, and stuffing it does to the model what a cluttered desk does to you: everything you need is technically there, but finding the relevant piece gets harder. Claude Fable 5 accepts up to 1 million tokens, and quality drops well before the window is full. That early drop has a name: **context rot**.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Attention work grows with the square of the tokens</text><text x="150" y="81" fill="#e4e4e7" font-size="13" text-anchor="end">1,000 tokens</text><rect x="165" y="64" width="24" height="24" rx="4" fill="#38bdf8"/><text x="200" y="81" fill="#a1a1aa" font-size="13">1,000 x 1,000 = 1 million pairwise checks</text><text x="150" y="141" fill="#e4e4e7" font-size="13" text-anchor="end">10,000 tokens</text><rect x="165" y="124" width="150" height="24" rx="4" fill="#a78bfa"/><text x="326" y="141" fill="#a1a1aa" font-size="13">100 million checks (100x the work for 10x the text)</text><text x="150" y="201" fill="#e4e4e7" font-size="13" text-anchor="end">100,000 tokens</text><rect x="165" y="184" width="430" height="24" rx="4" fill="#f472b6"/><text x="380" y="232" fill="#a1a1aa" font-size="13" text-anchor="middle">10 billion checks (another 100x)</text><text x="350" y="272" fill="#71717a" font-size="12" text-anchor="middle">Bars are compressed to fit: each step down is really 100x the bar above it.</text></svg>`,
            caption: "Ten times the tokens costs a hundred times the attention work. That squared growth is what 'n²' is shorthand for.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Context rot',
            md: "Adding context always costs attention, so add it deliberately. As the window fills, the share of attention on any single fact shrinks, and models are measurably worse at recalling facts buried in the middle of a long context than facts near the start or end. Chroma's [context-rot research](https://research.trychroma.com/context-rot) measured this across models. The lesson [Mental Models · Context Engineering](lesson:m0-l4) is entirely about engineering around it.",
          },
        ],
      },
      {
        heading: 'Why hallucination happens',
        blocks: [
          {
            type: 'text',
            md: "**Hallucination** is the industry's word for a model confidently stating things that are false: an API method that never existed, a citation to a paper nobody wrote, a date pulled from thin air. It happens because of what training rewards. The model gets paid (in training signal) for producing plausible continuations, and its training data holds billions of confident statements next to very few honest 'I don't know's. Confident continuation is what got learned.\n\nPost-training and tools like web search and code execution shrink the problem a lot. Some of it survives in every model, though, so the useful skill is knowing where it shows up and designing around it. The two lists below are worth memorizing.",
          },
          {
            type: 'compare',
            left: {
              title: 'Where LLMs are strong',
              items: [
                'Transforming text they can already see: refactoring, summarizing, translating',
                'Pattern-heavy generation like boilerplate, tests, and migrations',
                'Recalling extremely common knowledge',
                'Claims you can verify, when you give the model a way to check',
              ],
            },
            right: {
              title: 'Where hallucination bites',
              items: [
                'Precise long-tail facts: version numbers, API names, citations, dates',
                'Anything that sounds like it should exist but was never in the training data',
                'Confidence: fluent wording feels accurate even when it is wrong',
                'Arithmetic and counting done without a calculator tool',
              ],
            },
          },
        ],
      },
      {
        heading: 'The training pipeline',
        blocks: [
          {
            type: 'text',
            md: "Three training stages, run in order, turn a pile of random numbers into an assistant. **Pretraining** comes first: the model reads internet-scale text and practices exactly one skill, guessing the next token, for months on enormous compute. What comes out is called a base model: a raw autocomplete with encyclopedic exposure and zero manners. Next comes **SFT** (supervised fine-tuning): humans write examples of good question-and-answer exchanges, and the model imitates them until it acts like an assistant. Last comes **RLHF** (reinforcement learning from human feedback): humans rank pairs of model answers, a small 'reward model' learns those preferences, and the main model gets tuned to score well against it. Hugging Face has a solid [RLHF explainer](https://huggingface.co/blog/rlhf) if you want the machinery.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l1arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Pretrain, then SFT, then RLHF</text><rect x="25" y="60" width="200" height="100" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="125" y="88" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">1. PRETRAINING</text><text x="125" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Next-token prediction</text><text x="125" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">on internet-scale text</text><text x="125" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">months · vast compute</text><line x1="225" y1="110" x2="262" y2="110" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1arr)"/><rect x="265" y="60" width="180" height="100" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="355" y="88" fill="#a78bfa" font-size="15" font-weight="bold" text-anchor="middle">2. SFT</text><text x="355" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Imitate curated</text><text x="355" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">instruction-response</text><text x="355" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">demonstrations</text><line x1="445" y1="110" x2="482" y2="110" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l1arr)"/><rect x="485" y="60" width="190" height="100" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="580" y="88" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">3. RLHF</text><text x="580" y="112" fill="#e4e4e7" font-size="13" text-anchor="middle">Optimize for human</text><text x="580" y="130" fill="#a1a1aa" font-size="13" text-anchor="middle">preference rankings</text><text x="580" y="148" fill="#a1a1aa" font-size="13" text-anchor="middle">via reward model</text><text x="125" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: base model</text><text x="125" y="207" fill="#71717a" font-size="12" text-anchor="middle">(raw autocomplete)</text><text x="355" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: assistant</text><text x="355" y="207" fill="#71717a" font-size="12" text-anchor="middle">(follows instructions)</text><text x="580" y="190" fill="#a1a1aa" font-size="13" text-anchor="middle">out: aligned assistant</text><text x="580" y="207" fill="#71717a" font-size="12" text-anchor="middle">(helpful + honest-ish)</text><rect x="25" y="240" width="650" height="64" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="1.5"/><text x="350" y="266" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">+ Extended thinking (RL on reasoning traces)</text><text x="350" y="288" fill="#a1a1aa" font-size="13" text-anchor="middle">Model spends visible reasoning tokens before answering. Accuracy is bought with tokens and latency</text></svg>`,
            caption: 'Three stages with three different goals, plus reasoning training layered on top.',
          },
          {
            type: 'text',
            md: "A habit worth keeping: when a model behaves oddly, ask which stage the behavior came from. Pretraining answers 'what does language and code look like?' SFT covers 'what does acting like an assistant look like?', and RLHF settles 'which plausible answer do humans prefer?' Sycophancy, for instance, mostly traces back to RLHF, because agreeable answers kept getting ranked higher.",
          },
        ],
      },
      {
        heading: 'Extended thinking',
        blocks: [
          {
            type: 'text',
            md: "Modern models can write out intermediate reasoning before committing to an answer. Anthropic's name for this is **extended thinking**. Under the hood it stays the same next-token loop; the model just gets scratch space to think in, and reinforcement learning taught it to use that space productively. Two practical facts follow. You pay for every thinking token, and thinking adds latency. So treat it as a dial: turn it up for genuinely hard, multi-step problems, and leave it off for mechanical edits where it buys nothing.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'Anchor resource',
            md: "Andrej Karpathy's free 3-hour [Deep Dive into LLMs](https://www.youtube.com/watch?v=7xTGNNLPyMI) covers this whole lesson in glorious visual depth: tokenization, attention, hallucination, RLHF. Watch it at 1.5x speed this week. It replaces entire paid courses.",
          },
        ],
      },
    ],
    lab: {
      title: 'Token intuition',
      intro:
        'Calibrate your gut for what things cost in tokens. Twenty minutes now saves you real money and attention budget all month.',
      steps: [
        'Open the [tiktokenizer playground](https://tiktokenizer.vercel.app) and paste a ~20-line function from a real codebase. Note the total count, then look at *where* the splits fall: camelCase names, indentation, symbols.',
        'Paste an English paragraph with roughly the same character count. Compare tokens per character between the two.',
        'Paste a real JSON API response. Watch the keys and punctuation fragment into little pieces, then compute its characters-per-token ratio.',
        "In Claude Code, run: 'Estimate the token count of @src/types.ts, then of a 3-sentence prose summary of it. Explain the difference.' (Swap in any real file.)",
        "Ask Claude: 'Show me two nearly identical strings that tokenize very differently, and explain why.' Leading spaces and casing are classic culprits.",
        'Write a one-line personal rule of thumb: characters per token for prose, for your main language, and for JSON.',
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
          'The model writing out intermediate reasoning tokens, which you pay for, before committing to an answer',
          'A retrieval pass over the training data',
          'Running the prompt twice and returning the better output',
        ],
        answer: 1,
        explain:
          'Extended thinking runs the same next-token loop with added scratch space, and reinforcement learning taught the model to use that space well. The accuracy gain is real, and you buy it with extra tokens and extra waiting.',
      },
      {
        q: 'Which training stage turns raw autocomplete into an assistant that follows instructions?',
        options: [
          'Pretraining',
          'Tokenization',
          'SFT: supervised fine-tuning on instruction-response pairs',
          'Quantization',
        ],
        answer: 2,
        explain:
          'SFT teaches the chat format and the assistant persona by imitation of curated examples. RLHF then tunes which answers humans actually prefer.',
      },
      {
        q: 'Temperature above zero means:',
        options: [
          'The model samples from the next-token probabilities, so identical prompts can produce different outputs',
          'The model generates faster',
          'More tokens fit into the context window',
          'The model refuses fewer requests',
        ],
        answer: 0,
        explain:
          'Generation works by sampling from a probability distribution over tokens. Temperature scales how much probability the lower-ranked tokens keep, so anything above zero leaves room for variation between runs.',
      },
      {
        q: 'The practical consequence of n² attention for your daily work:',
        options: [
          'Longer sessions are strictly better, since more context means more accuracy',
          'Keep sessions lean: a small, relevant context beats a huge, noisy one',
          'Always max out the 1M window since you paid for it',
          'Attention costs only matter for training, never for daily use',
        ],
        answer: 1,
        explain:
          'Every token in the window competes for a finite pool of attention, so low-signal filler actively degrades retrieval of what matters. Keeping context small and relevant is the core premise of context engineering, which gets its own lesson: [Mental Models · Context Engineering](lesson:m0-l4).',
      },
    ],
    resources: [
      {
        label: 'Karpathy: Deep Dive into LLMs (3 hr, the foundations video)',
        url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
        kind: 'video',
      },
      {
        label: '3Blue1Brown: Attention in transformers, visually explained',
        url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
        kind: 'video',
      },
      {
        label: 'Tiktokenizer playground (see tokenization live)',
        url: 'https://tiktokenizer.vercel.app',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs: Context windows',
        url: 'https://docs.claude.com/en/docs/build-with-claude/context-windows',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs: Extended thinking',
        url: 'https://docs.claude.com/en/docs/build-with-claude/extended-thinking',
        kind: 'docs',
      },
      {
        label: 'Chroma research: Context rot',
        url: 'https://research.trychroma.com/context-rot',
        kind: 'article',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l2: Vibe Coding → Agentic Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l2',
    title: 'Vibe Coding → Agentic Engineering',
    day: 1,
    minutes: 45,
    xp: 100,
    objectives: [
      "Apply Karpathy's one-question diagnostic to classify any AI-assisted session as vibe coding or agentic engineering",
      'Explain the floor-and-ceiling frame and what it means for your edge as an architect',
      'Quote the 2026 delegation and supervision numbers and explain what they imply for how you set up your workflow',
      'Name the three artifacts (spec, verification, ownership) that upgrade a vibe session into an engineering session',
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
          'The tooling is identical on both sides; the discipline differs. Vibe coding means accepting output you never read. Agentic engineering means a spec goes in, verification runs on the way out, and you own whatever ships.',
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
          'Two separate revolutions share the same tools. The floor rising means anyone can now produce working software. The ceiling rising means experts who bring engineering discipline can produce dramatically more than before. This course aims at the ceiling.',
      },
      {
        q: "Per Anthropic's 2026 Agentic Coding Trends report, professional devs FULLY delegate (hand off with no supervision) what share of tasks?",
        options: ['0-20%', '40-60%', '80-100%', 'Effectively all greenfield work'],
        answer: 0,
        explain:
          'Full delegation stays rare, at 0-20% of tasks, while developers supervise 80-100% of agent work. The job changed shape: direction and review became the work.',
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
          'A spec plus verification form the control surface for agent work. A defined "done" and a check for it change outcomes far more than prompt wording or model choice ever will.',
      },
      {
        q: 'Agent-written code you merged broke prod. The agentic-engineering read on responsibility:',
        options: [
          'The model vendor is at fault, since it generated the bug',
          'The harness is at fault, since verification should have caught it',
          'Yours: ownership of shipped output is the defining trait of the discipline',
          'Nobody: this is the accepted cost of speed',
        ],
        answer: 2,
        explain:
          'Ownership is non-negotiable in the agentic frame. The harness and the vendor are tools; the engineer who merged the code owns the result. That responsibility is exactly why verification design deserves real effort.',
      },
    ],
    sections: [
      {
        heading: "Karpathy's frame",
        blocks: [
          {
            type: 'text',
            md: 'Some background first. Andrej Karpathy (former Tesla AI director, OpenAI founding member, and the best explainer in the field) coined the phrase "vibe coding" in early 2025 to describe a way of building software: tell an AI what you want, accept what it produces without really reading it, and see if it works. He meant it half-affectionately. Prototypes genuinely should start that way. At the Sequoia AI Ascent conference in 2026 he drew the line for what comes after: staying in vibe mode while shipping things people depend on is where the trouble starts.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The thesis',
            md: "**Vibe coding raises the floor. Agentic engineering raises the ceiling.** Anyone can now produce working software: that's the floor rising. Experts who pair AI with engineering discipline produce more than ever: that's the ceiling rising. Everyone in between gets squeezed.",
          },
          {
            type: 'text',
            md: 'Picture the whole range of software that can get shipped, from nothing up to expert-grade systems. The floor is what a person with no coding background can produce. Before LLMs, that floor sat at zero. Vibe coding lifted it, and now a marketer can ship a working internal tool. The ceiling is what a disciplined expert can produce, and agentic engineering lifts that too, because one engineer can direct several agents in parallel while holding the quality bar with specs and verification. The uncomfortable spot is the middle: vibe habits (unread output, no spec, no checks) applied to systems with production stakes.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l2arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#e4e4e7"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Two revolutions, one axis</text><line x1="70" y1="50" x2="70" y2="285" stroke="#52525b" stroke-width="2"/><text x="30" y="170" fill="#a1a1aa" font-size="13" transform="rotate(-90 30 170)" text-anchor="middle">capability of what ships</text><line x1="90" y1="250" x2="330" y2="250" stroke="#52525b" stroke-width="1.5" stroke-dasharray="6 4"/><text x="210" y="272" fill="#a1a1aa" font-size="13" text-anchor="middle">old floor: non-devs ship nothing</text><line x1="90" y1="170" x2="330" y2="170" stroke="#38bdf8" stroke-width="2"/><line x1="210" y1="244" x2="210" y2="180" stroke="#38bdf8" stroke-width="3" marker-end="url(#m0l2arr)"/><text x="210" y="150" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">VIBE CODING raises the floor</text><text x="210" y="192" fill="#a1a1aa" font-size="12" text-anchor="middle">anyone can produce software</text><line x1="380" y1="130" x2="640" y2="130" stroke="#52525b" stroke-width="1.5" stroke-dasharray="6 4"/><text x="510" y="152" fill="#a1a1aa" font-size="13" text-anchor="middle">old ceiling: expert throughput</text><line x1="380" y1="62" x2="640" y2="62" stroke="#a78bfa" stroke-width="2"/><line x1="510" y1="124" x2="510" y2="72" stroke="#a78bfa" stroke-width="3" marker-end="url(#m0l2arr)"/><text x="510" y="46" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">AGENTIC ENGINEERING raises the ceiling</text><text x="510" y="88" fill="#a1a1aa" font-size="12" text-anchor="middle">specs + verification + ownership at agent speed</text><text x="510" y="272" fill="#71717a" font-size="12" text-anchor="middle">the squeezed middle: unread output, shipped anyway</text></svg>`,
            caption: 'Same tools at opposite ends of the capability curve. The middle (vibe habits with production stakes) is the danger zone.',
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
                'No spec exists; the prompt was the only statement of requirements',
                'Verification means "it seems to run"',
                'You paste errors back at the model until the noise stops',
                'Ownership is fuzzy ("the AI wrote it")',
              ],
            },
            right: {
              title: 'Agentic engineering',
              items: [
                'A spec with acceptance criteria exists before generation starts',
                'A verification loop runs: tests, build, screenshot, with a binary pass or fail',
                'You read, or systematically review, everything that ships',
                'Corrections go into the spec rather than an argument thread',
                'You own every merged line, whoever typed it',
              ],
            },
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l2up" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The three artifacts that upgrade a vibe session</text><rect x="20" y="70" width="200" height="100" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="120" y="98" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. SPEC</text><text x="120" y="122" fill="#e4e4e7" font-size="12" text-anchor="middle">acceptance criteria written</text><text x="120" y="139" fill="#a1a1aa" font-size="12" text-anchor="middle">BEFORE generation starts</text><line x1="220" y1="120" x2="248" y2="120" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l2up)"/><rect x="250" y="70" width="200" height="100" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="350" y="98" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">2. VERIFICATION</text><text x="350" y="122" fill="#e4e4e7" font-size="12" text-anchor="middle">tests, build, screenshot:</text><text x="350" y="139" fill="#a1a1aa" font-size="12" text-anchor="middle">a binary pass or fail</text><line x1="450" y1="120" x2="478" y2="120" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l2up)"/><rect x="480" y="70" width="200" height="100" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="580" y="98" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">3. OWNERSHIP</text><text x="580" y="122" fill="#e4e4e7" font-size="12" text-anchor="middle">you review what ships,</text><text x="580" y="139" fill="#a1a1aa" font-size="12" text-anchor="middle">you own every merged line</text><path d="M 350 170 L 350 215 L 120 215 L 120 174" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#m0l2up)"/><text x="235" y="240" fill="#a1a1aa" font-size="13" text-anchor="middle">failures flow back into the spec</text><text x="350" y="278" fill="#71717a" font-size="12" text-anchor="middle">Agent generation happens between the boxes. The artifacts are yours to build.</text></svg>`,
            caption: 'Same model, same agent. These three artifacts make the difference.',
          },
          {
            type: 'callout',
            variant: 'insight',
            md: 'Look at what the agentic column actually asks of you: specs, tests, review. Classic engineering discipline, applied as the control surface for agents. Prompt tricks and model worship are conspicuously absent, and so is any requirement to write code by hand. Simon Willison calls the same convergence "vibe engineering", and his [essay on it](https://simonwillison.net/2025/Oct/7/vibe-engineering/) is worth ten minutes.',
          },
        ],
      },
      {
        heading: 'The 2026 reality',
        blocks: [
          {
            type: 'text',
            md: "Anthropic's 2026 Agentic Coding Trends report surveyed how professional developers actually work with agents, and the numbers puncture both the hype and the doom. Developers fully delegate (hand a task off and never check the work) only **0-20%** of their tasks. They supervise **80-100%** of the work agents do. Read those two numbers together: agents took over enormous amounts of typing, and humans kept all of the judgment. The winning setup in the report is one orchestrating session plus specialized agents running in parallel contexts, with a human directing traffic. The report also names context engineering as the defining skill of the era. That skill gets a full lesson of its own: [Mental Models · Context Engineering](lesson:m0-l4).",
          },
          {
            type: 'table',
            headers: ['Claim you will hear', '2026 reality'],
            rows: [
              [
                '"Agents replaced developers"',
                'Full delegation sits at 0-20% of tasks. Direction and review became the job',
              ],
              [
                '"Just prompt better"',
                'Supervision spans 80-100% of agent work; verification design beats prompt wording',
              ],
              [
                '"AI made engineering discipline obsolete"',
                'Specs, tests, CI (continuous integration), and review became MORE valuable. They form the control surface for agents',
              ],
              [
                '"One chat window is enough"',
                'Orchestrator + specialized agents in parallel contexts is the professional pattern',
              ],
            ],
          },
        ],
      },
      {
        heading: 'What this course makes you',
        blocks: [
          {
            type: 'text',
            md: "You're a rusty dev with architect instincts, which happens to be the exact profile the rising ceiling rewards. The next 29 days build up in order: prompting and context craft (this module), Claude Code as a power tool, then harnesses, loops, and verification, the machinery that turns an AI user into an **agentic engineer**. Every lesson from here on assumes you'll own what ships.",
          },
        ],
      },
    ],
    lab: {
      title: 'Audit your last three AI sessions',
      intro:
        'Run the vibe-vs-agentic diagnostic on your own recent history. Brutal honesty here sets the baseline the rest of the course improves on.',
      steps: [
        'Pull up your 3 most recent AI-assisted work sessions (run `claude --resume` to browse past Claude Code sessions, or open your chat/Cursor history).',
        'For each session, answer in writing: did you read every line you accepted? All / most / some / none.',
        'For each: did a spec or acceptance criteria exist *before* generation started? What was it?',
        'For each: what verification actually ran? Tests, build, screenshot, manual click-through, or nothing?',
        'Score each session 0 (pure vibe) to 10 (agentic), and note the single cheapest upgrade: a failing test first, a SPEC.md, or a review pass.',
        'Save the notes as `audit.md`. The Day 2 lessons are the fix for exactly what you found.',
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
        q: 'Supervision reality in 2026, per the Anthropic trends report:',
        options: [
          'Developers supervise 80-100% of agent tasks',
          'Supervision has dropped below 10%',
          'Only security-critical code gets supervised',
          'Supervision is fully automated by reviewer agents',
        ],
        answer: 0,
        explain:
          'Direction plus review became the job. Full, unsupervised delegation stays rare (0-20% of tasks) even with frontier agents doing the typing.',
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
          'Accepting unread output is the defining tell of vibe coding. Each of the other three options carries a spec or a verification anchor.',
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
          "Willison's argument runs: agents make disciplined engineers faster and undisciplined ones more dangerous. The classic practices are the multiplier.",
      },
      {
        q: 'Why does the floor/ceiling frame matter to an architect specifically?',
        options: [
          'It implies architects should stop writing code entirely',
          'Your differentiation shifts to specs, verification design, and system ownership: the ceiling work',
          'Floors and ceilings converge, so nothing changes',
          'It mostly argues for hiring more junior developers',
        ],
        answer: 1,
        explain:
          "Code generation got cheap at the floor. Judgment about what to build and how to verify it, which is the architect's trade, is what the ceiling pays for.",
      },
    ],
    resources: [
      {
        label: 'Karpathy: From Vibe Coding to Agentic Engineering (Sequoia AI Ascent 2026, 30 min)',
        url: 'https://youtu.be/96jN2OCOfLs',
        kind: 'video',
      },
      {
        label: "Karpathy's own written summary of the talk",
        url: 'https://karpathy.bearblog.dev/sequoia-ascent-2026',
        kind: 'article',
      },
      {
        label: 'Simon Willison: Vibe engineering',
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
  // m0-l3: Prompting That Actually Works
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l3',
    title: 'Prompting That Actually Works',
    day: 2,
    minutes: 55,
    xp: 100,
    objectives: [
      'Structure any serious prompt as role plus context plus constraints, with acceptance criteria you can actually check',
      'Build few-shot example sets that teach the model the normal shape of the task, with edge cases kept in proportion',
      'Run the interview pattern end to end: Claude interviews you, writes SPEC.md, and a fresh session executes it',
      'Recognize the moment a task has outgrown prompting and needs a verification loop instead',
    ],
    skipQuiz: [
      {
        q: 'The best few-shot example set (the worked examples you include in a prompt) for an extraction task:',
        options: [
          '10 edge cases that previously broke the model',
          '3-5 diverse, canonical examples spanning the normal variety of inputs',
          'One perfect example, repeated for emphasis',
          'As many examples as fit in the context window',
        ],
        answer: 1,
        explain:
          'The model treats your examples as evidence about what inputs normally look like. Fill the slots with nothing but edge cases and it learns that inputs are usually weird. Show 3-5 diverse, canonical examples and it learns the true shape of the task.',
      },
      {
        q: 'Claude produced a wrong approach mid-session. The response most likely to fix it:',
        options: [
          'Explain what is wrong in a follow-up message and let it retry',
          'Edit the original prompt and regenerate, since the wrong turn otherwise stays in context and keeps pulling attention',
          'Repeat the instruction in capital letters for emphasis',
          'Lower the temperature and resend the same message',
        ],
        answer: 1,
        explain:
          'Arguing keeps the failed attempt in the window, where it attracts attention on every later turn. Editing the prompt and regenerating hands the model a clean starting point instead. Cheapest win in daily practice.',
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
          'The pattern inverts the usual flow. The model pulls the requirements out of your head, freezes them into a file, and a clean session then executes against the file rather than against a long, noisy conversation.',
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
          'The model samples plausible continuations of whatever it sees. A role, focused context, and hard constraints together narrow the space of plausible answers until the one you wanted becomes the likely one.',
      },
      {
        q: 'When does prompting stop being the answer?',
        options: [
          'When the task needs iteration against real verification, which is loop-engineering territory rather than wording',
          'When the prompt exceeds 500 words',
          'When you switch to a different model family',
          'Never: every failure is a prompting failure at heart',
        ],
        answer: 0,
        explain:
          'A prompt is one shot at one output. Tasks that need cycles of try, check, and adjust want a loop wrapped around a verifier. Better wording can sharpen each attempt; the loop is what supplies feedback.',
      },
    ],
    sections: [
      {
        heading: 'Anatomy of a working prompt',
        blocks: [
          {
            type: 'text',
            md: "Anthropic's applied-AI team packed 40 prompting techniques into a 24-minute workshop, and most of them boil down to a few load-bearing moves. The first: serious prompts have **structure**. Give the model a role (who it should be), context (what it needs to know), and constraints (what done looks like). A bare ask like 'review this code' leaves all three blank, and the model fills the blanks with guesses about what a generic person might want. Everything else in prompting is refinement on top of this skeleton.",
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
                'Everything needed to act, and nothing more',
                'The diff, the API contract, the runbook excerpt. Skip the rest of the repo',
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
            md: 'Make constraints verifiable. "Must compile", "must match this schema", "cite the line number": each of these changes the output and gives you something to check afterward. Vague pleas like "be careful" or "be thorough" get you the behavior you would have gotten anyway. Quick test for any constraint you write: could you check whether the model obeyed it? If checking is impossible, rewrite it or cut it.',
          },
        ],
      },
      {
        heading: 'Few-shot done right',
        blocks: [
          {
            type: 'text',
            md: "**Few-shot prompting** means including worked examples in your prompt: a few input-output pairs that show the model exactly what you want. Examples out-teach descriptions, and the power comes with a catch. The model learns the **distribution** your examples imply (what inputs typically look like and how much they vary), which can differ wildly from the rules you meant to convey. A common failure: a team stuffs the example slots with every edge case that ever broke the system, and the model concludes that inputs are usually broken. Normal inputs then get treated as exotic. Show the model the world you actually expect, plus one hard case handled well.",
          },
          {
            type: 'compare',
            left: {
              title: 'Weak example set',
              items: [
                'Every past failure as an example',
                'All examples share one format quirk (the model copies it)',
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
            md: "The highest-payoff technique in this lesson. Here's the problem it solves: you are the bottleneck, because your requirements live in your head, unstated, and phrasing tweaks can't transmit what you never wrote down. So invert the flow. Ask Claude to interview *you*, one question at a time, until the requirements are explicit. Have it freeze the answers into a file called `SPEC.md` (goals, non-goals, constraints, acceptance criteria). Then open a fresh session with clean context and execute the spec. The interview surfaces requirements you didn't know you had; the fresh session executes without wading through the interview's noise.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l3arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The interview pattern</text><rect x="25" y="70" width="185" height="90" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="117" y="98" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. INTERVIEW</text><text x="117" y="120" fill="#e4e4e7" font-size="13" text-anchor="middle">Claude asks, you answer</text><text x="117" y="138" fill="#a1a1aa" font-size="12" text-anchor="middle">goals · constraints · non-goals</text><path d="M 70 70 C 55 40 180 40 165 70" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#m0l3arr)"/><text x="117" y="48" fill="#71717a" font-size="12" text-anchor="middle">repeat until explicit</text><line x1="210" y1="115" x2="255" y2="115" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l3arr)"/><rect x="258" y="70" width="160" height="90" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="338" y="102" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">2. SPEC.md</text><text x="338" y="124" fill="#e4e4e7" font-size="13" text-anchor="middle">goals, non-goals,</text><text x="338" y="142" fill="#a1a1aa" font-size="12" text-anchor="middle">acceptance criteria</text><line x1="418" y1="115" x2="463" y2="115" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l3arr)"/><rect x="466" y="70" width="210" height="90" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="571" y="98" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">3. FRESH SESSION</text><text x="571" y="120" fill="#e4e4e7" font-size="13" text-anchor="middle">/clear, read SPEC.md,</text><text x="571" y="138" fill="#a1a1aa" font-size="12" text-anchor="middle">execute against criteria</text><rect x="120" y="205" width="460" height="60" rx="8" fill="#27272a" stroke="#52525b"/><text x="350" y="230" fill="#e4e4e7" font-size="13" text-anchor="middle">Why fresh? The interview transcript is now NOISE.</text><text x="350" y="250" fill="#a1a1aa" font-size="13" text-anchor="middle">The spec is the distilled signal. Execute from that alone.</text></svg>`,
            caption: 'Extract requirements, freeze them into an artifact, execute from clean context.',
          },
          {
            type: 'code',
            lang: 'text',
            code: `Interview me one question at a time about <task>.
Do not propose solutions yet. When you have enough,
write SPEC.md with: goals, non-goals, constraints,
and verifiable acceptance criteria.

=== then, after /clear, in a fresh session ===

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
            md: "Two smaller habits with outsized returns. First, **decompose before you generate**. Ask for the approach, poke at it, and only then ask for the artifact. Extended thinking helps the model execute whatever framing you hand it; picking the right framing stays your job, and a mis-framed task stays mis-framed no matter how many thinking tokens get spent on it.\n\nSecond, **edit rather than argue**. When Claude goes wrong, the natural instinct is to explain the mistake in a follow-up message. Resist it. Each correction message leaves the failed attempt sitting in the context window, where attention keeps flowing back to it.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">What the model sees: arguing vs editing</text><text x="180" y="56" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="middle">ARGUE (window accumulates)</text><rect x="60" y="70" width="240" height="32" rx="6" fill="#27272a" stroke="#52525b"/><text x="180" y="91" fill="#e4e4e7" font-size="12" text-anchor="middle">prompt v1</text><rect x="60" y="108" width="240" height="32" rx="6" fill="#27272a" stroke="#f472b6"/><text x="180" y="129" fill="#f472b6" font-size="12" text-anchor="middle">wrong answer</text><rect x="60" y="146" width="240" height="32" rx="6" fill="#27272a" stroke="#52525b"/><text x="180" y="167" fill="#e4e4e7" font-size="12" text-anchor="middle">no, not like that</text><rect x="60" y="184" width="240" height="32" rx="6" fill="#27272a" stroke="#f472b6"/><text x="180" y="205" fill="#f472b6" font-size="12" text-anchor="middle">wrong answer, second flavor</text><rect x="60" y="222" width="240" height="32" rx="6" fill="#27272a" stroke="#52525b"/><text x="180" y="243" fill="#e4e4e7" font-size="12" text-anchor="middle">closer, but still wrong</text><text x="180" y="288" fill="#a1a1aa" font-size="12" text-anchor="middle">every failed attempt stays in context,</text><text x="180" y="305" fill="#a1a1aa" font-size="12" text-anchor="middle">pulling attention on every turn</text><line x1="350" y1="55" x2="350" y2="315" stroke="#3f3f46" stroke-width="1"/><text x="520" y="56" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">EDIT (window resets)</text><rect x="400" y="70" width="240" height="50" rx="6" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="520" y="90" fill="#e4e4e7" font-size="12" text-anchor="middle">prompt v2: the original ask</text><text x="520" y="107" fill="#e4e4e7" font-size="12" text-anchor="middle">plus everything you learned</text><rect x="400" y="130" width="240" height="32" rx="6" fill="#27272a" stroke="#34d399"/><text x="520" y="151" fill="#34d399" font-size="12" text-anchor="middle">clean answer</text><text x="520" y="288" fill="#a1a1aa" font-size="12" text-anchor="middle">the failed attempts never entered</text><text x="520" y="305" fill="#a1a1aa" font-size="12" text-anchor="middle">this window at all</text></svg>`,
            caption: "Correction threads keep the failure on the model's desk. Editing throws it away.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The correction spiral',
            md: 'Three rounds of "no, not like that" leaves the window full of wrong answers, and the model keeps attending to all of them. The fix: fold what you learned into the original prompt and regenerate from there. In Claude Code, the equivalent move is `/clear` plus a sharper restatement.',
          },
        ],
      },
      {
        heading: 'Where prompting ends',
        blocks: [
          {
            type: 'text',
            md: 'A prompt gives you one shot at shaping one output. Plenty of tasks need something else entirely: run the tests, read the failure, adjust, run again. When success depends on that kind of iteration against reality, wording changes stop helping. What you need then is **loop engineering**: prompt, act, verify against a real signal, then decide whether to stop or go again. The rest of this course builds toward exactly that, and prompting craft is the foundation it sits on.',
          },
        ],
      },
    ],
    lab: {
      title: 'Run the interview pattern for real',
      intro:
        'Take a genuine task off your backlog and run it through interview, SPEC.md, and fresh execution. Compare against how you would normally one-shot it.',
      steps: [
        'Pick a real task you have been putting off: a feature, a migration script, a gnarly refactor. Something with fuzzy requirements.',
        "In Claude Code, prompt: 'Interview me one question at a time about <your task>. Do not propose solutions yet. When you have enough, write SPEC.md with goals, non-goals, constraints, and verifiable acceptance criteria.'",
        'Answer at least 6 questions honestly. When a question stumps you, notice what happened: that was a requirement living only in your head.',
        'Open the generated `SPEC.md` and edit it directly. Tighten the acceptance criteria until each one is checkable.',
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
          'The spec is the distilled output of the interview. Dragging the whole meandering transcript into execution dilutes attention for zero gain.',
      },
      {
        q: 'Socratic decomposition still matters in the extended-thinking era because:',
        options: [
          'Models still cannot reason at all without it',
          'Decomposing before generating shapes WHAT gets reasoned about, and thinking tokens cannot rescue a mis-framed task',
          'The API requires a decomposition step',
          'It reduces token costs to near zero',
        ],
        answer: 1,
        explain:
          'Extended thinking improves execution of whatever framing it receives. Choosing that framing (decompose, interrogate, then generate) stays your job.',
      },
      {
        q: 'Edge-case-only few-shot lists fail because:',
        options: [
          'Models ignore all examples after the second one',
          'The model infers the input DISTRIBUTION from your examples, so a set of pure edge cases teaches it that inputs are usually weird',
          'Edge cases always exceed token limits',
          'Few-shot prompting only works for math tasks',
        ],
        answer: 1,
        explain:
          'Examples serve as evidence about what inputs look like, beyond just illustrating rules. Show the distribution you actually expect, plus one well-resolved hard case.',
      },
      {
        q: 'Which is a real constraint, in the useful sense?',
        options: [
          '"Be very careful and accurate"',
          '"Output MUST be valid JSON matching this schema; no prose; max 120 words per field"',
          '"Do your best work, this is important"',
          '"You are the greatest programmer alive"',
        ],
        answer: 1,
        explain:
          'A constraint you can verify changes behavior and gives you a check to run afterward. Exhortations like "be careful" are token-shaped noise.',
      },
    ],
    resources: [
      {
        label: 'Anthropic applied-AI prompting workshop (24 min, 40 techniques)',
        url: 'https://www.youtube.com/watch?v=9B39p0W4duw',
        kind: 'video',
      },
      {
        label: 'Anthropic docs: Prompt engineering overview',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs: Multishot (few-shot) prompting',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting',
        kind: 'docs',
      },
      {
        label: 'Anthropic engineering: Claude Code best practices (interview pattern and friends)',
        url: 'https://www.anthropic.com/engineering/claude-code-best-practices',
        kind: 'article',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l4: Context Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l4',
    title: 'Context Engineering',
    day: 2,
    minutes: 55,
    xp: 100,
    objectives: [
      'Explain why context engineering is a superset of prompt engineering and what changes when work spans many turns',
      'Diagnose context rot and manage the attention budget deliberately',
      'Choose correctly among compaction, structured notes, and subagent isolation for work that outlives one context window',
      'Apply the master principle: the smallest set of high-signal tokens, every turn',
    ],
    skipQuiz: [
      {
        q: 'Context engineering vs prompt engineering:',
        options: [
          'They are synonyms; the field just renamed itself',
          'Prompt engineering optimizes the instruction; context engineering curates EVERYTHING in the window (instructions, tools, history, retrieved data) across every turn',
          'Context engineering only applies to RAG pipelines',
          'Prompt engineering is deprecated and no longer matters',
        ],
        answer: 1,
        explain:
          'Prompting asks "how do I phrase this message?" Context engineering asks "what mix of tokens should be in the window at this moment?", and it asks that on every single turn. That makes it a strict superset of prompting.',
      },
      {
        q: "System-prompt 'Goldilocks altitude' means:",
        options: [
          'Put the system prompt at the very top of the window',
          'Keep the system prompt under 100 tokens, always',
          'Write the system prompt in the voice of the model',
          'Sit between brittle hardcoded if-else logic and vague platitudes: calibrated guidance with concrete signals',
        ],
        answer: 3,
        explain:
          'Aim between two failure modes. Too low gives you enumerated rules that shatter on the first input you never anticipated. Too high gives you "be helpful" mush that steers nothing. The right altitude offers heuristics and concrete signals the model can generalize from.',
      },
      {
        q: 'Just-in-time retrieval means:',
        options: [
          'Store lightweight identifiers (paths, queries, links) and load content only when it is actually needed, instead of pre-stuffing the window',
          'Retrieving right before the rate limit resets',
          'Caching all documents at session start for speed',
          'Using embeddings for every lookup',
        ],
        answer: 0,
        explain:
          'Agents that hold references and fetch on demand keep the window lean, the way Claude Code greps first and reads selectively second. Pre-loading everything at session start is how context rot gets going.',
      },
      {
        q: 'A 6-hour agent task with discrete phase milestones must survive many context windows. Best long-horizon tool:',
        options: [
          'Compaction on every turn',
          'One giant context window and hope',
          'Structured notes: a NOTES.md or progress file persisted outside the context',
          'A louder, longer system prompt',
        ],
        answer: 2,
        explain:
          'Work shaped like milestones wants durable state stored outside the context, re-read after each reset. Compaction fits continuous conversations. Subagents fit investigations you can fence off.',
      },
      {
        q: 'The master principle of context engineering:',
        options: [
          'Maximize context usage, since you paid for the whole window',
          'Find the smallest set of high-signal tokens that maximizes the likelihood of your desired outcome',
          'Always include the full codebase for grounding',
          'Repeat critical instructions three times: start, middle, and end',
        ],
        answer: 1,
        explain:
          "That sentence is Anthropic's stated principle almost verbatim. Every token competes for attention, so the job is curation. Accumulation works against you.",
      },
    ],
    sections: [
      {
        heading: 'The superset',
        blocks: [
          {
            type: 'text',
            md: "You already know prompt engineering: optimizing the message you send. **Context engineering** widens the lens to everything occupying the window: the system prompt, tool definitions, conversation history, retrieved files, tool outputs. And it treats those contents as a decision to re-make *every turn*. The shift matters most in agent work, where your prompt makes up a small minority of the tokens. The bulk is history and tool output, and whether that bulk stays high-signal is up to you.",
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
            md: "Recall the arithmetic from [Mental Models · How LLMs Actually Work](lesson:m0-l1): attention compares every token against every other token, so the model's ability to pinpoint any single fact gets diluted as the window fills. Treat the window as an **attention budget**. Every token you add taxes every retrieval that follows. Stale tool outputs, dead-end exploration threads, and yesterday's goals keep drawing attention long after they stop being useful. Long-context benchmarks confirm the damage: quality degrades well before the advertised token limit.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Two hours into a kitchen-sink session: what fills the window</text><rect x="40" y="52" width="90" height="28" rx="4" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="145" y="71" fill="#e4e4e7" font-size="12">system prompt + CLAUDE.md (signal)</text><rect x="40" y="92" width="130" height="28" rx="4" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="185" y="111" fill="#e4e4e7" font-size="12">the live feature task (signal)</text><rect x="40" y="132" width="280" height="28" rx="4" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="335" y="151" fill="#a1a1aa" font-size="12">finished bugfix transcript (stale)</text><rect x="40" y="172" width="220" height="28" rx="4" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="275" y="191" fill="#a1a1aa" font-size="12">dead-end exploration (noise)</text><rect x="40" y="212" width="120" height="28" rx="4" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="175" y="231" fill="#a1a1aa" font-size="12">unrelated cron question (noise)</text><text x="350" y="272" fill="#e4e4e7" font-size="13" text-anchor="middle">The model attends to ALL of it, every turn. The stale majority taxes every retrieval.</text><text x="350" y="296" fill="#71717a" font-size="12" text-anchor="middle">Running /clear hands the live task a window of its own.</text></svg>`,
            caption: 'Bar length = tokens. Most of this window works against the current task.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The kitchen-sink session',
            md: 'The classic failure: one Claude Code session accretes a bugfix, then a refactor, then three questions about unrelated code, then a deploy. By hour two the model is attending to four stale goals at once, and answer quality shows it. Running **`/clear` between unrelated tasks** is the highest-ROI habit in this lesson (ROI: return on investment).',
          },
        ],
      },
      {
        heading: 'System-prompt altitude',
        blocks: [
          {
            type: 'text',
            md: "Your system prompt (the standing instructions the model receives before any conversation starts) has an ideal altitude, in the Goldilocks sense: cruising between too specific and too vague. The table shows both ways to miss.",
          },
          {
            type: 'table',
            headers: ['Altitude', 'Looks like', 'Failure mode'],
            rows: [
              [
                'Too low',
                'Hardcoded if-else: "if the user asks X, say Y" times 200 rules',
                'Brittle. Shatters on the first input you did not anticipate; maintenance nightmare',
              ],
              [
                '**Goldilocks**',
                'Heuristics + concrete signals: "prefer the smallest diff; cite file:line; stop and ask when tests are missing"',
                'None. Specific enough to steer, general enough to transfer',
              ],
              [
                'Too high',
                '"You are a helpful, careful assistant. Do a great job."',
                'Vague. The model falls back on its defaults; no steering happened',
              ],
            ],
          },
          {
            type: 'text',
            md: 'The same logic governs your `CLAUDE.md`, the standing-instructions file Claude Code reads at the start of every session. The notorious anti-pattern is the 26,000-line rulebook that neither human nor model can attend to. Keep yours under about 200 lines of signals rather than scripts.',
          },
        ],
      },
      {
        heading: 'Just-in-time retrieval',
        blocks: [
          {
            type: 'text',
            md: "One more habit, borrowed from how good agents already work. Rather than pre-loading every file that might matter, hold **lightweight identifiers** (file paths, search queries, links) and fetch the content at the moment it becomes relevant. Engineers call this progressive disclosure: each retrieval's result informs what to retrieve next. Claude Code operates exactly this way. It greps for a symbol first, reads the two files that matched, and never 'loads the repo'. The window stays lean because content enters only when it earns its place.",
          },
        ],
      },
      {
        heading: 'The three long-horizon tools',
        blocks: [
          {
            type: 'text',
            md: 'Sooner or later a task outgrows one context window. A 6-hour migration, a multi-day refactor: the window fills before the work ends. Three tools exist for surviving the overflow, and picking among them follows the shape of the task.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l4arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Work outlives the window: pick a survival strategy</text><rect x="240" y="45" width="220" height="46" rx="8" fill="#27272a" stroke="#f472b6" stroke-width="2"/><text x="350" y="65" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="middle">Context window filling up</text><text x="350" y="83" fill="#a1a1aa" font-size="12" text-anchor="middle">task &gt; one window</text><line x1="280" y1="91" x2="130" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><line x1="350" y1="91" x2="350" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><line x1="420" y1="91" x2="570" y2="140" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l4arr)"/><rect x="25" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="130" y="172" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">COMPACTION</text><text x="130" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">Summarize the transcript,</text><text x="130" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">restart with the summary</text><text x="130" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">risk: subtle detail lost</text><text x="130" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">in summarization</text><rect x="245" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="350" y="172" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">STRUCTURED NOTES</text><text x="350" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">NOTES.md / progress file</text><text x="350" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">persisted OUTSIDE context</text><text x="350" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">agent re-reads after</text><text x="350" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">every reset</text><rect x="465" y="145" width="210" height="130" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="570" y="172" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">SUBAGENT ISOLATION</text><text x="570" y="196" fill="#e4e4e7" font-size="12" text-anchor="middle">Deep dive burns a fresh</text><text x="570" y="213" fill="#e4e4e7" font-size="12" text-anchor="middle">context, returns a summary</text><text x="570" y="238" fill="#a1a1aa" font-size="12" text-anchor="middle">main thread stays lean,</text><text x="570" y="256" fill="#a1a1aa" font-size="12" text-anchor="middle">gets the distillate</text><text x="130" y="305" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">use when: continuous flow,</text><text x="130" y="322" fill="#38bdf8" font-size="12" text-anchor="middle">conversation must continue</text><text x="350" y="305" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">use when: discrete milestones,</text><text x="350" y="322" fill="#fbbf24" font-size="12" text-anchor="middle">iterative long project</text><text x="570" y="305" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">use when: parallelizable</text><text x="570" y="322" fill="#a78bfa" font-size="12" text-anchor="middle">investigation / research</text><text x="350" y="360" fill="#71717a" font-size="12" text-anchor="middle">These compose: a subagent can compact; a compacting session can keep notes.</text></svg>`,
            caption: 'The Anthropic selection rule for work that outlives one context window.',
          },
          {
            type: 'table',
            headers: ['Task shape', 'Reach for', 'In Claude Code'],
            rows: [
              [
                'Long conversation that must keep flowing',
                'Compaction',
                '`/compact`, with instructions on what to keep',
              ],
              [
                'Multi-day project with milestones',
                'Structured notes',
                'NOTES.md / task_plan.md the agent maintains and re-reads',
              ],
              [
                'Wide investigation you can fence off',
                'Subagent isolation',
                'Delegate to a subagent; only the summary returns',
              ],
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
            md: '**Find the smallest set of high-signal tokens that maximizes the likelihood of your desired outcome.** Every technique in this lesson (altitude, just-in-time retrieval, compaction, notes, subagents) is that one sentence applied at a different layer.',
          },
        ],
      },
    ],
    lab: {
      title: 'Long-session hygiene drills',
      intro:
        'Practice the three moves (clear, compact-with-instructions, delegate) inside a real Claude Code session until they become reflexes.',
      steps: [
        'Start Claude Code in a real project and give it a meaty task (a refactor or feature). Work it for 15+ minutes; watch the context percentage indicator climb.',
        "Mid-task, ask an unrelated question (e.g. 'explain this cron syntax'). Notice the pollution you just added. Then run `/clear` and restate only the live task. Feel what came back, and what it cost you to restate.",
        'Work until context is heavy again, then run: `/compact keep the architectural decisions and open bugs; drop the file exploration and dead ends`. Compare against a bare `/compact`.',
        "Delegate an investigation: 'Use a subagent to find every place we do date parsing and report the top 3 inconsistencies. Summary only.' Watch your main context stay flat while the work happens.",
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
          'A deep-dive investigation that would flood the main context, so the subagent burns its own window and returns a distilled summary',
          'Any task longer than 10 minutes',
          'When you want the fastest possible single answer',
          'When the conversation must continue with full history intact',
        ],
        answer: 0,
        explain:
          'Fence off the token-hungry exploration and keep the orchestrating thread lean. A conversation that must keep flowing wants compaction instead.',
      },
      {
        q: 'The core risk of compaction:',
        options: [
          'It costs extra output tokens',
          'A subtle-but-critical detail gets lost in summarization, which is why you tell it what to keep and drop',
          'It resets the model weights',
          'It disables tool use for the session',
        ],
        answer: 1,
        explain:
          'Summaries are lossy by design. Steer the loss: keep decisions and open issues, drop the exploration transcripts.',
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
          'Context rot is a gradient rather than a cliff. The window is a budget you spend, and junk tokens are negative-yield spending: they cost money AND degrade retrieval.',
      },
      {
        q: 'You finished a bugfix and are about to start an unrelated feature in the same Claude Code session. Right move:',
        options: [
          'Keep going: the accumulated context can only help',
          '/clear, because a kitchen-sink session leaves the model attending to stale goals',
          'Run /compact with no instructions and continue',
          'Switch to a bigger model to fit both tasks',
        ],
        answer: 1,
        explain:
          'An unrelated task deserves a new session. The bugfix transcript is pure noise for the feature work and will keep pulling attention until you clear it.',
      },
    ],
    resources: [
      {
        label: 'Anthropic engineering: Effective context engineering for AI agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
      {
        label: 'Chroma research: Context rot (the measurements)',
        url: 'https://research.trychroma.com/context-rot',
        kind: 'article',
      },
      {
        label: 'Claude Code docs: Memory (CLAUDE.md hierarchy, auto memory)',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs: Subagents',
        url: 'https://code.claude.com/docs/en/sub-agents',
        kind: 'docs',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l5: Workflows vs Agents
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l5',
    title: 'Workflows vs Agents',
    day: 3,
    minutes: 50,
    xp: 100,
    objectives: [
      'Draw the Anthropic line between workflows (your code steers) and agents (the model steers)',
      'Match real tasks to the five workflow patterns: chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer',
      'Justify when a full agent earns its cost, and when it amounts to expensive overkill',
      'Treat the agent-computer interface (ACI) as a design surface deserving the same care as a human interface',
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
          'The distinction comes down to who holds the control flow: your code (workflow) or the model (agent). Both can use identical models and identical tools.',
      },
      {
        q: 'Generate marketing copy in one pass, translate it in another, with a programmatic gate check between. Which pattern?',
        options: ['Prompt chaining', 'Routing', 'Evaluator-optimizer', 'Orchestrator-workers'],
        answer: 0,
        explain:
          'A fixed sequence of steps, each consuming the previous output, with an optional programmatic gate between them. Textbook prompt chaining.',
      },
      {
        q: 'Customer queries arrive in distinct known categories (refund / tech support / sales), each best served by a specialized prompt. Pattern?',
        options: ['Parallelization (voting)', 'Prompt chaining', 'Routing', 'Evaluator-optimizer'],
        answer: 2,
        explain:
          'Classify first, then dispatch to a specialized handler. Routing keeps each downstream prompt focused, where a single do-everything prompt would bloat and blur.',
      },
      {
        q: 'Literary translation: one LLM produces, a second critiques against criteria, loop until the critique passes. Pattern?',
        options: ['Routing', 'Parallelization (sectioning)', 'Orchestrator-workers', 'Evaluator-optimizer'],
        answer: 3,
        explain:
          'One model generates, a second critiques against clear criteria, and the pair loops until the critique passes. Evaluator-optimizer shines whenever judging quality is easier than producing it.',
      },
      {
        q: 'When should you reach for a full agent instead of a workflow?',
        options: [
          'Whenever latency does not matter',
          'Open-ended problems where you cannot enumerate the steps or subtasks in advance',
          'Always: agents subsume workflows and cost the same',
          'Only for coding tasks',
        ],
        answer: 1,
        explain:
          "Anthropic's guidance says to use the simplest thing that works. Agents trade cost, latency, and predictability for autonomy, so pay that price only when the path genuinely cannot be written down in advance.",
      },
    ],
    sections: [
      {
        heading: 'The taxonomy',
        blocks: [
          {
            type: 'text',
            md: 'In late 2024 Anthropic published an essay called *Building Effective Agents*, and the entire industry standardized on its vocabulary. The core cut: a **workflow** runs LLM calls through code paths *you* wrote in advance, while an **agent** lets the model decide its own next step and its own tool use as it goes. Most products marketed as "agents" in 2026 are workflows under the hood. Take that as a compliment to their builders: predictable beats autonomous whenever predictable is available.',
          },
          {
            type: 'compare',
            left: {
              title: 'Workflow',
              items: [
                'Control flow lives in your code',
                'Predictable, testable, debuggable',
                'Cheap: only the needed calls happen',
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
            md: 'Every pattern in this lesson shares one building block, which the essay names the **augmented LLM**: a model with retrieval bolted on so it can look things up, tools so it can act on the world, and memory so state survives between steps. Workflows and agents alike are augmented LLMs composed into different shapes.',
          },
        ],
      },
      {
        heading: 'The five workflow patterns',
        blocks: [
          {
            type: 'text',
            md: "Five named shapes cover nearly every workflow you'll ever build. The diagram shows the wiring; the table underneath tells you when each shape earns its keep.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 430" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13"><defs><marker id="m0l5arr" markerWidth="9" markerHeight="9" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5 Z" fill="#a1a1aa"/></marker></defs><text x="120" y="52" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. Prompt chaining</text><rect x="22" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="48" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="74" y1="103" x2="92" y2="103" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="94" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="120" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="146" y1="103" x2="164" y2="103" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="166" y="88" width="52" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="192" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><text x="120" y="145" fill="#a1a1aa" font-size="12" text-anchor="middle">fixed sequence, gates between</text><text x="350" y="52" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">2. Routing</text><rect x="262" y="88" width="60" height="30" rx="5" fill="#27272a" stroke="#a78bfa"/><text x="292" y="107" fill="#e4e4e7" text-anchor="middle">router</text><line x1="322" y1="98" x2="368" y2="76" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="322" y1="108" x2="368" y2="130" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="370" y="60" width="60" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="400" y="78" fill="#e4e4e7" text-anchor="middle">LLM A</text><rect x="370" y="118" width="60" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="400" y="136" fill="#e4e4e7" text-anchor="middle">LLM B</text><text x="350" y="170" fill="#a1a1aa" font-size="12" text-anchor="middle">classify, then dispatch to a specialist</text><text x="578" y="52" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="middle">3. Parallelization</text><rect x="480" y="88" width="44" height="28" rx="5" fill="#27272a" stroke="#52525b"/><text x="502" y="106" fill="#e4e4e7" text-anchor="middle">in</text><line x1="524" y1="94" x2="552" y2="72" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="524" y1="102" x2="552" y2="102" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="524" y1="110" x2="552" y2="132" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="554" y="58" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="75" fill="#e4e4e7" text-anchor="middle">LLM</text><rect x="554" y="90" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="107" fill="#e4e4e7" text-anchor="middle">LLM</text><rect x="554" y="122" width="50" height="26" rx="5" fill="#27272a" stroke="#52525b"/><text x="579" y="139" fill="#e4e4e7" text-anchor="middle">LLM</text><line x1="604" y1="102" x2="628" y2="102" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="630" y="88" width="56" height="28" rx="5" fill="#27272a" stroke="#f472b6"/><text x="658" y="106" fill="#e4e4e7" text-anchor="middle">merge</text><text x="578" y="170" fill="#a1a1aa" font-size="12" text-anchor="middle">sectioning or voting</text><text x="175" y="225" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">4. Orchestrator-workers</text><rect x="105" y="245" width="140" height="32" rx="5" fill="#27272a" stroke="#34d399"/><text x="175" y="266" fill="#e4e4e7" text-anchor="middle">orchestrator</text><line x1="140" y1="277" x2="80" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="175" y1="277" x2="175" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><line x1="210" y1="277" x2="270" y2="308" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><rect x="35" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="78" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><rect x="132" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="175" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><rect x="229" y="310" width="86" height="30" rx="5" fill="#27272a" stroke="#52525b"/><text x="272" y="329" fill="#e4e4e7" text-anchor="middle">worker</text><text x="175" y="368" fill="#a1a1aa" font-size="12" text-anchor="middle">orchestrator DECIDES the subtasks at runtime,</text><text x="175" y="385" fill="#a1a1aa" font-size="12" text-anchor="middle">delegates, then synthesizes results</text><text x="525" y="225" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">5. Evaluator-optimizer</text><rect x="390" y="270" width="110" height="36" rx="5" fill="#27272a" stroke="#52525b"/><text x="445" y="293" fill="#e4e4e7" text-anchor="middle">generator</text><rect x="550" y="270" width="110" height="36" rx="5" fill="#27272a" stroke="#fbbf24"/><text x="605" y="293" fill="#e4e4e7" text-anchor="middle">evaluator</text><path d="M 500 279 L 548 279" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="524" y="270" fill="#71717a" font-size="11" text-anchor="middle">solution</text><path d="M 548 297 L 500 297" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="524" y="315" fill="#71717a" font-size="11" text-anchor="middle">feedback</text><line x1="660" y1="288" x2="688" y2="288" stroke="#34d399" stroke-width="2" marker-end="url(#m0l5arr)"/><text x="525" y="368" fill="#a1a1aa" font-size="12" text-anchor="middle">loop until the critique passes;</text><text x="525" y="385" fill="#a1a1aa" font-size="12" text-anchor="middle">works when critique is easier than generation</text></svg>`,
            caption: 'The five Anthropic workflow patterns. Your code owns the arrows; the model fills the boxes.',
          },
          {
            type: 'table',
            headers: ['Pattern', 'Use when', 'Cost profile'],
            rows: [
              [
                'Prompt chaining',
                'Task decomposes into fixed sequential steps, and accuracy matters more than latency',
                'Linear in steps',
              ],
              [
                'Routing',
                'Distinct input categories, each with a better specialized handler',
                'Classifier + one handler',
              ],
              [
                'Parallelization: sectioning',
                'Independent subtasks you can define upfront (e.g. review each file separately)',
                'N parallel calls',
              ],
              [
                'Parallelization: voting',
                'Judgment calls where diverse attempts raise confidence (vulnerability checks)',
                'N calls per decision',
              ],
              [
                'Orchestrator-workers',
                'Subtasks cannot be predicted upfront, so the orchestrator decides them at runtime',
                'Variable; orchestrator + workers',
              ],
              [
                'Evaluator-optimizer',
                'Clear evaluation criteria exist, and critique is easier than generation',
                'Multiplied by loop iterations',
              ],
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
            md: 'Find the **simplest solution possible**, and only increase complexity when it demonstrably improves outcomes. Agents cost more across the board: more tokens, higher latency, and a wider failure surface. If you can write the steps down, you want a workflow. Save agents for tasks where the path truly cannot be known upfront, with nontrivial coding as the canonical example.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><defs><marker id="m0l5dec" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Which shape does the task want?</text><rect x="40" y="50" width="280" height="52" rx="8" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="180" y="72" fill="#e4e4e7" font-size="13" text-anchor="middle">Is one well-prompted LLM call</text><text x="180" y="90" fill="#e4e4e7" font-size="13" text-anchor="middle">(plus retrieval) enough?</text><line x1="320" y1="76" x2="418" y2="76" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5dec)"/><text x="368" y="68" fill="#34d399" font-size="12" text-anchor="middle">yes</text><rect x="420" y="50" width="240" height="52" rx="8" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="540" y="72" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">SINGLE CALL</text><text x="540" y="90" fill="#a1a1aa" font-size="12" text-anchor="middle">most tasks end here</text><line x1="180" y1="102" x2="180" y2="138" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5dec)"/><text x="196" y="126" fill="#f472b6" font-size="12">no</text><rect x="40" y="140" width="280" height="52" rx="8" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="180" y="162" fill="#e4e4e7" font-size="13" text-anchor="middle">Can your code list the steps</text><text x="180" y="180" fill="#e4e4e7" font-size="13" text-anchor="middle">or subtasks in advance?</text><line x1="320" y1="166" x2="418" y2="166" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5dec)"/><text x="368" y="158" fill="#38bdf8" font-size="12" text-anchor="middle">yes</text><rect x="420" y="140" width="240" height="52" rx="8" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><text x="540" y="162" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">WORKFLOW</text><text x="540" y="180" fill="#a1a1aa" font-size="12" text-anchor="middle">pick the simplest of the five patterns</text><line x1="180" y1="192" x2="180" y2="228" stroke="#a1a1aa" stroke-width="2" marker-end="url(#m0l5dec)"/><text x="196" y="216" fill="#f472b6" font-size="12">no</text><rect x="40" y="230" width="620" height="60" rx="8" fill="#27272a" stroke="#a78bfa" stroke-width="2"/><text x="350" y="255" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">AGENT: the model directs itself</text><text x="350" y="275" fill="#a1a1aa" font-size="12" text-anchor="middle">budget for loops, retries, and supervision; verify outputs like you mean it</text><text x="350" y="320" fill="#71717a" font-size="12" text-anchor="middle">Escalate only when the simpler shape demonstrably falls short.</text></svg>`,
            caption: 'Two questions route almost every task. Start at the top and stop as early as you can.',
          },
          {
            type: 'text',
            md: 'Claude Code itself is the proof case: an agent at its core (the model picks which files to read and what commands to run) wrapped in workflow-like guardrails (permissions, hooks, verification). The next module lives inside exactly that architecture.',
          },
        ],
      },
      {
        heading: 'The ACI: your tools are a UI',
        blocks: [
          {
            type: 'text',
            md: "The essay's most under-appreciated point concerns the **agent-computer interface**, or ACI: the set of tools an agent can call, including their names, parameter shapes, descriptions, and error messages. HCI (human-computer interaction) taught the industry to sweat every detail of interfaces built for people. The ACI deserves the same sweat, because tools are the only surface through which your agent perceives and acts on the world. Anthropic reports spending more time on tool design than on the overall prompt when building agents.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Poka-yoke your tools',
            md: "Poka-yoke is the Japanese manufacturing term for designing a process so mistakes are hard to make. Apply it to tools: require absolute paths so relative-path confusion cannot happen, return error strings that say what to do next, and document edge cases in the description as you would for a junior hire on day one. If a human would misread your tool docs, the model will too.",
          },
        ],
      },
    ],
    lab: {
      title: 'Classify five of your real tasks',
      intro:
        'Pattern-matching gets durable when you apply it to your own work. Classify five recurring tasks and defend each call.',
      steps: [
        'List 5 recurring tasks from your actual work that involve (or could involve) an LLM. Think PR review, changelog writing, triaging support email, dependency upgrades, or drafting ADRs (architecture decision records).',
        "For each, answer the fork question in writing: 'Can I enumerate the steps or subtasks in advance?' If yes: workflow. If no: agent.",
        'For each workflow, pick the specific pattern (chaining / routing / sectioning / voting / orchestrator-workers / evaluator-optimizer) and write one sentence of justification.',
        "Ask Claude to referee: 'Here are 5 tasks and my pattern classifications with justifications. Challenge each one and tell me where a simpler pattern would do.'",
        'Find at least one task you currently do in a free-form chat that should be a fixed workflow, and sketch its steps as a numbered list.',
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
        q: 'Orchestrator-workers vs parallelization sectioning: the key difference is that',
        options: [
          'Workers must use smaller models',
          'The orchestrator decides the subtasks dynamically at runtime; sectioning splits along boundaries you predefined',
          'Orchestrator-workers cannot run workers in parallel',
          'Sectioning always requires a voting step',
        ],
        answer: 1,
        explain:
          'Same fan-out shape, different author of the split. When your code already knows the sections upfront, you can skip paying for an orchestrator model.',
      },
      {
        q: 'The "augmented LLM", the atomic building block of all patterns, is a model plus:',
        options: [
          'A GPU cluster',
          'A human reviewer in the loop',
          'Retrieval, tools, and memory',
          'A fine-tuned adapter',
        ],
        answer: 2,
        explain:
          'Every workflow and agent composes this same unit: an LLM that can look things up, act through tools, and persist state between steps.',
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
          'Tools are the interface through which the agent perceives the world. Ambiguous parameters and vague descriptions produce the same misuse a bad human UI produces.',
      },
      {
        q: 'Voting-style parallelization is worth its N-times token cost when:',
        options: [
          'The task is trivially easy anyway',
          'You need higher confidence on a judgment call, since diverse attempts reduce variance (e.g. "is this code vulnerable?")',
          'You want the lowest possible latency',
          'The context window is nearly full',
        ],
        answer: 1,
        explain:
          'Voting buys confidence. Speed and economy both get worse, so use it where a wrong single-shot judgment costs more than the extra calls, like a missed vulnerability.',
      },
    ],
    resources: [
      {
        label: 'Anthropic: Building Effective Agents (the canonical essay)',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic cookbook: agent pattern implementations (code for all 5 patterns)',
        url: 'https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents',
        kind: 'repo',
      },
      {
        label: 'Anthropic engineering: Writing effective tools for agents (ACI deep dive)',
        url: 'https://www.anthropic.com/engineering/writing-tools-for-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic Academy: free agent courses with certificates',
        url: 'https://anthropic.skilljar.com',
        kind: 'course',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m0-l6: Token Economics 101
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm0-l6',
    title: 'Token Economics 101',
    day: 3,
    minutes: 50,
    xp: 100,
    objectives: [
      'Quote the July 2026 price ladder from memory and route tasks to the right model tier',
      'Compute agent-loop costs and explain why transcripts make cost roughly quadratic uncached and roughly linear cached',
      'Set up prompt caching so it actually pays, and name the mistakes that silently switch it off',
      'Decide between the metered API and a Pro or Max plan using the $6-10 per day crossover',
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
          "The 2026 ladder runs: Fable 5 at $10 in and $50 out, Opus 4.8 at $5/$25, Sonnet 5 at $3/$15 (intro price $2/$10 through Aug 31), and Haiku 4.5 at $1/$5. Top to bottom, that's roughly a 10x spread, which is why routing tasks to the right tier matters.",
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
          'Cache reads cost a tenth of the normal input price: a 90% discount on every hit. Writes carry a small premium (1.25x for the 5-minute lifetime, 2x for the 1-hour one), so caching pays for itself by the second request on the same prefix.',
      },
      {
        q: 'Why do uncached agent-loop costs grow roughly quadratically with turn count?',
        options: [
          'Output gets longer each turn',
          'Models charge a per-turn surcharge',
          'Tool calls double the token count',
          'The full transcript is resent as input every turn, so turn n pays again for all prior turns',
        ],
        answer: 3,
        explain:
          'The API keeps no memory between calls, so every turn resends the whole conversation as fresh input. Turn 40 pays again for the 39 turns before it. Summed over a session, billed tokens grow like the square of the turn count. Caching drops the resent prefix to a tenth of the price and bends the curve back toward linear.',
      },
      {
        q: 'Which of these silently invalidates your prompt cache?',
        options: [
          'Reusing the same system prompt twice',
          'Requests arriving within 5 minutes of each other',
          'A timestamp, random UUID, or unsorted JSON near the top of the prompt, since caching matches the prefix byte for byte',
          'Responses longer than 1,000 tokens',
        ],
        answer: 2,
        explain:
          'Caching matches your prompt prefix exactly. One changed character breaks the match from that point onward, so a timestamp near the top quietly disables the discount for everything after it. Dynamic values belong at the END of the prompt, behind the stable cached prefix.',
      },
      {
        q: 'The median Claude Code developer cost anchor, and the plan-vs-API crossover:',
        options: [
          '$60/day; crossover at $100/day',
          '~$6/day API-equivalent median (90% of devs under $12); the Pro/Max crossover sits around $6-10/day of usage',
          '$0.50/day; subscription plans never pay off',
          '$25/day flat for all users',
        ],
        answer: 1,
        explain:
          'Median usage sits near $6 of API-equivalent spend per day, and 90% of developers stay under $12. Above roughly $6-10 per day of sustained usage, the Max plans ($100 or $200 per month) win outright. Heavy multi-agent users can rack up $1,000 or more per month at raw API prices.',
      },
    ],
    sections: [
      {
        heading: 'The July 2026 price sheet',
        blocks: [
          {
            type: 'text',
            md: "First, some vocabulary. When you use Claude through the **API** (the pay-per-use programming interface), you get billed separately for **input tokens** (everything you send the model) and **output tokens** (everything it writes back). Prices are quoted per million tokens. Here's the ladder as of July 2026.",
          },
          {
            type: 'table',
            headers: ['Model', 'Input $/M', 'Output $/M', 'Notes'],
            rows: [
              ['Claude Fable 5', '$10', '$50', 'Frontier; 1M context'],
              ['Claude Opus 4.8', '$5', '$25', 'Heavy reasoning workhorse'],
              ['Claude Sonnet 5', '$3', '$15', 'Intro $2/$10 through Aug 31, 2026'],
              ['Claude Haiku 4.5', '$1', '$5', 'Fast tier. Most mechanical work belongs here'],
              ['OpenAI GPT-5.x tiers', '$0.20-$30', 'varies', 'Cached input at 10%'],
              ['Gemini 3.x tiers', '$0.25-$4', 'varies', 'Comparable ladder'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The two numbers that matter',
            md: 'Output costs about **5x input** at every provider, so verbosity is expensive. And the top-to-bottom Claude spread is about **10x** ($10 vs $1 per million input tokens). Routing tasks to the right model and keeping outputs short beat any coupon.',
          },
        ],
      },
      {
        heading: 'Caching changes everything',
        blocks: [
          {
            type: 'text',
            md: "**Prompt caching** lets the API remember the unchanging front portion of your prompt (the system prompt, the tool definitions, that long reference document) so repeat requests can skip re-processing it. You mark where the stable part ends, and the API stores what it computed. TTL means time-to-live: how long the cached copy survives between requests before it expires. The economics are dramatic.",
          },
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
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Caching matches from the front: layout decides your bill</text><text x="40" y="62" fill="#34d399" font-size="14" font-weight="bold">Cache-friendly layout</text><rect x="40" y="74" width="170" height="40" rx="4" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="125" y="98" fill="#e4e4e7" font-size="12" text-anchor="middle">system prompt</text><rect x="212" y="74" width="150" height="40" rx="4" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="287" y="98" fill="#e4e4e7" font-size="12" text-anchor="middle">tool definitions</text><rect x="364" y="74" width="170" height="40" rx="4" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="449" y="98" fill="#e4e4e7" font-size="12" text-anchor="middle">reference docs</text><rect x="536" y="74" width="124" height="40" rx="4" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><text x="598" y="92" fill="#fbbf24" font-size="11" text-anchor="middle">new message,</text><text x="598" y="106" fill="#fbbf24" font-size="11" text-anchor="middle">timestamp</text><text x="287" y="136" fill="#34d399" font-size="12" text-anchor="middle">stable prefix: re-read at 0.1x on every request</text><text x="598" y="136" fill="#fbbf24" font-size="12" text-anchor="middle">full price (tiny)</text><text x="40" y="186" fill="#f472b6" font-size="14" font-weight="bold">Cache-killing layout</text><rect x="40" y="198" width="70" height="40" rx="4" fill="#27272a" stroke="#f472b6" stroke-width="2"/><text x="75" y="222" fill="#f472b6" font-size="11" text-anchor="middle">timestamp</text><rect x="112" y="198" width="548" height="40" rx="4" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="386" y="222" fill="#a1a1aa" font-size="12" text-anchor="middle">everything after it: full price, on every single request</text><text x="350" y="266" fill="#e4e4e7" font-size="13" text-anchor="middle">The timestamp changes each call, so the prefix match dies at byte one.</text><text x="350" y="290" fill="#71717a" font-size="12" text-anchor="middle">Same content, same model, roughly 10x the input bill.</text></svg>`,
            caption: 'Put stable content first and dynamic values last. Order is the whole game.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The silent cache killers',
            md: 'Watch for these: a timestamp in the system prompt, a random UUID (a freshly generated unique ID), JSON serialized with keys in a different order each time, and tool definitions that shift between calls. Any one of them breaks the byte-for-byte prefix match and quietly multiplies your input bill by up to 10x. Put stable content first, dynamic values last, and sort your JSON keys.',
          },
        ],
      },
      {
        heading: 'Agent-loop math',
        blocks: [
          {
            type: 'text',
            md: "Now the trap that catches everyone. The API is **stateless**: it keeps nothing between calls, so every turn of a conversation resends the whole transcript as input. On turn 40 of a session, you pay to re-send turns 1 through 39. All of them, again.\n\nWalk the math with round numbers. If each turn adds about one unit of text, turn 1 sends 1 unit, turn 2 sends 2, turn 3 sends 3, and by turn 40 you've paid for 1+2+3+...+40 = 820 units, even though the conversation itself is only 40 units long. That sum grows like the square of the turn count, which is what 'quadratic' means here. Prompt caching collapses the resent portion to a tenth of the price and bends the curve back toward linear. Agent products live or die on this discipline.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><text x="350" y="26" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Cumulative session cost vs turns</text><line x1="70" y1="280" x2="660" y2="280" stroke="#52525b" stroke-width="2"/><line x1="70" y1="280" x2="70" y2="50" stroke="#52525b" stroke-width="2"/><text x="365" y="312" fill="#a1a1aa" font-size="13" text-anchor="middle">turns in the session</text><text x="32" y="170" fill="#a1a1aa" font-size="13" transform="rotate(-90 32 170)" text-anchor="middle">cumulative $</text><path d="M 70 280 Q 300 270 480 170 T 660 60" fill="none" stroke="#f472b6" stroke-width="3"/><text x="470" y="120" fill="#f472b6" font-size="14" font-weight="bold">uncached: ~quadratic</text><text x="470" y="140" fill="#a1a1aa" font-size="12">turn n re-pays all prior turns</text><path d="M 70 280 L 660 215" fill="none" stroke="#34d399" stroke-width="3"/><text x="440" y="250" fill="#34d399" font-size="14" font-weight="bold">cached: ~linear</text><text x="440" y="268" fill="#a1a1aa" font-size="12">prefix re-read at 0.1x</text><line x1="400" y1="280" x2="400" y2="60" stroke="#52525b" stroke-width="1" stroke-dasharray="5 5"/><text x="400" y="50" fill="#fbbf24" font-size="12" text-anchor="middle">/clear here: restart the curve</text></svg>`,
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
            caption: "The back-of-envelope model. You'll use it in the lab.",
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
              [
                'Max 20x',
                '$200/mo',
                'Heavy multi-agent workflows, where the raw API equivalent often exceeds $1,000/mo',
              ],
            ],
          },
          {
            type: 'text',
            md: "The crossover sits around **$6-10 per day** of API-equivalent usage. Below that line, metered pricing wins. Above it, a Max plan is straight arbitrage: a flat $100 or $200 a month covering usage that would meter out far higher. Run `/cost` in Claude Code for a week and let your own number make the call.",
          },
        ],
      },
      {
        heading: 'Habits that halve the bill',
        blocks: [
          {
            type: 'text',
            md: "- **Route by difficulty**: Haiku 4.5 handles mechanical edits, renames, and formatting at a tenth of Fable 5's price\n- **Fresh session per task**: a shorter resent transcript attacks the quadratic term directly\n- **Batch your questions**: five asks in one turn costs far less than five separate turns\n- **Edit and regenerate** instead of arguing, since correction threads are pure token burn\n- **Reference stable context in project files** so you stop re-pasting the same material\n- **Send anything non-urgent through the Batch API** for an instant 50% off",
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
          'Output costs roughly 5x input, so verbose responses dominate cost more than big contexts do',
          'Output is cheaper because it is generated rather than processed',
          'Only input is billed',
        ],
        answer: 1,
        explain:
          'Fable 5 runs $10 per million tokens in and $50 out, and that 5-6x ratio holds industry-wide. Constraining output length is therefore a real cost lever.',
      },
      {
        q: 'The Batch API tradeoff:',
        options: [
          'A 50% discount for async processing (results within 24h), ideal for evals, backfills, and non-interactive jobs',
          'A 50% surcharge for priority processing',
          'Available only on Haiku-class models',
          'Free but limited to 10 requests per day',
        ],
        answer: 0,
        explain:
          'When nothing is waiting on the answer interactively, batch it and halve it. All three major providers offer the same 50% deal.',
      },
      {
        q: "Cheapest correct habit for the 'rename this variable everywhere' class of task:",
        options: [
          'Fable 5 with extended thinking enabled',
          'Route it to Haiku 4.5: at $1/$5 it runs roughly 10x cheaper than Fable 5, and it is ample for mechanical edits',
          'Opus 4.8 with a verification subagent',
          'The Batch API with voting',
        ],
        answer: 1,
        explain:
          'Model routing is the biggest single lever. Matching task difficulty to model tier captures the 10x price spread with zero quality loss on mechanical work.',
      },
      {
        q: 'Why does a fresh session per task save real money in agent loops?',
        options: [
          'New sessions receive promotional pricing',
          'It resets your rate limits',
          'It shortens the transcript resent on every turn, attacking the quadratic term directly instead of just trimming the tail',
          'It re-warms the prompt cache automatically',
        ],
        answer: 2,
        explain:
          'Cost per turn is proportional to transcript length. Starting clean means every later turn in the new session carries less history, and the savings compound.',
      },
    ],
    resources: [
      {
        label: 'Anthropic docs: Model pricing (verify current numbers here)',
        url: 'https://docs.claude.com/en/docs/about-claude/pricing',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs: Prompt caching (mechanics + invalidators)',
        url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-caching',
        kind: 'docs',
      },
      {
        label: 'Anthropic docs: Batch processing (the 50% discount)',
        url: 'https://docs.claude.com/en/docs/build-with-claude/batch-processing',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs: Manage costs effectively',
        url: 'https://code.claude.com/docs/en/costs',
        kind: 'docs',
      },
      {
        label: 'Ponytail: anti-over-engineering skill (~20% cheaper, ~54% less code)',
        url: 'https://github.com/DietrichGebert/ponytail',
        kind: 'repo',
      },
    ],
  },
]
