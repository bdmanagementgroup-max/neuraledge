import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "60px 60px 40px",
        background: "var(--black)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative", zIndex: 2,
      }}
    >
      <div
        style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 60, marginBottom: 60,
        }}
        className="footer-grid"
      >
        <div>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 24, height: 24,
                background: "var(--accent)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "var(--white)" }}>
              Neural<span style={{ color: "var(--accent)" }}>Edge</span>
            </span>
          </Link>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9, maxWidth: 280 }}>
            We bring AI to businesses — not as a novelty, but as a genuine competitive advantage. Strategy, education, and implementation under one roof.
          </p>
        </div>

        {[
          {
            heading: "Services",
            links: [
              { label: "AI Strategy", href: "#services" },
              { label: "Education", href: "#services" },
              { label: "Implementation", href: "#services" },
              { label: "Retainers", href: "#services" },
            ],
          },
          {
            heading: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Case Studies", href: "#" },
              { label: "Blog", href: "/articles" },
              { label: "Careers", href: "#" },
            ],
          },
          {
            heading: "Contact",
            links: [
              { label: "hello@neuraledge.ai", href: "mailto:hello@neuraledge.ai" },
              { label: "LinkedIn", href: "#" },
              { label: "Twitter / X", href: "#" },
              { label: "Book a Call", href: "#contact" },
            ],
          },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <h4
              style={{
                fontFamily: "var(--font-display)", fontSize: 12,
                fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--white)", marginBottom: 20,
              }}
            >
              {heading}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
                    className="footer-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 30, borderTop: "1px solid rgba(255,255,255,0.05)",
          fontSize: 12, color: "var(--muted)",
        }}
        className="footer-bottom"
      >
        <span>© 2026 NeuralEdge. All rights reserved.</span>
        <span style={{ color: "rgba(107,106,128,0.5)" }}>Built with intention. Powered by intelligence.</span>
      </div>

      <style>{`
        .footer-link:hover { color: var(--accent) !important; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          footer { padding: 40px 24px 30px !important; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
