import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/dashboard/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — NeuralEdge" };

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/automations", label: "Automations" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/resources", label: "Resources" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--black)" }}>
      <aside
        style={{
          width: 240, flexShrink: 0,
          background: "var(--deep)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 0",
          position: "fixed", top: 0, bottom: 0, left: 0,
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ padding: "0 28px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 20,
                height: 20,
                background: "var(--accent)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: -0.5,
                color: "var(--white)",
              }}
            >
              Neural<span style={{ color: "var(--accent)" }}>Edge</span>
            </span>
          </Link>
          <div
            style={{
              marginTop: 8,
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Admin Panel
          </div>
        </div>

        <nav style={{ flex: 1, padding: "24px 0" }}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                padding: "12px 28px",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <LogoutButton />
        </div>
      </aside>

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>

      <style>{`
        aside nav a:hover { color: var(--accent) !important; }
      `}</style>
    </div>
  );
}
