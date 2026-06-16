'use client';

import CartDrawer from '@/components/cart-drawer';
import { AdminProduct, useAdminStore } from '@/lib/admin-store';
import { useStore } from '@/lib/store';
import { Heart, Copy, ShoppingCart, Pencil, Star, CheckCircle } from 'lucide-react';
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
    loadReviews();
    fetch('/api/products-get').then(r => r.json()).then(({ products }) => {
      if (products) setAllProducts(products);
    });
    fetch('/api/settings-get').then(r => r.json()).then(({ settings }) => {
      if (settings?.freeShippingThreshold) setFreeShippingThreshold(Number(settings.freeShippingThreshold));
    });
  }, [id]);

  const loadReviews = () =>
    fetch('/api/reviews-get').then(r => r.json()).then(({ reviews }) => {
      if (reviews) setProductReviews(reviews.filter((r: any) => r.productId === id && r.approved));
    });

  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist, setCartOpen, user, isLoggedIn } = useStore();
  const { adminLoggedIn } = useAdminStore();

  // Check verified purchase status
  const [canReview, setCanReview] = useState(false);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;
    fetch(`/api/orders-get?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(({ orders: userOrders }) => {
        if (!userOrders) return;
        const purchased = userOrders.some((o: any) =>
          ['pending','processing','shipped','delivered','completed'].includes(o.status) &&
          o.items?.some((item: any) => item.productId === id)
        );
        setCanReview(purchased);
        // Use billing name from most recent matching order
        const matchingOrder = userOrders.find((o: any) =>
          ['pending','processing','shipped','delivered','completed'].includes(o.status) &&
          o.items?.some((item: any) => item.productId === id)
        );
        if (matchingOrder?.customerName) setReviewerName(matchingOrder.customerName);
        else if (user?.name) setReviewerName(user.name);
      });
  }, [isLoggedIn, user, id]);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user?.email || !canReview) return;
    setReviewSubmitting(true);
    setReviewMessage('');
    const res = await fetch('/api/review-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: id,
        productName: product?.name || '',
        email: user.email,
        name: reviewerName,
        rating,
        title: reviewTitle,
        comment: reviewComment,
      }),
    });
    const data = await res.json();
    setReviewSubmitting(false);
    if (data.success) {
      setReviewTitle('');
      setReviewComment('');
      setRating(5);
      setReviewMessage('Thank you! Your review has been submitted.');
      loadReviews();
    } else {
      setReviewMessage(data.error || 'Failed to submit review. Please try again.');
    }
  };
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

  const [allCategories, setAllCategories] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/categories-get').then(r => r.json()).then(({ categories: c }) => {
      if (c) setAllCategories(c.map((cat: any) => cat.name));
    });
  }, []);

  const openAdminEdit = () => {
    if (!product) return;
    setEditForm({
      name: product.name,
      category: product.category,
      sku: product.sku || '',
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
      sku: editForm.sku,
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
                        {allCategories.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
                    <input value={editForm.sku} onChange={e => setEditForm({ ...editForm, sku: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                      placeholder="AMVI-001" />
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
                <span>SKU: <strong className="text-gray-700">{product.sku || `AMVI-${product.id}`}</strong></span>
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
                {/* WhatsApp */}
                <button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#25d366' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                </button>
                {/* Facebook */}
                <button onClick={() => handleShare('facebook')} title="Share on Facebook"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#1877f2' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                {/* X (Twitter) */}
                <button onClick={() => handleShare('twitter')} title="Share on X"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                  style={{ background: '#000' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                {/* Copy link */}
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
            <TabsComponent
            product={product}
            productReviews={productReviews}
            adminLoggedIn={adminLoggedIn}
            editingDesc={editingDesc}
            setEditingDesc={setEditingDesc}
            editDescValue={editDescValue}
            setEditDescValue={setEditDescValue}
            handleSaveDesc={handleSaveDesc}
            isLoggedIn={isLoggedIn}
            user={user}
            canReview={canReview}
            reviewerName={reviewerName}
            rating={rating}
            setRating={setRating}
            reviewTitle={reviewTitle}
            setReviewTitle={setReviewTitle}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            reviewSubmitting={reviewSubmitting}
            reviewMessage={reviewMessage}
            handleReviewSubmit={handleReviewSubmit}
          />
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

function TabsComponent({
  product, productReviews, adminLoggedIn, editingDesc, setEditingDesc, editDescValue, setEditDescValue, handleSaveDesc,
  isLoggedIn, user, canReview, reviewerName, rating, setRating, reviewTitle, setReviewTitle, reviewComment, setReviewComment, reviewSubmitting, reviewMessage, handleReviewSubmit
}: {
  product: any; productReviews: any[]; adminLoggedIn: boolean; editingDesc: boolean; setEditingDesc: (v: boolean) => void; editDescValue: string; setEditDescValue: (v: string) => void; handleSaveDesc: () => void;
  isLoggedIn: boolean; user: any; canReview: boolean; reviewerName: string;
  rating: number; setRating: (v: number) => void;
  reviewTitle: string; setReviewTitle: (v: string) => void;
  reviewComment: string; setReviewComment: (v: string) => void;
  reviewSubmitting: boolean; reviewMessage: string; handleReviewSubmit: (e: React.FormEvent) => void;
}) {
  const [activeTab, setActiveTab] = useState('description');

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
          {isLoggedIn && !canReview && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <p className="text-amber-900 text-sm">Only verified purchasers who have bought this product can leave a review.</p>
            </div>
          )}
          {isLoggedIn && canReview && (
            <form onSubmit={handleReviewSubmit} className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
              <p className="font-bold text-gray-900 text-sm mb-3">Write a Review</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-600">Your Rating:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star size={18} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Review Title</label>
                <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Summarize your experience" />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Review</label>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} required rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 resize-none"
                  placeholder="Share your honest feedback..." />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-green-700">
                  <CheckCircle size={14} /> Verified Purchaser
                </div>
                <button type="submit" disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{ background: '#1e4a2a' }}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
              {reviewMessage && (
                <p className={`mt-3 text-xs ${reviewMessage.includes('Thank you') ? 'text-green-700' : 'text-red-600'}`}>{reviewMessage}</p>
              )}
            </form>
          )}
          {productReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-5">
              {productReviews.map(r => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '⭐' : '☆'}</span>)}
                    </div>
                    {r.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle size={11} /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{r.title}</p>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">By {r.customerName} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
