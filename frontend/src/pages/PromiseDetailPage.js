import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { promiseAPI, aiAPI } from '../services/api';
import { StatusBadge, CategoryBadge, LoadingSpinner } from '../components/common';
import { useAuth } from '../context/AuthContext';

export default function PromiseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [promise, setPromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    promiseAPI.getById(id)
      .then(r => setPromise(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data } = await aiAPI.analyzePromise(id);
      setPromise(prev => ({ ...prev, status: data.status, aiAnalysis: data.analysis, verificationScore: data.score }));
    } catch (e) { alert('Analysis failed: ' + e.message); }
    finally { setAnalyzing(false); }
  };

  const handleVote = async (type) => {
    if (!user) return alert('Login to vote');
    if (voted) return alert('Already voted');
    try {
      const { data } = await promiseAPI.vote(id, type);
      setPromise(prev => ({ ...prev, upvotes: data.upvotes, downvotes: data.downvotes, status: data.status }));
      setVoted(true);
    } catch (e) { alert(e.response?.data?.message || 'Vote failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!promise) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Promise not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/promises" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--primary)' }}>← Back to Promises</Link>

      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold flex-1" style={{ color: 'var(--text)' }}>{promise.title}</h1>
          <StatusBadge status={promise.status} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <CategoryBadge category={promise.category} />
          {promise.party && (
            <span className="px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: promise.party.color || 'var(--primary)' }}>
              {promise.party.name}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-soft)' }}>
            {promise.election}
          </span>
        </div>

        <p className="leading-relaxed" style={{ color: 'var(--text-soft)' }}>{promise.description}</p>

        {promise.verificationScore > 0 && (
          <div className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            AI Confidence: <span className="font-medium" style={{ color: 'var(--primary)' }}>{promise.verificationScore}%</span>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ color: 'var(--text)' }}>🤖 AI Analysis</h2>
          {user && (
            <button onClick={handleAnalyze} disabled={analyzing}
              className="text-xs btn-primary flex items-center gap-1 disabled:opacity-60">
              {analyzing ? <><LoadingSpinner size="sm" /> Analyzing...</> : 'Re-analyze'}
            </button>
          )}
        </div>
        {promise.aiAnalysis ? (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{promise.aiAnalysis}</p>
        ) : (
          <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No AI analysis yet. {user ? 'Click Re-analyze to generate.' : 'Login to trigger analysis.'}</p>
        )}
      </div>

      {/* Evidence */}
      {promise.evidence?.length > 0 && (
        <div className="card p-5 mb-4">
          <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>📰 Evidence</h2>
          <div className="space-y-3">
            {promise.evidence.map((e, i) => (
              <div key={i} className="border-l-2 pl-3" style={{ borderColor: 'var(--primary)' }}>
                <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{e.title}</div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{e.description}</p>
                {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>{e.source || 'Source'} →</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Community Verdict</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => handleVote('up')} disabled={voted}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-[rgba(16,185,129,0.05)] disabled:opacity-50 text-sm"
            style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}>
            👍 Fulfilled &nbsp;{promise.upvotes || 0}
          </button>
          <button onClick={() => handleVote('down')} disabled={voted}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-[rgba(239,68,68,0.05)] disabled:opacity-50 text-sm"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            👎 Not Fulfilled &nbsp;{promise.downvotes || 0}
          </button>
        </div>
        {!user && <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>Login to vote</p>}
      </div>
    </div>
  );
}
