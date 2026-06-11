'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import CartDrawer from '@/components/cart-drawer';
import ProductsSidebar, { FilterState } from '@/components/products-sidebar';

const PRICE_MAX = 1000;

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>(['Sweeteners', 'Combo Deals', 'New']);
  const [filters, setFilters] = useState<FilterState | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => {
      if (p) {
        setAllProducts(p);
        const cats = Array.from(new Set(['Sweeteners', 'Combo Deals', 'New', ...p.map((pr: any) => pr.category as string)]));
        setAllCategories(cats);
        setFilters({ categories: cat ? [cat] : cats, maxPrice: PRICE_MAX, sort: 'default' });
      }
    });
  }, []);

  const filtered = useMemo(() => {
    if (!filters) return [];
    let list = allProducts.filter((p) => filters.categories.includes(p.category));
    list = list.filter((p) => Math.min(...p.variations.map((v) => v.price)) <= filters.maxPrice);
    if (filters.sort === 'price-asc') list = [...list].sort((a, b) => Math.min(...a.variations.map(v => v.price)) - Math.min(...b.variations.map(v => v.price)));
    if (filters.sort === 'price-desc') list = [...list].sort((a, b) => Math.min(...b.variations.map(v => v.price)) - Math.min(...a.variations.map(v => v.price)));
    if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'popular') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [filters, allProducts]);

  const activeCat = filters?.categories.length === 1 ? filters.categories[0] : null;

  return (
    <>
      <CartDrawer />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 sm:mb-4">
              <a href="/" className="hover:text-green-700 transition">Home</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">All Products</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{activeCat ?? 'All Products'}</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              {activeCat ? `Browse all ${activeCat} products` : 'Browse our complete range of certified organic jaggery — sweeteners and combo deals.'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
          {/* Mobile filter bar */}
          <div className="lg:hidden">
            <ProductsSidebar
              allCategories={allCategories}
              activeCategories={filters?.categories ?? allCategories}
              maxPrice={filters?.maxPrice ?? PRICE_MAX}
              sort={filters?.sort ?? 'default'}
              productCount={filtered.length}
              onChange={setFilters}
            />
          </div>

          <div className="flex gap-8 items-start">
            <div className="hidden lg:block">
              <ProductsSidebar
                allCategories={allCategories}
                activeCategories={filters?.categories ?? allCategories}
                maxPrice={filters?.maxPrice ?? PRICE_MAX}
                sort={filters?.sort ?? 'default'}
                productCount={filtered.length}
                onChange={setFilters}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="hidden lg:block text-sm text-gray-500 mb-6">{filtered.length} products</p>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg font-semibold mb-1">No products found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
