import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../common';

export default function PartyCard({ party }) {
  const rate = party.fulfillmentRate || 0;
  const barColor = rate >= 60 ? '#10b981' : rate >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <Link to={`/parties/${party._id}`} className="card-hover block p-5 group">
      <div className="flex items-start gap-3.5 mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
          style={{ backgroundColor: party.color || 'var(--primary)' }}
        >
          {party.abbreviation}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>{party.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
            {party.state} · Est. {party.founded}
          </p>
          {party.ideology && (
            <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {party.ideology}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar value={rate} color={barColor} label="Fulfillment Rate" />

        <div className="flex items-center gap-0 text-xs">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-l-md border"
            style={{ color: '#059669', backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-500" />
            {party.fulfilledPromises || 0}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 border-y"
            style={{ color: '#d97706', backgroundColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block bg-amber-400" />
            {party.partialPromises || 0}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-r-md border"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--border-dark)' }} />
            {party.pendingPromises || 0}
          </span>
          <span className="ml-auto text-xs" style={{ color: 'var(--text-faint)' }}>
            {party.totalPromises || 0} total
          </span>
        </div>
      </div>
    </Link>
  );
}
