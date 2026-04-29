import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Resources — NeuralEdge" };

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  template: "Template",
  tool: "Tool",
  video: "Video",
};

const TYPE_ACCENT: Record<string, string> = {
  guide: "var(--accent)",
  template: "var(--gold)",
  tool: "#a78bfa",
  video: "#fb923c",
  article: "rgba(255,255,255,0.3)",
};

export default async function ResourcesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: resources }, { data: articles }] = await Promise.all([
    supabase
      .from("resources")
      .select("id, title, description, url, resource_type")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  const hasResources = (resources ?? []).length > 0;
  const hasArticles = (articles ?? []).length > 0;

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
        Resources
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px" }}>
        AI Resources
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 56 }}>
        Guides, templates, and articles to help you understand and leverage AI automation.
      </p>

      {/* Guides, templates, free tools */}
      {hasResources && (
        <section style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 16,
              paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            Guides &amp; Templates
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2 }}>
            {(resources ?? []).map((r) => (
              <a
                key={r.id}
                href={r.url ?? "#"}
                target={r.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "24px 28px",
                    background: "var(--deep)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderTop: `2px solid ${TYPE_ACCENT[r.resource_type ?? "article"] ?? "rgba(255,255,255,0.1)"}`,
                    transition: "background 0.2s",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                  className="resource-card"
                >
                  <div style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                        color: TYPE_ACCENT[r.resource_type ?? "article"] ?? "var(--muted)",
                        fontWeight: 700,
                      }}
                    >
                      {TYPE_LABELS[r.resource_type ?? "article"] ?? r.resource_type}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                      color: "var(--white)", marginBottom: 8,
                    }}
                  >
                    {r.title} {r.url && <span style={{ color: "var(--muted)", fontSize: 12 }}>↗</span>}
                  </div>
                  {r.description && (
                    <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                      {r.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Articles */}
      {hasArticles && (
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2
              style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                color: "var(--muted)", margin: 0,
              }}
            >
              Latest Articles
            </h2>
            <Link
              href="/articles"
              style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.1em" }}
            >
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(articles ?? []).map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "20px 24px",
                    background: "var(--deep)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
                    transition: "background 0.2s",
                  }}
                  className="article-row"
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                        color: "var(--white)", marginBottom: a.excerpt ? 6 : 0,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}
                    >
                      {a.title}
                    </div>
                    {a.excerpt && (
                      <p
                        style={{
                          color: "var(--muted)", fontSize: 13, margin: 0, lineHeight: 1.5,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}
                      >
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                  {a.published_at && (
                    <div style={{ flexShrink: 0, fontSize: 11, color: "var(--muted)", opacity: 0.6 }}>
                      {new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hasResources && !hasArticles && (
        <div
          style={{
            padding: "60px 40px", textAlign: "center",
            background: "var(--deep)", border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Resources coming soon
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            We&apos;re preparing guides and templates specifically for your industry. Check back soon.
          </p>
        </div>
      )}

      <style>{`
        .resource-card:hover { background: var(--surface) !important; }
        .article-row:hover { background: var(--surface) !important; }
      `}</style>
    </div>
  );
}
