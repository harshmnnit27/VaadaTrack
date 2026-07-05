import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, CategoryBadge } from '../common';

export default function PromiseCard({ promise }) {
  return (
    <Link to={`/promises/${promise._id}`} className="card-hover block p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-sm leading-snug flex-1" style={{ color: 'var(--text)' }}>
          {promise.title}
        </h3>
        <StatusBadge status={promise.status} />
      </div>

      {/* Description */}
      <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {promise.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge category={promise.category} />
          {promise.party && (
            <span
              className="px-2 py-0.5 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: promise.party.color || 'var(--primary)' }}
            >
              {promise.party.abbreviation}
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{promise.election}</span>
      </div>

      {/* AI confidence */}
      {promise.verificationScore > 0 && (
        <div className="mt-3 pt-3 flex items-center gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary)', opacity: 0.6 }} />
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            AI confidence: {promise.verificationScore}%
          </span>
        </div>
      )}
    </Link>
  );
}
