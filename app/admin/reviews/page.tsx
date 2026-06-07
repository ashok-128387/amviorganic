'use client';

import { useState, useEffect } from 'react';
import { useAdminStore, ProductReview } from '@/lib/admin-store';
import { Trash2, Check, Star, Plus, X, Save, Edit2 } from 'lucide-react';

const FILTERS = ['all', 'pending', 'approved'] as const;

const EMPTY_FORM = { customerName: '', email: '', productName: '', rating: 5, title: '', comment: '' };

export default function AdminReviewsPage() {
  const { reviews, approveReview, deleteReview, addReview, updateReview } = useAdminStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
  }, []);
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState<Partial<ProductReview>>({});

  const filtered = reviews.filter((r) => {
    if (filter === 'approved') return r.approved;
    if (filter === 'pending') return !r.approved;
    return true;
  });
  const pending = reviews.filter((r) => !r.approved).length;

  const handleAdd = () => {
    if (!form.customerName || !form.productName || !form.comment) return;
    addReview({
      id: `rev-${Date.now()}`,
      productId: products?.find((p: any) => p.name === form.productName)?.id ?? 'custom',
      productName: form.productName,
      customerName: form.customerName,
      email: form.email,
      rating: form.rating,
      title: form.title,
      comment: form.comment,
      approved: false,
      createdAt: new Date().toISOString(),
    });
    setForm(EMPTY_FORM);
    setShowAdd(false);
  };

  const startEdit = (r: ProductReview) => {
    setEditId(r.id);
    setEditForm({ customerName: r.customerName, email: r.email, rating: r.rating, title: r.title, comment: r.comment });
  };

  const saveEdit = () => {
    if (!editId) return;
    updateReview(editId, editForm);
    setEditId(null);
  };

  const productNames = products?.map((p: any) => p.name) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500">{reviews.length} total · {pending} pending approval</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#1e4a2a' }}>
          <Plus size={15} /> Add Review
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition"
            style={{ background: filter === f ? '#1e4a2a' : '#f5f2ed', color: filter === f ? '#fff' : '#555' }}>
            {f === 'all' ? `All (${reviews.length})` : f === 'pending' ? `Pending (${pending})` : `Approved (${reviews.filter((r) => r.approved).length})`}
          </button>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Review</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                placeholder="Customer Name *" className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email" type="email" className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />

              {/* Product name — datalist for quick pick */}
              <div className="col-span-2">
                <input value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                  list="product-list" placeholder="Product Name *"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                <datalist id="product-list">
                  {productNames.map((n: string) => <option key={n} value={n} />)}
                </datalist>
              </div>

              {/* Star rating picker */}
              <div className="col-span-2 flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-600 mr-2">Rating</span>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                    <Star size={20} className={s <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>

              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Review Title" className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
              <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Review Comment *" rows={3}
                className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none" />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600">Cancel</button>
              <button onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#1e4a2a' }}>Add Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-semibold">No {filter !== 'all' ? filter : ''} reviews</p>
          </div>
        )}

        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#1e4a2a,#c8922a)' }}>
                {r.customerName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.customerName}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Product + Stars */}
                <div className="flex items-center gap-3 mt-2 mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#1e4a2a18', color: '#1e4a2a' }}>{r.productName}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>

                {/* Inline edit mode */}
                {editId === r.id ? (
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-1 items-center">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, rating: s }))}>
                          <Star size={16} className={s <= (editForm.rating ?? r.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        </button>
                      ))}
                    </div>
                    <input value={editForm.title ?? ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Title" />
                    <textarea value={editForm.comment ?? ''} onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none" rows={2} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: '#1e4a2a' }}>
                        <Save size={12} /> Save
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{r.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </>
                )}

                {/* Actions */}
                {editId !== r.id && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    <button onClick={() => approveReview(r.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{ background: r.approved ? '#f5f2ed' : '#1e4a2a18', color: r.approved ? '#888' : '#1e4a2a' }}>
                      <Check size={12} />
                      {r.approved ? 'Unapprove' : 'Approve'}
                    </button>

                    <button onClick={() => startEdit(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                      <Edit2 size={12} /> Edit
                    </button>

                    {deleteConfirm === r.id ? (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-gray-500 mr-1">Delete?</span>
                        <button onClick={() => { deleteReview(r.id); setDeleteConfirm(null); }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-400 hover:bg-red-100 transition ml-auto">
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
