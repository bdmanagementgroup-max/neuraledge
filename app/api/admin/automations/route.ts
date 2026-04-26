import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseAdminClient();
  const { data } = await supabase.from("automations").select("*").order("sort_order", { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase.from("automations").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create automation" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const supabase = await getSupabaseAdminClient();
    const { error } = await supabase.from("automations").update(updates).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update automation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const supabase = await getSupabaseAdminClient();
    const { error } = await supabase.from("automations").update({ active: false }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to deactivate automation" }, { status: 500 });
  }
}
