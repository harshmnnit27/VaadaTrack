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
  const [uploadMethod, setUploadMethod] = useState('text');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    Promise.all([manifestoAPI.getAll(), partyAPI.getAll()])
      .then(([m, p]) => { setManifestos(m.data || []); setParties(p.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  console.log(parties)

  // const getPartyName = (m) => parties.find(p => p._id === (m.party?._id || m.party))?.name || '?';

  const getPartyName = (m) => {
  const partyId = m.party?._id || m.party;
  const found = parties.find(p => p._id === partyId);
  
  // Debug log
  if (!found) {
    console.warn(`Party ID ${partyId} not found in parties list:`, parties.map(p => p._id));
  }
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      setSelectedFile(null);
      e.target.value = null; // reset
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadPDF = async () => {
    if (!form.partyId || !form.election || !form.year || !selectedFile) return alert('Fill all fields and select a PDF');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('partyId', form.partyId);
      formData.append('election', form.election);
      formData.append('year', form.year);
      formData.append('electionType', form.electionType);
      formData.append('pdf', selectedFile);

      await manifestoAPI.uploadPDF(formData);
      alert('Manifesto PDF submitted! Processing in background...');
      setShowUpload(false);
      setSelectedFile(null);
      // Refresh
      const { data } = await manifestoAPI.getAll();
      setManifestos(data);
    } catch (e) { alert('Upload failed: ' + (e.response?.data?.message || e.message)); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Election Manifestos</h1>
          <p className="text-gray-600 text-sm">Upload manifestos, then ask AI questions using RAG</p>
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
          <h2 className="font-semibold text-gray-900 mb-4">Add Manifesto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <select value={form.partyId} onChange={e => setForm({ ...form, partyId: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-sm">
              <option value="">Select Party</option>
              {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input placeholder="Election (e.g. Lok Sabha 2024)" value={form.election}
              onChange={e => setForm({ ...form, election: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-sm" />
            <input placeholder="Year (e.g. 2024)" value={form.year} type="number"
              onChange={e => setForm({ ...form, year: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-sm" />
            <select value={form.electionType} onChange={e => setForm({ ...form, electionType: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-sm">
              {['Lok Sabha', 'State Assembly', 'Local Body'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          
          {/* Toggle */}
          <div className="flex gap-4 mb-3 border-b border-gray-100 pb-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name="uploadMethod" checked={uploadMethod === 'text'} onChange={() => setUploadMethod('text')} className="accent-primary" />
              Paste Text
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name="uploadMethod" checked={uploadMethod === 'pdf'} onChange={() => setUploadMethod('pdf')} className="accent-primary" />
              Upload PDF
            </label>
          </div>

          {uploadMethod === 'text' ? (
            <textarea rows={6} placeholder="Paste manifesto text here..." value={form.text}
              onChange={e => setForm({ ...form, text: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center mb-3 bg-gray-50">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
              <label htmlFor="pdf-upload" className="cursor-pointer btn-secondary text-sm mb-2">
                Choose PDF file
              </label>
              {selectedFile ? (
                <p className="text-sm text-gray-700">Selected: <span className="font-semibold text-primary">{selectedFile.name}</span></p>
              ) : (
                <p className="text-sm text-gray-500">No file selected (PDF only)</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={uploadMethod === 'text' ? handleUploadText : handleUploadPDF} disabled={uploading} className="btn-primary disabled:opacity-60">
              {uploading ? 'Submitting...' : 'Submit & Process'}
            </button>
            <button onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manifesto list */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-3">Manifestos ({manifestos.length})</h2>
          {loading ? <LoadingSpinner /> :
            manifestos.length === 0 ? <EmptyState icon="📄" title="No manifestos yet" /> :
              <div className="space-y-2">
                {manifestos.map(m => (
                  <button key={m._id} onClick={() => { setSelected(m); setAnswer(null); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selected?._id === m._id ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white hover:border-primary'}`}>
                    <div className="font-medium text-sm text-gray-900">{getPartyName(m)} — {m.election}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>{m.electionType}</span>
                      <span className={`px-1.5 rounded ${m.status === 'indexed' ? 'bg-green-100 text-green-700' : m.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
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
              <h2 className="font-semibold text-gray-900 mb-1">
                📄 {getPartyName(selected)} — {selected.election}
              </h2>
              {selected.summary && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed border-l-2 border-primary pl-3">{selected.summary}</p>
              )}

              {selected.status === 'indexed' ? (
                <>
                  <h3 className="font-medium text-sm text-gray-800 mb-2">🤖 Ask AI about this manifesto</h3>
                  <div className="flex gap-2 mb-4">
                    <input value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAsk()}
                      placeholder="e.g. What promises were made about jobs?"
                      className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    <button onClick={handleAsk} disabled={asking || !query.trim()} className="btn-primary disabled:opacity-60">
                      {asking ? <LoadingSpinner size="sm" /> : 'Ask'}
                    </button>
                  </div>

                  {/* Suggested */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {['What are the main economic promises?', 'What was promised for farmers?', 'Healthcare commitments?'].map(q => (
                      <button key={q} onClick={() => setQuery(q)} className="text-xs px-2 py-1 border border-gray-200 rounded-full text-gray-600 hover:border-primary hover:text-primary">
                        {q}
                      </button>
                    ))}
                  </div>

                  {answer && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Answer:</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer.answer}</p>
                      {answer.sources?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">Relevant manifesto sections:</p>
                          {answer.sources.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-xs text-gray-500 italic">"{s.text}..."</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
                  ⚠️ This manifesto is still being processed. Status: <strong>{selected.status}</strong>. Try again in a moment.
                </div>
              )}
            </div>
          ) : (
            <div className="card p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-sm">Select a manifesto to read its summary and ask AI questions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
