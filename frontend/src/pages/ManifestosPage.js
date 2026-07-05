import React, { useState, useEffect } from 'react';
import { manifestoAPI, partyAPI, aiAPI } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/common';
import { useAuth } from '../context/AuthContext';

export default function ManifestosPage() {
  const { isAdmin } = useAuth();
  const [manifestos, setManifestos] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);

  // Upload form
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ partyId: '', election: '', year: '', electionType: 'Lok Sabha', text: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([manifestoAPI.getAll(), partyAPI.getAll()])
      .then(([m, p]) => { setManifestos(m.data || []); setParties(p.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getPartyName = (m) => {
    const partyId = m.party?._id || m.party;
    const found = parties.find(p => p._id === partyId);
    return found?.name || `Unknown (${partyId})`;
  };

  const handleAsk = async () => {
    if (!selected || !query.trim()) return;
    setAsking(true);
    setAnswer(null);
    try {
      const { data } = await aiAPI.askManifesto(selected._id, query);
      setAnswer(data);
    } catch (e) { setAnswer({ answer: 'Error: ' + e.message }); }
    finally { setAsking(false); }
  };

  const handleUploadText = async () => {
    if (!form.partyId || !form.election || !form.year || !form.text) return alert('Fill all fields');
    setUploading(true);
    try {
      await manifestoAPI.addText(form);
      alert('Manifesto submitted! Processing in background...');
      setShowUpload(false);
      // Refresh
      const { data } = await manifestoAPI.getAll();
      setManifestos(data);
    } catch (e) { alert('Upload failed: ' + e.response?.data?.message || e.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Election Manifestos</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload manifestos, then ask AI questions using RAG</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowUpload(!showUpload)} className="btn-primary">
            + Add Manifesto
          </button>
        )}
      </div>

      {/* Upload form */}
      {showUpload && isAdmin && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Add Manifesto Text</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <select value={form.partyId} onChange={e => setForm({ ...form, partyId: e.target.value })} className="select">
              <option value="">Select Party</option>
              {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input placeholder="Election (e.g. Lok Sabha 2024)" value={form.election}
              onChange={e => setForm({ ...form, election: e.target.value })} className="input" />
            <input placeholder="Year (e.g. 2024)" value={form.year} type="number"
              onChange={e => setForm({ ...form, year: e.target.value })} className="input" />
            <select value={form.electionType} onChange={e => setForm({ ...form, electionType: e.target.value })} className="select">
              {['Lok Sabha', 'State Assembly', 'Local Body'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <textarea rows={6} placeholder="Paste manifesto text here..." value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })} className="input mb-3" />
          <div className="flex gap-2">
            <button onClick={handleUploadText} disabled={uploading} className="btn-primary disabled:opacity-60">
              {uploading ? 'Submitting...' : 'Submit & Process'}
            </button>
            <button onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manifesto list */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Manifestos ({manifestos.length})</h2>
          {loading ? <LoadingSpinner /> :
            manifestos.length === 0 ? <EmptyState icon="📄" title="No manifestos yet" /> :
              <div className="space-y-2">
                {manifestos.map(m => (
                  <button key={m._id} onClick={() => { setSelected(m); setAnswer(null); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors`}
                    style={{
                      borderColor: selected?._id === m._id ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: selected?._id === m._id ? 'var(--primary-50)' : 'var(--bg-card)'
                    }}>
                    <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{getPartyName(m)} — {m.election}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <span>{m.electionType}</span>
                      <span className="px-1.5 rounded" style={{
                        backgroundColor: m.status === 'indexed' ? 'rgba(16,185,129,0.1)' : m.status === 'processing' ? 'rgba(234,179,8,0.1)' : 'var(--bg-muted)',
                        color: m.status === 'indexed' ? '#10b981' : m.status === 'processing' ? '#eab308' : 'var(--text-soft)'
                      }}>
                        {m.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
          }
        </div>

        {/* RAG Q&A panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-5">
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                📄 {getPartyName(selected)} — {selected.election}
              </h2>
              {selected.summary && (
                <p className="text-sm mb-4 leading-relaxed border-l-2 pl-3" style={{ color: 'var(--text-soft)', borderColor: 'var(--primary)' }}>{selected.summary}</p>
              )}

              {selected.status === 'indexed' ? (
                <>
                  <h3 className="font-medium text-sm mb-2" style={{ color: 'var(--text)' }}>🤖 Ask AI about this manifesto</h3>
                  <div className="flex gap-2 mb-4">
                    <input value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAsk()}
                      placeholder="e.g. What promises were made about jobs?"
                      className="input flex-1" />
                    <button onClick={handleAsk} disabled={asking || !query.trim()} className="btn-primary disabled:opacity-60">
                      {asking ? <LoadingSpinner size="sm" /> : 'Ask'}
                    </button>
                  </div>

                  {/* Suggested */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {['What are the main economic promises?', 'What was promised for farmers?', 'Healthcare commitments?'].map(q => (
                      <button key={q} onClick={() => setQuery(q)}
                        className="text-xs px-2 py-1 border rounded-full transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        {q}
                      </button>
                    ))}
                  </div>

                  {answer && (
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--primary-50)' }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text)' }}>Answer:</h4>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-soft)' }}>{answer.answer}</p>
                      {answer.sources?.length > 0 && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Relevant manifesto sections:</p>
                          {answer.sources.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-xs italic" style={{ color: 'var(--text-faint)' }}>"{s.text}..."</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg p-4 text-sm border" style={{ backgroundColor: 'rgba(234,179,8,0.05)', color: '#ca8a04', borderColor: 'rgba(234,179,8,0.2)' }}>
                  ⚠️ This manifesto is still being processed. Status: <strong>{selected.status}</strong>. Try again in a moment.
                </div>
              )}
            </div>
          ) : (
            <div className="card p-10 text-center" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-3">👈</div>
              <p className="text-sm">Select a manifesto to read its summary and ask AI questions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
