import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Login to VaadaTrack</p>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded px-3 py-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" required />
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Create Account</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Join VaadaTrack</p>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded px-3 py-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" required />
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
