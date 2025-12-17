"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/client";

// Client-side auth client
const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// UserBackgroundForm component - copy from the personalize.tsx file
function UserBackgroundForm({ value, onChange }: {
  value: { software: string; hardware: string; goal: string; };
  onChange: (v: { software: string; hardware: string; goal: string; }) => void;
}) {
  const update = (key: keyof typeof value, v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      {/* Software Background */}
      <section>
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Software Background</h3>
        {[
          "Beginner (basic Python/JS)",
          "Intermediate (ROS, ML, CV basics)",
          "Advanced (Robotics, RL, Isaac, ROS 2 production)",
        ].map((option) => (
          <label key={option} style={{ display: "block", marginBottom: 8 }}>
            <input
              type="radio"
              name="software"
              checked={value.software === option}
              onChange={() => update("software", option)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: "#cbd5e1" }}>{option}</span>
          </label>
        ))}
      </section>

      {/* Hardware Access */}
      <section>
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Hardware Access</h3>
        {[
          "RTX-enabled PC (RTX 30/40 series)",
          "Jetson (Nano / Orin)",
          "Robot hardware (arm, quadruped, humanoid)",
          "Simulation only (no hardware)",
        ].map((option) => (
          <label key={option} style={{ display: "block", marginBottom: 8 }}>
            <input
              type="radio"
              name="hardware"
              checked={value.hardware === option}
              onChange={() => update("hardware", option)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: "#cbd5e1" }}>{option}</span>
          </label>
        ))}
      </section>

      {/* Goal */}
      <section>
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Learning Goal</h3>
        {[
          "Learn fundamentals of Physical AI",
          "Build simulated humanoids",
          "Deploy AI on real robots",
          "Research / startup / teaching",
        ].map((option) => (
          <label key={option} style={{ display: "block", marginBottom: 8 }}>
            <input
              type="radio"
              name="goal"
              checked={value.goal === option}
              onChange={() => update("goal", option)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: "#cbd5e1" }}>{option}</span>
          </label>
        ))}
      </section>
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bg, setBg] = useState({
    software: "",
    hardware: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, create the user with Better Auth
      const result = await auth.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Signup failed");
        return;
      }

      // If signup successful, save the background info to database
      // Get the session to retrieve user ID
      const session = await auth.getSession();
      const userId = session?.data?.user?.id;

      if (userId) {
        // This would make an API call to your backend to save the additional info
        const additionalInfoResponse = await fetch('http://localhost:8000/api/user-background', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            background: bg,
          }),
        });

        if (!additionalInfoResponse.ok) {
          console.error('Failed to save background info');
        }
      } else {
        console.error('Could not retrieve user ID after signup');
      }

      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      setError("An error occurred during signup");
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
        maxWidth: 600,
        color: "#fff"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: 24, color: "#fff" }}>Create Account</h1>

        {error && <p style={{ color: "#ef4444", marginBottom: 16, textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginTop: 16 }}>
            <h3 style={{ marginBottom: 12, color: "#fff" }}>Tell us about yourself:</h3>
            <UserBackgroundForm value={bg} onChange={setBg} />
          </div>

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
              marginTop: 16,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}