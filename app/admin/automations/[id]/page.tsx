import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import AutomationEditClient from "@/components/admin/AutomationEditClient";

export default async function AdminAutomationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseAdminClient();
  const { data: automation } = await supabase
    .from("automations")
    .select("*")
    .eq("id", id)
    .single();

  if (!automation) notFound();

  return (
    <div style={{ padding: "48px" }} className="admin-edit-page">
      <Link
        href="/admin/automations"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--muted)", fontSize: 12, letterSpacing: "0.1em",
          textTransform: "uppercase", textDecoration: "none", marginBottom: 32,
        }}
      >
        ← All Automations
      </Link>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>
        {automation.name}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 40 }}>
        /{automation.slug}
      </p>
      <AutomationEditClient automation={automation} />
      <style>{`
        @media (max-width: 768px) { .admin-edit-page { padding: 24px !important; } }
      `}</style>
    </div>
  );
}
