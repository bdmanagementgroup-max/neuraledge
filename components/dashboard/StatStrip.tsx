type Stat = { label: string; value: string | number; suffix?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div
      style={{
        display: "flex", gap: 2, marginBottom: 48,
        background: "var(--deep)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{ flex: 1, padding: "28px 32px", borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800,
              letterSpacing: -1, lineHeight: 1, color: "var(--white)", marginBottom: 6,
            }}
          >
            {stat.value}<span style={{ color: "var(--accent)", fontSize: 20 }}>{stat.suffix}</span>
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
