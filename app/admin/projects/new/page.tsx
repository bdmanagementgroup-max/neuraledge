"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

type Client = { id: string; name: string; user_id: string };
type Automation = { id: string; name: string };

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillClientId = searchParams.get("clientId") ?? "";

  const [clients, setClients] = useState<Client[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [form, setForm] = useState({ client_id: prefillClientId, title: "", description: "", automation_id: "", start_date: "", target_date: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/clients-list").then((r) => r.json()).then(setClients).catch(() => {});
    fetch("/api/admin/automations").then((r) => r.json()).then(setAutomations).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const client = clients.find((c) => c.id === form.client_id);
    if (!client) { setErrorMsg("Select a client"); setStatus("error"); return; }

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: client.user_id, automation_id: form.automation_id || null }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/projects/${data.id}`);
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Failed to create project");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--deep)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: 14, padding: "12px 16px", outline: "none", borderRadius: 0 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 };

  return (
    <div style={{ padding: "48px", maxWidth: 600 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>New Project</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Client</label>
          <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} style={{ ...inputStyle, cursor: "none" }}>
            <option value="">Select a client…</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Project Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div>
          <label style={labelStyle}>Automation (optional)</label>
          <select value={form.automation_id} onChange={(e) => setForm({ ...form, automation_id: e.target.value })} style={{ ...inputStyle, cursor: "none" }}>
            <option value="">Custom project (no catalogue item)</option>
            {automations.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Target Date</label>
            <input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} style={inputStyle} />
          </div>
        </div>

        {status === "error" && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#f87171" }}>{errorMsg}</div>}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={status === "loading"} style={{ background: "var(--accent)", color: "var(--black)", padding: "14px 32px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "none", opacity: status === "loading" ? 0.7 : 1 }}>
            {status === "loading" ? "Creating…" : "Create Project"}
          </button>
          <Link href="/admin/projects" style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)" }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function NewProjectPage() {
  return <Suspense><NewProjectForm /></Suspense>;
}
