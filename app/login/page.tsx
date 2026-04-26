"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    const role = data.user?.app_metadata?.role;
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--deep)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "var(--white)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 300,
    padding: "14px 18px",
    outline: "none",
    transition: "border-color 0.2s",
    borderRadius: 0,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--black)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: -0.5,
            color: "var(--white)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: "var(--accent)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          Neural<span style={{ color: "var(--accent)" }}>Edge</span>
        </div>
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "52px 48px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--accent) 40%, transparent)",
          }}
        />

        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 24,
          }}
        >
          Client Portal
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: -1,
            marginBottom: 32,
          }}
        >
          Sign In
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 10,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 10,
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                padding: "12px 16px",
                marginBottom: 20,
                fontSize: 13,
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="login-btn">
            <span>{loading ? "Signing in…" : "Sign In →"}</span>
          </button>
        </form>
      </div>

      <Link
        href="/"
        style={{
          marginTop: 32,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
          textDecoration: "none",
        }}
      >
        ← Back to site
      </Link>

      <style>{`
        .login-btn {
          width: 100%; background: var(--accent); color: var(--black);
          font-family: var(--font-display);
          font-weight: 700; font-size: 12px; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 18px;
          border: none; cursor: none; transition: all 0.25s;
          position: relative; overflow: hidden; border-radius: 0;
        }
        .login-btn::after {
          content: ''; position: absolute; inset: 0;
          background: white; transform: translateX(-101%);
          transition: transform 0.3s ease; opacity: 0.15;
        }
        .login-btn:hover::after { transform: translateX(0); }
        .login-btn span { position: relative; z-index: 1; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </main>
  );
}
