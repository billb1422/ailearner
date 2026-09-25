import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────
  // m11-l1: What Jev is (System One models, calibration, pricing, hype check)
  // ────────────────────────────────────────────────────────────
  {
    id: 'm11-l1',
    title: 'Jev: The AI Model That Can\'t Chat',
    day: 25,
    minutes: 55,
    xp: 120,
    objectives: [
      'Say what Jev is, who built it, and why it took over your X feed in September 2026',
      'Explain the difference between a model that writes its answer one token at a time and one that scores a fixed menu of answers in a single pass',
      'Read the three question types (Noul, Choice, Score) and say what each one hands back to your code',
      'Explain calibration with a worked example, and why an honest 0.9 is worth more to software than a clever paragraph',
      'Price a Jev workload by hand and compare it to the same job on a small LLM',
      'Separate TypeSafe\'s headline numbers from what independent testers measured in the first ten days',
    ],
    skipQuiz: [
      {
        q: 'What does Jev hand back when you send it a request?',
        options: [
          'A paragraph of text you parse with a regex',
          'Typed answers to questions you defined up front, each with probabilities attached',
          'A JSON object whose shape the model chooses at runtime',
          'A tool call that your harness then executes',
        ],
        answer: 1,
        explain:
          'You define the questions and the allowed answers before the call. Jev returns a probability for a yes/no question, a picked option plus a probability for every option, or a score on a scale you described. It never writes free text, so there is nothing to parse.',
      },
      {
        q: 'Jev is called "non-autoregressive." What does that mean in practice?',
        options: [
          'It was trained without any human feedback',
          'It runs only on local hardware',
          'It scores the allowed answers directly instead of writing an answer one token at a time and feeding each token back in',
          'It refuses to answer questions about its own architecture',
        ],
        answer: 2,
        explain:
          'An autoregressive model (every chat LLM) writes one token, feeds it back in, writes the next, and so on. Jev evaluates every question against the same input in parallel and returns the answers in one shot, which is where most of its speed comes from.',
      },
      {
        q: 'A model is well calibrated. Across all the times it said 0.8, what fraction were correct?',
        options: [
          'About 80%',
          '100%, since 0.8 is above the usual 0.5 cutoff',
          'Whatever fraction its training data had',
          'Calibration says nothing about accuracy',
        ],
        answer: 0,
        explain:
          'Calibration means the stated probability matches the real hit rate. If a calibrated model says 0.8 on a thousand questions, roughly 800 of those answers are right. That property is what lets you write `if confidence > 0.9: act_automatically()` and mean it.',
      },
      {
        q: 'Jev input costs $0.042 per million tokens and output is free. Roughly what do 100,000 support tickets of 300 tokens each cost?',
        options: ['$0.13', '$1.26', '$12.60', '$126'],
        answer: 1,
        explain:
          '100,000 tickets times 300 tokens is 30 million tokens. At $0.042 per million, that is 30 times $0.042, or $1.26. Output would normally be the expensive half of an LLM bill, and here it costs nothing.',
      },
      {
        q: 'TypeSafe advertises Jev as 193.6x faster and 444.6x cheaper. What did early independent testing find?',
        options: [
          'The numbers held up across every benchmark',
          'Jev was slower than frontier LLMs once network time was included',
          'Speed and cost gains were real but far smaller against sensible baselines, and accuracy landed with mid-price LLMs rather than the frontier',
          'Nobody could test it because the API was offline',
        ],
        answer: 2,
        explain:
          'Published real-pipeline measurements ranged from about 1.16x to 6x faster, and one eight-day review put Jev 11.5 points behind Claude Fable 5.1 on a six-model comparison. TypeSafe itself calls the headline figures the high end of real-world results.',
      },
    ],
    sections: [
      {
        heading: 'Why your feed is full of Jev',
        blocks: [
          {
            type: 'text',
            md: "On September 15, 2026, a San Francisco lab called **TypeSafe AI** came out of stealth with $40 million in seed money and one product: a model named **Jev**. The founder, Diogo Almeida, is a former OpenAI researcher who worked on ChatGPT and on RLHF, the training technique that made chat models polite and helpful. So when he says he built a model that can't chat on purpose, people pay attention.\n\nThey paid a lot of attention. Bloomberg reported the launch video pulled about 40 million views on X inside a week, and the Financial Times reported investors approaching TypeSafe at valuations over $10 billion. Your feed filled up with demo videos: a Doom bot, a Wikipedia link-racer, and someone sorting a thousand research papers for eight cents.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The whole idea, in two sentences',
            md: "Jev reads a situation and answers a fixed set of questions you wrote, each with a probability attached. It never writes a sentence. That's why it's fast and cheap, and why code can trust what comes back.",
          },
          {
            type: 'text',
            md: "The cleanest description came from developer Flavio Copes, who called Jev a smart `if` statement. Think about how much ordinary code wants to branch on something fuzzy, like `if (this ticket is urgent)` or `if (the agent is about to do something risky)`. Plain code can't evaluate those conditions, because they need judgment about text. A chat model can, but it takes seconds, costs real money, and answers with a paragraph your code then has to pick apart. Jev fills the gap between those two.\n\nThis module has four lessons. This one covers what Jev is and how much of the hype survives contact with testing. The second tours what people built in the first week and the four places a decision model belongs. The third teaches you to write questions it answers well. The fourth walks through the X article you found, which is a builder's guide to putting Jev inside a coding agent.",
          },
        ],
      },
      {
        heading: 'Fast thinking and slow thinking',
        blocks: [
          {
            type: 'text',
            md: "TypeSafe calls Jev a **System One model**. The name comes from [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow), Daniel Kahneman's book on how people decide. Kahneman split thinking into two modes. **System 1** is the fast, automatic judgment you make without deliberating: that face looks angry, this email smells like spam, that car is drifting into my lane. **System 2** is the slow, effortful kind: long division, planning a trip, debugging a race condition.\n\nChat LLMs, especially the reasoning models that think out loud before answering, are System 2 machines. They're great at it. But a huge share of what software needs is System 1: quick calls, made thousands of times, where a two-second pause per call would wreck the product.",
          },
          {
            type: 'table',
            headers: ['', 'System 1 (Jev)', 'System 2 (chat and reasoning LLMs)'],
            rows: [
              ['Human example', 'Glancing at an inbox and knowing which email is urgent', 'Writing a careful reply to the urgent one'],
              ['Software example', 'Route this ticket to billing, technical, or sales', 'Draft the refund policy exception for this customer'],
              ['Speed', 'About 100 milliseconds per call, several questions at once', 'Seconds to minutes, longer with reasoning turned on'],
              ['Output', 'A probability, a picked option, or a score', 'Free text, code, plans'],
              ['Good at', 'Many small judgments inside a loop', 'Open-ended problems that need a chain of steps'],
            ],
          },
          {
            type: 'text',
            md: "Andrej Karpathy's reaction, quoted in [The Register](https://www.theregister.com/devops/2026/09/23/shut-up-and-calculate-jevs-new-ai-primitives-for-coders/5298431), named the gap well. He described latent demand for a \"single-token LLM with low latency and acceptable intelligence\" that nobody had bothered to build, since every lab was racing toward bigger brains.",
          },
        ],
      },
      {
        heading: 'How an LLM answers, and how Jev answers',
        blocks: [
          {
            type: 'text',
            md: "You learned in [Mental Models · How LLMs Actually Work](lesson:m0-l1) that a chat model writes by predicting one token at a time. Each new token requires a full pass through the model, then gets appended to the input so the next pass can see it. That feed-it-back-in loop has a name: **autoregressive** generation.\n\nWalk through a small example. You ask a chat model: *Is this support ticket urgent? Answer yes or no.* The model reads the whole prompt, predicts `Yes`, feeds `Yes` back in, and might keep going with `, because the customer mentions a deadline`. Your code then has to find the word yes in that text. And some day the model answers `Probably!` and your parser breaks at 2 a.m.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Same question, two machines</text>
  <text x="30" y="62" fill="#a1a1aa" font-size="12" font-weight="bold">Chat LLM (autoregressive)</text>
  <rect x="30" y="74" width="110" height="40" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="6"/>
  <text x="85" y="98" fill="#e4e4e7" font-size="11" text-anchor="middle">ticket + prompt</text>
  <g font-size="11" text-anchor="middle">
    <rect x="170" y="74" width="70" height="40" fill="#27272a" stroke="#f472b6" stroke-width="1.5" rx="6"/>
    <text x="205" y="98" fill="#f472b6">pass 1</text>
    <rect x="270" y="74" width="70" height="40" fill="#27272a" stroke="#f472b6" stroke-width="1.5" rx="6"/>
    <text x="305" y="98" fill="#f472b6">pass 2</text>
    <rect x="370" y="74" width="70" height="40" fill="#27272a" stroke="#f472b6" stroke-width="1.5" rx="6"/>
    <text x="405" y="98" fill="#f472b6">pass 3</text>
    <text x="470" y="98" fill="#71717a">. . .</text>
  </g>
  <g font-size="10" fill="#a1a1aa" text-anchor="middle">
    <text x="205" y="132">"Yes"</text>
    <text x="305" y="132">","</text>
    <text x="405" y="132">"because"</text>
  </g>
  <g stroke="#52525b" stroke-width="1.5" fill="none">
    <line x1="140" y1="94" x2="168" y2="94"/>
    <path d="M205 138 Q255 160 300 116"/>
    <path d="M305 138 Q355 160 400 116"/>
  </g>
  <rect x="510" y="74" width="160" height="40" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="6"/>
  <text x="590" y="92" fill="#e4e4e7" font-size="11" text-anchor="middle">free text</text>
  <text x="590" y="106" fill="#71717a" font-size="10" text-anchor="middle">your code parses it</text>
  <line x1="490" y1="94" x2="508" y2="94" stroke="#52525b" stroke-width="1.5"/>
  <line x1="30" y1="178" x2="670" y2="178" stroke="#3f3f46" stroke-dasharray="4 4"/>
  <text x="30" y="208" fill="#a1a1aa" font-size="12" font-weight="bold">Jev (one pass, questions in parallel)</text>
  <rect x="30" y="222" width="110" height="80" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="6"/>
  <text x="85" y="252" fill="#e4e4e7" font-size="11" text-anchor="middle">state</text>
  <text x="85" y="268" fill="#71717a" font-size="10" text-anchor="middle">(the ticket)</text>
  <text x="85" y="284" fill="#71717a" font-size="10" text-anchor="middle">+ 3 questions</text>
  <rect x="190" y="222" width="140" height="80" fill="#27272a" stroke="#e879f9" stroke-width="2" rx="6"/>
  <text x="260" y="258" fill="#e879f9" font-size="13" font-weight="bold" text-anchor="middle">one pass</text>
  <text x="260" y="276" fill="#a1a1aa" font-size="10" text-anchor="middle">~100 ms</text>
  <line x1="140" y1="262" x2="188" y2="262" stroke="#52525b" stroke-width="1.5"/>
  <g font-size="11">
    <rect x="390" y="218" width="280" height="24" fill="#27272a" stroke="#e879f9" stroke-width="1" rx="4"/>
    <text x="400" y="234" fill="#e4e4e7">urgent: noul 0.93</text>
    <rect x="390" y="250" width="280" height="24" fill="#27272a" stroke="#e879f9" stroke-width="1" rx="4"/>
    <text x="400" y="266" fill="#e4e4e7">team: choice "billing" (0.97)</text>
    <rect x="390" y="282" width="280" height="24" fill="#27272a" stroke="#e879f9" stroke-width="1" rx="4"/>
    <text x="400" y="298" fill="#e4e4e7">frustration: score 1.43 of 0..2</text>
  </g>
  <g stroke="#52525b" stroke-width="1.5">
    <line x1="330" y1="250" x2="388" y2="230"/>
    <line x1="330" y1="262" x2="388" y2="262"/>
    <line x1="330" y1="274" x2="388" y2="294"/>
  </g>
</svg>`,
            caption: 'The chat model spends one full pass per token and hands back prose. Jev answers every question against the same input at once and hands back numbers your code can branch on.',
          },
          {
            type: 'text',
            md: "Jev skips that loop. TypeSafe describes it as **non-autoregressive**: every question in a request gets evaluated independently against the same input, in parallel, and the answers come back together. Nothing it answers becomes input for another answer. That's why adding a fifth or tenth question to a request barely changes the response time.\n\nWhat's inside the box? TypeSafe hasn't published the architecture. One engineer, Archer Hume, ran about 10,000 API calls and concluded that Jev probably reads its probabilities straight off the model's internal representation of the input, instead of generating tokens. The open-source clone you'll meet in the Writing Questions lesson works that way. It's built on an **encoder**, a type of model designed to read text and represent its meaning rather than write new text. The famous example is [BERT](https://en.wikipedia.org/wiki/BERT_(language_model)), which Google used to understand search queries starting in 2019.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'A mental model that works',
            md: "Picture a very general classifier that you set up with plain-English questions instead of training. Before Jev, getting a fast ticket router meant collecting thousands of labeled tickets and training a model for that one job, the process you saw in [Fine-Tuning · LoRA, QLoRA & When to Tune](lesson:m6-l1). Jev lets you describe the job in a sentence and get most of the way there on the first call.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Making Jev write anyway, one letter at a time',
            md: "Ryan Vogel of the OpenCode team tried to force Jev to talk. He made each step a single decision with the letters A through Z as the options, fed the letters picked so far back into the next request, and asked *what is bigger, a cat or an elephant?* It started spelling out an answer, slowly and clumsily. That hack is autoregression built by hand: Vogel's code became the loop that feeds each output back in, one pass per letter. Jev was never trained for it, which is why it's bad at it, and why the loop lives in your code and never inside the model.",
          },
        ],
      },
      {
        heading: 'The three kinds of question',
        blocks: [
          {
            type: 'text',
            md: "Every Jev request has two parts. The **state** is the thing being judged: a ticket, an email, a JSON blob describing a game screen, up to about 64,000 tokens. The **questions** are what you want to know about it, each with a name you pick. Each question has one of three types.",
          },
          {
            type: 'table',
            headers: ['Type', 'You provide', 'You get back', 'Example'],
            rows: [
              ['**Noul**', 'A yes/no question, optionally with what yes and no mean', 'One number from 0 to 1: the probability the answer is yes', '"Does this message threaten to cancel?" gives `0.88`'],
              ['**Choice**', 'A question plus up to 255 named options, each with a short description', 'The picked option, a probability for every option, and a confidence number', '"Which team handles this?" gives `billing`, with billing 0.97, technical 0.01, other 0.02'],
              ['**Score**', 'A question plus 2 to 10 ordered levels, lowest first', 'A score between the levels, the probability of each level, and a confidence number', '"How frustrated is the customer?" gives `1.43` on a 3-level scale'],
            ],
          },
          {
            type: 'text',
            md: "Noul is TypeSafe's made-up name for the yes/no type, so don't go looking for it in a dictionary. Choice is the workhorse, the one you'll use for routing and intent detection. Score is the one that needs a little math to read, so here it is worked out.",
          },
          {
            type: 'code',
            lang: 'json',
            code: `{
  "model": "jev-latest",
  "state": "We were billed twice for March. Refund the duplicate today or we cancel.",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should handle this ticket?",
      "criteria": {
        "billing": "Invoices, payments, refunds",
        "technical": "Bugs, outages, errors",
        "other": "Everything else"
      }
    },
    "frustration": {
      "type": "score",
      "instructions": "How frustrated does the customer sound?",
      "criteria": ["Calm, just stating facts", "Annoyed but civil", "Angry, threatening to leave"]
    },
    "churn_threat": {
      "type": "noul",
      "instructions": "Does the customer threaten to cancel or leave?"
    }
  }
}`,
            caption: 'One request, three questions, one shared state. The shape follows TypeSafe\'s API reference for POST /v1/systemone.',
          },
          {
            type: 'text',
            md: "Say the frustration answer comes back with level probabilities of 0.05, 0.47, and 0.48. Number the levels 0, 1, and 2, then take the probability-weighted average: 0 x 0.05 + 1 x 0.47 + 2 x 0.48 = 1.43. That score says the model is torn between *annoyed* and *angry*, leaning a hair toward angry. Your code can threshold on 1.43 directly, or read the individual probabilities if it wants to know how torn.",
          },
        ],
      },
      {
        heading: 'Calibration: the feature doing the heavy lifting',
        blocks: [
          {
            type: 'text',
            md: "Fast and cheap would be enough to get Jev noticed. What TypeSafe bet the company on is **calibration**, which means the probabilities mean what they say.\n\nThe classic example is a weather forecaster. Look back over every day the forecast said 70% chance of rain. If it rained on about 70% of those days, the forecaster is calibrated. If it rained on 40% of them, the forecaster is overconfident, and you'd be foolish to plan a picnic around those numbers.",
          },
          {
            type: 'text',
            md: "Here's why that matters for software. The whole point of a probability is that your code can act on it: `if churn_threat > 0.9: page_the_account_manager()`. That line only works if 0.9 means right nine times out of ten. Chat models trained with RLHF learn to give answers people like, and people like confident answers, so those models tend to sound surer than they are. TypeSafe trains Jev with a method it calls **RLCD** (Reinforcement Learning for Calibrated Decisions), which rewards the model for honest probabilities instead of pleasing ones.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Reading a reliability chart</text>
  <line x1="90" y1="270" x2="640" y2="270" stroke="#52525b" stroke-width="1.5"/>
  <line x1="90" y1="270" x2="90" y2="60" stroke="#52525b" stroke-width="1.5"/>
  <text x="365" y="305" fill="#a1a1aa" font-size="11" text-anchor="middle">what the model said (confidence bucket)</text>
  <text x="40" y="170" fill="#a1a1aa" font-size="11" text-anchor="middle" transform="rotate(-90 40 170)">how often it was right</text>
  <line x1="90" y1="180" x2="640" y2="80" stroke="#71717a" stroke-width="1.5" stroke-dasharray="5 5"/>
  <text x="636" y="70" fill="#71717a" font-size="10" text-anchor="end">perfect calibration</text>
  <g font-size="10" fill="#71717a" text-anchor="end">
    <text x="84" y="174">0.5</text>
    <text x="84" y="74">1.0</text>
  </g>
  <g font-size="10" fill="#a1a1aa" text-anchor="middle">
    <text x="145" y="286">0.5</text>
    <text x="255" y="286">0.6</text>
    <text x="365" y="286">0.7</text>
    <text x="475" y="286">0.8</text>
    <text x="585" y="286">0.9</text>
  </g>
  <g>
    <rect x="121" y="170" width="22" height="100" fill="#e879f9" opacity="0.85"/>
    <rect x="231" y="150" width="22" height="120" fill="#e879f9" opacity="0.85"/>
    <rect x="341" y="130" width="22" height="140" fill="#e879f9" opacity="0.85"/>
    <rect x="451" y="110" width="22" height="160" fill="#e879f9" opacity="0.85"/>
    <rect x="561" y="90" width="22" height="180" fill="#e879f9" opacity="0.85"/>
    <rect x="147" y="190" width="22" height="80" fill="#f87171" opacity="0.85"/>
    <rect x="257" y="180" width="22" height="90" fill="#f87171" opacity="0.85"/>
    <rect x="367" y="170" width="22" height="100" fill="#f87171" opacity="0.85"/>
    <rect x="477" y="160" width="22" height="110" fill="#f87171" opacity="0.85"/>
    <rect x="587" y="150" width="22" height="120" fill="#f87171" opacity="0.85"/>
  </g>
  <rect x="110" y="72" width="12" height="12" fill="#e879f9"/>
  <text x="128" y="82" fill="#e4e4e7" font-size="11">calibrated: bars touch the dashed line</text>
  <rect x="110" y="92" width="12" height="12" fill="#f87171"/>
  <text x="128" y="102" fill="#e4e4e7" font-size="11">overconfident: says 0.9, right about 60% of the time</text>
</svg>`,
            caption: 'Illustrative shapes, drawn by hand. Group answers by the confidence the model gave, then check the real hit rate in each group. The gap between each bar and the dashed line is the miscalibration.',
          },
          {
            type: 'text',
            md: "Testers boil that chart down to one number called **ECE**, short for [expected calibration error](https://en.wikipedia.org/wiki/Calibration_(statistics)). Walk through it. Suppose 100 answers landed in the 0.8 bucket and 70 of them were right. The gap there is 0.10. Do that for every bucket, average the gaps (weighting bigger buckets more), and you get ECE. Zero is perfect. Anything under about 0.05 is very good for real-world data.\n\nIndependent numbers so far are mixed, and worth knowing by heart:",
          },
          {
            type: 'text',
            md: "- An [eight-day review of independent tests](https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60) found a median ECE of 0.071 out of the box on public datasets, the best of the models tested before any tuning.\n- The same review found ugly pockets. On a many-way emotion-labeling task, Jev was right only 15% of the time when it claimed 0.80 to 0.95 confidence.\n- A [phishing study](https://www.beri.net/article/typesafe-jev-typed-decision-model-calibration-decomposition-shadow-eval) fed it questions that couldn't be answered from the text. Jev was right 44.7% of the time while averaging 0.74 confidence.\n- The fix was cheap. Fitting one **temperature** value on 50 to 300 labeled examples of your own cut calibration error by 74% on fresh data. Temperature here is a single dial that stretches or squashes all the probabilities until they line up with your real hit rates.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: '"Can\'t hallucinate" has a narrow meaning',
            md: "TypeSafe's marketing says Jev can't hallucinate, and in one sense that's true: it can't invent an option you didn't offer or return malformed JSON, because the answer space is fixed before it runs. It can absolutely pick the wrong option from your menu, and sometimes pick it with high confidence. Structure is guaranteed. Correctness isn't.",
          },
        ],
      },
      {
        heading: 'What it costs, worked by hand',
        blocks: [
          {
            type: 'text',
            md: "The pricing is odd in a good way. Input costs **$0.042 per million tokens** (TypeSafe sometimes quotes it as $42 per billion). Output is free, because Jev's output is a few numbers. Compare that with what you learned in [Mental Models · Token Economics 101](lesson:m0-l6), where output tokens are usually the expensive side of the bill.\n\nWork a real example. A support ticket runs about 300 tokens including your questions. 300 divided by a million, times $0.042, is $0.0000126 per ticket. A hundred thousand tickets costs $1.26. Ask five questions per ticket instead of one and the price barely moves, because you pay for the ticket text once and the questions are short.",
          },
          {
            type: 'table',
            headers: ['Workload', 'Jev', 'Small LLM for comparison', 'Source'],
            rows: [
              ['1,000 phishing checks, one question each', '$0.038', '$0.462 on Claude Haiku 4.5 (12x more)', 'Independent phishing study'],
              ['1,000 phishing checks, five questions each', 'about the same', '$1.02 on Haiku 4.5 (27x more)', 'Same study'],
              ['1 million decisions at 132 tokens each', '$5.54', 'depends on model', 'Eight-day independent review'],
              ['Triage 1,700 emails, four questions each', '$0.18 (4.2M input tokens)', 'hours of chat-model time, by Vogel\'s guess', 'Ryan Vogel\'s demo with Greg Isenberg'],
              ['One million requests of 1,000 tokens each', '$42', 'depends on model', 'Nate B. Jones\'s math'],
              ['Classify 1,018 research papers', '$0.08', 'n/a', '1kpapers.com launch-week demo'],
              ['Run a Doom-playing bot for an hour', 'about $7', 'n/a', 'TypeSafe launch post'],
            ],
          },
          {
            type: 'text',
            md: "Latency is the other half. TypeSafe quotes 70 to 500 milliseconds end to end, with most calls landing around 100. Ryan Vogel measured about 200 milliseconds per query in his own demos, no matter how many questions he asked, and Matthew Berman showed an app sorting 100 emails in under half a second. Launch rate limits were 1,200 requests per minute and 250,000 tokens per second. One request can hold about 64,000 tokens total, and the state plus your single longest question has to fit in about 32,000. Input is text only, so images, audio, and PDFs have to be converted to text or structured fields first.",
          },
        ],
      },
      {
        heading: 'The hype check',
        blocks: [
          {
            type: 'text',
            md: "The launch headline was **193.6x faster and 444.6x cheaper** than LLMs. Look closely at where that came from before you repeat it to anyone.\n\nTypeSafe's own launch post calls those figures the higher end of real-world gains. Its benchmark also grades Jev by how often it agrees with the average answer of two frontier models (GPT-6 Astra and Claude Fable 5.1). That measures agreement, and it builds in a ceiling: Jev can never score better than the models it's graded against. Meanwhile a TypeSafe employee routed one decision step of a real pipeline through Jev and measured it **15.9% faster and 30.1% cheaper per ticket**. Solid gains, a long way from 193x.",
          },
          {
            type: 'table',
            headers: ['Claim', 'What independent testing found in the first ten days'],
            rows: [
              ['193.6x faster', 'Published real-pipeline measurements ran from about 1.16x to 6x faster. Against small models of similar accuracy, one review found 2.0x to 3.6x. A developer who swapped Jev into a tax-document pipeline reported 6x (via Nate B. Jones).'],
              ['444.6x cheaper', 'Against small models of similar accuracy, 4.7x to 7.5x cheaper. Against Haiku on phishing, 12x to 27x. The same tax-document swap reported 34x.'],
              ['Frontier-level judgment', 'Jev scored 72.5% on one six-model comparison, behind Claude Fable 5.1 at 84.0% and GPT-6 Astra at 79.0%. On social-science labeling tasks it trailed the best LLM per task by a median 11.6 F1 points.'],
              ['Works everywhere', 'Spam filtering was excellent (98.33% on 18,514 emails). Russian accuracy fell to 77.3% from 88.3% in English. One unreplicated study found renaming the answer options changed 32.5% of answers.'],
              ['Calibrated out of the box', 'Best of the tested models before tuning, with bad pockets on many-option tasks. Fixable with a few hundred labels.'],
            ],
          },
          {
            type: 'text',
            md: "The fair verdict, as of late September 2026: the speed and price are real and remarkable. The intelligence sits level with mid-price LLMs and behind the frontier. One review found a plain open model, Gemma 4 26B, only 2.1 points less accurate on mixed tasks. Access is also still gated behind a waitlist, so treat anything you can't test yourself as a claim.\n\nNone of that makes Jev a dud. A model that's roughly as smart as a mid-tier LLM at a tenth of the price and a tenth of the latency opens up jobs nobody would pay an LLM to do, like judging every frame of a game or every command an agent is about to run.",
          },
        ],
      },
      {
        heading: 'What Jev can\'t do',
        blocks: [
          {
            type: 'text',
            md: "TypeSafe's docs and early testers agree on a short list of places where Jev falls over. Most of them come from the same root: it makes a gut call from the text in front of it, with no scratch paper.",
          },
          {
            type: 'table',
            headers: ['Weak spot', 'Example that goes wrong', 'Do this instead'],
            rows: [
              ['Writing anything', 'Draft a reply to this ticket', 'Use an LLM for the reply; use Jev to decide whether a reply is needed'],
              ['Arithmetic and counting', 'Does this order have more than 12 items?', 'Count in code, then pass the count in the state'],
              ['Dates as quantities', 'Is this invoice overdue?', 'Compute the days overdue in code and ask about the number'],
              ['Negation and double negatives', 'Is this not unrelated to billing?', 'Ask the positive version: is this about billing?'],
              ['Answers that don\'t follow from the text', 'Buy, hold, or sell Bitcoin this minute? (Ryan Vogel tried it; it did poorly, and a frontier model with news access did a little better)', 'Keep Jev on judgments a sharp person could make from the input alone'],
              ['Images, audio, video', 'Is this screenshot showing an error?', 'Convert to text or structured fields first'],
              ['Huge option lists', 'Pick one of 800 product SKUs', 'Shortlist in code or with search, then ask Jev among 255 or fewer'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'A rule of thumb you can keep',
            md: "If a sharp person could make the call in a few seconds from the text in front of them, Jev is a candidate. If that person would need a calculator, a calendar, a search engine, or ten minutes of thought, reach for code or a reasoning model.",
          },
        ],
      },
    ],
    lab: {
      title: 'Price Three Decisions You Already Make',
      intro:
        "No API key needed. The point is to find where a System One model would earn its keep in your own work, and put numbers on it before you touch any code. Thirty minutes with a notebook or a spreadsheet.",
      steps: [
        'List ten small judgments that happen repeatedly in your work or in software you run. Examples: triaging inbound email, deciding which Trello card is urgent, choosing Haiku versus Opus for a prompt, flagging a risky shell command before an agent runs it.',
        'Cross off any that need writing, math, dates, images, or information that is not in the text. Keep at least three.',
        'For each survivor, write it as Jev questions: the state (what text goes in), and one to five questions, each typed as Noul, Choice, or Score with its options or levels spelled out.',
        'Estimate tokens per call (roughly four characters per token) and calls per month. Price it at $0.042 per million input tokens.',
        'Price the same volume on the LLM you would otherwise use, counting both input and output tokens at that model\'s current rates.',
        'For each, write one sentence on latency: would a 100 millisecond answer change what the product can do, or only what it costs?',
      ],
      checklist: [
        'I have three decisions written as a state plus typed questions',
        'Each question is something a sharp person could answer from the text alone',
        'I priced each one on Jev and on the LLM I would otherwise use',
        'I can say which of the three benefits from speed and which only from cost',
      ],
    },
    checkQuiz: [
      {
        q: 'You add a sixth question to a Jev request that already has five. What happens to response time?',
        options: [
          'It roughly doubles',
          'It rises by about one-fifth',
          'It barely changes, since every question is evaluated against the same input in parallel',
          'The request fails; the limit is five questions',
        ],
        answer: 2,
        explain:
          'Questions are evaluated independently and in parallel against the shared state. That is the property behind the "speculative fan-out" pattern in the Writing Questions lesson: ask everything you might need in one call.',
      },
      {
        q: 'A Score question has levels Calm, Annoyed, Angry (numbered 0, 1, 2). The level probabilities come back 0.10, 0.80, 0.10. What score does Jev report?',
        options: ['0.80', '1.00', '1.10', '2.00'],
        answer: 1,
        explain:
          'The score is the probability-weighted average: 0 x 0.10 + 1 x 0.80 + 2 x 0.10 = 1.00. The model is fairly sure the customer is annoyed, with equal small doubts on either side.',
      },
      {
        q: 'Why did TypeSafe\'s own benchmark put a ceiling on how good Jev could look?',
        options: [
          'It only tested English',
          'It graded Jev by agreement with the average answer of two frontier models, so Jev could never beat them',
          'It capped every request at 32,000 tokens',
          'It excluded Score questions',
        ],
        answer: 1,
        explain:
          'When the reference answer is what two other models said, the best possible result is matching them. That measures agreement with the frontier. Accuracy against ground truth would need labeled answers.',
      },
      {
        q: 'Which job is the worst fit for Jev?',
        options: [
          'Deciding whether an email is a sponsorship pitch',
          'Routing a ticket to one of six teams',
          'Deciding whether an invoice dated two weeks ago is past its 30-day terms',
          'Scoring how frustrated a customer sounds on a five-level scale',
        ],
        answer: 2,
        explain:
          'Dates as ordered quantities are a documented weak spot. Compute days outstanding in code and either branch on it directly or pass the number in the state. The other three are quick text judgments, which is exactly what Jev is for.',
      },
    ],
    resources: [
      { label: 'TypeSafe AI: Introducing System One Models & Jev (launch post)', url: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev', kind: 'article' },
      { label: 'TypeSafe API reference', url: 'https://docs.typesafe.ai/api', kind: 'docs' },
      { label: 'Flavio Copes: A deep dive into Jev', url: 'https://flaviocopes.com/jev/', kind: 'article' },
      { label: 'Jev after eight days of independent tests', url: 'https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60', kind: 'article' },
      { label: 'The Register: Shut up and calculate', url: 'https://www.theregister.com/devops/2026/09/23/shut-up-and-calculate-jevs-new-ai-primitives-for-coders/5298431', kind: 'article' },
      { label: 'Bloomberg: Jev, an AI model that can\'t chat, takes on bigger rivals', url: 'https://www.bloomberg.com/news/articles/2026-09-25/jev-an-ai-model-that-can-t-chat-takes-on-bigger-rivals', kind: 'article' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m11-l4 (taught second): Jev-shaped problems (Isenberg/Vogel, Berman, Nate B. Jones videos)
  // ────────────────────────────────────────────────────────────
  {
    id: 'm11-l4',
    title: 'Jev-Shaped Problems: Four Places a Decision Model Belongs',
    day: 25,
    minutes: 50,
    xp: 120,
    objectives: [
      'Spot a Jev-shaped problem on sight: messy text going in, a short list of defined outcomes coming out',
      'Explain why a general-purpose classifier counts as a third building block for software, next to plain code and LLMs',
      'Place Jev in one of four spots: the front of a queue, a filter over a big pile, the outer loop of a workflow, or inside an ordinary feature with no LLM at all',
      'Run the expensive-queue test on a real business and name where a decision model would pay for itself',
      'Explain the Jevons paradox and why cheap judgment tends to grow total AI work instead of shrinking it',
      'Name the jobs where Jev falls over, starting with a Bitcoin experiment that went badly',
    ],
    skipQuiz: [
      {
        q: 'Which of these is a Jev-shaped problem?',
        options: [
          'Flag every invoice more than 30 days overdue',
          'Decide whether a badly written email contains a real business opportunity or only uses the words "business opportunity"',
          'Write a polite reply to a customer complaint',
          'Explain why a test is failing',
        ],
        answer: 1,
        explain:
          'Complicated text in, a simple choice out. The invoice rule is plain code (a date comparison), and the other two need writing or reasoning, which is LLM territory.',
      },
      {
        q: 'A scientist wants Jev to pick the top 100 of 10,000 candidate research questions. A Choice question maxes out at 255 options. How do you build it?',
        options: [
          'Split the 10,000 into 40 Choice questions of 250 and merge the winners',
          'Score each candidate on its own with a Score or Noul question, then sort in code and keep the top 100',
          'It cannot be done with Jev',
          'Ask a Choice question with the options "top 100" and "not top 100"',
        ],
        answer: 1,
        explain:
          'Ranking a big pile means judging each item independently and letting code do the sorting. At Jev prices, ten thousand small calls cost pennies.',
      },
      {
        q: 'Greg Isenberg\'s startup lens for Jev is to find a business with an expensive ___ and put Jev at the front of it. Fill in the blank.',
        options: ['GPU cluster', 'marketing budget', 'queue of incoming information', 'support contract'],
        answer: 2,
        explain:
          'Anywhere requests pile up and a person has to read each one to decide what happens next (inbound leads, support tickets, quote requests, document intake) is a place where a 200 ms decision changes the economics.',
      },
      {
        q: 'What does the Jevons paradox predict about cheap classification?',
        options: [
          'Total spending on AI judgment will fall by 100x',
          'Making judgment far cheaper makes people apply it in many more places, so total use grows',
          'LLMs will stop being used',
          'Prices will rise once demand arrives',
        ],
        answer: 1,
        explain:
          'William Stanley Jevons noticed in 1865 that more efficient steam engines increased total coal use, because coal became worth using for more things. Jobs you skipped because judgment was expensive become worth doing when it costs a hundredth as much.',
      },
      {
        q: 'Ryan Vogel wired Jev to a Bitcoin price feed and asked "buy, hold, or sell?" every minute. What happened?',
        options: [
          'It beat the market for a week',
          'It performed poorly, and a frontier model did a little better because it cross-referenced news',
          'The API rejected financial questions',
          'It matched a frontier model at a thousandth of the cost',
        ],
        answer: 1,
        explain:
          'The right answer does not follow from the text in front of the model. That is the same weak spot the independent testers found, and Vogel\'s advice was blunt: use it for routing-style decisions and keep it away from your portfolio.',
      },
    ],
    sections: [
      {
        heading: 'Three videos, one idea',
        blocks: [
          {
            type: 'text',
            md: "Three YouTube videos from the first week after launch make a good companion to the last lesson. They cover what people actually built, and where it fits.\n\n- [Greg Isenberg interviewing Ryan Vogel](https://www.youtube.com/watch?v=4mTLpuQpB80), who is on the founding team of the OpenCode coding agent. Vogel runs live demos and Isenberg keeps asking how you'd turn each one into a business.\n- [Matthew Berman's eight use cases](https://www.youtube.com/watch?v=jGD_UR4wMJc), a fast tour of builds people posted on X.\n- [Nate B. Jones on why developers are losing their minds](https://www.youtube.com/watch?v=tYugqJ9YytQ), the most useful of the three for architecture. Jones spent years building custom classifiers at Amazon and Prime Video, so he knows what Jev replaces.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The one-line version, from Nate B. Jones',
            md: "Jev is like an LLM that can only answer in multiple choice. You write every possible answer in advance, it reads whatever you hand it, and it picks one. Jones puts the problem shape even shorter: complicated in, simple out.",
          },
          {
            type: 'text',
            md: "Jones also shared a striking adoption number. Within 24 hours of launch, he says, Jev was the fastest-adopted model in the history of Vercel's AI Gateway, with more than twice as many paying teams as any earlier model's first day. No public dashboard backs that up yet, though it matches how fast the demos piled up.",
          },
        ],
      },
      {
        heading: 'The third building block',
        blocks: [
          {
            type: 'text',
            md: "Jones's big claim is that software now has three building blocks instead of two. For about 80 years we had **deterministic code**: rules that do the same thing every time, like flagging an invoice once it's 30 days overdue. Since late 2022 we've had **LLMs**, which can reason, plan, and write. Jev adds a **general-purpose classifier**, something that can read messy language and pick among outcomes you defined, fast and cheap enough to drop into ordinary code.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="250" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Three building blocks</text>
  <g font-size="11" text-anchor="middle">
    <rect x="25" y="50" width="200" height="175" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="8"/>
    <text x="125" y="76" fill="#34d399" font-size="13" font-weight="bold">Deterministic code</text>
    <text x="125" y="98" fill="#a1a1aa">calculates, compares, retrieves</text>
    <text x="125" y="128" fill="#e4e4e7">"invoice is 30+ days overdue"</text>
    <text x="125" y="160" fill="#71717a" font-size="10">same answer every time</text>
    <text x="125" y="176" fill="#71717a" font-size="10">free, instant</text>
    <text x="125" y="208" fill="#34d399" font-size="10">since the 1940s</text>
    <rect x="250" y="50" width="200" height="175" fill="#27272a" stroke="#e879f9" stroke-width="2" rx="8"/>
    <text x="350" y="76" fill="#e879f9" font-size="13" font-weight="bold">General-purpose classifier</text>
    <text x="350" y="98" fill="#a1a1aa">interprets, then chooses</text>
    <text x="350" y="128" fill="#e4e4e7">"does this customer sound</text>
    <text x="350" y="144" fill="#e4e4e7">like they're about to leave?"</text>
    <text x="350" y="176" fill="#71717a" font-size="10">~100-200 ms, fractions of a cent</text>
    <text x="350" y="208" fill="#e879f9" font-size="10">new in September 2026</text>
    <rect x="475" y="50" width="200" height="175" fill="#27272a" stroke="#38bdf8" stroke-width="1.5" rx="8"/>
    <text x="575" y="76" fill="#38bdf8" font-size="13" font-weight="bold">LLM</text>
    <text x="575" y="98" fill="#a1a1aa">reasons, plans, writes</text>
    <text x="575" y="128" fill="#e4e4e7">"draft the retention offer</text>
    <text x="575" y="144" fill="#e4e4e7">for this customer"</text>
    <text x="575" y="176" fill="#71717a" font-size="10">seconds, cents</text>
    <text x="575" y="208" fill="#38bdf8" font-size="10">since late 2022</text>
  </g>
</svg>`,
            caption: 'The middle block used to be either a custom-trained model or an LLM pretending to be one.',
          },
          {
            type: 'text',
            md: "Jones calls the work in the middle **semi-deterministic**. You write down the short list of possible outcomes and exactly what your code does after each one. That part is fully predictable. Only the interpretation step is probabilistic.\n\nClassifiers have been around for decades. Jev's change is that one model covers every job. Here's the old way Jones used at Amazon, next to the new one.",
          },
          {
            type: 'table',
            headers: ['Step', 'Custom ML classifier (the old way)', 'Jev'],
            rows: [
              ['Define the job', 'Pick categories', 'Write a question and its options in plain English'],
              ['Get data', 'Collect and hand-label thousands of examples', 'None to start; a few hundred labels to calibrate and check'],
              ['Build', 'Train or fine-tune a model, often with a specialist', 'Nothing to train'],
              ['Change the categories', 'Relabel, retrain, re-evaluate', 'Edit the options and rerun your shadow eval'],
              ['Worth it when', 'You\'re a big, stable platform with one high-volume job', 'Almost any repeated judgment, even a few hundred a month'],
            ],
          },
          {
            type: 'text',
            md: "So the million small judgments scattered through ordinary software (is this lead any good, which team owns this, should the agent pause here) never justified a custom model. People either skipped them or paid an LLM to write a paragraph that amounted to a multiple-choice answer. Jones admits he's done exactly that with his own inbox, and one of his first Jev projects was replacing it.",
          },
        ],
      },
      {
        heading: 'Placement 1: at the front of the queue',
        blocks: [
          {
            type: 'text',
            md: "The most common placement puts Jev between messy incoming information and software that already knows what to do next. Jev's job is to say what this thing is and how much it matters, so your code can hand it to the right existing process.\n\nRyan Vogel's opening demo is the clearest example in any of the three videos. He ran Jev over **1,700 of his own emails**. The input was each email object exactly as it came out of his inbox (subject, sender, body) with no cleanup. He asked four questions per email.",
          },
          {
            type: 'table',
            headers: ['Question', 'Type', 'What came back'],
            rows: [
              ['Category', 'Choice: shopping, work, marketing, finance, security, and a few more', 'One label per email'],
              ['Priority', 'Five levels, from low up to urgent (a missed credit card payment)', 'A position on the scale'],
              ['Spam score', 'Noul', 'A 0 to 1 probability, since spam is a range more than a yes/no'],
              ['Worth replying to?', 'Noul', 'A customer reporting a possible account violation came back at 0.90'],
            ],
          },
          {
            type: 'text',
            md: "The run used 4.2 million input tokens and cost **18 cents total**. Work the math and it checks out: 4.2 million tokens at $0.042 per million is $0.176. That's about 2,500 tokens per email (bodies are long), or roughly a hundredth of a cent each. Vogel guessed the same job on a chat model would have taken hours. He also reported about 500,000 output tokens, which Jev doesn't charge for.\n\nOne improvement is sitting right there. Most of those 2,500 tokens per email are body text, and the spam and category calls mostly depend on the sender and subject. The retrieve-then-judge pattern from [Bonus: Decision Models (Jev) · Writing Questions Jev Can Answer: Decompose, Gate, Cascade](lesson:m11-l2) would trim the state first and cut the bill further. At 18 cents, though, nobody's losing sleep over it.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="280" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Jev as a traffic cop</text>
  <g font-size="11" text-anchor="middle">
    <rect x="25" y="112" width="120" height="56" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="6"/>
    <text x="85" y="136" fill="#e4e4e7">inbound lead</text>
    <text x="85" y="152" fill="#71717a" font-size="10">contact form, email</text>
    <rect x="195" y="104" width="130" height="72" fill="#27272a" stroke="#e879f9" stroke-width="2" rx="6"/>
    <text x="260" y="130" fill="#e879f9" font-weight="bold">Jev</text>
    <text x="260" y="148" fill="#a1a1aa" font-size="10">what is it?</text>
    <text x="260" y="162" fill="#a1a1aa" font-size="10">how good? what next?</text>
    <rect x="410" y="48" width="265" height="52" fill="#27272a" stroke="#fbbf24" stroke-width="1.5" rx="6"/>
    <text x="542" y="70" fill="#fbbf24">good lead 0.98: a human replies now</text>
    <text x="542" y="88" fill="#71717a" font-size="10">speed of reply is the product here</text>
    <rect x="410" y="114" width="265" height="52" fill="#27272a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <text x="542" y="136" fill="#38bdf8">middling: automation or an LLM draft</text>
    <text x="542" y="154" fill="#71717a" font-size="10">a person skims before anything is sent</text>
    <rect x="410" y="180" width="265" height="52" fill="#27272a" stroke="#52525b" stroke-width="1.5" rx="6"/>
    <text x="542" y="202" fill="#a1a1aa">low score or spam: ignore</text>
    <text x="542" y="220" fill="#71717a" font-size="10">logged, never shown</text>
  </g>
  <g stroke="#52525b" stroke-width="1.5">
    <line x1="145" y1="140" x2="193" y2="140"/>
    <line x1="325" y1="130" x2="408" y2="74"/>
    <line x1="325" y1="140" x2="408" y2="140"/>
    <line x1="325" y1="150" x2="408" y2="206"/>
  </g>
  <text x="350" y="262" fill="#71717a" font-size="10" text-anchor="middle">the LLM only runs on the middle lane, after Jev decided it was worth the cost</text>
</svg>`,
            caption: 'Isenberg\'s framing of Vogel\'s lead-scoring example. The thresholds between lanes are the confidence gates from the next lesson.',
          },
          {
            type: 'text',
            md: "Isenberg called this Jev as a **traffic cop**, and Vogel had a live example. His partner runs a graphic design agency whose contact form draws a mix of real clients and junk. A single Noul question, *is this a good lead*, sorts them. A 0.98 gets a reply within minutes. A vague maybe gets automation or a drafted response. Junk gets ignored. The expensive tools (a person's attention, an LLM's tokens) only get spent after Jev decides they're worth spending.\n\nMore examples of the same placement from the videos:",
          },
          {
            type: 'text',
            md: "- **Support tickets.** Jev picks the team, judges whether it needs an answer today, and flags churn risk. Vogel's point: a 200 ms answer replaces a slow streaming LLM call and all the plumbing that comes with it.\n- **Tax documents.** Jones cites a developer who swapped Jev into an existing LLM pipeline that classifies thousands of tax documents and reported **34 times lower cost and 6 times faster**. Self-reported on X, but it's the kind of like-for-like swap worth copying.\n- **Zapier.** Berman (in a segment Zapier sponsored) showed Jev as a built-in action in Zapier, so any of its 9,000-plus connected apps can route through a decision. His example accepts or declines calendar invites against criteria you write. (Letting it decline on your behalf is a permission question; more on that in the harness lesson.)\n- **Agent commands.** An agent proposes deleting a build folder and force-pushing. Jev reads the command and recommends asking the user first. It's cheap enough to run on every step, which is exactly what you'd want from a guardrail.",
          },
        ],
      },
      {
        heading: 'Placement 2: a filter over a big pile',
        blocks: [
          {
            type: 'text',
            md: "The second placement points Jev at a pile too big for a person to read, and asks it where attention should go. The job is triage.\n\nJones's favorite example comes from a bioscientist who gave Jev 10,000 immunology research questions, all grounded in the literature, and asked for the 100 most important. Jev came back with roughly the list the scientist would have picked. Jones is careful about what that means. Jev picked which questions deserved expensive attention; answering them is LLM-shaped work, and human work too.",
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'How you rank 10,000 things with a 255-option limit',
            md: "You can't put 10,000 candidates in one Choice question. Score each candidate on its own instead: one request per item, a Score question like *how important is this question for the field right now* with four or five described levels. Sort the scores in code and keep the top 100. If each request runs about 300 tokens, the whole job is 3 million tokens, about 13 cents. Every item gets judged against the same yardstick, and the ranking is plain arithmetic.",
          },
          {
            type: 'text',
            md: "More piles people sorted in week one:",
          },
          {
            type: 'table',
            headers: ['Pile', 'What Jev did', 'Reported result'],
            rows: [
              ['20,000 emails, Slack messages, and call transcripts', 'Flagged complaints, upsell chances, and missed follow-ups for one entrepreneur', 'About 7 minutes and $1 total (via Jones)'],
              ['An inbox sorted by time', 'Re-sorted it by how much each email needs a reply', '100 emails in under half a second (via Berman)'],
              ['A long YouTube video', 'Vogel\'s clipper transcribes it word by word, then scores candidate moments for how clip-worthy they are', '17 moments scored in about 3 seconds; he built it in about 10 minutes'],
              ['A 90-minute video plus a topic you type', 'Clipfast finds every segment about that topic', 'Clips in under 2 seconds (via Berman)'],
              ['Your old inbox', 'Vogel\'s suggestion: rerun lead scoring over years of history', 'Leads you missed the first time, found for pennies'],
            ],
          },
        ],
      },
      {
        heading: 'Placement 3: the outer loop',
        blocks: [
          {
            type: 'text',
            md: "The third placement flips who's in charge. Normally an LLM drives an agent and calls tools. Here Jev drives and the generative models become tools. Jones credits James Ward with the phrase: put the classifier in the **outer loop** of the harness, and the generative models inside it.\n\nAt each step, Jev looks at the current state (a document halfway through a business process, say) and picks what happens next: run a plain tool, call a cheap LLM to write something, call a frontier model because this case is hard and unusual, or hand it to a person. Most steps take the cheap path, and only the exceptions pay for the expensive ones.",
          },
          {
            type: 'text',
            md: "Browsing the web turns out to be the same problem. A web page offers a limited set of buttons, links, and fields, so an agent's next move is a choice among them. Browser Use released an open-source agent where Jev picks an operation and an element at each step. In a real-time demo from the Browser Use team, which Vogel played on the show, it picked a flight from Zurich to London in **7.1 seconds**. Vogel guessed a standard browser agent would take one to three minutes on the same task.\n\nBerman offered a good analogy for why speed changes the answer. Put Jev against Claude Fable at chess and Fable wins. Put a clock on the game and Jev probably wins, because Fable spends so long thinking on each move that it runs out of time.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The outer loop is where fences matter most',
            md: "A classifier driving a loop is powerful and easy to get wrong. The harness lesson at the end of this module is a careful version of this exact placement: the host builds the menu of next steps, Jev picks, the host checks the pick again, and nothing Jev chooses bypasses permissions.",
          },
        ],
      },
      {
        heading: 'Placement 4: no LLM at all',
        blocks: [
          {
            type: 'text',
            md: "Jones calls the last placement the most exciting, and it's the easiest to miss. Your code supplies every possible component and action. No LLM is involved anywhere. Jev reads what the user is doing and picks the right response, live, fast enough to feel like part of the interface.\n\nHis best example is a spreadsheet. A user types *Urgency* as a column header, and Jev reads that, understands the column needs a judgment, and fills in every row. Add another column for missing information and another for the responsible team. Then ordinary spreadsheet formulas combine those judgments with dates and dollar amounts. That split is exactly right, by the way: Jev handles the language, and the formulas handle the date math Jev is bad at.",
          },
          {
            type: 'table',
            headers: ['Build (from Berman\'s video unless noted)', 'The menu your code supplies', 'What Jev decides'],
            rows: [
              ['Web pages built live', 'A library of UI components: buttons, fields, sign-in blocks, fonts', 'Which components this visitor needs, assembled in under a second'],
              ['Smarter find-in-page (open source, by a Google product manager)', 'Every passage on the page', 'Which passages match what you meant, even without the exact words'],
              ['Unclutter, by Kitze', 'Every element on the page, plus a description of what counts as annoying', 'Which ads, cookie banners, and upsells to strip as the page loads'],
              ['AI-slop detector', 'Sections of a page or a piece of writing', 'How much of it reads as machine-written, and which parts'],
              ['Color palettes', 'A set of colors', 'Which ones go with "80s disco" or "Luigi"'],
              ['Emoji picker', 'The emoji set', 'Which emoji fit "starting a band" as you type'],
            ],
          },
          {
            type: 'text',
            md: "The last two are toys, and they still teach something. Picking Luigi's colors means Jev knows a lot about the world, even though it can't write a sentence about any of it.",
          },
        ],
      },
      {
        heading: 'The expensive-queue test',
        blocks: [
          {
            type: 'text',
            md: "Isenberg kept pushing Vogel toward one question, and it's the most reusable idea in the interview: **find a business with an expensive queue of incoming information, and put Jev at the front of it.** A queue here means anything where requests pile up and someone has to read each one before anything can happen.\n\nVogel's answer was a local-services marketplace. Someone types *I need my driveway power washed*. Code pulls the nearby businesses that offer that service (a database query, no AI needed). Jev picks the best fit from that shortlist, well under the 255-option limit, and the customer gets a match right away. The same move fixes every \"get an instant quote\" form that really means \"we'll email you tomorrow.\" A genuinely instant answer tells a prospect you won't waste their time.",
          },
          {
            type: 'table',
            headers: ['Where to look', 'The queue', 'What the Jev decision is'],
            rows: [
              ['Sales', 'Inbound leads and contact forms', 'Good lead or not, and how urgent'],
              ['Support', 'Tickets and chat messages', 'Which team, answer today or not, churn risk'],
              ['Operations', 'Documents arriving for processing', 'What kind of document, and which workflow'],
              ['Marketplaces', 'Requests waiting for a match', 'Which provider on the shortlist fits'],
              ['Engineering', 'Agent tool calls waiting to run', 'Safe, needs a human, or blocked'],
              ['Content', 'Hours of video or piles of writing', 'Which parts are worth a person\'s time'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Let your agent find the queues',
            md: "Vogel and Jones both landed on the same shortcut. Describe your work to your coding agent and ask which daily decisions could go to a model like Jev. Jones's version for a codebase: ask the agent to find places where the project asks an LLM to choose among defined outcomes, build a Jev version, then compare results, speed, and cost and report back. TypeSafe's homepage has a copy-and-paste setup prompt for agents that installs a TypeSafe skill. Read that skill before you run it, the same way you'd vet any config you didn't write ([Bonus: Field Notes · Borrowed Setups: Harvesting Configs You Did Not Write](lesson:m10-l3)).",
          },
        ],
      },
      {
        heading: 'The Jevons paradox: why cheap judgment creates more work',
        blocks: [
          {
            type: 'text',
            md: "Jones reads the name Jev as a nod to William Stanley Jevons, a 19th-century economist. In 1865 Jevons noticed something odd about coal. Steam engines had gotten far more efficient, so you'd expect Britain to burn less coal. It burned more, because cheap power made coal worth using for jobs nobody had bothered with before. Economists call that the [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox).",
          },
          {
            type: 'text',
            md: "Run Jones's numbers. A request with 1,000 input tokens costs $0.000042. Ten thousand of them cost 42 cents, and a million cost **$42**. If classification is 10% of your AI bill today and it drops to about 1%, you've saved most of that slice. That's the small win.\n\nThe bigger effect is all the judgment you never paid for. A company that samples one customer call in fifty can now check every call for several different problems. Documents tagged once can be re-tagged across their whole history every day when priorities change. And a safety check that only made sense at the start of an agent task can run at every step.",
          },
          {
            type: 'text',
            md: "Jones's twist is that none of this shrinks the LLM's job. More classification surfaces more exceptions, more opportunities worth a real answer, and more cases that need a frontier model or a person to think hard. The whole pie of useful AI work gets bigger, and the expensive models end up spending their time on the hard parts.",
          },
        ],
      },
      {
        heading: 'Where it falls over',
        blocks: [
          {
            type: 'text',
            md: "All three videos included a limits segment, and they line up with the independent testing from the first lesson.",
          },
          {
            type: 'text',
            md: "- **Predicting what isn't in the text.** Vogel wired Jev to a Bitcoin feed and asked *buy, hold, or sell* every minute. It did poorly. GPT-6 Astra did a little better, mostly because it pulled in news the classifier never saw. His advice: routing-style decisions yes, your portfolio no.\n- **Writing anything.** No code, no advice on talking to your boss, no open-ended answers. Berman's line was that it can assemble a web page from components you supply but can't write the components.\n- **Being in charge.** Vogel said Jev should play a heavy advisory role and never handle 100% of interactions unsupervised. That's the whole thesis of the harness lesson.\n- **Questions with fuzzy boundaries.** Berman's demo asked whether a hot dog is a sandwich. With a careful definition of sandwich in the criteria, Jev said yes at 0.73. Change the definition and the answer moves. Your criteria are the decision.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The test Jones says to run every time',
            md: "Before trusting any placement, compare Jev against whatever it replaces: the LLM call, the old classifier, or you doing it by hand. It will almost always be cheaper. Whether it's good enough is a question only your own data can answer, which is what the shadow eval in the next lesson is for.",
          },
        ],
      },
    ],
    lab: {
      title: 'Sweep a Project for Jev-Shaped Problems',
      intro:
        "Use your coding agent to find where a decision model belongs in something you actually run, then sort what it finds with the four placements and the expensive-queue test. Sixty minutes, no Jev key required until the last step.",
      steps: [
        'Pick a real repo or workflow: a project in ~/sd, your inbox rules, your Trello boards, or a business process you know well.',
        'In Claude Code, ask for a sweep in your own words: find every place this project asks an LLM to choose among defined outcomes, and every decision a person makes by reading text and picking one of a few options. Ask for file paths or process steps for each one.',
        'Add three decisions you currently skip because judgment felt too expensive (reading every support email, re-tagging old documents, checking every agent command).',
        'Label every candidate with its placement: front of the queue, filter over a pile, outer loop, or no-LLM feature. Cross off anything that needs writing, math, dates, or facts that are not in the text.',
        'Apply the expensive-queue test to the survivors: how many items per week, how long a person or an LLM takes per item, and what a faster answer would change.',
        'If you want to try TypeSafe\'s agent setup prompt, open the skill it installs and read it before letting your agent run it.',
        'Pick the single best candidate and write it up as a state plus typed questions. That becomes the decision you shadow-eval in the next lesson.',
      ],
      checklist: [
        'My agent produced a list of candidate decisions with locations in a real project',
        'I added at least three judgments I skip today because they seemed too expensive',
        'Every candidate is labeled with one of the four placements, and the bad fits are crossed off',
        'I ran the expensive-queue numbers (volume, time per item, what speed would change) on the survivors',
        'One winner is written up as a state plus typed questions',
      ],
    },
    checkQuiz: [
      {
        q: 'Ryan Vogel triaged 1,700 emails with four Jev questions each and used 4.2 million input tokens. At $0.042 per million input tokens, what did it cost?',
        options: ['About $0.02', 'About $0.18', 'About $1.76', 'About $17.60'],
        answer: 1,
        explain:
          '4.2 times $0.042 is $0.176, which is the 18 cents Vogel reported. Output tokens are free, so the 500,000 output tokens he also saw added nothing.',
      },
      {
        q: 'A spreadsheet uses Jev to fill an "Urgency" column, then a formula combines urgency with how many days each invoice is overdue. Why is that split right?',
        options: [
          'Formulas are faster than Jev',
          'Jev handles the language judgment, and the formula handles date arithmetic, which Jev is bad at',
          'Jev cannot read spreadsheets',
          'It is not right; Jev should compute the days overdue too',
        ],
        answer: 1,
        explain:
          'Each block does what it is good at. Dates as quantities are a documented Jev weak spot, while plain formulas get them right every time for free.',
      },
      {
        q: 'In the outer-loop placement, what does Jev decide at each step?',
        options: [
          'The exact text of the next message',
          'Which of a defined set of next steps to take: a plain tool, a cheap LLM, a frontier model, or a human',
          'Whether to retrain itself',
          'How many tokens the LLM may use',
        ],
        answer: 1,
        explain:
          'Jev drives and the generative models become tools it can call. Most steps take the cheap path and only the hard exceptions reach the expensive model or a person.',
      },
      {
        q: 'According to Nate B. Jones\'s Jevons-paradox argument, what happens to LLM usage as cheap classification spreads?',
        options: [
          'It falls to near zero',
          'It stays exactly the same',
          'It tends to grow, because more classification surfaces more exceptions and opportunities that need a model that can reason and write',
          'It moves entirely to local models',
        ],
        answer: 2,
        explain:
          'Cheap judgment finds more work worth doing. Some of that work is hard and needs a frontier model or a person, so the total pie of useful AI work grows.',
      },
    ],
    resources: [
      { label: 'Greg Isenberg with Ryan Vogel: Jev is HERE. How to use it', url: 'https://www.youtube.com/watch?v=4mTLpuQpB80', kind: 'video' },
      { label: 'Matthew Berman: 8 Jev use cases that feel like cheating', url: 'https://www.youtube.com/watch?v=jGD_UR4wMJc', kind: 'video' },
      { label: 'Nate B. Jones: Why developers are losing their minds over AI that can\'t write', url: 'https://www.youtube.com/watch?v=tYugqJ9YytQ', kind: 'video' },
      { label: 'Nate B. Jones: the full post on Jev use cases', url: 'https://natesnewsletter.substack.com/p/jev-classifier-use-cases', kind: 'article' },
      { label: 'Vercel AI Gateway (instant Jev access)', url: 'https://vercel.com/ai-gateway', kind: 'docs' },
      { label: 'Jevons paradox (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Jevons_paradox', kind: 'article' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m11-l2: Using Jev well (questions, decomposition, patterns, shadow eval, Laya)
  // ────────────────────────────────────────────────────────────
  {
    id: 'm11-l2',
    title: 'Writing Questions Jev Can Answer: Decompose, Gate, Cascade',
    day: 25,
    minutes: 60,
    xp: 130,
    objectives: [
      'Make a Jev call from Python, read every field in the response, and pin a model version',
      'Write atomic questions whose criteria agree with the question being asked',
      'Explain how splitting one fuzzy question into five narrow ones took a phishing detector from 62.6% to 95.0%',
      'Apply the five patterns that keep showing up: fan-out, confidence gates, composite scores, the cascade, and retrieve-then-judge',
      'Run a shadow eval against your own labeled decisions before trusting any accuracy number, TypeSafe\'s included',
      'Run Laya, the open-source Jev-compatible model, on your Mac, and say where it falls short',
    ],
    skipQuiz: [
      {
        q: 'Asked "is this email phishing?" as one question, Jev scored 62.6%. What change got it to 95.0%?',
        options: [
          'Switching to the jev-latest model',
          'Adding "think step by step" to the instructions',
          'Splitting the judgment into five narrow questions about specific signals and combining the answers with a small model fit on labeled examples',
          'Sending the email as JSON instead of plain text',
        ],
        answer: 2,
        explain:
          'The researchers asked about individual signals (shortened URLs, free hosting, a free email address claiming to be a company) and let a logistic regression trained on 1,000 labeled emails weigh them. Question design did the work.',
      },
      {
        q: 'In the confidence-gated routing pattern, how should thresholds differ by action?',
        options: [
          'One threshold for everything, so behavior stays predictable',
          'Lower thresholds for read-only actions, higher ones for actions that change state',
          'Higher thresholds for read-only actions, since those run more often',
          'No thresholds; always take the top choice',
        ],
        answer: 1,
        explain:
          'Being wrong about a read-only action costs little, so you can act on a 0.7. Being wrong about a refund or a deploy costs a lot, so demand 0.95 and send everything below it to a human or a bigger model.',
      },
      {
        q: 'What is a shadow eval?',
        options: [
          'Running Jev on past decisions whose right answers you already know, without acting on its output, to measure accuracy and calibration on your data',
          'Letting Jev grade an LLM\'s answers',
          'A TypeSafe benchmark run on hidden data',
          'Testing Jev with the network disconnected',
        ],
        answer: 0,
        explain:
          'You run the new model alongside your existing process on data with known answers and compare. The whole pre-registered phishing study, 5,721 calls, cost $0.176, so there is no excuse to skip this.',
      },
      {
        q: 'A Noul question asks "Is the customer calm?" with criteria saying true means "the customer is angry." What happens?',
        options: [
          'Jev flags the contradiction and returns an error',
          'Nothing; criteria are ignored for Noul',
          'Answer quality drops, because the question and its criteria ask for different things',
          'Jev silently inverts the answer and gets it right',
        ],
        answer: 2,
        explain:
          'TypeSafe\'s docs call this out directly: when a question and its criteria disagree, Jev answers worse. Write criteria as an extension of the question, never a correction of it.',
      },
      {
        q: 'Laya is an open-source model that speaks the same API as Jev. What is the catch?',
        options: [
          'It needs a 96GB GPU',
          'Its base checkpoints score near chance zero-shot on a hard typed-decision benchmark, so it needs fine-tuning on your data to compete',
          'It only answers Noul questions',
          'It sends your data to TypeSafe',
        ],
        answer: 1,
        explain:
          'Laya\'s own README reports base checkpoints at 0.35 to 0.36 on its typed-decisions benchmark against a random baseline of 0.318. Its head-to-head win over Jev comes from a checkpoint trained for that job. Treat it as a strong starting point for a tuned local model.',
      },
    ],
    sections: [
      {
        heading: 'Your first call',
        blocks: [
          {
            type: 'text',
            md: "As of late September 2026, direct API access runs through a waitlist at [typesafe.ai](https://typesafe.ai/). Once you're in, you get a key that starts with `sk-`, and the SDKs read it from an environment variable called `TYPESAFE_API_KEY`. Jev also showed up quickly on other platforms: Vercel's AI Gateway lists it as `typesafe-ai/jev` at the same price, and Cloudflare, LangChain, Pydantic AI, and Zapier all shipped integrations in launch week. If you want to try it today, the Gateway is the fast path, and Ryan Vogel and Matthew Berman both pointed people there. New accounts start with $5 of credit, which lasted Vogel's team two full days of heavy demo work.\n\nThe Python SDK installs with `pip install typesafe-sdk` and needs Python 3.10 or newer. Here's the ticket example from the first lesson as real code.",
          },
          {
            type: 'code',
            lang: 'python',
            code: `from typesafe import TypeSafeClient, Choice, Score, Noul

# Pin a version. "jev-latest" moves to new releases without notice.
client = TypeSafeClient(model="jev-1.13.0")

response = client.system_one(
    state={"ticket": ticket_text, "plan": "pro", "open_tickets": 2},
    questions={
        "team": Choice(
            instructions="Which team should handle this ticket?",
            criteria={
                "billing": "Payment, invoice, or subscription issues",
                "technical": "Bugs, outages, or integration problems",
                "other": "Anything else",
            },
        ),
        "frustration": Score(
            instructions="How frustrated does the customer sound?",
            criteria=["Calm, just stating facts", "Annoyed but civil", "Angry, threatening to leave"],
        ),
        "wants_refund": Noul(instructions="Does the customer ask for money back?"),
    },
)

team = response.answers["team"]
print(team.choice, team.confidence, team.probabilities)
print(response.answers["frustration"].score)
print(response.answers["wants_refund"].noul)
print(response.model)  # the exact version that answered`,
            caption: 'Adapted from the launch-week SDK guides. Check the current package and import names against TypeSafe\'s docs before you copy it, since a two-week-old SDK can move.',
          },
          {
            type: 'text',
            md: "Two habits to build on day one. First, **pin the version**. `jev-latest` resolves to whatever TypeSafe shipped most recently, which can quietly shift your answers overnight. Pinning `jev-1.13.0` means a behavior change only happens when you change the string. Second, **handle the errors** the API reference lists: 422 means your request was malformed, and 429 (rate limit) and 529 (overloaded) mean wait and retry with growing gaps between attempts, a technique called [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff).",
          },
        ],
      },
      {
        heading: 'Questions are the whole skill',
        blocks: [
          {
            type: 'text',
            md: "TypeSafe's own docs say learning to write good questions is most of the skill of using Jev. That tracks, because Jev reads your question literally and has no chance to ask what you meant. A chat model can reason its way past a sloppy prompt. Jev just answers the sloppy prompt.\n\nFive rules cover most of it.",
          },
          {
            type: 'text',
            md: "- **Keep each question atomic.** One judgment per question, something a sharp person decides in a few seconds. \"Is this a good lead?\" hides five judgments. Ask them separately.\n- **Make the criteria agree with the question.** Criteria extend a question; they never correct it. A Noul asking \"Is the customer calm?\" whose `true` description says \"the customer is angry\" will get worse answers, per TypeSafe's docs.\n- **Ask in the positive.** Negation lands at face value. \"Is this unrelated to billing?\" is shakier than \"Is this about billing?\", and you can flip the probability in code for free.\n- **Name options plainly and describe them.** One unreplicated study found renaming answer options changed about a third of the answers. `billing` with the description \"payment, invoice, or subscription issues\" beats a code name like `Q2_FIN`.\n- **Send only the fields that matter.** Extra text in the state drags accuracy down, the same context rot you met in [Mental Models · Context Engineering](lesson:m0-l4). Filter in code first.",
          },
          {
            type: 'compare',
            left: {
              title: 'Question that fights the model',
              items: [
                'Choice: "Is this lead worth pursuing, and which rep should get it?"',
                'Options: `yes_a`, `yes_b`, `no`',
                'State: the full CRM export, 40 fields, most irrelevant',
                'Noul: "Is this not a bad fit?"',
              ],
            },
            right: {
              title: 'Same intent, split and cleaned',
              items: [
                'Noul: "Does the company describe a problem our product solves?"',
                'Score: "How ready to buy do they sound?" with four described levels',
                'Choice: "Which region are they in?" with regions as options, then pick the rep in code',
                'State: company description, the inbound message, headcount. Nothing else.',
              ],
            },
          },
          {
            type: 'text',
            md: "Criteria do the most work on questions with fuzzy edges. Matthew Berman's demo asked the internet's favorite argument, whether a hot dog is a sandwich, and spelled out what each answer means. It even defined a term used inside the criteria.",
          },
          {
            type: 'code',
            lang: 'json',
            code: `{
  "state": "hot dog",
  "questions": {
    "is_sandwich": {
      "type": "noul",
      "instructions": "Is this food a sandwich?",
      "criteria": {
        "true": "A food dish where a filling such as meat, cheese, vegetables, or spread is placed between structural starch.",
        "false": "The food has no bread enclosing a filling, uses only a single slice of bread, or uses a non-bread wrapper such as a tortilla, wafer, or cookie."
      }
    }
  }
}`,
            caption: 'Reconstructed from Berman\'s demo, which also added a definition of "food" to the state. Jev answered true at 0.73. Tighten the definition of structural starch and the number moves: your criteria are the decision.',
          },
        ],
      },
      {
        heading: 'Decomposition: the 62.6% to 95% story',
        blocks: [
          {
            type: 'text',
            md: "The single most useful experiment from Jev's first week came from a [phishing study](https://www.beri.net/article/typesafe-jev-typed-decision-model-calibration-decomposition-shadow-eval) that compared Jev with Claude Haiku 4.5 on 2,000 synthetic emails, half legitimate and half phishing. The clues in this dataset sat mostly in the links and the sender, with little in the body text.\n\nAsked one question, \"is this phishing?\", Jev scored **62.6%**, well behind Haiku at 81.3%. It caught only 43.2% of the actual phishing and wrongly flagged 18.0% of the real mail. On its own, that's a failing grade.",
          },
          {
            type: 'text',
            md: "Then the researchers broke the judgment into five narrow questions, each about one signal: is there a shortened URL, is the link on a free hosting service, does a free email address claim to represent a company, and so on. Each one is a quick, checkable call. They then fit a **logistic regression** on 1,000 of the labeled emails. That's a small formula that learns how much weight each yes/no answer deserves (a free-hosting link might count triple, a shortened URL once). Scored on the other 1,000 emails, which the formula had never seen, Jev hit **95.0%**.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Phishing accuracy: one question vs five</text>
  <line x1="150" y1="250" x2="660" y2="250" stroke="#52525b" stroke-width="1.5"/>
  <g font-size="10" fill="#71717a" text-anchor="middle">
    <text x="150" y="266">50%</text>
    <text x="320" y="266">70%</text>
    <text x="490" y="266">90%</text>
    <text x="575" y="266">100%</text>
  </g>
  <text x="140" y="80" fill="#e4e4e7" font-size="12" text-anchor="end">One question</text>
  <rect x="150" y="62" width="107" height="22" fill="#e879f9" rx="3"/>
  <text x="265" y="78" fill="#e879f9" font-size="11">Jev 62.6%</text>
  <rect x="150" y="90" width="266" height="22" fill="#38bdf8" rx="3"/>
  <text x="424" y="106" fill="#38bdf8" font-size="11">Haiku 4.5 81.3%</text>
  <text x="140" y="170" fill="#e4e4e7" font-size="12" text-anchor="end">Five questions</text>
  <rect x="150" y="152" width="383" height="22" fill="#e879f9" rx="3"/>
  <text x="541" y="168" fill="#e879f9" font-size="11">Jev 95.0%</text>
  <rect x="150" y="180" width="367" height="22" fill="#38bdf8" rx="3"/>
  <text x="525" y="196" fill="#38bdf8" font-size="11">Haiku 4.5 93.2%</text>
  <text x="405" y="236" fill="#a1a1aa" font-size="11" text-anchor="middle">five-question gap not statistically significant (p = 0.063)</text>
</svg>`,
            caption: 'Both models improved massively once the question was split. The design did the work; Jev\'s advantage after the split was cost.',
          },
          {
            type: 'text',
            md: "Read the result carefully. Haiku improved too, to 93.2%, and the 1.8-point gap between them wasn't statistically significant (the p-value of 0.063 means a gap that size could plausibly show up by chance). **Decomposition fixed a failing question for both models.** Once it was fixed, Jev did the same job at a fraction of the cost. With five questions per email, Haiku's bill rose to $1.02 per thousand emails, about 27 times Jev's. The entire pre-registered study, 5,721 calls, cost $0.176 at list price.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Why splitting works so well for a System One model',
            md: "Jev makes one gut call per question, with no room to reason through several factors. \"Is this phishing?\" asks it to weigh a dozen clues at once in its head. \"Is this link on a free hosting service?\" asks it to notice one thing. Let the model notice, and let code do the weighing.",
          },
        ],
      },
      {
        heading: 'Five patterns that keep showing up',
        blocks: [
          {
            type: 'text',
            md: "Within a week, the community had converged on five ways of wiring Jev into software. You'll use at least three of them in anything real.",
          },
          {
            type: 'table',
            headers: ['Pattern', 'What it means', 'When to reach for it'],
            rows: [
              ['**Speculative fan-out**', 'Ask every question you might need in one call, even ones you may not use', 'Almost always. Extra questions cost a few tokens and almost no time.'],
              ['**Confidence-gated routing**', 'Act automatically only above a threshold, with thresholds set per action risk', 'Any time a wrong decision has a real cost'],
              ['**Composite scoring**', 'Score several independent dimensions, then combine them with weights in code', 'Fuzzy judgments like lead quality or ticket priority'],
              ['**The cascade**', 'Plain code first, Jev for triage, a frontier LLM only for the hard leftovers', 'High volume where most cases are easy'],
              ['**Retrieve then judge**', 'Fetch and filter context in code, then send Jev only the relevant fields', 'Whenever the raw input is long or noisy'],
            ],
          },
          {
            type: 'text',
            md: "Confidence gating is the one that turns probabilities into behavior, so here it is in code. Notice the thresholds live next to the actions, and the fallback is written down before anything runs.",
          },
          {
            type: 'code',
            lang: 'python',
            code: `# How sure must we be before acting without a human?
THRESHOLDS = {
    "tag_ticket":    0.70,  # read-only label; cheap to be wrong
    "send_faq_link": 0.85,  # customer-visible, easy to undo
    "issue_refund":  0.97,  # moves money; expensive to be wrong
}

def decide(action: str, confidence: float) -> str:
    if confidence >= THRESHOLDS[action]:
        return "auto"
    return "escalate"  # human queue, or a bigger model

answer = response.answers["team"]
route = decide("tag_ticket", answer.confidence)`,
            caption: 'The pattern only works if the confidence is calibrated on your data, which is what the shadow eval below is for.',
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="280" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">The cascade: cheapest tool that can decide, first</text>
  <g font-size="11" text-anchor="middle">
    <rect x="20" y="110" width="110" height="56" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="6"/>
    <text x="75" y="134" fill="#e4e4e7">1,000 items</text>
    <text x="75" y="150" fill="#71717a" font-size="10">arrive</text>
    <rect x="165" y="110" width="120" height="56" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="6"/>
    <text x="225" y="134" fill="#34d399">plain code rules</text>
    <text x="225" y="150" fill="#71717a" font-size="10">free, instant</text>
    <rect x="320" y="110" width="120" height="56" fill="#27272a" stroke="#e879f9" stroke-width="2" rx="6"/>
    <text x="380" y="134" fill="#e879f9">Jev triage</text>
    <text x="380" y="150" fill="#71717a" font-size="10">~100 ms, ~free</text>
    <rect x="475" y="110" width="100" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <text x="525" y="134" fill="#38bdf8">frontier LLM</text>
    <text x="525" y="150" fill="#71717a" font-size="10">seconds, cents</text>
    <rect x="605" y="110" width="80" height="56" fill="#27272a" stroke="#fbbf24" stroke-width="1.5" rx="6"/>
    <text x="645" y="134" fill="#fbbf24">human</text>
    <text x="645" y="150" fill="#71717a" font-size="10">minutes</text>
  </g>
  <g stroke="#52525b" stroke-width="1.5">
    <line x1="130" y1="138" x2="163" y2="138"/>
    <line x1="285" y1="138" x2="318" y2="138"/>
    <line x1="440" y1="138" x2="473" y2="138"/>
    <line x1="575" y1="138" x2="603" y2="138"/>
    <line x1="225" y1="166" x2="225" y2="210"/>
    <line x1="380" y1="166" x2="380" y2="210"/>
    <line x1="525" y1="166" x2="525" y2="210"/>
  </g>
  <g font-size="10" fill="#a1a1aa" text-anchor="middle">
    <text x="225" y="226">300 settled</text>
    <text x="225" y="240">(exact matches)</text>
    <text x="380" y="226">600 settled</text>
    <text x="380" y="240">(confident calls)</text>
    <text x="525" y="226">90 settled</text>
    <text x="525" y="240">(hard cases)</text>
    <text x="645" y="196">10 left</text>
  </g>
  <text x="302" y="100" fill="#71717a" font-size="10" text-anchor="middle">700 pass</text>
  <text x="457" y="100" fill="#71717a" font-size="10" text-anchor="middle">100 unsure</text>
  <text x="590" y="100" fill="#71717a" font-size="10" text-anchor="middle">10</text>
</svg>`,
            caption: 'Illustrative volumes. Each layer settles what it can and passes the rest along, so the expensive layers only see the cases that need them.',
          },
          {
            type: 'text',
            md: "The cascade is the same idea you learned in [Local Models · Routing the 80/20](lesson:m4-l5), with a new, very cheap layer slotted in. LangChain shipped two ready-made versions in launch week. `ModelRouterMiddleware` asks Jev to pick the cheapest model that can handle each incoming request, which is model routing. `AutoModeMiddleware` asks Jev to classify a tool call's risk before the agent runs it, which is a guardrail of the kind covered in [Agents, Harnesses & Loops · Cost-Aware Agents & Guardrails](lesson:m2-l9).",
          },
          {
            type: 'code',
            lang: 'python',
            code: `from langchain.agents import create_agent
from langchain_typesafe.experimental.middleware import ModelChoice, ModelRouterMiddleware

router = ModelRouterMiddleware(
    choices={
        "fast": ModelChoice(model="openai:luna", criteria="Direct lookups, extraction, and localized changes."),
        "powerful": ModelChoice(model="openai:sol", criteria="Architecture and high-stakes decisions."),
    },
    instructions="Choose the least costly model that can complete the task.",
)

agent = create_agent("openai:gpt-5.6-luna", middleware=[router])`,
            caption: 'From LangChain\'s launch-week post. The package lives under `experimental`, so expect the names to change.',
          },
        ],
      },
      {
        heading: 'Shadow eval before you trust anything',
        blocks: [
          {
            type: 'text',
            md: "Every accuracy number in the first lesson came from somebody else's data. Yours will be different. A **shadow eval** is how you find out cheaply: run Jev on decisions you've already made, where you know the right answer, without letting its output touch anything. Then compare. It's the same verification instinct from [Agents, Harnesses & Loops · Verification: the #1 Quality Lever](lesson:m2-l4), pointed at a model instead of a code change.",
          },
          {
            type: 'text',
            md: "- **Collect 1,000 to 2,000 past decisions with known answers.** Old tickets with their final team, emails you marked spam or kept, cards you did or didn't escalate. A few hundred will do for a first pass.\n- **Split them.** Set aside 50 to 300 for tuning and keep the rest untouched for the final score. Tuning on the same examples you grade on flatters every result.\n- **Run your questions on everything.** Record the answer, the probabilities, and the confidence for each item.\n- **Fit the temperature** on the tuning slice, which in the eight-day review cut calibration error by 74%.\n- **Score the held-out slice twice**: plain accuracy, then accuracy inside each confidence bucket. The second number tells you where to put your thresholds.\n- **Try the decomposed version** of your weakest question and run it again. Compare cost as well as accuracy.",
          },
          {
            type: 'table',
            headers: ['Record per item', 'Why you want it'],
            rows: [
              ['Input id and the exact state sent', 'Reproduce any strange answer later'],
              ['Question version and model version', 'Know which wording and which model produced it'],
              ['Answer, probabilities, confidence', 'Build the reliability chart and pick thresholds'],
              ['The known right answer', 'The whole point'],
              ['Latency and token count', 'What it costs and how fast it runs on your inputs, which is the number that counts'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The price of skipping this',
            md: "At Jev's prices, a 2,000-item shadow eval costs well under a dollar. The phishing study's entire run cost $0.176. Skipping the eval saves you nothing and leaves you trusting someone else's benchmark on someone else's data.",
          },
        ],
      },
      {
        heading: 'Laya: a Jev-compatible model on your own Mac',
        blocks: [
          {
            type: 'text',
            md: "Within days of launch, open-source clones appeared. The one worth knowing is [Laya](https://github.com/NandhaKishorM/laya), from Convai Innovations, released under the permissive Apache 2.0 license. Its server speaks the exact same `POST /v1/systemone` protocol as Jev, so any Jev client can point at it instead.\n\nLaya is tiny next to what you run on the Mac mini. The English checkpoint is built on ModernBERT-large, an encoder with 421 million parameters and a 512-token context window. The multilingual one is smaller still at 322 million. Your 64GB machine from [Bonus: Your Own Model Server · Picking Models for a 64GB Mac mini](lesson:m9-l2) won't notice it, and Laya runs on Apple Silicon through PyTorch's Metal backend (called MPS).",
          },
          {
            type: 'code',
            lang: 'python',
            code: `# pip install laya
from laya import Router

router = Router()
state = "Hi, we were billed twice for March. Refund the duplicate today or we cancel."
questions = {
    "department": {"type": "choice", "instructions": "Which department should handle this?",
                   "criteria": {"billing": "invoices, payments, refunds",
                                "technical": "bugs, outages, system errors",
                                "other": "everything else"}},
    "churn_risk": {"type": "noul", "instructions": "Does the user threaten to cancel or leave?"},
}
result = router.predict(state, questions)
print(result["answers"]["department"]["choice"])
print(result["answers"]["churn_risk"]["noul"])`,
            caption: 'From Laya\'s README. For the Jev-compatible HTTP server, clone the repo, install the serve extra, and run its example server on port 8000.',
          },
          {
            type: 'text',
            md: "Now the honest part, straight from Laya's own README. Its authors report beating Jev on their typed-decisions benchmark (0.766 versus 0.727) and running about 7.8 times faster (33 milliseconds versus 236 to 276 on a T4 graphics card). The same README says the base checkpoints score near chance zero-shot on that benchmark: 0.35 to 0.36 against a random baseline of 0.318. So the win belongs to a checkpoint trained for the job, and the README says outright that fine-tuning on your own data is essential. It also warns that Noul answers can follow the wording of your labels instead of the content of the state.",
          },
          {
            type: 'compare',
            left: {
              title: 'Hosted Jev',
              items: [
                'Works on your first try with plain-English questions',
                'About 100 ms plus network time',
                'Your text leaves your machine',
                'Waitlisted, and you pay per token (very little)',
              ],
            },
            right: {
              title: 'Local Laya',
              items: [
                'Needs labeled examples and fine-tuning before it\'s good on a new job',
                'About 33 ms on a modest GPU, no network',
                'Nothing leaves the Mac',
                'Free, Apache 2.0, and you own the upkeep',
              ],
            },
          },
          {
            type: 'text',
            md: "A sensible path for a repeated decision: prove the questions work on Jev, collect its answers plus your corrections as labels, then fine-tune Laya on those labels if privacy or volume makes local worth it. The eight-day review landed in the same place: for many-option, non-English, or specialized jobs, a small open model trained on task labels beat Jev in every case it tested.",
          },
        ],
      },
    ],
    lab: {
      title: 'Shadow-Eval One Real Decision',
      intro:
        "Take the winner from your Jev-shaped problems sweep (or one of the three decisions you priced in the first lesson) and find out whether a System One model can make it on your data. Budget ninety minutes. Everything here runs on the Mac mini; add hosted Jev if you are off the waitlist.",
      steps: [
        'Gather 150 past examples of the decision with the right answer you chose at the time. Put them in a CSV with columns `id`, `text`, `label`. Hold out 100 for scoring and keep 50 for tuning.',
        'Write your questions as a JSON file, following the five rules: atomic, criteria that agree with the question, positive phrasing, plain option names with descriptions, and a trimmed state.',
        'In a Python virtual environment, `pip install laya` and run the README quick start to confirm it works on Apple Silicon.',
        'Write a script that runs every held-out example through Laya and appends one JSON line per item to `results.jsonl`: id, answer, probabilities, confidence, the right label, and latency.',
        'If you have Jev access, run the same script against Jev with a pinned model version and write to a second file.',
        'Compute accuracy, then accuracy in confidence buckets of 0.5-0.7, 0.7-0.9, and 0.9-1.0. Ask Claude to draw the reliability chart from the JSONL if you want the picture.',
        'Take your weakest question, split it into three to five narrow signal questions, and rerun. Combine the answers with simple weights you choose by hand, or a logistic regression fit on the 50 tuning examples.',
        'Write down a threshold for acting automatically, the fallback below it, and whether this decision is worth wiring into anything.',
      ],
      checklist: [
        'I have 150 labeled examples split into 100 held-out and 50 tuning',
        'Laya ran locally on my Mac and produced a results.jsonl',
        'I know my accuracy overall and inside each confidence bucket',
        'I decomposed one question and measured whether it helped',
        'I wrote down a threshold, a fallback, and a go or no-go call',
      ],
    },
    checkQuiz: [
      {
        q: 'Why pin `jev-1.13.0` instead of using `jev-latest`?',
        options: [
          'Pinned versions are cheaper',
          '`jev-latest` moves to new releases without notice, so answers can shift overnight while your code stays the same',
          '`jev-latest` is a beta that fails often',
          'Only pinned versions return probabilities',
        ],
        answer: 1,
        explain:
          'A model version is part of your program\'s behavior. Pinning it means any change in answers traces back to a change you made on purpose, and you can shadow-eval the new version before switching.',
      },
      {
        q: 'In the phishing study, both Jev and Haiku improved a lot after decomposition. What is the right conclusion?',
        options: [
          'Jev is more accurate than Haiku',
          'Haiku is more accurate than Jev',
          'Question design drove the gain for both, and after the split Jev matched Haiku at a fraction of the cost',
          'Decomposition only helps small models',
        ],
        answer: 2,
        explain:
          'The five-question gap (95.0% vs 93.2%) was not statistically significant. What was significant was the jump from one question to five for both models, and the cost: Haiku at five questions cost about 27 times more than Jev.',
      },
      {
        q: 'Which pattern sends each item to the cheapest layer that can settle it, and only passes leftovers upward?',
        options: ['Speculative fan-out', 'Composite scoring', 'The cascade', 'Retrieve then judge'],
        answer: 2,
        explain:
          'The cascade runs plain code first, then Jev for triage, then a frontier LLM for the hard remainder, then a human. The expensive layers only ever see the cases the cheap ones could not settle.',
      },
      {
        q: 'You want to use Laya locally on a brand-new classification job. What should you expect?',
        options: [
          'It will match hosted Jev immediately, since the API is identical',
          'It will need labeled examples and fine-tuning before it performs well, even though the API is identical',
          'It will not run on Apple Silicon',
          'It only supports Score questions',
        ],
        answer: 1,
        explain:
          'API compatibility means your client code does not change. Accuracy is a different matter: Laya\'s base checkpoints are near chance zero-shot on hard typed decisions, so plan on collecting labels and tuning.',
      },
    ],
    resources: [
      { label: 'Phishing study: 62.6% asked once, 95% split five ways', url: 'https://www.beri.net/article/typesafe-jev-typed-decision-model-calibration-decomposition-shadow-eval', kind: 'article' },
      { label: 'How to Use Jev: a practical guide (patterns and SDK)', url: 'https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e', kind: 'article' },
      { label: 'LangChain: What Is Jev? Building a harness with Jev', url: 'https://www.langchain.com/blog/building-a-harness-with-jev', kind: 'article' },
      { label: 'Laya: open-source Jev-compatible decision engine', url: 'https://github.com/NandhaKishorM/laya', kind: 'repo' },
      { label: 'MarkTechPost: A coding guide to Jev (fan-out and confidence)', url: 'https://www.marktechpost.com/2026/09/23/a-coding-guide-to-typesafe-ai-jev/', kind: 'article' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // m11-l3: Jev inside a harness (Avid's Builder's Guide, Keel 0.2.0)
  // ────────────────────────────────────────────────────────────
  {
    id: 'm11-l3',
    title: 'Jev Inside a Harness: The Builder\'s Guide, Read Closely',
    day: 25,
    minutes: 60,
    xp: 130,
    objectives: [
      'Explain the contract at the center of the guide: the host prepares the menu, the selector picks, the host checks again',
      'Name the two decisions Keel hands to a selector, and why agent loops owned by outside providers stay off-limits',
      'Keep choosing and permitting as separate jobs, and re-validate state before acting on any decision',
      'Design the abstain path and its fallback before writing the call',
      'Write decision records that turn a vague failure into a scenario you can replay',
      'Say what "self-improving" should mean for an agent, and where the human gate belongs',
    ],
    skipQuiz: [
      {
        q: 'In the Builder\'s Guide, who decides which options a selector like Jev may choose from?',
        options: [
          'Jev, based on what it knows about the repo',
          'The host application, which builds the candidate list from what is installed, enabled, and valid right now',
          'The coding provider, through its own tool loop',
          'The user, by typing the options into every prompt',
        ],
        answer: 1,
        explain:
          'The host prepares the menu, the selector picks from it, and the host checks the pick again. The selector can never summon an option the host did not offer.',
      },
      {
        q: 'Jev picks a tool with 0.99 confidence, and the tool normally needs your approval. What should happen?',
        options: [
          'Skip the approval, since confidence is above any reasonable threshold',
          'Ask Jev a second time to confirm',
          'Run it in a sandbox without asking',
          'Run the normal permission path anyway, because selection never grants authority',
        ],
        answer: 3,
        explain:
          'The guide is explicit that a high confidence value grants no authority. Choosing a candidate and approving a dangerous action are separate responsibilities, handled by separate parts of the system.',
      },
      {
        q: 'Why does the host re-check a decision right before acting on it?',
        options: [
          'Because the system may have changed while the decision was in flight, and a stale choice should not act on a changed world',
          'To give the model a second chance to change its mind',
          'To double the logging',
          'Because Jev answers are only valid for one second',
        ],
        answer: 0,
        explain:
          'A provider can go offline or a tool definition can change between the pick and the dispatch. Re-validating at the moment of action keeps an old decision from acting on a system that moved.',
      },
      {
        q: 'According to the guide, what does Keel do with its decision records today?',
        options: [
          'Trains the local model on them every night',
          'Rewrites its routing policy automatically after each failure',
          'Stores them so failures can become replayable scenarios, with a human approving any change',
          'Sends them to TypeSafe to improve Jev',
        ],
        answer: 2,
        explain:
          'The shipped app records what happened. It does not train itself from chat history or silently change policy. Records feed a replay-and-review loop where a person decides which version becomes the new baseline.',
      },
      {
        q: 'Inside Keel\'s embedded agent loop, what does the "answer" focus hand the model?',
        options: ['Every available tool', 'Read-only tools', 'No tools at all', 'Only the shell tool'],
        answer: 2,
        explain:
          'If the selector says the next step is to answer, the host gives the model zero tools. Instead of handing over execution power and hoping it behaves, the host shapes what is possible from the choice.',
      },
    ],
    sections: [
      {
        heading: 'The article you found',
        blocks: [
          {
            type: 'text',
            md: "The X post that sent you here is by Avid (@Av1dlive), published September 23, 2026, as an X Article titled \"How to Build Agentic Harness using Jev (Builder's Guide).\" Within two days it had 837 likes and 2,789 bookmarks. That ratio, better than three bookmarks per like, tells you people are saving it as a reference rather than cheering it.\n\nThe guide walks through a real app called **Keel**, version 0.2.0. Keel is a local-first coding workspace for Macs, written in Rust with GPUI (the UI toolkit behind the Zed editor), and it runs on Apple Silicon with macOS 15 or later. The source is public at [codejunkie99/keel](https://github.com/codejunkie99/keel). Avid also built agentic-stack, a portable memory-and-skills folder for coding agents.",
          },
          {
            type: 'text',
            md: "What makes the guide worth a full lesson is its restraint. Most launch-week Jev demos had it steering Doom or driving a drone. Avid gives Jev two small, well-fenced jobs inside a coding tool, then spends most of the article on the fences. If you remember [Agents, Harnesses & Loops · What Is a Harness?](lesson:m2-l1), the harness is the code wrapped around a model that decides what the model can see and do. This article is about where a decision model belongs in that wrapper.",
          },
          {
            type: 'callout',
            variant: 'quote',
            title: 'The line the whole guide hangs on',
            md: "\"a model can suggest the next move. the host still owns the move.\" (Avid, How to Build Agentic Harness using Jev)",
          },
        ],
      },
      {
        heading: 'The contract: host builds the menu, selector picks, host checks again',
        blocks: [
          {
            type: 'text',
            md: "Everything in Keel follows one loop. The **host** (the Keel app itself) looks at the real world and builds a short menu of options that are valid right now. The **selector** (Jev, or its local cousin Laya) picks one item from that menu, or declines to pick. The host checks the pick against the world again, then either acts or falls back. Finally it writes down what happened.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="330" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">One checked decision</text>
  <g font-size="11" text-anchor="middle">
    <rect x="20" y="70" width="130" height="64" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="6"/>
    <text x="85" y="94" fill="#34d399" font-weight="bold">HOST</text>
    <text x="85" y="110" fill="#e4e4e7">builds the menu</text>
    <text x="85" y="124" fill="#71717a" font-size="10">only valid options</text>
    <rect x="195" y="70" width="130" height="64" fill="#27272a" stroke="#e879f9" stroke-width="2" rx="6"/>
    <text x="260" y="94" fill="#e879f9" font-weight="bold">SELECTOR</text>
    <text x="260" y="110" fill="#e4e4e7">picks an id</text>
    <text x="260" y="124" fill="#71717a" font-size="10">or abstains</text>
    <rect x="370" y="70" width="130" height="64" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="6"/>
    <text x="435" y="94" fill="#34d399" font-weight="bold">HOST</text>
    <text x="435" y="110" fill="#e4e4e7">checks it again</text>
    <text x="435" y="124" fill="#71717a" font-size="10">still valid? still current?</text>
    <rect x="545" y="44" width="135" height="44" fill="#27272a" stroke="#34d399" stroke-width="1.5" rx="6"/>
    <text x="612" y="70" fill="#e4e4e7">act (normal permissions)</text>
    <rect x="545" y="116" width="135" height="44" fill="#27272a" stroke="#fbbf24" stroke-width="1.5" rx="6"/>
    <text x="612" y="142" fill="#fbbf24">fallback / ask user</text>
    <rect x="245" y="220" width="210" height="56" fill="#27272a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <text x="350" y="244" fill="#38bdf8" font-weight="bold">RECORD</text>
    <text x="350" y="262" fill="#a1a1aa" font-size="10">menu, pick, check result, fallback, outcome</text>
  </g>
  <g stroke="#52525b" stroke-width="1.5" fill="none">
    <line x1="150" y1="102" x2="193" y2="102"/>
    <line x1="325" y1="102" x2="368" y2="102"/>
    <line x1="500" y1="92" x2="543" y2="68"/>
    <line x1="500" y1="112" x2="543" y2="136"/>
    <path d="M680 66 L692 66 L692 264 L457 264"/>
    <path d="M612 160 Q612 248 457 248"/>
    <path d="M245 248 Q85 248 85 136"/>
  </g>
  <text x="170" y="296" fill="#71717a" font-size="10" text-anchor="middle">records feed the next menu design</text>
  <text x="570" y="300" fill="#71717a" font-size="10" text-anchor="middle">every path gets written down</text>
</svg>`,
            caption: 'The selector only ever touches the middle box. Everything that makes the decision safe happens in the host boxes on either side of it.',
          },
          {
            type: 'text',
            md: "Notice what the selector returns: an **id**, a label pointing at an option the host already built. It can't return a new command, a new provider, or a paragraph of reasoning for the host to interpret. Avid calls this drawing a hard line between deciding and doing. It has a nice side effect: the decision layer becomes swappable. Keel can use Jev, Laya, or no selector at all, and the rest of the app doesn't care, because it never trusted the selector's prose to begin with.\n\nThe other side of that coin, which the guide states plainly: the selector can't choose a good option the host forgot to offer. The quality of the menu caps the quality of the pick.",
          },
        ],
      },
      {
        heading: 'Two decisions Keel hands to the selector',
        blocks: [
          {
            type: 'text',
            md: "Keel lets a selector act in exactly two places. Both are small, and both happen where the host can check the result.\n\n**Decision one: which route handles a new task.** A route is a provider plus a model, say a hosted frontier model versus a local one. When you start a fresh task and haven't pinned a route yourself, the host builds the list of eligible routes. It filters out providers that aren't installed or enabled, models that aren't available, and reasoning levels a model doesn't support. The selector picks from what's left or abstains.",
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The product rule that isn\'t a footnote',
            md: "If you pinned a route, Keel keeps it. If a session is already running or you resumed one, Keel doesn't quietly reroute it. Automatic choice only applies to fresh, unpinned work. The guide calls this central, and it is: a selector that overrides a person's explicit choice would feel like the tool arguing with you.",
          },
          {
            type: 'text',
            md: "One honest caveat from the guide: a route can pass every host check and still fail when the session starts, because the provider checks its own login at that moment. The host can only validate what it can see.\n\n**Decision two: what the next step should focus on.** Keel includes its own embedded agent loop running a DeepSeek model. At each step, the selector picks one of four focuses, and each focus maps to a specific bundle of tools the host prepares.",
          },
          {
            type: 'table',
            headers: ['Focus', 'What the step is for', 'What the host hands over'],
            rows: [
              ['Inspect', 'Look around before changing anything', 'The tool bundle mapped to inspecting'],
              ['Implement', 'Make the change', 'The tool bundle mapped to editing'],
              ['Verify', 'Check that the change works', 'The tool bundle mapped to checking'],
              ['Answer', 'Reply to the user', '**No tools at all**'],
            ],
          },
          {
            type: 'text',
            md: "The guide doesn't list the exact tools in each bundle, but the **answer** row is the clever one. If the selector decides the next step is replying, the model gets zero tools, so there's nothing to misuse. The host shapes what's possible from the choice instead of handing over full power and hoping.\n\nWalk through the guide's example. You ask Keel to fix a parser bug. If you pinned a route, that route runs. If you didn't, and automatic selection is on, the host offers the eligible routes and the selector picks one. Later, inside the embedded loop, the choice narrows to inspect, implement, verify, or answer. Picking verify changes which tools the model gets for that step. And picking verify doesn't prove the patch is right. A real check still has to run, and its result still has to mean something.",
          },
        ],
      },
      {
        heading: 'Three modes, and why local is the default',
        blocks: [
          {
            type: 'table',
            headers: ['Mode', 'Who picks', 'Why you would choose it'],
            rows: [
              ['Normal', 'Nobody; existing route behavior', 'You want the app to behave the way it always did'],
              ['Local Laya (the default)', 'Laya, running on the Mac through Core ML, Apple\'s on-device model runtime', 'Nothing leaves the machine, no key, no network wait'],
              ['Hosted Jev (opt-in)', 'Jev, using a protected credential already stored on the Mac', 'Better zero-shot judgment when you accept sending the menu to TypeSafe'],
            ],
          },
          {
            type: 'text',
            md: "The mode switch exists because \"always use the smartest model\" ignores latency, privacy, credentials, and what the user wants. Giving those trade-offs a setting means the person decides them once, deliberately, instead of the app deciding silently. It's also a nice echo of the last lesson: local Laya as the private default, hosted Jev as the stronger opt-in.",
          },
        ],
      },
      {
        heading: 'Whose loop is it?',
        blocks: [
          {
            type: 'text',
            md: "Keel can host outside coding agents through the **Agent Client Protocol** (ACP), an open standard, started by the Zed team, that lets an editor talk to any compatible coding agent the way a browser talks to any website. Those outside agents run their own tool loops. Each one picks its next tool call and manages its context, and some expose settings for all of that.\n\nIn this build, Jev and Laya don't touch those loops. That sounds obvious written down. It gets blurry fast in practice, which is why the guide spends real time on it.",
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="300" fill="#18181b" rx="8"/>
  <text x="350" y="28" fill="#e4e4e7" font-size="16" font-weight="bold" text-anchor="middle">Three loops, three owners</text>
  <rect x="30" y="50" width="640" height="225" fill="none" stroke="#34d399" stroke-width="2" rx="10"/>
  <text x="50" y="72" fill="#34d399" font-size="12" font-weight="bold">Keel host: owns menus, checks, permissions, records</text>
  <rect x="60" y="92" width="270" height="160" fill="#27272a" stroke="#e879f9" stroke-width="1.5" rx="8"/>
  <text x="195" y="116" fill="#e879f9" font-size="12" font-weight="bold" text-anchor="middle">Embedded agent loop</text>
  <text x="195" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">selector picks the focus</text>
  <text x="195" y="152" fill="#a1a1aa" font-size="11" text-anchor="middle">host maps it to tools</text>
  <text x="195" y="190" fill="#e879f9" font-size="11" text-anchor="middle">Jev / Laya CAN act here</text>
  <text x="195" y="206" fill="#e879f9" font-size="11" text-anchor="middle">(plus new-task routing)</text>
  <rect x="370" y="92" width="270" height="160" fill="#27272a" stroke="#71717a" stroke-width="1.5" rx="8" stroke-dasharray="6 4"/>
  <text x="505" y="116" fill="#e4e4e7" font-size="12" font-weight="bold" text-anchor="middle">Outside ACP agent</text>
  <text x="505" y="136" fill="#a1a1aa" font-size="11" text-anchor="middle">its own tools, context,</text>
  <text x="505" y="152" fill="#a1a1aa" font-size="11" text-anchor="middle">and next-call decisions</text>
  <text x="505" y="190" fill="#f87171" font-size="11" text-anchor="middle">Jev / Laya do NOT reach in</text>
  <text x="505" y="206" fill="#71717a" font-size="10" text-anchor="middle">the host has no API to enforce it</text>
</svg>`,
            caption: 'A decision layer belongs only where the host can check the result. Inside someone else\'s loop, it cannot.',
          },
          {
            type: 'text',
            md: "One example from the guide makes the trap concrete. Keel lists commands, skills, modes, and tools, including slash commands an outside agent exposes. A slash command showing up in that list doesn't make it an action Jev can call. In the current code path, it may just become text in the prompt sent to the provider. Avid's rule for this is memorable: drawing another arrow on an architecture diagram doesn't create an API. Put the decision boundary where code can enforce it, and nowhere else.\n\nThe same thinking shows up in Keel's computer-use command. It lets Laya or Jev pick from a short list of low-risk desktop action ids, or abstain. The command itself never clicks anything. Choosing a click and performing a click are different jobs, owned by different code. Compare the Browser Use agent from [Bonus: Decision Models (Jev) · Jev-Shaped Problems: Four Places a Decision Model Belongs](lesson:m11-l4), where Jev picks a page element and the agent clicks it immediately. That's a fine trade for a flight search in a throwaway browser. Keel keeps the two jobs apart because a coding workspace touches your real files.",
          },
        ],
      },
      {
        heading: 'Choosing and permitting are separate jobs',
        blocks: [
          {
            type: 'text',
            md: "Jev can select a candidate. It can't approve a dangerous action. If a tool normally asks for your permission, it still asks, no matter who picked it or how confident the pick was. A 0.99 is a statement about the model's certainty. It grants nothing.\n\nRyan Vogel said the same thing in plainer words on Greg Isenberg's show: give Jev a heavy advisory role, and never let it handle every interaction on its own. Nate B. Jones's favorite agent example fits the same mold. An agent proposes deleting a build folder and force-pushing, and Jev *recommends* asking you first. Recommends is the right verb.\n\nThis maps straight onto what you built in [Claude Code Mastery · Hooks: Deterministic Control](lesson:m1-l5). Hooks run whatever the model decided; they're the deterministic gate that says yes or no to the action itself. A selector sits earlier and narrows what gets proposed. Keep both. Don't let the first quietly replace the second.",
          },
          {
            type: 'text',
            md: "The other half of the section is timing. Between the moment the selector picks and the moment the host acts, the world can change: a provider goes offline, a route goes stale, a tool's definition gets updated. So the host checks again right before acting. For routes, it confirms the pick is still eligible and current. Inside the agent loop, it rebuilds the tool set against current definitions and re-validates the named tool at dispatch. Security people call the bug this prevents [time-of-check to time-of-use](https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use): the thing you checked isn't the thing you ended up using.",
          },
          {
            type: 'code',
            lang: 'typescript',
            code: `// Keel is Rust. This TypeScript sketch shows the shape of its host logic.
async function chooseRoute(task: Task): Promise<Route> {
  if (task.pinnedRoute || task.isRunning) return task.pinnedRoute ?? task.currentRoute

  const menu = buildEligibleRoutes()            // installed, enabled, available, supported
  const fallback = defaultRoute(menu)           // decided BEFORE asking anyone
  const pick = await selector.choose(task, menu) // returns { id } or { abstain: true }

  let outcome: Route
  let reason: string
  if ('abstain' in pick) {
    outcome = fallback; reason = 'selector-abstained'
  } else if (!stillEligible(pick.id)) {         // re-check: the world may have moved
    outcome = fallback; reason = 'stale-or-invalid'
  } else {
    outcome = routeFor(pick.id); reason = 'selector-accepted'
  }

  record({ task: task.id, menu: menu.map(r => r.id), pick, reason, route: outcome.id })
  return outcome
}`,
            caption: 'Every exit path writes a record, and a fallback is never logged as a selector win.',
          },
        ],
      },
      {
        heading: 'Abstaining is a real answer',
        blocks: [
          {
            type: 'text',
            md: "\"I can't choose\" is a valid result. The guide's rule is to decide what happens next *before* you call the selector, so that abstaining leads somewhere sensible instead of to an exception. And when the fallback runs, record it as a fallback. If you count those as selector successes, your numbers will say the selector is great when the default did the work.\n\nJev itself always returns a pick, so you build abstain yourself. Two ways work well. Add an explicit option such as `none_fit` described as \"none of these options fits the task,\" or treat any confidence below your threshold as an abstain. The second pairs naturally with the confidence gates from the last lesson.",
          },
        ],
      },
      {
        heading: 'Records, replays, and what "self-improving" should mean',
        blocks: [
          {
            type: 'text',
            md: "After the host validates a pick and sees what happened, Keel writes a decision record. The guide lists the questions a record should answer, and they're pleasantly boring engineering questions.",
          },
          {
            type: 'table',
            headers: ['The record answers', 'Why it matters later'],
            rows: [
              ['What were the candidates?', 'A bad pick from a bad menu counts against whoever built the menu'],
              ['Did the selector choose or abstain?', 'Separates selector behavior from fallback behavior'],
              ['Did the host\'s check accept it?', 'Shows how often picks go stale before they run'],
              ['Did a fallback happen?', 'Keeps fallback wins out of the selector\'s score'],
              ['What did the tool or task produce?', 'Ties the decision to an outcome you can judge'],
            ],
          },
          {
            type: 'text',
            md: "These records deliberately aren't the model's private reasoning. A model's explanation of why it chose something doesn't prove why it chose it. What you need is whether the choice was allowed, whether the host accepted it, and what happened next.\n\nHere's where the records pay off. Say the route selector picked a provider that went unavailable a moment later. Instead of writing \"the agent got confused,\" which gives you a mood and nothing to fix, you have the menu, the task flags, the pick, the host's check result, and the fallback. That's enough to rebuild the exact situation as a **replayable scenario**.",
          },
          {
            type: 'text',
            md: "- Recreate the same candidate list and task flags.\n- Run the current selector or policy on it, as the baseline.\n- Run your proposed change (new question wording, new menu rule, different model) under identical conditions.\n- Compare valid picks, abstentions, fallbacks, latency, and the downstream result.\n- Have a person review the difference and decide whether to keep the change.",
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Self-improving, the unglamorous version',
            md: "Keel records decisions and outcomes. It doesn't train Laya on your chat history, and it doesn't rewrite its own policy after a failure. Improvement means: keep the old version, replay the saved scenarios against the new one, inspect the regressions, and let a human approve the new baseline. No silent self-training, and no \"it changed because it learned\" with no diff and no way back.",
          },
          {
            type: 'text',
            md: "Two more cautions from the guide are worth taping to your monitor. First, a passed task doesn't tell you which component deserves credit; the worker model might have solved it on the original route anyway. Keep the task set and scoring fixed, and do your final comparison on a separate set of tasks you never tuned against. Second, the extra call has to earn its place. If picking a worker takes longer than the work, you've built an elaborate waiting room. Measure total task cost: selector time, worker time, retries, and the time you spend reviewing. Avid is upfront that the article hasn't yet shown that payoff on a coding benchmark. Read it as a design with an evaluation plan attached; the measured results are still to come.",
          },
        ],
      },
      {
        heading: 'Where to start: four things to write down',
        blocks: [
          {
            type: 'text',
            md: "The guide ends with a short recipe, and it's the part you'll reuse. Before building any decision layer, write down four things:\n\n- The one decision it's allowed to make.\n- The exact choices it can see, and who builds that list.\n- What happens when it abstains.\n- How you'll know whether the outcome helped.\n\nThen build the narrowest path that proves those rules. Start small enough that a bad choice has nowhere to hide.",
          },
          {
            type: 'compare',
            left: {
              title: 'A decision worth handing to Jev',
              items: [
                'Pick Haiku, Sonnet, or Opus for an incoming prompt, from models you have installed',
                'Label a Bash command as read-only, local write, or outbound before a hook decides',
                'Choose which of your five Trello lists a new card belongs in',
                'Each has a finite menu, a fallback, and an outcome you can check',
              ],
            },
            right: {
              title: 'A decision to keep away from it',
              items: [
                'What should the agent do next, with no menu at all',
                'Whether a risky command is allowed (that is permission, and stays with the hook)',
                'Anything inside a provider\'s own loop the host cannot enforce',
                'Anything where you cannot say what a good outcome looks like',
              ],
            },
          },
          {
            type: 'text',
            md: "If you want a second opinion on where this goes, the eleven small fixes in [Bonus: Field Notes · Eleven Small Fixes, and What the Studies Actually Say](lesson:m10-l4) land on the same instinct from a different direction: move judgment out of prose and into things code can check.",
          },
        ],
      },
    ],
    lab: {
      title: 'Build One Checked Decision',
      intro:
        "Take the decision you shadow-evaluated in the previous lesson (or pick a model-routing decision if that one didn't pan out) and wrap it in the full host contract from the guide. A single Python file is plenty. Budget two hours.",
      steps: [
        'Write the four things on paper first: the one decision, the exact menu and who builds it, the abstain behavior, and how you will judge the outcome.',
        'Write a `build_menu()` function that constructs the candidate list from real state (installed models, existing lists, whatever applies). No hard-coded list the world could drift away from.',
        'Write `choose()` that calls Laya locally (or Jev, pinned) and returns either an id from the menu or an abstain, using a `none_fit` option or your confidence threshold from the shadow eval.',
        'Write `still_valid(id)` that re-checks the pick against current state right before acting, and a `fallback()` decided before `choose()` runs.',
        'Append one JSON line per decision to `decisions.jsonl` with the menu, the pick or abstain, the check result, whether fallback ran, and the eventual outcome.',
        'Run it on at least 30 real inputs. Force at least one stale case by changing the state between the pick and the check, and confirm the host rejects it.',
        'Change one thing (question wording, a menu rule, or the threshold) and replay the same 30 inputs from your records. Compare valid picks, abstains, fallbacks, and outcomes side by side, then decide as the human gate whether to keep the change.',
      ],
      checklist: [
        'My four things are written down before any code',
        'The menu is built from live state, and the selector can only return ids from it',
        'A stale pick was rejected by the re-check and the fallback ran and was recorded as a fallback',
        'decisions.jsonl answers the five record questions for every decision',
        'I replayed my records against one change and made a keep-or-revert call with the numbers in front of me',
      ],
    },
    checkQuiz: [
      {
        q: 'Keel lists a slash command exposed by an outside ACP agent. Can Jev call it?',
        options: [
          'Yes; anything listed is callable',
          'Yes, if Jev\'s confidence is above 0.9',
          'No; in the current code path it may just become prompt text for the provider, and the host has no API to enforce a pick inside that agent\'s loop',
          'Only in hosted Jev mode',
        ],
        answer: 2,
        explain:
          'Listing something is different from owning it. The decision boundary goes where code can enforce it, and outside agents keep their own loops.',
      },
      {
        q: 'Your selector abstains and the fallback route finishes the task successfully. How should that be recorded?',
        options: [
          'As a selector success, since the task passed',
          'As a fallback, so selector performance is measured only on picks it actually made',
          'It should not be recorded; abstains are noise',
          'As a selector failure',
        ],
        answer: 1,
        explain:
          'Counting fallback wins as selector wins inflates the selector\'s numbers. The guide says to record fallback usage explicitly so it does not count as a selector win.',
      },
      {
        q: 'What turns "the agent seemed confused" into something you can fix?',
        options: [
          'Asking the model to explain its reasoning',
          'A structured record of the menu, the pick, the host check, the fallback, and the outcome, replayed against a changed policy',
          'Switching to a bigger model',
          'Letting the app retrain itself overnight',
        ],
        answer: 1,
        explain:
          'A model\'s explanation does not prove why it chose. The record gives you the conditions to rebuild the decision, run the old and new versions side by side, and let a person judge the difference.',
      },
      {
        q: 'Why might adding a selector make a coding harness worse overall?',
        options: [
          'If choosing takes longer than doing, or the menu leaves out the good option, the extra call costs more than it saves',
          'Selectors always pick the slowest model',
          'Selectors disable permission prompts',
          'Jev cannot run on macOS',
        ],
        answer: 0,
        explain:
          'The extra call has to earn its place against total task cost: selector time, worker time, retries, and review. A selector also cannot pick a good option the host forgot to offer.',
      },
    ],
    resources: [
      { label: 'Avid (@Av1dlive): How to Build Agentic Harness using Jev (Builder\'s Guide)', url: 'https://x.com/Av1dlive/status/2102802621664985241', kind: 'thread' },
      { label: 'codejunkie99/keel: the Keel 0.2.0 source', url: 'https://github.com/codejunkie99/keel', kind: 'repo' },
      { label: 'codejunkie99/agentic-stack', url: 'https://github.com/codejunkie99/agentic-stack', kind: 'repo' },
      { label: 'Agent Client Protocol', url: 'https://agentclientprotocol.com/', kind: 'docs' },
      { label: 'LangChain: tool-risk gating and model routing with Jev', url: 'https://www.langchain.com/blog/building-a-harness-with-jev', kind: 'article' },
    ],
  },
]
