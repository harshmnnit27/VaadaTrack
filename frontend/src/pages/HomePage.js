import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { partyAPI, promiseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PartyCard from '../components/party/PartyCard';
import PromiseCard from '../components/promise/PromiseCard';
import { LoadingSpinner } from '../components/common';

// ── Cycling words for animated headline ──────────────────────────────────────
const CYCLE_WORDS = [
  'people',
  'democracy',
  'transparency',
  'parties',
  'accountability',
  'tracking truth',
];

// Simpler, more reliable approach: opacity + translateY via inline transition
// (avoids CSS keyframe/clip issues that caused vertical misalignment)
function AnimatedWord() {
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(true);
  const tRef                  = useRef(null);

  useEffect(() => {
    const schedule = () => {
      tRef.current = setTimeout(() => {
        setVisible(false);                           // fade + slide out
        tRef.current = setTimeout(() => {
          setIndex(i => (i + 1) % CYCLE_WORDS.length);
          setVisible(true);                          // fade + slide in
          schedule();
        }, 280);                                     // must match CSS transition
      }, 2600);                                      // word hold time
    };
    schedule();
    return () => clearTimeout(tRef.current);
  }, []); // eslint-disable-line

  return (
    <span
      style={{
        display: 'inline-block',
        verticalAlign: 'baseline',            // sit on the same baseline as surrounding text
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        // ── Sui.io-style highlight (inverted) ──
        color: 'var(--bg)',
        backgroundColor: 'var(--text)',
        borderRadius: '6px',
        padding: '0 8px 2px 8px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      {CYCLE_WORDS[index]}
    </span>
  );
}

// ── Static feature cards (admin-agnostic) ─────────────────────────────────────
const MANIFESTO_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const AI_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
    <path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07" />
  </svg>
);

const COMPARE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

// ── Feature card component ────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, link, cta = 'Learn more →', i }) {
  return (
    <Link
      to={link}
      className="card-hover block p-6 group"
      style={{ animationDelay: `${i * 60}ms` }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200"
        style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary)' }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--primary)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'var(--primary-50)';
          e.currentTarget.style.color = 'var(--primary)';
        }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      <span className="inline-block mt-4 text-xs font-medium" style={{ color: 'var(--primary)' }}>
        {cta}
      </span>
    </Link>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, isAdmin } = useAuth();

  const [parties, setParties] = useState([]);
  const [recentPromises, setRecentPromises] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      partyAPI.getAll(),
      promiseAPI.getAll({ limit: 6 }),
      promiseAPI.getStats(),
    ]).then(([p, pr, s]) => {
      setParties(p.data.slice(0, 6));
      setRecentPromises(pr.data.promises || []);
      setStats(s.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusCounts = stats?.byStatus?.reduce(
    (acc, s) => ({ ...acc, [s._id]: s.count }), {}
  ) || {};

  const statItems = [
    { label: 'Total Promises', value: stats?.total ?? '—',               color: 'var(--text)'       },
    { label: 'Fulfilled',      value: statusCounts['Fulfilled'] ?? '—',   color: '#10b981'           },
    { label: 'Broken',         value: statusCounts['Broken'] ?? '—',      color: '#ef4444'           },
    { label: 'In Progress',    value: statusCounts['In Progress'] ?? '—', color: '#3b82f6'           },
    { label: 'Pending',        value: statusCounts['Pending'] ?? '—',     color: 'var(--text-muted)' },
  ];

  // ── Feature cards — adapt based on role ──────────────────────────────────
  // Manifesto card: admin → "Upload PDF", everyone else → "Read Manifesto Summary"
  const manifestoCard = isAdmin
    ? {
        icon: MANIFESTO_ICON,
        title: 'Upload Manifestos',
        desc: 'Add election manifestos as PDFs. AI extracts and indexes all promises automatically.',
        link: '/manifestos',
        cta: 'Upload PDF →',
      }
    : {
        icon: MANIFESTO_ICON,
        title: 'Manifesto Summaries',
        desc: 'Browse AI-generated summaries of uploaded manifestos — key promises at a glance.',
        link: '/manifestos',
        cta: 'Read summaries →',
      };

  const features = [
    manifestoCard,
    {
      icon: AI_ICON,
      title: 'AI-Powered Q&A',
      desc: "Ask any question about a party's manifesto. Get answers backed by actual manifesto text.",
      link: '/chat',
      cta: 'Ask AI →',
    },
    {
      icon: COMPARE_ICON,
      title: 'Compare Parties',
      desc: 'Side-by-side comparison of parties on any topic — education, jobs, agriculture, and more.',
      link: '/compare',
      cta: 'Compare now →',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <section style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid pattern */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.5,
        }} />
        {/* Fade mask */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, var(--bg-card) 0%, transparent 40%, var(--bg-card) 100%)',
          opacity: 0.75,
        }} />

        <div style={{ position: 'relative' }} className="max-w-4xl mx-auto px-5 sm:px-6 py-20 sm:py-28 text-center">

          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium mb-7"
            style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)', color: 'var(--primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--primary)' }} />
            AI-Powered Promise Tracker
          </div>

          {/* Animated subheadline — on its own line, consistent font size */}
          <div className="mb-4 text-lg sm:text-xl font-medium" style={{ color: 'var(--text-soft)' }}>
            The new go-to place for{' '}<AnimatedWord />
          </div>

          {/* Main headline */}
          <h1
            className="font-bold leading-[1.08] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 3.5rem)', color: 'var(--text)', letterSpacing: '-0.03em' }}
          >
            Hold Politicians<br />
            <span style={{ color: 'var(--primary)' }}>Accountable.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base max-w-xl mx-auto mb-9 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            The platform India needs — search manifestos, verify promises, and find out who actually kept their word.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/parties" className="btn-primary px-5 py-2.5 text-sm">Explore Parties</Link>
            <Link to="/chat" className="btn-secondary px-5 py-2.5 text-sm">Ask AI</Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      {stats && (
        <section style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-3 sm:grid-cols-5" style={{ borderLeft: '1px solid var(--border)' }}>
              {statItems.map(item => (
                <div key={item.label} className="py-5 px-4 text-center"
                  style={{ borderRight: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold tracking-tight" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            {/* Parties */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title">Political Parties</h2>
                <Link to="/parties" className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parties.map((p, i) => (
                  <div key={p._id} className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
                    <PartyCard party={p} />
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Promises */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title">Recent Promises</h2>
                <Link to="/promises" className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPromises.map((p, i) => (
                  <div key={p._id} className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
                    <PromiseCard promise={p} />
                  </div>
                ))}
              </div>
            </section>

            {/* Feature cards — role-aware */}
            <section>
              <h2 className="section-title mb-5">What You Can Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <FeatureCard key={f.title} {...f} i={i} />
                ))}
              </div>

              {/* Admin-only upload note */}
              {!user && (
                <p className="text-xs mt-5 text-center" style={{ color: 'var(--text-faint)' }}>
                  <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
                  {' '}to unlock manifesto uploads and AI chat features.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
