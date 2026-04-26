"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prefillAutomation?: string;
}

export default function EnquiryModal({ isOpen, onClose, prefillAutomation }: Props) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", automation_type: prefillAutomation || "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--deep)",
    border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)",
    fontFamily: "var(--font-body)", fontSize: 14, padding: "12px 16px",
    outline: "none", borderRadius: 0, transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--muted)", marginBottom: 8,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(5,5,8,0.9)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%", maxWidth: 520,
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "48px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent) 40%, transparent)" }} />

        <button
          onClick={onClose}
          style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", color: "var(--muted)", fontSize: 20, cursor: "none", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
          Get a Quote
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, letterSpacing: -1, marginBottom: 32 }}>
          Tell us about your project
        </h2>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 8 }}>Enquiry received</p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>We&apos;ll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Automation Interest</label>
              <input type="text" value={form.automation_type} onChange={(e) => setForm({ ...form, automation_type: e.target.value })} placeholder="e.g. Lead Generation, Invoice Processing…" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {status === "error" && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#f87171" }}>
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "var(--accent)", color: "var(--black)",
                padding: "16px", fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 13, letterSpacing: "0.1em",
                textTransform: "uppercase", border: "none", cursor: "none",
                opacity: status === "loading" ? 0.7 : 1, marginTop: 8,
              }}
            >
              {status === "loading" ? "Sending…" : "Send Enquiry →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
