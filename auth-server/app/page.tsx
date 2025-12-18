"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/client";
import { currentSession } from "better-auth/client/plugins";

const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [currentSession()],
});

function UserBackgroundForm({
  value,
  onChange,
}: {
  value: { software: string; hardware: string; goal: string };
  onChange: (v: { software: string; hardware: string; goal: string }) => void;
}) {
  const update = (key: keyof typeof value, v: string) =>
    onChange({ ...value, [key]: v });

  const Section = ({
    title,
    name,
    options,
  }: {
    title: string;
    name: keyof typeof value;
    options: string[];
  }) => (
    <section>
      <p style={{ color: "#22c55e", marginBottom: 8 }}>{title}</p>
      {options.map((opt) => (
        <label key={opt} style={{ display: "block", marginBottom: 6 }}>
          <input
            type="radio"
            name={name}
            checked={value[name] === opt}
            onChange={() => update(name, opt)}
            style={{ marginRight: 8 }}
          />
          <span style={{ color: "#a7f3d0" }}>{opt}</span>
        </label>
      ))}
    </section>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Section
        title="Software Skill Level"
        name="software"
        options={[
          "Beginner (basic Python / JS)",
          "Intermediate (ML, CV, ROS)",
          "Advanced (Robotics, RL, production)",
        ]}
      />

      <Section
        title="Hardware Access"
        name="hardware"
        options={[
          "RTX machine",
          "Jetson device",
          "Real robot",
          "Simulation only",
        ]}
      />

      <Section
        title="Primary Objective"
        name="goal"
        options={[
          "Learn Physical AI",
          "Build simulated agents",
          "Deploy on real robots",
          "Research / startup",
        ]}
      />
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bg, setBg] = useState({ software: "", hardware: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await auth.signUp.email({ email, password, name });

    if (result.error) {
      setError(result.error.message || "Access denied");
      setLoading(false);
      return;
    }

    const session = await auth.getSession();
    const userId = session?.data?.user?.id;

    if (userId) {
      // Optional: Send background info to your API
      // Make sure to update the endpoint to match your backend
      // await fetch("/api/user-background", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ user_id: userId, background: bg }),
      // });
    }

    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          border: "1px solid #22c55e",
          padding: 24,
          borderRadius: 8,
          color: "#22c55e",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>
          JACK INTO THE MATRIX
        </h1>

        {error && (
          <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {[
            ["Full Name", name, setName],
            ["Email", email, setEmail],
            ["Password", password, setPassword, "password"],
          ].map(([ph, val, set, type]) => (
            <input
              key={ph as string}
              type={(type as string) || "text"}
              placeholder={ph as string}
              value={val as string}
              onChange={(e) => (set as any)(e.target.value)}
              required
              style={{
                padding: 10,
                background: "#000",
                border: "1px solid #22c55e",
                color: "#22c55e",
              }}
            />
          ))}

          <UserBackgroundForm value={bg} onChange={setBg} />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 16,
              padding: 12,
              background: "#22c55e",
              color: "#000",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "CONNECTING..." : "JACK IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
