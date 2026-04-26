"use client";

import { useState } from "react";
import Link from "next/link";

type Automation = { id: string; name: string; slug: string; category: string; description: string; price_from: number | null; active: boolean; sort_order: number };

const BLANK = { name: "", slug: "", category: "", description: "", price_from: "", active: true, sort_order: 0 };

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AutomationsClient({ automations: initial }: { automations: Automation[] }) {
  const [automations, setAutomations] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name, slug: prev.slug || slugify(name) }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price_from: form.price_from ? Number(form.price_from) * 100 : null }),
    });
    if (res.ok) {
      const data = await res.json();
      setAutomations((prev) => [...prev, data]);
      setForm(BLANK);
      setShowForm(false);
    }
    setSaving(false);
  };

  const toggleActive = async (a: Automation) => {
    await fetch("/api/admin/automations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, active: !a.active }),
    });
    setAutomations((prev) => prev.map((x) => x.id === a.id ? { ...x, active: !a.active } : x));
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--deep)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 14px", outline: "none", borderRadius: 0 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "var(--accent)", color: "var(--black)", padding: "10px 24px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "none" }}
        >
          {showForm ? "Cancel" : "+ Add Automation"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ background: "var(--surface)", padding: 32, marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Lead Gen, Ops, Finance" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price From (USD, leave blank = custom)</label>
            <input type="number" min="0" value={form.price_from} onChange={(e) => setForm({ ...form, price_from: e.target.value })} placeholder="2500" style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--black)", padding: "12px 28px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "none", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Add Automation"}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {automations.map((a) => (
          <div key={a.id} style={{ background: "var(--surface)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: a.active ? 1 : 0.5 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{a.name}</span>
                {a.category && <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid rgba(0,245,212,0.2)", padding: "2px 8px" }}>{a.category}</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                /{a.slug} · {a.price_from ? `From $${(a.price_from / 100).toLocaleString()}` : "Custom Quote"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href={`/admin/automations/${a.id}`}
                style={{
                  fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                  padding: "6px 14px", cursor: "none", border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent", color: "var(--white)", textDecoration: "none",
                }}
              >
                Edit
              </Link>
              <button
                onClick={() => toggleActive(a)}
                style={{
                  fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                  padding: "6px 14px", cursor: "none", border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                  color: a.active ? "var(--accent)" : "var(--muted)",
                }}
              >
                {a.active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
