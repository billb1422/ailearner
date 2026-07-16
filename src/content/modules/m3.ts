import type { Lesson } from '../../types'

// Module 3: AI-Assisted Design (Days 14-16)
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
      'Can explain, in plain terms, why AI-generated user interfaces all drift toward the same generic look, and what kind of context fixes it',
      'Can write a DESIGN.md file that pins down colors, text sizes, spacing, and component rules before any code exists',
      'Can turn visual preferences into design tokens: concrete named values that an agent can check its own work against',
      'Can run a with-and-without DESIGN.md experiment and describe the concrete differences in what came back',
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
        explain: 'With no constraints to follow, the model falls back on the average of every interface it saw during training, and the average of millions of dashboards is generic by definition. The fix is handing it a written system of layout and style rules. Adding more adjectives to the prompt describes the same average in fancier words.',
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
        explain: 'CLAUDE.md is a file of engineering conventions the agent reads before it writes any code. DESIGN.md uses the exact same mechanism for visual decisions: one markdown file, read first, followed throughout the session.',
      },
      {
        q: 'When should the design system be defined relative to code generation?',
        options: [
          'After the first prototype, so decisions are informed by real UI',
          'Before any code: palette, type scale, spacing, component rules first',
          'Incrementally, one component at a time as needs emerge',
          'Only when a designer joins the project',
        ],
        answer: 1,
        explain: 'When the design system exists before generation starts, every component comes out already following it, at no extra cost. If you wait, applying the same rules means going back through every file the agent already produced, which is a full refactor of your UI.',
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
        explain: 'The repo collects real design-system markdown files reverse-engineered from products people admire, like Stripe and Linear. You borrow one of those structures and fill in your own values instead of inventing a format from scratch.',
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
        explain: '"Use only spacing values from this list: 4, 8, 12, 16, 24, 32" is a rule anyone can check: every value in the generated code either comes from the list or breaks the rule. "Make it feel airy" leaves the interpretation entirely up to the model. Checkable rules are the whole point of tokens.',
      },
    ],
    sections: [
      {
        heading: 'Why every AI UI looks the same',
        blocks: [
          {
            type: 'text',
            md: 'Try an experiment. Ask an AI coding agent for "a clean, modern dashboard" and look at what comes back: the Inter font, a purple gradient somewhere, white cards with identical padding. Now imagine a friend asking the same thing in a totally different project. They get nearly the same screen. Why does that happen?\n\nA language model is a prediction machine. Given a vague request, it produces the most statistically likely answer, which means the average of all the dashboards it saw during training. "Clean and modern" describes millions of screens, so you get the mathematical middle of those millions: competent, and completely anonymous.\n\nHere\'s the encouraging part. The model has plenty of ability; what it lacked was input. You never told it your colors, your fonts, or your spacing, so it had nothing to work from except the average. Supply that context and the same model produces *your* design. This lesson is about the file that carries that context.',
          },
          {
            type: 'compare',
            left: {
              title: 'No design context',
              items: [
                'The prompt says "modern, clean, professional" and nothing else',
                'The model fills every gap with its defaults: Inter font, purple gradient, the same card layout everyone gets',
                'Each new screen drifts a little, because no shared color or spacing rules exist anywhere',
                'Feedback becomes "hmm, more premium?", which the model can interpret a hundred different ways',
              ],
            },
            right: {
              title: 'DESIGN.md in context',
              items: [
                'Colors, text sizes, and spacing are written down as named values before any code exists',
                'Component rules cover corner radius, borders, shadows, and hover states',
                'Every generated screen follows the same written system from its first line of code',
                'Feedback becomes "that padding is off the spacing scale", which has exactly one correct fix',
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
            md: 'The fix is one markdown file the agent reads before it touches any UI code: **DESIGN.md**. The file holds your [design system](https://www.nngroup.com/articles/design-systems-101/), which is the written-down set of colors, fonts, spacing values, and component rules that makes separate screens look like one product. If you\'ve used a CLAUDE.md file to teach an agent your engineering conventions, this is the same trick pointed at visuals.\n\nTwo terms worth defining before you write one. A [type scale](https://designcode.io/typographic-scales/) is the short list of approved text sizes for your product, something like 32px for page titles, 20px for section headings, and 15px for body text, so text sizes never drift screen to screen. [Design tokens](https://www.designtokens.org/) are named values for individual design decisions: instead of "some blue", you define a token called accent with the exact value #38bdf8, and everything interactive references that name.\n\nYou don\'t have to invent the file format either. [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) is a GitHub repo that collects 40+ real DESIGN.md files extracted from Stripe, Linear, Vercel, Notion, and other well-designed products. Pick one whose structure you like, keep the skeleton, and swap in your own values. Ten minutes of borrowing beats a week of inventing.',
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
              ['Palette', 'Every color you use, each with a name and a job (background, text, accent)', 'bg: zinc-950; accent: sky-400; never introduce new hues'],
              ['Type scale', 'Which fonts, which sizes, which weights, and the line spacing for each', 'Display 32/40 semibold; body 15/24; two fonts max'],
              ['Spacing', 'The complete list of allowed gaps and padding values', 'Scale: 4, 8, 12, 16, 24, 32, 48. Nothing else, ever'],
              ['Component rules', 'Corner radius, borders, shadow depth, and interactive states like hover', 'radius 8px everywhere; borders instead of shadows; no gradients'],
              ['Voice / density', 'The tone of interface copy and how much information fits on screen', 'Terse labels; data-dense tables; no marketing fluff'],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="360" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">Anatomy of a DESIGN.md: five short sections, one enforceable system</text>
  <rect x="24" y="56" width="300" height="284" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="44" y="84" fill="#e4e4e7" font-size="14" font-weight="bold">DESIGN.md</text>
  <rect x="44" y="100" width="260" height="38" fill="#18181b" stroke="#38bdf8" rx="6"/>
  <text x="56" y="124" fill="#38bdf8" font-size="12">Palette: named colors + roles</text>
  <rect x="44" y="146" width="260" height="38" fill="#18181b" stroke="#a78bfa" rx="6"/>
  <text x="56" y="170" fill="#a78bfa" font-size="12">Type scale: fonts, sizes, weights</text>
  <rect x="44" y="192" width="260" height="38" fill="#18181b" stroke="#f472b6" rx="6"/>
  <text x="56" y="216" fill="#f472b6" font-size="12">Spacing: the only allowed values</text>
  <rect x="44" y="238" width="260" height="38" fill="#18181b" stroke="#34d399" rx="6"/>
  <text x="56" y="262" fill="#34d399" font-size="12">Components: radius, borders, states</text>
  <rect x="44" y="284" width="260" height="38" fill="#18181b" stroke="#fbbf24" rx="6"/>
  <text x="56" y="308" fill="#fbbf24" font-size="12">Voice: copy tone + density</text>
  <line x1="324" y1="196" x2="420" y2="196" stroke="#52525b" stroke-width="2"/>
  <polygon points="420,196 410,191 410,201" fill="#52525b"/>
  <text x="372" y="186" fill="#a1a1aa" font-size="11" text-anchor="middle">agent reads first</text>
  <rect x="422" y="140" width="254" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="549" y="162" fill="#e4e4e7" font-size="13" text-anchor="middle">Generation follows the rules</text>
  <text x="549" y="180" fill="#a1a1aa" font-size="11" text-anchor="middle">every new component born on-system</text>
  <rect x="422" y="204" width="254" height="52" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="549" y="226" fill="#e4e4e7" font-size="13" text-anchor="middle">Review checks against the rules</text>
  <text x="549" y="244" fill="#a1a1aa" font-size="11" text-anchor="middle">violations are nameable and fixable</text>
</svg>`,
            caption: 'One small file does two jobs: it constrains generation, and it gives review something concrete to check against.',
          },
        ],
      },
      {
        heading: 'Tokens are rules, adjectives are wishes',
        blocks: [
          {
            type: 'text',
            md: 'Here\'s the move that makes the whole file work: write your taste as **checkable rules with concrete values**. An agent has no way to verify "premium". It can absolutely verify "every spacing value comes from the list 4, 8, 12, 16, 24, 32, 48". Either the generated code uses a value from that list or it broke the rule, and a human reviewer, a follow-up prompt, or a lint script can all make the same call.\n\nTiming matters as much as content. Write the system **before any code exists**. When the rules exist first, every component the agent generates already follows them, for free. When the rules arrive later, applying them means going back and editing every component you already have. Same rules, wildly different price.',
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
- Depth via 1px borders (#27272a); no box-shadows.
- No gradients. No glassmorphism.`,
            caption: 'Every line here is checkable, and checkable lines are what turn a preference into a system.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Same discipline, new domain',
            md: 'You already know this pattern from earlier modules: CLAUDE.md turns tribal engineering knowledge into rules an agent reads before working. DESIGN.md applies the identical mechanism to visual taste. Files are how you hand an agent durable knowledge, and visual quality turns out to be one more thing you can encode in a file.',
          },
        ],
      },
    ],
    lab: {
      title: 'DESIGN.md A/B test',
      intro: 'Prove the pattern to yourself by building the same component twice: once with no design context at all, then once with a DESIGN.md in the project. Same prompt both times. The side-by-side comparison is the lesson.',
      steps: [
        'Browse [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and pick one file whose structure you like (the Linear and Vercel ones are good starting points).',
        'Write a DESIGN.md for a real or throwaway project: a palette (5-8 named colors), a type scale (2 fonts, 4 sizes), a spacing scale, and at least 5 component rules.',
        'In a fresh Claude Code session with **no** DESIGN.md anywhere, ask for a settings page component: "a clean, modern settings page with a profile section and notification toggles".',
        'Save that output somewhere. Then start a fresh session, add your DESIGN.md to the project, and give the **identical** prompt plus one extra line: "follow DESIGN.md exactly".',
        'Render both versions side by side in the browser and just look for a minute.',
        'Ask Claude to review version 1 **against your DESIGN.md** and list every violation it finds.',
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
          'Palette, type scale, spacing scale, and component rules, written as concrete values',
          'A paragraph describing the brand personality and target audience',
          'Screenshots of three products you want to imitate',
        ],
        answer: 1,
        explain: 'The file earns its keep through concrete values the agent can check its output against: the palette, the type scale, the spacing scale, and the component rules. A Figma link or a brand-personality paragraph gives the model nothing verifiable to work with.',
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
        explain: 'The spacing rule is checkable: any generated value is either on the list or a violation, and you can tell which at a glance. The other three options leave interpretation entirely to the model, so you get the statistical average back again.',
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
        explain: 'Asking for a review against the file turns DESIGN.md into a verification tool on top of a generation hint. That mirrors the verify-first pattern from the loop-engineering module: generate, then check the output against a written standard.',
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
        explain: 'Constraints applied while code is being generated cost nothing extra, since the agent follows them as it writes. The same constraints applied afterward become a refactor that touches every file already produced.',
      },
    ],
    resources: [
      {
        label: 'VoltAgent/awesome-design-md: 40+ real DESIGN.md files',
        url: 'https://github.com/VoltAgent/awesome-design-md',
        kind: 'repo',
      },
      {
        label: 'Claude Code memory docs: the CLAUDE.md mechanism DESIGN.md piggybacks on',
        url: 'https://code.claude.com/docs/en/memory',
        kind: 'docs',
      },
      {
        label: 'Anthropic: Effective context engineering for AI agents',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
        kind: 'article',
      },
      {
        label: 'Anthropic: Claude Code best practices',
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
    minutes: 50,
    xp: 100,
    objectives: [
      'Can run the sketch-first workflow: draw the layout in Excalidraw, export the image, and tell the model to follow that structure exactly',
      'Can steer visual style with reference screenshots and mood-board images instead of adjectives',
      'Can spot and remove the default AI tells: the Inter font, Lucide icons, and purple gradients',
      'Can break a UI build into a sequence of prompts where each prompt has exactly one job',
    ],
    skipQuiz: [
      {
        q: 'What is the core insight behind sketching layout in Excalidraw before prompting?',
        options: [
          'Sketches reduce token cost versus text descriptions',
          'AI copies far better than it imagines, so a structure to follow beats a description to interpret',
          'Excalidraw exports React components directly',
          'Models cannot process layout described in prose',
        ],
        answer: 1,
        explain: 'Handed a concrete picture of a layout and told "follow this exactly", the model reproduces it faithfully, because copying is what it does best. Asked to invent a layout from a prose description, it falls back on the generic patterns it has seen most often in training.',
      },
      {
        q: 'Why does prompting "modern and warm" for colors fail?',
        options: [
          'Color adjectives map to the same statistical defaults, so you get the same blue every time',
          'Models are partially color-blind in text space',
          'Warm palettes render poorly on dark backgrounds',
          'Adjectives consume too much context window',
        ],
        answer: 0,
        explain: 'Color words like "modern and warm" map to the same handful of training-data averages every time, which is why everyone gets that same blue. A mood-board image contains actual pixels, and the model can pull a specific, personal palette straight out of them.',
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
        explain: 'Those three are the defaults every model reaches for, so together they read as a signature. Swapping in a distinctive Google Fonts pair and the Phosphor icon set is the cheapest move available for making a UI look chosen instead of generated.',
      },
      {
        q: 'In the om_patel5 playbook, what is the primary communication channel with the model for visual work?',
        options: [
          'Long prose descriptions of the desired feel',
          'CSS snippets pasted into the prompt',
          'Component library documentation links',
          'Screenshots: sketches, references, and the current state of the build',
        ],
        answer: 3,
        explain: 'Modern models accept images as input just like text, and an image carries far more visual information than a paragraph can. A sketch shows the exact layout, a reference shows the exact style, and a screenshot of the build shows the exact bug. Prose approximates all three.',
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
        explain: 'The pipeline gives each prompt exactly one concern and runs them in dependency order, so structure exists before styling and logic exists before motion. Each prompt does one job well, where a single mega-prompt would do seven jobs poorly at once.',
      },
    ],
    sections: [
      {
        heading: 'Copy beats imagine',
        blocks: [
          {
            type: 'text',
            md: 'One observation powers this whole playbook (it comes from the om_patel5 thread, a widely shared workflow for building good-looking UI with agents): **AI copies far better than it imagines**. Ask a model to invent a layout and you get the average layout, for the reasons covered last lesson. Hand it a picture of a layout and say *"follow this structure exactly"* and it reproduces that picture with surprising fidelity. Same model, opposite results.\n\nThat asymmetry gives you a working rule: never make the model invent something you could show it instead. Your job shifts from describing what you want in words to collecting pictures of what you want.',
          },
          {
            type: 'text',
            md: 'The workflow has three inputs, each one an image:\n\n- **Structure**: sketch the layout in [Excalidraw](https://excalidraw.com), a free online whiteboard. Rough boxes with labels are plenty: "nav here", "chart here", "activity list here". Five minutes, tops. Export the sketch as an image, attach it to your prompt, and say "follow this structure exactly".\n- **Style**: collect screenshots of real products you admire from [Mobbin](https://mobbin.com) (a searchable library of screenshots from shipped apps) or Dribbble (a portfolio site where designers post their work). Attach one per section and say "copy this style": maybe the [hero section](https://www.interaction-design.org/literature/topics/hero-image), the big attention-grabbing block at the top of a landing page, from one reference, and the pricing table from another.\n- **Color**: attach a [mood board](https://en.wikipedia.org/wiki/Mood_board), a collage image of colors, textures, and imagery in the direction you\'re after, and ask for a palette extracted from it. The image contains real pixel values, so the palette comes from your collage instead of from the training-data average.',
          },
          {
            type: 'text',
            md: 'Here\'s the loop on a real example. Say you want a personal finance dashboard. You open Excalidraw and draw four labeled boxes: a sidebar on the left marked "nav", a wide box across the top for the net worth chart, and two boxes below it for recent transactions and budget status. Export as PNG, attach, and write: "Build this page. Follow this structure exactly."\n\nThe first render comes back with your layout in the model\'s default styling. Now you attach a Mobbin screenshot whose data table you like and say "restyle the transactions list to match this". Then the mood board for color. Three short rounds, each anchored to an image, and the screen looks like something a person chose. Compare that with one round of "make a beautiful finance dashboard" and the difference is stark.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Screenshots are the API',
            md: 'Structure goes in as a sketch, style goes in as reference screenshots, and the build\'s current state comes back to you as a screenshot. Treat images as the primary channel for visual work; save prose for behavior and data.',
          },
        ],
      },
      {
        heading: 'Kill the AI tells',
        blocks: [
          {
            type: 'text',
            md: 'An "AI tell" is a visual choice that shows up so often in generated UIs that it works like a signature. The big three in 2026: the [Inter](https://fonts.google.com/specimen/Inter) font (a perfectly good typeface that models reach for by default), [Lucide](https://lucide.dev) icons (the default icon set of the default component stack), and a purple gradient somewhere on the page. Any one of them is harmless on its own. All three together tell every developer who sees your product that a model styled it and nobody made a choice.\n\nThe fix costs about ten minutes. Pick a distinctive pairing from [Google Fonts](https://fonts.google.com), the free library of hundreds of typefaces: one face with personality for headings, one quiet workhorse for body text. Swap the icon set to [Phosphor](https://phosphoricons.com) or another set with a point of view. Replace the gradient with flat color pulled from your mood-board palette.\n\nThen write the swaps into DESIGN.md so they stick. Defaults creep back the moment your context stops mentioning them, and a fresh session that never read about your font choice will happily regenerate Inter.',
          },
          {
            type: 'table',
            headers: ['AI tell', 'Why it happens', 'The swap'],
            rows: [
              ['Inter for everything', 'Most common font in training data', 'Distinctive Google Fonts pair: a characterful display face plus a workhorse body face'],
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
            md: 'Now the sequencing question: how do you run a whole build? The tempting move is one giant prompt: "build the landing page with this layout, this style, real copy, a working signup form, smooth animations, and make it responsive". That prompt fails in a sneaky way. The model juggles seven concerns at once, does a mediocre job on each, and when the result disappoints you can\'t tell which instruction it dropped.\n\nThe fix borrows an idea from software engineering called [single responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle): every unit of work should have exactly one job. Applied to prompting, that means a sequence of small prompts, each owning one concern, run in dependency order. The om_patel5 thread formalizes this as a 9-prompt pipeline; the condensed version below has six stages.\n\nDependency order matters as much as the splitting. Structure has to exist before you can style it. Real copy has to exist before layout judgments mean anything, because placeholder lorem-ipsum text hides overflow bugs. Logic has to work before you animate it. Verify in the browser after each stage, and a failure stays cheap: you re-prompt one concern instead of untangling seven.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">Sequential single-responsibility pipeline: one concern per prompt</text>
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
            md: 'One prompt asking for structure, style, copy, logic, and animation forces the model to split its attention five ways, and when something comes out wrong you can\'t tell which instruction got dropped. Decomposition makes each failure visible, cheap, and re-promptable on its own.',
          },
        ],
      },
    ],
    lab: {
      title: 'Rebuild a screen you dislike',
      intro: 'Take one screen from a past project that never looked right and rebuild it sketch-first with reference screenshots.',
      steps: [
        'Pick the screen and write one sentence on why it fails (usually generic structure, default styling, or both).',
        'Sketch the layout you actually want in [Excalidraw](https://excalidraw.com): boxes and labels only, under 10 minutes. Export as PNG.',
        'Collect 2-3 reference screenshots from [Mobbin](https://mobbin.com) or Dribbble, one per section you care about, plus one mood-board image for color.',
        'Prompt 1 is structure: attach the sketch and say "follow this structure exactly". Verify the layout in the browser before continuing.',
        'Prompt 2 is style: attach one reference per section and say "copy this style", plus the mood-board image for the palette.',
        'Prompt 3 is the de-AI pass: swap fonts to a distinctive Google Fonts pair, swap icons to Phosphor, and ban gradients.',
        'Screenshot the result and compare against the original screen.',
      ],
      checklist: [
        'Layout matches your sketch instead of a generic template',
        'Palette came from an image rather than from adjectives',
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
        explain: 'Structure comes first, and it comes from you. The sketch is the contract, and "follow this structure exactly" is the instruction that makes the model copy instead of imagine. Everything after that (style, color, polish) layers onto a layout you already approved.',
      },
      {
        q: 'How should Dribbble/Mobbin reference screenshots be applied?',
        options: [
          'One global reference for the whole app to keep it consistent',
          'As inspiration you describe in words, since attaching them biases the model',
          'Per section: "copy this style" for the hero from one reference, the table from another',
          'Only after the build is complete, as a comparison baseline',
        ],
        answer: 2,
        explain: 'Per-section references give the model precise, local style targets: this reference for the hero, that one for the pricing table. A single global reference forces it back into averaging across mismatched patterns, which is the exact failure you were escaping.',
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
        explain: 'Font, icon set, and palette are the three defaults everyone recognizes on sight. Swapping them takes minutes and removes the strongest generated-UI signals, and writing the swaps into DESIGN.md keeps them from creeping back.',
      },
      {
        q: 'In the pipeline, why does animation come after logic rather than with initial styling?',
        options: [
          'Animation libraries must load after state libraries',
          'Motion on top of broken behavior wastes iterations; each prompt has one responsibility, in dependency order',
          'Models cannot generate CSS and JS animation in the same session',
          'Animations invalidate earlier screenshots used as references',
        ],
        answer: 1,
        explain: 'Dependency order means you animate interactions that already work. Add motion earlier and every logic fix risks re-breaking the animation pass, so you end up paying for the same polish twice.',
      },
    ],
    resources: [
      {
        label: 'om_patel5: the vibe-coding beautiful UI playbook',
        url: 'https://x.com/om_patel5',
        kind: 'thread',
      },
      {
        label: 'Excalidraw: sketch structure before you prompt',
        url: 'https://excalidraw.com',
        kind: 'docs',
      },
      {
        label: 'Mobbin: real product screenshots for style references',
        url: 'https://mobbin.com',
        kind: 'docs',
      },
      {
        label: 'Phosphor Icons: the Lucide replacement',
        url: 'https://phosphoricons.com',
        kind: 'docs',
      },
      {
        label: 'Google Fonts: pick a distinctive pair',
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
    minutes: 45,
    xp: 100,
    objectives: [
      'Can install and run community design skills (emilkowalski/skills) in Claude Code',
      'Can explain how the grid-systems skill turns a canonical design text into programmable layout rules',
      'Can apply the meta-pattern: encode an expert canon as a skill, then run it as a reviewer on existing work as well as a generator',
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
        explain: 'The skill distills 17 principles from Apple\'s WWDC design and motion talks into a file an agent can read and follow. You get the judgment from those talks without watching hours of video, and the agent gets rules concrete enough to apply to any UI work.',
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
        explain: 'Josef Müller-Brockmann\'s "Grid Systems in Graphic Design" is the classic textbook on structuring a page. The skill turns its 162 pages into executable layout rules, so the agent applies real composition theory instead of guessing at what looks balanced.',
      },
      {
        q: 'What is the meta-pattern behind these taste skills?',
        options: [
          'Fine-tune a model on well-designed screenshots',
          'Encode a canonical textbook or an expert\'s principles as a skill, then point that skill at existing work as a reviewer',
          'Chain multiple design models and vote on outputs',
          'Store screenshots of good design in a vector database',
        ],
        answer: 1,
        explain: 'Distill the canon into rules, package the rules as a skill, and then run the skill against work that already exists. Review mode is where encoded taste pays off most, because it produces named findings you can act on and then verify.',
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
        explain: 'The skills CLI pulls skill packages straight from GitHub repos into your agent setup. One command, and a 12.8k-star package of design judgment is installed and ready to invoke.',
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
        explain: 'It front-loads a deliberate design-reasoning pass and picks a design system that fits the industry you\'re building for. That structure prevents the generic-gradient default from ever being the path of least resistance.',
      },
    ],
    sections: [
      {
        heading: 'Taste is packageable',
        blocks: [
          {
            type: 'text',
            md: 'Quick recap of a term from earlier in the course: a **skill** is a folder of written instructions that an agent loads when a task calls for it, following an open standard called [Agent Skills](https://agentskills.io). You\'ve already used skills for engineering workflows. This lesson is about skills that carry *design judgment*.\n\nThat might sound impossible. Taste feels like the one thing you can\'t write down, right? You certainly can\'t prompt "have good taste" and get anywhere. But watch what happens when an expert distills their taste into specific principles: "every animation needs a visible purpose", "prefer ease-out curves for elements entering the screen", "align to the grid first, adjust optically second". Those are rules. Rules can be written into a file, and a file can be packaged as a skill any agent can load.\n\nThe proof this works is [emilkowalski/skills](https://github.com/emilkowalski/skills). Emil Kowalski is one of the most respected interaction designers working on the web (his course at [animations.dev](https://animations.dev) taught a large slice of the industry how motion should feel), and this repo packages his judgment as installable skills. It has 12.8k GitHub stars, an MIT license, and a one-command install: `npx skills@latest add emilkowalski/skills`.',
          },
          {
            type: 'table',
            headers: ['Skill', 'What it encodes', 'Best used for'],
            rows: [
              ['/apple-design', '17 design + motion principles distilled from WWDC', 'Generation and review of any UI'],
              ['review-animations', 'A motion-quality rubric', 'Auditing existing animations for timing, easing, purpose'],
              ['improve-animations', 'Concrete upgrade moves for motion', 'Fixing what review-animations flags'],
              ['animation-vocabulary', 'Shared terms for describing motion', 'Precise prompts: "ease-out spring" beats "smoother"'],
              ['grid-systems (nicos_ai)', 'Müller-Brockmann\'s 162-page grid canon as programmable layout rules', 'Layout with actual composition theory'],
              ['UI/UX Pro Max', 'Forced reasoning pass + industry-specific design system; bans generic gradients', 'Greenfield UI where defaults would take over'],
            ],
          },
          {
            type: 'text',
            md: 'Two entries in that table deserve a closer look. The animation trio works as a set: review-animations audits the motion you already have, improve-animations fixes what the review flagged, and animation-vocabulary gives you precise words for asking. Vague feedback like "make it smoother" leaves the model guessing at what you mean; "use an ease-out spring with less bounce" has exactly one interpretation.\n\nThe grid-systems skill (shared by nicos_ai) is the deepest cut. A [grid system](https://www.interaction-design.org/literature/topics/grid-systems) is a set of invisible columns and rows that everything on a page aligns to, and it\'s a big part of why professionally designed pages feel ordered while ad-hoc pages feel scattered. The skill encodes the definitive textbook on the subject, Josef Müller-Brockmann\'s "Grid Systems in Graphic Design", all 162 pages of it, as rules an agent can apply directly to your layouts.',
          },
        ],
      },
      {
        heading: 'The meta-pattern: canon → skill → reviewer',
        blocks: [
          {
            type: 'text',
            md: 'Zoom out from the specific repo and a bigger idea appears, one you can reuse anywhere. Start with a **canon**: a classic textbook, a respected expert\'s published principles, any body of judgment that has earned trust over time. Distill it into concrete rules. Package the rules as a skill. Then comes the step most people skip: point the skill at **existing work as a reviewer**.\n\nWhy does review mode matter so much? A skill used only during generation applies its principles once, invisibly, and you never learn what it did or didn\'t follow. A skill run as a reviewer produces a ranked list of named violations you can read, argue with, fix one at a time, and re-check. The output becomes a checkable artifact instead of a vibe.\n\nAnd the pattern travels. Respect a particular typography book? Encode it. A favorite accessibility checklist works the same way. Any written body of judgment can become a reviewer you run on every screen you ever build, and unlike a human expert, it never gets tired of looking.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">The meta-pattern: any trusted canon can become a reviewer</text>
  <rect x="24" y="120" width="170" height="80" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="109" y="148" fill="#fbbf24" font-size="13" text-anchor="middle">Canon</text>
  <text x="109" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">162-page textbook,</text>
  <text x="109" y="184" fill="#a1a1aa" font-size="11" text-anchor="middle">WWDC talks, expert rules</text>
  <line x1="194" y1="160" x2="278" y2="160" stroke="#52525b" stroke-width="2"/>
  <polygon points="278,160 268,155 268,165" fill="#52525b"/>
  <text x="236" y="150" fill="#a1a1aa" font-size="11" text-anchor="middle">distill</text>
  <rect x="280" y="120" width="170" height="80" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="365" y="148" fill="#38bdf8" font-size="13" text-anchor="middle">Skill</text>
  <text x="365" y="168" fill="#a1a1aa" font-size="11" text-anchor="middle">concrete, checkable rules</text>
  <text x="365" y="184" fill="#a1a1aa" font-size="11" text-anchor="middle">any agent can load</text>
  <line x1="450" y1="140" x2="508" y2="98" stroke="#52525b" stroke-width="2"/>
  <polygon points="508,98 497,100 503,108" fill="#52525b"/>
  <line x1="450" y1="180" x2="508" y2="222" stroke="#34d399" stroke-width="2"/>
  <polygon points="508,222 503,212 497,220" fill="#34d399"/>
  <rect x="510" y="62" width="166" height="72" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="593" y="90" fill="#a78bfa" font-size="13" text-anchor="middle">Generate</text>
  <text x="593" y="108" fill="#a1a1aa" font-size="11" text-anchor="middle">new UI, principles applied</text>
  <text x="593" y="124" fill="#a1a1aa" font-size="11" text-anchor="middle">once and silently</text>
  <rect x="510" y="196" width="166" height="72" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="593" y="224" fill="#34d399" font-size="13" text-anchor="middle">Review</text>
  <text x="593" y="242" fill="#a1a1aa" font-size="11" text-anchor="middle">ranked violations on</text>
  <text x="593" y="258" fill="#a1a1aa" font-size="11" text-anchor="middle">work that already exists</text>
  <text x="24" y="304" fill="#a1a1aa" font-size="12">The green path compounds: run the reviewer on every screen, forever, and verify each fix against it.</text>
</svg>`,
            caption: 'Canon in, reviewer out. Generation is the obvious use; review is the one that compounds.',
          },
          {
            type: 'compare',
            left: {
              title: 'Skill as generator',
              items: [
                'Applies principles while producing new UI',
                'Quality depends on the prompt using it',
                'Failures are silent: the output arrives with no record of which principles were applied or skipped',
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
        'Confirm the skills registered: list the available skills in Claude Code and find /apple-design.',
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
          'Review produces named, ranked, verifiable violations against existing work, a checkable signal you can re-run after fixes',
          'Generation mode is deprecated in the skills standard',
          'Reviewers can modify files that generators cannot',
        ],
        answer: 1,
        explain: 'A rubric applied to real output yields findings you can act on and then confirm cleared by running the review again. Generation applies principles once, silently, and leaves no record of what was followed or dropped.',
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
        explain: 'The three cover audit (review-animations), remediation (improve-animations), and precise language (animation-vocabulary). Together they make a complete motion workflow: find the problems, fix them, and describe exactly what you want next time.',
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
        explain: 'The skill grounds every layout decision in a specific, checkable canon: a 162-page textbook turned into rules. The bare prompt leaves the model to interpolate "well-designed" from training-data averages, which lands you back at generic.',
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
        explain: 'Small verified batches plus a re-review is the verification loop applied to design. Each fix gets confirmed against the same rubric that flagged it, and you find out immediately if a fix introduced a new violation.',
      },
    ],
    resources: [
      {
        label: 'emilkowalski/skills: apple-design and the animation skills (12.8k stars)',
        url: 'https://github.com/emilkowalski/skills',
        kind: 'repo',
      },
      {
        label: 'animations.dev: Emil Kowalski\'s animation course, the source of the taste',
        url: 'https://animations.dev',
        kind: 'course',
      },
      {
        label: 'Agent Skills: the open standard these packages ride on',
        url: 'https://agentskills.io',
        kind: 'docs',
      },
      {
        label: 'nicos_ai: the grid-systems skill (Müller-Brockmann encoded)',
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
    minutes: 50,
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
        explain: 'The output is running HTML you can click through the moment it lands. A traditional mockup shows you a picture of the future product; Claude Design hands you a working miniature of it.',
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
        explain: 'Reading the codebase and Figma files means prototypes come out already matching your colors, type, and components. You skip the "make it match our style" cleanup round entirely, and /design-sync keeps that extraction current as your product evolves.',
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
        explain: 'It automates the mechanical middle of design work (variations, wireframes, component libraries) at enormous speed. The last mile of brand feel and micro-interaction still needs a human eye or real running code.',
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
        explain: 'Instead of mock → translate → build, you describe intent and iterate directly in the running product. The mockup step disappears, and every design decision gets tested against the real thing.',
      },
      {
        q: 'What does Direct Design collapse from weeks to minutes?',
        options: [
          'The build pipeline and CI time',
          'The design-feedback loop: you experience the design instead of guessing from a mock',
          'Stakeholder approval meetings',
          'Design-token generation',
        ],
        answer: 1,
        explain: 'When iteration happens in running code, every change gets experienced immediately. The translate-and-handoff delay between "designer draws it" and "developer builds it" disappears from the loop.',
      },
    ],
    sections: [
      {
        heading: 'Claude Design: prototypes that run',
        blocks: [
          {
            type: 'text',
            md: 'Some vocabulary first, because these words get used loosely. A **mockup** is a static picture of a screen: it shows what the product will look like, and nothing in it responds when you click. A **prototype** is a clickable simulation: buttons press, navigation flows, and you can feel the product before it exists. Prototypes have historically cost far more effort than mockups, which is why most design reviews ran on static images.\n\n**Claude Design** (Anthropic Labs, April 2026) collapses that tradeoff. You describe what you want in conversation and it produces **live, clickable HTML**: full prototypes, slide decks, one-pagers. Everything it hands back runs in a browser, so the review question changes from "does this picture look right?" to "does this flow feel right when I click through it?"\n\nThe feature that separates it from a generic code generator is context. Point it at your **codebase and your Figma files** and it extracts your actual design system: the colors, the type scale, and the components you already use. Prototypes come out already looking like your product. And because design systems drift over time, the **/design-sync** command (added June 2026) re-runs the extraction so new prototypes track the system you have now.',
          },
          {
            type: 'text',
            md: '[Figma](https://www.figma.com) is the collaborative tool where most product design teams draw and organize their screens; picture a shared infinite canvas covered in screen designs, comments, and component libraries. **Claude in Figma** puts the model inside that canvas.\n\nIts sweet spot is mechanical breadth. Need 15 variations of a card component, [wireframes](https://www.nngroup.com/articles/wireflows/) (rough structural drafts of a screen, boxes and labels without styling) for six pages, or a component library assembled from scattered frames? It does that at a speed no human matches. Practitioners keep reporting the same gap, though: **brand nuance and micro-interactions**. Micro-interactions are the small moments of feedback and motion, like how a button responds to a press or how a list item settles into place after a drag. That last mile of feel still needs a human, or running code you can actually poke at.',
          },
        ],
      },
      {
        heading: 'Direct Design: skip the mockup entirely',
        blocks: [
          {
            type: 'text',
            md: 'Alex Kehr\'s **Direct Design** takes the boldest position of the three: drop the mockup step altogether and design *inside the running product*. The traditional pipeline goes idea, then Figma mock, then handoff to a developer, then build, then feedback, and every arrow in that chain costs days. Direct Design replaces the chain with a short brief and a live iteration loop.\n\nThe brief covers exactly three things. What should the product **DO** (the jobs it performs for the user)? How should it **FEEL** (calm, dense, playful, fast)? Who is it **FOR** (the audience and the situation they\'re in)? Three short paragraphs, handed to the agent, and you\'re iterating on real running code from the first minute.\n\nThe loop collapsing from weeks to minutes is the headline number, but the deeper win is that your feedback changes kind. Looking at a static mock, you\'re predicting how the product will feel. Clicking a running prototype, you\'re experiencing it, with real data, real latency, and clicks that actually do things. Pacing problems and friction show up under your fingers, and those never show up in a picture.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="320" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">Traditional pipeline (feedback arrives in weeks)</text>
  <rect x="24" y="50" width="110" height="48" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="79" y="78" fill="#e4e4e7" font-size="12" text-anchor="middle">Idea</text>
  <line x1="134" y1="74" x2="164" y2="74" stroke="#52525b" stroke-width="2"/>
  <polygon points="164,74 154,69 154,79" fill="#52525b"/>
  <rect x="166" y="50" width="110" height="48" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="221" y="78" fill="#e4e4e7" font-size="12" text-anchor="middle">Figma mock</text>
  <line x1="276" y1="74" x2="306" y2="74" stroke="#52525b" stroke-width="2"/>
  <polygon points="306,74 296,69 296,79" fill="#52525b"/>
  <rect x="308" y="50" width="110" height="48" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="363" y="78" fill="#e4e4e7" font-size="12" text-anchor="middle">Handoff</text>
  <line x1="418" y1="74" x2="448" y2="74" stroke="#52525b" stroke-width="2"/>
  <polygon points="448,74 438,69 438,79" fill="#52525b"/>
  <rect x="450" y="50" width="110" height="48" fill="#27272a" stroke="#52525b" rx="8"/>
  <text x="505" y="78" fill="#e4e4e7" font-size="12" text-anchor="middle">Build</text>
  <line x1="560" y1="74" x2="590" y2="74" stroke="#52525b" stroke-width="2"/>
  <polygon points="590,74 580,69 580,79" fill="#52525b"/>
  <rect x="592" y="50" width="84" height="48" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="634" y="78" fill="#f472b6" font-size="12" text-anchor="middle">Feedback</text>
  <text x="24" y="146" fill="#a1a1aa" font-size="12">Each arrow is a translation and a wait. Feedback lands on a prediction of the product.</text>
  <line x1="24" y1="166" x2="676" y2="166" stroke="#3f3f46" stroke-width="1"/>
  <text x="24" y="196" fill="#a1a1aa" font-size="13">Direct Design (feedback arrives in minutes)</text>
  <rect x="24" y="212" width="180" height="66" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="114" y="238" fill="#38bdf8" font-size="12" text-anchor="middle">Brief</text>
  <text x="114" y="256" fill="#a1a1aa" font-size="11" text-anchor="middle">DO / FEEL / FOR WHOM</text>
  <line x1="204" y1="245" x2="288" y2="245" stroke="#52525b" stroke-width="2"/>
  <polygon points="288,245 278,240 278,250" fill="#52525b"/>
  <rect x="290" y="212" width="180" height="66" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="380" y="238" fill="#34d399" font-size="12" text-anchor="middle">Running code</text>
  <text x="380" y="256" fill="#a1a1aa" font-size="11" text-anchor="middle">real data, real latency</text>
  <line x1="470" y1="232" x2="554" y2="232" stroke="#52525b" stroke-width="2"/>
  <polygon points="554,232 544,227 544,237" fill="#52525b"/>
  <line x1="554" y1="258" x2="470" y2="258" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="470,258 480,253 480,263" fill="#fbbf24"/>
  <rect x="556" y="212" width="120" height="66" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="616" y="238" fill="#fbbf24" font-size="12" text-anchor="middle">Experience it</text>
  <text x="616" y="256" fill="#a1a1aa" font-size="11" text-anchor="middle">click, feel, adjust</text>
  <text x="24" y="308" fill="#a1a1aa" font-size="12">The yellow arrow is the whole method: what you feel while clicking drives the next change.</text>
</svg>`,
            caption: 'The mock-and-handoff chain versus the Direct Design loop. Fewer translations, faster and truer feedback.',
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The mock was always a proxy',
            md: 'A mockup is a prediction of what running software will feel like. When generating the running software is as fast as generating the mock, the prediction step is pure overhead. For product work owned by one small team, evaluate the real thing.',
          },
        ],
      },
      {
        heading: 'Choosing a mode',
        blocks: [
          {
            type: 'text',
            md: 'Three tools, three sweet spots. None of them wins everywhere, so the skill worth having is matching the mode to the task in front of you. A quick gut check: who has to see this, and do they need to click it or edit it?',
          },
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
            md: 'Bill\'s context (an architect building his own tools, with no design org in the loop) makes **Direct Design the default**. Reach for Claude Design when a stakeholder needs to click something before you commit to building it, and for Figma only when a design organization already lives there.',
          },
        ],
      },
    ],
    lab: {
      title: 'Idea to clickable, no mockup step',
      intro: 'Take one flow from idea to a clickable prototype without ever drawing a static mock. Use Claude Design if you have access; otherwise work directly in code.',
      steps: [
        'Pick one flow you have wanted to build: onboarding, a settings redesign, a dashboard drill-down.',
        'Write the Direct Design brief in three short paragraphs: what it should DO, how it should FEEL, who it is FOR.',
        'If you have Claude Design access: paste the brief and let it extract your design system (or point it at yesterday\'s DESIGN.md). Otherwise: fresh Claude Code session, brief plus DESIGN.md, target a running local page.',
        'Click through the first version end to end before giving any feedback. Note where the flow feels wrong, which is different information than where it looks wrong.',
        'Iterate three rounds, each round one FEEL-level correction (pacing, hierarchy, friction), experienced live after each change.',
        'Compare timestamps: idea to clickable. Write down the number.',
      ],
      checklist: [
        'A DO / FEEL / FOR-WHOM brief exists and is under a page',
        'A clickable prototype exists with zero static mockups produced along the way',
        'At least one issue you found came from clicking the flow rather than from looking at it',
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
        explain: 'DO / FEEL / FOR WHOM is the whole brief: intent and audience. Structure and style get worked out through live iteration in running code, where every change is something you can click and feel.',
      },
      {
        q: 'When does Figma still beat designing directly in code?',
        options: [
          'Whenever animations are involved',
          'When the app has more than ten screens',
          'When a design org needs mechanical breadth (variations, wireframes, shared component libraries) inside its existing workflow',
          'Never; Figma is fully obsolete in 2026',
        ],
        answer: 2,
        explain: 'Figma remains the right surface where a design organization already collaborates and needs scale on mechanical work. Brand nuance still resists automation there, so humans keep the last mile.',
      },
      {
        q: 'Why does experiencing a clickable prototype beat evaluating a static mock?',
        options: [
          'Clickable prototypes are cheaper to produce than mocks',
          'Stakeholders trust HTML more than images',
          'Static mocks cannot show dark mode',
          'Flow, pacing, and interaction problems only surface when you actually use the thing; a mock is a prediction, the prototype is the evidence',
        ],
        answer: 3,
        explain: 'The lab makes this concrete: your best findings come from clicking through the flow. Real interaction exposes pacing and friction problems that static frames hide completely.',
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
        explain: 'The extraction is a snapshot, and snapshots go stale as your product evolves. /design-sync re-runs it, so new prototypes track the design system as it exists today.',
      },
    ],
    resources: [
      {
        label: 'Anthropic: Claude Design announcement',
        url: 'https://www.anthropic.com/news/claude-design',
        kind: 'article',
      },
      {
        label: 'Alex Kehr: Direct Design',
        url: 'https://x.com/alexkehr',
        kind: 'thread',
      },
      {
        label: 'Figma: where Claude-in-Figma lives',
        url: 'https://www.figma.com',
        kind: 'docs',
      },
      {
        label: 'Claude Code docs: the direct-in-code half of the workflow',
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
    minutes: 55,
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
        explain: 'The agent has to see what it built. Screenshot, analyze against intent, fix, and re-screenshot. It\'s the same verify loop you built with tests earlier in the course, applied to pixels instead of return values.',
      },
      {
        q: 'How does the iOS simulator skill (conorluddy) interact with the app?',
        options: [
          'It injects JavaScript into WKWebViews',
          'It parses SwiftUI source to predict the render',
          'It records the user demonstrating the flow once',
          'It taps, swipes, and screenshots via the accessibility tree, like a QA engineer working with no docs',
        ],
        answer: 3,
        explain: 'The accessibility tree gives it the same handles a QA engineer has: what is on screen and what can be tapped, with no source-level knowledge required. It explores, acts, screenshots, and judges the result.',
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
        explain: 'It runs an autonomous QA pass in CI: exercise the whole UI surface, capture the logs, and return a structured report the agent can act on. A green checkmark that only means "it compiled" tells you far less.',
      },
      {
        q: 'Why does the xcodebuild wrapper skill exist, in its author\'s words?',
        options: [
          'To pin the Xcode version across machines',
          '"To save context": raw xcodebuild output would flood the window, so the wrapper returns only what the agent needs',
          'To retry flaky code-signing steps',
          'To parallelize builds across simulators',
        ],
        answer: 1,
        explain: 'Token-cost-aware skill design means wrapping verbose tools so the loop sees a short, useful summary instead of thousands of lines of build noise. Every saved line keeps iterations cheaper and the context cleaner.',
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
        explain: 'An agent that never sees its output can only claim done. One that screenshots and checks has evidence. Verified beats asserted, in design exactly as in testing.',
      },
    ],
    sections: [
      {
        heading: 'Close the loop or take its word',
        blocks: [
          {
            type: 'text',
            md: 'Everything in this module so far (DESIGN.md, sketches and references, taste skills) improves what the agent *generates*. This last lesson adds the other half: **verification**, where the agent checks its own visual output instead of assuming the code worked.\n\nHere\'s the gap being closed. An agent writes UI code, the code compiles, and the agent reports "done". But the agent never *saw* the page. Maybe the sidebar overlaps the chart at narrow widths, or the new card quietly ignored your spacing scale. Compiling proves the code parses. What the page actually looks like stays unknown until someone, or something, looks at it.\n\nThe fix is a **feedback loop**: a cycle where the result of an action feeds back in as input to the next attempt. Concretely, the agent renders the UI, takes a screenshot, analyzes the screenshot against what was intended (the DESIGN.md, the sketch, the spec), fixes what\'s off, and repeats until the check passes. You met this idea in the loop-engineering module as the #1 quality lever: give the agent a real pass/fail signal. For visual work, a screenshot comparison is that signal.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="24" y="34" fill="#a1a1aa" font-size="13">The vision loop: the agent sees what it built</text>
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
  <text x="160" y="194" fill="#a1a1aa" font-size="11" text-anchor="middle">checked against real criteria</text>
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
            type: 'text',
            md: 'The loop needs a different "eye" for each platform. For web work, the [Claude Code Chrome extension](https://code.claude.com/docs/en/chrome) lets the agent drive your actual browser: it screenshots the page, reads the console, watches network requests, and clicks around like a user would. For native macOS apps, [computer use](https://docs.claude.com/en/docs/agents-and-tools/computer-use) (still a research preview) hands the agent the whole desktop, so it can compile an app, launch it, click through it, and fix what it sees. iOS gets its own tooling, covered in the next section.',
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
            md: 'iOS is the interesting case, because iPhone apps run in the **Simulator**, Apple\'s tool that runs a virtual iPhone in a window on your Mac. The [ios-simulator-skill](https://github.com/conorluddy/ios-simulator-skill) (by conorluddy) teaches Claude to drive that virtual phone directly.\n\nHow does an agent "see" an iPhone screen well enough to act on it? Through the [accessibility tree](https://developer.apple.com/documentation/accessibility): the structured description of everything on screen that iOS maintains for assistive technologies like VoiceOver. Every button, label, and text field appears in that tree with its role and position, so the skill reads the tree to learn what\'s on screen and what can be tapped. Then it taps, swipes, types, screenshots, and judges the result against the goal. The author\'s framing fits: it works like **a QA engineer handed an app with no documentation**, exploring and testing by hand.\n\nThe same loop also scales beyond your desk. **ios-builder + [GitHub Actions](https://docs.github.com/en/actions)** runs the whole pass automatically in [CI](https://en.wikipedia.org/wiki/Continuous_integration) (continuous integration, the practice of running automated checks on every code push): build the app, open every screen, fill in the forms, pull the debug logs, and return a structured error report. Compare that with a CI badge that says "build passed" and reveals nothing about whether a single screen renders correctly.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Token-cost-aware skill design',
            md: 'The suite\'s xcodebuild wrapper exists, in its author\'s words, **"to save context"**. A raw xcodebuild run emits thousands of lines, every one of which would land in the agent\'s limited context window and cost real money per loop iteration. The wrapper runs the build, then returns pass/fail plus only the errors that matter. When you wrap a noisy tool for an agent loop, budget its output like money. It is money.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The module\'s closing claim',
            md: 'Vision-in-the-loop is the difference between **"looks done" and verified UI**. Lessons 1 through 4 raise the ceiling on generation quality; the vision loop is what confirms a given screen actually reached that ceiling.',
          },
        ],
      },
    ],
    lab: {
      title: 'Let the agent find a real visual bug',
      intro: 'Run one full visual verification loop and let the agent, rather than you, discover a genuine visual defect.',
      steps: [
        'Pick a target: a web page you built (use the Chrome extension) or, if you have Xcode, an app in the iOS simulator (install conorluddy/ios-simulator-skill).',
        'Plant realism if needed: if the page is too clean, resize the window to mobile width or add real long-string data. Most UIs break somewhere.',
        'Give the loop a real criterion: "Screenshot this page, compare against DESIGN.md and the sketch, and list every visual defect ranked by severity."',
        'Verify the agent actually took screenshots: each finding should cite visible evidence, the way "the label is clipped at 375px wide" does. Treat findings inferred purely from reading code as unverified.',
        'Have it fix the top defect, re-screenshot, and confirm the fix visually before claiming done.',
        'Note one defect the agent caught that you had missed. That gap is the value of the loop.',
      ],
      checklist: [
        'The agent captured and analyzed its own screenshots, with findings grounded in visible evidence',
        'At least one genuine visual defect was found and ranked',
        'The fix was verified with a fresh screenshot rather than asserted from the diff',
        'You can name a defect the loop caught that manual eyeballing missed',
        'The loop had a stop condition and actually stopped',
      ],
    },
    checkQuiz: [
      {
        q: 'You need the visual loop on a native macOS app. Which closes it?',
        options: [
          'The Chrome extension in a WebView',
          'Computer use: write, compile, launch, click, and fix on the actual desktop',
          'The iOS simulator skill in Mac Catalyst mode',
          'Rendering the views to HTML for screenshotting',
        ],
        answer: 1,
        explain: 'Native macOS UI is only observable on the desktop itself. Computer use gives the agent screenshots and input there, closing the full write → compile → launch → click → fix loop.',
      },
      {
        q: 'For a web frontend, the standard loop closer is:',
        options: [
          'A headless HTML validator',
          'Jest snapshot tests on component markup',
          'The Claude Code Chrome extension driving the real browser: screenshots, console, network',
          'Lighthouse CI scores',
        ],
        answer: 2,
        explain: 'The extension lets the agent see the rendered page and interact with it the way a user would. Markup-level checks never catch what pixels reveal, like overlap, clipping, and off-scale spacing.',
      },
      {
        q: 'What does token-cost-aware skill design mean in practice?',
        options: [
          'Wrap noisy tools so the loop receives distilled signal (pass/fail and relevant errors) instead of thousands of raw output lines',
          'Prefer smaller models for all visual analysis',
          'Cache screenshots to avoid re-uploading them',
          'Limit loops to three iterations maximum',
        ],
        answer: 0,
        explain: 'Every loop iteration pays for its context. Wrappers like the xcodebuild one exist precisely "to save context", so each iteration stays cheap and the signal stays readable.',
      },
      {
        q: 'When does the CI pipeline (ios-builder + Actions) beat the local simulator skill?',
        options: [
          'When you need to debug one screen interactively',
          'When exploring an unfamiliar app for the first time',
          'When the fix requires watching an animation frame by frame',
          'When you want every screen exercised on every push, with forms filled, logs pulled, and errors reported, without you at the keyboard',
        ],
        answer: 3,
        explain: 'Local simulator driving suits interactive iteration on one screen. The CI pipeline is the same loop made autonomous and repeatable across the whole UI surface, triggered by every push.',
      },
    ],
    resources: [
      {
        label: 'conorluddy/ios-simulator-skill: Claude drives the iOS simulator',
        url: 'https://github.com/conorluddy/ios-simulator-skill',
        kind: 'repo',
      },
      {
        label: 'Claude Code Chrome extension: the web loop closer',
        url: 'https://code.claude.com/docs/en/chrome',
        kind: 'docs',
      },
      {
        label: 'Anthropic: computer use tool docs',
        url: 'https://docs.claude.com/en/docs/agents-and-tools/computer-use',
        kind: 'docs',
      },
      {
        label: 'GitHub Actions: the CI half of ios-builder',
        url: 'https://docs.github.com/en/actions',
        kind: 'docs',
      },
    ],
  },
]
