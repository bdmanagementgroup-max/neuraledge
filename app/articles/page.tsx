import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Articles — NeuralEdge" };

type Article = { id: string; title: string; slug: string; excerpt: string | null; published_at: string | null };

const SEED_ARTICLES: Article[] = [
  { id: "s1", title: "How to Identify Your First AI Automation Win", slug: "first-ai-automation-win", excerpt: "Most businesses have 3-5 processes that are perfect candidates for automation. Here's how to find yours in under a week.", published_at: "2026-03-15" },
  { id: "s2", title: "The Executive's Guide to AI Vocabulary", slug: "executives-guide-ai-vocabulary", excerpt: "LLMs, RAG, agents, fine-tuning — cutting through the jargon so you can lead informed AI conversations with your team and board.", published_at: "2026-02-28" },
  { id: "s3", title: "Why Most AI Projects Fail (And How to Avoid It)", slug: "why-ai-projects-fail", excerpt: "90% of AI initiatives don't make it to production. We've seen the common failure patterns — and the fixes are simpler than you think.", published_at: "2026-02-10" },
];

async function getArticles(): Promise<Article[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data && data.length > 0 ? data : SEED_ARTICLES;
  } catch {
    return SEED_ARTICLES;
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 120 }}>
        <section style={{ padding: "60px 60px 120px" }} className="articles-section">
          <div style={{ marginBottom: 70 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{"//"}</span> Knowledge Base
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
              Articles &amp; Insights
            </h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--surface)", padding: "36px 40px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "background 0.2s",
                    borderLeft: "2px solid transparent",
                  }}
                  className="article-row"
                >
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8 }}>
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, maxWidth: 600 }}>{article.excerpt}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, marginLeft: 40 }}>
                    {article.published_at && (
                      <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
                        {new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    <span style={{ color: "var(--accent)", fontSize: 13 }}>Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .article-row:hover { background: var(--edge) !important; border-left-color: var(--accent) !important; }
        @media (max-width: 900px) {
          .articles-section { padding: 40px 24px 80px !important; }
        }
      `}</style>
    </>
  );
}
