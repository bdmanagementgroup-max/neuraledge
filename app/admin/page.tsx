import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin — NeuralEdge" };

export default async function AdminPage() {
  const supabase = await getSupabaseAdminClient();

  const [{ count: clientCount }, { count: projectCount }, { count: leadsCount }, { count: enquiriesCount }] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Active Clients", value: clientCount ?? 0, href: "/admin/clients" },
    { label: "Live Projects", value: projectCount ?? 0, href: "/admin/projects" },
    { label: "Open Leads", value: (leadsCount ?? 0) + (enquiriesCount ?? 0), href: "/admin/leads" },
  ];

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
        Admin Panel
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>
        Overview
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 48 }}>
        {stats.map((s) => (
          <a key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--surface)", padding: "32px", border: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="admin-stat">
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, letterSpacing: -2, color: "var(--white)", marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {[
          { label: "Manage Clients", href: "/admin/clients", desc: "View all clients and create new accounts" },
          { label: "Manage Projects", href: "/admin/projects", desc: "Track and update all client automation projects" },
          { label: "Leads Inbox", href: "/admin/leads", desc: "View email captures and scoping enquiries" },
          { label: "Automations", href: "/admin/automations", desc: "Edit the public automation catalogue" },
          { label: "Articles", href: "/admin/articles", desc: "Write and publish blog articles" },
        ].map((link) => (
          <a key={link.href} href={link.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--deep)", padding: "28px 32px", borderLeft: "2px solid transparent", transition: "all 0.2s" }} className="admin-nav-card">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{link.label} →</div>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.6 }}>{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .admin-stat:hover { background: var(--edge) !important; }
        .admin-nav-card:hover { border-left-color: var(--accent) !important; background: var(--surface) !important; }
      `}</style>
    </div>
  );
}
