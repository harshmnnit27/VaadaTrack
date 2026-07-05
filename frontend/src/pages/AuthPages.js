import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/>
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--text)' }}>VaadaTrack</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: 'var(--text-soft)' }}>{label}</label>
      {children}
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your VaadaTrack account">
      {error && (
        <div className="text-xs rounded-lg px-3.5 py-2.5 mb-5"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup label="Email address">
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input" required />
        </FieldGroup>
        <FieldGroup label="Password">
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="input" required />
        </FieldGroup>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/register" className="font-medium" style={{ color: 'var(--primary)' }}>Create one</Link>
      </p>
    </AuthCard>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Create an account" subtitle="Join VaadaTrack to track promises">
      {error && (
        <div className="text-xs rounded-lg px-3.5 py-2.5 mb-5"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup label="Full name">
          <input placeholder="Priya Sharma" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input" required />
        </FieldGroup>
        <FieldGroup label="Email address">
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input" required />
        </FieldGroup>
        <FieldGroup label="Password">
          <input type="password" placeholder="Min. 8 characters" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="input" required />
        </FieldGroup>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-medium" style={{ color: 'var(--primary)' }}>Sign in</Link>
      </p>
    </AuthCard>
  );
}

export default LoginPage;
