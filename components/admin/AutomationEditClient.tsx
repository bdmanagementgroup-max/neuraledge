"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AutomationRecord = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  long_description: string | null;
  features: string[] | null;
  price_from: number | null;
  active: boolean;
  sort_order: number;
};

interface Props {
  automation: AutomationRecord;
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AutomationEditClient({ automation }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: automation.name,
    slug: automation.slug,
    category: automation.category ?? "",
    description: automation.description ?? "",
    long_description: automation.long_description ?? "",
    featuresText: (automation.features ?? []).join("\n"),
    price_from: automation.price_from ? String(automation.price_from / 100) : "",
    active: automation.active,
    sort_order: automation.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--deep)", border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--white)", fontFamily: "var(--font-body)", fontSize: 14,
    padding: "10px 14px", outline: "none", borderRadius: 0,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
    color: "var(--muted)", marginBottom: 6,
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      description: form.description,
      long_description: form.long_description || null,
      price_from: form.price_from ? Math.round(Number(form.price_from) * 100) : null,
      active: form.active,
      sort_order: Number(form.sort_order),
      features: form.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch(`/api/admin/automations/${automation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/automations");
    } else {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="edit-form-grid">
        <div>
          <label style={labelStyle}>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Price From (USD — blank = custom quote)</label>
          <input type="number" min="0" value={form.price_from} onChange={(e) => setForm({ ...form, price_from: e.target.value })} placeholder="2500" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 22 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Active</label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            style={{ width: 16, height: 16, accentColor: "var(--accent)", cursor: "none" }}
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Short Description (catalogue card tagline)</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Long Description (product page — separate paragraphs with a blank line)</label>
          <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={8} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Features (one per line — shown in product page features grid)</label>
          <textarea
            value={form.featuresText}
            onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
            rows={10}
            placeholder={"Multi-channel lead intake\nAI-powered scoring\n..."}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#f87171" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "var(--accent)", color: "var(--black)", padding: "12px 28px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.1em", textTransform: "uppercase", border: "none",
            cursor: "none", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          onClick={() => router.push("/admin/automations")}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            color: "var(--muted)", padding: "12px 28px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "none",
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) { .edit-form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
