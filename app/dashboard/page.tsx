import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import StatStrip from "@/components/dashboard/StatStrip";
import ProjectCard from "@/components/dashboard/ProjectCard";

export const metadata = { title: "Dashboard — NeuralEdge" };

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, status, project_milestones(id, status)")
    .order("created_at", { ascending: false });

  const { data: metricsRows } = await supabase
    .from("automation_metrics")
    .select("runs_this_month, hours_saved_this_month, error_rate");

  const activeCount = (projects ?? []).filter((p) => ["discovery", "build", "review", "live"].includes(p.status)).length;
  const totalRunsMonth = (metricsRows ?? []).reduce((s, m) => s + (m.runs_this_month ?? 0), 0);
  const totalHoursMonth = (metricsRows ?? []).reduce((s, m) => s + Number(m.hours_saved_this_month ?? 0), 0);
  const avgError = metricsRows && metricsRows.length > 0
    ? metricsRows.reduce((s, m) => s + Number(m.error_rate ?? 0), 0) / metricsRows.length
    : 0;

  const stats = [
    { label: "Active Projects", value: activeCount },
    { label: "Runs This Month", value: totalRunsMonth.toLocaleString() },
    { label: "Hours Saved (Month)", value: totalHoursMonth.toFixed(1), suffix: "h" },
    { label: "Avg Error Rate", value: avgError.toFixed(1), suffix: "%" },
  ];

  return (
    <div style={{ padding: "48px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>
        Overview
      </h1>

      <StatStrip stats={stats} />

      {!projects || projects.length === 0 ? (
        <div
          style={{
            background: "var(--surface)", padding: "60px 40px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            Your automations are being set up
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            We&apos;ll be in touch shortly with your first project update.
          </p>
        </div>
      ) : (
        <>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
            Your Projects
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {projects.map((p) => {
              const milestones = (p.project_milestones as { id: string; status: string }[]) ?? [];
              return (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description}
                  status={p.status}
                  completedMilestones={milestones.filter((m) => m.status === "completed").length}
                  totalMilestones={milestones.length}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
