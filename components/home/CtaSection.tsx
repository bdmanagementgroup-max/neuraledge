"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";

export default function CtaSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="contact"
      style={{
        padding: "120px 60px", background: "var(--deep)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}
      className="cta-section"
    >
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 400,
          background: "radial-gradient(ellipse, rgba(0,245,212,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ color: "var(--muted)" }}>{"//"}</span> Get Started
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 800, letterSpacing: -2, lineHeight: 1,
            margin: "16px 0 24px",
          }}
        >
          Ready to get the<br />
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>NeuralEdge?</em>
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 480, margin: "0 auto 48px" }}>
          Book a free 30-minute discovery call. No pitch decks, no fluff — just an honest conversation about where AI can move the needle for your business.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: "var(--accent)", color: "var(--black)",
            padding: "16px 40px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 14, letterSpacing: "0.05em",
            textTransform: "uppercase", border: "none", cursor: "none",
          }}
        >
          Book Discovery Call
        </button>
      </div>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`
        @media (max-width: 900px) {
          .cta-section { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}
