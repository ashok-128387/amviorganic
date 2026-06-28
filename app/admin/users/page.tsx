'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisteredUser } from '@/lib/admin-store';
import { Trash2, Search, Users, Mail, Calendar, Download, Upload, FileUp, X } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; total: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const exportUsers = () => {
    const header = 'id,name,email,registeredAt';
    const rows = users.map(u => `"${u.id}","${u.name.replace(/"/g, '""')}","${u.email}","${u.registeredAt}"`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amvi-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const header = 'id,name,email,registeredAt';
    const example = '"u-123","Priya Sharma","priya@example.com","2024-01-15T10:00:00.000Z"';
    const blob = new Blob([`${header}\n${example}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setImportResult({ imported: 0, total: 0, errors: ['CSV file is empty or missing data'] });
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
      rows.push(row);
    }

    const res = await fetch('/api/users-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: rows }),
    });
    const data = await res.json();
    if (data.success) {
      setImportResult({ imported: data.imported, total: data.total, errors: data.errors || [] });
      await load();
      setImportFile(null);
    } else {
      setImportResult({ imported: 0, total: 0, errors: [data.error || 'Import failed'] });
    }
  };

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Registered Users</h1>
          <p className="text-sm text-gray-500">{users.length} total · {newToday} today · {thisMonth} this month</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: '#f5f2ed', color: '#1e4a2a' }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: '#1e4a2a', color: '#fff' }}>
            <Upload size={16} /> Import
          </button>
        </div>
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

      {/* Import Modal */}
      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto"
          onClick={e => e.target === e.currentTarget && setImportOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">Import Users</p>
              <button onClick={() => setImportOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-gray-500">
                Upload a CSV with columns:
                <code className="block bg-gray-50 p-2 rounded-lg mt-1 text-xs">id,name,email,registeredAt</code>
              </p>
              <p className="text-xs text-gray-500"><code>id</code> and <code>registeredAt</code> are optional. Existing emails will not be overwritten.</p>
              <button onClick={downloadTemplate}
                className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#1e4a2a' }}>
                <FileUp size={14} /> Download CSV Template
              </button>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Select CSV File</label>
                <input type="file" accept=".csv" ref={fileInputRef}
                  onChange={e => setImportFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
              </div>
              {importResult && (
                <div className={`rounded-xl p-3 text-xs ${importResult.errors.length ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
                  <p className="font-semibold">Imported {importResult.imported} of {importResult.total} users.</p>
                  {importResult.errors.length > 0 && (
                    <ul className="mt-1 space-y-0.5 list-disc pl-4">
                      {importResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                      {importResult.errors.length > 5 && <li>...and {importResult.errors.length - 5} more</li>}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setImportOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleImport} disabled={!importFile}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-50"
                style={{ background: '#1e4a2a' }}>
                Import Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
