import React, { useState, useEffect, useCallback } from 'react';
import { promiseAPI, partyAPI } from '../services/api';
import PromiseCard from '../components/promise/PromiseCard';
import { LoadingSpinner, EmptyState } from '../components/common';

const CATEGORIES = ['Agriculture', 'Economy', 'Defence', 'Education', 'Health', 'Infrastructure', 'Employment', 'Environment', 'Social Welfare', 'Taxation', 'Governance', 'Technology'];
const STATUSES = ['Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending'];

export default function PromisesPage() {
  const [promises, setPromises] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ party: '', category: '', status: '', search: '' });

  const fetchPromises = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 18, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await promiseAPI.getAll(params);
      setPromises(data.promises || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchPromises(); }, [fetchPromises]);
  useEffect(() => { partyAPI.getAll().then(r => setParties(r.data)).catch(() => {}); }, []);

  const setFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Election Promises</h1>
        <p className="text-gray-600 text-sm">{total} promises tracked</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search promises..."
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <select value={filters.party} onChange={e => setFilter('party', e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
          <option value="">All Parties</option>
          {parties.map(p => <option key={p._id} value={p._id}>{p.abbreviation}</option>)}
        </select>
        <select value={filters.category} onChange={e => setFilter('category', e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : promises.length === 0 ? (
        <EmptyState icon="📋" title="No promises found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promises.map(p => <PromiseCard key={p._id} promise={p} />)}
          </div>

          {/* Pagination */}
          {total > 18 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-40 hover:border-primary">
                ← Prev
              </button>
              <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 18)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 18)}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-40 hover:border-primary">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
