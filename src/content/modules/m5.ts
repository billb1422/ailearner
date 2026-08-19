import type { Lesson } from '../../types'

export const lessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // m5-l1 — RAG Fundamentals
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l1',
    title: 'RAG Fundamentals',
    day: 19,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can explain when RAG beats context-stuffing: fresh, private, permissioned, or oversized corpora with citations',
      'Can sketch the full canonical pipeline from ingest to evaluate and name what each stage does',
      'Can pick an embedding model and a vector store for a given workload and defend the choice',
      'Can build a working toy RAG over your own documents in about 50 lines',
    ],
    skipQuiz: [
      {
        q: 'You indexed 100k chunks with text-embedding-3-large, then switch query-time embedding to BGE-M3 (same dimension). What happens?',
        options: [
          'Recall drops a few points but stays usable',
          'Retrieval is effectively random — the two models produce incompatible vector spaces, so you must re-index',
          'It works fine as long as the vector dimensions match',
          'Only latency changes; similarity math is model-agnostic',
        ],
        answer: 1,
        explain: 'Matching dimensions is not matching geometry. Index and query must use the same embedding model; switching models means a full re-index.',
      },
      {
        q: 'Why is 200-800 tokens the standard chunk-size band?',
        options: [
          'Vector stores reject documents above 800 tokens',
          'Embedding APIs price per chunk, so smaller is always cheaper',
          'Big chunks dilute the embedding across topics; tiny chunks lose the context needed to answer — this band balances precision and coherence',
          'LLM context windows cap out near 800 tokens per passage',
        ],
        answer: 2,
        explain: 'A chunk should carry one coherent idea: large chunks average multiple topics into a mushy vector, tiny ones strip away meaning.',
      },
      {
        q: 'Your team already runs Postgres in production. Best default vector store for a first RAG service?',
        options: [
          'pgvector — retrieval lives next to your relational data, one system to operate',
          'Pinecone — managed always beats self-hosted',
          'Milvus — you should plan for billions of vectors from day one',
          'A JSON file of vectors scanned with numpy',
        ],
        answer: 0,
        explain: 'The mid-2026 default: if you run Postgres, start with pgvector. Reach for Qdrant/Milvus at scale or Pinecone when you want it managed.',
      },
      {
        q: 'What problem does chunk overlap solve?',
        options: [
          'It reduces total index size by deduplicating tokens',
          'An idea split across a chunk boundary survives intact in at least one chunk, so it stays retrievable',
          'It makes BM25 keyword search unnecessary',
          'It lets you skip the reranking stage',
        ],
        answer: 1,
        explain: 'Without overlap, a sentence sliced mid-thought at a boundary may match no chunk well. Overlap keeps boundary-spanning ideas whole somewhere.',
      },
      {
        q: 'Which situation genuinely requires RAG rather than pasting documents into the prompt?',
        options: [
          'A 20-page style guide used by one internal bot',
          'A static FAQ of 30 questions',
          'A 4M-document corpus updated hourly, where each user may only see documents they have permission for',
          'A single PDF the user just uploaded',
        ],
        answer: 2,
        explain: 'Scale beyond any context window, freshness, and per-user permissions are the classic RAG triggers. Small static corpora fit in context.',
      },
    ],
    sections: [
      {
        heading: 'Why RAG exists',
        blocks: [
          {
            type: 'text',
            md: 'Models know nothing after their training cutoff and nothing about your private data. Retrieval-Augmented Generation fixes that at query time: fetch the relevant slices of a corpus, hand them to the model, generate an answer grounded in them. You get four things context-stuffing cannot deliver: **fresh** data, **private** data, **per-user permissions** enforced at retrieval, and **citations** back to sources.',
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'The one-line pitch',
            md: 'RAG is a *search engine bolted to a generator*. Everything that made search good for 25 years — indexing, ranking, relevance evaluation — is now your problem too. Treat it as an information-retrieval system, not a prompt trick.',
          },
          {
            type: 'text',
            md: 'The fourth driver is scale. Context windows hit 1M tokens in 2025-2026, which killed RAG for *small* corpora — but a real knowledge base is gigabytes. No window holds it, and even if one did, attention degrades over huge contexts. Retrieval selects the 0.01 percent that matters.',
          },
        ],
      },
      {
        heading: 'The canonical pipeline',
        blocks: [
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
  <text x="350" y="310" fill="#a1a1aa" font-size="11" text-anchor="middle">Switching models = full re-index. There is no shortcut.</text>
</svg>`,
            caption: 'The canonical RAG pipeline, mid-2026. Index once, query forever — with one non-negotiable invariant.',
          },
          {
            type: 'text',
            md: 'Chunking is where most quality is won or lost. Split on **semantic or structural boundaries** — headings, paragraphs, functions — not blind character counts. Target 200-800 tokens per chunk with 10-20 percent overlap so ideas that straddle a boundary survive in at least one chunk. A mid-thought split produces a chunk no query will ever match.',
          },
        ],
      },
      {
        heading: 'Embeddings: the model you marry',
        blocks: [
          {
            type: 'table',
            headers: ['Model', 'Type', 'Why pick it'],
            rows: [
              ['text-embedding-3-large', 'Hosted (OpenAI)', 'Strong general default, cheap, everywhere'],
              ['Cohere Embed v4', 'Hosted', 'Multimodal, strong multilingual retrieval'],
              ['Voyage (voyage-code, -finance, -law)', 'Hosted', 'Domain-tuned variants beat generalists on their turf'],
              ['BGE-M3', 'Open weights', 'Dense + sparse + multi-vector in one model; self-host'],
              ['Qwen3-Embedding', 'Open weights', 'Top open performer; multilingual; local-first stacks'],
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'The invariant, again',
            md: 'The index and the query MUST use the same embedding model — same version, same settings. Change the model and every stored vector is garbage relative to new queries. Budget for re-indexing as a routine operation before you pick a hosted model that can be deprecated under you.',
          },
        ],
      },
      {
        heading: 'Vector stores: boring choices win',
        blocks: [
          {
            type: 'table',
            headers: ['Store', 'Slot', 'Reach for it when'],
            rows: [
              ['pgvector', 'Default', 'You already run Postgres — retrieval joins your relational data'],
              ['Chroma', 'Local dev', 'Prototyping, labs, embedded in-process, zero ops'],
              ['Qdrant / Milvus', 'Scale', 'Hundreds of millions of vectors, heavy filtering, dedicated infra'],
              ['Pinecone', 'Managed', 'You want zero operations and accept vendor pricing'],
            ],
          },
          {
            type: 'text',
            md: 'The store is the least interesting decision in the stack — similarity search is a commodity. Pick the one closest to infrastructure you already operate and spend the saved attention on chunking and evaluation, where quality actually lives. Here is the entire toy pipeline you will build in the lab:',
          },
          {
            type: 'code',
            lang: 'python',
            code: `import glob
import chromadb

client = chromadb.PersistentClient(path="./rag_db")
coll = client.get_or_create_collection("mydocs")

# ---- index time: ingest -> chunk -> embed -> store ----
for path in glob.glob("docs/*"):
    words = open(path, encoding="utf-8").read().split()
    step, size = 250, 300           # ~50-word overlap
    chunks = [" ".join(words[i:i + size]) for i in range(0, len(words), step)]
    coll.add(
        documents=chunks,
        ids=[f"{path}-{i}" for i in range(len(chunks))],
        metadatas=[{"source": path}] * len(chunks),
    )

# ---- query time: retrieve top-k with sources ----
while True:
    q = input("question> ")
    res = coll.query(query_texts=[q], n_results=5)
    for doc, meta in zip(res["documents"][0], res["metadatas"][0]):
        print(meta["source"], "::", doc[:160].replace("\\n", " "))`,
            caption: 'A complete RAG index-and-query loop. Chroma embeds with a local model by default — no API key needed.',
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: a toy RAG in ~50 lines',
      intro: 'Build the whole pipeline — ingest, chunk, embed, store, retrieve — over 10 of your own documents. Chroma keeps it to one pip install; swap in pgvector if you prefer Postgres.',
      steps: [
        'Create a project folder and drop in 10 real documents you know well (notes, READMEs, blog drafts) as .md or .txt under docs/',
        'Set up the environment: *pip install chromadb* in a fresh venv',
        'Write the indexer: read each file, split into ~300-word chunks with ~50-word overlap, add to a Chroma collection with the source path as metadata',
        'Write the query loop: embed the question, pull top-5 chunks, print each with its source',
        'Ask 5 questions you know the answers to and inspect which chunks come back — note every miss',
        'Break it on purpose: re-run queries with a different embedding model than the index and watch retrieval fall apart',
      ],
      checklist: [
        'Indexing runs end-to-end and reports a sensible chunk count for 10 documents',
        'At least 4 of 5 known-answer questions surface a relevant chunk in the top 5',
        'Each result prints the source document it came from (citation plumbing works)',
        'You observed the embedding-mismatch failure and can explain why it happens',
      ],
    },
    checkQuiz: [
      {
        q: 'Where does reranking sit in the pipeline?',
        options: [
          'Before embedding, to filter low-quality chunks out of the index',
          'Between retrieval and generation — it reorders the retrieved candidates before the model sees them',
          'After generation, to score the final answer',
          'In place of the vector store for small corpora',
        ],
        answer: 1,
        explain: 'The retriever casts a wide net (say top-50); the reranker re-scores those candidates precisely so only the best few reach the prompt.',
      },
      {
        q: 'You are building the lab prototype on a laptop, and the production target is 300M vectors with heavy metadata filtering. Reasonable pairing?',
        options: [
          'Chroma for the prototype, Qdrant or Milvus for production',
          'Pinecone for the prototype, Chroma for production',
          'pgvector for both, no matter what',
          'Milvus for the prototype, a flat file for production',
        ],
        answer: 0,
        explain: 'Chroma is the zero-ops dev tool; Qdrant/Milvus are the dedicated engines built for that scale and filter load.',
      },
      {
        q: 'What is the case for a Voyage domain-specific embedding model over a general one?',
        options: [
          'It is always cheaper per token',
          'It removes the need for chunking',
          'Domain-tuned models (code, finance, law) capture in-domain similarity that generalist embeddings blur, lifting retrieval on that corpus',
          'It lets index and query use different models safely',
        ],
        answer: 2,
        explain: 'In specialized corpora, domain terms that look similar to a generalist are meaningfully different. Domain-tuned embeddings preserve those distinctions.',
      },
      {
        q: 'Why can a RAG answer carry trustworthy citations when a plain LLM answer cannot?',
        options: [
          'The generator is fine-tuned to memorize URLs',
          'Each retrieved chunk arrives with source metadata, so the answer can point at the exact documents it was grounded in',
          'The vector store validates facts before returning them',
          'Citations are generated by a separate hallucination-free model',
        ],
        answer: 1,
        explain: 'Provenance rides along from ingest: chunk metadata names the source, so claims map back to real documents instead of model memory.',
      },
    ],
    resources: [
      { label: 'pgvector — vectors in Postgres', url: 'https://github.com/pgvector/pgvector', kind: 'repo' },
      { label: 'Chroma documentation', url: 'https://docs.trychroma.com', kind: 'docs' },
      { label: 'OpenAI embeddings guide', url: 'https://platform.openai.com/docs/guides/embeddings', kind: 'docs' },
      { label: 'BGE / FlagEmbedding (open embeddings + rerankers)', url: 'https://github.com/FlagOpen/FlagEmbedding', kind: 'repo' },
      { label: 'Anthropic: Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', kind: 'article' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m5-l2 — Retrieval Quality
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l2',
    title: 'Retrieval Quality',
    day: 19,
    minutes: 40,
    xp: 100,
    objectives: [
      'Can explain why naive dense retrieval is the beginner ceiling and what hybrid search adds',
      'Can implement Reciprocal Rank Fusion to merge BM25 and dense result lists',
      'Can add a cross-encoder reranker as the standard first optimization',
      'Can build a real-query eval set and measure retrieval changes instead of guessing',
    ],
    skipQuiz: [
      {
        q: 'What does Reciprocal Rank Fusion (RRF) actually do?',
        options: [
          'Averages the raw similarity scores of BM25 and dense retrieval',
          'Combines ranked lists using only rank positions — no score calibration needed between systems',
          'Trains a small model to weight each retriever',
          'Deduplicates chunks that appear in both lists',
        ],
        answer: 1,
        explain: 'BM25 scores and cosine similarities live on incomparable scales. RRF sidesteps calibration entirely by scoring each doc as a sum of 1/(k + rank).',
      },
      {
        q: 'Why use a cross-encoder for reranking but not for first-stage retrieval?',
        options: [
          'Cross-encoders only work on keyword matches',
          'They are less accurate than bi-encoders but faster',
          'They score query and document jointly — far more accurate, but too slow to run against the whole corpus, so you apply them to the top-k only',
          'Vector stores cannot host cross-encoders',
        ],
        answer: 2,
        explain: 'Joint attention over query+document beats comparing two independent vectors, but it costs a forward pass per pair — affordable for 50 candidates, not 5 million.',
      },
      {
        q: 'Why build an eval set BEFORE tuning chunk size, retrievers, or rerankers?',
        options: [
          'Because tuning changes are irreversible',
          'Without measured hit rates on real queries, you cannot tell whether any change helped — you are tuning by vibes',
          'Eval sets are required by RAGAS licensing',
          'Because eval sets get slower to build as the index grows',
        ],
        answer: 1,
        explain: 'Retrieval tweaks routinely help some queries and hurt others. A 50-200 real-query eval set turns tuning from anecdotes into measurement.',
      },
      {
        q: 'A user searches for error code "E-4402-B". Dense retrieval whiffs. Why does BM25 catch it?',
        options: [
          'BM25 embeds the code into a better vector space',
          'Exact rare tokens like IDs, part numbers, and jargon are matched literally by keyword search, while embeddings blur them into nearby noise',
          'BM25 has a larger context window',
          'Dense retrieval ignores numbers entirely',
        ],
        answer: 1,
        explain: 'Embeddings compress meaning; a rare identifier has almost no distributional meaning to compress. Lexical match is exactly what BM25 is for.',
      },
      {
        q: 'The right chunk IS retrieved — at position 18 of 20 — and the model answers from the noise above it. Best first fix?',
        options: [
          'Increase k to 50 so more context is available',
          'Fine-tune the generator to read more carefully',
          'Rerank the candidates so the right chunk lands in the top 3, and cut the junk below it',
          'Switch vector stores',
        ],
        answer: 2,
        explain: 'This is the burying failure mode: retrieval succeeded, ranking failed. A reranker plus a tighter final k fixes it; more context makes it worse.',
      },
    ],
    sections: [
      {
        heading: 'The beginner ceiling',
        blocks: [
          {
            type: 'text',
            md: 'The lab you built yesterday — embed everything, cosine-similarity top-k — is *naive dense retrieval*. It demos well and plateaus fast: it misses exact identifiers, drowns in near-duplicates, and has no idea which of 20 similar chunks actually answers the question. Every production RAG system layers at least two upgrades on top: **hybrid search** and **reranking**.',
          },
          {
            type: 'compare',
            left: {
              title: 'Dense vectors catch',
              items: [
                'Paraphrase: "reset my password" matches "credential recovery"',
                'Cross-lingual and fuzzy conceptual matches',
                'Meaning when wording differs completely',
              ],
            },
            right: {
              title: 'BM25 keyword catches',
              items: [
                'Exact IDs, error codes, part numbers',
                'Rare domain jargon and proper nouns',
                'Precise phrases embeddings blur away',
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
            caption: 'Hybrid retrieval: two retrievers with complementary blind spots, fused by rank, then precision-scored by a cross-encoder.',
          },
          {
            type: 'text',
            md: 'RRF is embarrassingly simple: each document scores the sum of 1/(k + rank) across every list it appears in, with k typically 60. No score normalization between BM25 and cosine similarity — only positions matter. Documents that rank decently in *both* lists float to the top.',
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
            caption: 'Reciprocal Rank Fusion in eight lines. This is the whole trick.',
          },
          {
            type: 'text',
            md: 'Reranking is the **standard first optimization** once naive RAG underperforms: retrieve a generous top-50 with hybrid search, then score each query-chunk pair with a cross-encoder — **Cohere Rerank** hosted, or **BGE-reranker** open weights — and keep the top 3-5. It is one API call or one small model, and it routinely delivers the biggest single quality jump in the stack.',
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
            md: 'Before touching chunk sizes or adding a reranker, collect **50-200 real queries** against *your* corpus with known-correct sources. Measure hit-rate at k. Then — and only then — change one variable at a time. [RAGAS](https://docs.ragas.io) automates the grading: faithfulness, answer relevance, context precision and recall.',
          },
          {
            type: 'text',
            md: 'Real queries means queries users actually ask — pulled from support tickets, Slack, search logs — not questions you invent by reading the documents. Invented questions share vocabulary with their source chunk and flatter your retriever. Real ones are misspelled, underspecified, and brutal. That is the point.',
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
              ['Bad chunking', 'Retrieved chunks start or end mid-thought; answers feel truncated', 'Split on structural boundaries, add overlap, re-index'],
              ['Stale index', 'Confidently outdated answers from documents that changed', 'Re-embed on document change; monitor index age'],
              ['Embedding mismatch', 'Retrieval near-random after a model or version change', 'Pin the model; full re-index on any switch'],
              ['Right chunk, buried', 'Correct chunk at rank 15 of 20; model answers from noise', 'Add a reranker, shrink final k'],
            ],
          },
          {
            type: 'text',
            md: 'Note what is missing from this table: the generator. When RAG fails, the model is rarely the culprit — the retrieval layer handed it the wrong material. Debug retrieval first, always.',
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: measure, then upgrade the toy RAG',
      intro: 'Turn the toy from m5-l1 into an honest experiment: build a small eval set, take a baseline, add hybrid search or a reranker, and prove the lift with numbers.',
      steps: [
        'Write 10 real questions against your 10-document corpus and record which document should answer each — this is your mini eval set',
        'Measure the baseline: for each question, does the correct source appear in the top 5? Record hit-rate as n/10',
        'Add BM25: *pip install rank-bm25*, index the same chunks, and fuse BM25 + dense results with the RRF function from this lesson',
        'Alternatively (or additionally) add a reranker: score the fused top-20 with a BGE-reranker or the Cohere Rerank API and keep the top 5',
        'Re-run all 10 questions and record the new hit-rate',
        'Inspect the diffs: for every question that flipped, identify which failure mode from the table it was',
      ],
      checklist: [
        'A 10-question eval set with expected sources exists in a file, not your head',
        'Baseline hit-rate recorded before any change was made',
        'Hybrid search or a reranker is wired in and running',
        'Post-change hit-rate recorded, with at least one flipped query explained by a named failure mode',
      ],
    },
    checkQuiz: [
      {
        q: 'Which quartet does RAGAS measure out of the box?',
        options: [
          'Latency, throughput, cost, uptime',
          'Faithfulness, answer relevance, context precision, context recall',
          'BLEU, ROUGE, perplexity, F1',
          'Chunk size, overlap, k, fusion constant',
        ],
        answer: 1,
        explain: 'RAGAS grades both halves of the system: did retrieval fetch the right context, and did the answer stay grounded in it.',
      },
      {
        q: 'Docs were updated three weeks ago but answers still quote the old policy. Diagnosis?',
        options: [
          'Embedding mismatch between index and query',
          'The reranker is overfitting to old documents',
          'Stale index — changed documents were never re-embedded, so retrieval serves the old chunks',
          'The generator has memorized the old policy',
        ],
        answer: 2,
        explain: 'RAG answers from the index, not the source of truth. Without a re-embed-on-change trigger, the index silently drifts from reality.',
      },
      {
        q: 'In the lab, hit-rate is defined as:',
        options: [
          'The fraction of eval questions whose correct source appears in the retrieved top-k',
          'The percentage of chunks that get retrieved at least once',
          'Tokens retrieved divided by tokens generated',
          'The reranker score of the best chunk',
        ],
        answer: 0,
        explain: 'It is the bluntest useful retrieval metric: for each known-answer question, did the right document make the cut.',
      },
      {
        q: 'Naive RAG underperforms in production. The standard FIRST move is:',
        options: [
          'Swap the generator for a bigger model',
          'Fine-tune the embedding model on your corpus',
          'Bolt a cross-encoder reranker onto the existing retriever',
          'Rewrite the corpus so it embeds better',
        ],
        answer: 2,
        explain: 'A reranker is the cheapest, least invasive change with the largest typical lift — one call between retrieval and generation, no re-indexing.',
      },
    ],
    resources: [
      { label: 'RAGAS — RAG evaluation framework', url: 'https://docs.ragas.io', kind: 'docs' },
      { label: 'Cohere Rerank overview', url: 'https://docs.cohere.com/docs/rerank-overview', kind: 'docs' },
      { label: 'Qdrant: Hybrid search explained', url: 'https://qdrant.tech/articles/hybrid-search/', kind: 'article' },
      { label: 'Original RRF paper (Cormack et al.)', url: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', kind: 'article' },
      { label: 'BGE reranker v2 (open cross-encoder)', url: 'https://huggingface.co/BAAI/bge-reranker-v2-m3', kind: 'docs' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // m5-l3 — Agentic RAG & the Decision Rule
  // ─────────────────────────────────────────────────────────────
  {
    id: 'm5-l3',
    title: 'Agentic RAG & the Decision Rule',
    day: 20,
    minutes: 45,
    xp: 100,
    objectives: [
      'Can explain agentic RAG as retrieval-as-a-tool inside the agent loop and say when it earns its cost',
      'Can apply the 2026 decision rule: cached long context vs RAG vs fine-tuning, with numbers',
      'Can identify where keyword-only retrieval (Claude Code memory) falls short and what semantic search adds',
      'Can write a defensible one-page retrieval architecture decision for a real corpus',
    ],
    skipQuiz: [
      {
        q: 'What turns classic RAG into agentic RAG?',
        options: [
          'A bigger embedding model behind the same pipeline',
          'Retrieval becomes a tool the model calls inside its loop — it plans, issues multiple searches, judges results, and reformulates',
          'Running the pipeline on an agent framework instead of a script',
          'Adding a reranker after the vector store',
        ],
        answer: 1,
        explain: 'The structural change is control: the model decides when and what to retrieve, evaluates what came back, and retries — instead of one fixed retrieve-then-generate pass.',
      },
      {
        q: 'A 60-page employee handbook, updated quarterly, queried thousands of times a day. The 2026 answer is:',
        options: [
          'Full RAG pipeline with hybrid search and reranking',
          'Fine-tune a model on the handbook',
          'Cached long context — the whole document rides in every prompt, with cache reads at roughly a tenth of input price',
          'An agent that greps the PDF on demand',
        ],
        answer: 2,
        explain: 'Small, stable, high-traffic corpora are exactly what caching-backed 1M-token windows killed low-end RAG for: simpler, no index to go stale, near-RAG cost.',
      },
      {
        q: 'Why is fine-tuning the wrong tool for keeping a model current on company knowledge?',
        options: [
          'Fine-tuning is only available on open-weight models',
          'It changes behavior, style, and format — not reliably facts — and every knowledge update means retraining instead of re-indexing',
          'Fine-tuned models cannot use retrieval afterwards',
          'It always costs more than RAG at any scale',
        ],
        answer: 1,
        explain: 'The rule: fine-tune for behavior, never for knowledge freshness. Facts belong in a corpus you can update; weights are a terrible database.',
      },
      {
        q: 'What specifically made caching-backed long context kill low-end RAG?',
        options: [
          'Context windows got faster to process than vector lookups',
          'A 1M-token window fits small corpora whole, and cache reads at ~0.1x input price make re-sending them nearly free after the first request',
          'Vector databases became too expensive to license',
          'Models stopped hallucinating on long documents',
        ],
        answer: 1,
        explain: 'The economics flipped: paying full price to resend a corpus every call justified RAG; at 0.1x cached reads, the pipeline overhead is no longer worth it for small stable corpora.',
      },
      {
        q: 'Claude Code memory retrieval is keyword-only. What does that miss that motivates the RAG stack?',
        options: [
          'It cannot search across multiple memory files',
          'Notes phrased differently from the query — "auth flow rewrite" never matches a memory saying "login pipeline overhaul" — exactly what embeddings catch',
          'It is slower than vector search at any corpus size',
          'It cannot rank results at all',
        ],
        answer: 1,
        explain: 'Keyword match requires shared vocabulary. Semantic search retrieves by meaning — that gap is the whole reason embedding-based add-ons exist.',
      },
    ],
    sections: [
      {
        heading: 'Retrieval as a tool in the loop',
        blocks: [
          {
            type: 'text',
            md: 'Classic RAG is a fixed pipe: one retrieval, one generation, done. Agentic RAG — the 2026 default for hard cases — hands retrieval to the model as a **tool**. The agent plans, fires multiple retrieval calls, inspects what came back, rewrites weak queries, decomposes big questions into sub-queries, and mixes retrievers: vector search, SQL, web, grep. Retrieval quality stops being a single shot and becomes a loop with feedback.',
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
            caption: 'Agentic RAG: retrieval-as-a-tool with a feedback loop, mixing whatever retrievers the question demands.',
          },
          {
            type: 'compare',
            left: {
              title: 'Classic one-shot RAG',
              items: [
                'Fixed pipeline: retrieve once, generate once',
                'Cheap and fast — one retrieval, one LLM call',
                'Fails silently when the first retrieval misses',
                'Right for simple, single-hop questions at volume',
              ],
            },
            right: {
              title: 'Agentic RAG (2026 default for hard cases)',
              items: [
                'Model plans and issues many retrieval calls',
                'Evaluates results, reformulates, decomposes',
                'Mixes tools: vector, SQL, web, filesystem',
                'Slower and pricier — reserve for multi-hop, high-value queries',
              ],
            },
          },
        ],
      },
      {
        heading: 'The decision rule',
        blocks: [
          {
            type: 'table',
            headers: ['Approach', 'Use when', 'Why'],
            rows: [
              ['Cached long context', 'Corpus is small (fits a 1M window) and stable, traffic is repeated', 'Cache reads at ~0.1x input price; zero pipeline; nothing to go stale — this killed low-end RAG'],
              ['RAG', 'Corpus is large, fresh, or permissioned; answers need citations', 'Retrieval scales past any window, enforces per-user access, and carries provenance'],
              ['Fine-tuning', 'You need behavior: style, format, tool-call shape, classification', 'Weights encode habits well and facts poorly — never fine-tune for knowledge freshness'],
              ['Hybrid', 'Stable core corpus plus a fresh or per-user slice', 'Cache the stable core in context; retrieve the volatile remainder'],
            ],
          },
          {
            type: 'callout',
            variant: 'insight',
            title: 'Run the numbers, not the hype',
            md: 'The decision is arithmetic. Corpus tokens × input price × traffic, with cache reads at ~0.1x, versus embedding + storage + retrieval overhead + an index that can go stale. Below roughly a few hundred thousand tokens of stable corpus, cached context usually wins. Large, fresh, or permissioned — RAG wins. Behavior problems — fine-tune.',
          },
        ],
      },
      {
        heading: 'The gap, in the tool you use daily',
        blocks: [
          {
            type: 'text',
            md: 'Motivating example: **Claude Code memory retrieval is keyword-only** — no embeddings anywhere. Search your auto memory for "login pipeline overhaul" and a note titled "auth flow rewrite" will not surface, because no keywords overlap. That miss is precisely the gap semantic search fills, and why memsearch-style embedding add-ons exist. Keyword search is cheap, transparent, and good enough surprisingly often — until vocabulary drifts.',
          },
          {
            type: 'text',
            md: 'Zoom to org level and the same layering appears in the **Company Brain** pattern: a *capture* layer (meetings, docs, Slack land as files), a *retrieval* layer (hybrid search over all of it), and a *source-of-truth* layer (curated canonical answers that outrank raw captures). RAG is the middle layer — worthless without capture below it and governance above it.',
          },
          {
            type: 'callout',
            variant: 'quote',
            md: 'Fine-tuning teaches a model how to behave. Retrieval tells it what is true today. Long context lets it hold the whole problem at once. The senior move is knowing which one your problem actually is.',
          },
        ],
      },
    ],
    lab: {
      title: 'Lab: a one-page architecture decision',
      intro: 'Take a corpus you actually care about — notes, docs, meeting transcripts — and decide: long context, RAG, or hybrid. With numbers, like you would for any architecture review.',
      steps: [
        'Pick the corpus and size it: count documents and estimate total tokens (a word count times 1.3 is close enough)',
        'Characterize it on three axes: growth rate (static, monthly, daily), access (one user or permissioned), and query volume you realistically expect',
        'Cost the long-context option: corpus tokens × input price × expected calls per month, then again with cache reads at 0.1x for the stable prefix',
        'Cost the RAG option: one-time embedding of the corpus, vector store hosting, plus per-query retrieval and the much smaller prompt',
        'Decide — long context, RAG, or hybrid — and write the one-pager: context, the numbers, the decision, and what change would flip it',
        'Stress-test the decision: 10x the corpus, then 10x the traffic — note in the doc where each break-point flips your answer',
      ],
      checklist: [
        'Corpus token count estimated and written down',
        'Both options costed with real prices, including the 0.1x cached-read case',
        'A clear decision with the flip condition stated (what growth or traffic level changes the answer)',
        'The one-pager fits on one page and a colleague could follow the reasoning cold',
      ],
    },
    checkQuiz: [
      {
        q: 'The honest cost profile of agentic RAG versus classic one-shot RAG:',
        options: [
          'Agentic is cheaper because it retrieves fewer chunks overall',
          'Identical cost — the same retrievals happen either way',
          'Agentic spends more latency and tokens on multiple retrieval-and-reasoning rounds, buying accuracy on multi-hop questions',
          'Classic RAG is slower because its pipeline is fixed',
        ],
        answer: 2,
        explain: 'Every loop iteration is another LLM turn plus retrieval. You pay for the retries and planning — worth it exactly when one-shot retrieval keeps missing.',
      },
      {
        q: 'Why does per-user permissioned data push you to RAG rather than long context or fine-tuning?',
        options: [
          'Permissions make documents too large for context windows',
          'The retrieval layer can filter by ACL at query time, so each user only ever sees allowed chunks — weights and shared prompts cannot enforce that',
          'Fine-tuned models refuse to answer permissioned questions',
          'Vector stores encrypt documents automatically',
        ],
        answer: 1,
        explain: 'Access control needs a query-time gate. A model with the data in weights or a shared cached prompt leaks it to everyone.',
      },
      {
        q: 'In the Company Brain layering, what sits ABOVE retrieval and why?',
        options: [
          'The capture layer, to filter what gets stored',
          'A source-of-truth layer of curated canonical answers that outrank raw captured documents when they conflict',
          'A fine-tuned model that memorizes the corpus',
          'A second vector store for redundancy',
        ],
        answer: 1,
        explain: 'Raw captures contradict each other and go stale. A governed truth layer wins conflicts, so retrieval serves the blessed answer, not the loudest document.',
      },
      {
        q: 'Inside the agent loop, what typically triggers query reformulation?',
        options: [
          'A fixed timer on every retrieval call',
          'The model assesses retrieved chunks as weak or off-target and rewrites the query or splits it into sub-queries before retrying',
          'The vector store returning an error code',
          'The reranker demoting all candidates below a threshold set in config',
        ],
        answer: 1,
        explain: 'The assess step is the point of the loop: the model judges its own retrieval and uses that judgment to search again, differently.',
      },
    ],
    resources: [
      { label: 'Anthropic: Building Effective Agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', kind: 'article' },
      { label: 'Anthropic prompt caching (the 0.1x economics)', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching', kind: 'docs' },
      { label: 'Claude Code memory docs (keyword-only retrieval)', url: 'https://code.claude.com/docs/en/memory', kind: 'docs' },
      { label: 'RAG_Techniques — advanced patterns catalog', url: 'https://github.com/NirDiamant/RAG_Techniques', kind: 'repo' },
      { label: 'LlamaIndex: agentic retrieval concepts', url: 'https://docs.llamaindex.ai/en/stable/understanding/agent/', kind: 'docs' },
    ],
  },
]
