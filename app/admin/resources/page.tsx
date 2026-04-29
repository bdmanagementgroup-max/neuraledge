import { getSupabaseAdminClient } from "@/lib/supabase/server";
import ResourcesAdminClient from "./ResourcesAdminClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resources — NeuralEdge Admin" };

export default async function AdminResourcesPage() {
  const supabase = await getSupabaseAdminClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div style={{ padding: "48px" }}>
      <ResourcesAdminClient initial={resources ?? []} />
    </div>
  );
}
