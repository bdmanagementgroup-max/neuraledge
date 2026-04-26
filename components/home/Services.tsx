const SERVICES = [
  {
    num: "01",
    title: "AI Strategy & Roadmapping",
    text: "We audit your operations and identify the highest-ROI AI opportunities — then build a phased roadmap you can actually execute.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <circle cx="24" cy="24" r="10"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10.1 10.1l4.2 4.2M33.7 33.7l4.2 4.2M10.1 37.9l4.2-4.2M33.7 14.3l4.2-4.2"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Executive AI Education",
    text: "Intensive workshops and ongoing training that give your leadership team the vocabulary and judgment to lead an AI-powered organisation.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <rect x="6" y="8" width="36" height="28" rx="2"/><path d="M16 36v4M32 36v4M10 40h28M24 16v8M20 20l4-4 4 4"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Implementation & Deployment",
    text: "From custom GPT workflows to full LLM integrations, we build and deploy AI systems that work inside your existing stack.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <path d="M8 40V20l16-14 16 14v20"/><path d="M18 40V28h12v12"/><rect x="20" y="18" width="8" height="8" rx="1"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Performance & Analytics",
    text: "We instrument your AI deployments so you can measure what's working, iterate fast, and continuously compound gains.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <path d="M6 34l10-12 8 8 8-14 10 8"/><circle cx="38" cy="14" r="4"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Team Upskilling Programs",
    text: "Structured learning paths for every department — ops, marketing, finance, sales — so your whole team moves with AI, not against it.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <circle cx="24" cy="12" r="6"/><circle cx="10" cy="36" r="6"/><circle cx="38" cy="36" r="6"/>
        <path d="M24 18v8M18 33l-4-5M30 33l4-5"/>
      </svg>
    ),
  },
  {
    num: "06",
    title: "Ongoing AI Retainers",
    text: "Monthly advisory and implementation support as your AI partner — keeping you ahead of the curve as the landscape evolves.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: "var(--accent)", marginBottom: 28 }}>
        <path d="M14 24h6l4-12 4 24 4-12h6"/>
        <rect x="4" y="8" width="40" height="32" rx="3"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: "120px 60px", background: "var(--deep)" }} className="services-section">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 80, alignItems: "end" }}
        className="services-header"
      >
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>{"//"}</span> What We Do
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800, letterSpacing: -2, lineHeight: 1,
            }}
          >
            Precision AI,<br />
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>
              delivered
            </em>.
          </h2>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.9 }}>
          Every engagement is custom-built around your business reality — not recycled templates. We identify where AI creates leverage and execute fast.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }} className="services-grid">
        {SERVICES.map((s) => (
          <div key={s.num} style={{ background: "var(--surface)", padding: "48px 40px", position: "relative", overflow: "hidden", transition: "background 0.3s" }} className="service-card">
            <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, color: "rgba(255,255,255,0.04)", position: "absolute", top: 20, right: 30, lineHeight: 1 }}>
              {s.num}
            </div>
            {s.icon}
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 16, letterSpacing: -0.5 }}>{s.title}</div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9 }}>{s.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        .service-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 100%; height: 2px; background: var(--accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .service-card:hover { background: var(--edge) !important; }
        .service-card:hover::before { transform: scaleX(1); }
        @media (max-width: 900px) {
          .services-section { padding: 80px 24px !important; }
          .services-header { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
