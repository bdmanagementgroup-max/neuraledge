"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: prev.slug || slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/articles");
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Failed to create article");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--deep)",
    border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)",
    fontFamily: "var(--font-body)", fontSize: 14, padding: "12px 16px",
    outline: "none", borderRadius: 0,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--muted)", marginBottom: 8,
  };

  return (
    <div style={{ padding: "48px", maxWidth: 720 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>
        New Article
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div>
          <label style={labelStyle}>Content</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            style={{ width: 16, height: 16, cursor: "none", accentColor: "var(--accent)" }}
          />
          <label htmlFor="published" style={{ fontSize: 13, color: "var(--muted)", cursor: "none" }}>
            Publish immediately
          </label>
        </div>

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#f87171" }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              background: "var(--accent)", color: "var(--black)",
              padding: "14px 32px", fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", border: "none", cursor: "none",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Saving…" : "Save Article"}
          </button>
          <a href="/admin/articles" style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)" }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
