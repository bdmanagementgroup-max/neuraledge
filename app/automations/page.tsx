import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AutomationsCatalogue from "@/components/home/AutomationsCatalogue";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Automations — NeuralEdge" };

export type Automation = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price_from: number | null;
};

async function getAutomations(): Promise<Automation[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("automations")
      .select("id, name, slug, description, category, price_from")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AutomationsPage() {
  const automations = await getAutomations();

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 120 }}>
        <section style={{ padding: "60px 60px 120px" }} className="automations-section">
          <div style={{ marginBottom: 70 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{"//"}</span> What We Automate
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800, letterSpacing: -2, lineHeight: 1, maxWidth: 700,
              }}
            >
              AI Automations,<br />
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>
                built for your business.
              </em>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.9, maxWidth: 540, marginTop: 24 }}>
              Browse our catalogue of proven automation packages. Each one is customised to fit your stack and workflow. Can&apos;t see what you need? Let us know.
            </p>
          </div>

          <AutomationsCatalogue automations={automations} />
        </section>
      </main>
      <Footer />
    </>
  );
}
