import React, { useEffect, useState, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';
import { createAuthClient } from 'better-auth/client';

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

type Session = {
  user: SessionUser;
};

const auth = createAuthClient({
  baseURL: 'https://better-auth-neon-db.vercel.app',
});

/* ---------- Authenticated ---------- */

interface AuthenticatedProps {
  session: Session;
  onSignOut: () => Promise<void>;
}

function AuthenticatedDropdown({
  session,
  onSignOut,
}: AuthenticatedProps) {
  const [open, setOpen] = useState(false);

  const displayName =
    session.user.name ??
    session.user.email?.split('@')[0] ??
    'User';

  return (
    <div className="dropdown dropdown--right dropdown--hoverable">
      <button
        type="button"
        className="navbar__link"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(v => !v)}
      >
        {displayName}
      </button>

      {open && (
        <ul className="dropdown__menu">
          <li>
            <a className="dropdown__link" href="/">
              Home
            </a>
          </li>
          <li>
            <button
              type="button"
              className="dropdown__link"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/* ---------- Unauthenticated ---------- */

function UnauthenticatedActions() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <a className="navbar__link" href="/SpecKit-Plus/signin">
        Sign in
      </a>
      <a
        className="navbar__link navbar__link--active"
        href="/SpecKit-Plus/signup"
      >
        Sign up
      </a>
    </div>
  );
}

/* ---------- Main ---------- */

export default function CustomAuthNavbarItem() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadSession = useCallback(async () => {
    try {
      const result = await auth.getSession();
      if (result?.data?.session) {
        setSession(result.data);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession, location.pathname]);

  const handleSignOut = async () => {
    await auth.signOut();
    await loadSession();
  };

  if (loading) {
    return <span className="navbar__link">Loading…</span>;
  }

  return (
    <BrowserOnly>
      {() =>
        session ? (
          <AuthenticatedDropdown
            session={session}
            onSignOut={handleSignOut}
          />
        ) : (
          <UnauthenticatedActions />
        )
      }
    </BrowserOnly>
  );
}
