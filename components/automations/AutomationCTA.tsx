"use client";

import { useState } from "react";
import EnquiryModal from "@/components/home/EnquiryModal";

interface Props {
  automationName: string;
  variant?: "hero" | "section";
}

export default function AutomationCTA({ automationName, variant = "hero" }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const button = (
    <button
      onClick={() => setModalOpen(true)}
      style={{
        background: "var(--accent)", color: "var(--black)",
        padding: variant === "section" ? "18px 40px" : "14px 32px",
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase",
        border: "none", cursor: "none", transition: "opacity 0.2s",
      }}
      className="auto-cta-btn"
    >
      Get Started →
    </button>
  );

  if (variant === "hero") {
    return (
      <>
        {button}
        <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} prefillAutomation={automationName} />
        <style>{`.auto-cta-btn:hover { opacity: 0.85; }`}</style>
      </>
    );
  }

  return (
    <>
      <section
        style={{
          background: "var(--surface)", borderTop: "1px solid rgba(0,245,212,0.15)",
          padding: "80px 60px", textAlign: "center",
        }}
        className="auto-cta-section"
      >
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>
          <span style={{ color: "var(--muted)" }}>{"//"}</span> Ready to automate?
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
          Start qualifying leads<br />
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>while you sleep.</em>
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 36px" }}>
          Book a scoping call and we&apos;ll map out exactly how the Lead Generation Bot fits into your stack.
        </p>
        {button}
      </section>
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} prefillAutomation={automationName} />
      <style>{`
        .auto-cta-btn:hover { opacity: 0.85; }
        @media (max-width: 768px) { .auto-cta-section { padding: 60px 24px !important; } }
      `}</style>
    </>
  );
}
