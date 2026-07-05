import React, { useState, useEffect } from 'react';
import { partyAPI } from '../services/api';
import PartyCard from '../components/party/PartyCard';
import { LoadingSpinner, EmptyState } from '../components/common';

export default function PartiesPage() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);

    partyAPI
      .getAll(filter !== 'all' ? { state: filter } : {})
      .then((response) => {
        // Ensure array
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setParties(data);
      })
      .catch((error) => {
        console.error('PARTIES API ERROR:', error);
        setParties([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter]);

  const filters = [
    'all',
    'National',
    'Uttar Pradesh',
    'Delhi',
    'Maharashtra',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
          Political Parties
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Explore parties and their promise fulfillment track record
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border`}
            style={{
              backgroundColor: filter === f ? 'var(--primary)' : 'var(--bg-card)',
              color: filter === f ? '#fff' : 'var(--text-soft)',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)'
            }}
            onMouseEnter={e => { if (filter !== f) e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { if (filter !== f) e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            {f === 'all' ? 'All Parties' : f}
          </button>
        ))}
      </div>

      {/* Debug Info */}
      <div className="mb-4 text-sm" style={{ color: 'var(--text-faint)' }}>
        Parties Loaded: {parties.length}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : parties.length === 0 ? (
        <EmptyState
          icon="🏛️"
          title="No parties found"
          description="No parties have been added yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map((party) => (
            <PartyCard
              key={party._id || party.id}
              party={party}
            />
          ))}
        </div>
      )}
    </div>
  );
}