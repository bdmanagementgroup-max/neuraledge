import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/dashboard/ProjectCard";

export const metadata = { title: "My Projects — NeuralEdge" };

const STATUSES = ["all", "discovery", "build", "review", "live", "paused"];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { status } = await searchParams;
  const activeFilter = STATUSES.includes(status ?? "") ? status : "all";

  let query = supabase
    .from("projects")
    .select("id, title, description, status, project_milestones(id, status)")
    .order("created_at", { ascending: false });

  if (activeFilter && activeFilter !== "all") {
    query = query.eq("status", activeFilter);
  }

  const { data: projects } = await query;

  return (
    <div style={{ padding: "48px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 32 }}>
        My Projects
      </h1>

      <div style={{ display: "flex", gap: 2, marginBottom: 32, flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={s === "all" ? "/dashboard/projects" : `/dashboard/projects?status=${s}`}
            style={{
              padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none",
              background: activeFilter === s ? "var(--accent)" : "var(--surface)",
              color: activeFilter === s ? "var(--black)" : "var(--muted)",
              fontFamily: "var(--font-display)", fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      {!projects || projects.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>No projects found.</p>
      ) : (
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
      )}
    </div>
  );
}
