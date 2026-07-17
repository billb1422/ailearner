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
  // m7-l3: Capstone Launch
  // ───────────────────────────────────────────────────────────────
  {
    id: 'm7-l3',
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
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif"><rect width="700" height="400" fill="#18181b" rx="8"/><text x="290" y="32" fill="#e4e4e7" font-size="15" font-weight="bold" text-anchor="middle">THE STACK YOU BUILT</text><rect x="60" y="320" width="460" height="44" fill="#27272a" stroke="#52525b" rx="8"/><text x="290" y="341" fill="#e4e4e7" font-size="14" text-anchor="middle">MODEL: raw capability</text><text x="290" y="357" fill="#a1a1aa" font-size="11" text-anchor="middle">m0-m1 foundations - m5 local models and fine-tuning</text><rect x="60" y="252" width="460" height="56" fill="#27272a" stroke="#38bdf8" rx="8"/><text x="290" y="275" fill="#38bdf8" font-size="14" text-anchor="middle" font-weight="bold">1. HARNESS &gt; MODEL</text><text x="290" y="295" fill="#a1a1aa" font-size="11" text-anchor="middle">m2-m3 Claude Code mastery - tools, memory, skills, hooks, subagents</text><rect x="60" y="184" width="460" height="56" fill="#27272a" stroke="#a78bfa" rx="8"/><text x="290" y="207" fill="#a78bfa" font-size="14" text-anchor="middle" font-weight="bold">2. LOOPS &gt; PROMPTS</text><text x="290" y="227" fill="#a1a1aa" font-size="11" text-anchor="middle">m4 loop engineering - plan, act, check, re-prompt, stop conditions</text><rect x="60" y="116" width="460" height="56" fill="#27272a" stroke="#34d399" rx="8"/><text x="290" y="139" fill="#34d399" font-size="14" text-anchor="middle" font-weight="bold">3. VERIFICATION = QUALITY LEVER</text><text x="290" y="159" fill="#a1a1aa" font-size="11" text-anchor="middle">tests, builds, screenshots, stop hooks - binary pass/fail gates</text><rect x="60" y="52" width="460" height="52" fill="#27272a" stroke="#fbbf24" rx="8"/><text x="290" y="74" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">SHIPPED WORK</text><text x="290" y="93" fill="#a1a1aa" font-size="11" text-anchor="middle">m6 design + RAG in the loop - m7 costs, SDLC, capstone</text><line x1="290" y1="320" x2="290" y2="308" stroke="#52525b" stroke-width="2"/><line x1="290" y1="252" x2="290" y2="240" stroke="#52525b" stroke-width="2"/><line x1="290" y1="184" x2="290" y2="172" stroke="#52525b" stroke-width="2"/><line x1="290" y1="116" x2="290" y2="104" stroke="#52525b" stroke-width="2"/><rect x="544" y="52" width="126" height="150" fill="#27272a" stroke="#f472b6" rx="8"/><text x="607" y="76" fill="#f472b6" font-size="13" text-anchor="middle" font-weight="bold">4. FILES</text><text x="607" y="96" fill="#a1a1aa" font-size="10" text-anchor="middle">CLAUDE.md</text><text x="607" y="112" fill="#a1a1aa" font-size="10" text-anchor="middle">SKILL.md - spec.md</text><text x="607" y="128" fill="#a1a1aa" font-size="10" text-anchor="middle">memory.md</text><text x="607" y="144" fill="#a1a1aa" font-size="10" text-anchor="middle">DESIGN.md</text><text x="607" y="168" fill="#a1a1aa" font-size="10" text-anchor="middle">state the loop</text><text x="607" y="182" fill="#a1a1aa" font-size="10" text-anchor="middle">can read and edit</text><rect x="544" y="214" width="126" height="150" fill="#27272a" stroke="#e4e4e7" rx="8"/><text x="607" y="238" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">5. CONTEXT</text><text x="607" y="254" fill="#e4e4e7" font-size="12" text-anchor="middle" font-weight="bold">ENGINEERING</text><text x="607" y="278" fill="#a1a1aa" font-size="10" text-anchor="middle">attention budget</text><text x="607" y="294" fill="#a1a1aa" font-size="10" text-anchor="middle">JIT retrieval</text><text x="607" y="310" fill="#a1a1aa" font-size="10" text-anchor="middle">compaction - notes</text><text x="607" y="326" fill="#a1a1aa" font-size="10" text-anchor="middle">subagent isolation</text><text x="607" y="350" fill="#a1a1aa" font-size="10" text-anchor="middle">spans every layer</text></svg>`,
          },
          {
            type: 'table',
            headers: ['Through-line', 'In plain English', 'Where you built it'],
            rows: [
              [
                'Harness beats model',
                'The scaffolding around a model moves results more than swapping the model',
                'Modules 2-3: Claude Code tools, memory, skills, hooks, subagents',
              ],
              [
                'Loops beat prompts',
                'Prompt, act, check, re-prompt wins over one perfect prompt',
                'Module 4: loop engineering and stop conditions',
              ],
              [
                'Verification is the lever',
                'A binary pass/fail signal inside the loop is worth 2-3x on quality',
                'Module 4 stop hooks, Module 6 evals, every lab checklist in the course',
              ],
              [
                'Files are the substrate',
                'Markdown state that humans and models can both read and fix',
                'CLAUDE.md, SKILL.md, SPEC.md, and memory files across every module',
              ],
              [
                'Context engineering',
                'The smallest set of high-signal tokens in front of the model, always',
                'Named in Module 3, then practiced in everything that followed',
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
