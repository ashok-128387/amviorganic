'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

export interface FilterState {
  categories: string[];
  maxPrice: number;
  sort: SortOption;
}

interface Props {
  allCategories: string[];
  activeCategories: string[];
  maxPrice: number;
  sort: SortOption;
  productCount: number;
  onChange: (filters: FilterState) => void;
}

const PRICE_MAX = 1000;

const sortLabels: Record<SortOption, string> = {
  default: 'Default',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
  popular: 'Most Popular',
};

export default function ProductsSidebar({
  allCategories, activeCategories, maxPrice, sort, productCount, onChange,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    const next = activeCategories.includes(cat)
      ? activeCategories.filter((c) => c !== cat)
      : [...activeCategories, cat];
    onChange({ categories: next, maxPrice, sort });
  };

  const sidebar = (
    <div className="w-full">
      {/* Categories */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c8922a' }}>Categories</p>
        <ul className="space-y-1">
          {allCategories.map((cat) => {
            const active = activeCategories.includes(cat);
            return (
              <li key={cat}>
                <button onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
                  style={{ background: active ? 'rgba(30,74,42,0.08)' : 'transparent', color: active ? '#1e4a2a' : '#555', fontWeight: active ? 700 : 400 }}>
                  <span className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                    style={{ borderColor: active ? '#1e4a2a' : '#ccc', background: active ? '#1e4a2a' : '#fff' }}>
                    {active && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-5" style={{ height: 1, background: '#f0ece6' }} />

      {/* Price Range */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c8922a' }}>Max Price</p>
        <input type="range" min={100} max={PRICE_MAX} step={50} value={maxPrice}
          onChange={(e) => onChange({ categories: activeCategories, maxPrice: Number(e.target.value), sort })}
          className="w-full accent-green-700 cursor-pointer" />
        <div className="flex justify-between text-xs mt-1" style={{ color: '#888' }}>
          <span>₹100</span>
          <span className="font-semibold" style={{ color: '#1e4a2a' }}>Up to ₹{maxPrice}</span>
          <span>₹{PRICE_MAX}</span>
        </div>
      </div>

      <div className="mb-5" style={{ height: 1, background: '#f0ece6' }} />

      {/* Sort */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c8922a' }}>Sort By</p>
        <ul className="space-y-1">
          {(Object.keys(sortLabels) as SortOption[]).map((key) => (
            <li key={key}>
              <button onClick={() => onChange({ categories: activeCategories, maxPrice, sort: key })}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
                style={{ background: sort === key ? 'rgba(30,74,42,0.08)' : 'transparent', color: sort === key ? '#1e4a2a' : '#555', fontWeight: sort === key ? 700 : 400 }}>
                <span className="w-3.5 h-3.5 rounded-full border flex-shrink-0"
                  style={{ borderColor: sort === key ? '#1e4a2a' : '#ccc', background: sort === key ? '#1e4a2a' : '#fff', boxShadow: sort === key ? 'inset 0 0 0 2px #fff' : 'none' }} />
                {sortLabels[key]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      <button onClick={() => onChange({ categories: allCategories, maxPrice: PRICE_MAX, sort: 'default' })}
        className="w-full py-2 rounded-lg text-sm font-semibold transition"
        style={{ background: '#f5f2ed', color: '#1e4a2a' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e2d8')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f2ed')}>
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile filter bar — sits ABOVE the grid, full width */}
      <div className="lg:hidden w-full flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{productCount} product{productCount !== 1 ? 's' : ''}</p>
        <button onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: '#1e4a2a', color: '#fff' }}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-base" style={{ color: '#1e4a2a' }}>Filters</p>
              <button onClick={() => setMobileOpen(false)}><X size={20} style={{ color: '#1e4a2a' }} /></button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-base mb-5" style={{ color: '#1e4a2a' }}>Filters</p>
          {sidebar}
        </div>
      </aside>
    </>
  );
}
