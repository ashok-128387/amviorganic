'use client';

import { useState } from 'react';

const ADMIN_PASSWORD = 'amvi@admin2024';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Manually set adminLoggedIn in localStorage so Zustand picks it up
      try {
        const stored = localStorage.getItem('amvi-admin-store-v2');
        const parsed = stored ? JSON.parse(stored) : { state: {} };
        parsed.state.adminLoggedIn = true;
        localStorage.setItem('amvi-admin-store-v2', JSON.stringify(parsed));
      } catch (_) {}
      window.location.replace('/admin');
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
      </div>
    </div>
  );
}
