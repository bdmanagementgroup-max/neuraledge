import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile — NeuralEdge" };

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const initialData = {
    display_name: profile?.display_name ?? "",
    company_name: profile?.company_name ?? "",
    phone: profile?.phone ?? "",
    website: profile?.website ?? "",
    industry: profile?.industry ?? "",
  };

  return (
    <div style={{ padding: "48px", maxWidth: 760 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
        Account
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px" }}>
        Profile
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 40 }}>
        Your company details help us tailor automations to your business context.
      </p>

      <ProfileForm email={user.email ?? ""} initialData={initialData} />
    </div>
  );
}
