import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function AuthenticatedDropdown({ onSignOut }) {
  const [open, setOpen] = useState(false);

  const name = typeof window !== 'undefined'
    ? localStorage.getItem('userName') || 'User'
    : 'User';

  return (
    <div
      className="dropdown dropdown--right dropdown--hoverable"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="navbar__link"
        style={{
          color: '#00ff41', // Matrix green
          textShadow: '0 0 8px rgba(0, 255, 65, 0.9)', // Enhanced Matrix glow
          fontWeight: 'bold',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          background: 'rgba(0, 255, 65, 0.05)',
          cursor: 'pointer',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          transition: 'all 0.3s ease',
          fontSize: '0.95rem',
          backdropFilter: 'blur(4px)'
        }}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(v => !v)}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.15)';
          e.currentTarget.style.textShadow = '0 0 12px rgba(0, 255, 65, 1)';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
          setOpen(true); // Ensure it opens on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
          e.currentTarget.style.textShadow = '0 0 8px rgba(0, 255, 65, 0.9)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {name}
      </button>

      {open && (
        <ul className="dropdown__menu"
          style={{
            backgroundColor: 'rgba(10, 15, 10, 0.97)',
            border: '1px solid #00cc44',
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 255, 65, 0.2), 0 0 10px rgba(0, 255, 65, 0.1)',
            backdropFilter: 'blur(10px)',
            minWidth: '120px',
            marginTop: '4px',
            padding: '4px 0',
            zIndex: 1000
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <li>
            <a
              className="dropdown__link"
              href="/SpecKit-Plus/"
              style={{
                color: '#00ff41',
                border: 'none',
                padding: '8px 16px',
                display: 'block',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.15)';
                e.currentTarget.style.textShadow = '0 0 5px rgba(0, 255, 65, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              Home
            </a>
          </li>
          <li>
            <button
              type="button"
              className="dropdown__link"
              onClick={onSignOut}
              style={{
                color: '#ff4d4d',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                padding: '8px 16px',
                cursor: 'pointer',
                background: 'none',
                fontSize: '0.9rem',
                display: 'block',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 77, 77, 0.15)';
                e.currentTarget.style.textShadow = '0 0 5px rgba(255, 77, 77, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function UnauthenticatedActions() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <a
        className="navbar__link"
        href="/SpecKit-Plus/signin"
        style={{
          color: '#00cc44',
          textDecoration: 'none',
          fontWeight: 'normal',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: 'inherit'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#00ff41';
          e.currentTarget.style.textShadow = '0 0 8px rgba(0, 255, 65, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#00cc44';
          e.currentTarget.style.textShadow = 'none';
        }}
      >
        Sign in
      </a>
      <a
        className="navbar__link navbar__link--active"
        href="/SpecKit-Plus/signup"
        style={{
          backgroundColor: '#00cc44',
          color: '#001a0d',
          padding: '0.3rem 0.8rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          border: '1px solid #00ff41',
          boxShadow: '0 0 8px rgba(0, 255, 65, 0.3)',
          fontSize: '0.9rem'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#00ff41';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 65, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#00cc44';
          e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.3)';
        }}
      >
        Sign up
      </a>
    </div>
  );
}

export default function CustomAuthNavbarItem() {
  const [loggedIn, setLoggedIn] = useState(() =>
    typeof window !== 'undefined' &&
    Boolean(localStorage.getItem('userName'))
  );

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    setLoggedIn(false);
  };

  return (
    <BrowserOnly>
      {() =>
        loggedIn ? (
          <AuthenticatedDropdown onSignOut={handleSignOut} />
        ) : (
          <UnauthenticatedActions />
        )
      }
    </BrowserOnly>
  );
}
