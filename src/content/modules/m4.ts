import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────
  // m4-l1: The Open-Model Landscape 2026
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l1',
    title: 'The Open-Model Landscape 2026',
    day: 17,
    minutes: 60,
    xp: 100,
    objectives: [
      'Name the leading open-weight models of September 2026 and sort them into the ones a Mac can run and the ones that need a data center',
      'Work out whether a model fits a given Mac by doing the RAM arithmetic yourself: parameter count, quantization level, and KV cache',
      'Explain why a mixture-of-experts model pays RAM for every parameter but compute only for its active ones, and when a dense 27B is still the better pick',
      'Explain what an inference engine like Splash does, and how speculative decoding lets it generate faster than the memory-bandwidth math predicts',
      'Spot which local-model advice from 2024 through early 2026 has gone stale, and explain why it expired',
    ],
    skipQuiz: [
      {
        q: 'DeepSeek V4-Flash is a mixture-of-experts model with 284B total parameters and 13B active. What determines how much RAM it needs?',
        options: [
          'Only the 13B active parameters; the rest stream in from disk whenever they are needed',
          'The KV cache size, which is the biggest memory cost in mixture-of-experts models',
          'All 284B parameters, because every expert has to sit in memory the whole time (roughly 150-170GB at Q4)',
          'Roughly half the total, because the router automatically pages out the experts it is not using',
        ],
        answer: 2,
        explain:
          'The router picks a different set of experts for every single token, so every expert has to be loaded into RAM and waiting the whole time. You pay for all 284B in memory, but each token only runs through about 13B worth of math. Memory cost and compute cost are two separate bills.',
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
        q: 'Qwen3.8-27B at Q4_K_M is about 16GB of weights plus a 0.9GB vision add-on. Does it fit a 32GB Mac for everyday chat?',
        options: [
          'No: a 27B model needs 27GB at minimum, one gigabyte per billion parameters',
          'Yes: about 17GB of weights plus a few GB of KV cache lands near 20GB, inside the ~22GB left after macOS',
          'No: vision models need a separate graphics card that Macs do not have',
          'Only at Q2, which is the smallest file that leaves room for macOS',
        ],
        answer: 1,
        explain:
          'Start from 32GB, set aside about 10GB for macOS and your apps, and you have roughly 22GB to spend. The weights and vision add-on come to about 17GB, and a normal-length conversation adds 2-3GB of KV cache. Around 20GB total: it fits with a little room to spare, at the quality-safe Q4 level.',
      },
      {
        q: 'Which license pairing is correct for September 2026?',
        options: [
          'Qwen3.8-27B is Apache 2.0, and GLM-5.3 ships under its own custom GLM-5.3 license',
          'Qwen3.8-27B is research-only, and GLM-5.3 is MIT like every GLM before it',
          'Both use the Llama Community License',
          'Gemma 4 still uses the restrictive Gemma terms, and DeepSeek V4 is Apache 2.0',
        ],
        answer: 0,
        explain:
          'Qwen3.8-27B shipped under Apache 2.0, a genuinely permissive license. GLM-5.3 broke from its MIT-licensed predecessors with a bespoke license that adds conditions for the very largest cloud providers, while its smaller sibling GLM-5.3-Flash stayed MIT. Gemma 4 moved to Apache 2.0, and DeepSeek V4 is MIT. The lesson: read each license, because the word open no longer tells you the terms.',
      },
      {
        q: 'What is Splash, released by Inco AI in September 2026?',
        options: [
          'A new 27B open-weight model that beats Qwen3.8 on coding benchmarks',
          'A quantization format that replaces GGUF on Apple Silicon',
          'A public leaderboard that ranks local models by speed',
          'A Mac inference engine built around two specific Qwen models, using per-model speculative decoding to roughly double generation speed',
        ],
        answer: 3,
        explain:
          'Splash is software that runs models, in the same family as Ollama and LM Studio. Its bet is specialization: it supports only Qwen3.8-27B and Qwen3.6-35B-A3B, with GPU code written for their exact shapes and a small draft model trained for each. The maker reports about 2x the single-request speed of the next-fastest Mac engine.',
      },
    ],
    sections: [
      {
        heading: "Who's Who in Open Weights (September 2026)",
        blocks: [
          {
            type: 'text',
            md: "Quick vocabulary before the map. A model's **weights** are the billions of numbers that make up its trained brain. **Parameters** means the same thing, and model sizes like 27B just count them (27 billion). An **open-weight model** is one where the maker publishes those numbers, so anyone can download the file and run the model on their own computer. Claude keeps its weights private, which is why you can only reach it over the internet.\n\nOne more term you'll see constantly: **inference** means running a model to get answers out of it, as opposed to training it. When someone says 'local inference', they mean the model does its thinking on your Mac instead of in a data center.\n\nHere's the headline if you skipped the summer: open models kept closing the gap. Alibaba's biggest open release, Qwen3.8-Max, scores 87.3% on the SWE-bench coding test (vendor-reported), within a couple of points of the best closed models. The flip side is size. The top of the open field has gone trillion-scale, so the most capable open models are now downloadable by anyone and runnable by almost nobody at home. That splits the landscape into two very different lists.",
          },
          {
            type: 'text',
            md: "The first list is what actually runs on a Mac you might own. Read it left to right: how big the model is, what the license lets you do, why you'd care, and how much Mac it takes. In the size column, **dense** means the plain design where the whole model works on every word. **Active** will make full sense in the MoE section below; for now, know that some models only use a small slice of themselves per word they generate, and that slice is what 'active' counts.",
          },
          {
            type: 'table',
            headers: ['Model', 'Size (total and active)', 'License', 'Why it matters', 'Min Mac RAM at Q4'],
            rows: [
              ['Qwen3.8-27B', '27B dense', 'Apache 2.0', 'The new local quality leader (August 14, 2026). Reads images and video, 262K-token context, big jumps on coding and computer-use tests', '32GB (~17GB of weights)'],
              ['Qwen3.6-35B-A3B', '35B total, 3B active', 'Apache 2.0', 'The speed pick: 73.4% on SWE-bench Verified while running 3-4x faster than a dense 27B', '32GB (~20GB)'],
              ['Gemma 4 31B', '31B dense', 'Apache 2.0', "Google's multimodal model, 256K context, 140+ languages. Its license got much friendlier with this release", '32GB (~18-20GB)'],
              ['Gemma 4 26B-A4B', '26B total, 4B active', 'Apache 2.0', 'The faster Gemma: MoE layout, same image skills', '32GB (~15-18GB)'],
              ['Devstral 24B', '24B dense', 'Apache 2.0', 'Built to be a local coding agent; dependable at tool calls', '32GB (~14GB)'],
              ['gpt-oss 20B', '21B total, 3.6B active', 'Apache 2.0', "OpenAI's small open model, still the best reasoning per gigabyte at the low end. No successor a year after launch", '16GB (~12GB)'],
            ],
          },
          {
            type: 'text',
            md: "The second list is the big leagues. Everything here can be downloaded, and the smaller half runs on a high-end Mac Studio. The rest needs a rack of data-center GPUs (graphics processors like NVIDIA's H100 and B200, which cost tens of thousands of dollars each). You'll still meet these names constantly, because cloud providers host them cheaply and they set the bar the small models chase.",
          },
          {
            type: 'table',
            headers: ['Model', 'Size (total and active)', 'License', 'Why it matters', 'What it takes'],
            rows: [
              ['gpt-oss 120B', '117B total, 5.1B active', 'Apache 2.0', 'Strong reasoning, fast for its size', 'About 65GB of weights: a 96-128GB Mac. It does NOT fit 64GB, whatever older guides say'],
              ['DeepSeek V4-Flash', '284B total, 13B active', 'MIT', '1M-token context and a permissive license', '~100-170GB depending on quantization; 18-22 tok/s measured on a 256GB Mac Studio'],
              ['GLM-5.3-Flash', '320B total, 18B active', 'MIT', "Z.ai's coding family in a size a very large Mac can hold, despite the name", '~178GB at 4-bit: a 192GB+ Mac'],
              ['GLM-5.3', '753B MoE', 'Custom GLM-5.3 license', 'Tops the open coding benchmarks (Terminal-Bench 2.1, DeepSWE). Released August 28, 2026', 'Eight data-center GPUs'],
              ['DeepSeek V4-Pro', '1.6T total, 49B active', 'MIT', "DeepSeek's full-strength model", 'A multi-GPU cluster'],
              ['Kimi K3', '2.8T total, 50B active', 'Modified MIT', "Moonshot AI's July 16 release: the largest open-weight model yet, 1M context, reads images", 'Around 16 B200 GPUs'],
              ['Qwen3.8-Max', '2.4T total, 95B active', 'Custom Qwen license', 'Leads the open rankings at BenchLM (71.8). Weights published mid-August as Qwen3.8-2.4T-A95B', 'Over 1TB just to load: 8+ data-center GPUs'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: "'Open' no longer means one license",
            md: "A year ago almost every serious open model shipped under Apache 2.0 or MIT, both of which let you use, modify, and sell anything you build. The biggest 2026 releases added strings. GLM-5.3 has its own license that adds a security review for cloud providers above a $10 billion threshold. Qwen3.8-Max requires products with more than 100 million monthly users or $20 million in monthly revenue to display the model's name. Kimi K3 uses a 'modified MIT'. None of that bites a solo consultant, but if you ever build a product on one of these for a client, the license column matters as much as the benchmark column.",
          },
        ],
      },
      {
        heading: 'Spotlight: Qwen3.8-27B',
        blocks: [
          {
            type: 'text',
            md: "Alibaba announced the Qwen3.8 family on August 3, 2026 and promised open weights within a week. The 27B slipped past that date, which set off a few days of 'is it coming at all?' chatter, then landed on [Hugging Face](https://huggingface.co/Qwen/Qwen3.8-27B) on August 14 under Apache 2.0. It's the most important local release of the year for a Mac owner, and the reasons are worth unpacking one at a time.\n\n**It's dense, and 27B is the size that fits.** At Q4 the weights come to about 16GB, which lands comfortably on a 32GB Mac and leaves a 64GB Mac room for a second model alongside it.\n\n**It sees.** Qwen3.8-27B reads images and video natively, so you can hand it a screenshot of an error dialog or a photo of a whiteboard. A year ago you needed a separate vision model for that.\n\n**Long conversations cost less memory than they used to.** Most models keep a growing record of the whole conversation in every layer; that record is the KV cache you'll meet in the quantization section. Qwen3.8-27B uses a hybrid design: only 16 of its 64 layers keep that growing record, and the other 48 use a compact fixed-size memory instead. The practical upshot is a 262K-token context window that doesn't swallow your RAM at ordinary lengths.\n\n**It thinks before answering by default.** Like most 2026 models, it writes out hidden reasoning before its final answer. You can dial that effort down per request when you want speed over depth.",
          },
          {
            type: 'text',
            md: "The jump over its predecessor, Qwen3.6-27B, is large for a four-month gap. The four tests below all measure agent-style work, meaning the model has to take actions and check results instead of answering a single question:\n\n- [SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public) hands the model real bugs from real open-source projects and checks whether its fix passes the project's tests. It's the harder successor to SWE-bench Verified.\n- [Terminal-Bench](https://www.tbench.ai) gives it jobs to finish at a command line.\n- [OSWorld](https://os-world.github.io) makes it operate a real desktop computer from screenshots, clicking and typing.\n- [WebArena](https://webarena.dev) has it complete tasks on working websites.",
          },
          {
            type: 'table',
            headers: ['Test (higher is better)', 'Qwen3.6-27B', 'Qwen3.8-27B', 'Change'],
            rows: [
              ['SWE-bench Pro (fix real bugs)', '53.5', '61.7', '+8.2'],
              ['Terminal-Bench (command-line jobs)', '63.4', '73.0', '+9.6'],
              ['OSWorld (operate a desktop)', '63.9', '84.3', '+20.4'],
              ['WebArena (use websites)', '48.8', '64.8', '+16.0'],
            ],
          },
          {
            type: 'text',
            md: "Those numbers come from Alibaba's own model card, so treat them as the vendor's best case. Independent reviewers have broadly agreed it's the model to beat in its size class, though nobody has run a clean same-harness comparison against Gemma 4 31B yet.\n\nNow the catch, and it's a big one on a Mac. A dense model reads all of its weights from memory for every single token it writes. The speed limit is your memory bandwidth (how many gigabytes per second the chip can pull out of RAM) divided by the size of the weights. Walk it on two real machines:\n\n- A base M4 Mac mini moves about 120GB/s. Divide by 16GB of weights and you get about 7 passes per second, and real-world overhead drags that down. One independent test measured 5-6 tokens per second, fine for drafting and painful for an agent loop.\n- An M5 Pro moves 307GB/s. 307 divided by 16 is about 19, and at a typical 70% efficiency you land around 13-16 tokens per second, roughly a comfortable reading pace.\n\nThat arithmetic is walked in full, with every model on the shortlist, in [Bonus: Your Own Model Server · Picking Models for a 64GB Mac mini](lesson:m9-l2). Hold on to the 13-16 number, because the Splash section below is going to beat it by a wide margin, and you'll want to know how.",
          },
        ],
      },
      {
        heading: 'MoE Math: Why 35B Runs Like 3B',
        blocks: [
          {
            type: 'text',
            md: "**Mixture-of-experts** (MoE) is the design trick that made big models runnable on a Mac, so it's worth understanding properly. In a normal dense model, every parameter does work on every token. An MoE model instead splits most of its bulk into dozens of specialist sub-networks called **experts**, plus a small **router** that reads each incoming token and wakes up only a few experts to handle it.\n\nPicture a hospital that keeps every specialist on staff around the clock but only pages a couple of them per patient. Each patient sees just two doctors, so care is fast. The hospital still needs a room for every specialist, though, because the next patient might need any of them. MoE models work the same way: the router picks different experts for every token, so **all** the experts must sit in RAM, ready to go. You only pay compute for the few that actually got woken up.\n\nThat's why the name Qwen3.6-35B-A3B decodes as '35 billion parameters total, about 3 billion active per token'. Memory cost: all 35B, about 20GB at Q4. Speed: roughly that of a 3B model. On the same Mac, the speed gap is dramatic. One tester on a 64GB M1 Max measured the 35B-A3B at 61 tokens per second and its dense 27B sibling at 17, a 3.7x difference.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">MoE: RAM pays for ALL experts, compute pays for ACTIVE ones</text>
  <rect x="30" y="55" width="420" height="200" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="240" y="80" fill="#a1a1aa" font-size="13" text-anchor="middle">Unified memory: every expert resident (the TOTAL count)</text>
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
  <text x="585" y="235" fill="#a1a1aa" font-size="11" text-anchor="middle">scales with ACTIVE params</text>
  <line x1="500" y1="125" x2="455" y2="125" stroke="#a78bfa" stroke-width="2"/>
  <polygon points="455,125 465,120 465,130" fill="#a78bfa"/>
  <line x1="585" y1="160" x2="585" y2="185" stroke="#34d399" stroke-width="2"/>
  <polygon points="585,185 580,175 590,175" fill="#34d399"/>
  <text x="350" y="300" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">DeepSeek V4-Flash (284B-A13B): ~160GB of RAM, but generates like a 13B model</text>
  <text x="350" y="322" fill="#a1a1aa" font-size="12" text-anchor="middle">Qwen3.6-35B-A3B: ~20GB in RAM, 3B of compute per token: why it flies on a 32GB Mac</text>
</svg>`,
            caption: 'The MoE bargain: memory cost follows total parameters, speed follows active parameters.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'How to read MoE model names, and when dense still wins',
            md: "Read the name as **total/active**. 284B-A13B means 284B parameters resident in RAM with about 13B doing work per token. 35B-A3B means roughly 20GB sitting in memory with the speed of a tiny 3B model.\n\nSo why is the dense Qwen3.8-27B the headline and not the faster MoE? Answer quality. For the same memory footprint, a dense model puts every parameter to work on every word, and in 2026 the best 27B dense models give noticeably better answers than the 35B-A3B class. The usual split: dense for the answer you'll read carefully, MoE for bulk work and long agent loops where speed compounds.",
          },
        ],
      },
      {
        heading: 'Quantization and the RAM Budget',
        blocks: [
          {
            type: 'text',
            md: "Models are trained with each weight stored as a 16-bit number, a format called **fp16** (or its close cousin **BF16**) that costs two bytes per weight. At that precision a 27B model needs about 52GB just for its weights. **Quantization** shrinks each weight down to fewer bits, the way a photo exported at lower quality takes less disk space. Squash every weight to about 4 bits and that same 27B model drops to roughly 16GB. The wild part is how little quality you lose on the way down.\n\nTwo bits of jargon you'll meet the moment you go download something. [GGUF](https://huggingface.co/docs/hub/gguf) is the standard file format for quantized models; think of it as the zip file of local AI, readable by most Mac tools. **Q4_K_M** is the name of the most popular quantization recipe inside that format: about 4.5 bits per weight, with outputs nearly indistinguishable from the full-precision original for most models.\n\nHere are the real published file sizes for Qwen3.8-27B at each level:",
          },
          {
            type: 'table',
            headers: ['Precision', 'Bits per weight', 'Qwen3.8-27B weighs', 'Quality'],
            rows: [
              ['BF16 (as trained)', '16', '~52GB', 'The reference point; full quality'],
              ['Q8_0', '8', '~27GB', 'Basically indistinguishable from BF16'],
              ['Q6_K', '~6.5', '~21GB', 'A comfortable middle if you have the room'],
              ['Q4_K_M', '~4.5', '~16GB (+0.9GB for vision)', 'The default: tiny quality loss for most models'],
              ['Q2_K', '~2.5', '~10GB', 'Noticeably dumber; avoid unless desperate'],
            ],
          },
          {
            type: 'text',
            md: "Now the arithmetic. Three ingredients decide whether a model fits your Mac:\n\n- Weights: parameter count times 0.5-0.6 GB per billion at Q4. A 27B model lands around 15-16GB.\n- **KV cache**: the model's scratch memory for the current conversation. The attention mechanism keeps a record (the 'keys' and 'values') for every token in the context window, so this grows as the chat grows. Budget an extra 10-30% on top of the weights. Hybrid designs like Qwen3.8's sit at the low end of that range.\n- Everything else on your Mac: macOS plus your browser and apps want 8-12GB for themselves.\n\nLet's walk one example on a 32GB Mac. Start with 32GB, subtract 10GB for the system, and you have about 22GB of budget. Qwen3.8-27B at Q4_K_M is about 17GB once you include the vision add-on, plus maybe 3GB of KV cache for a decent-length session. Total: around 20GB. It fits, with a little breathing room. A dense 70B model at Q4 wants about 40GB for weights alone, so on this machine it's out of the question.",
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
            md: "Here's the Apple-specific piece. On a typical PC, the graphics card has its own separate memory (VRAM), and models have to fit inside that. Apple Silicon Macs use **unified memory** instead: one pool of RAM shared by the CPU and the GPU. So your Mac's RAM number is also your model ceiling, full stop. No separate graphics card to upgrade, no workaround.\n\nThe ladder below shows what genuinely runs well in each tier at Q4. 'Genuinely runs' means it loads AND leaves room for the system to breathe. Plenty of models will technically load one tier below where they belong, and then grind your machine to a halt swapping memory to disk. The classic trap is gpt-oss 120B on a 64GB Mac: its file is about 65GB, which is more than the whole machine before macOS takes its share.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 470" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="470" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The unified-memory ladder: RAM tier sets your model ceiling</text>
  <rect x="110" y="50" width="560" height="62" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/>
  <text x="98" y="86" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="end">192-256GB</text>
  <text x="130" y="75" fill="#e4e4e7" font-size="12">GLM-5.3-Flash (~178GB at 4-bit), DeepSeek V4-Flash (~160GB)</text>
  <text x="130" y="98" fill="#a1a1aa" font-size="11">Mac Studio territory: 300B-class MoE at 18-22 tok/s</text>
  <rect x="110" y="122" width="460" height="62" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="98" y="158" fill="#34d399" font-size="14" font-weight="bold" text-anchor="end">96-128GB</text>
  <text x="130" y="147" fill="#e4e4e7" font-size="12">gpt-oss 120B (~65GB), 70B dense at Q8</text>
  <text x="130" y="170" fill="#a1a1aa" font-size="11">V4-Flash squeezes in at an aggressive ~97GB quant</text>
  <rect x="110" y="194" width="380" height="62" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="98" y="230" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="end">64GB</text>
  <text x="130" y="219" fill="#e4e4e7" font-size="11">Qwen3.8-27B at Q8, Qwen3-Coder-Next 80B-A3B</text>
  <text x="130" y="242" fill="#a1a1aa" font-size="11">two models loaded at once; NOT gpt-oss 120B</text>
  <rect x="110" y="266" width="310" height="62" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="98" y="302" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end">32GB</text>
  <text x="130" y="291" fill="#e4e4e7" font-size="11">Qwen3.8-27B, Qwen3.6-35B-A3B, Gemma 4</text>
  <text x="130" y="314" fill="#a1a1aa" font-size="11">where 2026's best local models live</text>
  <rect x="110" y="338" width="230" height="62" fill="#27272a" stroke="#f472b6" stroke-width="2" rx="8"/>
  <text x="98" y="374" fill="#f472b6" font-size="14" font-weight="bold" text-anchor="end">16GB</text>
  <text x="130" y="363" fill="#e4e4e7" font-size="11">gpt-oss 20B, Gemma 4 E4B</text>
  <text x="130" y="386" fill="#a1a1aa" font-size="11">small models, real work</text>
  <text x="350" y="432" fill="#e4e4e7" font-size="12" text-anchor="middle">Above the ladder: Kimi K3, GLM-5.3, DeepSeek V4-Pro, Qwen3.8-Max</text>
  <text x="350" y="452" fill="#a1a1aa" font-size="11" text-anchor="middle">downloadable, but they need racks of data-center GPUs</text>
</svg>`,
            caption: 'Each bar is a Mac RAM tier; wider bar, bigger models. Sizes assume Q4 unless noted.',
          },
          {
            type: 'table',
            headers: ['Mac RAM', 'What genuinely runs', 'Examples'],
            rows: [
              ['16GB', '7-14B dense, small MoE', 'gpt-oss 20B (~12GB), Gemma 4 E4B'],
              ['32GB', '24-31B dense, 30B-class MoE', 'Qwen3.8-27B, Qwen3.6-35B-A3B, Gemma 4 31B and 26B-A4B, Devstral'],
              ['64GB', 'The 32GB models at Q8, two at once, or an 80B-A3B MoE', 'Qwen3-Coder-Next 80B-A3B (~45GB). A 70B dense fits but crawls at 5-7 tok/s'],
              ['96-128GB', '120B-class MoE', 'gpt-oss 120B (~65GB); DeepSeek V4-Flash at an aggressive quant'],
              ['192-256GB', '300B-class MoE', 'GLM-5.3-Flash (~178GB), DeepSeek V4-Flash (~160GB)'],
            ],
          },
          {
            type: 'text',
            md: "Your M5 Pro Mac mini sits on the 64GB rung, which in September 2026 is a very good place to be. Every model in the 32GB row runs at a higher-quality 8-bit setting, or you can keep a quality model and a speed model loaded side by side. The 70B dense is the trap on this rung: it loads, and then the bandwidth math gives you 5-7 tokens per second. For the rungs above this one, and why buying your way up them rarely pays, see [Local Models · The Hardware Ladder & the Install Business](lesson:m4-l4).",
          },
        ],
      },
      {
        heading: 'The Engine Matters Too: Splash',
        blocks: [
          {
            type: 'text',
            md: "Everything so far has been about the model file. The other half of local AI is the **inference engine**: the program that loads those weights into memory and runs the math that turns your prompt into words. Ollama, LM Studio, llama.cpp, and Apple's MLX are all engines, and [Local Models · Running Models on Your Mac](lesson:m4-l2) walks through them. Until this month, the engine felt like a detail. They all read the same files, and the speed differences were modest.\n\n[Splash](https://inco.ai/blog/splash/), released by Inco AI on September 17, 2026, makes the engine the headline. It's free and open source (Apache 2.0), and it makes the opposite bet from every other Mac engine. Ollama tries to run thousands of models reasonably well. Splash runs exactly two, Qwen3.8-27B and Qwen3.6-35B-A3B, and tries to run them as fast as the hardware allows. Two things make that possible.\n\n**Hand-fitted GPU code.** The small programs that do the math on the GPU are called **kernels**. General engines use kernels written to handle any model shape. Splash generates kernels for the exact dimensions of its two models, the way a tailored suit fits better than one off the rack.\n\n**Speculative decoding, built in.** This is the big one, and it's the answer to the question the Qwen3.8 spotlight left hanging: how can anything beat the bandwidth speed limit?",
          },
          {
            type: 'text',
            md: "Recall the limit: a dense model has to read all of its weights once for every token it writes, and reading 16GB takes time. The trick is that one read can **check** many tokens almost as cheaply as it can **write** one. So you add a tiny, fast **draft model** (about 1.2GB for Splash's Qwen3.8-27B) whose only job is to guess what the big model is about to say.\n\nWalk one round. The big model has written 'The meeting is'. The draft model races ahead and guesses the next six words: 'moved to Thursday at noon because'. The big model then reads its weights once and checks all six guesses in that single pass. It agrees with 'moved to Thursday at' and disagrees at 'noon', where it would have said '3pm'. So it keeps the four words it agreed with, adds its own '3pm', and throws the rest away. Result: five words of output for the price of one weight read. The words are exactly what the big model would have written on its own, so quality doesn't change at all; only the speed does.\n\nSplash's version of this is called DFlash 2, which guesses a whole block of tokens at once, and every supported model ships with its own draft trained specifically to imitate it. Better imitation means more guesses survive each check, and more surviving guesses means more speed.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="350" y="30" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Speculative decoding: guess cheap, check in bulk</text>
  <rect x="30" y="60" width="180" height="80" fill="#27272a" stroke="#a78bfa" stroke-width="2" rx="8"/>
  <text x="120" y="88" fill="#a78bfa" font-size="13" font-weight="bold" text-anchor="middle">1. Draft model</text>
  <text x="120" y="108" fill="#a1a1aa" font-size="11" text-anchor="middle">tiny (~1.2GB), very fast</text>
  <text x="120" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">guesses the next 6 words</text>
  <rect x="260" y="60" width="180" height="80" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="350" y="88" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">2. Big model checks</text>
  <text x="350" y="108" fill="#a1a1aa" font-size="11" text-anchor="middle">reads its 16GB of weights ONCE</text>
  <text x="350" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">scores all 6 guesses together</text>
  <rect x="490" y="60" width="180" height="80" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="580" y="88" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">3. Keep the agreed run</text>
  <text x="580" y="108" fill="#a1a1aa" font-size="11" text-anchor="middle">keep guesses up to the first miss,</text>
  <text x="580" y="126" fill="#a1a1aa" font-size="11" text-anchor="middle">then add the big model's word</text>
  <line x1="210" y1="100" x2="252" y2="100" stroke="#a1a1aa" stroke-width="2"/>
  <polygon points="258,100 248,95 248,105" fill="#a1a1aa"/>
  <line x1="440" y1="100" x2="482" y2="100" stroke="#a1a1aa" stroke-width="2"/>
  <polygon points="488,100 478,95 478,105" fill="#a1a1aa"/>
  <path d="M580 140 L580 165 L120 165 L120 146" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-dasharray="5,4"/>
  <polygon points="120,140 115,150 125,150" fill="#a1a1aa"/>
  <text x="350" y="160" fill="#a1a1aa" font-size="11" text-anchor="middle">repeat from the new end of the text</text>
  <text x="30" y="200" fill="#e4e4e7" font-size="12">Draft guesses after 'The meeting is':</text>
  <rect x="30" y="212" width="85" height="32" fill="#34d399" rx="4"/>
  <text x="72" y="233" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">moved</text>
  <rect x="122" y="212" width="85" height="32" fill="#34d399" rx="4"/>
  <text x="164" y="233" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">to</text>
  <rect x="214" y="212" width="85" height="32" fill="#34d399" rx="4"/>
  <text x="256" y="233" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">Thursday</text>
  <rect x="306" y="212" width="85" height="32" fill="#34d399" rx="4"/>
  <text x="348" y="233" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">at</text>
  <rect x="398" y="212" width="85" height="32" fill="#f87171" rx="4"/>
  <text x="440" y="233" fill="#18181b" font-size="12" font-weight="bold" text-anchor="middle">noon</text>
  <rect x="490" y="212" width="85" height="32" fill="#3f3f46" rx="4"/>
  <text x="532" y="233" fill="#a1a1aa" font-size="12" text-anchor="middle">because</text>
  <rect x="582" y="212" width="88" height="32" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="626" y="233" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">+ 3pm</text>
  <text x="30" y="270" fill="#34d399" font-size="11">green: accepted</text>
  <text x="150" y="270" fill="#f87171" font-size="11">red: first miss</text>
  <text x="270" y="270" fill="#a1a1aa" font-size="11">grey: discarded</text>
  <text x="390" y="270" fill="#38bdf8" font-size="11">blue: the big model's own word</text>
  <text x="350" y="300" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">One weight read, five words out.</text>
  <text x="350" y="320" fill="#a1a1aa" font-size="12" text-anchor="middle">Bandwidth still caps passes per second; each pass now yields several words.</text>
</svg>`,
            caption: 'The output is identical to what the big model would write alone. Only the number of weight reads changes.',
          },
          {
            type: 'text',
            md: "Here are Inco AI's published numbers for Qwen3.8-27B. They were measured on a 48GB M5 Pro, the same chip family as your Mac mini. The comparison engine, **oMLX**, is a popular general-purpose MLX server that already does its own speed tricks, so these gaps are over a strong baseline. Two new terms in the table: **prefill** is the model reading your prompt before it writes anything (it sets how long you wait for the first word), and **cache reuse** is the engine remembering a prompt it has already read, so an agent that resends the same long context doesn't pay to read it again.",
          },
          {
            type: 'table',
            headers: ['Test (Qwen3.8-27B, 48GB M5 Pro)', 'Splash', 'oMLX', 'Gap'],
            rows: [
              ['Writing speed, short prompt', '74 tok/s', '38 tok/s', '2.0x'],
              ['Writing speed, 32K-token context', '54 tok/s', '28 tok/s', '1.9x'],
              ['Prefill (reading a 32K prompt)', '363 tok/s', '110 tok/s', '3.3x'],
              ['Replaying a cached 32K prompt', '282 ms', '2,049 ms', '7.3x'],
              ['Four requests at once (total)', '170 tok/s', '43 tok/s', '3.9x'],
            ],
          },
          {
            type: 'text',
            md: "Put the first row next to the bandwidth math. Plain decoding predicted 13-16 tokens per second on an M5 Pro. Splash claims 74. That's roughly five words kept per weight read, which is exactly the sort of number speculative decoding produces when the draft is good. The last row matters most for agent work: Claude Code's subagents fire several requests at once, and Splash is built to batch them.\n\nThe practical bits:\n\n- It needs an M3 or newer Mac on macOS 26.4 or later, with at least 36GB of unified memory; 48GB or more is recommended. Your 64GB M5 Pro clears every bar.\n- It speaks both the OpenAI and Anthropic API dialects, including tool calls and image input, so Claude Code can point at it the way [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3) points it at Ollama.\n- It installs through Homebrew and starts with one command.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `brew install incoai/tap/splash
splash serve --model incoai/Qwen3.8-27B-Splash
# serves on http://localhost:8000`,
            caption: 'Install Splash and start the tuned Qwen3.8-27B build.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Measure before you switch',
            md: "Every number above comes from the company that built Splash, and the engine was a week old when this lesson was written. Two models, no fallback, nothing to tune: if you want Gemma or a coder model, you still need Ollama or LM Studio alongside it. The honest move is to run the same prompt through Splash and your current engine on your own Mac and compare tokens per second yourself. That takes ten minutes, and the lab below includes it.",
          },
        ],
      },
      {
        heading: 'What Went Stale (and How Fast)',
        blocks: [
          {
            type: 'text',
            md: "If you google 'best local LLM for Mac' you'll land on guides from 2024-25 and early 2026, and much of their advice has quietly expired. The comparison below works as a stale-guide detector: when an article leans on anything in the left column, check its publication date before trusting anything else it says.",
          },
          {
            type: 'compare',
            left: {
              title: 'Older advice (now obsolete)',
              items: [
                'Llama is the default open model',
                'Qwen 3 235B-A22B is the open flagship to aim for',
                'DeepSeek R1 is the open reasoning model to beat',
                'Gemma comes with its own restrictive terms',
                "'Open weights' means Apache or MIT",
                'gpt-oss 120B fits a 64GB Mac',
                'The engine is a detail; any of them will do',
              ],
            },
            right: {
              title: 'September 2026 reality',
              items: [
                'Qwen, DeepSeek, GLM, and Kimi lead the open rankings',
                'Flagships went trillion-scale; the Mac story moved to 27-35B',
                'DeepSeek V4 replaced it; thinking modes are now standard',
                'Gemma 4 ships under Apache 2.0',
                'GLM-5.3, Qwen3.8-Max, and Kimi K3 carry custom terms',
                'At ~65GB it needs a 96GB+ Mac',
                'Model-specific engines like Splash claim 2x on the same Mac',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Half-life discipline',
            md: "Any local-model recommendation, this lesson included, decays in about six months. This lesson's own table changed almost completely between July and September 2026. Put a quarterly reminder on your calendar: spend 20 minutes on [lmarena.ai](https://lmarena.ai) (a public leaderboard where humans vote on model quality in blind matchups), the [Artificial Analysis open-weights page](https://artificialanalysis.ai/models/open-source), and the [Ollama library](https://ollama.com/library), refresh your shortlist, and move on with your life.",
          },
        ],
      },
    ],
    lab: {
      title: 'Size YOUR Mac',
      intro: "Turn the theory into a concrete shortlist. You'll find your RAM tier, run the fit arithmetic yourself, pick three models that genuinely run on your machine with room to spare, and then see how much the engine changes the speed.",
      steps: [
        'Find your RAM and chip: run `system_profiler SPHardwareDataType | grep -E "Chip|Memory"` (or Apple menu > About This Mac).',
        'Compute your usable budget: total RAM minus 8-12GB for macOS and your normal apps.',
        'Pick 3 candidate models from the first who-is-who table and estimate each one: parameters x 0.55 GB per billion, plus 20% for KV cache. Write the numbers down.',
        'Cross-check against reality: open [ollama.com/library](https://ollama.com/library) and confirm the actual Q4 download size for each candidate.',
        'Create `~/ai-notes/local-models.md` listing your 3 finalists with size, license, and one line on why each made the cut.',
        'If your Mac is an M3 or newer with 36GB+ of memory: install Splash, serve Qwen3.8-27B, and give it the same prompt you give the Ollama build of Qwen3.8-27B. Note both tokens-per-second numbers in your notes file.',
        'Bookmark [lmarena.ai](https://lmarena.ai) and set a quarterly calendar reminder to redo this exercise.',
      ],
      checklist: [
        'I know my exact RAM and my usable model budget in GB',
        'I computed estimated RAM for at least 3 models and checked against real download sizes',
        'My shortlist has 3 models that fit with at least 15% headroom',
        'I noted the license of every shortlisted model',
        'I measured one model on two engines (or noted why my Mac cannot run Splash)',
        'A quarterly leaderboard-check reminder exists on my calendar',
      ],
    },
    checkQuiz: [
      {
        q: 'Which of these will NOT run properly on a 64GB Mac?',
        options: [
          'Qwen3.8-27B at Q8 (about 27GB)',
          'Qwen3.8-27B and Qwen3.6-35B-A3B loaded side by side at Q4',
          'Qwen3-Coder-Next 80B-A3B at Q4 (about 45GB)',
          'gpt-oss 120B (about 65GB)',
        ],
        answer: 3,
        explain:
          "gpt-oss 120B's file is about 65GB, which is bigger than the entire machine before macOS takes its 8-12GB. It loads on a 96-128GB Mac. The other three all fit inside the roughly 44-54GB a 64GB Mac leaves for models, which is why guides that put gpt-oss 120B on the 64GB rung are wrong.",
      },
      {
        q: 'Plain decoding math says Qwen3.8-27B should write about 13-16 tokens per second on an M5 Pro. How can Splash report 74?',
        options: [
          'It quantizes the model down to 1 bit per weight, so each read is 16 times smaller',
          'A small draft model guesses several tokens ahead, and the big model checks all of them in one read of its weights, keeping the ones it agrees with',
          'It skips the vision layers and half the attention layers to save time',
          'It streams the weights from the SSD, which is faster than unified memory',
        ],
        answer: 1,
        explain:
          'Bandwidth caps how many times per second the big model can read its weights. Speculative decoding makes each read produce several tokens instead of one: the draft guesses, the big model verifies the whole batch in a single pass, and every accepted guess is a free token. The output is identical to what the big model would have written alone.',
      },
      {
        q: 'On the same Mac, Qwen3.6-35B-A3B generates about 3-4x faster than a dense 27B model. Why?',
        options: [
          'It reads only its ~3B active parameters per token, while the dense 27B reads all 27B for every token',
          'It uses a smaller vocabulary, so each token is cheaper to produce',
          'It has fewer total parameters than the 27B model',
          'MoE models run on the Neural Engine, which is faster than the GPU',
        ],
        answer: 0,
        explain:
          'Speed follows how many bytes the chip reads per token. The MoE keeps all 35B in RAM, but the router only wakes about 3B worth of experts per token, so each token needs a fraction of the reading a dense 27B needs. That is the MoE bargain: pay memory for the total, pay speed for the active.',
      },
      {
        q: 'Which piece of advice is stale in September 2026?',
        options: [
          'Quantize to roughly 4 bits for the best size and quality trade-off',
          'Leave RAM headroom for the operating system when sizing a local model',
          'Check each model license before you build a product on it',
          'Gemma models come with restrictive custom terms, so prefer Apache-licensed alternatives',
        ],
        answer: 3,
        explain:
          'Gemma 4, released in April 2026, moved to Apache 2.0, the same permissive license as Qwen3.8-27B. The other three pieces of advice have aged fine. License-checking matters more than ever, since the biggest releases (GLM-5.3, Qwen3.8-Max, Kimi K3) now carry custom terms.',
      },
    ],
    resources: [
      { label: 'Qwen3.8-27B model card', url: 'https://huggingface.co/Qwen/Qwen3.8-27B', kind: 'repo' },
      { label: 'Qwen3.6-35B-A3B model card', url: 'https://huggingface.co/Qwen/Qwen3.6-35B-A3B', kind: 'repo' },
      { label: 'Splash launch post (Inco AI)', url: 'https://inco.ai/blog/splash/', kind: 'article' },
      { label: 'Gemma 4: how to run locally (Unsloth)', url: 'https://unsloth.ai/docs/models/gemma-4', kind: 'docs' },
      { label: "GLM-5.3's new license, explained (The New Stack)", url: 'https://thenewstack.io/zai-glm-weights-license/', kind: 'article' },
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
        q: 'What does setting ANTHROPIC_BASE_URL=http://localhost:11434 before launching Claude Code accomplish?',
        options: [
          'It enables offline caching of Anthropic API responses on your Mac',
          "It routes Claude Code's API traffic to Ollama, which answers Anthropic-format requests itself, so you keep the same workflow with local inference",
          'It mirrors your session transcripts to a local audit log',
          'It makes Ollama proxy requests through to Anthropic with local rate limiting',
        ],
        answer: 1,
        explain:
          "Claude Code sends its requests to whatever base URL its environment hands it. Since January 2026 Ollama speaks the Anthropic Messages format natively, so pointing the variable at it makes the harness (the tools, the loop, the UI) stay identical while a model on your own Mac does the thinking.",
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
            md: "Time to connect the two halves of this course. Claude Code is a **harness**: the loop that reads your files, calls tools, and applies edits is a separate thing from the model doing the thinking. And the harness is portable.\n\nHere's how the plumbing works. Claude Code talks to its model over HTTP, at an address it reads from the `ANTHROPIC_BASE_URL` **environment variable** (a named setting a program picks up when it starts). Meanwhile Ollama, from lesson 2, serves an API on your Mac at localhost:11434, where 'localhost' is the standard name for 'this computer'. Since January 2026 it answers Anthropic-format requests directly, so pointing the first at the second makes Claude Code drive your local model: same commands, same edit loop, and zero tokens leaving your machine. The full mechanism, including how to do this from a different machine on your network, is in [Bonus: Your Own Model Server · Coding Against Your Own Server From Another Machine](lesson:m9-l3).",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# Ollama running, model pulled (lesson 2)
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_AUTH_TOKEN=ollama          # any non-empty value
export ANTHROPIC_API_KEY=""                 # must be empty or it wins

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
        'In a scratch repo, set the override and launch: `export ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_API_KEY=""` then `claude --model qwen3-coder`. (Or just run `ollama launch claude`, which sets it up for you.)',
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

  // ────────────────────────────────────────────────────────────
  // m4-l4: The Hardware Ladder & the Install Business
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l4',
    title: 'The Hardware Ladder & the Install Business',
    day: 18,
    minutes: 45,
    xp: 100,
    objectives: [
      'Rank the local-AI hardware tiers from $0 to about $4,700 and say what genuinely runs at each price',
      'Explain why a used NVIDIA RTX 3090 competes with Macs costing twice as much, and where the Mac still wins',
      'Deconstruct the "$400 Mac mini, $2,100 install" business pitch into what is real and what is marketing',
      'Spec an honest local-AI install service for a small business: assessment first, hybrid routing, and a support plan priced in',
    ],
    skipQuiz: [
      {
        q: 'What makes a used RTX 3090 the classic budget king of local AI in 2026?',
        options: [
          'It has more total memory than any Mac at any price',
          'For roughly $700-900 used, its 24GB of VRAM and very high memory bandwidth run 24-32B models faster than Macs costing two or three times as much',
          'NVIDIA licenses it for commercial inference while newer cards are consumer-only',
          'It is the only GPU llama.cpp supports',
        ],
        answer: 1,
        explain:
          'Generation speed is limited by memory bandwidth, and the 3090 has roughly 936 GB/s of it, well above most Macs. Its 24GB of VRAM caps model size around the 24-32B class at Q4, but inside that cap a used 3090 outruns far pricier machines. The trade: a loud tower, real power draw, and it caps out where a big-RAM Mac keeps going.',
      },
      {
        q: 'A small business owner asks what a base $599 Mac mini (16GB) can actually run well. The honest answer:',
        options: [
          'Frontier-quality models, since Apple Silicon closes the gap',
          '8-12B models at Q4: real workhorses for classification, drafting, and private RAG, and a clear quality tier below the frontier',
          'Nothing useful; 16GB is below the minimum for any model',
          'Any model, as long as you accept slower loading times',
        ],
        answer: 1,
        explain:
          'The RAM arithmetic from earlier in this module: 16GB minus 8-10GB for the system leaves room for an 8-12B model at Q4 plus its KV cache. Models that size handle routine private work honestly well in 2026. What they cannot do is frontier-grade reasoning, and an install pitch that skips that sentence is selling, not advising.',
      },
      {
        q: 'The viral pitch: buy a $400 Mac mini, install Ollama, charge a client $2,100, collect $100-150/month. What does the price actually have to cover for the business to be legitimate?',
        options: [
          'Nothing beyond the hour of installation; software margins are the whole point',
          'Assessment of the client\'s real tasks, model selection and evaluation, integration into their workflow, documentation, and ongoing support: updates, breakage, and the quarterly model refresh',
          'Only the hardware markup, since Ollama handles everything else automatically',
          'A reseller license fee to Apple and Ollama',
        ],
        answer: 1,
        explain:
          'An hour of `brew install ollama` is worth an hour. What a client is actually paying $2,100 for is judgment: which of their tasks a local model genuinely handles, which model, wired into what workflow, plus someone to call when it breaks. The retainer is the honest part of the pitch: local models go stale in about six months, and somebody has to own that.',
      },
      {
        q: 'Which client situation is a genuinely strong case for a local-AI box rather than a cloud subscription?',
        options: [
          'A startup that wants the best possible code-generation quality',
          'A medical or legal practice handling records that must never leave the building, running high-volume routine tasks like transcription cleanup and document classification',
          'A solo founder who already pays $20/month for a frontier plan and mostly needs deep reasoning',
          'Any business that finds subscriptions annoying',
        ],
        answer: 1,
        explain:
          'The structural wins from the hybrid-split lesson decide it: privacy that survives any benchmark cycle, high volume at electricity prices, and tasks where an 8-30B model is honestly good enough. Records-heavy practices hit all three. The startup and the founder need frontier reasoning quality, which stays a cloud product.',
      },
      {
        q: 'A vendor demo shows a local install completed in an 11-second video and claims "a few thousand a month from local installs" as a solo operator. How should you read it?',
        options: [
          'As proof the business model works at that speed and margin',
          'As content marketing: the install being fast is true and beside the point, since the sellable work is the assessment, integration, and support the video never shows',
          'As fraud that should be reported',
          'As evidence local AI is too easy to charge for at all',
        ],
        answer: 1,
        explain:
          'The video is real and the framing is bait. Installing Ollama IS fast; that is exactly why the install alone is worth almost nothing. The viable version of this business sells what the clip omits: knowing which client tasks a local model can honestly carry, wiring it into their actual workflow, and being on the hook when it drifts. Speed of install and value of service are different numbers.',
      },
    ],
    sections: [
      {
        heading: 'The ladder: $0 to $4,700',
        blocks: [
          {
            type: 'text',
            md: "The first three lessons sized models to YOUR Mac. This one widens the lens to the whole hardware market, because two conversations keep coming up in 2026 that need the full ladder: 'what should I buy for local AI?' and 'could I sell local AI to businesses?'. The second one is making the rounds as a get-rich-quick pitch, and we'll take it apart properly in a minute.\n\nThe ladder below runs from free to about $4,700. Two spec numbers decide everything on it, both familiar from [Local Models · The Open-Model Landscape 2026](lesson:m4-l1): **memory capacity** sets which models fit at all, and **memory bandwidth** (how fast the chip can stream weights out of RAM, measured in gigabytes per second) sets how fast they generate. Every rung is some trade between those two and the electric bill.",
          },
          {
            type: 'table',
            headers: ['Price', 'The box', 'Memory', 'What genuinely runs', 'The catch'],
            rows: [
              ['$0', 'The laptop or desktop you already own', 'Whatever it has', 'A 4-8B model, often CPU-only and slow', 'Fine for learning; painful for daily work'],
              ['$200-400', 'Used office mini-PC, RAM maxed', '32-64GB DDR4', '8-14B on CPU at a crawl (1-5 tok/s)', 'Capacity without bandwidth; patience required'],
              ['$599', 'Mac mini M4 base', '16GB unified', '8-12B at Q4, comfortably', 'The famous "$400" mini once refurbished or on sale'],
              ['$700-900', 'Used RTX 3090 in any old tower', '24GB VRAM @ ~936 GB/s', '24-32B at Q4, FAST (often 30-60 tok/s)', 'Loud, hot, ~350W, and hard-capped at 24GB'],
              ['$999-1,399', 'Mac mini M4 Pro', '24-64GB unified', 'The 30B-A3B MoE sweet spot, silent, ~10W idle', 'Bandwidth below the 3090; quieter and thriftier'],
              ['$2,000-2,500', 'Mac Studio M4 Max / dual used 3090s', '64-96GB', '70B dense or gpt-oss 120B', 'The dual-GPU route needs real DIY tolerance'],
              ['$4,000-4,700', 'Mac Studio 128GB+', '128GB+ unified', 'The 235B-class MoE flagships', 'Frontier-adjacent open models, still not frontier'],
              ['$1,699', 'Mac mini M5 Pro (Aug 2026)', '64GB @ 307GB/s', '80B-A3B coders at Q4, or two mid models resident at once', 'Roomy but mid-bandwidth: MoE flies, dense 70B crawls'],
              ['Top of the lineup', 'Mac Studio M5 Ultra (Aug 2026)', '512GB @ 1.2TB/s', 'Trillion-parameter MoE, but only at 2-bit', '80-core GPU, first Ultra with Neural Accelerators'],
            ],
          },
          {
            type: 'text',
            md: "The interesting fight on that ladder is the used **RTX 3090** versus the Mac mini tier, and it teaches the bandwidth lesson better than any benchmark chart. The 3090 shipped in 2020 as a gaming card, yet its 24GB of **VRAM** (the graphics card's own dedicated memory) moves data at roughly 936 GB/s, which beats most of Apple's lineup. Inside its 24GB cap, it generates tokens noticeably faster than Macs costing twice as much, which is why the r/LocalLLaMA crowd keeps buying them used.\n\nSo why did this course teach the Mac path first? Because the cap and the ownership costs are real: 24GB stops at the 32B class while a big-RAM Mac walks up to 235B MoE territory, and the Mac idles near-silent at a few watts, which matters enormously for the always-on agent-server pattern from [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3). Rule of thumb: bandwidth wins the speed race, capacity wins the capability race, and electricity plus noise decide who gets to live in an office.",
          },
        ],
      },
      {
        heading: 'Above the Ladder: the Trillion-Parameter Wall',
        blocks: [
          {
            type: 'text',
            md: "Apple pushed the top of that ladder in August 2026, and the interesting part is what the new ceiling still can't reach. Both bills went up together on the flagship, which is what makes it a real tier jump instead of a bigger container.",
          },
          {
            type: 'table',
            headers: ['Machine', 'Capacity', 'Bandwidth', 'Weight budget', 'What that buys'],
            rows: [
              ['Mac mini M5 Pro', '64GB', '307GB/s', '~44GB', '80B-A3B coders at full Q4 quality'],
              ['Mac Studio M5 Ultra', '512GB', '1.2TB/s', '~450GB', '1T-parameter MoE, but only at damaged quantization'],
            ],
          },
          {
            type: 'text',
            md: "The Ultra is four times the capacity and four times the bandwidth of the mini, with an 80-core GPU carrying Neural Accelerators for the first time on an Ultra chip and up to 4.3x the AI compute of the M3 Ultra. Apple quotes the bandwidth as 50% higher than the previous generation. The 512GB configuration arrives later than the rest of the line.\n\nSo run the arithmetic on the models everyone wants to put on it. Moonshot's Kimi line is the right test case, because its mixture-of-experts design makes it sound far more portable than it is.",
          },
          {
            type: 'table',
            headers: ['Model and quantization', 'Weights resident', 'Fits 512GB?'],
            rows: [
              ['Kimi K2.7-Code (1T total, 32B active) at Q4', '~600GB', 'No'],
              ['Kimi K2.7-Code at Q2_K_XL', '~350-380GB', 'Yes, with roughly 130GB left for KV cache'],
              ['Kimi K2.7-Code at 1.8-bit', '~247GB', 'Yes, comfortably, and badly damaged'],
              ['Kimi K3 (2.8T total, 104B active) at native MXFP4', '1.56TB', 'No. Moonshot recommends 64+ accelerators.'],
              ['Kimi K3 pushed to 1.8-bit', '~630GB', 'No, still over the ceiling'],
            ],
          },
          {
            type: 'text',
            md: "The speed side works out better than you might fear. At Q2 the 1T model reads roughly 10GB per token, so 1.2TB/s divided by 10 gives about 115 tokens per second at theoretical peak. Mixture-of-experts models run at lower real efficiency than dense ones, closer to 0.4, because the router scatters reads across experts instead of streaming one contiguous block. Sanity-check that against a measured data point: an M3 Ultra at 819GB/s on a 3.5-bit Kimi build printed 20 to 26 tok/s, which implies exactly that factor. Scale to 1.2TB/s and you land near 30 to 50 tok/s, which is genuinely usable.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Fitting is not the same as working',
            md: "The only Kimi that fits 512GB fits at 2 bits per weight, well past the quality cliff from [Local Models · The Open-Model Landscape 2026](lesson:m4-l1). You would own a damaged copy of a frontier model, and whether that beats an undamaged 80B at Q4 is a genuinely open question rather than an obvious win. Meanwhile the same model, undamaged, rents for about $0.95 per million input tokens. A five-figure machine buys billions of tokens of the better version.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The wall, and who is on the other side of it',
            md: "Open weights stopped meaning runnable-at-home somewhere around the 500B mark. Active parameters set speed and total parameters set memory, and in the trillion-parameter class those numbers now sit three orders of magnitude apart. A 512GB Studio is the right purchase for exactly one buyer: someone who needs frontier-scale open weights on data that legally cannot leave the building. For everyone else the mini tier plus one subscription is the better-shaped spend, and it is the recommendation you should give clients who ask for the biggest box.",
          },
        ],
      },
      {
        heading: 'The pitch: a $400 box and a $2,100 invoice',
        blocks: [
          {
            type: 'text',
            md: "Now the business pitch, as it actually circulates. A viral thread describes the play: buy a cheap Mac mini, install [Ollama](https://ollama.com) with a local model, deliver it to a small business as 'your own private AI, no cloud, no subscription', charge about $2,100 for the install, then collect a $100-150 monthly retainer. The accompanying video shows the install taking under a minute, and the author claims a few thousand a month as a solo operator. No SaaS, no code, no investors.\n\nRun the seller-side math and you see why the format spreads. Hardware $600, an afternoon of setup, $2,100 invoice: roughly $1,400 gross on day one, plus retainers stacking as installs accumulate. Ten clients would mean $1,000-1,500 a month of recurring revenue for maintenance that is mostly quiet. The arithmetic is genuinely attractive, which is exactly why it deserves the same treatment as the '$599 mini replaces $459 of subscriptions' thumbnail from the last lesson: claim by claim, with your own calculator.",
          },
          {
            type: 'compare',
            left: {
              title: 'What the pitch gets right',
              items: [
                'Small businesses with sensitive data DO want AI that never phones home',
                'An 8-30B model honestly covers routine work: drafting, classification, private RAG',
                'A one-time box beats a per-seat subscription for some buyers, psychologically and financially',
                'Recurring maintenance revenue is real, because models and tools genuinely need refreshing',
              ],
            },
            right: {
              title: 'What it quietly skips',
              items: [
                'The install is the cheapest part; the video shows the only step that takes no skill',
                'A 16GB mini runs 8-12B models, a full quality tier below what the client uses in ChatGPT',
                'Someone must own failures: hallucinated answers, a stale model, a broken update',
                'A client who needed frontier quality churns fast, and tells other businesses why',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The 11-second-install tell',
            md: "Watch what the demo chooses to show: the part that takes an hour and no judgment. The same tell shows up across get-rich-with-AI content, and you saw its cousin in the loop-engineering hype cycles: effort compressed on camera, hard parts left off screen. When the shown step is trivially easy, the unshown steps are the actual product. That cuts both ways: it means the pitch oversells, AND it means the durable business, if there is one, lives in exactly what the video skipped.",
          },
        ],
      },
      {
        heading: 'The fractional-CTO read: when local is genuinely right',
        blocks: [
          {
            type: 'text',
            md: "Strip the hype and a real question remains, one your clients will ask you directly: should this business run AI on a box in the office? The structural scorecard from [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3) answers it, applied to someone else's workload instead of yours.\n\nLocal earns its place when three things line up. The data must be genuinely sensitive: patient records, legal files, payroll, anything where 'we never send it anywhere' is worth money in trust or required by rules like [HIPAA](https://www.hhs.gov/hipaa/index.html) (the US health-data privacy law). The volume must be high and routine: transcription cleanup, document classification, drafting from templates, private search over the firm's own files. And the quality bar must be honest: an 8-30B model has to be genuinely good enough for THESE tasks, verified on the client's real work, using the same benchmark discipline this module's boss challenge drills on your own tasks.\n\nWhen any leg is missing, recommend the boring alternative. A business whose bottleneck is frontier-grade reasoning belongs on a $20-100 cloud plan. A business with sensitive data AND hard reasoning needs belongs on the hybrid split: the local box absorbs the private routine volume, one cloud subscription handles the rest, and the routing policy is written down. You wrote that policy for yourself in the last lesson; the client version is the same document with their tasks in it.",
          },
          {
            type: 'text',
            md: "If you ever offer this as a service, the deliverable list writes itself from everything above, and none of it fits in an 11-second video. Start with a paid assessment: a week of watching where their hours actually go, straight from the back-stage mapping you'll formalize in [The AI Transformation Playbook · Where AI Belongs in a Business](lesson:m7-l4). Then the build: hardware sized to the shortlisted tasks, models chosen by running THEIR documents through candidates, the workflows wired in, and a one-page routing policy naming what stays local and what escalates. Then the part the retainer honestly pays for: quarterly model refreshes on the six-month half-life from [Local Models · The Open-Model Landscape 2026](lesson:m4-l1), monitoring, and being the person they call. Price all of that at $2,100 plus $150 a month and nobody got fleeced; the number was never the scandal, the missing service under it was.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The one-question filter',
            md: "Before proposing a local box to anyone, answer this in writing: which specific tasks, at what volume, does an open model demonstrably handle for this client, shown on their own data? A crisp answer means the install is defensible engineering. A vague one means you're about to sell a very quiet space heater with a retainer attached.",
          },
        ],
      },
    ],
    lab: {
      title: 'Spec an install you could defend',
      intro:
        "Play both sides of the deal. Spec a local-AI install for one real small business you know (a client, a friend's shop, your dentist), then attack your own proposal the way a skeptical buyer should.",
      steps: [
        'Pick a real small business you know something about. List 5 of its back-stage tasks (admin, drafting, classifying, searching internal docs) and mark which involve data the owner would hate to see leave the building.',
        'Pick the hardware rung: choose from the ladder table and justify it in one line against the tasks, using the RAM arithmetic from lesson 1.',
        'Pick the model(s): choose from your lesson-1 shortlist. For at least one task, actually test it: run a realistic sample (sanitized if needed) through the model on your own Mac and judge the output honestly.',
        'Write the one-page proposal: tasks covered, hardware, models, what stays local vs what escalates to a cloud plan, the install price, and what the monthly retainer specifically buys (updates, monitoring, support).',
        "Now attack it: write the three hardest questions the owner should ask (start with: 'why is this better than the $20/month tool I already use?'). Answer them in writing, or amend the proposal where you can't.",
        'Verdict: one paragraph on whether this deal is genuinely good for the client, good only for the seller, or good for both. Keep the page; it doubles as a template if a real client ever asks.',
      ],
      checklist: [
        'Five real back-stage tasks listed, with the sensitive ones flagged',
        'Hardware rung chosen with the RAM arithmetic shown, and models picked from a current shortlist',
        'At least one task actually tested on a local model, with an honest quality note',
        'The proposal names what escalates to cloud, and what the retainer concretely buys',
        'The three skeptical-buyer questions are answered in writing, and the who-wins verdict exists',
      ],
    },
    checkQuiz: [
      {
        q: 'Why does memory bandwidth, rather than capacity, decide generation speed?',
        options: [
          'Bandwidth determines how many models can be stored on disk',
          'Every generated token requires streaming the active weights out of memory, so tokens per second tracks how fast that streaming goes',
          'Capacity only matters for training, never for inference',
          'Bandwidth is a marketing number with no runtime effect',
        ],
        answer: 1,
        explain:
          "The speed lesson from earlier in the module, now driving purchase decisions: each token means reading all the active parameters out of memory once. A used 3090 at ~936 GB/s outruns bigger-memory machines with slower buses on any model that fits its 24GB. Capacity decides what CAN run; bandwidth decides how it FEELS.",
      },
      {
        q: 'A law firm wants AI for summarizing case files (confidential, high volume) and for novel legal strategy arguments. Your recommendation?',
        options: [
          'Everything local: a big Mac Studio handles both',
          'Everything cloud: local models cannot summarize',
          'The hybrid split: a local box for the confidential high-volume summarization and classification, one cloud subscription for the deep reasoning, and a written routing policy between them',
          'Neither: law firms cannot use AI',
        ],
        answer: 2,
        explain:
          'Two legs of the local case are strong (sensitive data, high routine volume) and one task genuinely needs frontier reasoning. That is the textbook hybrid: route by task class, write the policy down, and nobody uploads a client file out of habit. It is the same split you wrote for yourself, sold as advice.',
      },
      {
        q: 'What makes the monthly retainer the most defensible part of the install-business pitch?',
        options: [
          'Recurring revenue is always ethical by definition',
          'Local models and tools genuinely decay on a roughly six-month half-life, so refreshes, monitoring, and support are real ongoing work someone must own',
          'The retainer covers the electricity the box consumes',
          'Apple requires service contracts on business hardware',
        ],
        answer: 1,
        explain:
          'The half-life discipline from lesson 1 applies to a client box with extra force, because the client will never re-run a leaderboard check themselves. Somebody has to refresh the model shortlist, apply updates, and answer the phone when output quality drifts. Charging monthly for that is honest; charging monthly for nothing is the grift version.',
      },
      {
        q: 'The strongest single argument AGAINST recommending a $599 mini install for a given client is:',
        options: [
          'Ollama licensing costs more at commercial scale',
          'Their actual bottleneck tasks need frontier-model quality, so the local box would automate the wrong things and disappoint on the right ones',
          'Macs cannot run around the clock',
          '16GB machines cannot load any language model',
        ],
        answer: 1,
        explain:
          'The fatal mismatch is task quality, and it is invisible in a demo. An 8-12B model handling the routine 80% beautifully still fails the client whose business value sits in the hard 20%. The assessment exists to catch exactly this before an invoice does: match the box to the tasks, never the tasks to the box.',
      },
    ],
    resources: [
      { label: 'Ollama: the install-business runtime of choice', url: 'https://ollama.com', kind: 'docs' },
      { label: 'r/LocalLLaMA: where the hardware ladder gets argued daily', url: 'https://www.reddit.com/r/LocalLLaMA/', kind: 'article' },
      { label: 'The $400-mini install pitch (the thread this lesson deconstructs)', url: 'https://x.com/brainrulax/status/2083169896641265692', kind: 'thread' },
      { label: 'LMArena leaderboard: refresh the client shortlist quarterly', url: 'https://lmarena.ai', kind: 'article' },
      { label: 'HIPAA basics: why "never leaves the building" is worth money', url: 'https://www.hhs.gov/hipaa/index.html', kind: 'docs' },
      { label: 'Apple: Mac Studio with M5 Max and M5 Ultra', url: 'https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/', kind: 'article' },
      { label: 'Unsloth: what running Kimi K2.6 locally actually takes', url: 'https://unsloth.ai/docs/models/kimi-k2.6', kind: 'docs' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  // m4-l5: Routing the 80/20
  // ────────────────────────────────────────────────────────────
  {
    id: 'm4-l5',
    title: 'Routing the 80/20',
    day: 18,
    minutes: 50,
    xp: 100,
    objectives: [
      'Explain why automatic difficulty classification fails on coding work, and what to route on instead',
      'Climb the four-rung routing ladder from shell aliases to a full gateway, and stop at the rung that fits your setup',
      'Split roles inside one coding task so a frontier model plans and reviews while a local model implements',
      'Configure Claude Code Router to route by request type, so background and long-context work leaves your subscription alone',
      'Write an escalation trigger and a repository-level rule that cannot misfire',
    ],
    skipQuiz: [
      {
        q: 'Why does routing coding requests by classifying the prompt text tend to fail?',
        options: [
          'Classifier models are too slow to run before every request',
          'You cannot tell a hard task from an easy one by reading the prompt, so the classifier confidently sends the worst task to the weakest model',
          'Coding prompts are too short for a classifier to read',
          'Classification only works on languages the router was trained on',
        ],
        answer: 1,
        explain:
          '"Add a null check" is trivial until it lands in the one file with a race condition. Difficulty lives in the codebase rather than in the sentence, so a text classifier is guessing. Deterministic signals like which role the model is playing or which repository you are in never guess.',
      },
      {
        q: 'What is the cheapest routing mechanism that captures most of the available value for a solo developer?',
        options: [
          'A learned router trained on your own past sessions',
          'Two shell aliases plus a written task-class policy, with you making the call',
          'A Kubernetes gateway with per-request cost tracking',
          'Randomly alternating between local and frontier to average the cost',
        ],
        answer: 1,
        explain:
          'You already know what you are about to attempt, which makes you a better classifier than any model. Two aliases and a written split cost five minutes and cover most real traffic. Every rung above this one is about removing the manual step, never about routing better.',
      },
      {
        q: 'In a Plan/Act split with two different models, which model belongs where?',
        options: [
          'Local plans because planning is cheap, frontier acts because writing code is expensive',
          'Frontier plans and reviews the diff, local implements the bounded task it was handed',
          'Both should be the same model to keep the transcript coherent',
          'Frontier does both; the local model only formats output',
        ],
        answer: 1,
        explain:
          'Planning and reviewing are where reasoning depth pays, and together they are a small share of the tokens. Implementation of a task that has already been scoped and given acceptance criteria is mechanical, which is exactly what a local model handles well.',
      },
      {
        q: 'Claude Code Router distinguishes several request types. Which one should go to your local box unconditionally?',
        options: [
          'think, because reasoning is the most expensive route',
          'longContext, because large prompts cost the most per call',
          'background, because it covers cheap housekeeping like diff summaries and titles',
          'default, because it carries the highest volume',
        ],
        answer: 2,
        explain:
          'Background requests are the housekeeping your agent does around the real work: summarizing a diff, naming a session, small mechanical rewrites. They are pure volume with no reasoning requirement, which makes them the safest thing to move off a metered subscription.',
      },
      {
        q: 'Which routing rule is guaranteed never to misfire?',
        options: [
          'Send anything under 500 tokens to the local model',
          'Send anything the model reports low confidence on to the frontier model',
          'Send everything in the client repository to the local box, unconditionally',
          'Send every third request to the local model to balance load',
        ],
        answer: 2,
        explain:
          'Repository is a fact you already know before the request exists, so evaluating it requires no judgment and no model. Token count is a poor proxy for difficulty, self-reported confidence is unreliable, and round-robin ignores the task entirely.',
      },
    ],
    sections: [
      {
        heading: 'The Router You Should Not Build',
        blocks: [
          {
            type: 'text',
            md: "You wrote a hybrid policy in [Local Models · Local Agents & the Hybrid Split](lesson:m4-l3). This lesson is about making it happen automatically, and it opens with the thing to avoid, because the obvious design is the broken one.\n\nThe obvious design: put a classifier in front of every request, have it judge how hard the task looks, send easy ones to the local model and hard ones to the frontier. It sounds smart. On coding work it fails in a specific and expensive way.",
          },
          {
            type: 'text',
            md: "Consider the prompt 'add a null check to the user lookup'. A classifier reads eight words of routine maintenance and routes local. Correct, most of the time. Then one day that lookup sits in the one file with a race condition, the null check needs to go inside a lock you didn't know about, and the local model produces a change that compiles, passes the obvious test, and quietly introduces a deadlock under load.\n\nThe difficulty was never in the sentence. It lived in the codebase. A text classifier cannot see the codebase, so it's guessing, and it guesses with total confidence. That's a worse failure mode than routing badly at random, because you stop checking.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Learned routers and where their numbers come from',
            md: "You'll see impressive claims for learned routers such as RouteLLM, including roughly 85% cost savings at 95% of frontier quality. Those evaluations route general traffic between cloud tiers, where a wrong call costs a slightly worse paragraph. Code is different: a wrong call costs a subtle bug that survives review. Treat learned routing as a solved problem for chat and an unsolved one for coding.",
          },
        ],
      },
      {
        heading: 'Route on What You Already Know',
        blocks: [
          {
            type: 'text',
            md: "The fix is to stop asking a model to judge, and start routing on facts that exist before the request does. Three of them carry almost all the value, and none of them requires inference.\n\n**Who is asking.** A planning step and an implementation step have different reasoning requirements, and the harness knows which one it's running. Route on the role.\n\n**Where you are.** Repository, directory, or project. Client code under an NDA goes to the local box whether the task is hard or easy, because the constraint is legal instead of technical.\n\n**What shape the request is.** Token count, whether a thinking flag is set, whether it's a background housekeeping call. These are structural properties the gateway can read off the request without understanding it.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Two ways to decide, one of which guesses</text>
  <rect x="30" y="55" width="300" height="230" fill="#27272a" stroke="#f87171" stroke-width="2" rx="8"/>
  <text x="180" y="80" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">GUESSING: classify the prompt</text>
  <rect x="55" y="96" width="250" height="34" fill="#3f3f46" rx="4"/>
  <text x="180" y="118" fill="#e4e4e7" font-size="11" text-anchor="middle">"add a null check to user lookup"</text>
  <line x1="180" y1="132" x2="180" y2="152" stroke="#f87171" stroke-width="2"/>
  <polygon points="180,157 174,145 186,145" fill="#f87171"/>
  <rect x="80" y="158" width="200" height="30" fill="#3f3f46" rx="4"/>
  <text x="180" y="178" fill="#a1a1aa" font-size="11" text-anchor="middle">classifier: "looks easy"</text>
  <line x1="180" y1="190" x2="180" y2="210" stroke="#f87171" stroke-width="2"/>
  <polygon points="180,215 174,203 186,203" fill="#f87171"/>
  <rect x="80" y="216" width="200" height="30" fill="#7f1d1d" rx="4"/>
  <text x="180" y="236" fill="#fca5a5" font-size="11" text-anchor="middle">local model → silent deadlock</text>
  <text x="180" y="268" fill="#f87171" font-size="11" text-anchor="middle">the hard part was in the codebase,</text>
  <text x="180" y="282" fill="#f87171" font-size="11" text-anchor="middle">never in the sentence</text>
  <rect x="370" y="55" width="300" height="230" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="520" y="80" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">KNOWING: route on facts</text>
  <rect x="392" y="98" width="256" height="32" fill="#3f3f46" rx="4"/>
  <text x="404" y="119" fill="#34d399" font-size="11">role:</text>
  <text x="448" y="119" fill="#e4e4e7" font-size="11">planning or implementing?</text>
  <rect x="392" y="138" width="256" height="32" fill="#3f3f46" rx="4"/>
  <text x="404" y="159" fill="#34d399" font-size="11">repo:</text>
  <text x="448" y="159" fill="#e4e4e7" font-size="11">under NDA or not?</text>
  <rect x="392" y="178" width="256" height="32" fill="#3f3f46" rx="4"/>
  <text x="404" y="199" fill="#34d399" font-size="11">shape:</text>
  <text x="448" y="199" fill="#e4e4e7" font-size="11">background call? 80K tokens?</text>
  <rect x="392" y="222" width="256" height="34" fill="#064e3b" stroke="#34d399" rx="4"/>
  <text x="520" y="243" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">deterministic. no inference. no guess.</text>
  <text x="520" y="276" fill="#34d399" font-size="11" text-anchor="middle">every one of these is known before the request exists</text>
</svg>`,
            caption: 'Route on properties you can look up, never on a judgment about difficulty.',
          },
        ],
      },
      {
        heading: 'Layer 0: Two Aliases and a Written Split',
        blocks: [
          {
            type: 'text',
            md: "Start here, and stay here longer than you'd expect. The cheapest router is you, because you know what you're about to attempt before you type it. No model has that information.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# ~/.zshrc
alias cc='unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN; claude'
alias ccl='ANTHROPIC_BASE_URL=http://mac-mini.local:11434 \\
  ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_API_KEY="" \\
  claude --model qwen3-coder'

# cc  = frontier. ccl = the box in the closet.`,
            caption: 'The whole routing layer, in two lines. Swap the hostname for your own server.',
          },
          {
            type: 'text',
            md: "The aliases are the easy half. The half that makes it work is writing the split down once, so you stop re-deciding it every session. Without a written policy you drift into one of two ruts: everything goes frontier out of habit and your private code tags along, or everything goes local and you quietly eat quality losses on the tasks that mattered.",
          },
          {
            type: 'compare',
            left: {
              title: 'Goes to the local box',
              items: [
                'Renames, extractions, mechanical refactors',
                'Boilerplate and test scaffolding',
                'Commit messages, docstrings, changelogs',
                '"Explain this file" and codebase orientation',
                'Anything under an NDA, regardless of difficulty',
              ],
            },
            right: {
              title: 'Goes to the frontier',
              items: [
                'Architecture and interface design',
                'Bugs where the cause is genuinely unclear',
                'Multi-file refactors that must land correctly',
                'Long agent runs with many dependent steps',
                'Anything you would be embarrassed to ship wrong',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The escalation trigger is the important line',
            md: "Two failed local attempts and you switch, with no third try. Without that rule you'll spend forty minutes coaxing a local model through something a frontier model would have finished in one turn, and you'll count the forty minutes as free because no meter was running. Your time is the expensive input in this whole system.",
          },
        ],
      },
      {
        heading: 'Layer 1: Split the Roles Inside One Task',
        blocks: [
          {
            type: 'text',
            md: "This is the rung that fits coding best, and it's a genuinely different idea from everything above. Instead of routing whole tasks to one model or the other, split the roles inside a single task.\n\nThe insight comes straight from [Agents, Harnesses & Loops · What Is a Harness?](lesson:m2-l1): an agent turn contains several distinct jobs, and they don't all need the same brain. Deciding the approach needs reasoning depth. Typing out the implementation needs correctness and speed. Reviewing the diff needs judgment again. Two of those three are where a frontier model earns its price, and together they're a small fraction of the tokens.",
          },
          {
            type: 'text',
            md: "Cline supports exactly this, with separate models configured for **Plan** mode and **Act** mode. The loop runs like this: the plan model reads the project state and defines one bounded task with acceptance criteria, Cline switches to act mode, the act model implements it and runs the tests, Cline switches back, and the plan model reviews the git diff and test output before accepting or sending it back for correction.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Plan/Act split: the expensive model thinks, the cheap one types</text>
  <rect x="60" y="60" width="200" height="90" fill="#27272a" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="160" y="84" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">PLAN · frontier</text>
  <text x="160" y="105" fill="#e4e4e7" font-size="11" text-anchor="middle">scope one bounded task</text>
  <text x="160" y="122" fill="#e4e4e7" font-size="11" text-anchor="middle">write acceptance criteria</text>
  <text x="160" y="140" fill="#a1a1aa" font-size="10" text-anchor="middle">~15% of the tokens</text>
  <rect x="440" y="60" width="200" height="90" fill="#27272a" stroke="#34d399" stroke-width="2" rx="8"/>
  <text x="540" y="84" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">ACT · local</text>
  <text x="540" y="105" fill="#e4e4e7" font-size="11" text-anchor="middle">write the code</text>
  <text x="540" y="122" fill="#e4e4e7" font-size="11" text-anchor="middle">run the tests</text>
  <text x="540" y="140" fill="#a1a1aa" font-size="10" text-anchor="middle">~85% of the tokens</text>
  <line x1="265" y1="90" x2="435" y2="90" stroke="#38bdf8" stroke-width="2"/>
  <polygon points="440,90 427,84 427,96" fill="#38bdf8"/>
  <text x="350" y="82" fill="#38bdf8" font-size="11" text-anchor="middle">here is the task</text>
  <line x1="435" y1="128" x2="265" y2="128" stroke="#34d399" stroke-width="2"/>
  <polygon points="260,128 273,122 273,134" fill="#34d399"/>
  <text x="350" y="146" fill="#34d399" font-size="11" text-anchor="middle">here is the diff and the test output</text>
  <rect x="200" y="192" width="300" height="62" fill="#27272a" stroke="#fbbf24" stroke-width="2" rx="8"/>
  <text x="350" y="215" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">PLAN reviews: accept, correct, or re-plan</text>
  <text x="350" y="236" fill="#a1a1aa" font-size="11" text-anchor="middle">judgment stays on the model that has it</text>
  <line x1="160" y1="152" x2="230" y2="188" stroke="#52525b" stroke-width="1.5" stroke-dasharray="4 3"/>
  <line x1="540" y1="152" x2="470" y2="188" stroke="#52525b" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="350" y="278" fill="#e4e4e7" font-size="11" text-anchor="middle">frontier cost tracks the thinking, never the typing</text>
</svg>`,
            caption: 'Two dropdowns in Cline. No infrastructure, and it maps onto the 80/20 almost exactly.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The same trick inside Claude Code is rougher today',
            md: "Claude Code exposes `ANTHROPIC_MODEL` for the main session and `ANTHROPIC_SMALL_FAST_MODEL` for background work, and `CLAUDE_CODE_SUBAGENT_MODEL` sets a default for subagents that don't pick one. What's missing is per-agent-type configuration in settings.json, which is still an open feature request, and some built-in subagents ignore the small-model override entirely. If role-splitting is what you want, Cline does it cleanly right now and Claude Code needs the gateway in the next section.",
          },
        ],
      },
      {
        heading: 'Layer 2: Claude Code Router',
        blocks: [
          {
            type: 'text',
            md: "When you want the routing automatic and invisible, this is the mature option rather than something to write yourself. [Claude Code Router](https://github.com/musistudio/claude-code-router) sits between your agent and every provider as a local gateway, and it picks a model per request type instead of per session.\n\nIt has grown well past its name. One CCR instance fronts Claude Code, Codex, OpenCode, Kilo Code, Grok CLI, and several others, giving all of them one stable local endpoint while you manage providers, routing rules, credentials, and logs in one place.",
          },
          {
            type: 'table',
            headers: ['Request type', 'Fires when', 'Send it to', 'Why'],
            rows: [
              ['background', 'housekeeping: diff summaries, session titles', 'the local box, always', 'pure volume, zero reasoning requirement'],
              ['default', 'ordinary coding turns', 'your call, per project', 'the rung where your written policy applies'],
              ['think', 'a reasoning or extended-thinking flag is set', 'frontier', 'the flag is the model telling you it needs depth'],
              ['longContext', 'estimated token count crosses your threshold', 'frontier, or a long-context local model', 'quality degrades fastest here on local models'],
              ['webSearch', 'a web tool is in play', 'whichever provider handles it', 'capability routing rather than cost routing'],
            ],
          },
          {
            type: 'text',
            md: "It counts tokens with tiktoken to detect the long-context case, supports per-project and per-session overrides, and matches custom rules against request headers or body fields. When a single condition isn't enough, a rule can be a Node.js script that receives the request and returns a routing decision. The script gets `input.tokenCount`, `input.summary.toolNames`, `input.summary.hasImage`, and the last user message, then returns a model and any rewrites.\n\nIt also solves the subagent problem Claude Code hasn't yet. You write a short description for each model on the Models page, describing what it's good for, and CCR injects those descriptions into the Agent and Task tool definitions. When Claude Code spawns a subagent, it picks a model and CCR routes that spawned request accordingly.",
          },
          {
            type: 'code',
            lang: 'bash',
            code: `# CLI install (Node 22+). A desktop app exists too.
npm install -g @musistudio/claude-code-router
ccr ui

# Management UI:  http://127.0.0.1:3458
# Model gateway:  http://127.0.0.1:3456
#
# Then: Providers → add Ollama (your mini) and your frontier key
#       Server    → Start
#       Agent Config → Claude Code → pick a default model
#       Routing   → send background to the mini, think to frontier`,
            caption: 'The gateway your agents point at, instead of pointing each one at a provider.',
          },
        ],
      },
      {
        heading: 'Layer 3: A Real Gateway, and When It Earns Its Place',
        blocks: [
          {
            type: 'text',
            md: "[LiteLLM](https://docs.litellm.ai/docs/proxy/configs) is the general answer rather than the coding-specific one. It's an open-source proxy that exposes a hundred-plus providers behind a single OpenAI-compatible endpoint, with request logging, spend tracking, per-key budgets, rate limits, and ordered fallbacks. You supply the routing policy yourself, which is a feature once you have one worth supplying.\n\nIt earns its place when the mini stops being just a coding backend. Once you're also running scheduled classification jobs, a retrieval pipeline over your notes, and a couple of experiments, you want one endpoint that everything talks to and one log that knows what each thing cost. That's the cost-attribution discipline from [Token Economics & AI-Native SDLC · Cost Attribution & Unit Economics](lesson:m7-l6), applied to your own hardware.",
          },
          {
            type: 'code',
            lang: 'yaml',
            code: `# config.yaml
model_list:
  - model_name: local-coder
    litellm_params:
      model: ollama/qwen3-coder
      api_base: http://mac-mini.local:11434
  - model_name: frontier
    litellm_params:
      model: claude-opus-5
      api_key: os.environ/ANTHROPIC_API_KEY

router_settings:
  fallbacks: [{"local-coder": ["frontier"]}]`,
            caption: 'One endpoint, two brains, and an automatic escalation path when the local one errors.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Fallback is not the same as routing',
            md: "A fallback fires when a request fails: the server is down, the context overflowed, the model errored. That's worth configuring and it costs nothing. It will not catch the case that actually matters, which is a local model returning a confident wrong answer. No gateway can detect that. Only a verification step can, which is why [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4) matters more in a hybrid setup than in a single-model one.",
          },
        ],
      },
      {
        heading: 'The Rule That Cannot Misfire',
        blocks: [
          {
            type: 'text',
            md: "Whatever rung you stop on, one rule deserves to be written before any of the clever ones, because it's the only one with no failure mode: **route by repository.**\n\nClient work under an NDA goes to the local box unconditionally. Not because a local model is better at it, and not because the tasks are easier. Because the constraint is legal, and legal constraints don't care how hard the task is. Everything else defaults to frontier.\n\nThat rule needs no classifier, no token count, and no judgment. You know which repository you're in before you type anything. It's the routing equivalent of a hook rather than an instruction: deterministic, unskippable, and it holds on the day you're tired and moving fast.",
          },
          {
            type: 'table',
            headers: ['Rung', 'Effort', 'What it buys', 'Stop here if'],
            rows: [
              ['0: two aliases', '5 minutes', 'most of the value, manual switching', 'you code solo and switch a few times a day'],
              ['1: Plan/Act split', '2 dropdowns in Cline', 'frontier thinks, local types, inside one task', 'coding is your main workload. Most people stop here.'],
              ['2: Claude Code Router', 'an afternoon', 'automatic routing by request type, subagent control', 'you switch constantly and want it invisible'],
              ['3: LiteLLM gateway', 'a day, plus upkeep', 'one endpoint, one log, budgets and fallbacks', 'the box runs scheduled jobs as well as coding'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Climb only when the rung below annoys you',
            md: "Each rung removes a manual step and adds a thing that can break at 2am. Layer 0 has no failure mode beyond your own forgetfulness. Layer 3 is a service you now operate. Move up when the friction below is real and measured, never because the higher rung sounds more professional.",
          },
        ],
      },
    ],
    lab: {
      title: 'Measure Your Split, Then Automate It',
      intro:
        "Routing policies written from imagination are wrong, because everyone guesses their own workload badly. Spend a week collecting the data first, then build exactly the routing you turn out to need.",
      steps: [
        'Add the two aliases from this lesson to your shell config. Confirm `ccl` reaches your server and `cc` reaches the frontier, by watching GPU load on the server for one and not the other.',
        'Write `hybrid-policy.md` with your first-guess split: at least five task classes on each side, plus the two-strikes escalation trigger.',
        'For one week, keep a tally file. Every time you start a task, log one line: task class, which alias you used, and whether you had to escalate. Thirty lines is plenty.',
        'At the end of the week, count. What fraction actually ran local? Which task classes escalated more than once? Those escalations are your policy being wrong, and they are the whole point of the exercise.',
        'Rewrite hybrid-policy.md from the tally rather than from memory. Move any task class that escalated twice or more to the frontier column permanently.',
        'Set up the Plan/Act split: install Cline, configure a frontier model for Plan mode and your local coder for Act mode, and run one real feature through the full loop.',
        'Compare the Plan/Act run against the same task done entirely on frontier and entirely on local. Record wall-clock time, how many correction rounds each needed, and your honest quality verdict.',
        'Only if the manual switching still annoys you: install Claude Code Router, point `background` at the mini and `think` at the frontier, and run a day of normal work through it. Check the Logs page to confirm requests resolved to the models you expected.',
        'Add the repository rule wherever it can be enforced: NDA repos to the local box unconditionally. Write it at the top of hybrid-policy.md so it survives every future revision.',
      ],
      checklist: [
        'Both aliases work, verified by watching load on the server',
        'A week of real task-by-task tallies exists, not a guess',
        'hybrid-policy.md was rewritten from the tally, with at least one task class moved',
        'One feature shipped through a Plan/Act split with two different models',
        'I compared Plan/Act against all-frontier and all-local on the same task and recorded the numbers',
        'The unconditional repository rule is written down at the top of the policy',
      ],
    },
    checkQuiz: [
      {
        q: 'What makes role-based routing (Plan on frontier, Act on local) more reliable than difficulty-based routing?',
        options: [
          'Planning models are cheaper per token than implementation models',
          'The harness already knows which role it is running, so no judgment call is required',
          'Local models are specifically trained for implementation and cannot plan',
          'It halves the number of requests, which halves the cost',
        ],
        answer: 1,
        explain:
          'Role is a fact the harness holds before the request goes out, so routing on it is a lookup rather than a guess. Difficulty has to be inferred from text that does not contain it. The reliability difference comes entirely from knowing versus estimating.',
      },
      {
        q: 'You configure a LiteLLM fallback from your local model to a frontier model. What will that fallback NOT protect you from?',
        options: [
          'The Mac mini being asleep or the server being down',
          'A request whose context overflows the local model\'s window',
          'The local model returning a confident, plausible, wrong answer',
          'A transient network error between your laptop and the server',
        ],
        answer: 2,
        explain:
          'Fallbacks fire on failures, and a wrong answer is not a failure as far as the gateway can see: it got a well-formed 200 response. Only a verification step, meaning a test, a build, or a review, catches quality problems. This is why hybrid setups need verification more than single-model setups do.',
      },
      {
        q: 'When is it worth climbing from Layer 1 (Plan/Act split) to Layer 2 (a routing gateway)?',
        options: [
          'Immediately, since automation is always better than manual switching',
          'When you are switching constantly enough that the manual step is measurably costing you, and you want subagent-level control',
          'Once your monthly frontier bill exceeds the cost of the hardware',
          'Never; gateways add latency that outweighs any benefit',
        ],
        answer: 1,
        explain:
          'Each rung trades a manual step for a service you now operate and can break. Climb on measured friction rather than on principle. The gateway also unlocks per-subagent routing, which Claude Code does not yet offer natively, so that capability can justify the move on its own.',
      },
      {
        q: 'Your tally week shows that "add a small feature to an existing file" escalated to frontier four times out of six. What does the policy change?',
        options: [
          'Nothing; a 33% local success rate is acceptable for a cheap model',
          'Move that task class to the frontier column permanently, since the escalations are the policy being wrong',
          'Lower the escalation trigger to one attempt so it escalates faster',
          'Switch to a larger local model and keep the class local regardless',
        ],
        answer: 1,
        explain:
          'The tally exists to find exactly this. Four escalations out of six means every attempt at that class costs you a local run plus a frontier run plus the context switch, which is worse than going straight to frontier. Moving the class is the cheap fix; a bigger local model is a hypothesis you would have to test separately.',
      },
    ],
    resources: [
      { label: 'Claude Code Router', url: 'https://github.com/musistudio/claude-code-router', kind: 'repo' },
      { label: 'Claude Code Router: routing configuration', url: 'https://ccrdesk.top/', kind: 'docs' },
      { label: 'Cline: Plan & Act modes', url: 'https://docs.cline.bot/core-workflows/plan-and-act', kind: 'docs' },
      { label: 'Cline discussion: automatic plan/act loop with separate models', url: 'https://github.com/cline/cline/discussions/12959', kind: 'thread' },
      { label: 'Claude Code model configuration', url: 'https://code.claude.com/docs/en/model-config', kind: 'docs' },
      { label: 'LiteLLM proxy configuration', url: 'https://docs.litellm.ai/docs/proxy/configs', kind: 'docs' },
      { label: 'LiteLLM fallbacks and failover', url: 'https://docs.litellm.ai/docs/proxy/reliability', kind: 'docs' },
    ],
  },
]
