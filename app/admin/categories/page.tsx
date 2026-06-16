'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, X, Check, Pencil, GripVertical } from 'lucide-react';

interface Category {
  name: string;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [reassignTo, setReassignTo] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/categories-get')
      .then(r => r.json())
      .then(({ categories: c }) => {
        if (c) setCategories(c);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const saveOrder = async (list: Category[]) => {
    await fetch('/api/category-reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: list.map(c => c.name) }),
    });
  };

  const move = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setCategories(reordered);
    saveOrder(reordered);
  };

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await fetch('/api/category-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName: trimmed, sortOrder: categories.length }),
    });
    setNewName('');
    load();
  };

  const handleRename = async (oldName: string) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === oldName) {
      setEditing(null);
      return;
    }
    await fetch('/api/category-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName, newName: trimmed }),
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (name: string) => {
    await fetch('/api/category-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, reassignTo: reassignTo.trim() || undefined }),
    });
    setDeleteConfirm(null);
    setReassignTo('');
    load();
  };

  if (loading) {
    return <div className="text-sm text-gray-500 py-10">Loading categories...</div>;
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500">Reorder, rename, add or delete product categories</p>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-xs font-semibold text-gray-600 mb-2">Add New Category</label>
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
            placeholder="e.g. Gift Packs" />
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: '#1e4a2a' }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Categories ({categories.length})</p>
          <p className="text-xs text-gray-400">Use arrows to reorder</p>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
              <GripVertical size={16} className="text-gray-300" />
              <span className="text-xs text-gray-400 w-6">{i + 1}</span>

              {editing === cat.name ? (
                <input value={editValue} onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRename(cat.name); if (e.key === 'Escape') setEditing(null); }}
                  autoFocus
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
              ) : (
                <span className="flex-1 font-medium text-sm text-gray-800">{cat.name}</span>
              )}

              <div className="flex items-center gap-1">
                {editing === cat.name ? (
                  <>
                    <button onClick={() => handleRename(cat.name)} className="p-1.5 rounded-lg hover:bg-green-50 transition">
                      <Check size={14} className="text-green-600" />
                    </button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                      <X size={14} className="text-gray-400" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => move(i, 'up')} disabled={i === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30" title="Move up">
                      <ArrowUp size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => move(i, 'down')} disabled={i === categories.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30" title="Move down">
                      <ArrowDown size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => { setEditing(cat.name); setEditValue(cat.name); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition" title="Rename">
                      <Pencil size={14} className="text-blue-500" />
                    </button>
                    {deleteConfirm === cat.name ? (
                      <div className="flex items-center gap-1 ml-1">
                        <button onClick={() => handleDelete(cat.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"><Check size={14} className="text-red-500" /></button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X size={14} className="text-gray-400" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(cat.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition" title="Delete">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No categories found.</p>
          )}
        </div>
      </div>

      {/* Delete confirmation panel */}
      {deleteConfirm && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-amber-900 mb-2">Delete category &quot;{deleteConfirm}&quot;?</p>
          <p className="text-xs text-amber-800 mb-3">Products in this category will be reassigned. Leave blank to move them to &quot;Uncategorized&quot;.</p>
          <div className="flex gap-2">
            <input value={reassignTo} onChange={e => setReassignTo(e.target.value)}
              placeholder="Reassign products to category"
              className="flex-1 border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
            <button onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition">Delete</button>
            <button onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
