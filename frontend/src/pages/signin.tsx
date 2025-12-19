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

              const submit = async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                await auth.signIn.email({ email, password });
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
                      style={{
                        backgroundColor: "#00cc44",
                        borderColor: "#00cc44",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        textDecoration: "none",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        marginTop: "1rem"
                      }}
                      onMouseOver={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = "#00ff41";
                        target.style.boxShadow = "0 0 15px rgba(0, 255, 65, 0.5)";
                      }}
                      onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = "#00cc44";
                        target.style.boxShadow = "none";
                      }}
                    >
                      Sign In
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
