import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, CategoryBadge } from '../common';

export default function PromiseCard({ promise }) {
  return (
    <Link to={`/promises/${promise._id}`} className="card hover:shadow-md transition-shadow block p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1">{promise.title}</h3>
        <StatusBadge status={promise.status} />
      </div>

      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{promise.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={promise.category} />
          {promise.party && (
            <span
              className="px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: promise.party.color || '#1e3a5f' }}
            >
              {promise.party.abbreviation}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{promise.election}</span>
      </div>

      {promise.verificationScore > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          AI Confidence: {promise.verificationScore}%
        </div>
      )}
    </Link>
  );
}
