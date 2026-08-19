import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  {
    id: 'm6-l1',
    title: 'LoRA, QLoRA & When to Tune',
    day: 21,
    minutes: 45,
    xp: 100,
    objectives: [
      'Explain how LoRA/QLoRA adapters train ~0.1-1% of params against a frozen (4-bit) base',
      'Price a fine-tune run and name where the real budget actually goes',
      'Run any candidate task through the go/no-go decision table',
      'Design a license-safe distillation pipeline using an open teacher model',
    ],
    skipQuiz: [
      {
        q: 'During a LoRA fine-tune, what actually receives gradient updates?',
        options: [
          'All transformer weights, at a lower learning rate',
          'Only small low-rank matrices injected alongside the frozen base weights',
          'Only the embedding and output layers',
          'A distilled copy of the base model',
        ],
        answer: 1,
        explain:
          'The base stays frozen. The rank-decomposed A/B matrices — roughly 0.1-1% of total params — are all that trains.',
      },
      {
        q: 'What does the Q in QLoRA buy you?',
        options: [
          'Quantized adapters that swap faster at serve time',
          'The base model held in 4-bit NF4, so an 8B tunes in 8-12 GB of memory',
          'Quadratic attention replaced with linear attention',
          'Automatic quality filtering of the training set',
        ],
        answer: 1,
        explain:
          'QLoRA quantizes the frozen base to 4-bit NF4 while training full-precision adapters on top — that is what makes consumer-GPU tuning possible.',
      },
      {
        q: 'Ballpark GPU cost to QLoRA an 8B model on a rented cloud GPU in 2026?',
        options: ['$0.44-0.88', '$40-80', '$400-800', '$4,000+'],
        answer: 0,
        explain:
          'A few hours on a cheap RunPod-class GPU. Even a 70B on a single H100 is only about $10-16. Compute is nearly free.',
      },
      {
        q: 'Which task is the strongest fine-tuning candidate?',
        options: [
          'Keeping the model current on this week’s pricing docs',
          'Enforcing an exact tool-call/JSON output format at high volume',
          'A task you have 40 hand-written examples for',
          'Q&A over a fast-changing internal wiki',
        ],
        answer: 1,
        explain:
          'Consistent style/format at volume is the sweet spot. Fresh knowledge is RAG territory, and 40 examples is far below the ~500 floor.',
      },
      {
        q: 'Why do 2026 distillation pipelines prefer DeepSeek or Qwen as the teacher?',
        options: [
          'They produce strictly higher-quality synthetic data',
          'Their outputs are guaranteed hallucination-free',
          'MIT/Apache licenses avoid ToS restrictions on using outputs to train competing models',
          'They are the only models exposing teacher APIs',
        ],
        answer: 2,
        explain:
          'Closed-model terms restrict using outputs to train competitors. Open-weight teachers with permissive licenses sidestep the whole question.',
      },
    ],
    sections: [
      {
        heading: 'Adapters: Train 1%, Freeze 99%',
        blocks: [
          {
            type: 'text',
            md: 'Full fine-tuning rewrites billions of weights. LoRA does not touch them: the base model is **frozen**, and you inject two tiny low-rank matrices (A projects down, B projects up) next to the big weight matrices. Only A and B train — **~0.1-1% of parameters**. The result is a **20-200 MB adapter file**, not a new model.',
          },
          {
            type: 'diagram',
            caption:
              'LoRA: output = Wx + BAx. W never changes; only the low-rank A/B path trains.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/><text x="30" y="152" fill="#e4e4e7" font-size="18">x</text><line x1="50" y1="146" x2="130" y2="146" stroke="#a1a1aa" stroke-width="2"/><line x1="90" y1="146" x2="90" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="130" y="86" width="230" height="120" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="245" y="135" fill="#e4e4e7" font-size="16" text-anchor="middle">Base weights W</text><text x="245" y="160" fill="#a1a1aa" font-size="13" text-anchor="middle">8B params - FROZEN</text><text x="245" y="182" fill="#fbbf24" font-size="12" text-anchor="middle">QLoRA: stored in 4-bit NF4</text><line x1="90" y1="250" x2="130" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="130" y="225" width="100" height="50" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/><text x="180" y="255" fill="#38bdf8" font-size="14" text-anchor="middle">A (down)</text><line x1="230" y1="250" x2="260" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="260" y="225" width="100" height="50" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="310" y="255" fill="#a78bfa" font-size="14" text-anchor="middle">B (up)</text><line x1="360" y1="146" x2="450" y2="146" stroke="#a1a1aa" stroke-width="2"/><line x1="360" y1="250" x2="470" y2="250" stroke="#a1a1aa" stroke-width="2"/><line x1="470" y1="250" x2="470" y2="166" stroke="#a1a1aa" stroke-width="2"/><circle cx="470" cy="146" r="16" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="470" y="152" fill="#34d399" font-size="16" text-anchor="middle">+</text><line x1="486" y1="146" x2="560" y2="146" stroke="#a1a1aa" stroke-width="2"/><polygon points="560,140 572,146 560,152" fill="#a1a1aa"/><text x="582" y="152" fill="#e4e4e7" font-size="18">h</text><text x="350" y="315" fill="#a1a1aa" font-size="13" text-anchor="middle">Trainable: only A and B (rank 8-64) = 0.1-1% of params, saved as a 20-200 MB adapter</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Adapters are swappable',
            md: 'Because the base never changes, one deployed model can serve **many adapters** — support-tone, extraction-schema, tool-call-format — hot-swapped per request. QLoRA pushes it further: with the base in 4-bit NF4, an **8B tunes on 8-12 GB** and a **70B fits on a single H100** (~3 hours).',
          },
        ],
      },
      {
        heading: 'The Cost Reality',
        blocks: [
          {
            type: 'table',
            headers: ['Run', 'Hardware', 'Wall clock', 'Cost'],
            rows: [
              ['8B QLoRA', 'Rented consumer GPU (RunPod-class)', 'A few hours', '$0.44-0.88'],
              ['70B QLoRA', 'One H100', '~3 hours', '$10-16'],
              ['Dataset curation + evals', 'Your senior people', 'Days to weeks', 'The real cost'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Budget for data, not GPUs',
            md: 'Compute is a rounding error in 2026. The project cost is **curating 500+ quality examples** and **building the eval** that proves the tune beats your best prompt. If nobody on the team owns those two lines, the fine-tune fails regardless of hardware.',
          },
        ],
      },
      {
        heading: 'When to Tune: The Decision Table',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Fine-tune: YES',
              items: [
                'Style / format / persona consistency at volume',
                'Domain classification or extraction',
                'Strict tool-call / JSON output formats',
                'Shrink cost + latency: replace a frontier prompt with a tuned 8B',
                'Edge or on-device deployment',
              ],
            },
            right: {
              title: 'Fine-tune: NO',
              items: [
                'Knowledge injection — that is RAG’s job',
                'Fast-changing data (docs, prices, policies)',
                'Fewer than ~500 quality examples',
                'Anything a better prompt already solves',
                'One-off or low-volume tasks',
              ],
            },
          },
          {
            type: 'text',
            md: 'The killer economic play: a workload burning frontier-model tokens on a *narrow, stable* task. Tune an 8B open model on a few thousand graded examples and serve it at a fraction of the cost with lower latency. That is behavior transfer — never facts transfer. Facts go stale; RAG handles facts.',
          },
        ],
      },
      {
        heading: 'Distillation: The Dominant 2026 Pattern',
        blocks: [
          {
            type: 'text',
            md: 'Most production fine-tunes are now **distillation**: a frontier *teacher* generates (and grades) thousands of examples for your task, then you QLoRA a small open *student* on the winners. You are buying the teacher’s judgment once, at data-generation time, instead of on every request forever.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Read the teacher’s ToS',
            md: 'Closed-model terms typically restrict using outputs to train **competing models**. Open-weight teachers avoid the issue entirely: **DeepSeek (MIT)** and **Qwen (Apache 2.0)** outputs can feed your student with no license anxiety. Pick the teacher for its license as much as its quality.',
          },
        ],
      },
      {
        heading: 'Landscape: Who Hosts This Now',
        blocks: [
          {
            type: 'table',
            headers: ['Provider', 'Status (mid-2026)', 'Pricing signal'],
            rows: [
              ['OpenAI', 'Winding down its fine-tuning API', 'Exit signal for closed-model tuning'],
              ['Together', 'Hosted LoRA fine-tuning', '$0.48-2.90 per M training tokens, by model size'],
              ['Fireworks', 'Tune + serve', 'Serves tuned models at base-model prices'],
              ['DIY (RunPod etc.)', 'Rent a GPU, run it yourself', '8B QLoRA ≈ $0.44-0.88 per run'],
            ],
          },
          {
            type: 'text',
            md: 'Read the tea leaves: the closed labs are stepping back from tuning their own models, while the open-model tooling gets cheaper and better. The durable skill is **tuning open weights you control** — hosted when convenient, local when private.',
          },
        ],
      },
    ],
    lab: {
      title: 'Go/No-Go: Is Fine-Tuning the Right Tool?',
      intro:
        'Before touching a GPU, do what the pros do: kill the project on paper or earn the green light. Pick a real task from your world and run the analysis.',
      steps: [
        'Pick a real candidate task from your work — support triage, commit-message style, a strict extraction schema, an agent’s tool-call format.',
        'Write the target as one sentence describing a **behavior** change (style/format/routing), not a knowledge change. If you can’t, it’s probably RAG.',
        'Run it through the decision table: list every YES row and NO row it hits. Be brutally honest about knowledge injection and data freshness.',
        'Size the dataset: where do 500+ quality examples come from? Who grades them? If distilling, name the teacher model **and its license**.',
        'Price the status quo: estimate the monthly token cost of the current frontier-prompt approach vs serving a tuned 8B (use Together/Fireworks pricing pages).',
        'Write a 5-bullet go/no-go verdict: tool chosen (prompt / RAG / fine-tune), dataset plan, teacher + license, expected savings, and the eval you’d build first.',
      ],
      checklist: [
        'Task is classified as behavior vs knowledge, with one sentence of justification',
        'A realistic path to 500+ examples exists (or a permissive-teacher distillation plan)',
        'Monthly cost of the current approach vs a tuned 8B is estimated with real numbers',
        'Verdict names one tool and the first eval you would build',
      ],
    },
    checkQuiz: [
      {
        q: 'Compute for an 8B QLoRA is under a dollar. Where does the real money go?',
        options: [
          'GPU idle time during checkpointing',
          'Dataset curation and building the evals',
          'Adapter storage and serving overhead',
          'License fees for the base model',
        ],
        answer: 1,
        explain:
          'The expensive inputs are senior-human time: curating quality examples and building an eval that proves the tune earns its keep.',
      },
      {
        q: 'Your team wants the model to "know" internal API docs that change weekly. Right tool?',
        options: [
          'QLoRA on the docs every Friday',
          'A quarterly full fine-tune',
          'RAG over the docs',
          'Paste all docs into every prompt with no caching',
        ],
        answer: 2,
        explain:
          'Fine-tuning bakes in behavior, not fresh facts. Fast-changing knowledge is exactly what retrieval is for.',
      },
      {
        q: 'Adapters weigh 20-200 MB. What does that enable in production?',
        options: [
          'Running inference without the base model',
          'One deployed base serving many hot-swappable task adapters',
          'Training without any GPU at all',
          'Lossless compression of the base weights',
        ],
        answer: 1,
        explain:
          'The base is shared and frozen; per-task or per-tenant adapters swap in cheaply because they are megabytes, not gigabytes.',
      },
      {
        q: 'Which statement matches the hosted fine-tuning landscape in mid-2026?',
        options: [
          'OpenAI is expanding fine-tuning across all its models',
          'Together prices LoRA per million training tokens; Fireworks serves tuned models at base prices; OpenAI is winding down its fine-tuning API',
          'All hosts charge a 2x premium to serve tuned models',
          'Hosted providers only offer full fine-tunes, never LoRA',
        ],
        answer: 1,
        explain:
          'The momentum is with open-model tooling: Together charges $0.48-2.90/M training tokens by size, Fireworks serves tuned models at base-model rates, and OpenAI is exiting.',
      },
    ],
    resources: [
      {
        label: 'LoRA: Low-Rank Adaptation of Large Language Models (paper)',
        url: 'https://arxiv.org/abs/2106.09685',
        kind: 'article',
      },
      {
        label: 'QLoRA: Efficient Finetuning of Quantized LLMs (paper)',
        url: 'https://arxiv.org/abs/2305.14314',
        kind: 'article',
      },
      {
        label: 'Together AI — Fine-tuning docs & pricing',
        url: 'https://docs.together.ai/docs/fine-tuning-overview',
        kind: 'docs',
      },
      {
        label: 'Fireworks AI — Fine-tuning models',
        url: 'https://docs.fireworks.ai/fine-tuning/fine-tuning-models',
        kind: 'docs',
      },
      {
        label: 'Hugging Face PEFT documentation',
        url: 'https://huggingface.co/docs/peft',
        kind: 'docs',
      },
    ],
  },
  {
    id: 'm6-l2',
    title: 'Fine-Tune on Your Mac',
    day: 21,
    minutes: 45,
    xp: 100,
    objectives: [
      'Run a local LoRA fine-tune on Apple Silicon with MLX-LM',
      'Build a JSONL prompt/completion dataset with train/valid splits and a held-out eval',
      'Choose between Unsloth, Axolotl, and PEFT+TRL when a task outgrows the Mac',
      'Judge a tuned model with a baseline-vs-tuned eval loop before shipping it',
    ],
    skipQuiz: [
      {
        q: 'Minimal way to kick off a local LoRA run with MLX-LM?',
        options: [
          'torchrun --nproc_per_node=1 train.py',
          'mlx_lm.lora --model <4bit-model> --train --data ./dataset --iters 1000',
          'ollama create mymodel -f Modelfile',
          'mlx compile --lora dataset/',
        ],
        answer: 1,
        explain:
          'After pip install mlx-lm, the mlx_lm.lora entry point takes a (quantized) model, a data folder, and an iteration count. That is the whole ceremony.',
      },
      {
        q: 'The lesson’s anchor run — Mistral-7B, 5,000 examples, M2 Max 32GB — lands around:',
        options: [
          '~90 minutes at ~7 GB peak memory',
          '~9 hours at 28 GB peak memory',
          '~10 minutes at 2 GB peak memory',
          'It cannot run without a discrete GPU',
        ],
        answer: 0,
        explain:
          'Apple unified memory plus a 4-bit base makes a 7B tune a lunch-break job, leaving plenty of headroom on a 32 GB machine.',
      },
      {
        q: 'What dataset shape does mlx_lm.lora expect in this workflow?',
        options: [
          'A CSV with input/output columns',
          'JSONL prompt/completion pairs, split into train and valid files',
          'A single markdown file of examples',
          'Parquet files of pre-tokenized tensors',
        ],
        answer: 1,
        explain:
          'One JSON object per line with prompt/completion fields, organized as train.jsonl and valid.jsonl in the data folder.',
      },
      {
        q: 'When do you build the eval set?',
        options: [
          'After training, sampled from the tuned model’s best outputs',
          'Before training — and score your best prompt-engineered baseline on it first',
          'Only if validation loss plateaus',
          'Never; validation loss is the eval',
        ],
        answer: 1,
        explain:
          'Without a pre-training baseline score on a held-out eval, you cannot know whether the tune beat the prompt you already had.',
      },
      {
        q: 'You need multi-GPU training with DPO/GRPO driven by a YAML config. Reach for:',
        options: ['Unsloth', 'Axolotl', 'MLX-LM', 'llama.cpp'],
        answer: 1,
        explain:
          'Axolotl is the config-driven workhorse for multi-GPU jobs and preference-optimization methods like DPO and GRPO.',
      },
    ],
    sections: [
      {
        heading: 'One Command on Apple Silicon',
        blocks: [
          {
            type: 'text',
            md: 'No cloud account, no CUDA. Apple’s MLX framework treats your Mac’s unified memory as one big GPU pool, and **MLX-LM** wraps LoRA training in a single CLI. Point it at a 4-bit community model and a data folder, and you are fine-tuning locally.',
          },
          {
            type: 'code',
            lang: 'bash',
            caption: 'The whole local stack: install, train, test.',
            code: `pip install mlx-lm

mlx_lm.lora \\
  --model mlx-community/Mistral-7B-Instruct-v0.3-4bit \\
  --train \\
  --data ./dataset \\
  --iters 1000

# try the adapter
mlx_lm.generate \\
  --model mlx-community/Mistral-7B-Instruct-v0.3-4bit \\
  --adapter-path ./adapters \\
  --prompt "Summarize this incident report in my standup format: ..."`,
          },
          {
            type: 'table',
            headers: ['Anchor run', 'Value'],
            rows: [
              ['Model', 'Mistral-7B (4-bit)'],
              ['Examples', '5,000'],
              ['Machine', 'M2 Max, 32 GB'],
              ['Peak memory', '~7 GB'],
              ['Wall clock', '~90 minutes'],
            ],
          },
        ],
      },
      {
        heading: 'The Dataset Is the Product',
        blocks: [
          {
            type: 'text',
            md: 'The training data is JSONL: one object per line, prompt in, gold completion out. Real inputs from your actual task, outputs you would genuinely ship. Split roughly **90/10 into train.jsonl and valid.jsonl** — MLX-LM reads both from the data folder and reports validation loss as it trains.',
          },
          {
            type: 'code',
            lang: 'json',
            caption: 'dataset/train.jsonl — one example per line.',
            code: `{"prompt": "Convert to standup format: fixed the retry bug in the queue worker, took most of Tuesday", "completion": "Done: queue-worker retry bug (T-1432). Impact: dead-letter backlog cleared. Next: add regression test."}
{"prompt": "Convert to standup format: reviewed two PRs and started the billing migration plan", "completion": "Done: 2 PR reviews. In progress: billing migration plan (draft Thu). Blockers: none."}`,
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Eval set comes FIRST',
            md: 'Before any training, carve out a **held-out eval set** the model never sees, and score your best prompt-engineered baseline on it. That number is the bar. A fine-tune that cannot beat a good prompt on your own eval is a science project, not a ship decision.',
          },
        ],
      },
      {
        heading: 'The Full Local Pipeline',
        blocks: [
          {
            type: 'diagram',
            caption:
              'Eval set built first; the baseline score is the bar the tuned adapter must clear.',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/><rect x="25" y="60" width="140" height="60" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/><text x="95" y="85" fill="#e4e4e7" font-size="13" text-anchor="middle">data.jsonl</text><text x="95" y="103" fill="#a1a1aa" font-size="11" text-anchor="middle">prompt/completion</text><line x1="165" y1="90" x2="200" y2="90" stroke="#a1a1aa" stroke-width="2"/><polygon points="200,84 212,90 200,96" fill="#a1a1aa"/><rect x="215" y="60" width="140" height="60" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="285" y="85" fill="#e4e4e7" font-size="13" text-anchor="middle">split</text><text x="285" y="103" fill="#a1a1aa" font-size="11" text-anchor="middle">train / valid / eval</text><line x1="355" y1="90" x2="390" y2="90" stroke="#a1a1aa" stroke-width="2"/><polygon points="390,84 402,90 390,96" fill="#a1a1aa"/><rect x="405" y="60" width="140" height="60" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="475" y="85" fill="#e4e4e7" font-size="13" text-anchor="middle">mlx_lm.lora</text><text x="475" y="103" fill="#a1a1aa" font-size="11" text-anchor="middle">4-bit base, ~90 min</text><line x1="545" y1="90" x2="580" y2="90" stroke="#a1a1aa" stroke-width="2"/><polygon points="580,84 592,90 580,96" fill="#a1a1aa"/><rect x="595" y="60" width="85" height="60" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/><text x="637" y="85" fill="#e4e4e7" font-size="13" text-anchor="middle">adapters/</text><text x="637" y="103" fill="#a1a1aa" font-size="11" text-anchor="middle">MB-sized</text><rect x="215" y="200" width="140" height="60" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/><text x="285" y="225" fill="#fbbf24" font-size="13" text-anchor="middle">eval set</text><text x="285" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle">built BEFORE training</text><line x1="285" y1="120" x2="285" y2="200" stroke="#a1a1aa" stroke-width="2" stroke-dasharray="5,4"/><rect x="430" y="200" width="220" height="60" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/><text x="540" y="225" fill="#e4e4e7" font-size="13" text-anchor="middle">score: baseline vs tuned</text><text x="540" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle">is the delta worth maintenance?</text><line x1="355" y1="230" x2="418" y2="230" stroke="#a1a1aa" stroke-width="2"/><polygon points="418,224 430,230 418,236" fill="#a1a1aa"/><line x1="637" y1="120" x2="637" y2="188" stroke="#a1a1aa" stroke-width="2"/><polygon points="631,188 637,200 643,188" fill="#a1a1aa"/></svg>`,
          },
        ],
      },
      {
        heading: 'When You Outgrow the Mac',
        blocks: [
          {
            type: 'table',
            headers: ['Tool', 'Sweet spot', 'Why it wins'],
            rows: [
              ['Unsloth', 'Single GPU, budget runs', '2-5x faster training with markedly less VRAM'],
              ['Axolotl', 'Serious/multi-GPU jobs', 'YAML configs, multi-GPU, DPO/GRPO preference tuning'],
              ['HF PEFT + TRL', 'Custom pipelines', 'The layer under everything; maximum control in Python'],
              ['MLX-LM', 'Your Mac', 'Zero cloud, unified memory, one command'],
            ],
          },
          {
            type: 'text',
            md: 'The skills transfer directly: same JSONL discipline, same LoRA hyperparameters, same eval loop. Unsloth and Axolotl are both wrappers over the Hugging Face **PEFT + TRL** stack, so nothing you learn locally is wasted when a job moves to a rented H100.',
          },
        ],
      },
      {
        heading: 'Serve It, Then Judge It',
        blocks: [
          {
            type: 'compare',
            left: {
              title: 'Merge (fuse) the adapter',
              items: [
                'One self-contained artifact',
                'Simplest deployment and quantization story',
                'mlx_lm.fuse or PEFT merge_and_unload',
                'Best when one task owns the model',
              ],
            },
            right: {
              title: 'Hot-swap adapters',
              items: [
                'One shared base, many MB-sized adapters',
                'Per-task or per-tenant behavior on demand',
                'Fireworks-style serving at base-model prices',
                'Best for multi-task or multi-customer fleets',
              ],
            },
          },
          {
            type: 'text',
            md: 'Close the loop like an adult: **baseline prompt score → tuned score → delta**. Then price the delta against maintenance — every base-model bump means retraining, every dataset drift means re-curation. A 2-point win rarely pays that mortgage. A tuned 8B replacing a frontier prompt at 10x volume usually does.',
          },
        ],
      },
    ],
    lab: {
      title: 'Build a Dataset, Then (Optionally) Tune It',
      intro:
        'The durable skill is dataset + eval discipline. Assemble a real JSONL set for a style/format task; the actual training run is an optional victory lap.',
      steps: [
        'Pick a style/format task you actually repeat: raw notes → your standup format, tickets → a strict triage JSON schema, or commit diffs → your changelog voice.',
        'Write **20-50 prompt/completion pairs** as JSONL — real inputs, gold outputs you would ship. Validate every line parses (a 3-line Python loop with json.loads).',
        'Split on disk: dataset/train.jsonl (~80%), dataset/valid.jsonl (~10%), and eval.jsonl (~10%) held out and never trained on.',
        'Score a prompt-engineered baseline: run your best prompt against every eval.jsonl input and grade the outputs (even a manual pass/fail column counts). Record the score.',
        'Optional: pip install mlx-lm and run mlx_lm.lora --model mlx-community/Qwen2.5-1.5B-Instruct-4bit --train --data ./dataset --iters 300 and watch validation loss fall.',
        'Optional: generate with mlx_lm.generate --adapter-path ./adapters against eval.jsonl inputs, grade them the same way, and write your delta-vs-maintenance verdict.',
      ],
      checklist: [
        'At least 20 JSONL pairs exist and every line parses as valid JSON',
        'train/valid/eval split is on disk, with eval.jsonl never touched by training',
        'Baseline prompt score on eval.jsonl recorded before any training',
        'If you trained: validation loss decreased and a sample generation matches the target format',
        'A written verdict: is the delta worth the retraining/maintenance cost?',
      ],
    },
    checkQuiz: [
      {
        q: 'Unsloth’s pitch, in one line?',
        options: [
          'Multi-node orchestration for 70B+ clusters',
          '2-5x faster LoRA training on a single GPU with less VRAM',
          'A Mac-native training stack built on Metal',
          'A managed dataset-labeling service',
        ],
        answer: 1,
        explain:
          'Unsloth optimizes the single-GPU path — kernel-level speedups and memory savings on top of the PEFT/TRL stack.',
      },
      {
        q: 'Two legitimate ways to serve your tuned adapter?',
        options: [
          'Merge it into the base weights, or hot-swap adapters on a shared base',
          'Ship the adapter alone; the base model is not needed at inference',
          'Re-quantize the adapter to 4-bit and stream it per token',
          'Convert to ONNX — adapters cannot be served any other way',
        ],
        answer: 0,
        explain:
          'Fuse for a single self-contained artifact, or keep the base shared and swap MB-sized adapters per task or tenant.',
      },
      {
        q: 'Your tuned model beats the prompt baseline by 1 point on your eval. Ship it?',
        options: [
          'Yes — any positive delta justifies the tune',
          'Only after weighing the delta against retraining and maintenance cost; a small delta often loses',
          'No — deltas under 10 points are statistical noise by definition',
          'Yes, but only if you merge the adapter first',
        ],
        answer: 1,
        explain:
          'Every base-model upgrade and dataset drift means re-tuning. The delta has to pay that recurring bill; a 1-point win usually does not.',
      },
      {
        q: 'Why point mlx_lm.lora at a 4-bit model on a 32 GB Mac?',
        options: [
          '4-bit bases train to strictly higher final quality',
          'MLX refuses to load full-precision weights',
          'The quantized base keeps a 7B run near 7 GB peak, leaving unified-memory headroom for everything else',
          'It makes the resulting adapter file smaller',
        ],
        answer: 2,
        explain:
          'QLoRA-style training holds the frozen base in 4-bit; adapters train in higher precision. Memory, not quality or file size, is the reason.',
      },
    ],
    resources: [
      {
        label: 'MLX-LM (Apple) — GitHub repo',
        url: 'https://github.com/ml-explore/mlx-lm',
        kind: 'repo',
      },
      {
        label: 'MLX-LM LoRA fine-tuning guide',
        url: 'https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md',
        kind: 'docs',
      },
      {
        label: 'Unsloth — fast single-GPU fine-tuning',
        url: 'https://github.com/unslothai/unsloth',
        kind: 'repo',
      },
      {
        label: 'Axolotl — YAML-driven multi-GPU fine-tuning',
        url: 'https://github.com/axolotl-ai-cloud/axolotl',
        kind: 'repo',
      },
      {
        label: 'Hugging Face TRL documentation',
        url: 'https://huggingface.co/docs/trl',
        kind: 'docs',
      },
      {
        label: 'mlx-community 4-bit models on Hugging Face',
        url: 'https://huggingface.co/mlx-community',
        kind: 'docs',
      },
    ],
  },
]
