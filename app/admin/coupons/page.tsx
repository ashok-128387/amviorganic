'use client';

import { useState, useEffect } from 'react';
import { Coupon } from '@/lib/admin-store';
import { Plus, X, Trash2, Pencil } from 'lucide-react';

const EMPTY: Omit<Coupon, 'id' | 'usedCount'> = {
  code: '', type: 'percent', value: 10, minOrder: 300,
  maxUses: 100, active: true,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/coupons-get').then(r => r.json()).then(({ coupons: c }) => { if (c) setCoupons(c); });
  }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setShowForm(true); };
  const openEdit = (c: Coupon) => {
    setForm({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, maxUses: c.maxUses, active: c.active, expiresAt: c.expiresAt.slice(0, 10) });
    setEditId(c.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) return;
    const coupon: Coupon = {
      ...form, code: form.code.toUpperCase(),
      id: editId ?? `cp-${Date.now()}`,
      usedCount: editId ? (coupons.find(c => c.id === editId)?.usedCount ?? 0) : 0,
      expiresAt: new Date(form.expiresAt).toISOString(),
    };
    await fetch('/api/coupon-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(coupon) });
    const { coupons: updated } = await fetch('/api/coupons-get').then(r => r.json());
    if (updated) setCoupons(updated);
    setShowForm(false);
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">{coupons.length} coupons · {coupons.filter(c => c.active).length} active</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
          style={{ background: '#1e4a2a' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Code', 'Discount', 'Min Order', 'Usage', 'Expires', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => {
                const expired = isExpired(c.expiresAt);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-sm" style={{ color: '#1e4a2a' }}>{c.code}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#c8922a' }}>
                      {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">₹{c.minOrder}</td>
                    <td className="px-4 py-3 text-gray-600">{c.usedCount} / {c.maxUses}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <span className={expired ? 'text-red-400' : ''}>{new Date(c.expiresAt).toLocaleDateString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={async () => { const updated = { ...c, active: !c.active }; await fetch('/api/coupon-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }); setCoupons(cs => cs.map(x => x.id === c.id ? updated : x)); }}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition"
                        style={{ background: (c.active && !expired) ? '#1e4a2a18' : '#f3f4f6', color: (c.active && !expired) ? '#1e4a2a' : '#9ca3af' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: (c.active && !expired) ? '#1e4a2a' : '#9ca3af' }} />
                        {c.active && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 transition">
                          <Pencil size={14} className="text-blue-500" />
                        </button>
                        {deleteConfirm === c.id ? (
                          <div className="flex gap-1">
                            <button onClick={async () => { await fetch('/api/coupon-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id }) }); setCoupons(cs => cs.filter(x => x.id !== c.id)); setDeleteConfirm(null); }}
                              className="px-2 py-1 text-xs rounded bg-red-50 text-red-500 hover:bg-red-100">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-500 hover:bg-gray-200">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">{editId ? 'Edit Coupon' : 'Add Coupon'}</p>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="AMVI10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'percent' | 'flat' }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {form.type === 'percent' ? 'Discount %' : 'Discount ₹'}
                  </label>
                  <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order (₹)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expires On</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600">Active</label>
                <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className="w-10 h-5 rounded-full transition-colors relative"
                  style={{ background: form.active ? '#1e4a2a' : '#d1d5db' }}>
                  <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                    style={{ left: form.active ? '22px' : '2px' }} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
                style={{ background: '#1e4a2a' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                {editId ? 'Save Changes' : 'Add Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
