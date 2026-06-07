'use client';

import { Product } from '@/lib/mock-data';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const minPrice = Math.min(...product.variations.map((v) => v.price));
  const maxPrice = Math.max(...product.variations.map((v) => v.price));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden group">
          {product.image ? (
            <img src={product.image} alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${product.images.length > 1 ? 'group-hover:opacity-0' : ''}`} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🌿</div>
          )}
          {product.images[1] && (
            <img src={product.images[1]} alt={`${product.name} back`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}

          {/* Badge */}
          <div className="absolute top-2 left-2 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
            In Stock
          </div>

          {/* Wishlist */}
          <button onClick={(e) => { e.preventDefault(); inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id); }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition">
            <Heart size={16} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11}
                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-green-700 transition text-sm sm:text-base line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-sm sm:text-base font-bold text-gray-900 mt-1.5">
          {minPrice === maxPrice
            ? `₹${minPrice.toLocaleString('en-IN')}`
            : `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`}
        </p>

        {/* Button */}
        <Link href={`/product/${product.id}`} className="mt-auto pt-3">
          <button className="w-full bg-green-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition">
            View & Add
          </button>
        </Link>
      </div>
    </div>
  );
}
