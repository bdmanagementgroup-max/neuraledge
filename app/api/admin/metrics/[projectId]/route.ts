import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { runs_total, runs_this_month, hours_saved_total, hours_saved_this_month, error_rate, user_id } = body;

    const supabase = await getSupabaseAdminClient();

    const { data: existing } = await supabase
      .from("automation_metrics")
      .select("id")
      .eq("project_id", projectId)
      .single();

    const payload = {
      project_id: projectId,
      user_id,
      runs_total: Number(runs_total ?? 0),
      runs_this_month: Number(runs_this_month ?? 0),
      hours_saved_total: Number(hours_saved_total ?? 0),
      hours_saved_this_month: Number(hours_saved_this_month ?? 0),
      error_rate: Number(error_rate ?? 0),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (existing) {
      ({ error } = await supabase.from("automation_metrics").update(payload).eq("project_id", projectId));
    } else {
      ({ error } = await supabase.from("automation_metrics").insert(payload));
    }

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
