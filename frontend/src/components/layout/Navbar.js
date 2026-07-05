import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/parties',    label: 'Parties' },
    { to: '/promises',   label: 'Promises' },
    { to: '/manifestos', label: 'Manifestos' },
    { to: '/compare',    label: 'Compare' },
    { to: '/chat',       label: 'AI Chat' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-shadow duration-200"
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/>
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight leading-none" style={{ color: 'var(--text)' }}>
              VaadaTrack
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive(link.to) ? 'var(--text)' : 'var(--text-muted)',
                  backgroundColor: isActive(link.to) ? 'var(--bg-muted)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right — theme toggle + auth */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Toggle theme"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: 'var(--accent)', backgroundColor: 'var(--primary-50)' }}
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm px-1" style={{ color: 'var(--text-muted)' }}>{user.name}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs py-1.5 px-3">Log in</Link>
                <Link to="/register" className="btn-primary text-xs py-1.5 px-3.5">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + burger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle theme"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-200 ease-in-out"
          style={{ maxHeight: menuOpen ? '360px' : '0', opacity: menuOpen ? 1 : 0 }}
        >
          <div className="pt-3 pb-4 space-y-0.5" style={{ borderTop: `1px solid var(--border)` }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.to) ? 'var(--text)' : 'var(--text-muted)',
                  backgroundColor: isActive(link.to) ? 'var(--bg-muted)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-1.5" style={{ borderTop: `1px solid var(--border)`, marginTop: '8px' }}>
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3 py-2 text-sm font-medium"
                      style={{ color: 'var(--accent)' }}>
                      Admin Panel
                    </Link>
                  )}
                  <span className="px-3 py-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>{user.name}</span>
                  <button
                    onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                    className="btn-secondary w-full text-sm"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost w-full text-sm">Log in</Link>
                  <Link to="/register" className="btn-primary w-full text-sm">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
