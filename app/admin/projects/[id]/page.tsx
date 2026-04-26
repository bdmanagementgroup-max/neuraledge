import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminProjectClient from "@/components/admin/AdminProjectClient";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, description, status, start_date, target_date, user_id, clients(name), automations(name), project_milestones(id, title, status, completed_at, sort_order)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: metrics } = await supabase
    .from("automation_metrics")
    .select("runs_total, runs_this_month, hours_saved_total, hours_saved_this_month, error_rate, last_run_at")
    .eq("project_id", id)
    .single();

  const clientData = project.clients as { name: string } | { name: string }[] | null;
  const clientName = Array.isArray(clientData) ? clientData[0]?.name : clientData?.name;

  const autoData = project.automations as { name: string } | { name: string }[] | null;
  const autoName = Array.isArray(autoData) ? autoData[0]?.name : autoData?.name;

  const milestones = (project.project_milestones as { id: string; title: string; status: string; completed_at: string | null; sort_order: number }[]) ?? [];

  return (
    <div style={{ padding: "48px" }}>
      <Link href="/admin/projects" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        ← All Projects
      </Link>

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>{project.title}</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          {clientName ?? "No client"}
          {autoName ? ` · ${autoName}` : ""}
        </p>
      </div>

      <AdminProjectClient
        projectId={id}
        userId={project.user_id}
        initialStatus={project.status}
        milestones={milestones}
        metrics={metrics ?? null}
      />
    </div>
  );
}
