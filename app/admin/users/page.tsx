'use client';

import { useState, useEffect } from 'react';
import { RegisteredUser } from '@/lib/admin-store';
import { Trash2, Search, Users, Mail, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () =>
    fetch('/api/users-get')
      .then(r => r.json())
      .then(({ users: data }) => {
        if (data) setUsers(data);
      });

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/user-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await load();
    setDeleteConfirm(null);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const today = new Date().toDateString();
  const newToday = users.filter(u => new Date(u.registeredAt).toDateString() === today).length;
  const thisMonth = users.filter(u => {
    const d = new Date(u.registeredAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Registered Users</h1>
        <p className="text-sm text-gray-500">{users.length} total · {newToday} today · {thisMonth} this month</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: '#1e4a2a' },
          { label: 'New Today', value: newToday, color: '#c8922a' },
          { label: 'This Month', value: thisMonth, color: '#2a6b3e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Users size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-green-700 transition">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 text-sm outline-none bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{search ? 'No users match your search' : 'No users registered yet'}</p>
          <p className="text-xs mt-1">Users will appear here after they sign up via OTP login</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['User', 'Email', 'Registered', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    {/* Avatar + Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#1e4a2a,#c8922a)' }}>
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Mail size={13} className="text-gray-400 flex-shrink-0" />
                        {u.email}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                        {new Date(u.registeredAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {deleteConfirm === u.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 mr-1">Delete?</span>
                          <button onClick={() => handleDelete(u.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(u.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-400 hover:bg-red-100 transition">
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
