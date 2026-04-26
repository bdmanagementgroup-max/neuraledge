type Milestone = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  completed_at: string | null;
  sort_order: number;
};

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "var(--black)", fontSize: 14, fontWeight: 700 }}>✓</span>
      </div>
    );
  }
  if (status === "in_progress") {
    return (
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
      </div>
    );
  }
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
  );
}

export default function MilestoneTracker({ milestones }: { milestones: Milestone[] }) {
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Project Milestones
      </h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sorted.map((m, i) => (
          <div key={m.id} style={{ display: "flex", gap: 20, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <StatusIcon status={m.status} />
              {i < sorted.length - 1 && (
                <div style={{ width: 1, flex: 1, background: m.status === "completed" ? "var(--accent)" : "rgba(255,255,255,0.08)", margin: "6px 0" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < sorted.length - 1 ? 28 : 0, paddingTop: 2 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                  color: m.status === "completed" ? "var(--white)" : m.status === "in_progress" ? "var(--white)" : "var(--muted)",
                  marginBottom: 4,
                }}
              >
                {m.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
                {m.status === "completed" && m.completed_at
                  ? `Completed ${new Date(m.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                  : m.status === "in_progress"
                  ? "In progress"
                  : "Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
