import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">🗳️</div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>404 — Page Not Found</h1>
      <p className="mb-6" style={{ color: 'var(--text-muted)' }}>This page doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary px-6 py-2.5">← Go Home</Link>
    </div>
  );
}
