import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/dashboard/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — NeuralEdge" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: unreadCount } = await supabase
    .from("client_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);

  const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/notifications", label: "Notifications", badge: unreadCount ?? 0 },
    { href: "/dashboard/tools", label: "Tools" },
    { href: "/dashboard/resources", label: "Resources" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--black)" }}>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(5,5,8,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div
              style={{
                width: 22, height: 22,
                background: "var(--accent)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: 16, letterSpacing: -0.5, color: "var(--white)",
              }}
            >
              Neural<span style={{ color: "var(--accent)" }}>Edge</span>
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 24 }}>
            {NAV_ITEMS.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--muted)", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "color 0.2s",
                }}
                className="dash-nav-link"
              >
                {label}
                {badge != null && badge > 0 && (
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 16, height: 16, padding: "0 4px",
                      background: "var(--accent)", borderRadius: 8,
                      fontSize: 9, fontWeight: 700, color: "var(--black)",
                      lineHeight: 1,
                    }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </header>

      <main style={{ paddingTop: 64, flex: 1 }}>
        {children}
      </main>

      <style>{`
        .dash-nav-link:hover { color: var(--white) !important; }
      `}</style>
    </div>
  );
}
