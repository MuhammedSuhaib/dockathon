import React, { FormEvent, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MatrixCanvas from "@site/src/components/MatrixCanvas";
import UserBackgroundForm from "@site/src/components/personalize";

type Background = {
  software: string;
  hardware: string;
  goal: string;
};

export default function SignupPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Sign Up - ${siteConfig.title}`}
      description="Create your account to get started with Physical AI & Humanoid Robotics"
    >
      <MatrixCanvas opacity={0.12} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: "20px",
          color: "white"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
            backdropFilter: "blur(10px)"
          }}
        >
          <BrowserOnly>
            {() => {
              const { createAuthClient } = require("better-auth/client");

              const auth = createAuthClient({
                baseURL: "https://better-auth-neon-db.vercel.app",
              });

              const [name, setName] = useState<string>("");
              const [email, setEmail] = useState<string>("");
              const [password, setPassword] = useState<string>("");
              const [bg, setBg] = useState<Background>({
                software: "",
                hardware: "",
                goal: "",
              });
              const [loading, setLoading] = useState<boolean>(false);
              const [error, setError] = useState<string | null>(null);

              const submit = async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setLoading(true);
                setError(null);

                if (!name || !email || password.length < 8) {
                  setError("Please fill in all required fields");
                  setLoading(false);
                  return;
                }

                if (!bg.software || !bg.hardware || !bg.goal) {
                  setError("Please answer all personalization questions");
                  setLoading(false);
                  return;
                }

                const res = await auth.signUp.email({ name, email, password });

                if (res?.error) {
                  setError(res.error.message || "Signup failed");
                  setLoading(false);
                  console.error(res.error);
                  return;
                }

                // Save metadata in Better Auth
                try {
                  await auth.updateUser({
                    metadata: {
                      name,
                      background: bg,
                    },
                  });
                } catch (err) {
                  console.error("Failed to save user metadata:", err);
                }

                // Redirect to documentation page after successful signup
                window.location.href = "/docs/module-01-robotic-nervous-system/intro";
              };

              return (
                <div>
                  <h1
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1.5rem",
                      textAlign: "center",
                      color: "#00ff41",
                      textShadow: "0 0 10px rgba(0, 255, 65, 0.7)"
                    }}
                  >
                    Create Account
                  </h1>
                  {error && (
                    <div
                      style={{
                        color: "#ff4d4d",
                        backgroundColor: "rgba(255, 77, 77, 0.1)",
                        padding: "0.75rem",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                        border: "1px solid #ff4d4d",
                      }}
                    >
                      {error}
                    </div>
                  )}
                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label
                        htmlFor="name"
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#00cc44"
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        title="Full name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #00ff41",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          fontSize: "1rem"
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#00cc44"
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        title="Email address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #00ff41",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          fontSize: "1rem"
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#00cc44"
                        }}
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        title="Password"
                        placeholder="Enter password (min 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #00ff41",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          fontSize: "1rem"
                        }}
                      />
                    </div>

                    <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(0, 255, 65, 0.3)" }}>
                      <h3
                        style={{
                          marginBottom: "1rem",
                          color: "#00ff41",
                          fontSize: "1.2rem",
                          textAlign: "center",
                        }}
                      >
                        Personalization Questions
                      </h3>
                      <UserBackgroundForm value={bg} onChange={setBg} />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: loading ? "#009933" : "#00cc44",
                        borderColor: "#00cc44",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        textDecoration: "none",
                        borderRadius: "4px",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        marginTop: "1.5rem"
                      }}
                      onMouseOver={(e) => {
                        if (!loading) {
                          const target = e.target as HTMLButtonElement;
                          target.style.backgroundColor = "#00ff41";
                          target.style.boxShadow = "0 0 15px rgba(0, 255, 65, 0.5)";
                        }
                      }}
                      onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = loading ? "#009933" : "#00cc44";
                        target.style.boxShadow = "none";
                      }}
                    >
                      {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                  </form>
                </div>
              );
            }}
          </BrowserOnly>
        </div>
      </div>
    </Layout>
  );
}
