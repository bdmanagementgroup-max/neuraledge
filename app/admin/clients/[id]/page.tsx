import { getSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseAdminClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, company, plan, status, created_at")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const STATUS_COLOURS: Record<string, string> = {
    discovery: "#6b6a80", build: "#f5a623", review: "#00b4f0", live: "#00f5d4", paused: "#6b6a80",
  };

  return (
    <div style={{ padding: "48px" }}>
      <Link href="/admin/clients" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        ← All Clients
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>{client.name}</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>{client.email} {client.company ? `· ${client.company}` : ""}</p>
        </div>
        <Link
          href={`/admin/projects/new?clientId=${id}`}
          style={{
            background: "var(--accent)", color: "var(--black)",
            padding: "10px 24px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
            textTransform: "uppercase", textDecoration: "none",
          }}
        >
          + New Project
        </Link>
      </div>

      <div style={{ display: "flex", gap: 32, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { label: "Plan", value: client.plan ?? "—" },
          { label: "Status", value: client.status ?? "active" },
          { label: "Joined", value: new Date(client.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 20 }}>
        Projects ({projects?.length ?? 0})
      </h2>

      {!projects || projects.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>No projects yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((p) => (
            <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--surface)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${STATUS_COLOURS[p.status] ?? "var(--muted)"}`, transition: "background 0.2s" }} className="project-row">
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: STATUS_COLOURS[p.status] ?? "var(--muted)", fontWeight: 700 }}>{p.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .project-row:hover { background: var(--edge) !important; }
      `}</style>
    </div>
  );
}
