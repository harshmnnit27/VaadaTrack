import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partyAPI, promiseAPI } from '../services/api';
import PartyCard from '../components/party/PartyCard';
import PromiseCard from '../components/promise/PromiseCard';
import { LoadingSpinner } from '../components/common';

export default function HomePage() {
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

  const statusCounts = stats?.byStatus?.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}) || {};

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Hold Politicians Accountable
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Track election manifestos, verify promises, and see which parties deliver on their commitments. Powered by AI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/parties" className="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              Explore Parties
            </Link>
            <Link to="/chat" className="bg-accent text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-accent-light transition-colors">
              🤖 Ask AI
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Total Promises', value: stats.total, color: 'text-primary' },
              { label: 'Fulfilled', value: statusCounts['Fulfilled'] || 0, color: 'text-green-600' },
              { label: 'Broken', value: statusCounts['Broken'] || 0, color: 'text-red-600' },
              { label: 'In Progress', value: statusCounts['In Progress'] || 0, color: 'text-blue-600' },
              { label: 'Pending', value: statusCounts['Pending'] || 0, color: 'text-gray-600' },
            ].map(item => (
              <div key={item.label}>
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            {/* Parties */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Political Parties</h2>
                <Link to="/parties" className="text-primary text-sm font-medium hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parties.map(p => <PartyCard key={p._id} party={p} />)}
              </div>
            </section>

            {/* Recent Promises */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Promises</h2>
                <Link to="/promises" className="text-primary text-sm font-medium hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPromises.map(p => <PromiseCard key={p._id} promise={p} />)}
              </div>
            </section>

            {/* Feature cards */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What You Can Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '📄', title: 'Upload Manifestos', desc: 'Add election manifestos as PDFs. Our AI extracts and indexes all promises automatically.', link: '/manifestos' },
                  { icon: '🤖', title: 'AI-Powered Q&A', desc: 'Ask any question about a party\'s manifesto. Get answers backed by actual manifesto text (RAG).', link: '/chat' },
                  { icon: '⚖️', title: 'Compare Parties', desc: 'Side-by-side comparison of parties on any topic — education, jobs, agriculture, and more.', link: '/compare' },
                ].map(f => (
                  <Link key={f.title} to={f.link} className="card p-5 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">{f.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-600">{f.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
