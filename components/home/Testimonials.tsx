const TESTIMONIALS = [
  {
    text: "NeuralEdge didn't just consult — they completely changed how we think about our operations. Within 90 days, we had automated 60% of our reporting and our team actually understood why.",
    name: "Sarah Chen", role: "COO, Meridian Logistics", initials: "SC",
  },
  {
    text: "The executive workshop alone was worth it. We walked in sceptical and walked out with a 12-month AI roadmap and the board fully bought in. These people know their stuff.",
    name: "James Rowe", role: "CEO, Altitude Capital", initials: "JR",
  },
  {
    text: "We tried three other AI consultancies before NeuralEdge. The difference is they actually build things, not just decks. We have live systems running in production.",
    name: "Maya Löfgren", role: "VP Product, StackBridge", initials: "ML",
  },
  {
    text: "Our customer support resolution time dropped by 40% in 6 weeks. The NeuralEdge team understood our domain, not just the tech. That's rare.",
    name: "Darren Kwok", role: "Director of CX, Lumio Health", initials: "DK",
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "120px 60px", background: "var(--deep)" }} className="testimonials-section">
      <div className="reveal">
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "var(--muted)" }}>{"//"}</span> Client Results
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
          Real businesses,<br />
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>real outcomes.</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginTop: 70 }} className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} style={{ background: "var(--surface)", padding: 48, position: "relative" }} className="reveal">
            <div
              style={{
                fontFamily: "var(--font-serif)", fontSize: 120, lineHeight: 1,
                color: "rgba(0,245,212,0.08)", position: "absolute", top: 10, right: 30,
              }}
            >
              &quot;
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.7, marginBottom: 32, color: "var(--white)" }}>
              {t.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "var(--edge)", border: "1px solid rgba(0,245,212,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  color: "var(--accent)", fontSize: 14,
                }}
              >
                {t.initials}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-section { padding: 80px 24px !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
