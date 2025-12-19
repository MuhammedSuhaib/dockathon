import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:9000", // Points to Next.js Auth Server Bcz 3000 is used by Docusaurus
});

// Export specific methods if preferred
export const { signIn, signUp, useSession } = authClient;