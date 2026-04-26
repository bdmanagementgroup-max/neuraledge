"use client";

import Link from "next/link";

export default function Nav() {

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 60px",
        zIndex: 500,
        background: "linear-gradient(to bottom, rgba(5,5,8,0.95), transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28, height: 28,
            background: "var(--accent)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            animation: "pulse-mark 3s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: 22, letterSpacing: -0.5,
            color: "var(--white)",
          }}
        >
          Neural<span style={{ color: "var(--accent)" }}>Edge</span>
        </span>
      </Link>

      <ul
        style={{
          display: "flex", alignItems: "center", gap: 40, listStyle: "none",
        }}
        className="nav-links"
      >
        {[
          { href: "#services", label: "Services" },
          { href: "#process", label: "Process" },
          { href: "#pricing", label: "Pricing" },
          { href: "/automations", label: "Automations" },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              style={{
                color: "var(--muted)", textDecoration: "none",
                fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              className="nav-link"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="#contact"
        style={{
          background: "transparent",
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          padding: "10px 24px",
          fontFamily: "var(--font-body)",
          fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
          textDecoration: "none", transition: "background 0.2s, color 0.2s",
        }}
        className="nav-cta"
      >
        Book a Call
      </Link>

      <style>{`
        .nav-link:hover { color: var(--white) !important; }
        .nav-cta:hover { background: var(--accent) !important; color: var(--black) !important; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          nav { padding: 20px 24px !important; }
        }
      `}</style>
    </nav>
  );
}
