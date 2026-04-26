import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message, automation_type } = await req.json();
    if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

    const supabase = await getSupabaseAdminClient();
    const { error } = await supabase.from("enquiries").insert({ name, email, company, message, automation_type });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
