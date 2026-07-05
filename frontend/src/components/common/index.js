import React from 'react';

// ── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'Fulfilled':           { dot: '#10b981', text: '#065f46', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  dkText: '#34d399', dkBg: 'rgba(16,185,129,0.12)',  dkBorder: 'rgba(16,185,129,0.25)' },
  'Partially Fulfilled': { dot: '#f59e0b', text: '#92400e', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  dkText: '#fbbf24', dkBg: 'rgba(245,158,11,0.12)',  dkBorder: 'rgba(245,158,11,0.25)' },
  'Broken':              { dot: '#ef4444', text: '#991b1b', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   dkText: '#f87171', dkBg: 'rgba(239,68,68,0.12)',   dkBorder: 'rgba(239,68,68,0.25)'  },
  'In Progress':         { dot: '#3b82f6', text: '#1e40af', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  dkText: '#60a5fa', dkBg: 'rgba(59,130,246,0.12)',  dkBorder: 'rgba(59,130,246,0.25)' },
  'Pending':             { dot: '#9ca3af', text: '#374151', bg: 'rgba(156,163,175,0.10)', border: 'rgba(156,163,175,0.25)', dkText: '#9ca3af', dkBg: 'rgba(156,163,175,0.10)', dkBorder: 'rgba(156,163,175,0.2)' },
  'Unverifiable':        { dot: '#a855f7', text: '#6b21a8', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.25)',  dkText: '#c084fc', dkBg: 'rgba(168,85,247,0.12)',  dkBorder: 'rgba(168,85,247,0.25)' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  // detect dark mode via CSS var (simplest reliable way without context)
  const isDark = document.documentElement.classList.contains('dark');

  const textColor  = isDark ? cfg.dkText   : cfg.text;
  const bgColor    = isDark ? cfg.dkBg     : cfg.bg;
  const borderColor= isDark ? cfg.dkBorder : cfg.border;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ color: textColor, backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {status}
    </span>
  );
}

// ── LoadingSpinner ───────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-9 h-9' : 'w-6 h-6';
  return (
    <div
      className={`${dim} rounded-full animate-spin`}
      style={{ border: '2px solid var(--border-dark)', borderTopColor: 'var(--primary)' }}
    />
  );
}

// ── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#10b981', label }) {
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center text-xs mb-1.5"
          style={{ color: 'var(--text-muted)' }}>
          <span>{label}</span>
          <span className="font-medium" style={{ color: 'var(--text-soft)' }}>{value}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── CategoryBadge ─────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Agriculture:     { light: 'rgba(101,163,13,0.1)',  lText: '#3f6212',  dark: 'rgba(101,163,13,0.15)',  dText: '#a3e635'  },
  Economy:         { light: 'rgba(16,185,129,0.1)',  lText: '#065f46',  dark: 'rgba(16,185,129,0.15)',  dText: '#34d399'  },
  Defence:         { light: 'rgba(100,116,139,0.1)', lText: '#334155',  dark: 'rgba(100,116,139,0.15)', dText: '#94a3b8'  },
  Education:       { light: 'rgba(14,165,233,0.1)',  lText: '#075985',  dark: 'rgba(14,165,233,0.15)',  dText: '#38bdf8'  },
  Health:          { light: 'rgba(236,72,153,0.1)',  lText: '#9d174d',  dark: 'rgba(236,72,153,0.15)',  dText: '#f472b6'  },
  Infrastructure:  { light: 'rgba(249,115,22,0.1)',  lText: '#9a3412',  dark: 'rgba(249,115,22,0.15)',  dText: '#fb923c'  },
  Employment:      { light: 'rgba(139,92,246,0.1)',  lText: '#5b21b6',  dark: 'rgba(139,92,246,0.15)',  dText: '#a78bfa'  },
  Environment:     { light: 'rgba(20,184,166,0.1)',  lText: '#134e4a',  dark: 'rgba(20,184,166,0.15)',  dText: '#2dd4bf'  },
  'Social Welfare':{ light: 'rgba(244,63,94,0.1)',   lText: '#9f1239',  dark: 'rgba(244,63,94,0.15)',   dText: '#fb7185'  },
  Governance:      { light: 'rgba(99,102,241,0.1)',  lText: '#3730a3',  dark: 'rgba(99,102,241,0.15)',  dText: '#818cf8'  },
  Technology:      { light: 'rgba(6,182,212,0.1)',   lText: '#155e75',  dark: 'rgba(6,182,212,0.15)',   dText: '#22d3ee'  },
  Taxation:        { light: 'rgba(234,179,8,0.1)',   lText: '#713f12',  dark: 'rgba(234,179,8,0.15)',   dText: '#facc15'  },
};

export function CategoryBadge({ category }) {
  const cfg = CAT_COLORS[category];
  const isDark = document.documentElement.classList.contains('dark');

  const bg   = cfg ? (isDark ? cfg.dark  : cfg.light) : (isDark ? 'rgba(156,163,175,0.1)' : 'rgba(156,163,175,0.1)');
  const text = cfg ? (isDark ? cfg.dText : cfg.lText) : 'var(--text-muted)';

  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {category}
    </span>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
const ICONS = {
  search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  inbox: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
    </svg>
  ),
};

export function EmptyState({ icon = 'inbox', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-faint)' }}>
        {ICONS[icon] || ICONS.inbox}
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-soft)' }}>{title}</h3>
      {description && <p className="text-xs max-w-xs" style={{ color: 'var(--text-faint)' }}>{description}</p>}
    </div>
  );
}
