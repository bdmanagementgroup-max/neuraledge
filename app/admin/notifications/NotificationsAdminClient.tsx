"use client";
import { useState } from "react";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
  user_id: string;
};

type Client = { id: string; label: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

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

export default function NotificationsAdminClient({
  initial,
  clients,
}: {
  initial: Notif[];
  clients: Client[];
}) {
  const [notifs, setNotifs] = useState<Notif[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: "", title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!form.user_id || !form.title.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (json.error) { setError(json.error); return; }
    setNotifs([json, ...notifs]);
    setForm({ user_id: "", title: "", body: "" });
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notification?")) return;
    setNotifs(notifs.filter((n) => n.id !== id));
    await fetch("/api/admin/notifications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  function clientLabel(user_id: string) {
    return clients.find((c) => c.id === user_id)?.label ?? user_id.slice(0, 8) + "…";
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
            Client Portal
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: 0 }}>
            Notifications
          </h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          style={{
            padding: "11px 22px", background: showForm ? "transparent" : "var(--accent)",
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
            color: showForm ? "var(--muted)" : "var(--black)",
            fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Send Notification"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "var(--deep)", border: "1px solid rgba(255,255,255,0.06)",
            borderTop: "2px solid var(--accent)", padding: "28px", marginBottom: 28,
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>
            New Notification
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Send to</label>
              <select
                style={{ ...fieldStyle, cursor: "pointer" }}
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              >
                <option value="">— Select client —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input
                style={fieldStyle}
                placeholder="Notification title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Message (optional)</label>
            <textarea
              rows={3}
              style={{ ...fieldStyle, resize: "none" }}
              placeholder="Additional detail…"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{error}</p>}
          <button
            onClick={handleSend}
            disabled={saving || !form.user_id || !form.title.trim()}
            style={{
              padding: "11px 24px", background: "var(--accent)", border: "none",
              color: "var(--black)", fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", fontFamily: "inherit", fontWeight: 700,
              cursor: (saving || !form.user_id || !form.title.trim()) ? "not-allowed" : "pointer",
              opacity: (saving || !form.user_id || !form.title.trim()) ? 0.5 : 1,
            }}
          >
            {saving ? "Sending…" : "Send"}
          </button>
        </div>
      )}

      <div style={{ background: "var(--deep)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        {notifs.length === 0 ? (
          <div style={{ padding: "40px 28px", color: "var(--muted)", fontSize: 13 }}>
            No notifications sent yet.
          </div>
        ) : notifs.map((n) => (
          <div
            key={n.id}
            style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto",
              padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)",
              alignItems: "center", gap: 16,
            }}
          >
            <div
              style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                background: n.read_at ? "rgba(255,255,255,0.12)" : "var(--accent)",
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--white)" }}>
                  {n.title}
                </span>
                <span
                  style={{
                    fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
                    color: n.read_at ? "#22c55e" : "var(--muted)",
                  }}
                >
                  {n.read_at ? "Read" : "Unread"}
                </span>
              </div>
              {n.body && (
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{n.body}</div>
              )}
              <div style={{ fontSize: 11, color: "var(--muted)", opacity: 0.6 }}>
                {clientLabel(n.user_id)} · {formatDate(n.created_at)}
              </div>
            </div>
            <button
              onClick={() => handleDelete(n.id)}
              style={{
                fontSize: 11, color: "#ef4444", background: "transparent",
                border: "1px solid rgba(239,68,68,0.25)", padding: "5px 12px", cursor: "pointer",
                letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style>{`
        select:focus, input:focus, textarea:focus { border-color: rgba(0,245,212,0.3) !important; }
      `}</style>
    </div>
  );
}
