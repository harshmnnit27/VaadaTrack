import React, { useState, useEffect, useCallback } from 'react';
import { promiseAPI, partyAPI } from '../services/api';
import PromiseCard from '../components/promise/PromiseCard';
import { LoadingSpinner, EmptyState } from '../components/common';

const CATEGORIES = ['Agriculture', 'Economy', 'Defence', 'Education', 'Health', 'Infrastructure', 'Employment', 'Environment', 'Social Welfare', 'Taxation', 'Governance', 'Technology'];
const STATUSES   = ['Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending'];

export default function PromisesPage() {
  const [promises, setPromises] = useState([]);
  const [parties,  setParties]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [filters,  setFilters]  = useState({ party: '', category: '', status: '', search: '' });

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

  const setFilter = (key, value) => { setFilters(f => ({ ...f, [key]: value })); setPage(1); };
  const totalPages = Math.ceil(total / 18);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-9" style={{ minHeight: '80vh' }}>
      <div className="page-header">
        <h1>Election Promises</h1>
        <p>{total > 0 ? `${total} promises tracked` : 'Loading…'}</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-faint)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search promises…" value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="input pl-9" />
          </div>
          <select value={filters.party}    onChange={e => setFilter('party',    e.target.value)} className="select">
            <option value="">All Parties</option>
            {parties.map(p => <option key={p._id} value={p._id}>{p.abbreviation} — {p.name}</option>)}
          </select>
          <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className="select">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filters.status}   onChange={e => setFilter('status',   e.target.value)} className="select">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : promises.length === 0 ? (
        <EmptyState icon="search" title="No promises found" description="Try adjusting your filters or search term." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promises.map((p, i) => (
              <div key={p._id} className="card-enter" style={{ animationDelay: `${i * 25}ms` }}>
                <PromiseCard promise={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-10">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: page === p ? 'var(--text)' : 'transparent',
                    color: page === p ? 'var(--bg)' : 'var(--text-muted)',
                  }}>
                  {p}
                </button>
              ))}
              {totalPages > 7 && <span className="text-xs px-1" style={{ color: 'var(--text-faint)' }}>…</span>}
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
