import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────
  // m9-l1: Inside the File
  // ────────────────────────────────────────────────────────────
  {
    id: 'm9-l1',
    title: 'Inside the File: What a Model Is Made Of',
    day: 23,
    minutes: 60,
    xp: 120,
    objectives: [
      'Say exactly what sits inside a model file, and what a name like "27B" counts',
      'Tell a dense model apart from a mixture-of-experts model, and predict how each behaves in memory and in speed',
      'Read any quantization label (Q4_K_M, MXFP4, 8-bit) and convert it into gigabytes in your head',
      'Work out the two separate bills every model charges you: capacity in gigabytes, and speed in gigabytes per second',
      'Explain why the same machine runs one 45GB model at 60 words a second and another 40GB model at 6',
    ],
    skipQuiz: [
      {
        q: 'A model is called Qwen3.8-27B. What does the 27B count?',
        options: [
          'The 27 billion documents it read during training',
          'The 27 billion numbers (weights) that make up the trained model',
          'The 27 billion tokens it can hold in its context window',
          'The 27 gigabytes of RAM it needs to run',
        ],
        answer: 1,
        explain:
          'Parameter counts count weights: the individual numbers inside the file. Training data volume, context length, and RAM use are three separate figures that all happen to get quoted in similarly large units, which is exactly why the naming trips people up.',
      },
      {
        q: 'Model A is a dense 32B. Model B is a mixture-of-experts 80B with 3B active per token. Both at 4-bit. Which needs more RAM, and which writes faster?',
        options: [
          'B needs more RAM, and B also writes faster',
          'A needs more RAM, and B writes faster',
          'B needs more RAM, and A writes faster',
          'They need the same RAM, and they write at the same speed',
        ],
        answer: 0,
        explain:
          'RAM is charged on total parameters, so the 80B costs more to hold (about 45GB versus about 18GB). Speed is charged on active parameters, so the 80B reads roughly 3B worth of weights per word against the dense model\'s 32B. It holds more and runs faster at the same time, which is the whole reason mixture-of-experts exists.',
      },
      {
        q: 'A model ships at 16 bits per weight and someone releases a 4-bit version. What happens to the file size?',
        options: [
          'It drops to about a quarter, because each weight now uses a quarter as many bits',
          'It drops to about a half, because quantization always halves storage',
          'It stays the same, since quantization changes speed rather than size',
          'It grows, because the 4-bit format needs extra lookup tables',
        ],
        answer: 0,
        explain:
          'Quantization is a storage format change. Sixteen bits per weight down to four bits per weight is a straight 4x reduction, so a 60GB model becomes roughly 15GB. Quality dips a little on the way down, and falls off hard below 4 bits.',
      },
      {
        q: 'Two Macs both have 64GB of RAM. One has 120GB/s of memory bandwidth, the other has 800GB/s. Same model loaded on both. What differs?',
        options: [
          'Nothing measurable; bandwidth affects file copying rather than inference',
          'The fast-bandwidth Mac can load bigger models',
          'The fast-bandwidth Mac writes words several times faster',
          'The fast-bandwidth Mac gives better answers because it reads more weights',
        ],
        answer: 2,
        explain:
          'RAM capacity decides which models fit. Memory bandwidth decides how fast words come out, because the chip has to physically read the model\'s weights out of memory for every single word it writes. Same model, same answers, wildly different speed.',
      },
      {
        q: 'Your local model runs fine on short chats, then slows down and eventually fails on a long one. What is the most likely cause?',
        options: [
          'The model file corrupted itself during the long session',
          'The KV cache grew with the conversation and ate the RAM headroom',
          'The quantization level decays as more tokens are generated',
          'Ollama switched to CPU inference after a fixed number of tokens',
        ],
        answer: 1,
        explain:
          'The KV cache is the scratchpad the model keeps for everything already in the conversation. It grows with every token, so a long session steadily claims more RAM on top of the fixed weights. Once the total crosses what the GPU is allowed to hold, everything falls apart.',
      },
    ],
    sections: [
      {
        heading: 'A Model Is a File Full of Numbers',
        blocks: [
          {
            type: 'text',
            md: "Start from the most literal possible description, because everything else follows from it. A language model that you download is a file. Inside that file are billions of numbers. Nothing else. No code, no logic, no rules, no lookup table of facts. Just numbers, arranged in a known layout.\n\nThose numbers are called **weights**, and **parameters** means the same thing. When a model is named Qwen3.8-27B, the 27B counts them: 27 billion numbers. Gemma 4 31B has 31 billion. That number is the single most important thing on a model's label, because it drives the size of the download, the RAM it needs, and how fast it can write.",
          },
          {
            type: 'text',
            md: "Where did those numbers come from? **Training** is the process that produced them. A company fed enormous amounts of text through a mostly-random pile of numbers, checked how badly the pile predicted the next word, and nudged every number slightly in the direction that would have been less wrong. Repeat that a few trillion times on a few thousand GPUs, and the pile stops being random. It becomes a machine that predicts what comes next. Training is what costs tens of millions of dollars and is done exactly once.\n\n**Inference** is the other verb, and it's the only one you'll do on your Mac. Inference means running the finished numbers to get an answer out. You hand the model some text, it does a very large amount of multiplication, and a word comes out. Then it does the whole thing again for the next word. Everything in this module is about inference.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'One word at a time, always',
            md: "A model generates exactly one token at a time, and each new token requires a full pass over the model. There's no batching of your one sentence, no shortcut, no partial evaluation. A 500-word answer means roughly 650 complete passes through billions of numbers. That fact is the reason the rest of this lesson is about arithmetic instead of magic.",
          },
          {
            type: 'text',
            md: "One more piece of vocabulary you'll hit immediately. An **open-weight** model is one where the company published that file of numbers, so anyone can download it and run it themselves. Qwen, DeepSeek, Gemma, gpt-oss, Devstral, and Mistral all publish weights. Claude and GPT don't, which is why you reach them over the internet and never on your own disk. The full landscape is mapped in [Local Models · The Open-Model Landscape 2026](lesson:m4-l1); this lesson goes underneath it, into what the file itself is doing.",
          },
        ],
      },
      {
        heading: 'Dense: Everybody Works on Every Word',
        blocks: [
          {
            type: 'text',
            md: "**Dense** is the original design, and it's the one to understand first because everything else is a modification of it. In a dense model, every single weight participates in producing every single token. All 27 billion numbers get read out of memory and multiplied for the word 'the', and then all 27 billion get read again for the word 'cat'.\n\nPicture a factory where every worker touches every product. Nobody sits idle. It's simple, it's predictable, and it's why dense models tend to punch reliably for their size: all that capacity is in play every time.",
          },
          {
            type: 'text',
            md: "The cost shows up in speed, and the mechanism is worth being precise about. To multiply by a weight, the chip has to fetch that weight from memory. Fetching costs time. So for every token, a dense model pulls its entire weight file across the memory bus. A 27B model at 4 bits per weight is about 16GB of numbers, so writing a 400-word answer means shifting roughly 8 **terabytes** of data from memory to the GPU.\n\nThat sounds absurd until you see the counter-number: your Mac mini moves 307 gigabytes per second. Divide, and you get the speed. This is the arithmetic that decides everything, and we'll come back to it with real numbers in a few sections.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Dense model: every weight is read for every token</text>
  <rect x="40" y="60" width="120" height="180" fill="#27272a" stroke="#52525b" stroke-width="1.5" rx="6"/>
  <text x="100" y="82" fill="#a1a1aa" font-size="12" text-anchor="middle">RAM</text>
  <rect x="52" y="94" width="96" height="132" fill="#f472b6" opacity="0.85" rx="4"/>
  <text x="100" y="150" fill="#18181b" font-size="13" font-weight="bold" text-anchor="middle">27B</text>
  <text x="100" y="168" fill="#18181b" font-size="11" text-anchor="middle">weights</text>
  <text x="100" y="256" fill="#f472b6" font-size="11" text-anchor="middle">all 16GB of it</text>
  <line x1="165" y1="150" x2="290" y2="150" stroke="#f472b6" stroke-width="3"/>
  <polygon points="295,150 281,143 281,157" fill="#f472b6"/>
  <text x="228" y="140" fill="#f472b6" font-size="11" text-anchor="middle">read 100%</text>
  <text x="228" y="172" fill="#71717a" font-size="11" text-anchor="middle">per token</text>
  <rect x="300" y="95" width="110" height="110" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="6"/>
  <text x="355" y="145" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">GPU</text>
  <text x="355" y="165" fill="#a1a1aa" font-size="11" text-anchor="middle">multiply</text>
  <line x1="415" y1="150" x2="500" y2="150" stroke="#52525b" stroke-width="2"/>
  <polygon points="505,150 491,143 491,157" fill="#52525b"/>
  <rect x="510" y="120" width="150" height="60" fill="#27272a" stroke="#34d399" stroke-width="2" rx="6"/>
  <text x="585" y="146" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">one token</text>
  <text x="585" y="166" fill="#a1a1aa" font-size="11" text-anchor="middle">then start over</text>
  <path d="M 585 185 Q 585 265, 350 265 Q 100 265, 100 245" fill="none" stroke="#52525b" stroke-width="2" stroke-dasharray="5 4"/>
  <polygon points="100,240 94,254 106,254" fill="#52525b"/>
  <text x="350" y="285" fill="#71717a" font-size="11" text-anchor="middle">repeat for every single word in the answer</text>
</svg>`,
            caption: 'The full weight file crosses the memory bus once per token. That trip is the speed limit.',
          },
        ],
      },
      {
        heading: 'Mixture of Experts: A Hospital That Pages Two Doctors',
        blocks: [
          {
            type: 'text',
            md: "**Mixture of experts**, written MoE, is the design that broke the link between how big a model is and how slow it is. It's the reason a 64GB Mac mini can run something with 80 billion parameters and still feel snappy.\n\nThe idea: instead of one giant slab of weights that all fire together, split most of the model into dozens of smaller specialist chunks called **experts**. Add a tiny traffic-cop network called the **router**. For each incoming token, the router looks at it and picks a small handful of experts (often two, sometimes eight) to actually do the work. The rest sit still for that token.",
          },
          {
            type: 'text',
            md: "The hospital analogy holds up well. A hospital employs cardiologists, neurologists, orthopedic surgeons, and eighty other specialties. Any given patient sees two or three of them. Care is fast because nobody waits for all eighty opinions.\n\nBut the hospital still needs a room, a salary, and a parking spot for every single specialist, because the *next* patient might need any of them. The router picks fresh experts for every token, so every expert has to be sitting in RAM, warmed up and waiting. You pay rent on all of them and wages for two.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="360" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">MoE: rent is charged on all experts, wages only on the active ones</text>
  <rect x="30" y="55" width="120" height="46" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="6"/>
  <text x="90" y="76" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">token in</text>
  <text x="90" y="92" fill="#a1a1aa" font-size="10" text-anchor="middle">"mortgage"</text>
  <line x1="155" y1="78" x2="210" y2="78" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="215,78 202,72 202,84" fill="#fbbf24"/>
  <rect x="220" y="55" width="110" height="46" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="6"/>
  <text x="275" y="76" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">router</text>
  <text x="275" y="92" fill="#a1a1aa" font-size="10" text-anchor="middle">picks 2 of 64</text>
  <text x="350" y="132" fill="#a1a1aa" font-size="12" text-anchor="middle">all 64 experts sit in RAM the entire time</text>
  <g>
    <rect x="40" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="70" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="110" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="140" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="180" y="148" width="60" height="42" fill="#34d399" stroke="#34d399" rx="4"/><text x="210" y="174" fill="#18181b" font-size="11" font-weight="bold" text-anchor="middle">ACTIVE</text>
    <rect x="250" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="280" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="320" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="350" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="390" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="420" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="460" y="148" width="60" height="42" fill="#34d399" stroke="#34d399" rx="4"/><text x="490" y="174" fill="#18181b" font-size="11" font-weight="bold" text-anchor="middle">ACTIVE</text>
    <rect x="530" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="560" y="174" fill="#71717a" font-size="11" text-anchor="middle">idle</text>
    <rect x="600" y="148" width="60" height="42" fill="#3f3f46" stroke="#52525b" rx="4"/><text x="630" y="174" fill="#71717a" font-size="11" text-anchor="middle">…</text>
  </g>
  <line x1="275" y1="101" x2="210" y2="145" stroke="#34d399" stroke-width="2"/>
  <line x1="275" y1="101" x2="490" y2="145" stroke="#34d399" stroke-width="2"/>
  <rect x="60" y="222" width="270" height="96" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="195" y="248" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">THE RAM BILL</text>
  <text x="195" y="272" fill="#e4e4e7" font-size="12" text-anchor="middle">all 80B parameters</text>
  <text x="195" y="292" fill="#e4e4e7" font-size="12" text-anchor="middle">about 45GB at 4-bit</text>
  <text x="195" y="310" fill="#a1a1aa" font-size="11" text-anchor="middle">every expert, resident, always</text>
  <rect x="370" y="222" width="270" height="96" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="505" y="248" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">THE SPEED BILL</text>
  <text x="505" y="272" fill="#e4e4e7" font-size="12" text-anchor="middle">only ~3B parameters read</text>
  <text x="505" y="292" fill="#e4e4e7" font-size="12" text-anchor="middle">about 1.8GB per token</text>
  <text x="505" y="310" fill="#a1a1aa" font-size="11" text-anchor="middle">so it writes like a small model</text>
  <text x="350" y="344" fill="#fbbf24" font-size="12" text-anchor="middle" font-weight="bold">next token: the router picks two different experts, so none of them can be unloaded</text>
</svg>`,
            caption: 'Big in memory, small in motion. That split is the entire point of MoE.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'How to read an MoE name',
            md: "Names like `Qwen3-Coder-Next-80B-A3B` decode mechanically. The first number is total parameters (80 billion), and the `A` number is active parameters per token (3 billion). Total tells you the RAM bill. Active tells you the speed. If a name has no `A`, assume it's dense and both numbers are the same.",
          },
        ],
      },
      {
        heading: 'The Honest Catch With MoE',
        blocks: [
          {
            type: 'text',
            md: "MoE sounds like free money, so here's the part the marketing skips. An 80B model with 3B active is *not* as capable as a dense 80B. Only a sliver of the network reasons about any given token, and reasoning benefits from depth of computation, which is exactly what got cut.\n\nThe rough folk heuristic in the local-model community is a geometric mean: take the square root of total times active. For an 80B-A3B, that's the square root of 240, or about 15. So an 80B-A3B behaves loosely like a dense 15B model that happens to know an enormous amount. Treat that as a napkin estimate rather than a law, because benchmarks routinely beat it and training quality matters more than the formula does.",
          },
          {
            type: 'table',
            headers: ['Model shape', 'RAM at 4-bit', 'Read per token', 'Feels roughly like', 'Where it shines'],
            rows: [
              ['Dense 14B', '~8GB', '~8GB', 'a dense 14B', 'tight reasoning on a small box'],
              ['Dense 27B', '~16GB', '~16GB', 'a dense 27B', 'best quality per gigabyte read'],
              ['MoE 35B-A3B', '~20GB', '~1.8GB', 'a dense 10B with wide knowledge', 'fast chat, agent loops, bulk work'],
              ['MoE 80B-A3B', '~45GB', '~1.8GB', 'a dense 15B with very wide knowledge', 'coding agents on a 64GB Mac'],
              ['Dense 70B', '~40GB', '~40GB', 'a dense 70B', 'quality, if you can stomach the speed'],
            ],
          },
          {
            type: 'text',
            md: "Read the last two rows together, because they're the entire decision for your machine. The 80B MoE and the 70B dense occupy similar RAM. One reads 1.8GB per token and the other reads 40GB. On a 307GB/s Mac that's the difference between a model that keeps pace with your reading and one that makes you wait for every sentence.\n\nThe dense 70B is genuinely smarter per token. It just charges you twenty times the wait to prove it, and in an agent loop that runs forty steps, twenty times the wait is the difference between a tool you use and one you abandon.",
          },
        ],
      },
      {
        heading: 'Quantization: Rounding the Numbers Down',
        blocks: [
          {
            type: 'text',
            md: "Time for the second label on every model file. When a model gets trained, each weight is stored as a fairly precise number, typically using 16 **bits** of storage. A bit is one binary digit, and 8 bits make a byte. Sixteen bits per weight means 2 bytes per weight, so a 27B model straight out of training is about 54GB on disk.\n\n**Quantization** is the trick of storing those same weights with fewer bits by rounding them. Go from 16 bits to 4 bits and the file shrinks by a factor of four, from 54GB down to about 14GB. The model still works, because it turns out neural networks are surprisingly tolerant of imprecision in individual weights. What matters is the overall pattern, and the pattern survives rounding.",
          },
          {
            type: 'text',
            md: "The practical shorthand every local-model person carries in their head: **at 4-bit, a model needs roughly half a gigabyte of RAM per billion parameters.** A 30B model is about 16GB. An 80B model is about 45GB. A 120B model is about 65GB. That one rule lets you glance at any model name and know instantly whether it fits your machine.\n\nThe labels themselves come in two dialects. GGUF files (the llama.cpp lineage) use names like `Q4_K_M`, where Q4 means four bits and `_K_M` describes a medium-quality mixed scheme that keeps the most sensitive layers at higher precision. Apple's MLX format just says `4bit` or `8bit`. Newer formats like `MXFP4` and `NVFP4` are 4-bit schemes designed around hardware support on modern chips. All of them are answering the same question: how few bits can we spend per weight before the model gets noticeably dumber?",
          },
          {
            type: 'table',
            headers: ['Label', 'Bits per weight', 'Size of a 30B model', 'Quality', 'Use it when'],
            rows: [
              ['FP16 / BF16', '16', '~60GB', 'the original', 'you have a Mac Studio and want zero doubt'],
              ['Q8 / 8bit', '8', '~32GB', 'indistinguishable in practice', 'RAM is plentiful and you want a safety margin'],
              ['Q6_K', '6', '~25GB', 'very slightly softer', 'a good compromise nobody talks about'],
              ['Q4_K_M / 4bit', '4', '~16GB', 'close to the original for most tasks', 'the default. Start here.'],
              ['Q3_K_M', '3', '~13GB', 'noticeably worse', 'only to squeeze onto small hardware'],
              ['Q2_K', '2', '~10GB', 'often broken', 'basically never'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The cliff below four bits',
            md: "Quality loss from quantization arrives as a cliff rather than a slope. From 16 bits down to about 4 bits, the decline is gentle enough that most people can't pick the difference in a blind test. Below 4 bits it turns into a cliff: the model starts inventing syntax, losing track of instructions, and producing confident nonsense. This is why 4-bit became the community default rather than 3-bit or 2-bit, and why a 3-bit quant of a bigger model is usually a worse buy than a 4-bit quant of a smaller one.",
          },
        ],
      },
      {
        heading: 'The Two Bills: Capacity and Bandwidth',
        blocks: [
          {
            type: 'text',
            md: "Here's the idea that reorganizes everything else, and it's the one most local-model guides skip straight past. Your Mac charges you two completely separate bills, and they're paid with two completely different numbers on the spec sheet.\n\n**Bill one is capacity, paid in gigabytes.** Your machine has 64GB of unified memory. The model's weights have to fit, along with the conversation scratchpad and macOS itself. If they don't fit, nothing runs. Capacity is a yes-or-no gate.\n\n**Bill two is speed, paid in gigabytes per second.** Your machine moves 307GB/s between memory and the GPU. Every token requires reading the active weights across that pipe. Speed works as a rate instead of a gate, and you feel it every second you use the model.",
          },
          {
            type: 'text',
            md: "The formula for token generation speed is embarrassingly simple once you see the two bills separately:\n\n**tokens per second is about (memory bandwidth divided by bytes read per token), times an efficiency factor of roughly 0.6 to 0.8.**\n\nBytes read per token equals the *active* parameters times the bytes per parameter. At 4-bit, that's 0.5GB per billion active parameters. The efficiency factor covers real-world overhead: attention layers, the KV cache, the fact that no chip ever achieves its theoretical peak. Let's run it on your actual machine.",
          },
          {
            type: 'table',
            headers: ['Model', 'RAM used', 'Active params', 'Bytes read per token', '307 ÷ that', 'Realistic tok/s'],
            rows: [
              ['Gemma 4 31B (dense)', '~17GB', '31B', '~16GB', '19', '13–16'],
              ['Dense 70B at Q4', '~40GB', '70B', '~38GB', '8', '5–7'],
              ['Qwen3.5 35B-A3B (MoE)', '~20GB', '3B', '~1.8GB', '170', '60–95'],
              ['Qwen3-Coder-Next 80B-A3B', '~45GB', '3B', '~1.9GB', '160', '55–85'],
              ['gpt-oss 20B (MoE)', '~12GB', '3.6B', '~2.1GB', '146', '55–85'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The punchline for a 64GB Mac mini',
            md: "Look at rows two and four. Both models occupy about the same slice of your RAM. One writes at 6 words a second and the other writes at 70. On a machine with 64GB of capacity and only moderate bandwidth, a large mixture-of-experts model is close to a free lunch and a large dense model is a trap. Any guide that recommends a dense 70B for your box has quoted the capacity number and forgotten the bandwidth one.",
          },
          {
            type: 'text',
            md: "This also explains a thing that confuses people about Macs generally. A Mac Studio with an M5 Ultra has similar capacity to a couple of these configurations but far more bandwidth, so it runs the *same* models several times faster. The capacity number decides your menu. The bandwidth number decides how fast the food arrives. When you're comparing two Macs, check both, because the marketing usually leads with the one that sounds bigger.",
          },
        ],
      },
      {
        heading: 'The KV Cache: The Third Bill Nobody Quotes You',
        blocks: [
          {
            type: 'text',
            md: "Weights aren't the only thing sitting in memory. As the model reads your conversation, it builds a working scratchpad for every token it has already seen, so it doesn't have to recompute the whole history for each new word. That scratchpad is the **KV cache** (short for key-value cache, after the two internal tensors it stores).\n\nThe important property: it grows linearly with the conversation. A 2,000-token chat has a small cache. A 100,000-token session where an agent has read a dozen files has a big one, sometimes many gigabytes. It's charged against the same 64GB pool as the weights.",
          },
          {
            type: 'text',
            md: "This is why a local setup that worked beautifully on Monday falls over on Thursday when you point a coding agent at a real repository. The weights didn't change. The conversation got long, the cache grew, the total crossed the ceiling, and the machine started thrashing.\n\nThe practical planning rule: size your model so the weights leave 10GB to 20GB of headroom, not 2GB. A 45GB model on a 64GB machine is comfortable. A 60GB model on a 64GB machine is a machine that works until it doesn't.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Budgeting 64GB: three tenants, one apartment</text>
  <text x="350" y="50" fill="#a1a1aa" font-size="12" text-anchor="middle">weights are fixed; the KV cache grows all session long</text>
  <text x="60" y="88" fill="#a1a1aa" font-size="12">Short chat</text>
  <rect x="60" y="96" width="580" height="36" fill="#27272a" stroke="#52525b" rx="4"/>
  <rect x="62" y="98" width="200" height="32" fill="#34d399" rx="3"/>
  <text x="162" y="119" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">weights 22GB</text>
  <rect x="264" y="98" width="30" height="32" fill="#fbbf24" rx="3"/>
  <text x="279" y="119" fill="#18181b" font-size="10" font-weight="bold" text-anchor="middle">KV</text>
  <rect x="296" y="98" width="70" height="32" fill="#71717a" rx="3"/>
  <text x="331" y="119" fill="#18181b" font-size="10" font-weight="bold" text-anchor="middle">macOS</text>
  <text x="510" y="119" fill="#52525b" font-size="12" text-anchor="middle">free</text>
  <text x="60" y="168" fill="#a1a1aa" font-size="12">Long agent session, same model</text>
  <rect x="60" y="176" width="580" height="36" fill="#27272a" stroke="#52525b" rx="4"/>
  <rect x="62" y="178" width="200" height="32" fill="#34d399" rx="3"/>
  <text x="162" y="199" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">weights 22GB</text>
  <rect x="264" y="178" width="160" height="32" fill="#fbbf24" rx="3"/>
  <text x="344" y="199" fill="#18181b" font-size="11" font-weight="bold" text-anchor="middle">KV cache 18GB</text>
  <rect x="426" y="178" width="70" height="32" fill="#71717a" rx="3"/>
  <text x="461" y="199" fill="#18181b" font-size="10" font-weight="bold" text-anchor="middle">macOS</text>
  <text x="570" y="199" fill="#52525b" font-size="12" text-anchor="middle">free</text>
  <text x="60" y="248" fill="#f87171" font-size="12">Same session, but you picked a 60GB model</text>
  <rect x="60" y="256" width="580" height="36" fill="#27272a" stroke="#f87171" stroke-width="2" rx="4"/>
  <rect x="62" y="258" width="470" height="32" fill="#f87171" rx="3"/>
  <text x="297" y="279" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">weights 60GB</text>
  <rect x="534" y="258" width="104" height="32" fill="#7f1d1d" rx="3"/>
  <text x="586" y="279" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">swap / stall</text>
</svg>`,
            caption: 'The model that "just fits" is the model that fails the moment you give it real work.',
          },
        ],
      },
      {
        heading: 'Prefill and Decode Are Different Jobs',
        blocks: [
          {
            type: 'text',
            md: "One last distinction, and it explains why the M5 chip in your mini is a bigger deal than its bandwidth number suggests. Running a model splits into two phases with completely different bottlenecks.\n\n**Prefill** happens first. The model reads your entire prompt: your question, the system instructions, every file the agent pulled in. It processes all of that in parallel, which makes prefill a *compute* problem. Lots of math, all at once. The time this takes is your **time to first token**, or TTFT, the pause before anything appears.\n\n**Decode** happens second and is everything after. One token, then the next, then the next. Each one needs a fresh trip across the memory bus, which makes decode a *bandwidth* problem. This is the tokens-per-second number.",
          },
          {
            type: 'compare',
            left: {
              title: 'Prefill (reading your prompt)',
              items: [
                'Bottleneck: raw compute',
                'Runs the whole prompt in parallel',
                'Sets time-to-first-token',
                'M5 Neural Accelerators hit this hard: Apple measured 3.3x to 4x faster than M4',
                'Matters most when an agent dumps 40K tokens of files at the model',
              ],
            },
            right: {
              title: 'Decode (writing the answer)',
              items: [
                'Bottleneck: memory bandwidth',
                'Strictly one token at a time',
                'Sets tokens-per-second',
                'Improves roughly in step with bandwidth, so about 20% over M4 Pro',
                'Matters most in long chat replies and long agent turns',
              ],
            },
          },
          {
            type: 'text',
            md: "The M5 generation added **Neural Accelerators** inside each GPU core, replacing a separate fixed-size Neural Engine that inference frameworks mostly couldn't use. Twenty GPU cores means twenty of them in your mini. They attack prefill, which is why Apple's headline claim is about prompt processing rather than generation speed.\n\nFor a coding agent this is the right thing to have sped up. An agent turn typically means reading thousands of tokens of source files and writing a few hundred tokens of diff. The reading is the expensive part, and reading is exactly what got four times faster.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'What to measure when you benchmark',
            md: "Always report two numbers, never one. `time to first token` at a realistic prompt length (10K tokens, not 20), and `tokens per second` during generation. A model that looks fast on a one-line prompt can take 40 seconds to start on a real codebase, and a single averaged number hides that completely.",
          },
        ],
      },
    ],
    lab: {
      title: 'Size Your Own Machine',
      intro:
        "Turn the arithmetic in this lesson into a one-page reference you'll actually consult before every model download. Do it with a calculator and your own hardware numbers, because a table you derived yourself is one you'll remember.",
      steps: [
        'Write down your machine\'s two numbers: total unified memory in GB, and memory bandwidth in GB/s. For an M5 Pro Mac mini that\'s 64 and 307. Find yours at Apple\'s tech specs page if you\'re on different hardware.',
        'Compute your usable model budget: total memory, minus 10GB for macOS, minus 10GB of KV headroom. Write the number down. That is the largest model file you should ever load.',
        'Build a table with a row for each of these shapes: dense 14B, dense 27B, dense 70B, MoE 30B-A3B, MoE 80B-A3B, MoE 120B-A5B. For each, compute RAM at 4-bit (params x 0.5GB), bytes read per token (active params x 0.5GB), and predicted tok/s (bandwidth ÷ bytes read x 0.7).',
        'Mark each row FITS or DOES NOT FIT against your budget from step 2. Notice how many popular recommendations land in the second column.',
        'Pick the two rows with the best predicted speed that still fit. Those are your candidate model shapes, and lesson 2 turns them into actual model names.',
        'Sanity-check your predictions against reality once the machine is in front of you: run one model and compare measured tok/s to your table. Write down the gap and the efficiency factor that would have made your prediction correct.',
      ],
      checklist: [
        'My machine\'s memory and bandwidth numbers are written down',
        'I computed a usable model budget with explicit headroom for macOS and the KV cache',
        'My table has all six shapes with RAM, bytes-per-token, and predicted tok/s columns',
        'I can explain out loud why a 70B dense and an 80B MoE use similar RAM but differ tenfold in speed',
        'I picked two candidate shapes and know why I rejected the others',
      ],
    },
    checkQuiz: [
      {
        q: 'Why does a mixture-of-experts model need all of its parameters in RAM even though most of them sit idle for any given token?',
        options: [
          'Because the file format does not support partial loading',
          'Because the router picks different experts for every token, so any expert may be needed next',
          'Because the KV cache references every expert regardless of which one fired',
          'Because quantization requires the full weight set to decode correctly',
        ],
        answer: 1,
        explain:
          'The router re-decides on every single token. An expert idle for this word may be essential for the next one, and pulling it off disk mid-generation would cost far more than keeping it resident. RAM pays for all of them; compute pays for the two that fire.',
      },
      {
        q: 'Your machine has 307GB/s of bandwidth. You load a dense 70B at 4-bit (about 38GB read per token). What generation speed should you expect?',
        options: [
          'Around 70 tokens per second, since the bandwidth is high',
          'Around 5 to 7 tokens per second',
          'Around 25 tokens per second, since 4-bit quantization triples throughput',
          'It depends entirely on CPU core count rather than bandwidth',
        ],
        answer: 1,
        explain:
          '307 divided by 38 is about 8 tokens per second at theoretical peak, and real efficiency lands around 0.7 of that, so 5 to 7. This single calculation is why a dense 70B is the wrong shape for a 307GB/s machine no matter how much RAM you have.',
      },
      {
        q: 'A model is offered in Q4_K_M and Q2_K. Both fit your RAM. What is the right call?',
        options: [
          'Take Q2_K, since smaller files always load and run faster',
          'Take Q4_K_M, since quality falls off a cliff below about four bits per weight',
          'Take whichever one the download page lists first, since the difference is cosmetic',
          'Take Q2_K of a larger model instead, since parameter count beats precision',
        ],
        answer: 1,
        explain:
          'Quality holds up remarkably well down to 4 bits and then degrades sharply. If both fit, there is no reason to take the damaged version. And a 2-bit quant of a bigger model is usually worse than a 4-bit quant of a smaller one, which kills the fourth option too.',
      },
      {
        q: 'Which phase of inference did the M5\'s Neural Accelerators speed up most, and why does that matter for coding agents?',
        options: [
          'Decode, because writing long diffs is the slow part of agent work',
          'Prefill, because agents feed thousands of tokens of source files in before writing anything',
          'Both equally, since the accelerators sit between memory and the GPU',
          'Neither; the accelerators only serve image diffusion models',
        ],
        answer: 1,
        explain:
          'Prefill is compute-bound and parallel, which is exactly the shape the Neural Accelerators attack, and Apple measured 3.3x to 4x faster time-to-first-token versus M4. Agent turns are read-heavy and write-light, so the phase that got faster is the phase that dominates the wait.',
      },
    ],
    resources: [
      { label: 'Apple: Mac mini with M6 and M5 Pro (official specs)', url: 'https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/', kind: 'article' },
      { label: 'Apple MLX framework', url: 'https://github.com/ml-explore/mlx', kind: 'repo' },
      { label: 'llama.cpp quantization reference', url: 'https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md', kind: 'docs' },
      { label: 'Mixture-of-Experts explained (Hugging Face)', url: 'https://huggingface.co/blog/moe', kind: 'article' },
      { label: 'Transformer inference arithmetic', url: 'https://kipp.ly/transformer-inference-arithmetic/', kind: 'article' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m9-l2: Picking Models for a 64GB Mac
  // ────────────────────────────────────────────────────────────
  {
    id: 'm9-l2',
    title: 'Picking Models for a 64GB Mac mini',
    day: 23,
    minutes: 55,
    xp: 120,
    objectives: [
      'Name the model families that matter in late 2026 and describe what each one is actually good at',
      'Choose a specific model for a specific job instead of downloading whatever a video recommended',
      'Spot the two or three famous models that almost fit 64GB, and explain why almost is worse than not at all',
      'Configure macOS so the GPU is allowed to use the memory you paid for',
      'Set up a two-model residency plan that covers chat and coding without reloading',
    ],
    skipQuiz: [
      {
        q: 'gpt-oss 120B is described as needing about 66GB. You have 64GB of unified memory. What happens?',
        options: [
          'It runs fine, since the 66GB figure includes an operating system allowance',
          'It runs but slowly, since macOS transparently swaps the overflow to the SSD',
          'It either refuses to load or thrashes against swap, and either way it is the wrong choice',
          'It automatically drops to a lower quantization to fit',
        ],
        answer: 2,
        explain:
          'Sixty-six gigabytes of weights on a machine with 64GB total leaves negative room for macOS and the KV cache. Some runtimes refuse outright, others start paging to SSD, and paging turns a 60 tok/s model into a 2 tok/s one. A model that "almost fits" is a model that does not fit.',
      },
      {
        q: 'By default, how much of a 64GB Mac\'s memory will macOS let the GPU use for model weights?',
        options: [
          'All 64GB, since unified memory has no split',
          'About 48GB, roughly 75% of total',
          'Exactly 32GB, a hard half',
          '8GB, with the rest reserved for the Neural Engine',
        ],
        answer: 1,
        explain:
          'macOS caps GPU-addressable memory at roughly 75% of physical RAM via the iogpu.wired_limit_mb kernel parameter. On 64GB that is about 48GB, which quietly blocks any model in the 45GB-plus class once you add a KV cache. Raising it is one command.',
      },
      {
        q: 'You want one model for daily chat and one for coding, and you want to switch between them without waiting. What does that require?',
        options: [
          'Two separate Ollama installations on different ports',
          'Enough RAM for both weight sets at once, plus a keep-alive setting that stops unloading',
          'A model router, since two models cannot be resident simultaneously',
          'Nothing special; runtimes always keep every pulled model in memory',
        ],
        answer: 1,
        explain:
          'Residency is a memory question plus a policy question. Both weight sets have to fit in your budget at the same time, and the runtime has to be told to stop evicting idle models, which on Ollama means raising OLLAMA_KEEP_ALIVE from its short default.',
      },
      {
        q: 'For a coding agent on 64GB, which shape is the better buy?',
        options: [
          'A dense 70B at Q4, because coding rewards raw parameter count',
          'An 80B mixture-of-experts with about 3B active, at Q4',
          'A dense 8B at Q8, because precision beats size for code',
          'A 120B mixture-of-experts, because coding needs the largest model available',
        ],
        answer: 1,
        explain:
          'The 80B MoE fits with headroom and generates 10x faster than the dense 70B for similar RAM. The dense 8B leaves quality on the table when you have 64GB to spend, and the 120B does not fit.',
      },
      {
        q: 'A benchmark blog reports 15 tokens per second for a dense 70B on a 307GB/s Mac. What should you conclude?',
        options: [
          'The Mac has an unusually efficient memory controller',
          'The number is roughly double what the bandwidth arithmetic allows, so it is probably wrong or measured differently',
          'Dense models are faster than MoE models at large sizes',
          'The blog measured prefill rather than generation, which is always faster',
        ],
        answer: 1,
        explain:
          '307 divided by the roughly 38GB a dense 70B reads per token caps you near 8 tok/s before efficiency losses. A claimed 15 breaks physics unless something else is being measured. Bandwidth arithmetic is your best defense against confident benchmark posts.',
      },
    ],
    sections: [
      {
        heading: 'The Shape of Your Machine',
        blocks: [
          {
            type: 'text',
            md: "Every model recommendation you'll read online is written for a machine that isn't yours. So start by writing down what yours actually is, then judge advice against it.\n\nAn M5 Pro Mac mini with 64GB gives you three numbers that matter and one that doesn't. The three: 64GB of unified memory, 307GB/s of memory bandwidth, and 20 GPU cores each carrying a Neural Accelerator. The one that doesn't: the 18-core CPU, which does almost nothing during inference because the GPU handles the math.",
          },
          {
            type: 'table',
            headers: ['Number', 'Value', 'What it decides'],
            rows: [
              ['Unified memory', '64GB', 'Which models fit at all. Budget ~44GB for weights after macOS and KV cache.'],
              ['Memory bandwidth', '307GB/s', 'Tokens per second. Divide by bytes-read-per-token.'],
              ['GPU cores with Neural Accelerators', '20', 'Prompt processing speed. 3.3x to 4x faster time-to-first-token versus M4.'],
              ['SSD', '1TB', 'How many models you can keep downloaded. A 45GB model is a real chunk of that.'],
              ['CPU cores', '18', 'Barely relevant to inference. Useful for everything else the box does.'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Your machine has a personality',
            md: "Roomy but not especially fast. That combination has a clear consequence: mixture-of-experts models are your sweet spot, big dense models are your trap, and the ceiling on total model size is about 45GB rather than 64GB. Every recommendation below flows from those three facts. If you had a Mac Studio with three times the bandwidth, the advice would change.",
          },
        ],
      },
      {
        heading: 'Who Makes These Things',
        blocks: [
          {
            type: 'text',
            md: "Model names look like license plates until you know the families. Maybe six of them matter, each with a house style, and knowing the family tells you most of what you need before you read a single benchmark.",
          },
          {
            type: 'table',
            headers: ['Family', 'Who', 'License', 'House style', 'Reach for it when'],
            rows: [
              ['Qwen', 'Alibaba', 'Apache 2.0', 'Prolific, broad sizes, strong coding and multilingual, huge context', 'you want a default that works. Most local setups run a Qwen.'],
              ['DeepSeek', 'DeepSeek AI', 'MIT', 'Reasoning-first, aggressive MoE designs, very large totals', 'you want step-by-step reasoning and have the RAM'],
              ['Gemma', 'Google', 'Gemma terms (permissive-ish)', 'Dense, tidy, strong at instruction following and vision', 'you want a dependable dense model and image input'],
              ['gpt-oss', 'OpenAI', 'Apache 2.0', 'MoE, reasoning-tuned, small active counts, MXFP4-native', 'you want OpenAI-flavored reasoning locally'],
              ['Mistral / Devstral', 'Mistral AI', 'Apache 2.0', 'Compact, efficient, Devstral built specifically for coding agents', 'you want a small model that behaves well inside an agent loop'],
              ['Llama', 'Meta', 'Llama Community License (not OSI open source)', 'The old default, now usually beaten by Qwen at the same size', 'a specific tool or tutorial requires it'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The Llama tell',
            md: "Any guide from 2026 that opens with \"start with Llama\" was written in 2024 and republished for traffic. Meta's models are fine, and their license is genuinely more restrictive than Apache 2.0 or MIT if you ever ship a derivative. The current open leaderboards are dominated by Qwen, DeepSeek, and gpt-oss. Use the Llama default as a dating stamp on the advice around it.",
          },
        ],
      },
      {
        heading: 'The Shortlist',
        blocks: [
          {
            type: 'text',
            md: "Here's what to actually download, sized against your 44GB working budget. Model names in the open-weight world churn every few months, so treat these as the shapes to look for and check what the current release of each family is called when your machine arrives. The reasoning behind each pick outlives the version number.",
          },
          {
            type: 'table',
            headers: ['Pick', 'Shape', 'RAM at 4-bit', 'Expected tok/s', 'The job it does'],
            rows: [
              ['Qwen 27B-class (Qwen3.8-27B)', 'Dense, vision, ~262K context', '~16GB', '13–16', 'Daily driver. Best answer quality per gigabyte on this box.'],
              ['Qwen 35B-A3B-class', 'MoE, 3B active', '~20GB', '60–90', 'Speed tier. Bulk work, classification, fast chat, long agent loops.'],
              ['Qwen3-Coder-Next 80B-A3B', 'MoE, 3B active', '~45GB', '55–85', 'The coding model. Biggest brain that fits, and it runs fast.'],
              ['Qwen3-Coder 30B-A3B', 'MoE, 3B active, 256K context', '~19GB', '60–90', 'Coding when you also want a chat model resident.'],
              ['Devstral 24B', 'Dense, agent-tuned', '~14GB', '15–18', 'Tool-calling reliability. 46.8% on SWE-Bench Verified.'],
              ['gpt-oss 20B', 'MoE, 3.6B active, MXFP4', '~12GB', '55–85', 'Reasoning tasks on a small footprint.'],
              ['Gemma 4 31B-class', 'Dense, vision', '~18GB', '12–15', 'Screenshots, diagrams, anything with an image in it.'],
            ],
          },
          {
            type: 'text',
            md: "If you want three downloads rather than seven, take these: the Qwen 27B dense for quality, the Qwen3-Coder-Next 80B MoE for code, and Devstral 24B as the small reliable one for agent loops that keep breaking. That covers about 95% of what a 64GB machine is good for, and it's roughly 75GB of SSD.",
          },
          {
            type: 'compare',
            left: {
              title: 'Choose a DENSE model when',
              items: [
                'The task is hard reasoning in a small number of tokens',
                'You want maximum quality per gigabyte of RAM',
                'You need vision, which is more common in dense releases',
                'The answer is short, so decode speed barely matters',
                'You are under 20GB anyway, where dense speed is still fine',
              ],
            },
            right: {
              title: 'Choose an MoE model when',
              items: [
                'The output is long: code, documents, agent transcripts',
                'It sits inside a loop that runs dozens of turns',
                'You want breadth of knowledge more than depth of reasoning',
                'You have RAM to spare and bandwidth you do not',
                'Anything above about 35B total on this machine',
              ],
            },
          },
        ],
      },
      {
        heading: 'What Almost Fits (And Why That Is Worse Than Not Fitting)',
        blocks: [
          {
            type: 'text',
            md: "Two famous models will show up in every \"best models for 64GB\" list you read, and both are wrong for your box. Understanding why is more useful than the list itself, because the same mistake gets made with every new release.",
          },
          {
            type: 'table',
            headers: ['Model', 'The claim', 'The reality', 'Verdict'],
            rows: [
              ['gpt-oss 120B', '"Runs on 64GB Macs"', 'Needs about 66GB; measured peak 64.4GB with a tiny context. That is more than your total RAM before macOS gets any.', 'No. Needs 96GB+.'],
              ['Llama 4 Scout (109B, 17B active)', '"Fits in 64GB at Q4"', 'About 60GB of weights. Loads, then leaves nothing for the KV cache, so it dies on the first real prompt.', 'Technically loads, practically useless.'],
              ['Dense 70B at Q4', '"12 to 18 tok/s on M5 Pro"', 'Reads ~38GB per token against 307GB/s. Arithmetic caps it near 8 before efficiency losses.', 'Fits, but 5 to 7 tok/s. Skip it.'],
              ['DeepSeek V4-class (284B total)', '"Community MLX quants run great on Macs"', 'True at 128GB. At 64GB the total parameter count alone rules it out regardless of active count.', 'No. Wrong machine.'],
              ['Kimi K2.7-Code (1T total, 32B active)', '"Only 32B active, so it runs like a small model"', 'Active count sets speed, never memory. All 1T parameters must be resident: about 600GB at Q4, and still 247GB at a brutal 1.8-bit.', 'No. Off by a factor of ten.'],
              ['Kimi K3 (2.8T total, 104B active)', '"Open weights, run it yourself"', '1.56TB of weight shards. Moonshot recommends 64+ accelerators. Its 104B active would also read ~52GB per token, so even hosted it decodes slowly.', 'No. Not a single-machine model.'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The frontier-open trap',
            md: "The most exciting open-weight releases of 2026 are trillion-parameter mixture-of-experts models, and their small active counts make them sound like they belong on a laptop. They don't. Active parameters set speed and total parameters set memory, and those two numbers now sit three orders of magnitude apart. Open weights stopped meaning runnable-at-home somewhere around the 500B mark. For models in that class, rent the endpoint and keep owning the routine work, which is the same doctrine the hybrid split already told you.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Why "almost fits" fails badly',
            md: "When weights nearly fill RAM, macOS starts paging parts of the model to the SSD and reading them back on demand. Your 1TB SSD moves data at a small fraction of 307GB/s, so every paged token collapses to a crawl. The failure skips the graceful part: you go from 60 tok/s straight to 1 or 2, with the fans spinning. Leaving 15GB of headroom costs you one model tier and buys you a machine that behaves predictably.",
          },
          {
            type: 'text',
            md: "The general defense: whenever you read a model recommendation, do two checks before you trust it. Check the RAM figure against your budget, with headroom, and check the claimed tokens per second against bandwidth divided by bytes-read-per-token. Most bad advice fails one of those two tests in under thirty seconds. The habit is the point, since the model names will all have changed by next spring.",
          },
        ],
      },
      {
        heading: 'Making macOS Hand Over the Memory',
        blocks: [
          {
            type: 'text',
            md: "One configuration step stands between you and the 45GB coding model. macOS caps how much unified memory the GPU is allowed to wire down, at roughly 75% of physical RAM. On a 64GB machine that's about 48GB. Weights of 45GB plus any real KV cache blows straight through it, and you'll see a confusing out-of-memory error on a machine that appears to have plenty free.\n\nThe cap is a kernel parameter called `iogpu.wired_limit_mb`, and you can raise it with one command. No System Integrity Protection changes, no reboot, no risk that survives a restart.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Give the GPU 56GB of the 64GB, leaving 8GB for macOS.
# Value is in MB: 56 * 1024 = 57344
sudo sysctl iogpu.wired_limit_mb=57344

# Check it took
sysctl iogpu.wired_limit_mb

# Reverts on reboot. Once you trust it, make it permanent:
echo "iogpu.wired_limit_mb=57344" | sudo tee -a /etc/sysctl.conf`,
            caption: 'Raising the GPU memory ceiling. Test it first, since a reboot undoes it.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Do not set it to 64GB',
            md: "Pushing the limit to 100% of physical RAM starves macOS itself and produces beachballs, spontaneous app kills, or a hard reset that you fix by holding the power button. Leave at least 8GB, and if the machine also runs a browser and an IDE, leave 12GB. The extra 4GB of model budget is never worth a machine you can't trust to stay up overnight.",
          },
          {
            type: 'text',
            md: "Two more settings worth doing on day one, both aimed at making the mini behave like a server rather than a desktop. Turn off sleep in System Settings under Energy, since a sleeping Mac serves nothing. And raise your runtime's keep-alive so it stops unloading models after a few idle minutes: on Ollama that's `OLLAMA_KEEP_ALIVE=24h`, which turns a 40-second model reload into an instant response.",
          },
        ],
      },
      {
        heading: 'Two Models Resident: the Real Luxury of 64GB',
        blocks: [
          {
            type: 'text',
            md: "The genuine advantage of 64GB over 32GB shows up as residency: two useful models loaded at once, and never a wait for a reload.\n\nA 20GB chat model plus a 19GB coding model is 39GB, comfortably inside budget. Your editor talks to one, your terminal talks to the other, and switching costs nothing. Compare that with a single 45GB model where every context switch means eviction and a 40-second reload, or with a 32GB machine where you're constantly choosing.",
          },
          {
            type: 'table',
            headers: ['Residency plan', 'Total RAM', 'Trade-off'],
            rows: [
              ['Coder 80B-A3B alone', '~45GB', 'Best coding quality. Anything else evicts it.'],
              ['Chat 27B dense + Coder 30B-A3B', '~35GB', 'Both instant, both good. The balanced default.'],
              ['Chat 35B-A3B + Coder 30B-A3B + Devstral 24B', '~53GB', 'Three resident. Tight, but every tool has a model waiting.'],
              ['Vision 31B + Coder 30B-A3B', '~37GB', 'For design and screenshot work alongside code.'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Pick the plan before you pick the models',
            md: "Decide what should be instantly available, then choose models that fit that plan together. Downloading the biggest thing that fits and discovering later that it can never share the machine is the most common 64GB regret. The balanced default in row two is the right starting point for almost everyone.",
          },
        ],
      },
    ],
    lab: {
      title: 'Stand It Up and Measure It',
      intro:
        "Install the runtime, raise the memory ceiling, pull three models, and measure them against the predictions you made in lesson 1. The goal is a benchmark table with your own numbers in it, since every number you got from a blog is about a different machine.",
      steps: [
        'Install the runtime: `brew install ollama`. Confirm the version is 0.19 or newer with `ollama --version`, since the MLX backend arrived in 0.19 and matters a lot on Apple Silicon.',
        'Raise the GPU memory ceiling: `sudo sysctl iogpu.wired_limit_mb=57344`, then verify with `sysctl iogpu.wired_limit_mb`.',
        'Turn off sleep in System Settings > Energy, and set `OLLAMA_KEEP_ALIVE=24h` so models stop being evicted while you work.',
        'Pull three models covering three shapes: one dense 27B-class, one MoE coder, and one small agent-tuned dense model. Check current names with `ollama search` rather than trusting this lesson\'s version numbers.',
        'Benchmark each one twice: once with a short prompt, once with a realistic 10K-token prompt (paste in a real source file). Record time-to-first-token and tokens per second separately. Ollama reports both if you run with `--verbose`.',
        'Watch memory while a model runs: open Activity Monitor, sort by Memory, and note the actual footprint against your prediction. Then run a long session and watch it grow as the KV cache fills.',
        'Write `model-bench.md` with a row per model: name, RAM measured, TTFT short, TTFT at 10K, tok/s, and a one-line verdict on what you would use it for.',
        'Compare measured tok/s to the predictions from lesson 1\'s lab. Compute the efficiency factor that would have made each prediction correct, and write it down as your machine\'s constant.',
      ],
      checklist: [
        'Ollama 0.19+ installed and the wired memory limit raised and verified',
        'Three models pulled covering dense, MoE-coder, and small-agent shapes',
        'model-bench.md exists with TTFT and tok/s measured separately, at two prompt lengths',
        'I observed the KV cache growing during a long session in Activity Monitor',
        'I computed my machine\'s real efficiency factor and compared it to the 0.7 estimate',
        'I chose a two-model residency plan and confirmed both stay loaded at once',
      ],
    },
    checkQuiz: [
      {
        q: 'Why is raising iogpu.wired_limit_mb necessary before running a 45GB model on a 64GB Mac?',
        options: [
          'It unlocks the Neural Accelerators, which are disabled by default',
          'macOS caps GPU-addressable memory at about 75% of RAM, roughly 48GB, which a 45GB model plus KV cache exceeds',
          'It converts unused CPU memory into GPU memory permanently',
          'It disables memory compression, which corrupts quantized weights',
        ],
        answer: 1,
        explain:
          'The default 75% cap is about 48GB on a 64GB machine. A 45GB model fits under it with almost no room for the KV cache, so real work pushes past the ceiling and you get an out-of-memory error on a machine that looks half empty in Activity Monitor.',
      },
      {
        q: 'What is the strongest argument for keeping two mid-size models resident instead of one large one?',
        options: [
          'Two models can process the same request in parallel and vote on the answer',
          'Smaller models are always more accurate than larger ones on coding tasks',
          'Switching between an instant chat model and an instant coding model costs nothing, while a single large model evicts and reloads for 40 seconds',
          'Ollama charges per loaded model, so two small ones cost less',
        ],
        answer: 2,
        explain:
          'The practical win of 64GB is residency, not raw size. Two resident models mean your editor and your terminal each have a brain waiting. One 45GB model means every context switch pays a reload.',
      },
      {
        q: 'A new model drops. It is 96GB at 4-bit and the release post says "runs on high-memory Macs." What do you do?',
        options: [
          'Download it and see, since quantization may surprise you',
          'Check the number against your 44GB working budget, conclude it needs 128GB+, and move on',
          'Run it at Q2 to halve the size',
          'Wait for an MoE version, since MoE always reduces RAM requirements',
        ],
        answer: 1,
        explain:
          'Ninety-six gigabytes against a 44GB budget is not close, and the thirty-second arithmetic check saves you a 96GB download. Q2 would damage it badly, and MoE reduces compute rather than memory, so the fourth option gets the whole mechanism backwards.',
      },
      {
        q: 'You need a local model that can look at a screenshot of a broken UI and describe what is wrong. Which shape do you reach for?',
        options: [
          'The largest MoE coding model, since coding models understand interfaces',
          'A dense vision-capable model in the 27B to 31B class',
          'The smallest model available, since image tokens consume context',
          'Any model, since vision is a runtime feature rather than a model feature',
        ],
        answer: 1,
        explain:
          'Vision has to be trained into the model, and it shows up most reliably in dense releases like the Gemma and Qwen vision lines. A coding MoE without vision cannot see the image at all, and no runtime setting can add the capability.',
      },
    ],
    resources: [
      { label: 'Ollama model library', url: 'https://ollama.com/library', kind: 'docs' },
      { label: 'Ollama blog: the MLX backend', url: 'https://ollama.com/blog/mlx', kind: 'article' },
      { label: 'Hugging Face: mlx-community models', url: 'https://huggingface.co/mlx-community', kind: 'repo' },
      { label: 'macOS VRAM limit tool and explanation', url: 'https://github.com/moisoto/macOS-vram-limit', kind: 'repo' },
      { label: 'LM Studio model catalog', url: 'https://lmstudio.ai/models', kind: 'docs' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m9-l3: Coding against your own server
  // ────────────────────────────────────────────────────────────
  {
    id: 'm9-l3',
    title: 'Coding Against Your Own Server From Another Machine',
    day: 24,
    minutes: 60,
    xp: 130,
    objectives: [
      'Explain why a coding tool can talk to any model, and what the two competing API protocols are',
      'Serve a model to your whole network from a Mac mini, safely, and reach it from a laptop',
      'Point Claude Code at your own model, which became possible when Ollama shipped Anthropic API compatibility',
      'Choose between Claude Code, Cline, OpenCode, Aider, and Zed for local-model work, and configure each against a remote server',
      'Fix the one setting that silently breaks nearly every local coding agent',
    ],
    skipQuiz: [
      {
        q: 'Can Claude Code use a model running on your own Mac mini?',
        options: [
          'No, Claude Code only accepts Anthropic-hosted models',
          'Yes, by pointing ANTHROPIC_BASE_URL at a server that speaks the Anthropic Messages API, which Ollama has done since January 2026',
          'Only through a paid enterprise gateway license',
          'Only for autocomplete, since agent mode requires Anthropic servers',
        ],
        answer: 1,
        explain:
          'Claude Code reads its endpoint from an environment variable. Ollama added Anthropic Messages API compatibility on 16 January 2026, so it can answer those requests directly. Set the base URL and an auth token and the harness drives your local model.',
      },
      {
        q: 'What is the single most common reason a local coding agent behaves erratically, forgetting instructions and inventing file contents?',
        options: [
          'The model is too heavily quantized',
          'The context window is set too small, so the system prompt and file contents get silently truncated',
          'The network connection to the server drops between turns',
          'The agent needs a vision-capable model to read code',
        ],
        answer: 1,
        explain:
          'Runtimes ship with a small default context. A coding agent sends a large system prompt plus file contents on every turn, and anything past the limit gets dropped without an error. The model then answers from a mutilated prompt, which looks exactly like hallucination.',
      },
      {
        q: 'Your Mac mini serves a model and your laptop is on the same wifi. What has to change on the mini for the laptop to reach it?',
        options: [
          'Nothing; local model servers listen on all interfaces by default',
          'The server has to bind to 0.0.0.0 instead of 127.0.0.1, which on Ollama means setting OLLAMA_HOST',
          'The laptop must install the same model locally first',
          'Both machines must be signed into the same Apple ID',
        ],
        answer: 1,
        explain:
          'The default binding of 127.0.0.1 means "this machine only" and is a deliberate safety default. Binding to 0.0.0.0 makes the server answer requests arriving on any network interface, which is what lets the laptop connect.',
      },
      {
        q: 'Why can Cline point straight at Ollama, while Claude Code historically could not?',
        options: [
          'Cline is open source and Claude Code is not',
          'They speak different API protocols; Cline supports Ollama and OpenAI-compatible formats, while Claude Code speaks the Anthropic Messages format',
          'Cline runs inference locally inside VS Code',
          'Claude Code requires a GPU that Ollama does not expose',
        ],
        answer: 1,
        explain:
          'The wire protocol is the whole story. A tool can only talk to a server that speaks its dialect. Cline was built to speak several, Claude Code speaks Anthropic, and the gap closed when Ollama learned to answer Anthropic-format requests too.',
      },
      {
        q: 'What is the correct way to reach your model server from a coffee shop?',
        options: [
          'Forward port 11434 on your home router to the Mac mini',
          'Put both machines on a private mesh VPN like Tailscale and use its address',
          'Bind the server to 0.0.0.0 and use your home IP address',
          'Enable the runtime\'s built-in HTTPS and public authentication',
        ],
        answer: 1,
        explain:
          'Local model servers ship with no authentication, so port forwarding publishes an unauthenticated AI server to the internet. A mesh VPN gives every device a private encrypted address with no open ports, and it is free for personal use.',
      },
    ],
    sections: [
      {
        heading: 'The Brain and the Body Are Separate Purchases',
        blocks: [
          {
            type: 'text',
            md: "Everything in this lesson rests on one structural fact you met back in [Agents, Harnesses & Loops · What Is a Harness?](lesson:m2-l1): a coding agent is two products bolted together.\n\nThe **harness** is the body. It reads your files, shows you diffs, runs your tests, asks permission before it deletes something, keeps track of what it already tried, and loops until the task is done. Claude Code is a harness. Cline is a harness. All of that is ordinary software running on your laptop, and none of it does any thinking.\n\nThe **model** is the brain. It receives a big blob of text (your instructions, the file contents, the transcript so far) and returns some text back. That's the whole interface. The brain has no idea whether the body is Claude Code or Cline or a script you wrote yourself.",
          },
          {
            type: 'text',
            md: "Because the seam between them is just text over HTTP, you can swap either side. Which is why a coding tool you love can be pointed at a model on a Mac mini in your closet, and why the same model can serve four different tools at once.\n\nThe only thing that stops any tool talking to any model is dialect. Two competing formats exist for that text-over-HTTP conversation, and a tool can only talk to a server that speaks its one.",
          },
          {
            type: 'table',
            headers: ['Protocol', 'Who invented it', 'Who speaks it', 'Typical URL'],
            rows: [
              ['OpenAI Chat Completions', 'OpenAI', 'Nearly everything. The lingua franca of the industry.', 'http://host:11434/v1'],
              ['Anthropic Messages', 'Anthropic', 'Claude Code, the Anthropic SDKs, and since Jan 2026, Ollama', 'http://host:11434 (endpoint /v1/messages)'],
              ['Ollama native', 'Ollama', 'Ollama clients, Cline, Zed, Aider', 'http://host:11434/api'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why this changed in 2026',
            md: "For a couple of years, pointing Claude Code at a local model required a translation proxy called LiteLLM sitting in the middle, converting Anthropic-format requests into OpenAI-format ones. On 16 January 2026, Ollama added native Anthropic Messages API support, so the proxy disappeared from the recipe. If you find a guide that still walks you through a LiteLLM config file, it predates that change. LiteLLM is still the right answer for other backends like vLLM, which don't speak Anthropic.",
          },
        ],
      },
      {
        heading: 'Serving to the Network Without Publishing to the Planet',
        blocks: [
          {
            type: 'text',
            md: "A model server, by default, listens on `127.0.0.1`, which is the address a computer uses to mean \"me, and nobody else.\" That's a deliberate safety default, because these servers have no password.\n\nTo let your laptop connect, the server has to listen on `0.0.0.0` instead, which means \"answer requests arriving on any of my network interfaces.\" On Ollama that's controlled by the `OLLAMA_HOST` environment variable.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The macOS gotcha that wastes everyone an hour',
            md: "If you run Ollama as the menu-bar app, it does not read environment variables you export in your shell. Putting `export OLLAMA_HOST=0.0.0.0:11434` in your `.zshrc` does nothing at all, and the server keeps binding to localhost while you get increasingly confused. `launchctl setenv` works but resets on logout. The durable fix is a LaunchAgent that sets the variable and starts the server together.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# ~/Library/LaunchAgents/com.ollama.server.plist
cat > ~/Library/LaunchAgents/com.ollama.server.plist <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.ollama.server</string>
  <key>ProgramArguments</key>
  <array><string>/opt/homebrew/bin/ollama</string><string>serve</string></array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>OLLAMA_HOST</key><string>0.0.0.0:11434</string>
    <key>OLLAMA_KEEP_ALIVE</key><string>24h</string>
    <key>OLLAMA_CONTEXT_LENGTH</key><string>32768</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.ollama.server.plist

# From the laptop, confirm you can reach it:
curl http://mac-mini.local:11434/api/tags`,
            caption: 'One file makes the mini a real server: binds to the network, never unloads, and stops truncating context.',
          },
          {
            type: 'text',
            md: "Now the security part, and this one deserves more than a footnote. Local model servers ship with no authentication whatsoever. Anyone who can reach port 11434 can use your model, read anything you've cached, and burn your electricity. A joint scan in early 2026 found roughly 175,000 exposed Ollama hosts across 130 countries, all of them running open to the internet with no password.\n\nTwo rules follow. Never forward port 11434 on your router. And for anything beyond your own wifi, use a private mesh VPN instead.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Three ways to reach the mini, two of them fine</text>
  <rect x="250" y="55" width="200" height="60" fill="#27272a" stroke="#2dd4bf" stroke-width="2" rx="8"/>
  <text x="350" y="78" fill="#2dd4bf" font-size="13" font-weight="bold" text-anchor="middle">Mac mini · M5 Pro 64GB</text>
  <text x="350" y="96" fill="#a1a1aa" font-size="11" text-anchor="middle">OLLAMA_HOST=0.0.0.0:11434</text>
  <rect x="30" y="165" width="190" height="86" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="125" y="188" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Same wifi</text>
  <text x="125" y="208" fill="#e4e4e7" font-size="11" text-anchor="middle">http://mac-mini.local:11434</text>
  <text x="125" y="226" fill="#a1a1aa" font-size="10" text-anchor="middle">no ports open to internet</text>
  <text x="125" y="242" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">SAFE</text>
  <rect x="255" y="165" width="190" height="86" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="350" y="188" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Anywhere, via Tailscale</text>
  <text x="350" y="208" fill="#e4e4e7" font-size="11" text-anchor="middle">http://mini.tailnet:11434</text>
  <text x="350" y="226" fill="#a1a1aa" font-size="10" text-anchor="middle">encrypted mesh, still no open ports</text>
  <text x="350" y="242" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">SAFE</text>
  <rect x="480" y="165" width="190" height="86" fill="#27272a" stroke="#f87171" stroke-width="2" rx="8"/>
  <text x="575" y="188" fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle">Router port forward</text>
  <text x="575" y="208" fill="#e4e4e7" font-size="11" text-anchor="middle">http://your.home.ip:11434</text>
  <text x="575" y="226" fill="#a1a1aa" font-size="10" text-anchor="middle">unauthenticated AI server, public</text>
  <text x="575" y="242" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">NEVER</text>
  <line x1="320" y1="115" x2="150" y2="162" stroke="#34d399" stroke-width="2"/>
  <line x1="350" y1="115" x2="350" y2="162" stroke="#38bdf8" stroke-width="2"/>
  <line x1="380" y1="115" x2="550" y2="162" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="350" y="290" fill="#fbbf24" font-size="12" text-anchor="middle" font-weight="bold">175,000 Ollama servers were found publicly exposed in early 2026</text>
  <text x="350" y="312" fill="#a1a1aa" font-size="11" text-anchor="middle">every one of them a free GPU and a readable prompt log for whoever finds it</text>
</svg>`,
            caption: 'Bind to the network, then control who can reach the network. Those are two separate decisions.',
          },
        ],
      },
      {
        heading: 'Claude Code, Driven by Your Own Model',
        blocks: [
          {
            type: 'text',
            md: "This is the setup most people assume is impossible, and it takes about ninety seconds. Claude Code reads its endpoint from `ANTHROPIC_BASE_URL`. Point that at your mini, hand it any non-empty auth token, and the harness you already know drives a model in your closet.\n\nOllama even ships a shortcut command that sets the variables and launches Claude Code for you.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# On the laptop. The mini is serving on the LAN or over Tailscale.

# Path A: let Ollama wire it up
ollama launch claude

# Path B: do it yourself, which is what you need for a REMOTE server
export ANTHROPIC_BASE_URL=http://mac-mini.local:11434
export ANTHROPIC_AUTH_TOKEN=ollama   # required, never validated
export ANTHROPIC_API_KEY=""          # must be empty or it wins

claude --model qwen3-coder

# Snap back to the frontier at any time:
unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN`,
            caption: 'Same harness, same tools, same slash commands. Different brain, sitting on your desk.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Set the API key to empty, not unset',
            md: "If `ANTHROPIC_API_KEY` still holds a real key, the SDK may prefer it and quietly send your work to Anthropic instead of your mini. Export it as an empty string explicitly. Then verify: run a prompt and watch the mini's Activity Monitor for GPU load. No load means you're still talking to the cloud.",
          },
          {
            type: 'text',
            md: "Be honest with yourself about what you get. Claude Code's prompts, tool definitions, and loop behavior were tuned against Claude models over thousands of iterations. A local model dropped into that harness inherits none of that tuning. Simple edits work fine. Long multi-step refactors are where you'll watch it fumble tool-call formats, declare victory early, or loop re-reading the same file.\n\nThat's the compounding-failure arithmetic from [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3) showing up in practice: a per-step gap that looks small becomes a per-task gap that looks enormous by step twenty. Local models earn their keep on short, well-scoped tasks and on work you can't send to a cloud at all.",
          },
        ],
      },
      {
        heading: 'The Tool Landscape, and How to Aim Each One',
        blocks: [
          {
            type: 'text',
            md: "Claude Code is one option among several, and a few of the others were built for local models from the start rather than adapted to them. Here's the field as it stands in August 2026, with the exact setting that points each tool at a machine that isn't the one it's running on.\n\nEvery `mac-mini.local` below can be swapped for a Tailscale hostname or a bare IP address. That's the only difference between local and remote, which is the whole reason this works.",
          },
          {
            type: 'table',
            headers: ['Tool', 'What it is', 'Point it at the mini', 'Best for'],
            rows: [
              ['Claude Code', 'Terminal agent, deepest harness', 'ANTHROPIC_BASE_URL=http://mac-mini.local:11434 plus ANTHROPIC_AUTH_TOKEN', 'keeping one workflow across local and frontier'],
              ['Cline', 'VS Code extension, autonomous in-editor agent', 'Settings: provider Ollama, base URL http://mac-mini.local:11434', 'watching every diff before it lands, in an editor'],
              ['OpenCode', 'Terminal agent, provider-agnostic by design', 'opencode.json: provider baseURL http://mac-mini.local:11434/v1', 'terminal work with no vendor assumptions'],
              ['Aider', 'Terminal pair programmer, git-native', 'OLLAMA_API_BASE=http://mac-mini.local:11434', 'tight edit-review cycles on a few files'],
              ['Zed', 'Fast editor with a built-in agent panel', 'settings.json: language_models.ollama.api_url', 'a single app for editing and agent work'],
              ['LM Studio', 'GUI plus an OpenAI-compatible server', 'Enable "Serve on Local Network", bind 0.0.0.0, set an API token', 'browsing and comparing models, and a server with auth'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Two names that have died since 2025',
            md: "Continue.dev was acquired by Cursor in June 2026; v2.0.0-vscode was its final release and the repo is read-only. Roo Code was archived on 15 May 2026 when its team pivoted to a cloud agent. Both still appear near the top of search results for local coding setups. If a guide recommends either as a current tool, close it, because everything else in it is that old too.",
          },
          {
            type: 'text',
            md: "If you want one recommendation rather than six options, take this pair. Use **Claude Code** pointed at your mini for anything where you want your existing muscle memory, your skills, and your CLAUDE.md to keep working. Use **Cline** in VS Code when you want to watch every proposed edit land in a diff view before you accept it, which is the right posture with a local model you don't fully trust yet.\n\nThose two cover the terminal and the editor, they both point at a remote server with one setting, and neither locks you into anything.",
          },
        ],
      },
      {
        heading: 'The Setting That Silently Breaks Everything',
        blocks: [
          {
            type: 'text',
            md: "Here's the failure that eats an evening for nearly everyone who tries this, and the reason it's so hard to diagnose is that nothing reports an error.\n\nModel runtimes ship with a small default context window. Coding agents send an enormous prompt on every single turn: a multi-thousand-token system prompt full of tool definitions, plus the contents of every file the agent has opened, plus the whole transcript so far. When that exceeds the runtime's configured window, the runtime doesn't refuse. It quietly throws away the overflow and answers from what's left.",
          },
          {
            type: 'text',
            md: "The symptoms look exactly like a stupid model. It forgets instructions you gave two turns ago. It invents the contents of a file it just read. It calls a tool that doesn't exist, because the tool definitions were the part that got truncated. You conclude local models aren't ready, and you're actually looking at a configuration bug.\n\nThe fix is to raise the context window explicitly and confirm you have RAM for it, since context costs KV cache and KV cache costs gigabytes.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Option 1: raise it server-wide (in the LaunchAgent from earlier)
OLLAMA_CONTEXT_LENGTH=32768

# Option 2: bake a long-context variant of one model
cat > Modelfile <<'EOF'
FROM qwen3-coder:30b
PARAMETER num_ctx 32768
EOF
ollama create qwen3-coder:30b-32k -f Modelfile

# Then select the -32k tag in Cline / OpenCode / Aider.

# Aider can also be pinned per model:
#   .aider.model.settings.yml
#   - name: ollama/qwen3-coder:30b
#     extra_params:
#       num_ctx: 32768`,
            caption: 'Thirty-two thousand tokens is the working minimum for an agent. Sixteen thousand is a toy.',
          },
          {
            type: 'table',
            headers: ['Symptom', 'Looks like', 'Usually is'],
            rows: [
              ['Agent forgets earlier instructions', 'weak model', 'context truncation'],
              ['Agent hallucinates file contents it just read', 'weak model', 'context truncation'],
              ['Agent calls a nonexistent tool', 'weak model', 'system prompt truncated'],
              ['First response takes 45 seconds', 'slow model', 'prefill on a large prompt, which is normal'],
              ['Everything crawls after 20 minutes', 'thermal throttling', 'KV cache growth pushing past the memory ceiling'],
              ['Agent loops re-reading one file', 'context truncation', 'a genuine local tool-use ceiling. Escalate this task.'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Diagnose in this order',
            md: "Raise the context window first, because it explains most of the list above and costs nothing to test. Then check memory headroom in Activity Monitor. Only after both come back clean should you conclude the model itself is the limit, and only then does escalating the task to a frontier model tell you anything real.",
          },
        ],
      },
      {
        heading: 'What This Setup Is Actually For',
        blocks: [
          {
            type: 'text',
            md: "A Mac mini serving models to your network is genuinely useful, and it's useful for narrower reasons than the enthusiast videos suggest. Community reports put a good local coding model at roughly 70% to 85% of cloud-frontier quality on everyday single-file work, with a much wider gap on multi-file reasoning. That ratio is the whole basis for deciding what to send where.",
          },
          {
            type: 'compare',
            left: {
              title: 'Send it to the mini',
              items: [
                'Code you are contractually barred from sending to an API',
                'Bulk mechanical edits across many files',
                'Anything you run in a loop dozens of times a day',
                'Work on a plane, or during an outage',
                'Experiments where you would hesitate at the meter running',
              ],
            },
            right: {
              title: 'Keep it on the frontier',
              items: [
                'Multi-file refactors that must land correctly',
                'Debugging where the answer is genuinely unclear',
                'Long agent runs with twenty-plus dependent steps',
                'Anything where your review time costs more than the tokens',
                'Design and architecture calls that set direction',
              ],
            },
          },
          {
            type: 'text',
            md: "One more use that gets overlooked, and it may end up the best one. The mini is always on and costs nothing per token, which makes it the right home for scheduled work: indexing your notes for retrieval overnight, classifying inbound mail, summarizing a repository's commits each morning, running the first pass over anything before you look at it. None of that needs frontier reasoning, all of it involves private data, and all of it would feel wasteful metered by the token.\n\nThe coding agent is the flashy demo. The 3am cron job is the thing you'll still be running in a year.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The doctrine, one line',
            md: "Own the routine, rent the hard part. Your mini absorbs volume, privacy, and experimentation at zero marginal cost. One frontier subscription covers the work where being right the first time is the product you're buying. Write the split down once, as [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3) argues, and stop re-deciding it every prompt.",
          },
        ],
      },
    ],
    lab: {
      title: 'Code From the Laptop, Think on the Mini',
      intro:
        "Serve the model from the mini, drive it from a different machine with two different tools, and run the same task on both plus a frontier model. You end up with a working setup and an evidence-based opinion about where its edges are.",
      steps: [
        'On the mini: install the LaunchAgent from this lesson so Ollama binds to 0.0.0.0 with a 24h keep-alive and a 32K context length. Reboot the mini and confirm the server comes back on its own.',
        'From the laptop, on the same wifi: `curl http://mac-mini.local:11434/api/tags` and confirm you get a model list back. If that fails, the rest of the lab cannot work, so fix it before continuing.',
        'Install Tailscale on both machines and repeat the curl using the Tailscale hostname. Then turn off wifi on the laptop, tether to your phone, and do it a third time. That third success is the one that matters.',
        'Point Claude Code at the mini: export ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, and an empty ANTHROPIC_API_KEY, then run `claude --model <your-coder>`. Verify the mini\'s GPU load spikes while it thinks, so you know the traffic is really going there.',
        'Give it a real, scoped task in a scratch repo: add a function plus a passing unit test to an existing file. Watch the whole loop, not just the diff.',
        'Install Cline in VS Code, set provider Ollama with the mini\'s base URL, select your 32K-context model variant, and run the identical task. Note which tool handled the local model better and why.',
        'Run the same task a third time on frontier Claude Code with the overrides unset. Time all three and note quality differences honestly, including anywhere local held its own.',
        'Deliberately break it: switch to a model variant with the default small context and rerun the task. Record what the failure looks like from the outside so you recognize it next time.',
        'Write `local-coding-setup.md`: the exact config for each tool, the three timings, the failure signature of a truncated context, and three task classes you will route to the mini from now on.',
      ],
      checklist: [
        'The mini serves on the network after a reboot with no manual start',
        'The laptop reached the model over Tailscale while off the home network',
        'Claude Code completed a full task against the local model, verified by GPU load on the mini',
        'Cline completed the same task against the same server',
        'I ran the identical task on a frontier model and recorded all three timings',
        'I reproduced the truncated-context failure on purpose and wrote down what it looks like',
        'local-coding-setup.md exists with configs, timings, and three routing rules',
      ],
    },
    checkQuiz: [
      {
        q: 'Why does pointing Claude Code at a local model work at all?',
        options: [
          'Claude Code bundles a small local model as a fallback',
          'The harness and the model are separate; Claude Code sends text over HTTP to whatever address ANTHROPIC_BASE_URL names',
          'Anthropic licenses open models for offline use inside the CLI',
          'Ollama reimplements Claude Code\'s tool loop on the server side',
        ],
        answer: 1,
        explain:
          'The harness is ordinary local software that speaks HTTP to a model endpoint. Change the endpoint and the same body gets a different brain. The only requirement is that the server answers in the dialect the harness speaks, which Ollama learned to do in January 2026.',
      },
      {
        q: 'Your agent keeps inventing the contents of files it opened moments ago. What do you check first?',
        options: [
          'Whether the model needs a higher quantization level',
          'Whether the context window is large enough for the system prompt plus file contents',
          'Whether the network between the laptop and the mini is dropping packets',
          'Whether the repository has too many files for the agent to index',
        ],
        answer: 1,
        explain:
          'Context truncation is silent: the runtime discards the overflow and answers from what remains, which is indistinguishable from hallucination. Raise num_ctx or OLLAMA_CONTEXT_LENGTH to 32K and retest before blaming the model.',
      },
      {
        q: 'You want to use your mini\'s model from a hotel. What is the right approach?',
        options: [
          'Forward port 11434 through your home router and use your public IP',
          'Join both machines to a private mesh VPN and use its hostname',
          'Bind the server to 0.0.0.0 and rely on your ISP\'s firewall',
          'Copy the model file to the laptop before you travel',
        ],
        answer: 1,
        explain:
          'These servers have no authentication, so a port forward publishes an open AI server and a readable prompt history to anyone who scans for it. A mesh VPN gives you an encrypted private address with no open ports, which is why the 175,000 exposed hosts found in early 2026 are a cautionary tale rather than a normal setup.',
      },
      {
        q: 'Which task belongs on the mini rather than a frontier model?',
        options: [
          'A twenty-step refactor across eight files that must land correctly today',
          'An overnight job that summarizes and classifies your private notes',
          'Debugging a race condition nobody on the team understands',
          'Deciding the architecture for a new service',
        ],
        answer: 1,
        explain:
          'The overnight job is high volume, involves private data, tolerates a rough first pass, and would feel wasteful metered by the token. The other three are exactly where per-step reliability compounds into per-task success or failure, which is what a frontier subscription buys.',
      },
    ],
    resources: [
      { label: 'Ollama: Anthropic API compatibility', url: 'https://docs.ollama.com/api/anthropic-compatibility', kind: 'docs' },
      { label: 'Claude Code docs', url: 'https://code.claude.com/docs', kind: 'docs' },
      { label: 'Cline documentation', url: 'https://docs.cline.bot/', kind: 'docs' },
      { label: 'OpenCode: providers', url: 'https://opencode.ai/docs/providers/', kind: 'docs' },
      { label: 'Aider with Ollama', url: 'https://aider.chat/docs/llms/ollama.html', kind: 'docs' },
      { label: 'Zed: use a local model', url: 'https://zed.dev/docs/ai/use-a-local-model', kind: 'docs' },
      { label: 'LM Studio: serve on local network', url: 'https://lmstudio.ai/docs/developer/core/server/serve-on-network', kind: 'docs' },
      { label: 'Tailscale', url: 'https://tailscale.com/', kind: 'docs' },
    ],
  },
]
