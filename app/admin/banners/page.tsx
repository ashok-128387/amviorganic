'use client';

import { useState, useEffect, useRef } from 'react';
import { uploadImage } from '@/lib/upload';
import { X, Plus, Save, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/banners-get')
      .then(r => r.json())
      .then(({ banners: b }) => {
        if (b && b.length > 0) setBanners(b);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/banners-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners: banners.filter(Boolean) }),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(data.success ? 'Banners saved successfully.' : (data.error || 'Failed to save banners.'));
  };

  const handleFileUpload = async (file: File, index: number) => {
    const url = await uploadImage(file);
    if (!url) return;
    setBanners(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const addBanner = () => {
    const url = newUrl.trim();
    if (!url) return;
    setBanners(prev => [...prev, url]);
    setNewUrl('');
  };

  const removeBanner = (index: number) => {
    setBanners(prev => prev.filter((_, i) => i !== index));
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    const next = [...banners];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setBanners(next);
  };

  if (loading) return <div className="text-sm text-gray-500 py-10">Loading banners...</div>;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Homepage Banners</h1>
        <p className="text-sm text-gray-500">Add, replace, reorder or remove website banner images.</p>
        <p className="text-xs text-gray-400 mt-1">
          Recommended: 1920 × 540 px (or 16:9 to 3.5:1 ratio), max 1 MB, WebP or JPEG for best quality.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Banners ({banners.length})</p>
          <p className="text-xs text-gray-400">First banner is shown initially</p>
        </div>
        <div className="divide-y divide-gray-50">
          {banners.map((src, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="text-xs text-gray-400 w-6">{i + 1}</div>
              <div className="relative w-24 h-16 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                {src ? (
                  <img src={src} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-300" /></div>
                )}
              </div>
              <input
                value={src}
                onChange={e => setBanners(prev => prev.map((s, idx) => idx === i ? e.target.value : s))}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                placeholder="/path/to/banner.png or image URL"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={el => { fileRefs.current[i] = el; }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, i); }}
              />
              <button onClick={() => fileRefs.current[i]?.click()}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition"
                style={{ background: '#f5f2ed', color: '#1e4a2a' }}>
                Upload
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => moveBanner(i, 'up')} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={14} className="text-gray-500" /></button>
                <button onClick={() => moveBanner(i, 'down')} disabled={i === banners.length - 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={14} className="text-gray-500" /></button>
              </div>
              <button onClick={() => removeBanner(i)} className="p-1.5 rounded-lg hover:bg-red-50"><X size={16} className="text-red-400" /></button>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No banners configured.</p>
          )}
        </div>
      </div>

      {/* Add new banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-xs font-semibold text-gray-600 mb-2">Add Banner</label>
        <div className="flex gap-2">
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addBanner()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
            placeholder="Paste image URL or upload below"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="new-banner-upload"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f).then(url => { if (url) setNewUrl(url); }); }}
          />
          <button onClick={() => document.getElementById('new-banner-upload')?.click()}
            className="px-3 py-2 rounded-lg text-xs font-semibold transition"
            style={{ background: '#f5f2ed', color: '#1e4a2a' }}>
            Upload
          </button>
          <button onClick={addBanner}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: '#1e4a2a' }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ background: '#1e4a2a' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Banners'}
        </button>
        {message && (
          <p className={`text-xs ${message.includes('success') ? 'text-green-700' : 'text-red-600'}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
