import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────
  // m4-l1: The Open-Model Landscape 2026
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l1',
    title: 'The Open-Model Landscape 2026',
    day: 17,
    minutes: 50,
    xp: 100,
    objectives: [
      'Name the leading open-weight models of mid-2026 and describe what each one is good at',
      'Work out whether a model fits a given Mac by doing the RAM arithmetic yourself: parameter count, quantization level, and KV cache',
      'Explain why a 235B mixture-of-experts model needs about 132GB of RAM even though it runs at the speed of a 22B model',
      'Spot which 2024-25 local-model advice has gone stale, and explain why it expired',
    ],
    skipQuiz: [
      {
        q: 'Qwen 3 235B-A22B is a mixture-of-experts model with 22B active parameters. What determines how much RAM it needs?',
        options: [
          'Only the 22B active parameters; the rest stream in from disk whenever they are needed',
          'All 235B parameters, because every expert has to sit in memory the whole time (about 132GB at Q4)',
          'The KV cache size, which is the biggest memory cost in mixture-of-experts models',
          'Roughly half the total, because the router automatically pages out the experts it is not using',
        ],
        answer: 1,
        explain:
          'The router picks a different set of experts for every single token, so every expert has to be loaded into RAM and waiting the whole time. You pay for all 235B in memory, but each token only runs through about 22B worth of math. Memory cost and compute cost are two separate bills.',
      },
      {
        q: 'Why is GGUF Q4_K_M the default quantization recommendation rather than Q2 or Q3?',
        options: [
          'Q4_K_M is the only quantization level that llama.cpp supports on Apple hardware',
          'Lower quantization levels are faster to download but cannot run on Apple Silicon',
          'Quality holds up well down to about 4 bits per weight, then falls off a cliff below that',
          'Q4_K_M files are smaller than Q2 files because of superior compression',
        ],
        answer: 2,
        explain:
          'Q4_K_M keeps output quality very close to the original full-precision model for most models, at roughly a quarter of the size. Below 4 bits per weight the damage stops being gradual: outputs get noticeably dumber in a hurry. That cliff is why nobody recommends Q2 or Q3 as a default.',
      },
      {
        q: 'Rough RAM estimate for running a 30B model at Q4 with a working context?',
        options: [
          'About 8GB, since Q4 means a quarter of the parameter count in gigabytes',
          'About 30GB, since one gigabyte per billion parameters is the rule of thumb',
          'About 60GB, since quantization doubles the effective footprint',
          'About 18-21GB: parameter count times 0.5-0.6 GB per billion, plus 10-30% extra for the KV cache',
        ],
        answer: 3,
        explain:
          'At Q4, weights take roughly 0.5 to 0.6 GB per billion parameters, so a 30B model needs about 16-18GB for the weights alone. The KV cache (the working memory the model keeps for your conversation) adds another 10-30% depending on how long the chat gets. The total fits comfortably on a 32GB Mac.',
      },
      {
        q: 'Which license pairing is correct for the mid-2026 open leaders?',
        options: [
          'Qwen 3 is Apache 2.0, and the DeepSeek R1 line is MIT',
          'Qwen 3 is MIT, and DeepSeek R1 is research-only non-commercial',
          'Both Qwen 3 and DeepSeek R1 use the restrictive Llama Community License',
          'Qwen 3 is GPL-3, and DeepSeek R1 is Apache 2.0',
        ],
        answer: 0,
        explain:
          'Qwen 3 ships under Apache 2.0 and DeepSeek R1 ships under MIT. Both licenses are genuinely permissive: you can use the models commercially, modify them, and ship products built on them. That also matters later if you ever train a smaller model from a bigger one, since open teachers avoid the terms-of-service headaches that come with closed models.',
      },
      {
        q: 'Which piece of 2024-25 advice is now obsolete in mid-2026?',
        options: [
          'Quantize to roughly 4 bits for the best size and quality trade-off',
          'Leave RAM headroom for the operating system when sizing a local model',
          'Reach for Llama by default, since it is the reference open model',
          'Prefer permissive licenses when you plan to ship derivatives',
        ],
        answer: 2,
        explain:
          'Qwen, DeepSeek, GLM, and gpt-oss sit at the top of most open leaderboards now. Any guide that says "reach for Llama by default" is quietly telling you it was written in 2024. The other three pieces of advice have aged fine.',
      },
    ],
    sections: [
      {
        heading: "Who's Who in Open Weights",
        blocks: [
          {
            type: 'text',
            md: "Quick vocabulary before the map. A model's **weights** are the billions of numbers that make up its trained brain. **Parameters** means the same thing, and model sizes like 27B just count them (27 billion). An **open-weight model** is one where the maker publishes those numbers, so anyone can download the file and run the model on their own computer. Claude keeps its weights private, which is why you can only reach it over the internet.\n\nHere's the surprise if you skipped the last hype cycle: open models got good. The best open models in mid-2026 sit only a few months behind the frontier, and for everyday work like drafting, summarizing, and classifying, that gap barely shows. The names worth knowing today are Qwen, DeepSeek, GLM, Gemma, gpt-oss, Devstral, and Phi.\n\nOne more term you'll see constantly: **inference** just means running a model to get answers out of it, as opposed to training it. When someone says 'local inference', they mean the model does its thinking on your Mac instead of in a data center.",
          },
          {
            type: 'text',
            md: "The table reads left to right: how big the model is, what the license lets you do, why you'd care, and how much Mac it takes. In the size column, **dense** means the plain design where the whole model works on every word. **Active** will make full sense in the next section; for now, know that some models only use a small slice of themselves per word they generate, and that slice is what 'active' counts.",
          },
          {
            type: 'table',
            headers: ['Model', 'Size (total and active)', 'License', 'Why it matters', 'Min Mac RAM at Q4'],
            rows: [
              ['Qwen 3 235B-A22B', '235B total, 22B active', 'Apache 2.0', 'The open flagship; the closest thing to frontier quality you can download', '128GB+ (needs ~132GB)'],
              ['DeepSeek R1 line', '671B total, 37B active, plus distills', 'MIT', 'Top of the reasoning benchmarks; its distills (small student copies taught by the big model) run on modest Macs', '16GB (for the distills)'],
              ['GLM-4.7', 'Large MoE', 'Open weights', 'The standout for agentic coding, meaning AI that edits code through tools', '128-192GB'],
              ['Gemma 3 27B', '27B dense', 'Gemma terms', 'Understands images as well as text, and still fits a 32GB Mac', '32GB'],
              ['Qwen3 30B-A3B', '30B total, 3B active', 'Apache 2.0', 'The sweet spot: fast generation with real quality', '32GB'],
              ['gpt-oss 120B / 20B', 'MoE, 5.1B / 3.6B active', 'Apache 2.0', "OpenAI's open-weight pair; strong reasoning for the size", '64GB / 16GB'],
              ['Devstral', '24B dense', 'Apache 2.0', 'Built specifically to be a local coding agent', '32GB'],
              ['Phi-4', '14B dense', 'MIT', 'The small-footprint workhorse for modest hardware', '16GB (tight)'],
            ],
          },
        ],
      },
      {
        heading: 'MoE Math: Why 235B Runs Like 22B',
        blocks: [
          {
            type: 'text',
            md: "**Mixture-of-experts** (MoE) is the design trick that made huge open models runnable on a Mac, so it's worth understanding properly. In a normal dense model, every parameter does work on every token. An MoE model instead splits most of its bulk into dozens of specialist sub-networks called **experts**, plus a small **router** that reads each incoming token and wakes up only two or three experts to handle it.\n\nPicture a hospital that keeps every specialist on staff around the clock but only pages a couple of them per patient. Each patient sees just two doctors, so care is fast. The hospital still needs a room for every specialist, though, because the next patient might need any of them. MoE models work the same way: the router picks different experts for every token, so **all** the experts must sit in RAM, ready to go. You only pay compute for the few that actually got woken up.\n\nThat's why the name Qwen 3 235B-A22B decodes as '235 billion parameters total, about 22 billion active per token'. Memory cost: all 235B. Speed: roughly that of a 22B model. Big brain, small effort per word.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">MoE: RAM pays for ALL experts, compute pays for ACTIVE ones</text>
  <rect x="30" y="55" width="420" height="200" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="240" y="80" fill="#a1a1aa" font-size="13" text-anchor="middle">Unified memory: every expert resident (~132 GB at Q4)</text>
  <rect x="55" y="100" width="80" height="55" fill="#38bdf8" rx="6"/>
  <text x="95" y="132" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">E1 active</text>
  <rect x="150" y="100" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="190" y="132" fill="#a1a1aa" font-size="12" text-anchor="middle">E2 idle</text>
  <rect x="245" y="100" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="285" y="132" fill="#a1a1aa" font-size="12" text-anchor="middle">E3 idle</text>
  <rect x="340" y="100" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="380" y="132" fill="#a1a1aa" font-size="12" text-anchor="middle">E4 idle</text>
  <rect x="55" y="170" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="95" y="202" fill="#a1a1aa" font-size="12" text-anchor="middle">E5 idle</text>
  <rect x="150" y="170" width="80" height="55" fill="#38bdf8" rx="6"/>
  <text x="190" y="202" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">E6 active</text>
  <rect x="245" y="170" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="285" y="202" fill="#a1a1aa" font-size="12" text-anchor="middle">E7 idle</text>
  <rect x="340" y="170" width="80" height="55" fill="#27272a" stroke="#52525b" rx="6"/>
  <text x="380" y="202" fill="#a1a1aa" font-size="12" text-anchor="middle">E8 idle...</text>
  <rect x="500" y="90" width="170" height="70" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="585" y="118" fill="#a78bfa" font-size="13" font-weight="bold" text-anchor="middle">Router</text>
  <text x="585" y="140" fill="#a1a1aa" font-size="11" text-anchor="middle">picks experts per token</text>
  <rect x="500" y="185" width="170" height="70" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="585" y="213" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Per-token compute</text>
  <text x="585" y="235" fill="#a1a1aa" font-size="11" text-anchor="middle">scales with 22B active</text>
  <line x1="500" y1="125" x2="455" y2="125" stroke="#a78bfa" stroke-width="2"/>
  <polygon points="455,125 465,120 465,130" fill="#a78bfa"/>
  <line x1="585" y1="160" x2="585" y2="185" stroke="#34d399" stroke-width="2"/>
  <polygon points="585,185 580,175 590,175" fill="#34d399"/>
  <text x="350" y="300" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">Qwen 3 235B-A22B: 132 GB of RAM, but generates like a 22B model</text>
  <text x="350" y="322" fill="#a1a1aa" font-size="12" text-anchor="middle">Qwen3 30B-A3B: 30B in RAM (~19 GB), 3B compute: why it flies on a 32GB Mac</text>
</svg>`,
            caption: 'The MoE bargain: memory cost follows total parameters, speed follows active parameters.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'How to read MoE model names',
            md: "Read the name as **total/active**. 235B-A22B means 235B parameters resident in RAM with about 22B doing work per token. 30B-A3B means roughly 19GB sitting in memory with the speed of a tiny 3B model. This trade is also why Macs punch above their weight for local AI: the real bottleneck is how much memory you have, and Apple happens to sell a lot of it in one shared pool.",
          },
        ],
      },
      {
        heading: 'Quantization and the RAM Budget',
        blocks: [
          {
            type: 'text',
            md: "Models are trained with each weight stored as a 16-bit number, a format called **fp16** that costs two bytes per weight. At that precision a 30B model needs about 60GB just for its weights. **Quantization** shrinks each weight down to fewer bits, the way a photo exported at lower quality takes less disk space. Squash every weight to about 4 bits and that same 30B model drops to roughly 17GB. The wild part is how little quality you lose on the way down.\n\nTwo bits of jargon you'll meet the moment you go download something. [GGUF](https://huggingface.co/docs/hub/gguf) is the standard file format for quantized models; think of it as the zip file of local AI, readable by most Mac tools. **Q4_K_M** is the name of the most popular quantization recipe inside that format: about 4.5 bits per weight, with outputs nearly indistinguishable from the full-precision original for most models.",
          },
          {
            type: 'table',
            headers: ['Precision', 'Bits per weight', 'A 30B model weighs', 'Quality'],
            rows: [
              ['fp16 (as trained)', '16', '~60GB', 'The reference point; full quality'],
              ['Q8_0', '8', '~32GB', 'Basically indistinguishable from fp16'],
              ['Q4_K_M', '~4.5', '~17GB', 'The default: tiny quality loss for most models'],
              ['Q2_K', '~2.5', '~11GB', 'Noticeably dumber; avoid unless desperate'],
            ],
          },
          {
            type: 'text',
            md: "Now the arithmetic. Three ingredients decide whether a model fits your Mac:\n\n- Weights: parameter count times 0.5-0.6 GB per billion at Q4. A 30B model lands around 16-18GB.\n- **KV cache**: the model's scratch memory for the current conversation. The attention mechanism keeps a record (the 'keys' and 'values') for every token in the context window, so this grows as the chat grows. Budget an extra 10-30% on top of the weights.\n- Everything else on your Mac: macOS plus your browser and apps want 8-12GB for themselves.\n\nLet's walk one example on a 32GB Mac. Start with 32GB, subtract 10GB for the system, and you have about 22GB of budget. Qwen3 30B-A3B at Q4 is about 17GB of weights, plus maybe 3GB of KV cache for a decent-length session. Total: around 20GB. It fits, with a little breathing room. A dense 70B model at Q4 wants about 40GB for weights alone, so on this machine it's out of the question.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The quality cliff',
            md: "It's tempting to grab a Q2 or Q3 file so a bigger model squeezes into your RAM. Resist. Quality holds up well down to about 4 bits, then falls off a cliff: below Q4, models start hallucinating and losing their grip on instructions, and generated code comes out mangled. A smaller model at Q4 or Q8 beats a bigger one at Q2 almost every time.",
          },
        ],
      },
      {
        heading: 'Mac Unified-Memory Tiers',
        blocks: [
          {
            type: 'text',
            md: "Here's the Apple-specific piece. On a typical PC, the graphics card has its own separate memory (VRAM), and models have to fit inside that. Apple Silicon Macs use **unified memory** instead: one pool of RAM shared by the CPU and the GPU. So your Mac's RAM number is also your model ceiling, full stop. No separate graphics card to upgrade, no workaround.\n\nThe ladder below shows what genuinely runs well in each tier at Q4. 'Genuinely runs' means it loads AND leaves room for the system to breathe. Plenty of models will technically load one tier below where they belong, and then grind your machine to a halt swapping memory to disk.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="400" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The unified-memory ladder: RAM tier sets your model ceiling</text>
  <rect x="110" y="60" width="560" height="70" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="98" y="100" fill="#34d399" font-size="14" font-weight="bold" text-anchor="end">128-192GB</text>
  <text x="130" y="87" fill="#e4e4e7" font-size="12">Qwen 3 235B-A22B (~132GB), GLM-4.7</text>
  <text x="130" y="112" fill="#a1a1aa" font-size="11">the 235B-class MoE flagships live here</text>
  <rect x="110" y="145" width="450" height="70" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="98" y="185" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="end">64GB</text>
  <text x="130" y="172" fill="#e4e4e7" font-size="12">70B dense (~40GB), gpt-oss 120B</text>
  <text x="130" y="197" fill="#a1a1aa" font-size="11">big dense models start to fit; gpt-oss 120B runs fast here</text>
  <rect x="110" y="230" width="340" height="70" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="98" y="270" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end">32GB</text>
  <text x="130" y="257" fill="#e4e4e7" font-size="11">Qwen3 30B-A3B, Gemma 3 27B, Devstral</text>
  <text x="130" y="282" fill="#a1a1aa" font-size="11">the sweet spot for price vs capability</text>
  <rect x="110" y="315" width="240" height="70" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="98" y="355" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="end">16GB</text>
  <text x="130" y="342" fill="#e4e4e7" font-size="11">R1 distill 8B, Gemma 3 12B</text>
  <text x="130" y="367" fill="#a1a1aa" font-size="11">small models, real work</text>
</svg>`,
            caption: 'Each bar is a Mac RAM tier; wider bar, bigger models. Sizes assume Q4 quantization.',
          },
          {
            type: 'table',
            headers: ['Mac RAM', 'What genuinely runs at Q4', 'Examples'],
            rows: [
              ['16GB', '7-8B dense models, small MoE', 'DeepSeek R1 distill 8B; Phi-4 is a tight fit'],
              ['32GB', '14-30B dense, 30B-class MoE', 'Qwen3 30B-A3B, Gemma 3 27B, Devstral'],
              ['64GB', '70B dense, or gpt-oss 120B', 'gpt-oss 120B (5.1B active) runs surprisingly fast'],
              ['128-192GB', '235B-class MoE', 'Qwen 3 235B-A22B (~132GB), GLM-4.7'],
            ],
          },
        ],
      },
      {
        heading: 'What Went Stale (and How Fast)',
        blocks: [
          {
            type: 'text',
            md: "If you google 'best local LLM for Mac' you'll land on guides from 2024-25, and most of their advice has quietly expired. The comparison below works as a stale-guide detector: when an article leans on anything in the left column, check its publication date before trusting anything else it says.",
          },
          {
            type: 'compare',
            left: {
              title: '2024-25 advice (obsolete)',
              items: [
                'Llama is the default open model',
                'GGUF is the only real path on a Mac',
                'The dense 70B is the prize to chase',
                'Pick a model once and settle in',
                'Mixtral / Qwen 2.5 / Phi-3 era rankings',
              ],
            },
            right: {
              title: 'Mid-2026 reality',
              items: [
                'Qwen, DeepSeek, GLM, and gpt-oss lead most boards',
                'MLX is native on Apple Silicon and often faster',
                'MoE gives 70B-class quality at 3-22B compute cost',
                'Model half-life is about 6 months; re-check quarterly',
                'All superseded; read old guides as history',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Half-life discipline',
            md: "Any local-model recommendation, this lesson included, decays in about six months. Put a quarterly reminder on your calendar: spend 20 minutes on [lmarena.ai](https://lmarena.ai) (a public leaderboard where humans vote on model quality in blind matchups) and the [Ollama library](https://ollama.com/library), refresh your shortlist, and move on with your life.",
          },
        ],
      },
    ],
    lab: {
      title: 'Size YOUR Mac',
      intro: "Turn the theory into a concrete shortlist. You'll find your RAM tier, run the fit arithmetic yourself, and pick three models that genuinely run on your machine with room to spare.",
      steps: [
        'Find your RAM: run `system_profiler SPHardwareDataType | grep Memory` (or Apple menu > About This Mac).',
        'Compute your usable budget: total RAM minus 8-12GB for macOS and your normal apps.',
        'Pick 3 candidate models from the who-is-who table for your tier and estimate each one: parameters x 0.55 GB per billion, plus 20% for KV cache. Write the numbers down.',
        'Cross-check against reality: open [ollama.com/library](https://ollama.com/library) and confirm the actual Q4 download size for each candidate.',
        'Create `~/ai-notes/local-models.md` listing your 3 finalists with size, license, and one line on why each made the cut.',
        'Bookmark [lmarena.ai](https://lmarena.ai) and set a quarterly calendar reminder to redo this exercise.',
      ],
      checklist: [
        'I know my exact RAM and my usable model budget in GB',
        'I computed estimated RAM for at least 3 models and checked against real download sizes',
        'My shortlist has 3 models that fit with at least 15% headroom',
        'I noted the license of every shortlisted model',
        'A quarterly leaderboard-check reminder exists on my calendar',
      ],
    },
    checkQuiz: [
      {
        q: 'On a 64GB Mac, which is a realistic ceiling at Q4?',
        options: [
          'Qwen 3 235B-A22B, since MoE means only the 22B active parameters need RAM',
          'A 70B dense model, or gpt-oss 120B thanks to its MoE layout',
          'Nothing above 30B, because the OS reserves half of unified memory for graphics',
          'Any model at all, since llama.cpp streams weights from the SSD at full speed',
        ],
        answer: 1,
        explain:
          'A 70B dense model at Q4 comes to roughly 38-42GB of weights plus KV cache, which fits inside 64GB with headroom. gpt-oss 120B squeezes into the same envelope because its MoE design and aggressive quantization keep the resident size down. The 235B-A22B still needs about 132GB loaded at once, so it stays out of reach.',
      },
      {
        q: 'Why does the KV cache add a variable 10-30% on top of weight RAM?',
        options: [
          'It grows with context length, because attention stores keys and values for every token in the window',
          'It mirrors the model weights at higher precision for numerical stability',
          'It caches disk reads and shrinks as the model warms up',
          'It is a fixed 30% that Apple reserves inside unified memory',
        ],
        answer: 0,
        explain:
          'The KV cache is per-token bookkeeping: every token in the conversation adds an entry the model consults when generating the next word. A short chat costs almost nothing. A long agent transcript at 32k+ tokens can eat several extra gigabytes, which is why the estimate is a range instead of a number.',
      },
      {
        q: 'What makes Gemma 3 27B distinctive in the mid-2026 lineup?',
        options: [
          'It is the only MIT-licensed model that fits a 16GB Mac',
          'It is a MoE with 3B active parameters, giving the fastest generation',
          'It accepts images as input (it is multimodal) while still fitting a 32GB Mac',
          'It was distilled from DeepSeek R1 for reasoning tasks',
        ],
        answer: 2,
        explain:
          'Gemma 3 27B is the practical local vision model. You can hand it a screenshot or photo along with your question, and its dense 27B design still fits a 32GB Mac at Q4. Most other vision-capable options either live behind an API or need a much bigger machine.',
      },
      {
        q: 'Given a roughly 6-month model half-life, what is the right operating posture?',
        options: [
          'Standardize on one model per year to amortize prompt tuning',
          'Only adopt models older than a year, once the dust settles',
          'Ignore leaderboards, since benchmark scores never transfer to real work',
          'Re-check leaderboards and your shortlist quarterly, and treat model choice as a rolling decision',
        ],
        answer: 3,
        explain:
          'The open-model leaders flipped multiple times across 2025-26: Llama gave way to Qwen and DeepSeek, then GLM and gpt-oss joined the front row. A 20-minute quarterly review keeps you current without constant churn or regret.',
      },
    ],
    resources: [
      { label: 'Qwen 3 235B-A22B model card', url: 'https://huggingface.co/Qwen/Qwen3-235B-A22B', kind: 'repo' },
      { label: 'DeepSeek R1 model card (MIT)', url: 'https://huggingface.co/deepseek-ai/DeepSeek-R1', kind: 'repo' },
      { label: 'Gemma 3 27B model card', url: 'https://huggingface.co/google/gemma-3-27b-it', kind: 'repo' },
      { label: 'gpt-oss on Ollama', url: 'https://ollama.com/library/gpt-oss', kind: 'docs' },
      { label: 'LMArena leaderboard (quarterly check)', url: 'https://lmarena.ai', kind: 'article' },
      { label: 'Artificial Analysis: open-weights comparison', url: 'https://artificialanalysis.ai/models/open-source', kind: 'article' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m4-l2: Running Models on Your Mac
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l2',
    title: 'Running Models on Your Mac',
    day: 17,
    minutes: 55,
    xp: 100,
    objectives: [
      'Choose among Ollama, LM Studio, mlx-lm, and llama.cpp for a given job, and explain why vLLM stays off the Mac list',
      'Install a runtime, pull a model sized to your RAM, and chat with it locally',
      'Measure your real generation speed in tokens per second, and tell the two speed numbers apart',
      'Explain why the MLX backend matters on Apple Silicon',
    ],
    skipQuiz: [
      {
        q: 'What did Ollama 0.19 change for Apple Silicon users?',
        options: [
          'It dropped GGUF support in favor of a proprietary format',
          'It added an MLX backend, with generation up to 93% faster on M-series chips',
          'It moved inference to a cloud relay for models above 30B',
          'It added CUDA support so Macs can use external NVIDIA GPUs',
        ],
        answer: 1,
        explain:
          "Ollama 0.19 added a second engine under the hood: MLX, Apple's own machine-learning framework. You type the same commands and hit the same API, but Apple-native code does the math, and generation runs up to 93% faster on M-series chips.",
      },
      {
        q: 'Which tool does NOT belong in your Mac toolkit?',
        options: [
          'vLLM, which is built for serving many users at once from Linux servers with NVIDIA GPUs',
          'mlx-lm, which only runs on Intel Macs',
          'llama.cpp, which was abandoned after GGUF v3',
          'LM Studio, which cannot load MLX models',
        ],
        answer: 0,
        explain:
          'vLLM is a production serving engine: it shines when one Linux box with NVIDIA GPUs has to answer hundreds of simultaneous requests. Useful to know about for work, wrong tool for a laptop. The other three are alive, well, and Mac-native; the claims about them in those options are made up.',
      },
      {
        q: 'You want the fastest raw inference path on an M-series Mac. Which do you reach for?',
        options: [
          'vLLM with tensor parallelism',
          'Ollama pinned to its older GGML backend',
          'mlx-lm, which runs Apple-native MLX kernels and doubles as the local fine-tuning path',
          'llama.cpp running under Rosetta translation for x86 optimizations',
        ],
        answer: 2,
        explain:
          "mlx-lm runs code Apple designed specifically for its own chips and unified memory, with the least overhead of the four tools. Bonus: the same package (via mlx_lm.lora) is how you'll fine-tune a model locally later on.",
      },
      {
        q: 'Ollama serves its local API on which default port?',
        options: ['8080', '3000', '5000', '11434'],
        answer: 3,
        explain:
          'The address to memorize is http://localhost:11434. Any tool that can talk to an AI API, Claude Code included, can be pointed at that address so it uses your local models instead of a cloud service.',
      },
      {
        q: "What is LM Studio's distinguishing position among the four Mac tools?",
        options: [
          'Lowest-level control over quantization and sampler internals',
          'The best GUI of the group, and it runs both GGUF and MLX models',
          'The only tool that exposes an OpenAI-compatible API',
          'A cloud sync service for sharing models between Macs',
        ],
        answer: 1,
        explain:
          'LM Studio is the polished desktop app: you browse models like an app store, download with a click, and compare outputs side by side, in either GGUF or MLX format. Careful with the API option, though: Ollama serves an OpenAI-compatible API too, so "only tool" is false.',
      },
    ],
    sections: [
      {
        heading: "The Four Tools (Plus One That Isn't Yours)",
        blocks: [
          {
            type: 'text',
            md: "One definition first: a **runtime** is the program that loads a model file into memory and runs it, the way a media player plays a video file. The model is data; the runtime is the engine.\n\nFive runtime names dominate local-AI conversations, and four of them belong on your Mac. They stack rather than compete: **llama.cpp** is the low-level engine written in C++, and both Ollama and LM Studio are friendlier wrappers around it. Since Apple released **MLX**, its machine-learning framework tuned for M-series chips, both wrappers can run MLX-format models too. Pick by the job in front of you, and don't agonize: they all read the same model families.",
          },
          {
            type: 'table',
            headers: ['Tool', 'What it is', 'When it wins'],
            rows: [
              ['Ollama', 'Command-line tool plus a local API server on port 11434; version 0.19 added the MLX backend (up to 93% faster generation)', 'Your default. Best ergonomics, and every other tool can point at its API'],
              ['LM Studio', 'Desktop app with a full GUI; runs GGUF and MLX models', 'Visual model browsing, side-by-side comparisons, days you want no terminal'],
              ['mlx-lm', "Python package built on Apple's MLX framework", 'The fastest raw path on Apple Silicon; also the local fine-tuning path'],
              ['llama.cpp', 'The C++ engine the others wrap', 'Portability, embedded devices, fine-grained control over quantization and sampling'],
              ['vLLM', 'A server engine built to answer many requests at once', 'Linux plus NVIDIA at scale. Know it exists, deploy it at work, skip it on your Mac'],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The local stack on an M-series Mac</text>
  <rect x="40" y="55" width="280" height="60" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="180" y="80" fill="#e4e4e7" font-size="13" font-weight="bold" text-anchor="middle">Your terminal / app / Claude Code</text>
  <text x="180" y="100" fill="#a1a1aa" font-size="11" text-anchor="middle">any HTTP client</text>
  <rect x="380" y="55" width="280" height="60" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="520" y="80" fill="#e4e4e7" font-size="13" font-weight="bold" text-anchor="middle">LM Studio GUI</text>
  <text x="520" y="100" fill="#a1a1aa" font-size="11" text-anchor="middle">browse, chat, compare</text>
  <line x1="180" y1="115" x2="330" y2="160" stroke="#38bdf8" stroke-width="2"/>
  <text x="200" y="150" fill="#38bdf8" font-size="11">HTTP :11434</text>
  <line x1="520" y1="115" x2="400" y2="160" stroke="#52525b" stroke-width="2"/>
  <rect x="230" y="160" width="240" height="55" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="350" y="183" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Ollama server / runtime</text>
  <text x="350" y="203" fill="#a1a1aa" font-size="11" text-anchor="middle">model pulls, sessions, API</text>
  <rect x="90" y="240" width="240" height="50" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="210" y="261" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">MLX backend (0.19+)</text>
  <text x="210" y="279" fill="#a1a1aa" font-size="11" text-anchor="middle">Apple-native, up to 93% faster generation</text>
  <rect x="370" y="240" width="240" height="50" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="490" y="261" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">llama.cpp / GGML + Metal</text>
  <text x="490" y="279" fill="#a1a1aa" font-size="11" text-anchor="middle">GGUF path, maximum portability</text>
  <line x1="300" y1="215" x2="230" y2="240" stroke="#a78bfa" stroke-width="2"/>
  <line x1="400" y1="215" x2="470" y2="240" stroke="#f472b6" stroke-width="2"/>
  <text x="350" y="312" fill="#34d399" font-size="12" text-anchor="middle" font-weight="bold">Both backends run on the same unified memory + M-series GPU</text>
</svg>`,
            caption: 'One API surface, two backends. Ollama picks MLX or GGML per model, and you rarely have to care which.',
          },
        ],
      },
      {
        heading: 'Ollama: Install, Pull, Run',
        blocks: [
          {
            type: 'text',
            md: "Ollama borrows its feel from Docker, the container tool: models have names and version tags, you pull them from an online registry, and you run them with a single command. Never used Docker? The flow is even easier to describe from scratch. Ask for a model by name, wait for the download, start chatting.\n\nThe model names below match the RAM-tier picks from lesson 1: the 30B-A3B mixture-of-experts if your Mac has 32GB or more, and Gemma 3 12B if you're on a 16GB machine.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `brew install ollama
ollama serve &

# 32GB+ Mac: the MoE sweet spot (~19GB)
ollama pull qwen3:30b-a3b

# 16GB Mac: multimodal and comfortable (~8GB)
ollama pull gemma3:12b

ollama run qwen3:30b-a3b
# >>> chat happens here; /bye to exit`,
            caption: 'The whole lifecycle in five commands: install the tool, start the server, download a model, chat.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Model naming',
            md: "Ollama tags encode the variant and the quantization level. Pulling `qwen3:30b-a3b` gives you Q4_K_M by default, which is the right call for most people. When you want higher fidelity and have the RAM to spare, ask for it explicitly with a longer tag like `:30b-a3b-q8_0`.",
          },
        ],
      },
      {
        heading: 'The MLX Path',
        blocks: [
          {
            type: 'text',
            md: "MLX is Apple's machine-learning framework, designed from scratch around unified memory rather than ported over from the NVIDIA world. The **mlx-lm** package gives you the lowest-overhead inference available on an M-series chip. It's also the same package you'll use later for local fine-tuning, through its mlx_lm.lora command, so time spent here pays twice.\n\nYou don't convert models yourself. The [mlx-community](https://huggingface.co/mlx-community) organization on [Hugging Face](https://huggingface.co) (the GitHub of AI models) publishes ready-converted copies of most major releases within days of them coming out.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `pip install mlx-lm

mlx_lm.generate \\
  --model mlx-community/Qwen3-30B-A3B-4bit \\
  --prompt "Explain KV cache growth to a systems engineer in 100 words." \\
  --max-tokens 300
# prints generation speed in tokens-per-sec when done`,
            caption: 'mlx_lm.generate reports its own speed in tokens per second when it finishes: free benchmarking.',
          },
        ],
      },
      {
        heading: 'Measuring Tokens/Sec',
        blocks: [
          {
            type: 'text',
            md: "A **token** is the unit models read and write: a short chunk of text, usually three or four characters, so 100 tokens is roughly 75 words. **Tokens per second** (tok/s) is the speed stat of local AI, and every benchmark thread you'll ever read argues about it.\n\nHere's the catch: each response has two different speeds, and people constantly mix them up.\n\n- **Prompt eval rate** measures how fast the model reads your input. This is limited by raw compute and usually runs in the hundreds of tok/s.\n- **Eval rate** measures how fast it writes the reply, one token at a time. This is the number you feel while waiting, and it's limited by memory bandwidth: for every single token generated, the chip has to stream all the active weights out of RAM.\n\nCalibration for your gut: 20+ tok/s on the eval rate reads like a fluent conversation partner. Anything under 10 has you drumming your fingers while words crawl out.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Eval rate: what tokens per second feels like</text>
  <line x1="204" y1="72" x2="204" y2="90" stroke="#e4e4e7" stroke-width="1"/>
  <text x="204" y="66" fill="#e4e4e7" font-size="11" text-anchor="middle">dense 27B on a 32GB Mac: ~12 tok/s</text>
  <line x1="600" y1="72" x2="600" y2="90" stroke="#e4e4e7" stroke-width="1"/>
  <text x="640" y="66" fill="#e4e4e7" font-size="11" text-anchor="end">MoE 30B-A3B: ~45 tok/s</text>
  <rect x="60" y="90" width="120" height="40" fill="#f472b6" rx="4"/>
  <rect x="180" y="90" width="120" height="40" fill="#fbbf24" rx="4"/>
  <rect x="300" y="90" width="240" height="40" fill="#34d399" rx="4"/>
  <rect x="540" y="90" width="120" height="40" fill="#38bdf8" rx="4"/>
  <text x="60" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">0</text>
  <text x="180" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">10</text>
  <text x="300" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">20</text>
  <text x="540" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">40</text>
  <text x="660" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">50+</text>
  <text x="120" y="172" fill="#f472b6" font-size="12" text-anchor="middle">painful wait</text>
  <text x="240" y="172" fill="#fbbf24" font-size="12" text-anchor="middle">usable</text>
  <text x="420" y="172" fill="#34d399" font-size="12" text-anchor="middle">conversational</text>
  <text x="600" y="172" fill="#38bdf8" font-size="12" text-anchor="middle">fast</text>
  <text x="350" y="220" fill="#e4e4e7" font-size="12" text-anchor="middle">Generation speed follows ACTIVE parameters: fewer weights read per token, faster words.</text>
  <text x="350" y="245" fill="#a1a1aa" font-size="11" text-anchor="middle">Same Mac, similar RAM footprint; the MoE reads ~3B per token while the dense model reads all 27B.</text>
</svg>`,
            caption: 'Rough eval-rate zones on an M-series Mac, with two lesson-1 models placed for scale.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: `ollama run qwen3:30b-a3b --verbose
# after each reply:
#   prompt eval rate:  312.4 tokens/s
#   eval rate:          41.7 tokens/s   <- the number you feel`,
            caption: 'The --verbose flag prints timing after every response.',
          },
          {
            type: 'text',
            md: "You'll end up with models in both formats on your disk, and that's fine. A rough guide to which lane wins when:",
          },
          {
            type: 'compare',
            left: {
              title: 'GGUF (llama.cpp lineage)',
              items: [
                'Universal format that runs on almost anything',
                'Q4_K_M default, plus a huge menu of other quant levels',
                'Biggest model library, with day-one releases',
                'Uses the Metal GPU layer: solid speed, built for portability first',
              ],
            },
            right: {
              title: 'MLX (Apple-native)',
              items: [
                'Designed around unified memory',
                'Often the fastest generation on M-series chips',
                'The local fine-tuning path (mlx_lm.lora)',
                'mlx-community mirrors most major releases within days',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Pull, Run, Measure, Compare',
      intro: 'Get a real model running on your Mac, put an actual number on its speed, and calibrate its quality against Claude using one identical prompt.',
      steps: [
        'Install: `brew install ollama` (or download LM Studio from [lmstudio.ai](https://lmstudio.ai) if you prefer a GUI).',
        'Start the server: `ollama serve` in one terminal, then verify with `curl http://localhost:11434`; it should answer that Ollama is running.',
        'Pull your size-appropriate model from lab 1: `ollama pull qwen3:30b-a3b` (32GB+) or `ollama pull gemma3:12b` (16GB).',
        'Chat: `ollama run qwen3:30b-a3b --verbose` and ask a real question pulled from your actual work. Toy prompts hide weaknesses.',
        'Record the numbers: note the prompt eval rate and the eval rate from the verbose output in your `local-models.md`.',
        'Run the exact same prompt in Claude. Write 3 lines: where local matched it, where it fell short, and whether that gap matters for this kind of task.',
      ],
      checklist: [
        'Ollama (or LM Studio) is installed and the server answers on :11434',
        'A model sized to my RAM tier is pulled and responding',
        'I recorded a real eval-rate number in tokens/sec',
        'I ran the identical prompt on Claude and wrote a 3-line quality comparison',
        'I can explain the difference between prompt eval rate and eval rate',
      ],
    },
    checkQuiz: [
      {
        q: 'How do you get per-response speed metrics out of the Ollama CLI?',
        options: [
          'Run ollama stats --live in a second terminal',
          'Run the model with the --verbose flag; it prints prompt eval rate and eval rate after each reply',
          'Set OLLAMA_DEBUG=1 and parse the server logs',
          'Speed metrics require the LM Studio GUI',
        ],
        answer: 1,
        explain:
          "Adding --verbose to ollama run makes it print timing stats after every single reply. It's the zero-effort way to benchmark models on your own hardware instead of trusting someone else's numbers.",
      },
      {
        q: 'When would you drop from Ollama down to raw llama.cpp?',
        options: [
          'When you need an OpenAI-compatible HTTP API',
          'When you want automatic model pulls and version management',
          'When you need portability to unusual targets or fine-grained control over quantization and samplers',
          'When you want MLX acceleration on Apple Silicon',
        ],
        answer: 2,
        explain:
          'llama.cpp is the layer underneath Ollama. You drop down to it for embedded builds, exotic platforms, custom quantization, or sampler surgery. Ollama already covers the API, the model pulls, and the MLX case, so those needs never send you deeper.',
      },
      {
        q: 'Your verbose output shows prompt eval rate 300 tok/s but eval rate 9 tok/s. What is the bottleneck on generation?',
        options: [
          "Memory bandwidth: generating each token streams the active weights out of RAM, and this model is near your machine's ceiling",
          'Network latency to the Ollama registry',
          'The prompt was too short to warm the cache',
          'CPU single-core speed, since decoding runs serially on the CPU',
        ],
        answer: 0,
        explain:
          'Generation speed is limited by how fast RAM can feed the active weights to the chip, once per token. A 9 tok/s eval rate is your Mac telling you to pick a smaller model, or a MoE model with fewer active parameters.',
      },
      {
        q: 'Why does Qwen3 30B-A3B generate dramatically faster than Gemma 3 27B on the same Mac despite similar RAM footprints?',
        options: [
          'Qwen ships at Q2 by default, halving the memory traffic',
          'Gemma 3 is throttled unless you accept its license terms',
          'Ollama caches Qwen models in a faster memory region',
          'Per-token generation touches only about 3B active parameters in the MoE, versus all 27B in the dense model',
        ],
        answer: 3,
        explain:
          'Both models hold roughly 17-19GB of weights in RAM. But generation speed follows how many parameters get read per token, and 3B versus 27B is nearly a 9x difference in memory traffic. That gap explains the whole speed difference.',
      },
    ],
    resources: [
      { label: 'Ollama blog: the MLX backend', url: 'https://ollama.com/blog/mlx', kind: 'article' },
      { label: 'Ollama download + quickstart', url: 'https://ollama.com/download', kind: 'docs' },
      { label: 'LM Studio', url: 'https://lmstudio.ai', kind: 'docs' },
      { label: 'mlx-lm (Apple MLX language models)', url: 'https://github.com/ml-explore/mlx-lm', kind: 'repo' },
      { label: 'llama.cpp', url: 'https://github.com/ggml-org/llama.cpp', kind: 'repo' },
      { label: 'Qwen3 on the Ollama library', url: 'https://ollama.com/library/qwen3', kind: 'docs' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m4-l3: Local Agents & the Hybrid Split
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l3',
    title: 'Local Agents & the Hybrid Split',
    day: 18,
    minutes: 50,
    xp: 100,
    objectives: [
      'Point Claude Code at a local Ollama endpoint and run a real coding task against it',
      'Route work between local and frontier models using a written 80/20 policy',
      'Argue concretely when local wins (privacy, offline, latency, cost) and when it loses',
      'Do honest cost math on the "Mac mini as agent server" pitch',
    ],
    skipQuiz: [
      {
        q: 'What does setting ANTHROPIC_BASE_URL=http://localhost:11434/v1 before launching Claude Code accomplish?',
        options: [
          'It enables offline caching of Anthropic API responses on your Mac',
          "It routes Claude Code's API traffic to Ollama's local OpenAI-compatible endpoint, so you keep the same workflow with local inference",
          'It mirrors your session transcripts to a local audit log',
          'It makes Ollama proxy requests through to Anthropic with local rate limiting',
        ],
        answer: 1,
        explain:
          "Claude Code sends its requests to whatever base URL its environment hands it. Point that at Ollama's /v1 endpoint and the harness (the tools, the loop, the UI) stays identical while a model running on your own Mac does the thinking.",
      },
      {
        q: 'The hybrid doctrine in one sentence:',
        options: [
          'Run everything locally and rent GPU time for training runs',
          'Use frontier models for everything, since local is for hobbyists',
          'Alternate providers weekly to avoid vendor lock-in',
          'Local handles ~80% of volume (drafts, RAG over private files, classification, agent loops on private data); one frontier subscription covers the 20% needing frontier reasoning',
        ],
        answer: 3,
        explain:
          "Most of your token volume is routine work that a good local model handles fine. Save the frontier subscription for the tasks where reasoning depth is the actual product you're paying for.",
      },
      {
        q: 'Which workload should stay on a frontier model in a hybrid setup?',
        options: [
          'Multi-hour architectural debugging requiring deep multi-step reasoning',
          'Classifying incoming email into folders',
          'Summarizing your own meeting notes',
          'First-draft generation for docs you will rewrite anyway',
        ],
        answer: 0,
        explain:
          'Deep reasoning, quality over very long contexts, and reliable tool use are the places local models still clearly trail. The other three options are classic local wins: private, high-volume, and forgiving of a rough draft.',
      },
      {
        q: 'What is the strongest structural argument FOR local inference?',
        options: [
          'Local models now beat frontier models on most benchmarks',
          'Local inference eliminates the need for prompt engineering',
          'Private data never leaves your machine, it works offline, and each extra token costs you electricity',
          'Apple subsidizes local inference through unified memory pricing',
        ],
        answer: 2,
        explain:
          "Privacy, offline capability, low latency, and near-zero marginal cost hold no matter what the benchmarks say this quarter. They're structural advantages: they come from where the computation physically happens, so no API can match them at any intelligence level.",
      },
      {
        q: 'A YouTube thumbnail says a $599 Mac mini "replaces $459/month of AI subscriptions." What is the correct reaction?',
        options: [
          'Correct, since hardware amortizes in six weeks, making subscriptions irrational',
          'Marketing math: it assumes local quality covers every one of your tasks and prices your time at zero. Do your own math on your own workload',
          'Wrong direction, since local inference costs more than APIs once you meter electricity',
          'Only true for the 128GB mini, which costs far more than $599',
        ],
        answer: 1,
        explain:
          "The comparison only works if a small local model genuinely replaces every task you pay subscriptions for, and if cleaning up its mistakes costs you nothing. For most real workloads the honest answer is a hybrid, with each side doing what it's good at.",
      },
    ],
    sections: [
      {
        heading: 'Point Claude Code at Localhost',
        blocks: [
          {
            type: 'text',
            md: "Time to connect the two halves of this course. Claude Code is a **harness**: the loop that reads your files, calls tools, and applies edits is a separate thing from the model doing the thinking. And the harness is portable.\n\nHere's how the plumbing works. Claude Code talks to its model over HTTP, at an address it reads from the `ANTHROPIC_BASE_URL` **environment variable** (a named setting a program picks up when it starts). Meanwhile Ollama, from lesson 2, serves an OpenAI-compatible API on your Mac at localhost:11434, where 'localhost' is the standard name for 'this computer'. Point the first at the second and Claude Code drives your local model: same commands, same edit loop, and zero tokens leaving your machine.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Ollama running, model pulled (lesson 2)
export ANTHROPIC_BASE_URL=http://localhost:11434/v1
export ANTHROPIC_AUTH_TOKEN=ollama          # any non-empty value
export ANTHROPIC_MODEL=qwen3:30b-a3b        # your local model tag

claude
# same UI and tools; inference never leaves your Mac.
# unset ANTHROPIC_BASE_URL to snap back to the frontier.`,
            caption: 'One environment variable swaps the brain; the harness stays.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Expect friction',
            md: "Local models are noticeably worse at the agent parts of the job: they fumble the exact format tool calls require, and they lose the plot in long transcripts or declare victory too early. Expect some flailing. The lab asks you to hunt for these seams on purpose, because knowing exactly where local breaks is what makes your routing policy real instead of theoretical.",
          },
        ],
      },
      {
        heading: 'The Hybrid Doctrine: 80/20',
        blocks: [
          {
            type: 'text',
            md: "The mature mid-2026 setup runs both kinds of model side by side and routes each task to the cheapest one that can handle it. Local models absorb the high-volume routine work. One frontier subscription covers the tasks where reasoning depth is what you're paying for.\n\nThe skill here is writing the routing rule down. Deciding per-prompt sounds flexible, but in practice you drift toward one of two bad defaults: everything goes to frontier (expensive, and your private data tags along out of habit), or everything goes to local (and you quietly eat quality losses on the hard tasks). A written policy with an escalation trigger removes the per-prompt decision entirely.\n\nOne acronym in the diagram below: **RAG** (retrieval-augmented generation) is the pattern where the model searches your documents first and writes its answer from what it found. Running RAG locally means your notes get searched without ever being uploaded anywhere.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="360" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The hybrid split: route every task by its class</text>
  <rect x="270" y="50" width="160" height="50" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/>
  <text x="350" y="72" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Your routing policy</text>
  <text x="350" y="90" fill="#a1a1aa" font-size="11" text-anchor="middle">written down, reused daily</text>
  <line x1="300" y1="100" x2="185" y2="140" stroke="#34d399" stroke-width="2"/>
  <polygon points="185,140 197,136 191,146" fill="#34d399"/>
  <line x1="400" y1="100" x2="515" y2="140" stroke="#38bdf8" stroke-width="2"/>
  <polygon points="515,140 503,136 509,146" fill="#38bdf8"/>
  <rect x="40" y="145" width="290" height="150" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="185" y="172" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">LOCAL: ~80% of volume</text>
  <text x="60" y="198" fill="#e4e4e7" font-size="12">- drafts and rewrites</text>
  <text x="60" y="218" fill="#e4e4e7" font-size="12">- RAG over private notes</text>
  <text x="60" y="238" fill="#e4e4e7" font-size="12">- classification / extraction</text>
  <text x="60" y="258" fill="#e4e4e7" font-size="12">- agent loops on private data</text>
  <text x="60" y="282" fill="#a1a1aa" font-size="11">marginal cost: electricity</text>
  <rect x="370" y="145" width="290" height="150" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="515" y="172" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">FRONTIER: the critical 20%</text>
  <text x="390" y="198" fill="#e4e4e7" font-size="12">- deep multi-step reasoning</text>
  <text x="390" y="218" fill="#e4e4e7" font-size="12">- hard debugging / architecture</text>
  <text x="390" y="238" fill="#e4e4e7" font-size="12">- long-context synthesis</text>
  <text x="390" y="258" fill="#e4e4e7" font-size="12">- reliable multi-tool agent runs</text>
  <text x="390" y="282" fill="#a1a1aa" font-size="11">cost: one subscription</text>
  <line x1="330" y1="320" x2="370" y2="320" stroke="#f472b6" stroke-width="2"/>
  <polygon points="370,320 358,315 358,325" fill="#f472b6"/>
  <text x="350" y="345" fill="#f472b6" font-size="12" text-anchor="middle" font-weight="bold">escalation rule: two failed local attempts = route to frontier</text>
</svg>`,
            caption: 'Write the policy once and stop making a model decision on every prompt.',
          },
        ],
      },
      {
        heading: 'When Local Wins, When It Loses',
        blocks: [
          {
            type: 'text',
            md: "The scorecard below is worth reading with one pattern in mind. Everything in the left column is structural: it comes from where the computation physically happens, so it stays true no matter how smart the frontier gets. Everything in the right column is a quality gap, and quality gaps shrink a little with every model release. Structure is durable; gaps close.",
          },
          {
            type: 'compare',
            left: {
              title: 'Local wins',
              items: [
                'Privacy: data never leaves the machine',
                'Offline: planes, outages, air-gapped work',
                'Cost per token is effectively electricity',
                'Latency: no network round-trip before the first word',
                'Unlimited volume: no rate limits or usage anxiety',
              ],
            },
            right: {
              title: 'Local loses',
              items: [
                'Deep multi-step reasoning still trails frontier',
                'Quality degrades on genuinely long contexts',
                'Tool-use reliability: malformed calls, loops, bad stops',
                'You are the ops team: updates, disk, thermal budget',
                'Vision and multimodal options thinner than frontier',
              ],
            },
          },
          {
            type: 'text',
            md: "One more effect deserves its own arithmetic, because it decides where the local/frontier line sits: agent loops multiply weaknesses. Say a model gets each individual step right 90% of the time, and a coding task takes 20 chained steps where each one builds on the last. The chance the whole run succeeds is 0.9 multiplied by itself 20 times, which comes out near 12%. A frontier model at 99% per step finishes the same task about 82% of the time. Per-step, the models look close. Per-task, one of them fails almost nine runs out of ten.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Why long agent runs punish weaker models</text>
  <text x="350" y="50" fill="#a1a1aa" font-size="12" text-anchor="middle">Chance the WHOLE task succeeds when every step must go right</text>
  <line x1="70" y1="270" x2="640" y2="270" stroke="#52525b" stroke-width="1"/>
  <rect x="96" y="108" width="40" height="162" fill="#f472b6" rx="3"/>
  <text x="116" y="100" fill="#f472b6" font-size="11" text-anchor="middle">90%</text>
  <rect x="144" y="92" width="40" height="178" fill="#38bdf8" rx="3"/>
  <text x="164" y="84" fill="#38bdf8" font-size="11" text-anchor="middle">99%</text>
  <rect x="236" y="164" width="40" height="106" fill="#f472b6" rx="3"/>
  <text x="256" y="156" fill="#f472b6" font-size="11" text-anchor="middle">59%</text>
  <rect x="284" y="99" width="40" height="171" fill="#38bdf8" rx="3"/>
  <text x="304" y="91" fill="#38bdf8" font-size="11" text-anchor="middle">95%</text>
  <rect x="376" y="207" width="40" height="63" fill="#f472b6" rx="3"/>
  <text x="396" y="199" fill="#f472b6" font-size="11" text-anchor="middle">35%</text>
  <rect x="424" y="108" width="40" height="162" fill="#38bdf8" rx="3"/>
  <text x="444" y="100" fill="#38bdf8" font-size="11" text-anchor="middle">90%</text>
  <rect x="516" y="248" width="40" height="22" fill="#f472b6" rx="3"/>
  <text x="536" y="240" fill="#f472b6" font-size="11" text-anchor="middle">12%</text>
  <rect x="564" y="122" width="40" height="148" fill="#38bdf8" rx="3"/>
  <text x="584" y="114" fill="#38bdf8" font-size="11" text-anchor="middle">82%</text>
  <text x="140" y="290" fill="#a1a1aa" font-size="12" text-anchor="middle">1 step</text>
  <text x="280" y="290" fill="#a1a1aa" font-size="12" text-anchor="middle">5 steps</text>
  <text x="420" y="290" fill="#a1a1aa" font-size="12" text-anchor="middle">10 steps</text>
  <text x="560" y="290" fill="#a1a1aa" font-size="12" text-anchor="middle">20 steps</text>
  <rect x="170" y="310" width="14" height="14" fill="#f472b6" rx="2"/>
  <text x="192" y="322" fill="#e4e4e7" font-size="12">local: 90% per step</text>
  <rect x="390" y="310" width="14" height="14" fill="#38bdf8" rx="2"/>
  <text x="412" y="322" fill="#e4e4e7" font-size="12">frontier: 99% per step</text>
</svg>`,
            caption: 'Success rates compound per step. A small per-step gap becomes a huge per-task gap by step 20.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'What the compounding means for routing',
            md: "This one piece of arithmetic explains the whole routing table. Local models shine on single-shot work and short loops, where the compounding never gets going. Long agentic runs belong on frontier until the per-step gap closes.",
          },
        ],
      },
      {
        heading: 'The Mac-Mini Agent Server (and Honest Math)',
        blocks: [
          {
            type: 'text',
            md: "The 2026 trend piece writes itself: a Mac mini in a closet, running personal AI agents around the clock. Overnight email triage, indexing your notes for RAG, scheduled classification jobs over data you'd never send to an API. That pattern is real and worth copying. The sales pitch bolted onto it ('cancel all your subscriptions') deserves a calculator instead of applause, so here's the claim-by-claim reality check.",
          },
          {
            type: 'table',
            headers: ['Claim', 'Reality check'],
            rows: [
              ['A $599 mini replaces $459/mo of subscriptions', 'Only if local quality covers 100% of those tasks. In practice it covers the routine 80%.'],
              ['Cost per token is basically free', 'True at the margin. But a $599 mini runs 8B-class models; the 235B tier lives on a $5,000+ machine.'],
              ['24/7 agents beat on-demand APIs', 'For scheduled private-data jobs, yes. For deep reasoning, an idle mini is a very quiet space heater.'],
              ['So do the math', 'YOUR tasks, YOUR failure rate, YOUR hourly value spent cleaning up local-model mistakes. Then decide.'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The boring right answer',
            md: 'For most senior devs in 2026 the boring answer wins: keep one frontier subscription, run a size-appropriate local model for private and bulk work, and write the escalation rule down. Total cost: a subscription plus electricity. Total anxiety: low.',
          },
        ],
      },
    ],
    lab: {
      title: 'Local Claude Code + Your Hybrid Policy',
      intro: 'Run a real coding task through Claude Code backed by your local model, catalogue exactly where it strains, then write down your personal local-versus-frontier routing policy.',
      steps: [
        'Verify Ollama is serving and your model responds: `curl http://localhost:11434`, then `ollama run qwen3:30b-a3b "say ok"`.',
        'In a scratch repo, set the override and launch: `export ANTHROPIC_BASE_URL=http://localhost:11434/v1 ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_MODEL=qwen3:30b-a3b` then `claude`.',
        'Give it a real, small task: add a utility function plus a unit test to an existing file. Watch the whole loop as it runs; the process tells you more than the final diff.',
        'Log every seam you see in `local-agent-notes.md`: malformed tool calls, ignored instructions, premature "done" declarations, lost context.',
        'Open a fresh terminal WITHOUT the overrides and run the identical task on frontier Claude Code. Note the differences honestly, including anywhere local held its own.',
        'Write `hybrid-policy.md`: at least 3 routing rules (task class goes to local or frontier) plus one escalation trigger (for example, two failed local attempts).',
        'Do your own cost math in the same file: your actual subscription spend versus what your Mac can genuinely absorb, with your time priced in.',
      ],
      checklist: [
        'Claude Code completed at least one full task turn against the local endpoint',
        'I documented at least one concrete local breakdown (or verified there was none for this task)',
        'I ran the identical task on frontier Claude Code and captured a side-by-side comparison',
        'hybrid-policy.md exists with 3+ routing rules and an explicit escalation trigger',
        "My cost math uses my real numbers rather than a YouTube thumbnail's",
      ],
    },
    checkQuiz: [
      {
        q: 'Where do local models most visibly break down inside an agent harness like Claude Code?',
        options: [
          'They cannot read files larger than 4KB',
          'Tool-call reliability: malformed call formats, wrong stop decisions, and degraded instruction-following over long transcripts',
          'They refuse to write code due to safety tuning',
          'The Ollama endpoint cannot stream, so the harness times out',
        ],
        answer: 1,
        explain:
          'The agent skills (emitting tool calls in exactly the right format, deciding when a task is done, staying coherent across a long loop) are where local models trail frontier tuning the most. The file-size, refusal, and streaming claims in the other options are made up.',
      },
      {
        q: 'Why did the Mac mini specifically become the 2026 personal-agent-server of choice?',
        options: [
          'It is the only Mac that can run headless without a display',
          'Apple ships it with Ollama preinstalled',
          'Cheap, silent, low-power, always on, and its unified memory runs real models: the right shape for 24/7 loops over private data',
          'macOS Server edition offers agent scheduling the laptops lack',
        ],
        answer: 2,
        explain:
          'A mini idles at a few watts, runs around the clock without fan noise, and its unified memory holds genuinely useful models. That combination is exactly what a scheduled private-data agent needs, and none of the other claims are true.',
      },
      {
        q: 'What must a useful personal hybrid policy actually specify?',
        options: [
          'A single default model to use for everything, reviewed annually',
          'A hard monthly token budget after which all work stops',
          'The list of models you refuse to use for licensing reasons',
          'Task classes routed to local versus frontier, plus an explicit escalation trigger for when local output fails',
        ],
        answer: 3,
        explain:
          'A policy is a routing table plus an escalation rule. Without the trigger you drift into one of two failure modes: wasting frontier capacity on routine work, or burning hours babysitting local failures that should have been escalated after the second attempt.',
      },
      {
        q: 'After the base-URL override, your session works but the model loops re-reading the same file and never edits. Best first response per the hybrid doctrine?',
        options: [
          'Recognize a local tool-use reliability ceiling: escalate this task to frontier and log the task class in your policy',
          'Increase the context window in Ollama until the loop resolves',
          'Switch to a lower quantization level so the model responds faster',
          'File a Claude Code bug, since the harness must be mishandling the endpoint',
        ],
        answer: 0,
        explain:
          'Looping without progress is the classic local agent failure. The doctrine says escalate now, and write the task class into your policy so the router sends that kind of work straight to frontier next time.',
      },
    ],
    resources: [
      { label: 'Ollama OpenAI compatibility docs', url: 'https://github.com/ollama/ollama/blob/main/docs/openai.md', kind: 'docs' },
      { label: 'Ollama blog: OpenAI compatibility', url: 'https://ollama.com/blog/openai-compatibility', kind: 'article' },
      { label: 'Claude Code docs (settings & env)', url: 'https://code.claude.com/docs', kind: 'docs' },
      { label: 'Qwen3 on the Ollama library', url: 'https://ollama.com/library/qwen3', kind: 'docs' },
      { label: 'Ollama blog: the MLX backend', url: 'https://ollama.com/blog/mlx', kind: 'article' },
    ],
  },
]
