import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Article = { id: string; title: string; slug: string; content: string | null; excerpt: string | null; published_at: string | null };

const SEED_ARTICLES: Article[] = [
  {
    id: "s1", slug: "first-ai-automation-win",
    title: "How to Identify Your First AI Automation Win",
    excerpt: "Most businesses have 3-5 processes that are perfect candidates for automation. Here's how to find yours in under a week.",
    published_at: "2026-03-15",
    content: `Finding your first automation win doesn't require a dedicated AI team or a six-figure budget. It requires clarity about where your people are spending time on repetitive, rule-based tasks.

**The three signs a process is ready for automation:**

1. It happens more than 10 times per week
2. It follows a consistent pattern (same inputs, same outputs)
3. Someone could describe it as "boring but important"

Start by asking your team: "What's the most tedious thing you do every week?" The answers will surprise you — and they'll almost always point to a process that's a strong automation candidate.

**Common first wins:**

- Invoice data extraction and filing
- Lead qualification and routing
- Meeting summaries and action item distribution
- Customer query triage and response drafting
- Report generation from spreadsheet data

**The 48-hour test:** Once you've identified a candidate, document the process step-by-step. If you can write it down clearly enough that a new employee could follow it on day one, an AI system can almost certainly handle it.

The goal isn't to automate everything at once. The goal is to prove the concept, measure the time saved, and build confidence internally — then scale from there.`,
  },
  {
    id: "s2", slug: "executives-guide-ai-vocabulary",
    title: "The Executive's Guide to AI Vocabulary",
    excerpt: "LLMs, RAG, agents, fine-tuning — cutting through the jargon so you can lead informed AI conversations with your team and board.",
    published_at: "2026-02-28",
    content: `You don't need to understand how a car engine works to be a good driver. But you do need to know what "fuel" and "oil" mean. AI leadership is the same.

**The terms that actually matter:**

**LLM (Large Language Model):** The engine behind tools like ChatGPT, Claude, and Gemini. A model trained on vast amounts of text that can generate, summarise, and reason about language. When someone says "we're using an LLM," they mean one of these.

**RAG (Retrieval-Augmented Generation):** A technique that gives an LLM access to your specific documents and data. Instead of relying only on what it learned during training, it can look things up in real-time. This is how you build an AI that "knows" your company.

**Agents:** LLMs that can take actions — not just answer questions, but also search the web, run code, send emails, or update databases. An "AI agent" is an LLM with tools and the ability to use them in sequence to complete a task.

**Fine-tuning:** Retraining a model on your specific data to change its behaviour. Useful for highly domain-specific tasks, but often unnecessary — prompt engineering and RAG solve most problems without it.

**Prompt:** The instruction you give to an LLM. "Summarise this document" is a prompt. Good prompts are specific, provide context, and give examples of what good output looks like.

**The question to ask your team:** "Are we using RAG, fine-tuning, or just prompting?" This tells you immediately how sophisticated their approach is.`,
  },
  {
    id: "s3", slug: "why-ai-projects-fail",
    title: "Why Most AI Projects Fail (And How to Avoid It)",
    excerpt: "90% of AI initiatives don't make it to production. We've seen the common failure patterns — and the fixes are simpler than you think.",
    published_at: "2026-02-10",
    content: `After working with dozens of businesses on AI implementation, we've seen the same failure patterns repeat. The good news: most are preventable.

**Failure #1: Starting with the technology, not the problem**

Teams get excited about a new AI tool and go looking for problems to solve with it. This is backwards. Start with the most painful, repetitive problem your business has — then find the right technology to solve it.

**Failure #2: No clear success metric**

"We want to use AI" is not a success metric. "We want to reduce invoice processing time from 4 hours to 30 minutes" is. Without a specific, measurable outcome, you can't tell if the project is working — and you can't justify the investment to leadership.

**Failure #3: Underestimating data quality**

AI systems are only as good as the data they work with. A common mistake is assuming the AI will "figure it out" with messy, inconsistent, or incomplete data. Before building, audit your data. Clean data is the foundation everything else is built on.

**Failure #4: No human in the loop during rollout**

The fastest path to a failed AI project is deploying to production without a feedback mechanism. Start with a human reviewing every AI output. As you gain confidence, reduce the review requirement. Never remove oversight entirely for high-stakes tasks.

**Failure #5: One-time implementation, no iteration**

AI systems don't ship and stay fixed. The best ones improve over time based on feedback, new data, and changing requirements. Budget for iteration, not just implementation.

The pattern that works: small scope, clear metric, clean data, human oversight, iteration cycle. Start there.`,
  },
];

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, content, excerpt, published_at")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (data) return data;
  } catch {}
  return SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 120 }}>
        <article style={{ padding: "60px 60px 120px", maxWidth: 760, margin: "0 auto" }} className="article-page">
          <Link
            href="/articles"
            style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 48 }}
          >
            ← All Articles
          </Link>

          {article.published_at && (
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              {new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}

          <h1
            style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 32,
            }}
          >
            {article.title}
          </h1>

          {article.excerpt && (
            <p
              style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: 20, lineHeight: 1.7, color: "var(--muted)",
                borderLeft: "2px solid var(--accent)", paddingLeft: 24,
                marginBottom: 48,
              }}
            >
              {article.excerpt}
            </p>
          )}

          {article.content && (
            <div
              style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}
              className="article-body"
            >
              {article.content.split("\n\n").map((para, i) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return <h3 key={i} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--white)", margin: "32px 0 12px", letterSpacing: -0.5 }}>{para.replace(/\*\*/g, "")}</h3>;
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter(l => l.startsWith("- "));
                  return <ul key={i} style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>{items.map((item, j) => <li key={j} style={{ display: "flex", gap: 12 }}><span style={{ color: "var(--accent)", flexShrink: 0 }}>—</span>{item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>)}</ul>;
                }
                const rendered = para.replace(/\*\*(.*?)\*\*/g, (_, m) => m);
                return <p key={i} style={{ marginBottom: 20 }}>{rendered}</p>;
              })}
            </div>
          )}
        </article>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 900px) {
          .article-page { padding: 40px 24px 80px !important; }
        }
      `}</style>
    </>
  );
}
