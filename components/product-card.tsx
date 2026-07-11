'use client';

import { Product } from '@/lib/mock-data';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { isProductOutOfStock, isVariationOutOfStock } from '@/lib/inventory';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, addToCart, setCartOpen } = useStore();
  const inWishlist = isInWishlist(product.id);
  const minPrice = Math.min(...product.variations.map((v) => v.price));
  const maxPrice = Math.max(...product.variations.map((v) => v.price));
  const [added, setAdded] = useState(false);
  const outOfStock = isProductOutOfStock(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    const variation = product.variations.find(v => (v.stock ?? 0) > 0) || product.variations[0];
    if (!variation) return;
    addToCart({ id: Math.random().toString(), productId: product.id, variationId: variation.id, quantity: 1, addedAt: new Date() });
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Clickable Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden group">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${product.images.length > 1 ? 'group-hover:opacity-0' : ''}`} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🌿</div>
          )}
          {product.images[1] && (
            <img src={product.images[1]} alt={`${product.name} back`} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded ${outOfStock ? 'bg-red-600' : 'bg-green-700'}`}>
            {outOfStock ? 'Out of Stock' : 'In Stock'}
          </div>
          <button onClick={(e) => { e.preventDefault(); inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id); }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition">
            <Heart size={16} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11}
                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Clickable Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-green-700 transition text-sm sm:text-base line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm sm:text-base font-bold text-gray-900 mt-1.5">
          {minPrice === maxPrice
            ? `₹${minPrice.toLocaleString('en-IN')}`
            : `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`}
        </p>

        {/* Add to Cart button */}
        <button onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-auto pt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: outOfStock ? '#9ca3af' : added ? '#2a6b3e' : '#1e4a2a', color: '#fff' }}>
          <ShoppingCart size={15} />
          {outOfStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
