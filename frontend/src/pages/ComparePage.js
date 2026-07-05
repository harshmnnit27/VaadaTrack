import React, { useState, useEffect } from 'react';
import { partyAPI, manifestoAPI, aiAPI } from '../services/api';
import { LoadingSpinner, ProgressBar } from '../components/common';

export default function ComparePage() {
  const [parties, setParties] = useState([]);
  const [manifestos, setManifestos] = useState([]);
  const [sel1, setSel1] = useState('');
  const [sel2, setSel2] = useState('');
  const [manifesto1, setManifesto1] = useState('');
  const [manifesto2, setManifesto2] = useState('');
  const [topic, setTopic] = useState('');
  const [comparison, setComparison] = useState('');
  const [loading, setLoading] = useState(false);
  const [partyData1, setPartyData1] = useState(null);
  const [partyData2, setPartyData2] = useState(null);

  useEffect(() => {
    Promise.all([partyAPI.getAll(), manifestoAPI.getAll()])
      .then(([p, m]) => { setParties(p.data); setManifestos(m.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (sel1) partyAPI.getById(sel1).then(r => setPartyData1(r.data)).catch(() => {});
    else setPartyData1(null);
  }, [sel1]);

  useEffect(() => {
    if (sel2) partyAPI.getById(sel2).then(r => setPartyData2(r.data)).catch(() => {});
    else setPartyData2(null);
  }, [sel2]);

  const getManifestosFor = (partyId) =>
    manifestos.filter(m => (m.party?._id || m.party) === partyId && m.status === 'indexed');

  const handleCompare = async () => {
    if (!manifesto1 || !manifesto2 || !topic.trim()) return alert('Select both manifestos and enter a topic');
    setLoading(true);
    setComparison('');
    try {
      const { data } = await aiAPI.compareManifestos(manifesto1, manifesto2, topic);
      setComparison(data.comparison);
    } catch (e) { setComparison('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const StatBox = ({ party, data }) => {
    if (!data) return <div className="card p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Select a party</div>;
    const rate = data.fulfillmentRate || 0;
    const color = rate >= 60 ? '#10b981' : rate >= 30 ? '#f59e0b' : '#ef4444';
    return (
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: party.color || 'var(--primary)' }}>
            {party.abbreviation}
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{party.name}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.stats?.total || 0} promises tracked</div>
          </div>
        </div>
        <ProgressBar value={rate} color={color} label="Fulfillment Rate" />
        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
          <div className="rounded p-1.5" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <div className="font-bold" style={{ color: '#10b981' }}>{data.stats?.fulfilled || 0}</div>
            <div style={{ color: '#059669' }}>Done</div>
          </div>
          <div className="rounded p-1.5" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
            <div className="font-bold" style={{ color: '#f59e0b' }}>{data.stats?.partial || 0}</div>
            <div style={{ color: '#d97706' }}>Partial</div>
          </div>
          <div className="rounded p-1.5" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
            <div className="font-bold" style={{ color: '#ef4444' }}>{data.stats?.broken || 0}</div>
            <div style={{ color: '#b91c1c' }}>Broken</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Compare Parties</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Side-by-side comparison of parties and their manifestos</p>
      </div>

      {/* Party selector */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { val: sel1, set: setSel1, mVal: manifesto1, setM: setManifesto1, data: partyData1 },
          { val: sel2, set: setSel2, mVal: manifesto2, setM: setManifesto2, data: partyData2 },
        ].map((item, i) => (
          <div key={i}>
            <select value={item.val} onChange={e => item.set(e.target.value)} className="select mb-2 w-full">
              <option value="">Select Party {i + 1}</option>
              {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            {item.val && (
              <select value={item.mVal} onChange={e => item.setM(e.target.value)} className="select w-full">
                <option value="">Select manifesto (for AI)</option>
                {getManifestosFor(item.val).map(m => (
                  <option key={m._id} value={m._id}>{m.election}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Stats comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatBox party={parties.find(p => p._id === sel1) || {}} data={partyData1} />
        <StatBox party={parties.find(p => p._id === sel2) || {}} data={partyData2} />
      </div>

      {/* AI comparison */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>🤖 AI Manifesto Comparison</h2>
        <div className="flex gap-2 mb-3">
          <input value={topic} onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCompare()}
            placeholder="Topic to compare (e.g. education, jobs, agriculture)"
            className="input flex-1" />
          <button onClick={handleCompare} disabled={loading || !manifesto1 || !manifesto2}
            className="btn-primary disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm" /> : 'Compare'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Education', 'Employment', 'Agriculture', 'Healthcare', 'Infrastructure'].map(t => (
            <button key={t} onClick={() => setTopic(t)} className="text-xs px-2 py-1 border rounded-full transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              {t}
            </button>
          ))}
        </div>
        {(!manifesto1 || !manifesto2) && (
          <p className="text-xs" style={{ color: '#d97706' }}>⚠️ Select indexed manifestos for both parties to use AI comparison</p>
        )}
        {comparison && (
          <div className="rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed mt-4" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text)' }}>
            {comparison}
          </div>
        )}
      </div>
    </div>
  );
}
