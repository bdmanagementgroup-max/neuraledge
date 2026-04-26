import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Leads — NeuralEdge Admin" };

export default async function AdminLeadsPage() {
  const supabase = await getSupabaseAdminClient();

  const [{ data: leads }, { data: enquiries }] = await Promise.all([
    supabase.from("leads").select("id, email, name, created_at").order("created_at", { ascending: false }),
    supabase.from("enquiries").select("id, name, email, company, message, automation_type, created_at").order("created_at", { ascending: false }),
  ]);

  type Lead = { id: string; email: string; name: string | null; created_at: string; type: "lead"; company?: null; message?: null; automation_type?: null };
  type Enquiry = { id: string; email: string; name: string; company: string | null; message: string | null; automation_type: string | null; created_at: string; type: "enquiry" };

  const merged: (Lead | Enquiry)[] = [
    ...(leads ?? []).map((l) => ({ ...l, type: "lead" as const })),
    ...(enquiries ?? []).map((e) => ({ ...e, type: "enquiry" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div style={{ padding: "48px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 32 }}>
        Leads Inbox
        <span style={{ fontSize: 16, color: "var(--muted)", marginLeft: 16, fontWeight: 400 }}>({merged.length})</span>
      </h1>

      {merged.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No leads yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {merged.map((item) => (
            <div key={item.id} style={{ background: "var(--surface)", padding: "24px 32px", borderLeft: `2px solid ${item.type === "enquiry" ? "var(--accent)" : "var(--muted)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: item.type === "enquiry" ? 12 : 0 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{item.name ?? item.email}</span>
                    <span
                      style={{
                        fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
                        padding: "2px 8px",
                        background: item.type === "enquiry" ? "rgba(0,245,212,0.1)" : "rgba(107,106,128,0.15)",
                        color: item.type === "enquiry" ? "var(--accent)" : "var(--muted)",
                        border: item.type === "enquiry" ? "1px solid rgba(0,245,212,0.2)" : "1px solid rgba(107,106,128,0.2)",
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {item.email}
                    {item.company ? ` · ${item.company}` : ""}
                    {item.automation_type ? ` · ${item.automation_type}` : ""}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0, marginLeft: 24 }}>
                  {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              {item.message && (
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {item.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
