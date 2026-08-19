import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────
  // m4-l1 — The Open-Model Landscape 2026
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l1',
    title: 'The Open-Model Landscape 2026',
    day: 17,
    minutes: 40,
    xp: 100,
    objectives: [
      'Name the leading open-weight models of mid-2026 and what each is best at',
      'Compute whether a model fits a given Mac from params, quant level, and KV-cache overhead',
      'Explain why a 235B MoE needs ~132GB of RAM but computes like a 22B',
      'Identify which 2024-25 local-model advice is now obsolete and why',
    ],
    skipQuiz: [
      {
        q: 'Qwen 3 235B-A22B is a mixture-of-experts model with 22B active parameters. What determines its RAM footprint?',
        options: [
          'Only the 22B active parameters — the rest stream from disk on demand',
          'All 235B parameters — every expert must be resident in memory (~132GB at Q4)',
          'The KV cache size, which dominates for MoE architectures',
          'Roughly half the total: MoE routers page out inactive experts automatically',
        ],
        answer: 1,
        explain:
          'The router picks different experts per token, so ALL experts must sit in RAM. You pay 235B in memory but only ~22B in per-token compute.',
      },
      {
        q: 'Why is GGUF Q4_K_M the default quantization recommendation rather than Q2 or Q3?',
        options: [
          'Q4_K_M is the only quant level llama.cpp supports on Metal',
          'Lower quants are faster to download but cannot run on Apple Silicon',
          'Quality degrades gracefully down to ~4-bit, then falls off a cliff below Q4',
          'Q4_K_M files are smaller than Q2 because of superior entropy coding',
        ],
        answer: 2,
        explain:
          'Q4_K_M keeps quality close to fp16 for most models. Below 4-bit, degradation stops being gradual — outputs get noticeably dumber fast.',
      },
      {
        q: 'Rough RAM estimate for running a 30B model at Q4 with a working context?',
        options: [
          'About 8GB — Q4 means a quarter of the parameter count in GB',
          'About 30GB — one GB per billion parameters is the rule of thumb',
          'About 60GB — quantization doubles the effective footprint',
          'About 18-21GB — params x 0.5-0.6 GB/B, plus 10-30% for KV cache',
        ],
        answer: 3,
        explain:
          'Q4 weights run ~0.5-0.6 GB per billion params (30B -> ~16-18GB), and the KV cache adds 10-30% depending on context length. Fits a 32GB Mac.',
      },
      {
        q: 'Which license pairing is correct for the mid-2026 open leaders?',
        options: [
          'Qwen 3 is Apache 2.0; the DeepSeek R1 line is MIT',
          'Qwen 3 is MIT; DeepSeek R1 is research-only non-commercial',
          'Both Qwen 3 and DeepSeek R1 use the restrictive Llama Community License',
          'Qwen 3 is GPL-3; DeepSeek R1 is Apache 2.0',
        ],
        answer: 0,
        explain:
          'Qwen 3 ships Apache 2.0 and DeepSeek R1 ships MIT — both genuinely permissive, which also matters later for distillation (open teachers avoid closed-model ToS).',
      },
      {
        q: 'Which piece of 2024-25 advice is now obsolete in mid-2026?',
        options: [
          'Quantize to roughly 4-bit for the best size/quality trade-off',
          'Leave RAM headroom for the OS when sizing a local model',
          'Reach for Llama by default — it is the reference open model',
          'Prefer permissive licenses when you plan to ship derivatives',
        ],
        answer: 2,
        explain:
          'Qwen, DeepSeek, GLM, and gpt-oss lead most open leaderboards now. "Llama is the default" is the tell of a stale guide.',
      },
    ],
    sections: [
      {
        heading: "Who's Who in Open Weights",
        blocks: [
          {
            type: 'text',
            md: "You skipped a hype cycle; here is the mid-2026 map. Open weights stopped being a consolation prize — the top open models sit a few months behind the frontier, and for most non-frontier tasks that gap doesn't matter. The names to know: Qwen, DeepSeek, GLM, Gemma, gpt-oss, Devstral, Phi.",
          },
          {
            type: 'table',
            headers: ['Model', 'Size (active)', 'License', 'Why it matters', 'Min Mac RAM @ Q4'],
            rows: [
              ['Qwen 3 235B-A22B', '235B (22B active)', 'Apache 2.0', 'The open flagship; frontier-adjacent quality', '128GB+ (~132GB)'],
              ['DeepSeek R1 line', '671B (37B active) + distills', 'MIT', 'Reasoning benchmark king; distills run tiny', '16GB (distills)'],
              ['GLM-4.7', 'Large MoE', 'Open weights', 'Agentic coding standout', '128-192GB'],
              ['Gemma 3 27B', '27B dense', 'Gemma terms', 'Multimodal (vision) on a 32GB Mac', '32GB'],
              ['Qwen3 30B-A3B', '30B (3B active)', 'Apache 2.0', 'The sweet spot: fast decode, real quality', '32GB'],
              ['gpt-oss 120B / 20B', 'MoE (5.1B / 3.6B active)', 'Apache 2.0', "OpenAI's open weights; strong reasoning", '64GB / 16GB'],
              ['Devstral', '24B dense', 'Apache 2.0', 'Purpose-built local coding agent', '32GB'],
              ['Phi-4', '14B dense', 'MIT', 'Edge/small-footprint workhorse', '16GB (tight)'],
            ],
          },
        ],
      },
      {
        heading: 'MoE Math: Why 235B Runs Like 22B',
        blocks: [
          {
            type: 'text',
            md: 'Mixture-of-experts is the architecture that made big open models Mac-viable. The feed-forward layers split into many experts; a router activates only a few per token. Compute scales with the **active** parameters. Memory does not: the router picks different experts every token, so **all** of them must be resident.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">MoE: RAM pays for ALL experts, compute pays for ACTIVE ones</text>
  <rect x="30" y="55" width="420" height="200" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="240" y="80" fill="#a1a1aa" font-size="13" text-anchor="middle">Unified memory: every expert resident (~132 GB @ Q4)</text>
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
  <text x="350" y="300" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">Qwen 3 235B-A22B: 132 GB of RAM, but decodes like a 22B model</text>
  <text x="350" y="322" fill="#a1a1aa" font-size="12" text-anchor="middle">Qwen3 30B-A3B: 30B in RAM (~19 GB), 3B compute — why it flies on a 32GB Mac</text>
</svg>`,
            caption: 'The MoE bargain: memory = total params, speed = active params.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The one number that matters',
            md: 'Read MoE names as **total/active**: 235B-A22B = 235B in RAM, 22B in compute. 30B-A3B = ~19GB resident, 3B-speed decode. This is why unified-memory Macs punch above their FLOPS — the game is memory capacity, not raw GPU.',
          },
        ],
      },
      {
        heading: 'Quantization and the RAM Budget',
        blocks: [
          {
            type: 'text',
            md: 'Weights ship in 16-bit but you run them compressed. On the GGUF side, **Q4_K_M** is the default: ~4.5 bits/weight with quality nearly indistinguishable from fp16 for most models. The back-of-napkin formula:\n\n- RAM = params x 0.5-0.6 GB per billion (at Q4)\n- Plus 10-30% for KV cache (grows with context length)\n- Plus 8-12GB for macOS and your apps',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The quality cliff',
            md: "Don't shop below Q4 to squeeze a bigger model in. Q3 and Q2 quants exist and load fine — then hallucinate, lose instruction-following, and mangle code. A smaller model at Q4-Q8 beats a bigger one at Q2 almost every time.",
          },
        ],
      },
      {
        heading: 'Mac Unified-Memory Tiers',
        blocks: [
          {
            type: 'text',
            md: 'Apple Silicon shares one memory pool between CPU and GPU, so your RAM spec IS your model ceiling. Here is what genuinely runs per tier at Q4 — not what technically loads and then swaps itself to death.',
          },
          {
            type: 'table',
            headers: ['Mac RAM', 'What genuinely runs @ Q4', 'Examples'],
            rows: [
              ['16GB', '7-8B dense, small MoE', 'DeepSeek R1 distill 8B; Phi-4 is tight'],
              ['32GB', '14-30B dense, 30B-class MoE', 'Qwen3 30B-A3B, Gemma 3 27B, Devstral'],
              ['64GB', '70B dense or gpt-oss 120B', 'gpt-oss 120B (5.1B active) runs surprisingly fast'],
              ['128-192GB', '235B-class MoE', 'Qwen 3 235B-A22B (~132GB), GLM-4.7'],
            ],
          },
        ],
      },
      {
        heading: 'What Went Stale (and How Fast)',
        blocks: [
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
                'Qwen, DeepSeek, GLM, gpt-oss lead most boards',
                'MLX is native on Apple Silicon and often faster',
                'MoE gives 70B-class quality at 3-22B compute',
                'Model half-life is ~6 months — re-check quarterly',
                'All superseded; treat old guides as history',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Half-life discipline',
            md: 'Any local-model recommendation — including this lesson — decays in about six months. Put a quarterly reminder on the calendar: 20 minutes on [lmarena.ai](https://lmarena.ai) and the Ollama library, re-shortlist, move on.',
          },
        ],
      },
    ],
    lab: {
      title: 'Size YOUR Mac',
      intro: 'Turn the theory into a concrete shortlist: find your RAM tier, do the arithmetic, and pick three models that genuinely fit your machine with headroom.',
      steps: [
        'Find your RAM: run `system_profiler SPHardwareDataType | grep Memory` (or Apple menu > About This Mac).',
        'Compute your usable budget: total RAM minus 8-12GB for macOS and your normal apps.',
        'Pick 3 candidate models from the who-is-who table for your tier and estimate each: params x 0.55 GB/B, plus 20% KV cache. Write the numbers down.',
        'Cross-check reality: open [ollama.com/library](https://ollama.com/library) and confirm the actual Q4 download size for each candidate.',
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
          'Qwen 3 235B-A22B — MoE means only the 22B active params need RAM',
          'A 70B dense model, or gpt-oss 120B thanks to its MoE layout',
          'Nothing above 30B — the OS reserves half of unified memory for graphics',
          'Any model, since llama.cpp streams weights from SSD at full speed',
        ],
        answer: 1,
        explain:
          '70B dense at Q4 is ~38-42GB plus KV; gpt-oss 120B fits in the same envelope thanks to its MoE layout and aggressive quantization. 235B-A22B still needs ~132GB resident.',
      },
      {
        q: 'Why does the KV cache add a variable 10-30% on top of weight RAM?',
        options: [
          'It grows with context length — attention stores keys/values for every token in the window',
          'It mirrors the model weights at higher precision for numerical stability',
          'It caches disk reads and shrinks as the model warms up',
          'It is a fixed 30% that Apple reserves inside unified memory',
        ],
        answer: 0,
        explain:
          'KV cache scales with tokens in context. Short chats cost little; a long agent transcript at 32k+ tokens can eat many extra GB.',
      },
      {
        q: 'What makes Gemma 3 27B distinctive in the mid-2026 lineup?',
        options: [
          'It is the only MIT-licensed model that fits a 16GB Mac',
          'It is a MoE with 3B active parameters, giving the fastest decode',
          'It is multimodal — vision input — while still fitting a 32GB Mac',
          'It was distilled from DeepSeek R1 for reasoning tasks',
        ],
        answer: 2,
        explain:
          'Gemma 3 27B is the practical local vision model: dense, multimodal, and sized so a 32GB Mac runs it at Q4.',
      },
      {
        q: 'Given a ~6-month model half-life, what is the right operating posture?',
        options: [
          'Standardize on one model per year to amortize prompt tuning',
          'Only adopt models older than a year, once the dust settles',
          'Ignore leaderboards — benchmark scores never transfer to real work',
          'Re-check leaderboards and your shortlist quarterly; treat model choice as a rolling decision',
        ],
        answer: 3,
        explain:
          'The leaders flipped multiple times in 2025-26 (Llama -> Qwen/DeepSeek -> +GLM/gpt-oss). A quarterly 20-minute review keeps you current without churn.',
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
  // m4-l2 — Running Models on Your Mac
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l2',
    title: 'Running Models on Your Mac',
    day: 17,
    minutes: 45,
    xp: 100,
    objectives: [
      'Choose among Ollama, LM Studio, mlx-lm, and llama.cpp for a given job — and explain why vLLM is not on the list',
      'Install a runtime, pull a model sized to your RAM, and chat with it locally',
      'Measure real tokens/sec and interpret prompt-eval rate vs eval rate',
      'Explain why the MLX backend matters on Apple Silicon',
    ],
    skipQuiz: [
      {
        q: 'What did Ollama 0.19 change for Apple Silicon users?',
        options: [
          'It dropped GGUF support in favor of a proprietary format',
          'It added an MLX backend, delivering up to 93% faster decode on M-series chips',
          'It moved inference to a cloud relay for models above 30B',
          'It added CUDA support so Macs can use external NVIDIA GPUs',
        ],
        answer: 1,
        explain:
          'Ollama 0.19 shipped an MLX backend: same CLI and API, but Apple-native kernels under the hood — up to 93% faster decode.',
      },
      {
        q: 'Which tool does NOT belong in your Mac toolkit?',
        options: [
          'vLLM — it targets batched production serving on Linux/NVIDIA',
          'mlx-lm — it only runs on Intel Macs',
          'llama.cpp — it was abandoned after GGUF v3',
          'LM Studio — it cannot load MLX models',
        ],
        answer: 0,
        explain:
          'vLLM is the production serving engine for Linux + NVIDIA fleets. The other three are alive, Mac-native, and the distractor claims about them are false.',
      },
      {
        q: 'You want the fastest raw inference path on an M-series Mac. Which do you reach for?',
        options: [
          'vLLM with tensor parallelism',
          'Ollama with the legacy GGML backend pinned',
          'mlx-lm — Apple-native MLX kernels, also the local fine-tune path',
          'Rosetta-translated llama.cpp for x86 optimizations',
        ],
        answer: 2,
        explain:
          'mlx-lm runs Apple-designed kernels on unified memory with the least overhead — and mlx_lm.lora is how you fine-tune locally later.',
      },
      {
        q: 'Ollama serves its local API on which default port?',
        options: ['8080', '3000', '5000', '11434'],
        answer: 3,
        explain:
          'http://localhost:11434 — the number to remember, because pointing other tools (including Claude Code) at local models means hitting this endpoint.',
      },
      {
        q: "What is LM Studio's distinguishing position among the four Mac tools?",
        options: [
          'Lowest-level control over quantization and sampler internals',
          'The best GUI, and it runs both GGUF and MLX models',
          'The only tool that exposes an OpenAI-compatible API',
          'A cloud sync service for sharing models between Macs',
        ],
        answer: 1,
        explain:
          'LM Studio is the polished desktop app: browse, download, and compare models visually, in either GGUF or MLX format. (Ollama also serves an API, so the third option is false.)',
      },
    ],
    sections: [
      {
        heading: 'The Four Tools — Plus One That Is Not Yours',
        blocks: [
          {
            type: 'text',
            md: 'Five names dominate local-inference conversations; only four belong on your Mac. Pick by job, not by fashion — and note they stack: Ollama and LM Studio both wrap llama.cpp for GGUF, and both now speak MLX too.',
          },
          {
            type: 'table',
            headers: ['Tool', 'What it is', 'When it wins'],
            rows: [
              ['Ollama', 'CLI + local API server on :11434; 0.19 added an MLX backend (up to 93% faster decode)', 'Your default: best ergonomics, plus an API every other tool can point at'],
              ['LM Studio', 'Desktop GUI; runs GGUF and MLX', 'Visual model browsing, side-by-side comparisons, non-terminal days'],
              ['mlx-lm', "Python package on Apple's MLX framework", 'Fastest raw Apple Silicon path; also the local fine-tuning path'],
              ['llama.cpp', 'The C++ engine the others wrap', 'Portability, embedded targets, fine-grained control over quants and samplers'],
              ['vLLM', 'Batched production inference server', 'Linux + NVIDIA serving at scale — not a Mac tool; know it exists, deploy it elsewhere'],
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
  <text x="210" y="279" fill="#a1a1aa" font-size="11" text-anchor="middle">Apple-native, up to 93% faster decode</text>
  <rect x="370" y="240" width="240" height="50" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="490" y="261" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">llama.cpp / GGML + Metal</text>
  <text x="490" y="279" fill="#a1a1aa" font-size="11" text-anchor="middle">GGUF path, maximum portability</text>
  <line x1="300" y1="215" x2="230" y2="240" stroke="#a78bfa" stroke-width="2"/>
  <line x1="400" y1="215" x2="470" y2="240" stroke="#f472b6" stroke-width="2"/>
  <text x="350" y="312" fill="#34d399" font-size="12" text-anchor="middle" font-weight="bold">Both backends run on the same unified memory + M-series GPU</text>
</svg>`,
            caption: 'One API surface, two backends. Ollama picks MLX or GGML per model.',
          },
        ],
      },
      {
        heading: 'Ollama: Install, Pull, Run',
        blocks: [
          {
            type: 'text',
            md: 'Ollama is docker-for-models: pull by name and tag, run interactively, or hit the API. Sizes below are the sized-to-RAM picks from lesson 1 — 30B-A3B for 32GB+ Macs, Gemma 3 12B if you are on 16GB.',
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
            caption: 'The whole lifecycle in five commands.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Model naming',
            md: 'Ollama tags encode variant and quant: `qwen3:30b-a3b` defaults to Q4_K_M. Append explicit tags like `:30b-a3b-q8_0` when you want higher fidelity and have the RAM.',
          },
        ],
      },
      {
        heading: 'The MLX Path',
        blocks: [
          {
            type: 'text',
            md: "MLX is Apple's ML framework built for unified memory. mlx-lm gives you the least-overhead inference on M-series — and it is the same package you will use for local fine-tuning later (mlx_lm.lora). Models come pre-converted from the mlx-community org on Hugging Face.",
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
            caption: 'mlx_lm.generate reports tok/s by default — free benchmarking.',
          },
        ],
      },
      {
        heading: 'Measuring Tokens/Sec',
        blocks: [
          {
            type: 'text',
            md: 'Two numbers matter and people conflate them:\n\n- **prompt eval rate** — how fast your input is ingested (compute-bound, usually hundreds of tok/s)\n- **eval rate** — decode speed while generating (memory-bandwidth-bound; this is the one you feel)\n\nRule of thumb: 20+ tok/s decode feels conversational; under 10 feels like dial-up.',
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
            type: 'compare',
            left: {
              title: 'GGUF (llama.cpp lineage)',
              items: [
                'Universal format — runs on anything',
                'Q4_K_M default, huge quant menu',
                'Biggest model library, day-one releases',
                'Metal backend: good, not native',
              ],
            },
            right: {
              title: 'MLX (Apple-native)',
              items: [
                'Built for unified memory',
                'Often the fastest decode on M-series',
                'The local fine-tuning path (mlx_lm.lora)',
                'mlx-community mirrors most majors fast',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Pull, Run, Measure, Compare',
      intro: 'Get a real model running on your Mac, put a number on its speed, and calibrate its quality against Claude on an identical prompt.',
      steps: [
        'Install: `brew install ollama` (or download LM Studio from [lmstudio.ai](https://lmstudio.ai) if you prefer a GUI).',
        'Start the server: `ollama serve` in one terminal, then verify with `curl http://localhost:11434` — it should answer that Ollama is running.',
        'Pull your size-appropriate model from lab 1: `ollama pull qwen3:30b-a3b` (32GB+) or `ollama pull gemma3:12b` (16GB).',
        'Chat: `ollama run qwen3:30b-a3b --verbose` and ask it a real question from your current work — not a toy prompt.',
        'Record the numbers: note prompt eval rate and eval rate from the verbose output in your `local-models.md`.',
        'Run the exact same prompt in Claude. Write 3 lines: where local matched, where it fell short, and whether the gap matters for that task class.',
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
          'Run the model with the --verbose flag; it prints prompt eval rate and eval rate',
          'Set OLLAMA_DEBUG=1 and parse the server logs',
          'Speed metrics require the LM Studio GUI',
        ],
        answer: 1,
        explain:
          'ollama run with --verbose appends timing after each reply — the zero-effort way to benchmark on your own hardware.',
      },
      {
        q: 'When would you drop from Ollama down to raw llama.cpp?',
        options: [
          'When you need an OpenAI-compatible HTTP API',
          'When you want automatic model pulls and version management',
          'When you need portability to unusual targets or fine-grained control over quants and samplers',
          'When you want MLX acceleration on Apple Silicon',
        ],
        answer: 2,
        explain:
          'llama.cpp is the layer beneath: embedded builds, exotic platforms, custom quantization, sampler surgery. Ollama already covers the API, pulls, and MLX cases.',
      },
      {
        q: 'Your verbose output shows prompt eval rate 300 tok/s but eval rate 9 tok/s. What is the bottleneck on generation?',
        options: [
          'Memory bandwidth — decode streams the active weights for every token, and this model is near your ceiling',
          'Network latency to the Ollama registry',
          'The prompt was too short to warm the cache',
          'CPU single-core speed — decoding is serial on the CPU',
        ],
        answer: 0,
        explain:
          'Decode is memory-bandwidth-bound: every generated token reads the active weights. A 9 tok/s eval rate says go smaller — or more-MoE.',
      },
      {
        q: 'Why does Qwen3 30B-A3B decode dramatically faster than Gemma 3 27B on the same Mac despite similar RAM footprints?',
        options: [
          'Qwen ships at Q2 by default, halving the memory traffic',
          'Gemma 3 is throttled unless you accept its license terms',
          'Ollama caches Qwen models in a faster memory region',
          'Per-token decode touches only ~3B active params in the MoE versus all 27B in the dense model',
        ],
        answer: 3,
        explain:
          'Both hold ~17-19GB of weights, but the MoE reads a fraction of them per token. Bandwidth-bound decode scales with active params — 3B vs 27B is the whole story.',
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
  // m4-l3 — Local Agents & the Hybrid Split
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l3',
    title: 'Local Agents & the Hybrid Split',
    day: 18,
    minutes: 40,
    xp: 100,
    objectives: [
      'Point Claude Code at a local Ollama endpoint and run a real coding task against it',
      'Route work between local and frontier models using an explicit 80/20 policy',
      'Argue concretely when local wins (privacy, offline, latency, cost) and when it loses',
      'Do honest cost math on the Mac-mini-as-agent-server pitch',
    ],
    skipQuiz: [
      {
        q: 'What does setting ANTHROPIC_BASE_URL=http://localhost:11434/v1 before launching Claude Code accomplish?',
        options: [
          'It enables offline caching of Anthropic API responses on your Mac',
          "It routes Claude Code's API traffic to Ollama's local OpenAI-compatible endpoint — same workflow, local inference",
          'It mirrors your session transcripts to a local audit log',
          'It makes Ollama proxy requests through to Anthropic with local rate limiting',
        ],
        answer: 1,
        explain:
          "Claude Code sends requests to whatever base URL you give it. Point it at Ollama's /v1 endpoint and the harness stays identical while a local model does the thinking.",
      },
      {
        q: 'The hybrid doctrine in one sentence:',
        options: [
          'Run everything locally and rent GPU time for training runs',
          'Use frontier models for everything; local is for hobbyists',
          'Alternate providers weekly to avoid vendor lock-in',
          'Local handles ~80% of volume (drafts, RAG, classification, agent loops on private data); one frontier subscription covers the 20% needing frontier reasoning',
        ],
        answer: 3,
        explain:
          'Most token volume is routine work a good local model handles. Reserve the frontier subscription for tasks where reasoning depth actually pays.',
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
          'Deep reasoning, long-context quality, and reliable tool use are exactly where local models still trail. The other three are classic local wins.',
      },
      {
        q: 'What is the strongest structural argument FOR local inference?',
        options: [
          'Local models now beat frontier models on most benchmarks',
          'Local inference eliminates the need for prompt engineering',
          'Private data never leaves your machine, it works offline, and marginal cost-per-token is electricity',
          'Apple subsidizes local inference through unified memory pricing',
        ],
        answer: 2,
        explain:
          'Privacy, offline capability, latency, and near-zero marginal cost are structural advantages no API can match — independent of benchmark standings.',
      },
      {
        q: 'A YouTube thumbnail says a $599 Mac mini "replaces $459/month of AI subscriptions." What is the correct reaction?',
        options: [
          'Correct — hardware amortizes in six weeks, so subscriptions are irrational',
          'Marketing math — it assumes local quality suffices for all your tasks and prices your time at zero; do your own math on your own workload',
          'Wrong direction — local inference costs more than APIs once you meter electricity',
          'Only true for the 128GB mini, which costs far more than $599',
        ],
        answer: 1,
        explain:
          'The comparison only holds if a small local model genuinely replaces every subscription task. For most real workloads the answer is a hybrid, not a swap.',
      },
    ],
    sections: [
      {
        heading: 'Point Claude Code at Localhost',
        blocks: [
          {
            type: 'text',
            md: 'Here is the trick that makes this module pay off: Claude Code is a harness, and the harness is portable. Ollama exposes an OpenAI-compatible endpoint at /v1; override the base URL and Claude Code drives a local model with the same workflow — same skills, same files, same loop.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Ollama running, model pulled (lesson 2)
export ANTHROPIC_BASE_URL=http://localhost:11434/v1
export ANTHROPIC_AUTH_TOKEN=ollama          # any non-empty value
export ANTHROPIC_MODEL=qwen3:30b-a3b        # your local model tag

claude
# same UI, same tools -- inference never leaves your Mac.
# unset ANTHROPIC_BASE_URL to snap back to the frontier.`,
            caption: 'One env var swaps the brain; the harness stays.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Expect friction',
            md: 'Local models are noticeably worse at the agentic parts: tool-call formatting, knowing when to stop, holding a long transcript. The lab asks you to find these seams deliberately — knowing where local breaks is the whole point.',
          },
        ],
      },
      {
        heading: 'The Hybrid Doctrine: 80/20',
        blocks: [
          {
            type: 'text',
            md: 'The mature mid-2026 setup is not local-versus-cloud; it is a split. Local models absorb the high-volume routine work; one frontier subscription covers the tasks where reasoning depth is the product. The skill is writing down your routing rule instead of deciding per-prompt.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="360" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The hybrid split: route by task class, not by mood</text>
  <rect x="270" y="50" width="160" height="50" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/>
  <text x="350" y="72" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Your routing policy</text>
  <text x="350" y="90" fill="#a1a1aa" font-size="11" text-anchor="middle">written down, not vibes</text>
  <line x1="300" y1="100" x2="185" y2="140" stroke="#34d399" stroke-width="2"/>
  <polygon points="185,140 197,136 191,146" fill="#34d399"/>
  <line x1="400" y1="100" x2="515" y2="140" stroke="#38bdf8" stroke-width="2"/>
  <polygon points="515,140 503,136 509,146" fill="#38bdf8"/>
  <rect x="40" y="145" width="290" height="150" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="185" y="172" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">LOCAL — ~80% of volume</text>
  <text x="60" y="198" fill="#e4e4e7" font-size="12">- drafts and rewrites</text>
  <text x="60" y="218" fill="#e4e4e7" font-size="12">- RAG over private notes</text>
  <text x="60" y="238" fill="#e4e4e7" font-size="12">- classification / extraction</text>
  <text x="60" y="258" fill="#e4e4e7" font-size="12">- agent loops on private data</text>
  <text x="60" y="282" fill="#a1a1aa" font-size="11">marginal cost: electricity</text>
  <rect x="370" y="145" width="290" height="150" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="515" y="172" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">FRONTIER — the critical 20%</text>
  <text x="390" y="198" fill="#e4e4e7" font-size="12">- deep multi-step reasoning</text>
  <text x="390" y="218" fill="#e4e4e7" font-size="12">- hard debugging / architecture</text>
  <text x="390" y="238" fill="#e4e4e7" font-size="12">- long-context synthesis</text>
  <text x="390" y="258" fill="#e4e4e7" font-size="12">- reliable multi-tool agent runs</text>
  <text x="390" y="282" fill="#a1a1aa" font-size="11">cost: one subscription</text>
  <line x1="330" y1="320" x2="370" y2="320" stroke="#f472b6" stroke-width="2"/>
  <polygon points="370,320 358,315 358,325" fill="#f472b6"/>
  <text x="350" y="345" fill="#f472b6" font-size="12" text-anchor="middle" font-weight="bold">escalation rule: two failed local attempts = route to frontier</text>
</svg>`,
            caption: 'Write the policy once; stop making a model decision per prompt.',
          },
        ],
      },
      {
        heading: 'When Local Wins, When It Loses',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Local wins',
              items: [
                'Privacy: data never leaves the machine',
                'Offline: planes, outages, air-gapped work',
                'Cost-per-token is effectively electricity',
                'Latency: no network round-trip to first token',
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
                'Multimodal/vision options thinner than frontier',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The compounding detail',
            md: 'Agent loops multiply model weaknesses: a model 10% worse per step is far worse after 20 chained steps. This is why local excels at single-shot and short-loop tasks while frontier still owns long agentic runs.',
          },
        ],
      },
      {
        heading: 'The Mac-Mini Agent Server (and Honest Math)',
        blocks: [
          {
            type: 'text',
            md: 'The 2026 trend: a Mac mini in a closet running 24/7 personal agents — overnight triage, RAG indexing, scheduled classification over data you would never send to an API. Legitimate pattern. The "cancel all your subscriptions" pitch attached to it is not.',
          },
          {
            type: 'table',
            headers: ['Claim', 'Reality check'],
            rows: [
              ['A $599 mini replaces $459/mo of subscriptions', 'Only if local quality covers 100% of those tasks. It usually covers the routine 80%.'],
              ['Cost-per-token is basically free', 'True marginally — but a $599 mini runs ~8B-class models. The 235B tier is a $5,000+ machine.'],
              ['24/7 agents beat on-demand APIs', 'For scheduled private-data jobs, yes. For deep reasoning, an idle mini is just a space heater.'],
              ['So do the math', 'YOUR tasks, YOUR failure rate, YOUR hourly value cleaning up local-model mistakes. Then decide.'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The boring right answer',
            md: 'For most senior devs in 2026: keep one frontier subscription, run a size-appropriate local model for private and bulk work, and write the escalation rule down. Total cost: subscription plus electricity. Total anxiety: low.',
          },
        ],
      },
    ],
    lab: {
      title: 'Local Claude Code + Your Hybrid Policy',
      intro: 'Run a real coding task through Claude Code backed by your local model, catalogue exactly where it strains, then codify your personal local-vs-frontier routing policy.',
      steps: [
        'Verify Ollama is serving and your model responds: `curl http://localhost:11434`, then `ollama run qwen3:30b-a3b "say ok"`.',
        'In a scratch repo, set the override and launch: `export ANTHROPIC_BASE_URL=http://localhost:11434/v1 ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_MODEL=qwen3:30b-a3b` then `claude`.',
        'Give it a real, small task: add a utility function plus a unit test to an existing file. Watch the loop, not just the diff.',
        'Log every seam in `local-agent-notes.md`: malformed tool calls, ignored instructions, premature "done", lost context.',
        'Open a fresh terminal WITHOUT the overrides and run the identical task on frontier Claude Code. Note the differences honestly — including where local was fine.',
        'Write `hybrid-policy.md`: at least 3 routing rules (task class to local or frontier) plus one escalation trigger (e.g. two failed local attempts).',
        'Do your own cost math in the same file: your actual subscription spend vs what your Mac can genuinely absorb, with your time priced in.',
      ],
      checklist: [
        'Claude Code completed at least one full task turn against the local endpoint',
        'I documented at least one concrete local breakdown (or verified there was none for this task)',
        'I ran the identical task on frontier Claude Code and captured a side-by-side comparison',
        'hybrid-policy.md exists with 3+ routing rules and an explicit escalation trigger',
        "My cost math uses my real numbers, not a YouTube thumbnail's",
      ],
    },
    checkQuiz: [
      {
        q: 'Where do local models most visibly break down inside an agent harness like Claude Code?',
        options: [
          'They cannot read files larger than 4KB',
          'Tool-call reliability: malformed call formats, wrong stop decisions, degraded instruction-following over long transcripts',
          'They refuse to write code due to safety tuning',
          'The Ollama endpoint cannot stream, so the harness times out',
        ],
        answer: 1,
        explain:
          'The agentic skills — emitting well-formed tool calls, knowing when to stop, staying coherent across a long loop — are exactly where local models trail frontier tuning.',
      },
      {
        q: 'Why did the Mac mini specifically become the 2026 personal-agent-server of choice?',
        options: [
          'It is the only Mac that can run headless without a display',
          'Apple ships it with Ollama preinstalled',
          'Cheap, silent, low-power, always-on, with unified memory that runs real models — the right shape for 24/7 loops over private data',
          'macOS Server edition offers agent scheduling the laptops lack',
        ],
        answer: 2,
        explain:
          'A mini idles at a few watts, runs 24/7 without fan noise, and its unified memory runs genuinely useful models — ideal for scheduled private-data agents.',
      },
      {
        q: 'What must a useful personal hybrid policy actually specify?',
        options: [
          'A single default model to use for everything, reviewed annually',
          'A hard monthly token budget after which all work stops',
          'The list of models you refuse to use for licensing reasons',
          'Task classes routed to local vs frontier, plus an explicit escalation trigger for when local output fails',
        ],
        answer: 3,
        explain:
          'A policy is a routing table plus an escalation rule. Without the trigger you either waste frontier capacity on routine work or burn hours babysitting local failures.',
      },
      {
        q: 'After the base-URL override, your session works but the model loops re-reading the same file and never edits. Best first response per the hybrid doctrine?',
        options: [
          'Recognize a local tool-use reliability ceiling: escalate this task to frontier and log the task class in your policy',
          'Increase the context window in Ollama until the loop resolves',
          'Switch to a lower quant so the model responds faster',
          'File a Claude Code bug — the harness must be mishandling the endpoint',
        ],
        answer: 0,
        explain:
          'Loop-without-progress is the classic local agentic failure. The doctrine says escalate now, and record the task class so the router sends it to frontier next time.',
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
