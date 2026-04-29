import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

export async function GET() {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = await getSupabaseAdminClient();
  const { data } = await supabase.from("tools").select("*").order("sort_order", { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { name, description, url, category, active, sort_order } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });

  const supabase = await getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tools")
    .insert({ name: name.trim(), description: description?.trim() || null, url: url?.trim() || null, category: category?.trim() || null, active: active ?? true, sort_order: sort_order ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
