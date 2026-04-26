import { getSupabaseAdminClient } from "@/lib/supabase/server";
import AutomationsClient from "@/components/admin/AutomationsClient";

export const metadata = { title: "Automations — NeuralEdge Admin" };

export default async function AdminAutomationsPage() {
  const supabase = await getSupabaseAdminClient();
  const { data: automations } = await supabase
    .from("automations")
    .select("id, name, slug, category, description, price_from, active, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div style={{ padding: "48px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 32 }}>
        Automation Catalogue
      </h1>
      <AutomationsClient automations={automations ?? []} />
    </div>
  );
}
