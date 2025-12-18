import { FormEvent, useState } from "react";
import { createAuthClient } from "better-auth/client";

const auth = createAuthClient({
  baseURL: "https://better-auth-neon-db.vercel.app",
});

export default function SigninPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await auth.signIn.email({ email, password });
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        title="Email address"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        title="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Sign In</button>
    </form>
  );
}
