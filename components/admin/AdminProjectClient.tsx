"use client";

import { useState } from "react";

type Milestone = { id: string; title: string; status: string; completed_at: string | null; sort_order: number };
type Metrics = { runs_total: number; runs_this_month: number; hours_saved_total: number; hours_saved_this_month: number; error_rate: number; last_run_at: string | null } | null;

const PROJECT_STATUSES = ["discovery", "build", "review", "live", "paused"];
const MILESTONE_STATUSES = ["pending", "in_progress", "completed"];

export default function AdminProjectClient({
  projectId, userId, initialStatus, milestones: initialMilestones, metrics: initialMetrics,
}: {
  projectId: string; userId: string; initialStatus: string;
  milestones: Milestone[]; metrics: Metrics;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [milestones, setMilestones] = useState([...initialMilestones].sort((a, b) => a.sort_order - b.sort_order));
  const [metrics, setMetrics] = useState(initialMetrics ?? { runs_total: 0, runs_this_month: 0, hours_saved_total: 0, hours_saved_this_month: 0, error_rate: 0, last_run_at: null });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, milestones }),
    });
    await fetch(`/api/admin/metrics/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...metrics, user_id: userId }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 };
  const inputStyle: React.CSSProperties = { background: "var(--deep)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 14px", outline: "none", borderRadius: 0 };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="admin-project-grid">
      {/* Left: Status + Milestones */}
      <div>
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>Project Status</label>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {PROJECT_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                  background: status === s ? "var(--accent)" : "var(--surface)",
                  color: status === s ? "var(--black)" : "var(--muted)",
                  border: "none", cursor: "none", fontFamily: "var(--font-display)", fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
            Milestones
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {milestones.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "14px 20px" }}>
                <span style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600 }}>{m.title}</span>
                <select
                  value={m.status}
                  onChange={(e) => setMilestones((prev) => prev.map((x) => x.id === m.id ? { ...x, status: e.target.value } : x))}
                  style={{ ...inputStyle, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "none" }}
                >
                  {MILESTONE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Metrics */}
      <div>
        <div style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
          Automation Metrics
        </div>
        <div style={{ background: "var(--surface)", padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Total Runs", key: "runs_total" },
            { label: "Runs This Month", key: "runs_this_month" },
            { label: "Hours Saved (Total)", key: "hours_saved_total" },
            { label: "Hours Saved (Month)", key: "hours_saved_this_month" },
            { label: "Error Rate (%)", key: "error_rate" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={metrics[key as keyof typeof metrics] as number ?? 0}
                onChange={(e) => setMetrics((prev) => ({ ...prev, [key]: e.target.value }))}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button (full width) */}
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: "var(--accent)", color: "var(--black)",
            padding: "14px 40px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
            textTransform: "uppercase", border: "none", cursor: "none",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span style={{ color: "var(--accent)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ Saved</span>}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-project-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
