import Link from "next/link";

const STATUS_COLOURS: Record<string, string> = {
  discovery: "#6b6a80",
  build: "#f5a623",
  review: "#00b4f0",
  live: "#00f5d4",
  paused: "#6b6a80",
};

const STATUS_LABELS: Record<string, string> = {
  discovery: "Discovery",
  build: "Build",
  review: "Review",
  live: "Live",
  paused: "Paused",
};

type Props = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  completedMilestones: number;
  totalMilestones: number;
};

export default function ProjectCard({ id, title, description, status, completedMilestones, totalMilestones }: Props) {
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const colour = STATUS_COLOURS[status] ?? "var(--muted)";

  return (
    <Link href={`/dashboard/projects/${id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--surface)", padding: "32px 36px",
          borderLeft: `2px solid ${colour}`,
          transition: "background 0.2s",
          cursor: "none",
        }}
        className="project-card"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
            {title}
          </h3>
          <span
            style={{
              fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "4px 10px",
              background: `${colour}18`,
              border: `1px solid ${colour}40`,
              color: colour,
              fontWeight: 700, flexShrink: 0, marginLeft: 16,
            }}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {description && (
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            {description}
          </p>
        )}

        {totalMilestones > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Progress
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {completedMilestones}/{totalMilestones} milestones
              </span>
            </div>
            <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
              <div
                style={{
                  height: "100%", width: `${progress}%`,
                  background: colour, borderRadius: 1,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
