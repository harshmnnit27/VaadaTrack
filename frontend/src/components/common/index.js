import React from 'react';

export function StatusBadge({ status }) {
  const classes = {
    'Fulfilled': 'bg-green-100 text-green-800',
    'Partially Fulfilled': 'bg-yellow-100 text-yellow-800',
    'Broken': 'bg-red-100 text-red-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-gray-100 text-gray-700',
    'Unverifiable': 'bg-purple-100 text-purple-800',
  };
  const icons = {
    'Fulfilled': '✅', 'Partially Fulfilled': '🔶', 'Broken': '❌',
    'In Progress': '🔄', 'Pending': '⏳', 'Unverifiable': '❓'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-600'}`}>
      {icons[status]} {status}
    </span>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div className={`${s} border-2 border-primary border-t-transparent rounded-full animate-spin`} />
  );
}

export function ProgressBar({ value, color = 'bg-green-500', label }) {
  return (
    <div>
      {label && <div className="flex justify-between text-xs text-gray-600 mb-1"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function CategoryBadge({ category }) {
  const colors = {
    'Agriculture': 'bg-lime-100 text-lime-800',
    'Economy': 'bg-emerald-100 text-emerald-800',
    'Defence': 'bg-slate-100 text-slate-800',
    'Education': 'bg-sky-100 text-sky-800',
    'Health': 'bg-pink-100 text-pink-800',
    'Infrastructure': 'bg-orange-100 text-orange-800',
    'Employment': 'bg-violet-100 text-violet-800',
    'Environment': 'bg-teal-100 text-teal-800',
    'Social Welfare': 'bg-rose-100 text-rose-800',
    'Governance': 'bg-indigo-100 text-indigo-800',
    'Technology': 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-600'}`}>
      {category}
    </span>
  );
}

export function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}
