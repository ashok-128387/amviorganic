'use client';

import { useStore } from '@/lib/store';
import { AdminProduct } from '@/lib/admin-store';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getVariationStock, isVariationOutOfStock } from '@/lib/inventory';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, updateCartQuantity } = useStore();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
    fetch('/api/settings-get').then(r => r.json()).then(({ settings: s }) => {
      if (s?.freeShippingThreshold) setFreeShippingThreshold(Number(s.freeShippingThreshold));
    });
  }, []);

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    const variation = product?.variations.find((v) => v.id === item.variationId);
    return total + (variation?.price || 0) * item.quantity;
  }, 0);

  if (!cartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      <div className="fixed right-0 top-0 h-screen w-full max-w-sm z-50 flex flex-col" style={{ background: '#faf9f6', boxShadow: '-4px 0 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#1e4a2a' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} color="#e8b84b" />
            <h2 className="text-lg font-bold" style={{ color: '#e8b84b' }}>Your Cart</h2>
            {cart.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#c8922a', color: '#fff' }}>
                {cart.length}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg transition" style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        {cart.length > 0 && (
          <div className="px-5 py-2.5 text-xs font-medium text-center" style={{ background: '#f0faf2', color: '#1e4a2a', borderBottom: '1px solid #d4edda' }}>
            {cartTotal >= freeShippingThreshold
              ? '🎉 You qualify for FREE shipping!'
              : `Add ₹${(freeShippingThreshold - cartTotal).toLocaleString('en-IN')} more for FREE shipping`}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={52} style={{ color: '#c8e6c9' }} />
              <p className="font-semibold" style={{ color: '#1e4a2a' }}>Your cart is empty</p>
              <Link href="/" onClick={() => setCartOpen(false)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition"
                style={{ background: '#1e4a2a', color: '#fff' }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const variation = product?.variations.find((v) => v.id === item.variationId);
                if (!product || !variation) return null;
                const stock = getVariationStock(product, variation.id);
                const outOfStock = isVariationOutOfStock(product, variation.id);

                return (
                  <div key={item.id} className={`flex gap-3 p-3 rounded-xl ${outOfStock ? 'opacity-70' : ''}`} style={{ background: '#fff', border: outOfStock ? '1px solid #fecaca' : '1px solid #ede8e0', boxShadow: '0 1px 6px rgba(30,74,42,0.05)' }}>
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" style={{ border: '1.5px solid #ede8e0' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: '#1e4a2a' }}>{product.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-0.5" style={{ background: '#f0faf2', color: '#1e4a2a' }}>
                        {variation.name}
                      </span>
                      {outOfStock && <span className="ml-2 text-xs font-bold text-red-600">Out of Stock</span>}
                      <p className="font-bold text-sm mt-1" style={{ color: '#c8922a' }}>₹{(variation.price * item.quantity).toLocaleString('en-IN')}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1.5px solid #d4e8d8' }}>
                          <button onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-1 text-sm font-bold transition" style={{ color: '#1e4a2a' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0faf2')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-bold" style={{ color: '#1e4a2a' }}>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, Math.min(stock, item.quantity + 1))}
                            disabled={outOfStock || item.quantity >= stock}
                            className="px-2.5 py-1 text-sm font-bold transition disabled:opacity-50" style={{ color: '#1e4a2a' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0faf2')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg transition" style={{ color: '#c8922a' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fff5e6')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-4 pb-5 pt-3 space-y-3" style={{ borderTop: '1px solid #ede8e0' }}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: '#555' }}>Subtotal</span>
              <span className="text-lg font-extrabold" style={{ color: '#1e4a2a' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)}
              className="block w-full text-center py-3 rounded-xl font-bold text-sm transition"
              style={{ background: '#1e4a2a', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
              Checkout · ₹{cartTotal.toLocaleString('en-IN')}
            </Link>
            <button onClick={() => setCartOpen(false)}
              className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition"
              style={{ background: 'transparent', color: '#1e4a2a', border: '1.5px solid #d4e8d8' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0faf2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
