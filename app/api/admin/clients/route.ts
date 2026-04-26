import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, plan, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
    }

    const supabase = await getSupabaseAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const { error: clientError } = await supabase.from("clients").insert({
      user_id: authData.user.id,
      name,
      email,
      company,
      plan,
      status: "active",
    });

    if (clientError) throw clientError;

    return NextResponse.json({ ok: true, userId: authData.user.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create client";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
