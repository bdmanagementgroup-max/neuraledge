"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--muted)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "none",
        padding: "8px 16px",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      Sign Out
    </button>
  );
}
