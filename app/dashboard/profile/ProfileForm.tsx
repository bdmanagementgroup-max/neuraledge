"use client";
import { useState } from "react";

type ProfileData = {
  display_name: string;
  company_name: string;
  phone: string;
  website: string;
  industry: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--deep)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "10px 14px",
  color: "var(--white)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 7,
};

export default function ProfileForm({
  email,
  initialData,
}: {
  email: string;
  initialData: ProfileData;
}) {
  const [form, setForm] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof ProfileData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Display Name</label>
          <input
            style={inputStyle}
            value={form.display_name}
            onChange={(e) => set("display_name", e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Email{" "}
            <span style={{ color: "var(--muted)", fontSize: 9, letterSpacing: 1, opacity: 0.6 }}>— cannot be changed</span>
          </label>
          <input
            style={{ ...inputStyle, opacity: 0.45, cursor: "default" }}
            value={email}
            readOnly
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Company Name</label>
          <input
            style={inputStyle}
            value={form.company_name}
            onChange={(e) => set("company_name", e.target.value)}
            placeholder="Acme Corp"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Industry</label>
          <input
            style={inputStyle}
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
            placeholder="e.g. SaaS, Property, Finance"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+44 7700 000000"
            type="tel"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Website</label>
          <input
            style={inputStyle}
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yourcompany.com"
            type="url"
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "11px 28px",
            background: "var(--accent)",
            border: "none",
            color: "var(--black)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "inherit",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>

        {saved && (
          <span style={{ fontSize: 12, color: "var(--accent)", letterSpacing: 1 }}>
            ✓ Saved
          </span>
        )}
        {error && (
          <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
        )}
      </div>

      <style>{`
        form input:focus { border-color: rgba(0,245,212,0.35) !important; }
      `}</style>
    </form>
  );
}
