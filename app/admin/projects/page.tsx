import { getSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Projects — NeuralEdge Admin" };

const STATUSES = ["all", "discovery", "build", "review", "live", "paused"];
const STATUS_COLOURS: Record<string, string> = {
  discovery: "#6b6a80", build: "#f5a623", review: "#00b4f0", live: "#00f5d4", paused: "#6b6a80",
};

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const activeFilter = STATUSES.includes(status ?? "") ? status : "all";
  const supabase = await getSupabaseAdminClient();

  let query = supabase
    .from("projects")
    .select("id, title, status, start_date, target_date, clients(name)")
    .order("created_at", { ascending: false });

  if (activeFilter && activeFilter !== "all") query = query.eq("status", activeFilter);

  const { data: projects } = await query;

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Projects</h1>
        <Link href="/admin/projects/new" style={{ background: "var(--accent)", color: "var(--black)", padding: "10px 24px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
          + New Project
        </Link>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 32, flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <a key={s} href={s === "all" ? "/admin/projects" : `/admin/projects?status=${s}`} style={{ padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", background: activeFilter === s ? "var(--accent)" : "var(--surface)", color: activeFilter === s ? "var(--black)" : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      {!projects || projects.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No projects found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((p) => {
            const client = p.clients as { name: string } | { name: string }[] | null;
            const clientName = Array.isArray(client) ? client[0]?.name : client?.name;
            return (
              <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--surface)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${STATUS_COLOURS[p.status] ?? "var(--muted)"}`, transition: "background 0.2s" }} className="project-row">
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{clientName ?? "No client"}{p.target_date ? ` · Due ${new Date(p.target_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}</div>
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: STATUS_COLOURS[p.status] ?? "var(--muted)", fontWeight: 700 }}>{p.status}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <style>{`.project-row:hover { background: var(--edge) !important; }`}</style>
    </div>
  );
}
