"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PLANS = ["Launchpad", "Transform", "Enterprise"];

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", company: "", plan: "Launchpad", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/clients");
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Failed to create client");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--deep)",
    border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)",
    fontFamily: "var(--font-body)", fontSize: 14, padding: "12px 16px",
    outline: "none", borderRadius: 0,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--muted)", marginBottom: 8,
  };

  return (
    <div style={{ padding: "48px", maxWidth: 560 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>
        New Client
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          { label: "Full Name", key: "name", type: "text", required: true },
          { label: "Email Address", key: "email", type: "email", required: true },
          { label: "Company", key: "company", type: "text", required: false },
          { label: "Password (temporary)", key: "password", type: "password", required: true },
        ].map(({ label, key, type, required }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              required={required}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
            />
          </div>
        ))}

        <div>
          <label style={labelStyle}>Plan</label>
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            style={{ ...inputStyle, cursor: "none" }}
          >
            {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#f87171" }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              background: "var(--accent)", color: "var(--black)",
              padding: "14px 32px", fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", border: "none", cursor: "none",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Creating…" : "Create Client"}
          </button>
          <Link
            href="/admin/clients"
            style={{
              padding: "14px 24px", fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
