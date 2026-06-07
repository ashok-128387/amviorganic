'use client';

import { useState } from 'react';
import { useAdminStore } from '@/lib/admin-store';

export default function AdminLoginPage() {
  const adminLogin = useAdminStore((s) => s.adminLogin);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = adminLogin(password);
    if (ok) {
      setTimeout(() => { window.location.replace('/admin'); }, 150);
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0f2d18,#1e4a2a)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-2xl font-extrabold" style={{ color: '#1e4a2a' }}>AMVI Organics</p>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition"
            style={{ background: '#1e4a2a' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
            Login
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Default password: amvi@admin2024</p>
      </div>
    </div>
  );
}
