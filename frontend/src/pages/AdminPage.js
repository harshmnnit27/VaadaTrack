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
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>⚙️ Admin Panel</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage parties, promises, and AI operations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px`}
            style={{
              borderColor: activeTab === t ? 'var(--primary)' : 'transparent',
              color: activeTab === t ? 'var(--primary)' : 'var(--text-muted)'
            }}
            onMouseEnter={e => { if (activeTab !== t) e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { if (activeTab !== t) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
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
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>{editId ? 'Edit Party' : 'Add New Party'}</h2>
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
              className="input" />
          ))}
          <div className="flex items-center gap-2">
            <label className="text-sm" style={{ color: 'var(--text-soft)' }}>Party Color:</label>
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              className="h-9 w-16 rounded cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
          </div>
        </div>
        <textarea placeholder="Description" rows={2} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="input mb-3" />
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
            <thead style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['Party', 'Abbreviation', 'State', 'Promises', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-soft)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {parties.map(p => (
                <tr key={p._id} className="transition-colors hover:bg-[rgba(200,225,255,0.02)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{p.abbreviation}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{p.state}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{p.totalPromises || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500 hover:underline">Delete</button>
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
  const STATUSES = ['Fulfilled', 'Partially Fulfilled', 'Pending', 'Broken'];

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
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Add Promise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <select value={form.party} onChange={e => setForm({ ...form, party: e.target.value })} className="select">
            <option value="">Select Party*</option>
            {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input placeholder="Election (e.g. Lok Sabha 2024)*" value={form.election}
            onChange={e => setForm({ ...form, election: e.target.value })} className="input" />
          <input placeholder="Promise Title*" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} className="input" />
          <input type="number" placeholder="Year" value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })} className="input" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="select">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="select">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <textarea placeholder="Full description of the promise*" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} className="input mb-3" />
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
                  <span className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{p.title}</span>
                  <StatusBadge status={p.status} />
                  <CategoryBadge category={p.category} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.party?.abbreviation} · {p.election}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={p.status} onChange={e => handleStatusChange(p._id, e.target.value)}
                  className="text-xs rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  {['Fulfilled', 'Partially Fulfilled', 'Pending', 'Broken'].map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500 hover:underline">Del</button>
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
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>🤖 AI: Extract Promises from Manifesto</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Select an indexed manifesto and let AI automatically extract and save all promises to the database.</p>

        <div className="space-y-3 mb-4">
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="select">
            <option value="">Select Manifesto</option>
            {manifestos.map(m => <option key={m._id} value={m._id}>{m.party?.name} — {m.election}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} className="select">
            <option value="">All Categories (recommended)</option>
            {['Agriculture', 'Economy', 'Education', 'Health', 'Employment', 'Infrastructure'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={handle} disabled={loading || !selectedId} className="btn-primary disabled:opacity-60 flex items-center gap-2">
          {loading ? <><LoadingSpinner size="sm" /> Extracting...</> : '🤖 Extract & Save Promises'}
        </button>

        {result && (
          <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="font-medium text-sm" style={{ color: '#10b981' }}>✅ Done! Extracted {result.extracted} promises, saved {result.created} to database.</p>
            <p className="text-xs mt-1" style={{ color: '#059669' }}>Go to the Promises tab to review and update statuses.</p>
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
      <div className="rounded-lg p-4 mb-5 text-sm border" style={{ backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)', color: 'var(--text-soft)' }}>
        <strong style={{ color: 'var(--primary)' }}>AI Promise Analyzer</strong> — Click "Analyze" on any promise to let AI determine fulfillment status based on the evidence attached. Add evidence URLs first for best results.
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {promises.map(p => (
            <div key={p._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{p.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.party?.abbreviation} · {p.election} · <StatusBadge status={p.status} /></p>
                  {results[p._id] && !results[p._id].error && (
                    <p className="text-xs mt-2 rounded p-2" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-soft)' }}>{results[p._id].analysis}</p>
                  )}
                  {results[p._id]?.error && <p className="text-xs text-red-500 mt-1">{results[p._id].error}</p>}
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
