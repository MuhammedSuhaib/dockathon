import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize Better Auth
const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Enable JWT plugin to generate keys and store them in the 'jwks' table
  plugins: [
    jwt({
      jwks: {
        enabled: true,
        keyPairConfig: { alg: "RS256", use: "sig" },
        jwksPath: "/api/auth/.well-known/jwks.json" // ✅ Explicit path as per Context7
      }
    }),
  ],
  trustedOrigins: [process.env.ALLOWED_ORIGIN || "http://localhost:3000"],
});

const app = new Hono();

// 2. Setup CORS (Allow Docusaurus frontend)
app.use("/api/*", cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  credentials: true,
  allowMethods: ["POST", "GET", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// 3. Better Auth Route Handler
// This handles /api/auth/signin, /api/auth/signup, etc.
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// 4. Start Server
const port = 4000;
console.log(`🔐 Auth Server running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});