'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/lib/admin-store';
import { Pencil, Trash2, Plus, X, Eye, EyeOff, Upload } from 'lucide-react';

const EMPTY: Omit<BlogPost, 'id' | 'createdAt'> = {
  title: '', slug: '', excerpt: '', content: '', image: '', author: 'AMVI Organics Team', published: true,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
    const { url } = await res.json();
    if (url) setForm(f => ({ ...f, image: url }));
    setUploading(false);
  };

  useEffect(() => {
    fetch('/api/blogs-get').then(r => r.json()).then(({ blogs: b }) => { if (b) setBlogs(b); });
  }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setShowForm(true); };
  const openEdit = (b: BlogPost) => {
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, image: b.image, author: b.author, published: b.published });
    setEditId(b.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const slug = form.slug || slugify(form.title);
    const blog: BlogPost = editId
      ? { ...blogs.find(b => b.id === editId)!, ...form, slug }
      : { ...form, slug, id: `b-${Date.now()}`, createdAt: new Date().toISOString() };
    await fetch('/api/blog-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blog) });
    const { blogs: updated } = await fetch('/api/blogs-get').then(r => r.json());
    if (updated) setBlogs(updated);
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500">{blogs.length} posts · {blogs.filter(b => b.published).length} published</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
          style={{ background: '#1e4a2a' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {b.image && <img src={b.image} alt={b.title} className="w-full h-36 object-cover" />}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm leading-snug flex-1">{b.title}</p>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${b.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 flex-1">{b.excerpt}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                <button onClick={async () => { const updated = { ...b, published: !b.published }; await fetch('/api/blog-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }); setBlogs(bs => bs.map(x => x.id === b.id ? updated : x)); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                  style={{ background: b.published ? '#f5f2ed' : '#1e4a2a18', color: b.published ? '#555' : '#1e4a2a' }}>
                  {b.published ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                </button>
                <button onClick={() => openEdit(b)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 transition hover:bg-blue-100">
                  <Pencil size={12} /> Edit
                </button>
                {deleteConfirm === b.id ? (
                  <>
                    <button onClick={async () => { await fetch('/api/blog-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id }) }); setBlogs(bs => bs.filter(x => x.id !== b.id)); setDeleteConfirm(null); }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition">Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(b.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-400 hover:bg-red-100 transition ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">{editId ? 'Edit Blog Post' : 'New Blog Post'}</p>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                  <input value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="Blog post title" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="auto-generated" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cover Image</label>
                <div className="flex gap-2 items-center">
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="/uploads/image.png or paste URL" />
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition flex-shrink-0"
                    style={{ background: '#1e4a2a' }}>
                    <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                {form.image && <img src={form.image} className="mt-2 h-20 rounded-lg object-cover border border-gray-100" onError={e => (e.currentTarget.style.display = 'none')} alt="preview" />}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none"
                  placeholder="Short summary shown on blog listing..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Content (Markdown supported)</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={8} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none font-mono"
                  placeholder="Full blog content..." />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Author</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <label className="text-xs font-semibold text-gray-600">Published</label>
                  <button onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className="w-10 h-5 rounded-full transition-colors relative"
                    style={{ background: form.published ? '#1e4a2a' : '#d1d5db' }}>
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                      style={{ left: form.published ? '22px' : '2px' }} />
                  </button>
                </div>
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
                {editId ? 'Save Changes' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
