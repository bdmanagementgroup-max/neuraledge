import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "AI Tools — NeuralEdge" };

type Tool = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  category: string | null;
};

export default async function ToolsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, description, url, category")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  const grouped = (tools ?? []).reduce<Record<string, Tool[]>>((acc, tool) => {
    const cat = tool.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {});

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
        Resources
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px" }}>
        AI Tools
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 48 }}>
        A curated set of tools to help you get more out of AI in your business.
      </p>

      {Object.keys(grouped).length === 0 ? (
        <div
          style={{
            padding: "60px 40px", textAlign: "center",
            background: "var(--deep)", border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Tools coming soon
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            We&apos;re curating the best AI tools for your industry. Check back soon.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "var(--muted)", marginBottom: 16,
                  paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {category}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
                {items.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url ?? "#"}
                    target={tool.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "24px 28px",
                        background: "var(--deep)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderLeft: "2px solid transparent",
                        transition: "all 0.2s",
                        height: "100%",
                        boxSizing: "border-box",
                      }}
                      className="tool-card"
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                          color: "var(--white)", marginBottom: 8,
                        }}
                      >
                        {tool.name} {tool.url && <span style={{ color: "var(--accent)", fontSize: 12 }}>↗</span>}
                      </div>
                      {tool.description && (
                        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                          {tool.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .tool-card:hover { border-left-color: var(--accent) !important; background: var(--surface) !important; }
      `}</style>
    </div>
  );
}
