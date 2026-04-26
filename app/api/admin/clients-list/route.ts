import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseAdminClient();
  const { data } = await supabase.from("clients").select("id, name, user_id").order("name");
  return NextResponse.json(data ?? []);
}
