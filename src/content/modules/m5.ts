import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // m5-l1: RAG Fundamentals
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l1',
    title: 'RAG Fundamentals',
    day: 19,
    minutes: 55,
    xp: 100,
    objectives: [
      `Can explain what RAG is in plain English and name the four situations where it beats pasting documents straight into the prompt`,
      `Can walk one question through the full eight-stage pipeline, from ingest to evaluate, and say what each stage does`,
      `Can pick an embedding model and a vector store for a given workload and defend the choice`,
      `Can build a working toy RAG over your own documents in about 50 lines of Python`,
    ],
    skipQuiz: [
      {
        q: `You indexed 100,000 chunks with text-embedding-3-large. Later, you start embedding user questions with a different model, BGE-M3, which happens to output vectors of the same length. What happens to retrieval?`,
        options: [
          `Quality drops a few points but the system stays usable`,
          `Results become effectively random, because the two models place meanings at completely different coordinates, and the only fix is re-embedding the whole index`,
          `Everything works fine as long as the vector dimensions match`,
          `Only latency changes, since the similarity math works the same on any vectors`,
        ],
        answer: 1,
        explain: `Matching dimensions and matching geometry are two different things. Each embedding model lays out its own private map of meaning, so a query vector from one model means nothing when measured against index vectors from another. The index and the query must share one model, and switching models means a full re-index.`,
      },
      {
        q: `Why do most RAG systems cut documents into chunks of roughly 200 to 800 tokens?`,
        options: [
          `Vector stores reject documents above 800 tokens`,
          `Embedding APIs charge per chunk, so smaller is always cheaper`,
          `That size usually holds one coherent idea: bigger chunks blur several topics into one mushy vector, and tiny chunks lose the context a reader needs to make sense of them`,
          `LLM context windows cap out near 800 tokens per passage`,
        ],
        answer: 2,
        explain: `Each chunk gets compressed into a single vector, one point that has to stand for everything inside the chunk. Cram three topics into one chunk and the point lands somewhere between them, close to none. Shrink chunks to a single sentence and each point loses the surrounding context that gave the sentence its meaning. The 200 to 800 token band balances those two failure modes.`,
      },
      {
        q: `Your team already runs Postgres in production. What's the best default vector store for your first RAG service?`,
        options: [
          `pgvector, because retrieval then lives inside the database you already operate, right next to your relational data`,
          `Pinecone, because managed always beats self-hosted`,
          `Milvus, because you should plan for billions of vectors from day one`,
          `A JSON file of vectors scanned with numpy`,
        ],
        answer: 0,
        explain: `The boring choice wins. If Postgres is already running, pgvector adds vector search to it as an extension, and you keep operating one system instead of two. Qdrant or Milvus earn their keep at hundreds of millions of vectors, and Pinecone makes sense when you'd rather pay someone else to run the whole thing.`,
      },
      {
        q: `Chunks are usually created with a 10 to 20 percent overlap, meaning each chunk repeats a little of the previous one. What problem does that solve?`,
        options: [
          `It reduces total index size by deduplicating tokens`,
          `An idea that happens to sit across a chunk boundary survives whole in at least one chunk, so a query can still find it`,
          `It makes keyword search unnecessary`,
          `It lets you skip the reranking stage`,
        ],
        answer: 1,
        explain: `Chunk boundaries fall wherever the token count says they fall, and sometimes that's the middle of an idea. Without overlap, a sentence sliced in half matches no chunk well, and the idea becomes unfindable. With overlap, whatever straddles the boundary shows up intact in one of the two neighboring chunks.`,
      },
      {
        q: `Which of these situations genuinely needs RAG, rather than pasting the documents into the prompt?`,
        options: [
          `A 20-page style guide used by one internal bot`,
          `A static FAQ with 30 questions`,
          `A corpus of 4 million documents that updates hourly, where each user is only allowed to see some of them`,
          `A single PDF the user just uploaded`,
        ],
        answer: 2,
        explain: `Three classic RAG triggers stack up in that option: the collection is far bigger than any context window, it changes constantly, and different users have different permissions. The other three cases are small and static, so pasting them into the prompt is the simpler, better answer.`,
      },
    ],
    sections: [
      {
        heading: 'Why RAG exists',
        blocks: [
          {
            type: 'text',
            md: `Here's the problem RAG solves. A language model only knows two kinds of things: what was in its training data (which has a cutoff date, so nothing recent) and what you paste into the prompt. Your company wiki, your support tickets, yesterday's meeting notes: the model has never seen any of it. **RAG**, short for **Retrieval-Augmented Generation**, is the standard fix. When a question comes in, first go *find* the handful of passages from your document collection (your **corpus**, in search-engine speak) that probably contain the answer. Paste those next to the question, and let the model write its answer from them. Retrieve, then generate. That's the whole name.`,
          },
          {
            type: 'text',
            md: `Why bother with the extra machinery instead of dumping everything into the prompt? Four reasons come up over and over. **Freshness**: the searchable index can be updated the moment a document changes, while the model's training data stays frozen. **Privacy**: your data lives in your own store, and only small relevant slices ever reach the model. **Permissions**: retrieval can check who's asking and fetch only the documents that user is allowed to see. **Citations**: because you know exactly which documents were fetched, the answer can point back at its sources, and a human can go verify it.`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The one-line pitch',
            md: `RAG is a search engine bolted onto a text generator. That framing matters, because everything that made search engines good over the last 25 years (indexing, ranking, measuring relevance) is now your problem too. Teams that treat RAG as an information-retrieval system do well. Teams that treat it as a prompt trick plateau within a week.`,
          },
          {
            type: 'text',
            md: `The other big driver is plain size. Context windows (the amount of text a model can read in one prompt) reached about a million tokens across 2025 and 2026, which is roughly 700,000 words. That genuinely killed RAG for *small* document sets: a 60-page handbook now fits in the prompt with room to spare. But a real company knowledge base runs to gigabytes, thousands of times bigger than any window. And even when a huge document technically fits, models get noticeably worse at spotting details buried deep in a very long prompt. Retrieval sidesteps both problems by selecting the tiny fraction of the corpus (often 0.01 percent) that matters for this one question.`,
          },
        ],
      },
      {
        heading: 'What an embedding actually is',
        blocks: [
          {
            type: 'text',
            md: `Before the pipeline can make sense, you need one concept: the **embedding**. An [embedding model](https://platform.openai.com/docs/guides/embeddings) reads a piece of text and turns it into a long list of numbers, typically somewhere between 512 and 3,072 of them. Treat that list as coordinates: every sentence becomes a point in a giant space. The model was trained so that texts with similar *meanings* land near each other, even when they share no words at all. "How do I reset my password?" and "login credentials recovery" end up neighbors. "Best pizza dough recipe" lands in a different neighborhood entirely.`,
          },
          {
            type: 'text',
            md: `That one property powers everything else in this module. **Semantic search** (search by meaning, as opposed to search by matching words) works like this: embed every chunk of every document once, ahead of time, and store all the points. When a question arrives, embed the question too, then find the stored points closest to it. Closeness is usually measured with [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), a formula that scores how strongly two of these number-lists point in the same direction. The nearest points carry the most similar meaning, and the most similar meaning is your best bet for containing the answer.`,
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="700" height="340" rx="10" fill="#18181b"/>
  <text x="20" y="30" fill="#a1a1aa" font-size="12">MEANING SPACE (2 of ~1,500 dimensions shown)</text>
  <ellipse cx="185" cy="150" rx="140" ry="82" fill="none" stroke="#38bdf8" stroke-dasharray="5 5" opacity="0.6"/>
  <circle cx="140" cy="120" r="6" fill="#38bdf8"/>
  <text x="152" y="116" fill="#e4e4e7" font-size="11">"How do I reset my password?"</text>
  <circle cx="215" cy="160" r="6" fill="#38bdf8"/>
  <text x="227" y="156" fill="#e4e4e7" font-size="11">"login credentials recovery"</text>
  <circle cx="125" cy="190" r="6" fill="#38bdf8"/>
  <text x="137" y="196" fill="#e4e4e7" font-size="11">"I can't sign in"</text>
  <text x="185" y="256" fill="#38bdf8" font-size="11" text-anchor="middle">same meaning, zero shared words</text>
  <circle cx="420" cy="105" r="6" fill="#fbbf24"/>
  <text x="432" y="101" fill="#e4e4e7" font-size="11">"update my billing email"</text>
  <circle cx="545" cy="215" r="6" fill="#f472b6"/>
  <text x="557" y="211" fill="#e4e4e7" font-size="11">"best pizza dough recipe"</text>
  <circle cx="510" cy="260" r="6" fill="#f472b6"/>
  <text x="522" y="266" fill="#e4e4e7" font-size="11">"how long to knead bread"</text>
  <text x="350" y="316" fill="#a1a1aa" font-size="11" text-anchor="middle">Each text becomes a point. Distance between points tracks difference in meaning.</text>
</svg>`,
            caption: `Three phrasings of the same login problem land in one neighborhood, and the pizza questions land far away. Retrieval means finding the nearest neighbors of the question's point.`,
          },
        ],
      },
      {
        heading: 'The canonical pipeline',
        blocks: [
          {
            type: 'text',
            md: `Every production RAG system, whatever the vendor slides claim, boils down to the same eight stages. The first four run ahead of time, whenever documents change (index time). The last four run on every single question (query time).`,
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>
    <marker id="m5arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a1a1aa"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="700" height="340" rx="10" fill="#18181b"/>
  <text x="20" y="34" fill="#a1a1aa" font-size="12">INDEX TIME</text>
  <rect x="20" y="50" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="20" y="50" width="4" height="52" rx="2" fill="#38bdf8"/>
  <text x="94" y="72" fill="#e4e4e7" font-size="13" text-anchor="middle">1. Ingest</text>
  <text x="94" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">docs, wikis, PDFs</text>
  <rect x="192" y="50" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="192" y="50" width="4" height="52" rx="2" fill="#38bdf8"/>
  <text x="266" y="72" fill="#e4e4e7" font-size="13" text-anchor="middle">2. Chunk</text>
  <text x="266" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">200-800 tok + overlap</text>
  <rect x="364" y="50" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="364" y="50" width="4" height="52" rx="2" fill="#a78bfa"/>
  <text x="438" y="72" fill="#e4e4e7" font-size="13" text-anchor="middle">3. Embed</text>
  <text x="438" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">one model, forever</text>
  <rect x="536" y="50" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="536" y="50" width="4" height="52" rx="2" fill="#a78bfa"/>
  <text x="610" y="72" fill="#e4e4e7" font-size="13" text-anchor="middle">4. Vector store</text>
  <text x="610" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">pgvector / Chroma</text>
  <line x1="168" y1="76" x2="188" y2="76" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <line x1="340" y1="76" x2="360" y2="76" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <line x1="512" y1="76" x2="532" y2="76" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <path d="M610,102 L610,146 L94,146 L94,186" fill="none" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <text x="20" y="174" fill="#a1a1aa" font-size="12">QUERY TIME</text>
  <rect x="20" y="190" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="20" y="190" width="4" height="52" rx="2" fill="#f472b6"/>
  <text x="94" y="212" fill="#e4e4e7" font-size="13" text-anchor="middle">5. Retrieve</text>
  <text x="94" y="230" fill="#a1a1aa" font-size="10" text-anchor="middle">top-k similar chunks</text>
  <rect x="192" y="190" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="192" y="190" width="4" height="52" rx="2" fill="#f472b6"/>
  <text x="266" y="212" fill="#e4e4e7" font-size="13" text-anchor="middle">6. Rerank</text>
  <text x="266" y="230" fill="#a1a1aa" font-size="10" text-anchor="middle">cross-encoder</text>
  <rect x="364" y="190" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="364" y="190" width="4" height="52" rx="2" fill="#34d399"/>
  <text x="438" y="212" fill="#e4e4e7" font-size="13" text-anchor="middle">7. Generate</text>
  <text x="438" y="230" fill="#a1a1aa" font-size="10" text-anchor="middle">answer + citations</text>
  <rect x="536" y="190" width="148" height="52" rx="6" fill="#27272a" stroke="#52525b"/>
  <rect x="536" y="190" width="4" height="52" rx="2" fill="#fbbf24"/>
  <text x="610" y="212" fill="#e4e4e7" font-size="13" text-anchor="middle">8. Evaluate</text>
  <text x="610" y="230" fill="#a1a1aa" font-size="10" text-anchor="middle">RAGAS, real queries</text>
  <line x1="168" y1="216" x2="188" y2="216" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <line x1="340" y1="216" x2="360" y2="216" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <line x1="512" y1="216" x2="532" y2="216" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow)"/>
  <text x="350" y="290" fill="#e4e4e7" font-size="12" text-anchor="middle">The invariant: stages 3 and 5 MUST use the same embedding model.</text>
  <text x="350" y="310" fill="#a1a1aa" font-size="11" text-anchor="middle">Switching models means a full re-index. No shortcut exists.</text>
</svg>`,
            caption: `The canonical RAG pipeline as of mid-2026. The top row runs whenever documents change; the bottom row runs on every question.`,
          },
          {
            type: 'text',
            md: `Walk one real question through it. A support agent types "What's our refund window for enterprise customers?" Months earlier, at index time, an ingest job pulled in the policy wiki (stage 1). Chunking split those pages into passages of a few hundred tokens each (stage 2). An embedding model turned each passage into a vector, its point in meaning space (stage 3). And everything landed in the **vector store**, a database built to answer "which stored points are closest to this one?" quickly, even across millions of entries (stage 4).`,
          },
          {
            type: 'text',
            md: `Now, at query time, the agent's question gets embedded with the *same* model, and the store returns the 20 closest chunks: its best guesses (stage 5). A reranker reads those 20 carefully and promotes the three that genuinely answer the question, including the passage saying enterprise refunds run 60 days rather than the standard 30 (stage 6). Those three chunks get pasted into the prompt, and the model writes an answer that cites the policy page (stage 7). Later, an evaluation job replays questions like this one against known-correct answers, so you notice when quality slips (stage 8). Every RAG conversation you'll ever have is about one of these eight boxes.`,
          },
          {
            type: 'text',
            md: `**Chunking** deserves its own paragraph, because it's where most of the quality gets won or lost. Chunking means slicing documents into the passages that get embedded and retrieved. Split on natural boundaries (headings, paragraphs, functions in code) rather than every N characters, and aim for 200 to 800 tokens per chunk. Tokens, recall, are the word-pieces models read: 100 tokens is roughly 75 words. Give neighboring chunks a 10 to 20 percent **overlap**, meaning each chunk repeats a little of the previous one. The overlap exists for one reason: without it, an idea that happens to straddle a boundary gets cut in half, and half an idea matches nothing. A chunk that starts mid-sentence is a chunk no query will ever find.`,
          },
        ],
      },
      {
        heading: 'Embeddings: the model you marry',
        blocks: [
          {
            type: 'text',
            md: `Picking an embedding model is a bigger commitment than it looks, for a reason the warning below spells out. Here's the mid-2026 shortlist:`,
          },
          {
            type: 'table',
            headers: ['Model', 'Type', 'Why pick it'],
            rows: [
              [
                'text-embedding-3-large',
                'Hosted (OpenAI)',
                'The safe general-purpose default: strong quality, cheap, and supported by every tool you will touch',
              ],
              [
                'Cohere Embed v4',
                'Hosted',
                'Handles images as well as text, and retrieves well across many languages',
              ],
              [
                'Voyage (voyage-code, -finance, -law)',
                'Hosted',
                'Each variant is tuned for one domain; on code, finance, or legal text they beat the generalists',
              ],
              [
                'BGE-M3',
                'Open weights',
                'Runs on your own hardware, and covers dense, sparse, and multi-vector retrieval in a single model',
              ],
              [
                'Qwen3-Embedding',
                'Open weights',
                'The strongest open model right now, with wide language coverage; a natural fit for local-first stacks',
              ],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The rule that bites everyone',
            md: `The index and the query must use the same embedding model. Same version, same settings, forever. Each model draws its own private map of meaning, so vectors from two different models can't be compared, even when they happen to be the same length. Change the model and every stored vector becomes garbage relative to new queries. The practical takeaway: treat re-indexing as a routine operation you've budgeted for, especially before committing to a hosted model that the vendor could deprecate under you.`,
          },
        ],
      },
      {
        heading: 'Vector stores: boring choices win',
        blocks: [
          {
            type: 'text',
            md: `The vector store is the least interesting decision in the whole stack. Similarity search became a commodity years ago, so the sane move is picking whatever sits closest to infrastructure you already run, and spending the saved attention on chunking and evaluation, where quality actually lives.`,
          },
          {
            type: 'table',
            headers: ['Store', 'Slot', 'Reach for it when'],
            rows: [
              [
                'pgvector',
                'Default',
                'You already run Postgres. Vectors live next to your relational data, and you operate one system instead of two',
              ],
              [
                'Chroma',
                'Local dev',
                'Prototypes and labs. It runs inside your Python process with zero setup, which is why the lab below uses it',
              ],
              [
                'Qdrant / Milvus',
                'Scale',
                'Hundreds of millions of vectors or heavy metadata filtering, with dedicated infrastructure to match',
              ],
              [
                'Pinecone',
                'Managed',
                'You want someone else to run it, and you accept vendor pricing in exchange',
              ],
            ],
          },
          {
            type: 'text',
            md: `To make all of this concrete, here's the entire toy pipeline you'll build in the lab. Read it top to bottom: the first half is index time, the second half is query time.`,
          },
          {
            type: 'code',
            lang: 'python',
            code: `import glob
import chromadb

client = chromadb.PersistentClient(path="./rag_db")
coll = client.get_or_create_collection("mydocs")

# index time: ingest -> chunk -> embed -> store
for path in glob.glob("docs/*"):
    words = open(path, encoding="utf-8").read().split()
    step, size = 250, 300           # ~50-word overlap
    chunks = [" ".join(words[i:i + size]) for i in range(0, len(words), step)]
    coll.add(
        documents=chunks,
        ids=[f"{path}-{i}" for i in range(len(chunks))],
        metadatas=[{"source": path}] * len(chunks),
    )

# query time: retrieve the top-k chunks, with sources
while True:
    q = input("question> ")
    res = coll.query(query_texts=[q], n_results=5)
    for doc, meta in zip(res["documents"][0], res["metadatas"][0]):
        print(meta["source"], "::", doc[:160].replace("\\n", " "))`,
            caption: `A complete RAG index-and-query loop. Chroma embeds with a built-in local model by default, so no API key is needed.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: a toy RAG in ~50 lines',
      intro: `Build the whole pipeline yourself, over 10 documents you actually know: ingest, chunk, embed, store, retrieve. Chroma keeps the setup to a single pip install and embeds with a built-in local model, so no API key is required. Swap in pgvector later if you'd rather live in Postgres.`,
      steps: [
        `Create a project folder and drop in 10 real documents you know well (notes, READMEs, blog drafts) as .md or .txt files under docs/`,
        `Set up the environment: *pip install chromadb* inside a fresh virtual environment`,
        `Write the indexer: read each file, split it into chunks of about 300 words with about 50 words of overlap, and add them to a Chroma collection with the source path stored as metadata`,
        `Write the query loop: take a question, retrieve the top 5 chunks, and print each one alongside the document it came from`,
        `Ask 5 questions you already know the answers to, inspect which chunks come back, and write down every miss`,
        `Break it on purpose: query the index with a different embedding model than the one that built it, and watch retrieval fall apart exactly the way the invariant predicts`,
      ],
      checklist: [
        `Indexing runs end to end and reports a sensible chunk count for 10 documents`,
        `At least 4 of your 5 known-answer questions surface a relevant chunk in the top 5`,
        `Every result prints the source document it came from, which means the citation plumbing works`,
        `You saw the embedding-mismatch failure with your own eyes and can explain why it happens`,
      ],
    },
    checkQuiz: [
      {
        q: `Where does reranking sit in the pipeline?`,
        options: [
          `Before embedding, where it filters low-quality chunks out of the index`,
          `Between retrieval and generation, where it reorders the retrieved candidates before the model ever sees them`,
          `After generation, where it scores the final answer`,
          `In place of the vector store for small corpora`,
        ],
        answer: 1,
        explain: `The retriever casts a wide net, maybe 50 candidates, because it's tuned for speed over precision. The reranker then reads those candidates carefully and promotes the few that truly answer the question, so only the best handful ever reach the prompt.`,
      },
      {
        q: `You're building the lab prototype on a laptop, and the production target is 300 million vectors with heavy metadata filtering. What's a reasonable pairing?`,
        options: [
          `Chroma for the prototype, then Qdrant or Milvus for production`,
          `Pinecone for the prototype, then Chroma for production`,
          `pgvector for both, no matter what`,
          `Milvus for the prototype, then a flat file for production`,
        ],
        answer: 0,
        explain: `Chroma was built for exactly the laptop case: it runs inside your Python process with zero setup. Qdrant and Milvus are the dedicated engines designed for hundreds of millions of vectors under heavy filtering. Matching the tool to the stage of the project beats swearing loyalty to one tool forever.`,
      },
      {
        q: `What's the argument for a domain-specific embedding model, like voyage-law, over a general-purpose one?`,
        options: [
          `It's always cheaper per token`,
          `It removes the need for chunking`,
          `A model tuned on legal, financial, or code text learns the fine distinctions of that domain, so passages a generalist would call near-identical get told apart correctly`,
          `It lets the index and the query safely use different models`,
        ],
        answer: 2,
        explain: `To a general model, two legal clauses full of the same boilerplate look nearly identical, even when a lawyer would say they mean opposite things. A domain-tuned model has seen enough of that text to place them far apart in its meaning space, which is exactly the distinction retrieval needs.`,
      },
      {
        q: `Why can a RAG answer carry trustworthy citations when a plain LLM answer can't?`,
        options: [
          `The generator is fine-tuned to memorize URLs`,
          `Every retrieved chunk carries metadata naming its source document, so the answer can point at the exact files it was built from`,
          `The vector store validates facts before returning them`,
          `A separate hallucination-free model generates the citations`,
        ],
        answer: 1,
        explain: `Provenance rides along the whole pipeline. At ingest time each chunk is stored together with its source path or URL, and that metadata comes back at query time. Claims in the answer map to real documents a human can open and check, which an answer written from model memory can never offer.`,
      },
    ],
    resources: [
      { label: 'pgvector: vectors in Postgres', url: 'https://github.com/pgvector/pgvector', kind: 'repo' },
      { label: 'Chroma documentation', url: 'https://docs.trychroma.com', kind: 'docs' },
      { label: 'OpenAI embeddings guide', url: 'https://platform.openai.com/docs/guides/embeddings', kind: 'docs' },
      { label: 'BGE / FlagEmbedding (open embeddings + rerankers)', url: 'https://github.com/FlagOpen/FlagEmbedding', kind: 'repo' },
      { label: 'Anthropic: Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', kind: 'article' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m5-l2: Retrieval Quality
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l2',
    title: 'Retrieval Quality',
    day: 19,
    minutes: 50,
    xp: 100,
    objectives: [
      `Can explain why plain vector search plateaus and what hybrid search adds on top of it`,
      `Can implement Reciprocal Rank Fusion to merge keyword and vector result lists`,
      `Can add a cross-encoder reranker and explain why it's the standard first upgrade`,
      `Can build an eval set from real queries and measure retrieval changes instead of guessing`,
    ],
    skipQuiz: [
      {
        q: `What does Reciprocal Rank Fusion (RRF) actually do when it merges BM25 and vector search results?`,
        options: [
          `Averages the raw similarity scores from the two systems`,
          `Combines the two ranked lists using only each document's rank position, so the incompatible scores never need to be compared`,
          `Trains a small model to learn how much to trust each retriever`,
          `Removes chunks that appear in both lists so nothing gets counted twice`,
        ],
        answer: 1,
        explain: `BM25 scores and cosine similarities are numbers on unrelated scales, like points in basketball versus goals in soccer. RRF ignores the scores entirely and looks only at positions: each document earns 1/(k + rank) from every list it appears in, and the sums decide the final order.`,
      },
      {
        q: `Why use a cross-encoder for reranking but never for first-stage retrieval?`,
        options: [
          `Cross-encoders only work on keyword matches`,
          `They're less accurate than bi-encoders but faster`,
          `They read the query and the document together, which makes them far more accurate and far too slow to run on the whole corpus, so you point them at a shortlist only`,
          `Vector stores have no way to host cross-encoders`,
        ],
        answer: 2,
        explain: `A cross-encoder pays for its accuracy with a full model pass per query-document pair. Fifty pairs per request is affordable. Five million pairs per request is a nonstarter. So the fast retriever narrows millions of chunks down to dozens, and the careful cross-encoder ranks the dozens.`,
      },
      {
        q: `Why build an eval set BEFORE tuning chunk sizes, retrievers, or rerankers?`,
        options: [
          `Because tuning changes are irreversible`,
          `Because without measured hit rates on real queries, you can't tell whether any change helped, which means you're tuning by vibes`,
          `Because RAGAS licensing requires one`,
          `Because eval sets get slower to build as the index grows`,
        ],
        answer: 1,
        explain: `Retrieval tweaks routinely improve some queries while quietly breaking others, and a memory of a few anecdotes can't catch that trade. A set of 50 to 200 real queries with known-correct sources turns every change into a before-and-after number.`,
      },
      {
        q: `A user searches for the error code "E-4402-B". Your vector search misses completely, and BM25 nails it. Why?`,
        options: [
          `BM25 embeds the code into a better vector space`,
          `Rare exact tokens like error codes and part numbers get matched literally by keyword search, while embeddings blur them into vague nearby meaning`,
          `BM25 has a larger context window`,
          `Dense retrieval ignores numbers entirely`,
        ],
        answer: 1,
        explain: `Embeddings compress meaning, and a rare identifier barely has any meaning to compress: "E-4402-B" appeared so rarely in training data that its vector says almost nothing. BM25 does no compressing. It hunts for the literal string, weights it heavily because the string is rare, and finds it.`,
      },
      {
        q: `The right chunk IS being retrieved, at position 18 of 20, and the model answers from the noise above it. What's the best first fix?`,
        options: [
          `Increase k to 50 so even more context is available`,
          `Fine-tune the generator to read more carefully`,
          `Add a reranker so the right chunk lands in the top 3, then cut the junk below it`,
          `Switch vector stores`,
        ],
        answer: 2,
        explain: `This failure has a name: the right chunk got buried. Retrieval succeeded and ranking failed. A reranker fixes the ordering, and shrinking the final k keeps the junk out of the prompt entirely. Piling on more context does the opposite, burying the good chunk even deeper.`,
      },
    ],
    sections: [
      {
        heading: 'The beginner ceiling',
        blocks: [
          {
            type: 'text',
            md: `The toy you built in the last lesson has a name: **naive dense retrieval**. "Dense" refers to the embedding vectors, and "naive" refers to using them alone: embed the question, return the **top-k** closest chunks (the k nearest points, where k might be 5 or 20), done. It demos beautifully and then plateaus fast. It whiffs on exact strings like error codes, because embeddings blur rare identifiers into fuzzy meaning, and it has no way to tell which of 20 similar-looking chunks actually answers the question.`,
          },
          {
            type: 'text',
            md: `So meet the other kind of search. [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) is the keyword-ranking formula that powered search engines for decades. It scores a document higher when it contains the query's exact words, with extra weight for rare words: "E-4402-B" counts for a lot, "the" counts for nothing. No neural network anywhere, and that's its superpower, because it matches text literally. Production systems run both searches and combine them, a setup called **hybrid search**, then add **reranking** on top. This lesson builds both.`,
          },
          {
            type: 'compare',
            left: {
              title: 'Dense vectors catch',
              items: [
                `Paraphrase: "reset my password" matches "credential recovery" with zero shared words`,
                `Concepts across languages and fuzzy wording`,
                `The meaning behind a question, even when it's phrased badly`,
              ],
            },
            right: {
              title: 'BM25 keywords catch',
              items: [
                `Exact identifiers: error codes, part numbers, ticket IDs`,
                `Rare domain jargon`,
                `Proper nouns and product names`,
                `Precise phrases that embeddings smear into vague meaning`,
              ],
            },
          },
        ],
      },
      {
        heading: 'Hybrid search + RRF',
        blocks: [
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>
    <marker id="m5arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a1a1aa"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="700" height="360" rx="10" fill="#18181b"/>
  <rect x="280" y="16" width="140" height="44" rx="6" fill="#27272a" stroke="#38bdf8"/>
  <text x="350" y="43" fill="#e4e4e7" font-size="13" text-anchor="middle">Query</text>
  <line x1="310" y1="60" x2="170" y2="100" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2)"/>
  <line x1="390" y1="60" x2="530" y2="100" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2)"/>
  <rect x="70" y="104" width="190" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="165" y="127" fill="#e4e4e7" font-size="13" text-anchor="middle">BM25 keyword</text>
  <text x="165" y="145" fill="#a1a1aa" font-size="10" text-anchor="middle">exact terms, IDs, jargon</text>
  <rect x="440" y="104" width="190" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="535" y="127" fill="#e4e4e7" font-size="13" text-anchor="middle">Dense vectors</text>
  <text x="535" y="145" fill="#a1a1aa" font-size="10" text-anchor="middle">meaning, paraphrase</text>
  <line x1="165" y1="160" x2="300" y2="200" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2)"/>
  <line x1="535" y1="160" x2="400" y2="200" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2)"/>
  <text x="185" y="188" fill="#a1a1aa" font-size="10">ranked list A</text>
  <text x="455" y="188" fill="#a1a1aa" font-size="10">ranked list B</text>
  <rect x="270" y="204" width="160" height="50" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="350" y="225" fill="#e4e4e7" font-size="13" text-anchor="middle">RRF fusion</text>
  <text x="350" y="243" fill="#a1a1aa" font-size="10" text-anchor="middle">rank-based, no calibration</text>
  <line x1="350" y1="254" x2="350" y2="288" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2)"/>
  <rect x="250" y="292" width="200" height="50" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="350" y="313" fill="#e4e4e7" font-size="13" text-anchor="middle">Cross-encoder rerank</text>
  <text x="350" y="331" fill="#a1a1aa" font-size="10" text-anchor="middle">top-50 in, top-5 out</text>
</svg>`,
            caption: `Hybrid retrieval. Two searchers with opposite blind spots each produce a ranked list, RRF merges the lists by position, and a cross-encoder gives the survivors a careful final read.`,
          },
          {
            type: 'text',
            md: `Running both searches leaves you holding two ranked lists that disagree, and their scores can't be compared: BM25 might score a match 14.7 while cosine similarity says 0.83, and those numbers have nothing to do with each other. **Reciprocal Rank Fusion** (RRF) merges the lists using positions alone. Each document earns 1/(k + rank) from every list it appears in, with k usually set to 60, and the earnings add up.`,
          },
          {
            type: 'text',
            md: `Work one example. A chunk ranked 1st by BM25 and 3rd by vectors earns 1/61 + 1/63, about 0.032. A chunk ranked 1st on one list and absent from the other earns 1/61, about 0.016. The chunk both searchers liked wins by a mile. That's the whole design: agreement between two very different judges is stronger evidence than enthusiasm from one.`,
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>
    <marker id="m5arrow2b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a1a1aa"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="700" height="360" rx="10" fill="#18181b"/>
  <text x="170" y="34" fill="#e4e4e7" font-size="13" text-anchor="middle">BM25 list</text>
  <rect x="60" y="46" width="220" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="72" y="66" fill="#e4e4e7" font-size="11">#1  chunk 17</text>
  <text x="268" y="66" fill="#a1a1aa" font-size="11" text-anchor="end">1/61</text>
  <rect x="60" y="82" width="220" height="30" rx="5" fill="#27272a" stroke="#34d399"/>
  <text x="72" y="102" fill="#e4e4e7" font-size="11">#2  chunk 4</text>
  <text x="268" y="102" fill="#a1a1aa" font-size="11" text-anchor="end">1/62</text>
  <rect x="60" y="118" width="220" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="72" y="138" fill="#e4e4e7" font-size="11">#3  chunk 31</text>
  <text x="268" y="138" fill="#a1a1aa" font-size="11" text-anchor="end">1/63</text>
  <text x="530" y="34" fill="#e4e4e7" font-size="13" text-anchor="middle">Vector list</text>
  <rect x="420" y="46" width="220" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="432" y="66" fill="#e4e4e7" font-size="11">#1  chunk 9</text>
  <text x="628" y="66" fill="#a1a1aa" font-size="11" text-anchor="end">1/61</text>
  <rect x="420" y="82" width="220" height="30" rx="5" fill="#27272a" stroke="#34d399"/>
  <text x="432" y="102" fill="#e4e4e7" font-size="11">#2  chunk 4</text>
  <text x="628" y="102" fill="#a1a1aa" font-size="11" text-anchor="end">1/62</text>
  <rect x="420" y="118" width="220" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="432" y="138" fill="#e4e4e7" font-size="11">#3  chunk 22</text>
  <text x="628" y="138" fill="#a1a1aa" font-size="11" text-anchor="end">1/63</text>
  <line x1="170" y1="152" x2="300" y2="196" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2b)"/>
  <line x1="530" y1="152" x2="400" y2="196" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow2b)"/>
  <text x="350" y="192" fill="#a78bfa" font-size="12" text-anchor="middle">RRF: add 1/(60 + rank) per list</text>
  <rect x="150" y="204" width="400" height="30" rx="5" fill="#27272a" stroke="#34d399"/>
  <text x="162" y="224" fill="#e4e4e7" font-size="11">#1  chunk 4</text>
  <text x="538" y="224" fill="#a1a1aa" font-size="11" text-anchor="end">1/62 + 1/62 = 0.0323</text>
  <rect x="150" y="240" width="400" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="162" y="260" fill="#e4e4e7" font-size="11">#2  chunk 17</text>
  <text x="538" y="260" fill="#a1a1aa" font-size="11" text-anchor="end">1/61 = 0.0164</text>
  <rect x="150" y="276" width="400" height="30" rx="5" fill="#27272a" stroke="#52525b"/>
  <text x="162" y="296" fill="#e4e4e7" font-size="11">#3  chunk 9</text>
  <text x="538" y="296" fill="#a1a1aa" font-size="11" text-anchor="end">1/61 = 0.0164</text>
  <text x="350" y="340" fill="#e4e4e7" font-size="12" text-anchor="middle">Second place on both lists beats first place on one. Agreement wins.</text>
</svg>`,
            caption: `RRF on two three-item lists. Chunk 4 never topped either list, but both searchers ranked it well, so it wins the fused ranking.`,
          },
          {
            type: 'code',
            lang: 'python',
            code: `def rrf(rankings, k=60):
    # rankings: list of ranked lists of doc ids
    scores = {}
    for ranked in rankings:
        for rank, doc_id in enumerate(ranked):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)

fused = rrf([bm25_ids, dense_ids])[:50]  # feed these 50 to the reranker`,
            caption: `Reciprocal Rank Fusion in eight lines of Python. Hand it the two ranked lists of ids and it returns one merged ranking.`,
          },
          {
            type: 'text',
            md: `The last box in the diagram is the **reranker**, and it needs one new term. Your embedding model is a *bi-encoder*: it reads the query and each document separately, producing one vector for each, which is what makes it fast enough to search millions of chunks. A **cross-encoder** reads the query and a document *together*, as a single input, and outputs one relevance score. Attending across both texts at once makes it far more accurate, and far too slow to run against a whole corpus, since it costs a full model pass per pair.`,
          },
          {
            type: 'text',
            md: `So you use each where it shines. The fast hybrid retriever casts a wide net, say the top 50. The cross-encoder carefully re-scores just those 50, and only the best 3 to 5 reach the prompt. This is the standard first upgrade when naive RAG underperforms: hosted, it's [Cohere Rerank](https://docs.cohere.com/docs/rerank-overview), one API call; open weights, it's [BGE-reranker](https://huggingface.co/BAAI/bge-reranker-v2-m3), one small model you host. Either way it usually delivers the biggest single quality jump available in the stack, with zero re-indexing.`,
          },
        ],
      },
      {
        heading: 'Eval discipline first',
        blocks: [
          {
            type: 'callout',
            variant: 'tip',
            title: 'Rule: no eval set, no tuning',
            md: `Before you touch chunk sizes or add a reranker, collect 50 to 200 real queries against *your* corpus, each labeled with the document that should answer it. Measure the hit rate: how often the right source shows up in the retrieved top k. Then change one variable at a time and re-measure. [RAGAS](https://docs.ragas.io) automates the grading with four scores: faithfulness (did the answer stick to the retrieved text), answer relevance (did it address the question), plus context precision and context recall (was the retrieved text the right text, and was all the right text retrieved).`,
          },
          {
            type: 'text',
            md: `"Real queries" means queries users actually asked, pulled from support tickets, Slack threads, and search logs. Questions you invent by reading the documents are a trap: they reuse the document's own vocabulary, so your retriever aces them and you learn nothing. Real users misspell things, leave out context, and come at topics sideways. Your eval set should be exactly that brutal, because that's what production traffic looks like.`,
          },
        ],
      },
      {
        heading: 'Common failure modes',
        blocks: [
          {
            type: 'table',
            headers: ['Failure', 'Symptom', 'Fix'],
            rows: [
              [
                'Bad chunking',
                'Retrieved chunks start or stop mid-thought, and answers feel truncated',
                'Split on structural boundaries like headings and paragraphs, add overlap, then re-index',
              ],
              [
                'Stale index',
                'Confident answers quoting documents that changed weeks ago',
                'Re-embed documents whenever they change, and monitor how old the index is',
              ],
              [
                'Embedding mismatch',
                'Retrieval turns near-random after a model or version change',
                'Pin the exact model and version; any switch means a full re-index',
              ],
              [
                'Right chunk, buried',
                'The correct chunk sits at rank 15 of 20, and the model answers from the noise above it',
                'Add a reranker and shrink the final k so the junk never reaches the prompt',
              ],
            ],
          },
          {
            type: 'text',
            md: `Notice which component the table never blames: the generator. When a RAG system gives a wrong answer, the language model usually did a fine job with the material it was handed. The material was wrong. Debug retrieval first, every time.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: measure, then upgrade the toy RAG',
      intro: `Turn yesterday's toy into an honest experiment: build a small eval set, record a baseline, add hybrid search or a reranker, and prove the improvement with numbers instead of impressions.`,
      steps: [
        `Write 10 real questions against your 10-document corpus and record which document should answer each one; that file is your mini eval set`,
        `Measure the baseline: for each question, check whether the correct source appears in the top 5, and record the hit rate as n out of 10`,
        `Add keyword search: *pip install rank-bm25*, index the same chunks with it, and fuse the BM25 and vector results using the RRF function from this lesson`,
        `Add a reranker as well, or instead: score the fused top 20 with a BGE-reranker model or the Cohere Rerank API and keep the top 5`,
        `Re-run all 10 questions and record the new hit rate next to the old one`,
        `Inspect the differences: for every question that flipped, name which failure mode from the table explains it`,
      ],
      checklist: [
        `A 10-question eval set with expected sources exists as a file you can re-run, instead of living in your head`,
        `The baseline hit rate was recorded before any change was made`,
        `Hybrid search or a reranker is wired in and running`,
        `The post-change hit rate is recorded, and at least one flipped query is explained by a named failure mode`,
      ],
    },
    checkQuiz: [
      {
        q: `Which four scores does RAGAS measure out of the box?`,
        options: [
          `Latency, throughput, cost, uptime`,
          `Faithfulness, answer relevance, context precision, context recall`,
          `BLEU, ROUGE, perplexity, F1`,
          `Chunk size, overlap, k, fusion constant`,
        ],
        answer: 1,
        explain: `RAGAS grades both halves of the system. Context precision and context recall ask whether retrieval fetched the right text. Faithfulness and answer relevance ask whether the generated answer stayed grounded in that text and actually addressed the question.`,
      },
      {
        q: `The docs were updated three weeks ago, but answers still quote the old policy. What's the diagnosis?`,
        options: [
          `An embedding mismatch between index and query`,
          `The reranker is overfitting to old documents`,
          `A stale index: the changed documents were never re-embedded, so retrieval keeps serving the old chunks`,
          `The generator has memorized the old policy`,
        ],
        answer: 2,
        explain: `A RAG system answers from its index, and the index only knows what it was last shown. Without a re-embed-on-change trigger, the index drifts away from the live documents in silence, and the system keeps citing yesterday's truth with full confidence.`,
      },
      {
        q: `In the lab, hit rate is defined as:`,
        options: [
          `The fraction of eval questions whose correct source document appears in the retrieved top k`,
          `The percentage of chunks that get retrieved at least once`,
          `Tokens retrieved divided by tokens generated`,
          `The reranker score of the best chunk`,
        ],
        answer: 0,
        explain: `It's the bluntest useful retrieval metric. For each question where you already know the right document, check whether that document made the top k. Count the successes, divide by the number of questions, and you have a number every future change can be judged against.`,
      },
      {
        q: `Your naive RAG system underperforms in production. What's the standard FIRST move?`,
        options: [
          `Swap the generator for a bigger model`,
          `Fine-tune the embedding model on your corpus`,
          `Bolt a cross-encoder reranker onto the existing retriever`,
          `Rewrite the corpus so it embeds better`,
        ],
        answer: 2,
        explain: `A reranker is the cheapest, least invasive change with the largest typical payoff: one extra call sitting between retrieval and generation, no re-indexing required, and often the biggest single quality jump in the stack.`,
      },
    ],
    resources: [
      { label: 'RAGAS: RAG evaluation framework', url: 'https://docs.ragas.io', kind: 'docs' },
      { label: 'Cohere Rerank overview', url: 'https://docs.cohere.com/docs/rerank-overview', kind: 'docs' },
      { label: 'Qdrant: Hybrid search explained', url: 'https://qdrant.tech/articles/hybrid-search/', kind: 'article' },
      { label: 'Original RRF paper (Cormack et al.)', url: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', kind: 'article' },
      { label: 'BGE reranker v2 (open cross-encoder)', url: 'https://huggingface.co/BAAI/bge-reranker-v2-m3', kind: 'docs' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m5-l3: Agentic RAG & the Decision Rule
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l3',
    title: 'Agentic RAG & the Decision Rule',
    day: 20,
    minutes: 55,
    xp: 100,
    objectives: [
      `Can explain agentic RAG as retrieval-as-a-tool inside the agent loop and say when it earns its extra cost`,
      `Can apply the 2026 decision rule (cached long context, RAG, or fine-tuning) with real numbers`,
      `Can describe what keyword-only retrieval misses, using Claude Code memory as the example`,
      `Can write a defensible one-page retrieval architecture decision for a corpus you care about`,
    ],
    skipQuiz: [
      {
        q: `What turns classic RAG into agentic RAG?`,
        options: [
          `A bigger embedding model behind the same pipeline`,
          `Retrieval becomes a tool the model calls inside its own loop, so it plans searches, judges the results, and reformulates when they come back weak`,
          `Running the same pipeline on an agent framework instead of a script`,
          `Adding a reranker after the vector store`,
        ],
        answer: 1,
        explain: `The structural change is who controls retrieval. In classic RAG, the pipeline retrieves once, blindly, before the model even starts thinking. In agentic RAG, the model decides when to search, reads what came back, and searches again with a better query if the first pass missed.`,
      },
      {
        q: `A 60-page employee handbook, updated quarterly, queried thousands of times a day. What's the 2026 answer?`,
        options: [
          `A full RAG pipeline with hybrid search and reranking`,
          `Fine-tune a model on the handbook`,
          `Cached long context: send the whole handbook in every prompt, and let cache reads at roughly a tenth of the input price make the repeats cheap`,
          `An agent that greps the PDF on demand`,
        ],
        answer: 2,
        explain: `Small, stable, high-traffic corpora are exactly the territory that cheap cached context took away from RAG. The handbook fits in the window with room to spare, quarterly updates mean the cache rarely rebuilds, and you skip the entire pipeline along with the risk of a stale index.`,
      },
      {
        q: `Why is fine-tuning the wrong tool for keeping a model current on company knowledge?`,
        options: [
          `Fine-tuning is only available on open-weight models`,
          `Fine-tuning reliably changes style, format, and behavior, while facts stick inconsistently, and every knowledge update means another training run instead of a cheap re-index`,
          `Fine-tuned models lose the ability to use retrieval afterwards`,
          `It always costs more than RAG at any scale`,
        ],
        answer: 1,
        explain: `Weights soak up habits well and facts poorly. Even when a fact does stick, updating it means collecting data and retraining, and you can never audit which facts made it in. A corpus that gets re-indexed on every change gives you fresh knowledge with a paper trail.`,
      },
      {
        q: `What specifically let cached long context kill low-end RAG?`,
        options: [
          `Context windows became faster to process than vector lookups`,
          `A 1M-token window fits small corpora whole, and cache reads at about 0.1x the input price make re-sending the corpus nearly free after the first request`,
          `Vector databases became too expensive to license`,
          `Models stopped hallucinating on long documents`,
        ],
        answer: 1,
        explain: `The economics flipped. When every request paid full input price to resend a corpus, RAG's smaller prompts paid for the pipeline's complexity. With cached reads at a tenth of the price, resending a small stable corpus costs almost nothing, and the pipeline stops earning its keep.`,
      },
      {
        q: `Claude Code's memory search is keyword-only. What does it miss, and why does that motivate the RAG stack?`,
        options: [
          `It can't search across multiple memory files`,
          `Notes phrased differently from the query stay invisible: "auth flow rewrite" never matches a search for "login pipeline overhaul", and catching that kind of match is exactly what embeddings do`,
          `It's slower than vector search at any corpus size`,
          `It can't rank results at all`,
        ],
        answer: 1,
        explain: `Keyword matching needs shared vocabulary between the query and the note. Semantic search retrieves by meaning instead, so two phrasings of the same idea can find each other. That gap is the entire reason embedding-based search add-ons exist.`,
      },
    ],
    sections: [
      {
        heading: 'Retrieval as a tool in the loop',
        blocks: [
          {
            type: 'text',
            md: `Classic RAG is a fixed pipe: retrieve once, generate once, done. Nobody ever checks whether that one retrieval was any good. **Agentic RAG** changes who's in charge. Retrieval becomes a **tool** the model can call whenever it wants, the same way the agents you built in [Agents, Harnesses & Loops · Anatomy of the Agent Loop](lesson:m2-l2) called a web search or a file reader. The model plans what it needs to know, fires a search, reads what came back, and then decides: is this enough to answer?`,
          },
          {
            type: 'text',
            md: `When a search comes back weak, the model rewrites the query and tries again, or splits a big question into smaller sub-questions, or reaches for a different tool entirely: vector search, SQL, web search, plain grep. Retrieval quality stops being a single roll of the dice and becomes a loop with feedback. That loop is the 2026 default for hard, multi-step questions.`,
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>
    <marker id="m5arrow3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a1a1aa"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="700" height="320" rx="10" fill="#18181b"/>
  <path d="M430,64 L430,30 L90,30 L90,60" fill="none" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#m5arrow3)"/>
  <text x="260" y="22" fill="#fbbf24" font-size="11" text-anchor="middle">weak results: reformulate / decompose</text>
  <rect x="20" y="64" width="140" height="52" rx="6" fill="#27272a" stroke="#38bdf8"/>
  <text x="90" y="86" fill="#e4e4e7" font-size="13" text-anchor="middle">Plan</text>
  <text x="90" y="104" fill="#a1a1aa" font-size="10" text-anchor="middle">what do I need?</text>
  <rect x="190" y="64" width="140" height="52" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="260" y="86" fill="#e4e4e7" font-size="13" text-anchor="middle">Retrieve</text>
  <text x="260" y="104" fill="#a1a1aa" font-size="10" text-anchor="middle">tool call(s)</text>
  <rect x="360" y="64" width="140" height="52" rx="6" fill="#27272a" stroke="#f472b6"/>
  <text x="430" y="86" fill="#e4e4e7" font-size="13" text-anchor="middle">Assess</text>
  <text x="430" y="104" fill="#a1a1aa" font-size="10" text-anchor="middle">enough? relevant?</text>
  <rect x="530" y="64" width="150" height="52" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="605" y="86" fill="#e4e4e7" font-size="13" text-anchor="middle">Answer</text>
  <text x="605" y="104" fill="#a1a1aa" font-size="10" text-anchor="middle">with citations</text>
  <line x1="160" y1="90" x2="186" y2="90" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow3)"/>
  <line x1="330" y1="90" x2="356" y2="90" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow3)"/>
  <line x1="500" y1="90" x2="526" y2="90" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow3)"/>
  <line x1="170" y1="196" x2="240" y2="120" stroke="#52525b" stroke-width="1.5"/>
  <line x1="350" y1="196" x2="262" y2="120" stroke="#52525b" stroke-width="1.5"/>
  <line x1="530" y1="196" x2="285" y2="120" stroke="#52525b" stroke-width="1.5"/>
  <rect x="100" y="200" width="140" height="42" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="170" y="226" fill="#e4e4e7" font-size="12" text-anchor="middle">vector search</text>
  <rect x="280" y="200" width="140" height="42" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="350" y="226" fill="#e4e4e7" font-size="12" text-anchor="middle">SQL</text>
  <rect x="460" y="200" width="140" height="42" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="530" y="226" fill="#e4e4e7" font-size="12" text-anchor="middle">web search</text>
  <text x="350" y="290" fill="#a1a1aa" font-size="11" text-anchor="middle">The model owns the loop. Retrieval is just another tool it can call, judge, and retry.</text>
</svg>`,
            caption: `Agentic RAG. The model plans, retrieves, and judges the results, looping back with a better query when the results are weak, and mixing whatever retrieval tools the question calls for.`,
          },
          {
            type: 'compare',
            left: {
              title: 'Classic one-shot RAG',
              items: [
                `One fixed pass: retrieve, then generate`,
                `Cheap and fast, with a single retrieval and a single model call`,
                `Fails silently when the first retrieval misses`,
                `Right for simple single-hop questions at high volume`,
              ],
            },
            right: {
              title: 'Agentic RAG (2026 default for hard cases)',
              items: [
                `The model plans and issues as many searches as it needs`,
                `Judges results, rewrites weak queries, splits big questions`,
                `Mixes tools: vector search, SQL, web, filesystem`,
                `Slower and pricier per question, so save it for multi-hop, high-value work`,
              ],
            },
          },
        ],
      },
      {
        heading: 'The decision rule',
        blocks: [
          {
            type: 'text',
            md: `By 2026, RAG has real competition, and choosing between the options is arithmetic. Option one is **cached long context**: put the whole corpus in every prompt and rely on [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), where the provider stores the repeated prefix and charges roughly a tenth of the normal input price to reuse it. Option two is RAG, which retrieves small slices per query. Option three is **fine-tuning**: extra training that adjusts the model's weights. Here's how the territory divides:`,
          },
          {
            type: 'table',
            headers: ['Approach', 'Use when', 'Why'],
            rows: [
              [
                'Cached long context',
                'The corpus fits in a 1M-token window, rarely changes, and gets queried a lot',
                'Cache reads cost about 0.1x the input price. No pipeline to build, no index to go stale. This is what killed low-end RAG',
              ],
              [
                'RAG',
                'The corpus is huge, changes often, carries per-user permissions, or answers need citations',
                'Retrieval scales past any window, can filter by access rights at query time, and carries source metadata for citations',
              ],
              [
                'Fine-tuning',
                'The problem is behavior: tone, output format, tool-call shape, classification habits',
                'Weights store habits well and facts poorly. Updating knowledge would mean retraining, while a corpus just gets re-indexed',
              ],
              [
                'Hybrid',
                'A stable core corpus plus a fresh or per-user slice',
                'Cache the stable core in the prompt, and retrieve only the part that changes',
              ],
            ],
          },
          {
            type: 'diagram',
            svg: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>
    <marker id="m5arrow4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#a1a1aa"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="700" height="400" rx="10" fill="#18181b"/>
  <rect x="30" y="24" width="360" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="210" y="48" fill="#e4e4e7" font-size="12" text-anchor="middle">Is the problem HOW the model writes or acts?</text>
  <text x="210" y="66" fill="#a1a1aa" font-size="10" text-anchor="middle">tone, format, tool-call shape, habits</text>
  <rect x="470" y="24" width="210" height="56" rx="6" fill="#27272a" stroke="#a78bfa"/>
  <text x="575" y="48" fill="#e4e4e7" font-size="13" text-anchor="middle">Fine-tune</text>
  <text x="575" y="66" fill="#a1a1aa" font-size="10" text-anchor="middle">weights hold habits</text>
  <line x1="390" y1="52" x2="466" y2="52" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="428" y="44" fill="#34d399" font-size="10" text-anchor="middle">yes</text>
  <line x1="210" y1="80" x2="210" y2="114" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="222" y="102" fill="#a1a1aa" font-size="10">no</text>
  <rect x="30" y="118" width="360" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="210" y="142" fill="#e4e4e7" font-size="12" text-anchor="middle">Fits in a 1M window and rarely changes?</text>
  <text x="210" y="160" fill="#a1a1aa" font-size="10" text-anchor="middle">handbook, style guide, small FAQ</text>
  <rect x="470" y="118" width="210" height="56" rx="6" fill="#27272a" stroke="#38bdf8"/>
  <text x="575" y="142" fill="#e4e4e7" font-size="13" text-anchor="middle">Cached long context</text>
  <text x="575" y="160" fill="#a1a1aa" font-size="10" text-anchor="middle">cache reads at ~0.1x</text>
  <line x1="390" y1="146" x2="466" y2="146" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="428" y="138" fill="#34d399" font-size="10" text-anchor="middle">yes</text>
  <line x1="210" y1="174" x2="210" y2="208" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="222" y="196" fill="#a1a1aa" font-size="10">no</text>
  <rect x="30" y="212" width="360" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="210" y="236" fill="#e4e4e7" font-size="12" text-anchor="middle">Big, fresh, or per-user permissions? Citations?</text>
  <text x="210" y="254" fill="#a1a1aa" font-size="10" text-anchor="middle">knowledge base, support corpus</text>
  <rect x="470" y="212" width="210" height="56" rx="6" fill="#27272a" stroke="#34d399"/>
  <text x="575" y="236" fill="#e4e4e7" font-size="13" text-anchor="middle">RAG</text>
  <text x="575" y="254" fill="#a1a1aa" font-size="10" text-anchor="middle">retrieve slices per query</text>
  <line x1="390" y1="240" x2="466" y2="240" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="428" y="232" fill="#34d399" font-size="10" text-anchor="middle">yes</text>
  <line x1="210" y1="268" x2="210" y2="302" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="222" y="290" fill="#a1a1aa" font-size="10">no</text>
  <rect x="30" y="306" width="360" height="56" rx="6" fill="#27272a" stroke="#52525b"/>
  <text x="210" y="330" fill="#e4e4e7" font-size="12" text-anchor="middle">Stable core plus a changing slice?</text>
  <text x="210" y="348" fill="#a1a1aa" font-size="10" text-anchor="middle">docs that rarely move + fresh tickets</text>
  <rect x="470" y="306" width="210" height="56" rx="6" fill="#27272a" stroke="#fbbf24"/>
  <text x="575" y="330" fill="#e4e4e7" font-size="13" text-anchor="middle">Hybrid</text>
  <text x="575" y="348" fill="#a1a1aa" font-size="10" text-anchor="middle">cache the core, retrieve the rest</text>
  <line x1="390" y1="334" x2="466" y2="334" stroke="#a1a1aa" stroke-width="1.5" marker-end="url(#m5arrow4)"/>
  <text x="428" y="326" fill="#34d399" font-size="10" text-anchor="middle">yes</text>
</svg>`,
            caption: `The 2026 decision rule as a flowchart. Start at the top and take the first yes.`,
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Run the numbers',
            md: `The decision comes down to two multiplications. Long-context cost: corpus tokens times input price times monthly traffic, with the cached rate of roughly 0.1x applied to the repeated prefix. RAG cost: a one-time embedding pass, vector store hosting, and a much smaller prompt per query, plus the ongoing risk of a stale index. Below a few hundred thousand tokens of stable corpus, cached context usually wins on both cost and simplicity. Large, fresh, or permissioned corpora push you back to RAG. And when the complaint is about how the model writes rather than what it knows, neither option helps: that's a fine-tuning problem.`,
          },
        ],
      },
      {
        heading: 'The gap, in the tool you use daily',
        blocks: [
          {
            type: 'text',
            md: `A motivating example lives in a tool you use every day: [Claude Code's memory search](https://code.claude.com/docs/en/memory) is keyword-only, with no embeddings anywhere. Search your memory for "login pipeline overhaul" and a note titled "auth flow rewrite" stays invisible, because the two phrases share zero words, even though they describe the same work. That miss is exactly the gap semantic search fills, and it's why embedding-based add-ons like memsearch exist. To be fair, keyword search earns its place: it's cheap, fully transparent (you can always see why something matched), and good enough surprisingly often. The wheels come off when vocabulary drifts.`,
          },
          {
            type: 'text',
            md: `Zoom out to a whole company and the same layering shows up in the **Company Brain** pattern. At the bottom, a *capture* layer lands everything (meeting transcripts, docs, Slack) as searchable files. A *retrieval* layer runs hybrid search over all of it. And sitting on top is a *source-of-truth* layer: curated, canonical answers that outrank the raw captures whenever the two conflict. RAG is the middle layer, and it's worthless without capture feeding it from below and governance correcting it from above.`,
          },
          {
            type: 'callout',
            variant: 'quote',
            md: `Pick the tool by naming the failure. Wrong style or format points to fine-tuning. Stale or missing facts point to retrieval. And when the whole corpus fits in a cached window, the honest answer is often that you need neither.`,
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: a one-page architecture decision',
      intro: `Take a corpus you actually care about (notes, docs, meeting transcripts) and decide how you'd serve it: long context, RAG, or hybrid. With numbers, the way you would for any architecture review.`,
      steps: [
        `Pick the corpus and size it: count the documents and estimate total tokens (word count times 1.3 gets close enough)`,
        `Characterize it on three axes: how fast it grows (static, monthly, daily), who can access it (one user or per-user permissions), and how many queries per month you realistically expect`,
        `Cost the long-context option: corpus tokens times input price times expected monthly calls, then recompute with cache reads at 0.1x for the stable prefix`,
        `Cost the RAG option: a one-time embedding pass over the corpus, vector store hosting, and the much smaller per-query prompt`,
        `Make the call (long context, RAG, or hybrid) and write the one-pager: the context, the numbers, the decision, and what change would flip it`,
        `Stress-test the decision: multiply the corpus by 10, then the traffic by 10, and note in the doc where each break-point flips your answer`,
      ],
      checklist: [
        `The corpus token count is estimated and written down`,
        `Both options are costed with real prices, including the 0.1x cached-read case`,
        `The decision states its flip condition: the growth or traffic level at which the answer changes`,
        `The one-pager fits on one page, and a colleague could follow the reasoning cold`,
      ],
    },
    checkQuiz: [
      {
        q: `What's the honest cost profile of agentic RAG compared to classic one-shot RAG?`,
        options: [
          `Agentic is cheaper because it retrieves fewer chunks overall`,
          `Identical cost, since the same retrievals happen either way`,
          `Agentic spends more latency and more tokens on repeated retrieve-and-reason rounds, and that spend buys accuracy on multi-hop questions`,
          `Classic RAG is slower because its pipeline is fixed`,
        ],
        answer: 2,
        explain: `Every loop iteration is another model turn plus another retrieval, and none of that is free. You're paying for the retries and the planning. The trade makes sense exactly when one-shot retrieval keeps missing, which is typical for questions that need several hops of evidence.`,
      },
      {
        q: `Why does per-user permissioned data push you toward RAG rather than long context or fine-tuning?`,
        options: [
          `Permissions make documents too large for context windows`,
          `The retrieval layer can check each user's access rights at query time and fetch only the chunks that user may see, a gate that weights and shared prompts can't provide`,
          `Fine-tuned models refuse to answer permissioned questions`,
          `Vector stores encrypt documents automatically`,
        ],
        answer: 1,
        explain: `Access control needs a checkpoint that runs on every single query. Data baked into model weights, or sitting in a prompt shared across users, is visible to everyone who can ask a question. A retriever can consult the access control list (the ACL, the record of who may see what) before returning anything.`,
      },
      {
        q: `In the Company Brain layering, what sits ABOVE retrieval, and why is it there?`,
        options: [
          `The capture layer, to filter what gets stored`,
          `A source-of-truth layer of curated canonical answers that outrank raw captured documents whenever the two conflict`,
          `A fine-tuned model that memorizes the corpus`,
          `A second vector store for redundancy`,
        ],
        answer: 1,
        explain: `Raw captures contradict each other and go stale, because meetings and Slack threads were never written to serve as reference material. A governed truth layer wins those conflicts, so retrieval serves the blessed answer instead of whichever document shouts loudest.`,
      },
      {
        q: `Inside the agent loop, what typically triggers a query reformulation?`,
        options: [
          `A fixed timer on every retrieval call`,
          `The model reads the retrieved chunks, judges them weak or off-target, and rewrites the query or splits it into sub-queries before trying again`,
          `The vector store returning an error code`,
          `The reranker demoting all candidates below a threshold set in config`,
        ],
        answer: 1,
        explain: `The assess step is the whole point of the loop. The model acts as its own relevance judge: it looks at what a search returned, decides whether that material can actually answer the question, and uses that diagnosis to search again, differently.`,
      },
    ],
    resources: [
      { label: 'Anthropic: Building Effective Agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', kind: 'article' },
      { label: 'Anthropic prompt caching (the 0.1x economics)', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching', kind: 'docs' },
      { label: 'Claude Code memory docs (keyword-only retrieval)', url: 'https://code.claude.com/docs/en/memory', kind: 'docs' },
      { label: 'RAG_Techniques: advanced patterns catalog', url: 'https://github.com/NirDiamant/RAG_Techniques', kind: 'repo' },
      { label: 'LlamaIndex: agentic retrieval concepts', url: 'https://docs.llamaindex.ai/en/stable/understanding/agent/', kind: 'docs' },
    ],
  },
]
