"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";
import type { Automation } from "@/app/automations/page";

const FALLBACK: Automation[] = [
  { id: "1", name: "Lead Generation Bot", slug: "lead-gen", description: "Automatically qualify and nurture inbound leads from your website, LinkedIn, and email. Runs 24/7 so your sales team only talks to warm prospects.", category: "Lead Gen", price_from: 250000 },
  { id: "2", name: "Invoice & Finance Automation", slug: "invoice", description: "Auto-extract data from invoices, reconcile with your accounting system, and flag anomalies. Eliminates manual data entry from your finance workflow.", category: "Finance", price_from: 180000 },
  { id: "3", name: "Customer Support Triage", slug: "support", description: "AI triage that categorises, prioritises, and routes support tickets — and resolves common queries automatically. Reduces support volume by 40–60%.", category: "Ops", price_from: 220000 },
  { id: "4", name: "Content & Social Pipeline", slug: "content", description: "From brief to published post in minutes. AI generates on-brand content drafts, schedules, and repurposes across channels automatically.", category: "Marketing", price_from: null },
  { id: "5", name: "Meeting Intelligence", slug: "meetings", description: "Auto-transcribe, summarise, and action-track every meeting. Key decisions and tasks captured and distributed to the right people automatically.", category: "Ops", price_from: 120000 },
  { id: "6", name: "Custom Automation", slug: "custom", description: "Have a specific process you want to automate? We scope, design, and build bespoke AI workflows tailored entirely to your operations.", category: "Custom", price_from: null },
];

function formatPrice(cents: number | null): string {
  if (!cents) return "Custom Quote";
  return `From $${(cents / 100).toLocaleString()}`;
}

export default function AutomationsCatalogue({ automations }: { automations: Automation[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState("");

  const items = automations.length > 0 ? automations : FALLBACK;

  const openEnquiry = (name: string) => {
    setSelectedAutomation(name);
    setModalOpen(true);
  };

  return (
    <>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
        className="automations-grid"
      >
        {items.map((a) => (
          <div
            key={a.id}
            style={{ background: "var(--surface)", padding: "40px", position: "relative", overflow: "hidden", transition: "background 0.3s" }}
            className="auto-card"
          >
            <div
              style={{
                display: "inline-block", padding: "3px 10px", marginBottom: 20,
                background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.2)",
                fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)",
              }}
            >
              {a.category}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginBottom: 14 }}>
              {a.name}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9, marginBottom: 28 }}>{a.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                {formatPrice(a.price_from)}
              </span>
              <button
                onClick={() => openEnquiry(a.name)}
                style={{
                  background: "transparent", border: "1px solid rgba(0,245,212,0.4)",
                  color: "var(--accent)", padding: "8px 18px",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "none", transition: "all 0.2s",
                }}
                className="auto-btn"
              >
                Get a Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} prefillAutomation={selectedAutomation} />

      <style>{`
        .auto-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 100%; height: 2px; background: var(--accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .auto-card:hover { background: var(--edge) !important; }
        .auto-card:hover::before { transform: scaleX(1); }
        .auto-btn:hover { background: var(--accent) !important; color: var(--black) !important; }
        @media (max-width: 900px) {
          .automations-grid { grid-template-columns: 1fr !important; }
          .automations-section { padding: 40px 24px 80px !important; }
        }
      `}</style>
    </>
  );
}
