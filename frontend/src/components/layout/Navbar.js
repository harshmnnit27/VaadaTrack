import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/parties', label: 'Parties' },
    { to: '/promises', label: 'Promises' },
    { to: '/manifestos', label: 'Manifestos' },
    { to: '/compare', label: 'Compare' },
    { to: '/chat', label: '🤖 AI Chat' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white text-xl font-bold tracking-tight">
              🗳️ VaadaTrack
            </span>
            <span className="hidden sm:block text-blue-300 text-xs">Promise Tracker</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary-light text-white'
                    : 'text-blue-200 hover:text-white hover:bg-primary-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-yellow-300 text-sm hover:text-yellow-100 px-2">
                    ⚙️ Admin
                  </Link>
                )}
                <span className="text-blue-200 text-sm">{user.name}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="text-blue-300 hover:text-white text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-200 hover:text-white text-sm px-3 py-1.5">Login</Link>
                <Link to="/register" className="bg-accent text-white text-sm px-3 py-1.5 rounded-md hover:bg-accent-light">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-primary-light">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-blue-200 hover:text-white text-sm">
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-blue-300 text-sm">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-blue-200 text-sm">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-blue-200 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
