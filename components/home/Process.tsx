const STEPS = [
  { num: "01", title: "Discovery & Audit", text: "We map your processes, data assets, and competitive landscape to find where AI creates the biggest leverage for your business." },
  { num: "02", title: "Strategy Design", text: "A custom AI roadmap with clear priorities, timelines, and success metrics — built for your team's capabilities and your budget." },
  { num: "03", title: "Build & Integrate", text: "We implement solutions that slot into your existing systems. No rip-and-replace. No disruption. Just results, fast." },
  { num: "04", title: "Train & Embed", text: "We run hands-on sessions until your team owns the tools. The goal is full internal capability — not dependency on us." },
  { num: "05", title: "Measure & Scale", text: "Track ROI, iterate on what's working, and expand into the next high-value area. AI advantage is compounding — we make sure you compound." },
];

export default function Process() {
  return (
    <section id="process" style={{ padding: "120px 60px", background: "var(--black)" }} className="process-section">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="process-inner">
        <div className="reveal">
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>{"//"}</span> How We Work
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800, letterSpacing: -2, lineHeight: 1,
            }}
          >
            From<br />zero to<br />
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>deployed.</em>
          </h2>
        </div>

        <div>
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                display: "flex", gap: 32, padding: "40px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "padding-left 0.3s",
              }}
              className="process-step reveal"
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: "var(--accent)", minWidth: 32, paddingTop: 4 }}>
                {step.num}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .process-step:hover { padding-left: 12px !important; }
        @media (max-width: 900px) {
          .process-section { padding: 80px 24px !important; }
          .process-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
