import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/dashboard/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — NeuralEdge" };

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "My Projects" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--black)" }}>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 22,
                height: 22,
                background: "var(--accent)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: -0.5,
                color: "var(--white)",
              }}
            >
              Neural<span style={{ color: "var(--accent)" }}>Edge</span>
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 32 }}>
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </header>

      <main style={{ paddingTop: 64, flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
