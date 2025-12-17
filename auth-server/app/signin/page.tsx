"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/client";
import Link from "next/link";

const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await auth.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed");
      } else {
        // Redirect to home page
        window.location.href = "/";
      }
    } catch (err) {
      setError("An error occurred during sign in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617",
      padding: 16
    }}>
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        padding: 24,
        borderRadius: 8,
        width: "100%",
        maxWidth: 400,
        color: "#fff"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#fff" }}>Sign In</h2>

        {error && <p style={{ color: "#ef4444", marginBottom: 16, textAlign: "center" }}>{error}</p>}

        <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 12,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#fff",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 12,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#fff",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ color: "#94a3b8" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}