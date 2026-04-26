import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "140px 60px 80px", overflow: "hidden",
      }}
      className="hero-section"
    >
      <div
        style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(0,245,212,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -55%)",
          pointerEvents: "none",
          animation: "glow-breathe 6s ease-in-out infinite",
        }}
      />

      <div
        style={{
          fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 28,
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <span style={{ display: "block", width: 32, height: 1, background: "var(--accent)" }} />
        AI Education &amp; Consulting
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 8vw, 110px)",
          fontWeight: 800,
          lineHeight: 0.92,
          letterSpacing: -3,
          marginBottom: 36,
          maxWidth: 900,
        }}
      >
        Your business.<br />
        <em
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: "var(--accent)",
            fontWeight: 400,
            letterSpacing: -2,
          }}
        >
          Amplified
        </em>
        <br />
        by AI.
      </h1>

      <p
        style={{
          color: "var(--muted)", maxWidth: 480,
          fontSize: 14, lineHeight: 1.9, marginBottom: 56,
        }}
      >
        We don&apos;t just teach AI — we embed it into the DNA of your business. From strategy to implementation, NeuralEdge transforms how companies think, operate, and compete.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="#services" className="btn-primary">Explore Services</Link>
        <Link href="#process" className="btn-ghost">See how it works</Link>
      </div>

      <style>{`
        .btn-primary {
          background: var(--accent); color: var(--black);
          padding: 16px 40px; font-family: var(--font-display);
          font-weight: 700; font-size: 14px; letter-spacing: 0.05em;
          text-transform: uppercase; text-decoration: none; cursor: none;
          position: relative; overflow: hidden; transition: transform 0.2s;
          display: inline-block;
        }
        .btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: white; transform: translateX(-100%);
          transition: transform 0.3s ease; opacity: 0.2;
        }
        .btn-primary:hover::after { transform: translateX(0); }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-ghost {
          color: var(--muted); font-size: 13px; text-decoration: none;
          cursor: none; display: flex; align-items: center; gap: 8px;
          transition: color 0.2s; letter-spacing: 0.05em;
        }
        .btn-ghost::after { content: '→'; transition: transform 0.2s; }
        .btn-ghost:hover { color: var(--white); }
        .btn-ghost:hover::after { transform: translateX(4px); }
        @media (max-width: 900px) {
          .hero-section { padding: 120px 24px 60px !important; }
        }
      `}</style>
    </section>
  );
}
