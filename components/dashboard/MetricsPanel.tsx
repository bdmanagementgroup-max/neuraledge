type Metrics = {
  runs_total: number;
  runs_this_month: number;
  hours_saved_total: number;
  hours_saved_this_month: number;
  error_rate: number;
  last_run_at: string | null;
};

export default function MetricsPanel({ metrics }: { metrics: Metrics }) {
  const STATS = [
    { label: "Total Runs", value: metrics.runs_total.toLocaleString(), suffix: "" },
    { label: "Runs This Month", value: metrics.runs_this_month.toLocaleString(), suffix: "" },
    { label: "Hours Saved (Total)", value: Number(metrics.hours_saved_total).toFixed(1), suffix: "h" },
    { label: "Hours Saved (Month)", value: Number(metrics.hours_saved_this_month).toFixed(1), suffix: "h" },
  ];

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 24 }}>
        Automation Metrics
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 16 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ background: "var(--deep)", padding: "24px 28px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: -1, lineHeight: 1, marginBottom: 6 }}>
              {s.value}<span style={{ color: "var(--accent)", fontSize: 16 }}>{s.suffix}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Error Rate</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: metrics.error_rate > 5 ? "#f87171" : "var(--accent)" }}>
            {Number(metrics.error_rate).toFixed(1)}%
          </div>
        </div>
        {metrics.last_run_at && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Last Run</div>
            <div style={{ fontSize: 13 }}>
              {new Date(metrics.last_run_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
