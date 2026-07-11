'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import CartDrawer from '@/components/cart-drawer';
import ProductsSidebar, { FilterState, SortOption } from '@/components/products-sidebar';

const ALL_CATEGORIES = ['Sweeteners', 'Combo Deals'];
const PRICE_MAX = 1000;

export default function SweetenersPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({ categories: ['Sweeteners'], maxPrice: PRICE_MAX, sort: 'default' });

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setAllProducts(p); });
  }, []);

  const products = useMemo(() => {
    let list = allProducts.filter((p) => filters.categories.includes(p.category));
    list = list.filter((p: any) => Math.min(...p.variations.map((v: any) => v.price)) <= filters.maxPrice);
    if (filters.sort === 'price-asc') list = [...list].sort((a: any, b: any) => Math.min(...a.variations.map((v: any) => v.price)) - Math.min(...b.variations.map((v: any) => v.price)));
    if (filters.sort === 'price-desc') list = [...list].sort((a: any, b: any) => Math.min(...b.variations.map((v: any) => v.price)) - Math.min(...a.variations.map((v: any) => v.price)));
    if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'popular') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [filters, allProducts]);

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
              <span className="text-gray-900 font-medium">Sweeteners</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Sweeteners</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Pure organic jaggery in every form — cubes, powder, liquid, and masala.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
          {/* Mobile: filter bar full width above grid */}
          <div className="lg:hidden">
            <ProductsSidebar
              allCategories={ALL_CATEGORIES}
              activeCategories={filters.categories}
              maxPrice={filters.maxPrice}
              sort={filters.sort}
              productCount={products.length}
              onChange={setFilters}
            />
          </div>

          <div className="flex gap-8 items-start">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <ProductsSidebar
                allCategories={ALL_CATEGORIES}
                activeCategories={filters.categories}
                maxPrice={filters.maxPrice}
                sort={filters.sort}
                productCount={products.length}
                onChange={setFilters}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="hidden lg:block text-sm text-gray-500 mb-6">{products.length} products</p>

              {products.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg font-semibold mb-1">No products found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product) => (
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
