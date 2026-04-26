import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const DEFAULT_MILESTONES = ["Discovery", "Build", "Review", "Live"];

export async function POST(req: NextRequest) {
  try {
    const { client_id, user_id, title, description, automation_id, start_date, target_date } = await req.json();
    if (!client_id || !user_id || !title) {
      return NextResponse.json({ error: "client_id, user_id, and title required" }, { status: 400 });
    }

    const supabase = await getSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({ client_id, user_id, title, description, automation_id: automation_id || null, start_date: start_date || null, target_date: target_date || null, status: "discovery" })
      .select()
      .single();

    if (projectError) throw projectError;

    const milestones = DEFAULT_MILESTONES.map((m, i) => ({
      project_id: project.id,
      title: m,
      status: "pending",
      sort_order: i,
    }));

    const { error: milestonesError } = await supabase.from("project_milestones").insert(milestones);
    if (milestonesError) throw milestonesError;

    return NextResponse.json({ ok: true, id: project.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
