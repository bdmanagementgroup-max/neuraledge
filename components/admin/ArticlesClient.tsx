"use client";

import { useState } from "react";

type Article = { id: string; title: string; slug: string; published: boolean; published_at: string | null; created_at: string };

export default function ArticlesClient({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState(initial);
  const [toggling, setToggling] = useState<string | null>(null);

  const togglePublish = async (article: Article) => {
    setToggling(article.id);
    const res = await fetch("/api/articles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: article.id, published: !article.published }),
    });
    if (res.ok) {
      setArticles((prev) =>
        prev.map((a) => a.id === article.id ? { ...a, published: !a.published } : a)
      );
    }
    setToggling(null);
  };

  if (articles.length === 0) {
    return <p style={{ color: "var(--muted)" }}>No articles yet. Create your first one.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {articles.map((a) => (
        <div key={a.id} style={{ background: "var(--surface)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>/{a.slug} · {new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => togglePublish(a)}
              disabled={toggling === a.id}
              style={{
                background: a.published ? "rgba(0,245,212,0.1)" : "rgba(107,106,128,0.15)",
                border: `1px solid ${a.published ? "rgba(0,245,212,0.3)" : "rgba(107,106,128,0.3)"}`,
                color: a.published ? "var(--accent)" : "var(--muted)",
                padding: "6px 14px", fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", fontWeight: 700, cursor: "none",
                opacity: toggling === a.id ? 0.6 : 1, transition: "all 0.2s",
              }}
            >
              {a.published ? "Published" : "Draft"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
