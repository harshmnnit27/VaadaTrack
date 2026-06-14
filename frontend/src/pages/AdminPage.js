import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { partyAPI, promiseAPI, aiAPI, manifestoAPI } from '../services/api';
import { LoadingSpinner, StatusBadge, CategoryBadge } from '../components/common';

const TABS = ['parties', 'promises', 'extract-ai', 'analyze-ai'];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('parties');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (!isAdmin) navigate('/');
  }, [user, isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">⚙️ Admin Panel</h1>
        <p className="text-gray-600 text-sm">Manage parties, promises, and AI operations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === t ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}>
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'parties' && <ManageParties />}
      {activeTab === 'promises' && <ManagePromises />}
      {activeTab === 'extract-ai' && <ExtractPromises />}
      {activeTab === 'analyze-ai' && <AnalyzePromises />}
    </div>
  );
}

/* ── Manage Parties ── */
function ManageParties() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', abbreviation: '', founded: '', ideology: '', color: '#1e3a5f', state: 'National', description: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    partyAPI.getAll().then(r => setParties(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await partyAPI.update(editId, form);
      else await partyAPI.create(form);
      setForm({ name: '', abbreviation: '', founded: '', ideology: '', color: '#1e3a5f', state: 'National', description: '' });
      setEditId(null);
      load();
    } catch (e) { alert(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, abbreviation: p.abbreviation, founded: p.founded || '', ideology: p.ideology || '', color: p.color || '#1e3a5f', state: p.state || 'National', description: p.description || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this party?')) return;
    await partyAPI.delete(id);
    load();
  };

  return (
    <div>
      {/* Form */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">{editId ? 'Edit Party' : 'Add New Party'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          {[
            { key: 'name', placeholder: 'Full Party Name*' },
            { key: 'abbreviation', placeholder: 'Abbreviation (BJP, INC)*' },
            { key: 'founded', placeholder: 'Founded Year' },
            { key: 'ideology', placeholder: 'Ideology' },
            { key: 'state', placeholder: 'State (or National)' },
          ].map(f => (
            <input key={f.key} placeholder={f.placeholder} value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          ))}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Party Color:</label>
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              className="h-9 w-16 rounded border border-gray-200 cursor-pointer" />
          </div>
        </div>
        <textarea placeholder="Description" rows={2} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || !form.name || !form.abbreviation} className="btn-primary disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update Party' : 'Add Party'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ name: '', abbreviation: '', founded: '', ideology: '', color: '#1e3a5f', state: 'National', description: '' }); }} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      {/* List */}
      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Party', 'Abbreviation', 'State', 'Promises', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parties.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.abbreviation}</td>
                  <td className="px-4 py-3 text-gray-600">{p.state}</td>
                  <td className="px-4 py-3 text-gray-600">{p.totalPromises || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-xs text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Manage Promises ── */
function ManagePromises() {
  const [promises, setPromises] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ party: '', election: '', year: new Date().getFullYear(), title: '', description: '', category: 'Other', status: 'Pending' });
  const [saving, setSaving] = useState(false);

  const CATEGORIES = ['Agriculture', 'Economy', 'Defence', 'Education', 'Health', 'Infrastructure', 'Employment', 'Environment', 'Social Welfare', 'Taxation', 'Governance', 'Technology', 'Other'];
  const STATUSES = ['Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending', 'Unverifiable'];

  const load = () => {
    setLoading(true);
    Promise.all([promiseAPI.getAll({ limit: 50 }), partyAPI.getAll()])
      .then(([pr, pa]) => { setPromises(pr.data.promises || []); setParties(pa.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async () => {
    if (!form.party || !form.title || !form.description || !form.election) return alert('Fill required fields');
    setSaving(true);
    try {
      await promiseAPI.create({ ...form, year: parseInt(form.year) });
      setForm({ party: '', election: '', year: new Date().getFullYear(), title: '', description: '', category: 'Other', status: 'Pending' });
      load();
    } catch (e) { alert(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    await promiseAPI.update(id, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promise?')) return;
    await promiseAPI.delete(id);
    load();
  };

  return (
    <div>
      {/* Add form */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Add Promise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <select value={form.party} onChange={e => setForm({ ...form, party: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">Select Party*</option>
            {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input placeholder="Election (e.g. Lok Sabha 2024)*" value={form.election}
            onChange={e => setForm({ ...form, election: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <input placeholder="Promise Title*" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <input type="number" placeholder="Year" value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <textarea placeholder="Full description of the promise*" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : 'Add Promise'}
        </button>
      </div>

      {/* List */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {promises.map(p => (
            <div key={p._id} className="card p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-sm text-gray-900 truncate">{p.title}</span>
                  <StatusBadge status={p.status} />
                  <CategoryBadge category={p.category} />
                </div>
                <p className="text-xs text-gray-500">{p.party?.abbreviation} · {p.election}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={p.status} onChange={e => handleStatusChange(p._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none">
                  {['Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending', 'Unverifiable'].map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => handleDelete(p._id)} className="text-xs text-red-600 hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AI: Extract Promises from Manifesto ── */
function ExtractPromises() {
  const [manifestos, setManifestos] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    manifestoAPI.getAll().then(r => setManifestos(r.data.filter(m => m.status === 'indexed'))).catch(() => {});
  }, []);

  const handle = async () => {
    if (!selectedId) return alert('Select a manifesto');
    setLoading(true); setResult(null);
    try {
      const { data } = await aiAPI.extractPromises(selectedId, category || undefined);
      setResult(data);
    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">🤖 AI: Extract Promises from Manifesto</h2>
        <p className="text-sm text-gray-600 mb-4">Select an indexed manifesto and let AI automatically extract and save all promises to the database.</p>

        <div className="space-y-3 mb-4">
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">Select Manifesto</option>
            {manifestos.map(m => <option key={m._id} value={m._id}>{m.party?.name} — {m.election}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">All Categories (recommended)</option>
            {['Agriculture', 'Economy', 'Education', 'Health', 'Employment', 'Infrastructure'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={handle} disabled={loading || !selectedId} className="btn-primary disabled:opacity-60 flex items-center gap-2">
          {loading ? <><LoadingSpinner size="sm" /> Extracting...</> : '🤖 Extract & Save Promises'}
        </button>

        {result && (
          <div className="mt-4 bg-green-50 rounded-lg p-4">
            <p className="text-green-800 font-medium text-sm">✅ Done! Extracted {result.extracted} promises, saved {result.created} to database.</p>
            <p className="text-green-700 text-xs mt-1">Go to the Promises tab to review and update statuses.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── AI: Bulk Analyze Promises ── */
function AnalyzePromises() {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    promiseAPI.getAll({ limit: 30 }).then(r => setPromises(r.data.promises || [])).finally(() => setLoading(false));
  }, []);

  const analyze = async (id) => {
    setAnalyzing(prev => ({ ...prev, [id]: true }));
    try {
      const { data } = await aiAPI.analyzePromise(id);
      setResults(prev => ({ ...prev, [id]: data }));
      setPromises(prev => prev.map(p => p._id === id ? { ...p, status: data.status, aiAnalysis: data.analysis } : p));
    } catch (e) {
      setResults(prev => ({ ...prev, [id]: { error: e.message } }));
    } finally {
      setAnalyzing(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-sm text-blue-800">
        <strong>AI Promise Analyzer</strong> — Click "Analyze" on any promise to let AI determine fulfillment status based on the evidence attached. Add evidence URLs first for best results.
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {promises.map(p => (
            <div key={p._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.party?.abbreviation} · {p.election} · <StatusBadge status={p.status} /></p>
                  {results[p._id] && !results[p._id].error && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded p-2">{results[p._id].analysis}</p>
                  )}
                  {results[p._id]?.error && <p className="text-xs text-red-600 mt-1">{results[p._id].error}</p>}
                </div>
                <button onClick={() => analyze(p._id)} disabled={analyzing[p._id]}
                  className="text-xs btn-primary flex-shrink-0 disabled:opacity-60 flex items-center gap-1">
                  {analyzing[p._id] ? <><LoadingSpinner size="sm" /> ...</> : '🤖 Analyze'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
