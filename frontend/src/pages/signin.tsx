import React, { FormEvent, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MatrixCanvas from "@site/src/components/MatrixCanvas";

export default function SigninPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Sign In - ${siteConfig.title}`}
      description="Sign in to your account for Physical AI & Humanoid Robotics"
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

              const [email, setEmail] = useState<string>("");
              const [password, setPassword] = useState<string>("");
              const [loading, setLoading] = useState<boolean>(false);
              const [error, setError] = useState<string | null>(null);

              const submit = async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setLoading(true);
                setError(null);

                try {
                  const res = await auth.signIn.email({ email, password });

                  if (res?.error) {
                    setError(res.error.message || "Sign in failed");
                    setLoading(false);
                    return;
                  }

                  // The signIn response should contain the session
                  // Store the user's name in localStorage for the navbar immediately
                  const userName = res.data?.session?.user?.name ||
                                  res.data?.session?.user?.email?.split('@')[0] ||
                                  'User';
                  localStorage.setItem('userName', userName);

                  // Store session in localStorage for faster access
                  localStorage.setItem('better-auth-session', JSON.stringify(res.data));

                  // Redirect to documentation page after successful signin
                  window.location.href = "/SpecKit-Plus/docs/module-01-robotic-nervous-system/intro";
                } catch (err) {
                  setError("Sign in failed. Please try again.");
                  setLoading(false);
                  console.error("Sign in error:", err);
                }
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
                    Sign In
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
                        placeholder="Enter password"
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
                        marginTop: "1rem"
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
                      {loading ? "Signing In..." : "Sign In"}
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
