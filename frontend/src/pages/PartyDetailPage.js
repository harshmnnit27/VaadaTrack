import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { partyAPI, promiseAPI, manifestoAPI } from '../services/api';
import PromiseCard from '../components/promise/PromiseCard';
import { LoadingSpinner, ProgressBar } from '../components/common';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PartyDetailPage() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [promises, setPromises] = useState([]);
  const [manifestos, setManifestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    Promise.all([
      partyAPI.getById(id),
      promiseAPI.getAll({ party: id, limit: 50 }),
      manifestoAPI.getAll({ party: id }),
    ]).then(([p, pr, m]) => {
      setParty(p.data);
      setPromises(pr.data.promises || []);
      setManifestos(m.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!party) return <div className="text-center py-20 text-gray-500">Party not found</div>;

  const stats = party.stats || {};
  const doughnutData = {
    labels: ['Fulfilled', 'Partial', 'Broken', 'In Progress', 'Pending'],
    datasets: [{
      data: [stats.fulfilled || 0, stats.partial || 0, stats.broken || 0, stats.inProgress || 0, stats.pending || 0],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#9ca3af'],
      borderWidth: 2,
    }]
  };

  const categories = Object.entries(party.categoryBreakdown || {});
  const barData = {
    labels: categories.map(([k]) => k),
    datasets: [{
      label: 'Promises',
      data: categories.map(([, v]) => v),
      backgroundColor: '#1e3a5f',
      borderRadius: 4,
    }]
  };

  const filteredPromises = statusFilter
    ? promises.filter(p => p.status === statusFilter)
    : promises;

  const tabs = ['overview', 'promises', 'manifestos'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Party header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: party.color || '#1e3a5f' }}
          >
            {party.abbreviation}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{party.name}</h1>
            <p className="text-gray-500 text-sm">{party.ideology} · {party.state} · Founded {party.founded}</p>
            <p className="text-gray-700 text-sm mt-2">{party.description}</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold text-primary">{party.fulfillmentRate}%</div>
            <div className="text-xs text-gray-500">Fulfillment Rate</div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ProgressBar value={Math.round(((stats.fulfilled || 0) / (stats.total || 1)) * 100)} color="bg-green-500" label="Fulfilled" />
          <ProgressBar value={Math.round(((stats.broken || 0) / (stats.total || 1)) * 100)} color="bg-red-500" label="Broken" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === t ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}>
            {t} {t === 'promises' && `(${promises.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Promise Status</h3>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Promises by Category</h3>
            <Bar data={barData} options={{
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }} />
          </div>
        </div>
      )}

      {activeTab === 'promises' && (
        <div>
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {['', 'Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPromises.map(p => <PromiseCard key={p._id} promise={p} />)}
          </div>
        </div>
      )}

      {activeTab === 'manifestos' && (
        <div className="space-y-3">
          {manifestos.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No manifestos uploaded yet.</p>
          ) : manifestos.map(m => (
            <div key={m._id} className="card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{m.election}</h3>
                <p className="text-sm text-gray-500">{m.electionType} · {m.year} · Status: {m.status}</p>
                {m.summary && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{m.summary}</p>}
              </div>
              <Link to={`/manifestos`} className="text-primary text-sm hover:underline ml-4 flex-shrink-0">
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
