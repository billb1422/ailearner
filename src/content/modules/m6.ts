import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  {
    id: 'm6-l1',
    title: 'LoRA, QLoRA & When to Tune',
    day: 21,
    minutes: 55,
    xp: 100,
    objectives: [
      `Explain how LoRA and QLoRA fine-tuning work: the big base model stays frozen while you train a tiny add-on called an adapter`,
      `Walk the cost math of a fine-tune run and show why the GPU bill is the cheap part`,
      `Decide whether a task calls for prompting, RAG, or fine-tuning using a go/no-go checklist`,
      `Plan a distillation pipeline that uses an open-license teacher model so the lawyers stay calm`,
    ],
    skipQuiz: [
      {
        q: `During a LoRA fine-tune, which numbers in the model actually change?`,
        options: [
          `All transformer weights, at a lower learning rate`,
          `Only small low-rank matrices injected alongside the frozen base weights`,
          `Only the embedding and output layers`,
          `A distilled copy of the base model`,
        ],
        answer: 1,
        explain: `The billions of weights in the base model are frozen solid. Training only updates the two small add-on matrices (called A and B), which together make up roughly 0.1 to 1% of the total parameters. That tiny trainable slice is the whole point of LoRA.`,
      },
      {
        q: `QLoRA adds a Q (for quantized) to LoRA. What does that buy you?`,
        options: [
          `Quantized adapters that swap faster at serve time`,
          `The base model held in 4-bit NF4, so an 8B tunes in 8-12 GB of memory`,
          `Quadratic attention replaced with linear attention`,
          `Automatic quality filtering of the training set`,
        ],
        answer: 1,
        explain: `Quantizing means storing each weight with fewer bits. QLoRA keeps the frozen base model in a compact 4-bit format called NF4 while the small adapters train at full precision on top. Squeezing the base down that far is what lets a fine-tune fit on a consumer GPU or a laptop.`,
      },
      {
        q: `Ballpark GPU cost to QLoRA an 8B model on a rented cloud GPU in 2026?`,
        options: [`$0.44-0.88`, `$40-80`, `$400-800`, `$4,000+`],
        answer: 0,
        explain: `A small rented GPU costs around 20 to 40 cents per hour, and an 8B QLoRA run takes a couple of hours, so the math lands under a dollar. Even a 70B model on a single H100 (a top-end data-center GPU) runs about $10-16. Compute is the cheap part of the whole project.`,
      },
      {
        q: `Which task is the strongest fine-tuning candidate?`,
        options: [
          `Keeping the model current on this week's pricing docs`,
          `Enforcing an exact tool-call/JSON output format at high volume`,
          `A task you have 40 hand-written examples for`,
          `Q&A over a fast-changing internal wiki`,
        ],
        answer: 1,
        explain: `Fine-tuning shines when you need the same style or output format repeated thousands of times. Fresh or fast-changing knowledge belongs in RAG (retrieval-augmented generation, where the model looks facts up at question time), and 40 examples sits far below the roughly 500 you need for a tune to stick.`,
      },
      {
        q: `Why do 2026 distillation pipelines prefer DeepSeek or Qwen as the teacher?`,
        options: [
          `They produce strictly higher-quality synthetic data`,
          `Their outputs are guaranteed hallucination-free`,
          `MIT/Apache licenses avoid ToS restrictions on using outputs to train competing models`,
          `They are the only models exposing teacher APIs`,
        ],
        answer: 2,
        explain: `The terms of service (ToS) on most closed models say you may not use their outputs to train a competing model. DeepSeek ships under the MIT license and Qwen under Apache 2.0, both permissive open-source licenses, so their outputs can feed your training data without a legal question mark hanging over the project.`,
      },
    ],
    sections: [
      {
        heading: 'Adapters: Train 1%, Freeze 99%',
        blocks: [
          {
            type: 'text',
            md: `**Fine-tuning** means taking a model that already exists and training it a little more on your own examples, so it picks up a specific behavior: your writing style, or your exact output format. The traditional way to do this is called **full fine-tuning**, and it updates every one of the model's billions of weights. That needs serious hardware, and you end up with a whole new multi-gigabyte copy of the model to store and serve.`,
          },
          {
            type: 'text',
            md: `[LoRA](https://arxiv.org/abs/2106.09685) (Low-Rank Adaptation) takes a much cheaper route. The base model gets **frozen**: none of its weights change, ever. Instead, you clip small trainable attachments onto it, like bolting adjustable plates onto a statue instead of re-carving the marble. Each attachment is a pair of tiny matrices (a matrix is just a grid of numbers): matrix **A** squeezes the signal down to a small size, and matrix **B** expands it back up. Together they nudge the frozen model's output toward your examples.`,
          },
          {
            type: 'text',
            md: `Only A and B receive training updates, and they add up to roughly **0.1 to 1% of the model's parameters**. When training finishes, you save just those matrices as an **adapter file of 20-200 MB**. The base model on disk stays untouched. To use your fine-tune later, you load the base plus your little adapter, and the two run together.`,
          },
          {
            type: 'diagram',
            caption:
              'The LoRA math: the output h equals Wx (the frozen base doing its normal work) plus BAx (the small trainable detour). W never changes; only the A and B path learns.',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/><text x="30" y="152" fill="#e4e4e7" font-size="18">x</text><line x1="50" y1="146" x2="130" y2="146" stroke="#a1a1aa" stroke-width="2"/><line x1="90" y1="146" x2="90" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="130" y="86" width="230" height="120" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="245" y="135" fill="#e4e4e7" font-size="16" text-anchor="middle">Base weights W</text><text x="245" y="160" fill="#a1a1aa" font-size="13" text-anchor="middle">8B params - FROZEN</text><text x="245" y="182" fill="#fbbf24" font-size="12" text-anchor="middle">QLoRA: stored in 4-bit NF4</text><line x1="90" y1="250" x2="130" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="130" y="225" width="100" height="50" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/><text x="180" y="255" fill="#38bdf8" font-size="14" text-anchor="middle">A (down)</text><line x1="230" y1="250" x2="260" y2="250" stroke="#a1a1aa" stroke-width="2"/><rect x="260" y="225" width="100" height="50" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="310" y="255" fill="#a78bfa" font-size="14" text-anchor="middle">B (up)</text><line x1="360" y1="146" x2="450" y2="146" stroke="#a1a1aa" stroke-width="2"/><line x1="360" y1="250" x2="470" y2="250" stroke="#a1a1aa" stroke-width="2"/><line x1="470" y1="250" x2="470" y2="166" stroke="#a1a1aa" stroke-width="2"/><circle cx="470" cy="146" r="16" fill="#27272a" stroke="#34d399" stroke-width="2"/><text x="470" y="152" fill="#34d399" font-size="16" text-anchor="middle">+</text><line x1="486" y1="146" x2="560" y2="146" stroke="#a1a1aa" stroke-width="2"/><polygon points="560,140 572,146 560,152" fill="#a1a1aa"/><text x="582" y="152" fill="#e4e4e7" font-size="18">h</text><text x="350" y="315" fill="#a1a1aa" font-size="13" text-anchor="middle">Trainable: only A and B (rank 8-64) = 0.1-1% of params, saved as a 20-200 MB adapter</text></svg>`,
          },
          {
            type: 'text',
            md: `[QLoRA](https://arxiv.org/abs/2305.14314) adds one more trick on top of LoRA: **quantization**, which means storing each weight with fewer bits of precision. The frozen base gets compressed into a 4-bit format called **NF4** (NormalFloat 4, a number format designed for the bell-curve shape that neural-network weights naturally have). That shrinks the base's memory footprint to roughly a quarter of the original. Your adapters still train at full precision on top, so you lose almost no quality: the part doing the learning was never compressed.`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Adapters are swappable',
            md: `Because the base never changes, one deployed model can serve **many adapters** at once: a support-tone adapter for one team and a strict JSON-output adapter for another, swapped in per request. Each adapter is only megabytes, so switching costs almost nothing. QLoRA pushes the memory savings even further: an 8B model tunes in **8-12 GB of memory** and a 70B fits on a **single H100 GPU** in about 3 hours.`,
          },
        ],
      },
      {
        heading: 'The Cost Reality',
        blocks: [
          {
            type: 'text',
            md: `Here's the math that surprises everyone. A small rented cloud GPU (services like [RunPod](https://www.runpod.io) rent them by the hour) costs around **20 to 40 cents per hour**. An 8B QLoRA run finishes in 2-3 hours. Multiply those two numbers and the entire training run costs **$0.44-0.88**, less than a coffee. A 70B model needs a bigger card, a single H100, but even that lands around **$10-16** for its roughly 3-hour run.`,
          },
          {
            type: 'table',
            headers: ['Run', 'Hardware', 'Wall clock', 'Cost'],
            rows: [
              ['8B model, QLoRA', 'Rented consumer-class GPU (RunPod or similar)', '2-3 hours', '$0.44-0.88'],
              ['70B model, QLoRA', 'One H100 data-center GPU', 'About 3 hours', '$10-16'],
              [
                'Curating the dataset + building the evals',
                'Your senior people, by hand',
                'Days to weeks',
                'This is the real cost',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Where the budget actually goes',
            md: `In 2026 the GPU bill is pocket change. The two expensive line items are human work: **curating 500 or more high-quality training examples** and **building the eval** (a scored test set) that proves the tuned model beats your best prompt. Each of those takes days of a senior person's time. If nobody on the team owns those two jobs, the fine-tune fails no matter how cheap the hardware gets.`,
          },
        ],
      },
      {
        heading: 'When to Tune: The Decision',
        blocks: [
          {
            type: 'text',
            md: `The single most useful question to ask: are you trying to change the model's **behavior** (how it writes, formats, or classifies) or its **knowledge** (which facts it knows)? Fine-tuning is great at behavior and terrible at knowledge. Facts baked in by training freeze at training time and go stale the day your docs change. RAG (retrieval-augmented generation, where relevant documents get fetched and pasted into the prompt at question time) keeps facts fresh with zero retraining.`,
          },
          {
            type: 'compare',
            left: {
              title: 'Fine-tune: YES',
              items: [
                'You need one style, format, or persona repeated at high volume',
                'Classifying or extracting data in your specific domain',
                'Forcing strict tool-call or JSON output shapes every single time',
                'Cutting cost and latency by replacing a frontier-model prompt with a tuned 8B',
                'Shipping on a phone, a laptop, or another edge device',
              ],
            },
            right: {
              title: 'Fine-tune: NO',
              items: [
                'Teaching the model new facts (retrieval handles facts better)',
                'Data that changes weekly: docs, prices, policies',
                'You have fewer than about 500 good examples',
                'A better-written prompt already solves it',
                'A one-off task, or volume too low to repay the effort',
              ],
            },
          },
          {
            type: 'diagram',
            caption:
              'The go/no-go flow. Most tasks exit early, toward RAG or a better prompt, and that is the correct outcome.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="400" fill="#18181b" rx="8"/><rect x="25" y="35" width="130" height="46" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="90" y="63" fill="#e4e4e7" font-size="14" text-anchor="middle">Your task</text><line x1="155" y1="58" x2="195" y2="58" stroke="#a1a1aa" stroke-width="2"/><polygon points="195,52 207,58 195,64" fill="#a1a1aa"/><rect x="210" y="30" width="230" height="56" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="325" y="53" fill="#e4e4e7" font-size="13" text-anchor="middle">Does it need new or</text><text x="325" y="71" fill="#e4e4e7" font-size="13" text-anchor="middle">fast-changing FACTS?</text><line x1="440" y1="58" x2="490" y2="58" stroke="#a1a1aa" stroke-width="2"/><polygon points="490,52 502,58 490,64" fill="#a1a1aa"/><text x="463" y="48" fill="#a1a1aa" font-size="12">yes</text><rect x="505" y="35" width="170" height="46" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/><text x="590" y="63" fill="#38bdf8" font-size="14" text-anchor="middle">Use RAG</text><line x1="325" y1="86" x2="325" y2="128" stroke="#a1a1aa" stroke-width="2"/><polygon points="319,128 325,140 331,128" fill="#a1a1aa"/><text x="337" y="112" fill="#a1a1aa" font-size="12">no</text><rect x="210" y="140" width="230" height="56" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="325" y="163" fill="#e4e4e7" font-size="13" text-anchor="middle">Can a better prompt</text><text x="325" y="181" fill="#e4e4e7" font-size="13" text-anchor="middle">already solve it?</text><line x1="440" y1="168" x2="490" y2="168" stroke="#a1a1aa" stroke-width="2"/><polygon points="490,162 502,168 490,174" fill="#a1a1aa"/><text x="463" y="158" fill="#a1a1aa" font-size="12">yes</text><rect x="505" y="145" width="170" height="46" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/><text x="590" y="173" fill="#34d399" font-size="14" text-anchor="middle">Stay with prompting</text><line x1="325" y1="196" x2="325" y2="238" stroke="#a1a1aa" stroke-width="2"/><polygon points="319,238 325,250 331,238" fill="#a1a1aa"/><text x="337" y="222" fill="#a1a1aa" font-size="12">no</text><rect x="210" y="250" width="230" height="56" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="325" y="273" fill="#e4e4e7" font-size="13" text-anchor="middle">500+ good examples, or a</text><text x="325" y="291" fill="#e4e4e7" font-size="13" text-anchor="middle">licensed teacher to make them?</text><line x1="440" y1="278" x2="490" y2="278" stroke="#a1a1aa" stroke-width="2"/><polygon points="490,272 502,278 490,284" fill="#a1a1aa"/><text x="463" y="268" fill="#a1a1aa" font-size="12">no</text><rect x="505" y="250" width="170" height="56" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/><text x="590" y="273" fill="#fbbf24" font-size="13" text-anchor="middle">Collect data first</text><text x="590" y="291" fill="#a1a1aa" font-size="12" text-anchor="middle">(or distill, see below)</text><line x1="325" y1="306" x2="325" y2="338" stroke="#a1a1aa" stroke-width="2"/><polygon points="319,338 325,350 331,338" fill="#a1a1aa"/><text x="337" y="328" fill="#a1a1aa" font-size="12">yes</text><rect x="210" y="350" width="230" height="40" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="325" y="375" fill="#a78bfa" font-size="14" text-anchor="middle">Fine-tune a small open model</text></svg>`,
          },
          {
            type: 'text',
            md: `The classic money-saver looks like this. Say a support-ticket classifier calls a frontier model 50,000 times a month at roughly a cent per call: $500 a month, forever. The task itself never changes. So you have the frontier model generate and grade a few thousand training examples once, tune an 8B open model on the winners, and serve that instead at a tenth of the per-call price with snappier latency. What moved into the small model was the **behavior**. Any facts it needs still arrive through the prompt at request time, where they can stay fresh.`,
          },
        ],
      },
      {
        heading: 'Distillation: The Dominant 2026 Pattern',
        blocks: [
          {
            type: 'text',
            md: `**Distillation** means using a big, smart model (the **teacher**) to train a small, cheap one (the **student**). The teacher generates thousands of example inputs and gold answers for your task, and it often grades its own outputs too, so only the best examples survive into the training set. Then you run an ordinary QLoRA fine-tune of a small open model on that synthetic dataset. Most production fine-tunes in 2026 work exactly this way, because it solves the where-do-500-examples-come-from problem with an API bill instead of weeks of hand labeling.`,
          },
          {
            type: 'text',
            md: `Think of it as buying the teacher's judgment once, at data-generation time, rather than renting it on every single request forever.`,
          },
          {
            type: 'diagram',
            caption:
              'The distillation pipeline: pay the teacher once to create graded training data, then serve the cheap student on every request.',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/><rect x="30" y="80" width="180" height="80" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/><text x="120" y="112" fill="#f472b6" font-size="15" text-anchor="middle">Teacher</text><text x="120" y="134" fill="#a1a1aa" font-size="12" text-anchor="middle">big open model</text><text x="120" y="150" fill="#a1a1aa" font-size="12" text-anchor="middle">(check the license!)</text><line x1="210" y1="120" x2="260" y2="120" stroke="#a1a1aa" stroke-width="2"/><polygon points="260,114 272,120 260,126" fill="#a1a1aa"/><text x="238" y="105" fill="#a1a1aa" font-size="11" text-anchor="middle">generates</text><rect x="275" y="80" width="170" height="80" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/><text x="360" y="112" fill="#fbbf24" font-size="15" text-anchor="middle">Synthetic dataset</text><text x="360" y="134" fill="#a1a1aa" font-size="12" text-anchor="middle">thousands of examples,</text><text x="360" y="150" fill="#a1a1aa" font-size="12" text-anchor="middle">graded, losers discarded</text><line x1="445" y1="120" x2="495" y2="120" stroke="#a1a1aa" stroke-width="2"/><polygon points="495,114 507,120 495,126" fill="#a1a1aa"/><text x="473" y="105" fill="#a1a1aa" font-size="11" text-anchor="middle">QLoRA</text><rect x="510" y="80" width="165" height="80" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="592" y="112" fill="#a78bfa" font-size="15" text-anchor="middle">Student</text><text x="592" y="134" fill="#a1a1aa" font-size="12" text-anchor="middle">small open model</text><text x="592" y="150" fill="#a1a1aa" font-size="12" text-anchor="middle">+ your adapter</text><text x="240" y="215" fill="#38bdf8" font-size="13" text-anchor="middle">paid ONCE, at data-generation time</text><line x1="60" y1="225" x2="420" y2="225" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,4"/><text x="592" y="215" fill="#34d399" font-size="13" text-anchor="middle">serves EVERY request, cheap</text><line x1="515" y1="225" x2="670" y2="225" stroke="#34d399" stroke-width="1" stroke-dasharray="4,4"/></svg>`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: `Read the teacher's terms of service`,
            md: `Most closed models (the big proprietary APIs) include a terms-of-service clause forbidding you from using their outputs to train a competing model. Open-weight teachers make the whole question disappear: **DeepSeek is MIT-licensed** and **Qwen is Apache 2.0**, both permissive licenses that put no strings on the outputs. When you pick a teacher, weigh its license as heavily as its quality.`,
          },
        ],
      },
      {
        heading: 'Who Hosts Fine-Tuning Now',
        blocks: [
          {
            type: 'table',
            headers: ['Provider', 'Status (mid-2026)', 'Pricing signal'],
            rows: [
              [
                'OpenAI',
                'Winding down its fine-tuning API',
                'A signal that tuning closed models is a dead end',
              ],
              [
                'Together AI',
                'Hosted LoRA fine-tuning as a service',
                '$0.48-2.90 per million training tokens, priced by model size',
              ],
              [
                'Fireworks AI',
                'Tunes your model and serves it',
                'Serving a tuned model costs the same as the base model',
              ],
              [
                'DIY (RunPod etc.)',
                'Rent a GPU by the hour, run it yourself',
                'An 8B QLoRA run costs about $0.44-0.88',
              ],
            ],
          },
          {
            type: 'text',
            md: `That table rewards a second read. The closed-model labs are backing away from letting you tune their models, while the tooling around open models gets cheaper and better every quarter. So the durable skill is **tuning open weights you control**: hosted on a service like Together or Fireworks when that's convenient, and on your own hardware when the data can't leave the building.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Go/No-Go: Is Fine-Tuning the Right Tool?',
      intro:
        'Before you touch a GPU, do what experienced teams do: try to kill the project on paper. If your task survives every question below, you have earned a green light. Pick something real from your own work and run it through.',
      steps: [
        'Pick a real candidate task from your work. Good examples: support-ticket triage, rewriting commit messages in your style, extracting fields into a strict schema, or making an agent emit an exact tool-call format.',
        'Write the goal as one sentence describing a **behavior** change (style, format, or routing). If your sentence keeps drifting toward "the model should know X", stop: that is a knowledge change, and knowledge belongs in RAG.',
        'Run the task through the decision lists above and write down every YES and NO it hits. Be brutally honest about the two classic traps: knowledge injection and fast-changing data.',
        'Size the dataset. Where do 500+ quality examples come from? Who grades them? If you plan to distill, name the teacher model **and its license** in writing.',
        'Price the status quo. Estimate the monthly token bill of the current frontier-model approach, then estimate serving a tuned 8B instead (the Together and Fireworks pricing pages have real numbers).',
        'Write a 5-bullet verdict: the tool you chose (prompt, RAG, or fine-tune), the dataset plan, the teacher and its license, the expected monthly savings, and the first eval you would build.',
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
        q: `Compute for an 8B QLoRA is under a dollar. Where does the real money go?`,
        options: [
          `GPU idle time during checkpointing`,
          `Dataset curation and building the evals`,
          `Adapter storage and serving overhead`,
          `License fees for the base model`,
        ],
        answer: 1,
        explain: `The GPU run costs less than a coffee; the humans are the expensive part. Curating hundreds of quality examples and building an eval that proves the tune beats your best prompt each take days of senior-level time.`,
      },
      {
        q: `Your team wants the model to "know" internal API docs that change weekly. Right tool?`,
        options: [
          `QLoRA on the docs every Friday`,
          `A quarterly full fine-tune`,
          `RAG over the docs`,
          `Paste all docs into every prompt with no caching`,
        ],
        answer: 2,
        explain: `Fine-tuning changes how the model behaves, and any facts it absorbs freeze at training time. Retrieval fetches the current version of a doc at question time, which is exactly what weekly-changing content needs.`,
      },
      {
        q: `Adapters weigh 20-200 MB. What does that enable in production?`,
        options: [
          `Running inference without the base model`,
          `One deployed base serving many hot-swappable task adapters`,
          `Training without any GPU at all`,
          `Lossless compression of the base weights`,
        ],
        answer: 1,
        explain: `Because adapters are small files and the base never changes, one shared base can serve many tasks or customers. The server keeps the multi-gigabyte base loaded once and swaps the small per-task adapters in and out as requests arrive.`,
      },
      {
        q: `Which statement matches the state of hosted fine-tuning in mid-2026?`,
        options: [
          `OpenAI is expanding fine-tuning across all its models`,
          `Together prices LoRA per million training tokens; Fireworks serves tuned models at base prices; OpenAI is winding down its fine-tuning API`,
          `All hosts charge a 2x premium to serve tuned models`,
          `Hosted providers dropped LoRA and offer only full fine-tunes`,
        ],
        answer: 1,
        explain: `The momentum sits with open-model tooling. Together charges $0.48-2.90 per million training tokens depending on model size, Fireworks serves your tuned model at the same price as the base model, and OpenAI is exiting the fine-tuning business.`,
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
        label: 'Together AI: fine-tuning docs & pricing',
        url: 'https://docs.together.ai/docs/fine-tuning-overview',
        kind: 'docs',
      },
      {
        label: 'Fireworks AI: fine-tuning models',
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
    minutes: 55,
    xp: 100,
    objectives: [
      `Run a real LoRA fine-tune on Apple Silicon with the MLX-LM tool, start to finish`,
      `Build a training dataset in JSONL format with train, validation, and held-out eval splits`,
      `Know which tool to reach for (Unsloth, Axolotl, or PEFT + TRL) when a job outgrows the Mac`,
      `Judge a tuned model honestly by scoring it against your best prompt on the same eval set`,
    ],
    skipQuiz: [
      {
        q: `Minimal way to kick off a local LoRA run with MLX-LM?`,
        options: [
          `torchrun --nproc_per_node=1 train.py`,
          `mlx_lm.lora --model <4bit-model> --train --data ./dataset --iters 1000`,
          `ollama create mymodel -f Modelfile`,
          `mlx compile --lora dataset/`,
        ],
        answer: 1,
        explain: `After a pip install of mlx-lm, the mlx_lm.lora command is the whole ceremony. You point it at a quantized model, a folder holding your data, and a number of training steps (that's what --iters counts), and it starts training on your Mac.`,
      },
      {
        q: `The lesson's anchor run (Mistral-7B, 5,000 examples, M2 Max 32GB) lands around:`,
        options: [
          `~90 minutes at ~7 GB peak memory`,
          `~9 hours at 28 GB peak memory`,
          `~10 minutes at 2 GB peak memory`,
          `It cannot run without a discrete GPU`,
        ],
        answer: 0,
        explain: `Apple Silicon shares one pool of memory between the CPU and GPU (unified memory), and the 4-bit base model keeps the footprint near 7 GB. On a 32 GB machine that leaves plenty of headroom, and the run finishes in about the length of a long lunch.`,
      },
      {
        q: `What dataset shape does mlx_lm.lora expect in this workflow?`,
        options: [
          `A CSV with input/output columns`,
          `JSONL prompt/completion pairs, split into train and valid files`,
          `A single markdown file of examples`,
          `Parquet files of pre-tokenized tensors`,
        ],
        answer: 1,
        explain: `JSONL means JSON Lines: a plain text file where every line is one small JSON object. Here each line holds a prompt and its ideal completion, and the data folder contains a train.jsonl for learning plus a valid.jsonl for checking progress along the way.`,
      },
      {
        q: `When do you build the eval set?`,
        options: [
          `After training, sampled from the tuned model's best outputs`,
          `Before training, and you score your best prompt-only baseline on it first`,
          `Only if validation loss plateaus`,
          `Never; validation loss is the eval`,
        ],
        answer: 1,
        explain: `The eval set has to exist before training so the model never sees it, and you score your best prompt-engineered baseline on it first. That baseline number is the bar. Without it, you have no way to tell whether the fine-tune actually beat the prompt you already had.`,
      },
      {
        q: `You need multi-GPU training with DPO/GRPO driven by a YAML config. Reach for:`,
        options: [`Unsloth`, `Axolotl`, `MLX-LM`, `llama.cpp`],
        answer: 1,
        explain: `Axolotl is the config-driven workhorse: you describe the whole job in a YAML file, and it handles multiple GPUs plus preference-tuning methods like DPO (Direct Preference Optimization) and GRPO. Unsloth targets single-GPU speed, and MLX-LM stays on the Mac.`,
      },
    ],
    sections: [
      {
        heading: 'One Command on Apple Silicon',
        blocks: [
          {
            type: 'text',
            md: `Cloud GPUs usually mean an account, a rental bill, and NVIDIA's CUDA software stack. Your Mac needs none of that. Apple's **MLX** is a machine-learning framework built for Apple Silicon, and it exploits a nice hardware fact: M-series chips share one pool of **unified memory** between the CPU and GPU, so the GPU side can use most of your RAM. **MLX-LM** sits on top of MLX and wraps LoRA training in a single command line.`,
          },
          {
            type: 'text',
            md: `The workflow: grab a community model that's already quantized to 4-bit (the [mlx-community](https://huggingface.co/mlx-community) page on Hugging Face hosts hundreds of them), point the command at your data folder, and pick a step count. The --iters flag counts training steps, and each step shows the model one small batch of your examples.`,
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
              ['Model', 'Mistral-7B, quantized to 4-bit'],
              ['Training examples', '5,000'],
              ['Machine', 'MacBook with M2 Max chip, 32 GB memory'],
              ['Peak memory used', 'About 7 GB'],
              ['Wall-clock time', 'About 90 minutes'],
            ],
          },
          {
            type: 'text',
            md: `That anchor run is worth memorizing: a real 7-billion-parameter model, five thousand examples, and it finishes over lunch while the laptop stays usable for everything else.`,
          },
        ],
      },
      {
        heading: 'The Dataset Is the Product',
        blocks: [
          {
            type: 'text',
            md: `Training data for this workflow is a [JSONL](https://jsonlines.org) file (short for JSON Lines): plain text, one JSON object per line, each holding a prompt and the completion you wish the model had written. Use real inputs from your actual task and outputs you'd genuinely ship. The model learns to imitate exactly what you show it, so ten sloppy examples teach sloppiness.`,
          },
          {
            type: 'code',
            lang: 'json',
            caption: 'dataset/train.jsonl: one example per line.',
            code: `{"prompt": "Convert to standup format: fixed the retry bug in the queue worker, took most of Tuesday", "completion": "Done: queue-worker retry bug (T-1432). Impact: dead-letter backlog cleared. Next: add regression test."}
{"prompt": "Convert to standup format: reviewed two PRs and started the billing migration plan", "completion": "Done: 2 PR reviews. In progress: billing migration plan (draft Thu). Blockers: none."}`,
          },
          {
            type: 'text',
            md: `Split the data roughly **90/10 into train.jsonl and valid.jsonl** inside your data folder. Training runs on the train file. The validation file gets scored regularly during the run, and MLX-LM reports the result as **validation loss**: a number measuring how surprised the model is by examples it never trained on. Falling validation loss means it's genuinely learning your pattern instead of memorizing the training set.`,
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Eval set comes FIRST',
            md: `Before any training, carve out a third slice: a **held-out eval set** the model never sees at all. Run your best prompt-engineered baseline against it and record the score. That number is the bar the fine-tune has to clear. A tune that can't beat a good prompt on your own eval hasn't earned a place in production.`,
          },
        ],
      },
      {
        heading: 'The Full Local Pipeline',
        blocks: [
          {
            type: 'text',
            md: `Here's the whole loop in one picture. Notice that the eval branch splits off **before** training ever starts, and everything funnels into a single final comparison: the baseline score against the tuned score.`,
          },
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
            type: 'text',
            md: `A 70B model, a preference-tuning method, or a hard deadline can push a job off the laptop and onto rented NVIDIA GPUs. The good news: everything over there wraps the same core stack from Hugging Face. **PEFT** (Parameter-Efficient Fine-Tuning) is the library that implements LoRA and its cousins, and **TRL** (Transformer Reinforcement Learning) supplies the training loops, including **DPO** (Direct Preference Optimization) and **GRPO**, methods that learn from comparisons between better and worse answers instead of single gold completions.`,
          },
          {
            type: 'table',
            headers: ['Tool', 'Sweet spot', 'Why it wins'],
            rows: [
              [
                'Unsloth',
                'One rented GPU, budget runs',
                `Hand-optimized GPU code makes training 2-5x faster with much less VRAM (the GPU's onboard memory)`,
              ],
              [
                'Axolotl',
                'Serious multi-GPU jobs',
                'You describe the whole run in a YAML config file; handles many GPUs plus DPO/GRPO preference tuning',
              ],
              [
                'HF PEFT + TRL',
                'Custom pipelines in Python',
                'The layer everything else wraps; maximum control',
              ],
              ['MLX-LM', 'Your Mac', 'Zero cloud, unified memory, one command'],
            ],
          },
          {
            type: 'text',
            md: `Nothing you learn locally gets thrown away when you move up. The JSONL discipline and the eval-first habit carry straight over, and so do the LoRA settings. Only the hardware and the wrapper change.`,
          },
        ],
      },
      {
        heading: 'Serve It, Then Judge It',
        blocks: [
          {
            type: 'text',
            md: `Training leaves you with a folder of adapter files. Serving them gives you two options, and the right one depends on how many tasks share the model.`,
          },
          {
            type: 'compare',
            left: {
              title: 'Merge (fuse) the adapter',
              items: [
                'The adapter math gets folded into the base weights, producing one self-contained model file',
                'Simplest deployment and quantization story',
                'Done with mlx_lm.fuse, or merge_and_unload in PEFT',
                'Best when one task owns the whole model',
              ],
            },
            right: {
              title: 'Hot-swap adapters',
              items: [
                'One shared frozen base stays loaded; small adapters swap in per request',
                'Per-task or per-tenant behavior on demand',
                'Fireworks-style serving at base-model prices',
                'Best for multi-task or multi-customer fleets',
              ],
            },
          },
          {
            type: 'diagram',
            caption:
              'Two ways to ship an adapter: fuse it into one artifact, or keep one shared base and swap small adapters per request.',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/><text x="175" y="40" fill="#e4e4e7" font-size="15" text-anchor="middle">Option 1: merge (fuse)</text><rect x="55" y="60" width="110" height="55" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="110" y="85" fill="#e4e4e7" font-size="13" text-anchor="middle">base model</text><text x="110" y="102" fill="#a1a1aa" font-size="11" text-anchor="middle">GBs</text><rect x="185" y="60" width="110" height="55" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/><text x="240" y="85" fill="#a78bfa" font-size="13" text-anchor="middle">adapter</text><text x="240" y="102" fill="#a1a1aa" font-size="11" text-anchor="middle">MBs</text><text x="175" y="145" fill="#a1a1aa" font-size="16" text-anchor="middle">+</text><line x1="175" y1="155" x2="175" y2="185" stroke="#a1a1aa" stroke-width="2"/><polygon points="169,185 175,197 181,185" fill="#a1a1aa"/><rect x="80" y="200" width="190" height="60" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/><text x="175" y="225" fill="#34d399" font-size="13" text-anchor="middle">one merged model file</text><text x="175" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle">self-contained, one task</text><line x1="350" y1="30" x2="350" y2="290" stroke="#52525b" stroke-width="1" stroke-dasharray="4,4"/><text x="525" y="40" fill="#e4e4e7" font-size="15" text-anchor="middle">Option 2: hot-swap</text><rect x="400" y="60" width="250" height="70" fill="#27272a" stroke="#52525b" stroke-width="2" rx="8"/><text x="525" y="90" fill="#e4e4e7" font-size="13" text-anchor="middle">shared frozen base</text><text x="525" y="110" fill="#a1a1aa" font-size="11" text-anchor="middle">loaded once, serves everyone</text><rect x="405" y="165" width="110" height="40" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/><text x="460" y="190" fill="#38bdf8" font-size="12" text-anchor="middle">support tone</text><rect x="535" y="165" width="110" height="40" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/><text x="590" y="190" fill="#f472b6" font-size="12" text-anchor="middle">JSON extract</text><rect x="470" y="225" width="110" height="40" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/><text x="525" y="250" fill="#fbbf24" font-size="12" text-anchor="middle">ticket triage</text><line x1="460" y1="165" x2="490" y2="130" stroke="#a1a1aa" stroke-width="2"/><line x1="590" y1="165" x2="560" y2="130" stroke="#a1a1aa" stroke-width="2"/><line x1="525" y1="225" x2="525" y2="205" stroke="#a1a1aa" stroke-width="2" stroke-dasharray="4,3"/><text x="525" y="295" fill="#a1a1aa" font-size="12" text-anchor="middle">MB-sized adapters swap in per request or per customer</text></svg>`,
          },
          {
            type: 'text',
            md: `Close the loop with real numbers. Score your baseline prompt and your tuned model on the same eval, then look at the difference. Now weigh that delta against the ongoing bill: every base-model upgrade means retraining, and every drift in your data means re-curating examples. A 2-point improvement rarely pays that mortgage. A tuned 8B that replaces an expensive frontier prompt across ten times the volume usually pays it many times over.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Build a Dataset, Then (Optionally) Tune It',
      intro:
        'The durable skill here is dataset and eval discipline. Assemble a real JSONL set for a style or format task; the actual training run is an optional victory lap.',
      steps: [
        'Pick a style or format task you actually repeat: raw notes into your standup format, tickets into a strict triage JSON schema, or commit diffs into your changelog voice.',
        'Write **20-50 prompt/completion pairs** as JSONL. Use real inputs and gold outputs you would genuinely ship. Then validate that every line parses (a 3-line Python loop calling json.loads does it).',
        'Split on disk: dataset/train.jsonl (about 80%), dataset/valid.jsonl (about 10%), and eval.jsonl (about 10%) held out and never trained on.',
        'Score a prompt-engineered baseline: run your best prompt against every eval.jsonl input and grade the outputs (even a manual pass/fail column counts). Record the score.',
        'Optional: pip install mlx-lm, then run mlx_lm.lora --model mlx-community/Qwen2.5-1.5B-Instruct-4bit --train --data ./dataset --iters 300 and watch the validation loss fall.',
        'Optional: generate outputs with mlx_lm.generate --adapter-path ./adapters against the eval.jsonl inputs, grade them the same way as the baseline, and write your verdict: does the delta justify the maintenance?',
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
        q: `Unsloth's pitch, in one line?`,
        options: [
          `Multi-node orchestration for 70B+ clusters`,
          `2-5x faster LoRA training on a single GPU with less VRAM`,
          `A Mac-native training stack built on Metal`,
          `A managed dataset-labeling service`,
        ],
        answer: 1,
        explain: `Unsloth optimizes the single-GPU path with hand-written GPU code, so the same LoRA job trains 2-5x faster and fits in less VRAM (the GPU's onboard memory). Under the hood it still rides the standard PEFT and TRL stack.`,
      },
      {
        q: `Two legitimate ways to serve your tuned adapter?`,
        options: [
          `Merge it into the base weights, or hot-swap adapters on a shared base`,
          `Ship the adapter alone; the base model is not needed at inference`,
          `Re-quantize the adapter to 4-bit and stream it per token`,
          `Convert to ONNX, since adapters cannot be served any other way`,
        ],
        answer: 0,
        explain: `Fusing folds the adapter math into the base weights and produces one self-contained model file. Hot-swapping keeps a single shared base loaded and switches small per-task adapters in and out. Both are standard; the shape of your fleet decides which fits.`,
      },
      {
        q: `Your tuned model beats the prompt baseline by 1 point on your eval. Ship it?`,
        options: [
          `Yes, any positive delta justifies the tune`,
          `Only after weighing the delta against retraining and maintenance cost; a small delta often loses`,
          `No, deltas under 10 points are statistical noise by definition`,
          `Yes, but only if you merge the adapter first`,
        ],
        answer: 1,
        explain: `A tuned model carries a recurring bill: every base-model upgrade means retraining, and every dataset drift means re-curation. The quality delta has to pay that bill, and a 1-point win over a prompt you already have usually loses the comparison.`,
      },
      {
        q: `Why point mlx_lm.lora at a 4-bit model on a 32 GB Mac?`,
        options: [
          `4-bit bases train to strictly higher final quality`,
          `MLX refuses to load full-precision weights`,
          `The quantized base keeps a 7B run near 7 GB peak, leaving unified-memory headroom for everything else`,
          `It makes the resulting adapter file smaller`,
        ],
        answer: 2,
        explain: `QLoRA-style training keeps the frozen base compressed to 4-bit while the adapters train at higher precision. The 4-bit base exists purely for memory headroom: the 7B run peaks near 7 GB instead of several times that, so the rest of your Mac keeps working.`,
      },
    ],
    resources: [
      {
        label: 'MLX-LM (Apple) GitHub repo',
        url: 'https://github.com/ml-explore/mlx-lm',
        kind: 'repo',
      },
      {
        label: 'MLX-LM LoRA fine-tuning guide',
        url: 'https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md',
        kind: 'docs',
      },
      {
        label: 'Unsloth: fast single-GPU fine-tuning',
        url: 'https://github.com/unslothai/unsloth',
        kind: 'repo',
      },
      {
        label: 'Axolotl: YAML-driven multi-GPU fine-tuning',
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
