import { getSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import ArticlesClient from "@/components/admin/ArticlesClient";

export const metadata = { title: "Articles — NeuralEdge Admin" };

export default async function AdminArticlesPage() {
  const supabase = await getSupabaseAdminClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, published, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Articles</h1>
        <Link
          href="/admin/articles/new"
          style={{
            background: "var(--accent)", color: "var(--black)",
            padding: "10px 24px", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
            textTransform: "uppercase", textDecoration: "none",
          }}
        >
          + New Article
        </Link>
      </div>

      <ArticlesClient articles={articles ?? []} />
    </div>
  );
}
