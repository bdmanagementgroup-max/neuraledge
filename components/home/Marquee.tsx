const ITEMS = [
  "AI Strategy", "Machine Learning", "LLM Integration", "Workflow Automation",
  "Executive Training", "Data Intelligence", "NLP Solutions", "AI Governance",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div style={{ padding: "30px 0", background: "var(--accent)", overflow: "hidden", position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", gap: 60, animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800,
              color: "var(--black)", letterSpacing: "0.15em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 24, flexShrink: 0,
            }}
          >
            {item}
            <span style={{ fontSize: 8 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
