import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../common';

export default function PartyCard({ party }) {
  const rate = party.fulfillmentRate || 0;
  const barColor = rate >= 60 ? 'bg-green-500' : rate >= 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Link to={`/parties/${party._id}`} className="card hover:shadow-md transition-shadow block p-5">
      <div className="flex items-start gap-3 mb-4">
        {/* Party color dot + abbreviation */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: party.color || '#1e3a5f' }}
        >
          {party.abbreviation}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{party.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{party.state} · Est. {party.founded}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{party.ideology}</p>
        </div>
      </div>

      <div className="space-y-2">
        <ProgressBar value={rate} color={barColor} label={`Fulfillment Rate`} />
        <div className="flex gap-3 text-xs text-gray-600">
          <span className="text-green-700">✅ {party.fulfilledPromises || 0}</span>
          <span className="text-yellow-700">🔶 {party.partialPromises || 0}</span>
          <span className="text-gray-600">⏳ {party.pendingPromises || 0}</span>
          <span className="text-gray-400 ml-auto">{party.totalPromises || 0} total</span>
        </div>
      </div>
    </Link>
  );
}
