"use client";
import { useState } from "react";

type Tool = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  category: string | null;
  active: boolean;
  sort_order: number;
};

const BLANK: Omit<Tool, "id"> = {
  name: "", description: "", url: "", category: "", active: true, sort_order: 0,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--black)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "10px 14px",
  color: "var(--white)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 7,
};

export default function ToolsAdminClient({ initial }: { initial: Tool[] }) {
  const [tools, setTools] = useState<Tool[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<Omit<Tool, "id">>(BLANK);
  const [editForm, setEditForm] = useState<Tool | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (json.error) { setError(json.error); return; }
    setTools([...tools, json]);
    setForm(BLANK);
    setShowNew(false);
  }

  async function handleUpdate() {
    if (!editForm) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/tools/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    setSaving(false);
    if (json.error) { setError(json.error); return; }
    setTools(tools.map((t) => t.id === json.id ? json : t));
    setEditing(null);
    setEditForm(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tool?")) return;
    setTools(tools.filter((t) => t.id !== id));
    await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
            Client Portal
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: 0 }}>
            AI Tools
          </h1>
        </div>
        <button
          onClick={() => { setShowNew(!showNew); setError(""); }}
          style={{
            padding: "11px 22px", background: showNew ? "transparent" : "var(--accent)",
            border: showNew ? "1px solid rgba(255,255,255,0.1)" : "none",
            color: showNew ? "var(--muted)" : "var(--black)",
            fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
          }}
        >
          {showNew ? "Cancel" : "+ Add Tool"}
        </button>
      </div>

      {showNew && (
        <div style={{ background: "var(--deep)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid var(--accent)", padding: "28px", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>New Tool</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input style={fieldStyle} placeholder="e.g. ChatGPT" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={fieldStyle} placeholder="e.g. Writing, Research" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>URL</label>
              <input style={fieldStyle} placeholder="https://" value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} type="url" />
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input style={fieldStyle} type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea rows={2} style={{ ...fieldStyle, resize: "none" }} placeholder="What this tool does…" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name.trim()}
            style={{
              padding: "11px 24px", background: "var(--accent)", border: "none",
              color: "var(--black)", fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", fontFamily: "inherit", fontWeight: 700,
              cursor: (saving || !form.name.trim()) ? "not-allowed" : "pointer",
              opacity: (saving || !form.name.trim()) ? 0.5 : 1,
            }}
          >
            {saving ? "Saving…" : "Add Tool"}
          </button>
        </div>
      )}

      <div style={{ background: "var(--deep)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        {tools.length === 0 ? (
          <div style={{ padding: "40px 28px", color: "var(--muted)", fontSize: 13 }}>No tools yet. Add the first one above.</div>
        ) : tools.map((tool) => (
          <div key={tool.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {editing === tool.id && editForm ? (
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input style={fieldStyle} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input style={fieldStyle} value={editForm.category ?? ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>URL</label>
                    <input style={fieldStyle} value={editForm.url ?? ""} onChange={(e) => setEditForm({ ...editForm, url: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Sort Order</label>
                    <input style={fieldStyle} type="number" value={editForm.sort_order} onChange={(e) => setEditForm({ ...editForm, sort_order: Number(e.target.value) })} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={2} style={{ ...fieldStyle, resize: "none" }} value={editForm.description ?? ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                </div>
                <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })} />
                  Active (visible to clients)
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleUpdate} disabled={saving} style={{ padding: "9px 20px", background: "var(--accent)", border: "none", color: "var(--black)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit", fontWeight: 700, cursor: "pointer" }}>
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button onClick={() => { setEditing(null); setEditForm(null); }} style={{ padding: "9px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "16px 24px", alignItems: "center", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--white)" }}>{tool.name}</span>
                    {tool.category && <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", opacity: 0.7 }}>{tool.category}</span>}
                    {!tool.active && <span style={{ fontSize: 9, color: "var(--muted)", border: "1px solid rgba(255,255,255,0.1)", padding: "1px 6px" }}>Hidden</span>}
                  </div>
                  {tool.description && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{tool.description}</div>}
                  {tool.url && <div style={{ fontSize: 11, color: "var(--muted)", opacity: 0.5, marginTop: 2 }}>{tool.url}</div>}
                </div>
                <button onClick={() => { setEditing(tool.id); setEditForm(tool); }} style={{ fontSize: 11, color: "var(--muted)", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(tool.id)} style={{ fontSize: 11, color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,0.25)", padding: "5px 12px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        input:focus, textarea:focus, select:focus { border-color: rgba(0,245,212,0.3) !important; }
      `}</style>
    </div>
  );
}
