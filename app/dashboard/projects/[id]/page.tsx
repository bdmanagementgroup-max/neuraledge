import { redirect, notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import MilestoneTracker from "@/components/dashboard/MilestoneTracker";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import Link from "next/link";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, description, status, start_date, target_date, automations(name), project_milestones(id, title, status, completed_at, sort_order)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: metrics } = await supabase
    .from("automation_metrics")
    .select("runs_total, runs_this_month, hours_saved_total, hours_saved_this_month, error_rate, last_run_at")
    .eq("project_id", id)
    .single();

  const milestones = (project.project_milestones as { id: string; title: string; status: "pending" | "in_progress" | "completed"; completed_at: string | null; sort_order: number }[]) ?? [];

  const STATUS_COLOURS: Record<string, string> = {
    discovery: "#6b6a80", build: "#f5a623", review: "#00b4f0", live: "#00f5d4", paused: "#6b6a80",
  };
  const colour = STATUS_COLOURS[project.status] ?? "var(--muted)";

  return (
    <div style={{ padding: "48px" }}>
      <Link
        href="/dashboard/projects"
        style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}
      >
        ← All Projects
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
          {project.title}
        </h1>
        <span
          style={{
            fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "6px 14px",
            background: `${colour}18`,
            border: `1px solid ${colour}40`,
            color: colour, fontWeight: 700, flexShrink: 0, marginLeft: 24,
          }}
        >
          {project.status}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="project-detail-grid">
        <div>
          {project.description && (
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.9, marginBottom: 32 }}>{project.description}</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {project.start_date && (
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Start Date</span>
                <span style={{ fontSize: 13 }}>{new Date(project.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
            {project.target_date && (
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Target Date</span>
                <span style={{ fontSize: 13 }}>{new Date(project.target_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
            {(() => {
              const auto = project.automations as unknown as { name: string } | { name: string }[] | null;
              const autoName = Array.isArray(auto) ? auto[0]?.name : auto?.name;
              return autoName ? (
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Automation Type</span>
                  <span style={{ fontSize: 13 }}>{autoName}</span>
                </div>
              ) : null;
            })()}
          </div>

          {milestones.length > 0 && <MilestoneTracker milestones={milestones} />}
        </div>

        <div>
          {project.status === "live" && metrics ? (
            <div style={{ background: "var(--surface)", padding: 36, border: "1px solid rgba(0,245,212,0.1)" }}>
              <MetricsPanel metrics={metrics} />
            </div>
          ) : (
            <div style={{ background: "var(--surface)", padding: 36, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
                Metrics will appear here once your automation goes live.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .project-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
