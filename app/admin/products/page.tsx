'use client';

import { useState, useRef, useEffect } from 'react';
import { AdminProduct } from '@/lib/admin-store';
import { Pencil, Trash2, Plus, X, Check, Upload, ImageIcon, FileUp, Download, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { uploadImage } from '@/lib/upload';

const DEFAULT_CATEGORIES = ['Sweeteners', 'Combo Deals', 'New'];

const EMPTY: Omit<AdminProduct, 'id' | 'createdAt'> = {
  name: '', description: '', category: 'Sweeteners', image: '', images: [],
  rating: 5, reviewCount: 0, sku: '',
  variations: [{ id: '', productId: '', name: '250G', price: 0, stock: 0 }],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imgTab, setImgTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCatInput, setNewCatInput] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () =>
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => {
      if (p) setProducts(p);
    });

  const loadCategories = () =>
    fetch('/api/categories-get').then(r => r.json()).then(({ categories: c }) => {
      if (c?.length) setCategories(c.map((cat: any) => cat.name));
    });

  const addCategory = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    await fetch('/api/category-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName: trimmed, sortOrder: categories.length }),
    });
    setCategories(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    setForm(f => ({ ...f, category: trimmed }));
    setNewCatInput('');
  };

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setImgTab('upload'); setShowForm(true); };
  const openEdit = (p: AdminProduct) => {
    // Pad images array to 5 slots, use main image as first if images is empty
    const existingImages = p.images?.length ? [...p.images] : [p.image || ''];
    while (existingImages.length < 5) existingImages.push('');
    setForm({ name: p.name, description: p.description, category: p.category, sku: p.sku || '', image: p.image, images: existingImages, rating: p.rating, reviewCount: p.reviewCount, variations: p.variations });
    setEditId(p.id); setImgTab('upload');
    setShowForm(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm(f => ({ ...f, image: url, images: [url, ...f.images.slice(1)] }));
  };

  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(uploadImage));
    if (urls.length) setForm(f => ({ ...f, image: urls[0], images: urls }));
  };

  const handleCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    setForm(f => {
      const imgs = [...(f.images.length ? f.images : Array(5).fill(''))];
      while (imgs.length < 5) imgs.push('');
      imgs[index] = url;
      return { ...f, images: imgs, image: imgs.find(u => u) || f.image };
    });
  };

  const removeCarouselImage = (index: number) => {
    setForm(f => {
      const imgs = [...f.images];
      imgs[index] = '';
      return { ...f, images: imgs, image: imgs.find(u => u) || '' };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const id = editId ?? `p-${Date.now()}`;
    const product: AdminProduct = {
      ...form, id,
      image: form.image || '',
      variations: form.variations.map((v, i) => ({ ...v, id: v.id || `v-${id}-${i}`, productId: id })),
      createdAt: new Date(),
    };
    await fetch('/api/product-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...product, createdAt: product.createdAt.toISOString() }) });
    await loadProducts();
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/product-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const moveProduct = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    const reordered = [...products];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setProducts(reordered);
    await fetch('/api/products-reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: reordered.map(p => ({ id: p.id })) }),
    });
  };

  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; total: number; errors: string[] } | null>(null);

  const downloadTemplate = () => {
    const header = 'name,description,category,sku,image,images,variations';
    const example = '"Jaggery Cubes","Pure organic jaggery cubes","Sweeteners","AMVI-101","/image.jpg","/image.jpg,/image2.jpg","[{\"name\":\"250G\",\"price\":230,\"stock\":80}]"';
    const blob = new Blob([`${header}\n${example}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importFile) return;
    const formData = new FormData();
    formData.append('file', importFile);
    const res = await fetch('/api/products-import', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      setImportResult({ imported: data.imported, total: data.total, errors: data.errors || [] });
      await loadProducts();
      await loadCategories();
      setImportFile(null);
    } else {
      setImportResult({ imported: 0, total: 0, errors: [data.error || 'Import failed'] });
    }
  };

  const updateVariation = (i: number, field: string, val: string | number) =>
    setForm(f => ({ ...f, variations: f.variations.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }));
  const addVariation = () =>
    setForm(f => ({ ...f, variations: [...f.variations, { id: '', productId: '', name: '', price: 0, stock: 0 }] }));
  const removeVariation = (i: number) =>
    setForm(f => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: '#f5f2ed', color: '#1e4a2a' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e8e0d5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f5f2ed')}>
            <FileUp size={16} /> Bulk Import
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: '#1e4a2a' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Image', 'Name', 'Category', 'Variants', 'Price From', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px]">
                    <p className="truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate">{p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: p.category === 'Sweeteners' ? '#1e4a2a18' : p.category === 'New' ? '#dcfce718' : '#c8922a18',
                        color: p.category === 'Sweeteners' ? '#1e4a2a' : p.category === 'New' ? '#15803d' : '#c8922a'
                      }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.variations.length} variant{p.variations.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1e4a2a' }}>
                    ₹{Math.min(...p.variations.map(v => v.price)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveProduct(i, 'up')} disabled={i === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30" title="Move up">
                        <ArrowUp size={14} className="text-gray-500" />
                      </button>
                      <button onClick={() => moveProduct(i, 'down')} disabled={i === products.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30" title="Move down">
                        <ArrowDown size={14} className="text-gray-500" />
                      </button>
                      <span className="w-px h-4 bg-gray-200 mx-1" />
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 transition">
                        <Pencil size={15} className="text-blue-500" />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition"><Check size={15} className="text-red-500" /></button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X size={15} className="text-gray-400" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition">
                          <Trash2 size={15} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">{editId ? 'Edit Product' : 'Add Product'}</p>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[72vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="e.g. Jaggery Cubes" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
                <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="e.g. AMVI-001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                {/* Existing category chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {categories.map(cat => (
                    <button key={cat} type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition"
                      style={{
                        background: form.category === cat ? '#1e4a2a' : '#fff',
                        color: form.category === cat ? '#fff' : '#1e4a2a',
                        borderColor: '#1e4a2a',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
                {/* Add new category */}
                <div className="flex gap-2 items-center">
                  <input
                    value={newCatInput}
                    onChange={e => setNewCatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory(newCatInput); } }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="Type new category & press Enter" />
                  <button type="button" onClick={() => addCategory(newCatInput)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition"
                    style={{ background: '#1e4a2a' }}>
                    + Add
                  </button>
                </div>
                {form.category && (
                  <p className="text-xs mt-1.5" style={{ color: '#888' }}>
                    Selected: <strong style={{ color: '#1e4a2a' }}>{form.category}</strong>
                    {' · '}
                    <a href={`/products?category=${encodeURIComponent(form.category)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="underline" style={{ color: '#c8922a' }}>
                      View page →
                    </a>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Product Image</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-3 w-fit">
                  {(['upload', 'url'] as const).map(tab => (
                    <button key={tab} onClick={() => setImgTab(tab)}
                      className="px-4 py-1.5 text-xs font-semibold capitalize transition"
                      style={{ background: imgTab === tab ? '#1e4a2a' : '#fff', color: imgTab === tab ? '#fff' : '#555' }}>
                      {tab === 'upload' ? '📁 Upload from PC' : '🔗 Image URL'}
                    </button>
                  ))}
                </div>
                {imgTab === 'upload' ? (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Slot 1 is the <strong>main image</strong>. Slots 2–5 are carousel images shown on the product page.</p>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const imgUrl = form.images[i] || '';
                        const isMain = i === 0;
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div
                              onClick={() => carouselRefs.current[i]?.click()}
                              className="w-full aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition"
                              style={{ borderColor: imgUrl ? '#1e4a2a' : '#e5e7eb', background: imgUrl ? '#f0faf2' : '#fafafa' }}
                            >
                              {imgUrl ? (
                                <img src={imgUrl} className="w-full h-full object-cover rounded-xl" alt={`Image ${i + 1}`} />
                              ) : (
                                <div className="flex flex-col items-center gap-1 p-1">
                                  <Upload size={18} className="text-gray-300" />
                                  <p className="text-xs text-gray-400 text-center leading-tight">Upload</p>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 w-full justify-between px-0.5">
                              <span className="text-xs font-semibold" style={{ color: isMain ? '#1e4a2a' : '#888' }}>
                                {isMain ? 'Main' : `#${i + 1}`}
                              </span>
                              {imgUrl && (
                                <button onClick={() => removeCarouselImage(i)} className="text-red-400 hover:text-red-600">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                            <input
                              ref={el => { carouselRefs.current[i] = el; }}
                              type="file" accept="image/*" className="hidden"
                              onChange={e => handleCarouselUpload(e, i)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                      placeholder="/Shoot Product only/image.png" />
                    {form.image && (
                      <img src={form.image} className="mt-2 h-16 rounded-lg object-contain border border-gray-100"
                        onError={e => (e.currentTarget.style.display = 'none')} alt="preview" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={10} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none font-mono"
                  placeholder="Product description...&#10;Use blank lines between sections.&#10;Use • or - for bullet points.&#10;Example:&#10;Health Benefits&#10;• Rich in Iron&#10;• Boosts Immunity&#10;&#10;How to Use&#10;Use as a substitute for sugar in tea, coffee..." />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Variations (Size / Price / Stock)</label>
                  <button onClick={addVariation} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#1e4a2a' }}>
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.variations.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={v.name} onChange={e => updateVariation(i, 'name', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700"
                        placeholder="250G" />
                      <input type="number" value={v.price} onChange={e => updateVariation(i, 'price', Number(e.target.value))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700"
                        placeholder="Price" />
                      <input type="number" value={v.stock} onChange={e => updateVariation(i, 'stock', Number(e.target.value))}
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700"
                        placeholder="Stock" />
                      {form.variations.length > 1 && (
                        <button onClick={() => removeVariation(i)}><X size={14} className="text-red-400" /></button>
                      )}
                    </div>
                  ))}
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
                {editId ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Import Modal ── */}
      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto"
          onClick={e => e.target === e.currentTarget && setImportOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">Bulk Import Products</p>
              <button onClick={() => setImportOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-gray-500">
                Upload a <strong>CSV</strong> or <strong>JSON</strong> file. CSV columns:
                <code className="block bg-gray-50 p-2 rounded-lg mt-1 text-xs">name,description,category,sku,image,images,variations</code>
              </p>
              <p className="text-xs text-gray-500">
                <strong>variations</strong> column should be a JSON array like:
                <code className="block bg-gray-50 p-2 rounded-lg mt-1 text-[10px] break-all">[{`{"name":"250G","price":230,"stock":80}`}]</code>
              </p>
              <button onClick={downloadTemplate}
                className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#1e4a2a' }}>
                <Download size={14} /> Download CSV Template
              </button>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Select File</label>
                <input type="file" accept=".csv,.json" onChange={e => setImportFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
              </div>
              {importResult && (
                <div className={`rounded-xl p-3 text-xs ${importResult.errors.length ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
                  <p className="font-semibold">Imported {importResult.imported} of {importResult.total} products.</p>
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
                style={{ background: '#1e4a2a' }}
                onMouseEnter={e => !importFile && (e.currentTarget.style.background = '#2a6b3e')}
                onMouseLeave={e => !importFile && (e.currentTarget.style.background = '#1e4a2a')}>
                Import Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
