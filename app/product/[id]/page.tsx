'use client';

import CartDrawer from '@/components/cart-drawer';
import { AdminProduct, useAdminStore } from '@/lib/admin-store';
import { useStore } from '@/lib/store';
import { Heart, Share2, Copy, MessageCircle, ShoppingCart, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products }) => {
      if (products) setProduct(products.find((p: any) => p.id === id) ?? null);
      setLoading(false);
    });
  }, [id]);

  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500);

  useEffect(() => {
    fetch('/api/reviews-get').then(r => r.json()).then(({ reviews }) => {
      if (reviews) setProductReviews(reviews.filter((r: any) => r.productId === id && r.approved));
    });
    fetch('/api/products-get').then(r => r.json()).then(({ products }) => {
      if (products) setAllProducts(products);
    });
    fetch('/api/settings-get').then(r => r.json()).then(({ settings }) => {
      if (settings?.freeShippingThreshold) setFreeShippingThreshold(Number(settings.freeShippingThreshold));
    });
  }, [id]);
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist, setCartOpen } = useStore();
  const { adminLoggedIn } = useAdminStore();
  const router = useRouter();
  const [editingDesc, setEditingDesc] = useState(false);
  const [editDescValue, setEditDescValue] = useState('');

  const [adminEditOpen, setAdminEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  const handleSaveDesc = async () => {
    if (!product) return;
    await fetch('/api/product-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        description: editDescValue,
        createdAt: product.createdAt?.toISOString?.() || product.createdAt,
      }),
    });
    setProduct({ ...product, description: editDescValue });
    setEditingDesc(false);
  };

  const openAdminEdit = () => {
    if (!product) return;
    setEditForm({
      name: product.name,
      category: product.category,
      image: product.image,
      variations: product.variations.map((v: any) => ({ ...v })),
    });
    setAdminEditOpen(true);
  };

  const handleAdminSave = async () => {
    if (!product || !editForm) return;
    const updated = {
      ...product,
      name: editForm.name,
      category: editForm.category,
      image: editForm.image,
      variations: editForm.variations,
      createdAt: product.createdAt?.toISOString?.() || product.createdAt,
    };
    await fetch('/api/product-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setProduct(updated);
    setAdminEditOpen(false);
  };

  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [addedMsg, setAddedMsg] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-2xl font-bold text-gray-800 mb-2">Product not found</p>
        <Link href="/products" className="text-sm font-semibold" style={{ color: '#1e4a2a' }}>← Back to Products</Link>
      </div>
    </div>
  );

  if (!selectedVariation && product.variations.length > 0) {
    setSelectedVariation(product.variations[0]);
  }

  const variation = selectedVariation ?? product.variations[0];
  const inWishlist = isInWishlist(product.id);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  const handleAddToCart = () => {
    if (!variation) return;
    addToCart({ id: Math.random().toString(), productId: product.id, variationId: variation.id, quantity, addedAt: new Date() });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!variation) return;
    addToCart({ id: Math.random().toString(), productId: product.id, variationId: variation.id, quantity, addedAt: new Date() });
    router.push('/checkout');
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out ${product.name} from AMVI Organics`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    else if (platform === 'copy') { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <>
      <CartDrawer />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-green-700 transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-700 transition">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
          {adminLoggedIn && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#1e4a2a' }}>Admin View</span>
                <div className="flex gap-2">
                  <button onClick={openAdminEdit}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition"
                    style={{ background: '#c8922a' }}>
                    <Pencil size={12} /> Quick Edit
                  </button>
                  <Link href="/admin/products"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition"
                    style={{ background: '#6366f1' }}
                    target="_blank">
                    <Pencil size={12} /> Full Editor
                  </Link>
                </div>
              </div>

              {/* Admin Quick Edit Panel */}
              {adminEditOpen && editForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">Quick Edit Product</p>
                    <button onClick={() => setAdminEditOpen(false)} className="text-xs text-gray-500 hover:text-gray-700">✕ Close</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                      <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                        <option>Sweeteners</option>
                        <option>Combo Deals</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Main Image URL</label>
                    <input value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Variations (Price / Stock)</label>
                    <div className="space-y-2">
                      {editForm.variations.map((v: any, i: number) => (
                        <div key={v.id} className="flex gap-2 items-center">
                          <input value={v.name} onChange={e => {
                            const vars = [...editForm.variations];
                            vars[i] = { ...vars[i], name: e.target.value };
                            setEditForm({ ...editForm, variations: vars });
                          }}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700" placeholder="Name" />
                          <input type="number" value={v.price} onChange={e => {
                            const vars = [...editForm.variations];
                            vars[i] = { ...vars[i], price: Number(e.target.value) };
                            setEditForm({ ...editForm, variations: vars });
                          }}
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700" placeholder="Price" />
                          <input type="number" value={v.stock} onChange={e => {
                            const vars = [...editForm.variations];
                            vars[i] = { ...vars[i], stock: Number(e.target.value) };
                            setEditForm({ ...editForm, variations: vars });
                          }}
                            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700" placeholder="Stock" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleAdminSave}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: '#1e4a2a' }}>Save Changes</button>
                    <button onClick={() => setAdminEditOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Images */}
            <div className="md:max-w-md">
              <div
                className="relative rounded-2xl overflow-hidden mb-3 cursor-zoom-in"
                style={{ background: '#f5f2ed', aspectRatio: '1/1', maxHeight: '460px' }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
              >
                {images[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={zoomed ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🌿</div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold shadow transition"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#1e4a2a' }}>‹</button>
                    <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold shadow transition"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#1e4a2a' }}>›</button>
                  </>
                )}
                {images[activeImg] && (
                  <span className="absolute bottom-2 right-3 text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>🔍 Hover to zoom</span>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="w-20 h-20 rounded-xl overflow-hidden transition"
                      style={{ border: i === activeImg ? '2.5px solid #1e4a2a' : '2px solid #e5e5e5' }}>
                      {src ? (
                        <img src={src} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl">🌿</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">

              {/* Title */}
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
                  style={{ background: '#1e4a2a18', color: '#1e4a2a' }}>{product.category}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              </div>

              {/* Rating + reviews inline */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-base">{i < Math.floor(product.rating) ? '⭐' : '☆'}</span>
                  ))}
                </div>
                <span className="text-xs font-semibold" style={{ color: '#1e4a2a' }}>{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-3 px-4 rounded-xl" style={{ background: '#f5f2ed' }}>
                <p className="text-3xl font-extrabold" style={{ color: '#1e4a2a' }}>₹{variation.price.toLocaleString('en-IN')}</p>
                <span className="text-xs text-gray-500">incl. all taxes</span>
              </div>

              {/* Short description */}
              <p className="text-sm text-gray-600 leading-relaxed">{product.description.split('\n\n')[0]}</p>

              {/* SKU + Category inline */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>SKU: <strong className="text-gray-700">AMVI-{product.id}</strong></span>
                <span className="w-px h-3 bg-gray-200" />
                <span>Category: <strong className="text-gray-700">{product.category}</strong></span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f0ece6' }} />

              {/* Variations */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Choose Weight / Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariation(v)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition"
                      style={{
                        background: variation.id === v.id ? '#1e4a2a' : '#fff',
                        color: variation.id === v.id ? '#fff' : '#333',
                        border: `1.5px solid ${variation.id === v.id ? '#1e4a2a' : '#ddd'}`,
                      }}>
                      {v.name}
                      <span className="ml-1.5 text-xs opacity-80">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to Cart row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-lg font-bold hover:bg-gray-50 transition" style={{ color: '#1e4a2a' }}>−</button>
                  <span className="px-4 py-2.5 font-semibold text-gray-900 border-x border-gray-200 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="px-3.5 py-2.5 text-lg font-bold hover:bg-gray-50 transition" style={{ color: '#1e4a2a' }}>+</button>
                </div>
                <button onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ background: addedMsg ? '#2a6b3e' : '#fff', color: addedMsg ? '#fff' : '#1e4a2a', border: '1.5px solid #1e4a2a' }}>
                  <ShoppingCart size={16} />
                  {addedMsg ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>

              {/* Buy Now full width */}
              <button onClick={handleBuyNow}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition"
                style={{ background: '#1e4a2a' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                Buy it Now →
              </button>

              {/* Trust badges row */}
              <div className="grid grid-cols-3 gap-2">
                {[['🌿', '100% Organic'], ['🚚', `Free over ₹${freeShippingThreshold}`], ['✅', 'FSSAI Certified']].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-center"
                    style={{ background: '#f5f2ed' }}>
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs text-gray-600 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-gray-400 font-semibold mr-1">Share:</span>
                <button onClick={() => handleShare('whatsapp')} title="WhatsApp"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#25d366' }}><MessageCircle size={14} /></button>
                <button onClick={() => handleShare('facebook')} title="Facebook"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#1877f2' }}><Share2 size={14} /></button>
                <button onClick={() => handleShare('twitter')} title="Twitter/X"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#000' }}><Share2 size={14} /></button>
                <button onClick={() => handleShare('copy')} title="Copy link"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#888' }}><Copy size={14} /></button>
                <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-80 ml-auto"
                  style={{ background: '#f5f2ed' }} title="Wishlist">
                  <Heart size={14} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                {copied && <span className="text-xs text-green-700 font-semibold">Copied!</span>}
              </div>

            </div>
          </div>

          {/* Tabs */}
          <div className="mt-14 mb-6">
            <TabsComponent product={product} productReviews={productReviews} adminLoggedIn={adminLoggedIn} editingDesc={editingDesc} setEditingDesc={setEditingDesc} editDescValue={editDescValue} setEditDescValue={setEditDescValue} handleSaveDesc={handleSaveDesc} />
          </div>
        </div>
      </main>

      {/* You May Also Like */}
      <section className="py-14" style={{ background: '#f5f2ed' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1e4a2a' }}>You May Also Like</h2>
            <p className="text-sm mt-2" style={{ color: '#888' }}>Handpicked products just for you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.filter(p => p.id !== product.id).slice(0, 4).map((p) => {
              const price = Math.min(...p.variations.map(v => v.price));
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden flex flex-col"
                  style={{ border: '1px solid #ede8e0', boxShadow: '0 2px 12px rgba(30,74,42,0.07)' }}>
                  <Link href={`/product/${p.id}`} className="block">
                    <div className="aspect-square overflow-hidden" style={{ background: '#f5f2ed' }}>
                      <img src={p.image} alt={p.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  </Link>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <Link href={`/product/${p.id}`}>
                      <h3 className="font-semibold text-sm sm:text-base leading-snug hover:text-green-700 transition"
                        style={{ color: '#1e4a2a' }}>{p.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-2">{p.description.split('\n')[0]}</p>
                    <p className="font-bold text-base" style={{ color: '#1e4a2a' }}>₹{price.toLocaleString('en-IN')}</p>
                    <div className="flex gap-2 mt-auto pt-1">
                      <AddToCartBtn product={p} />
                      <Link href={`/product/${p.id}`}
                        className="flex-1 text-center py-2 rounded-lg text-xs font-semibold border transition"
                        style={{ borderColor: '#1e4a2a', color: '#1e4a2a' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1e4a2a'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1e4a2a'; }}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function AddToCartBtn({ product }: { product: any }) {
  const { addToCart, setCartOpen } = useStore();
  const [added, setAdded] = useState(false);
  const handleClick = () => {
    const v = product.variations[0];
    if (!v) return;
    addToCart({ id: Math.random().toString(), productId: product.id, variationId: v.id, quantity: 1, addedAt: new Date() });
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };
  return (
    <button onClick={handleClick}
      className="flex-1 py-2 rounded-lg text-xs font-semibold transition"
      style={{ background: added ? '#2a6b3e' : '#1e4a2a', color: '#fff' }}>
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  );
}

// ── Structured Description Renderer ─────────────────────────────────────────
const BENEFIT_ICONS: Record<string, string> = {
  'iron': '🩸', 'mineral': '💎', 'immunity': '🛡️', 'immun': '🛡️',
  'digest': '✅', 'liver': '🫀', 'dissolv': '💧', 'spice': '🌶️',
  'antioxid': '🌿', 'energy': '⚡', 'natural': '🍃', 'detox': '🧹',
};

function getBulletIcon(text: string) {
  const lower = text.toLowerCase();
  for (const [key, icon] of Object.entries(BENEFIT_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '✦';
}

function parseDescription(raw: string) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const sections: { heading: string; bullets: string[]; text: string[] }[] = [];
  let current: { heading: string; bullets: string[]; text: string[] } | null = null;

  for (const line of lines) {
    const isBullet = line.startsWith('•') || line.startsWith('-');
    const isHeading = !isBullet && line.length < 60 && !line.includes(':') && line === line.trim() &&
      (line.endsWith('?') || /^(Health|How|Product|Why|What|Key|Benefits|Usage|Info|Compliance)/i.test(line));

    if (isHeading) {
      current = { heading: line, bullets: [], text: [] };
      sections.push(current);
    } else if (isBullet) {
      if (!current) { current = { heading: '', bullets: [], text: [] }; sections.push(current); }
      current.bullets.push(line.replace(/^[•\-]\s*/, ''));
    } else {
      if (!current) { current = { heading: '', bullets: [], text: [] }; sections.push(current); }
      current.text.push(line);
    }
  }
  return sections;
}

function AccordionSection({ sec, defaultOpen = false }: { sec: { heading: string; bullets: string[]; text: string[] }; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const isInfoSection = (h: string) =>
    /product information|compliance|ingredient|shelf life|fssai|certificate/i.test(h);

  const parseKV = (lines: string[]) =>
    lines.map(l => {
      const idx = l.indexOf(':');
      if (idx > 0) return { k: l.slice(0, idx).trim(), v: l.slice(idx + 1).trim() };
      return null;
    }).filter(Boolean) as { k: string; v: string }[];

  const isInfo = isInfoSection(sec.heading);
  const kvPairs = isInfo ? parseKV(sec.text) : [];
  const plainText = isInfo ? [] : sec.text;

  const icon =
    /health/i.test(sec.heading) ? '💚' :
    /how to use/i.test(sec.heading) ? '📖' :
    /why choose/i.test(sec.heading) ? '⭐' :
    /what.s included/i.test(sec.heading) ? '📦' :
    /product information|compliance/i.test(sec.heading) ? '📋' : '🔹';

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e8e3db' }}>
      {/* Accordion header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200"
        style={{ background: open ? '#1e4a2a' : '#faf8f5' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: open ? '#e8b84b' : '#1e4a2a' }}>
            {sec.heading}
          </span>
        </div>
        <span className="text-lg font-light flex-shrink-0 ml-4 transition-transform duration-300"
          style={{ color: open ? '#e8b84b' : '#1e4a2a', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>
          +
        </span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="px-5 py-4" style={{ background: '#fff' }}>
          {plainText.length > 0 && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{plainText.join(' ')}</p>
          )}

          {sec.bullets.length > 0 && (
            <div className={`grid gap-2 ${/health benefit/i.test(sec.heading) ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
              {sec.bullets.map((b, bi) => (
                <div key={bi} className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5"
                  style={{ background: /health/i.test(sec.heading) ? '#f0faf2' : '#f5f2ed' }}>
                  <span className="text-base flex-shrink-0 mt-0.5">
                    {/health/i.test(sec.heading) ? getBulletIcon(b) : '✦'}
                  </span>
                  <span className="text-sm text-gray-700 leading-snug">
                    {b.split(/\*\*(.*?)\*\*/).map((part, pi) =>
                      pi % 2 === 1
                        ? <strong key={pi} className="font-semibold text-gray-900">{part}</strong>
                        : part
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {kvPairs.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              {kvPairs.map(({ k, v }, ki) => (
                <div key={ki} className={`flex gap-4 px-4 py-2.5 text-sm ${ki % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="font-semibold text-gray-500 w-48 flex-shrink-0 text-xs">{k}</span>
                  <span className="text-gray-800 text-xs">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductDescription({ description }: { description: string }) {
  const sections = parseDescription(description);

  return (
    <div className="max-w-3xl space-y-2">
      {sections.map((sec, i) => {
        // Intro paragraph (no heading) — shown plainly, not in accordion
        if (!sec.heading) {
          return (
            <p key={i} className="text-gray-600 leading-relaxed text-[15px] mb-4">
              {sec.text.join(' ')}
            </p>
          );
        }
        return <AccordionSection key={i} sec={sec} defaultOpen={i === 0} />;
      })}
    </div>
  );
}

function TabsComponent({ product, productReviews, adminLoggedIn, editingDesc, setEditingDesc, editDescValue, setEditDescValue, handleSaveDesc }: { product: any; productReviews: any[]; adminLoggedIn: boolean; editingDesc: boolean; setEditingDesc: (v: boolean) => void; editDescValue: string; setEditDescValue: (v: string) => void; handleSaveDesc: () => void }) {
  const [activeTab, setActiveTab] = useState('description');
  const { isLoggedIn } = useStore();

  return (
    <>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {[['description', 'Description'], ['reviews', `Reviews (${productReviews.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="py-3 text-sm font-semibold border-b-2 transition"
              style={{ borderColor: activeTab === key ? '#1e4a2a' : 'transparent', color: activeTab === key ? '#1e4a2a' : '#888' }}>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'description' && (
        <div>
          {adminLoggedIn && !editingDesc && (
            <div className="flex justify-end mb-3">
              <button onClick={() => { setEditDescValue(product.description); setEditingDesc(true); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition"
                style={{ background: '#1e4a2a' }}>
                <Pencil size={12} /> Edit Description
              </button>
            </div>
          )}
          {adminLoggedIn && editingDesc ? (
            <div className="space-y-3">
              <textarea value={editDescValue} onChange={e => setEditDescValue(e.target.value)}
                rows={12} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none font-mono"
                placeholder="Product description... use blank lines for sections, • for bullets" />
              <div className="flex gap-2">
                <button onClick={handleSaveDesc}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#1e4a2a' }}>Save Changes</button>
                <button onClick={() => setEditingDesc(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">Cancel</button>
              </div>
            </div>
          ) : (
            <ProductDescription description={product.description} />
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="max-w-3xl">
          {!isLoggedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <p className="text-blue-900 text-sm">
                <Link href="/login" className="font-bold hover:underline">Login</Link> to write a review.
              </p>
            </div>
          )}
          {productReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-5">
              {productReviews.map(r => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '⭐' : '☆'}</span>)}
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{r.title}</p>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
