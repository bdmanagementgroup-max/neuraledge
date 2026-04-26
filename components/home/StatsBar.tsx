const STATS = [
  { num: "200", suffix: "+", label: "Businesses Transformed" },
  { num: "94", suffix: "%", label: "Client Retention Rate" },
  { num: "3.2", suffix: "x", label: "Avg. Efficiency Gain" },
  { num: "48", suffix: "hr", label: "Onboarding to First Win" },
];

export default function StatsBar() {
  return (
    <div
      style={{
        display: "flex", gap: 60, padding: "40px 60px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "var(--deep)", position: "relative", zIndex: 2,
        flexWrap: "wrap",
      }}
      className="stats-bar"
    >
      {STATS.map(({ num, suffix, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800,
              letterSpacing: -1, lineHeight: 1, color: "var(--white)",
            }}
          >
            {num}<span style={{ color: "var(--accent)" }}>{suffix}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {label}
          </div>
        </div>
      ))}
      <style>{`
        @media (max-width: 900px) {
          .stats-bar { padding: 30px 24px !important; gap: 30px !important; }
        }
      `}</style>
    </div>
  );
}
