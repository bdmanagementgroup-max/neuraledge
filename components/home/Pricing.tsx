"use client";

const PLANS = [
  {
    name: "Launchpad",
    price: "2,500",
    period: "one-time engagement",
    features: [
      { label: "AI Opportunity Audit (half-day)", active: true },
      { label: "Executive Briefing Session", active: true },
      { label: "Priority Roadmap (3 initiatives)", active: true },
      { label: "30-day follow-up support", active: true },
      { label: "Implementation support", active: false },
      { label: "Team training sessions", active: false },
    ],
    featured: false,
    btnLabel: "Get Started",
    btnClass: "plan-btn-outline",
  },
  {
    name: "Transform",
    price: "8,500",
    period: "per month · 3 month minimum",
    features: [
      { label: "Full AI Strategy & Roadmap", active: true },
      { label: "Weekly advisory sessions", active: true },
      { label: "Implementation support", active: true },
      { label: "Team training (up to 20 staff)", active: true },
      { label: "Custom AI tool builds", active: true },
      { label: "Monthly performance reviews", active: true },
    ],
    featured: true,
    badge: "Most Popular",
    btnLabel: "Start Transforming",
    btnClass: "plan-btn-solid",
  },
  {
    name: "Enterprise",
    price: null,
    period: "tailored to your organisation",
    features: [
      { label: "Dedicated AI consultant", active: true },
      { label: "Organisation-wide training", active: true },
      { label: "Custom LLM development", active: true },
      { label: "Data & governance frameworks", active: true },
      { label: "SLA-backed delivery", active: true },
      { label: "Board-level reporting", active: true },
    ],
    featured: false,
    btnLabel: "Talk to Us",
    btnClass: "plan-btn-outline",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 60px", background: "var(--black)" }} className="pricing-section">
      <div className="reveal">
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "var(--muted)" }}>{"//"}</span> Pricing
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
          Invest in<br />
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>intelligence.</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 70 }} className="pricing-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.featured ? "var(--edge)" : "var(--surface)",
              padding: "48px 40px",
              position: "relative", overflow: "hidden",
              border: plan.featured ? "1px solid rgba(0,245,212,0.3)" : "none",
            }}
            className="reveal"
          >
            {plan.badge && (
              <div
                style={{
                  position: "absolute", top: 28, right: 28,
                  background: "var(--accent)", color: "var(--black)",
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.15em",
                  textTransform: "uppercase", padding: "4px 10px",
                }}
              >
                {plan.badge}
              </div>
            )}

            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
              {plan.name}
            </div>

            {plan.price ? (
              <div style={{ fontFamily: "var(--font-display)", fontSize: 54, fontWeight: 800, letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}>
                <span style={{ fontSize: 20, color: "var(--muted)", verticalAlign: "top", marginTop: 10, display: "inline-block" }}>$</span>
                {plan.price}
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: -2, lineHeight: 1, marginBottom: 8, paddingTop: 8 }}>
                Custom
              </div>
            )}

            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 36 }}>{plan.period}</div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
              {plan.features.map((f) => (
                <li key={f.label} style={{ fontSize: 13, color: f.active ? "var(--white)" : "var(--muted)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>—</span>
                  {f.label}
                </li>
              ))}
            </ul>

            <a href="#contact" className={`plan-btn ${plan.btnClass}`}>{plan.btnLabel}</a>
          </div>
        ))}
      </div>

      <style>{`
        .plan-btn {
          display: block; width: 100%; padding: 14px;
          text-align: center; font-family: var(--font-display);
          font-weight: 700; font-size: 13px; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none; cursor: none;
          transition: all 0.2s;
        }
        .plan-btn-outline {
          border: 1px solid rgba(255,255,255,0.15); color: var(--muted);
        }
        .plan-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .plan-btn-solid { background: var(--accent); color: var(--black); }
        .plan-btn-solid:hover { filter: brightness(1.1); }
        @media (max-width: 900px) {
          .pricing-section { padding: 80px 24px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
