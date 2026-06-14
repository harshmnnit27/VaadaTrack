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
        console.log('=== PARTIES API RESPONSE ===');
        console.log(response);
        console.log('=== PARTIES DATA ===');
        console.log(response.data);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Political Parties
        </h1>
        <p className="text-gray-600 text-sm">
          Explore parties and their promise fulfillment track record
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
            }`}
          >
            {f === 'all' ? 'All Parties' : f}
          </button>
        ))}
      </div>

      {/* Debug Info */}
      <div className="mb-4 text-sm text-gray-500">
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