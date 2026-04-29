"use client";
import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function NotificationsList({ notifications: initial }: { notifications: Notification[] }) {
  const [items, setItems] = useState<Notification[]>(initial);

  async function markRead(id: string) {
    const res = await fetch(`/api/dashboard/notifications/${id}`, { method: "PATCH" });
    if (res.ok) {
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    }
  }

  async function markAllRead() {
    const unread = items.filter((n) => !n.read_at);
    await Promise.all(unread.map((n) => fetch(`/api/dashboard/notifications/${n.id}`, { method: "PATCH" })));
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  }

  const unreadCount = items.filter((n) => !n.read_at).length;

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "60px 40px", textAlign: "center",
          background: "var(--deep)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 12 }}>—</div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
          No notifications yet
        </p>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          We&apos;ll notify you here when there&apos;s a project update or message from the team.
        </p>
      </div>
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={markAllRead}
            style={{
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--accent)", background: "transparent",
              border: "1px solid rgba(0,245,212,0.2)", padding: "6px 14px",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Mark all read
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "20px 24px",
              background: n.read_at ? "var(--deep)" : "rgba(0,245,212,0.03)",
              border: `1px solid ${n.read_at ? "rgba(255,255,255,0.05)" : "rgba(0,245,212,0.15)"}`,
              display: "flex", gap: 16, alignItems: "flex-start",
            }}
          >
            <div
              style={{
                flexShrink: 0, width: 7, height: 7, borderRadius: "50%", marginTop: 6,
                background: n.read_at ? "rgba(255,255,255,0.1)" : "var(--accent)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                  color: n.read_at ? "var(--muted)" : "var(--white)",
                  marginBottom: n.body ? 6 : 0,
                }}
              >
                {n.title}
              </div>
              {n.body && (
                <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>
                  {n.body}
                </p>
              )}
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.5, opacity: 0.6 }}>
                {formatDate(n.created_at)}
              </div>
            </div>
            {!n.read_at && (
              <button
                onClick={() => markRead(n.id)}
                style={{
                  flexShrink: 0, padding: "6px 14px",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)", fontSize: 10, letterSpacing: "0.12em",
                  textTransform: "uppercase", fontFamily: "inherit",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
