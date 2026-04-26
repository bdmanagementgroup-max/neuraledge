import { getSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Clients — NeuralEdge Admin" };

export default async function AdminClientsPage() {
  const supabase = await getSupabaseAdminClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, company, plan, status, created_at")
    .order("created_at", { ascending: false });

  const STATUS_COLOUR: Record<string, string> = { active: "#00f5d4", paused: "#f5a623", completed: "#6b6a80" };

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Clients</h1>
        <Link
          href="/admin/clients/new"
          style={{
            background: "var(--accent)", color: "var(--black)",
            padding: "10px 24px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
            textTransform: "uppercase", textDecoration: "none",
          }}
        >
          + New Client
        </Link>
      </div>

      {!clients || clients.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No clients yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Name", "Company", "Plan", "Status", "Joined", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "16px", fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 700 }}>{c.name}</td>
                <td style={{ padding: "16px", fontSize: 13, color: "var(--muted)" }}>{c.company ?? "—"}</td>
                <td style={{ padding: "16px", fontSize: 12 }}>{c.plan ?? "—"}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: STATUS_COLOUR[c.status ?? "active"] ?? "var(--muted)", fontWeight: 700 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "16px", fontSize: 12, color: "var(--muted)" }}>
                  {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "16px" }}>
                  <Link href={`/admin/clients/${c.id}`} style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.05em" }}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
