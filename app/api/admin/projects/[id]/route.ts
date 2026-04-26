import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, milestones } = await req.json();

    const supabase = await getSupabaseAdminClient();

    if (status) {
      const { error } = await supabase.from("projects").update({ status }).eq("id", id);
      if (error) throw error;
    }

    if (milestones && Array.isArray(milestones)) {
      for (const m of milestones) {
        const update: Record<string, string | null> = { status: m.status };
        if (m.status === "completed") {
          update.completed_at = new Date().toISOString();
        } else {
          update.completed_at = null;
        }
        const { error } = await supabase.from("project_milestones").update(update).eq("id", m.id);
        if (error) throw error;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
