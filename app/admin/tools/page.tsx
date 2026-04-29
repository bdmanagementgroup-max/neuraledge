import { getSupabaseAdminClient } from "@/lib/supabase/server";
import ToolsAdminClient from "./ToolsAdminClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tools — NeuralEdge Admin" };

export default async function AdminToolsPage() {
  const supabase = await getSupabaseAdminClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div style={{ padding: "48px" }}>
      <ToolsAdminClient initial={tools ?? []} />
    </div>
  );
}
