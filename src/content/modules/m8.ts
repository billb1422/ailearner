import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ───────────────────────────────────────────────────────────────
  // m7-l4: The AI Transformation Playbook lesson (stable id kept; now
  // the opening lesson of Module 8). Array order = display order.
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l4',
    title: 'Where AI Belongs in a Business',
    day: 22,
    minutes: 50,
    xp: 100,
    objectives: [
      'Can split any role into front stage and back stage, and explain why AI transformation starts back stage',
      'Can name the four no-go zones where AI should never be deployed and defend each one to an efficiency-obsessed exec',
      'Can classify a candidate task into the AAA layers (automation, augmentation, autonomy) using the selection criteria for each layer, and justify the build order with the onion argument',
      'Can spec a digital employee as brain plus skills plus tools, with a success metric attached, and argue for a fleet of specialists over one monolithic agent',
    ],
    skipQuiz: [
      {
        q: 'Lior Weinstein opens his transformation argument with a stat about how knowledge workers spend their time. What is the split?',
        options: [
          'About 30% of the day goes to meetings and admin, leaving 70% for real work',
          'Roughly 60% goes to "work about work" (status meetings, searching for information, reformatting, copying between systems), leaving about 40% for the job you were hired to do',
          'Half the day goes to email alone, according to his client data',
          '90% of the day is productive for senior roles; the waste concentrates in junior staff',
        ],
        answer: 1,
        explain: 'The 60/40 split sets up the whole playbook: most of the working day already goes to robot-shaped tasks. The opportunity is handing that layer to machines, and the tragedy he points at is the brilliant work that never happens because busy work ate the day.',
      },
      {
        q: 'Weinstein uses the history of the ATM to answer the "AI deletes jobs" panic. What actually happened to bank tellers after cash machines rolled out?',
        options: [
          'Teller headcount collapsed within a decade, exactly as predicted',
          'Teller jobs held roughly flat while wages dropped sharply',
          'Teller employment went up: banks opened more branches, and the role shifted from counting cash toward advertising, selling, and problem solving',
          'Tellers were retrained as ATM technicians almost one for one',
        ],
        answer: 2,
        explain: 'ATMs made each branch cheaper to run, so banks opened more of them and hired more tellers, whose work moved up the value chain. His bet is the same shape now: one person with AI doing what five did manually, and the person moving toward judgment work rather than out the door.',
      },
      {
        q: 'A task qualifies for the automation layer (full offload, no human in the loop) when it matches four patterns. Which task below fits all four?',
        options: [
          'Deciding which of two senior engineers gets the promotion',
          'Building the Monday report from the same five spreadsheets, same columns, same formatting, every single week',
          'Talking a frustrated enterprise client out of churning',
          'Choosing the architecture for a brand-new payments system',
        ],
        answer: 1,
        explain: 'The Monday report is repetitive, rule-based, high volume, and low judgment, the four automation patterns. The other three fail the low-judgment test hard: they need wisdom, context, or a relationship, which routes them to augmentation or to a no-go zone.',
      },
      {
        q: 'In one of Weinstein\'s client stories, a logistics CEO spent $120,000 deploying an autonomous customer-onboarding agent and had a disaster within six weeks. What went wrong?',
        options: [
          'The model hallucinated pricing and quoted customers the wrong rates',
          'The agent worked, but the foundations under it did not exist: customer data lived in three disconnected systems and seven onboarding steps lived only in two employees\' heads',
          'The vendor abandoned the product mid-rollout',
          'Employees quietly sabotaged the rollout to protect their jobs',
        ],
        answer: 1,
        explain: 'Weinstein calls it building a penthouse on a vacant lot. Autonomy sits on top of automation (which produces clean, connected data) and augmentation (which produces documented process knowledge), so skipping those layers made failure structural rather than technical.',
      },
      {
        q: 'Weinstein defines a digital employee (an agent) as an assembly of three parts. Which three?',
        options: [
          'A model, a vector database, and a dashboard',
          'A brain (prompt, organizational context, memory), skills (step-by-step procedures and playbooks), and tools (scoped access to exactly the systems the job needs)',
          'An orchestrator, a worker pool, and a message queue',
          'A frontend, a backend, and an eval suite',
        ],
        answer: 1,
        explain: 'The trio deliberately mirrors hiring a person: knowledge, training, and access. Tool scoping is part of the definition, so a sales agent never touches finance data and a content agent cannot send email.',
      },
    ],
    sections: [
      {
        heading: 'The end of boring work',
        blocks: [
          {
            type: 'text',
            md: 'This lesson steps back from code and asks the question a fractional CTO gets paid to answer: where does AI belong in a whole business? The framework comes from **Lior Weinstein**, founder of [CTOx](https://ctox.com), a large community of fractional CTOs, and himself an active fractional CTO with clients ranging from early startups to nine-figure companies. He taught it during an April 2026 workshop alongside Cole Medin, whose engineering half of the same event feeds the PIV material in [Token Economics & AI-Native SDLC · The AI-Native SDLC](lesson:m7-l2).\n\nHis opening stat frames everything: about **60% of a knowledge worker\'s day goes to "work about work"**. The phrase covers meetings about status, hunting for information, reformatting data, and copying numbers from one system into another. The job you were actually hired for gets the remaining 40%. And his point cuts deeper than the number: the real cost is the brilliant work that never happens because busy work ate the day. The architecture decision postponed because you were updating [Jira](https://www.atlassian.com/software/jira) (the ticket tracker), the product call never made because you were formatting a report.\n\nHe names the moment every exec is living through the **Blockbuster moment**. Blockbuster was printing money when Netflix showed up with a different model, and Blockbuster decided it was fine. It was not fine. Every business now faces that fork with AI, and this playbook is his method for choosing the Netflix side on purpose instead of by luck.\n\nFor the fear that AI deletes jobs, he offers the **ATM story**. When cash machines arrived in the 1980s, every banker predicted the end of the teller. Teller employment went *up*: machines made branches cheaper to run, banks opened more branches, and the teller\'s job shifted from counting cash toward advertising, selling, and problem solving. His bet is the same shape here: make every person 10x more effective, with intelligence that never sleeps. One person with AI does the manual work of five, and the org chart changes accordingly.',
          },
          {
            type: 'diagram',
            caption: 'Weinstein\'s two org-chart slides, side by side. The same three-level hierarchy of 13 humans, one year apart: today every node in the tree has its own cluster of about 30 agents beneath it, so 13 humans direct 390 workers.',
            svg: `<svg viewBox="0 0 700 315" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="315" fill="#18181b" rx="8"/><defs><g id="agsw" fill="#a78bfa"><circle cx="0" cy="0" r="2"/><circle cx="7" cy="0" r="2"/><circle cx="14" cy="0" r="2"/><circle cx="0" cy="7" r="2"/><circle cx="7" cy="7" r="2"/><circle cx="14" cy="7" r="2"/><circle cx="0" cy="14" r="2"/><circle cx="7" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><circle cx="0" cy="21" r="2"/><circle cx="7" cy="21" r="2"/><circle cx="14" cy="21" r="2"/><circle cx="0" cy="28" r="2"/><circle cx="7" cy="28" r="2"/><circle cx="14" cy="28" r="2"/></g></defs><text x="170" y="30" fill="#e4e4e7" font-size="14" font-weight="bold" text-anchor="middle">AN ORG CHART 1 YEAR AGO</text><text x="170" y="48" fill="#34d399" font-size="12" text-anchor="middle">13 humans = 13 workers</text><path d="M170 82 L68 122 M170 82 L170 122 M170 82 L272 122 M68 142 L34 182 M68 142 L68 182 M68 142 L102 182 M170 142 L136 182 M170 142 L170 182 M170 142 L204 182 M272 142 L238 182 M272 142 L272 182 M272 142 L306 182" stroke="#34d399" stroke-width="1" fill="none"/><rect x="155" y="62" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="170" y="76" fill="#e4e4e7" font-size="10" text-anchor="middle">1</text><rect x="53" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="68" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">2</text><rect x="155" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="170" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">3</text><rect x="257" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="272" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">4</text><rect x="21" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="34" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">5</text><rect x="55" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="68" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">6</text><rect x="89" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="102" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">7</text><rect x="123" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="136" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">8</text><rect x="157" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="170" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">9</text><rect x="191" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="204" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">10</text><rect x="225" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="238" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">11</text><rect x="259" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="272" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">12</text><rect x="293" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="306" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">13</text><line x1="350" y1="22" x2="350" y2="240" stroke="#52525b" stroke-width="1"/><text x="530" y="30" fill="#e4e4e7" font-size="14" font-weight="bold" text-anchor="middle">AN ORG CHART TODAY</text><text x="530" y="48" fill="#34d399" font-size="12" text-anchor="middle">13 humans <tspan fill="#a78bfa">(30 agents each)</tspan> = 390 workers</text><path d="M530 82 L428 122 M530 82 L530 122 M530 82 L632 122 M428 142 L394 182 M428 142 L428 182 M428 142 L462 182 M530 142 L496 182 M530 142 L530 182 M530 142 L564 182 M632 142 L598 182 M632 142 L632 182 M632 142 L666 182" stroke="#34d399" stroke-width="1" fill="none"/><rect x="515" y="62" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="530" y="76" fill="#e4e4e7" font-size="10" text-anchor="middle">1</text><use href="#agsw" x="523" y="88"/><rect x="413" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="428" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">2</text><rect x="515" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="530" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">3</text><rect x="617" y="122" width="30" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="632" y="136" fill="#e4e4e7" font-size="10" text-anchor="middle">4</text><use href="#agsw" x="421" y="146"/><use href="#agsw" x="523" y="146"/><use href="#agsw" x="625" y="146"/><rect x="381" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="394" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">5</text><rect x="415" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="428" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">6</text><rect x="449" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="462" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">7</text><rect x="483" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="496" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">8</text><rect x="517" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="530" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">9</text><rect x="551" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="564" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">10</text><rect x="585" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="598" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">11</text><rect x="619" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="632" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">12</text><rect x="653" y="182" width="26" height="20" fill="#27272a" stroke="#34d399" rx="4"/><text x="666" y="196" fill="#e4e4e7" font-size="10" text-anchor="middle">13</text><use href="#agsw" x="387" y="206"/><use href="#agsw" x="421" y="206"/><use href="#agsw" x="455" y="206"/><use href="#agsw" x="489" y="206"/><use href="#agsw" x="523" y="206"/><use href="#agsw" x="557" y="206"/><use href="#agsw" x="591" y="206"/><use href="#agsw" x="625" y="206"/><use href="#agsw" x="659" y="206"/><rect x="30" y="250" width="640" height="52" fill="#27272a" stroke="#52525b" rx="6"/><text x="350" y="271" fill="#e4e4e7" font-size="13" text-anchor="middle">Same hierarchy, same payroll: every node gains a swarm of about 30 agents.</text><text x="350" y="290" fill="#a1a1aa" font-size="11" text-anchor="middle">Agents multiply the existing tree instead of replacing it. Purple dots = AI agents.</text></svg>`,
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The frame',
            md: 'Weinstein\'s framing for the whole hour: what AI ends is the boring part of work. The people who thrive in the transition are the ones who think clearly about how work should flow, and reclaimed time is the payoff: space to care, to think, and to lead.',
          },
        ],
      },
      {
        heading: 'Front stage, back stage',
        blocks: [
          {
            type: 'text',
            md: 'The first tool in the playbook is a split borrowed from live events. When Celine Dion goes on stage and performs, the singing is her **front stage**: her brilliance, the genius only she can supply. Nobody expects her to verify the payment system is working, send the ticket confirmations, or seat 20,000 people. That machinery is the **back stage**: everything else. It has to work, and none of the magic lives there.\n\nEvery role has both. Your front stage is the work where you shine, the work that needs YOUR judgment, creativity, relationships, or expertise: the reason you got hired, the reason your team trusts you. Your back stage is everything that supports it without being the main act: the prep, the admin, the coordination. The workshop\'s first exercise sounds almost too basic to matter: take a typical week and sort everything you do into the two lists. It matters because people discover the same pattern every time: the brilliant work sits buried under the admin. In the live session, a coach put coaching on the front stage and schedule planning on the back; a systems engineer put "fixing someone\'s network and making them feel taken care of" up front and time-and-ticket entry in back.\n\nEverything that follows builds toward one strategic move, stated on its own slide: move your back stage to AI so you live on your front stage. And notice what the exercise does for you as an advisor. Sorting a team\'s work this way tells you what each person uniquely contributes, which is exactly the map you need before proposing any AI initiative to a client.',
          },
          {
            type: 'compare',
            left: {
              title: 'Front stage (protect it)',
              items: [
                'Work that needs your judgment, creativity, or relationships',
                'The architecture call, the coaching session, the client dinner',
                'The reason you were hired and the thing your team trusts you for',
                'Where all of your reclaimed time should go',
              ],
            },
            right: {
              title: 'Back stage (hand it off)',
              items: [
                'Prep, admin, formatting, coordination, status reporting',
                'Copying data between systems that refuse to talk to each other',
                'Necessary for the show, invisible when done well',
                'Where every AI initiative in this lesson starts',
              ],
            },
          },
        ],
      },
      {
        heading: 'The no-go zones',
        blocks: [
          {
            type: 'text',
            md: 'Before mapping where AI goes, Weinstein maps where it never goes, and he weights this as heavily as the rest of the framework. AI manufactures efficiency; empathy, care, and presence stay stubbornly human. Four zones stay off-limits because in them the human connection is the product itself, and automating the product away hollows out a business while every dashboard says things improved.',
          },
          {
            type: 'table',
            headers: ['No-go zone', 'What lives there', 'Examples from the workshop'],
            rows: [
              [
                'Relationships',
                'Trust built face to face; the call you make when a team member is struggling',
                'Client relationships, coaching, reading team dynamics and hiring instincts',
              ],
              [
                'Judgment calls',
                'Decisions that need wisdom, context, and experience, including knowing when to break the rules',
                'Big financial decisions, figuring out what a customer needs versus what they say they want',
              ],
              [
                'Physical presence',
                'Being in the room when it matters',
                'Worker-safety calls on a job site, the meeting where your presence is the message',
              ],
              [
                'Empathy & creativity',
                'Moments that need a human heart; ideas that come from lived experience; the art',
                'Firing someone, tough conversations (AI can help prepare them; a human delivers them), taste',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Operational red lines',
            md: 'The workshop chat added hard operational lines worth stealing verbatim: never give an agent delete access to the production database, never let it push sweeping customer-facing changes without oversight, and never let it execute financial decisions. These are the org-scale cousins of the deterministic guardrails you built in [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5): boundaries enforced by structure instead of goodwill.',
          },
        ],
      },
      {
        heading: 'The AAA framework: hands, suit, brain',
        blocks: [
          {
            type: 'text',
            md: 'With the front stage protected and the red lines drawn, the **AAA framework** sorts everything else: three layers, three kinds of intelligence, three ways AI shows up in a company.\n\n**Layer 1, automation, is the hands.** Work gets fully offloaded: no human in the loop, the machine does it, and you never think about it again. Four patterns qualify a task, and a strong candidate hits all four. It is *repetitive* (same task, same way, every time). It is *rule-based* (the logic fits on an index card: if the invoice is under $10,000, approve it; if a lead books a call, update the CRM, the customer relationship management system). It is *high volume* (frequent enough that the math is obvious, like hundreds of support-ticket routings a week). And it is *low judgment* (no wisdom, context, or relationship required). When workshop attendees tallied their own robot tasks, the answers ran 2, 3, 5, and 10 hours per week per person. Multiply that across a team and the tally becomes the business case.',
          },
          {
            type: 'text',
            md: '**Layer 2, augmentation, is the suit.** Think Iron Man: Tony Stark stays inside, still calling the shots, and the suit adds capabilities he could never have alone. The human keeps the judgment while AI compresses everything around it. The evidence Weinstein cites is the Harvard Business School and Boston Consulting Group field study of 758 consultants ([Navigating the Jagged Technological Frontier](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)): consultants working with AI completed 12.2% more tasks, finished 25.1% faster, and produced 40% higher-quality work. The finding worth repeating in a boardroom: the biggest gains went to the *lowest* performers. AI lifts the floor hardest, which makes it an equalizer for a team rather than a superstar amplifier. The slide\'s own summary line: AI is the great equalizer.\n\nThe tell for a layer-2 candidate is a lopsided **prep-to-judgment ratio**. Attendees volunteered days of root-cause analysis feeding a one-hour safety decision, a week of research behind a one-hour training, and hours of deck polishing for five minutes on screen. In each case the expertise takes minutes; the prep buries it. Augmentation compresses the prep and leaves the judgment where it was: same person, same role, fundamentally different output, with 45 minutes of research becoming 5. The layer also carries a career path Weinstein names explicitly: **doer** (you execute the task) to **manager of bots** (you oversee the AI doing it, handle the exceptions, and improve the system) to **strategist** (you direct intelligence at outcomes and design new capabilities). The path moves one direction, toward more valuable work.',
          },
          {
            type: 'text',
            md: '**Layer 3, autonomy, is the brain: digital employees.** Weinstein is deliberate about that term. A digital employee takes input, thinks, decides, acts, handles exceptions, and produces output with nobody in the loop, the way a competent hire does. Four criteria gate entry to this layer, and a candidate needs all four. The function must be *self-contained*: clear inputs and outputs, a box you can draw around the whole thing. It must be *measurable*: you know objectively whether it worked. It needs *error recovery*: it can detect failure and try alternatives. And, the critical one, it must be *built on layers 1 and 2*. Autonomy is where you arrive once the foundations exist, never the place you start.\n\nHis exercise for finding candidates: if you could hire 30 people whose only job was handling things you never want to think about again, what would they do? The answers that work are always narrow: 30 specialists, never one assistant who does everything. A meeting prepper who briefs you before every call. A report builder who has the Monday numbers done. A follow-up tracker that never lets a promise slip. An inbox filter that surfaces only what matters. A pipeline watcher that alerts you to at-risk deals. Write five of those job descriptions and you have drafted your first agent roadmap.',
          },
          {
            type: 'diagram',
            caption: 'Weinstein\'s onion, redrawn from the deck: three concentric layers with automation at the core, augmentation wrapped around it, and autonomy on the outside. Each layer depends on the one beneath it, so you build from the inside out.',
            svg: `<svg viewBox="0 0 700 365" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="365" fill="#18181b" rx="8"/><text x="350" y="30" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE ONION</text><path d="M115 310 A235 235 0 0 1 585 310 Z" fill="#27272a" stroke="#fbbf24" stroke-width="2"/><path d="M180 310 A170 170 0 0 1 520 310 Z" fill="#18181b" stroke="#a78bfa" stroke-width="2"/><path d="M245 310 A105 105 0 0 1 455 310 Z" fill="#27272a" stroke="#38bdf8" stroke-width="2"/><line x1="80" y1="310" x2="620" y2="310" stroke="#52525b" stroke-width="2"/><text x="350" y="105" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">AUTONOMY</text><text x="350" y="123" fill="#a1a1aa" font-size="10" text-anchor="middle">the brain: digital employees</text><text x="350" y="170" fill="#a78bfa" font-size="14" font-weight="bold" text-anchor="middle">AUGMENTATION</text><text x="350" y="188" fill="#a1a1aa" font-size="10" text-anchor="middle">the suit: judgment stays human</text><text x="350" y="252" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">AUTOMATION</text><text x="350" y="270" fill="#a1a1aa" font-size="10" text-anchor="middle">the hands: full offload</text><line x1="55" y1="298" x2="55" y2="105" stroke="#34d399" stroke-width="2"/><polygon points="49,105 61,105 55,93" fill="#34d399"/><text x="55" y="190" fill="#34d399" font-size="10" text-anchor="middle">build</text><text x="55" y="204" fill="#34d399" font-size="10" text-anchor="middle">order</text><text x="350" y="332" fill="#e4e4e7" font-size="12" text-anchor="middle">Work from the inside out: Automation &#8594; Augmentation &#8594; Autonomy. Each layer depends on the one beneath it.</text><text x="350" y="350" fill="#f472b6" font-size="11" text-anchor="middle">Skip a layer and it collapses: the $120k penthouse went up on a vacant lot.</text></svg>`,
          },
        ],
      },
      {
        heading: 'Build from the inside out',
        blocks: [
          {
            type: 'text',
            md: 'Why does build order deserve its own section? Because the most expensive failure mode in AI transformation is skipping straight to the exciting layer. Weinstein\'s onion model says each layer feeds the next. Automation produces the clean data and reliable plumbing that augmentation depends on. Augmentation produces the documented organizational knowledge that autonomous agents need before they can act unsupervised: the **SOPs** (standard operating procedures, written step-by-step playbooks for how a task gets done), the scoring criteria, the tribal knowledge finally on paper. An agent can only follow a procedure that exists somewhere outside someone\'s head.\n\nHis client story makes it concrete. A logistics company at roughly $60 million in revenue had a CEO who wanted to skip to the future, so he deployed an autonomous customer-onboarding agent: $120,000 and six weeks later, a disaster. The failure had nothing to do with the model. The agent worked; the ground under it did not exist. Customer data lived in three systems that never talked to each other, and seven onboarding steps lived undocumented in two employees\' heads. Weinstein\'s summary is the line to keep: the CEO built a penthouse on a vacant lot.\n\nThe selection rule that falls out of this: treat your AAA map (his recap slide draws it as four boxes: your robot task to automate, your Iron Man moment to compress, who you\'d hire to hand off, and the always-human zone to protect) as a blueprint rather than a wish list, and start with the one initiative that has the *cleanest math*. Countable hours saved, an objective success measure, a box you can draw around the function, and foundations that already exist. On returns, the research Weinstein cites pegs AI at $3.70 back on every $1 invested, plus what his slide calls a priceless return on time. Sequencing is what separates companies that see that number from companies that fund penthouses.',
          },
        ],
      },
      {
        heading: 'Digital employees are specialists',
        blocks: [
          {
            type: 'text',
            md: 'When a candidate survives every filter, you spec it the way you would write a job description, because Weinstein\'s agent anatomy is a hiring analogy that holds up under inspection.',
          },
          {
            type: 'table',
            headers: ['Part', 'What it holds', 'Hiring analogy'],
            rows: [
              [
                'The brain',
                'Its prompt (role and boundaries), its organizational context, and the memory it accumulates from doing the work',
                'Who the hire is: their knowledge of the company plus what they learn on the job',
              ],
              [
                'The skills',
                'SOPs and playbooks: step-by-step procedures, scoring criteria, voice and tone',
                'Their training and their craft',
              ],
              [
                'The tools',
                'Scoped access to exactly the systems the job needs: the CRM, email, a spreadsheet. A sales agent never touches finance data; a content agent cannot send email',
                'Their badge and their system permissions',
              ],
            ],
          },
          {
            type: 'text',
            md: 'The anatomy should feel familiar. A system prompt plus skills plus scoped tools is exactly what you assembled for coding agents in [Claude Code Mastery · Agent Skills Deep Dive](lesson:m1-l3), pointed at sales follow-ups instead of pull requests. Where Weinstein plants his flag is on *specialization*: hundreds of agents, each doing one narrow thing well, over one giant brain that tries to do everything. His metaphors do the arguing. A monolithic agent is a brick wall: pull one brick and the whole thing caves, and you cannot debug it, grade it, or change it safely. Specialized agents are LEGO blocks: swap one out, grade each independently, and when something breaks you know exactly which block.\n\nThe Q&A sharpened that into a traceability argument any engineer will recognize. When a giant do-everything agent fails, where do you even look? Which skill, which prompt, which memory caused it? A specialist gives every failure an address, the way a stack trace gives a bug a line number. That maps directly onto the orchestration patterns from [Agents, Harnesses & Loops · Multi-Agent Patterns](lesson:m2-l5).\n\nAt scale, his own company runs the pattern with a supporting cast. **Dispatcher agents** coordinate scheduling across hundreds of agents, so the org avoids drowning in thousands of cron jobs (scheduled background tasks). **Refinery agents** score every run against a definition of done, then review the scores every 48 hours and decide whether an underperformer needs a different model, different data, or a rewritten prompt. Every agent ships with its evaluation on day one, the same verification-first doctrine from [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4). His discovery tooling closes the loop: connect a person\'s email, Slack, and calendar, infer the hats they wear, and surface evidence-backed agent opportunities, each proposal arriving with boundaries ("never send a reply without review") and a success metric attached. The demo scan in his deck read 5,790 items from one person\'s accounts and came back with 54 opportunities across 7 roles. Run that across a company and the transformation backlog stops being guesswork.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'What this means for hiring',
            md: 'Weinstein\'s hiring bar, stated bluntly in the Q&A: he interviews engineers by watching them fly, firing up their AI setup on a small live build. A candidate who opens a Google Doc and starts hand-planning gets passed over; he wants "pilots in cockpits." Attitude beats years of experience in his telling, because AI can backfill the experience while the mindset has to come with the person. Adopt the bar or argue with it, but expect clients to start asking you about it either way.',
          },
        ],
      },
    ],
    lab: {
      title: 'Run the playbook on a real client',
      intro: 'You advise real businesses, and Weinstein\'s framework only earns its keep when it maps onto one of them. Pick a company you work with (or your own practice), run the full AAA mapping, and finish with a one-page transformation brief you could put in front of the owner next week.',
      steps: [
        'Pick the business and list its key roles, 5-10 people or functions. For each one, write a front-stage line (the work only they can do) and a back-stage line (the prep, admin, and coordination that buries it).',
        'Mark the no-go zones explicitly: the relationships, judgment calls, physical-presence moments, and empathy work that stay human no matter what. Write them down; a transformation brief without protected zones reads like a layoff plan.',
        'Hunt layer-1 automation candidates: tasks that are repetitive, rule-based, high volume, and low judgment. Estimate the hours per week each one eats. You want at least three with honest numbers.',
        'Find the Iron Man moments for layer 2: expert tasks with a brutal prep-to-judgment ratio, hours of research feeding a 20-minute decision. Note the ratio for at least two of them.',
        'Write five digital-employee job descriptions for layer 3: a title, a one-line scope (one narrow job done well), the success metric you would grade it on, and the minimal set of tools it gets access to.',
        'Pick the single first initiative with the cleanest math: countable hours saved, an objective success measure, and a box you can draw around the whole function. Then check it against the onion: does it depend on clean data or a documented process that does not exist yet? If so, that data or documentation work IS the initiative.',
        'Write the one-page brief: the 60/40 diagnosis for this company, the protected zones, the AAA map, the chosen first initiative with its math, and the build order. Draft it with Claude Code if you like; the judgment calls inside it are yours.',
      ],
      checklist: [
        'Org map covers the key roles with a front-stage and a back-stage line for each',
        'No-go zones are written down and specific to this business, including at least one judgment call and one relationship',
        'AAA map holds 3+ automation candidates with hours per week, 2+ Iron Man ratios, and 5 digital-employee specs with success metrics and scoped tools',
        'Chosen first initiative passes the cleanest-math test and respects the build order (no penthouse on a vacant lot)',
        'One-page transformation brief exists and would survive being read aloud to the business owner',
      ],
    },
    checkQuiz: [
      {
        q: 'The Harvard/BCG study of consultants working with AI is Weinstein\'s core evidence for the augmentation layer. What did it find?',
        options: [
          '12.2% more tasks completed, 25.1% faster, 40% higher quality, with the biggest gains going to the lowest performers',
          'Speed doubled while quality dropped 15%, concentrated among juniors',
          'Only the top decile improved; everyone else got slower',
          'No measurable difference once task difficulty was controlled for',
        ],
        answer: 0,
        explain: 'All three numbers moved in the right direction at once, and the gains concentrated at the bottom of the performance curve. That makes augmentation an equalizer: it lifts the whole team\'s floor rather than adding a rocket to the star performer.',
      },
      {
        q: 'Which of these belongs in a no-go zone, kept away from AI entirely, rather than in one of the AAA layers?',
        options: [
          'Routing hundreds of support tickets a week',
          'Drafting the first pass of a quarterly board deck',
          'Delivering a firing decision, or any conversation where the human relationship is the actual product',
          'Reconciling invoices under a fixed approval threshold',
        ],
        answer: 2,
        explain: 'The four no-go zones are relationships, judgment calls, physical presence, and empathy or creativity. AI can help prepare a tough conversation, and a human still delivers it; ticket routing and invoice rules are textbook automation, and deck drafting is augmentation.',
      },
      {
        q: 'Why does Weinstein insist on hundreds of specialized agents instead of one powerful generalist agent?',
        options: [
          'Specialized agents run on cheaper models, and cost is the whole argument',
          'A monolithic agent cannot hold enough context to work at all',
          'Traceability and safe change: when a specialist fails you know exactly which agent, skill, or prompt broke, and you can regrade or swap one without touching the rest',
          'Vendor pricing penalizes large single agents',
        ],
        answer: 2,
        explain: 'His images are a brick wall versus LEGO blocks. A giant do-everything agent gives a failure nowhere to point, while a specialist gives every failure an address, and each one can be measured, improved, or replaced independently.',
      },
      {
        q: 'The augmentation layer comes with an evolution path for the human. What changes when you move from doer to manager of bots?',
        options: [
          'You stop being accountable for the output',
          'You oversee the AI doing the task, handle the exceptions, and improve the system, instead of executing the task by hand',
          'You write the same code, just faster',
          'You move into people management and leave the domain behind',
        ],
        answer: 1,
        explain: 'The doer executes manually; the manager of bots supervises, catches exceptions, and tunes the system doing the work. The third stage, strategist, directs intelligence at outcomes and designs new capabilities, and the path only moves in that direction.',
      },
    ],
    resources: [
      { label: 'The Complete AI Transformation Blueprint (Hour 1: Lior Weinstein\'s playbook)', url: 'https://www.youtube.com/watch?v=OcTMwjqje5Q', kind: 'video' },
      { label: 'CTOx: Lior Weinstein\'s fractional-CTO community', url: 'https://ctox.com', kind: 'course' },
      { label: 'Navigating the Jagged Technological Frontier: the Harvard/BCG consultant study', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321', kind: 'article' },
      { label: 'Cole Medin\'s workshop repo (the engineering half of the same event)', url: 'https://github.com/coleam00/ai-transformation-workshop', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m8-l1: Designing an Agent Workforce
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm8-l1',
    title: 'Designing an Agent Workforce',
    day: 22,
    minutes: 55,
    xp: 100,
    objectives: [
      'Sketch a working agent org: a chief-of-staff orchestrator over 4-6 specialist agents, each with a named role',
      'Write a charter for one agent: role, scope, boundaries, escalation rules, and a success metric',
      'Split organizational knowledge correctly: what goes in the shared knowledge base versus each agent\'s private memory',
      'Wire routines: scheduled runs and event triggers, so the workforce produces without being prompted',
      'Read operator threads about agent workforces critically, separating durable patterns from week-one marketing numbers',
    ],
    skipQuiz: [
      {
        q: 'Operators running agent workforces converge on one structural rule: the human talks to a single chief-of-staff agent, which delegates to the specialists. Why?',
        options: [
          'Vendors charge per conversation, so fewer chats save money',
          'One front door keeps the human out of coordination work: the chief of staff decomposes outcomes into tasks, routes them, chases completion, and reports back once, instead of the human managing 6 separate agents',
          'Specialist agents refuse instructions from humans for safety reasons',
          'It makes the org chart diagram look cleaner in demos',
        ],
        answer: 1,
        explain:
          'The whole point of the workforce is handing off coordination, and talking to six agents individually IS coordination. The chief-of-staff pattern moves that burden into the org: you state the outcome, one agent turns it into delegated tasks and returns one consolidated report. It is the orchestrator node from graph engineering, applied to operations instead of code.',
      },
      {
        q: 'What belongs in the SHARED knowledge base rather than an individual agent\'s memory?',
        options: [
          'Everything, so all agents stay perfectly synchronized',
          'Facts every agent needs identically: what the company does, the customer profile, the brand voice, pricing, current priorities. Task state and role-specific learnings stay in each agent\'s own memory',
          'Nothing; sharing knowledge between agents causes hallucinations',
          'Only login credentials and API keys',
        ],
        answer: 1,
        explain:
          'The split mirrors a real office: the company wiki versus each person\'s working notes. Company facts duplicated into six private memories drift apart the first time one gets updated and five do not. Task state pushed into the shared base buries every agent in every other agent\'s noise. Shared truths go in one place; working state stays local.',
      },
      {
        q: 'An agent workforce charter should contain which of these?',
        options: [
          'The model version, the GPU it runs on, and its token budget only',
          'Role, scope (what it owns), boundaries (what it never touches), escalation rules (when to stop and ask a human), and the metric it is graded on',
          'A list of prompts to copy-paste each morning',
          'The agent\'s personality description and preferred emoji',
        ],
        answer: 1,
        explain:
          'A charter is a job description with the boundaries made explicit, because an agent will not infer them. The escalation rules matter most: they encode when autonomy ends and a human decision begins. An agent with a metric but no boundaries optimizes into places you did not want it; one with boundaries but no metric cannot be graded or improved.',
      },
      {
        q: 'What turns an agent workforce from a set of chatbots into something that produces without being prompted?',
        options: [
          'Larger context windows',
          'Routines: scheduled runs (the analyst reports every night at 9) and event triggers (a new lead arriving kicks off qualification), so work starts from the calendar and the inbox rather than from a human typing',
          'Giving every agent admin access to all systems',
          'Fine-tuning each agent on the company\'s data',
        ],
        answer: 1,
        explain:
          'A workforce that only moves when you prompt it is a fancy chat interface, and you are still the bottleneck. Routines invert the flow: time-based schedules cover the recurring work, event triggers cover the reactive work, and the human reads outputs instead of initiating inputs. This is the loop discipline from the harness module, running on a calendar.',
      },
      {
        q: 'A thread reports week-one results: 214 verified prospects, 89 personalized outreaches, inbox at zero, 11 content pieces. The literate reading?',
        options: [
          'Multiply by 52 to get the annual value of the system',
          'The patterns described (delegation, charters, triage) are real and worth stealing; the numbers are unverified marketing that omit quality, error rates, supervision time, and whether any prospect converted',
          'The numbers prove agent workforces outperform human teams',
          'Dismiss the entire thread since numbers this good are impossible',
        ],
        answer: 1,
        explain:
          'The same substance-versus-framing discipline as the graph-engineering hype: operators sharing real patterns dress them in numbers no reader can check. Volume metrics without quality metrics are the oldest trick in sales content; 89 outreaches that land as spam are worth less than five that land as relevant. Steal the architecture, audit the arithmetic.',
      },
    ],
    sections: [
      {
        heading: 'From framework to org chart',
        blocks: [
          {
            type: 'text',
            md: "The previous lesson gave you Weinstein's theory: back-stage work moves to AI, digital employees are specialists, autonomy sits on top of foundations. This lesson is the operating manual, drawn from the operators actually running agent workforces day to day in mid-2026, most visibly the wave of people building on **Grok Bot** (xAI's agent-workforce product, which gets its own hands-on treatment next lesson). Their tooling varies; their patterns converge hard, and the patterns are what transfer to any platform, including one you assemble yourself from Claude Code parts.\n\nHere is a real example org, condensed from an operator's writeup of an eight-agent setup. Every agent has a name and one narrow job. **Atlas**, the chief of staff, decomposes outcomes into tasks, delegates to the team, and delivers a daily report. **Scout** researches prospects and delivers a qualified list every morning. **Quill** produces content drafts in the operator's voice. **Pitch** writes personalized outreach with follow-up sequences. **Vault** triages the inbox by priority so mornings start at zero. **Ledger** reports the numbers nightly. The operator's summary line is the thesis of this whole module: my bottleneck was never how much I could do, it was how much I could hand off.\n\nNotice what the roster is: Weinstein's write-five-job-descriptions exercise, actually running. Narrow specialists, an explicit coordinator, and nothing resembling one giant do-everything assistant.",
          },
          {
            type: 'diagram',
            caption: 'The converged shape of a working agent org: one human, one chief-of-staff front door, specialists behind it, shared knowledge underneath, and routines driving the work instead of prompts.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect width="700" height="400" fill="#18181b" rx="8"/>
  <rect x="290" y="20" width="120" height="42" fill="#27272a" stroke="#e4e4e7" stroke-width="2" rx="8"/>
  <text x="350" y="38" fill="#e4e4e7" font-size="12" font-weight="bold" text-anchor="middle">YOU</text>
  <text x="350" y="54" fill="#a1a1aa" font-size="10" text-anchor="middle">outcomes in, reports out</text>
  <line x1="350" y1="62" x2="350" y2="86" stroke="#818cf8" stroke-width="2"/>
  <polygon points="344,86 356,86 350,96" fill="#818cf8"/>
  <rect x="250" y="96" width="200" height="48" fill="#27272a" stroke="#818cf8" stroke-width="2" rx="8"/>
  <text x="350" y="116" fill="#818cf8" font-size="13" font-weight="bold" text-anchor="middle">ATLAS: chief of staff</text>
  <text x="350" y="134" fill="#a1a1aa" font-size="10" text-anchor="middle">decomposes, delegates, reports daily</text>
  <line x1="290" y1="144" x2="82" y2="186" stroke="#52525b" stroke-width="2"/>
  <line x1="320" y1="144" x2="216" y2="186" stroke="#52525b" stroke-width="2"/>
  <line x1="350" y1="144" x2="350" y2="186" stroke="#52525b" stroke-width="2"/>
  <line x1="380" y1="144" x2="484" y2="186" stroke="#52525b" stroke-width="2"/>
  <line x1="410" y1="144" x2="618" y2="186" stroke="#52525b" stroke-width="2"/>
  <rect x="20" y="188" width="124" height="52" fill="#27272a" stroke="#34d399" rx="8"/>
  <text x="82" y="209" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">SCOUT</text>
  <text x="82" y="227" fill="#a1a1aa" font-size="10" text-anchor="middle">prospect research</text>
  <rect x="154" y="188" width="124" height="52" fill="#27272a" stroke="#fbbf24" rx="8"/>
  <text x="216" y="209" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">QUILL</text>
  <text x="216" y="227" fill="#a1a1aa" font-size="10" text-anchor="middle">content, your voice</text>
  <rect x="288" y="188" width="124" height="52" fill="#27272a" stroke="#f472b6" rx="8"/>
  <text x="350" y="209" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">PITCH</text>
  <text x="350" y="227" fill="#a1a1aa" font-size="10" text-anchor="middle">outreach, follow-ups</text>
  <rect x="422" y="188" width="124" height="52" fill="#27272a" stroke="#38bdf8" rx="8"/>
  <text x="484" y="209" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">VAULT</text>
  <text x="484" y="227" fill="#a1a1aa" font-size="10" text-anchor="middle">inbox triage</text>
  <rect x="556" y="188" width="124" height="52" fill="#27272a" stroke="#a78bfa" rx="8"/>
  <text x="618" y="209" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">LEDGER</text>
  <text x="618" y="227" fill="#a1a1aa" font-size="10" text-anchor="middle">nightly metrics</text>
  <rect x="20" y="270" width="440" height="50" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="8"/>
  <text x="240" y="291" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">SHARED KNOWLEDGE BASE</text>
  <text x="240" y="309" fill="#a1a1aa" font-size="10" text-anchor="middle">company facts, voice, customer profile, priorities: one copy, every agent reads it</text>
  <rect x="480" y="270" width="200" height="50" fill="#27272a" stroke="#fbbf24" stroke-width="1.5" rx="8"/>
  <text x="580" y="291" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">ROUTINES</text>
  <text x="580" y="309" fill="#a1a1aa" font-size="10" text-anchor="middle">schedules + event triggers</text>
  <text x="350" y="352" fill="#e4e4e7" font-size="11" text-anchor="middle">Each specialist keeps its own private memory (task state, role learnings). Charters draw every box's edges.</text>
  <text x="350" y="374" fill="#a1a1aa" font-size="10" text-anchor="middle">Same diamond logic as graph engineering: the chief of staff is the fan-out and the reduce.</text>
</svg>`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'You already know this graph',
            md: "Squint and the org chart is the diamond from [Agents, Harnesses & Loops · Graph Engineering](lesson:m2-l10): the chief of staff fans work out to specialists and reduces their outputs into one report. The difference is lifespan. A graph run finishes; a workforce runs indefinitely, which is why it needs the three things a one-shot diamond skips: charters, shared knowledge, and routines. Those three are the rest of this lesson.",
          },
        ],
      },
      {
        heading: 'The charter: a job description with edges',
        blocks: [
          {
            type: 'text',
            md: "Weinstein specced a digital employee as brain plus skills plus tools. Operators add the missing document: the **charter**, the artifact that makes an agent manageable over months instead of impressive for a demo. A charter answers five questions, and the answers go in a file the agent reads at the start of every run.\n\n**Role**: the one job, in one sentence. **Scope**: what it owns, listed concretely (Scout owns prospect research for the consulting practice; Scout does not own outreach). **Boundaries**: what it never does, stated as hard rules (never contacts a prospect, never spends money, never deletes anything). **Escalation**: the situations where it stops and asks (a prospect replies angrily; a metric moves more than 20%; confidence is low). **Metric**: the number or check it is graded on (25 qualified prospects a day that pass the fit criteria).\n\nThe escalation section earns special attention because it encodes the supervision reality from [Token Economics & AI-Native SDLC · The AI-Native SDLC](lesson:m7-l2): even in mid-2026, humans fully delegate only a sliver of work. A good charter makes the supervision cheap by defining exactly which moments need it, rather than making you review everything or nothing.",
          },
          {
            type: 'code',
            lang: 'markdown',
            code: `# CHARTER: Scout (prospect research)

ROLE: Find and qualify prospects for the fractional-CTO practice.

SCOPE (owns):
- Daily research pass over target industries
- Qualification against the fit criteria in /knowledge/icp.md
- A morning list: name, company, why-now, fit score, source links

BOUNDARIES (never):
- Never contacts a prospect by any channel
- Never uses data sources the client list forbids
- Never edits /knowledge/; propose changes to Atlas instead

ESCALATE TO HUMAN WHEN:
- A prospect is a current or former client (check /knowledge/clients.md)
- Fit criteria produce fewer than 5 qualified names for 3 days running

METRIC: qualified prospects/day that survive human spot-check (target: 25,
sampled weekly; three bad weeks triggers a charter review)`,
            caption: 'A working charter: one page, readable by the agent on every run and by you when something goes wrong.',
          },
          {
            type: 'text',
            md: "Operators running bigger rosters add two refinements worth stealing on day one. The first splits the charter from the **daily message**. The charter holds the durable rules and gets left alone; each actual task assignment travels as a short message with five fields: the outcome wanted, the sources to use, the constraints, the deliverable format, and the review point. Mixing the two is how charters bloat into unreadable scrolls, the same disease the CLAUDE.md pruning discipline treats in [Claude Code Mastery · CLAUDE.md & the Memory System](lesson:m1-l2).\n\nThe second is a name for the most important line in the boundaries section: the **fence**, the point where work pauses for human approval. Operators draw it around **one-way actions**: sending, spending, publishing, deleting, agreeing to terms. Everything reversible runs free; everything irreversible queues at the fence. The reasoning is blunt and worth quoting: approval does not reverse work already completed. A fence placed after the send button is a receipt, and only a fence placed before it is a control.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Charters are the twelve-box checklist, worn down to daily size',
            md: "The production-node anatomy from [Agents, Harnesses & Loops · Graph Engineering](lesson:m2-l10) asked twelve spec questions per agent. The charter is the operator's compression of the five that change most often: role, scope, boundaries, escalation, metric. Keep charters in version control next to the shared knowledge base, and review the metric section on a schedule; the refinery-agent pattern from the previous lesson (score every run, review every 48 hours) is what charter review looks like at scale.",
          },
        ],
      },
      {
        heading: 'Shared knowledge vs private memory',
        blocks: [
          {
            type: 'text',
            md: "The second convergent pattern, and the one most beginners get backwards: split what the agents know into two stores with different rules.\n\nThe **shared knowledge base** holds the facts every agent needs identically: what the company does and for whom, the ideal customer profile, the brand voice with examples, pricing, current quarter priorities, the client list. One copy, one owner (usually you, via the chief of staff), read by everyone at the start of every run. When your positioning changes, you edit one file and the entire workforce updates at once.\n\nEach agent's **private memory** holds its working state and role learnings: Scout's list of already-researched companies, Quill's notes on which hooks performed, Vault's sender-priority rankings. Nobody else needs this, and pushing it into the shared base buries every agent in every other agent's operational noise, which is the context-rot problem from the foundations module wearing an org chart.\n\nThe failure modes run both directions. Company facts duplicated into six private memories drift the moment one copy updates and five do not, and the agents start contradicting each other about what the business even sells. Task state crammed into the shared base makes every agent's context read like everyone's desk at once. The rule that keeps it straight: **shared truths in one place, working state local**. This is the files-as-substrate doctrine from [Agents, Harnesses & Loops · Agent Memory & State](lesson:m2-l7), promoted from one agent to an organization, and it is exactly how the memory and filesystem split works in the deep-agent anatomy too.",
          },
          {
            type: 'compare',
            left: {
              title: 'Shared knowledge base (one copy)',
              items: [
                'What the company does, for whom, at what price',
                'Ideal customer profile and fit criteria',
                'Brand voice, with real writing samples',
                'Current priorities and the do-not-touch list (clients, competitors)',
              ],
            },
            right: {
              title: 'Per-agent private memory',
              items: [
                'Task state: what this agent already processed',
                'Role learnings: what worked, what flopped',
                'Working files mid-pipeline',
                'Anything no other agent would ever read',
              ],
            },
          },
        ],
      },
      {
        heading: 'Routines: work that starts without you',
        blocks: [
          {
            type: 'text',
            md: "The third pattern separates a workforce from a very organized set of chatbots: **routines**, meaning work that starts from the calendar or from events instead of from you typing.\n\nTwo trigger types cover everything. **Scheduled** routines run on a clock: Ledger compiles the metrics report at 9pm, Scout's research pass starts at 6am so the list is waiting with coffee, Vault sweeps the inbox every two hours. **Event** routines fire on something happening: a new lead in the CRM kicks off qualification, a calendar invite triggers meeting prep, an angry-sentiment reply escalates to you immediately. String them together and the workforce runs a full daily cycle in which your role is reading outputs and making the judgment calls the charters escalated.\n\nOne more operator trick belongs here: **teach by demonstration**. For fiddly multi-step tasks inside web tools, several platforms let you screen-record yourself doing the task once while narrating, and the agent turns the recording into a repeatable procedure. It is skill authoring for people who would never write a skill file, and the output is the same thing: a stored procedure the agent replays. Treat the recording as a draft rather than a finished skill, though. Operators harden it until it states six things: when to use it, the required inputs and access, the exact sequence, how to validate the result, what to return, and what requires approval. That is the same discipline as [Claude Code Mastery · Skill Authoring Doctrine](lesson:m1-l4), and the approval line is what separates an employee from an incident. Pair it with saved authenticated browser sessions (the agent reuses a logged-in profile rather than asking you to reauthenticate hourly) and whole categories of web-app grunt work become routine-able. What that access model implies for safety gets a hard look next lesson.",
          },
          {
            type: 'text',
            md: "Three roster-hygiene rules round out the operating manual, each one earned by somebody's bloated setup.\n\n**The ownership test decides worker versus method.** Before creating a new agent, ask whether the job has recurring work, its own memory, its own task list, and regular handoffs with other agents. All four present: hire a worker. Anything less: save the procedure as a stored method (a skill, in your vocabulary) that an existing worker runs on demand. The failure this prevents is hiring 20 workers for 20 tasks, most of which recur twice a year; it is Weinstein's specialists argument with a floor under it, because a specialist still has to have a beat worth owning.\n\n**Routing rides on the descriptions.** Give every charter a scope written clearly enough that a coordinator can route by reading it, add one line ('anything outside my scope goes to whoever owns it'), and a goal stated to the group finds its owner without you forwarding anything. The description does the wiring, which is the same trigger-surface craft you practiced writing skill descriptions in [Claude Code Mastery · Skill Authoring Doctrine](lesson:m1-l4).\n\n**A weekly review, with a deletion quota.** Once a week, have each agent evaluate its own runs against its metric and propose one workflow improvement, and delete at least one routine nobody read the output of. Rosters accrete the way config does, and the pruning habit from your CLAUDE.md carries over unchanged.",
          },
          {
            type: 'text',
            md: "The operators running six or more agents add a final pattern set, and every line of it should ring a bell from the harness module, because it is that module's doctrine rediscovered under production pressure.\n\n**Producers never grade their own output.** The agent that found a signal is the worst possible judge of it, so a separate reviewer holds the confirmation rules and can kill the handoff; high-conviction output requires two agents agreeing independently. This is the adversarial-verification pattern from [Agents, Harnesses & Loops · Multi-Agent Patterns](lesson:m2-l5) promoted to an org rule.\n\n**A handoff carries five things**: the artifact, the evidence, the status, the blockers, and the next action. Anything less forces the receiving agent to reconstruct reality from chat history, and that reconstruction is where drift starts. One owner per stage; group channels only where the handoff itself needs witnesses.\n\n**Done must be checkable by something the agent cannot fake**: a file existing at a known path, a field crossing a threshold, a pull request opened. Never trust 'the bot says it ran'. You built this reflex in [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4); here it becomes the difference between a workforce and a fiction.\n\n**Route corrections back into the instructions.** When Scout flags 12 prospects and only 2 are real, say exactly that to Scout so its threshold tightens. Thirty corrections later the roster holds institutional knowledge no single prompt could, which is Medin's system-evolution outer loop wearing an org chart.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The week-one numbers are marketing',
            md: "Operator threads close with dashboards: 214 prospects, 89 outreaches, inbox zero, 11 content pieces in week one. Read those the way you read the graph-engineering bait quotes: the architecture is real, the arithmetic is unaudited. Volume without quality is the oldest trick in growth content; 89 personalized outreaches that read as templated spam damage a brand at scale, and nobody posts their reply rate. Your own workforce gets judged the way the previous lesson taught: a metric per agent, spot-checked by a human, reviewed on a schedule. Steal the org chart, keep your own scoreboard.",
          },
        ],
      },
    ],
    lab: {
      title: 'Charter your first workforce',
      intro:
        "Design the agent org for your own practice on paper, then make one piece of it real with tools you already have. The paper design is next lesson's shopping list; the real routine proves the pattern without waiting for any product.",
      steps: [
        'Take the five digital-employee job descriptions from the previous lesson\'s lab (or write them now): five specialists for your own practice, each with one narrow job.',
        'Draw the org chart: you, a chief-of-staff agent, and the five specialists. Mark which arrows are daily reports and which are escalations.',
        'Write one full charter (role, scope, boundaries, escalation, metric) for the specialist you would hire first. One page, concrete enough that a stranger could grade the agent with it.',
        'Split the knowledge: create a knowledge/ folder with 3 shared files (what-we-do.md, icp.md or audience.md, voice.md with real writing samples). Note in each charter what stays in that agent\'s private memory instead.',
        'Make one routine real with Claude: set up one scheduled task (a morning brief, a nightly log summary, a weekly review of some folder) that reads your knowledge files and produces its output on a schedule without you prompting it.',
        'Run it for two days, then grade it against the charter metric you wrote. Amend the charter where reality disagreed with the paper.',
      ],
      checklist: [
        'Org chart exists: one chief of staff, five specialists, report and escalation arrows marked',
        'One complete charter written, with all five sections concrete',
        'knowledge/ folder exists with three shared files, and the shared-vs-private split is noted per agent',
        'One scheduled routine actually ran without being prompted, at least twice',
        'The charter was amended at least once from observed behavior',
      ],
    },
    checkQuiz: [
      {
        q: 'Your workforce\'s Quill agent starts contradicting Scout about which industries the company targets. The most likely cause?',
        options: [
          'The agents are running on different model versions',
          'Target-industry facts were duplicated into private memories instead of living in one shared knowledge file, and the copies drifted when one got updated',
          'Quill needs a larger context window',
          'Agent workforces cannot share factual knowledge',
        ],
        answer: 1,
        explain:
          'Contradiction between agents about company-level facts is the signature symptom of the duplicated-knowledge failure. The fix is structural: move the fact to the shared knowledge base, delete the private copies, and make every charter point at the shared file. One copy, one owner, no drift.',
      },
      {
        q: 'Which task should a charter route to ESCALATE rather than letting the agent handle it?',
        options: [
          'Formatting the nightly metrics report',
          'A prospect on the research list turns out to be a former client with a complicated history',
          'Deduplicating the morning prospect list',
          'Retrying a web page that failed to load',
        ],
        answer: 1,
        explain:
          'The former-client case needs relationship context and judgment, which lands it in the no-go zones from the transformation playbook: relationships stay human. The other three are exactly the routine, low-judgment work the workforce exists to absorb. Charters exist to make this routing explicit instead of hoping the agent guesses right.',
      },
      {
        q: 'Why does the chief-of-staff agent deliver ONE daily report instead of each specialist reporting to you directly?',
        options: [
          'Specialist agents produce reports in incompatible formats',
          'Because reading six reports and reconciling them IS coordination work, and the workforce exists to take coordination off your plate; the chief of staff is the reduce step',
          'Direct reports would exceed platform rate limits',
          'It hides specialist mistakes from the human',
        ],
        answer: 1,
        explain:
          'Six direct reports quietly reinstall you as the project manager of your own workforce. The chief of staff consolidates, flags what needs judgment, and files the rest, which is the reduce stage of the diamond running as a daily rhythm. You read one artifact and spend attention only where the charters escalated.',
      },
      {
        q: 'The teach-by-demonstration pattern is best understood as:',
        options: [
          'Fine-tuning the underlying model on your screen recordings',
          'Skill authoring by showing instead of writing: one narrated walkthrough becomes a stored, repeatable procedure the agent replays, like a skill file for people who will never write markdown',
          'A way to give agents permissions without credentials',
          'A replacement for charters and metrics',
        ],
        answer: 1,
        explain:
          'The recording becomes a procedure, which is exactly what a skill file is: a stored playbook loaded when the task comes up. Nothing about the model changes. The pattern matters because it lets non-engineers (your clients, their staff) encode their own procedures, which is how workforce setups escape the demo phase inside real businesses.',
      },
    ],
    resources: [
      { label: 'An 8-agent workforce, documented by its operator', url: 'https://x.com/ridark_eth/status/2090138832511324179', kind: 'thread' },
      { label: 'A week of agent-workforce lessons in 10 minutes (Nate Herk)', url: 'https://x.com/nateherk/status/2089917020087210160', kind: 'thread' },
      { label: 'LangChain - Managed Deep Agents (charter-shaped anatomy, productized)', url: 'https://docs.langchain.com/langsmith/python/managed-deep-agents-overview', kind: 'docs' },
      { label: 'Anthropic - Building Effective Agents (orchestrator-workers)', url: 'https://www.anthropic.com/engineering/building-effective-agents', kind: 'article' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m8-l2: Hands-On: Grok Bot
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm8-l2',
    title: 'Hands-On: Grok Bot',
    day: 22,
    minutes: 45,
    xp: 100,
    objectives: [
      'Describe what Grok Bot is, what it costs, and where it sits relative to Claude Code on the harness map',
      'Walk the setup path: context interview, templates, charters, connections, and the first routine',
      'Explain what "god mode" login access actually grants, and apply hard rules for what never gets it',
      'Name the beta limitations and the risks (UI drift, prompt injection, spam-at-scale) an operator must design around',
      'Decide, with reasons, whether the subscription earns its keep for a given practice or stays on the watchlist',
    ],
    skipQuiz: [
      {
        q: 'What is Grok Bot, in one accurate sentence?',
        options: [
          'A local model that runs on a Mac mini without internet',
          'xAI\'s cloud agent-workforce product: persistent agents that run around the clock, sign into web apps with real credentials, and execute multi-tool workflows on schedules and triggers',
          'A Claude Code plugin for social media posting',
          'An open-source framework you self-host',
        ],
        answer: 1,
        explain:
          'Grok Bot is the productized version of everything the previous lesson designed on paper: hosted agents with charters, shared knowledge, routines, and (the controversial part) authenticated access to the same web apps you use. It runs in xAI\'s cloud, priced as a monthly subscription, and in mid-2026 it is explicitly a beta.',
      },
      {
        q: 'What does the "god mode" framing in the hype threads actually refer to?',
        options: [
          'An unlocked model with no safety filters',
          'Granting the agent real login access to your apps (email, CRM, calendar) so it executes full workflows end to end, instead of drafting things for you to send',
          'Free unlimited usage during the beta',
          'Admin rights over other users\' bots',
        ],
        answer: 1,
        explain:
          'The capability jump the threads celebrate is authenticated action: the bot signs in as you and completes the workflow (send the email, update the CRM, book the call) rather than handing you a draft. That capability is where the payoff lives, and precisely where the risk lives, which is why the boundaries section of this lesson exists.',
      },
      {
        q: 'Grok Bot pricing in mid-2026 runs roughly:',
        options: [
          '$20/month flat, matching frontier chat plans',
          'Free during beta',
          '$120-300/month depending on tier, which is the number a value calculation has to beat',
          '$0.10 per completed task',
        ],
        answer: 2,
        explain:
          'The tiers span roughly $120 to $300 a month, several times a chat subscription. The comparison that makes it look cheap is a part-time human assistant; the comparison that makes it look expensive is your existing Claude setup plus scheduled tasks. The honest evaluation prices YOUR delegable hours, which is what the lab does.',
      },
      {
        q: 'Which beta limitation do operators report most consistently?',
        options: [
          'The bots cannot read email at all',
          'Workflows that drive web apps break when the app\'s interface changes, and sensitive task categories are blocked or gated, so flows need monitoring rather than fire-and-forget trust',
          'Only one bot can run at a time',
          'It only works in the US',
        ],
        answer: 1,
        explain:
          'A bot that operates a web app the way a human does inherits the fragility of that approach: a redesigned button breaks the routine. Add the platform\'s own gates around sensitive actions and the practical posture becomes: automate, then monitor, and expect maintenance. Beta means the failure modes are still being discovered, some by you.',
      },
      {
        q: 'The correct FIRST question before adopting Grok Bot (or any agent-workforce product) for your practice:',
        options: [
          'Which of the six templates looks coolest?',
          'Do I have documented, high-volume back-stage work with clear success criteria that I could hand a competent assistant next week? Because without that, the product has nothing to run',
          'How fast can I connect every account I own?',
          'What are competitors paying for it?',
        ],
        answer: 1,
        explain:
          'The onion rule from the transformation playbook applies to your own practice: autonomy sits on documented process and clean foundations. A subscription cannot delegate work you have never defined. The workforce design from the previous lesson (charters, knowledge base, one metric per agent) is the prerequisite; the product is just where it runs.',
      },
    ],
    sections: [
      {
        heading: 'What it is, and where it sits',
        blocks: [
          {
            type: 'text',
            md: "Four of the loudest threads of August 2026 are about one product, so let's look at it squarely. **Grok Bot** is [xAI](https://x.ai)'s agent-workforce offering: persistent agents that live in xAI's cloud, run around the clock, connect to your actual tools, and execute multi-step workflows without you in the loop. Pricing runs roughly **$120 to $300 a month** by tier, and the whole thing carries a **beta** label that should stay in the front of your mind for everything that follows.\n\nPlace it on the harness map you have been building all course. Claude Code is an interactive harness: you drive, it works, sessions end. A Grok Bot agent is closer to the managed deep agent anatomy from [Agents, Harnesses & Loops · Graph Engineering](lesson:m2-l10): instructions, skills, tools, memory, schedules, and channels, hosted and always on. Nothing conceptually new is inside the box. What the product adds is packaging (templates, a consumer-grade setup flow) and one genuinely spicy capability we'll treat separately: authenticated access to your web apps.\n\nA disclosure before the tour: this lesson is pinned to August 2026 reporting from operators, because the product is moving fast and beta products change under you. Treat every specific below the way the half-life discipline taught you to treat model rankings: verify against the vendor's current docs before acting, and expect this page of the course to age faster than any other.",
          },
          {
            type: 'table',
            headers: ['', 'Claude Code (your daily harness)', 'Grok Bot (agent workforce)'],
            rows: [
              ['Interaction', 'You drive sessions interactively', 'Agents run standing routines; you read reports'],
              ['Lifespan', 'A session, plus scheduled tasks', 'Always on, around the clock'],
              ['Strength', 'Deep work with you in the loop: code, analysis, writing', 'Volume ops without you: triage, research, outreach, logging'],
              ['Access model', 'Your filesystem + MCP tools you configure', 'Signs into web apps with real credentials; saved browser profiles'],
              ['Trust posture', 'You watch it work', 'You audit its outputs; monitoring is the job'],
              ['Cost', 'Plan you already pay for', '$120-300/month on top'],
            ],
          },
        ],
      },
      {
        heading: 'The setup path, in order',
        blocks: [
          {
            type: 'text',
            md: "Operators converge on a setup sequence, and its logic will feel familiar because you have met every step wearing different clothes.\n\n**First, the context interview.** Before configuring anything, run a structured interview where the agent grills YOU: what the business does, for whom, what good output looks like, what is off limits. One operator packaged this as a 'Grill Me' skill, and it is the interview pattern from [Mental Models · Prompting That Actually Works](lesson:m0-l3) pointed at your business instead of a feature. The transcript becomes the seed of the shared knowledge base, which the platform then maintains.\n\n**Second, templates, then charters, one hire at a time.** The product ships six starter roles: a Chief of Staff, Scout (research), Quill (writing), Forge (building and automation), Guide (support and answers), and Ledger (numbers). The field-tested sequencing rule: create ONE agent first, the chief of staff, and reverse-prompt the rest of the team into existence. Brain-dump your work into it (projects, tools, recurring chores, deadlines), then ask it to review your connections and propose the three most useful specialists and automations. Approve from its proposals rather than inventing a roster cold. Templates get you moving in an afternoon; they are also generic by definition, the same trap as generic subagent files in the prompt-to-PR pipeline. The fix is the charter discipline from the previous lesson: rewrite each template's role, scope, boundaries, escalation, and metric around your practice before trusting it with anything.\n\n**Third, connections, narrowest first.** Wire the chief of staff to one channel you actually read. Connect tools role by role, granting each agent only what its charter's scope needs. Connector hubs like [Composio](https://composio.dev) extend the reachable app list through APIs rather than screen-driving, which is worth preferring whenever both paths exist: API calls survive redesigns that break clicked-through workflows. Several operators also log every completed agent task into a project tracker like [ClickUp](https://clickup.com), which sounds bureaucratic until the first time you need to audit what your workforce actually did last Tuesday.\n\n**Fourth, climb the ladder, and never skip a rung.** The field manual's core operating rule gives the adoption curve a fixed shape: one-time task, then corrected task, then saved skill, then tested routine, then team. Run the job manually first and fix what it misses; only a method that survived contact gets frozen into a skill and put on a schedule. Every horror story you have read started with someone scheduling attempt number one. Two warnings attach. A test run performs REAL work (it clicks real buttons, changes real files, and spends real quota; 'test' is not a sandbox), so test with safe inputs and keep write actions behind the fence (the approval point from the previous lesson's charters). And when a routine does earn its schedule, write the boring policies into it up front: owner, schedule, timezone, input source, output destination, the approval boundary, what happens on missing data (report the failure rather than quietly reusing stale data), and retries that cannot double-send.\n\n**Fifth, and optionally: swap the engine.** The deepest cut in the operator guides proves a course through-line in a consumer product: the roster's model is swappable. The app hides its model picker behind an experiment flag (with dozens of engines wired up internally, and vendor docs that contradict themselves about it, which is beta in one sentence), but a few configuration lines on the roster's shared computer put a different model behind every worker. The fashionable choice in August 2026 is [Kimi K3](https://www.moonshot.ai), Moonshot AI's frontier-adjacent model, at roughly $3 per million input tokens ($0.30 cached) and $15 per million out, with a claimed context window around a million tokens; a status command confirms which engine is live. Whether that particular swap suits you matters less than what it demonstrates: the workforce is a harness, the intelligence under it is a config line, and every worker you hire afterward runs on whatever you put there. The harness-beats-model argument from [Agents, Harnesses & Loops · What Is a Harness?](lesson:m2-l1), now available as a settings tweak.",
          },
        ],
      },
      {
        heading: 'Where the roster comes from',
        blocks: [
          {
            type: 'text',
            md: "One thing the setup path leaves open: where do the charters and routines actually come from? Writing every teammate from a blank page is slow, and by late August 2026 the community had produced the alternative. A curated list carrying 165 entries, a use-case gallery indexing what people actually attempt, a prompt directory with 300-plus copy-paste routines, and a stack of masterclass writeups. The popular advice is to hand your agent those links, let it read the workflow catalog, and ask it to fold the good parts into your roster.\n\nThat habit is worth having and worth doing carefully, because the fetch-then-write-config move points untrusted text straight at the credentialed shared computer described above. [Bonus: Field Notes · Borrowed Setups](lesson:m10-l3) takes the whole pattern apart: the six-step harvest loop, the clean-room rule that keeps the fetching away from your logins, and the keep-or-kill bar that stops your setup from bloating into a museum of other people's ideas.",
          },
        ],
      },
      {
        heading: 'God mode, and the lines you do not cross',
        blocks: [
          {
            type: 'text',
            md: "The capability the hype threads call **god mode** is plain to describe: the agent gets real login access to your apps and completes workflows end to end. Where a chat assistant drafts an email for you to send, a logged-in agent sends it, updates the CRM, books the follow-up, and files the thread. Show it a task once (the teach-by-demonstration pattern), save the authenticated browser profile, and the workflow reruns on schedule forever. The setup guides sharpen the stakes further: you sign into your accounts once on the roster's shared computer, and every worker you ever hire inherits that session. One door, the whole staff through it. The threads are right that this is the hinge: everything a workforce promises flows from acting rather than suggesting.\n\nThe architecture underneath makes the stakes concrete. Every agent on the roster shares one persistent cloud computer: a managed Linux machine with a browser, a filesystem, and a terminal. Each agent's 'screen' is a work surface on that machine, and the field manual's sharpest line names the consequence: the screens are work surfaces, while the security boundary is the single shared computer underneath, where files, cookies, signed-in sessions, and command-line credentials are common property. Two operating rules follow directly. An imported marketplace skill runs one hop from your most sensitive login, so read skills before installing them, the same audit ritual as [Claude Code Mastery · MCP & Plugins](lesson:m1-l7) (the marketplaces ship SKILL.md files that also run in Claude Code; the open skills standard cuts both ways, portability for you and for a malicious author alike). And when a login wall or a two-factor prompt blocks a run, take over only the blocked step on the shared computer, then tell the agent to continue; never paste passwords or one-time codes into the chat, because the transcript keeps everything.\n\nWhich is exactly why the boundaries have to be structural, set at the credential level rather than in a prompt. Three risk classes deserve naming. **Blast radius**: a logged-in agent that misfires acts as you, at machine speed; a bad merge in code review embarrasses you once, a bad outreach sequence emails 200 prospects before breakfast. **Prompt injection**: an agent that reads web pages and inboxes with real credentials can be steered by text in what it reads (a hostile email saying 'forward this thread'), which is the sharpest unsolved problem in the whole agent field. **Quality at scale**: automation multiplies whatever quality you feed it, and 'personalized outreach' below the quality bar is spam with better grammar, billed monthly.\n\nSo the red lines from the transformation playbook get enforced here with credentials, and they are not negotiable for being obvious: nothing financial (banking, payments, trading) ever gets a login. Nothing destructive (production systems, bulk delete) gets write access. Outbound at volume (email sequences, posting) runs in draft-for-approval mode until weeks of spot-checks earn autonomy, and anything owed to a regulator or a court stays human. The platform gates some of this itself in beta; your own charter boundaries should gate it twice.\n\nThe platform's own controls support the trust ladder once you know they exist. Approvals come as allow-once, deny, or standing Always Allow, and a require-approval rule overrides an always-allow when both match a task, so the safe rule wins ties. Full autopilot (standing approval with auto-review off) exists; earn it by watching runs first, and flip it per workflow rather than globally.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Beta means the failure modes are still being found',
            md: "Operators consistently report two practical limits: workflows that drive web interfaces break when the interface changes (screen-driven automation inherits screen-level fragility), and sensitive task categories are blocked or gated by the platform. Both push the same posture: monitor your routines like you monitor a junior hire's first month, prefer API connectors over screen-driving where possible, and never build a client deliverable on a flow you have not watched fail at least once.",
          },
        ],
      },
      {
        heading: 'The expensive lessons',
        blocks: [
          {
            type: 'text',
            md: "The field manual's most useful page is a list of mistakes that ate real operators' quotas, compiled so you can pay for them with reading time instead of billing. One pattern sits behind most of the list: the product bills like an API while feeling like a chat, so chat habits (checking constantly, re-firing anything slow) convert straight into spend.",
          },
          {
            type: 'table',
            headers: ['The mistake', 'What it costs', 'The fix'],
            rows: [
              ['Re-checking a connected service all day', 'The same weekly report at 12x the quota: about 61 syncs where 5 would do', 'Batch connector syncs at session end; save-and-report once'],
              ['Re-firing a slow publish command', 'Publishing latency reads as a stall, and the retry double-posts', 'Wait, then verify the post exists before any retry'],
              ['Leaving results in temp locations', 'The shared computer rebuilds on updates; only /workspace files, browser state, and sign-ins survive', 'Durable results go to /workspace or into the conversation'],
              ['Pointing agents at localhost', 'The cloud machine cannot see your laptop, so local MCP servers are unreachable', 'Host custom connectors as HTTP endpoints; connect machines deliberately'],
              ['Ignoring the platform limits', '50 agents per account, 50 routines each, only the last 20 runs kept, and routine deletion has no undo', 'Log runs externally (the project-tracker habit) and prune on purpose'],
              ['Burning the trial like a demo', 'Honest multi-agent testing consumed a 7-day trial in about 2 days', 'Plan the first session like it costs money, because it does'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The whole adoption curve, in one evening',
            md: "The manual's closing advice compresses everything this lesson and the last one taught: give one agent one boring job tonight. Run it three times, fix what it misses, freeze it into a skill, schedule it. If you still open its report in a week, keep it and add the next job. That is the ladder, the charter, and the verdict math in a single habit.",
          },
        ],
      },
      {
        heading: 'The verdict math',
        blocks: [
          {
            type: 'text',
            md: "Does the subscription earn its keep? Run the same honest arithmetic you ran on the Mac-mini pitch in [Local Models · The Hardware Ladder & the Install Business](lesson:m4-l4), because the shape of the decision is identical: a seductive monthly number versus your actual workload.\n\nPrice your delegable hours first. List the back-stage work you would hand a competent part-time assistant, estimate the weekly hours, multiply by what your time bills at. A fractional CTO with six genuinely delegable hours a week clears the $300 tier several times over, IF the workforce actually absorbs those hours at acceptable quality, which is what the first month has to prove with the ClickUp log and the charter metrics rather than with vibes. Someone whose back-stage runs two hours a week of miscellaneous odds and ends will lose money on any tier and should stay with scheduled Claude tasks, which already cover the morning-brief class of routine for a plan they pay for anyway.\n\nAnd keep the through-line straight, because it outlives this product: the patterns are the durable asset, the vendor is an implementation detail. Charters, shared knowledge, routines, escalation rules, one metric per agent: those transfer to whatever platform wins, including one assembled from Claude Code parts. The feature-validation heuristic from the next lesson applies to the whole category: when multiple major labs ship native agent-workforce products, the primitive is durable even if any single product is not. You are learning the org design either way; the subscription is just one place to run it.",
          },
          {
            type: 'compare',
            left: {
              title: 'Subscribe (or trial seriously) when',
              items: [
                'You have 5+ documented, delegable back-stage hours a week with clear success criteria',
                'The work is volume ops: triage, research, outreach prep, logging',
                'You will actually monitor outputs weekly against charter metrics',
                'You accept beta breakage as part of the deal',
              ],
            },
            right: {
              title: 'Hold off when',
              items: [
                'Your back-stage work is undocumented (fix that first; nothing to run)',
                'Your bottleneck is deep reasoning or hands-on building, which stays in Claude Code',
                'Scheduled Claude tasks already cover your routine layer for $0 extra',
                'You would be granting logins you cannot afford to have misused',
              ],
            },
          },
        ],
      },
    ],
    lab: {
      title: 'Trial it, or shadow it',
      intro:
        "Two paths, same deliverable: a verdict with numbers. Path A trials the real product. Path B (no purchase) shadows it: run the same evaluation using your workforce design and Claude, and price what the subscription would have to beat.",
      steps: [
        'Both paths: list your delegable back-stage hours. Five tasks, hours per week each, your billable rate. Compute the monthly value of full delegation. This number is the bar.',
        'Both paths: pick the ONE agent from your workforce design (previous lab) with the cleanest math, and finalize its charter.',
        'Path A (trial): set it up. Run the context interview, customize the template with your charter, connect the minimum tools, start ONE scheduled routine in draft-for-approval mode. Log every run and its quality for a week.',
        'Path B (shadow): implement the same routine with what you have: a scheduled Claude task reading your knowledge/ folder, producing the same deliverable on the same schedule. Log every run and its quality for a week.',
        'Both paths: grade the week against the charter metric. Count: runs completed, outputs you actually used, outputs you had to fix, and minutes of monitoring spent.',
        'Write the verdict: does the $120-300/month tier beat your bar, beat the shadow version, and survive the boundary rules? Subscribe, keep shadowing, or shelve with a re-check date. One paragraph, with the numbers in it.',
      ],
      checklist: [
        'Delegable-hours math exists: tasks, hours, rate, monthly value',
        'One charter finalized for the first-hire agent',
        'One routine ran on a schedule for a week (product or shadow), in draft/approval mode where outbound',
        'Run log exists: completed, used, fixed, minutes monitored',
        'Written verdict with numbers, a decision, and a re-check date',
      ],
    },
    checkQuiz: [
      {
        q: 'Why should outbound routines (email sequences, posting) start in draft-for-approval mode even when the platform allows full autonomy?',
        options: [
          'Draft mode is cheaper per token',
          'Because outbound at machine speed multiplies quality AND mistakes: below-bar personalization is spam with your name on it, so autonomy gets earned through weeks of approved drafts, the same trust ladder you would run with a new hire',
          'Approval mode trains the underlying model faster',
          'Platforms legally require it',
        ],
        answer: 1,
        explain:
          'The blast-radius rule: an agent acting as you, at volume, puts your reputation on every send. The trust ladder mirrors onboarding a human assistant: drafts reviewed, then spot-checked, then autonomous within charter boundaries. Skipping the ladder because the demo looked clean is how 200 bad emails go out before breakfast.',
      },
      {
        q: 'Why does prompt injection matter MORE for a logged-in workforce agent than for your Claude Code sessions?',
        options: [
          'It does not; the risk is identical everywhere',
          'A workforce agent reads untrusted text (inboxes, web pages) unsupervised, while holding credentials that let it act as you; hostile instructions in what it reads can steer real actions with nobody watching',
          'xAI models are uniquely vulnerable to injection',
          'Claude Code is immune to prompt injection',
        ],
        answer: 1,
        explain:
          'The dangerous combination is untrusted input, real credentials, and no human in the loop, all at once. Your interactive sessions have you watching; the workforce by design does not. Which is why boundaries live at the credential level (what it CAN touch) rather than only in instructions (what it is ASKED to touch): instructions are exactly what injection overwrites.',
      },
      {
        q: 'When both exist, why prefer an API connector (via a hub like Composio) over teaching the agent to drive the web interface?',
        options: [
          'APIs are always free while interfaces cost tokens',
          'API integrations survive interface redesigns and fail loudly with error codes, while screen-driven flows break silently the day a button moves, which is the top reported beta failure',
          'Screen-driving is banned by most terms of service',
          'APIs let the agent skip authentication',
        ],
        answer: 1,
        explain:
          'Screen-driving inherits the fragility of screens: the workflow encodes where things WERE. An API contract is versioned and errors are explicit, so failures surface in logs instead of as quietly wrong output. Teach-by-demonstration stays valuable for the long tail of tools without connectors; use it as the fallback, never the default.',
      },
      {
        q: 'A colleague asks whether to spend $300/month on this. Per the lesson, your first question back is:',
        options: [
          '"Which model does it run under the hood?"',
          '"What are your documented, delegable back-stage hours worth per month, and would this beat a scheduled-Claude shadow version of the same routines?"',
          '"Have you seen the week-one numbers people are posting?"',
          '"Do you already pay for a frontier chat plan?"',
        ],
        answer: 1,
        explain:
          'The evaluation is a bar to clear, and the bar is personal: the priced value of hours they can genuinely hand off, compared against both the subscription and the near-free shadow alternative they can run today. The posted week-one dashboards belong in the marketing pile; their own run log from a one-agent trial is the only number that decides anything.',
      },
    ],
    resources: [
      { label: 'xAI: current product state (verify before acting; beta moves fast)', url: 'https://x.ai', kind: 'docs' },
      { label: 'How to build a one-person company on an agent workforce (Rahul)', url: 'https://x.com/sairahul1/status/2089995692874068433', kind: 'thread' },
      { label: 'The god-mode setup guide (read with this lesson\'s boundary rules)', url: 'https://x.com/0xmiraqle/status/2087674398304059722', kind: 'thread' },
      { label: 'Composio: API connectors instead of screen-driving', url: 'https://composio.dev', kind: 'docs' },
      { label: 'A week of operator lessons (Nate Herk)', url: 'https://x.com/nateherk/status/2089917020087210160', kind: 'thread' },
      { label: 'The A-Z roster setup guide, incl. the Kimi K3 engine swap (Argona)', url: 'https://x.com/Argona0x/status/2091898304900571501', kind: 'thread' },
      { label: 'The Grok Bot Field Manual (3 pages: setup order, swarm patterns, quota lessons)', url: 'https://x.com/Argona0x/status/2092273165053395346', kind: 'thread' },
      { label: 'Official Grok Bot docs (the skills, routines, and approvals pages)', url: 'https://docs.x.ai/grok-bot', kind: 'docs' },
      { label: 'Building a "lego of teammates" by harvesting other operators\' setups (Av1dlive)', url: 'https://x.com/av1dlive/status/2092923553557746047', kind: 'thread' },
      { label: 'awesome-grok-bot: the community index (tutorials, field cases, failure modes)', url: 'https://github.com/RongleCat/awesome-grok-bot', kind: 'repo' },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // m8-l3: Capstone Launch
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm8-l3',
    title: 'Capstone Launch',
    day: 22,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can state the five big ideas that run through the whole course and point to the modules that taught each one',
      'Can pick a capstone track based on what you will actually keep doing after the course ends, rather than what sounds impressive',
      'Can run a lightweight personal system for staying current in a field where knowledge goes stale in about six months',
    ],
    skipQuiz: [
      {
        q: 'Which of these is NOT one of the five through-lines of this course?',
        options: [
          'The harness matters more than the model',
          'Verification is the quality lever',
          'Bigger models beat better scaffolding, so always buy the frontier',
          'Files are the agent substrate',
        ],
        answer: 2,
        explain: 'That option gets the course argument backwards. In the study the course leans on, harness improvements moved 116 of 126 setups without touching the model at all. Scaffolding, loops, verification, files, and context engineering are the levers you actually control.',
      },
      {
        q: 'The feature-validation heuristic for cutting through AI hype says a capability is real when...',
        options: [
          'It has more than 10k GitHub stars',
          'Both OpenAI and Anthropic have shipped it natively',
          'Three or more influencer threads cover it in the same week',
          'It appears in a peer-reviewed paper',
        ],
        answer: 1,
        explain: 'When both major labs ship a capability natively, that is the strongest cheap signal it is a durable primitive rather than a demo. Skills, MCP (the Model Context Protocol), and prompt caching all passed this test.',
      },
      {
        q: 'What is the recommended basis for choosing your capstone track?',
        options: [
          'Whichever track produces the best portfolio piece',
          'The hardest one, for maximum learning per hour',
          'What you will actually sustain after the course ends',
          'Whichever most resembles your day job',
        ],
        answer: 2,
        explain: 'A capstone you abandon in week two teaches less than a modest one you run for months. Sustained contact with the tools is where expertise actually forms, so pick for durability over impressiveness.',
      },
      {
        q: 'For staying current, the course ranks one information source clearly above the rest. Which?',
        options: [
          'Influencer threads, because they surface things fastest',
          'Official changelogs and release notes from the labs',
          'Conference talks, for depth',
          'Reddit and Hacker News comment sections',
        ],
        answer: 1,
        explain: 'Official changelogs are dense, accurate, and first. Influencer threads are lossy retellings of those same changelogs, published days later with hype stirred in. Go straight to the source and skip the middleman.',
      },
      {
        q: '"Files are the agent substrate" claims markdown folders beat databases for agent state because...',
        options: [
          'Files are faster to query than any database',
          'Files are legible and editable by both humans and models, with git for versioning and diffing',
          'Databases cannot store markdown reliably',
          'Vector stores hallucinate; files never do',
        ],
        answer: 1,
        explain: 'The substrate argument comes down to legibility: CLAUDE.md, SKILL.md, specs, and memory files can be read, diffed, and fixed by you and by the model alike. A database hides state behind a query layer where neither of you can casually inspect or correct it.',
      },
    ],
    sections: [
      {
        heading: 'The five through-lines',
        blocks: [
          {
            type: 'text',
            md: 'Thirty days of material compresses into five ideas. Every artifact you built along the way, from CLAUDE.md files to skills, hooks, subagents, RAG pipelines, and cost models, was one of these five wearing different clothes:\n\n- **The harness beats the model.** The same model jumped from 31% to 75% on real tasks when the scaffolding around it improved. The loop, tools, and context wrapped around a model move results more than swapping the model does.\n- **Loops beat prompts.** One perfect prompt loses to a cycle: prompt, act, check the result against real criteria, then re-prompt with what you learned.\n- **Verification is the quality lever.** Give the loop a binary pass/fail signal (a test suite, a build, a screenshot check) and output quality improves 2-3x, more than any prompt polish delivers.\n- **Files are the agent substrate.** Plain markdown files hold agent state best, because both you and the model can read them, diff them, and fix them.\n- **Context engineering runs through everything.** Every technique in the course reduces to one question: what is the smallest set of high-signal tokens I can put in front of the model right now?',
          },
          {
            type: 'diagram',
            caption: 'The course in one picture: five through-lines as the stack every module was secretly teaching.',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b" rx="8"/><text x="290" y="32" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE STACK YOU BUILT</text><rect x="60" y="320" width="460" height="44" fill="#27272a" stroke="#52525b" rx="8"/><text x="290" y="341" fill="#e4e4e7" font-size="14" text-anchor="middle">MODEL: raw capability</text><text x="290" y="357" fill="#a1a1aa" font-size="11" text-anchor="middle">Mental Models foundations - Local Models - Fine-Tuning</text><rect x="60" y="252" width="460" height="56" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="290" y="275" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. HARNESS &gt; MODEL</text><text x="290" y="295" fill="#a1a1aa" font-size="11" text-anchor="middle">Claude Code Mastery - tools, memory, skills, hooks, subagents</text><rect x="60" y="184" width="460" height="56" fill="#27272a" stroke="#a78bfa" rx="8"/><text x="290" y="207" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">2. LOOPS &gt; PROMPTS</text><text x="290" y="227" fill="#a1a1aa" font-size="11" text-anchor="middle">Agents, Harnesses &amp; Loops - plan, act, check, re-prompt, stop conditions</text><rect x="60" y="116" width="460" height="56" fill="#27272a" stroke="#34d399" rx="8"/><text x="290" y="139" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">3. VERIFICATION = QUALITY LEVER</text><text x="290" y="159" fill="#a1a1aa" font-size="11" text-anchor="middle">tests, builds, screenshots, stop hooks - binary pass/fail gates</text><rect x="60" y="52" width="460" height="52" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="290" y="74" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">SHIPPED WORK</text><text x="290" y="93" fill="#a1a1aa" font-size="11" text-anchor="middle">AI-Assisted Design + RAG - Token Economics, SDLC, capstone</text><line x1="290" y1="320" x2="290" y2="308" stroke="#52525b" stroke-width="2"/><line x1="290" y1="252" x2="290" y2="240" stroke="#52525b" stroke-width="2"/><line x1="290" y1="184" x2="290" y2="172" stroke="#52525b" stroke-width="2"/><line x1="290" y1="116" x2="290" y2="104" stroke="#52525b" stroke-width="2"/><rect x="544" y="52" width="126" height="150" fill="#27272a" stroke="#f472b6" rx="8"/><text x="607" y="76" fill="#f472b6" font-size="13" text-anchor="middle" font-weight="bold">4. FILES</text><text x="607" y="96" fill="#a1a1aa" font-size="10" text-anchor="middle">CLAUDE.md</text><text x="607" y="112" fill="#a1a1aa" font-size="10" text-anchor="middle">SKILL.md - spec.md</text><text x="607" y="128" fill="#a1a1aa" font-size="10" text-anchor="middle">memory.md</text><text x="607" y="144" fill="#a1a1aa" font-size="10" text-anchor="middle">DESIGN.md</text><text x="607" y="168" fill="#a1a1aa" font-size="10" text-anchor="middle">state the loop</text><text x="607" y="182" fill="#a1a1aa" font-size="10" text-anchor="middle">can read and edit</text><rect x="544" y="214" width="126" height="150" fill="#27272a" stroke="#e4e4e7" rx="8"/><text x="607" y="238" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">5. CONTEXT</text><text x="607" y="254" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">ENGINEERING</text><text x="607" y="278" fill="#a1a1aa" font-size="10" text-anchor="middle">attention budget</text><text x="607" y="294" fill="#a1a1aa" font-size="10" text-anchor="middle">JIT retrieval</text><text x="607" y="310" fill="#a1a1aa" font-size="10" text-anchor="middle">compaction - notes</text><text x="607" y="326" fill="#a1a1aa" font-size="10" text-anchor="middle">subagent isolation</text><text x="607" y="350" fill="#a1a1aa" font-size="10" text-anchor="middle">spans every layer</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Through-line', 'In plain English', 'Where you built it'],
            rows: [
              [
                'Harness beats model',
                'The scaffolding around a model moves results more than swapping the model',
                'Claude Code Mastery (tools, memory, skills, hooks, subagents), formalized in Agents, Harnesses & Loops',
              ],
              [
                'Loops beat prompts',
                'Prompt, act, check, re-prompt wins over one perfect prompt',
                'Agents, Harnesses & Loops: loop engineering and stop conditions',
              ],
              [
                'Verification is the lever',
                'A binary pass/fail signal inside the loop is worth 2-3x on quality',
                'Stop hooks in Agents, Harnesses & Loops, eval sets in Fine-Tuning, every lab checklist in the course',
              ],
              [
                'Files are the substrate',
                'Markdown state that humans and models can both read and fix',
                'CLAUDE.md, SKILL.md, SPEC.md, and memory files across every module',
              ],
              [
                'Context engineering',
                'The smallest set of high-signal tokens in front of the model, always',
                'Named in Mental Models, then practiced in everything that followed',
              ],
            ],
          },
        ],
      },
      {
        heading: 'Running the capstone',
        blocks: [
          {
            type: 'text',
            md: 'Three capstone tracks are live on the **Capstone page** of this app. Resist the urge to pick the most impressive-sounding one. Expertise forms through sustained contact with the tools, so the right track is the one you\'ll still be running in October, even if it looks modest next to the others.',
          },
          {
            type: 'table',
            headers: ['Track', 'You build', 'Best if'],
            rows: [
              [
                'Personal AI OS',
                'A file-based life and work system: a vault with a CLAUDE.md hierarchy, skills as standard operating procedures, memory files, and scheduled agents',
                'You want daily compounding value, and your notes and personal ops are the honest bottleneck',
              ],
              [
                'Build Your Own Harness',
                'A minimal agent harness from scratch: the loop, tool execution, context management, verification, and spend tracking',
                'You learn by building internals, and you want harness design to stop being magic',
              ],
              [
                'Ship an App AI-Natively',
                'A real product built end to end under your doctrine: spec-driven, agent-built, agent-reviewed, CI-gated',
                'You need a shipped artifact, and you want the full AI-native SDLC under real load',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The honest picker',
            md: 'Ask one question: **which of these would I keep touching even on a bad week?** That answer beats any portfolio logic. All three tracks exercise the five through-lines; they differ only in what you\'re left holding at the end.',
          },
        ],
      },
      {
        heading: 'Staying current in a six-month-half-life field',
        blocks: [
          {
            type: 'text',
            md: 'Half of the tool-specific detail in this course will be superseded within a year. The five through-lines will outlive the pricing tables and the product names. Nobody stays current in a field like this through willpower alone, so build a small system instead:\n\n- **Read official changelogs instead of influencer threads.** A changelog (the release-notes file where a vendor lists exactly what changed) is dense, accurate, and published first. Threads are lossy retellings of it, days later, with hype stirred in.\n- **Apply the feature-validation heuristic.** When both OpenAI and Anthropic ship a capability natively, treat it as a durable primitive. One lab, one demo, or one viral thread: wait and watch.\n- **Re-evaluate your tools quarterly, on the calendar.** A recurring 30-minute slot beats a vague intention. Faster than quarterly turns into churn that destroys compounding; slower goes stale.\n- **Keep a LESSONS.md on yourself.** Log your own bad calls and corrections, the same trick agents use to stop repeating mistakes. You\'re the system under version control now.',
          },
          {
            type: 'compare',
            left: {
              title: 'High-signal (subscribe)',
              items: [
                'Claude Code and API changelogs plus release notes',
                'The Anthropic engineering blog',
                'Simon Willison\'s newsletter',
                'Key repos: watch the releases feed rather than the star count',
              ],
            },
            right: {
              title: 'Low-signal (skim, never act on alone)',
              items: [
                'Influencer threads recycling changelogs with hype added',
                'Benchmark-war screenshots that never show their methodology',
                '"X is dead" takes about any tool under 6 months old',
                'Demos with no repo, no pricing, and no failure cases shown',
              ],
            },
          },
        ],
      },
      {
        heading: 'Continued paths',
        blocks: [
          {
            type: 'text',
            md: 'Where to go from Day 22:\n\n- **Anthropic Skilljar courses**: free, certificated courses; start with the agent-skills and Claude Code tracks\n- **The Anthropic engineering blog**: the primary source for agent-building doctrine, written by the people building the harness\n- **Simon Willison\'s newsletter**: the field\'s best running commentary, delivered weekly\n- **Repos to watch**: claude-code, the Agent Skills standard, and one harness repo whose source you actually read\n\nThe curriculum ends today. The loop keeps going: prompt, act, check, re-prompt, now applied to you.',
          },
        ],
      },
    ],
    lab: {
      title: 'Launch your capstone: today',
      intro: 'Momentum decays fast after a course ends. Beat the decay by starting the capstone within the hour: pick a track, select it in the app, and finish its first requirement before the day is out.',
      steps: [
        'Open the Capstone page in this app and read all three track descriptions and their requirement checklists end to end.',
        'Run the honest picker: for each track, write one line on whether you would still touch it on a bad week. Pick the survivor.',
        'Select your track in the app so progress tracking starts.',
        'Read your chosen track\'s first requirement and complete it TODAY: repo created, vault initialized, or spec drafted, depending on the track.',
        'Create LESSONS.md at the repo root and log entry #1: which track you picked, what you almost picked, and why the honest picker overrode it.',
        'Set a quarterly tool re-evaluation slot on your calendar (30 minutes, recurring), then subscribe to the Claude Code changelog and one newsletter.',
      ],
      checklist: [
        'A capstone track is selected in the app with the one-line rationale written down',
        'First track requirement is verifiably complete today (repo, vault, or spec exists)',
        'LESSONS.md exists with its first real entry',
        'Quarterly re-evaluation slot is on the calendar and the changelog subscription is live',
      ],
    },
    checkQuiz: [
      {
        q: 'What goes in the LESSONS.md the course tells you to keep on yourself?',
        options: [
          'A changelog of every tool release you read about',
          'Your own misjudgments and corrections: a versioned log of how your judgment is changing',
          'Summaries of each course module for later review',
          'Prompts that worked well, saved for reuse',
        ],
        answer: 1,
        explain: 'It works as a lessons-learned file about you: bad calls, wrong predictions, and the corrections you made afterward. Agents use the same pattern to stop repeating mistakes, and here you apply it to your own judgment.',
      },
      {
        q: 'What cadence does the course prescribe for re-evaluating your tool choices?',
        options: [
          'Weekly, because the field moves too fast for anything slower',
          'Whenever a major model releases',
          'Quarterly, as a scheduled calendar slot',
          'Annually, to avoid churn',
        ],
        answer: 2,
        explain: 'Quarterly, sitting on the calendar as a real appointment. Re-evaluating faster than that becomes churn that destroys compounding, and slower goes stale in a field with a six-month half-life. Scheduling it removes the decision from mood.',
      },
      {
        q: 'The "verification is the quality lever" through-line says agent output quality improves most when you...',
        options: [
          'Upgrade to the largest model tier available',
          'Write longer, more detailed prompts',
          'Give the loop a binary pass/fail signal (tests, builds, screenshots) that it must satisfy before claiming done',
          'Lower the temperature to zero',
        ],
        answer: 2,
        explain: 'A real, checkable signal inside the loop, enforced by something like a stop hook, is worth 2-3x on output quality. That beats what a model-tier upgrade or another round of prompt polishing delivers, and it costs far less.',
      },
      {
        q: 'You most want harness internals (context management, tool dispatch, termination) to stop being magic. Which track?',
        options: [
          'Personal AI OS',
          'Build Your Own Harness',
          'Ship an App AI-Natively',
          'Any track, since they all cover harness internals equally',
        ],
        answer: 1,
        explain: 'Build Your Own Harness has you implement the loop, tool execution, context handling, and verification with your own hands. It stands alone as the track where harness internals are the actual deliverable rather than something you use along the way.',
      },
    ],
    resources: [
      { label: 'Anthropic Skilljar: free certificated courses', url: 'https://anthropic.skilljar.com', kind: 'course' },
      { label: 'Anthropic engineering blog', url: 'https://www.anthropic.com/engineering', kind: 'article' },
      { label: 'Simon Willison’s weblog + newsletter', url: 'https://simonwillison.net', kind: 'article' },
      { label: 'Claude Code repo: watch releases', url: 'https://github.com/anthropics/claude-code', kind: 'repo' },
      { label: 'Agent Skills open standard', url: 'https://agentskills.io', kind: 'docs' },
    ],
  },
]
