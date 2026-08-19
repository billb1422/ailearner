import type { Lesson } from '../../types'

// Module 3 — AI-Assisted Design (Days 14–16)
// Source: docs/research-notes.md, section D.

export const lessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // m3-l1 · Design Context Engineering · Day 14
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm3-l1',
    title: 'Design Context Engineering',
    day: 14,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can explain why AI-generated UIs converge on a generic look and what context fixes it',
      'Can author a DESIGN.md that defines palette, type scale, spacing, and component rules before any code exists',
      'Can express visual decisions as design tokens an agent can enforce, not adjectives it can ignore',
      'Can run a with/without DESIGN.md experiment and articulate the difference',
    ],
    skipQuiz: [
      {
        q: 'Why do AI-generated UIs from different people all look roughly the same?',
        options: [
          'Models are trained mostly on Bootstrap templates',
          'Given no design context or composition system, the model samples the statistical mean of its training data',
          'The rendering libraries constrain what is possible',
          'Providers deliberately watermark output with a house style',
        ],
        answer: 1,
        explain: 'With no constraints, the model regresses to the average of everything it has seen. Generic in, generic out — the fix is supplying a composition system, not better adjectives.',
      },
      {
        q: 'DESIGN.md is best understood as the visual-taste analog of what?',
        options: [
          'A Figma component library',
          'A Storybook instance',
          'CLAUDE.md for engineering conventions',
          'A CSS reset stylesheet',
        ],
        answer: 2,
        explain: 'CLAUDE.md encodes engineering conventions the agent reads before coding; DESIGN.md does the same for visual taste. Same mechanism, different domain.',
      },
      {
        q: 'When should the design system be defined relative to code generation?',
        options: [
          'After the first prototype, so decisions are informed by real UI',
          'Before any code — palette, type scale, spacing, component rules first',
          'Incrementally, one component at a time as needs emerge',
          'Only when a designer joins the project',
        ],
        answer: 1,
        explain: 'If the system exists before generation, every component is born conforming. Retrofitting taste onto generated code is far more expensive than constraining generation up front.',
      },
      {
        q: 'What does the VoltAgent/awesome-design-md repo actually collect?',
        options: [
          'CSS frameworks ranked by GitHub stars',
          'Figma plugins for design tokens',
          '40+ DESIGN.md files extracted from products like Stripe, Linear, Vercel, and Notion',
          'Prompt templates for generating logos',
        ],
        answer: 2,
        explain: 'It is a corpus of real design-system markdown files reverse-engineered from well-designed products — ready-made structure to steal for your own DESIGN.md.',
      },
      {
        q: 'What makes a design token enforceable by an agent, unlike an adjective?',
        options: [
          'Tokens are shorter, so they use fewer tokens of context',
          'Tokens compile to CSS variables automatically',
          'Tokens require a build step the agent controls',
          'A token is a concrete named value the agent can be told to use exclusively; an adjective leaves interpretation to the model',
        ],
        answer: 3,
        explain: '"Use only spacing values from the scale: 4, 8, 12, 16, 24, 32" is checkable. "Make it feel airy" is not. Enforceable rules are the whole point.',
      },
    ],
    sections: [
      {
        heading: 'Why every AI UI looks the same',
        blocks: [
          {
            type: 'text',
            md: 'Ask an agent for "a clean, modern dashboard" and you get the same thing everyone gets: Inter, a purple gradient, cards with 16px padding. Not because the model lacks ability — because you gave it **no composition system and no design context**. It defaults to the statistical center of its training data.\n\nThe failure is an input problem, and input problems are engineering problems.',
          },
          {
            type: 'compare',
            left: {
              title: 'No design context',
              items: [
                'Prompt: "modern, clean, professional"',
                'Model picks defaults: Inter, purple gradient, shadcn look',
                'Every screen drifts — no shared scale or palette',
                'Feedback loop: "no, more premium" (unfalsifiable)',
              ],
            },
            right: {
              title: 'DESIGN.md in context',
              items: [
                'Palette, type scale, spacing defined as named tokens',
                'Component rules: radii, borders, elevation, states',
                'Every generation is born conforming to one system',
                'Feedback loop: "that violates spacing token rules" (checkable)',
              ],
            },
          },
        ],
      },
      {
        heading: 'The DESIGN.md pattern',
        blocks: [
          {
            type: 'text',
            md: 'The fix is one markdown file the agent reads before touching UI code: **DESIGN.md**. It is to visual taste what CLAUDE.md is to engineering conventions.\n\nYou do not have to invent the format. [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) collects 40+ DESIGN.md files extracted from Stripe, Linear, Vercel, Notion and others. Steal a structure, replace the values with yours.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <text x="24" y="36" fill="#a1a1aa" font-size="13">WITHOUT design context</text>
  <rect x="24" y="52" width="150" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="99" y="74" fill="#e4e4e7" font-size="13" text-anchor="middle">Prompt</text>
  <text x="99" y="92" fill="#a1a1aa" font-size="11" text-anchor="middle">"clean, modern"</text>
  <line x1="174" y1="78" x2="264" y2="78" stroke="#52525b" stroke-width="2"/>
  <polygon points="264,78 254,73 254,83" fill="#52525b"/>
  <rect x="266" y="52" width="150" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="341" y="84" fill="#e4e4e7" font-size="13" text-anchor="middle">Model defaults</text>
  <line x1="416" y1="78" x2="506" y2="78" stroke="#52525b" stroke-width="2"/>
  <polygon points="506,78 496,73 496,83" fill="#52525b"/>
  <rect x="508" y="52" width="168" height="52" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="592" y="74" fill="#f472b6" font-size="13" text-anchor="middle">Generic UI</text>
  <text x="592" y="92" fill="#a1a1aa" font-size="11" text-anchor="middle">the same one everyone gets</text>
  <line x1="24" y1="150" x2="676" y2="150" stroke="#3f3f46" stroke-width="1"/>
  <text x="24" y="182" fill="#a1a1aa" font-size="13">WITH DESIGN.md</text>
  <rect x="24" y="198" width="150" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="99" y="220" fill="#e4e4e7" font-size="13" text-anchor="middle">Prompt</text>
  <text x="99" y="238" fill="#a1a1aa" font-size="11" text-anchor="middle">same words</text>
  <rect x="24" y="262" width="150" height="44" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="99" y="282" fill="#38bdf8" font-size="13" text-anchor="middle">DESIGN.md</text>
  <text x="99" y="298" fill="#a1a1aa" font-size="10" text-anchor="middle">tokens + rules</text>
  <line x1="174" y1="224" x2="264" y2="224" stroke="#52525b" stroke-width="2"/>
  <line x1="174" y1="284" x2="230" y2="284" stroke="#38bdf8" stroke-width="2"/>
  <line x1="230" y1="284" x2="230" y2="240" stroke="#38bdf8" stroke-width="2"/>
  <line x1="230" y1="240" x2="264" y2="232" stroke="#38bdf8" stroke-width="2"/>
  <polygon points="264,224 254,219 254,229" fill="#52525b"/>
  <rect x="266" y="198" width="150" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="341" y="224" fill="#e4e4e7" font-size="13" text-anchor="middle">Model, constrained</text>
  <line x1="416" y1="224" x2="506" y2="224" stroke="#52525b" stroke-width="2"/>
  <polygon points="506,224 496,219 496,229" fill="#52525b"/>
  <rect x="508" y="198" width="168" height="52" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="592" y="220" fill="#34d399" font-size="13" text-anchor="middle">Your UI</text>
  <text x="592" y="238" fill="#a1a1aa" font-size="11" text-anchor="middle">consistent, on-system</text>
</svg>`,
            caption: 'Same prompt, same model. The only variable is design context.',
          },
          {
            type: 'table',
            headers: ['DESIGN.md section', 'What it pins down', 'Example rule'],
            rows: [
              ['Palette', 'Every color, by name and role', 'bg: zinc-950; accent: sky-400; never introduce new hues'],
              ['Type scale', 'Fonts, sizes, weights, line-heights', 'Display 32/40 semibold; body 15/24; two fonts max'],
              ['Spacing', 'The only allowed gaps and padding', 'Scale: 4, 8, 12, 16, 24, 32, 48 — nothing else'],
              ['Component rules', 'Radii, borders, elevation, states', 'radius 8px everywhere; borders over shadows; no gradients'],
              ['Voice / density', 'Copy tone, information density', 'Terse labels; data-dense tables; no marketing fluff'],
            ],
          },
        ],
      },
      {
        heading: 'Tokens are rules, adjectives are wishes',
        blocks: [
          {
            type: 'text',
            md: 'The load-bearing move: express taste as **enforceable tokens**, not vibes. An agent cannot verify "premium". It can verify "only spacing values from the scale" — and so can a review pass or a lint rule.\n\nDefine the system **before any code**. Retrofitting taste onto a generated codebase means touching every component; constraining generation up front costs one file.',
          },
          {
            type: 'code',
            lang: 'markdown',
            code: `# DESIGN.md (excerpt)

## Spacing
Allowed values only: 4, 8, 12, 16, 24, 32, 48px.
Never use arbitrary values like 13px or 22px.

## Color
- bg-base: #0a0a0b   - bg-raised: #18181b
- text-hi: #f4f4f5   - text-lo: #a1a1aa
- accent: #38bdf8 (interactive states only)
Rule: no new colors without updating this file first.

## Components
- Border radius: 8px, everywhere, no exceptions.
- Depth via 1px borders (#27272a), not box-shadows.
- No gradients. No glassmorphism.`,
            caption: 'Every line is checkable. That is what makes it a system, not a mood.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Same discipline, new domain',
            md: 'You already know this pattern: CLAUDE.md turns tribal engineering knowledge into agent-readable rules. DESIGN.md does it for taste. Files are the universal agent substrate — visual quality is just another thing you encode in one.',
          },
        ],
      },
    ],
    lab: {
      title: 'DESIGN.md A/B test',
      intro: 'Prove the pattern to yourself: build the same component twice — once blind, once with a DESIGN.md in context — and compare.',
      steps: [
        'Browse [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and pick one file whose structure you like (Linear and Vercel are good starts).',
        'Write a DESIGN.md for a real or throwaway project: palette (5-8 named colors), type scale (2 fonts, 4 sizes), spacing scale, and 5+ component rules.',
        'In a fresh Claude Code session with **no** DESIGN.md, ask for a settings page component: "a clean, modern settings page with a profile section and notification toggles".',
        'Save the output, then start a fresh session, add DESIGN.md to the project, and give the **identical** prompt plus "follow DESIGN.md exactly".',
        'Render both versions side by side in the browser.',
        'Ask Claude to review version 1 **against your DESIGN.md** and list every violation.',
      ],
      checklist: [
        'DESIGN.md exists with palette, type scale, spacing scale, and component rules',
        'Both component versions render and were built from the identical prompt',
        'You can name at least three concrete visual differences between the runs',
        'The review pass found violations in the no-context version that the DESIGN.md version avoided',
      ],
    },
    checkQuiz: [
      {
        q: 'What is the minimum viable content of a DESIGN.md?',
        options: [
          'A link to your Figma file and brand guidelines PDF',
          'Palette, type scale, spacing scale, and component rules — as concrete values',
          'A paragraph describing the brand personality and target audience',
          'Screenshots of three products you want to imitate',
        ],
        answer: 1,
        explain: 'The file must contain enforceable values, not references or vibes. Palette, type, spacing, and component rules are the load-bearing four.',
      },
      {
        q: 'Which instruction is a design token rule, as opposed to an adjective?',
        options: [
          '"Make the layout feel airy and premium"',
          '"Use a sophisticated dark theme"',
          '"Spacing may only use 4, 8, 12, 16, 24, 32, or 48px"',
          '"Keep it minimal but warm"',
        ],
        answer: 2,
        explain: 'The spacing rule is checkable — any generated value is either on the scale or a violation. The others leave interpretation entirely to the model.',
      },
      {
        q: 'You built the same component with and without DESIGN.md. What is the highest-value follow-up?',
        options: [
          'Delete the worse version and move on',
          'Merge the two versions manually',
          'Increase the model temperature and regenerate',
          'Have the agent review the no-context version against DESIGN.md and enumerate violations',
        ],
        answer: 3,
        explain: 'Review-against-the-file turns DESIGN.md into a verification tool, not just a generation hint — the same verify-first pattern from loop engineering.',
      },
      {
        q: 'Why does defining the design system before code beat evolving it during generation?',
        options: [
          'Models refuse to change styles once code exists',
          'Every component is generated conforming; retrofitting means touching every file already produced',
          'DESIGN.md files cannot be edited after the first session',
          'It reduces the context window used per prompt',
        ],
        answer: 1,
        explain: 'Constraints applied at generation time are free; the same constraints applied afterward are a refactor across the whole UI surface.',
      },
    ],
    resources: [
      {
        label: 'VoltAgent/awesome-design-md — 40+ real DESIGN.md files',
        url: 'https://github.com/VoltAgent/awesome-design-md',
        kind: 'repo',
      },
      {
        label: 'Claude Code memory docs — the CLAUDE.md mechanism DESIGN.md piggybacks on',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Anthropic — Effective context engineering for AI agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic — Claude Code best practices',
        url: 'https://www.anthropic.com/engineering/claude-code-best-practices',
        kind: 'article',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m3-l2 · Vibe-Coding Beautiful UI · Day 14
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm3-l2',
    title: 'Vibe-Coding Beautiful UI',
    day: 14,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can run the sketch-first workflow: Excalidraw structure, export, "follow this structure exactly"',
      'Can direct visual style with reference screenshots and mood-board images instead of adjectives',
      'Can identify and eliminate the default AI tells (Inter, Lucide, purple gradients)',
      'Can decompose a UI build into a sequential single-responsibility prompt pipeline',
    ],
    skipQuiz: [
      {
        q: 'What is the core insight behind sketching layout in Excalidraw before prompting?',
        options: [
          'Sketches reduce token cost versus text descriptions',
          'AI copies way better than it imagines — a structure to follow beats a description to interpret',
          'Excalidraw exports React components directly',
          'Models cannot process layout described in prose',
        ],
        answer: 1,
        explain: 'Given a concrete structure and told "follow this exactly", the model reproduces it faithfully. Asked to invent structure, it regresses to generic patterns.',
      },
      {
        q: 'Why does prompting "modern and warm" for colors fail?',
        options: [
          'Color adjectives map to the same statistical defaults — you get the same blue every time',
          'Models are partially color-blind in text space',
          'Warm palettes render poorly on dark backgrounds',
          'Adjectives consume too much context window',
        ],
        answer: 0,
        explain: 'Adjectives collapse to training-data averages. A mood-board image gives the model actual pixel values to extract a palette from.',
      },
      {
        q: 'Which combination most loudly signals "AI-generated UI" in 2026?',
        options: [
          'System fonts, monochrome icons, flat white background',
          'Serif headings with hand-drawn illustrations',
          'Default Inter font, Lucide icons, purple gradients',
          'Dense tables with zebra striping',
        ],
        answer: 2,
        explain: 'Those are the model defaults everyone ships. Swapping to distinctive Google Fonts and Phosphor icons is the cheapest de-AI move available.',
      },
      {
        q: 'In the om_patel5 playbook, what is the primary communication channel with the model for visual work?',
        options: [
          'Long prose descriptions of the desired feel',
          'CSS snippets pasted into the prompt',
          'Component library documentation links',
          'Screenshots — sketches, references, and the current state of the build',
        ],
        answer: 3,
        explain: 'Vision-capable models take images as first-class input. Screenshots carry structure, style, and bugs with a fidelity prose never reaches.',
      },
      {
        q: 'The 9-prompt pipeline (architecture → design system → content → logic → animation → responsive → QA) is an instance of what principle?',
        options: [
          'Chain-of-thought reasoning',
          'Sequential single-responsibility prompt decomposition',
          'Retrieval-augmented generation',
          'Few-shot prompting',
        ],
        answer: 1,
        explain: 'One concern per prompt, in dependency order. Each prompt does one job well instead of one mega-prompt doing seven jobs poorly.',
      },
    ],
    sections: [
      {
        heading: 'Copy beats imagine',
        blocks: [
          {
            type: 'text',
            md: 'The om_patel5 playbook rests on one asymmetry: **AI copies way better than it imagines**. Asked to invent a layout, the model produces the average layout. Given a concrete structure and told *"follow this structure exactly"*, it reproduces it with high fidelity.\n\nSo never make the model invent what you can show it.',
          },
          {
            type: 'text',
            md: 'The workflow:\n\n- **Structure**: sketch the layout in Excalidraw — boxes and labels, five minutes. Export the image, attach it, say "follow this structure exactly".\n- **Style**: grab screenshots from Dribbble or Mobbin. Per section: "copy this style" — the hero from one reference, the pricing table from another.\n- **Color**: attach a mood-board image and ask for a palette extracted from it. Adjectives like "modern and warm" always yield the same blue.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Screenshots are the API',
            md: 'Structure in (sketch), style in (reference), state out (screenshot of the build). Treat images as the primary channel for visual work — prose is the fallback, not the default.',
          },
        ],
      },
      {
        heading: 'Kill the AI tells',
        blocks: [
          {
            type: 'text',
            md: 'Every model ships the same defaults, so the defaults have become a signature. If your UI has Inter, Lucide icons, and a purple gradient, everyone knows a model built it and nobody chose anything. Swap all three, deliberately, in DESIGN.md so the choice sticks.',
          },
          {
            type: 'table',
            headers: ['AI tell', 'Why it happens', 'The swap'],
            rows: [
              ['Inter for everything', 'Most common font in training data', 'Distinctive Google Fonts pair — e.g. a characterful display face + a workhorse body face'],
              ['Lucide icons', 'Default icon set of the default stack', 'Phosphor icons (or another set with a point of view)'],
              ['Purple gradients', 'The statistical mean of "modern SaaS"', 'Flat color from your mood-board palette; ban gradients outright'],
              ['Identical card grids', 'No composition system supplied', 'Sketch-first structure; vary density and hierarchy on purpose'],
            ],
          },
        ],
      },
      {
        heading: 'One prompt, one job',
        blocks: [
          {
            type: 'text',
            md: 'Big visual builds fail as mega-prompts. The fix is **sequential single-responsibility decomposition** — the 9-prompt pipeline idea: each prompt owns exactly one concern, in dependency order. Architecture before design system, design system before content, animation only after logic works.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">Sequential single-responsibility pipeline — one concern per prompt</text>
  <rect x="24" y="60" width="150" height="54" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="99" y="83" fill="#e4e4e7" font-size="13" text-anchor="middle">1. Architecture</text>
  <text x="99" y="101" fill="#a1a1aa" font-size="11" text-anchor="middle">pages, routes, layout</text>
  <line x1="174" y1="87" x2="264" y2="87" stroke="#52525b" stroke-width="2"/>
  <polygon points="264,87 254,82 254,92" fill="#52525b"/>
  <rect x="266" y="60" width="150" height="54" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="341" y="83" fill="#e4e4e7" font-size="13" text-anchor="middle">2. Design system</text>
  <text x="341" y="101" fill="#a1a1aa" font-size="11" text-anchor="middle">tokens from DESIGN.md</text>
  <line x1="416" y1="87" x2="506" y2="87" stroke="#52525b" stroke-width="2"/>
  <polygon points="506,87 496,82 496,92" fill="#52525b"/>
  <rect x="508" y="60" width="150" height="54" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="583" y="83" fill="#e4e4e7" font-size="13" text-anchor="middle">3. Content</text>
  <text x="583" y="101" fill="#a1a1aa" font-size="11" text-anchor="middle">real copy, no lorem</text>
  <line x1="583" y1="114" x2="583" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="583" y1="150" x2="99" y2="150" stroke="#52525b" stroke-width="2"/>
  <line x1="99" y1="150" x2="99" y2="176" stroke="#52525b" stroke-width="2"/>
  <polygon points="99,176 94,166 104,166" fill="#52525b"/>
  <rect x="24" y="178" width="150" height="54" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="99" y="201" fill="#e4e4e7" font-size="13" text-anchor="middle">4. Logic</text>
  <text x="99" y="219" fill="#a1a1aa" font-size="11" text-anchor="middle">state, data, handlers</text>
  <line x1="174" y1="205" x2="264" y2="205" stroke="#52525b" stroke-width="2"/>
  <polygon points="264,205 254,200 254,210" fill="#52525b"/>
  <rect x="266" y="178" width="150" height="54" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="341" y="201" fill="#e4e4e7" font-size="13" text-anchor="middle">5. Animation</text>
  <text x="341" y="219" fill="#a1a1aa" font-size="11" text-anchor="middle">motion after it works</text>
  <line x1="416" y1="205" x2="506" y2="205" stroke="#52525b" stroke-width="2"/>
  <polygon points="506,205 496,200 496,210" fill="#52525b"/>
  <rect x="508" y="178" width="150" height="54" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="583" y="201" fill="#e4e4e7" font-size="13" text-anchor="middle">6. Responsive + QA</text>
  <text x="583" y="219" fill="#a1a1aa" font-size="11" text-anchor="middle">breakpoints, then audit</text>
  <text x="24" y="270" fill="#a1a1aa" font-size="12">Each stage gets its own prompt (or its own session). Never ask one prompt to do two stages.</text>
</svg>`,
            caption: 'The 9-prompt pipeline, condensed: dependency-ordered, single-responsibility prompts.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The mega-prompt trap',
            md: 'One prompt asking for structure, style, copy, logic, and animation forces the model to average across concerns — and you cannot tell which instruction it dropped. Decomposition makes each failure visible and re-promptable in isolation.',
          },
        ],
      },
    ],
    lab: {
      title: 'Rebuild a screen you dislike',
      intro: 'Take one screen from a past project that never looked right and rebuild it sketch-first with reference screenshots.',
      steps: [
        'Pick the screen and write one sentence on why it fails (usually: generic structure, default styling, or both).',
        'Sketch the layout you actually want in [Excalidraw](https://excalidraw.com) — boxes and labels only, under 10 minutes. Export as PNG.',
        'Collect 2-3 reference screenshots from [Mobbin](https://mobbin.com) or Dribbble, one per section you care about, plus one mood-board image for color.',
        'Prompt 1 — structure: attach the sketch, "follow this structure exactly". Verify layout in the browser before continuing.',
        'Prompt 2 — style: attach references per section, "copy this style", plus the mood-board image for the palette.',
        'Prompt 3 — de-AI pass: swap fonts to a distinctive Google Fonts pair and icons to Phosphor; ban gradients.',
        'Screenshot the result and compare against the original screen.',
      ],
      checklist: [
        'Layout matches your sketch, not a generic template',
        'Palette came from an image, not from adjectives',
        'No Inter, no Lucide, no purple gradient anywhere in the result',
        'Each prompt did exactly one job, and you verified in the browser between prompts',
        'Side-by-side, the rebuild is something you would actually ship',
      ],
    },
    checkQuiz: [
      {
        q: 'Order the sketch-first workflow correctly:',
        options: [
          'Generate UI, then sketch what you got, then refine',
          'Sketch in Excalidraw, export the image, attach it with "follow this structure exactly"',
          'Describe layout in prose, generate, then sketch fixes',
          'Attach references first, then sketch to match them',
        ],
        answer: 1,
        explain: 'Structure comes first and comes from you. The sketch is the contract; "follow this structure exactly" is the instruction that makes the model copy instead of imagine.',
      },
      {
        q: 'How should Dribbble/Mobbin reference screenshots be applied?',
        options: [
          'One global reference for the whole app to keep it consistent',
          'As inspiration you describe in words, since attaching them biases the model',
          'Per section — "copy this style" for the hero from one reference, the table from another',
          'Only after the build is complete, as a comparison baseline',
        ],
        answer: 2,
        explain: 'Per-section references give precise, local style targets. One global reference forces the model back into averaging across mismatched patterns.',
      },
      {
        q: 'What is the standard de-AI swap kit?',
        options: [
          'Tailwind → vanilla CSS, React → Svelte',
          'Distinctive Google Fonts instead of Inter, Phosphor instead of Lucide icons, mood-board colors instead of purple gradients',
          'Dark mode by default plus larger border radii',
          'Custom SVG illustrations on every page',
        ],
        answer: 1,
        explain: 'Font, icon set, and palette are the three defaults everyone recognizes. Swapping them is cheap and removes the strongest generated-UI signals.',
      },
      {
        q: 'In the pipeline, why does animation come after logic rather than with initial styling?',
        options: [
          'Animation libraries must load after state libraries',
          'Motion on top of broken behavior wastes iterations — each prompt has one responsibility, in dependency order',
          'Models cannot generate CSS and JS animation in the same session',
          'Animations invalidate earlier screenshots used as references',
        ],
        answer: 1,
        explain: 'Single-responsibility ordering: you animate interactions that already work. Otherwise every logic fix re-breaks the motion pass.',
      },
    ],
    resources: [
      {
        label: 'om_patel5 — the vibe-coding beautiful UI playbook',
        url: 'https://x.com/om_patel5',
        kind: 'thread',
      },
      {
        label: 'Excalidraw — sketch structure before you prompt',
        url: 'https://excalidraw.com',
        kind: 'docs',
      },
      {
        label: 'Mobbin — real product screenshots for style references',
        url: 'https://mobbin.com',
        kind: 'docs',
      },
      {
        label: 'Phosphor Icons — the Lucide replacement',
        url: 'https://phosphoricons.com',
        kind: 'docs',
      },
      {
        label: 'Google Fonts — pick a distinctive pair',
        url: 'https://fonts.google.com',
        kind: 'docs',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m3-l3 · Encoding Taste as Skills · Day 15
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm3-l3',
    title: 'Encoding Taste as Skills',
    day: 15,
    minutes: 35,
    xp: 100,
    objectives: [
      'Can install and run community design skills (emilkowalski/skills) in Claude Code',
      'Can explain how the grid-systems skill turns a canonical design text into programmable layout rules',
      'Can apply the meta-pattern: encode an expert canon as a skill, then use it to review, not just generate',
      'Can run a skill as a reviewer against existing work and triage its findings',
    ],
    skipQuiz: [
      {
        q: 'What does the /apple-design skill in emilkowalski/skills contain?',
        options: [
          'Apple official HIG documentation mirrored as markdown',
          'A SwiftUI component library',
          '17 design and motion principles distilled from WWDC sessions',
          'A macOS theme for web apps',
        ],
        answer: 2,
        explain: 'It is a distillation — 17 principles extracted from WWDC design and motion talks, packaged so an agent can apply them to any UI work.',
      },
      {
        q: 'What does the grid-systems skill encode?',
        options: [
          'CSS Grid documentation with examples',
          'Müller-Brockmann\'s 162-page grid canon as programmable layout rules',
          'Bootstrap 12-column conventions',
          'A Figma auto-layout exporter',
        ],
        answer: 1,
        explain: 'The classic "Grid Systems in Graphic Design" text becomes executable rules, so agents apply real composition theory instead of vibes.',
      },
      {
        q: 'What is the meta-pattern behind these taste skills?',
        options: [
          'Fine-tune a model on well-designed screenshots',
          'Encode a canonical textbook or expert\'s principles as a skill, then use it to review existing work — not just generate',
          'Chain multiple design models and vote on outputs',
          'Store screenshots of good design in a vector database',
        ],
        answer: 1,
        explain: 'Distill the canon into rules, package as a skill, and point it at work as a reviewer. Review mode is where encoded taste pays off most.',
      },
      {
        q: 'How do you install emilkowalski/skills?',
        options: [
          'npx skills@latest add emilkowalski/skills',
          'npm install -g emilkowalski-skills',
          'git submodule add into .claude/plugins',
          'claude /install emilkowalski',
        ],
        answer: 0,
        explain: 'The skills CLI pulls skill packages straight from GitHub repos into your agent setup — one command, 12.8k-star taste package installed.',
      },
      {
        q: 'What does the UI/UX Pro Max skill force that a bare prompt does not?',
        options: [
          'A specific React component library',
          'GPU-accelerated animations only',
          'A reasoning pass plus an industry-specific design system, with generic gradients banned',
          'Automatic dark-mode variants for every screen',
        ],
        answer: 2,
        explain: 'It front-loads deliberate design reasoning and picks a design system fit for the industry — structurally preventing the generic-gradient default.',
      },
    ],
    sections: [
      {
        heading: 'Taste is packageable',
        blocks: [
          {
            type: 'text',
            md: 'You cannot prompt "have good taste". But taste, distilled into principles, is just rules — and rules package as **skills**. The proof is [emilkowalski/skills](https://github.com/emilkowalski/skills): 12.8k stars, MIT, installed with one command:\n\n- npx skills@latest add emilkowalski/skills\n\nEmil is one of the most respected interaction designers shipping on the web; the repo is his taste, encoded.',
          },
          {
            type: 'table',
            headers: ['Skill', 'What it encodes', 'Best used for'],
            rows: [
              ['/apple-design', '17 design + motion principles distilled from WWDC', 'Generation and review of any UI'],
              ['review-animations', 'A motion-quality rubric', 'Auditing existing animations for timing, easing, purpose'],
              ['improve-animations', 'Concrete upgrade moves for motion', 'Fixing what review-animations flags'],
              ['animation-vocabulary', 'Shared terms for describing motion', 'Precise prompts — "ease-out spring" beats "smoother"'],
              ['grid-systems (nicos_ai)', 'Müller-Brockmann\'s 162-page grid canon as programmable layout rules', 'Layout with actual composition theory'],
              ['UI/UX Pro Max', 'Forced reasoning pass + industry-specific design system; bans generic gradients', 'Greenfield UI where defaults would take over'],
            ],
          },
        ],
      },
      {
        heading: 'The meta-pattern: canon → skill → reviewer',
        blocks: [
          {
            type: 'text',
            md: 'The transferable idea is bigger than any one repo: **take a canonical text or expert\'s principles, encode them as a skill, then point the skill at existing work as a reviewer** — not just at new generation.\n\nGrid-systems is the cleanest example: a 162-page classic becomes programmable layout rules, so the agent applies real composition theory instead of vibes. Any canon you respect can get the same treatment.',
          },
          {
            type: 'compare',
            left: {
              title: 'Skill as generator',
              items: [
                'Applies principles while producing new UI',
                'Quality depends on the prompt using it',
                'Failures are silent — you get output, not findings',
                'Useful, but one-shot',
              ],
            },
            right: {
              title: 'Skill as reviewer',
              items: [
                'Audits existing work against the encoded canon',
                'Produces named, ranked violations',
                'Findings are actionable and verifiable after the fix',
                'Compounds: run it on every screen, forever',
              ],
            },
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Review is where taste skills earn their keep',
            md: 'This mirrors the verification lesson from loop engineering: a rubric applied to real output beats a hope applied to generation. "Run /apple-design against this screen and rank the violations" gives you a checkable signal, every time.',
          },
        ],
      },
    ],
    lab: {
      title: 'Get reviewed by Apple\'s principles',
      intro: 'Install the taste, then take the hit: run /apple-design as a reviewer against something you actually built.',
      steps: [
        'Install: run "npx skills@latest add emilkowalski/skills" in a project with UI you built (yesterday\'s lab output works).',
        'Confirm the skills registered — list available skills in Claude Code and find /apple-design.',
        'Run /apple-design in review mode: "Review this screen against all 17 principles. Rank violations by severity. Do not fix anything yet."',
        'Read the findings and pick the top three. For each, decide: agree, disagree with reasons, or need to see it fixed to judge.',
        'Have Claude fix only the top three, one at a time, screenshotting after each.',
        'Re-run the review and confirm those three findings clear without new regressions.',
      ],
      checklist: [
        'emilkowalski/skills installed and /apple-design invocable',
        'Review produced ranked findings referencing specific principles',
        'Top three findings fixed, one at a time, with a screenshot after each',
        'Re-review confirms the fixes and reports no new violations',
      ],
    },
    checkQuiz: [
      {
        q: 'Why does running a taste skill as a reviewer beat using it only for generation?',
        options: [
          'Review mode uses fewer tokens than generation',
          'Review produces named, ranked, verifiable violations against existing work — a checkable signal you can re-run after fixes',
          'Generation mode is deprecated in the skills standard',
          'Reviewers can modify files that generators cannot',
        ],
        answer: 1,
        explain: 'A rubric applied to real output yields actionable findings you can verify cleared. Generation applies principles once, silently, with no audit trail.',
      },
      {
        q: 'Which skills in the emilkowalski package specifically target motion?',
        options: [
          'grid-systems, apple-design, and emil-design-eng',
          'Only /apple-design covers motion',
          'review-animations, improve-animations, and animation-vocabulary',
          'motion-tokens and spring-physics',
        ],
        answer: 2,
        explain: 'The trio covers audit (review), remediation (improve), and precise language (vocabulary) — a complete motion workflow.',
      },
      {
        q: 'What does encoding Müller-Brockmann as a skill give you that "make the layout well-designed" does not?',
        options: [
          'Faster rendering of grid layouts',
          'Automatic Figma frame generation',
          'Compatibility with print design workflows',
          'Real composition theory applied as programmable rules instead of the model\'s vibes',
        ],
        answer: 3,
        explain: 'The skill grounds layout decisions in a specific, checkable canon. The bare prompt leaves the model to interpolate "well-designed" from training-data averages.',
      },
      {
        q: 'You ran /apple-design as a reviewer and got 11 findings. Per the lab, what next?',
        options: [
          'Fix all 11 in one batch prompt to save tokens',
          'Triage: fix the top three one at a time with screenshots, then re-run the review to confirm they clear',
          'Regenerate the whole screen from scratch with the skill active',
          'Dismiss findings that conflict with your DESIGN.md automatically',
        ],
        answer: 1,
        explain: 'Small verified batches plus a re-review is the verification loop applied to design: each fix is confirmed against the same rubric that flagged it.',
      },
    ],
    resources: [
      {
        label: 'emilkowalski/skills — apple-design, animation skills (12.8k stars)',
        url: 'https://github.com/emilkowalski/skills',
        kind: 'repo',
      },
      {
        label: 'animations.dev — Emil Kowalski\'s animation course, the source of the taste',
        url: 'https://animations.dev',
        kind: 'course',
      },
      {
        label: 'Agent Skills — the open standard these packages ride on',
        url: 'https://agentskills.io',
        kind: 'docs',
      },
      {
        label: 'nicos_ai — the grid-systems skill (Müller-Brockmann encoded)',
        url: 'https://x.com/nicos_ai',
        kind: 'thread',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m3-l4 · Claude Design, Figma & Direct Design · Day 15
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm3-l4',
    title: 'Claude Design, Figma & Direct Design',
    day: 15,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can explain what Claude Design produces and how it extracts a design system from a codebase and Figma',
      'Can state what Claude in Figma automates well and where it falls short',
      'Can run the Direct Design workflow: describe DO / FEEL / FOR WHOM and iterate in running code',
      'Can choose between Claude Design, Figma, and direct-in-code for a given design task',
    ],
    skipQuiz: [
      {
        q: 'What does Claude Design (Anthropic Labs, April 2026) produce from a conversation?',
        options: [
          'Static PNG mockups for review',
          'Figma files with auto-layout applied',
          'Live, clickable HTML prototypes, slides, and one-pagers',
          'Design-token JSON for your build pipeline',
        ],
        answer: 2,
        explain: 'The output is running HTML you can click through immediately — not a picture of a design, but the design itself.',
      },
      {
        q: 'How does Claude Design pick up your existing visual language?',
        options: [
          'You paste your brand guidelines into each conversation',
          'It reads your codebase and Figma files to extract your design system',
          'It infers style from screenshots of your marketing site',
          'It ships a fixed set of professional templates',
        ],
        answer: 1,
        explain: 'Codebase plus Figma extraction means prototypes are born on-brand, and /design-sync keeps that extraction current.',
      },
      {
        q: 'What is Claude in Figma notably bad at, per practitioners?',
        options: [
          'Generating component variations at scale',
          'Producing wireframes from prompts',
          'Building component libraries',
          'Brand nuance and micro-interactions',
        ],
        answer: 3,
        explain: 'It automates the mechanical middle — variations, wireframes, libraries — but the last mile of brand feel and micro-interaction still needs a human or running code.',
      },
      {
        q: 'What is the core move of Direct Design (Alex Kehr)?',
        options: [
          'Drop the Figma translation layer and iterate the design in running code',
          'Design entirely in Figma, then auto-export production code',
          'Hire designers only after product-market fit',
          'Generate ten mockups and A/B test them all',
        ],
        answer: 0,
        explain: 'Instead of mock → translate → build, you describe intent and iterate directly in the running product. The mockup step disappears.',
      },
      {
        q: 'What does Direct Design collapse from weeks to minutes?',
        options: [
          'The build pipeline and CI time',
          'The design-feedback loop — you experience the design instead of guessing from a mock',
          'Stakeholder approval meetings',
          'Design-token generation',
        ],
        answer: 1,
        explain: 'When iteration happens in running code, every change is experienced immediately — the translation-and-handoff delay is gone.',
      },
    ],
    sections: [
      {
        heading: 'Claude Design: prototypes that run',
        blocks: [
          {
            type: 'text',
            md: '**Claude Design** (Anthropic Labs, April 2026) turns conversation into **live, clickable HTML** — prototypes, slides, one-pagers. Not mock images: artifacts you click through.\n\nThe differentiator is context: it reads your **codebase and Figma files** to extract your actual design system, so output lands on-brand instead of on-default. **/design-sync** (June 2026) keeps that extraction current as the system evolves.',
          },
          {
            type: 'text',
            md: '**Claude in Figma** attacks the canvas from the other side: it automates variations, wireframes, and component libraries at a speed no human matches. What it cannot do is **brand nuance and micro-interactions** — the last mile of feel. Use it for mechanical breadth, not for taste.',
          },
        ],
      },
      {
        heading: 'Direct Design: skip the mockup entirely',
        blocks: [
          {
            type: 'text',
            md: 'Alex Kehr\'s **Direct Design** goes further: drop the Figma translation layer altogether. Describe three things — what the product should **DO**, how it should **FEEL**, and who it is **FOR** — then iterate in running code with the agent.\n\nThe feedback loop collapses from weeks to minutes, and the quality of feedback changes kind: you **experience** the design — real data, real latency, real interactions — instead of guessing from a static mock.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The mock was always a proxy',
            md: 'A mockup is a prediction of what running software will feel like. When generating the running software is as fast as generating the mock, the prediction step is pure overhead — for one-team product work, evaluate the real thing.',
          },
        ],
      },
      {
        heading: 'Choosing a mode',
        blocks: [
          {
            type: 'table',
            headers: ['Mode', 'Wins when', 'Weak at', 'Output'],
            rows: [
              ['Claude Design', 'Fast stakeholder-ready prototypes and decks that must match your existing design system', 'Deep product logic; long-lived production code', 'Live clickable HTML, slides, one-pagers'],
              ['Claude in Figma', 'Mechanical breadth: variations, wireframes, component libraries inside a design-org workflow', 'Brand nuance, micro-interactions', 'Figma frames and components'],
              ['Direct Design (in code)', 'Solo/small-team product work; flows judged by feel; DESIGN.md already pins the system', 'Multi-stakeholder sign-off before build; print/brand artwork', 'The running product itself'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Default for this course',
            md: 'Bill\'s context — architect building his own tools — makes **Direct Design the default**, with Claude Design for anything a stakeholder must click before you commit, and Figma only when a design org already lives there.',
          },
        ],
      },
    ],
    lab: {
      title: 'Idea to clickable, no mockup step',
      intro: 'Take one flow from idea to a clickable prototype without ever drawing a static mock — in Claude Design if you have access, otherwise directly in code.',
      steps: [
        'Pick one flow you have wanted to build — onboarding, a settings redesign, a dashboard drill-down.',
        'Write the Direct Design brief in three short paragraphs: what it should DO, how it should FEEL, who it is FOR.',
        'If you have Claude Design access: paste the brief and let it extract your design system (or point it at yesterday\'s DESIGN.md). Otherwise: fresh Claude Code session, brief plus DESIGN.md, target a running local page.',
        'Click through the first version end to end before giving any feedback. Note where the flow feels wrong — not where it looks wrong.',
        'Iterate three rounds, each round one FEEL-level correction (pacing, hierarchy, friction), experienced live after each change.',
        'Compare timestamps: idea to clickable. Write down the number.',
      ],
      checklist: [
        'A DO / FEEL / FOR-WHOM brief exists and is under a page',
        'A clickable prototype exists with zero static mockups produced along the way',
        'At least one issue you found came from clicking the flow, not from looking at it',
        'Three feel-level iterations completed, each experienced live',
        'You know your idea-to-clickable time in minutes',
      ],
    },
    checkQuiz: [
      {
        q: 'The Direct Design brief describes exactly three things. Which set?',
        options: [
          'Stack, timeline, and budget',
          'What it should DO, how it should FEEL, who it is FOR',
          'Palette, typography, and spacing',
          'Personas, user stories, and acceptance criteria',
        ],
        answer: 1,
        explain: 'DO / FEEL / FOR WHOM is the whole brief — intent and audience, leaving structure and style to iteration in running code.',
      },
      {
        q: 'When does Figma still beat designing directly in code?',
        options: [
          'Whenever animations are involved',
          'When the app has more than ten screens',
          'When a design org needs mechanical breadth — variations, wireframes, shared component libraries — inside its existing workflow',
          'Never; Figma is fully obsolete in 2026',
        ],
        answer: 2,
        explain: 'Figma remains the right surface where a design organization collaborates and needs scale on mechanical work — even though brand nuance still is not automatable there.',
      },
      {
        q: 'Why does experiencing a clickable prototype beat evaluating a static mock?',
        options: [
          'Clickable prototypes are cheaper to produce than mocks',
          'Stakeholders trust HTML more than images',
          'Static mocks cannot show dark mode',
          'Flow, pacing, and interaction problems only surface when you actually use the thing — a mock is a prediction, the prototype is the evidence',
        ],
        answer: 3,
        explain: 'The lab makes this concrete: your best findings come from clicking through, not looking at. Real interaction exposes what static frames hide.',
      },
      {
        q: 'What problem does /design-sync solve for Claude Design?',
        options: [
          'It keeps the extracted design system current as your codebase and Figma files evolve',
          'It syncs prototypes to production deployment',
          'It merges multiple users\' edits to one prototype',
          'It converts HTML prototypes back into Figma frames',
        ],
        answer: 0,
        explain: 'Extraction is a snapshot; /design-sync re-syncs it so new prototypes track the design system you actually have, not the one you had in April.',
      },
    ],
    resources: [
      {
        label: 'Anthropic — Claude Design announcement',
        url: 'https://www.anthropic.com/news/claude-design',
        kind: 'article',
      },
      {
        label: 'Alex Kehr — Direct Design',
        url: 'https://x.com/alexkehr',
        kind: 'thread',
      },
      {
        label: 'Figma — where Claude-in-Figma lives',
        url: 'https://www.figma.com',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs — the direct-in-code half of the workflow',
        url: 'https://code.claude.com/docs',
        kind: 'docs',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m3-l5 · Vision Loops & iOS · Day 16
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm3-l5',
    title: 'Vision Loops & iOS',
    day: 16,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can close the visual feedback loop: agent screenshots its own output, analyzes, fixes, repeats',
      'Can pick the right loop-closer per platform: Chrome extension for web, computer use for native macOS, simulator skills for iOS',
      'Can explain how the iOS simulator skill drives an app via the accessibility tree',
      'Can apply token-cost-aware skill design when wrapping noisy build tools',
    ],
    skipQuiz: [
      {
        q: 'What is the shape of a closed visual feedback loop?',
        options: [
          'Generate → lint → typecheck → commit',
          'Screenshot own output → analyze → fix → repeat until it matches the spec',
          'Generate three variants → pick the best → ship',
          'Ask the user to review after every change',
        ],
        answer: 1,
        explain: 'The agent must see what it built. Screenshot, analyze against intent, fix, and re-screenshot — the same verify loop as tests, but for pixels.',
      },
      {
        q: 'How does the iOS simulator skill (conorluddy) interact with the app?',
        options: [
          'It injects JavaScript into WKWebViews',
          'It parses SwiftUI source to predict the render',
          'It records the user demonstrating the flow once',
          'It taps, swipes, and screenshots via the accessibility tree — like a QA engineer working with no docs',
        ],
        answer: 3,
        explain: 'The accessibility tree gives it the same handles a QA engineer has: what is on screen and what can be tapped, no source-level knowledge required.',
      },
      {
        q: 'What does the ios-builder + GitHub Actions pipeline do end to end?',
        options: [
          'Build → open every screen → fill forms → pull debug logs → structured error report',
          'Compile and upload to TestFlight automatically',
          'Run XCTest suites in parallel on device farms',
          'Generate App Store screenshots in every locale',
        ],
        answer: 0,
        explain: 'It is an autonomous QA pass in CI: exercise the whole UI surface, capture logs, and return a structured report the agent can act on.',
      },
      {
        q: 'Why does the xcodebuild wrapper skill exist, in its author\'s words?',
        options: [
          'To pin the Xcode version across machines',
          '"To save context" — raw xcodebuild output would flood the window; the wrapper returns only what the agent needs',
          'To retry flaky code-signing steps',
          'To parallelize builds across simulators',
        ],
        answer: 1,
        explain: 'Token-cost-aware skill design: wrap verbose tools so the loop sees signal, not thousands of lines of build noise.',
      },
      {
        q: 'Vision-in-the-loop is the difference between what two states?',
        options: [
          'Prototype and production',
          'Fast builds and slow builds',
          '"Looks done" and verified UI',
          'Manual QA and automated QA',
        ],
        answer: 2,
        explain: 'An agent that never sees its output can only claim done. One that screenshots and checks has evidence — verified beats asserted.',
      },
    ],
    sections: [
      {
        heading: 'Close the loop or take its word',
        blocks: [
          {
            type: 'text',
            md: 'Everything so far — DESIGN.md, references, taste skills — improves generation. This lesson adds **verification**: the agent screenshots its own output, analyzes it against intent, fixes, and repeats.\n\nWithout the loop, "done" means the code compiled. With it, done means the pixels were inspected. This is the visual version of the #1 quality lever from loop engineering: give the agent a real pass/fail signal.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">The vision loop — the agent sees what it built</text>
  <rect x="60" y="60" width="160" height="56" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="140" y="84" fill="#e4e4e7" font-size="13" text-anchor="middle">Write / fix code</text>
  <text x="140" y="102" fill="#a1a1aa" font-size="11" text-anchor="middle">component, screen, flow</text>
  <line x1="220" y1="88" x2="330" y2="88" stroke="#52525b" stroke-width="2"/>
  <polygon points="330,88 320,83 320,93" fill="#52525b"/>
  <rect x="332" y="60" width="160" height="56" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="412" y="84" fill="#e4e4e7" font-size="13" text-anchor="middle">Render + screenshot</text>
  <text x="412" y="102" fill="#a1a1aa" font-size="11" text-anchor="middle">browser / sim / desktop</text>
  <line x1="492" y1="88" x2="600" y2="88" stroke="#52525b" stroke-width="2"/>
  <line x1="600" y1="88" x2="600" y2="180" stroke="#52525b" stroke-width="2"/>
  <line x1="600" y1="180" x2="512" y2="180" stroke="#52525b" stroke-width="2"/>
  <polygon points="512,180 522,175 522,185" fill="#52525b"/>
  <rect x="352" y="152" width="160" height="56" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="432" y="176" fill="#e4e4e7" font-size="13" text-anchor="middle">Analyze vs intent</text>
  <text x="432" y="194" fill="#a1a1aa" font-size="11" text-anchor="middle">DESIGN.md, sketch, spec</text>
  <line x1="352" y1="180" x2="240" y2="180" stroke="#52525b" stroke-width="2"/>
  <polygon points="240,180 250,175 250,185" fill="#52525b"/>
  <rect x="80" y="152" width="160" height="56" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="160" y="176" fill="#e4e4e7" font-size="13" text-anchor="middle">Pass or fail?</text>
  <text x="160" y="194" fill="#a1a1aa" font-size="11" text-anchor="middle">real criteria, not vibes</text>
  <line x1="140" y1="152" x2="140" y2="120" stroke="#f472b6" stroke-width="2"/>
  <polygon points="140,120 135,130 145,130" fill="#f472b6"/>
  <text x="128" y="140" fill="#f472b6" font-size="11" text-anchor="end">fail: loop</text>
  <line x1="160" y1="208" x2="160" y2="252" stroke="#34d399" stroke-width="2"/>
  <polygon points="160,252 155,242 165,242" fill="#34d399"/>
  <rect x="80" y="254" width="160" height="48" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="160" y="282" fill="#34d399" font-size="13" text-anchor="middle">Verified UI</text>
  <text x="330" y="282" fill="#a1a1aa" font-size="12">Web: Chrome extension · macOS native: computer use · iOS: simulator skill</text>
</svg>`,
            caption: 'Screenshot → analyze → fix → repeat, with a real stop condition.',
          },
          {
            type: 'table',
            headers: ['Platform', 'Loop closer', 'How it sees and acts'],
            rows: [
              ['Web frontend', 'Claude Code Chrome extension', 'Drives the real browser: screenshots, console, network, DOM'],
              ['Native macOS app', 'Computer use (research preview)', 'Full write → compile → launch → click → fix loops on the desktop'],
              ['iOS app', 'Simulator skill (conorluddy/ios-simulator-skill)', 'Taps, swipes, screenshots via the accessibility tree'],
              ['iOS in CI', 'ios-builder + GitHub Actions', 'Build → open every screen → fill forms → pull logs → structured error report'],
            ],
          },
        ],
      },
      {
        heading: 'iOS: a QA engineer with no docs',
        blocks: [
          {
            type: 'text',
            md: 'The [ios-simulator-skill](https://github.com/conorluddy/ios-simulator-skill) lets Claude drive the simulator like **a QA engineer handed an app with no documentation**: read the accessibility tree, tap, swipe, type, screenshot, judge, repeat.\n\nScaled up, **ios-builder + GitHub Actions** runs the whole pass in CI — build the app, open every screen, fill the forms, pull debug logs, and return a structured error report instead of a green checkmark that means nothing.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Token-cost-aware skill design',
            md: 'The suite\'s xcodebuild wrapper exists, per its author, **"to save context"**. Raw xcodebuild emits thousands of lines; the wrapper returns pass/fail plus the errors that matter. When you wrap a noisy tool for an agent loop, budget its output like money — because it is.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The module\'s closing claim',
            md: 'Vision-in-the-loop is the difference between **"looks done" and verified UI**. Generation quality (l1-l4) sets the ceiling; the vision loop is what guarantees you actually reached it.',
          },
        ],
      },
    ],
    lab: {
      title: 'Let the agent find a real visual bug',
      intro: 'Run one full visual verification loop and let the agent — not you — discover a genuine visual defect.',
      steps: [
        'Pick a target: a web page you built (use the Chrome extension) or, if you have Xcode, an app in the iOS simulator (install conorluddy/ios-simulator-skill).',
        'Plant realism if needed: if the page is too clean, resize the window to mobile width or add real long-string data — most UIs break somewhere.',
        'Give the loop a real criterion: "Screenshot this page, compare against DESIGN.md and the sketch, and list every visual defect ranked by severity."',
        'Verify the agent actually took screenshots — check that findings reference visible evidence, not code-reading guesses.',
        'Have it fix the top defect, re-screenshot, and confirm the fix visually before claiming done.',
        'Note one defect the agent caught that you had not — that gap is the value of the loop.',
      ],
      checklist: [
        'The agent captured and analyzed its own screenshots (evidence-based findings, not code inference)',
        'At least one genuine visual defect was found and ranked',
        'The fix was verified with a fresh screenshot, not asserted from the diff',
        'You can name a defect the loop caught that manual eyeballing missed',
        'The loop had a stop condition and actually stopped',
      ],
    },
    checkQuiz: [
      {
        q: 'You need the visual loop on a native macOS app. Which closes it?',
        options: [
          'The Chrome extension in a WebView',
          'Computer use — write, compile, launch, click, and fix on the actual desktop',
          'The iOS simulator skill in Mac Catalyst mode',
          'Rendering the views to HTML for screenshotting',
        ],
        answer: 1,
        explain: 'Native macOS UI is only observable on the desktop itself; computer use gives the agent screenshots and input there — the full write → compile → launch → click → fix loop.',
      },
      {
        q: 'For a web frontend, the standard loop closer is:',
        options: [
          'A headless HTML validator',
          'Jest snapshot tests on component markup',
          'The Claude Code Chrome extension driving the real browser — screenshots, console, network',
          'Lighthouse CI scores',
        ],
        answer: 2,
        explain: 'The extension lets the agent see the rendered page and interact with it — markup-level checks never catch what pixels reveal.',
      },
      {
        q: 'What does token-cost-aware skill design mean in practice?',
        options: [
          'Wrap noisy tools so the loop receives distilled signal — pass/fail and relevant errors — instead of thousands of raw output lines',
          'Prefer smaller models for all visual analysis',
          'Cache screenshots to avoid re-uploading them',
          'Limit loops to three iterations maximum',
        ],
        answer: 0,
        explain: 'Every loop iteration pays for its context. Wrappers like the xcodebuild one exist precisely "to save context" so iterations stay cheap and focused.',
      },
      {
        q: 'When does the CI pipeline (ios-builder + Actions) beat the local simulator skill?',
        options: [
          'When you need to debug one screen interactively',
          'When exploring an unfamiliar app for the first time',
          'When the fix requires watching an animation frame by frame',
          'When you want every screen exercised on every push — forms filled, logs pulled, errors reported — without you at the keyboard',
        ],
        answer: 3,
        explain: 'Local simulator driving is for interactive iteration; the CI pipeline is the same loop made autonomous and repeatable across the whole UI surface on every push.',
      },
    ],
    resources: [
      {
        label: 'conorluddy/ios-simulator-skill — Claude drives the iOS simulator',
        url: 'https://github.com/conorluddy/ios-simulator-skill',
        kind: 'repo',
      },
      {
        label: 'Claude Code Chrome extension — the web loop closer',
        url: 'https://code.claude.com/docs/en/chrome',
        kind: 'docs',
      },
      {
        label: 'Anthropic — computer use tool docs',
        url: 'https://docs.claude.com/en/docs/agents-and-tools/computer-use',
        kind: 'docs',
      },
      {
        label: 'GitHub Actions — the CI half of ios-builder',
        url: 'https://docs.github.com/en/actions',
        kind: 'docs',
      },
    ],
  },
]
