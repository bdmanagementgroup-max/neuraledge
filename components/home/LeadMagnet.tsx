"use client";

import { useState } from "react";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      style={{
        padding: "80px 60px",
        background: "var(--black)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative", zIndex: 2,
      }}
      className="lead-section"
    >
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
          Free Resource
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
            letterSpacing: -1, marginBottom: 16,
          }}
        >
          Get our AI Readiness Guide
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.9, marginBottom: 32 }}>
          A practical framework for assessing your business&apos;s AI readiness and identifying your first high-ROI automation opportunity.
        </p>

        {status === "success" ? (
          <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            ✓ Check your inbox — the guide is on its way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, maxWidth: 440, margin: "0 auto" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1, background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRight: "none", color: "var(--white)",
                fontFamily: "var(--font-body)", fontSize: 14,
                padding: "14px 18px", outline: "none", borderRadius: 0,
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "var(--accent)", color: "var(--black)",
                padding: "14px 24px", fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
                textTransform: "uppercase", border: "none", cursor: "none",
                whiteSpace: "nowrap",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "…" : "Get Guide →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>Something went wrong. Please try again.</p>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lead-section { padding: 60px 24px !important; }
        }
      `}</style>
    </section>
  );
}
