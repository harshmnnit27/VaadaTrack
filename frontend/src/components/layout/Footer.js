import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Explore: [
    { to: '/parties',    label: 'Parties' },
    { to: '/promises',   label: 'Promises' },
    { to: '/manifestos', label: 'Manifestos' },
    { to: '/compare',    label: 'Compare' },
  ],
  'AI Features': [
    { to: '/chat',       label: 'AI Chat' },
    { to: '/manifestos', label: 'Ask Manifesto' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/>
                </svg>
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>VaadaTrack</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: 'var(--text-muted)' }}>
              Hold political parties accountable. Track election promises, verify fulfillment, demand transparency.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text)' }}>
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-8 pt-5 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          <span>© {new Date().getFullYear()} VaadaTrack — Built for transparency in Indian democracy</span>
          <span>Open source · Non-partisan</span>
        </div>
      </div>
    </footer>
  );
}
