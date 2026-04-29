import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import NotificationsList from "./NotificationsList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications — NeuralEdge" };

type Notification = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export default async function NotificationsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("client_notifications")
    .select("id, title, body, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const notifications: Notification[] = data ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div style={{ padding: "48px", maxWidth: 760 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
        Account
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: 0 }}>
          Notifications
        </h1>
        {unreadCount > 0 && (
          <span
            style={{
              padding: "3px 10px", background: "var(--accent)", borderRadius: 12,
              fontSize: 11, fontWeight: 700, color: "var(--black)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      <NotificationsList notifications={notifications} />
    </div>
  );
}
