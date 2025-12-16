import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000", // Points to Hono Auth Server
});

// Export specific methods if preferred
export const { signIn, signUp, useSession } = authClient;