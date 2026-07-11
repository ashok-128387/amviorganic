'use client';

import CartDrawer from '@/components/cart-drawer';
import { useStore } from '@/lib/store';
import { AdminProduct } from '@/lib/admin-store';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { isProductOutOfStock, getVariationStock } from '@/lib/inventory';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
  }, []);

  const wishlistItems = products.filter((p) =>
    wishlist.some((w) => w.productId === p.id)
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const variation = product.variations.find(v => (v.stock ?? 0) > 0) || product.variations[0];
      if (!variation || (variation.stock ?? 0) <= 0) {
        alert('This product is currently out of stock.');
        return;
      }
      addToCart({
        id: Math.random().toString(),
        productId,
        variationId: variation.id,
        quantity: 1,
        addedAt: new Date(),
      });
      alert('Added to cart!');
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4 text-6xl">❤️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add items to your wishlist to save them for later. You can always come back
                to purchase when you&apos;re ready.
              </p>
              <Link
                href="/"
                className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-lg font-semibold text-gray-900">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your
                  wishlist
                </p>
              </div>

              {/* Wishlist Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => {
                  const minPrice = Math.min(...product.variations.map((v) => v.price));
                  const maxPrice = Math.max(...product.variations.map((v) => v.price));

                  return (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                        <div className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded ${isProductOutOfStock(product) ? 'bg-red-600' : 'bg-green-700'}`}>
                          {isProductOutOfStock(product) ? 'Out of Stock' : 'In Stock'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(product.rating)
                                    ? '⭐'
                                    : '☆'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Name */}
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-green-700 transition mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <p className="text-lg font-bold text-gray-900 mb-4">
                          ₹{minPrice.toLocaleString('en-IN')} – ₹
                          {maxPrice.toLocaleString('en-IN')}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={isProductOutOfStock(product)}
                            className="flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: isProductOutOfStock(product) ? '#9ca3af' : '#16a34a', color: '#fff' }}
                          >
                            <ShoppingCart size={18} />
                            {isProductOutOfStock(product) ? 'Out of Stock' : 'Add'}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
