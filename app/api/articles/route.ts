import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug, content, excerpt, published } = await req.json();
    if (!title || !slug) return NextResponse.json({ error: "Title and slug required" }, { status: 400 });

    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .insert({ title, slug, content, excerpt, published: published ?? false, published_at: published ? new Date().toISOString() : null })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
